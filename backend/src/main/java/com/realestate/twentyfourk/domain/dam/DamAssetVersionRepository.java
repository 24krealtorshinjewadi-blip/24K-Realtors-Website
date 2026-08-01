package com.realestate.twentyfourk.domain.dam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DamAssetVersionRepository extends JpaRepository<DamAssetVersion, Long> {
    List<DamAssetVersion> findByAssetIdOrderByVersionNumberDesc(Long assetId);
}
