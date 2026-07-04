package com.realestate.twentyfourk.domain.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AttendanceBreakRepository extends JpaRepository<AttendanceBreak, UUID> {
}
