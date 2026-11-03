package com.cherifyedeshemdenebenhamed.demo.dto;

@lombok.Getter
@lombok.Setter
public class UserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String imageUrl;
    private Double rating;
    private String role;
    private String status;

    // Constructeurs
    public UserDTO() {}

    public UserDTO(Long id, String fullName, String email) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
    }

    public UserDTO(Long id, String fullName, String email, String phone, String city, 
                   String imageUrl, Double rating, String role, String status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.role = role;
        this.status = status;
    }

    // Getters et Setters
public void setId(Long id) { this.id = id; }

public void setFullName(String fullName) { this.fullName = fullName; }

public void setEmail(String email) { this.email = email; }

public void setPhone(String phone) { this.phone = phone; }

public void setCity(String city) { this.city = city; }

public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

public void setRating(Double rating) { this.rating = rating; }

public void setRole(String role) { this.role = role; }

public void setStatus(String status) { this.status = status; }
}