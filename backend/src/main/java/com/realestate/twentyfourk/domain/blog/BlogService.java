package com.realestate.twentyfourk.domain.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BlogService {
    Blog createBlog(Blog blog);
    Page<Blog> getAllBlogsAdmin(Pageable pageable);
    Page<Blog> getPublishedBlogs(Pageable pageable);
    Blog getBlogById(UUID id);
    Blog getBlogBySlug(String slug);
    Blog getPublishedBlogBySlug(String slug);
    Blog updateBlog(UUID id, Blog blog);
    void deleteBlog(UUID id);
}
