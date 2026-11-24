# Portfolio Website — Flask + HTML/CSS/JavaScript

A personal portfolio website built with **Python, Flask, HTML, CSS, and JavaScript**.

The website showcases my background, technical skills, projects, CV, and contact information.

> **Note:** The application currently runs locally. Deployment is planned for a future version.

---

##  Features

- Responsive portfolio website
- Home / landing page
- About Me section
- Technical Skills section
- Projects showcase
- CV / Resume section
- Contact section
- Reusable HTML templates with Jinja2
- Flask routing and template rendering
- Custom CSS styling
- JavaScript-based UI interactions and animations

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- Flask
- Jinja2

---

## How to Run Locally

### Requirements

Make sure you have installed:

- Python 3.8+
- Flask
- Git

### 1. Clone the repository

    git clone YOUR_REPOSITORY_URL
    cd portfolio

### 2. Install Flask

    pip install flask

### 3. Start the Flask application

Navigate to the backend directory:

    cd backend

Then start the application:

    flask run

### 4. Open the website

After starting Flask, open the URL shown in the terminal.

Usually:

    http://127.0.0.1:5000

The portfolio website should now be available in your browser.

---

## 📁 Project Structure

    .
    ├── backend/
    │   └── app.py
    │
    ├── frontend/
    │   ├── static/
    │   │   ├── mainStyle.css
    │   │   ├── mainscript.js
    │   │   ├── script.js
    │   │   ├── icons/
    │   │   └── images/
    │   │
    │   └── templates/
    │       ├── base.html
    │       ├── header.html
    │       ├── index.html
    │       ├── aboutme.html
    │       ├── skills.html
    │       ├── projects.html
    │       ├── contact.html
    │       └── cv.html
    │
    └── README.md

---

## Backend

The Flask backend is located in:

    backend/app.py

It is responsible for:

- Initializing the Flask application
- Defining routes
- Rendering HTML templates
- Connecting the frontend templates with Flask
- Serving static assets

Flask provides the backend structure, routing, template rendering, and serving of static files.

---

## Frontend

The frontend uses **HTML, CSS, and JavaScript**.

The project uses reusable Jinja2 templates to reduce code duplication.

### Templates

- `base.html` — Base website layout
- `header.html` — Navigation and header
- `index.html` — Homepage
- `aboutme.html` — About section
- `skills.html` — Technical skills
- `projects.html` — Projects
- `contact.html` — Contact information
- `cv.html` — CV / Resume

### Static Files

The `static/` directory contains:

- CSS stylesheets
- JavaScript files
- Icons
- Images

---

## Purpose

This project was created to build and showcase a personal developer portfolio while practicing:

- Flask web development
- Python
- HTML/CSS
- JavaScript
- Jinja2 templating
- Responsive web design
- Project organization

---

## Future Improvements

Planned improvements include:

- Deploying the website online
- Improving accessibility
- Adding additional animations and interactions
- Improving mobile responsiveness
- Adding a functional contact form
- Further optimizing website performance

---

## Author

Luis Peralta

Computer Science Graduate | Aspiring Software Developer
