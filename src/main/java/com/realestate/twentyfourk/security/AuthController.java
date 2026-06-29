package com.realestate.twentyfourk.security;

import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import com.realestate.twentyfourk.domain.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // DTO records
    public record RegisterRequest(String username, String password) {}
    public record LoginRequest(String username, String password) {}
    public record AuthResponse(String token, String username) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        if (!isPasswordStrong(request.password())) {
            return ResponseEntity.badRequest().body("Password validation failed: Password must be at least 8 characters long, contain at least one uppercase letter and one digit.");
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role(UserRole.ADMIN) // Default all registered users as ADMIN for this platform CRM
                .build();

        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    private boolean isPasswordStrong(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        boolean hasNum = false;
        boolean hasUpper = false;
        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) hasNum = true;
            if (Character.isUpperCase(c)) hasUpper = true;
        }
        return hasNum && hasUpper;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
    }
}
