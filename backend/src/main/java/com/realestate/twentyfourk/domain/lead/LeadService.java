package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.lead.dto.LeadRequest;
import com.realestate.twentyfourk.domain.lead.dto.LeadResponse;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LeadService {
    LeadResponse createLead(LeadRequest request);
    LeadResponse getLeadById(UUID id);
    Page<LeadResponse> getAllLeads(LeadStatus status, PrimeCorridor preferredLocation, Pageable pageable);
    // Privacy: returns only leads assigned to a specific agent (for RM role)
    Page<LeadResponse> getMyLeads(String agentEmail, LeadStatus status, Pageable pageable);
    LeadResponse updateLeadStatus(UUID id, LeadStatus status);
    LeadResponse assignAgent(UUID id, UUID agentId);
    void deleteLead(UUID id);
}
