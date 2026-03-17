package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.configuration.JwtService;
import com.cherifyedeshemdenebenhamed.demo.dto.*;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.usersRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
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
    // This method retrieves the currently authenticated user from the Spring Security context. It checks if the authentication object and its principal are present, and if so, it casts the principal to a User object and returns it. If the user is not authenticated, it throws an UNAUTHORIZED exception.
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return (User) authentication.getPrincipal();
    }

    public UserResponse updateProfile(Long id, UpdateUserRequest request) {
        User currentUser = getCurrentAuthenticatedUser();

        if (!currentUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own profile");
        }

        User user = UserRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }

        if (request.getImageUrl() != null) {
            user.setImageUrl(request.getImageUrl());
        }

        User savedUser = UserRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getCity(),
                savedUser.getImageUrl()
        );
    }





}
