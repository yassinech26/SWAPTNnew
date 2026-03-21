package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByTitleContaining(String title);
    List<Listing> findByCategory(String category);
    List<Listing> findByPriceBetween(Double min, Double max);
}
