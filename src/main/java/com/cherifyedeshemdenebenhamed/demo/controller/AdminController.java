package com.cherifyedeshemdenebenhamed.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cherifyedeshemdenebenhamed.demo.dto.UserDTO;
import com.cherifyedeshemdenebenhamed.demo.model.User;
import com.cherifyedeshemdenebenhamed.demo.service.UserService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get all users (Admin only)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.getCity(),
                        u.getImageUrl(),
                        u.getRating(),
                        u.getRole().toString(),
                        u.getStatus().toString()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    /**
     * Ban a user by ID (Admin only)
     */
    @PostMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(User.Status.BANNED);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Unban a user by ID (Admin only)
     */
    @PostMapping("/users/{id}/unban")
    public ResponseEntity<Void> unbanUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(User.Status.ACTIVE);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Promote a user to admin (Admin only)
     */
    @PostMapping("/users/{id}/promote")
    public ResponseEntity<Void> promoteToAdmin(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setRole(User.Role.ADMIN);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Demote an admin to user (Admin only)
     */
    @PostMapping("/users/{id}/demote")
    public ResponseEntity<Void> demoteFromAdmin(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
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
}
