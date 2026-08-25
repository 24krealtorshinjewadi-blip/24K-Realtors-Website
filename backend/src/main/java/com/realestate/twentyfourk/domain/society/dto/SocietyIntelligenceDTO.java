package com.realestate.twentyfourk.domain.society.dto;

import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import com.realestate.twentyfourk.domain.property.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Full intelligence DTO for Society/Property detail page.
 *
 * Powers the 26-section property detail page as defined in master prompt:
 * Hero → Project Name → Location → Status → Price → Config → RERA Badge →
 * Key Facts → Overview → Config+Areas → Pricing → Amenities → Floor Plans →
 * Master Plan → Gallery → Map → Connectivity → Developer → RERA Info →
 * Possession → Resale → Rental → FAQs → Sources → Last Verified → Enquiry CTA
 *
 * Trust rules enforced:
 *  - Price always includes lastVerifiedAt
 *  - Only verified amenities included
 *  - Sources listed per field
 *  - Confidence level displayed
 *  - "Not publicly verified" for unverified fields (null = not verified)
 */
@Data
@Builder
public class SocietyIntelligenceDTO {

    // =========================================================================
    // IDENTITY
    // =========================================================================
    private UUID id;
    private String name;
    private String canonicalName;
    private String slug;
    private List<String> aliasNames;

    // =========================================================================
    // SEO (for page <head>)
    // =========================================================================
    private String seoTitle;
    private String seoDescription;
    private String seoH1;
    private String seoPrimaryKeyword;

    // =========================================================================
    // LOCATION
    // =========================================================================
    private String location;
    private HinjewadiPhase hinjewadiPhase;
    private String fullAddress;
    private String pincode;
    private String landmark;
    private String road;
    private Double latitude;
    private Double longitude;
    private String googleMapsUrl;
    private String googleMapsIframe;

    // =========================================================================
    // DEVELOPER
    // =========================================================================
    private String developer;
    private String developerParentCompany;
    private String developerWebsite;
    private String developerLogoUrl;
    private String developerDescription;

    // =========================================================================
    // RERA / LEGAL
    // =========================================================================
    private boolean reraRegistered;
    private String reraNumber;
    private String reraProjectName;
    private String reraPromoterName;
    private String reraStatus;
    private LocalDate reraRegistrationDate;
    private LocalDate reraCompletionDate;
    private String reraSourceUrl;

    // =========================================================================
    // PROJECT STATUS & TIMELINE
    // =========================================================================
    private ProjectStatus projectStatus;
    private Integer launchYear;
    private String possessionDate;
    private LocalDate completionDate;

    // =========================================================================
    // PROJECT SIZE
    // =========================================================================
    private Double landAreaAcres;
    private Integer totalUnits;
    private Integer totalTowers;
    private Integer totalFloors;
    private Integer numberOfPhases;
    private UUID parentProjectId;

    // =========================================================================
    // CONFIGURATION (per BHK type)
    // =========================================================================
    private String configurationSummary;      // "1, 2, 3 BHK"
    private List<ConfigurationDTO> configurations;
    private Integer minCarpetAreaSqft;
    private Integer maxCarpetAreaSqft;

    // =========================================================================
    // PRICING — always with lastVerifiedAt
    // =========================================================================
    private BigDecimal startingPrice;
    private String priceRange;
    private Integer pricePerSqft;
    private String priceSource;
    /**
     * Date price was last verified. MANDATORY.
     * Frontend must display: "Price last verified: 25 Aug 2026"
     */
    private LocalDate priceLastVerified;
    private List<PriceDTO> allPrices;   // NEW_SALE, RESALE, RENT — each with date

    private boolean hasNewSale;
    private boolean hasResale;
    private boolean hasRental;

    // =========================================================================
    // AMENITIES (verified only)
    // =========================================================================
    /** Only VERIFIED_FACT amenities. Market observations excluded from public page. */
    private List<AmenityDTO> amenities;

    // =========================================================================
    // MEDIA
    // =========================================================================
    private String heroImageUrl;
    private List<String> galleryUrls;
    private List<String> floorPlanUrls;
    private String masterPlanUrl;

    // =========================================================================
    // CONNECTIVITY
    // =========================================================================
    private String nearbySchools;
    private String nearbyHospitals;
    private String nearbyItParks;
    private String nearbyMetro;
    private String nearbyMalls;
    private String travelTimeInfo;

    // =========================================================================
    // DOCUMENTS
    // =========================================================================
    private List<DocumentDTO> documents;

    // =========================================================================
    // SOCIETY INFO
    // =========================================================================
    private String overview;
    private Double rentalYield;
    private Integer investmentScore;

    // =========================================================================
    // FAQs
    // =========================================================================
    private String faqs;

    // =========================================================================
    // SOURCES (for transparency section on page)
    // =========================================================================
    private List<SourceDTO> sources;

    // =========================================================================
    // VERIFICATION & TRUST
    // =========================================================================
    private ConfidenceLevel confidenceLevel;
    /**
     * Date the entire record was last verified.
     * Frontend must display: "Verified on 25 August 2026"
     */
    private LocalDate lastVerifiedAt;

    /**
     * Website disclaimer — always show on detail page:
     * "Property information is verified from publicly available sources
     *  and should be reconfirmed before making a purchase decision."
     */
    private static final String DISCLAIMER =
        "Property information is verified from publicly available sources " +
        "and should be reconfirmed before making a purchase decision.";

    public String getDisclaimer() {
        return DISCLAIMER;
    }

    // =========================================================================
    // Nested DTOs
    // =========================================================================

    @Data @Builder
    public static class ConfigurationDTO {
        private String bhkType;
        private Integer minCarpetAreaSqft;
        private Integer maxCarpetAreaSqft;
        private Integer minBuiltUpAreaSqft;
        private Integer maxBuiltUpAreaSqft;
        private boolean available;
        private String source;
        private LocalDate lastVerifiedDate;
    }

    @Data @Builder
    public static class PriceDTO {
        private String priceType;          // NEW_SALE / RESALE / RENT
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private Integer pricePerSqft;
        private String priceSource;
        private String sourceUrl;
        /** MANDATORY: never display without this */
        private LocalDate lastVerifiedAt;
    }

    @Data @Builder
    public static class AmenityDTO {
        private String amenityKey;
        private String amenityLabel;
        private boolean verified;
        private String source;
    }

    @Data @Builder
    public static class DocumentDTO {
        private String documentName;
        private String documentType;
        private String sourceUrl;
        private String verificationStatus;
        private LocalDate lastChecked;
    }

    @Data @Builder
    public static class SourceDTO {
        private String sourceName;
        private String sourceUrl;
        private String sourceType;
        private LocalDate dateChecked;
        private String verificationStatus;
        private String fieldName;
    }
}
