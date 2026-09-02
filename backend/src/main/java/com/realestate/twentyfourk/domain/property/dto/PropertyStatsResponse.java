package com.realestate.twentyfourk.domain.property.dto;

import java.math.BigDecimal;
import java.util.Map;

public record PropertyStatsResponse(
        long totalProperties,
        long availableProperties,
        long onHoldProperties,
        long bookedProperties,
        long soldProperties,
        BigDecimal totalCatalogValue,
        BigDecimal availableCatalogValue,
        Map<String, Long> propertiesByCorridor,
        Map<String, Long> propertiesByType
) {}
