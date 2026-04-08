package com.cherifyedeshemdenebenhamed.demo.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.model.Listing.ListingStatus;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    public List<Listing> getAllListings() {
        return listingRepository.findByStatus(ListingStatus.ACTIVE);
    }

    public List<Listing> getAllListingsForAdmin() {
        return listingRepository.findAll();
    }

    public Optional<Listing> getListingById(@NonNull Long id) {
        return listingRepository.findById(id);
    }

    public Optional<Listing> getActiveListingById(@NonNull Long id) {
        return listingRepository.findByIdAndStatus(id, ListingStatus.ACTIVE);
    }

    public @NonNull Listing saveListing(@NonNull Listing listing) {
        return Objects.requireNonNull(listingRepository.save(listing));
    }

    public void deleteListing(@NonNull Long id) {
        listingRepository.deleteById(id);
    }

    public List<Listing> searchByTitle(String title) {
        return listingRepository.findByStatusAndTitleContaining(ListingStatus.ACTIVE, title);
    }

    public List<Listing> filterByCategory(String category) {
        return listingRepository.findByStatusAndCategory(ListingStatus.ACTIVE, category);
    }

    public List<Listing> filterByPrice(Double min, Double max) {
        return listingRepository.findByStatusAndPriceBetween(ListingStatus.ACTIVE, min, max);
    }

    public @NonNull Listing deactivateListingByAdmin(@NonNull Long listingId) {
        Listing listing = getListingById(listingId)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        listing.setStatus(ListingStatus.INACTIVE);
        return saveListing(listing);
    }
}
