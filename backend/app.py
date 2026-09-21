from flask import Flask, request, render_template
import os

app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")

@app.route('/')
def index():
    return render_template('index.html', title="Home", body_class="solid-header")

@app.route("/aboutme") 
def aboutme(): 
    return render_template("aboutme.html", title="About Me") 

@app.route("/skills") 
def skills(): 
    return render_template("skills.html", title="Skills & Certs", body_class="solid-header") 

@app.route("/projects") 
def projects(): 
    return render_template("projects.html", title="Projects") 

@app.route("/contact") 
def contact(): 
    return render_template("contact.html", title="Contact", body_class="solid-header")

@app.route("/cv") 
def cv():
    return render_template("cv.html", title="CV", body_class="solid-header")

@app.route('/submit_contact', methods=['POST'] )
def send_email():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']

        print(f"Name: {name}")
        print(f"Email: {email}")
        print(f"Message: {message}")

        return render_template('contact.html', title="Contact", body_class="solid-header", success=True)
    
    return "Invalid request method", 400
