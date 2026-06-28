package com.realestate.twentyfourk.domain.lead.service;

import com.realestate.twentyfourk.domain.lead.Lead;
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
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${whatsapp.api.url:https://graph.facebook.com/v20.0/103984029348928/messages}")
    private String apiUrl;

    @Value("${whatsapp.api.token:EAAXX_PLACEHOLDER_MOCK_TOKEN}")
    private String apiToken;

    @Value("${whatsapp.api.template:welcome_lead_intro}")
    private String templateName;

    public void sendWelcomeMessage(Lead lead) {
        log.info("Preparing WhatsApp webhook nurture trigger for Lead: {} ({})", lead.getName(), lead.getPhone());
        
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
            
            component.put("parameters", List.of(
                    Map.of("type", "text", "text", lead.getName()),
                    Map.of("type", "text", "text", lead.getPreferredLocation() != null ? lead.getPreferredLocation().name() : "Pune Prime Corridors"),
                    Map.of("type", "text", "text", agentName),
                    Map.of("type", "text", "text", agentPhone)
            ));
            template.put("components", List.of(component));
            body.put("template", template);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            log.debug("Sending POST webhook request to Meta endpoint: {}", apiUrl);
            
            // Dispatch request (using try-catch block for testing with mocked tokens)
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);
            
            log.info("WhatsApp welcome webhook triggered successfully for {}. Status Code: {}", lead.getName(), response.getStatusCode());
        } catch (Exception ex) {
            log.error("Failed to dispatch WhatsApp Webhook to {}: {}. (This is expected in local dev environment with placeholder keys).", 
                    lead.getName(), ex.getMessage());
        }
    }
}
