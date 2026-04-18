package com.cherifyedeshemdenebenhamed.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherifyedeshemdenebenhamed.demo.dto.ConversationResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.CreateConversationRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.UserResponse;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository, ListingRepository listingRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
    }

    public List<ConversationResponse> getUserConversations(Long currentUserId) {
        if (currentUserId == null) {
            throw new BadRequestException("currentUserId is required");
        }

        return conversationRepository
                .findByUser1_IdOrUser2_Id(currentUserId, currentUserId)
                .stream()
                .map(c -> toResponse(c, currentUserId))
                .toList();
    }

    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest req, Long currentUserId) {
        if (currentUserId == null) {
            throw new BadRequestException("currentUserId is required");
        }

        if (req.getOtherUserId() == null) {
            throw new BadRequestException("otherUserId is required");
        }

        if (req.getListingId() == null) {
            throw new BadRequestException("listingId is required");
        }

        Long otherUserId = req.getOtherUserId();
        Long listingId = req.getListingId();

        if (otherUserId.equals(currentUserId)) {
            throw new BadRequestException("You cannot create a conversation with yourself.");
        }

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("Current user not found."));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new NotFoundException("Other user not found."));

        Long minId = Math.min(currentUserId, otherUserId);
        Long maxId = Math.max(currentUserId, otherUserId);

        // Anti-doublon: si existe déjà, on la retourne
        return conversationRepository
                .findByListingIdAndUser1_IdAndUser2_Id(req.getListingId(), minId, maxId)
                .map(c -> toResponse(c, currentUserId))
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setListingId(listingId);

                    // Normalisation user1/user2 (min/max)
                    if (currentUserId.equals(minId)) {
                        c.setUser1(currentUser);
                        c.setUser2(otherUser);
                    } else {
                        c.setUser1(otherUser);
                        c.setUser2(currentUser);
                    }

                    Conversation saved = conversationRepository.save(c);
                    return toResponse(saved, currentUserId);
                });
    }

    private ConversationResponse toResponse(Conversation c, Long currentUserId) {
        // Determine the other user
        User otherUser = c.getUser1().getId().equals(currentUserId) ? c.getUser2() : c.getUser1();

        Long listingId = c.getListingId();

        String listingName = listingId == null
            ? "N/A"
            : listingRepository.findById(listingId)
                .map(Listing::getTitle)
                .orElse("#" + listingId);
        
        // Convert other user to UserResponse
        UserResponse otherUserResponse = new UserResponse(
                otherUser.getId(),
                otherUser.getFullName(),
                otherUser.getEmail(),
                otherUser.getPhone(),
                otherUser.getCity(),
                otherUser.getImageUrl()
        );
        
        return new ConversationResponse(
                c.getId(),
                c.getListingId(),
                listingName,
                c.getUser1().getId(),
                c.getUser2().getId(),
                otherUserResponse,
                c.getCreatedAt()
        );
    }

    public Conversation getConversationById(Long id) {
        if (id == null) {
            throw new BadRequestException("conversationId is required");
        }

        return conversationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));
    }

    public ConversationResponse getConversationResponse(Conversation c, Long currentUserId) {
        return toResponse(c, currentUserId);
    }


}