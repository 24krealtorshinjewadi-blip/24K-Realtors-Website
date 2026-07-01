package com.realestate.twentyfourk.domain.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, UUID> {
    Optional<Payslip> findByUserIdAndPayPeriod(UUID userId, String payPeriod);
    List<Payslip> findByUserId(UUID userId);
}
