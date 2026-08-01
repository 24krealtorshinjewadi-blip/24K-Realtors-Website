package com.realestate.twentyfourk.domain.dam;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DamAssetService {

    private static final Logger log = LoggerFactory.getLogger(DamAssetService.class);

    private final DamAssetRepository assetRepository;
    private final DamAssetVersionRepository versionRepository;
    private final DamAssetAuditLogRepository auditLogRepository;

    @Autowired(required = false)
    private S3Client s3Client;

    @Value("${aws.s3.bucket-name:twentyfourk-realestate-media}")
    private String bucketName;

    @Value("${aws.s3.region:ap-south-1}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${aws.s3.base-url:https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com}")
    private String s3BaseUrl;

    private S3Presigner s3Presigner;
    private final Path localUploadDir = Paths.get("uploads").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        if (accessKey != null && !accessKey.isBlank() && secretKey != null && !secretKey.isBlank()) {
            this.s3Presigner = S3Presigner.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)
                    ))
                    .build();
            log.info("✅ DamAssetService: S3Presigner initialized for bucket: {}", bucketName);
        } else {
            log.warn("⚠️ DamAssetService: S3 credentials missing. Private presigned URLs will fallback to direct URLs.");
        }
    }

    /**
     * Upload asset to S3 and save metadata to PostgreSQL.
     */
    @Transactional
    public DamAsset uploadAsset(
            MultipartFile file,
            String title,
            AssetCategory category,
            Boolean isPrivate,
            Long propertyId,
            String uploadedBy) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String subfolder = category.toS3Subfolder();
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file.bin";
        String ext = extractExtension(originalFilename);
        String uuidKey = subfolder + "/" + UUID.randomUUID() + ext;
        String mimeType = resolveMimeType(originalFilename, file.getContentType());
        long fileSize = file.getSize();

        // 1. Process Image metadata & thumbnail
        Integer width = null;
        Integer height = null;
        String thumbnailUrl = null;

        if (mimeType.startsWith("image/")) {
            try {
                BufferedImage originalImg = ImageIO.read(file.getInputStream());
                if (originalImg != null) {
                    width = originalImg.getWidth();
                    height = originalImg.getHeight();

                    // Generate Thumbnail
                    byte[] thumbBytes = generateThumbnail(originalImg, 300);
                    if (thumbBytes != null) {
                        String thumbKey = subfolder + "/thumb_" + UUID.randomUUID() + ".webp";
                        thumbnailUrl = uploadBytesToS3(thumbBytes, thumbKey, "image/webp");
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to extract image metadata or create thumbnail for {}: {}", originalFilename, e.getMessage());
            }
        }

        // 2. Upload Main Asset File to S3
        String cdnUrl;
        if (s3Client != null) {
            cdnUrl = uploadBytesToS3(file.getBytes(), uuidKey, mimeType);
        } else {
            cdnUrl = saveToLocal(file, uuidKey);
        }

        if (thumbnailUrl == null) {
            thumbnailUrl = cdnUrl;
        }

        String assetTitle = (title != null && !title.isBlank()) ? title : originalFilename;

        // 3. Save to DB
        DamAsset asset = DamAsset.builder()
                .assetKey(uuidKey)
                .title(assetTitle)
                .originalFilename(originalFilename)
                .category(category)
                .mimeType(mimeType)
                .fileSizeBytes(fileSize)
                .width(width)
                .height(height)
                .cdnUrl(cdnUrl)
                .thumbnailUrl(thumbnailUrl)
                .isPrivate(isPrivate != null ? isPrivate : false)
                .propertyId(propertyId)
                .versionNumber(1)
                .uploadedBy(uploadedBy != null ? uploadedBy : "System")
                .isDeleted(false)
                .build();

        DamAsset savedAsset = assetRepository.save(asset);

        // 4. Save Version 1
        saveVersion(savedAsset, uploadedBy);

        // 5. Audit Log
        createAuditLog(savedAsset.getId(), "UPLOAD", uploadedBy,
                "Uploaded asset: " + originalFilename + " (" + fileSize + " bytes) under category " + category);

        return savedAsset;
    }

    /**
     * Replace existing asset with a new file (increments version number).
     */
    @Transactional
    public DamAsset replaceAsset(Long assetId, MultipartFile file, String updatedBy) throws IOException {
        DamAsset asset = assetRepository.findByIdAndIsDeletedFalse(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found with ID: " + assetId));

        String subfolder = asset.getCategory().toS3Subfolder();
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : asset.getOriginalFilename();
        String ext = extractExtension(originalFilename);
        String newKey = subfolder + "/" + UUID.randomUUID() + ext;
        String mimeType = resolveMimeType(originalFilename, file.getContentType());
        long fileSize = file.getSize();

        String newCdnUrl;
        if (s3Client != null) {
            newCdnUrl = uploadBytesToS3(file.getBytes(), newKey, mimeType);
        } else {
            newCdnUrl = saveToLocal(file, newKey);
        }

        // Update asset
        asset.setAssetKey(newKey);
        asset.setCdnUrl(newCdnUrl);
        asset.setFileSizeBytes(fileSize);
        asset.setMimeType(mimeType);
        asset.setOriginalFilename(originalFilename);
        asset.setVersionNumber(asset.getVersionNumber() + 1);

        DamAsset updatedAsset = assetRepository.save(asset);

        // Save Version record
        saveVersion(updatedAsset, updatedBy);

        // Audit Log
        createAuditLog(updatedAsset.getId(), "REPLACE", updatedBy,
                "Replaced asset file with " + originalFilename + " (New version v" + updatedAsset.getVersionNumber() + ")");

        return updatedAsset;
    }

    /**
     * Generate temporary presigned S3 URL for private assets.
     */
    public String getPresignedUrl(Long assetId, int durationMinutes, String requestedBy) {
        DamAsset asset = assetRepository.findByIdAndIsDeletedFalse(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found with ID: " + assetId));

        if (s3Presigner != null && s3Client != null) {
            try {
                GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(asset.getAssetKey())
                        .build();

                GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(durationMinutes > 0 ? durationMinutes : 60))
                        .getObjectRequest(getObjectRequest)
                        .build();

                PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
                String presignedUrl = presignedRequest.url().toString();

                createAuditLog(asset.getId(), "PRESIGN_GENERATE", requestedBy,
                        "Generated presigned URL valid for " + durationMinutes + " mins");

                return presignedUrl;
            } catch (Exception e) {
                log.error("Failed to generate presigned URL for key {}: {}", asset.getAssetKey(), e.getMessage());
            }
        }

        return asset.getCdnUrl();
    }

    /**
     * Filter & Search assets with Pagination.
     */
    public Page<DamAsset> getAssets(AssetCategory category, Long propertyId, String search, Pageable pageable) {
        return assetRepository.filterAssets(category, propertyId, (search != null && !search.isBlank()) ? search.trim() : null, pageable);
    }

    /**
     * List trash / soft-deleted assets.
     */
    public Page<DamAsset> getTrashAssets(Pageable pageable) {
        return assetRepository.findByIsDeletedTrue(pageable);
    }

    /**
     * Soft delete asset (Move to trash).
     */
    @Transactional
    public void softDeleteAsset(Long assetId, String deletedBy) {
        DamAsset asset = assetRepository.findByIdAndIsDeletedFalse(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found with ID: " + assetId));

        asset.setIsDeleted(true);
        asset.setDeletedAt(ZonedDateTime.now());
        assetRepository.save(asset);

        createAuditLog(assetId, "DELETE", deletedBy, "Moved asset to trash: " + asset.getTitle());
    }

    /**
     * Restore soft-deleted asset from trash.
     */
    @Transactional
    public DamAsset restoreAsset(Long assetId, String restoredBy) {
        DamAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found with ID: " + assetId));

        if (!asset.getIsDeleted()) {
            return asset;
        }

        asset.setIsDeleted(false);
        asset.setDeletedAt(null);
        DamAsset restored = assetRepository.save(asset);

        createAuditLog(assetId, "RESTORE", restoredBy, "Restored asset from trash: " + asset.getTitle());
        return restored;
    }

    /**
     * Permanently purge asset from S3 and PostgreSQL.
     */
    @Transactional
    public void purgeAsset(Long assetId, String purgedBy) {
        DamAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found with ID: " + assetId));

        // Remove from S3
        deleteS3Object(asset.getAssetKey());

        assetRepository.delete(asset);

        createAuditLog(assetId, "PURGE", purgedBy, "Permanently purged asset & S3 object: " + asset.getAssetKey());
    }

    /**
     * Get Version history of an asset.
     */
    public List<DamAssetVersion> getAssetVersions(Long assetId) {
        return versionRepository.findByAssetIdOrderByVersionNumberDesc(assetId);
    }

    /**
     * Get Audit logs of an asset.
     */
    public List<DamAssetAuditLog> getAuditLogs(Long assetId) {
        return auditLogRepository.findByAssetIdOrderByCreatedAtDesc(assetId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal Helper Methods
    // ─────────────────────────────────────────────────────────────────────────

    private String uploadBytesToS3(byte[] bytes, String key, String contentType) {
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .contentLength((long) bytes.length)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(bytes));
            String url = s3BaseUrl + "/" + key;
            log.info("✅ DAM Uploaded to S3: {} -> {}", key, url);
            return url;
        } catch (Exception e) {
            log.error("S3 upload failed for key {}: {}", key, e.getMessage());
            throw new RuntimeException("S3 Upload failed: " + e.getMessage(), e);
        }
    }

    private void deleteS3Object(String key) {
        if (s3Client != null && key != null) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(key).build());
                log.info("🗑️ Deleted S3 object: {}", key);
            } catch (Exception e) {
                log.warn("Could not delete S3 object {}: {}", key, e.getMessage());
            }
        }
    }

    private String saveToLocal(MultipartFile file, String key) throws IOException {
        String filename = key.replace("/", "_");
        Path targetLocation = localUploadDir.resolve(filename);
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation);
        return "/api/v1/media/files/" + filename;
    }

    private byte[] generateThumbnail(BufferedImage original, int maxEdge) {
        try {
            int originalW = original.getWidth();
            int originalH = original.getHeight();

            if (originalW <= maxEdge && originalH <= maxEdge) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(original, "webp", baos);
                return baos.toByteArray();
            }

            double scale = Math.min((double) maxEdge / originalW, (double) maxEdge / originalH);
            int newW = (int) (originalW * scale);
            int newH = (int) (originalH * scale);

            BufferedImage resized = new BufferedImage(newW, newH, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resized.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.drawImage(original, 0, 0, newW, newH, null);
            g.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resized, "jpg", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            log.warn("Thumbnail generation failed: {}", e.getMessage());
            return null;
        }
    }

    private void saveVersion(DamAsset asset, String createdBy) {
        DamAssetVersion version = DamAssetVersion.builder()
                .assetId(asset.getId())
                .versionNumber(asset.getVersionNumber())
                .assetKey(asset.getAssetKey())
                .cdnUrl(asset.getCdnUrl())
                .fileSizeBytes(asset.getFileSizeBytes())
                .createdBy(createdBy != null ? createdBy : "System")
                .build();
        versionRepository.save(version);
    }

    private void createAuditLog(Long assetId, String action, String performedBy, String details) {
        DamAssetAuditLog auditLog = DamAssetAuditLog.builder()
                .assetId(assetId)
                .action(action)
                .performedBy(performedBy != null ? performedBy : "System")
                .details(details)
                .build();
        auditLogRepository.save(auditLog);
    }

    private String extractExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf(".")).toLowerCase();
        }
        return ".bin";
    }

    private String resolveMimeType(String filename, String declared) {
        if (filename == null) return "application/octet-stream";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".mp4")) return "video/mp4";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".mov")) return "video/quicktime";
        if (lower.endsWith(".pdf")) return "application/pdf";
        return declared != null ? declared : "application/octet-stream";
    }
}
