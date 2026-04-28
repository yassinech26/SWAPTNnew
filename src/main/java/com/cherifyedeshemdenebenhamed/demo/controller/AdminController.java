package com.cherifyedeshemdenebenhamed.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cherifyedeshemdenebenhamed.demo.dto.ReportDTO;
import com.cherifyedeshemdenebenhamed.demo.dto.UserDTO;
import com.cherifyedeshemdenebenhamed.demo.model.Listing;
import com.cherifyedeshemdenebenhamed.demo.model.ReportStatus;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.service.ListingService;
import com.cherifyedeshemdenebenhamed.demo.service.ReportService;
import com.cherifyedeshemdenebenhamed.demo.service.UserService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final ReportService reportService;
    private final ListingService listingService;

    public AdminController(UserService userService, ReportService reportService, ListingService listingService) {
        this.userService = userService;
        this.reportService = reportService;
        this.listingService = listingService;
    }

    /**
     * Get all users (Admin only)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    /**
     * Get all reports (Admin only)
     */
    @GetMapping("/reports")
    public ResponseEntity<List<ReportDTO>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /**
     * Update report status (Admin only)
     */
    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<ReportDTO> updateReportStatus(@PathVariable @NonNull Long id,
                                                        @RequestParam("status") String status) {
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Report status is required");
        }

        ReportStatus nextStatus;
        try {
            nextStatus = ReportStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid report status");
        }

        return ResponseEntity.ok(reportService.updateReportStatus(id, nextStatus));
    }

    /**
     * Delete a report (Admin only)
     */
    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable @NonNull Long id) {
        reportService.deleteReportById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all listings with statuses (Admin only)
     */
    @GetMapping("/listings")
    public ResponseEntity<List<Listing>> getAllListingsForAdmin() {
        return ResponseEntity.ok(listingService.getAllListingsForAdmin());
    }

    /**
     * Deactivate a listing (Admin only)
     */
    @PatchMapping("/listings/{id}/deactivate")
    public ResponseEntity<Listing> deactivateListing(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(listingService.deactivateListingByAdmin(id));
    }

    /**
     * Update user role to ADMIN or USER (Admin only)
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable @NonNull Long id, @RequestBody UpdateRoleRequest request) {
        User user = userService.getUserById(id);
        User.Role nextRole = parseRole(request.getRole());

        user.setRole(nextRole);
        User saved = userService.saveUser(user);

        return ResponseEntity.ok(toUserDTO(saved));
    }

    /**
     * Delete user profile and related data (Admin only)
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @NonNull Long id) {
        userService.deleteUserByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Ban a user by ID (Admin only)
     */
    @PostMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable @NonNull Long id) {
        User user = userService.getUserById(id);
        user.setStatus(User.Status.BANNED);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Unban a user by ID (Admin only)
     */
    @PostMapping("/users/{id}/unban")
    public ResponseEntity<Void> unbanUser(@PathVariable @NonNull Long id) {
        User user = userService.getUserById(id);
        user.setStatus(User.Status.ACTIVE);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Promote a user to admin (Admin only)
     */
    @PostMapping("/users/{id}/promote")
    public ResponseEntity<Void> promoteToAdmin(@PathVariable @NonNull Long id) {
        User user = userService.getUserById(id);
        user.setRole(User.Role.ADMIN);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Demote an admin to user (Admin only)
     */
    @PostMapping("/users/{id}/demote")
    public ResponseEntity<Void> demoteFromAdmin(@PathVariable @NonNull Long id) {
        User user = userService.getUserById(id);
        user.setRole(User.Role.USER);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Get admin stats
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        long totalUsers = userService.getTotalUserCount();
        long bannedUsers = userService.getBannedUserCount();
        long adminCount = userService.getAdminCount();

        AdminStatsDTO stats = new AdminStatsDTO(totalUsers, bannedUsers, adminCount);
        return ResponseEntity.ok(stats);
    }

    // ─── INNER CLASS FOR ADMIN STATS ──────────────────────────────────────────
    public static class AdminStatsDTO {
        public long totalUsers;
        public long bannedUsers;
        public long adminCount;

        public AdminStatsDTO(long totalUsers, long bannedUsers, long adminCount) {
            this.totalUsers = totalUsers;
            this.bannedUsers = bannedUsers;
            this.adminCount = adminCount;
        }
    }

    public static class UpdateRoleRequest {
        private String role;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    private UserDTO toUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getCity(),
                user.getImageUrl(),
                user.getRating(),
                user.getRole().toString(),
                user.getStatus().toString()
        );
    }

    private User.Role parseRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(rawRole.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be ADMIN or USER");
        }

        if (role != User.Role.ADMIN && role != User.Role.USER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be ADMIN or USER");
        }

        return role;
    }
}
