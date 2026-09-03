package com.realestate.twentyfourk.domain.inventory;

import com.realestate.twentyfourk.domain.inventory.dto.PublicInventoryUnitDTO;
import com.realestate.twentyfourk.domain.society.Society;
import com.realestate.twentyfourk.domain.society.SocietyRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Public Inventory REST API.
 * NO AUTHENTICATION REQUIRED — serves public website searches.
 * Rule: ONLY returns verified, published, available units.
 */
@RestController
@RequestMapping("/api/public/inventory")
@RequiredArgsConstructor
@Slf4j
public class PublicInventoryController {

    private final InventoryUnitRepository inventoryUnitRepository;
    private final SocietyRepository societyRepository;

    @GetMapping
    public ResponseEntity<Page<PublicInventoryUnitDTO>> searchPublicInventory(
            @RequestParam(required = false) String societySlug,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String hinjewadiPhase,
            @RequestParam(required = false) String bhkType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String builder,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "totalPrice") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Specification<InventoryUnit> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Non-negotiable Source-of-Truth rule: Must be AVAILABLE & PUBLISHED
            predicates.add(cb.equal(root.get("status"), UnitStatus.AVAILABLE));
            predicates.add(cb.equal(root.get("publicationStatus"), PublicationStatus.PUBLISHED));
            predicates.add(cb.isTrue(root.get("published")));
            predicates.add(cb.isFalse(root.get("deletedFlag")));
            predicates.add(cb.isTrue(root.get("activeFlag")));

            // Join with Society for location, phase, and builder filters
            Join<InventoryUnit, Society> societyJoin = root.join("society", JoinType.LEFT);

            if (societySlug != null && !societySlug.isBlank()) {
                predicates.add(cb.equal(societyJoin.get("slug"), societySlug.trim()));
            }

            if (location != null && !location.isBlank()) {
                String locPattern = "%" + location.trim().toUpperCase() + "%";
                predicates.add(cb.like(cb.upper(societyJoin.get("location").as(String.class)), locPattern));
            }

            if (hinjewadiPhase != null && !hinjewadiPhase.isBlank()) {
                String phaseClean = hinjewadiPhase.trim().toUpperCase();
                if (phaseClean.contains("1")) {
                    predicates.add(cb.equal(societyJoin.get("hinjewadiPhase").as(String.class), "PHASE_1"));
                } else if (phaseClean.contains("2")) {
                    predicates.add(cb.equal(societyJoin.get("hinjewadiPhase").as(String.class), "PHASE_2"));
                } else if (phaseClean.contains("3")) {
                    predicates.add(cb.equal(societyJoin.get("hinjewadiPhase").as(String.class), "PHASE_3"));
                }
            }

            if (bhkType != null && !bhkType.isBlank()) {
                String bhkClean = bhkType.trim().toUpperCase();
                predicates.add(cb.like(cb.upper(root.get("bhkType")), "%" + bhkClean + "%"));
            }

            if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("totalPrice"), minPrice));
            }

            if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) > 0) {
                predicates.add(cb.lessThanOrEqualTo(root.get("totalPrice"), maxPrice));
            }

            if (builder != null && !builder.isBlank()) {
                predicates.add(cb.like(cb.lower(societyJoin.get("developer")), "%" + builder.trim().toLowerCase() + "%"));
            }

            if (query != null && !query.isBlank()) {
                String qPattern = "%" + query.trim().toLowerCase() + "%";
                Predicate inUnit = cb.like(cb.lower(root.get("unitNumber")), qPattern);
                Predicate inTower = cb.like(cb.lower(root.get("tower")), qPattern);
                Predicate inSocName = cb.like(cb.lower(societyJoin.get("name")), qPattern);
                Predicate inDev = cb.like(cb.lower(societyJoin.get("developer")), qPattern);
                predicates.add(cb.or(inUnit, inTower, inSocName, inDev));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<PublicInventoryUnitDTO> result = inventoryUnitRepository.findAll(spec, pageRequest)
                .map(this::toDTO);

        log.info("Public inventory query: returned {} matching units", result.getTotalElements());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicInventoryUnitDTO> getPublicUnitById(@PathVariable UUID id) {
        InventoryUnit unit = inventoryUnitRepository.findById(id)
                .filter(u -> !u.isDeletedFlag() && u.isActiveFlag() && u.isPublished())
                .orElseThrow(() -> new IllegalArgumentException("Inventory unit not found or not published: " + id));
        return ResponseEntity.ok(toDTO(unit));
    }

    @GetMapping("/project/{societySlug}")
    public ResponseEntity<List<PublicInventoryUnitDTO>> getProjectInventory(@PathVariable String societySlug) {
        Society society = societyRepository.findBySlug(societySlug)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with slug: " + societySlug));

        List<PublicInventoryUnitDTO> units = inventoryUnitRepository.findBySocietyId(society.getId()).stream()
                .filter(u -> !u.isDeletedFlag() && u.isActiveFlag() && u.isPublished() && u.getStatus() == UnitStatus.AVAILABLE)
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(units);
    }

    private PublicInventoryUnitDTO toDTO(InventoryUnit u) {
        Society s = u.getSociety();
        return PublicInventoryUnitDTO.builder()
                .id(u.getId())
                .unitNumber(u.getUnitNumber())
                .tower(u.getTower())
                .floorNumber(u.getFloorNumber())
                .bhkType(u.getBhkType())
                .carpetAreaSqft(u.getCarpetAreaSqft())
                .superBuiltUpSqft(u.getSuperBuiltUpSqft())
                .basePrice(u.getBasePrice())
                .totalPrice(u.getTotalPrice())
                .pricePerSqft(u.getPricePerSqft())
                .currency(u.getCurrency())
                .parking(u.getParking())
                .facing(u.getFacing())
                .furnishingStatus(u.getFurnishingStatus())
                .status(u.getStatus())
                .publicationStatus(u.getPublicationStatus())
                .societyId(s != null ? s.getId() : null)
                .societyName(s != null ? s.getName() : null)
                .societySlug(s != null ? s.getSlug() : null)
                .location(s != null && s.getLocation() != null ? s.getLocation().name() : null)
                .hinjewadiPhase(s != null && s.getHinjewadiPhase() != null ? s.getHinjewadiPhase().name() : null)
                .builderName(s != null ? s.getDeveloper() : null)
                .reraNumber(s != null ? s.getReraNumber() : null)
                .lastVerifiedAt(u.getLastVerifiedAt())
                .notes(u.getNotes())
                .build();
    }
}
