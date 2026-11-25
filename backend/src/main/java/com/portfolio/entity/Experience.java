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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "experiences")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String role;

    @Column(nullable = false, length = 120)
    private String organization;

    @Column(length = 120)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /** {@code null} while the position is current. */
    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @ElementCollection
    @CollectionTable(name = "experience_highlights", joinColumns = @JoinColumn(name = "experience_id"))
    @OrderColumn(name = "position")
    @Column(name = "highlight", nullable = false, length = 500)
    private List<String> highlights = new ArrayList<>();
}
