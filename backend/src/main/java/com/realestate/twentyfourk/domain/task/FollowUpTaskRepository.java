package com.realestate.twentyfourk.domain.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FollowUpTaskRepository extends JpaRepository<FollowUpTask, UUID> {
    List<FollowUpTask> findByLeadId(UUID leadId);
    List<FollowUpTask> findByAgentId(UUID agentId);
    List<FollowUpTask> findByStatus(TaskStatus status);
    List<FollowUpTask> findByAgentEmail(String email);

    /** Aggregate count by status — avoids full list load */
    long countByStatus(TaskStatus status);
}
