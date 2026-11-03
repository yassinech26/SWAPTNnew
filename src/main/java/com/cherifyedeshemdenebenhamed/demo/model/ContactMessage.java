package com.cherifyedeshemdenebenhamed.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "contact_messages")
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String name;
    @Column(nullable = false, length = 180)
    private String email;
    @Column(nullable = false, length = 200)
    private String subject;
    @Column(nullable = false, length = 5000)
    private String message;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
