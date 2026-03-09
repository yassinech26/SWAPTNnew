package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.model.Message;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // POST /api/messages - Envoyer un message
    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long conversationId, 
            @RequestBody @Valid Message message) {
        // Simuler l'utilisateur envoyé dans la requête
        User sender = new User(); // A récupérer avec Spring Security en vrai
        sender.setId(1L); // Exemple d'id

        // Envoi du message
        Message savedMessage = messageService.sendMessage(conversationId, sender, message.getContent());
        
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    // GET /api/messages/conversation/{id} - Récupérer les messages d'une conversation
    @GetMapping("/conversation/{id}")
    public ResponseEntity<?> getMessagesByConversation(@PathVariable Long id) {
        Long currentUserId = 1L;  // Static user for test (replace with JWT or security later)
        // Récupérer les messages par conversation
        return ResponseEntity.ok(messageService.getMessagesByConversation(id , currentUserId));
    }
}