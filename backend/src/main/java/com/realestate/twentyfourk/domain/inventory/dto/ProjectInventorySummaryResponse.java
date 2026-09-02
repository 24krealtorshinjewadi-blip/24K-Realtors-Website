package com.realestate.twentyfourk.domain.inventory.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProjectInventorySummaryResponse(
        UUID societyId,
        String projectName,
        String developer,
        String location,
        String bhkTypes,
        String priceRange,
        long totalUnits,
        long availableUnits,
        long onHoldUnits,
        long bookedUnits,
        long soldUnits,
        long blockedUnits,
        BigDecimal startingPrice,
        String imageUrl
) {}
