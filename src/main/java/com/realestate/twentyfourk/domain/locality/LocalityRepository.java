package com.realestate.twentyfourk.domain.locality;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, UUID> {
    Optional<Locality> findBySlug(String slug);
}
