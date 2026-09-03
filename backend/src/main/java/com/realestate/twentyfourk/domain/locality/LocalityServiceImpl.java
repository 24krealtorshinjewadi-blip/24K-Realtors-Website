package com.realestate.twentyfourk.domain.locality;

import com.realestate.twentyfourk.domain.locality.dto.LocalityHierarchyDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
        return localityRepository.findByActiveTrueAndDeletedFlagFalse();
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

    @Override
    @Transactional(readOnly = true)
    public List<LocalityHierarchyDTO> getHierarchy() {
        List<Locality> rootLocalities = localityRepository.findByParentLocalityIsNullAndActiveTrueAndDeletedFlagFalse();
        return rootLocalities.stream()
                .map(this::buildHierarchyNode)
                .collect(Collectors.toList());
    }

    private LocalityHierarchyDTO buildHierarchyNode(Locality locality) {
        LocalityHierarchyDTO dto = LocalityHierarchyDTO.builder()
                .id(locality.getId())
                .name(locality.getName())
                .slug(locality.getSlug())
                .localityType(locality.getLocalityType())
                .hinjewadiPhase(locality.getHinjewadiPhase() != null ? locality.getHinjewadiPhase().name() : null)
                .latitude(locality.getLatitude())
                .longitude(locality.getLongitude())
                .children(new ArrayList<>())
                .build();

        List<Locality> children = localityRepository.findByParentLocalityIdAndActiveTrueAndDeletedFlagFalse(locality.getId());
        if (children != null && !children.isEmpty()) {
            dto.setChildren(children.stream().map(this::buildHierarchyNode).collect(Collectors.toList()));
        }
        return dto;
    }
}
