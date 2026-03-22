package com.cherifyedeshemdenebenhamed.demo.dto;

public class CreateConversationRequest {

    @NotNull(message = "listingId is required")
    private Long listingId;

    @NotNull(message = "otherUserId is required")
    private Long otherUserId;

    // Getters et setters
    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }
}
