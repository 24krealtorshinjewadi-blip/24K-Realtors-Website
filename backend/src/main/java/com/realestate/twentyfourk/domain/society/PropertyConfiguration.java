package com.realestate.twentyfourk.domain.society;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Stores per-BHK-type configuration details for a society.
 *
 * Separate from Society entity so that multi-BHK projects have
 * structured, queryable configuration data.
 *
 * Example:
 *   society_id = X
 *   bhk_type = "2 BHK"
 *   min_carpet_area_sqft = 750
 *   max_carpet_area_sqft = 900
 *   min_built_up_area_sqft = 900
 *   max_built_up_area_sqft = 1100
 *   available = true
 *
 * Rule: Only add verified configurations — NOT assumed from marketing brochures alone.
 */
@Entity
@Table(name = "property_configurations", indexes = {
    @Index(name = "idx_config_society_id", columnList = "society_id"),
    @Index(name = "idx_config_bhk_type", columnList = "bhk_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this configuration belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /**
     * BHK type label.
     * Examples: "1 BHK", "2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK", "4 BHK",
     *           "Duplex", "Penthouse", "Studio", "Villa", "Plot"
     */
    @Column(name = "bhk_type", nullable = false, length = 50)
    private String bhkType;

    /** Minimum carpet area for this BHK type in square feet (verified). */
    @Column(name = "min_carpet_area_sqft")
    private Integer minCarpetAreaSqft;

    /** Maximum carpet area for this BHK type in square feet (verified). */
    @Column(name = "max_carpet_area_sqft")
    private Integer maxCarpetAreaSqft;

    /** Minimum built-up area in square feet (verified). */
    @Column(name = "min_built_up_area_sqft")
    private Integer minBuiltUpAreaSqft;

    /** Maximum built-up area in square feet (verified). */
    @Column(name = "max_built_up_area_sqft")
    private Integer maxBuiltUpAreaSqft;

    /** Is this configuration currently available for sale/enquiry? */
    @Column(name = "available", nullable = false)
    @Builder.Default
    private boolean available = true;

    /** Source from which this configuration was verified. */
    @Column(name = "source", length = 300)
    private String source;

    /** Date this configuration was last verified. */
    @Column(name = "last_verified_date")
    private java.time.LocalDate lastVerifiedDate;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}
