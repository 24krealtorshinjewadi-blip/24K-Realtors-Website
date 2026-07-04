package com.realestate.twentyfourk.domain.locality;

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
