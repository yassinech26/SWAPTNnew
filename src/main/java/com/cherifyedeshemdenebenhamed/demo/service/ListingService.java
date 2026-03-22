package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    public Optional<Listing> getListingById(Long id) {
        return listingRepository.findById(id);
    }

    public Listing saveListing(Listing listing) {
        return listingRepository.save(listing);
    }

    public void deleteListing(Long id) {
        listingRepository.deleteById(id);
    }

    public List<Listing> searchByTitle(String title) {
        return listingRepository.findByTitleContaining(title);
    }

    public List<Listing> filterByCategory(String category) {
        return listingRepository.findByCategory(category);
    }

    public List<Listing> filterByPrice(Double min, Double max) {
        return listingRepository.findByPriceBetween(min, max);
    }
}
