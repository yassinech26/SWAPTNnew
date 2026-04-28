package com.cherifyedeshemdenebenhamed.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cherifyedeshemdenebenhamed.demo.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByListingIdAndUser1_IdAndUser2_Id(Long listingId, Long user1Id, Long user2Id);

    List<Conversation> findByUser1_IdOrUser2_Id(Long user1Id, Long user2Id);

    List<Conversation> findByListingIdIn(List<Long> listingIds);

    void deleteByUser1_IdOrUser2_Id(Long user1Id, Long user2Id);

    void deleteByListingIdIn(List<Long> listingIds);
    
}