package com.realestate.twentyfourk.domain.lead;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "whatsapp_message_logs", indexes = {
    @Index(name = "idx_wa_lead_id", columnList = "lead_id"),
    @Index(name = "idx_wa_sent_time", columnList = "sent_timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhatsAppMessageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_id", nullable = false)
    private UUID leadId;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "template_name", nullable = false)
    private String templateName;

    @Column(name = "parameters_json", columnDefinition = "TEXT")
    private String parametersJson;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // SENT, FAILED, SIMULATING

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;

    @CreationTimestamp
    @Column(name = "sent_timestamp", nullable = false, updatable = false)
    private LocalDateTime sentTimestamp;
}
