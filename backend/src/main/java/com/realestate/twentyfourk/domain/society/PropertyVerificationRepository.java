package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyVerificationRepository extends JpaRepository<PropertyVerification, UUID> {
    List<PropertyVerification> findBySocietyId(UUID societyId);
    Optional<PropertyVerification> findBySocietyIdAndFieldName(UUID societyId, String fieldName);
    List<PropertyVerification> findBySocietyIdAndConfidenceLevel(UUID societyId, ConfidenceLevel confidenceLevel);

    /** Find all societies that have unverified critical fields — for missing data report. */
    @Query("SELECT DISTINCT pv.society.id FROM PropertyVerification pv WHERE pv.confidenceLevel = 'UNVERIFIED'")
    List<UUID> findSocietyIdsWithUnverifiedFields();
}
