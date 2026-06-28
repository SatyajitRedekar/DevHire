package com.devhire.controller;

import com.devhire.dto.ProfileRequest;
import com.devhire.model.SeekerProfile;
import com.devhire.model.RecruiterProfile;
import com.devhire.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/seeker/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        if (tokenUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        Optional<SeekerProfile> profile = profileService.getSeekerProfile(userId);
        return ResponseEntity.ok(profile.orElse(new SeekerProfile()));
    }

    @PutMapping("/seeker/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody ProfileRequest request, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");

        if (tokenUserId == null || !userId.equals(tokenUserId) || !"SEEKER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only edit your own seeker profile");
        }

        try {
            SeekerProfile profile = profileService.updateOrCreateSeekerProfile(userId, request);
            return ResponseEntity.ok(profile);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile: " + ex.getMessage());
        }
    }

    @GetMapping("/recruiter/{userId}")
    public ResponseEntity<?> getRecruiterProfile(@PathVariable Long userId, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        if (tokenUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        Optional<RecruiterProfile> profile = profileService.getRecruiterProfile(userId);
        return ResponseEntity.ok(profile.orElse(new RecruiterProfile()));
    }

    @PutMapping("/recruiter/{userId}")
    public ResponseEntity<?> updateRecruiterProfile(@PathVariable Long userId, @RequestBody ProfileRequest request, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");

        if (tokenUserId == null || !userId.equals(tokenUserId) || !"RECRUITER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only edit your own recruiter profile");
        }

        try {
            RecruiterProfile profile = profileService.updateOrCreateRecruiterProfile(userId, request);
            return ResponseEntity.ok(profile);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile: " + ex.getMessage());
        }
    }
}
