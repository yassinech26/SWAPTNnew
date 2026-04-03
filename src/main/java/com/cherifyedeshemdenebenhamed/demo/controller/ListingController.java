package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings() {
        List<Listing> listings = listingService.getAllListings();
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException("No listings found");
        }
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListingById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid listing ID");
        }
        Listing listing = listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        return ResponseEntity.ok(listing);
    }

    @PostMapping
    public ResponseEntity<Listing> createListing(@RequestBody Listing listing) {
        if (listing.getTitle() == null || listing.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Listing title cannot be empty");
        }
        if (listing.getPrice() == null || listing.getPrice() < 0) {
            throw new BadRequestException("Listing price must be a positive value");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.saveListing(listing));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long id, @RequestBody Listing listingDetails) {
        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid listing ID");
        }
        if (listingDetails.getTitle() == null || listingDetails.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Listing title cannot be empty");
        }
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
        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid listing ID");
        }
        listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        listingService.deleteListing(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchListings(@RequestParam String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new BadRequestException("Search title cannot be empty");
        }
        List<Listing> listings = listingService.searchByTitle(title);
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException("No listings found matching title: " + title);
        }
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Listing>> filterByCategory(@PathVariable String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new BadRequestException("Category cannot be empty");
        }
        List<Listing> listings = listingService.filterByCategory(category);
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException("No listings found in category: " + category);
        }
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/price")
    public ResponseEntity<List<Listing>> filterByPrice(@RequestParam Double min, @RequestParam Double max) {
        if (min == null || max == null || min > max || min < 0) {
            throw new BadRequestException("Invalid price range provided");
        }
        List<Listing> listings = listingService.filterByPrice(min, max);
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException("No listings found in the specified price range");
        }
        return ResponseEntity.ok(listings);
    }
}