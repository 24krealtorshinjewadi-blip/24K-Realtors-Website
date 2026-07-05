package com.realestate.twentyfourk.security;

import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import com.realestate.twentyfourk.domain.user.UserRole;
import com.realestate.twentyfourk.domain.user.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    // In-memory registry for temporary OTP verification states (expires in 5 minutes)
    private final ConcurrentHashMap<String, OtpVerification> otpVerifications = new ConcurrentHashMap<>();

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    // DTO records
    public record RegisterRequest(String username, String password, UserRole role) {}
    public record LoginRequest(String username, String password) {}
    public record AuthResponse(String token, String refreshToken, String username, String role, String fullName) {}
    public record TokenRefreshRequest(String refreshToken) {}
    public record TokenRefreshResponse(String accessToken, String refreshToken) {}

    // Multi-factor authentication DTOs
    public record LoginInitRequest(String username, String password, boolean rememberDevice) {}
    public record LoginInitResponse(String tempToken, String emailMasked, String devMockOtp) {}
    public record LoginVerifyRequest(String tempToken, String code) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        if (!isPasswordStrong(request.password())) {
            return ResponseEntity.badRequest().body("Password validation failed: Password must be at least 8 characters long, contain at least one uppercase letter and one digit.");
        }

        UserRole role = request.role() != null ? request.role() : UserRole.GUEST;

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
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

    // Classic single-phase login (retained for backward compatibility)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        refreshTokenService.deleteByUserId(user.getId());

        String token = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new AuthResponse(
                token, 
                refreshToken.getToken(), 
                user.getUsername(), 
                user.getRole().name(),
                user.getFullName()
        ));
    }

    // Step 1: MFA Authentication Initialization
    @PostMapping("/login-init")
    public ResponseEntity<?> loginInit(@RequestBody LoginInitRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        // Generate 6-digit verification code
        String otp = String.format("%06d", new Random().nextInt(1000000));
        String tempToken = UUID.randomUUID().toString();

        // Expire OTP in 5 minutes
        OtpVerification verification = OtpVerification.builder()
                .tempToken(tempToken)
                .username(user.getUsername())
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .rememberDevice(request.rememberDevice())
                .build();

        otpVerifications.put(tempToken, verification);

        // Security logging of the generated OTP (critical for developer convenience)
        log.info("[SECURITY] Generated MFA OTP for user '{}': {}", user.getUsername(), otp);

        String maskedEmail = maskEmail(user.getEmail());

        // We also send the OTP in response as a devMockOtp ONLY if running locally (dev/default profiles)
        boolean isDev = activeProfile != null && (activeProfile.contains("dev") || activeProfile.contains("default"));
        String devOtp = isDev ? otp : null;
        return ResponseEntity.ok(new LoginInitResponse(tempToken, maskedEmail, devOtp));
    }

    // Step 2: MFA OTP Verification
    @PostMapping("/login-verify")
    public ResponseEntity<?> loginVerify(@RequestBody LoginVerifyRequest request) {
        OtpVerification verification = otpVerifications.get(request.tempToken());

        if (verification == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid temporary session token.");
        }

        if (verification.isExpired()) {
            otpVerifications.remove(request.tempToken());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Verification session has expired.");
        }

        if (!verification.getOtpCode().equals(request.code())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect verification code.");
        }

        // Successfully verified, clean up temporary registry
        otpVerifications.remove(request.tempToken());

        User user = userRepository.findByUsername(verification.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found during verify"));

        refreshTokenService.deleteByUserId(user.getId());

        String token = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new AuthResponse(
                token,
                refreshToken.getToken(),
                user.getUsername(),
                user.getRole().name(),
                user.getFullName()
        ));
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "e***@24krealtors.com";
        }
        int atIndex = email.indexOf("@");
        String name = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (name.length() <= 2) {
            return name + "***" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + domain;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.refreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(t -> t.getUser())
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
