package com.devhire.controller;

import com.devhire.dto.ApplyRequest;
import com.devhire.model.Application;
import com.devhire.service.ApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/seeker/{seekerId}")
    public ResponseEntity<?> getSeekerApplications(@PathVariable Long seekerId, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        if (!seekerId.equals(tokenUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only view your own application history");
        }
        return ResponseEntity.ok(applicationService.getApplicationsBySeekerId(seekerId));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<?> getRecruiterReceivedApplications(@PathVariable Long recruiterId, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");
        
        if (!"RECRUITER".equals(role) || !recruiterId.equals(tokenUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only view applications sent to your job postings");
        }
        return ResponseEntity.ok(applicationService.getApplicationsByRecruiterId(recruiterId));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkApplicationStatus(
            @RequestParam("seekerId") Long seekerId,
            @RequestParam("jobId") Long jobId,
            HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        if (!seekerId.equals(tokenUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        Optional<Application> app = applicationService.findBySeekerIdAndJobId(seekerId, jobId);
        return ResponseEntity.ok(app.isPresent());
    }

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody ApplyRequest request, HttpServletRequest httpRequest) {
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");

        if (!"SEEKER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only job seekers are authorized to apply to jobs");
        }

        if (request.getJobId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Job ID is required");
        }

        try {
            Application application = applicationService.applyToJob(
                    tokenUserId,
                    request.getJobId(),
                    request.getCoverNote() != null ? request.getCoverNote().trim() : ""
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to apply: " + ex.getMessage());
        }
    }
}
