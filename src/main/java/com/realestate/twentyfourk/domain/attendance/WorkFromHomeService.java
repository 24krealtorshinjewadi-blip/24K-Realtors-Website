package com.realestate.twentyfourk.domain.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface WorkFromHomeService {
    WorkFromHome applyWfh(UUID userId, LocalDate startDate, LocalDate endDate, String reason);
    WorkFromHome approveWfh(UUID wfhId, UUID managerId);
    WorkFromHome rejectWfh(UUID wfhId, UUID managerId);
    List<WorkFromHome> getOwnRequests(UUID userId);
    List<WorkFromHome> getPendingRequests();
    boolean isWfhActiveToday(UUID userId);
}
