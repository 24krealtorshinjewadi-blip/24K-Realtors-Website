package com.realestate.twentyfourk.domain.property;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> filterProperties(
            PrimeCorridor location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            PropertyType propertyType,
            TransactionType transactionType,
            Integer bedrooms,
            PropertyStatus status,
            FurnishingStatus furnishingStatus,
            String queryText
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (location != null) {
                predicates.add(cb.equal(root.get("location"), location));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (propertyType != null) {
                predicates.add(cb.equal(root.get("propertyType"), propertyType));
            }
            if (transactionType != null) {
                predicates.add(cb.equal(root.get("transactionType"), transactionType));
            }
            if (bedrooms != null) {
                predicates.add(cb.equal(root.get("bedrooms"), bedrooms));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (furnishingStatus != null) {
                predicates.add(cb.equal(root.get("furnishingStatus"), furnishingStatus));
            }
            if (queryText != null && !queryText.trim().isEmpty()) {
                String q = "%" + queryText.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), q);
                Predicate descLike = cb.like(cb.lower(root.get("description")), q);
                Predicate addrLike = cb.like(cb.lower(root.get("address")), q);
                
                Predicate locLike;
                try {
                    PrimeCorridor corridor = PrimeCorridor.valueOf(queryText.trim().toUpperCase());
                    locLike = cb.equal(root.get("location"), corridor);
                } catch (IllegalArgumentException e) {
                    locLike = cb.like(cb.lower(root.get("location").as(String.class)), q);
                }
                
                predicates.add(cb.or(titleLike, descLike, addrLike, locLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
