package com.realestate.twentyfourk.domain.inventory;

import com.realestate.twentyfourk.domain.inventory.dto.InventoryStatsResponse;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitRequest;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitResponse;
import com.realestate.twentyfourk.domain.inventory.dto.ProjectInventorySummaryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryUnitController {

    private final InventoryUnitService unitService;

    @PostMapping("/units")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<InventoryUnitResponse> createUnit(@Valid @RequestBody InventoryUnitRequest request) {
        InventoryUnitResponse created = unitService.createUnit(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/units/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<InventoryUnitResponse> getUnitById(@PathVariable UUID id) {
        return ResponseEntity.ok(unitService.getUnitById(id));
    }

    @GetMapping("/units")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Page<InventoryUnitResponse>> getAllUnits(
            @RequestParam(required = false) UUID societyId,
            @RequestParam(required = false) String tower,
            @RequestParam(required = false) String bhkType,
            @RequestParam(required = false) UnitStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "unitNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(unitService.getAllUnits(
                societyId, tower, bhkType, status, minPrice, maxPrice, query, pageRequest
        ));
    }

    @PutMapping("/units/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<InventoryUnitResponse> updateUnit(
            @PathVariable UUID id,
            @Valid @RequestBody InventoryUnitRequest request
    ) {
        return ResponseEntity.ok(unitService.updateUnit(id, request));
    }

    @PatchMapping("/units/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER')")
    public ResponseEntity<InventoryUnitResponse> updateUnitStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
        UnitStatus status = UnitStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(unitService.updateUnitStatus(id, status));
    }

    @DeleteMapping("/units/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN')")
    public ResponseEntity<Void> deleteUnit(@PathVariable UUID id) {
        unitService.deleteUnit(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<InventoryStatsResponse> getInventoryStats() {
        return ResponseEntity.ok(unitService.getInventoryStats());
    }

    @GetMapping("/projects")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<ProjectInventorySummaryResponse>> getProjectInventorySummaries() {
        return ResponseEntity.ok(unitService.getProjectInventorySummaries());
    }
}
