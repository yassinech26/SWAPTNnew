package com.cherifyedeshemdenebenhamed.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
@Entity
@JsonIgnoreProperties({
    "authorities",
    "username",
    "accountNonExpired",
    "accountNonLocked",
    "credentialsNonExpired",
    "enabled"
})
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = "email") ,//empeche 2 utulisateur d'avoir le meme email

        }
)
@Getter
@Setter
public class User implements UserDetails {

    // Primary key (auto-generated)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name of the user
    @NotBlank
    @Size(max = 120)
    @Column( name = "full_name", nullable = false, length = 120)
    private String fullName;

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

    public enum Role {
        ADMIN,
        USER,
        MODERATOR
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    public enum Status {
        ACTIVE,
        BANNED
    }

    @Override
    public boolean isEnabled() { return status != Status.BANNED; }

    // --- Constructors ---
    public User() {}


    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Role effectiveRole = getRole();
        return List.of(new SimpleGrantedAuthority("ROLE_" + effectiveRole));
    }

    @Override
    public String getUsername() {
        return email; // ici on utilise email comme username Spring Security
    }

    @Override
    @JsonIgnore
    public String getPassword() { return password; }

    public Role getRole() {
        if (role == null) {
            role = Role.USER;
        }
        return role;
    }

    public void setRole(Role role) {
        this.role = (role == null) ? Role.USER : role;
    }

    @PrePersist
    @PreUpdate
    @SuppressWarnings("unused")
    private void ensureDefaults() {
        if (status == null) {
            status = Status.ACTIVE;
        }
        if (role == null) {
            role = Role.USER;
        }
        if (rating == null) {
            rating = 0.0;
        }
    }
    @JsonIgnore
    @OneToMany(mappedBy = "owner")
    private List<Listing> listings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user1")
    private List<Conversation> conversationsAsUser1 = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user2")
    private List<Conversation> conversationsAsUser2 = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "sender")
    private List<Message> sentMessages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reviewer")
    private List<Review> writtenReviews = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reviewedUser")
    private List<Review> receivedReviews = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reportedBy")
    private List<Report> submittedReports = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reportedUser")
    private List<Report> receivedReports = new ArrayList<>();

}
