package com.realestate.twentyfourk.domain.customer;

import com.realestate.twentyfourk.domain.customer.dto.CustomerRequest;
import com.realestate.twentyfourk.domain.customer.dto.CustomerResponse;
import com.realestate.twentyfourk.domain.customer.dto.CustomerStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest request);

    CustomerResponse getCustomerById(UUID id);

    Page<CustomerResponse> getAllCustomers(String search, CustomerType type, KycStatus kyc, Pageable pageable);

    CustomerResponse updateCustomer(UUID id, CustomerRequest request);

    CustomerResponse updateKycStatus(UUID id, KycStatus status);

    CustomerResponse convertLeadToCustomer(UUID leadId);

    void deleteCustomer(UUID id);

    CustomerStatsResponse getStats();
}
