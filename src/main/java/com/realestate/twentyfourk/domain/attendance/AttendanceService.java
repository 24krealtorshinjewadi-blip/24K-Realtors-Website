package com.realestate.twentyfourk.domain.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceService {
    Attendance checkIn(UUID userId, Double latitude, Double longitude);
    Attendance checkOut(UUID userId, Double latitude, Double longitude);
    AttendanceBreak startBreak(UUID userId);
    AttendanceBreak endBreak(UUID userId);
    Optional<Attendance> getTodayAttendance(UUID userId);
    List<Attendance> getMonthlyLogs(UUID userId, LocalDate startDate, LocalDate endDate);
    List<Attendance> getDailyDashboard(LocalDate date);
}
