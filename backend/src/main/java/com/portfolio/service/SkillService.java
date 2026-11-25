package com.portfolio.service;

import com.portfolio.dto.SkillGroupResponse;
import com.portfolio.entity.Skill;
import com.portfolio.entity.SkillCategory;
import com.portfolio.repository.SkillRepository;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    /** Skills grouped by category, categories in enum order, empty categories omitted. */
    @Transactional(readOnly = true)
    public List<SkillGroupResponse> findAllGrouped() {
        Map<SkillCategory, List<String>> byCategory = skillRepository.findAllByOrderByDisplayOrderAsc().stream()
                .collect(Collectors.groupingBy(
                        Skill::getCategory,
                        () -> new EnumMap<>(SkillCategory.class),
                        Collectors.mapping(Skill::getName, Collectors.toList())));

        return byCategory.entrySet().stream()
                .map(e -> new SkillGroupResponse(e.getKey(), e.getKey().label(), List.copyOf(e.getValue())))
                .toList();
    }
}
