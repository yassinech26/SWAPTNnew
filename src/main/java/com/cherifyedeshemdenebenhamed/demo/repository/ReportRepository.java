package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Trouver tous les signalements pour un utilisateur
    List<Report> findByReportedBy(User user);

    // Trouver tous les signalements par statut
    List<Report> findByStatus(ReportStatus status);

    // Trouver tous les signalements par type
    List<Report> findByType(ReportType type);

    // Trouver un signalement spécifique par ID
    Optional<Report> findById(Long id);

    // Trouver tous les signalements d'un type spécifique et un statut spécifique
    List<Report> findByTypeAndStatus(ReportType type, ReportStatus status);

    // Trouver les signalements concernant un certain contenu (par targetId)
    List<Report> findByTargetId(Long targetId);

}