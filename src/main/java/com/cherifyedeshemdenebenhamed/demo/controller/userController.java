package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.service.userService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class userController {
    private final userService UserService;

    public userController(userService UserService) {
        this.UserService = UserService;
    }

    // ✅ Public endpoint (no auth)
    @GetMapping("/public/ping")
    public String publicPing() {
        return UserService.publicMessage();
    }

    // 🔒 Protected endpoint (needs auth)
    @GetMapping("/private/ping")
    public String privatePing() {
        return UserService.privateMessage();
    }

}
