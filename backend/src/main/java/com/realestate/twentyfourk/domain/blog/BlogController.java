package com.realestate.twentyfourk.domain.blog;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlogController {

    private final BlogService blogService;

    // Public endpoint to get published blogs
    @GetMapping
    public ResponseEntity<Page<Blog>> getPublishedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return ResponseEntity.ok(blogService.getPublishedBlogs(pageRequest));
    }

    // Admin endpoint to get all blogs including drafts
    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Page<Blog>> getAllBlogsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return ResponseEntity.ok(blogService.getAllBlogsAdmin(pageRequest));
    }

    // Public endpoint to get published blog by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Blog> getPublishedBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPublishedBlogBySlug(slug));
    }

    // Admin endpoint to get any blog by slug (including drafts)
    @GetMapping("/admin/slug/{slug}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Blog> getBlogById(@PathVariable UUID id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog) {
        Blog created = blogService.createBlog(blog);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Blog> updateBlog(@PathVariable UUID id, @RequestBody Blog blog) {
        return ResponseEntity.ok(blogService.updateBlog(id, blog));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable UUID id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}
