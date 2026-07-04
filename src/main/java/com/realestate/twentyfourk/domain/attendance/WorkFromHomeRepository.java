package com.realestate.twentyfourk.domain.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface WorkFromHomeRepository extends JpaRepository<WorkFromHome, UUID> {

    List<WorkFromHome> findByUserId(UUID userId);

    List<WorkFromHome> findByStatus(WfhStatus status);

    @Query("SELECT w FROM WorkFromHome w WHERE w.user.id = :userId AND w.status = com.realestate.twentyfourk.domain.attendance.WfhStatus.APPROVED AND :date BETWEEN w.startDate AND w.endDate")
    List<WorkFromHome> findApprovedWfhForDate(@Param("userId") UUID userId, @Param("date") LocalDate date);
}
