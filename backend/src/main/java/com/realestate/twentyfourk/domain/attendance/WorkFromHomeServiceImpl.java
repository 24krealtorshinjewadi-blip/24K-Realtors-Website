package com.realestate.twentyfourk.domain.attendance;

import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkFromHomeServiceImpl implements WorkFromHomeService {

    private final WorkFromHomeRepository workFromHomeRepository;
    private final UserRepository userRepository;

    @Override
    public WorkFromHome applyWfh(UUID userId, LocalDate startDate, LocalDate endDate, String reason) {
        User employee = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }

        WorkFromHome wfh = WorkFromHome.builder()
                .user(employee)
                .startDate(startDate)
                .endDate(endDate)
                .reason(reason)
                .status(WfhStatus.PENDING)
                .build();

        return workFromHomeRepository.save(wfh);
    }

    @Override
    public WorkFromHome approveWfh(UUID wfhId, UUID managerId) {
        WorkFromHome wfh = workFromHomeRepository.findById(wfhId)
                .orElseThrow(() -> new IllegalArgumentException("WFH request not found with ID: " + wfhId));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + managerId));

        wfh.setStatus(WfhStatus.APPROVED);
        wfh.setApprovedBy(manager);
        wfh.setApprovedDate(LocalDateTime.now());

        return workFromHomeRepository.save(wfh);
    }

    @Override
    public WorkFromHome rejectWfh(UUID wfhId, UUID managerId) {
        WorkFromHome wfh = workFromHomeRepository.findById(wfhId)
                .orElseThrow(() -> new IllegalArgumentException("WFH request not found with ID: " + wfhId));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + managerId));

        wfh.setStatus(WfhStatus.REJECTED);
        wfh.setApprovedBy(manager);
        wfh.setApprovedDate(LocalDateTime.now());

        return workFromHomeRepository.save(wfh);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkFromHome> getOwnRequests(UUID userId) {
        return workFromHomeRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkFromHome> getPendingRequests() {
        return workFromHomeRepository.findByStatus(WfhStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isWfhActiveToday(UUID userId) {
        List<WorkFromHome> wfhList = workFromHomeRepository.findApprovedWfhForDate(userId, LocalDate.now());
        return !wfhList.isEmpty();
    }
}
