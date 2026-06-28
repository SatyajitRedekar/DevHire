package com.devhire.service;

import com.devhire.model.Job;
import com.devhire.model.User;
import com.devhire.repository.JobRepository;
import com.devhire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> getJobsByRecruiterId(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    public Job createJob(Job job, Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found"));
        job.setRecruiter(recruiter);
        return jobRepository.save(job);
    }

    public Job createExternalJob(Job job) {
        if (job.getExternalId() == null || job.getExternalId().trim().isEmpty()) {
            throw new IllegalArgumentException("External ID is required for aggregated jobs");
        }
        
        Optional<Job> existing = jobRepository.findByExternalId(job.getExternalId());
        if (existing.isPresent()) {
            return existing.get();
        }
        
        job.setIsExternal(true);
        return jobRepository.save(job);
    }

    public Optional<Job> findByExternalId(String externalId) {
        return jobRepository.findByExternalId(externalId);
    }
}
