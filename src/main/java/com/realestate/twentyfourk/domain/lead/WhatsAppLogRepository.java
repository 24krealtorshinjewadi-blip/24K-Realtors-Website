package com.realestate.twentyfourk.domain.lead;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface WhatsAppLogRepository extends JpaRepository<WhatsAppMessageLog, Long> {
    List<WhatsAppMessageLog> findByLeadIdOrderBySentTimestampDesc(UUID leadId);
}
