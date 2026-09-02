package com.realestate.twentyfourk.domain.inventory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryUnitRepository extends JpaRepository<InventoryUnit, UUID>, JpaSpecificationExecutor<InventoryUnit> {

    Optional<InventoryUnit> findByUnitNumber(String unitNumber);

    long countByStatus(UnitStatus status);

    long countByBhkType(String bhkType);

    long countBySocietyId(UUID societyId);

    long countBySocietyIdAndStatus(UUID societyId, UnitStatus status);

    List<InventoryUnit> findBySocietyId(UUID societyId);

    @Query("SELECT COALESCE(SUM(u.totalPrice), 0) FROM InventoryUnit u")
    BigDecimal sumTotalInventoryValue();

    @Query("SELECT COALESCE(SUM(u.totalPrice), 0) FROM InventoryUnit u WHERE u.status = :status")
    BigDecimal sumValueByStatus(@Param("status") UnitStatus status);

    @Query("SELECT DISTINCT u.bhkType FROM InventoryUnit u ORDER BY u.bhkType ASC")
    List<String> findDistinctBhkTypes();

    @Query("SELECT DISTINCT u.tower FROM InventoryUnit u WHERE u.tower IS NOT NULL ORDER BY u.tower ASC")
    List<String> findDistinctTowers();
}
