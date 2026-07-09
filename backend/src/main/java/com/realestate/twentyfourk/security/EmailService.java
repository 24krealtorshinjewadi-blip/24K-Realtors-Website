package com.realestate.twentyfourk.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Email delivery service using Resend.com transactional email API.
 * Falls back gracefully on missing credentials (logs warning, never throws).
 *
 * Required Railway env vars:
 *   RESEND_API_KEY  — API key from resend.com dashboard
 *   RESEND_FROM     — Verified sender, e.g. "24K Realtors <noreply@24krealtors.in>"
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api-key:}")
    private String apiKey;

    @Value("${resend.from:24K Realtors <onboarding@resend.dev>}")
    private String fromAddress;

    // ─── OTP (existing) ────────────────────────────────────────────────────────

    public void sendOtpEmail(String toEmail, String username, String otpCode) {
        String subject = "24K Realtors — Security OTP";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;background:#070F1E;color:#fff;border-radius:12px;">
              <h2 style="color:#D4AF37;font-family:serif;">24K REALTORS</h2>
              <p>Dear <strong>%s</strong>,</p>
              <p>Your MFA verification code is:</p>
              <div style="font-size:2.5rem;font-weight:800;letter-spacing:0.3em;color:#D4AF37;text-align:center;padding:16px 0;">%s</div>
              <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;">Valid for 5 minutes. Do not share this code with anyone.</p>
              <hr style="border-color:rgba(255,255,255,0.1);"/>
              <p style="color:rgba(255,255,255,0.4);font-size:0.75rem;">24K Realtors Security Desk — Pune, India</p>
            </div>
            """.formatted(username, otpCode);
        sendEmail(toEmail, subject, html);
    }

    // ─── Welcome (new user registration) ───────────────────────────────────────

    public void sendWelcomeEmail(String toEmail, String username) {
        if (toEmail == null || toEmail.isBlank()) return;
        String subject = "Welcome to 24K Realtors Portal!";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;background:#070F1E;color:#fff;border-radius:12px;">
              <h2 style="color:#D4AF37;font-family:serif;">24K REALTORS</h2>
              <p>Welcome aboard, <strong>%s</strong>! 🎉</p>
              <p>Your account has been successfully created on the 24K Realtors CRM platform.</p>
              <p style="color:rgba(255,255,255,0.7);">You now have access to our luxury real estate portfolio management dashboard.</p>
              <div style="margin:24px 0;padding:16px;background:rgba(212,175,55,0.1);border-left:4px solid #D4AF37;border-radius:4px;">
                <p style="margin:0;color:#D4AF37;font-weight:700;">🏆 Premium Access Enabled</p>
                <p style="margin:4px 0 0;font-size:0.85rem;color:rgba(255,255,255,0.7);">You can now manage leads, properties, and client interactions.</p>
              </div>
              <hr style="border-color:rgba(255,255,255,0.1);"/>
              <p style="color:rgba(255,255,255,0.4);font-size:0.75rem;">24K Realtors — Pune's Premier Luxury Real Estate</p>
            </div>
            """.formatted(username);
        sendEmail(toEmail, subject, html);
    }

    // ─── Lead Confirmation (customer inquiry) ──────────────────────────────────

    public void sendLeadConfirmation(String toEmail, String customerName, String propertyTitle) {
        if (toEmail == null || toEmail.isBlank()) return;
        String propLine = (propertyTitle != null && !propertyTitle.isBlank())
                ? "regarding <strong>" + propertyTitle + "</strong>"
                : "for one of our luxury listings";
        String subject = "We've Received Your Enquiry — 24K Realtors";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;background:#070F1E;color:#fff;border-radius:12px;">
              <h2 style="color:#D4AF37;font-family:serif;">24K REALTORS</h2>
              <p>Dear <strong>%s</strong>,</p>
              <p>Thank you for your enquiry %s.</p>
              <p style="color:rgba(255,255,255,0.7);">Our dedicated relationship manager will contact you within <strong style="color:#D4AF37;">2 business hours</strong> to schedule a personalised consultation.</p>
              <div style="margin:24px 0;padding:16px;background:rgba(212,175,55,0.1);border-left:4px solid #D4AF37;border-radius:4px;">
                <p style="margin:0;color:#D4AF37;font-weight:700;">🏡 What Happens Next?</p>
                <p style="margin:4px 0 0;font-size:0.85rem;color:rgba(255,255,255,0.7);">1. Our team reviews your requirements<br/>2. We shortlist matching properties<br/>3. We schedule your VIP site visit</p>
              </div>
              <p>WhatsApp us directly: <strong style="color:#25D366;">+91-XXXXXXXXXX</strong></p>
              <hr style="border-color:rgba(255,255,255,0.1);"/>
              <p style="color:rgba(255,255,255,0.4);font-size:0.75rem;">24K Realtors — Pune's Premier Luxury Real Estate | Zero Brokerage</p>
            </div>
            """.formatted(customerName, propLine);
        sendEmail(toEmail, subject, html);
    }

    // ─── Core sender ───────────────────────────────────────────────────────────

    private void sendEmail(String to, String subject, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[Resend] RESEND_API_KEY not configured. Skipping email to '{}'.", to);
            return;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> payload = Map.of(
                    "from", fromAddress,
                    "to", List.of(to),
                    "subject", subject,
                    "html", html
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    RESEND_URL,
                    HttpMethod.POST,
                    new HttpEntity<>(payload, headers),
                    String.class
            );
            log.info("[Resend] Email sent to '{}'. Status: {}", to, response.getStatusCode());
        } catch (Exception e) {
            log.error("[Resend] Failed to send email to '{}': {}", to, e.getMessage());
        }
    }
}
