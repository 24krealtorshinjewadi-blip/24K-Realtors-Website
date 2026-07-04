package com.realestate.twentyfourk.domain.builder;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "builders", indexes = {
    @Index(name = "idx_builders_slug_idx", columnList = "slug")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@lombok.Builder
public class Builder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "logo_url", length = 1024)
    private String logoUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "completed_projects_count")
    private Integer completedProjectsCount;

    @Column(name = "ongoing_projects_count")
    private Integer ongoingProjectsCount;

    @Column(name = "awards", columnDefinition = "TEXT")
    private String awards;

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
