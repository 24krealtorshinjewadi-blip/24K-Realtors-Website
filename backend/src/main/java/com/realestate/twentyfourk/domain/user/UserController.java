package com.realestate.twentyfourk.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Admin-only User Management REST Controller.
 * Provides SUPER_ADMIN with the ability to list all registered users,
 * change user roles, and soft-delete users.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    // ─── DTOs ───────────────────────────────────────────────
    public record UserSummary(
            UUID id,
            String username,
            String fullName,
            String email,
            String phone,
            String role,
            String designation,
            String department,
            boolean activeFlag
    ) {}

    // ─── Endpoints ──────────────────────────────────────────

    /** GET /api/v1/users — list all users (SUPER_ADMIN only) */
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserSummary>> listAllUsers() {
        List<UserSummary> users = userRepository.findAll().stream()
                .map(u -> new UserSummary(
                        u.getId(),
                        u.getUsername(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.getRole().name(),
                        u.getDesignation(),
                        u.getDepartment(),
                        u.isActiveFlag()
                ))
                .toList();
        return ResponseEntity.ok(users);
    }

    /** PUT /api/v1/users/{id}/role — change a user's role (SUPER_ADMIN only) */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> changeRole(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));

        String newRole = body.get("role");
        if (newRole == null || newRole.isBlank()) {
            return ResponseEntity.badRequest().body("Role field is required.");
        }

        try {
            user.setRole(UserRole.valueOf(newRole.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " + newRole);
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Role updated to " + newRole));
    }

    /** DELETE /api/v1/users/{id} — soft-delete a user (SUPER_ADMIN only) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        userRepository.delete(user); // Triggers soft-delete via @SQLDelete
        return ResponseEntity.ok(Map.of("message", "User deactivated successfully."));
    }
}
