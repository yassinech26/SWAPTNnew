package com.cherifyedeshemdenebenhamed.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
@Entity
@Table(name = "listings")
@Getter
@Setter
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description too long")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    @Size(max = 100)
    @Column(length = 100)
    private String brand;

    @Size(max = 20)
    @Column(length = 20)
    private String size;

    @Size(max = 20)
    @Column(name = "item_condition", length = 20)
    private String condition;

    @Size(max = 100)
    @Column(length = 100)
    private String location;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ListingStatus status = ListingStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    public enum ListingStatus {
        ACTIVE,
        INACTIVE,
        SOLD
    }


    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = (imageUrls == null) ? new ArrayList<>() : imageUrls;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "listing")
    private List<Conversation> conversations = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "listing")
    private List<Review> reviews = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "listing")
    private List<Report> reports = new ArrayList<>();

}
