package com.cherifyedeshemdenebenhamed.demo.dto;

public class LoginResponse {

    private String message;
    private String token;

    public LoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }




}   /* cette classe sera util plus tard pour le jwt token et les autres infos que je veux envoyer au client apres le login */