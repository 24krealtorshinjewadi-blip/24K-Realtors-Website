package com.realestate.twentyfourk.domain.blog;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;

    @Override
    public Blog createBlog(Blog blog) {
        if (blog.getSlug() == null || blog.getSlug().trim().isEmpty()) {
            blog.setSlug(blog.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return blogRepository.save(blog);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Blog> getAllBlogsAdmin(Pageable pageable) {
        return blogRepository.findByDeletedFlagFalse(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Blog> getPublishedBlogs(Pageable pageable) {
        return blogRepository.findByPublishedTrueAndDeletedFlagFalse(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Blog getBlogById(UUID id) {
        return blogRepository.findById(id)
                .filter(blog -> !blog.isDeletedFlag())
                .orElseThrow(() -> new IllegalArgumentException("Blog not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlugAndDeletedFlagFalse(slug)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found with slug: " + slug));
    }

    @Override
    @Transactional(readOnly = true)
    public Blog getPublishedBlogBySlug(String slug) {
        return blogRepository.findBySlugAndPublishedTrueAndDeletedFlagFalse(slug)
                .orElseThrow(() -> new IllegalArgumentException("Published blog not found with slug: " + slug));
    }

    @Override
    public Blog updateBlog(UUID id, Blog updated) {
        Blog existing = getBlogById(id);
        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        existing.setCoverImageUrl(updated.getCoverImageUrl());
        existing.setAuthor(updated.getAuthor());
        existing.setSeoTitle(updated.getSeoTitle());
        existing.setSeoDescription(updated.getSeoDescription());
        existing.setPublished(updated.isPublished());
        
        // Regenerate slug if title changes (optional, but keep it clean)
        if (updated.getSlug() != null && !updated.getSlug().trim().isEmpty()) {
            existing.setSlug(updated.getSlug());
        } else {
            existing.setSlug(updated.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        
        return blogRepository.save(existing);
    }

    @Override
    public void deleteBlog(UUID id) {
        Blog existing = getBlogById(id);
        existing.setDeletedFlag(true);
        blogRepository.save(existing);
    }
}
