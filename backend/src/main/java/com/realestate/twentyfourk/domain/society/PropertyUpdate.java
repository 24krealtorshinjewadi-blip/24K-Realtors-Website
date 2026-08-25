package com.realestate.twentyfourk.domain.society;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Changelog / audit trail for property/society data changes.
 *
 * Records every significant update to a society record.
 * Purpose:
 *   - "Verified on 25 August 2026" can be traced back to this table.
 *   - Allows displaying data freshness on the website.
 *   - Supports rollback of incorrect data updates.
 *
 * update_type values:
 *   PRICE_UPDATE        — Price verified/updated
 *   POSSESSION_UPDATE   — Possession date changed
 *   STATUS_UPDATE       — Project status changed
 *   RERA_UPDATE         — RERA information updated
 *   CONFIGURATION_UPDATE — BHK/area data updated
 *   AMENITY_UPDATE      — Amenities list updated
 *   GENERAL_UPDATE      — Other field update
 *   VERIFIED            — Record marked as re-verified (no data change)
 */
@Entity
@Table(name = "property_updates", indexes = {
    @Index(name = "idx_update_society_id", columnList = "society_id"),
    @Index(name = "idx_update_type", columnList = "update_type"),
    @Index(name = "idx_update_created", columnList = "created_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this update belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /** Type of update. */
    @Column(name = "update_type", nullable = false, length = 50)
    private String updateType;

    /** The field name that was updated (e.g., "possession_date", "project_status"). */
    @Column(name = "field_name", length = 100)
    private String fieldName;

    /** Previous value (for audit trail). */
    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    /** New/current value. */
    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    /** Who made this update (admin user ID, "system", or "research_import"). */
    @Column(name = "updated_by", length = 200)
    private String updatedBy;

    /** Source of the update (e.g., "MahaRERA check 2026-08-25", "Housing.com listing"). */
    @Column(name = "update_source", length = 300)
    private String updateSource;

    /** Notes about this update (e.g., "Corrected after MahaRERA re-check"). */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
}
