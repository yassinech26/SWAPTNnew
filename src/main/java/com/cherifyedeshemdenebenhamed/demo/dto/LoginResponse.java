package com.cherifyedeshemdenebenhamed.demo.dto;

public class LoginResponse {

    private String message;
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String imageUrl;
    private String role;

    public LoginResponse(String message, String token, Long id, String fullName, String email, String imageUrl, String role) {
        this.message = message;
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.imageUrl = imageUrl;
        this.role = role;
    }

    public String getMessage() { return message; }
    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getImageUrl() { return imageUrl; }
    public String getRole() { return role; }
}   /* Returns user details along with JWT token after login */