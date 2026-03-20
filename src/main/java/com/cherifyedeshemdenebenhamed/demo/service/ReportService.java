package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * Crée un nouveau signalement.
     * @param report Le signalement à créer.
     * @return Le signalement enregistré.
     */
    public Report createReport(Report report) {
        return reportRepository.save(report);  // Enregistre le signalement dans la base de données.
    }

    /**
     * Récupère tous les signalements faits par un utilisateur spécifique.
     * @param user L'utilisateur qui a créé les signalements.
     * @return Une liste de signalements créés par cet utilisateur.
     */
    public List<Report> getReportsByUser(User user) {
        return reportRepository.findByReportedBy(user);  // Trouve tous les signalements associés à cet utilisateur.
    }

    /**
     * Récupère un signalement spécifique par son identifiant.
     * @param id L'identifiant du signalement.
     * @return Le signalement correspondant à l'identifiant.
     */
    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);  // Trouve le signalement par ID.
    }

    /**
     * Récupère les signalements en fonction de leur statut.
     * @param status Le statut des signalements à récupérer.
     * @return Une liste de signalements avec ce statut.
     */
    public List<Report> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);  // Récupère les signalements avec ce statut spécifique.
    }

    /**
     * Récupère les signalements en fonction de leur type.
     * @param type Le type de contenu signalé (par exemple, LISTING, MESSAGE, etc.).
     * @return Une liste de signalements du type spécifié.
     */
    public List<Report> getReportsByType(ReportType type) {
        return reportRepository.findByType(type);  // Récupère les signalements de ce type spécifique.
    }

    /**
     * Récupère les signalements par type et statut.
     * @param type Le type de contenu signalé.
     * @param status Le statut des signalements à récupérer.
     * @return Une liste de signalements correspondant à ce type et statut.
     */
    public List<Report> getReportsByTypeAndStatus(ReportType type, ReportStatus status) {
        return reportRepository.findByTypeAndStatus(type, status);  // Récupère les signalements avec ce type et statut.
    }

    /**
     * Récupère les signalements liés à un élément spécifique (par exemple, un listing ou un message).
     * @param targetId L'ID de l'élément signalé.
     * @return Une liste de signalements concernant cet élément.
     */
    public List<Report> getReportsByTargetId(Long targetId) {
        return reportRepository.findByTargetId(targetId);  // Récupère les signalements pour un élément spécifique.
    }
}