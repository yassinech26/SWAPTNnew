package com.cherifyedeshemdenebenhamed.demo.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.cherifyedeshemdenebenhamed.demo.configuration.JwtService;
import com.cherifyedeshemdenebenhamed.demo.dto.LoginRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.LoginResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.RegisterRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.RegisterResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.UpdateUserRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.UserResponse;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.model.Message;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.Review;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.MessageRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ReportRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ReviewRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ListingRepository listingRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public UserService(
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            ListingRepository listingRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            ReportRepository reportRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.listingRepository = listingRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.reportRepository = reportRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ important

        User saved = userRepository.save(user);

        return new RegisterResponse(saved.getId(), saved.getFullName(), saved.getEmail());
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponse("Login successful", token, user.getId(), user.getFullName(), user.getEmail(), user.getImageUrl(), user.getRole().toString());
    }


    public @NonNull User getUserById(@NonNull Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return Objects.requireNonNull(user);
    }
    // This method retrieves the currently authenticated user from the Spring Security context. It checks if the authentication object and its principal are present, and if so, it casts the principal to a User object and returns it. If the user is not authenticated, it throws an UNAUTHORIZED exception.
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return (User) authentication.getPrincipal();
    }

    @SuppressWarnings("null")
    public UserResponse updateProfile(@NonNull Long id, UpdateUserRequest request) {
        User currentUser = getCurrentAuthenticatedUser();

        if (!currentUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own profile");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }

        if (request.getImageUrl() != null) {
            user.setImageUrl(request.getImageUrl());
        }

        User savedUser = Objects.requireNonNull(saveUser(user));

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getCity(),
                savedUser.getImageUrl()
        );
    }

    public void recalculateMoyenne(@NonNull Long userId) {
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

    // ─── ADMIN METHODS ───────────────────────────────────────────────────────

    /**
     * Get all users (Admin only)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Save a user (used for role/status changes)
     */
    public @NonNull User saveUser(@NonNull User user) {
        return userRepository.save(user);
    }

    /**
     * Get total number of users
     */
    public long getTotalUserCount() {
        return userRepository.count();
    }

    /**
     * Get count of banned users
     */
    public long getBannedUserCount() {
        return userRepository.findAll().stream()
                .filter(u -> u.getStatus() == User.Status.BANNED)
                .count();
    }

    /**
     * Get count of admin users
     */
    public long getAdminCount() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN)
                .count();
    }

    /**
     * Delete a user and related records (Admin only workflow)
     */
    @Transactional
    public void deleteUserByAdmin(@NonNull Long userId) {
        User user = getUserById(userId);

        List<Long> listingIds = listingRepository.findByOwner_Id(userId)
            .stream()
            .map(Listing::getId)
            .toList();

        List<Long> conversationIdsByUser = conversationRepository
                .findByUser1_IdOrUser2_Id(userId, userId)
                .stream()
                .map(Conversation::getId)
                .toList();

        List<Long> conversationIdsByListing = listingIds.isEmpty()
            ? List.of()
            : conversationRepository.findByListingIdIn(listingIds)
                .stream()
                .map(Conversation::getId)
                .toList();

        Set<Long> allConversationIds = new LinkedHashSet<>();
        allConversationIds.addAll(conversationIdsByUser);
        allConversationIds.addAll(conversationIdsByListing);

        List<Long> messageIdsBySender = messageRepository.findBySender_Id(userId)
            .stream()
            .map(Message::getId)
            .toList();

        List<Long> messageIdsByConversation = allConversationIds.isEmpty()
            ? List.of()
            : messageRepository.findByConversation_IdIn(new ArrayList<>(allConversationIds))
                .stream()
                .map(Message::getId)
                .toList();

        Set<Long> allMessageIds = new LinkedHashSet<>();
        allMessageIds.addAll(messageIdsBySender);
        allMessageIds.addAll(messageIdsByConversation);

        if (!allMessageIds.isEmpty()) {
            reportRepository.deleteByTypeAndTargetIdIn(ReportType.MESSAGE, new ArrayList<>(allMessageIds));
        }
        if (!allConversationIds.isEmpty()) {
            reportRepository.deleteByTypeAndTargetIdIn(ReportType.CONVERSATION, new ArrayList<>(allConversationIds));
        }
        if (!listingIds.isEmpty()) {
            reportRepository.deleteByTypeAndTargetIdIn(ReportType.LISTING, listingIds);
        }

        if (!allConversationIds.isEmpty()) {
            messageRepository.deleteByConversation_IdIn(new ArrayList<>(allConversationIds));
        }
        if (!listingIds.isEmpty()) {
            conversationRepository.deleteByListingIdIn(listingIds);
        }

        messageRepository.deleteBySender_Id(userId);
        conversationRepository.deleteByUser1_IdOrUser2_Id(userId, userId);
        reviewRepository.deleteByReviewer_IdOrReviewedUser_Id(userId, userId);
        reportRepository.deleteByReportedBy_Id(userId);
        reportRepository.deleteByTypeAndTargetId(ReportType.USER, userId);
        listingRepository.deleteByOwner_Id(userId);
        userRepository.delete(user);
    }
}
