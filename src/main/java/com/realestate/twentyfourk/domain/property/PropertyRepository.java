package com.realestate.twentyfourk.domain.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {

    @Query("SELECT p FROM Property p WHERE " +
           "(6371.0 * acos(sin(radians(:lat)) * sin(radians(p.latitude)) + " +
           "cos(radians(:lat)) * cos(radians(p.latitude)) * " +
           "cos(radians(p.longitude) - radians(:lon)))) <= :radius")
    Page<Property> findPropertiesWithinRadius(
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius,
            Pageable pageable
    );
}
