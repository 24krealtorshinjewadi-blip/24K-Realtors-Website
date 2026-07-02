package com.realestate.twentyfourk.domain.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogRepository extends JpaRepository<Blog, UUID> {
    Optional<Blog> findBySlugAndDeletedFlagFalse(String slug);
    Optional<Blog> findBySlugAndPublishedTrueAndDeletedFlagFalse(String slug);
    Page<Blog> findByDeletedFlagFalse(Pageable pageable);
    Page<Blog> findByPublishedTrueAndDeletedFlagFalse(Pageable pageable);
}
