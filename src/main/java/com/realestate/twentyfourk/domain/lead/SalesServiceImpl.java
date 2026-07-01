package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.property.Property;
import com.realestate.twentyfourk.domain.property.PropertyRepository;
import com.realestate.twentyfourk.domain.property.PropertyStatus;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SalesServiceImpl implements SalesService {

    private final SiteVisitRepository siteVisitRepository;
    private final BookingRepository bookingRepository;
    private final LeadActivityRepository activityRepository;
    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Override
    public SiteVisit scheduleSiteVisit(UUID leadId, UUID propertyId, UUID assignedUserId, LocalDateTime visitTime) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with ID: " + leadId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with ID: " + propertyId));
        User user = userRepository.findById(assignedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + assignedUserId));

        SiteVisit visit = SiteVisit.builder()
                .lead(lead)
                .property(property)
                .assignedUser(user)
                .visitTime(visitTime)
                .status("SCHEDULED")
                .build();

        SiteVisit saved = siteVisitRepository.save(visit);

        // Update lead status to reflect activity
        if (lead.getStatus() == LeadStatus.NEW) {
            lead.setStatus(LeadStatus.IN_PROGRESS);
            leadRepository.save(lead);
        }

        logLeadActivity(leadId, "MEETING", "Site Visit Scheduled", 
                "Scheduled tour for property: '" + property.getTitle() + "' at " + visitTime.toString());
        calculateAndUpdateLeadScore(leadId);

        return saved;
    }

    @Override
    public SiteVisit recordVisitCheckIn(UUID visitId, Double lat, Double lon) {
        SiteVisit visit = siteVisitRepository.findById(visitId)
                .orElseThrow(() -> new IllegalArgumentException("Site visit not found with ID: " + visitId));

        visit.setCheckedInLat(lat);
        visit.setCheckedInLon(lon);
        visit.setCheckedInTime(LocalDateTime.now());
        
        logLeadActivity(visit.getLead().getId(), "MEETING", "Site Visit Check-In", 
                "Agent checked in at property location: " + lat + ", " + lon);

        return siteVisitRepository.save(visit);
    }

    @Override
    public SiteVisit completeSiteVisit(UUID visitId, String feedback) {
        SiteVisit visit = siteVisitRepository.findById(visitId)
                .orElseThrow(() -> new IllegalArgumentException("Site visit not found with ID: " + visitId));

        visit.setStatus("COMPLETED");
        visit.setFeedback(feedback);

        Lead lead = visit.getLead();
        lead.setStatus(LeadStatus.VISITED);
        leadRepository.save(lead);

        logLeadActivity(lead.getId(), "MEETING", "Site Visit Completed", 
                "Feedback recorded: " + feedback);
        calculateAndUpdateLeadScore(lead.getId());

        return siteVisitRepository.save(visit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteVisit> getLeadSiteVisits(UUID leadId) {
        return siteVisitRepository.findByLeadId(leadId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteVisit> getOwnSiteVisits(UUID employeeId) {
        return siteVisitRepository.findByAssignedUserId(employeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteVisit> getAllSiteVisits() {
        return siteVisitRepository.findAll();
    }

    @Override
    public Booking createBooking(UUID leadId, UUID propertyId, UUID assignedUserId, BigDecimal bookingAmount, BigDecimal totalPrice) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with ID: " + leadId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with ID: " + propertyId));
        User user = userRepository.findById(assignedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + assignedUserId));

        // Default 2% commission calculation
        BigDecimal commissionRate = new BigDecimal("2.00");
        BigDecimal commissionEarned = totalPrice.multiply(new BigDecimal("0.02"));

        Booking booking = Booking.builder()
                .lead(lead)
                .property(property)
                .assignedUser(user)
                .bookingAmount(bookingAmount)
                .totalPrice(totalPrice)
                .commissionRate(commissionRate)
                .commissionEarned(commissionEarned)
                .status("PENDING")
                .build();

        Booking saved = bookingRepository.save(booking);

        logLeadActivity(leadId, "SYSTEM", "Booking Form Created", 
                "Booking pending approval for property: '" + property.getTitle() + "' with amount: ₹" + bookingAmount);

        return saved;
    }

    @Override
    public Booking confirmBookingPayment(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking record not found with ID: " + bookingId));

        booking.setPaymentReceived(true);
        booking.setStatus("APPROVED");
        booking.setAgreementUrl("https://twentyfourk-agreements.s3.ap-south-1.amazonaws.com/agreements/" + bookingId + ".pdf");

        // Mark property as sold/unavailable
        Property property = booking.getProperty();
        property.setStatus(PropertyStatus.SOLD);
        propertyRepository.save(property);

        // Update lead status to Converted
        Lead lead = booking.getLead();
        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);

        logLeadActivity(lead.getId(), "SYSTEM", "Booking Approved", 
                "Payment cleared. Agreement PDF generated: " + booking.getAgreementUrl());
        calculateAndUpdateLeadScore(lead.getId());

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getLeadBookings(UUID leadId) {
        return bookingRepository.findByLeadId(leadId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getOwnBookings(UUID employeeId) {
        return bookingRepository.findByAssignedUserId(employeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public LeadActivity logLeadActivity(UUID leadId, String activityType, String subject, String details) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with ID: " + leadId));

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .activityType(activityType)
                .subject(subject)
                .details(details)
                .build();

        return activityRepository.save(activity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadActivity> getLeadTimeline(UUID leadId) {
        return activityRepository.findByLeadIdOrderByCreatedDateDesc(leadId);
    }

    @Override
    public Lead calculateAndUpdateLeadScore(UUID leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with ID: " + leadId));

        int score = 50; // base

        // Note weight
        if (lead.getNotes() != null && !lead.getNotes().isEmpty()) {
            score += 10;
        }

        // Budget weight
        if (lead.getBudgetMax() != null && lead.getBudgetMax().compareTo(new BigDecimal("10000000")) >= 0) {
            score += 20; // > 1 Cr
        }

        // Location priority
        if (lead.getPreferredLocation() == PrimeCorridor.BANER || lead.getPreferredLocation() == PrimeCorridor.HINJEWADI) {
            score += 15;
        }

        // Tour activity weight
        long completedVisits = siteVisitRepository.findByLeadId(leadId).stream()
                .filter(v -> "COMPLETED".equals(v.getStatus()))
                .count();
        score += (completedVisits * 15);

        // Cap score at 100
        lead.setLeadScore(Math.min(score, 100));
        return leadRepository.save(lead);
    }
}
