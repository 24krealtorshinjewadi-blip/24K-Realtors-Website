package com.realestate.twentyfourk.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * SMS OTP Delivery Service — dual provider support:
 *
 * Priority 1: Fast2SMS (Indian SMS gateway — cheap, ₹1/SMS, no +91 prefix needed)
 *             API: https://www.fast2sms.com  → Get key from Developer API section
 *
 * Priority 2: Twilio (International — more expensive, needs verified number)
 *             API: https://console.twilio.com
 *
 * Falls back to simulation log if neither is configured.
 *
 * Required env vars (set ONE provider):
 *   Fast2SMS: FAST2SMS_API_KEY
 *   Twilio:   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */
@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    // ── Fast2SMS (Preferred for India) ──────────────────────────────────────
    @Value("${fast2sms.api-key:}")
    private String fast2smsApiKey;

    // ── Twilio (Fallback / International) ──────────────────────────────────
    @Value("${twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${twilio.from-number:}")
    private String twilioFromNumber;

    public void sendOtpSms(String toPhone, String username, String otpCode) {
        log.info("[SMS] Sending OTP to phone '{}' for user '{}'", toPhone, username);

        // ── Try Fast2SMS first (India-native, cheapest) ──────────────────────
        if (fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            sendViaFast2Sms(toPhone, username, otpCode);
            return;
        }

        // ── Try Twilio (international fallback) ──────────────────────────────
        if (twilioAccountSid != null && !twilioAccountSid.isBlank()
                && twilioAuthToken != null && !twilioAuthToken.isBlank()) {
            sendViaTwilio(toPhone, username, otpCode);
            return;
        }

        // ── Simulate (dev mode — OTP visible in logs + frontend devOtp hint) ─
        log.info("[SMS-SIM] ⚠️  No SMS provider configured. OTP for {}: {}", toPhone, otpCode);
        log.info("[SMS-SIM] To enable: set FAST2SMS_API_KEY (India) or TWILIO_* env vars.");
    }

    // ── Fast2SMS implementation ─────────────────────────────────────────────
    private void sendViaFast2Sms(String toPhone, String username, String otpCode) {
        try {
            // Fast2SMS expects 10-digit number without country code
            String mobile = toPhone.replaceAll("[^0-9]", "");
            if (mobile.startsWith("91") && mobile.length() == 12) {
                mobile = mobile.substring(2); // strip country code
            }

            String message = "Dear " + username + ", your 24K Realtors OTP is: " + otpCode
                    + ". Valid for 5 minutes. Do not share with anyone. -24K Realtors";

            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", fast2smsApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Fast2SMS Quick SMS API (supports transactional DLT)
            org.springframework.http.HttpEntity<java.util.Map<String, Object>> entity =
                    new org.springframework.http.HttpEntity<>(
                            java.util.Map.of(
                                    "route", "q",          // Quick SMS (DLT route = "dlt")
                                    "numbers", mobile,
                                    "message", message,
                                    "flash", 0
                            ),
                            headers
                    );

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://www.fast2sms.com/dev/bulkV2",
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            log.info("[Fast2SMS] OTP sent to '{}'. Status: {}", toPhone, response.getStatusCode());
        } catch (Exception e) {
            log.error("[Fast2SMS] Failed to send OTP to '{}': {}", toPhone, e.getMessage());
        }
    }

    // ── Twilio implementation ───────────────────────────────────────────────
    private void sendViaTwilio(String toPhone, String username, String otpCode) {
        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + twilioAccountSid + "/Messages.json";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(twilioAccountSid, twilioAuthToken);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("To", toPhone);
            map.add("From", twilioFromNumber);
            map.add("Body", "🔒 [24K Realtors] Dear " + username
                    + ", your OTP is: " + otpCode + ". Valid for 5 minutes. Do not share.");

            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, new HttpEntity<>(map, headers), String.class);
            log.info("[Twilio] OTP sent to '{}'. Status: {}", toPhone, response.getStatusCode());
        } catch (Exception e) {
            log.error("[Twilio] Failed to send OTP to '{}': {}", toPhone, e.getMessage());
        }
    }
}

