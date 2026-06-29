package com.realestate.twentyfourk.domain.property.dto;

import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.property.PropertyStatus;
import com.realestate.twentyfourk.domain.property.PropertyType;
import com.realestate.twentyfourk.domain.property.TransactionType;
import com.realestate.twentyfourk.domain.property.FurnishingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PropertyRequest(
        @NotBlank(message = "Property title is required")
        String title,

        String description,

        @NotNull(message = "Property type is required")
        PropertyType propertyType,

        @NotNull(message = "Transaction type is required")
        TransactionType transactionType,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
        BigDecimal price,

        @NotNull(message = "Area square feet is required")
        @Min(value = 1, message = "Area must be at least 1 square foot")
        Double areaSquareFeet,

        @NotNull(message = "Location corridor is required")
        PrimeCorridor location,

        @NotBlank(message = "Address is required")
        String address,

        Double latitude,
        Double longitude,

        @NotNull(message = "Bedrooms count is required")
        @Min(value = 0, message = "Bedrooms count cannot be negative")
        Integer bedrooms,

        @NotNull(message = "Bathrooms count is required")
        @Min(value = 0, message = "Bathrooms count cannot be negative")
        Integer bathrooms,

        @NotNull(message = "Property status is required")
        PropertyStatus status,

        boolean verifiedListing,
        boolean exclusiveDeal,
        boolean noBrokerage,
        String reraNumber,
        String imageUrl,
        String videoUrl,
        String threeDTourUrl,
        FurnishingStatus furnishingStatus,
        boolean gasPipeline
) {}
