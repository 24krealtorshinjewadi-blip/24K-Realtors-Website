package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.agent.Agent;
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

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final LeadRoutingService leadRoutingService;

    @Override
    @Transactional
    public LeadResponse createLead(LeadRequest request) {
        Lead lead = mapToEntity(request);
        // Default new leads to NEW status if not explicitly provided
        if (lead.getStatus() == null) {
            lead.setStatus(LeadStatus.NEW);
        }
        
        // Auto-assign Agent round-robin
        Agent assignedAgent = leadRoutingService.getNextAgentForAssignment();
        lead.setAssignedAgent(assignedAgent);

        Lead savedLead = leadRepository.save(lead);
        
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
        
        lead.setStatus(status);
        Lead updatedLead = leadRepository.save(lead);
        return mapToResponse(updatedLead);
    }

    @Override
    @Transactional
    public void deleteLead(UUID id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead not found with ID: " + id);
        }
        leadRepository.deleteById(id);
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
                lead.getCreatedDate()
        );
    }
}
