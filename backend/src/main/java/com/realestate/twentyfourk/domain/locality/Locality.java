package com.realestate.twentyfourk.domain.locality;

import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "localities", indexes = {
    @Index(name = "idx_localities_slug_idx", columnList = "slug")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Locality {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    /**
     * Hinjewadi phase classification — assigned only from verified official address.
     * Do NOT assign phase from developer marketing claims.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "hinjewadi_phase", length = 30)
    private HinjewadiPhase hinjewadiPhase;

    /** India PIN code for this locality. */
    @Column(name = "pincode", length = 10)
    private String pincode;

    /** Approximate center-point latitude for map display. */
    @Column(name = "latitude")
    private Double latitude;

    /** Approximate center-point longitude for map display. */
    @Column(name = "longitude")
    private Double longitude;

    /** SEO page title for /locations/[slug] page. */
    @Column(name = "seo_title", length = 120)
    private String seoTitle;

    /** SEO meta description for /locations/[slug] page. Max 160 chars. */
    @Column(name = "seo_description", length = 300)
    private String seoDescription;

    /** H1 heading for /locations/[slug] page. */
    @Column(name = "seo_h1", length = 200)
    private String seoH1;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Column(name = "connectivity_info", columnDefinition = "TEXT")
    private String connectivityInfo;

    @Column(name = "schools", columnDefinition = "TEXT")
    private String schools;

    @Column(name = "hospitals", columnDefinition = "TEXT")
    private String hospitals;

    @Column(name = "markets", columnDefinition = "TEXT")
    private String markets;

    @Column(name = "metro_connectivity", columnDefinition = "TEXT")
    private String metroConnectivity;

    @Column(name = "investment_analysis", columnDefinition = "TEXT")
    private String investmentAnalysis;

    @Column(name = "rental_demand", columnDefinition = "TEXT")
    private String rentalDemand;

    @Column(name = "future_growth", columnDefinition = "TEXT")
    private String futureGrowth;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "active_flag", nullable = false)
    @Builder.Default
    private boolean activeFlag = true;

    @Column(name = "deleted_flag", nullable = false)
    @Builder.Default
    private boolean deletedFlag = false;

    @Version
    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 0;
}
