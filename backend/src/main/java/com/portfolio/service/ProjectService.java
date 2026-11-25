package com.portfolio.service;

import com.portfolio.dto.ProjectResponse;
import com.portfolio.repository.ProjectRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponse> findAll() {
        return projectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(ProjectResponse::from)
                .toList();
    }
}
