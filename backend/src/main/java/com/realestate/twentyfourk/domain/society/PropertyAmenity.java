package com.realestate.twentyfourk.domain.society;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Stores verified amenity records for a society.
 *
 * CRITICAL RULE: Only include VERIFIED amenities.
 * Do NOT automatically add amenities because they are common in premium projects.
 * Every amenity must be source-backed where possible.
 *
 * amenity_key uses standard identifiers from the master prompt specification.
 */
@Entity
@Table(name = "property_amenities", indexes = {
    @Index(name = "idx_amenity_society_id", columnList = "society_id"),
    @Index(name = "idx_amenity_key", columnList = "amenity_key")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this amenity belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /**
     * Standard amenity key identifier.
     * Use values from master prompt specification:
     * swimming_pool, clubhouse, gym, children_play_area, sports_facilities,
     * indoor_games, jogging_track, garden, senior_citizen_area, party_lawn,
     * multipurpose_hall, security, cctv, power_backup, ev_charging,
     * visitor_parking, basement_parking, lift, intercom, fire_safety,
     * retail, convenience_store, co_working, school, other
     */
    @Column(name = "amenity_key", nullable = false, length = 100)
    private String amenityKey;

    /** Human-readable display label (e.g., "Swimming Pool", "24/7 Security"). */
    @Column(name = "amenity_label", nullable = false, length = 200)
    private String amenityLabel;

    /** Is this amenity verified from a source? */
    @Column(name = "verified", nullable = false)
    @Builder.Default
    private boolean verified = false;

    /** Source where this amenity was confirmed (e.g., "Official Developer Website", "MahaRERA brochure"). */
    @Column(name = "source", length = 300)
    private String source;

    /** Source URL for verification. */
    @Column(name = "source_url", length = 2048)
    private String sourceUrl;

    /**
     * Whether this is a VERIFIED FACT or MARKET OBSERVATION.
     * VERIFIED_FACT = Confirmed from official source.
     * MARKET_OBSERVATION = Based on market information, not official.
     *
     * Example:
     *   VERIFIED_FACT: "24-hour security listed by developer."
     *   MARKET_OBSERVATION: "Appears to have strong rental demand."
     */
    @Column(name = "fact_type", nullable = false, length = 30)
    @Builder.Default
    private String factType = "VERIFIED_FACT";

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
}
