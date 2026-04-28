package com.cherifyedeshemdenebenhamed.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cherifyedeshemdenebenhamed.demo.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewedUser_Id(Long reviewedUserId);

    void deleteByReviewer_IdOrReviewedUser_Id(Long reviewerId, Long reviewedUserId);
}
