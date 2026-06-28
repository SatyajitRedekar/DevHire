package com.devhire.repository;

import com.devhire.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterId(Long recruiterId);
    Optional<Job> findByExternalId(String externalId);
}
