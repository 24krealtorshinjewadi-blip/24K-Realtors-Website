package com.realestate.twentyfourk.domain.dashboard;

import com.realestate.twentyfourk.domain.lead.LeadRepository;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.domain.property.PropertyRepository;
import com.realestate.twentyfourk.domain.property.PropertyStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalLeads = leadRepository.count();
        long newLeads = leadRepository.countByStatus(LeadStatus.NEW);
        
        long contactedLeads = leadRepository.countByStatus(LeadStatus.IN_PROGRESS)
                + leadRepository.countByStatus(LeadStatus.CONTACTED)
                + leadRepository.countByStatus(LeadStatus.VISITED);
                
        long convertedLeads = leadRepository.countByStatus(LeadStatus.CONVERTED);
        long activeProperties = propertyRepository.countByStatus(PropertyStatus.AVAILABLE);

        Map<String, Object> stats = Map.of(
                "totalLeads", totalLeads,
                "newLeads", newLeads,
                "contactedLeads", contactedLeads,
                "convertedLeads", convertedLeads,
                "activeProperties", activeProperties
        );
        return ResponseEntity.ok(stats);
    }
}
