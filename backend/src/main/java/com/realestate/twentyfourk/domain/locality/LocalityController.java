package com.realestate.twentyfourk.domain.locality;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/localities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocalityController {

    private final LocalityService localityService;

    @PostMapping
    public ResponseEntity<Locality> createLocality(@RequestBody Locality locality) {
        Locality created = localityService.createLocality(locality);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Locality>> getAllLocalities() {
        return ResponseEntity.ok(localityService.getAllLocalities());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Locality> getLocalityBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(localityService.getLocalityBySlug(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Locality> getLocalityById(@PathVariable UUID id) {
        return ResponseEntity.ok(localityService.getLocalityById(id));
    }
}
