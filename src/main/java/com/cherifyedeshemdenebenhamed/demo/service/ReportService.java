package com.cherifyedeshemdenebenhamed.demo.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.cherifyedeshemdenebenhamed.demo.dto.ReportDTO;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ReportRepository;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @SuppressWarnings("null")
    public ReportDTO createReport(Report report) {
        Report savedReport = Objects.requireNonNull(reportRepository.save(report));
        return mapToDTO(savedReport);
    }

    public List<ReportDTO> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getReportsByUser(User user) {
        return reportRepository.findByReportedBy(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ReportDTO> getReportById(@NonNull Long id) {
        return reportRepository.findById(id).map(this::mapToDTO);
    }

    public List<ReportDTO> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getReportsByType(ReportType type) {
        return reportRepository.findByType(type)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getReportsByTypeAndStatus(ReportType type, ReportStatus status) {
        return reportRepository.findByTypeAndStatus(type, status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getReportsByTargetId(Long targetId) {
        return reportRepository.findByTargetId(targetId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ReportDTO updateReportStatus(@NonNull Long id, ReportStatus status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Signalement introuvable"));

        report.setStatus(status);
        Report updatedReport = Objects.requireNonNull(reportRepository.save(report));

        return mapToDTO(updatedReport);
    }

    public void deleteReportById(@NonNull Long id) {
        if (!reportRepository.existsById(id)) {
            throw new NotFoundException("Signalement introuvable");
        }
        reportRepository.deleteById(id);
    }

    private ReportDTO mapToDTO(Report report) {
        return new ReportDTO(
                report.getId(),
                report.getType(),
                report.getTargetId(),
                report.getReason(),
                report.getStatus(),
                report.getReportedBy() != null ? report.getReportedBy().getId() : null,
                report.getCreatedAt()
        );
    }
}