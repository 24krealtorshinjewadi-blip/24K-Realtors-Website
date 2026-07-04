package com.realestate.twentyfourk.domain.payroll;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PayrollService {
    // Payslip workflows
    Payslip generatePayslip(UUID userId, String payPeriod);
    Payslip markPayslipPaid(UUID payslipId);
    List<Payslip> getEmployeePayslips(UUID userId);
    List<Payslip> getAllPayslips();

    // Expense workflows
    Expense submitExpense(UUID userId, BigDecimal amount, String category, String description, String receiptUrl);
    Expense processExpense(UUID expenseId, UUID managerId, String status);
    List<Expense> getEmployeeExpenses(UUID userId);
    List<Expense> getPendingExpenses();
    List<Expense> getAllExpenses();
}
