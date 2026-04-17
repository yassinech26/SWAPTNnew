package com.cherifyedeshemdenebenhamed.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByTimestampAsc(Conversation conversation);

    List<Message> findBySender_Id(Long senderId);

    List<Message> findByConversation_IdIn(List<Long> conversationIds);

    void deleteBySender_Id(Long senderId);

    void deleteByConversation_IdIn(List<Long> conversationIds);
}