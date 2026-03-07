package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.dto.ConversationResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.CreateConversationRequest;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.ForbiddenException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.service.ConversationService;
import com.cherifyedeshemdenebenhamed.demo.service.ListingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ListingService listingService;  // Declare the ListingService
    private final ConversationService conversationService;

    // Constructor injection of both services
    @Autowired
    public ConversationController(ConversationService conversationService, ListingService listingService) {
        this.conversationService = conversationService;
        this.listingService = listingService;  // Initialize the ListingService here
    }

    // POST method to create a conversation
    @PostMapping
    public ResponseEntity<ConversationResponse> create(@Valid @RequestBody CreateConversationRequest req) {
        Long currentUserId = 1L; // TEMP pour test

        // Validate listingId is present
        if (req.getListingId() == null) {
            throw new BadRequestException("listingId is required");
        }

        // Check if the listingId exists in the Listings table
        if (!listingService.getListingById(req.getListingId()).isPresent()) {
            throw new NotFoundException("Listing not found with id: " + req.getListingId());
        }

        // Validate otherUserId is present
        if (req.getOtherUserId() == null) {
            throw new BadRequestException("otherUserId is required");
        }

        // Prevent conversation with oneself
        if (req.getOtherUserId().equals(currentUserId)) {
            throw new BadRequestException("You cannot start a conversation with yourself");
        }

        // Proceed to create the conversation
        ConversationResponse res = conversationService.createConversation(req, currentUserId);
        return ResponseEntity.ok(res);
    }

    // GET method to retrieve user's conversations
    @GetMapping
    public ResponseEntity<List<ConversationResponse>> myConversations() {
        Long currentUserId = 1L; // Temporary (replace with real auth later)
        List<ConversationResponse> res = conversationService.getUserConversations(currentUserId);
        return ResponseEntity.ok(res);
    }

    // GET method to retrieve a conversation by ID
    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponse> getConversationById(@PathVariable Long id) {
        Long currentUserId = 1L;  // Static user for test (replace with JWT or security later)

        // Fetch the conversation by ID
        Conversation conversation = conversationService.getConversationById(id);

        // Check if the user is a participant in the conversation
        if (!conversation.getUser1().getId().equals(currentUserId) && !conversation.getUser2().getId().equals(currentUserId)) {
            throw new ForbiddenException("You are not a participant in this conversation");
        }

        // Return the conversation as a DTO
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