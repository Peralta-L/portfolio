package com.portfolio.dto;

import com.portfolio.entity.Experience;
import java.time.LocalDate;
import java.util.List;

public record ExperienceResponse(
        Long id,
        String role,
        String organization,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        boolean current,
        String summary,
        List<String> highlights) {

    public static ExperienceResponse from(Experience experience) {
        return new ExperienceResponse(
                experience.getId(),
                experience.getRole(),
                experience.getOrganization(),
                experience.getLocation(),
                experience.getStartDate(),
                experience.getEndDate(),
                experience.getEndDate() == null,
                experience.getSummary(),
                List.copyOf(experience.getHighlights()));
    }
}
