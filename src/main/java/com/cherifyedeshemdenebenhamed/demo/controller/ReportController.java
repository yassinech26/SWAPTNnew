package com.cherifyedeshemdenebenhamed.demo.controller;

import com.cherifyedeshemdenebenhamed.demo.dto.ReportDTO;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import com.cherifyedeshemdenebenhamed.demo.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    // Récupérer l'utilisateur authentifié
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    /**
     * Créer un signalement
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReportDTO createReport(@RequestBody Report report) {
        if (report.getType() == null || report.getReason() == null || report.getReason().trim().isEmpty()) {
            throw new BadRequestException("Le type ou la raison du signalement ne peuvent pas être vides");
        }

        Optional<User> userOpt = userRepository.findById(getCurrentAuthenticatedUser().getId());
        if (userOpt.isEmpty()) {
            throw new NotFoundException("Utilisateur introuvable");
        }

        User user = userOpt.get();
        report.setReportedBy(user);

        return reportService.createReport(report);
    }

    /**
     * Récupérer tous les signalements d'un utilisateur spécifique
     */
    @GetMapping("/my")
    public List<ReportDTO> getReportsByUser(@RequestParam("userId") Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new NotFoundException("Utilisateur introuvable");
        }

        return reportService.getReportsByUser(userOpt.get());
    }

    /**
     * Récupérer un signalement spécifique par son ID
     */
    @GetMapping("/{id}")
    public ReportDTO getReportById(@PathVariable Long id) {
        Optional<ReportDTO> reportOpt = reportService.getReportById(id);
        if (reportOpt.isEmpty()) {
            throw new NotFoundException("Signalement introuvable");
        }

        return reportOpt.get();
    }

    /**
     * Récupérer les signalements par statut
     */
    @GetMapping("/status")
    public List<ReportDTO> getReportsByStatus(@RequestParam("status") String status) {
        try {
            return reportService.getReportsByStatus(ReportStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Statut invalide");
        }
    }

    /**
     * Récupérer les signalements par type
     */
    @GetMapping("/type")
    public List<ReportDTO> getReportsByType(@RequestParam("type") String type) {
        try {
            return reportService.getReportsByType(ReportType.valueOf(type));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Type de signalement invalide");
        }
    }

    /**
     * Récupérer les signalements par type et statut
     */
    @GetMapping("/filter")
    public List<ReportDTO> getReportsByTypeAndStatus(@RequestParam("type") String type,
                                                     @RequestParam("status") String status) {
        try {
            return reportService.getReportsByTypeAndStatus(
                    ReportType.valueOf(type),
                    ReportStatus.valueOf(status)
            );
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Type ou statut invalide");
        }
    }

    /**
     * Récupérer les signalements concernant un élément spécifique
     */
    @GetMapping("/target")
    public List<ReportDTO> getReportsByTargetId(@RequestParam("targetId") Long targetId) {
        return reportService.getReportsByTargetId(targetId);
    }

    /**
     * Mettre à jour le statut d'un signalement
     */
    @PatchMapping("/{id}/status")
    public ReportDTO updateReportStatus(@PathVariable Long id,
                                        @RequestParam("status") String status) {
        try {
            return reportService.updateReportStatus(id, ReportStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Statut invalide");
        }
    }
}