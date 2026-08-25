package com.realestate.twentyfourk.domain.society;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyAmenityRepository extends JpaRepository<PropertyAmenity, UUID> {
    List<PropertyAmenity> findBySocietyId(UUID societyId);
    List<PropertyAmenity> findBySocietyIdAndVerifiedTrue(UUID societyId);
    List<PropertyAmenity> findBySocietyIdAndFactType(UUID societyId, String factType);
}
