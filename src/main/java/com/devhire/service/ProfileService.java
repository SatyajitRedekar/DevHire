package com.devhire.service;

import com.devhire.dto.ProfileRequest;
import com.devhire.model.SeekerProfile;
import com.devhire.model.RecruiterProfile;
import com.devhire.model.User;
import com.devhire.repository.SeekerProfileRepository;
import com.devhire.repository.RecruiterProfileRepository;
import com.devhire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<SeekerProfile> getSeekerProfile(Long userId) {
        return seekerProfileRepository.findByUserId(userId);
    }

    public Optional<RecruiterProfile> getRecruiterProfile(Long userId) {
        return recruiterProfileRepository.findByUserId(userId);
    }

    public SeekerProfile updateOrCreateSeekerProfile(Long userId, ProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SeekerProfile profile = seekerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    SeekerProfile newProfile = new SeekerProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setHeadline(request.getHeadline() != null ? request.getHeadline().trim() : "");
        profile.setSkills(request.getSkills() != null ? request.getSkills().trim() : "");
        profile.setExperienceYears(request.getExperienceYears());
        if (request.getResumePath() != null) {
            profile.setResumePath(request.getResumePath().trim());
        }

        return seekerProfileRepository.save(profile);
    }

    public RecruiterProfile updateOrCreateRecruiterProfile(Long userId, ProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    RecruiterProfile newProfile = new RecruiterProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : "");
        profile.setCompanyWebsite(request.getCompanyWebsite() != null ? request.getCompanyWebsite().trim() : "");
        profile.setIndustry(request.getIndustry() != null ? request.getIndustry().trim() : "");

        return recruiterProfileRepository.save(profile);
    }
}
