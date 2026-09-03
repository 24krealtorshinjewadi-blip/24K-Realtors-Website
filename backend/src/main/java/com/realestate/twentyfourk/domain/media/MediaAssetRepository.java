package com.realestate.twentyfourk.domain.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaAssetRepository extends JpaRepository<MediaAsset, UUID> {
    List<MediaAsset> findByProjectIdAndPublishedTrueOrderByDisplayOrderAsc(UUID projectId);
    List<MediaAsset> findByInventoryIdAndPublishedTrueOrderByDisplayOrderAsc(UUID inventoryId);
    List<MediaAsset> findByProjectIdAndAssetTypeAndPublishedTrue(UUID projectId, MediaAssetType assetType);
}
