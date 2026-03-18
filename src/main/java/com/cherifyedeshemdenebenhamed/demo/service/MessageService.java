package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.model.Message;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.ForbiddenException;
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
        if(content == null || content.trim().isEmpty()){
             throw new BadRequestException("Message content cannot be empty");
        }
        if(content.length() > 1000){
            throw new BadRequestException("Message too long");
        }
        if(conversationId == null){
            throw new BadRequestException("conversationId is required");
        }
        if(sender == null){
            throw new BadRequestException("Sender not found");
        }
        
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

    public List<Message> getMessagesByConversation(Long conversationId, Long currentUserId) {

    // Vérifier que l'id de la conversation est fourni
    if (conversationId == null) {
        throw new BadRequestException("conversationId is required");
    }

    // Vérifier que l'utilisateur courant est connu
    if (currentUserId == null) {
        throw new BadRequestException("currentUserId is required");
    }

    // Récupérer la conversation
    Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new NotFoundException("Conversation non trouvée"));

    // Vérifier que l'utilisateur est bien participant à la conversation
    boolean isParticipant =
            conversation.getUser1().getId().equals(currentUserId) ||
            conversation.getUser2().getId().equals(currentUserId);

    if (!isParticipant) {
        throw new ForbiddenException("Vous n'êtes pas autorisé à accéder à cette conversation");
    }

    // Retourner les messages triés par timestamp
    return messageRepository.findByConversationOrderByTimestampAsc(conversation);
}
}
