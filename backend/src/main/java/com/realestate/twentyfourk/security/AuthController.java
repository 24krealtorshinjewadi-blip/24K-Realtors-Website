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
    public record GoogleLoginRequest(String credential) {}
    public record MicrosoftLoginRequest(String credential) {}

    // Multi-factor authentication DTOs
    public record LoginInitRequest(String username, String password, boolean rememberDevice) {}
    public record LoginInitResponse(String tempToken, String emailMasked, String devMockOtp) {}
    public record LoginVerifyRequest(String tempToken, String code) {}

    // ── SaaS Identifier-First Login DTOs ────────────────────────────────
    /** Step 1: client sends email OR mobile. Backend auto-detects, sends OTP. */
    public record IdentifyRequest(String identifier) {}
    public record IdentifyResponse(
            String tempToken,
            String identifierType,       // "EMAIL" | "MOBILE"
            String maskedIdentifier,     // m***h@gmail.com  or  +91 ****3210
            boolean hasPassword,         // false → passwordless only
            boolean passwordlessEnabled, // user toggled passwordless in settings
            String devMockOtp            // non-null only on dev profile
    ) {}

    /** Step 2a: OTP-based verify */
    public record VerifyOtpRequest(String tempToken, String otp) {}

    /** Step 2b: Password-based verify (identifier-first) */
    public record PasswordLoginRequest(String identifier, String password) {}

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

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        log.info("Received Google login request with credential length: {}", request.credential() != null ? request.credential().length() : 0);
        try {
            String[] parts = request.credential().split("\\.");
            if (parts.length < 2) {
                return ResponseEntity.badRequest().body("Invalid Google token format.");
            }
            
            String payloadJson = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            log.info("Google ID Token payload: {}", payloadJson);
            
            String email = getValueFromJson(payloadJson, "email");
            String name = getValueFromJson(payloadJson, "name");
            
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body("Could not resolve email from Google Identity.");
            }
            
            String username = email.split("@")[0].toLowerCase();
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                var optUser = userRepository.findAll().stream()
                        .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                        .findFirst();
                if (optUser.isPresent()) {
                    user = optUser.get();
                }
            }
            
            if (user == null) {
                user = User.builder()
                        .username(username)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .email(email)
                        .fullName(name != null ? name : username)
                        .role(UserRole.CRM_ADMIN)
                        .designation("Google Authorized Advisor")
                        .department("Brokerage Operations")
                        .dateOfJoining(java.time.LocalDate.now())
                        .build();
                userRepository.save(user);
                log.info("New Google user registered: {}", username);
            }
            
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
        } catch (Exception e) {
            log.error("Google Authentication failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google Authentication failed: " + e.getMessage());
        }
    }
    
    private String getValueFromJson(String json, String key) {
        try {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]+)\"");
            java.util.regex.Matcher matcher = pattern.matcher(json);
            if (matcher.find()) {
                return matcher.group(1);
            }
        } catch (Exception e) {
            log.warn("Failed to extract key '{}' from json", key);
        }
        return null;
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

        // Expose OTP in response only on development environment
        String devOtp = "dev".equalsIgnoreCase(activeProfile) ? otp : null;
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

    // ════════════════════════════════════════════════════════════════════
    // NEW: SaaS Identifier-First Login Flow
    // ════════════════════════════════════════════════════════════════════

    /**
     * Step 1 — Identify: client sends email or mobile number.
     * Backend auto-detects the type, locates the user, and sends OTP.
     * Returns a temp token for use in /verify-otp or /login-password.
     */
    @PostMapping("/identify")
    public ResponseEntity<?> identify(
            @RequestBody IdentifyRequest request,
            jakarta.servlet.http.HttpServletRequest httpReq) {

        String raw = request.identifier() == null ? "" : request.identifier().trim();
        if (raw.isBlank()) {
            return ResponseEntity.badRequest().body("Email or mobile number is required.");
        }

        // ── Detect identifier type ──────────────────────────────────────
        String identifierType;
        String normalized;
        if (raw.contains("@")) {
            identifierType = "EMAIL";
            normalized = raw.toLowerCase();
        } else {
            // Strip spaces, dashes; accept 10-digit or +91 prefix
            normalized = raw.replaceAll("[^0-9+]", "");
            if (normalized.startsWith("+91")) normalized = normalized.substring(3);
            if (normalized.length() != 10) {
                return ResponseEntity.badRequest().body("Please enter a valid 10-digit mobile number.");
            }
            normalized = "+91" + normalized;
            identifierType = "MOBILE";
        }

        // ── Find user ────────────────────────────────────────────────────
        com.realestate.twentyfourk.domain.user.User user = null;
        if ("EMAIL".equals(identifierType)) {
            user = userRepository.findByEmail(normalized).orElse(null);
        } else {
            user = userRepository.findByPhone(normalized).orElse(null);
        }

        if (user == null) {
            // Security: do not reveal whether user exists — same response
            log.warn("[identify] No user found for identifier '{}'", normalized);
            return ResponseEntity.badRequest().body("No account found for this email / mobile. Please contact your administrator.");
        }

        // ── Generate OTP ─────────────────────────────────────────────────
        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        String tempToken = java.util.UUID.randomUUID().toString();
        String ip = httpReq.getRemoteAddr();

        // Clean up stale sessions for this identifier
        try { otpVerificationRepository.deleteExpiredBefore(LocalDateTime.now()); } catch (Exception ignored) {}

        OtpVerification session = OtpVerification.builder()
                .tempToken(tempToken)
                .identifier(normalized)
                .identifierType(identifierType)
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .ipAddress(ip)
                .build();
        otpVerificationRepository.save(session);

        // ── Dispatch OTP ─────────────────────────────────────────────────
        final String finalNormalized = normalized;
        final String finalOtp = otp;
        final String finalUser = user.getUsername();
        if ("EMAIL".equals(identifierType)) {
            CompletableFuture.runAsync(() -> emailService.sendOtpEmail(finalNormalized, finalUser, finalOtp));
        } else {
            CompletableFuture.runAsync(() -> {
                smsService.sendOtpSms(finalNormalized, finalUser, finalOtp);
                whatsAppService.sendOtpMessage(finalNormalized, finalUser, finalOtp);
            });
        }

        log.info("[identify] OTP dispatched via {} for user '{}'", identifierType, finalUser);

        String masked = "EMAIL".equals(identifierType)
                ? maskEmail(normalized)
                : maskMobile(normalized);

        String devOtp = "dev".equalsIgnoreCase(activeProfile) ? otp : null;
        return ResponseEntity.ok(new IdentifyResponse(
                tempToken, identifierType, masked,
                user.getPassword() != null && !user.getPassword().isBlank(),
                user.isPasswordlessEnabled(),
                devOtp
        ));
    }

    /**
     * Step 2a — Verify OTP (passwordless): exchange OTP for JWT.
     * Supports both new /identify flow and legacy MFA flow.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (request.tempToken() == null || request.otp() == null) {
            return ResponseEntity.badRequest().body("tempToken and otp are required.");
        }

        OtpVerification session = otpVerificationRepository.findByTempToken(request.tempToken()).orElse(null);
        if (session == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired session. Please start over.");
        }
        if (session.isExpired()) {
            otpVerificationRepository.delete(session);
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body("OTP has expired. Please request a new one.");
        }
        if (session.isMaxAttemptsReached()) {
            otpVerificationRepository.delete(session);
            return ResponseEntity.status(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many incorrect attempts. Please request a new OTP.");
        }
        if (!session.getOtpCode().equals(request.otp())) {
            session.incrementAttempts();
            otpVerificationRepository.save(session);
            int remaining = 5 - session.getAttemptCount();
            return ResponseEntity.badRequest()
                    .body("Incorrect OTP. " + remaining + " attempt(s) remaining.");
        }

        // ── OTP verified — resolve user ───────────────────────────────────
        com.realestate.twentyfourk.domain.user.User user = null;
        if (session.getIdentifier() != null) {
            // New identifier-first flow
            if ("EMAIL".equals(session.getIdentifierType())) {
                user = userRepository.findByEmail(session.getIdentifier()).orElse(null);
                if (user != null && !user.isEmailVerified()) {
                    user.setEmailVerified(true);
                    userRepository.save(user);
                }
            } else {
                user = userRepository.findByPhone(session.getIdentifier()).orElse(null);
                if (user != null && !user.isMobileVerified()) {
                    user.setMobileVerified(true);
                    userRepository.save(user);
                }
            }
        } else {
            // Legacy MFA flow — resolve by username
            user = userRepository.findByUsername(session.getUsername()).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body("User account not found.");
        }

        otpVerificationRepository.delete(session);
        refreshTokenService.deleteByUserId(user.getId());
        String token = jwtService.generateToken(user);
        com.realestate.twentyfourk.domain.user.RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new AuthResponse(
                token, refreshToken.getToken(), user.getUsername(),
                user.getRole().name(), user.getFullName()));
    }

    /**
     * Step 2b — Password Login (identifier-first): resolve user by email/mobile,
     * then authenticate with password. Returns JWT directly (no OTP needed).
     */
    @PostMapping("/login-password")
    public ResponseEntity<?> loginPassword(@RequestBody PasswordLoginRequest request) {
        String raw = request.identifier() == null ? "" : request.identifier().trim();
        if (raw.isBlank() || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body("Identifier and password are required.");
        }

        com.realestate.twentyfourk.domain.user.User user = null;
        if (raw.contains("@")) {
            user = userRepository.findByEmail(raw.toLowerCase()).orElse(null);
        } else {
            String normalized = raw.replaceAll("[^0-9+]", "");
            if (normalized.startsWith("+91")) normalized = normalized.substring(3);
            if (normalized.length() == 10) normalized = "+91" + normalized;
            user = userRepository.findByPhone(normalized).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials.");
        }
        if (user.isPasswordlessEnabled()) {
            return ResponseEntity.badRequest()
                    .body("Passwordless login is enabled. Please use OTP.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), request.password()));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials.");
        }

        refreshTokenService.deleteByUserId(user.getId());
        String token = jwtService.generateToken(user);
        com.realestate.twentyfourk.domain.user.RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new AuthResponse(
                token, refreshToken.getToken(), user.getUsername(),
                user.getRole().name(), user.getFullName()));
    }

    /**
     * Microsoft OAuth — mirrors Google flow using Firebase ID Token.
     * The frontend uses Firebase signInWithPopup(MicrosoftAuthProvider)
     * then sends the Firebase ID token here for validation and JWT issuance.
     */
    @PostMapping("/microsoft-login")
    public ResponseEntity<?> microsoftLogin(@RequestBody MicrosoftLoginRequest request) {
        log.info("[microsoft-login] Received Microsoft OAuth token, length={}",
                request.credential() != null ? request.credential().length() : 0);
        try {
            String[] parts = request.credential().split("\\.");
            if (parts.length < 2) return ResponseEntity.badRequest().body("Invalid Microsoft token.");

            String payloadJson = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            String email = getValueFromJson(payloadJson, "email");
            String name  = getValueFromJson(payloadJson, "name");

            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body("Could not resolve email from Microsoft identity.");
            }

            // Look up or auto-provision user
            com.realestate.twentyfourk.domain.user.User user =
                    userRepository.findByEmail(email.toLowerCase()).orElse(null);

            if (user == null) {
                String username = email.split("@")[0].toLowerCase().replaceAll("[^a-z0-9_]", "_");
                // Ensure username uniqueness
                String finalUsername = username;
                int suffix = 1;
                while (userRepository.findByUsername(finalUsername).isPresent()) {
                    finalUsername = username + suffix++;
                }
                user = com.realestate.twentyfourk.domain.user.User.builder()
                        .username(finalUsername)
                        .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                        .email(email.toLowerCase())
                        .fullName(name != null ? name : finalUsername)
                        .role(com.realestate.twentyfourk.domain.user.UserRole.CRM_ADMIN)
                        .designation("Microsoft Authorized User")
                        .department("Brokerage Operations")
                        .authProvider("MICROSOFT")
                        .emailVerified(true)
                        .dateOfJoining(java.time.LocalDate.now())
                        .build();
                userRepository.save(user);
                log.info("[microsoft-login] New Microsoft user auto-provisioned: {}", finalUsername);
            }

            refreshTokenService.deleteByUserId(user.getId());
            String token = jwtService.generateToken(user);
            com.realestate.twentyfourk.domain.user.RefreshToken refreshToken =
                    refreshTokenService.createRefreshToken(user.getId());

            return ResponseEntity.ok(new AuthResponse(
                    token, refreshToken.getToken(), user.getUsername(),
                    user.getRole().name(), user.getFullName()));
        } catch (Exception e) {
            log.error("[microsoft-login] Failed: {}", e.getMessage());
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Microsoft authentication failed: " + e.getMessage());
        }
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

    private String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 6) return "*****";
        // +919673000053 → +91 ****0053
        return mobile.substring(0, 3) + " ****" + mobile.substring(mobile.length() - 4);
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
