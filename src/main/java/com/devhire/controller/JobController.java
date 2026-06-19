package com.devhire.controller;

import com.devhire.dto.JobPostRequest;
import com.devhire.model.Job;
import com.devhire.service.JobService;
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
    public ResponseEntity<?> postJob(@RequestBody JobPostRequest request) {
        try {
            Job job = new Job();
            job.setTitle(request.getTitle());
            job.setCompany(request.getCompany());
            job.setLocation(request.getLocation());
            job.setSalary(request.getSalary());
            job.setExperience(request.getExperience());
            job.setSkills(request.getSkills());
            job.setDescription(request.getDescription());

            Job savedJob = jobService.createJob(job, request.getRecruiterId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create job: " + ex.getMessage());
        }
    }
}
