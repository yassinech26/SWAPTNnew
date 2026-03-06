package com.cherifyedeshemdenebenhamed.demo.dto;

import jakarta.validation.constraints.NotNull;

public class CreateConversationRequest {

    @NotNull
    private Long listingId;

    @NotNull
    private Long otherUserId;

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