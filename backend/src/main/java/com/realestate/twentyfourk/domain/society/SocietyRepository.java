package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.property.ProjectStatus;
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
public interface SocietyRepository extends JpaRepository<Society, UUID>,
        JpaSpecificationExecutor<Society> {

    Optional<Society> findBySlug(String slug);
    Page<Society> findByActiveFlagTrueAndDeletedFlagFalse(Pageable pageable);

    // -------------------------------------------------------------------------
    // PUBLIC SEARCH QUERIES
    // -------------------------------------------------------------------------

    Page<Society> findByHinjewadiPhaseAndActiveFlagTrueAndDeletedFlagFalse(
            HinjewadiPhase hinjewadiPhase, Pageable pageable);

    Page<Society> findByLocationAndActiveFlagTrueAndDeletedFlagFalse(
            PrimeCorridor location, Pageable pageable);

    Page<Society> findByProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(
            ProjectStatus projectStatus, Pageable pageable);

    Page<Society> findByReraRegisteredTrueAndActiveFlagTrueAndDeletedFlagFalse(Pageable pageable);

    Page<Society> findByHasResaleTrueAndActiveFlagTrueAndDeletedFlagFalse(Pageable pageable);

    Page<Society> findByHasRentalTrueAndActiveFlagTrueAndDeletedFlagFalse(Pageable pageable);

    Page<Society> findByDeveloperContainingIgnoreCaseAndActiveFlagTrueAndDeletedFlagFalse(
            String developer, Pageable pageable);

    // -------------------------------------------------------------------------
    // LOCATION PAGE AGGREGATION
    // -------------------------------------------------------------------------

    long countByHinjewadiPhaseAndProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(
            HinjewadiPhase phase, ProjectStatus status);

    long countByHinjewadiPhaseAndActiveFlagTrueAndDeletedFlagFalse(HinjewadiPhase phase);

    @Query("SELECT s FROM Society s WHERE s.hinjewadiPhase = :phase " +
           "AND s.activeFlag = true AND s.deletedFlag = false " +
           "ORDER BY CASE s.confidenceLevel " +
           "WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 ELSE 4 END, " +
           "s.createdDate DESC")
    List<Society> findByPhaseOrderByConfidence(@Param("phase") HinjewadiPhase phase, Pageable pageable);

    @Query("SELECT MIN(s.startingPrice) FROM Society s WHERE s.hinjewadiPhase = :phase " +
           "AND s.startingPrice IS NOT NULL AND s.activeFlag = true AND s.deletedFlag = false")
    BigDecimal findMinPriceByPhase(@Param("phase") HinjewadiPhase phase);

    @Query("SELECT MAX(s.startingPrice) FROM Society s WHERE s.hinjewadiPhase = :phase " +
           "AND s.startingPrice IS NOT NULL AND s.activeFlag = true AND s.deletedFlag = false")
    BigDecimal findMaxPriceByPhase(@Param("phase") HinjewadiPhase phase);

    // -------------------------------------------------------------------------
    // DETAIL PAGE
    // -------------------------------------------------------------------------

    @Query("SELECT s FROM Society s LEFT JOIN FETCH s.builder WHERE s.slug = :slug " +
           "AND s.activeFlag = true AND s.deletedFlag = false")
    Optional<Society> findBySlugWithBuilder(@Param("slug") String slug);

    // -------------------------------------------------------------------------
    // DATA QUALITY (admin reports)
    // -------------------------------------------------------------------------

    @Query("SELECT s FROM Society s WHERE (s.reraNumber IS NULL OR s.reraNumber = '') " +
           "AND s.activeFlag = true AND s.deletedFlag = false")
    List<Society> findSocietiesMissingRera();

    @Query("SELECT s FROM Society s WHERE s.priceLastVerified IS NULL " +
           "AND s.startingPrice IS NOT NULL AND s.activeFlag = true AND s.deletedFlag = false")
    List<Society> findSocietiesMissingPriceVerification();

    List<Society> findByConfidenceLevelInAndActiveFlagTrueAndDeletedFlagFalse(
            List<ConfidenceLevel> levels);
}
