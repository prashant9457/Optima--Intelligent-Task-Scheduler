package com.optima.repository;

import com.optima.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Project.ProjectStatus status);

    @Query("SELECT p FROM Project p WHERE p.status = 'COMPLETED' AND p.completedAt >= :since")
    List<Project> findCompletedSince(java.time.LocalDateTime since);

    @Query("SELECT p FROM Project p WHERE p.status = 'COMPLETED' AND p.completedAt BETWEEN :start AND :end")
    List<Project> findCompletedBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
