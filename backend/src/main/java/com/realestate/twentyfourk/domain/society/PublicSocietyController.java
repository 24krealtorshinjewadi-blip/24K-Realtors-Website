package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.society.dto.LocationPageDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietyCardDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietyIntelligenceDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietySearchFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public-facing Property Intelligence REST API.
 *
 * NO AUTHENTICATION REQUIRED — these endpoints serve the public website.
 *
 * Base URL: /api/public/societies
 *
 * Separate from admin /api/v1/societies — never mix public and admin routes.
 */
@RestController
@RequestMapping("/api/public/societies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PublicSocietyController {

    private final PublicSocietyService publicSocietyService;

    // =========================================================================
    // SOCIETY LIST — /api/public/societies
    // =========================================================================

    @GetMapping
    public ResponseEntity<Page<SocietyCardDTO>> searchSocieties(
            @RequestParam(required = false) String hinjewadiPhase,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String developer,
            @RequestParam(required = false) String bhkType,
            @RequestParam(required = false) Long minBudget,
            @RequestParam(required = false) Long maxBudget,
            @RequestParam(required = false) String projectStatus,
            @RequestParam(required = false) Boolean reraRegistered,
            @RequestParam(required = false) Boolean readyToMove,
            @RequestParam(required = false) Boolean underConstruction,
            @RequestParam(required = false) Boolean newLaunch,
            @RequestParam(required = false) Boolean hasResale,
            @RequestParam(required = false) Boolean hasRental,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        SocietySearchFilter filter = SocietySearchFilter.builder()
                .hinjewadiPhase(hinjewadiPhase)
                .location(location)
                .developer(developer)
                .bhkType(bhkType)
                .minBudget(minBudget)
                .maxBudget(maxBudget)
                .projectStatus(projectStatus)
                .reraRegistered(reraRegistered)
                .readyToMove(readyToMove)
                .underConstruction(underConstruction)
                .newLaunch(newLaunch)
                .hasResale(hasResale)
                .hasRental(hasRental)
                .sortBy(sortBy)
                .page(page)
                .size(size)
                .build();

        log.info("Public society search: phase={}, status={}, developer={}, page={}",
                hinjewadiPhase, projectStatus, developer, page);

        return ResponseEntity.ok(publicSocietyService.searchSocieties(filter));
    }

    // =========================================================================
    // SOCIETY DETAIL — /api/public/societies/{slug}
    // =========================================================================

    @GetMapping("/{slug}")
    public ResponseEntity<SocietyIntelligenceDTO> getSocietyBySlug(
            @PathVariable String slug
    ) {
        log.info("Public society detail request: slug={}", slug);
        SocietyIntelligenceDTO dto = publicSocietyService.getSocietyBySlug(slug);
        return ResponseEntity.ok(dto);
    }

    // =========================================================================
    // LOCATION PAGES — /api/public/societies/location/{slug}
    // =========================================================================

    @GetMapping("/location/{slug}")
    public ResponseEntity<LocationPageDTO> getLocationPage(
            @PathVariable String slug
    ) {
        log.info("Public location page request: slug={}", slug);
        LocationPageDTO dto = publicSocietyService.getLocationPage(slug);
        return ResponseEntity.ok(dto);
    }
}
