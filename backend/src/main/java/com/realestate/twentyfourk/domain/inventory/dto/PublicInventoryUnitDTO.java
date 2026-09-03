package com.realestate.twentyfourk.domain.inventory.dto;

import com.realestate.twentyfourk.domain.property.FurnishingStatus;
import com.realestate.twentyfourk.domain.inventory.PublicationStatus;
import com.realestate.twentyfourk.domain.inventory.UnitStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicInventoryUnitDTO {
    private UUID id;
    private String unitNumber;
    private String tower;
    private Integer floorNumber;
    private String bhkType;
    private Double carpetAreaSqft;
    private Double superBuiltUpSqft;
    private BigDecimal basePrice;
    private BigDecimal totalPrice;
    private BigDecimal pricePerSqft;
    private String currency;
    private String parking;
    private String facing;
    private FurnishingStatus furnishingStatus;
    private UnitStatus status;
    private PublicationStatus publicationStatus;
    private UUID societyId;
    private String societyName;
    private String societySlug;
    private String location;
    private String hinjewadiPhase;
    private String builderName;
    private String reraNumber;
    private LocalDateTime lastVerifiedAt;
    private String notes;
}
