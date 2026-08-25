package com.realestate.twentyfourk.domain.society;

import com.realestate.twentyfourk.domain.society.dto.LocationPageDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietyCardDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietyIntelligenceDTO;
import com.realestate.twentyfourk.domain.society.dto.SocietySearchFilter;
import org.springframework.data.domain.Page;

/**
 * Public-facing Property Intelligence Service.
 * Aggregates society + all related intelligence tables into rich DTOs.
 */
public interface PublicSocietyService {

    /** Get paginated society cards with filtering. */
    Page<SocietyCardDTO> searchSocieties(SocietySearchFilter filter);

    /** Get full intelligence DTO for detail page by slug. */
    SocietyIntelligenceDTO getSocietyBySlug(String slug);

    /** Get location landing page data. */
    LocationPageDTO getLocationPage(String locationSlug);
}
