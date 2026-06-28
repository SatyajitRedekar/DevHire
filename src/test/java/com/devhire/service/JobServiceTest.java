package com.devhire.service;

import com.devhire.model.Job;
import com.devhire.model.User;
import com.devhire.repository.JobRepository;
import com.devhire.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    public void testGetAllJobs() {
        Job job1 = new Job();
        Job job2 = new Job();
        when(jobRepository.findAll()).thenReturn(Arrays.asList(job1, job2));

        List<Job> jobs = jobService.getAllJobs();

        assertEquals(2, jobs.size());
        verify(jobRepository, times(1)).findAll();
    }

    @Test
    public void testGetJobById() {
        Job job = new Job();
        job.setId(10L);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        Optional<Job> found = jobService.getJobById(10L);

        assertTrue(found.isPresent());
        assertEquals(10L, found.get().getId());
    }

    @Test
    public void testCreateJobSuccess() {
        User recruiter = new User();
        recruiter.setId(5L);
        when(userRepository.findById(5L)).thenReturn(Optional.of(recruiter));

        Job inputJob = new Job();
        inputJob.setTitle("Software Engineer");
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Job created = jobService.createJob(inputJob, 5L);

        assertNotNull(created);
        assertEquals(recruiter, created.getRecruiter());
        assertEquals("Software Engineer", created.getTitle());
    }

    @Test
    public void testCreateJobRecruiterNotFound() {
        when(userRepository.findById(5L)).thenReturn(Optional.empty());

        Job inputJob = new Job();
        assertThrows(IllegalArgumentException.class, () -> {
            jobService.createJob(inputJob, 5L);
        });
    }

    @Test
    public void testCreateExternalJobNew() {
        Job inputJob = new Job();
        inputJob.setExternalId("ext-100");
        when(jobRepository.findByExternalId("ext-100")).thenReturn(Optional.empty());
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Job created = jobService.createExternalJob(inputJob);

        assertNotNull(created);
        assertTrue(created.getIsExternal());
        verify(jobRepository, times(1)).save(inputJob);
    }

    @Test
    public void testCreateExternalJobDuplicate() {
        Job existingJob = new Job();
        existingJob.setExternalId("ext-100");
        existingJob.setId(50L);

        Job inputJob = new Job();
        inputJob.setExternalId("ext-100");

        when(jobRepository.findByExternalId("ext-100")).thenReturn(Optional.of(existingJob));

        Job result = jobService.createExternalJob(inputJob);

        assertNotNull(result);
        assertEquals(50L, result.getId());
        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    public void testCreateExternalJobMissingId() {
        Job inputJob = new Job();
        inputJob.setExternalId("");

        assertThrows(IllegalArgumentException.class, () -> {
            jobService.createExternalJob(inputJob);
        });
    }
}
