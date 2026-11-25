-- Initial portfolio content. To change content later, add a new migration
-- (V3__..., V4__...) instead of editing this file: Flyway checksums applied scripts.
-- Keep it in sync with frontend/src/content/*.ts, which the site falls back to
-- when the API is unreachable.

INSERT INTO projects (slug, title, summary, description, github_url, live_url, featured, display_order) VALUES
('what-to-eat',
 'What to Eat',
 'AI meal planner: a mobile virtual fridge that tracks expiry dates and generates recipes from the ingredients you already have.',
 'Users log fridge items with quantities and expiry dates, and an expiration calendar shows what to use first. A FastAPI backend sends the available ingredients, allergies and cuisine preferences to a Groq-hosted LLM in JSON mode, then parses and stores the generated recipes. Includes JWT authentication with bcrypt-hashed passwords, a 10-table PostgreSQL schema accessed asynchronously through asyncpg, and saved, favourite and cooked-recipe history.',
 'https://github.com/Peralta-L/What_to_eat', NULL, TRUE, 1),
('stock-portfolio-assistant',
 'Stock Portfolio Assistant',
 'Team capstone: a full-stack app for tracking stock holdings, live quotes and portfolio gains and losses.',
 'Built with a four-person team for the CMSC 495 capstone. I designed the Prisma/PostgreSQL schema and built the authentication (NextAuth with bcrypt) and the user, holdings, transactions and portfolio services and controllers. Server-side API routes proxy the Finnhub market-data API for quotes, symbol search, batch quotes and price history, so the API key never reaches the browser.',
 'https://github.com/Group1-Capstone-Project/Stock-Portfolio-Assistant', NULL, TRUE, 2),
('asset-scanner',
 'Asset Scanner',
 'Browser-based IT inventory tool that reads barcodes and serial-number labels straight from a phone camera.',
 'Scans asset tags with the native BarcodeDetector API and reads printed serial numbers with Tesseract.js OCR, with camera zoom controls for small labels. Scanned assets go through an Express 5 REST API (create, review, update, delete) and are stored in SQLite, and a review page lists scanned assets for correction or removal.',
 'https://github.com/Peralta-L/Asset_Scanner', NULL, TRUE, 3),
('portfolio-platform',
 'Personal Portfolio Platform',
 'This website: a Next.js frontend on Vercel backed by a Spring Boot API and PostgreSQL on Render.',
 'Statically generated Next.js 15 frontend with incremental revalidation, reading content from a Spring Boot 3 API. The contact form posts to a validated, rate-limited endpoint that persists messages to PostgreSQL. If the API is cold or unavailable, the site falls back to bundled content so it never renders empty.',
 'https://github.com/Peralta-L/portfolio', NULL, TRUE, 4);

INSERT INTO project_technologies (project_id, position, technology)
SELECT p.id, t.position, t.technology
FROM projects p
JOIN (VALUES
    ('what-to-eat', 0, 'Python'), ('what-to-eat', 1, 'FastAPI'), ('what-to-eat', 2, 'PostgreSQL'),
    ('what-to-eat', 3, 'Groq LLM'), ('what-to-eat', 4, 'JWT'), ('what-to-eat', 5, 'React Native'),
    ('what-to-eat', 6, 'Expo'), ('what-to-eat', 7, 'TypeScript'),
    ('stock-portfolio-assistant', 0, 'Next.js'), ('stock-portfolio-assistant', 1, 'TypeScript'),
    ('stock-portfolio-assistant', 2, 'PostgreSQL'), ('stock-portfolio-assistant', 3, 'Prisma'),
    ('stock-portfolio-assistant', 4, 'NextAuth'), ('stock-portfolio-assistant', 5, 'Finnhub API'),
    ('stock-portfolio-assistant', 6, 'Tailwind CSS'),
    ('asset-scanner', 0, 'Node.js'), ('asset-scanner', 1, 'Express'), ('asset-scanner', 2, 'SQLite'),
    ('asset-scanner', 3, 'JavaScript'), ('asset-scanner', 4, 'Tesseract.js'), ('asset-scanner', 5, 'Web APIs'),
    ('portfolio-platform', 0, 'Java 21'), ('portfolio-platform', 1, 'Spring Boot'), ('portfolio-platform', 2, 'PostgreSQL'),
    ('portfolio-platform', 3, 'Next.js'), ('portfolio-platform', 4, 'TypeScript'), ('portfolio-platform', 5, 'Tailwind CSS')
) AS t (slug, position, technology) ON t.slug = p.slug;

INSERT INTO skills (name, category, display_order) VALUES
('Java', 'BACKEND', 1), ('Spring Boot', 'BACKEND', 2), ('Python', 'BACKEND', 3), ('FastAPI', 'BACKEND', 4),
('Node.js', 'BACKEND', 5), ('Express', 'BACKEND', 6), ('PostgreSQL', 'BACKEND', 7), ('Prisma', 'BACKEND', 8),
('REST APIs', 'BACKEND', 9), ('JWT', 'BACKEND', 10), ('LLM APIs', 'BACKEND', 11), ('Docker', 'BACKEND', 12),
('TypeScript', 'FRONTEND', 13), ('React', 'FRONTEND', 14), ('Next.js', 'FRONTEND', 15),
('React Native', 'FRONTEND', 16), ('Tailwind CSS', 'FRONTEND', 17),
('Azure', 'CLOUD', 18), ('Vercel', 'CLOUD', 19), ('Render', 'CLOUD', 20), ('Neon', 'CLOUD', 21),
('GitHub Actions', 'CLOUD', 22);

-- TODO(Luis): replace the dates below with your real ones before deploying.
INSERT INTO experiences (role, organization, location, start_date, end_date, summary) VALUES
('Backend Developer (Independent Projects)', 'Self-directed', 'Remote', '2023-01-01', NULL,
 'Designing and building full-stack applications end to end, with a focus on backend APIs, relational data modeling and AI integration.'),
('Service Member', 'U.S. Armed Forces', NULL, '2018-01-01', NULL,
 'Operating in high-responsibility environments where precision, accountability and clear communication are non-negotiable.');

INSERT INTO experience_highlights (experience_id, position, highlight)
SELECT e.id, h.position, h.highlight
FROM experiences e
JOIN (VALUES
    ('Self-directed', 0, 'Built REST APIs in FastAPI, Express and Spring Boot backed by PostgreSQL and SQLite, with layered controller/service designs.'),
    ('Self-directed', 1, 'Integrated a Groq-hosted LLM to generate recipes from structured JSON output, personalised by allergies and cuisine preferences.'),
    ('Self-directed', 2, 'Delivered a team capstone with three teammates, owning the database schema, authentication and portfolio services.'),
    ('U.S. Armed Forces', 0, 'Collaborated with international teams on time-critical operations.'),
    ('U.S. Armed Forces', 1, 'Handled sensitive information with strict accuracy and confidentiality.'),
    ('U.S. Armed Forces', 2, 'Developed discipline, adaptability and the ability to perform under pressure.')
) AS h (organization, position, highlight) ON h.organization = e.organization;
