package com.realestate.twentyfourk.domain.society;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface SocietyService {
    Society createSociety(Society society);
    Page<Society> getAllSocieties(Pageable pageable);
    Society getSocietyBySlug(String slug);
    Society getSocietyById(UUID id);
    Society updateSociety(UUID id, Society society);
    void deleteSociety(UUID id);
}
