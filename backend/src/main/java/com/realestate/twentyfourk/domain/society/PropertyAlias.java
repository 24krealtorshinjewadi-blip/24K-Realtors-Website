package com.realestate.twentyfourk.domain.society;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Stores all known aliases/alternative names for a society/project.
 *
 * Purpose: Duplicate detection & canonical name resolution.
 *
 * Example for "Godrej 24":
 *   alias_name = "Godrej Twenty4",   alias_source = "MagicBricks"
 *   alias_name = "Godrej 24 Pune",   alias_source = "99acres"
 *   alias_name = "Godrej Twenty 4",  alias_source = "Housing.com"
 *
 * Rule: Do NOT merge separate RERA projects just because they share a developer or township.
 */
@Entity
@Table(name = "property_aliases", indexes = {
    @Index(name = "idx_alias_society_id", columnList = "society_id"),
    @Index(name = "idx_alias_name", columnList = "alias_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this alias belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /** The alternative name (exactly as found in source). */
    @Column(name = "alias_name", nullable = false, length = 300)
    private String aliasName;

    /** Source where this alias was found (e.g., "MagicBricks", "Housing.com", "99acres"). */
    @Column(name = "alias_source", length = 200)
    private String aliasSource;

    /** Additional notes (e.g., "Used as marketing name in Phase 2 brochures"). */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
}
