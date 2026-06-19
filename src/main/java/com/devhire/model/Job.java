package com.devhire.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recruiter_id", nullable = false)
    @JsonIgnore
    private User recruiter;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "skills_required", length = 500)
    @JsonIgnore
    private String skillsRequired;

    @Column(length = 100)
    private String experience;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    @JsonIgnore
    private JobType jobType = JobType.FULL_TIME;

    @Column(name = "salary_range", length = 50)
    @JsonIgnore
    private String salaryRange;

    @Column(name = "posted_date", insertable = false, updatable = false)
    @JsonProperty("posted_date")
    private LocalDateTime postedDate;

    @Enumerated(EnumType.STRING)
    @Column
    private JobStatus status = JobStatus.OPEN;

    public Job() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(User recruiter) {
        this.recruiter = recruiter;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(String skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    // JSON Mappings to match frontend expectations

    @JsonProperty("recruiter_id")
    public Long getRecruiterId() {
        return recruiter != null ? recruiter.getId() : null;
    }

    @JsonProperty("salary")
    public String getSalary() {
        return salaryRange;
    }

    @JsonProperty("salary")
    public void setSalary(String salary) {
        this.salaryRange = salary;
    }

    @JsonProperty("skills")
    public List<String> getSkills() {
        if (skillsRequired == null || skillsRequired.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(skillsRequired.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    @JsonProperty("skills")
    public void setSkills(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            this.skillsRequired = "";
        } else {
            this.skillsRequired = String.join(", ", skills);
        }
    }
}
