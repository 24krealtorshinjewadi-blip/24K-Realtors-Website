package com.realestate.twentyfourk.domain.society;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SocietyRepository extends JpaRepository<Society, UUID> {
    Optional<Society> findBySlug(String slug);
    Page<Society> findByActiveFlagTrueAndDeletedFlagFalse(Pageable pageable);
}
