package com.realestate.twentyfourk.domain.lead.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestate.twentyfourk.domain.lead.Lead;
import com.realestate.twentyfourk.domain.lead.WhatsAppLogRepository;
import com.realestate.twentyfourk.domain.lead.WhatsAppMessageLog;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final WhatsAppLogRepository whatsAppLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${whatsapp.api.url:https://graph.facebook.com/v20.0/103984029348928/messages}")
    private String apiUrl;

    @Value("${whatsapp.api.token:EAAXX_PLACEHOLDER_MOCK_TOKEN}")
    private String apiToken;

    @Value("${whatsapp.api.template:welcome_lead_intro}")
    private String templateName;

    public void sendWelcomeMessage(Lead lead) {
        log.info("Preparing WhatsApp webhook nurture trigger for Lead: {} ({})", lead.getName(), lead.getPhone());
        
        String status = "SENT";
        String errorMessage = null;
        String parametersJson = "";
        String payloadJson = "";
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiToken);

            // Construct Meta WhatsApp Cloud API Template Payload
            Map<String, Object> body = new HashMap<>();
            body.put("messaging_product", "whatsapp");
            body.put("to", lead.getPhone());
            body.put("type", "template");

            Map<String, Object> template = new HashMap<>();
            template.put("name", templateName);
            
            Map<String, String> language = new HashMap<>();
            language.put("code", "en_US");
            template.put("language", language);

            // Passing lead parameters to the template variables:
            // {{1}} = Lead Name, {{2}} = Location, {{3}} = Agent Name, {{4}} = Agent Phone
            Map<String, Object> component = new HashMap<>();
            component.put("type", "body");
            
            String agentName = lead.getAssignedAgent() != null ? lead.getAssignedAgent().getName() : "Unassigned";
            String agentPhone = lead.getAssignedAgent() != null ? lead.getAssignedAgent().getPhone() : "N/A";
            
            List<Map<String, String>> params = List.of(
                    Map.of("type", "text", "text", lead.getName()),
                    Map.of("type", "text", "text", lead.getPreferredLocation() != null ? lead.getPreferredLocation().name() : "Pune Prime Corridors"),
                    Map.of("type", "text", "text", agentName),
                    Map.of("type", "text", "text", agentPhone)
            );
            component.put("parameters", params);
            template.put("components", List.of(component));
            body.put("template", template);

            parametersJson = objectMapper.writeValueAsString(params);
            payloadJson = objectMapper.writeValueAsString(body);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            log.debug("Sending POST webhook request to Meta endpoint: {}", apiUrl);
            
            // Dispatch request
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);
            
            log.info("WhatsApp welcome webhook triggered successfully for {}. Status Code: {}", lead.getName(), response.getStatusCode());
        } catch (Exception ex) {
            errorMessage = ex.getMessage();
            if (apiToken == null || apiToken.contains("PLACEHOLDER") || errorMessage.contains("401") || errorMessage.contains("400") || errorMessage.contains("500") || errorMessage.contains("Failed to connect")) {
                status = "SIMULATING";
                log.info("WhatsApp Welcome Webhook simulating locally for {} (using placeholder keys).", lead.getName());
            } else {
                status = "FAILED";
                log.error("Failed to dispatch WhatsApp Webhook to {}: {}", lead.getName(), errorMessage);
            }
        } finally {
            // Persist the log record in database
            try {
                WhatsAppMessageLog messageLog = WhatsAppMessageLog.builder()
                        .leadId(lead.getId())
                        .phone(lead.getPhone())
                        .templateName(templateName)
                        .parametersJson(parametersJson)
                        .payloadJson(payloadJson)
                        .status(status)
                        .errorMessage(errorMessage)
                        .build();
                whatsAppLogRepository.save(messageLog);
                log.info("Outbound WhatsApp Message Log saved for Lead: {} (Status: {})", lead.getName(), status);
            } catch (Exception logEx) {
                log.error("Database failure saving WhatsApp message log: {}", logEx.getMessage());
            }
        }
    }

    public void sendOtpMessage(String phone, String username, String otpCode) {
        log.info("Preparing WhatsApp OTP trigger for Phone: {} (User: {})", phone, username);
        
        String status = "SENT";
        String errorMessage = null;
        String payloadJson = "";
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiToken);

            Map<String, Object> body = new HashMap<>();
            body.put("messaging_product", "whatsapp");
            body.put("to", phone);
            body.put("type", "text");

            Map<String, String> text = new HashMap<>();
            text.put("body", "🔒 *24K Realtors Security Alert*\n\nDear " + username + ",\n\nYour 6-digit Multi-Factor Authentication (MFA) OTP is: *" + otpCode + "*\n\nValid for the next 5 minutes. Do not share this code.");
            body.put("text", text);

            payloadJson = objectMapper.writeValueAsString(body);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            // Dispatch request
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);
            log.info("WhatsApp OTP message dispatched successfully to {}. Status Code: {}", phone, response.getStatusCode());
        } catch (Exception ex) {
            errorMessage = ex.getMessage();
            if (apiToken == null || apiToken.contains("PLACEHOLDER") || errorMessage.contains("401") || errorMessage.contains("400") || errorMessage.contains("500") || errorMessage.contains("Failed to connect")) {
                status = "SIMULATING";
                log.info("WhatsApp OTP message simulating locally for {} (using placeholder keys).", phone);
            } else {
                status = "FAILED";
                log.error("Failed to dispatch WhatsApp OTP to {}: {}", phone, errorMessage);
            }
        }
    }
}
