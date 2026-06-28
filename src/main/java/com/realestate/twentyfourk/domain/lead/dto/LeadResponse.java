package com.realestate.twentyfourk.domain.lead.dto;

import com.realestate.twentyfourk.domain.lead.LeadRequirementType;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record LeadResponse(
        UUID id,
        String name,
        String phone,
        String email,
        LeadRequirementType requirementType,
        BigDecimal budgetMin,
        BigDecimal budgetMax,
        PrimeCorridor preferredLocation,
        LeadStatus status,
        String notes,
        String assignedAgentName,
        String assignedAgentPhone,
        LocalDateTime createdDate
) {}
