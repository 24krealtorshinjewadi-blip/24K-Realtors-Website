package com.realestate.twentyfourk.domain.society.dto;

import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import com.realestate.twentyfourk.domain.property.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Lightweight DTO for property/society listing cards.
 *
 * Master prompt rule: Keep cards clean and premium.
 * Display only: Project Name, Location, BHK, Price, Status, RERA, Possession, View Details.
 * Do NOT overload the property card.
 *
 * Price MUST always include priceLastVerified — never display price without a date.
 */
@Data
@Builder
public class SocietyCardDTO {

    private UUID id;
    private String name;
    private String canonicalName;
    private String slug;

    // Location
    private String location;
    private HinjewadiPhase hinjewadiPhase;
    private String locality;

    // Developer
    private String developer;
    private String builderLogoUrl;

    // Configuration (summary only)
    private String configuration;

    // Status
    private ProjectStatus projectStatus;

    // RERA
    private boolean reraRegistered;
    private String reraNumber;

    // Pricing — ALWAYS include lastVerified
    private BigDecimal startingPrice;
    private String priceRange;
    /** Source of price data. */
    private String priceSource;
    /**
     * MANDATORY: Date price was last verified.
     * Never display price without this field.
     */
    private LocalDate priceLastVerified;

    // Possession
    private String possessionDate;

    // Confidence
    private ConfidenceLevel confidenceLevel;
    private LocalDate lastVerifiedAt;

    // Media
    private String heroImageUrl;

    // Flags
    private boolean hasNewSale;
    private boolean hasResale;
    private boolean hasRental;
}
