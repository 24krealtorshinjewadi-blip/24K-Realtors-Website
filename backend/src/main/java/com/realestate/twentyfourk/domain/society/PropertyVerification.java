package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Field-level confidence and verification tracking for each important data field.
 *
 * Allows the website to show, per field:
 *   - How confident is this data?
 *   - Who verified it?
 *   - When was it verified?
 *   - Any verification notes?
 *
 * Confidence levels:
 *   HIGH       = Official + RERA verified (two independent confirmations)
 *   MEDIUM     = Official/credible + secondary verification
 *   LOW        = Only one credible source
 *   UNVERIFIED = Could not verify
 *
 * Common field_name values:
 *   rera_number, rera_status, developer, possession_date, project_status,
 *   configuration, carpet_area, price, amenities, address, total_units
 */
@Entity
@Table(name = "property_verifications", indexes = {
    @Index(name = "idx_verif_society_id", columnList = "society_id"),
    @Index(name = "idx_verif_field_name", columnList = "field_name"),
    @Index(name = "idx_verif_confidence", columnList = "confidence_level")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this verification record belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /** Name of the field being verified (e.g., "rera_number", "price", "possession_date"). */
    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName;

    /** Confidence level for this specific field. */
    @Enumerated(EnumType.STRING)
    @Column(name = "confidence_level", nullable = false, length = 20)
    @Builder.Default
    private ConfidenceLevel confidenceLevel = ConfidenceLevel.UNVERIFIED;

    /** Who verified this field (admin user ID or "system" for auto-verified). */
    @Column(name = "verified_by", length = 200)
    private String verifiedBy;

    /** When this field was last verified. */
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    /** The verified value of the field at time of verification. */
    @Column(name = "verified_value", columnDefinition = "TEXT")
    private String verifiedValue;

    /**
     * Conflict resolution notes.
     * Example: "Source A says Dec 2027, Source B says Mar 2028 — manual verification required."
     * NEVER silently resolve conflicts by picking a random value.
     */
    @Column(name = "conflict_notes", columnDefinition = "TEXT")
    private String conflictNotes;

    /** Internal researcher notes (not displayed publicly). */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
}
