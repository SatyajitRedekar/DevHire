package com.devhire.repository;

import com.devhire.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findBySeekerId(Long seekerId);
    List<Application> findByJobRecruiterId(Long recruiterId);
    
    @Query("SELECT a FROM Application a WHERE a.seeker.id = :seekerId AND a.job.id = :jobId")
    Optional<Application> findBySeekerIdAndJobId(@Param("seekerId") Long seekerId, @Param("jobId") Long jobId);
}
