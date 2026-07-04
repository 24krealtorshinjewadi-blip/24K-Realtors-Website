package com.realestate.twentyfourk.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class OtpVerification {
    private final String tempToken;
    private final String username;
    private final String otpCode;
    private final LocalDateTime expiresAt;
    private final boolean rememberDevice;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
