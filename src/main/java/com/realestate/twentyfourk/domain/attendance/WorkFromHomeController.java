package com.realestate.twentyfourk.domain.attendance;

import com.realestate.twentyfourk.domain.user.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wfh")
@RequiredArgsConstructor
public class WorkFromHomeController {

    private final WorkFromHomeService workFromHomeService;

    @PostMapping("/apply")
    public ResponseEntity<WorkFromHome> applyWfh(
            @AuthenticationPrincipal User user,
            @RequestBody WfhRequest request
    ) {
        WorkFromHome wfh = workFromHomeService.applyWfh(
                user.getId(),
                request.getStartDate(),
                request.getEndDate(),
                request.getReason()
        );
        return ResponseEntity.ok(wfh);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<WorkFromHome> approveWfh(
            @PathVariable UUID id,
            @AuthenticationPrincipal User manager
    ) {
        WorkFromHome wfh = workFromHomeService.approveWfh(id, manager.getId());
        return ResponseEntity.ok(wfh);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<WorkFromHome> rejectWfh(
            @PathVariable UUID id,
            @AuthenticationPrincipal User manager
    ) {
        WorkFromHome wfh = workFromHomeService.rejectWfh(id, manager.getId());
        return ResponseEntity.ok(wfh);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<WorkFromHome>> getMyRequests(@AuthenticationPrincipal User user) {
        List<WorkFromHome> list = workFromHomeService.getOwnRequests(user.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<WorkFromHome>> getPendingRequests() {
        List<WorkFromHome> list = workFromHomeService.getPendingRequests();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/active-today")
    public ResponseEntity<Boolean> isWfhActiveToday(@AuthenticationPrincipal User user) {
        boolean active = workFromHomeService.isWfhActiveToday(user.getId());
        return ResponseEntity.ok(active);
    }

    @Data
    public static class WfhRequest {
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }
}
