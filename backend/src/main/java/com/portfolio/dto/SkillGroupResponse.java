package com.portfolio.dto;

import com.portfolio.entity.SkillCategory;
import java.util.List;

/** Skills of one category, e.g. {@code {"category":"BACKEND","label":"Backend","skills":["Java"]}}. */
public record SkillGroupResponse(SkillCategory category, String label, List<String> skills) {
}
