package com.realestate.twentyfourk.domain.inventory.dto;

import com.realestate.twentyfourk.domain.inventory.UnitStatus;
import com.realestate.twentyfourk.domain.property.FurnishingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record InventoryUnitRequest(
        @NotBlank(message = "Unit number is required")
        String unitNumber,

        String tower,

        Integer floorNumber,

        @NotBlank(message = "BHK type is required")
        String bhkType,

        @NotNull(message = "Carpet area is required")
        @Positive(message = "Carpet area must be positive")
        Double carpetAreaSqft,

        Double superBuiltUpSqft,

        @NotNull(message = "Base price is required")
        @Positive(message = "Base price must be positive")
        BigDecimal basePrice,

        @NotNull(message = "Total price is required")
        @Positive(message = "Total price must be positive")
        BigDecimal totalPrice,

        String facing,

        FurnishingStatus furnishingStatus,

        UnitStatus status,

        UUID societyId,

        UUID propertyId,

        UUID assignedAgentId,

        UUID customerId,

        String notes
) {}
