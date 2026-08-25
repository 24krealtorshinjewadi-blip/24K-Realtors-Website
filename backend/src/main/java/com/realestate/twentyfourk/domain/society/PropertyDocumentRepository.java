package com.realestate.twentyfourk.domain.society;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyDocumentRepository extends JpaRepository<PropertyDocument, UUID> {
    List<PropertyDocument> findBySocietyId(UUID societyId);
    List<PropertyDocument> findBySocietyIdAndDocumentType(UUID societyId, String documentType);
    List<PropertyDocument> findBySocietyIdAndVerificationStatus(UUID societyId, String verificationStatus);
}
