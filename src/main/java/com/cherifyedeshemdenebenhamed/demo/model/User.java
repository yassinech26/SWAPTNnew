package com.cherifyedeshemdenebenhamed.demo.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = "email") ,//empeche 2 utulisateur d'avoir le meme email

        }
)
public class User {

    // Primary key (auto-generated)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name of the user
    @NotBlank
    @Size(max = 120)
    @Column( name = "full_name", nullable = false, length = 120)
    private String fullName;
    //full name must be unique because we will use it as username for login (as per your diagram)

    // Email must be unique
    @NotBlank
    @Email
    @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String email;

    // Store a HASHED password (never store plain password)
    // Example later: BCrypt hash
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String password;

    @Size(max = 30)
    @Column(length = 30)
    private String phone;

    @Size(max = 80)
    @Column(length = 80)
    private String city;

    // Could store a URL/path to the profile picture
    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // ACTIVE / BANNED from your diagram
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    // If user signs up with Google, store google subject id (sub)
    // This is optional; can be null for email/password users
    @Size(max = 200)
    @Column(name = "google_id", length = 200)
    private String googleId;

    @Column(name = "rating")
    private Double rating = 0.0;

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public enum Status {
        ACTIVE,
        BANNED
    }

    // --- Constructors ---
    public User() {}

    // --- Getters/Setters (keep simple and explicit) ---
    public Long getId() { return id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
}
