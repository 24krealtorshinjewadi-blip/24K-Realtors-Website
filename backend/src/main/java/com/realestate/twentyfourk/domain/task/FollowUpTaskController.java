package com.realestate.twentyfourk.domain.task;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRole;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor

public class FollowUpTaskController {

    private final FollowUpTaskService taskService;

    @GetMapping
    public ResponseEntity<List<FollowUpTask>> getAllTasks(@AuthenticationPrincipal User currentUser) {
        if (currentUser != null && currentUser.getRole() == UserRole.RELATIONSHIP_MANAGER) {
            return ResponseEntity.ok(taskService.getTasksByAgentEmail(currentUser.getEmail()));
        }
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<FollowUpTask>> getTasksByLead(@PathVariable UUID leadId) {
        return ResponseEntity.ok(taskService.getTasksByLead(leadId));
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<FollowUpTask>> getTasksByAgent(@PathVariable UUID agentId) {
        return ResponseEntity.ok(taskService.getTasksByAgent(agentId));
    }

    @PostMapping
    public ResponseEntity<FollowUpTask> createTask(@RequestBody TaskRequest request) {
        FollowUpTask task = taskService.createTask(
                request.getLeadId(),
                request.getAgentId(),
                request.getTitle(),
                request.getDescription(),
                request.getTaskType(),
                request.getDueDate(),
                request.getPriority()
        );
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<FollowUpTask> updateTaskStatus(
            @PathVariable UUID taskId,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTaskStats() {
        return ResponseEntity.ok(taskService.getTaskStats());
    }

    @Data
    public static class TaskRequest {
        private UUID leadId;
        private UUID agentId;
        private String title;
        private String description;
        private TaskType taskType;
        private LocalDateTime dueDate;
        private TaskPriority priority;
    }
}
