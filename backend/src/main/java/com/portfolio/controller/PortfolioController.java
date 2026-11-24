package com.portfolio.controller;

import com.portfolio.dto.ExperienceResponse;
import com.portfolio.dto.ProjectResponse;
import com.portfolio.dto.SkillGroupResponse;
import com.portfolio.service.ExperienceService;
import com.portfolio.service.ProjectService;
import com.portfolio.service.SkillService;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Read-only portfolio content. Responses are cacheable because content changes only on deploy. */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PortfolioController {

    private static final CacheControl CACHE = CacheControl.maxAge(Duration.ofMinutes(10)).cachePublic();

    private final ProjectService projectService;
    private final SkillService skillService;
    private final ExperienceService experienceService;

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectResponse>> projects() {
        return ResponseEntity.ok().cacheControl(CACHE).body(projectService.findAll());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillGroupResponse>> skills() {
        return ResponseEntity.ok().cacheControl(CACHE).body(skillService.findAllGrouped());
    }

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceResponse>> experience() {
        return ResponseEntity.ok().cacheControl(CACHE).body(experienceService.findAll());
    }
}
