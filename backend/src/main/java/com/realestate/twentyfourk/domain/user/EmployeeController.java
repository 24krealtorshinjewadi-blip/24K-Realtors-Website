package com.realestate.twentyfourk.domain.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor

public class EmployeeController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Data
    public static class EmployeeCreateRequest {
        private String username;
        private String password;
        private UserRole role;
        private String fullName;
        private String email;
        private String phone;
        private String designation;
        private String department;
        private LocalDate dateOfJoining;
        private BigDecimal salaryBase;
        private String panNumber;
        private String aadharNumber;
        private String bankName;
        private String bankAccountNumber;
        private String bankIfscCode;
    }

    @Data
    public static class EmployeeUpdateRequest {
        private UserRole role;
        private String fullName;
        private String email;
        private String phone;
        private String designation;
        private String department;
        private LocalDate dateOfJoining;
        private BigDecimal salaryBase;
        private String panNumber;
        private String aadharNumber;
        private String bankName;
        private String bankAccountNumber;
        private String bankIfscCode;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR')")
    public ResponseEntity<List<User>> getAllEmployees() {
        List<User> employees = userRepository.findByRoleNot(UserRole.GUEST);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR') or #id == authentication.principal.id")
    public ResponseEntity<User> getEmployeeById(@PathVariable UUID id) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR')")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeCreateRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        User employee = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "24KRealtors@Pune2026!"))
                .role(request.getRole() != null ? request.getRole() : UserRole.EMPLOYEE)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .designation(request.getDesignation())
                .department(request.getDepartment())
                .dateOfJoining(request.getDateOfJoining() != null ? request.getDateOfJoining() : LocalDate.now())
                .salaryBase(request.getSalaryBase() != null ? request.getSalaryBase() : BigDecimal.ZERO)
                .panNumber(request.getPanNumber())
                .aadharNumber(request.getAadharNumber())
                .bankName(request.getBankName())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankIfscCode(request.getBankIfscCode())
                .build();

        userRepository.save(employee);
        return new ResponseEntity<>(employee, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR') or #id == authentication.principal.id")
    public ResponseEntity<User> updateEmployee(
            @PathVariable UUID id,
            @RequestBody EmployeeUpdateRequest request) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));

        if (request.getRole() != null) {
            employee.setRole(request.getRole());
        }
        if (request.getFullName() != null) {
            employee.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            employee.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getDesignation() != null) {
            employee.setDesignation(request.getDesignation());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getDateOfJoining() != null) {
            employee.setDateOfJoining(request.getDateOfJoining());
        }
        if (request.getSalaryBase() != null) {
            employee.setSalaryBase(request.getSalaryBase());
        }
        if (request.getPanNumber() != null) {
            employee.setPanNumber(request.getPanNumber());
        }
        if (request.getAadharNumber() != null) {
            employee.setAadharNumber(request.getAadharNumber());
        }
        if (request.getBankName() != null) {
            employee.setBankName(request.getBankName());
        }
        if (request.getBankAccountNumber() != null) {
            employee.setBankAccountNumber(request.getBankAccountNumber());
        }
        if (request.getBankIfscCode() != null) {
            employee.setBankIfscCode(request.getBankIfscCode());
        }

        userRepository.save(employee);
        return ResponseEntity.ok(employee);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable UUID id) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));
        userRepository.delete(employee);
        return ResponseEntity.ok("Employee deactivated and soft deleted successfully.");
    }
}
