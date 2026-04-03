package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.model.Review;
import com.cherifyedeshemdenebenhamed.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        if (reviews == null || reviews.isEmpty()) {
            throw new NotFoundException("No reviews found");
        }
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@Valid @RequestBody Review review) {
        if (review.getComment() == null || review.getComment().trim().isEmpty()) {
            throw new BadRequestException("Review comment cannot be empty");
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.addReview(review));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        if (userId == null || userId <= 0) {
            throw new BadRequestException("Invalid user ID");
        }
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        if (reviews == null || reviews.isEmpty()) {
            throw new NotFoundException("No reviews found for user ID: " + userId);
        }
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Review> deleteReview(@PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid review ID");
        }
        Review deleted = reviewService.deleteReview(id);
        if (deleted == null) {
            throw new NotFoundException("Review not found with id: " + id);
        }
        return ResponseEntity.ok(deleted);
    }
}