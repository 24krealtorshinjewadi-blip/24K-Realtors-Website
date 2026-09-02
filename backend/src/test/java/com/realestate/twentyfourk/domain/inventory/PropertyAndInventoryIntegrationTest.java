package com.realestate.twentyfourk.domain.inventory;

import com.realestate.twentyfourk.domain.inventory.dto.InventoryStatsResponse;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitRequest;
import com.realestate.twentyfourk.domain.inventory.dto.InventoryUnitResponse;
import com.realestate.twentyfourk.domain.property.FurnishingStatus;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.property.PropertyService;
import com.realestate.twentyfourk.domain.property.PropertyStatus;
import com.realestate.twentyfourk.domain.property.PropertyType;
import com.realestate.twentyfourk.domain.property.TransactionType;
import com.realestate.twentyfourk.domain.property.dto.PropertyRequest;
import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import com.realestate.twentyfourk.domain.property.dto.PropertyStatsResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
    "ADMIN_USERNAME=Manish",
    "ADMIN_PASSWORD=Manish@24K2026!",
    "RESEND_API_KEY=test_resend_dummy",
    "WHATSAPP_API_TOKEN=test_whatsapp_dummy"
})
@ActiveProfiles("test")
public class PropertyAndInventoryIntegrationTest {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private InventoryUnitService inventoryUnitService;

    @Autowired
    private InventoryUnitRepository unitRepository;

    @Test
    @DisplayName("Phase 4: Full Property and Inventory Unit Lifecycle Verification")
    void testPropertyAndInventoryLifecycle() {
        // ── 1. Create a Luxury Flagship Property Listing ──
        PropertyRequest propReq = new PropertyRequest(
                "24K Manor Presidential Penthouse 4 BHK",
                "Super-luxury sky residence with 360-degree city views and private heated jacuzzi.",
                PropertyType.RESIDENTIAL,
                TransactionType.BUY,
                new BigDecimal("28500000.00"), // ₹2.85 Cr
                2650.0,
                PrimeCorridor.BANER,
                "Balewadi High Street Extension, Baner, Pune",
                18.5721,
                73.7745,
                4,
                4,
                PropertyStatus.AVAILABLE,
                true,
                true,
                false,
                "P52100099881",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                null,
                null,
                FurnishingStatus.FULLY_FURNISHED,
                true,
                null
        );

        PropertyResponse createdProp = propertyService.createProperty(propReq);
        assertThat(createdProp).isNotNull();
        assertThat(createdProp.id()).isNotNull();
        assertThat(createdProp.title()).isEqualTo("24K Manor Presidential Penthouse 4 BHK");
        assertThat(createdProp.status()).isEqualTo(PropertyStatus.AVAILABLE);

        // ── 2. Update Property Status ──
        PropertyResponse updatedProp = propertyService.updatePropertyStatus(createdProp.id(), PropertyStatus.SOLD);
        assertThat(updatedProp.status()).isEqualTo(PropertyStatus.SOLD);

        // ── 3. Verify Property Catalog Stats ──
        PropertyStatsResponse propStats = propertyService.getPropertyStats();
        assertThat(propStats.totalProperties()).isGreaterThanOrEqualTo(1);
        assertThat(propStats.soldProperties()).isGreaterThanOrEqualTo(1);

        // ── 4. Create an Inventory Unit ──
        InventoryUnitRequest unitReq = new InventoryUnitRequest(
                "T5-901",
                "Tower 5 (Emerald)",
                9,
                "3 BHK",
                1180.0,
                1590.0,
                new BigDecimal("12500000.00"),
                new BigDecimal("13650000.00"),
                "East Facing",
                FurnishingStatus.SEMI_FURNISHED,
                UnitStatus.AVAILABLE,
                null,
                createdProp.id(),
                null,
                null,
                "Exclusive corner unit, scenic amenity view"
        );

        InventoryUnitResponse createdUnit = inventoryUnitService.createUnit(unitReq);
        assertThat(createdUnit).isNotNull();
        assertThat(createdUnit.id()).isNotNull();
        assertThat(createdUnit.unitNumber()).isEqualTo("T5-901");
        assertThat(createdUnit.status()).isEqualTo(UnitStatus.AVAILABLE);

        // ── 5. Transition Unit Status (AVAILABLE -> ON_HOLD -> BOOKED) ──
        InventoryUnitResponse onHoldUnit = inventoryUnitService.updateUnitStatus(createdUnit.id(), UnitStatus.ON_HOLD);
        assertThat(onHoldUnit.status()).isEqualTo(UnitStatus.ON_HOLD);

        InventoryUnitResponse bookedUnit = inventoryUnitService.updateUnitStatus(createdUnit.id(), UnitStatus.BOOKED);
        assertThat(bookedUnit.status()).isEqualTo(UnitStatus.BOOKED);

        // ── 6. Aggregate Inventory Metrics ──
        InventoryStatsResponse invStats = inventoryUnitService.getInventoryStats();
        assertThat(invStats.totalUnits()).isGreaterThanOrEqualTo(1);
        assertThat(invStats.bookedUnits()).isGreaterThanOrEqualTo(1);
        assertThat(invStats.totalInventoryValue()).isNotNull();

        // ── 7. Soft Delete Inventory Unit ──
        inventoryUnitService.deleteUnit(createdUnit.id());
        assertThat(unitRepository.findById(createdUnit.id())).isEmpty(); // Soft-deleted due to @SQLRestriction
    }
}
