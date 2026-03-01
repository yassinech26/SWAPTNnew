package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.dto.ConversationResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.CreateConversationRequest;
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
    ConversationResponse res = conversationService.createConversation(req, currentUserId);
    return ResponseEntity.ok(res);
}
@GetMapping
public ResponseEntity<List<ConversationResponse>> myConversations() {
    Long currentUserId = 1L; // TEMPORAIRE (jusqu’à la vraie auth)
    List<ConversationResponse> res = conversationService.getUserConversations(currentUserId);
    return ResponseEntity.ok(res);
}

    
}