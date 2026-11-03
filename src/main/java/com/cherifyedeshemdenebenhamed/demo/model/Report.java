package com.cherifyedeshemdenebenhamed.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Entity
@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReportType type;  // Type de contenu signalé (LISTING, MESSAGE, USER, CONVERSATION)

    private Long targetId;  // Identifiant de l'élément signalé (ex : id du listing, message, utilisateur)

    private String reason;  // Raison du signalement

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;  // Statut du signalement (PENDING, RESOLVED, REJECTED)

    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;  // L'utilisateur qui a créé le signalement

    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    @ManyToOne
    @JoinColumn(name = "listing_id")
    private Listing listing;

    private LocalDateTime createdAt = LocalDateTime.now();  // Date de création du signalement


}
