package com.cherifyedeshemdenebenhamed.demo.dto;

public class LoginResponse {

    private String message;

    public LoginResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}   /* cette classe sera util plus tard pour le jwt token et les autres infos que je veux envoyer au client apres le login */