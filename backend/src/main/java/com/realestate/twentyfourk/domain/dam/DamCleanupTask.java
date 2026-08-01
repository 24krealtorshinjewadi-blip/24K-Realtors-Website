package com.realestate.twentyfourk.domain.dam;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DamCleanupTask {

    private static final Logger log = LoggerFactory.getLogger(DamCleanupTask.class);

    private final DamAssetRepository assetRepository;
    private final DamAssetService damAssetService;

    /**
     * Runs every day at 3:00 AM to purge soft-deleted DAM assets older than 30 days.
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOrphanedTrashAssets() {
        ZonedDateTime cutoffDate = ZonedDateTime.now().minusDays(30);
        log.info("🧹 Starting DAM Scheduled Cleanup for soft-deleted assets prior to {}", cutoffDate);

        List<DamAsset> expiredTrash = assetRepository.findByIsDeletedTrueAndDeletedAtBefore(cutoffDate);
        if (expiredTrash.isEmpty()) {
            log.info("🧹 DAM Scheduled Cleanup: No expired trash items found.");
            return;
        }

        int count = 0;
        for (DamAsset asset : expiredTrash) {
            try {
                damAssetService.purgeAsset(asset.getId(), "SYSTEM_CRON_CLEANUP");
                count++;
            } catch (Exception e) {
                log.error("Failed to purge asset ID {}: {}", asset.getId(), e.getMessage());
            }
        }
        log.info("✅ DAM Scheduled Cleanup completed: Purged {} expired assets from S3 & PostgreSQL.", count);
    }
}
