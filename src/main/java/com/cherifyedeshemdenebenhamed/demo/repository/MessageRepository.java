package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByTimestampAsc(Conversation conversation);
    // Ajouter des méthodes personnalisées si nécessaire
}