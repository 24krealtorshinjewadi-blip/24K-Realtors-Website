package com.realestate.twentyfourk.domain.society;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyUpdateRepository extends JpaRepository<PropertyUpdate, UUID> {
    List<PropertyUpdate> findBySocietyIdOrderByCreatedDateDesc(UUID societyId);
    List<PropertyUpdate> findBySocietyIdAndUpdateType(UUID societyId, String updateType);
    List<PropertyUpdate> findTop10BySocietyIdOrderByCreatedDateDesc(UUID societyId);
}
