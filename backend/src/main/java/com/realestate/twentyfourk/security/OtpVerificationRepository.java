package com.realestate.twentyfourk.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, String> {
    Optional<OtpVerification> findByTempToken(String tempToken);

    Optional<OtpVerification> findByIdentifierAndIdentifierType(String identifier, String identifierType);

    @Transactional
    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.expiresAt < ?1")
    void deleteExpiredBefore(LocalDateTime dateTime);
}

