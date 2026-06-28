package com.devhire.repository;

import com.devhire.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT j FROM Job j WHERE j.recruiter.id = :recruiterId")
    List<Job> findByRecruiterId(@org.springframework.data.repository.query.Param("recruiterId") Long recruiterId);

    Optional<Job> findByExternalId(String externalId);
}
