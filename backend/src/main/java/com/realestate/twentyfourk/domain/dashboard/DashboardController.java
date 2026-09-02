package com.realestate.twentyfourk.domain.dashboard;

import com.realestate.twentyfourk.domain.lead.BookingRepository;
import com.realestate.twentyfourk.domain.lead.LeadRepository;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.domain.lead.SiteVisitRepository;
import com.realestate.twentyfourk.domain.property.PropertyRepository;
import com.realestate.twentyfourk.domain.property.PropertyStatus;
import com.realestate.twentyfourk.domain.task.FollowUpTaskRepository;
import com.realestate.twentyfourk.domain.task.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CRM_ADMIN','SALES_MANAGER','RELATIONSHIP_MANAGER','TELECALLER','HR','ACCOUNTS','EMPLOYEE')")
public class DashboardController {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final SiteVisitRepository siteVisitRepository;
    private final FollowUpTaskRepository followUpTaskRepository;

    /**
     * Returns key CRM dashboard metrics from the live database.
     * Secured — requires any authenticated CRM user role.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        // Lead counts
        long totalLeads       = leadRepository.count();
        long newLeads         = leadRepository.countByStatus(LeadStatus.NEW);
        long contactedLeads   = leadRepository.countByStatus(LeadStatus.CONTACTED)
                              + leadRepository.countByStatus(LeadStatus.IN_PROGRESS)
                              + leadRepository.countByStatus(LeadStatus.VISITED);
        long qualifiedLeads   = leadRepository.countByStatus(LeadStatus.QUALIFIED)
                              + leadRepository.countByStatus(LeadStatus.FOLLOW_UP);
        long negotiationLeads = leadRepository.countByStatus(LeadStatus.NEGOTIATION);
        long wonLeads         = leadRepository.countByStatus(LeadStatus.WON)
                              + leadRepository.countByStatus(LeadStatus.CONVERTED);
        long lostLeads        = leadRepository.countByStatus(LeadStatus.LOST);

        // Property
        long activeProperties = propertyRepository.countByStatus(PropertyStatus.AVAILABLE);

        // Bookings
        long totalBookings = bookingRepository.count();

        // Site visits
        long totalSiteVisits     = siteVisitRepository.count();
        long completedSiteVisits = siteVisitRepository.countByStatus("COMPLETED");
        long scheduledSiteVisits = siteVisitRepository.countByStatus("SCHEDULED");

        // Follow-up tasks
        long pendingFollowUps = followUpTaskRepository.countByStatus(TaskStatus.PENDING);
        long overdueFollowUps = followUpTaskRepository.countByStatus(TaskStatus.OVERDUE);

        // Conversion rate: WON / totalLeads (avoid division by zero)
        double conversionRate = totalLeads > 0
                ? Math.round(((double) wonLeads / totalLeads) * 10000.0) / 100.0
                : 0.0;

        // Total revenue from confirmed bookings
        BigDecimal totalRevenue = bookingRepository.sumTotalPrice();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalLeads", totalLeads);
        stats.put("newLeads", newLeads);
        stats.put("contactedLeads", contactedLeads);
        stats.put("qualifiedLeads", qualifiedLeads);
        stats.put("negotiationLeads", negotiationLeads);
        stats.put("wonLeads", wonLeads);
        stats.put("lostLeads", lostLeads);
        stats.put("activeProperties", activeProperties);
        stats.put("totalBookings", totalBookings);
        stats.put("totalSiteVisits", totalSiteVisits);
        stats.put("completedSiteVisits", completedSiteVisits);
        stats.put("scheduledSiteVisits", scheduledSiteVisits);
        stats.put("pendingFollowUps", pendingFollowUps);
        stats.put("overdueFollowUps", overdueFollowUps);
        stats.put("conversionRate", conversionRate);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }
}
