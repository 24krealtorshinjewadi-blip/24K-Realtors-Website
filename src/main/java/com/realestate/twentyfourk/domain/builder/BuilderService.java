package com.realestate.twentyfourk.domain.builder;

import java.util.List;
import java.util.UUID;

public interface BuilderService {
    Builder createBuilder(Builder builder);
    List<Builder> getAllBuilders();
    Builder getBuilderBySlug(String slug);
    Builder getBuilderById(UUID id);
}
