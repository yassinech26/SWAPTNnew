package com.cherifyedeshemdenebenhamed.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@lombok.Getter
@lombok.Setter
public class UpdateUserRequest {

    @Size(min = 3, max = 50, message = "Full name must contain between 3 and 50 characters")
    private String fullName;

    @Email(message = "Email format is invalid")
    private String email;

    private String phone;
    private String city;
    private String imageUrl;

public void setFullName(String fullName) {
        this.fullName = fullName;
    }

public void setEmail(String email) {
        this.email = email;
    }

public void setPhone(String phone) {
        this.phone = phone;
    }

public void setCity(String city) {
        this.city = city;
    }

public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}