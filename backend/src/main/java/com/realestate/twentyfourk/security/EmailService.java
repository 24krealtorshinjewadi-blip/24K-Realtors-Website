package com.realestate.twentyfourk.security;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String username, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("24K Realtors CRM Security Verification OTP");
            message.setText("Dear " + username + ",\n\n" +
                    "Your 6-digit Multi-Factor Authentication (MFA) OTP is: " + otpCode + "\n\n" +
                    "This code is valid for the next 5 minutes. Please do not share this OTP with anyone.\n\n" +
                    "Best regards,\n" +
                    "24K Realtors Security Desk");
            mailSender.send(message);
            log.info("[SMTP] Successfully sent OTP email to user '{}'", username);
        } catch (Exception e) {
            log.error("[SMTP] Failed to send OTP email to '{}': {}", toEmail, e.getMessage());
        }
    }
}
