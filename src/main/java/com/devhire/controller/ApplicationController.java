package com.devhire.controller;

import com.devhire.dto.ApplyRequest;
import com.devhire.model.Application;
import com.devhire.service.ApplicationService;
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
    public ResponseEntity<List<Application>> getSeekerApplications(@PathVariable Long seekerId) {
        return ResponseEntity.ok(applicationService.getApplicationsBySeekerId(seekerId));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<Application>> getRecruiterReceivedApplications(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(applicationService.getApplicationsByRecruiterId(recruiterId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkApplicationStatus(
            @RequestParam("seekerId") Long seekerId,
            @RequestParam("jobId") Long jobId) {
        Optional<Application> app = applicationService.findBySeekerIdAndJobId(seekerId, jobId);
        return ResponseEntity.ok(app.isPresent());
    }

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody ApplyRequest request) {
        try {
            Application application = applicationService.applyToJob(
                    request.getUserId(),
                    request.getJobId(),
                    request.getCoverNote()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to apply: " + ex.getMessage());
        }
    }
}
