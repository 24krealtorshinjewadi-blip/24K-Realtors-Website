package com.realestate.twentyfourk.domain.lead.event;

import com.realestate.twentyfourk.domain.lead.service.WhatsAppService;
import com.realestate.twentyfourk.security.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeadCreatedListener {

    private static final Logger log = LoggerFactory.getLogger(LeadCreatedListener.class);
    private final WhatsAppService whatsAppService;
    private final EmailService emailService;

    @Async("whatsappAsyncExecutor")
    @EventListener
    public void handleLeadCreatedEvent(LeadCreatedEvent event) {
        log.info("Async Event Received: LeadCreatedEvent for {} on Thread: {}",
                event.lead().getName(), Thread.currentThread().getName());

        // 1. WhatsApp welcome message to the lead
        whatsAppService.sendWelcomeMessage(event.lead());

        // 2. Transactional email confirmation to the customer
        String propertyTitle = (event.lead().getProperty() != null)
                ? event.lead().getProperty().getTitle()
                : null;
        emailService.sendLeadConfirmation(
                event.lead().getEmail(),
                event.lead().getName(),
                propertyTitle
        );
    }
}
