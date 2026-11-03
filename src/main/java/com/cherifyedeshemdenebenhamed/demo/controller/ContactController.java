package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.model.ContactMessage;
import com.cherifyedeshemdenebenhamed.demo.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final ContactMessageRepository repository;

    public record ContactRequest(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Email @Size(max = 180) String email,
            @NotBlank @Size(max = 200) String subject,
            @NotBlank @Size(max = 5000) String message) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> create(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name());
        message.setEmail(request.email());
        message.setSubject(request.subject());
        message.setMessage(request.message());
        return Map.of("id", repository.save(message).getId());
    }
}
