package com.realestate.twentyfourk.security;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "remember_device", nullable = false)
    private boolean rememberDevice;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
