package com.realestate.twentyfourk.domain.lead;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SalesService {
    // Site Visit workflows
    SiteVisit scheduleSiteVisit(UUID leadId, UUID propertyId, UUID assignedUserId, LocalDateTime visitTime);
    SiteVisit recordVisitCheckIn(UUID visitId, Double lat, Double lon);
    SiteVisit completeSiteVisit(UUID visitId, String feedback);
    List<SiteVisit> getLeadSiteVisits(UUID leadId);
    List<SiteVisit> getOwnSiteVisits(UUID employeeId);
    List<SiteVisit> getAllSiteVisits();

    // Booking workflows
    Booking createBooking(UUID leadId, UUID propertyId, UUID assignedUserId, BigDecimal bookingAmount, BigDecimal totalPrice);
    Booking confirmBookingPayment(UUID bookingId);
    List<Booking> getLeadBookings(UUID leadId);
    List<Booking> getOwnBookings(UUID employeeId);
    List<Booking> getAllBookings();

    // Activity timeline workflows
    LeadActivity logLeadActivity(UUID leadId, String activityType, String subject, String details);
    List<LeadActivity> getLeadTimeline(UUID leadId);

    // AI/Rule-based Lead scoring calculation
    Lead calculateAndUpdateLeadScore(UUID leadId);
}
