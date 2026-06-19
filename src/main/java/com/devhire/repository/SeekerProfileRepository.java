package com.devhire.repository;

import com.devhire.model.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {
    Optional<SeekerProfile> findByUserId(Long userId);
}
