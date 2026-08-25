package com.realestate.twentyfourk.domain.society.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Filter parameters for public property/society search.
 *
 * Powers the search & filter functionality on /properties and /societies pages.
 *
 * Filters:
 *   Location, Phase, Builder, BHK, Budget, Status, Possession,
 *   RERA, Ready to Move, Under Construction, New Launch, Resale, Rental
 */
@Data
@Builder
public class SocietySearchFilter {

    // Location filters
    private String location;          // PrimeCorridor enum value
    private String hinjewadiPhase;    // HinjewadiPhase enum value

    // Developer filter
    private String developer;

    // BHK filter (e.g., "2 BHK", "3 BHK")
    private String bhkType;

    // Budget range in INR
    private Long minBudget;
    private Long maxBudget;

    // Status filter
    private String projectStatus;     // ProjectStatus enum value

    // Availability flags
    private Boolean reraRegistered;
    private Boolean readyToMove;
    private Boolean underConstruction;
    private Boolean newLaunch;
    private Boolean hasResale;
    private Boolean hasRental;

    // Possession filter (e.g., "2025", "2026", "2027")
    private String possessionYear;

    // Sorting
    private String sortBy;     // "price_asc", "price_desc", "newest", "verified_first"

    // Pagination
    @Builder.Default
    private int page = 0;
    @Builder.Default
    private int size = 12;
}
