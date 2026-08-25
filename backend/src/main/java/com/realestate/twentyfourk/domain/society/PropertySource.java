package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.property.SourceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Tracks every source used to verify data for a society/property.
 *
 * Source hierarchy:
 *   Level 1 — OFFICIAL_RERA, OFFICIAL_DEVELOPER, GOVT_RECORDS
 *   Level 2 — PROPERTY_PORTAL (Housing.com, 99acres, MagicBricks, Square Yards, PropTiger)
 *   Level 3 — MAPS, COMMUNITY, OTHER
 *
 * Rules:
 *   - Every project must be verified from at least TWO reliable sources where possible.
 *   - MahaRERA verification mandatory for RERA-registered projects.
 *   - A broker website must NEVER be the sole source for an important factual claim.
 *   - field_name: which field this source was used to verify (e.g., "rera_number", "price", "possession_date")
 */
@Entity
@Table(name = "property_sources", indexes = {
    @Index(name = "idx_source_society_id", columnList = "society_id"),
    @Index(name = "idx_source_type", columnList = "source_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this source belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /** Human-readable source name (e.g., "MahaRERA", "Housing.com", "99acres", "Official Developer Website"). */
    @Column(name = "source_name", nullable = false, length = 200)
    private String sourceName;

    /** Direct URL to the source page (verified). */
    @Column(name = "source_url", length = 2048)
    private String sourceUrl;

    /** Type/authority level of this source. */
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 30)
    private SourceType sourceType;

    /**
     * Which field(s) this source was used to verify.
     * Comma-separated for multi-field sources.
     * Examples: "rera_number", "price,possession_date", "amenities", "configuration"
     */
    @Column(name = "field_name", length = 500)
    private String fieldName;

    /** Date this source was last checked/accessed. */
    @Column(name = "date_checked", nullable = false)
    private LocalDate dateChecked;

    /**
     * Verification status.
     * VERIFIED = Data confirmed from this source.
     * CONFLICT = Source contradicts another source (requires manual resolution).
     * OUTDATED = Source data appears stale.
     * INACCESSIBLE = URL no longer accessible.
     */
    @Column(name = "verification_status", nullable = false, length = 30)
    @Builder.Default
    private String verificationStatus = "VERIFIED";

    /** Any conflicts or notes discovered from this source. */
    @Column(name = "conflict_notes", columnDefinition = "TEXT")
    private String conflictNotes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
}
