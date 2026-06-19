package com.devhire.repository;

import com.devhire.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findBySeekerId(Long seekerId);
    List<Application> findByJobRecruiterId(Long recruiterId);
    Optional<Application> findBySeekerIdAndJobId(Long seekerId, Long jobId);
}
