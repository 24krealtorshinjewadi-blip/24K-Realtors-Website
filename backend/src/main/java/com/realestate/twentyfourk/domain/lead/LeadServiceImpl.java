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
    @Transactional
    public LeadResponse updateLeadStatus(UUID id, LeadStatus status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        
        String oldSummary = getLeadSummary(lead);

        lead.setStatus(status);
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
        return Lead.builder()
                .name(request.name())
                .phone(request.phone())
                .email(request.email())
                .requirementType(request.requirementType())
                .budgetMin(request.budgetMin())
                .budgetMax(request.budgetMax())
                .preferredLocation(request.preferredLocation())
                .status(request.status())
                .notes(request.notes())
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
                lead.getCreatedDate()
        );
    }
}
