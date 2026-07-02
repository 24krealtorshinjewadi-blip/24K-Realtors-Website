package com.realestate.twentyfourk.domain.locality;

import java.util.List;
import java.util.UUID;

public interface LocalityService {
    Locality createLocality(Locality locality);
    List<Locality> getAllLocalities();
    Locality getLocalityBySlug(String slug);
    Locality getLocalityById(UUID id);
}
