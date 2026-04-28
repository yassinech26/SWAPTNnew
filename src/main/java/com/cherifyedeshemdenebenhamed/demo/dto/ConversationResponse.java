package com.cherifyedeshemdenebenhamed.demo.dto;

import java.time.Instant;

public class ConversationResponse {
    private Long id;
    private Long listingId;
    private String listingName;
    private Long user1Id;
    private Long user2Id;
    private UserResponse otherUser;
    private Instant createdAt;

    public ConversationResponse(Long id, Long listingId, String listingName, Long user1Id, Long user2Id, UserResponse otherUser, Instant createdAt) {
        this.id = id;
        this.listingId = listingId;
        this.listingName = listingName;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.otherUser = otherUser;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getListingId() { return listingId; }
    public String getListingName() { return listingName; }
    public Long getUser1Id() { return user1Id; }
    public Long getUser2Id() { return user2Id; }
    public UserResponse getOtherUser() { return otherUser; }
    public Instant getCreatedAt() { return createdAt; }
}