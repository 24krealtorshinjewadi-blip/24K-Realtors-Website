package com.realestate.twentyfourk.domain.media;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for Media Uploads — 24K Realtors
 *
 * Endpoints:
 *   POST   /api/v1/media/upload?folder=gallery      → Upload file to S3 folder
 *   GET    /api/v1/media/files/{filename}            → Serve local file (fallback only)
 *   DELETE /api/v1/media/{folder}/{key}              → Delete file from S3
 *
 * Allowed folders: gallery | properties | documents | videos
 */
@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor

public class MediaUploadController {

    private final MediaUploadService mediaUploadService;

    /**
     * Upload a file to AWS S3.
     *
     * @param file   Multipart file (image, video, PDF)
     * @param folder S3 subfolder — gallery | properties | documents | videos (default: gallery)
     * @return JSON: { "url": "https://...s3.amazonaws.com/gallery/uuid.jpg", "key": "gallery/uuid.jpg" }
     */
    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "gallery") String folder) {
        try {
            String url = mediaUploadService.uploadFile(file, folder);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            // Extract key from URL for delete operations: "gallery/uuid.jpg"
            response.put("key", extractKeyFromUrl(url, folder));
            response.put("folder", folder);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Upload failed: " + e.getMessage())
            );
        }
    }

    /**
     * Delete a file from AWS S3.
     *
     * @param folder S3 subfolder (gallery | properties | documents | videos)
     * @param key    Filename portion of the S3 key (UUID + extension)
     */
    @DeleteMapping("/{folder}/{key}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteFile(
            @PathVariable String folder,
            @PathVariable String key) {
        try {
            mediaUploadService.deleteFile(folder + "/" + key);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully", "key", folder + "/" + key));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Delete failed: " + e.getMessage())
            );
        }
    }

    /**
     * Serve a file from local storage (only active in local fallback mode).
     * Not used when S3 is configured — S3 URLs are direct CDN links.
     */
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<byte[]> getLocalFile(@PathVariable String filename) {
        try {
            byte[] data = mediaUploadService.getLocalFile(filename);
            MediaType mediaType = resolveMediaType(filename);
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(data);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private MediaType resolveMediaType(String filename) {
        if (filename == null) return MediaType.APPLICATION_OCTET_STREAM;
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (lower.endsWith(".png"))  return MediaType.IMAGE_PNG;
        if (lower.endsWith(".gif"))  return MediaType.IMAGE_GIF;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        if (lower.endsWith(".pdf"))  return MediaType.APPLICATION_PDF;
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private String extractKeyFromUrl(String url, String folder) {
        // If URL is a local path (fallback mode), return as-is
        if (url.startsWith("/api/")) {
            return url.substring(url.lastIndexOf('/') + 1);
        }
        // S3 URL: extract everything after the base URL domain
        int idx = url.indexOf(folder + "/");
        return idx >= 0 ? url.substring(idx) : url;
    }
}
