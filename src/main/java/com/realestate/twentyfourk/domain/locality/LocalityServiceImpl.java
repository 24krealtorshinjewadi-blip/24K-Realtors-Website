package com.realestate.twentyfourk.domain.locality;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LocalityServiceImpl implements LocalityService {

    private final LocalityRepository localityRepository;

    @Override
    public Locality createLocality(Locality locality) {
        if (locality.getSlug() == null || locality.getSlug().trim().isEmpty()) {
            locality.setSlug(locality.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return localityRepository.save(locality);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Locality> getAllLocalities() {
        return localityRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Locality getLocalityBySlug(String slug) {
        return localityRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Locality not found with slug: " + slug));
    }

    @Override
    @Transactional(readOnly = true)
    public Locality getLocalityById(UUID id) {
        return localityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Locality not found with ID: " + id));
    }
}
