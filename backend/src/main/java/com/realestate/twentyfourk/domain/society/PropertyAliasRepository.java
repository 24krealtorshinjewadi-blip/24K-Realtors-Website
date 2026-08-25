package com.realestate.twentyfourk.domain.society;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyAliasRepository extends JpaRepository<PropertyAlias, UUID> {
    List<PropertyAlias> findBySocietyId(UUID societyId);
    List<PropertyAlias> findByAliasNameContainingIgnoreCase(String aliasName);
}
