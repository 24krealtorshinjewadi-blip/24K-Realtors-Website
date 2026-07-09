package com.realestate.twentyfourk.domain.wishlist;

import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import java.util.List;
import java.util.UUID;

public interface WishlistService {
    void addToWishlist(UUID userId, UUID propertyId);
    void removeFromWishlist(UUID userId, UUID propertyId);
    List<PropertyResponse> getWishlist(UUID userId);
}
