package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.configuration.JwtService;
import com.cherifyedeshemdenebenhamed.demo.dto.LoginRequest;
import com.cherifyedeshemdenebenhamed.demo.dto.LoginResponse;
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
    private final JwtService jwtService;

    public userService(usersRepository UserRepository, PasswordEncoder passwordEncoder , JwtService jwtService) {
        this.jwtService = jwtService;
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

    public LoginResponse login(LoginRequest request) {
        User user = UserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponse("Login successful",token);
    }


    public User getUserById(Long id) {
        return UserRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
