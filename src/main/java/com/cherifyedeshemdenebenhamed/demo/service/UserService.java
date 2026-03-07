package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Review;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ReviewRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public UserService(UserRepository userRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    public void recalculateMoyenne(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        List<Review> reviews = reviewRepository.findByReviewedUser_Id(userId);
        if (reviews.isEmpty()) {
            user.setRating(0.0);
        } else {
            double sum = 0;
            for (Review review : reviews) {
                sum += review.getRating();
            }
            user.setRating(sum / reviews.size());
        }
        userRepository.save(user);
    }
}