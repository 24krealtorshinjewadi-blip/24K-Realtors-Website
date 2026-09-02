package com.realestate.twentyfourk.domain.customer;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import com.realestate.twentyfourk.domain.audit.AuditLogService;
import com.realestate.twentyfourk.domain.customer.dto.CustomerRequest;
import com.realestate.twentyfourk.domain.customer.dto.CustomerResponse;
import com.realestate.twentyfourk.domain.customer.dto.CustomerStatsResponse;
import com.realestate.twentyfourk.domain.lead.Booking;
import com.realestate.twentyfourk.domain.lead.BookingRepository;
import com.realestate.twentyfourk.domain.lead.Lead;
import com.realestate.twentyfourk.domain.lead.LeadRepository;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final AgentRepository agentRepository;
    private final BookingRepository bookingRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        log.info("Creating new customer: {} ({})", request.name(), request.phone());

        Agent agent = null;
        if (request.assignedAgentId() != null) {
            agent = agentRepository.findById(request.assignedAgentId()).orElse(null);
        }

        Customer customer = Customer.builder()
                .name(request.name().trim())
                .phone(request.phone().trim())
                .email(request.email() != null && !request.email().isBlank() ? request.email().trim() : null)
                .alternatePhone(request.alternatePhone())
                .panNumber(request.panNumber() != null ? request.panNumber().toUpperCase().trim() : null)
                .aadharNumber(request.aadharNumber())
                .city(request.city() != null && !request.city().isBlank() ? request.city() : "Pune")
                .state(request.state() != null && !request.state().isBlank() ? request.state() : "Maharashtra")
                .address(request.address())
                .customerType(request.customerType() != null ? request.customerType() : CustomerType.INDIVIDUAL_BUYER)
                .kycStatus(request.kycStatus() != null ? request.kycStatus() : KycStatus.PENDING)
                .totalInvestmentAmount(request.totalInvestmentAmount() != null ? request.totalInvestmentAmount() : BigDecimal.ZERO)
                .assignedAgent(agent)
                .notes(request.notes())
                .build();

        Customer saved = customerRepository.save(customer);
        auditLogService.logAction("CREATE_CUSTOMER", "Customer", saved.getId(), null, saved.getName());
        return mapToResponse(saved);
    }

    @Override
    public CustomerResponse getCustomerById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return mapToResponse(customer);
    }

    @Override
    public Page<CustomerResponse> getAllCustomers(String search, CustomerType type, KycStatus kyc, Pageable pageable) {
        String cleanSearch = (search != null && !search.trim().isBlank()) ? search.trim() : null;
        Page<Customer> page = customerRepository.searchCustomers(cleanSearch, type, kyc, pageable);
        return page.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(UUID id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        customer.setName(request.name().trim());
        customer.setPhone(request.phone().trim());
        if (request.email() != null) customer.setEmail(request.email().trim());
        if (request.alternatePhone() != null) customer.setAlternatePhone(request.alternatePhone().trim());
        if (request.panNumber() != null) customer.setPanNumber(request.panNumber().toUpperCase().trim());
        if (request.aadharNumber() != null) customer.setAadharNumber(request.aadharNumber().trim());
        if (request.city() != null) customer.setCity(request.city());
        if (request.state() != null) customer.setState(request.state());
        if (request.address() != null) customer.setAddress(request.address());
        if (request.customerType() != null) customer.setCustomerType(request.customerType());
        if (request.kycStatus() != null) customer.setKycStatus(request.kycStatus());
        if (request.totalInvestmentAmount() != null) customer.setTotalInvestmentAmount(request.totalInvestmentAmount());
        if (request.notes() != null) customer.setNotes(request.notes());

        if (request.assignedAgentId() != null) {
            Agent agent = agentRepository.findById(request.assignedAgentId()).orElse(null);
            customer.setAssignedAgent(agent);
        }

        Customer updated = customerRepository.save(customer);
        auditLogService.logAction("UPDATE_CUSTOMER", "Customer", updated.getId(), null, updated.getName());
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public CustomerResponse updateKycStatus(UUID id, KycStatus status) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        KycStatus oldStatus = customer.getKycStatus();
        customer.setKycStatus(status);
        Customer updated = customerRepository.save(customer);
        auditLogService.logAction("UPDATE_KYC_STATUS", "Customer", updated.getId(), oldStatus.name(), status.name());
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public CustomerResponse convertLeadToCustomer(UUID leadId) {
        log.info("Converting Lead {} into permanent Customer 360 profile", leadId);
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + leadId));

        // Check if customer already exists for this lead or phone
        Customer existing = customerRepository.findByConvertedFromLead_Id(leadId)
                .or(() -> customerRepository.findByPhone(lead.getPhone()))
                .orElse(null);

        if (existing != null) {
            log.info("Customer profile already exists for lead/phone: ID {}", existing.getId());
            return mapToResponse(existing);
        }

        // Determine Customer Type based on budget
        CustomerType customerType = CustomerType.INDIVIDUAL_BUYER;
        if (lead.getBudgetMax() != null && lead.getBudgetMax().compareTo(new BigDecimal("25000000")) >= 0) {
            customerType = CustomerType.HNI_INVESTOR;
        }

        // Find existing bookings for this lead to calculate total portfolio value
        List<Booking> bookings = bookingRepository.findByLeadId(leadId);
        BigDecimal totalInvested = bookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Customer customer = Customer.builder()
                .name(lead.getName())
                .phone(lead.getPhone())
                .email(lead.getEmail())
                .city(lead.getPreferredLocation() != null ? lead.getPreferredLocation().name() : "Pune")
                .state("Maharashtra")
                .customerType(customerType)
                .kycStatus(KycStatus.PENDING)
                .totalInvestmentAmount(totalInvested)
                .convertedFromLead(lead)
                .assignedAgent(lead.getAssignedAgent())
                .notes("Converted from CRM Lead: " + (lead.getNotes() != null ? lead.getNotes() : "No initial notes"))
                .build();

        Customer saved = customerRepository.save(customer);

        // Link bookings to customer
        for (Booking booking : bookings) {
            booking.setCustomer(saved);
            bookingRepository.save(booking);
        }

        // Update lead status to CONVERTED
        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);

        auditLogService.logAction("CONVERT_LEAD_TO_CUSTOMER", "Customer", saved.getId(), "Lead:" + leadId, saved.getName());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCustomer(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        customerRepository.delete(customer);
        auditLogService.logAction("DELETE_CUSTOMER", "Customer", id, customer.getName(), "DELETED");
    }

    @Override
    public CustomerStatsResponse getStats() {
        long total = customerRepository.count();
        long hni = customerRepository.countByCustomerType(CustomerType.HNI_INVESTOR);
        long nri = customerRepository.countByCustomerType(CustomerType.NRI_INVESTOR);
        long individual = customerRepository.countByCustomerType(CustomerType.INDIVIDUAL_BUYER);
        long verified = customerRepository.countByKycStatus(KycStatus.VERIFIED);
        long pending = customerRepository.countByKycStatus(KycStatus.PENDING);
        BigDecimal totalPortfolio = customerRepository.sumTotalInvestmentAmount();

        return new CustomerStatsResponse(total, hni, nri, individual, verified, pending, totalPortfolio);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        List<CustomerResponse.CustomerBookingSummary> bookingSummaries = Collections.emptyList();
        if (customer.getBookings() != null && !customer.getBookings().isEmpty()) {
            bookingSummaries = customer.getBookings().stream()
                    .map(b -> new CustomerResponse.CustomerBookingSummary(
                            b.getId(),
                            b.getProperty() != null ? b.getProperty().getTitle() : "24K Premium Property",
                            b.getProperty() != null && b.getProperty().getLocation() != null ? b.getProperty().getLocation().name() : "Pune",
                            b.getTotalPrice(),
                            b.getStatus() != null ? b.getStatus() : "BOOKED",
                            b.isPaymentReceived(),
                            b.getCreatedDate()
                    ))
                    .collect(Collectors.toList());
        }

        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getAlternatePhone(),
                customer.getPanNumber(),
                customer.getAadharNumber(),
                customer.getCity(),
                customer.getState(),
                customer.getAddress(),
                customer.getCustomerType(),
                customer.getKycStatus(),
                customer.getTotalInvestmentAmount(),
                customer.getConvertedFromLead() != null ? customer.getConvertedFromLead().getId() : null,
                customer.getAssignedAgent() != null ? customer.getAssignedAgent().getName() : null,
                customer.getAssignedAgent() != null ? customer.getAssignedAgent().getPhone() : null,
                customer.getNotes(),
                bookingSummaries.size(),
                customer.getCreatedDate(),
                bookingSummaries
        );
    }
}
