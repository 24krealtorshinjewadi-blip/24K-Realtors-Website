package com.realestate.twentyfourk.domain.leave;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface LeaveService {
    LeaveRequest applyLeave(UUID userId, LeaveType leaveType, LocalDate startDate, LocalDate endDate, String reason);
    LeaveRequest approveLeave(UUID leaveRequestId, UUID managerId);
    LeaveRequest rejectLeave(UUID leaveRequestId, UUID managerId);
    LeaveBalance getLeaveBalance(UUID userId);
    List<LeaveRequest> getOwnRequests(UUID userId);
    List<LeaveRequest> getPendingRequests();
    List<LeaveRequest> getAllRequests();
}
