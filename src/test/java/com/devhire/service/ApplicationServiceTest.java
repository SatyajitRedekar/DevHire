package com.devhire.service;

import com.devhire.dto.ApplicationResponse;
import com.devhire.model.*;
import com.devhire.repository.ApplicationRepository;
import com.devhire.repository.JobRepository;
import com.devhire.repository.SeekerProfileRepository;
import com.devhire.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SeekerProfileRepository seekerProfileRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationService applicationService;

    @Test
    public void testApplyToJobSuccess() {
        Long seekerId = 1L;
        Long jobId = 2L;

        when(applicationRepository.findBySeekerIdAndJobId(seekerId, jobId)).thenReturn(Optional.empty());

        User seeker = new User();
        seeker.setId(seekerId);
        when(userRepository.findById(seekerId)).thenReturn(Optional.of(seeker));

        Job job = new Job();
        job.setId(jobId);
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));

        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));

        Application applied = applicationService.applyToJob(seekerId, jobId, "Please hire me.");

        assertNotNull(applied);
        assertEquals(seeker, applied.getSeeker());
        assertEquals(job, applied.getJob());
        assertEquals("Please hire me.", applied.getCoverNote());
    }

    @Test
    public void testApplyToJobAlreadyApplied() {
        Long seekerId = 1L;
        Long jobId = 2L;
        when(applicationRepository.findBySeekerIdAndJobId(seekerId, jobId)).thenReturn(Optional.of(new Application()));

        assertThrows(IllegalArgumentException.class, () -> {
            applicationService.applyToJob(seekerId, jobId, "Cover note");
        });
    }

    @Test
    public void testUpdateApplicationStatusSuccess() {
        Long appId = 10L;
        Job job = new Job();
        job.setTitle("Senior Engineer");
        job.setCompany("Stripe");

        User seeker = new User();
        seeker.setId(1L);

        Application app = new Application();
        app.setId(appId);
        app.setJob(job);
        app.setSeeker(seeker);
        app.setStatus(ApplicationStatus.APPLIED);

        when(applicationRepository.findById(appId)).thenReturn(Optional.of(app));
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));

        ApplicationResponse res = applicationService.updateApplicationStatus(appId, "SHORTLISTED");

        assertNotNull(res);
        assertEquals("SHORTLISTED", res.getStatus());
        verify(notificationService, times(1)).createNotification(eq(seeker), anyString());
    }

    @Test
    public void testMatchScoreCalculation() {
        Job job = new Job();
        job.setId(100L);
        job.setSkillsRequired("Java, React, SQL, Spring");

        User seeker = new User();
        seeker.setId(10L);
        seeker.setFullName("Satyajit");
        seeker.setEmail("satya@test.com");

        Application app = new Application();
        app.setId(200L);
        app.setJob(job);
        app.setSeeker(seeker);
        app.setStatus(ApplicationStatus.APPLIED);

        SeekerProfile profile = new SeekerProfile();
        profile.setSkills("React, SQL, Docker");
        profile.setHeadline("Software Dev");
        profile.setExperienceYears(2);

        when(applicationRepository.findByJobRecruiterId(5L)).thenReturn(Collections.singletonList(app));
        when(seekerProfileRepository.findByUserId(10L)).thenReturn(Optional.of(profile));

        List<ApplicationResponse> responses = applicationService.getDetailedApplicationsByRecruiterId(5L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(50, responses.get(0).getMatchScore());
    }

    @Test
    public void testMatchScoreCalculationNoSkillsRequired() {
        Job job = new Job();
        job.setId(100L);
        job.setSkillsRequired("");

        User seeker = new User();
        seeker.setId(10L);

        Application app = new Application();
        app.setJob(job);
        app.setSeeker(seeker);
        app.setStatus(ApplicationStatus.APPLIED);

        SeekerProfile profile = new SeekerProfile();
        profile.setSkills("Java");

        when(applicationRepository.findByJobRecruiterId(5L)).thenReturn(Collections.singletonList(app));
        when(seekerProfileRepository.findByUserId(10L)).thenReturn(Optional.of(profile));

        List<ApplicationResponse> responses = applicationService.getDetailedApplicationsByRecruiterId(5L);

        assertEquals(100, responses.get(0).getMatchScore());
    }
}
