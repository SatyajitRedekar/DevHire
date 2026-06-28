package com.devhire.service;

import com.devhire.dto.ApplicationResponse;
import com.devhire.model.Application;
import com.devhire.model.ApplicationStatus;
import com.devhire.model.Job;
import com.devhire.model.SeekerProfile;
import com.devhire.model.User;
import com.devhire.repository.ApplicationRepository;
import com.devhire.repository.JobRepository;
import com.devhire.repository.SeekerProfileRepository;
import com.devhire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Application> getApplicationsBySeekerId(Long seekerId) {
        return applicationRepository.findBySeekerId(seekerId);
    }

    public List<Application> getApplicationsByRecruiterId(Long recruiterId) {
        return applicationRepository.findByJobRecruiterId(recruiterId);
    }

    public List<ApplicationResponse> getDetailedApplicationsByRecruiterId(Long recruiterId) {
        return getApplicationsByRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getDetailedApplicationsBySeekerId(Long seekerId) {
        return getApplicationsBySeekerId(seekerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<Application> findBySeekerIdAndJobId(Long seekerId, Long jobId) {
        return applicationRepository.findBySeekerIdAndJobId(seekerId, jobId);
    }

    public Application applyToJob(Long seekerId, Long jobId, String coverNote) {
        if (applicationRepository.findBySeekerIdAndJobId(seekerId, jobId).isPresent()) {
            throw new IllegalArgumentException("You have already applied to this job");
        }

        User seeker = userRepository.findById(seekerId)
                .orElseThrow(() -> new IllegalArgumentException("Seeker user not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        Application application = new Application();
        application.setSeeker(seeker);
        application.setJob(job);
        application.setCoverNote(coverNote);
        
        return applicationRepository.save(application);
    }

    public ApplicationResponse updateApplicationStatus(Long applicationId, String statusStr) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid status: " + statusStr);
        }

        app.setStatus(newStatus);
        Application savedApp = applicationRepository.save(app);

        // Create in-app notification for candidate
        String msg = String.format("Your application for the '%s' role at %s has been %s.", 
                app.getJob().getTitle(), app.getJob().getCompany(), newStatus.name());
        notificationService.createNotification(app.getSeeker(), msg);

        return mapToResponse(savedApp);
    }

    public Map<String, Object> getRecruiterAnalytics(Long recruiterId) {
        List<Job> jobs = jobRepository.findByRecruiterId(recruiterId);
        List<Application> apps = applicationRepository.findByJobRecruiterId(recruiterId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", jobs.size());
        stats.put("totalApplicants", apps.size());

        // Status breakdown
        Map<String, Long> statusBreakdown = apps.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus().name(),
                        Collectors.counting()
                ));
        
        // Ensure all statuses are initialized in the map
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusBreakdown.putIfAbsent(status.name(), 0L);
        }
        stats.put("statusBreakdown", statusBreakdown);

        // Top Jobs
        Map<Job, Long> jobAppCounts = apps.stream()
                .collect(Collectors.groupingBy(
                        Application::getJob,
                        Collectors.counting()
                ));

        List<Map<String, Object>> topJobsList = jobAppCounts.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(e -> {
                    Map<String, Object> jobMap = new HashMap<>();
                    jobMap.put("id", e.getKey().getId());
                    jobMap.put("title", e.getKey().getTitle());
                    jobMap.put("company", e.getKey().getCompany());
                    jobMap.put("location", e.getKey().getLocation());
                    jobMap.put("applicants_count", e.getValue());
                    return jobMap;
                })
                .collect(Collectors.toList());

        // Fill with other posted jobs if less than 5 top jobs
        if (topJobsList.size() < 5) {
            for (Job j : jobs) {
                if (topJobsList.size() >= 5) break;
                boolean alreadyIncluded = topJobsList.stream().anyMatch(m -> m.get("id").equals(j.getId()));
                if (!alreadyIncluded) {
                    Map<String, Object> jobMap = new HashMap<>();
                    jobMap.put("id", j.getId());
                    jobMap.put("title", j.getTitle());
                    jobMap.put("company", j.getCompany());
                    jobMap.put("location", j.getLocation());
                    jobMap.put("applicants_count", 0L);
                    topJobsList.add(jobMap);
                }
            }
        }

        stats.put("topJobs", topJobsList);
        return stats;
    }

    public ApplicationResponse mapToResponse(Application app) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(app.getId());
        resp.setJobId(app.getJob().getId());
        resp.setJobTitle(app.getJob().getTitle());
        resp.setSeekerId(app.getSeeker().getId());
        resp.setSeekerName(app.getSeeker().getFullName());
        resp.setSeekerEmail(app.getSeeker().getEmail());
        resp.setCoverNote(app.getCoverNote());
        resp.setStatus(app.getStatus().name());
        resp.setAppliedDate(app.getAppliedDate());

        // Seeker profile details
        Optional<SeekerProfile> profileOpt = seekerProfileRepository.findByUserId(app.getSeeker().getId());
        if (profileOpt.isPresent()) {
            SeekerProfile profile = profileOpt.get();
            resp.setHeadline(profile.getHeadline());
            resp.setSkills(profile.getSkills());
            resp.setExperienceYears(profile.getExperienceYears());

            populateSkillsAnalysis(resp, app.getJob().getSkillsRequired(), profile.getSkills());
        } else {
            resp.setMatchScore(0);
            resp.setMatchedSkills("");
            resp.setMissingSkills(app.getJob().getSkillsRequired() != null ? app.getJob().getSkillsRequired() : "");
        }

        return resp;
    }

    private void populateSkillsAnalysis(ApplicationResponse resp, String jobSkillsRequired, String seekerSkills) {
        if (jobSkillsRequired == null || jobSkillsRequired.trim().isEmpty()) {
            resp.setMatchScore(100);
            resp.setMatchedSkills("None required");
            resp.setMissingSkills("");
            return;
        }
        if (seekerSkills == null || seekerSkills.trim().isEmpty()) {
            resp.setMatchScore(0);
            resp.setMatchedSkills("");
            resp.setMissingSkills(jobSkillsRequired);
            return;
        }

        List<String> requiredList = Arrays.stream(jobSkillsRequired.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        List<String> seekerList = Arrays.stream(seekerSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : requiredList) {
            if (seekerList.contains(req.toLowerCase())) {
                matched.add(req);
            } else {
                missing.add(req);
            }
        }

        resp.setMatchedSkills(String.join(", ", matched));
        resp.setMissingSkills(String.join(", ", missing));

        if (requiredList.isEmpty()) {
            resp.setMatchScore(100);
        } else {
            int score = (int) Math.round((double) matched.size() / requiredList.size() * 100);
            resp.setMatchScore(score);
        }
    }

    private int calculateMatchScore(String jobSkillsRequired, String seekerSkills) {
        if (jobSkillsRequired == null || jobSkillsRequired.trim().isEmpty()) {
            return 100;
        }
        if (seekerSkills == null || seekerSkills.trim().isEmpty()) {
            return 0;
        }

        List<String> requiredList = Arrays.stream(jobSkillsRequired.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        List<String> seekerList = Arrays.stream(seekerSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (requiredList.isEmpty()) {
            return 100;
        }

        long matches = requiredList.stream()
                .filter(seekerList::contains)
                .count();

        return (int) Math.round((double) matches / requiredList.size() * 100);
    }
}
