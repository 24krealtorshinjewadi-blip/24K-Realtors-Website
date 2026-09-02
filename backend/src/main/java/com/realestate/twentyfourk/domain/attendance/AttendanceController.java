package com.realestate.twentyfourk.domain.attendance;

import com.realestate.twentyfourk.domain.user.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor

public class AttendanceController {

    private final AttendanceService attendanceService;

    @Data
    public static class LocationRequest {
        private Double latitude;
        private Double longitude;
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(
            @AuthenticationPrincipal User user,
            @RequestBody LocationRequest request) {
        Attendance attendance = attendanceService.checkIn(user.getId(), request.getLatitude(), request.getLongitude());
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(
            @AuthenticationPrincipal User user,
            @RequestBody LocationRequest request) {
        Attendance attendance = attendanceService.checkOut(user.getId(), request.getLatitude(), request.getLongitude());
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/break/start")
    public ResponseEntity<AttendanceBreak> startBreak(@AuthenticationPrincipal User user) {
        AttendanceBreak breakSession = attendanceService.startBreak(user.getId());
        return ResponseEntity.ok(breakSession);
    }

    @PostMapping("/break/end")
    public ResponseEntity<AttendanceBreak> endBreak(@AuthenticationPrincipal User user) {
        AttendanceBreak breakSession = attendanceService.endBreak(user.getId());
        return ResponseEntity.ok(breakSession);
    }

    @GetMapping("/today")
    public ResponseEntity<Attendance> getTodayAttendance(@AuthenticationPrincipal User user) {
        Optional<Attendance> attendance = attendanceService.getTodayAttendance(user.getId());
        return attendance.map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/my-logs")
    public ResponseEntity<List<Attendance>> getMyLogs(@AuthenticationPrincipal User user) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        List<Attendance> logs = attendanceService.getMonthlyLogs(user.getId(), startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<Attendance>> getMonthlyLogs(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> logs = attendanceService.getMonthlyLogs(user.getId(), startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/daily-dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','HR')")
    public ResponseEntity<List<Attendance>> getDailyDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<Attendance> dashboard = attendanceService.getDailyDashboard(targetDate);
        return ResponseEntity.ok(dashboard);
    }
}
