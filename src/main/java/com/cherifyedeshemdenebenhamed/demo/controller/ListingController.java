package com.cherifyedeshemdenebenhamed.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import com.cherifyedeshemdenebenhamed.demo.service.ListingImageStorageService;
import com.cherifyedeshemdenebenhamed.demo.service.ListingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @Autowired
    private ListingImageStorageService listingImageStorageService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings() {
        List<Listing> listings = listingService.getAllListings();
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException(" No items available right now. Check back soon!");
        }
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListingById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BadRequestException(" Invalid item ID. Please check the link and try again.");
        }
        Listing listing = listingService.getActiveListingById(id)
                .orElseThrow(() -> new NotFoundException(" This item is no longer available. It may have been sold or removed."));
        return ResponseEntity.ok(listing);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Listing> createListing(
            @Valid @RequestPart("listing") Listing listing,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            throw new BadRequestException("Please upload at least one image.");
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User authUser = (User) authentication.getPrincipal();
            Long authUserId = authUser.getId();
            if (authUserId == null) {
                throw new BadRequestException("Invalid authenticated user context");
            }
            // Fetch the user from database to ensure it's properly attached to the session
            User currentUser = userRepository.findById(authUserId)
                    .orElseThrow(() -> new BadRequestException("User not found"));
            listing.setOwner(currentUser);
        } else {
            throw new BadRequestException("Authentication required to create a listing");
        }

        List<String> storedImageUrls = listingImageStorageService.storeListingImages(images);
        listing.setImageUrls(storedImageUrls);
        listing.setImageUrl(storedImageUrls.get(0));

        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.saveListing(listing));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable @NonNull Long id, @Valid @RequestBody Listing listingDetails) {
        Listing existingListing = listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("This item no longer exists or was removed."));

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
            throw new BadRequestException("Invalid item ID. Cannot delete this item.");
        }
        listingService.getListingById(id)
                .orElseThrow(() -> new NotFoundException("This item no longer exists. It may have been already deleted."));
        listingService.deleteListing(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchListings(@RequestParam String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new BadRequestException("Please enter a search term (brand or item name)");
        }
        List<Listing> listings = listingService.searchByTitle(title);
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException("No items found for '" + title + "'. Try different keywords or browse all items.");
        }
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Listing>> filterByCategory(@PathVariable String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new BadRequestException(" Category name is required to filter items");
        }
        List<Listing> listings = listingService.filterByCategory(category);
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException(" No items in the '" + category + "' category yet. Check back soon!");
        }
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/price")
    public ResponseEntity<List<Listing>> filterByPrice(@RequestParam Double min, @RequestParam Double max) {
        if (min == null || max == null || min > max || min < 0) {
            throw new BadRequestException(" Invalid price range. Ensure minimum is less than maximum and both are positive.");
        }
        List<Listing> listings = listingService.filterByPrice(min, max);
        if (listings == null || listings.isEmpty()) {
            throw new NotFoundException(" No items found in the price range " + min + " - " + max + " TND. Try a wider price range.");
        }
        return ResponseEntity.ok(listings);
    }
}