# Portfolio Template

#### Description:

# Portfolio Website (Flask + Static Frontend)

This project is a **portfolio template website** built with a static frontend and a lightweight Flask backend.  
Flask is used only to serve HTML templates and static files such as CSS, JavaScript, images, and icons.

The frontend is written using **HTML, CSS, and JavaScript**, while the backend is written in **Python using Flask**.  
The project is intentionally simple and easy to customize.

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask

---

### File and Folder Explanation
## Backend

- backend/app.py

This is the main Flask application file. It:
Initializes the Flask app, 
Defines routes for each page (home, about, skills, projects, contact, CV)
Renders HTML templates using render_template
Serves static files automatically through Flask
The backend does not contain complex logic or data handling, which keeps it easy to read and maintain.

### Frontend – Templates

- templates/base.html

This is the base layout file. It contains:
The HTML <head> section
Links to CSS and JavaScript files
A block structure that other templates extend
Using a base template avoids code duplication and makes global layout changes easy.
templates/header.html
This file contains the navigation bar and header elements. It is included in other templates so the navigation stays consistent across all pages.

- templates/index.html

The landing page of the portfolio. It introduces the user and serves as the main entry point of the website.
templates/aboutme.html
Contains information about the portfolio owner, such as background, interests, and goals.
templates/skills.html
Lists technical skills, tools, and technologies. This section is structured for clarity and easy expansion.

- templates/projects.html

Displays showcased projects. Each project section can include a title, description, and related visuals.
templates/contact.html
Provides contact information or a contact section where users can find ways to reach the portfolio owner.

- templates/cv.html

Displays or links to a résumé or CV, allowing visitors to quickly view professional qualifications.

### Frontend – Static Files

- static/mainStyle.css

The main stylesheet responsible for:
Page layout
Typography
Color scheme
Responsive design
static/mainscript.js and static/script.js
These JavaScript files handle:
Interactive UI behavior
Animations or dynamic elements
Client-side enhancements

- static/icons/

Contains icon assets used throughout the website.

- static/images/

Stores images displayed in the portfolio, such as profile pictures or project screenshots.

------

NOTE: Before running the project, make sure you have the following installed:

- **Python 3.8 or higher**
- **Flask**

------

### how to Run the Project
## Requirements

Make sure Flask is installed:

pip install flask


Navigate to the backend folder:

cd backend

Run the Flask application:

flask run


Open your browser and go to the URL shown in the terminal
(usually: http://127.0.0.1:5000)

and you will see a website open where you could see the project


### Project Structure: 

.
├── backend/
│   └── app.py
├── frontend/
│   ├── static/
│   │   ├── mainStyle.css
│   │   ├── mainscript.js
│   │   ├── script.js
│   │   ├── icons/
│   │   └── images/
│   └── templates/
│       ├── base.html
│       ├── header.html
│       ├── index.html
│       ├── aboutme.html
│       ├── skills.html
│       ├── projects.html
│       ├── contact.html
│       └── cv.html
└── README.md
