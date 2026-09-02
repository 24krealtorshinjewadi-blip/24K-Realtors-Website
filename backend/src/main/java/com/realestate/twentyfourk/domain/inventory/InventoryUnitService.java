package com.realestate.twentyfourk.domain.inventory;

import com.realestate.twentyfourk.domain.inventory.dto.InventoryStatsResponse;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitRequest;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitResponse;
import com.realestate.twentyfourk.domain.inventory.dto.ProjectInventorySummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface InventoryUnitService {
    InventoryUnitResponse createUnit(InventoryUnitRequest request);

    InventoryUnitResponse getUnitById(UUID id);

    Page<InventoryUnitResponse> getAllUnits(
            UUID societyId,
            String tower,
            String bhkType,
            UnitStatus status,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String query,
            Pageable pageable
    );

    InventoryUnitResponse updateUnit(UUID id, InventoryUnitRequest request);

    InventoryUnitResponse updateUnitStatus(UUID id, UnitStatus status);

    void deleteUnit(UUID id);

    InventoryStatsResponse getInventoryStats();

    List<ProjectInventorySummaryResponse> getProjectInventorySummaries();
}
