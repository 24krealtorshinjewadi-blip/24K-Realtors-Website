package com.realestate.twentyfourk.domain.society;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyPriceRepository extends JpaRepository<PropertyPrice, UUID> {
    List<PropertyPrice> findBySocietyId(UUID societyId);
    List<PropertyPrice> findBySocietyIdAndIsCurrentTrue(UUID societyId);
    Optional<PropertyPrice> findBySocietyIdAndPriceTypeAndIsCurrentTrue(UUID societyId, String priceType);
    List<PropertyPrice> findBySocietyIdAndPriceTypeOrderByLastVerifiedAtDesc(UUID societyId, String priceType);
}
