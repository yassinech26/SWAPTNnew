package com.cherifyedeshemdenebenhamed.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Trouver tous les signalements pour un utilisateur
    List<Report> findByReportedBy(User user);

    // Trouver tous les signalements par statut
    List<Report> findByStatus(ReportStatus status);

    // Trouver tous les signalements par type
    List<Report> findByType(ReportType type);

    // Trouver tous les signalements d'un type spécifique et un statut spécifique
    List<Report> findByTypeAndStatus(ReportType type, ReportStatus status);

    // Trouver les signalements concernant un certain contenu (par targetId)
    List<Report> findByTargetId(Long targetId);

    // Supprimer les signalements créés par un utilisateur
    void deleteByReportedBy_Id(Long userId);

    // Supprimer les signalements d'un type + cible donnée
    void deleteByTypeAndTargetId(ReportType type, Long targetId);

    // Supprimer les signalements d'un type + plusieurs cibles
    void deleteByTypeAndTargetIdIn(ReportType type, List<Long> targetIds);

}