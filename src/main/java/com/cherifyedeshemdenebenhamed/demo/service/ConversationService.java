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
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public List<ConversationResponse> getUserConversations(Long currentUserId) {
        return conversationRepository
                .findByUser1_IdOrUser2_Id(currentUserId, currentUserId)
                .stream()
                .map(c -> toResponse(c, currentUserId))
                .toList();
    }

    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest req, Long currentUserId) {
        if (req.getOtherUserId().equals(currentUserId)) {
            throw new BadRequestException("You cannot create a conversation with yourself.");
        }

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("Current user not found."));

        User otherUser = userRepository.findById(req.getOtherUserId())
                .orElseThrow(() -> new NotFoundException("Other user not found."));

        Long minId = Math.min(currentUserId, req.getOtherUserId());
        Long maxId = Math.max(currentUserId, req.getOtherUserId());

        // Anti-doublon: si existe déjà, on la retourne
        return conversationRepository
                .findByListingIdAndUser1_IdAndUser2_Id(req.getListingId(), minId, maxId)
                .map(c -> toResponse(c, currentUserId))
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setListingId(req.getListingId());

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
                "Listing",
                c.getUser1().getId(),
                c.getUser2().getId(),
                otherUserResponse,
                c.getCreatedAt()
        );
    }
    public Conversation getConversationById(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));
    }

    public ConversationResponse getConversationResponse(Conversation c, Long currentUserId) {
        return toResponse(c, currentUserId);
    }


}