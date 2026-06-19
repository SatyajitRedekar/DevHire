package com.devhire.service;

import com.devhire.model.Application;
import com.devhire.model.Job;
import com.devhire.model.User;
import com.devhire.repository.ApplicationRepository;
import com.devhire.repository.JobRepository;
import com.devhire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Application> getApplicationsBySeekerId(Long seekerId) {
        return applicationRepository.findBySeekerId(seekerId);
    }

    public List<Application> getApplicationsByRecruiterId(Long recruiterId) {
        return applicationRepository.findByJobRecruiterId(recruiterId);
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
}
