package com.realestate.twentyfourk.domain.dam;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DamAssetRepository extends JpaRepository<DamAsset, Long> {

    Optional<DamAsset> findByIdAndIsDeletedFalse(Long id);

    Page<DamAsset> findByIsDeletedFalse(Pageable pageable);

    Page<DamAsset> findByIsDeletedTrue(Pageable pageable);

    @Query("SELECT a FROM DamAsset a WHERE a.isDeleted = false " +
           "AND (:category IS NULL OR a.category = :category) " +
           "AND (:propertyId IS NULL OR a.propertyId = :propertyId) " +
           "AND (:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.originalFilename) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<DamAsset> filterAssets(
            @Param("category") AssetCategory category,
            @Param("propertyId") Long propertyId,
            @Param("search") String search,
            Pageable pageable
    );

    List<DamAsset> findByPropertyIdAndIsDeletedFalse(Long propertyId);

    List<DamAsset> findByCategoryAndIsDeletedFalse(AssetCategory category);

    List<DamAsset> findByIsDeletedTrueAndDeletedAtBefore(ZonedDateTime cutoffDate);
}
