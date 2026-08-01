package com.realestate.twentyfourk.domain.media;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * AWS S3 Media Upload Service — 24K Realtors
 *
 * Supports uploading to organized S3 folder structure:
 *   s3://twentyfourk-realestate-media/
 *   ├── gallery/       ← Gallery images (luxury/drone views)
 *   ├── properties/    ← Property listing images
 *   ├── documents/     ← RERA / agreement PDFs
 *   └── videos/        ← Site tour videos
 *
 * Falls back to local filesystem if S3 credentials are not configured.
 */
@Service
public class MediaUploadService {

    private static final Logger log = LoggerFactory.getLogger(MediaUploadService.class);

    @Autowired(required = false)
    private S3Client s3Client;

    @Value("${aws.s3.bucket-name:twentyfourk-realestate-media}")
    private String bucketName;

    @Value("${aws.s3.base-url:https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com}")
    private String s3BaseUrl;

    private final Path localUploadDir = Paths.get("uploads").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        if (s3Client != null) {
            log.info("✅ MediaUploadService using AWS S3 bucket: {}", bucketName);
        } else {
            log.warn("⚠️  S3 client unavailable. Falling back to local storage at: {}", localUploadDir);
            try {
                Files.createDirectories(localUploadDir);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create local uploads directory", e);
            }
        }
    }

    /**
     * Uploads a file to the specified S3 folder.
     *
     * @param file   The multipart file to upload
     * @param folder S3 subfolder: "gallery", "properties", "documents", "videos"
     * @return Public S3 URL of the uploaded file
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String safeFolder = sanitizeFolder(folder);
        String extension  = extractExtension(file.getOriginalFilename());
        String key        = safeFolder + "/" + UUID.randomUUID() + extension;
        String contentType = resolveContentType(file.getOriginalFilename(), file.getContentType());

        if (s3Client != null) {
            return uploadToS3(file, key, contentType);
        } else {
            return uploadToLocal(file, key);
        }
    }

    /**
     * Overload for backward compatibility — defaults to "gallery" folder.
     */
    public String uploadFile(MultipartFile file) throws IOException {
        return uploadFile(file, "gallery");
    }

    /**
     * Deletes a file from S3 by its key (e.g., "gallery/uuid.jpg").
     *
     * @param key The S3 object key
     */
    public void deleteFile(String key) {
        if (s3Client == null) {
            log.warn("S3 not configured — skipping delete for key: {}", key);
            return;
        }
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
            log.info("🗑️  Deleted S3 object: {}", key);
        } catch (S3Exception e) {
            log.error("Failed to delete S3 object {}: {}", key, e.awsErrorDetails().errorMessage());
            throw new RuntimeException("S3 delete failed: " + e.awsErrorDetails().errorMessage(), e);
        }
    }

    /**
     * Retrieves a file from local storage (used only in local fallback mode).
     */
    public byte[] getLocalFile(String filename) throws IOException {
        Path filePath = localUploadDir.resolve(filename).normalize();
        if (!filePath.startsWith(localUploadDir) || !Files.exists(filePath)) {
            throw new IllegalArgumentException("File not found or access denied: " + filename);
        }
        return Files.readAllBytes(filePath);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private String uploadToS3(MultipartFile file, String key, String contentType) throws IOException {
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
            String url = s3BaseUrl + "/" + key;
            log.info("✅ Uploaded to S3: {} → {}", key, url);
            return url;
        } catch (S3Exception e) {
            log.error("S3 upload failed for key {}: {}", key, e.awsErrorDetails().errorMessage());
            throw new IOException("S3 upload failed: " + e.awsErrorDetails().errorMessage(), e);
        }
    }

    private String uploadToLocal(MultipartFile file, String key) throws IOException {
        // Flatten folder/uuid.ext → uuid.ext for local storage
        String filename = key.replace("/", "_");
        Path targetLocation = localUploadDir.resolve(filename);
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation);
        log.info("📁 Saved locally: {}", targetLocation);
        return "/api/v1/media/files/" + filename;
    }

    private String sanitizeFolder(String folder) {
        if (folder == null || folder.isBlank()) return "gallery";
        return switch (folder.toLowerCase().trim()) {
            case "properties" -> "properties";
            case "documents"  -> "documents";
            case "videos"     -> "videos";
            default           -> "gallery";
        };
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename != null && originalFilename.contains(".")) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            // Allow only safe extensions
            return switch (ext) {
                case ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif",
                     ".mp4", ".mov", ".avi", ".webm",
                     ".pdf" -> ext;
                default -> ".bin";
            };
        }
        return ".bin";
    }

    private String resolveContentType(String filename, String declared) {
        if (filename == null) return "application/octet-stream";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".gif"))  return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".avif")) return "image/avif";
        if (lower.endsWith(".mp4"))  return "video/mp4";
        if (lower.endsWith(".mov"))  return "video/quicktime";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".pdf"))  return "application/pdf";
        return declared != null ? declared : "application/octet-stream";
    }
}
