package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.exception.ForbiddenException;
import com.cherifyedeshemdenebenhamed.demo.service.ReportService;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;




import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    @Autowired
    public ReportController(ReportService reportService, UserRepository userRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    /**
     * Créer un signalement
     * @param report Le signalement à créer
     * @return Le signalement créé
     */
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)

public Report createReport(@RequestBody Report report) {
    if (report.getType() == null || report.getReason() == null) {
        throw new BadRequestException("Le type ou la raison du signalement ne peuvent pas être vides");
    }
    
    
    Optional<User> userOpt = userRepository.findById(getCurrentAuthenticatedUser().getId());  // Rechercher l'utilisateur par ID
    if (userOpt.isEmpty()) {
        throw new NotFoundException("Utilisateur introuvable");
    }
    User user = userOpt.get();

    report.setReportedBy(user);  // Associer l'utilisateur au signalement
    return reportService.createReport(report);  // Crée le signalement dans la base de données.
}

    /**
     * Récupérer tous les signalements d'un utilisateur spécifique
     * @param userId L'ID de l'utilisateur pour lequel récupérer les signalements
     * @return Liste des signalements créés par cet utilisateur
     */
    @GetMapping("/my")  
    public List<Report> getReportsByUser(@RequestParam("userId") Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new NotFoundException("Utilisateur introuvable");  // Utilisateur introuvable
        }
        User user = userOpt.get();
        return reportService.getReportsByUser(user);  // Récupère tous les signalements de l'utilisateur.
    }

    /**
     * Récupérer un signalement spécifique par son ID
     * @param id L'ID du signalement à récupérer
     * @return Le signalement trouvé
     */
    @GetMapping("/{id}")
    public Optional<Report> getReportById(@PathVariable Long id) {
        Optional<Report> report = reportService.getReportById(id);
        if (report.isEmpty()) {
            throw new NotFoundException("Signalement introuvable");  // Signalement introuvable
        }
        return report;
    }

    /**
     * Récupérer les signalements en fonction de leur statut
     * @param status Le statut des signalements à récupérer (PENDING, RESOLVED, REJECTED)
     * @return Liste des signalements ayant ce statut
     */
    @GetMapping("/status")
    public List<Report> getReportsByStatus(@RequestParam("status") String status) {
        try {
            return reportService.getReportsByStatus(ReportStatus.valueOf(status));  // Récupère les signalements par statut.
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Statut invalide");  // Gestion de statut invalide
        }
    }

    /**
     * Récupérer les signalements en fonction de leur type
     * @param type Le type de signalement à récupérer (LISTING, MESSAGE, USER, CONVERSATION)
     * @return Liste des signalements de ce type
     */
    @GetMapping("/type")
    public List<Report> getReportsByType(@RequestParam("type") String type) {
        try {
            return reportService.getReportsByType(ReportType.valueOf(type));  // Récupère les signalements par type.
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Type de signalement invalide");  // Gestion de type invalide
        }
    }

    /**
     * Récupérer les signalements par type et statut
     * @param type Le type de signalement (LISTING, MESSAGE, etc.)
     * @param status Le statut du signalement (PENDING, RESOLVED, etc.)
     * @return Liste des signalements correspondants à ce type et statut
     */
    @GetMapping("/filter")
    public List<Report> getReportsByTypeAndStatus(@RequestParam("type") String type,
                                                  @RequestParam("status") String status) {
        try {
            return reportService.getReportsByTypeAndStatus(ReportType.valueOf(type), ReportStatus.valueOf(status));  // Récupère les signalements filtrés par type et statut.
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Type ou statut invalide");  // Gestion des erreurs pour type ou statut
        }
    }

    /**
     * Récupérer les signalements concernant un élément spécifique (targetId)
     * @param targetId L'ID de l'élément signalé (par exemple, un listing ou un message)
     * @return Liste des signalements pour cet élément
     */
    @GetMapping("/target")
    public List<Report> getReportsByTargetId(@RequestParam("targetId") Long targetId) {
        return reportService.getReportsByTargetId(targetId);  // Récupère les signalements pour un élément spécifique.
    }

    /**
     * Mettre à jour le statut d'un signalement (RESOLVED, REJECTED, etc.)
     * @param id L'ID du signalement à mettre à jour
     * @param status Le nouveau statut du signalement
     * @return Le signalement mis à jour
     */
    @PatchMapping("/{id}/status")
    public Report updateReportStatus(@PathVariable Long id, @RequestParam("status") String status) {
        Optional<Report> reportOpt = reportService.getReportById(id);
        if (reportOpt.isEmpty()) {
            throw new NotFoundException("Signalement introuvable");  // Signalement introuvable
        }
        Report report = reportOpt.get();
        report.setStatus(ReportStatus.valueOf(status));  // Mise à jour du statut du signalement
        return reportService.createReport(report);  // Met à jour le signalement dans la base de données
    }
}