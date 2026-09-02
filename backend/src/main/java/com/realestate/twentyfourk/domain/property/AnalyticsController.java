package com.realestate.twentyfourk.domain.property;

import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.property.Property;
import com.realestate.twentyfourk.domain.property.PropertyRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor

public class AnalyticsController {

    private final PropertyRepository propertyRepository;

    @Data
    @Builder
    public static class MarketTrendResponse {
        private String location;
        private String averagePricePerSqft;
        private String appreciationRate;
        private String rentalYield;
        private List<TrendPoint> historicalData;
    }

    @Data
    @Builder
    public static class TrendPoint {
        private String month;
        private int price;
    }

    @GetMapping("/market-trends")
    public ResponseEntity<MarketTrendResponse> getMarketTrends(@RequestParam String location) {
        PrimeCorridor tempCorridor;
        try {
            tempCorridor = PrimeCorridor.valueOf(location.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            tempCorridor = PrimeCorridor.BANER;
        }
        final PrimeCorridor corridor = tempCorridor;

        // Fetch properties for the given corridor to compute dynamic average
        List<Property> properties = propertyRepository.findAll().stream()
                .filter(p -> p.getLocation() == corridor && p.getAreaSquareFeet() > 0)
                .toList();

        double avgPricePerSqft = 0;
        if (!properties.isEmpty()) {
            double totalPps = 0;
            for (Property p : properties) {
                totalPps += p.getPrice().doubleValue() / p.getAreaSquareFeet();
            }
            avgPricePerSqft = totalPps / properties.size();
        }

        // Setup corridor default baseline metrics
        String defaultPrice = "₹8,500";
        String yield = "4.2%";
        String appreciation = "+12%";
        int basePrice = 8500;

        switch (corridor) {
            case BANER -> {
                defaultPrice = "₹11,500";
                yield = "3.8%";
                appreciation = "+16%";
                basePrice = 11500;
            }
            case WAKAD -> {
                defaultPrice = "₹8,200";
                yield = "4.5%";
                appreciation = "+14%";
                basePrice = 8200;
            }
            case HINJEWADI -> {
                defaultPrice = "₹7,800";
                yield = "5.2%";
                appreciation = "+11%";
                basePrice = 7800;
            }
            case BALEWADI -> {
                defaultPrice = "₹10,200";
                yield = "4.0%";
                appreciation = "+13%";
                basePrice = 10200;
            }
            case TATHAWADE -> {
                defaultPrice = "₹7,200";
                yield = "4.6%";
                appreciation = "+15%";
                basePrice = 7200;
            }
            case MAHALUNGE -> {
                defaultPrice = "₹6,900";
                yield = "4.8%";
                appreciation = "+18%";
                basePrice = 6900;
            }
        }

        String finalPricePerSqft = defaultPrice;
        if (avgPricePerSqft > 0) {
            finalPricePerSqft = "₹" + String.format("%,.0f", avgPricePerSqft);
            basePrice = (int) avgPricePerSqft;
        }

        // Create 12 months historical data based on appreciation trends
        List<TrendPoint> historical = new ArrayList<>();
        String[] months = {
                "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
                "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"
        };

        double appreciationFactor = Double.parseDouble(appreciation.replace("%", "").replace("+", "")) / 100.0;
        double monthAppreciation = appreciationFactor / 12.0;

        for (int i = 0; i < months.length; i++) {
            double discount = (12 - i) * monthAppreciation;
            int historicalPrice = (int) (basePrice * (1.0 - discount));
            historical.add(TrendPoint.builder()
                    .month(months[i])
                    .price(historicalPrice)
                    .build());
        }

        MarketTrendResponse response = MarketTrendResponse.builder()
                .location(corridor.name())
                .averagePricePerSqft(finalPricePerSqft)
                .appreciationRate(appreciation)
                .rentalYield(yield)
                .historicalData(historical)
                .build();

        return ResponseEntity.ok(response);
    }
}
