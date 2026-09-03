package com.realestate.twentyfourk.domain.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryVerificationRepository extends JpaRepository<InventoryVerification, UUID> {
    List<InventoryVerification> findByInventoryIdOrderByVerifiedAtDesc(UUID inventoryId);
}
