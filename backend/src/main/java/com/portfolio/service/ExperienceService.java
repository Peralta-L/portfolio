package com.portfolio.service;

import com.portfolio.dto.ExperienceResponse;
import com.portfolio.repository.ExperienceRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    @Transactional(readOnly = true)
    public List<ExperienceResponse> findAll() {
        return experienceRepository.findAllByOrderByStartDateDesc().stream()
                .map(ExperienceResponse::from)
                .toList();
    }
}
