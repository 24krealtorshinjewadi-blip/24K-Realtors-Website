package com.realestate.twentyfourk.domain.media;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class MediaUploadService {

    private static final Logger log = LoggerFactory.getLogger(MediaUploadService.class);

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private final Path localUploadDir = Paths.get("uploads").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        if (cloudName != null && !cloudName.trim().isEmpty() &&
            apiKey != null && !apiKey.trim().isEmpty() &&
            apiSecret != null && !apiSecret.trim().isEmpty()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            log.info("Cloudinary initialized successfully.");
        } else {
            log.info("Cloudinary credentials missing. Falling back to local storage in: {}", localUploadDir);
            try {
                Files.createDirectories(localUploadDir);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create local uploads directory", e);
            }
        }
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        if (cloudinary != null) {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "twentyfourk-realestate"
            ));
            return (String) uploadResult.get("secure_url");
        } else {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = localUploadDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation);
            return "/api/v1/media/files/" + uniqueFilename;
        }
    }

    public byte[] getLocalFile(String filename) throws IOException {
        Path filePath = localUploadDir.resolve(filename).normalize();
        if (!filePath.startsWith(localUploadDir) || !Files.exists(filePath)) {
            throw new IllegalArgumentException("File not found or access denied: " + filename);
        }
        return Files.readAllBytes(filePath);
    }
}
