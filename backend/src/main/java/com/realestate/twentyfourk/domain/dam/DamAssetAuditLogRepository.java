package com.realestate.twentyfourk.domain.dam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DamAssetAuditLogRepository extends JpaRepository<DamAssetAuditLog, Long> {
    List<DamAssetAuditLog> findByAssetIdOrderByCreatedAtDesc(Long assetId);
    List<DamAssetAuditLog> findTop50ByOrderByCreatedAtDesc();
}
