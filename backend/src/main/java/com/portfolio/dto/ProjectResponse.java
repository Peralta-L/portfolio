package com.portfolio.dto;

import com.portfolio.entity.Project;
import java.util.List;

public record ProjectResponse(
        Long id,
        String slug,
        String title,
        String summary,
        String description,
        String imageUrl,
        String githubUrl,
        String liveUrl,
        boolean featured,
        List<String> technologies) {

    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getSlug(),
                project.getTitle(),
                project.getSummary(),
                project.getDescription(),
                project.getImageUrl(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.isFeatured(),
                List.copyOf(project.getTechnologies()));
    }
}
