package com.cherifyedeshemdenebenhamed.demo.service;

import com.cherifyedeshemdenebenhamed.demo.dto.ReportDTO;
import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;
import com.cherifyedeshemdenebenhamed.demo.exception.NotFoundException;
import com.cherifyedeshemdenebenhamed.demo.model.Report;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.ReportType;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.repository.ConversationRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.MessageRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.ReportRepository;
import com.cherifyedeshemdenebenhamed.demo.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;


    @SuppressWarnings("null")
    public ReportDTO createReport(Report report) {
        if (report.getTargetId() == null || report.getTargetId() <= 0) {
            throw new BadRequestException("targetId is required");
        }
        report.setId(null);
        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());
        report.setListing(null);
        report.setReportedUser(null);
        switch (report.getType()) {
            case LISTING -> report.setListing(listingRepository.findById(report.getTargetId()).orElseThrow(() -> new NotFoundException("Listing not found")));
            case USER -> report.setReportedUser(userRepository.findById(report.getTargetId()).orElseThrow(() -> new NotFoundException("User not found")));
            case MESSAGE -> {
                if (!messageRepository.existsById(report.getTargetId())) throw new NotFoundException("Message not found");
            }
            case CONVERSATION -> {
                if (!conversationRepository.existsById(report.getTargetId())) throw new NotFoundException("Conversation not found");
            }
        }
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
