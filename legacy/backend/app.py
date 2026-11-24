import json
import logging
import os
import re
import smtplib
import time
from email.message import EmailMessage
from pathlib import Path

from flask import Flask, redirect, render_template, request, url_for

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = BASE_DIR.parent / "frontend" / "templates"
STATIC_DIR = BASE_DIR.parent / "frontend" / "static"

app = Flask(
    __name__,
    template_folder=str(TEMPLATE_DIR),
    static_folder=str(STATIC_DIR),
)
logging.basicConfig(level=logging.INFO)

# ---------------------------------------------------------------------------
# SITE SETTINGS - fill these in (or set the matching environment variables).
# Empty values are simply hidden on the site, so recruiters never hit a dead link.
# ---------------------------------------------------------------------------
SITE = {
    "name": "Luis",
    "role": "Full-Stack Developer",
    "contact": {
        "email": os.getenv("CONTACT_EMAIL", ""),        # e.g. "you@gmail.com"
        "phone": os.getenv("CONTACT_PHONE", ""),        # e.g. "+49 170 1234567"
        "linkedin": os.getenv("CONTACT_LINKEDIN", ""),  # full profile URL
        "github": os.getenv("CONTACT_GITHUB", ""),      # full profile URL
    },
}

# Drop your CV as frontend/static/Luis_CV.pdf and the "Download PDF" button appears.
CV_PDF = "Luis_CV.pdf"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@app.context_processor
def inject_site():
    return {"site": SITE}


@app.route("/")
def index():
    return render_template(
        "index.html",
        title="Home",
        body_class="solid-header",
        description="Luis - full-stack developer (Python, Flask, Java, SQL, JavaScript). "
                    "Portfolio, projects and CV.",
    )


@app.route("/aboutme")
def aboutme():
    return render_template(
        "aboutme.html",
        title="About Me",
        body_class="about-body",
        description="Computer Science student and U.S. Armed Forces service member "
                    "building full-stack web applications.",
    )


@app.route("/skills")
def skills():
    return render_template(
        "skills.html",
        title="Skills & Certs",
        body_class="solid-header",
        description="Programming languages, frameworks, education and certifications.",
    )


@app.route("/projects")
def projects():
    return render_template(
        "projects.html",
        title="Projects",
        body_class="projects-body",
        description="Selected full-stack projects with tech stack and key features.",
    )


@app.route("/cv")
def cv():
    has_pdf = (STATIC_DIR / CV_PDF).exists()
    return render_template(
        "cv.html",
        title="CV",
        body_class="solid-header",
        cv_pdf=CV_PDF if has_pdf else None,
        description="Curriculum vitae of Luis, full-stack developer.",
    )

def validate_contact(form):
    name = " ".join(form.get("name", "").split())  # also strips newlines
    email = form.get("email", "").strip()
    message = form.get("message", "").strip()
    errors = []
    if not 1 <= len(name) <= 100:
        errors.append("Please enter your name (max 100 characters).")
    if len(email) > 254 or not EMAIL_RE.match(email):
        errors.append("Please enter a valid email address.")
    if not 10 <= len(message) <= 5000:
        errors.append("Your message should be between 10 and 5000 characters.")
    return {"name": name, "email": email, "message": message}, errors


def deliver_message(name, email, message):
    """Send via SMTP when configured; otherwise store locally so nothing is lost."""
    host = os.getenv("SMTP_HOST")
    to_addr = os.getenv("CONTACT_TO") or SITE["contact"]["email"]

    if host and to_addr:
        msg = EmailMessage()
        msg["Subject"] = f"Portfolio contact from {name}"
        msg["From"] = os.getenv("SMTP_USER", to_addr)
        msg["To"] = to_addr
        msg["Reply-To"] = email
        msg.set_content(f"From: {name} <{email}>\n\n{message}")
        smtp_user = os.getenv("SMTP_USER")
        with smtplib.SMTP(host, int(os.getenv("SMTP_PORT", "587")), timeout=10) as smtp:
            smtp.starttls()
            if smtp_user:
                smtp.login(smtp_user, os.getenv("SMTP_PASSWORD", ""))
            smtp.send_message(msg)
        return

    app.logger.warning("SMTP not configured - saving message to messages.jsonl")
    entry = {"time": time.strftime("%Y-%m-%d %H:%M:%S"), "name": name,
             "email": email, "message": message}
    with open(BASE_DIR / "messages.jsonl", "a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")


# /submit_contact is kept so the old form action keeps working.
@app.route("/contact", methods=["GET", "POST"])
@app.route("/submit_contact", methods=["POST"])
def contact():
    page = dict(title="Contact", body_class="solid-header",
                description="Get in touch with Luis about software engineering opportunities.")

    if request.method == "GET":
        return render_template("contact.html", success=request.args.get("sent") == "1", **page)

    # Honeypot: real users never see or fill this field.
    if request.form.get("website"):
        return redirect(url_for("contact", sent=1))

    data, errors = validate_contact(request.form)
    if errors:
        return render_template("contact.html", errors=errors, form=data, **page), 400

    try:
        deliver_message(**data)
    except Exception:
        app.logger.exception("Could not deliver contact message")
        errors = ["Sorry, your message could not be sent. Please try again later "
                  "or reach out via the links below."]
        return render_template("contact.html", errors=errors, form=data, **page), 500

    return redirect(url_for("contact", sent=1))


@app.errorhandler(404)
def not_found(_error):
    return render_template("404.html", title="Page not found", body_class="solid-header"), 404


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG") == "1")
