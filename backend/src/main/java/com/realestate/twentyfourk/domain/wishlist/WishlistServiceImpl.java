package com.realestate.twentyfourk.domain.wishlist;

import com.realestate.twentyfourk.domain.property.Property;
import com.realestate.twentyfourk.domain.property.PropertyRepository;
import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import com.realestate.twentyfourk.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @Override
    @Transactional
    public void addToWishlist(UUID userId, UUID propertyId) {
        // Prevent duplicate wishlist entries
        if (wishlistRepository.findByUserIdAndPropertyId(userId, propertyId).isPresent()) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .property(property)
                .build();

        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(UUID userId, UUID propertyId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndPropertyId(userId, propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist entry not found for User " + userId + " and Property " + propertyId));
        wishlistRepository.delete(wishlist);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> getWishlist(UUID userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);
        return wishlists.stream()
                .map(w -> mapToPropertyResponse(w.getProperty()))
                .collect(Collectors.toList());
    }

    private PropertyResponse mapToPropertyResponse(Property property) {
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
                property.getUpdatedDate(),
                property.getSociety() != null ? property.getSociety().getId() : null,
                property.getSociety() != null ? property.getSociety().getName() : null
        );
    }
}
