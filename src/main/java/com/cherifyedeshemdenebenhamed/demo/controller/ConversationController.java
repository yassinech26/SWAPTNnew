package com.cherifyedeshemdenebenhamed.demo.controller;
import com.cherifyedeshemdenebenhamed.demo.dto.ConversationResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.CreateConversationRequest;
import com.cherifyedeshemdenebenhamed.demo.exception.ForbiddenException;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.service.ConversationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

        @PostMapping
public ResponseEntity<ConversationResponse> create(@Valid @RequestBody CreateConversationRequest req) {
    Long currentUserId = 1L; // TEMP pour test
    if (req.getListingId() == null) {
        throw new BadRequestException("listingId is required");
    }

    if (req.getOtherUserId() == null) {
        throw new BadRequestException("otherUserId is required");
    }

    // Empêcher la conversation avec soi-même
    if (req.getOtherUserId().equals(currentUserId)) {
        throw new BadRequestException("You cannot start a conversation with yourself");
    }
    ConversationResponse res = conversationService.createConversation(req, currentUserId);
    return ResponseEntity.ok(res);
}
@GetMapping
public ResponseEntity<List<ConversationResponse>> myConversations() {
    Long currentUserId = 1L; // TEMPORAIRE (jusqu’à la vraie auth)
    List<ConversationResponse> res = conversationService.getUserConversations(currentUserId);
    return ResponseEntity.ok(res);
}
@GetMapping("/{id}")
public ResponseEntity<ConversationResponse> getConversationById(@PathVariable Long id, Authentication authentication) {
    Long currentUserId = 1L;  // Utilisateur statique pour test (remplacer plus tard avec JWT ou sécurité)

    // Recherche la conversation par ID
    Conversation conversation = conversationService.getConversationById(id);

    // Vérifie si l'utilisateur est un participant (user1 ou user2)
    if (!conversation.getUser1().getId().equals(currentUserId) && !conversation.getUser2().getId().equals(currentUserId)) {
        throw new ForbiddenException("You are not a participant in this conversation");
    }

    // Retourne la conversation sous forme de DTO
    ConversationResponse response = new ConversationResponse(
            conversation.getId(),
            conversation.getListingId(),
            conversation.getUser1().getId(),
            conversation.getUser2().getId(),
            conversation.getCreatedAt()
    );

    return ResponseEntity.ok(response);
}
}