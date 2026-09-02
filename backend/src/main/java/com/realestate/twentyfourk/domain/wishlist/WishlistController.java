package com.realestate.twentyfourk.domain.wishlist;

import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import com.realestate.twentyfourk.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor

public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{propertyId}")
    public ResponseEntity<Void> addToWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable UUID propertyId
    ) {
        wishlistService.addToWishlist(user.getId(), propertyId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable UUID propertyId
    ) {
        wishlistService.removeFromWishlist(user.getId(), propertyId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getWishlist(
            @AuthenticationPrincipal User user
    ) {
        List<PropertyResponse> wishlist = wishlistService.getWishlist(user.getId());
        return ResponseEntity.ok(wishlist);
    }
}
