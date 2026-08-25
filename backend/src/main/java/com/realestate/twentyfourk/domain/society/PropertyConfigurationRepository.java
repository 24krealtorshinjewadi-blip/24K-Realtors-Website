package com.realestate.twentyfourk.domain.society;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyConfigurationRepository extends JpaRepository<PropertyConfiguration, UUID> {
    List<PropertyConfiguration> findBySocietyId(UUID societyId);
    List<PropertyConfiguration> findBySocietyIdAndAvailableTrue(UUID societyId);
    List<PropertyConfiguration> findBySocietyIdAndBhkType(UUID societyId, String bhkType);
}
