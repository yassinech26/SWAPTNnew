package com.cherifyedeshemdenebenhamed.demo.controller;

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
        return listingService.getListingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Listing createListing(@RequestBody Listing listing) {
        return listingService.saveListing(listing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long id, @RequestBody Listing listingDetails) {
        return listingService.getListingById(id).map(existingListing -> {
            existingListing.setTitle(listingDetails.getTitle());
            existingListing.setDescription(listingDetails.getDescription());
            existingListing.setPrice(listingDetails.getPrice());
            existingListing.setCategory(listingDetails.getCategory());
            existingListing.setStatus(listingDetails.getStatus());
            return ResponseEntity.ok(listingService.saveListing(existingListing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        if (listingService.getListingById(id).isPresent()) {
            listingService.deleteListing(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}