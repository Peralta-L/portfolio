package com.portfolio.repository;

import com.portfolio.entity.Project;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** Loads technologies in the same query to avoid N+1 selects. */
    @EntityGraph(attributePaths = "technologies")
    List<Project> findAllByOrderByDisplayOrderAsc();
}
