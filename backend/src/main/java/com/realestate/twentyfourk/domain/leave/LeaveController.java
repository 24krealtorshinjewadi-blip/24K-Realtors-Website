package com.realestate.twentyfourk.domain.leave;

import com.realestate.twentyfourk.domain.user.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor

public class LeaveController {

    private final LeaveService leaveService;

    @Data
    public static class LeaveApplyRequest {
        private LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> applyLeave(
            @AuthenticationPrincipal User user,
            @RequestBody LeaveApplyRequest request) {
        LeaveRequest leave = leaveService.applyLeave(
                user.getId(),
                request.getLeaveType(),
                request.getStartDate(),
                request.getEndDate(),
                request.getReason()
        );
        return ResponseEntity.ok(leave);
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR')")
    public ResponseEntity<LeaveRequest> approveLeave(
            @PathVariable UUID id,
            @AuthenticationPrincipal User manager) {
        LeaveRequest leave = leaveService.approveLeave(id, manager.getId());
        return ResponseEntity.ok(leave);
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR')")
    public ResponseEntity<LeaveRequest> rejectLeave(
            @PathVariable UUID id,
            @AuthenticationPrincipal User manager) {
        LeaveRequest leave = leaveService.rejectLeave(id, manager.getId());
        return ResponseEntity.ok(leave);
    }

    @GetMapping("/balance")
    public ResponseEntity<LeaveBalance> getLeaveBalance(@AuthenticationPrincipal User user) {
        LeaveBalance balance = leaveService.getLeaveBalance(user.getId());
        return ResponseEntity.ok(balance);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<LeaveRequest>> getMyRequests(@AuthenticationPrincipal User user) {
        List<LeaveRequest> requests = leaveService.getOwnRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR')")
    public ResponseEntity<List<LeaveRequest>> getPendingRequests() {
        List<LeaveRequest> requests = leaveService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HR')")
    public ResponseEntity<List<LeaveRequest>> getAllRequests() {
        List<LeaveRequest> requests = leaveService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
}
