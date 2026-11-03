package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByListing_IdAndUser1_IdAndUser2_Id(Long listingId, Long user1Id, Long user2Id);

    List<Conversation> findByUser1_IdOrUser2_Id(Long user1Id, Long user2Id);

    List<Conversation> findByListing_IdIn(List<Long> listingIds);

    void deleteByUser1_IdOrUser2_Id(Long user1Id, Long user2Id);

    void deleteByListing_IdIn(List<Long> listingIds);
    
}
