package com.devhire.controller;

import com.devhire.dto.JobPostRequest;
import com.devhire.model.Job;
import com.devhire.service.JobService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found"));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<Job>> getJobsByRecruiter(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(jobService.getJobsByRecruiterId(recruiterId));
    }

    @PostMapping
    public ResponseEntity<?> postJob(@RequestBody JobPostRequest request, HttpServletRequest httpRequest) {
        // 1. Role verification from JWT claims
        String role = (String) httpRequest.getAttribute("role");
        Long tokenUserId = (Long) httpRequest.getAttribute("userId");

        if (!"RECRUITER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only recruiters are authorized to post jobs");
        }

        // 2. Validate inputs
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Job title is required");
        }
        if (request.getCompany() == null || request.getCompany().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Company name is required");
        }
        if (request.getLocation() == null || request.getLocation().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Job location is required");
        }
        if (request.getSkills() == null || request.getSkills().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("At least one key skill is required");
        }

        try {
            Job job = new Job();
            job.setTitle(request.getTitle().trim());
            job.setCompany(request.getCompany().trim());
            job.setLocation(request.getLocation().trim());
            job.setSalary(request.getSalary() != null ? request.getSalary().trim() : "Not Specified");
            job.setExperience(request.getExperience() != null ? request.getExperience().trim() : "Not Specified");
            job.setSkills(request.getSkills());
            job.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");

            Job savedJob = jobService.createJob(job, tokenUserId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create job: " + ex.getMessage());
        }
    }
}
