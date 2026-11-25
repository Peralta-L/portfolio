package com.portfolio.entity;

/** Skill groups, declared in the order they are shown. */
public enum SkillCategory {
    BACKEND("Backend"),
    FRONTEND("Frontend"),
    CLOUD("Cloud & DevOps");

    private final String label;

    SkillCategory(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
