package com.realestate.twentyfourk.domain.leave;

import com.realestate.twentyfourk.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leave_balances")
@SQLDelete(sql = "UPDATE leave_balances SET deleted_flag = true, active_flag = false WHERE id = ?")
@SQLRestriction("deleted_flag = false")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "casual_leaves", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal casualLeaves = new BigDecimal("12.00");

    @Column(name = "sick_leaves", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal sickLeaves = new BigDecimal("10.00");

    @Column(name = "earned_leaves", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal earnedLeaves = new BigDecimal("15.00");

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

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
