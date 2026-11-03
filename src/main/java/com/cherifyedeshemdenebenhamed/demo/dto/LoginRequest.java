package com.cherifyedeshemdenebenhamed.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@lombok.Getter
@lombok.Setter
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

public void setEmail(String email) {
        this.email = email;
    }

public void setPassword(String password) {
        this.password = password;
    }
}
