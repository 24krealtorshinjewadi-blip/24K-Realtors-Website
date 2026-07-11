package com.realestate.twentyfourk.domain.user;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // --- DTOs ---
    @Data
    public static class ProfileUpdateRequest {
        @NotBlank(message = "Full name cannot be blank")
        private String fullName;

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        private String phone;
    }

    @Data
    public static class PasswordChangeRequest {
        @NotBlank(message = "Current password is required")
        private String oldPassword;

        @NotBlank(message = "New password is required")
        private String newPassword;
    }

    public record UserProfileResponse(
            String username,
            String role,
            String fullName,
            String email,
            String phone,
            String designation,
            String department
    ) {}

    // --- Endpoints ---

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Logged in user not found"));

        return ResponseEntity.ok(new UserProfileResponse(
                user.getUsername(),
                user.getRole().name(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getDesignation(),
                user.getDepartment()
        ));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Logged in user not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return ResponseEntity.ok(new UserProfileResponse(
                user.getUsername(),
                user.getRole().name(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getDesignation(),
                user.getDepartment()
        ));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Logged in user not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect current password"));
        }

        if (request.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 8 characters long"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
