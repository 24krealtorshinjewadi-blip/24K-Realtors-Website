package com.realestate.twentyfourk.domain.society.dto;

import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import com.realestate.twentyfourk.domain.property.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for Location landing pages.
 *
 * Powers routes:
 *  /locations/hinjewadi
 *  /locations/hinjewadi-phase-1
 *  /locations/hinjewadi-phase-2
 *  /locations/hinjewadi-phase-3
 *  /locations/mahalunge
 *
 * Page sections:
 *  Overview, Property inventory, Popular societies, Builders,
 *  BHK availability, Price trends, RTM/UC/New Launch counts,
 *  Rental & Resale opportunities, Connectivity, FAQs
 */
@Data
@Builder
public class LocationPageDTO {

    // =========================================================================
    // IDENTITY & SEO
    // =========================================================================
    private String name;
    private String slug;
    private HinjewadiPhase phase;
    private String pincode;
    private Double latitude;
    private Double longitude;

    private String seoTitle;
    private String seoDescription;
    private String seoH1;

    // =========================================================================
    // OVERVIEW
    // =========================================================================
    private String overview;
    private String connectivityInfo;
    private String investmentAnalysis;
    private String rentalDemand;
    private String futureGrowth;

    // =========================================================================
    // PROPERTY INVENTORY STATS
    // =========================================================================
    private int totalProjects;
    private int readyToMoveCount;
    private int underConstructionCount;
    private int newLaunchCount;
    private int upcomingCount;

    // =========================================================================
    // PRICE SUMMARY
    // =========================================================================
    /** Lowest verified starting price in this location. */
    private BigDecimal minPrice;
    /** Highest verified starting price in this location. */
    private BigDecimal maxPrice;
    /**
     * Date price summary was last verified.
     * Always show on page — never display price without verification date.
     */
    private LocalDate priceSummaryLastVerified;

    // =========================================================================
    // BHK AVAILABILITY
    // =========================================================================
    private boolean has1Bhk;
    private boolean has2Bhk;
    private boolean has3Bhk;
    private boolean has4Bhk;
    private boolean hasVilla;
    private boolean hasPlot;

    // =========================================================================
    // ACTIVE BUILDERS IN THIS LOCATION
    // =========================================================================
    private List<BuilderSummaryDTO> activeBuilders;

    // =========================================================================
    // FEATURED / POPULAR SOCIETIES (cards)
    // =========================================================================
    private List<SocietyCardDTO> featuredSocieties;

    // =========================================================================
    // CONNECTIVITY
    // =========================================================================
    private String schools;
    private String hospitals;
    private String markets;
    private String metroConnectivity;

    // =========================================================================
    // FAQs
    // =========================================================================
    private String faqs;

    // =========================================================================
    // Nested
    // =========================================================================

    @Data @Builder
    public static class BuilderSummaryDTO {
        private String name;
        private String slug;
        private String logoUrl;
        private String officialWebsite;
        private int projectCount;
    }
}
