package com.realestate.twentyfourk.domain.property;

import com.realestate.twentyfourk.domain.property.dto.PropertyRequest;
import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import com.realestate.twentyfourk.domain.property.dto.PropertyStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.UUID;

public interface PropertyService {
    PropertyResponse createProperty(PropertyRequest request);
    PropertyResponse getPropertyById(UUID id);
    Page<PropertyResponse> getAllProperties(
            PrimeCorridor location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            PropertyType propertyType,
            TransactionType transactionType,
            Integer bedrooms,
            PropertyStatus status,
            FurnishingStatus furnishingStatus,
            String query,
            Pageable pageable
    );
    PropertyResponse updateProperty(UUID id, PropertyRequest request);
    PropertyResponse updatePropertyStatus(UUID id, PropertyStatus status);
    PropertyStatsResponse getPropertyStats();
    void deleteProperty(UUID id);
    Page<PropertyResponse> getPropertiesWithinRadius(Double lat, Double lon, Double radius, Pageable pageable);
}
