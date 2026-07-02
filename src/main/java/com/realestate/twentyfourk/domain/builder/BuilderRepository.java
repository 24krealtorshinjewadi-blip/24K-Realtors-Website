package com.realestate.twentyfourk.domain.builder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuilderRepository extends JpaRepository<Builder, UUID> {
    Optional<Builder> findBySlug(String slug);
}
