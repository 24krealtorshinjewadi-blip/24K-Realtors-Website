package com.realestate.twentyfourk.domain.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID>, JpaSpecificationExecutor<Customer> {

    Optional<Customer> findByPhone(String phone);

    Optional<Customer> findByConvertedFromLead_Id(UUID leadId);

    long countByCustomerType(CustomerType customerType);

    long countByKycStatus(KycStatus kycStatus);

    @Query("SELECT COALESCE(SUM(c.totalInvestmentAmount), 0) FROM Customer c WHERE c.deletedFlag = false")
    BigDecimal sumTotalInvestmentAmount();

    @Query("SELECT c FROM Customer c WHERE c.deletedFlag = false " +
           "AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR c.phone LIKE CONCAT('%', :search, '%') " +
           "    OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:type IS NULL OR c.customerType = :type) " +
           "AND (:kyc IS NULL OR c.kycStatus = :kyc)")
    Page<Customer> searchCustomers(
            @Param("search") String search,
            @Param("type") CustomerType type,
            @Param("kyc") KycStatus kyc,
            Pageable pageable
    );
}
