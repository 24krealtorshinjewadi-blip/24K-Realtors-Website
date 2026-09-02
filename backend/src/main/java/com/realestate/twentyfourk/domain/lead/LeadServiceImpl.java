package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import com.realestate.twentyfourk.domain.agent.service.LeadRoutingService;
import com.realestate.twentyfourk.domain.lead.dto.LeadRequest;
import com.realestate.twentyfourk.domain.lead.dto.LeadResponse;
import com.realestate.twentyfourk.domain.lead.event.LeadCreatedEvent;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.realestate.twentyfourk.domain.audit.AuditLogService;
import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final LeadRoutingService leadRoutingService;
    private final AuditLogService auditLogService;
    private final AgentRepository agentRepository;
    private final LeadActivityRepository activityRepository;
    private final com.realestate.twentyfourk.domain.property.PropertyRepository propertyRepository;

    @Override
    @Transactional
    public LeadResponse createLead(LeadRequest request) {
        Lead lead = mapToEntity(request);
        // Default new leads to NEW status if not explicitly provided
        if (lead.getStatus() == null) {
            lead.setStatus(LeadStatus.NEW);
        }
        
        // Calculate lead hotness score
        lead.setLeadScore(calculateLeadScore(lead));
        
        // Auto-assign Agent round-robin
        Agent assignedAgent = leadRoutingService.getNextAgentForAssignment();
        lead.setAssignedAgent(assignedAgent);

        Lead savedLead = leadRepository.save(lead);
        
        // Audit Log
        auditLogService.logAction(
                "CREATE",
                "Lead",
                savedLead.getId(),
                null,
                getLeadSummary(savedLead)
        );

        // Auto timeline activity
        LeadActivity initialActivity = LeadActivity.builder()
                .lead(savedLead)
                .activityType("SYSTEM")
                .subject("Lead Created")
                .details(String.format("New lead registered for %s with hotness score %d.",
                        savedLead.getPreferredLocation() != null ? savedLead.getPreferredLocation().name() : "Pune West",
                        savedLead.getLeadScore()))
                .build();
        activityRepository.save(initialActivity);

        // Publish LeadCreatedEvent for async WhatsApp Webhook triggering
        eventPublisher.publishEvent(new LeadCreatedEvent(savedLead));
        
        return mapToResponse(savedLead);
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponse getLeadById(UUID id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        return mapToResponse(lead);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeadResponse> getAllLeads(LeadStatus status, PrimeCorridor preferredLocation, Pageable pageable) {
        Specification<Lead> spec = LeadSpecification.filterLeads(status, preferredLocation);
        Page<Lead> leadsPage = leadRepository.findAll(spec, pageable);
        return leadsPage.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeadResponse> getMyLeads(String agentEmail, LeadStatus status, Pageable pageable) {
        if (status != null) {
            return leadRepository.findByAssignedAgent_EmailAndStatus(agentEmail, status, pageable)
                    .map(this::mapToResponse);
        }
        return leadRepository.findByAssignedAgent_Email(agentEmail, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public LeadResponse updateLeadStatus(UUID id, LeadStatus status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        
        String oldSummary = getLeadSummary(lead);
        LeadStatus oldStatus = lead.getStatus();

        lead.setStatus(status);
        lead.setLeadScore(calculateLeadScore(lead));
        Lead updatedLead = leadRepository.save(lead);

        // Audit Log
        auditLogService.logAction(
                "UPDATE_STATUS",
                "Lead",
                updatedLead.getId(),
                oldSummary,
                getLeadSummary(updatedLead)
        );

        // Auto timeline activity
        LeadActivity statusActivity = LeadActivity.builder()
                .lead(updatedLead)
                .activityType("STATUS_CHANGE")
                .subject("Status Changed to " + status)
                .details(String.format("Status transitioned from %s to %s. Hotness score updated to %d.",
                        oldStatus, status, updatedLead.getLeadScore()))
                .build();
        activityRepository.save(statusActivity);

        return mapToResponse(updatedLead);
    }

    @Override
    @Transactional
    public LeadResponse updateLead(UUID id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));

        String oldSummary = getLeadSummary(lead);

        if (request.name() != null && !request.name().isBlank()) {
            lead.setName(request.name().trim());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            lead.setPhone(request.phone().trim());
        }
        if (request.email() != null && !request.email().isBlank()) {
            lead.setEmail(request.email().trim());
        }
        if (request.requirementType() != null) {
            lead.setRequirementType(request.requirementType());
        }
        if (request.budgetMin() != null) {
            lead.setBudgetMin(request.budgetMin());
        }
        if (request.budgetMax() != null) {
            lead.setBudgetMax(request.budgetMax());
        }
        if (request.preferredLocation() != null) {
            lead.setPreferredLocation(request.preferredLocation());
        }
        if (request.status() != null) {
            lead.setStatus(request.status());
        }
        if (request.notes() != null) {
            lead.setNotes(request.notes());
        }
        if (request.propertyId() != null) {
            com.realestate.twentyfourk.domain.property.Property property =
                    propertyRepository.findById(request.propertyId()).orElse(null);
            lead.setProperty(property);
        }

        lead.setLeadScore(calculateLeadScore(lead));
        Lead updatedLead = leadRepository.save(lead);

        // Audit Log
        auditLogService.logAction(
                "UPDATE",
                "Lead",
                updatedLead.getId(),
                oldSummary,
                getLeadSummary(updatedLead)
        );

        // Auto timeline activity
        LeadActivity activity = LeadActivity.builder()
                .lead(updatedLead)
                .activityType("NOTE")
                .subject("Lead Details Updated")
                .details(String.format("Lead profile updated. Status: %s, Score: %d.",
                        updatedLead.getStatus(), updatedLead.getLeadScore()))
                .build();
        activityRepository.save(activity);

        return mapToResponse(updatedLead);
    }

    @Override
    @Transactional
    public void deleteLead(UUID id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        
        String oldSummary = getLeadSummary(lead);
        leadRepository.delete(lead);

        // Audit Log
        auditLogService.logAction(
                "DELETE",
                "Lead",
                id,
                oldSummary,
                null
        );
    }

    private String getLeadSummary(Lead l) {
        if (l == null) return null;
        return String.format("Name: %s, Phone: %s, Location: %s, Status: %s, Score: %d, Active: %b",
                l.getName(), l.getPhone(), l.getPreferredLocation(), l.getStatus(), l.getLeadScore(), l.isActiveFlag());
    }

    private int calculateLeadScore(Lead lead) {
        int score = 40; // Base score

        // Location match score
        if (lead.getPreferredLocation() != null) {
            PrimeCorridor loc = lead.getPreferredLocation();
            if (loc == PrimeCorridor.HINJEWADI || loc == PrimeCorridor.BANER || loc == PrimeCorridor.WAKAD) {
                score += 15;
            } else {
                score += 5;
            }
        }

        // Budget match score
        if (lead.getBudgetMax() != null) {
            BigDecimal max = lead.getBudgetMax();
            if (max.compareTo(new BigDecimal("15000000")) >= 0) {
                score += 20;
            } else if (max.compareTo(new BigDecimal("8000000")) >= 0) {
                score += 10;
            }
        }

        // Requirement type score
        if (lead.getRequirementType() != null) {
            if (lead.getRequirementType().name().equals("BUY")) {
                score += 10;
            } else {
                score += 5;
            }
        }

        // Notes high-intent check
        if (lead.getNotes() != null && !lead.getNotes().isBlank()) {
            String notes = lead.getNotes().toLowerCase();
            if (notes.contains("immediate") || notes.contains("urgent") || notes.contains("visit") || notes.contains("soon")) {
                score += 15;
            } else {
                score += 5;
            }
        }

        return Math.min(score, 100);
    }

    // Mapping Helpers
    private Lead mapToEntity(LeadRequest request) {
        com.realestate.twentyfourk.domain.property.Property property = null;
        if (request.propertyId() != null) {
            property = propertyRepository.findById(request.propertyId()).orElse(null);
        }

        String phone = request.phone() != null ? request.phone().trim() : "";
        String cleanDigits = phone.replaceAll("\\D", "");
        String email = request.email();
        if (email == null || email.isBlank()) {
            email = (cleanDigits.isEmpty() ? "visitor" : cleanDigits) + "@24krealtors.com";
        }
        LeadRequirementType reqType = request.requirementType() != null ? request.requirementType() : LeadRequirementType.BUY;

        return Lead.builder()
                .name(request.name())
                .phone(phone)
                .email(email)
                .requirementType(reqType)
                .budgetMin(request.budgetMin())
                .budgetMax(request.budgetMax())
                .preferredLocation(request.preferredLocation())
                .status(request.status())
                .notes(request.notes())
                .property(property)
                .build();
    }

    @Override
    @Transactional
    public LeadResponse assignAgent(UUID id, UUID agentId) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentId));

        String oldAgentName = lead.getAssignedAgent() != null ? lead.getAssignedAgent().getName() : "Unassigned";
        lead.setAssignedAgent(agent);
        Lead savedLead = leadRepository.save(lead);

        auditLogService.logAction(
                "ASSIGN_AGENT",
                "Lead",
                savedLead.getId(),
                oldAgentName,
                agent.getName()
        );

        // Auto timeline activity
        LeadActivity assignActivity = LeadActivity.builder()
                .lead(savedLead)
                .activityType("ASSIGNMENT")
                .subject("Assigned to " + agent.getName())
                .details(String.format("Lead reassigned from %s to %s.", oldAgentName, agent.getName()))
                .build();
        activityRepository.save(assignActivity);

        return mapToResponse(savedLead);
    }

    private LeadResponse mapToResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getName(),
                lead.getPhone(),
                lead.getEmail(),
                lead.getRequirementType(),
                lead.getBudgetMin(),
                lead.getBudgetMax(),
                lead.getPreferredLocation(),
                lead.getStatus(),
                lead.getNotes(),
                lead.getAssignedAgent() != null ? lead.getAssignedAgent().getName() : "Unassigned",
                lead.getAssignedAgent() != null ? lead.getAssignedAgent().getPhone() : null,
                lead.getLeadScore(),
                lead.getCreatedDate(),
                lead.getProperty() != null ? lead.getProperty().getId() : null,
                lead.getProperty() != null ? lead.getProperty().getTitle() : null
        );
    }
}
