package com.realestate.twentyfourk.domain.locality.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalityHierarchyDTO {
    private UUID id;
    private String name;
    private String slug;
    private String localityType;
    private String hinjewadiPhase;
    private Double latitude;
    private Double longitude;
    @Builder.Default
    private List<LocalityHierarchyDTO> children = new ArrayList<>();
}
