package com.cherifyedeshemdenebenhamed.demo.dto;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String imageUrl;

    public UserResponse(Long id, String fullName, String email, String phone, String city, String imageUrl) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getCity() {
        return city;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}