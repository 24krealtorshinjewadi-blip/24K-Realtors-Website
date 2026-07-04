package com.realestate.twentyfourk.domain.leave;

import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    @Override
    public LeaveRequest applyLeave(UUID userId, LeaveType leaveType, LocalDate startDate, LocalDate endDate, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date!");
        }

        long requestedDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        BigDecimal daysBigDecimal = new BigDecimal(requestedDays);

        LeaveBalance balance = getOrCreateLeaveBalance(user);

        // Check if balance is sufficient
        BigDecimal currentBalance = getBalanceForType(balance, leaveType);
        if (currentBalance.compareTo(daysBigDecimal) < 0) {
            throw new IllegalArgumentException("Insufficient leave balance! Requested: " + requestedDays + ", Available: " + currentBalance);
        }

        // Deduct balance tentatively
        deductBalance(balance, leaveType, daysBigDecimal);
        leaveBalanceRepository.save(balance);

        LeaveRequest request = LeaveRequest.builder()
                .user(user)
                .leaveType(leaveType)
                .startDate(startDate)
                .endDate(endDate)
                .reason(reason)
                .status(LeaveStatus.PENDING)
                .build();

        return leaveRequestRepository.save(request);
    }

    @Override
    public LeaveRequest approveLeave(UUID leaveRequestId, UUID managerId) {
        LeaveRequest request = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found with ID: " + leaveRequestId));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is already processed: " + request.getStatus());
        }

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + managerId));

        request.setStatus(LeaveStatus.APPROVED);
        request.setApprovedBy(manager);
        request.setApprovedDate(LocalDateTime.now());

        return leaveRequestRepository.save(request);
    }

    @Override
    public LeaveRequest rejectLeave(UUID leaveRequestId, UUID managerId) {
        LeaveRequest request = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found with ID: " + leaveRequestId));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is already processed: " + request.getStatus());
        }

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + managerId));

        request.setStatus(LeaveStatus.REJECTED);
        request.setApprovedBy(manager);
        request.setApprovedDate(LocalDateTime.now());

        // Refund the deducted leaves back to balance
        long requestedDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal daysBigDecimal = new BigDecimal(requestedDays);
        LeaveBalance balance = getOrCreateLeaveBalance(request.getUser());
        refundBalance(balance, request.getLeaveType(), daysBigDecimal);
        leaveBalanceRepository.save(balance);

        return leaveRequestRepository.save(request);
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveBalance getLeaveBalance(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return getOrCreateLeaveBalance(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> getOwnRequests(UUID userId) {
        return leaveRequestRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> getAllRequests() {
        return leaveRequestRepository.findAll();
    }

    private LeaveBalance getOrCreateLeaveBalance(User user) {
        return leaveBalanceRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    LeaveBalance defaultBalance = LeaveBalance.builder()
                            .user(user)
                            .casualLeaves(new BigDecimal("12.00"))
                            .sickLeaves(new BigDecimal("10.00"))
                            .earnedLeaves(new BigDecimal("15.00"))
                            .build();
                    return leaveBalanceRepository.save(defaultBalance);
                });
    }

    private BigDecimal getBalanceForType(LeaveBalance balance, LeaveType type) {
        return switch (type) {
            case CASUAL -> balance.getCasualLeaves();
            case SICK -> balance.getSickLeaves();
            case EARNED -> balance.getEarnedLeaves();
            case COMP_OFF -> new BigDecimal("99.00"); // Unlimited or mock
        };
    }

    private void deductBalance(LeaveBalance balance, LeaveType type, BigDecimal amount) {
        switch (type) {
            case CASUAL -> balance.setCasualLeaves(balance.getCasualLeaves().subtract(amount));
            case SICK -> balance.setSickLeaves(balance.getSickLeaves().subtract(amount));
            case EARNED -> balance.setEarnedLeaves(balance.getEarnedLeaves().subtract(amount));
            case COMP_OFF -> {}
        }
    }

    private void refundBalance(LeaveBalance balance, LeaveType type, BigDecimal amount) {
        switch (type) {
            case CASUAL -> balance.setCasualLeaves(balance.getCasualLeaves().add(amount));
            case SICK -> balance.setSickLeaves(balance.getSickLeaves().add(amount));
            case EARNED -> balance.setEarnedLeaves(balance.getEarnedLeaves().add(amount));
            case COMP_OFF -> {}
        }
    }
}
