package com.realestate.twentyfourk.domain.lead.event;

import com.realestate.twentyfourk.domain.lead.service.WhatsAppService;
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

    @Async("whatsappAsyncExecutor")
    @EventListener
    public void handleLeadCreatedEvent(LeadCreatedEvent event) {
        log.info("Async Event Received: LeadCreatedEvent for {} on Thread: {}", 
                event.lead().getName(), Thread.currentThread().getName());
        
        whatsAppService.sendWelcomeMessage(event.lead());
    }
}
