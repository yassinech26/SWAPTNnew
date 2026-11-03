package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.model.Conversation;
import com.cherifyedeshemdenebenhamed.demo.model.Message;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.Review;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.MessageRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ReportRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ReviewRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Listing.ListingStatus;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public List<Listing> getAllListings() {
        return listingRepository.findByStatus(ListingStatus.ACTIVE);
    }

    public Page<Listing> getAllListingsPaginated(Pageable pageable) {
        return listingRepository.findByStatus(ListingStatus.ACTIVE, pageable);
    }

    public List<Listing> getAllListingsForAdmin() {
        return listingRepository.findAll();
    }

    public Optional<Listing> getListingById(@NonNull Long id) {
        return listingRepository.findById(id);
    }

    public Optional<Listing> getActiveListingById(@NonNull Long id) {
        return listingRepository.findByIdAndStatus(id, ListingStatus.ACTIVE);
    }

    public @NonNull Listing saveListing(@NonNull Listing listing) {
        return Objects.requireNonNull(listingRepository.save(listing));
    }

    @Transactional
    public void deleteListing(@NonNull Long id) {
        Listing listing = listingRepository.findById(id).orElseThrow(() -> new NotFoundException("Listing not found"));
        var conversations = conversationRepository.findByListing_IdIn(List.of(id));
        var conversationIds = conversations.stream().map(Conversation::getId).toList();
        if (!conversationIds.isEmpty()) {
            var messageIds = messageRepository.findByConversation_IdIn(conversationIds).stream()
                    .map(Message::getId).toList();
            if (!messageIds.isEmpty()) reportRepository.deleteByTypeAndTargetIdIn(ReportType.MESSAGE, messageIds);
            reportRepository.deleteByTypeAndTargetIdIn(ReportType.CONVERSATION, conversationIds);
            messageRepository.deleteByConversation_IdIn(conversationIds);
            conversationRepository.deleteAll(conversations);
        }
        reportRepository.deleteByTypeAndTargetId(ReportType.LISTING, id);
        reviewRepository.deleteByListing_Id(id);
        listingRepository.delete(listing);
        reviewRepository.flush();
        var owner = listing.getOwner();
        var remaining = reviewRepository.findByReviewedUser_Id(owner.getId());
        owner.setRating(remaining.stream().mapToInt(Review::getRating).average().orElse(0.0));
        userRepository.save(owner);
    }

    public List<Listing> searchByTitle(String title) {
        return listingRepository.findByStatusAndTitleContaining(ListingStatus.ACTIVE, title);
    }

    public List<Listing> filterByCategory(String category) {
        return listingRepository.findByStatusAndCategory(ListingStatus.ACTIVE, category);
    }

    public List<Listing> filterByPrice(Double min, Double max) {
        return listingRepository.findByStatusAndPriceBetween(ListingStatus.ACTIVE, min, max);
    }

    public @NonNull Listing deactivateListingByAdmin(@NonNull Long listingId) {
        Listing listing = getListingById(listingId)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        listing.setStatus(ListingStatus.INACTIVE);
        return saveListing(listing);
    }
}
