package com.realestate.twentyfourk.domain.society;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Tracks public documents available for a society/project.
 *
 * Tracks: brochure, floor plan, master plan, RERA certificate, legal documents, price sheet etc.
 *
 * IMPORTANT:
 *   - Do not scrape and republish copyrighted content without authorization.
 *   - Track image_source, license/usage_status, source_url.
 *   - Prefer official developer/project assets or properly licensed assets.
 */
@Entity
@Table(name = "property_documents", indexes = {
    @Index(name = "idx_doc_society_id", columnList = "society_id"),
    @Index(name = "idx_doc_type", columnList = "document_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The society this document belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /** Human-readable document name (e.g., "Godrej 24 Brochure", "Tower A Floor Plans"). */
    @Column(name = "document_name", nullable = false, length = 300)
    private String documentName;

    /**
     * Document type.
     * Values: BROCHURE, FLOOR_PLAN, MASTER_PLAN, RERA_CERTIFICATE,
     *         LEGAL_DOCUMENT, PRICE_SHEET, PROJECT_DOCUMENT, OTHER
     */
    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType;

    /** URL to the document (official/public source preferred). */
    @Column(name = "source_url", length = 2048)
    private String sourceUrl;

    /** Date this link was last verified/checked as active. */
    @Column(name = "last_checked")
    private LocalDate lastChecked;

    /**
     * Verification/accessibility status.
     * VERIFIED = Document accessible and confirmed from official source.
     * INACCESSIBLE = Link broken or content removed.
     * PENDING = Not yet verified.
     */
    @Column(name = "verification_status", nullable = false, length = 30)
    @Builder.Default
    private String verificationStatus = "PENDING";

    /** Where this document was sourced from (e.g., "Official Developer Website", "MahaRERA Portal"). */
    @Column(name = "source_name", length = 200)
    private String sourceName;

    /** Usage rights / copyright status (e.g., "Official public document", "Developer permitted use"). */
    @Column(name = "usage_status", length = 200)
    private String usageStatus;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}
