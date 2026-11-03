package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.model.Message;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // Méthode utilitaire pour récupérer l'utilisateur authentifié
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        // Attention : Vérifiez que votre Principal est bien votre entité User
        return (User) authentication.getPrincipal();
    }

    // POST /api/messages - Envoyer un message
    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long conversationId, 
            @RequestBody @Valid Message message) {
        
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        // Envoi du message via le service
        Message savedMessage = messageService.sendMessage(conversationId, currentUser, message.getContent());
        
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    // GET /api/messages/conversation/{id}
    @GetMapping("/conversation/{id}")
    public ResponseEntity<?> getMessagesByConversation(@PathVariable Long id) {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(messageService.getMessagesByConversation(id, currentUser.getId()));
    }

    // DELETE /api/messages/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        messageService.deleteMessage(id, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
