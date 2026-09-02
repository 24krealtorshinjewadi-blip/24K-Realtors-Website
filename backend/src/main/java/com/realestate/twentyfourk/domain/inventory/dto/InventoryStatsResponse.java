package com.realestate.twentyfourk.domain.inventory.dto;

import java.math.BigDecimal;
import java.util.Map;

public record InventoryStatsResponse(
        long totalUnits,
        long availableUnits,
        long onHoldUnits,
        long bookedUnits,
        long soldUnits,
        long blockedUnits,
        BigDecimal totalInventoryValue,
        BigDecimal availableInventoryValue,
        BigDecimal bookedInventoryValue,
        BigDecimal soldInventoryValue,
        Map<String, Long> unitsByBhk,
        Map<String, Long> unitsByStatus
) {}
