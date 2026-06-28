package com.devhire.controller;

import com.devhire.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable Long userId, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        if (tokenUserId == null || !userId.equals(tokenUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only retrieve your own notifications");
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, HttpServletRequest httpRequest) {
        boolean success = notificationService.markAsRead(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notification not found");
    }
}
