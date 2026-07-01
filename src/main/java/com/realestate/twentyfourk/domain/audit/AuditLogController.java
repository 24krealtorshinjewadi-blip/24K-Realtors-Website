package com.realestate.twentyfourk.domain.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    @GetMapping("/entity/{name}/{id}")
    public ResponseEntity<List<AuditLog>> getLogsByEntity(@PathVariable String name, @PathVariable UUID id) {
        return ResponseEntity.ok(auditLogRepository.findByEntityNameAndEntityIdOrderByTimestampDesc(name, id));
    }
}
