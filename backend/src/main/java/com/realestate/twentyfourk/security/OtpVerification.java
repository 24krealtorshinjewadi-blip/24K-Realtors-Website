package com.realestate.twentyfourk.security;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * OTP Verification session — supports both legacy MFA (username-based)
 * and new SaaS identifier-first passwordless login (email/mobile).
 */
@Entity
@Table(name = "otp_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @Column(name = "temp_token", nullable = false, length = 255)
    private String tempToken;

    /** Retained for legacy MFA flow — null in new passwordless flow */
    @Column(name = "username", length = 50)
    private String username;

    /** Raw OTP — kept for dev/legacy; otp_hash is used in production verify */
    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    /** BCrypt hash of the OTP for secure storage */
    @Column(name = "otp_hash", length = 255)
    private String otpHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "remember_device", nullable = false)
    @Builder.Default
    private boolean rememberDevice = false;

    // ── Identifier-first login fields ──────────────────────────────────

    /** The email or mobile number the OTP was sent to */
    @Column(name = "identifier", length = 255)
    private String identifier;

    /** EMAIL or MOBILE */
    @Column(name = "identifier_type", length = 10)
    private String identifierType;

    /** Number of wrong OTP attempts — max 5 before lockout */
    @Column(name = "attempt_count", nullable = false)
    @Builder.Default
    private int attemptCount = 0;

    /** IP address of the request for rate-limit tracking */
    @Column(name = "ip_address", length = 60)
    private String ipAddress;

    // ── Helpers ────────────────────────────────────────────────────────

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void incrementAttempts() {
        this.attemptCount++;
    }

    public boolean isMaxAttemptsReached() {
        return this.attemptCount >= 5;
    }
}

