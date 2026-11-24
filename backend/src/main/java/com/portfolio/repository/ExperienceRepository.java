package com.portfolio.repository;

import com.portfolio.entity.Experience;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    /** Most recent first; highlights are fetched in the same query. */
    @EntityGraph(attributePaths = "highlights")
    List<Experience> findAllByOrderByStartDateDesc();
}
