package com.realestate.twentyfourk.domain.attendance;

import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceBreakRepository breakRepository;
    private final UserRepository userRepository;
    private final WorkFromHomeRepository workFromHomeRepository;

    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 30);
    private static final LocalTime EARLY_EXIT_THRESHOLD = LocalTime.of(17, 30);
    private static final int REGULAR_WORK_HOURS = 9;

    private static final double OFFICE_LAT = 18.583418;
    private static final double OFFICE_LON = 73.727354;
    private static final double GEOFENCE_RADIUS_METERS = 500.0;

    private double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        double earthRadius = 6371000; // meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    @Override
    public Attendance checkIn(UUID userId, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        boolean isWfh = !workFromHomeRepository.findApprovedWfhForDate(userId, LocalDate.now()).isEmpty();
        if (isWfh) {
            log.info("[ATTENDANCE] User {} has approved WFH for today. GPS geofence bypassed.", user.getUsername());
        } else {
            if (latitude == null || longitude == null) {
                throw new IllegalArgumentException("GPS coordinates are required to log attendance.");
            }
            double distance = calculateDistanceInMeters(latitude, longitude, OFFICE_LAT, OFFICE_LON);
            log.info("[ATTENDANCE] User {} is checking in. Coordinates: ({}, {}). Distance from office: {} meters. Limit: {} meters.", 
                    user.getUsername(), latitude, longitude, Math.round(distance), GEOFENCE_RADIUS_METERS);
            
            if (distance > GEOFENCE_RADIUS_METERS) {
                throw new IllegalArgumentException(String.format("Outside office geofence. Distance: %.1fm. Check-in restricted to 500m.", distance));
            }
        }

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
                .checkInLat(latitude != null ? latitude : OFFICE_LAT)
                .checkInLon(longitude != null ? longitude : OFFICE_LON)
                .status(isWfh ? "PRESENT" : (isLate ? "LATE" : "PRESENT"))
                .late(!isWfh && isLate)
                .build();

        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance checkOut(UUID userId, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        boolean isWfh = !workFromHomeRepository.findApprovedWfhForDate(userId, LocalDate.now()).isEmpty();
        if (isWfh) {
            log.info("[ATTENDANCE] User ID {} has approved WFH for today. GPS geofence bypassed on checkout.", userId);
        } else {
            if (latitude == null || longitude == null) {
                throw new IllegalArgumentException("GPS coordinates are required to check out.");
            }
            double distance = calculateDistanceInMeters(latitude, longitude, OFFICE_LAT, OFFICE_LON);
            log.info("[ATTENDANCE] User ID {} is checking out. Coordinates: ({}, {}). Distance: {} meters.", 
                    userId, latitude, longitude, Math.round(distance));
            
            if (distance > GEOFENCE_RADIUS_METERS) {
                throw new IllegalArgumentException(String.format("Outside office geofence. Distance: %.1fm. Check-out restricted to 500m.", distance));
            }
        }

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
