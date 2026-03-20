package com.cherifyedeshemdenebenhamed.demo.dto;

import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import java.time.LocalDateTime;

public class ReportDTO {

    private Long id;
    private ReportType type;
    private Long targetId;
    private String reason;
    private ReportStatus status;
    private Long reportedById;  // L'ID de l'utilisateur qui a fait le signalement
    private LocalDateTime createdAt;

    // Constructeurs
    public ReportDTO() {}

    public ReportDTO(Long id, ReportType type, Long targetId, String reason, ReportStatus status, Long reportedById, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.targetId = targetId;
        this.reason = reason;
        this.status = status;
        this.reportedById = reportedById;
        this.createdAt = createdAt;
    }

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

    public Long getReportedById() {
        return reportedById;
    }

    public void setReportedById(Long reportedById) {
        this.reportedById = reportedById;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}