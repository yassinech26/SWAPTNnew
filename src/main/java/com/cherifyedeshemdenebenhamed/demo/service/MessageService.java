package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.model.Message;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.MessageRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    // Méthode pour envoyer un message
    public Message sendMessage(Long conversationId, User sender, String content) {
        // Récupérer la conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation non trouvée"));

        // Créer un nouveau message
        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setConversation(conversation);
        message.setTimestamp(LocalDateTime.now());

        // Sauvegarder le message
        return messageRepository.save(message);
    }

    // Méthode pour récupérer tous les messages d'une conversation
    public List<Message> getMessagesByConversation(Long conversationId) {
        // Récupérer la conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new NotFoundException("Conversation non trouvée"));

        // Retourner les messages triés par timestamp
        return messageRepository.findByConversationOrderByTimestampAsc(conversation);
    }
}
