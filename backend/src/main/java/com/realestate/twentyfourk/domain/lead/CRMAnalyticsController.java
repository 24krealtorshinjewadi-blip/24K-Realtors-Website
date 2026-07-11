package com.realestate.twentyfourk.domain.lead;

import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/crm/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'ACCOUNTS')")
public class CRMAnalyticsController {

    private final LeadRepository leadRepository;
    private final BookingRepository bookingRepository;
    private final SiteVisitRepository siteVisitRepository;

    @Value
    public static class MonthlyDealStats {
        Long count;
        BigDecimal totalValue;
        BigDecimal totalCommission;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryStats() {
        long totalLeads = leadRepository.count();
        long totalBookings = bookingRepository.count();
        long totalSiteVisits = siteVisitRepository.count();

        BigDecimal totalSalesVolume = bookingRepository.findAll().stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCommissions = bookingRepository.findAll().stream()
                .map(Booking::getCommissionEarned)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalLeads", totalLeads);
        summary.put("totalBookings", totalBookings);
        summary.put("totalSiteVisits", totalSiteVisits);
        summary.put("totalSalesVolume", totalSalesVolume);
        summary.put("totalCommissions", totalCommissions);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/lead-conversion")
    public ResponseEntity<Map<String, Long>> getLeadConversionStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        for (LeadStatus status : LeadStatus.values()) {
            stats.put(status.name(), leadRepository.countByStatus(status));
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly-deals")
    public ResponseEntity<Map<String, MonthlyDealStats>> getMonthlyDealsStats() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Booking> bookings = bookingRepository.findAll();

        Map<String, MonthlyDealStats> monthlyStats = bookings.stream()
                .filter(b -> b.getCreatedDate() != null && b.getCreatedDate().isAfter(sixMonthsAgo))
                .collect(Collectors.groupingBy(
                        b -> b.getCreatedDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        TreeMap::new,
                        Collectors.reducing(
                                new MonthlyDealStats(0L, BigDecimal.ZERO, BigDecimal.ZERO),
                                b -> new MonthlyDealStats(1L, b.getTotalPrice(), b.getCommissionEarned()),
                                (s1, s2) -> new MonthlyDealStats(
                                        s1.getCount() + s2.getCount(),
                                        s1.getTotalValue().add(s2.getTotalValue()),
                                        s1.getTotalCommission().add(s2.getTotalCommission())
                                )
                        )
                ));

        return ResponseEntity.ok(monthlyStats);
    }

    @GetMapping("/site-visit-stats")
    public ResponseEntity<Map<String, Long>> getSiteVisitStats() {
        List<SiteVisit> visits = siteVisitRepository.findAll();

        long total = visits.size();
        long scheduled = visits.stream().filter(v -> "SCHEDULED".equalsIgnoreCase(v.getStatus())).count();
        long completed = visits.stream().filter(v -> "COMPLETED".equalsIgnoreCase(v.getStatus())).count();
        long cancelled = visits.stream().filter(v -> "CANCELLED".equalsIgnoreCase(v.getStatus())).count();
        long checkedIn = visits.stream().filter(v -> v.getCheckedInTime() != null).count();

        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", total);
        stats.put("scheduled", scheduled);
        stats.put("completed", completed);
        stats.put("cancelled", cancelled);
        stats.put("checkedIn", checkedIn);

        return ResponseEntity.ok(stats);
    }
}
