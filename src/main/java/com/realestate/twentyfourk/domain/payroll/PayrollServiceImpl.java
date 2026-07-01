package com.realestate.twentyfourk.domain.payroll;

import com.realestate.twentyfourk.domain.lead.Booking;
import com.realestate.twentyfourk.domain.lead.BookingRepository;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PayrollServiceImpl implements PayrollService {

    private final PayslipRepository payslipRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Override
    public Payslip generatePayslip(UUID userId, String payPeriod) {
        User employee = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + userId));

        Optional<Payslip> existing = payslipRepository.findByUserIdAndPayPeriod(userId, payPeriod);
        if (existing.isPresent()) {
            return existing.get(); // Avoid double generation
        }

        BigDecimal base = employee.getSalaryBase() != null ? employee.getSalaryBase() : BigDecimal.ZERO;
        
        // HRA = 40% of base, DA = 10% of base
        BigDecimal hra = base.multiply(new BigDecimal("0.40"));
        BigDecimal da = base.multiply(new BigDecimal("0.10"));
        BigDecimal allowances = hra.add(da);

        // Sum commissions earned during the payPeriod
        BigDecimal commissions = calculateCommissionsForPeriod(userId, payPeriod);

        // PF deduction = 12% of base
        BigDecimal pf = base.multiply(new BigDecimal("0.12"));
        // PT deduction = Flat 200 INR
        BigDecimal pt = base.compareTo(BigDecimal.ZERO) > 0 ? new BigDecimal("200.00") : BigDecimal.ZERO;

        BigDecimal netSalary = base.add(allowances).add(commissions).subtract(pf).subtract(pt);

        Payslip payslip = Payslip.builder()
                .user(employee)
                .payPeriod(payPeriod)
                .baseSalary(base)
                .allowances(allowances)
                .commissions(commissions)
                .pfDeduction(pf)
                .ptDeduction(pt)
                .netSalary(netSalary)
                .status("PENDING")
                .pdfUrl("https://twentyfourk-payslips.s3.ap-south-1.amazonaws.com/payslips/" + userId + "_" + payPeriod + ".pdf")
                .build();

        return payslipRepository.save(payslip);
    }

    @Override
    public Payslip markPayslipPaid(UUID payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new IllegalArgumentException("Payslip not found with ID: " + payslipId));
        payslip.setStatus("PAID");
        return payslipRepository.save(payslip);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payslip> getEmployeePayslips(UUID userId) {
        return payslipRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payslip> getAllPayslips() {
        return payslipRepository.findAll();
    }

    @Override
    public Expense submitExpense(UUID userId, BigDecimal amount, String category, String description, String receiptUrl) {
        User employee = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + userId));

        Expense expense = Expense.builder()
                .user(employee)
                .amount(amount)
                .category(category)
                .description(description)
                .receiptUrl(receiptUrl != null ? receiptUrl : "https://twentyfourk-receipts.s3.amazonaws.com/receipts/placeholder.png")
                .status("PENDING")
                .build();

        return expenseRepository.save(expense);
    }

    @Override
    public Expense processExpense(UUID expenseId, UUID managerId, String status) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense record not found with ID: " + expenseId));

        if (!"PENDING".equals(expense.getStatus())) {
            throw new IllegalStateException("Expense has already been processed: " + expense.getStatus());
        }

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + managerId));

        expense.setStatus(status);
        expense.setApprovedBy(manager);
        
        return expenseRepository.save(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getEmployeeExpenses(UUID userId) {
        return expenseRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getPendingExpenses() {
        return expenseRepository.findByStatus("PENDING");
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    private BigDecimal calculateCommissionsForPeriod(UUID userId, String payPeriod) {
        try {
            int year = Integer.parseInt(payPeriod.split("-")[0]);
            int month = Integer.parseInt(payPeriod.split("-")[1]);
            
            LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime end = start.plusMonths(1).minusSeconds(1);

            List<Booking> bookings = bookingRepository.findByAssignedUserId(userId);
            return bookings.stream()
                    .filter(b -> b.isPaymentReceived() && 
                                 b.getCreatedDate().isAfter(start) && 
                                 b.getCreatedDate().isBefore(end))
                    .map(Booking::getCommissionEarned)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
}
