package com.realestate.twentyfourk.domain.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByUserId(UUID userId);
    List<Expense> findByStatus(String status);
}
