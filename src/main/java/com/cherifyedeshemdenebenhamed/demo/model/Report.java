package com.cherifyedeshemdenebenhamed.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
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

    private LocalDateTime createdAt = LocalDateTime.now();  // Date de création du signalement

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ReportType getType() {
        return type;
    }

    public void setType(ReportType type) {
        this.type = type;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}