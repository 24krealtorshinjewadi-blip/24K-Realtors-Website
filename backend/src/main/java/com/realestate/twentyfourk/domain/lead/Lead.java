package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leads", indexes = {
    @Index(name = "idx_lead_status", columnList = "status"),
    @Index(name = "idx_lead_pref_loc", columnList = "preferred_location"),
    @Index(name = "idx_lead_created", columnList = "created_date")
})
@SQLDelete(sql = "UPDATE leads SET deleted_flag = true, active_flag = false WHERE id = ?")
@SQLRestriction("deleted_flag = false")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "requirement_type", nullable = false)
    private LeadRequirementType requirementType;

    @Column(name = "budget_min", precision = 15, scale = 2)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", precision = 15, scale = 2)
    private BigDecimal budgetMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_location")
    private PrimeCorridor preferredLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LeadStatus status;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "lead_score")
    @Builder.Default
    private Integer leadScore = 50;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_agent_id")
    private Agent assignedAgent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private com.realestate.twentyfourk.domain.property.Property property;

    @CreationTimestamp
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
