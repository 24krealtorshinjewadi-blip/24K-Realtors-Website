package com.realestate.twentyfourk.domain.task;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import com.realestate.twentyfourk.domain.audit.AuditLogService;
import com.realestate.twentyfourk.domain.lead.Lead;
import com.realestate.twentyfourk.domain.lead.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FollowUpTaskServiceImpl implements FollowUpTaskService {

    private final FollowUpTaskRepository taskRepository;
    private final LeadRepository leadRepository;
    private final AgentRepository agentRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public FollowUpTask createTask(UUID leadId, UUID agentId, String title, String description, TaskType taskType, LocalDateTime dueDate, TaskPriority priority) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with ID: " + leadId));
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found with ID: " + agentId));

        FollowUpTask task = FollowUpTask.builder()
                .lead(lead)
                .agent(agent)
                .title(title)
                .description(description)
                .taskType(taskType)
                .dueDate(dueDate)
                .status(TaskStatus.PENDING)
                .priority(priority)
                .build();

        FollowUpTask savedTask = taskRepository.save(task);

        auditLogService.logAction(
                "CREATE_TASK",
                "FollowUpTask",
                savedTask.getId(),
                null,
                String.format("Title: %s, Agent: %s, Lead: %s", title, agent.getName(), lead.getName())
        );

        return savedTask;
    }

    @Override
    @Transactional
    public FollowUpTask updateTaskStatus(UUID taskId, TaskStatus status) {
        FollowUpTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        String oldStatus = task.getStatus().toString();
        task.setStatus(status);
        FollowUpTask updatedTask = taskRepository.save(task);

        auditLogService.logAction(
                "UPDATE_TASK_STATUS",
                "FollowUpTask",
                updatedTask.getId(),
                oldStatus,
                status.toString()
        );

        return updatedTask;
    }

    @Override
    public List<FollowUpTask> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<FollowUpTask> getTasksByLead(UUID leadId) {
        return taskRepository.findByLeadId(leadId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpTask> getTasksByAgent(UUID agentId) {
        return taskRepository.findByAgentId(agentId);
    }

    @Override
    @Transactional
    public void deleteTask(UUID taskId) {
        FollowUpTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        taskRepository.delete(task);

        auditLogService.logAction(
                "DELETE_TASK",
                "FollowUpTask",
                taskId,
                task.getTitle(),
                null
        );
    }

    @Override
    public Map<String, Object> getTaskStats() {
        List<FollowUpTask> tasks = taskRepository.findAll();
        long totalTasks = tasks.size();
        long pendingTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count();
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

        LocalDateTime now = LocalDateTime.now();
        long overdueTasks = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.PENDING && t.getDueDate().isBefore(now))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", totalTasks);
        stats.put("pendingTasks", pendingTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("overdueTasks", overdueTasks);

        return stats;
    }
}
