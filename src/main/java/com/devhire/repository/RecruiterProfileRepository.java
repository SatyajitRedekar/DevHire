package com.devhire.repository;

import com.devhire.model.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUserId(Long userId);
}
