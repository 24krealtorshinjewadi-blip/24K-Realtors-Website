package com.realestate.twentyfourk.domain.inventory;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.customer.Customer;
import com.realestate.twentyfourk.domain.property.FurnishingStatus;
import com.realestate.twentyfourk.domain.property.Property;
import com.realestate.twentyfourk.domain.society.Society;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_units", indexes = {
    @Index(name = "idx_inv_unit_number", columnList = "unit_number"),
    @Index(name = "idx_inv_status", columnList = "status"),
    @Index(name = "idx_inv_bhk_type", columnList = "bhk_type"),
    @Index(name = "idx_inv_society", columnList = "society_id"),
    @Index(name = "idx_inv_property", columnList = "property_id"),
    @Index(name = "idx_inv_customer", columnList = "customer_id"),
    @Index(name = "idx_inv_assigned_agent", columnList = "assigned_agent_id")
})
@SQLDelete(sql = "UPDATE inventory_units SET deleted_flag = true, active_flag = false WHERE id = ? AND version = ?")
@SQLRestriction("deleted_flag = false")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "unit_number", nullable = false, length = 50)
    private String unitNumber;

    @Column(name = "tower", length = 100)
    private String tower;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "bhk_type", nullable = false, length = 50)
    private String bhkType;

    @Column(name = "carpet_area_sqft", nullable = false)
    private Double carpetAreaSqft;

    @Column(name = "super_built_up_sqft")
    private Double superBuiltUpSqft;

    @Column(name = "base_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "total_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "price_per_sqft", precision = 15, scale = 2)
    private BigDecimal pricePerSqft;

    @Column(name = "parking", length = 50)
    private String parking;

    @Column(name = "currency", length = 10)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "facing", length = 50)
    private String facing;

    @Enumerated(EnumType.STRING)
    @Column(name = "furnishing_status", length = 50)
    @Builder.Default
    private FurnishingStatus furnishingStatus = FurnishingStatus.UNFURNISHED;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private UnitStatus status = UnitStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 50)
    @Builder.Default
    private PublicationStatus publicationStatus = PublicationStatus.PUBLISHED;

    @Column(name = "published", nullable = false)
    @Builder.Default
    private boolean published = true;

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private InventorySource source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id")
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private Agent assignedAgent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @CreatedBy
    @Column(name = "created_by")
    private UUID createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private UUID updatedBy;

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
