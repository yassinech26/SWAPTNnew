package com.cherifyedeshemdenebenhamed.demo.dto;

import jakarta.validation.constraints.NotNull;
@lombok.Getter
@lombok.Setter
public class CreateConversationRequest {

    @NotNull(message = "listingId is required")
    private Long listingId;

    @NotNull(message = "otherUserId is required")
    private Long otherUserId;

    // Getters et setters
public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }
}
