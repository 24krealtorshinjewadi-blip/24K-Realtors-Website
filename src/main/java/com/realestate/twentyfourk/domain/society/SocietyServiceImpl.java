package com.realestate.twentyfourk.domain.society;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SocietyServiceImpl implements SocietyService {

    private final SocietyRepository societyRepository;

    @Override
    public Society createSociety(Society society) {
        if (society.getSlug() == null || society.getSlug().trim().isEmpty()) {
            society.setSlug(society.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return societyRepository.save(society);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Society> getAllSocieties(Pageable pageable) {
        return societyRepository.findByActiveFlagTrueAndDeletedFlagFalse(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Society getSocietyBySlug(String slug) {
        return societyRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Society not found with slug: " + slug));
    }

    @Override
    @Transactional(readOnly = true)
    public Society getSocietyById(UUID id) {
        return societyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Society not found with ID: " + id));
    }

    @Override
    public Society updateSociety(UUID id, Society updated) {
        Society existing = getSocietyById(id);
        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setDeveloper(updated.getDeveloper());
        existing.setReraNumber(updated.getReraNumber());
        existing.setProjectStatus(updated.getProjectStatus());
        existing.setStartingPrice(updated.getStartingPrice());
        existing.setPossessionDate(updated.getPossessionDate());
        existing.setOverview(updated.getOverview());
        existing.setGalleryUrls(updated.getGalleryUrls());
        existing.setAmenities(updated.getAmenities());
        existing.setFloorPlanUrls(updated.getFloorPlanUrls());
        existing.setMasterPlanUrl(updated.getMasterPlanUrl());
        existing.setPropertyTypes(updated.getPropertyTypes());
        existing.setPriceRange(updated.getPriceRange());
        existing.setConfiguration(updated.getConfiguration());
        existing.setNearbySchools(updated.getNearbySchools());
        existing.setNearbyHospitals(updated.getNearbyHospitals());
        existing.setNearbyItParks(updated.getNearbyItParks());
        existing.setNearbyMetro(updated.getNearbyMetro());
        existing.setNearbyMalls(updated.getNearbyMalls());
        existing.setGoogleMapsIframe(updated.getGoogleMapsIframe());
        existing.setTravelTimeInfo(updated.getTravelTimeInfo());
        existing.setInvestmentScore(updated.getInvestmentScore());
        existing.setRentalYield(updated.getRentalYield());
        existing.setFaqs(updated.getFaqs());
        existing.setSeoTitle(updated.getSeoTitle());
        existing.setSeoDescription(updated.getSeoDescription());
        existing.setBuilder(updated.getBuilder());
        return societyRepository.save(existing);
    }

    @Override
    public void deleteSociety(UUID id) {
        Society existing = getSocietyById(id);
        existing.setDeletedFlag(true);
        existing.setActiveFlag(false);
        societyRepository.save(existing);
    }
}
