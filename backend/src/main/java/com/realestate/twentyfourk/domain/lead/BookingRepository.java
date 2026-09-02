package com.realestate.twentyfourk.domain.lead;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByLeadId(UUID leadId);
    List<Booking> findByAssignedUserId(UUID assignedUserId);

    /** Sum all booking total prices — avoids full-table scan in analytics */
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b")
    BigDecimal sumTotalPrice();

    /** Sum commission earned — avoids full-table scan */
    @Query("SELECT COALESCE(SUM(b.commissionEarned), 0) FROM Booking b")
    BigDecimal sumCommissionEarned();
}
