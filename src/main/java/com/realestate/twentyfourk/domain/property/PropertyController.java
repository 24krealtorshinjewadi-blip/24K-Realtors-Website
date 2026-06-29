package com.realestate.twentyfourk.domain.property;

import com.realestate.twentyfourk.domain.property.dto.PropertyRequest;
import com.realestate.twentyfourk.domain.property.dto.PropertyResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permissive CORS for Phase 1 local development
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(@Valid @RequestBody PropertyRequest request) {
        PropertyResponse created = propertyService.createProperty(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable UUID id) {
        PropertyResponse property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @GetMapping
    public ResponseEntity<Page<PropertyResponse>> getAllProperties(
            @RequestParam(required = false) PrimeCorridor location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) TransactionType transactionType,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) PropertyStatus status,
            @RequestParam(required = false) FurnishingStatus furnishingStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        
        Page<PropertyResponse> properties = propertyService.getAllProperties(
                location, minPrice, maxPrice, propertyType, transactionType, bedrooms, status, furnishingStatus, pageRequest
        );
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable UUID id,
            @Valid @RequestBody PropertyRequest request
    ) {
        PropertyResponse updated = propertyService.updateProperty(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/search/radius")
    public ResponseEntity<Page<PropertyResponse>> getPropertiesWithinRadius(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "5.0") Double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        
        Page<PropertyResponse> properties = propertyService.getPropertiesWithinRadius(lat, lon, radius, pageRequest);
        return ResponseEntity.ok(properties);
    }

    @PostMapping(value = "/import/csv", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> importPropertiesFromCsv(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("CSV File is empty");
        }
        int count = 0;
        try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isHeader = true;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                if (isHeader) {
                    isHeader = false;
                    continue; // Skip header
                }
                java.util.List<String> fields = parseCsvLine(line);
                if (fields.size() < 12) {
                    continue;
                }
                try {
                    String title = fields.get(0);
                    String description = fields.get(1);
                    PropertyType type = PropertyType.valueOf(fields.get(2).toUpperCase());
                    TransactionType tx = TransactionType.valueOf(fields.get(3).toUpperCase());
                    java.math.BigDecimal price = new java.math.BigDecimal(fields.get(4));
                    Double area = Double.valueOf(fields.get(5));
                    PrimeCorridor corridor = PrimeCorridor.valueOf(fields.get(6).toUpperCase());
                    String address = fields.get(7);
                    Double lat = fields.get(8).isEmpty() ? null : Double.valueOf(fields.get(8));
                    Double lon = fields.get(9).isEmpty() ? null : Double.valueOf(fields.get(9));
                    Integer beds = Integer.valueOf(fields.get(10));
                    Integer baths = Integer.valueOf(fields.get(11));
                    
                    boolean verified = fields.size() > 12 && Boolean.parseBoolean(fields.get(12));
                    boolean exclusive = fields.size() > 13 && Boolean.parseBoolean(fields.get(13));
                    boolean noBroker = fields.size() > 14 && Boolean.parseBoolean(fields.get(14));
                    String rera = fields.size() > 15 ? fields.get(15) : "RERA-PUN-PRM-PENDING";

                    PropertyRequest request = new PropertyRequest(
                        title, description, type, tx, price, area, corridor, address, 
                        lat, lon, beds, baths, PropertyStatus.AVAILABLE, verified, exclusive, noBroker, rera,
                        null, null, null, null, false
                    );
                    propertyService.createProperty(request);
                    count++;
                } catch (Exception ex) {
                    // Ignore line errors, log quietly
                }
            }
            return ResponseEntity.ok("Successfully imported " + count + " properties from CSV.");
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Import failed: " + ex.getMessage());
        }
    }

    private java.util.List<String> parseCsvLine(String line) {
        java.util.List<String> result = new java.util.ArrayList<>();
        StringBuilder currentToken = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(currentToken.toString().trim());
                currentToken.setLength(0);
            } else {
                currentToken.append(c);
            }
        }
        result.add(currentToken.toString().trim());
        return result;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable UUID id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
