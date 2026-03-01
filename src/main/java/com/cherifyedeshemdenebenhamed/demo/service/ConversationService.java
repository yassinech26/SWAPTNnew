package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.dto.ConversationResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.CreateConversationRequest;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
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
                .map(this::toResponse)
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
                    return toResponse(saved);
                });
    }

    private ConversationResponse toResponse(Conversation c) {
        return new ConversationResponse(
                c.getId(),
                c.getListingId(),
                c.getUser1().getId(),
                c.getUser2().getId(),
                c.getCreatedAt()
        );
    }
}