package com.realestate.twentyfourk.domain.property;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "area_square_feet", nullable = false)
    private Double areaSquareFeet;

    @Enumerated(EnumType.STRING)
    @Column(name = "location", nullable = false)
    private PrimeCorridor location;

    @Column(name = "address", nullable = false, length = 500)
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "verified_listing", nullable = false)
    @Builder.Default
    private boolean verifiedListing = false;

    @Column(name = "exclusive_deal", nullable = false)
    @Builder.Default
    private boolean exclusiveDeal = false;

    @Column(name = "no_brokerage", nullable = false)
    @Builder.Default
    private boolean noBrokerage = false;

    @Column(name = "rera_number", nullable = false, length = 100)
    @Builder.Default
    private String reraNumber = "RERA-PUN-PRM-PENDING";

    @Column(name = "bedrooms", nullable = false)
    private Integer bedrooms;

    @Column(name = "bathrooms", nullable = false)
    private Integer bathrooms;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PropertyStatus status;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}
