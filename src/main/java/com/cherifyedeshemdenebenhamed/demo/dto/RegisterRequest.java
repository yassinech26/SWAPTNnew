package com.cherifyedeshemdenebenhamed.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@lombok.Getter
@lombok.Setter
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 50, message = "Full name must contain between 3 and 50 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must contain at least 6 characters")
    private String password;

public void setFullName(String fullName) { this.fullName = fullName; }

public void setEmail(String email) { this.email = email; }

public void setPassword(String password) { this.password = password; }
}
