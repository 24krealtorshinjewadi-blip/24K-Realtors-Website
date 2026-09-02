package com.realestate.twentyfourk.domain.lead.dto;

import com.realestate.twentyfourk.domain.lead.LeadRequirementType;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record LeadRequest(
        @NotBlank(message = "Customer name is required")
        String name,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,20}$", message = "Invalid phone number format")
        String phone,

        String email,

        LeadRequirementType requirementType,

        BigDecimal budgetMin,
        BigDecimal budgetMax,
        PrimeCorridor preferredLocation,
        LeadStatus status, // Optional for admin updates
        String notes,
        java.util.UUID propertyId
) {}
