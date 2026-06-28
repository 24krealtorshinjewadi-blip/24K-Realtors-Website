package com.realestate.twentyfourk.domain.property.dto;

import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.property.PropertyStatus;
import com.realestate.twentyfourk.domain.property.PropertyType;
import com.realestate.twentyfourk.domain.property.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PropertyResponse(
        UUID id,
        String title,
        String description,
        PropertyType propertyType,
        TransactionType transactionType,
        BigDecimal price,
        Double areaSquareFeet,
        PrimeCorridor location,
        String address,
        Double latitude,
        Double longitude,
        Integer bedrooms,
        Integer bathrooms,
        PropertyStatus status,
        boolean verifiedListing,
        boolean exclusiveDeal,
        boolean noBrokerage,
        String reraNumber,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {}
