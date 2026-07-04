package com.realestate.twentyfourk.domain.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    Optional<Attendance> findByUserIdAndDate(UUID userId, LocalDate date);
    List<Attendance> findByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByDate(LocalDate date);
}
