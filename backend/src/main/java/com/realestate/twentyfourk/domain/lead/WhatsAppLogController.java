package com.realestate.twentyfourk.domain.lead;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/whatsapp")
@RequiredArgsConstructor

public class WhatsAppLogController {

    private final WhatsAppLogRepository whatsAppLogRepository;

    @GetMapping("/logs/lead/{leadId}")
    public ResponseEntity<List<WhatsAppMessageLog>> getLogsByLeadId(@PathVariable UUID leadId) {
        List<WhatsAppMessageLog> logs = whatsAppLogRepository.findByLeadIdOrderBySentTimestampDesc(leadId);
        return ResponseEntity.ok(logs);
    }
}
