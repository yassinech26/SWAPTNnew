package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Review;
import com.cherifyedeshemdenebenhamed.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserService userService) {
        this.reviewRepository = reviewRepository;
        this.userService = userService;
    }

    public Review addReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        if (review.getReviewedUser() != null) {
            userService.recalculateMoyenne(review.getReviewedUser().getId());
        }
        return savedReview;
    }

    public List<Review> getReviewsByUser(Long reviewedUserId) {
        return reviewRepository.findByReviewedUser_Id(reviewedUserId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found with id: " + id));
        reviewRepository.delete(review);
        return review;
    }
}
