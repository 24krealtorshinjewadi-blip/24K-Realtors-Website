package com.realestate.twentyfourk.domain.media;

import com.realestate.twentyfourk.domain.inventory.InventoryUnit;
import com.realestate.twentyfourk.domain.society.Society;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_assets", indexes = {
    @Index(name = "idx_media_project_id", columnList = "project_id"),
    @Index(name = "idx_media_inventory_id", columnList = "inventory_id"),
    @Index(name = "idx_media_asset_type", columnList = "asset_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Society project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id")
    private InventoryUnit inventory;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false, length = 50)
    private MediaAssetType assetType;

    @Column(name = "url", nullable = false, length = 1024)
    private String url;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "source")
    private String source;

    @Column(name = "verified", nullable = false)
    @Builder.Default
    private boolean verified = true;

    @Column(name = "published", nullable = false)
    @Builder.Default
    private boolean published = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}
