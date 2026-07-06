package com.realestate.twentyfourk.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.from-number:}")
    private String fromNumber;

    public void sendOtpSms(String toPhone, String username, String otpCode) {
        log.info("Preparing Twilio SMS trigger for Phone: {} (User: {})", toPhone, username);

        if (accountSid == null || accountSid.isBlank() || authToken == null || authToken.isBlank()) {
            log.info("[SMS-SIMULATION] SMS credentials not configured. Simulating OTP to mobile {}: {}", toPhone, otpCode);
            return;
        }

        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(accountSid, authToken);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("To", toPhone);
            map.add("From", fromNumber);
            map.add("Body", "🔒 [24K Realtors] Dear " + username + ", your Multi-Factor Authentication (MFA) verification code is: " + otpCode + ". Valid for 5 minutes.");

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(map, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            log.info("[Twilio] Successfully sent SMS to user '{}'. Status Code: {}", username, response.getStatusCode());
        } catch (Exception e) {
            log.error("[Twilio] Failed to send SMS to '{}': {}", toPhone, e.getMessage());
        }
    }
}
