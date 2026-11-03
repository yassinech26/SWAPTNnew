package com.cherifyedeshemdenebenhamed.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Entity
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false, length = 1000)
    private String content;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = false)
    private User sender;

    @ManyToOne(optional = false)
    @JoinColumn(name = "conversation_id", referencedColumnName = "id", nullable = false)
    private Conversation conversation;

    @Column(nullable = false)
    private LocalDateTime timestamp;


}
