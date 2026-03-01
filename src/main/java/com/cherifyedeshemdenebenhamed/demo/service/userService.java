package com.cherifyedeshemdenebenhamed.demo.service;

import org.springframework.stereotype.Service;

@Service
public class userService {
    public String publicMessage() {
        return "PUBLIC OK ✅ (no auth needed)";
    }

    public String privateMessage() {
        return "PRIVATE OK 🔒 (auth required)";
    }
}
