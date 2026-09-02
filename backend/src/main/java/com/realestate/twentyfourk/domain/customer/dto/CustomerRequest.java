package com.realestate.twentyfourk.domain.customer.dto;

import com.realestate.twentyfourk.domain.customer.CustomerType;
import com.realestate.twentyfourk.domain.customer.KycStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.util.UUID;

public record CustomerRequest(
        @NotBlank(message = "Customer name is required")
        String name,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,20}$", message = "Invalid phone number format")
        String phone,

        String email,
        String alternatePhone,
        String panNumber,
        String aadharNumber,
        String city,
        String state,
        String address,
        CustomerType customerType,
        KycStatus kycStatus,
        BigDecimal totalInvestmentAmount,
        UUID assignedAgentId,
        String notes
) {}
