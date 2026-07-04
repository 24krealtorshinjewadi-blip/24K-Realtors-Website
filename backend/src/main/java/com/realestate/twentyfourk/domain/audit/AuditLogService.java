package com.realestate.twentyfourk.domain.audit;

import com.realestate.twentyfourk.domain.user.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String action, String entityName, UUID entityId, String oldValue, String newValue) {
        UUID userId = null;
        String username = "ANONYMOUS";

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && 
            authentication.isAuthenticated() && 
            !authentication.getPrincipal().equals("anonymousUser")) {
            
            if (authentication.getPrincipal() instanceof User user) {
                userId = user.getId();
                username = user.getUsername();
            }
        }

        String ipAddress = "UNKNOWN";
        String browserAgent = "UNKNOWN";
        String deviceInfo = "UNKNOWN";

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            ipAddress = request.getRemoteAddr();
            browserAgent = request.getHeader("User-Agent");
            
            // Basic device detection logic from User-Agent header
            if (browserAgent != null) {
                String ua = browserAgent.toLowerCase();
                if (ua.contains("mobile")) {
                    deviceInfo = "MOBILE";
                } else if (ua.contains("tablet")) {
                    deviceInfo = "TABLET";
                } else {
                    deviceInfo = "DESKTOP";
                }
            }
        }

        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .username(username)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .ipAddress(ipAddress)
                .browserAgent(browserAgent)
                .deviceInfo(deviceInfo)
                .build();

        auditLogRepository.save(auditLog);
    }
}
