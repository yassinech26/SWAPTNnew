package com.cherifyedeshemdenebenhamed.demo.dto;

@lombok.Getter
@lombok.Setter
public class RegisterResponse {
    private Long id;
    private String fullName;
    private String email;

    public RegisterResponse(Long id, String fullname, String email) {
        this.id = id;
        this.fullName = fullname;
        this.email = email;
    }

public String getFullname() { return fullName; }
}
