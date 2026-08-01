package com.realestate.twentyfourk.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

/**
 * AWS S3 Configuration for 24K Realtors Media Storage.
 *
 * Bucket  : twentyfourk-realestate-media (ap-south-1 / Mumbai)
 * IAM User: twentyfourk-s3-service-user
 *
 * Required env vars (set in Railway dashboard):
 *   AWS_ACCESS_KEY_ID     — IAM programmatic access key
 *   AWS_SECRET_ACCESS_KEY — IAM secret key
 *   AWS_S3_BUCKET         — Bucket name (default: twentyfourk-realestate-media)
 *   AWS_REGION            — AWS region (default: ap-south-1)
 */
@Configuration
public class S3Config {

    private static final Logger log = LoggerFactory.getLogger(S3Config.class);

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${aws.s3.region:ap-south-1}")
    private String region;

    /**
     * Creates an S3Client bean.
     * If credentials are present → uses StaticCredentialsProvider (Railway/prod).
     * If credentials are missing → uses default credential chain (local dev with AWS CLI).
     * Returns null if no credentials available — MediaUploadService falls back to local storage.
     */
    @Bean
    public S3Client s3Client() {
        if (accessKey != null && !accessKey.isBlank()
                && secretKey != null && !secretKey.isBlank()) {
            log.info("✅ AWS S3 initialized with explicit credentials. Region: {}", region);
            return S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(
                            StaticCredentialsProvider.create(
                                    AwsBasicCredentials.create(accessKey, secretKey)
                            )
                    )
                    .serviceConfiguration(
                            S3Configuration.builder()
                                    .pathStyleAccessEnabled(false)
                                    .build()
                    )
                    .build();
        } else {
            log.warn("⚠️  AWS S3 credentials not set. Media will fall back to local storage. " +
                     "Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in Railway env vars.");
            return null;
        }
    }
}
