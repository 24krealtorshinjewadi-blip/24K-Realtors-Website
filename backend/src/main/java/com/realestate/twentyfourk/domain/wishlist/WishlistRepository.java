package com.realestate.twentyfourk.domain.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    Optional<Wishlist> findByUserIdAndPropertyId(UUID userId, UUID propertyId);
    List<Wishlist> findByUserId(UUID userId);
}
