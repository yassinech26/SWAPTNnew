package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.dto.RegisterRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.RegisterResponse;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.usersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class userService {
    usersRepository UserRepository;
    private final PasswordEncoder passwordEncoder;

    public userService(usersRepository UserRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.UserRepository = UserRepository;
    }
    public RegisterResponse register(RegisterRequest request) {

        if (UserRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ important

        User saved = UserRepository.save(user);

        return new RegisterResponse(saved.getId(), saved.getFullName(), saved.getEmail());
    }















    /* public String publicMessage() {
        return "PUBLIC OK ✅ (no auth needed)";
    }

    public String privateMessage() {
        return "PRIVATE OK 🔒 (auth required)";
    }*/
}
