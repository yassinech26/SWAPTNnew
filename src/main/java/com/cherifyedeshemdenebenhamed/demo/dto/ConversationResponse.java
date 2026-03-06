package com.cherifyedeshemdenebenhamed.demo.dto;

import java.time.Instant;

public class ConversationResponse {
    private Long id;
    private Long listingId;
    private Long user1Id;
    private Long user2Id;
    private Instant createdAt;

    public ConversationResponse(Long id, Long listingId, Long user1Id, Long user2Id, Instant createdAt) {
        this.id = id;
        this.listingId = listingId;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getListingId() { return listingId; }
    public Long getUser1Id() { return user1Id; }
    public Long getUser2Id() { return user2Id; }
    public Instant getCreatedAt() { return createdAt; }
}