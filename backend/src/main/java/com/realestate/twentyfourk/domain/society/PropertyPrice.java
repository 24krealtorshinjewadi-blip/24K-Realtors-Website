package com.realestate.twentyfourk.domain.society;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Tracks verified price data for a society.
 *
 * KEY RULE: Price is always DYNAMIC. Never display a price without last_verified_at.
 *
 * Three separate price tracks:
 *   NEW_SALE  — Developer/builder sale price
 *   RESALE    — Secondary market price
 *   RENT      — Monthly rental range
 *
 * Use is_current = true to identify the active price record.
 * Historical records (is_current = false) are retained for audit trail.
 *
 * If price cannot be verified: set min_price and max_price to NULL.
 * Display on website: "Contact 24K Realtors for current pricing."
 */
@Entity
@Table(name = "property_prices", indexes = {
    @Index(name = "idx_price_society_id", columnList = "society_id"),
    @Index(name = "idx_price_type_current", columnList = "price_type, is_current")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this price record belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /**
     * Price category — must be kept separate, never mixed.
     * NEW_SALE = Developer/builder primary sale
     * RESALE   = Secondary market
     * RENT     = Monthly rent
     */
    @Column(name = "price_type", nullable = false, length = 20)
    private String priceType;

    /** Minimum price in INR (for new sale/resale) or monthly rent (for RENT). Null if unverified. */
    @Column(name = "min_price", precision = 15, scale = 2)
    private BigDecimal minPrice;

    /** Maximum price in INR (for new sale/resale) or monthly rent (for RENT). Null if unverified. */
    @Column(name = "max_price", precision = 15, scale = 2)
    private BigDecimal maxPrice;

    /** Price per square foot (verified). Null if unverified. */
    @Column(name = "price_per_sqft")
    private Integer pricePerSqft;

    /**
     * Source used for this price data (e.g., "MagicBricks", "Housing.com", "99acres").
     * Always record — price without source is untrustworthy.
     */
    @Column(name = "price_source", nullable = false, length = 300)
    private String priceSource;

    /** Direct URL to source listing/page. */
    @Column(name = "source_url", length = 2048)
    private String sourceUrl;

    /**
     * Date this price was last verified from the source.
     * MANDATORY. Never display price without this.
     */
    @Column(name = "last_verified_at", nullable = false)
    private LocalDate lastVerifiedAt;

    /** Is this the current/active price record? Only one per price_type should be true. */
    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private boolean isCurrent = true;

    /** Any conflict notes (e.g., "Source A says 8500/sqft, Source B says 9200/sqft"). */
    @Column(name = "conflict_notes", columnDefinition = "TEXT")
    private String conflictNotes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}
