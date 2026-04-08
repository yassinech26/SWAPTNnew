package com.cherifyedeshemdenebenhamed.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.model.Listing.ListingStatus;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByStatus(ListingStatus status);
    Optional<Listing> findByIdAndStatus(Long id, ListingStatus status);
    List<Listing> findByStatusAndTitleContaining(ListingStatus status, String title);
    List<Listing> findByStatusAndCategory(ListingStatus status, String category);
    List<Listing> findByStatusAndPriceBetween(ListingStatus status, Double min, Double max);

    List<Listing> findByTitleContaining(String title);
    List<Listing> findByCategory(String category);
    List<Listing> findByPriceBetween(Double min, Double max);

    void deleteByOwner_Id(Long ownerId);
}
