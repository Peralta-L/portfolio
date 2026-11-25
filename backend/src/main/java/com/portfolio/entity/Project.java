package com.portfolio.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** A portfolio project. Content is managed through Flyway migrations. */
@Entity
@Table(name = "projects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 300)
    private String summary;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "live_url", length = 500)
    private String liveUrl;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @ElementCollection
    @CollectionTable(name = "project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "position")
    @Column(name = "technology", nullable = false, length = 60)
    private List<String> technologies = new ArrayList<>();
}
