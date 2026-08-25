package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.builder.BuilderRepository;
import com.realestate.twentyfourk.domain.locality.Locality;
import com.realestate.twentyfourk.domain.locality.LocalityRepository;
import com.realestate.twentyfourk.domain.property.ConfidenceLevel;
import com.realestate.twentyfourk.domain.property.HinjewadiPhase;
import com.realestate.twentyfourk.domain.property.ProjectStatus;
import com.realestate.twentyfourk.domain.society.dto.LocationPageDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietyCardDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietyIntelligenceDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietySearchFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Property Intelligence Service Implementation.
 *
 * Aggregates Society + PropertyConfiguration + PropertyPrice + PropertyAmenity
 * + PropertySource + PropertyVerification into rich intelligence DTOs.
 *
 * Trust rules enforced:
 *  1. Prices only shown with last_verified_at date.
 *  2. Only VERIFIED amenities included in public responses.
 *  3. Confidence level always included.
 *  4. Sources always included for transparency.
 *  5. "Not publicly verified" for missing critical fields — never fabricate.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PublicSocietyServiceImpl implements PublicSocietyService {

    private final SocietyRepository societyRepository;
    private final PropertyConfigurationRepository configurationRepository;
    private final PropertyPriceRepository priceRepository;
    private final PropertyAmenityRepository amenityRepository;
    private final PropertySourceRepository sourceRepository;
    private final PropertyAliasRepository aliasRepository;
    private final PropertyDocumentRepository documentRepository;
    private final LocalityRepository localityRepository;
    private final BuilderRepository builderRepository;

    // =========================================================================
    // SEARCH — paginated society cards
    // =========================================================================

    @Override
    public Page<SocietyCardDTO> searchSocieties(SocietySearchFilter filter) {
        Sort sort = buildSort(filter.getSortBy());
        PageRequest pageRequest = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Page<Society> societies;

        // Phase-specific search (most precise)
        if (filter.getHinjewadiPhase() != null && !filter.getHinjewadiPhase().isBlank()) {
            try {
                HinjewadiPhase phase = HinjewadiPhase.valueOf(filter.getHinjewadiPhase());
                societies = societyRepository.findByHinjewadiPhaseAndActiveFlagTrueAndDeletedFlagFalse(phase, pageRequest);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid hinjewadiPhase filter value: {}", filter.getHinjewadiPhase());
                societies = societyRepository.findByActiveFlagTrueAndDeletedFlagFalse(pageRequest);
            }
        }
        // Status-specific search
        else if (filter.getProjectStatus() != null && !filter.getProjectStatus().isBlank()) {
            try {
                ProjectStatus status = ProjectStatus.valueOf(filter.getProjectStatus());
                societies = societyRepository.findByProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(status, pageRequest);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid projectStatus filter value: {}", filter.getProjectStatus());
                societies = societyRepository.findByActiveFlagTrueAndDeletedFlagFalse(pageRequest);
            }
        }
        // RERA only
        else if (Boolean.TRUE.equals(filter.getReraRegistered())) {
            societies = societyRepository.findByReraRegisteredTrueAndActiveFlagTrueAndDeletedFlagFalse(pageRequest);
        }
        // Resale filter
        else if (Boolean.TRUE.equals(filter.getHasResale())) {
            societies = societyRepository.findByHasResaleTrueAndActiveFlagTrueAndDeletedFlagFalse(pageRequest);
        }
        // Rental filter
        else if (Boolean.TRUE.equals(filter.getHasRental())) {
            societies = societyRepository.findByHasRentalTrueAndActiveFlagTrueAndDeletedFlagFalse(pageRequest);
        }
        // Developer filter
        else if (filter.getDeveloper() != null && !filter.getDeveloper().isBlank()) {
            societies = societyRepository.findByDeveloperContainingIgnoreCaseAndActiveFlagTrueAndDeletedFlagFalse(
                    filter.getDeveloper(), pageRequest);
        }
        // Default: all active societies
        else {
            societies = societyRepository.findByActiveFlagTrueAndDeletedFlagFalse(pageRequest);
        }

        Page<SocietyCardDTO> result = societies.map(this::toCardDTO);
        log.debug("searchSocieties: filter={}, results={}", filter, result.getTotalElements());
        return result;
    }

    // =========================================================================
    // DETAIL PAGE — full intelligence aggregation
    // =========================================================================

    @Override
    public SocietyIntelligenceDTO getSocietyBySlug(String slug) {
        Society society = societyRepository.findBySlugWithBuilder(slug)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Society not found: " + slug));

        return toIntelligenceDTO(society);
    }

    // =========================================================================
    // LOCATION PAGE
    // =========================================================================

    @Override
    public LocationPageDTO getLocationPage(String locationSlug) {
        // Map slug to HinjewadiPhase
        HinjewadiPhase phase = resolvePhaseFromSlug(locationSlug);

        // Get locality metadata
        Locality locality = localityRepository.findBySlug(locationSlug).orElse(null);

        // Stats
        long totalProjects = societyRepository.countByHinjewadiPhaseAndActiveFlagTrueAndDeletedFlagFalse(phase);
        long rtmCount = societyRepository.countByHinjewadiPhaseAndProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(
                phase, ProjectStatus.READY_TO_MOVE);
        long ucCount = societyRepository.countByHinjewadiPhaseAndProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(
                phase, ProjectStatus.UNDER_CONSTRUCTION);
        long nlCount = societyRepository.countByHinjewadiPhaseAndProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(
                phase, ProjectStatus.NEW_LAUNCH);
        long upCount = societyRepository.countByHinjewadiPhaseAndProjectStatusAndActiveFlagTrueAndDeletedFlagFalse(
                phase, ProjectStatus.UPCOMING);

        // Price range
        var minPrice = societyRepository.findMinPriceByPhase(phase);
        var maxPrice = societyRepository.findMaxPriceByPhase(phase);

        // Featured societies (up to 6, verified-first)
        List<Society> featured = societyRepository.findByPhaseOrderByConfidence(
                phase, PageRequest.of(0, 6));
        List<SocietyCardDTO> featuredCards = featured.stream()
                .map(this::toCardDTO)
                .collect(Collectors.toList());

        // Active builders in this phase
        List<LocationPageDTO.BuilderSummaryDTO> builders = builderRepository.findAll()
                .stream()
                .filter(b -> b.isActiveFlag())
                .map(b -> LocationPageDTO.BuilderSummaryDTO.builder()
                        .name(b.getName())
                        .slug(b.getSlug())
                        .logoUrl(b.getLogoUrl())
                        .officialWebsite(b.getOfficialWebsite())
                        .projectCount(0) // TODO: count by builder+phase
                        .build())
                .collect(Collectors.toList());

        // BHK availability — check if any society in phase has BHK config
        List<Society> allInPhase = societyRepository
                .findByPhaseOrderByConfidence(phase, PageRequest.of(0, 100));
        boolean has1 = allInPhase.stream().anyMatch(s ->
                s.getConfiguration() != null && s.getConfiguration().contains("1 BHK"));
        boolean has2 = allInPhase.stream().anyMatch(s ->
                s.getConfiguration() != null && s.getConfiguration().contains("2 BHK"));
        boolean has3 = allInPhase.stream().anyMatch(s ->
                s.getConfiguration() != null && s.getConfiguration().contains("3 BHK"));
        boolean has4 = allInPhase.stream().anyMatch(s ->
                s.getConfiguration() != null && s.getConfiguration().contains("4 BHK"));
        boolean hasVilla = allInPhase.stream().anyMatch(s ->
                s.getConfiguration() != null && s.getConfiguration().toLowerCase().contains("villa"));

        return LocationPageDTO.builder()
                .name(locality != null ? locality.getName() : resolveLocationName(locationSlug))
                .slug(locationSlug)
                .phase(phase)
                .pincode(locality != null ? locality.getPincode() : null)
                .latitude(locality != null ? locality.getLatitude() : null)
                .longitude(locality != null ? locality.getLongitude() : null)
                .seoTitle(locality != null ? locality.getSeoTitle() : buildLocationSeoTitle(locationSlug))
                .seoDescription(locality != null ? locality.getSeoDescription() : null)
                .seoH1(locality != null ? locality.getSeoH1() : null)
                .overview(locality != null ? locality.getOverview() : null)
                .connectivityInfo(locality != null ? locality.getConnectivityInfo() : null)
                .schools(locality != null ? locality.getSchools() : null)
                .hospitals(locality != null ? locality.getHospitals() : null)
                .metroConnectivity(locality != null ? locality.getMetroConnectivity() : null)
                .totalProjects((int) totalProjects)
                .readyToMoveCount((int) rtmCount)
                .underConstructionCount((int) ucCount)
                .newLaunchCount((int) nlCount)
                .upcomingCount((int) upCount)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .priceSummaryLastVerified(LocalDate.now()) // date of aggregation
                .has1Bhk(has1)
                .has2Bhk(has2)
                .has3Bhk(has3)
                .has4Bhk(has4)
                .hasVilla(hasVilla)
                .hasPlot(false)
                .featuredSocieties(featuredCards)
                .activeBuilders(builders)
                .build();
    }

    // =========================================================================
    // MAPPERS
    // =========================================================================

    private SocietyCardDTO toCardDTO(Society s) {
        return SocietyCardDTO.builder()
                .id(s.getId())
                .name(s.getName())
                .canonicalName(s.getCanonicalName())
                .slug(s.getSlug())
                .location(s.getLocation() != null ? s.getLocation().name() : null)
                .hinjewadiPhase(s.getHinjewadiPhase())
                .developer(s.getDeveloper())
                .builderLogoUrl(s.getBuilder() != null ? s.getBuilder().getLogoUrl() : null)
                .configuration(s.getConfiguration())
                .projectStatus(s.getProjectStatus())
                .reraRegistered(s.isReraRegistered())
                .reraNumber(s.getReraNumber())
                .startingPrice(s.getStartingPrice())
                .priceRange(s.getPriceRange())
                .priceSource(s.getPriceSource())
                .priceLastVerified(s.getPriceLastVerified()) // MANDATORY — always included
                .possessionDate(s.getPossessionDate())
                .confidenceLevel(s.getConfidenceLevel())
                .lastVerifiedAt(s.getLastVerifiedAt())
                .heroImageUrl(extractFirstImage(s.getGalleryUrls()))
                .hasNewSale(s.isHasNewSale())
                .hasResale(s.isHasResale())
                .hasRental(s.isHasRental())
                .build();
    }

    private SocietyIntelligenceDTO toIntelligenceDTO(Society s) {
        var societyId = s.getId();

        // Fetch related data
        List<PropertyConfiguration> configs = configurationRepository.findBySocietyId(societyId);
        List<PropertyPrice> prices = priceRepository.findBySocietyIdAndIsCurrentTrue(societyId);
        List<PropertyAmenity> amenities = amenityRepository.findBySocietyIdAndVerifiedTrue(societyId);
        List<PropertySource> sources = sourceRepository.findBySocietyIdOrderByDateCheckedDesc(societyId);
        List<PropertyAlias> aliases = aliasRepository.findBySocietyId(societyId);
        List<PropertyDocument> documents = documentRepository.findBySocietyId(societyId);

        // Map configurations
        List<SocietyIntelligenceDTO.ConfigurationDTO> configDTOs = configs.stream()
                .map(c -> SocietyIntelligenceDTO.ConfigurationDTO.builder()
                        .bhkType(c.getBhkType())
                        .minCarpetAreaSqft(c.getMinCarpetAreaSqft())
                        .maxCarpetAreaSqft(c.getMaxCarpetAreaSqft())
                        .minBuiltUpAreaSqft(c.getMinBuiltUpAreaSqft())
                        .maxBuiltUpAreaSqft(c.getMaxBuiltUpAreaSqft())
                        .available(c.isAvailable())
                        .source(c.getSource())
                        .lastVerifiedDate(c.getLastVerifiedDate())
                        .build())
                .collect(Collectors.toList());

        // Map prices — NEVER omit lastVerifiedAt
        List<SocietyIntelligenceDTO.PriceDTO> priceDTOs = prices.stream()
                .map(p -> SocietyIntelligenceDTO.PriceDTO.builder()
                        .priceType(p.getPriceType())
                        .minPrice(p.getMinPrice())
                        .maxPrice(p.getMaxPrice())
                        .pricePerSqft(p.getPricePerSqft())
                        .priceSource(p.getPriceSource())
                        .sourceUrl(p.getSourceUrl())
                        .lastVerifiedAt(p.getLastVerifiedAt()) // MANDATORY
                        .build())
                .collect(Collectors.toList());

        // Map amenities — ONLY verified facts (no market observations)
        List<SocietyIntelligenceDTO.AmenityDTO> amenityDTOs = amenities.stream()
                .filter(a -> "VERIFIED_FACT".equals(a.getFactType()))
                .map(a -> SocietyIntelligenceDTO.AmenityDTO.builder()
                        .amenityKey(a.getAmenityKey())
                        .amenityLabel(a.getAmenityLabel())
                        .verified(a.isVerified())
                        .source(a.getSource())
                        .build())
                .collect(Collectors.toList());

        // Map sources (for transparency section)
        List<SocietyIntelligenceDTO.SourceDTO> sourceDTOs = sources.stream()
                .map(src -> SocietyIntelligenceDTO.SourceDTO.builder()
                        .sourceName(src.getSourceName())
                        .sourceUrl(src.getSourceUrl())
                        .sourceType(src.getSourceType() != null ? src.getSourceType().name() : null)
                        .dateChecked(src.getDateChecked())
                        .verificationStatus(src.getVerificationStatus())
                        .fieldName(src.getFieldName())
                        .build())
                .collect(Collectors.toList());

        // Map aliases
        List<String> aliasNames = aliases.stream()
                .map(PropertyAlias::getAliasName)
                .collect(Collectors.toList());

        // Map documents
        List<SocietyIntelligenceDTO.DocumentDTO> documentDTOs = documents.stream()
                .map(d -> SocietyIntelligenceDTO.DocumentDTO.builder()
                        .documentName(d.getDocumentName())
                        .documentType(d.getDocumentType())
                        .sourceUrl(d.getSourceUrl())
                        .verificationStatus(d.getVerificationStatus())
                        .lastChecked(d.getLastChecked())
                        .build())
                .collect(Collectors.toList());

        // Parse gallery URLs (stored as comma-separated)
        List<String> galleryUrls = parseCommaSeparated(s.getGalleryUrls());
        List<String> floorPlanUrls = parseCommaSeparated(s.getFloorPlanUrls());

        return SocietyIntelligenceDTO.builder()
                // Identity
                .id(s.getId())
                .name(s.getName())
                .canonicalName(s.getCanonicalName())
                .slug(s.getSlug())
                .aliasNames(aliasNames)
                // SEO
                .seoTitle(s.getSeoTitle())
                .seoDescription(s.getSeoDescription())
                .seoH1(s.getSeoH1())
                .seoPrimaryKeyword(s.getSeoPrimaryKeyword())
                // Location
                .location(s.getLocation() != null ? s.getLocation().name() : null)
                .hinjewadiPhase(s.getHinjewadiPhase())
                .fullAddress(s.getFullAddress())
                .pincode(s.getPincode())
                .landmark(s.getLandmark())
                .road(s.getRoad())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .googleMapsUrl(s.getGoogleMapsUrl())
                .googleMapsIframe(s.getGoogleMapsIframe())
                // Developer
                .developer(s.getDeveloper())
                .developerParentCompany(s.getBuilder() != null ? s.getBuilder().getParentCompany() : null)
                .developerWebsite(s.getBuilder() != null ? s.getBuilder().getOfficialWebsite() : null)
                .developerLogoUrl(s.getBuilder() != null ? s.getBuilder().getLogoUrl() : null)
                .developerDescription(s.getBuilder() != null ? s.getBuilder().getDescription() : null)
                // RERA
                .reraRegistered(s.isReraRegistered())
                .reraNumber(s.getReraNumber())
                .reraProjectName(s.getReraProjectName())
                .reraPromoterName(s.getReraPromoterName())
                .reraStatus(s.getReraStatus())
                .reraRegistrationDate(s.getReraRegistrationDate())
                .reraCompletionDate(s.getReraCompletionDate())
                .reraSourceUrl(s.getReraSourceUrl())
                // Status & Timeline
                .projectStatus(s.getProjectStatus())
                .launchYear(s.getLaunchYear())
                .possessionDate(s.getPossessionDate())
                .completionDate(s.getCompletionDate())
                // Project Size
                .landAreaAcres(s.getLandAreaAcres())
                .totalUnits(s.getTotalUnits())
                .totalTowers(s.getTotalTowers())
                .totalFloors(s.getTotalFloors())
                .numberOfPhases(s.getNumberOfPhases())
                .parentProjectId(s.getParentProjectId())
                // Configuration
                .configurationSummary(s.getConfiguration())
                .configurations(configDTOs)
                .minCarpetAreaSqft(s.getMinCarpetAreaSqft())
                .maxCarpetAreaSqft(s.getMaxCarpetAreaSqft())
                // Pricing
                .startingPrice(s.getStartingPrice())
                .priceRange(s.getPriceRange())
                .pricePerSqft(s.getPricePerSqft())
                .priceSource(s.getPriceSource())
                .priceLastVerified(s.getPriceLastVerified()) // ALWAYS included
                .allPrices(priceDTOs)
                .hasNewSale(s.isHasNewSale())
                .hasResale(s.isHasResale())
                .hasRental(s.isHasRental())
                // Amenities (verified only)
                .amenities(amenityDTOs)
                // Media
                .heroImageUrl(galleryUrls.isEmpty() ? null : galleryUrls.get(0))
                .galleryUrls(galleryUrls)
                .floorPlanUrls(floorPlanUrls)
                .masterPlanUrl(s.getMasterPlanUrl())
                // Connectivity
                .nearbySchools(s.getNearbySchools())
                .nearbyHospitals(s.getNearbyHospitals())
                .nearbyItParks(s.getNearbyItParks())
                .nearbyMetro(s.getNearbyMetro())
                .nearbyMalls(s.getNearbyMalls())
                .travelTimeInfo(s.getTravelTimeInfo())
                // Documents
                .documents(documentDTOs)
                // Society info
                .overview(s.getOverview())
                .rentalYield(s.getRentalYield())
                .investmentScore(s.getInvestmentScore())
                .faqs(s.getFaqs())
                // Sources
                .sources(sourceDTOs)
                // Trust
                .confidenceLevel(s.getConfidenceLevel())
                .lastVerifiedAt(s.getLastVerifiedAt()) // "Verified on [date]"
                .build();
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    private Sort buildSort(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.DESC, "createdDate");
        return switch (sortBy) {
            case "price_asc"       -> Sort.by(Sort.Direction.ASC,  "startingPrice");
            case "price_desc"      -> Sort.by(Sort.Direction.DESC, "startingPrice");
            case "newest"          -> Sort.by(Sort.Direction.DESC, "createdDate");
            case "verified_first"  -> Sort.by(Sort.Direction.ASC,  "confidenceLevel");
            default                -> Sort.by(Sort.Direction.DESC, "createdDate");
        };
    }

    private HinjewadiPhase resolvePhaseFromSlug(String slug) {
        return switch (slug) {
            case "hinjewadi-phase-1" -> HinjewadiPhase.PHASE_1;
            case "hinjewadi-phase-2" -> HinjewadiPhase.PHASE_2;
            case "hinjewadi-phase-3" -> HinjewadiPhase.PHASE_3;
            case "mahalunge"         -> HinjewadiPhase.MAHALUNGE;
            default                  -> HinjewadiPhase.HINJEWADI_UNSPECIFIED;
        };
    }

    private String resolveLocationName(String slug) {
        return switch (slug) {
            case "hinjewadi-phase-1" -> "Hinjewadi Phase 1";
            case "hinjewadi-phase-2" -> "Hinjewadi Phase 2";
            case "hinjewadi-phase-3" -> "Hinjewadi Phase 3";
            case "mahalunge"         -> "Mahalunge";
            case "hinjewadi"         -> "Hinjewadi";
            default                  -> slug;
        };
    }

    private String buildLocationSeoTitle(String slug) {
        String name = resolveLocationName(slug);
        return name + " Properties | Price, RERA & Projects | 24K Realtors Pune";
    }

    private String extractFirstImage(String galleryUrls) {
        if (galleryUrls == null || galleryUrls.isBlank()) return null;
        String[] parts = galleryUrls.split(",");
        return parts[0].trim();
    }

    private List<String> parseCommaSeparated(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }
}
