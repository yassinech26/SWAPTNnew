package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @GetMapping
    public List<Listing> getAllListings() {
        return listingService.getAllListings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListingById(@PathVariable Long id) {
        Listing listing = listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        return ResponseEntity.ok(listing);
    }

    @PostMapping
    public Listing createListing(@RequestBody Listing listing) {
        return listingService.saveListing(listing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long id, @RequestBody Listing listingDetails) {
        Listing existingListing = listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        existingListing.setTitle(listingDetails.getTitle());
        existingListing.setDescription(listingDetails.getDescription());
        existingListing.setPrice(listingDetails.getPrice());
        existingListing.setCategory(listingDetails.getCategory());
        existingListing.setStatus(listingDetails.getStatus());

        return ResponseEntity.ok(listingService.saveListing(existingListing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        listingService.deleteListing(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchListings(@RequestParam String title) {
        return ResponseEntity.ok(listingService.searchByTitle(title));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Listing>> filterByCategory(@PathVariable String category) {
        return ResponseEntity.ok(listingService.filterByCategory(category));
    }

    @GetMapping("/price")
    public ResponseEntity<List<Listing>> filterByPrice(@RequestParam Double min, @RequestParam Double max) {
        return ResponseEntity.ok(listingService.filterByPrice(min, max));
    }
}