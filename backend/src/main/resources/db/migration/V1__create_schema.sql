-- Portfolio API schema (PostgreSQL)

CREATE TABLE projects (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug          VARCHAR(80)  NOT NULL UNIQUE,
    title         VARCHAR(120) NOT NULL,
    summary       VARCHAR(300) NOT NULL,
    description   TEXT         NOT NULL,
    image_url     VARCHAR(500),
    github_url    VARCHAR(500),
    live_url      VARCHAR(500),
    featured      BOOLEAN      NOT NULL DEFAULT FALSE,
    display_order INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE project_technologies (
    project_id BIGINT      NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    position   INTEGER     NOT NULL,
    technology VARCHAR(60) NOT NULL,
    PRIMARY KEY (project_id, position)
);

CREATE TABLE skills (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name          VARCHAR(60) NOT NULL,
    category      VARCHAR(20) NOT NULL CHECK (category IN ('BACKEND', 'FRONTEND', 'CLOUD')),
    display_order INTEGER     NOT NULL DEFAULT 0,
    UNIQUE (category, name)
);

CREATE TABLE experiences (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role         VARCHAR(120) NOT NULL,
    organization VARCHAR(120) NOT NULL,
    location     VARCHAR(120),
    start_date   DATE         NOT NULL,
    end_date     DATE,
    summary      TEXT         NOT NULL,
    CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE experience_highlights (
    experience_id BIGINT       NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
    position      INTEGER      NOT NULL,
    highlight     VARCHAR(500) NOT NULL,
    PRIMARY KEY (experience_id, position)
);

CREATE TABLE contact_messages (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(254) NOT NULL,
    subject    VARCHAR(150) NOT NULL,
    message    TEXT         NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at DESC);
