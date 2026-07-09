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
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import com.realestate.twentyfourk.domain.lead.service.WhatsAppService;

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
    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;
    private final SmsService smsService;
    private final WhatsAppService whatsAppService;
    private final SecureRandom secureRandom = new SecureRandom();

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

        // Fire async welcome email via Resend (non-blocking, does not fail registration)
        final String savedEmail = user.getEmail();
        final String savedUsername = user.getUsername();
        if (savedEmail != null && !savedEmail.isBlank()) {
            CompletableFuture.runAsync(() -> emailService.sendWelcomeEmail(savedEmail, savedUsername));
        }

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

        // Generate 6-digit verification code securely
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        String tempToken = UUID.randomUUID().toString();

        // Expire OTP in 5 minutes
        OtpVerification verification = OtpVerification.builder()
                .tempToken(tempToken)
                .username(user.getUsername())
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .rememberDevice(request.rememberDevice())
                .build();

        // Clean up expired verification codes to keep DB clean
        try {
            otpVerificationRepository.deleteExpiredBefore(LocalDateTime.now());
        } catch (Exception e) {
            log.warn("Failed to clean up expired OTPs: {}", e.getMessage());
        }

        otpVerificationRepository.save(verification);

        // Dispatch OTP via email asynchronously to keep it non-blocking and robust
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            final String userEmail = user.getEmail();
            final String otpCode = otp;
            final String username = user.getUsername();
            CompletableFuture.runAsync(() -> {
                emailService.sendOtpEmail(userEmail, username, otpCode);
            });
        }

        // Dispatch OTP via mobile (SMS & WhatsApp) asynchronously to keep it non-blocking and robust
        if (user.getPhone() != null && !user.getPhone().isBlank()) {
            final String phone = user.getPhone();
            final String otpCode = otp;
            final String username = user.getUsername();
            CompletableFuture.runAsync(() -> {
                smsService.sendOtpSms(phone, username, otpCode);
                whatsAppService.sendOtpMessage(phone, username, otpCode);
            });
        }

        // Security logging of the generated OTP (critical for developer convenience)
        log.info("[SECURITY] Generated MFA OTP for user '{}': {}", user.getUsername(), otp);

        String maskedEmail = maskEmail(user.getEmail());

        // Temporarily return OTP in response for direct login convenience on screen
        String devOtp = otp;
        return ResponseEntity.ok(new LoginInitResponse(tempToken, maskedEmail, devOtp));
    }

    // Step 2: MFA OTP Verification
    @PostMapping("/login-verify")
    public ResponseEntity<?> loginVerify(@RequestBody LoginVerifyRequest request) {
        OtpVerification verification = otpVerificationRepository.findByTempToken(request.tempToken()).orElse(null);
 
        if (verification == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid temporary session token.");
        }
 
        if (verification.isExpired()) {
            try {
                otpVerificationRepository.delete(verification);
            } catch (Exception e) {
                log.warn("Failed to remove expired OTP: {}", e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Verification session has expired.");
        }
 
        if (!verification.getOtpCode().equals(request.code())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect verification code.");
        }
 
        // Successfully verified, clean up temporary registry
        try {
            otpVerificationRepository.delete(verification);
        } catch (Exception e) {
            log.warn("Failed to remove verified OTP: {}", e.getMessage());
        }

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
