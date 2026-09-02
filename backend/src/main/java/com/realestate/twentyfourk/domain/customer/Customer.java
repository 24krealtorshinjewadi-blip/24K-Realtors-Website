package com.realestate.twentyfourk.domain.customer;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.lead.Booking;
import com.realestate.twentyfourk.domain.lead.Lead;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_phone", columnList = "phone"),
    @Index(name = "idx_customer_email", columnList = "email"),
    @Index(name = "idx_customer_type", columnList = "customer_type"),
    @Index(name = "idx_customer_kyc", columnList = "kyc_status")
})
@SQLDelete(sql = "UPDATE customers SET deleted_flag = true, active_flag = false WHERE id = ? AND version = ?")
@SQLRestriction("deleted_flag = false")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "alternate_phone", length = 50)
    private String alternatePhone;

    @Column(name = "pan_number", length = 20)
    private String panNumber;

    @Column(name = "aadhar_number", length = 20)
    private String aadharNumber;

    @Column(name = "city", length = 100)
    @Builder.Default
    private String city = "Pune";

    @Column(name = "state", length = 100)
    @Builder.Default
    private String state = "Maharashtra";

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type", nullable = false)
    @Builder.Default
    private CustomerType customerType = CustomerType.INDIVIDUAL_BUYER;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    @Builder.Default
    private KycStatus kycStatus = KycStatus.PENDING;

    @Column(name = "total_investment_amount", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal totalInvestmentAmount = BigDecimal.ZERO;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_from_lead_id")
    private Lead convertedFromLead;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_agent_id")
    private Agent assignedAgent;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
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
