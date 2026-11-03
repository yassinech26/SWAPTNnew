package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.ForbiddenException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Review;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ReviewRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ListingRepository listingRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserService userService, ListingRepository listingRepository) {
        this.reviewRepository = reviewRepository;
        this.userService = userService;
        this.listingRepository = listingRepository;
    }

    public Review addReview(Review review) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var reviewer = (User) authentication.getPrincipal();
        if (review.getListing() == null || review.getListing().getId() == null) {
            throw new BadRequestException("listing.id is required");
        }
        var listing = listingRepository.findById(review.getListing().getId())
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        if (listing.getOwner().getId().equals(reviewer.getId())) {
            throw new BadRequestException("You cannot review your own listing");
        }
        review.setId(null);
        review.setCreatedAt(null);
        review.setReviewer(userService.getUserById(reviewer.getId()));
        review.setListing(listing);
        review.setReviewedUser(listing.getOwner());
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
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!review.getReviewer().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("You can only delete your own reviews");
        }
        reviewRepository.delete(review);
        reviewRepository.flush();
        userService.recalculateMoyenne(review.getReviewedUser().getId());
        return review;
    }
}
