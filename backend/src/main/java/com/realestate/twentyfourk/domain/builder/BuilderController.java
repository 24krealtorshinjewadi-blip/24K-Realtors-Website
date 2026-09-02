package com.realestate.twentyfourk.domain.builder;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/builders")
@RequiredArgsConstructor

public class BuilderController {

    private final BuilderService builderService;

    @PostMapping
    public ResponseEntity<Builder> createBuilder(@RequestBody Builder builder) {
        Builder created = builderService.createBuilder(builder);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Builder>> getAllBuilders() {
        return ResponseEntity.ok(builderService.getAllBuilders());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Builder> getBuilderBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(builderService.getBuilderBySlug(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Builder> getBuilderById(@PathVariable UUID id) {
        return ResponseEntity.ok(builderService.getBuilderById(id));
    }
}
