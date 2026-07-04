package com.realestate.twentyfourk.domain.task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface FollowUpTaskService {
    FollowUpTask createTask(UUID leadId, UUID agentId, String title, String description, TaskType taskType, LocalDateTime dueDate, TaskPriority priority);
    FollowUpTask updateTaskStatus(UUID taskId, TaskStatus status);
    List<FollowUpTask> getAllTasks();
    List<FollowUpTask> getTasksByLead(UUID leadId);
    List<FollowUpTask> getTasksByAgent(UUID agentId);
    List<FollowUpTask> getTasksByAgentEmail(String email);
    void deleteTask(UUID taskId);
    Map<String, Object> getTaskStats();
}
