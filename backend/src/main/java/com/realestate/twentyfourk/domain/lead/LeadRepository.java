package com.realestate.twentyfourk.domain.lead;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID>, JpaSpecificationExecutor<Lead> {
    long countByStatus(LeadStatus status);

    @Query("SELECT l FROM Lead l WHERE " +
           "l.preferredLocation = :location AND " +
           "(l.budgetMin IS NULL OR :price >= l.budgetMin) AND " +
           "(l.budgetMax IS NULL OR :price <= l.budgetMax)")
    List<Lead> findMatchingLeads(
            @Param("location") com.realestate.twentyfourk.domain.property.PrimeCorridor location,
            @Param("price") BigDecimal price
    );
}
