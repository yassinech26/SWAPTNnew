package com.cherifyedeshemdenebenhamed.demo.dto;

public class RegisterResponse {
    private Long id;
    private String fullName;
    private String email;

    public RegisterResponse(Long id, String fullname, String email) {
        this.id = id;
        this.fullName = fullname;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getFullname() { return fullName; }
    public String getEmail() { return email; }
}
