package com.realestate.twentyfourk.domain.property;

import com.realestate.twentyfourk.domain.property.dto.PropertyRequest;
import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import com.realestate.twentyfourk.domain.property.event.PropertyCreatedEvent;
import com.realestate.twentyfourk.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        Property property = mapToEntity(request);
        Property savedProperty = propertyRepository.save(property);

        // Publish event for asynchronous matchmaking check
        eventPublisher.publishEvent(new PropertyCreatedEvent(savedProperty));

        return mapToResponse(savedProperty);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + id));
        return mapToResponse(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponse> getAllProperties(
            PrimeCorridor location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            PropertyType propertyType,
            TransactionType transactionType,
            Integer bedrooms,
            PropertyStatus status,
            FurnishingStatus furnishingStatus,
            Pageable pageable
    ) {
        Specification<Property> spec = PropertySpecification.filterProperties(
                location, minPrice, maxPrice, propertyType, transactionType, bedrooms, status, furnishingStatus
        );
        Page<Property> propertiesPage = propertyRepository.findAll(spec, pageable);
        return propertiesPage.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public PropertyResponse updateProperty(UUID id, PropertyRequest request) {
        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + id));

        updateEntityFields(existingProperty, request);
        Property updatedProperty = propertyRepository.save(existingProperty);
        return mapToResponse(updatedProperty);
    }

    @Override
    @Transactional
    public void deleteProperty(UUID id) {
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property not found with ID: " + id);
        }
        propertyRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponse> getPropertiesWithinRadius(Double lat, Double lon, Double radius, Pageable pageable) {
        Page<Property> propertiesPage = propertyRepository.findPropertiesWithinRadius(lat, lon, radius, pageable);
        return propertiesPage.map(this::mapToResponse);
    }

    // Helper mapping methods
    private Property mapToEntity(PropertyRequest request) {
        return Property.builder()
                .title(request.title())
                .description(request.description())
                .propertyType(request.propertyType())
                .transactionType(request.transactionType())
                .price(request.price())
                .areaSquareFeet(request.areaSquareFeet())
                .location(request.location())
                .address(request.address())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .verifiedListing(request.verifiedListing())
                .exclusiveDeal(request.exclusiveDeal())
                .noBrokerage(request.noBrokerage())
                .reraNumber(request.reraNumber() == null || request.reraNumber().trim().isEmpty() ? "RERA-PUN-PRM-PENDING" : request.reraNumber())
                .bedrooms(request.bedrooms())
                .bathrooms(request.bathrooms())
                .status(request.status())
                .imageUrl(request.imageUrl())
                .videoUrl(request.videoUrl())
                .threeDTourUrl(request.threeDTourUrl())
                .furnishingStatus(request.furnishingStatus())
                .gasPipeline(request.gasPipeline())
                .build();
    }

    private void updateEntityFields(Property existingProperty, PropertyRequest request) {
        existingProperty.setTitle(request.title());
        existingProperty.setDescription(request.description());
        existingProperty.setPropertyType(request.propertyType());
        existingProperty.setTransactionType(request.transactionType());
        existingProperty.setPrice(request.price());
        existingProperty.setAreaSquareFeet(request.areaSquareFeet());
        existingProperty.setLocation(request.location());
        existingProperty.setAddress(request.address());
        existingProperty.setLatitude(request.latitude());
        existingProperty.setLongitude(request.longitude());
        existingProperty.setVerifiedListing(request.verifiedListing());
        existingProperty.setExclusiveDeal(request.exclusiveDeal());
        existingProperty.setNoBrokerage(request.noBrokerage());
        existingProperty.setReraNumber(request.reraNumber() == null || request.reraNumber().trim().isEmpty() ? "RERA-PUN-PRM-PENDING" : request.reraNumber());
        existingProperty.setBedrooms(request.bedrooms());
        existingProperty.setBathrooms(request.bathrooms());
        existingProperty.setStatus(request.status());
        existingProperty.setImageUrl(request.imageUrl());
        existingProperty.setVideoUrl(request.videoUrl());
        existingProperty.setThreeDTourUrl(request.threeDTourUrl());
        existingProperty.setFurnishingStatus(request.furnishingStatus());
        existingProperty.setGasPipeline(request.gasPipeline());
    }

    private PropertyResponse mapToResponse(Property property) {
        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getPropertyType(),
                property.getTransactionType(),
                property.getPrice(),
                property.getAreaSquareFeet(),
                property.getLocation(),
                property.getAddress(),
                property.getLatitude(),
                property.getLongitude(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getStatus(),
                property.isVerifiedListing(),
                property.isExclusiveDeal(),
                property.isNoBrokerage(),
                property.getReraNumber(),
                property.getImageUrl(),
                property.getVideoUrl(),
                property.getThreeDTourUrl(),
                property.getFurnishingStatus(),
                property.isGasPipeline(),
                property.getCreatedDate(),
                property.getUpdatedDate()
        );
    }

}
