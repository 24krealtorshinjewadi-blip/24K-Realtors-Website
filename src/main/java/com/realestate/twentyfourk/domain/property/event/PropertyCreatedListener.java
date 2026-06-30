package com.realestate.twentyfourk.domain.property.event;

import com.realestate.twentyfourk.domain.lead.Lead;
import com.realestate.twentyfourk.domain.lead.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PropertyCreatedListener {

    private static final Logger log = LoggerFactory.getLogger(PropertyCreatedListener.class);
    private final LeadRepository leadRepository;

    @Async("whatsappAsyncExecutor")
    @EventListener
    public void handlePropertyCreated(PropertyCreatedEvent event) {
        var property = event.property();
        log.info("Processing asynchronous matchmaking check for Property: '{}' (Price: {}) on Thread: {}", 
                property.getTitle(), property.getPrice(), Thread.currentThread().getName());

        try {
            List<Lead> matchingLeads = leadRepository.findMatchingLeads(property.getLocation(), property.getPrice());
            for (Lead lead : matchingLeads) {
                log.info("[MATCHING ENGINE ALERT] Lead '{}' (Phone: {}, Email: {}) matches property '{}' in {} Corridor! Price: {}",
                        lead.getName(), lead.getPhone(), lead.getEmail(), property.getTitle(),
                        property.getLocation(), property.getPrice());
            }
            log.info("Finished matchmaking check. Found {} matching leads.", matchingLeads.size());
        } catch (Exception ex) {
            log.error("Failed to run matchmaking check: {}", ex.getMessage(), ex);
        }
    }
}
