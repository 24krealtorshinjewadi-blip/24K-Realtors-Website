package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.user.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalesController {

    private final SalesService salesService;

    // --- Timeline & Activity Logs ---
    @GetMapping("/leads/{id}/timeline")
    public ResponseEntity<List<LeadActivity>> getLeadTimeline(@PathVariable UUID id) {
        return ResponseEntity.ok(salesService.getLeadTimeline(id));
    }

    @Data
    public static class ActivityLogRequest {
        private String activityType; // CALL, EMAIL, MEETING, NOTE
        private String subject;
        private String details;
    }

    @PostMapping("/leads/{id}/timeline")
    public ResponseEntity<LeadActivity> logActivity(
            @PathVariable UUID id,
            @RequestBody ActivityLogRequest request) {
        LeadActivity activity = salesService.logLeadActivity(id, request.getActivityType(), request.getSubject(), request.getDetails());
        salesService.calculateAndUpdateLeadScore(id);
        return ResponseEntity.ok(activity);
    }

    // --- Site Visit Enpoints ---
    @Data
    public static class ScheduleVisitRequest {
        private UUID leadId;
        private UUID propertyId;
        private UUID assignedUserId;
        private LocalDateTime visitTime;
    }

    @PostMapping("/site-visits")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<SiteVisit> scheduleVisit(@RequestBody ScheduleVisitRequest request) {
        SiteVisit visit = salesService.scheduleSiteVisit(request.getLeadId(), request.getPropertyId(), request.getAssignedUserId(), request.getVisitTime());
        return ResponseEntity.ok(visit);
    }

    @Data
    public static class CheckInRequest {
        private Double latitude;
        private Double longitude;
    }

    @PatchMapping("/site-visits/{id}/check-in")
    public ResponseEntity<SiteVisit> checkInVisit(
            @PathVariable UUID id,
            @RequestBody CheckInRequest request) {
        SiteVisit visit = salesService.recordVisitCheckIn(id, request.getLatitude(), request.getLongitude());
        return ResponseEntity.ok(visit);
    }

    @Data
    public static class CompleteVisitRequest {
        private String feedback;
    }

    @PatchMapping("/site-visits/{id}/complete")
    public ResponseEntity<SiteVisit> completeVisit(
            @PathVariable UUID id,
            @RequestBody CompleteVisitRequest request) {
        SiteVisit visit = salesService.completeSiteVisit(id, request.getFeedback());
        return ResponseEntity.ok(visit);
    }

    @GetMapping("/site-visits/my-visits")
    public ResponseEntity<List<SiteVisit>> getMyVisits(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(salesService.getOwnSiteVisits(user.getId()));
    }

    @GetMapping("/site-visits/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<List<SiteVisit>> getAllVisits() {
        return ResponseEntity.ok(salesService.getAllSiteVisits());
    }

    // --- Bookings Enpoints ---
    @Data
    public static class CreateBookingRequest {
        private UUID leadId;
        private UUID propertyId;
        private UUID assignedUserId;
        private BigDecimal bookingAmount;
        private BigDecimal totalPrice;
    }

    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(@RequestBody CreateBookingRequest request) {
        Booking booking = salesService.createBooking(
                request.getLeadId(),
                request.getPropertyId(),
                request.getAssignedUserId(),
                request.getBookingAmount(),
                request.getTotalPrice()
        );
        return ResponseEntity.ok(booking);
    }

    @PatchMapping("/bookings/{id}/confirm")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTS')")
    public ResponseEntity<Booking> confirmBooking(@PathVariable UUID id) {
        Booking booking = salesService.confirmBookingPayment(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/bookings/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(salesService.getOwnBookings(user.getId()));
    }

    @GetMapping("/bookings/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTS')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(salesService.getAllBookings());
    }
}
