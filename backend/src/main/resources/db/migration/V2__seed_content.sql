-- Initial portfolio content. To change content later, add a new migration
-- (V3__..., V4__...) instead of editing this file: Flyway checksums applied scripts.
-- Keep it in sync with frontend/src/content/*.ts, which the site falls back to
-- when the API is unreachable.

INSERT INTO projects (slug, title, summary, description, github_url, live_url, featured, display_order) VALUES
('ai-food-tracker',
 'AI Food Tracker',
 'Virtual fridge that tracks ingredients and expiry dates, then uses an LLM to suggest meals from what you already have.',
 'Users keep a live inventory of their fridge and pantry. A scheduled job flags items close to expiry, and an AI service turns the remaining ingredients into ranked meal suggestions with estimated nutrition. LLM calls sit behind a provider-agnostic interface with timeouts, retries and response validation, so a slow or malformed model response never breaks the core inventory features.',
 'https://github.com/Peralta-L', NULL, TRUE, 1),
('recipe-intelligence',
 'Recipe Intelligence Platform',
 'Recipe search engine that normalizes ingredients and ranks results with semantic vector search.',
 'An ingestion pipeline parses recipes from multiple formats, normalizes ingredient names and units, and stores embeddings in PostgreSQL with pgvector. The search API combines full-text and vector similarity and supports filtering by diet, cooking time and available ingredients. Hot queries are cached in Redis.',
 'https://github.com/Peralta-L', NULL, TRUE, 2),
('enterprise-java-api',
 'Enterprise Java API',
 'Production-style Spring Boot REST API with JWT authentication, role-based access and a full CI/CD pipeline.',
 'A layered Spring Boot service demonstrating enterprise patterns: JWT authentication with refresh tokens, role-based authorization, DTO mapping, global RFC 9457 error handling, Flyway migrations, OpenAPI documentation, and integration tests against a real PostgreSQL database. GitHub Actions builds, tests and publishes a Docker image on every merge.',
 'https://github.com/Peralta-L', NULL, TRUE, 3),
('portfolio-platform',
 'Personal Portfolio Platform',
 'This website: a Next.js frontend on Vercel backed by a Spring Boot API and PostgreSQL on Render.',
 'Statically generated Next.js 15 frontend with incremental revalidation, reading content from a Spring Boot 3 API. The contact form posts to a validated, rate-limited endpoint that persists messages to PostgreSQL. If the API is cold or unavailable, the site falls back to bundled content so it never renders empty.',
 'https://github.com/Peralta-L/portfolio', NULL, TRUE, 4);

INSERT INTO project_technologies (project_id, position, technology)
SELECT p.id, t.position, t.technology
FROM projects p
JOIN (VALUES
    ('ai-food-tracker', 0, 'Java 21'), ('ai-food-tracker', 1, 'Spring Boot'), ('ai-food-tracker', 2, 'PostgreSQL'),
    ('ai-food-tracker', 3, 'LLM API'), ('ai-food-tracker', 4, 'React Native'), ('ai-food-tracker', 5, 'Docker'),
    ('recipe-intelligence', 0, 'Java 21'), ('recipe-intelligence', 1, 'Spring Boot'), ('recipe-intelligence', 2, 'PostgreSQL'),
    ('recipe-intelligence', 3, 'pgvector'), ('recipe-intelligence', 4, 'Redis'), ('recipe-intelligence', 5, 'Next.js'),
    ('enterprise-java-api', 0, 'Java 21'), ('enterprise-java-api', 1, 'Spring Security'), ('enterprise-java-api', 2, 'JWT'),
    ('enterprise-java-api', 3, 'PostgreSQL'), ('enterprise-java-api', 4, 'Docker'), ('enterprise-java-api', 5, 'GitHub Actions'),
    ('portfolio-platform', 0, 'Next.js'), ('portfolio-platform', 1, 'TypeScript'), ('portfolio-platform', 2, 'Tailwind CSS'),
    ('portfolio-platform', 3, 'Spring Boot'), ('portfolio-platform', 4, 'PostgreSQL'), ('portfolio-platform', 5, 'Vercel')
) AS t (slug, position, technology) ON t.slug = p.slug;

INSERT INTO skills (name, category, display_order) VALUES
('Java', 'BACKEND', 1), ('Spring Boot', 'BACKEND', 2), ('PostgreSQL', 'BACKEND', 3),
('REST APIs', 'BACKEND', 4), ('JWT', 'BACKEND', 5), ('Docker', 'BACKEND', 6),
('TypeScript', 'FRONTEND', 7), ('Next.js', 'FRONTEND', 8), ('Tailwind CSS', 'FRONTEND', 9),
('Azure', 'CLOUD', 10), ('Vercel', 'CLOUD', 11), ('Render', 'CLOUD', 12), ('GitHub Actions', 'CLOUD', 13);

-- TODO(Luis): replace the dates below with your real ones before deploying.
INSERT INTO experiences (role, organization, location, start_date, end_date, summary) VALUES
('Backend Developer (Independent Projects)', 'Self-directed', 'Remote', '2023-01-01', NULL,
 'Designing and building full-stack applications end to end, with a focus on Java and Spring Boot APIs, relational data modeling and cloud deployment.'),
('Service Member', 'U.S. Armed Forces', NULL, '2018-01-01', NULL,
 'Operating in high-responsibility environments where precision, accountability and clear communication are non-negotiable.');

INSERT INTO experience_highlights (experience_id, position, highlight)
SELECT e.id, h.position, h.highlight
FROM experiences e
JOIN (VALUES
    ('Self-directed', 0, 'Built REST APIs with Spring Boot, Spring Security and PostgreSQL using layered, testable architecture.'),
    ('Self-directed', 1, 'Integrated LLM APIs into applications behind resilient, provider-agnostic service interfaces.'),
    ('Self-directed', 2, 'Containerized services with Docker and automated builds and deployments with GitHub Actions.'),
    ('U.S. Armed Forces', 0, 'Collaborated with international teams on time-critical operations.'),
    ('U.S. Armed Forces', 1, 'Handled sensitive information with strict accuracy and confidentiality.'),
    ('U.S. Armed Forces', 2, 'Developed discipline, adaptability and the ability to perform under pressure.')
) AS h (organization, position, highlight) ON h.organization = e.organization;
