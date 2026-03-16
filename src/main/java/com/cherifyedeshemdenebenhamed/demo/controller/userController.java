package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.dto.LoginRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.LoginResponse;
import com.cherifyedeshemdenebenhamed.demo.dto.RegisterRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.RegisterResponse;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.service.userService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping
public class userController {
    private final userService UserService;
    public userController(userService UserService) {
        this.UserService = UserService;
    }

    //pour que le mapping marche il faut que le client envoie un JSON avec les champs fullName, email et password
    //le champ fullName doit etre nome dans json fullName et pas fullname ou full_name sinon spring ne pourra pas le mapper dans le RegisterRequest
    //il faut aussi nome les varibale et les getter setter de RegisterRequest fullName (meme nom  toujours)
    @PostMapping("/auth/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse signup(@Valid @RequestBody RegisterRequest request) {
        return UserService.register(request);
    }

    @PostMapping("/auth/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return UserService.login(request);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        User requestedUser = UserService.getUserById(id);

        if (!currentUser.getEmail().equals(requestedUser.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return requestedUser;
    }




    /*
    // ✅ Public endpoint (no auth)
    @GetMapping("/public/ping")
    public String publicPing() {
        return UserService.publicMessage();
    }

    // 🔒 Protected endpoint (needs auth)
    @GetMapping("/private/ping")
    public String privatePing() {
        return UserService.privateMessage();
    }*/

}
