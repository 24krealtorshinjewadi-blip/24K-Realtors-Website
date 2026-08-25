package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.property.SourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertySourceRepository extends JpaRepository<PropertySource, UUID> {
    List<PropertySource> findBySocietyId(UUID societyId);
    List<PropertySource> findBySocietyIdAndSourceType(UUID societyId, SourceType sourceType);
    List<PropertySource> findBySocietyIdOrderByDateCheckedDesc(UUID societyId);
}
