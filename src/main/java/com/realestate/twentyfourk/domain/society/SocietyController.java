package com.realestate.twentyfourk.domain.society;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SocietyController {

    private final SocietyService societyService;

    @PostMapping
    public ResponseEntity<Society> createSociety(@RequestBody Society society) {
        Society created = societyService.createSociety(society);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Society>> getAllSocieties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return ResponseEntity.ok(societyService.getAllSocieties(pageRequest));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Society> getSocietyBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(societyService.getSocietyBySlug(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Society> getSocietyById(@PathVariable UUID id) {
        return ResponseEntity.ok(societyService.getSocietyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Society> updateSociety(@PathVariable UUID id, @RequestBody Society society) {
        return ResponseEntity.ok(societyService.updateSociety(id, society));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSociety(@PathVariable UUID id) {
        societyService.deleteSociety(id);
        return ResponseEntity.noContent().build();
    }
}
