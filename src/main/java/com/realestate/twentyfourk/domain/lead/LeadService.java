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
    LeadResponse updateLeadStatus(UUID id, LeadStatus status);
    void deleteLead(UUID id);
}
