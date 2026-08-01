package com.realestate.twentyfourk.domain.dam;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dam/assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DamAssetController {

    private final DamAssetService damAssetService;

    /**
     * Upload an asset to AWS S3 and save metadata.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<?> uploadAsset(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "category", defaultValue = "GALLERY") AssetCategory category,
            @RequestParam(value = "isPrivate", defaultValue = "false") Boolean isPrivate,
            @RequestParam(value = "propertyId", required = false) Long propertyId,
            Principal principal) {
        try {
            String uploadedBy = principal != null ? principal.getName() : "Admin";
            DamAsset asset = damAssetService.uploadAsset(file, title, category, isPrivate, propertyId, uploadedBy);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get paginated active assets with optional search & filtering.
     */
    @GetMapping
    public ResponseEntity<Page<DamAsset>> getAssets(
            @RequestParam(value = "category", required = false) AssetCategory category,
            @RequestParam(value = "propertyId", required = false) Long propertyId,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "24") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(damAssetService.getAssets(category, propertyId, search, pageable));
    }

    /**
     * Get trash (soft-deleted) assets.
     */
    @GetMapping("/trash")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Page<DamAsset>> getTrashAssets(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "24") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "deletedAt"));
        return ResponseEntity.ok(damAssetService.getTrashAssets(pageable));
    }

    /**
     * Get a temporary presigned S3 download/view URL for private document assets.
     */
    @GetMapping("/{id}/presigned-url")
    public ResponseEntity<?> getPresignedUrl(
            @PathVariable Long id,
            @RequestParam(value = "durationMinutes", defaultValue = "60") int durationMinutes,
            Principal principal) {
        try {
            String username = principal != null ? principal.getName() : "PublicUser";
            String url = damAssetService.getPresignedUrl(id, durationMinutes, username);
            return ResponseEntity.ok(Map.of("presignedUrl", url, "durationMinutes", durationMinutes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Replace asset with a new file (increments version number).
     */
    @PostMapping("/{id}/replace")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<?> replaceAsset(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        try {
            String updatedBy = principal != null ? principal.getName() : "Admin";
            DamAsset asset = damAssetService.replaceAsset(id, file, updatedBy);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Soft delete asset (Move to trash).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<?> softDeleteAsset(@PathVariable Long id, Principal principal) {
        try {
            String deletedBy = principal != null ? principal.getName() : "Admin";
            damAssetService.softDeleteAsset(id, deletedBy);
            return ResponseEntity.ok(Map.of("message", "Asset moved to trash successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Restore soft-deleted asset from trash.
     */
    @PostMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<?> restoreAsset(@PathVariable Long id, Principal principal) {
        try {
            String restoredBy = principal != null ? principal.getName() : "Admin";
            DamAsset asset = damAssetService.restoreAsset(id, restoredBy);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Permanently purge asset from S3 and Database.
     */
    @DeleteMapping("/{id}/purge")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<?> purgeAsset(@PathVariable Long id, Principal principal) {
        try {
            String purgedBy = principal != null ? principal.getName() : "Admin";
            damAssetService.purgeAsset(id, purgedBy);
            return ResponseEntity.ok(Map.of("message", "Asset permanently purged from S3 & PostgreSQL"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get Version history of an asset.
     */
    @GetMapping("/{id}/versions")
    public ResponseEntity<List<DamAssetVersion>> getAssetVersions(@PathVariable Long id) {
        return ResponseEntity.ok(damAssetService.getAssetVersions(id));
    }

    /**
     * Get Audit logs of an asset.
     */
    @GetMapping("/{id}/audit-logs")
    public ResponseEntity<List<DamAssetAuditLog>> getAuditLogs(@PathVariable Long id) {
        return ResponseEntity.ok(damAssetService.getAuditLogs(id));
    }
}
