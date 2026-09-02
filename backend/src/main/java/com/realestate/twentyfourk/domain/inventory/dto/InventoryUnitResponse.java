package com.realestate.twentyfourk.domain.inventory.dto;

import com.realestate.twentyfourk.domain.inventory.UnitStatus;
import com.realestate.twentyfourk.domain.property.FurnishingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record InventoryUnitResponse(
        UUID id,
        String unitNumber,
        String tower,
        Integer floorNumber,
        String bhkType,
        Double carpetAreaSqft,
        Double superBuiltUpSqft,
        BigDecimal basePrice,
        BigDecimal totalPrice,
        String facing,
        FurnishingStatus furnishingStatus,
        UnitStatus status,
        UUID societyId,
        String societyName,
        String projectName,
        String location,
        UUID propertyId,
        String propertyTitle,
        UUID assignedAgentId,
        String assignedAgentName,
        UUID customerId,
        String customerName,
        String notes,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {}
