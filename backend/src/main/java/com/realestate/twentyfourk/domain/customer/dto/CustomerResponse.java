package com.realestate.twentyfourk.domain.customer.dto;

import com.realestate.twentyfourk.domain.customer.CustomerType;
import com.realestate.twentyfourk.domain.customer.KycStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String name,
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
        UUID convertedFromLeadId,
        String assignedAgentName,
        String assignedAgentPhone,
        String notes,
        int activeBookingsCount,
        LocalDateTime createdDate,
        List<CustomerBookingSummary> bookings
) {
    public record CustomerBookingSummary(
            UUID bookingId,
            String propertyTitle,
            String propertyLocation,
            BigDecimal totalPrice,
            String status,
            boolean paymentReceived,
            LocalDateTime createdDate
    ) {}
}
