package com.cherifyedeshemdenebenhamed.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(
    name = "conversations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"listing_id", "user1_id", "user2_id"})
)
@Getter
@Setter
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user1 = id le plus petit, user2 = id le plus grand (anti-doublon)
    @ManyToOne(optional = false)
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user2_id")
    private User user2;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    public Long getListingId() { return listing == null ? null : listing.getId(); }

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }


    @JsonIgnore
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.REMOVE)
    private List<Message> messages = new ArrayList<>();

}
