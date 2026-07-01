package com.realestate.twentyfourk.domain.payroll;

import com.realestate.twentyfourk.domain.user.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payroll")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PayrollController {

    private final PayrollService payrollService;

    // --- Payslips ---
    @Data
    public static class PayslipGenerateRequest {
        private UUID userId;
        private String payPeriod;
    }

    @PostMapping("/payslips/generate")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR')")
    public ResponseEntity<Payslip> generatePayslip(@RequestBody PayslipGenerateRequest request) {
        Payslip payslip = payrollService.generatePayslip(request.getUserId(), request.getPayPeriod());
        return ResponseEntity.ok(payslip);
    }

    @PatchMapping("/payslips/{id}/pay")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTS', 'HR')")
    public ResponseEntity<Payslip> markPaid(@PathVariable UUID id) {
        Payslip payslip = payrollService.markPayslipPaid(id);
        return ResponseEntity.ok(payslip);
    }

    @GetMapping("/payslips/my-payslips")
    public ResponseEntity<List<Payslip>> getMyPayslips(@AuthenticationPrincipal User user) {
        List<Payslip> payslips = payrollService.getEmployeePayslips(user.getId());
        return ResponseEntity.ok(payslips);
    }

    @GetMapping("/payslips/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTS', 'HR')")
    public ResponseEntity<List<Payslip>> getAllPayslips() {
        List<Payslip> payslips = payrollService.getAllPayslips();
        return ResponseEntity.ok(payslips);
    }

    // --- Expenses ---
    @Data
    public static class ExpenseSubmitRequest {
        private BigDecimal amount;
        private String category;
        private String description;
        private String receiptUrl;
    }

    @PostMapping("/expenses/submit")
    public ResponseEntity<Expense> submitExpense(
            @AuthenticationPrincipal User user,
            @RequestBody ExpenseSubmitRequest request) {
        Expense expense = payrollService.submitExpense(
                user.getId(),
                request.getAmount(),
                request.getCategory(),
                request.getDescription(),
                request.getReceiptUrl()
        );
        return ResponseEntity.ok(expense);
    }

    @Data
    public static class ExpenseProcessRequest {
        private String status; // APPROVED, REJECTED
    }

    @PatchMapping("/expenses/{id}/process")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTS')")
    public ResponseEntity<Expense> processExpense(
            @PathVariable UUID id,
            @AuthenticationPrincipal User manager,
            @RequestBody ExpenseProcessRequest request) {
        Expense expense = payrollService.processExpense(id, manager.getId(), request.getStatus());
        return ResponseEntity.ok(expense);
    }

    @GetMapping("/expenses/my-expenses")
    public ResponseEntity<List<Expense>> getMyExpenses(@AuthenticationPrincipal User user) {
        List<Expense> expenses = payrollService.getEmployeeExpenses(user.getId());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/expenses/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTS')")
    public ResponseEntity<List<Expense>> getPendingExpenses() {
        List<Expense> expenses = payrollService.getPendingExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/expenses/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTS')")
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = payrollService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }
}
