package com.realestate.twentyfourk.domain.inventory;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_sources", indexes = {
    @Index(name = "idx_inv_src_type", columnList = "source_type"),
    @Index(name = "idx_inv_src_auth", columnList = "authorized, active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventorySource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 50)
    private InventorySourceType sourceType;

    @Column(name = "source_name", nullable = false)
    private String sourceName;

    @Column(name = "reference")
    private String reference;

    @Column(name = "authorized", nullable = false)
    @Builder.Default
    private boolean authorized = true;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}
