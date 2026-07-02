package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.builder.Builder;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
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

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "location", nullable = false)
    private PrimeCorridor location;

    @Column(name = "developer", nullable = false)
    private String developer;

    @Column(name = "rera_number", nullable = false, length = 100)
    private String reraNumber;

    @Column(name = "project_status", nullable = false, length = 50)
    private String projectStatus;

    @Column(name = "starting_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal startingPrice;

    @Column(name = "possession_date", length = 100)
    private String possessionDate;

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

    @Column(name = "price_range", length = 100)
    private String priceRange;

    @Column(name = "configuration", length = 100)
    private String configuration;

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

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

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
