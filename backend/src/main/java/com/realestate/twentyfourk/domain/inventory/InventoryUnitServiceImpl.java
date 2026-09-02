package com.realestate.twentyfourk.domain.inventory;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import com.realestate.twentyfourk.domain.customer.Customer;
import com.realestate.twentyfourk.domain.customer.CustomerRepository;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryStatsResponse;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitRequest;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitResponse;
import com.realestate.twentyfourk.domain.inventory.dto.ProjectInventorySummaryResponse;
import com.realestate.twentyfourk.domain.property.Property;
import com.realestate.twentyfourk.domain.property.PropertyRepository;
import com.realestate.twentyfourk.domain.society.Society;
import com.realestate.twentyfourk.domain.society.SocietyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryUnitServiceImpl implements InventoryUnitService {

    private final InventoryUnitRepository unitRepository;
    private final SocietyRepository societyRepository;
    private final PropertyRepository propertyRepository;
    private final AgentRepository agentRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public InventoryUnitResponse createUnit(InventoryUnitRequest request) {
        log.info("Creating inventory unit: {}", request.unitNumber());

        Society society = null;
        if (request.societyId() != null) {
            society = societyRepository.findById(request.societyId()).orElse(null);
        }

        Property property = null;
        if (request.propertyId() != null) {
            property = propertyRepository.findById(request.propertyId()).orElse(null);
        }

        Agent agent = null;
        if (request.assignedAgentId() != null) {
            agent = agentRepository.findById(request.assignedAgentId()).orElse(null);
        }

        Customer customer = null;
        if (request.customerId() != null) {
            customer = customerRepository.findById(request.customerId()).orElse(null);
        }

        InventoryUnit unit = InventoryUnit.builder()
                .unitNumber(request.unitNumber())
                .tower(request.tower())
                .floorNumber(request.floorNumber())
                .bhkType(request.bhkType())
                .carpetAreaSqft(request.carpetAreaSqft())
                .superBuiltUpSqft(request.superBuiltUpSqft())
                .basePrice(request.basePrice())
                .totalPrice(request.totalPrice())
                .facing(request.facing())
                .furnishingStatus(request.furnishingStatus())
                .status(request.status() != null ? request.status() : UnitStatus.AVAILABLE)
                .society(society)
                .property(property)
                .assignedAgent(agent)
                .customer(customer)
                .notes(request.notes())
                .build();

        InventoryUnit saved = unitRepository.save(unit);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryUnitResponse getUnitById(UUID id) {
        InventoryUnit unit = unitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory unit not found with ID: " + id));
        return mapToResponse(unit);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryUnitResponse> getAllUnits(
            UUID societyId,
            String tower,
            String bhkType,
            UnitStatus status,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String query,
            Pageable pageable
    ) {
        Specification<InventoryUnit> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (societyId != null) {
                predicates.add(cb.equal(root.get("society").get("id"), societyId));
            }

            if (tower != null && !tower.isBlank()) {
                predicates.add(cb.equal(root.get("tower"), tower));
            }

            if (bhkType != null && !bhkType.isBlank()) {
                predicates.add(cb.equal(root.get("bhkType"), bhkType));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("totalPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("totalPrice"), maxPrice));
            }

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase().trim() + "%";
                Predicate unitMatch = cb.like(cb.lower(root.get("unitNumber")), pattern);
                Predicate towerMatch = cb.like(cb.lower(root.get("tower")), pattern);
                Predicate notesMatch = cb.like(cb.lower(root.get("notes")), pattern);
                predicates.add(cb.or(unitMatch, towerMatch, notesMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return unitRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public InventoryUnitResponse updateUnit(UUID id, InventoryUnitRequest request) {
        InventoryUnit unit = unitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory unit not found with ID: " + id));

        unit.setUnitNumber(request.unitNumber());
        unit.setTower(request.tower());
        unit.setFloorNumber(request.floorNumber());
        unit.setBhkType(request.bhkType());
        unit.setCarpetAreaSqft(request.carpetAreaSqft());
        unit.setSuperBuiltUpSqft(request.superBuiltUpSqft());
        unit.setBasePrice(request.basePrice());
        unit.setTotalPrice(request.totalPrice());
        unit.setFacing(request.facing());
        if (request.furnishingStatus() != null) {
            unit.setFurnishingStatus(request.furnishingStatus());
        }
        if (request.status() != null) {
            unit.setStatus(request.status());
        }
        if (request.societyId() != null) {
            unit.setSociety(societyRepository.findById(request.societyId()).orElse(null));
        }
        if (request.propertyId() != null) {
            unit.setProperty(propertyRepository.findById(request.propertyId()).orElse(null));
        }
        if (request.assignedAgentId() != null) {
            unit.setAssignedAgent(agentRepository.findById(request.assignedAgentId()).orElse(null));
        }
        if (request.customerId() != null) {
            unit.setCustomer(customerRepository.findById(request.customerId()).orElse(null));
        }
        unit.setNotes(request.notes());

        InventoryUnit updated = unitRepository.save(unit);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public InventoryUnitResponse updateUnitStatus(UUID id, UnitStatus status) {
        InventoryUnit unit = unitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory unit not found with ID: " + id));
        unit.setStatus(status);
        InventoryUnit updated = unitRepository.save(unit);
        log.info("Unit {} status changed to {}", unit.getUnitNumber(), status);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteUnit(UUID id) {
        InventoryUnit unit = unitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory unit not found with ID: " + id));
        unitRepository.delete(unit);
        log.info("Soft-deleted unit with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryStatsResponse getInventoryStats() {
        long totalUnits = unitRepository.count();
        long available = unitRepository.countByStatus(UnitStatus.AVAILABLE);
        long onHold = unitRepository.countByStatus(UnitStatus.ON_HOLD);
        long booked = unitRepository.countByStatus(UnitStatus.BOOKED);
        long sold = unitRepository.countByStatus(UnitStatus.SOLD);
        long blocked = unitRepository.countByStatus(UnitStatus.BLOCKED);

        BigDecimal totalVal = unitRepository.sumTotalInventoryValue();
        BigDecimal availVal = unitRepository.sumValueByStatus(UnitStatus.AVAILABLE);
        BigDecimal bookedVal = unitRepository.sumValueByStatus(UnitStatus.BOOKED);
        BigDecimal soldVal = unitRepository.sumValueByStatus(UnitStatus.SOLD);

        Map<String, Long> bhkMap = new LinkedHashMap<>();
        for (String bhk : unitRepository.findDistinctBhkTypes()) {
            bhkMap.put(bhk, unitRepository.countByBhkType(bhk));
        }

        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("AVAILABLE", available);
        statusMap.put("ON_HOLD", onHold);
        statusMap.put("BOOKED", booked);
        statusMap.put("SOLD", sold);
        statusMap.put("BLOCKED", blocked);

        return new InventoryStatsResponse(
                totalUnits,
                available,
                onHold,
                booked,
                sold,
                blocked,
                totalVal != null ? totalVal : BigDecimal.ZERO,
                availVal != null ? availVal : BigDecimal.ZERO,
                bookedVal != null ? bookedVal : BigDecimal.ZERO,
                soldVal != null ? soldVal : BigDecimal.ZERO,
                bhkMap,
                statusMap
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectInventorySummaryResponse> getProjectInventorySummaries() {
        List<Society> societies = societyRepository.findAll();
        List<ProjectInventorySummaryResponse> summaries = new ArrayList<>();

        for (Society s : societies) {
            List<InventoryUnit> units = unitRepository.findBySocietyId(s.getId());
            if (units.isEmpty()) continue;

            long total = units.size();
            long available = units.stream().filter(u -> u.getStatus() == UnitStatus.AVAILABLE).count();
            long onHold = units.stream().filter(u -> u.getStatus() == UnitStatus.ON_HOLD).count();
            long booked = units.stream().filter(u -> u.getStatus() == UnitStatus.BOOKED).count();
            long sold = units.stream().filter(u -> u.getStatus() == UnitStatus.SOLD).count();
            long blocked = units.stream().filter(u -> u.getStatus() == UnitStatus.BLOCKED).count();

            BigDecimal minP = units.stream().map(InventoryUnit::getTotalPrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            BigDecimal maxP = units.stream().map(InventoryUnit::getTotalPrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);

            String bhks = units.stream().map(InventoryUnit::getBhkType).distinct().sorted().collect(Collectors.joining(", "));
            String priceRange = "₹" + formatCrores(minP) + " - ₹" + formatCrores(maxP);

            summaries.add(new ProjectInventorySummaryResponse(
                    s.getId(),
                    s.getName(),
                    s.getDeveloper(),
                    s.getLocation() != null ? s.getLocation().name() : "PUNE",
                    bhks,
                    priceRange,
                    total,
                    available,
                    onHold,
                    booked,
                    sold,
                    blocked,
                    minP,
                    s.getMasterPlanUrl()
            ));
        }

        return summaries;
    }

    private String formatCrores(BigDecimal val) {
        if (val == null) return "0";
        BigDecimal cr = val.divide(BigDecimal.valueOf(10000000), 2, java.math.RoundingMode.HALF_UP);
        if (cr.compareTo(BigDecimal.ONE) >= 0) {
            return cr + " Cr";
        }
        BigDecimal lk = val.divide(BigDecimal.valueOf(100000), 1, java.math.RoundingMode.HALF_UP);
        return lk + " L";
    }

    private InventoryUnitResponse mapToResponse(InventoryUnit unit) {
        return new InventoryUnitResponse(
                unit.getId(),
                unit.getUnitNumber(),
                unit.getTower(),
                unit.getFloorNumber(),
                unit.getBhkType(),
                unit.getCarpetAreaSqft(),
                unit.getSuperBuiltUpSqft(),
                unit.getBasePrice(),
                unit.getTotalPrice(),
                unit.getFacing(),
                unit.getFurnishingStatus(),
                unit.getStatus(),
                unit.getSociety() != null ? unit.getSociety().getId() : null,
                unit.getSociety() != null ? unit.getSociety().getName() : null,
                unit.getSociety() != null ? unit.getSociety().getName() : null,
                unit.getSociety() != null && unit.getSociety().getLocation() != null ? unit.getSociety().getLocation().name() : null,
                unit.getProperty() != null ? unit.getProperty().getId() : null,
                unit.getProperty() != null ? unit.getProperty().getTitle() : null,
                unit.getAssignedAgent() != null ? unit.getAssignedAgent().getId() : null,
                unit.getAssignedAgent() != null ? unit.getAssignedAgent().getName() : null,
                unit.getCustomer() != null ? unit.getCustomer().getId() : null,
                unit.getCustomer() != null ? unit.getCustomer().getName() : null,
                unit.getNotes(),
                unit.getCreatedDate(),
                unit.getUpdatedDate()
        );
    }
}
