package com.realestate.twentyfourk.domain.customer;

import com.realestate.twentyfourk.domain.customer.dto.CustomerRequest;
import com.realestate.twentyfourk.domain.customer.dto.CustomerResponse;
import com.realestate.twentyfourk.domain.customer.dto.CustomerStatsResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER')")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<CustomerResponse>> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CustomerType type,
            @RequestParam(required = false) KycStatus kycStatus,
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<CustomerResponse> customers = customerService.getAllCustomers(search, type, kycStatus, pageable);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable UUID id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable UUID id,
            @Valid @RequestBody CustomerRequest request
    ) {
        CustomerResponse updated = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/kyc")
    public ResponseEntity<CustomerResponse> updateKycStatus(
            @PathVariable UUID id,
            @RequestParam KycStatus status
    ) {
        CustomerResponse updated = customerService.updateKycStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/convert-lead/{leadId}")
    public ResponseEntity<CustomerResponse> convertLeadToCustomer(@PathVariable UUID leadId) {
        CustomerResponse customer = customerService.convertLeadToCustomer(leadId);
        return ResponseEntity.status(HttpStatus.CREATED).body(customer);
    }

    @GetMapping("/stats")
    public ResponseEntity<CustomerStatsResponse> getStats() {
        CustomerStatsResponse stats = customerService.getStats();
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable UUID id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
