package com.realestate.twentyfourk.domain.lead;

import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class LeadSpecification {

    public static Specification<Lead> filterLeads(
            LeadStatus status,
            PrimeCorridor preferredLocation
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (preferredLocation != null) {
                predicates.add(cb.equal(root.get("preferredLocation"), preferredLocation));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
