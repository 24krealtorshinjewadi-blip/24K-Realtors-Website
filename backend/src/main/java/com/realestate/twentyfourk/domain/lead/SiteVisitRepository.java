package com.realestate.twentyfourk.domain.lead;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SiteVisitRepository extends JpaRepository<SiteVisit, UUID> {
    List<SiteVisit> findByLeadId(UUID leadId);
    List<SiteVisit> findByAssignedUserId(UUID assignedUserId);

    /** Aggregate count by status string (SCHEDULED, COMPLETED, CANCELLED, etc.) */
    long countByStatus(String status);
}
