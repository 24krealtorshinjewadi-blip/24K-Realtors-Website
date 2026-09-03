package com.realestate.twentyfourk.domain.inventory;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_verifications", indexes = {
    @Index(name = "idx_inv_verif_inv_id", columnList = "inventory_id"),
    @Index(name = "idx_inv_verif_date", columnList = "verified_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private InventoryUnit inventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private InventorySource source;

    @Column(name = "verified_by", nullable = false, length = 200)
    private String verifiedBy;

    @Column(name = "price_verified", nullable = false)
    @Builder.Default
    private boolean priceVerified = true;

    @Column(name = "availability_verified", nullable = false)
    @Builder.Default
    private boolean availabilityVerified = true;

    @Column(name = "verified_at", nullable = false)
    @Builder.Default
    private LocalDateTime verifiedAt = LocalDateTime.now();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
}
