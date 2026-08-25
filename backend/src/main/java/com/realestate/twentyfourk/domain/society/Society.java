package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.builder.Builder;
import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.property.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "societies", indexes = {
    @Index(name = "idx_societies_slug_idx", columnList = "slug"),
    @Index(name = "idx_societies_builder_idx", columnList = "builder_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@lombok.Builder
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Canonical project name — single standardized name used across the database.
     * Resolves duplicates: "Godrej 24" = "Godrej Twenty4" = "Godrej 24 Pune" → one canonical_name.
     */
    @Column(name = "canonical_name", nullable = false, length = 300)
    private String canonicalName;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    /**
     * Comma-separated alias names (also stored normalized in PropertyAlias table).
     * Example: "Godrej Twenty4,Godrej 24 Pune,Godrej Twenty 4"
     */
    @Column(name = "alias_names", columnDefinition = "TEXT")
    private String aliasNames;

    /**
     * Parent project/township ID for hierarchical projects.
     * Example: A sub-phase of a large township points to the township's Society ID.
     * NULL if this is a standalone or root-level project.
     */
    @Column(name = "parent_project_id")
    private UUID parentProjectId;

    /**
     * High-level location corridor (existing PrimeCorridor enum preserved).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "location", nullable = false)
    private PrimeCorridor location;

    /**
     * Precise Hinjewadi phase — assigned only from verified official address.
     * Never from marketing claims.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "hinjewadi_phase", length = 30)
    private HinjewadiPhase hinjewadiPhase;

    /** Full official address as verified from MahaRERA or official developer source. */
    @Column(name = "full_address", length = 500)
    private String fullAddress;

    /** PIN code. */
    @Column(name = "pincode", length = 10)
    private String pincode;

    /** Nearest landmark for connectivity section. */
    @Column(name = "landmark", length = 255)
    private String landmark;

    /** Road/street name. */
    @Column(name = "road", length = 255)
    private String road;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "google_maps_url", length = 1024)
    private String googleMapsUrl;

    // -------------------------------------------------------------------------
    // RERA / LEGAL
    // -------------------------------------------------------------------------

    /** Is this project registered under MahaRERA? */
    @Column(name = "rera_registered", nullable = false)
    @lombok.Builder.Default
    private boolean reraRegistered = false;

    /**
     * MahaRERA registration number — stored EXACTLY as on MahaRERA portal.
     * NEVER modify, normalize, or fabricate. Legal identifier.
     */
    @Column(name = "rera_number", nullable = false, length = 100)
    private String reraNumber;

    /** Project name as registered on MahaRERA (may differ from marketing name). */
    @Column(name = "rera_project_name", length = 300)
    private String reraProjectName;

    /** Promoter/developer name as registered on MahaRERA. */
    @Column(name = "rera_promoter_name", length = 300)
    private String reraPromoterName;

    /** RERA registration status (e.g., "New Project", "Lapsed", "Revoked", "Extended"). */
    @Column(name = "rera_status", length = 100)
    private String reraStatus;

    /** Date of MahaRERA registration. */
    @Column(name = "rera_registration_date")
    private LocalDate reraRegistrationDate;

    /** MahaRERA declared completion/possession date. */
    @Column(name = "rera_completion_date")
    private LocalDate reraCompletionDate;

    /** Direct URL to this project's MahaRERA page (for source verification). */
    @Column(name = "rera_source_url", length = 1024)
    private String reraSourceUrl;

    // -------------------------------------------------------------------------
    // DEVELOPER
    // -------------------------------------------------------------------------

    @Column(name = "developer", nullable = false)
    private String developer;

    // -------------------------------------------------------------------------
    // PROJECT STATUS & TIMELINE
    // -------------------------------------------------------------------------

    /**
     * Intelligence-grade project status.
     * Must be verified from sources — NOT determined from marketing copy.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "project_status", nullable = false, length = 30)
    @lombok.Builder.Default
    private ProjectStatus projectStatus = ProjectStatus.UNKNOWN;

    /** Year the project was launched (verified). */
    @Column(name = "launch_year")
    private Integer launchYear;

    /** Expected or actual possession date (human-readable, e.g., "Q4 2027"). */
    @Column(name = "possession_date", length = 100)
    private String possessionDate;

    /** Actual completion date if project is COMPLETED or READY_TO_MOVE. */
    @Column(name = "completion_date")
    private LocalDate completionDate;

    // -------------------------------------------------------------------------
    // PROJECT SIZE
    // -------------------------------------------------------------------------

    /** Total land area in acres (verified). */
    @Column(name = "land_area_acres")
    private Double landAreaAcres;

    /** Total residential units across all towers/phases. */
    @Column(name = "total_units")
    private Integer totalUnits;

    /** Total number of towers/buildings. */
    @Column(name = "total_towers")
    private Integer totalTowers;

    /** Total number of floors (max across towers). */
    @Column(name = "total_floors")
    private Integer totalFloors;

    /** Number of project phases (for phased townships). */
    @Column(name = "number_of_phases")
    private Integer numberOfPhases;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Column(name = "gallery_urls", columnDefinition = "TEXT")
    private String galleryUrls;

    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities;

    @Column(name = "floor_plan_urls", columnDefinition = "TEXT")
    private String floorPlanUrls;

    @Column(name = "master_plan_url", length = 1024)
    private String masterPlanUrl;

    @Column(name = "property_types", columnDefinition = "TEXT")
    private String propertyTypes;

    /** BHK configuration summary (e.g., "1, 2, 3 BHK"). Use PropertyConfiguration table for detailed data. */
    @Column(name = "configuration", length = 200)
    private String configuration;

    /** Minimum carpet area across all unit types in sqft (verified). */
    @Column(name = "min_carpet_area_sqft")
    private Integer minCarpetAreaSqft;

    /** Maximum carpet area across all unit types in sqft (verified). */
    @Column(name = "max_carpet_area_sqft")
    private Integer maxCarpetAreaSqft;


    // -------------------------------------------------------------------------
    // PRICING (Dynamic — must always have last_verified_at)
    // -------------------------------------------------------------------------

    /**
     * Starting price for new sale (display purposes only).
     * MUST be accompanied by priceLastVerified date.
     * Prefer using PropertyPrice table for full price intelligence.
     */
    @Column(name = "starting_price", precision = 15, scale = 2)
    private BigDecimal startingPrice;

    /** Price range display string (e.g., "₹1.2 Cr – ₹3.5 Cr"). */
    @Column(name = "price_range", length = 100)
    private String priceRange;

    /** Price per sqft (verified). */
    @Column(name = "price_per_sqft")
    private Integer pricePerSqft;

    /** Source used for price (e.g., "MagicBricks", "Housing.com"). */
    @Column(name = "price_source", length = 200)
    private String priceSource;

    /**
     * Date price was last verified from a reliable source.
     * NEVER display price without this date.
     */
    @Column(name = "price_last_verified")
    private LocalDate priceLastVerified;

    /** Does this project have new-sale inventory? */
    @Column(name = "has_new_sale", nullable = false)
    @lombok.Builder.Default
    private boolean hasNewSale = false;

    /** Does this project have resale activity? */
    @Column(name = "has_resale", nullable = false)
    @lombok.Builder.Default
    private boolean hasResale = false;

    /** Does this project have rental activity? */
    @Column(name = "has_rental", nullable = false)
    @lombok.Builder.Default
    private boolean hasRental = false;

    @Column(name = "nearby_schools", columnDefinition = "TEXT")
    private String nearbySchools;

    @Column(name = "nearby_hospitals", columnDefinition = "TEXT")
    private String nearbyHospitals;

    @Column(name = "nearby_it_parks", columnDefinition = "TEXT")
    private String nearbyItParks;

    @Column(name = "nearby_metro", columnDefinition = "TEXT")
    private String nearbyMetro;

    @Column(name = "nearby_malls", columnDefinition = "TEXT")
    private String nearbyMalls;

    @Column(name = "google_maps_iframe", columnDefinition = "TEXT")
    private String googleMapsIframe;

    @Column(name = "travel_time_info", columnDefinition = "TEXT")
    private String travelTimeInfo;

    @Column(name = "investment_score")
    @lombok.Builder.Default
    private Integer investmentScore = 75;

    @Column(name = "rental_yield")
    @lombok.Builder.Default
    private Double rentalYield = 4.0;

    @Column(name = "faqs", columnDefinition = "TEXT")
    private String faqs;

    // -------------------------------------------------------------------------
    // VERIFICATION & CONFIDENCE
    // -------------------------------------------------------------------------

    /**
     * Overall confidence level for this society record.
     * HIGH   = MahaRERA + official developer verified
     * MEDIUM = One official + one secondary source
     * LOW    = One credible source only
     * UNVERIFIED = Could not verify
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "confidence_level", length = 20)
    @lombok.Builder.Default
    private ConfidenceLevel confidenceLevel = ConfidenceLevel.UNVERIFIED;

    /**
     * Timestamp when this entire record was last verified from sources.
     * Display on website: "Verified on [date]"
     */
    @Column(name = "last_verified_at")
    private LocalDate lastVerifiedAt;

    /** Internal notes for data researchers (not displayed publicly). */
    @Column(name = "researcher_notes", columnDefinition = "TEXT")
    private String researcherNotes;

    // -------------------------------------------------------------------------
    // SEO
    // -------------------------------------------------------------------------

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

    /** H1 heading for property/society detail page. */
    @Column(name = "seo_h1", length = 300)
    private String seoH1;

    /** Primary SEO keyword (e.g., "Godrej 24 Hinjewadi"). */
    @Column(name = "seo_primary_keyword", length = 200)
    private String seoPrimaryKeyword;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "builder_id")
    private Builder builder;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "active_flag", nullable = false)
    @lombok.Builder.Default
    private boolean activeFlag = true;

    @Column(name = "deleted_flag", nullable = false)
    @lombok.Builder.Default
    private boolean deletedFlag = false;

    @Version
    @Column(name = "version", nullable = false)
    @lombok.Builder.Default
    private int version = 0;
}
