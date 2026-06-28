package com.devhire.service;

import com.devhire.dto.ProfileRequest;
import com.devhire.model.RecruiterProfile;
import com.devhire.model.SeekerProfile;
import com.devhire.model.User;
import com.devhire.repository.RecruiterProfileRepository;
import com.devhire.repository.SeekerProfileRepository;
import com.devhire.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {

    @Mock
    private SeekerProfileRepository seekerProfileRepository;

    @Mock
    private RecruiterProfileRepository recruiterProfileRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    public void testGetSeekerProfile() {
        SeekerProfile profile = new SeekerProfile();
        when(seekerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));

        Optional<SeekerProfile> result = profileService.getSeekerProfile(1L);

        assertTrue(result.isPresent());
        assertEquals(profile, result.get());
    }

    @Test
    public void testGetRecruiterProfile() {
        RecruiterProfile profile = new RecruiterProfile();
        when(recruiterProfileRepository.findByUserId(2L)).thenReturn(Optional.of(profile));

        Optional<RecruiterProfile> result = profileService.getRecruiterProfile(2L);

        assertTrue(result.isPresent());
        assertEquals(profile, result.get());
    }

    @Test
    public void testUpdateOrCreateSeekerProfileNew() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(seekerProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(seekerProfileRepository.save(any(SeekerProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ProfileRequest req = new ProfileRequest();
        req.setHeadline("Full Stack Developer");
        req.setSkills("Java, Spring, React");
        req.setExperienceYears(3);
        req.setResumePath("/resumes/me.pdf");

        SeekerProfile saved = profileService.updateOrCreateSeekerProfile(1L, req);

        assertNotNull(saved);
        assertEquals(user, saved.getUser());
        assertEquals("Full Stack Developer", saved.getHeadline());
        assertEquals("Java, Spring, React", saved.getSkills());
        assertEquals(3, saved.getExperienceYears());
        assertEquals("/resumes/me.pdf", saved.getResumePath());
    }

    @Test
    public void testUpdateOrCreateRecruiterProfileExisting() {
        User user = new User();
        user.setId(2L);
        RecruiterProfile existing = new RecruiterProfile();
        existing.setUser(user);
        existing.setCompanyName("Old Company");

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(recruiterProfileRepository.findByUserId(2L)).thenReturn(Optional.of(existing));
        when(recruiterProfileRepository.save(any(RecruiterProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ProfileRequest req = new ProfileRequest();
        req.setCompanyName("New Company");
        req.setCompanyWebsite("https://new.com");
        req.setIndustry("Technology");

        RecruiterProfile saved = profileService.updateOrCreateRecruiterProfile(2L, req);

        assertNotNull(saved);
        assertEquals("New Company", saved.getCompanyName());
        assertEquals("https://new.com", saved.getCompanyWebsite());
        assertEquals("Technology", saved.getIndustry());
    }
}
