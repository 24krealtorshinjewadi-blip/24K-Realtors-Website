package com.realestate.twentyfourk.domain.builder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BuilderServiceImpl implements BuilderService {

    private final BuilderRepository builderRepository;

    @Override
    public Builder createBuilder(Builder builder) {
        if (builder.getSlug() == null || builder.getSlug().trim().isEmpty()) {
            builder.setSlug(builder.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return builderRepository.save(builder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Builder> getAllBuilders() {
        return builderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Builder getBuilderBySlug(String slug) {
        return builderRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Builder not found with slug: " + slug));
    }

    @Override
    @Transactional(readOnly = true)
    public Builder getBuilderById(UUID id) {
        return builderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Builder not found with ID: " + id));
    }
}
