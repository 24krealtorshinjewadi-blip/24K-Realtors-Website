package com.realestate.twentyfourk.domain.attendance;

import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceBreakRepository breakRepository;
    private final UserRepository userRepository;

    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 30);
    private static final LocalTime EARLY_EXIT_THRESHOLD = LocalTime.of(17, 30);
    private static final int REGULAR_WORK_HOURS = 9;

    @Override
    public Attendance checkIn(UUID userId, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(userId, today);
        if (existing.isPresent()) {
            throw new IllegalStateException("Already checked in for today!");
        }

        LocalDateTime now = LocalDateTime.now();
        boolean isLate = now.toLocalTime().isAfter(LATE_THRESHOLD);

        Attendance attendance = Attendance.builder()
                .user(user)
                .date(today)
                .checkInTime(now)
                .checkInLat(latitude)
                .checkInLon(longitude)
                .status(isLate ? "LATE" : "PRESENT")
                .late(isLate)
                .build();

        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance checkOut(UUID userId, Double latitude, Double longitude) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new IllegalStateException("No active check-in record found for today. Please check-in first."));

        if (attendance.getCheckOutTime() != null) {
            throw new IllegalStateException("Already checked out for today!");
        }

        LocalDateTime now = LocalDateTime.now();
        attendance.setCheckOutTime(now);
        attendance.setCheckOutLat(latitude);
        attendance.setCheckOutLon(longitude);

        // Check early exit
        boolean isEarlyExit = now.toLocalTime().isBefore(EARLY_EXIT_THRESHOLD);
        attendance.setEarlyExit(isEarlyExit);

        // Recalculate work hours & overtime (duration minus break time)
        Duration totalDuration = Duration.between(attendance.getCheckInTime(), now);
        long totalMinutes = totalDuration.toMinutes();
        long netWorkMinutes = totalMinutes - attendance.getTotalBreaksDurationMinutes();

        long standardWorkMinutes = REGULAR_WORK_HOURS * 60;
        if (netWorkMinutes > standardWorkMinutes) {
            attendance.setOvertimeMinutes((int) (netWorkMinutes - standardWorkMinutes));
        }

        return attendanceRepository.save(attendance);
    }

    @Override
    public AttendanceBreak startBreak(UUID userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new IllegalStateException("No active check-in record for today. Cannot take breaks."));

        if (attendance.getCheckOutTime() != null) {
            throw new IllegalStateException("Cannot start break after checking out.");
        }

        // Verify no active break exists
        boolean hasActiveBreak = attendance.getBreaks().stream()
                .anyMatch(b -> b.getEndTime() == null);
        if (hasActiveBreak) {
            throw new IllegalStateException("You already have an active break session.");
        }

        AttendanceBreak breakSession = AttendanceBreak.builder()
                .attendance(attendance)
                .startTime(LocalDateTime.now())
                .build();

        return breakRepository.save(breakSession);
    }

    @Override
    public AttendanceBreak endBreak(UUID userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new IllegalStateException("No active check-in record for today."));

        AttendanceBreak activeBreak = attendance.getBreaks().stream()
                .filter(b -> b.getEndTime() == null)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active break session found to close."));

        LocalDateTime now = LocalDateTime.now();
        activeBreak.setEndTime(now);

        // Recalculate total breaks duration
        long breakDuration = Duration.between(activeBreak.getStartTime(), now).toMinutes();
        attendance.setTotalBreaksDurationMinutes(attendance.getTotalBreaksDurationMinutes() + (int) breakDuration);
        attendanceRepository.save(attendance);

        return breakRepository.save(activeBreak);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Attendance> getTodayAttendance(UUID userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attendance> getMonthlyLogs(UUID userId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attendance> getDailyDashboard(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }
}
