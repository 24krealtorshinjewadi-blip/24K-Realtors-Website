package com.realestate.twentyfourk.domain.task;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.lead.Lead;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "follow_up_tasks")
@SQLDelete(sql = "UPDATE follow_up_tasks SET deleted_flag = true, active_flag = false WHERE id = ?")
@SQLRestriction("deleted_flag = false")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUpTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false)
    private TaskType taskType;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TaskPriority priority;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "active_flag", nullable = false)
    @Builder.Default
    private boolean activeFlag = true;

    @Column(name = "deleted_flag", nullable = false)
    @Builder.Default
    private boolean deletedFlag = false;

    @Version
    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 0;

    @CreatedBy
    @Column(name = "created_by")
    private UUID createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private UUID updatedBy;
}
