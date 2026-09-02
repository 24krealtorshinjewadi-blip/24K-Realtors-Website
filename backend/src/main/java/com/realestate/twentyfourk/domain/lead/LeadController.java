package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.lead.dto.LeadRequest;
import com.realestate.twentyfourk.domain.lead.dto.LeadResponse;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRole;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor

public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(@Valid @RequestBody LeadRequest request) {
        LeadResponse created = leadService.createLead(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(@PathVariable UUID id) {
        LeadResponse lead = leadService.getLeadById(id);
        return ResponseEntity.ok(lead);
    }

    /**
     * Privacy-enforced lead listing:
     * - RELATIONSHIP_MANAGER: sees ONLY their own assigned leads
     * - All others (ADMIN, SUPER_ADMIN, SALES_MANAGER): see all leads
     */
    @GetMapping
    public ResponseEntity<Page<LeadResponse>> getAllLeads(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) PrimeCorridor preferredLocation,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        // Privacy gate: RM only sees own leads
        if (currentUser != null && currentUser.getRole() == UserRole.RELATIONSHIP_MANAGER) {
            Page<LeadResponse> myLeads = leadService.getMyLeads(currentUser.getEmail(), status, pageRequest);
            return ResponseEntity.ok(myLeads);
        }

        Page<LeadResponse> leads = leadService.getAllLeads(status, preferredLocation, pageRequest);
        return ResponseEntity.ok(leads);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable UUID id,
            @Valid @RequestBody LeadRequest request
    ) {
        LeadResponse updated = leadService.updateLead(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LeadResponse> patchLead(
            @PathVariable UUID id,
            @Valid @RequestBody LeadRequest request
    ) {
        LeadResponse updated = leadService.updateLead(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LeadResponse> updateLeadStatus(
            @PathVariable UUID id,
            @RequestParam LeadStatus status
    ) {
        LeadResponse updated = leadService.updateLeadStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/assign/{agentId}")
    public ResponseEntity<LeadResponse> assignAgent(
            @PathVariable UUID id,
            @PathVariable UUID agentId
    ) {
        LeadResponse updated = leadService.assignAgent(id, agentId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable UUID id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
