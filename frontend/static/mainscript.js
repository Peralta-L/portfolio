console.log("JS loaded");

document.querySelectorAll(".skills-list li").forEach(li => {
  const percent = li.getAttribute("data-percent");
  li.style.setProperty("--percent", percent + "%");
});

const emailicon = document.getElementById('email-icon');
if (emailicon) {
  emailicon.addEventListener('mouseenter', () => {
    emailicon.src = "../static/icons/gmail_color.png";
  });

  emailicon.addEventListener('mouseleave', () => {
    emailicon.src = "../static/icons/gmail_black.png";
  });
}

const phoneicon = document.getElementById('phone-icon');
if (phoneicon) {
  phoneicon.addEventListener('mouseenter', () => {
    phoneicon.src = "../static/icons/phone_color.png";
  });

  phoneicon.addEventListener('mouseleave', () => {
    phoneicon.src = "../static/icons/phone_black.png";
  });
}

const linkedinicon = document.getElementById('linkedin-icon');
if (linkedinicon) {
  linkedinicon.addEventListener('mouseenter', () => {
    linkedinicon.src = "../static/icons/linkedin_color.png";
  });

  linkedinicon.addEventListener('mouseleave', () => {
    linkedinicon.src = "../static/icons/linkedin_black.png";
  });
}

const images = [
  document.getElementById("img1"),
  document.getElementById("img2"),
  document.getElementById("img3")
];


const Projects = [
  {
  number: '01',
  project_title: 'Food management app',
  images: [
    "../static/images/project1_img1.png",
    "../static/images/project1_img2.png",
    "../static/images/project1_img3.png"
  ],
  description: `
  <br>The project allows users to create a virtual fridge where they can add items and track their quantities. 
  All data is safely stored in the database. In another tab, the project suggests meals that can be 
  prepared with the available ingredients. A calendar tab highlights upcoming expiration dates, helping 
  users plan ahead and reduce food waste.
  
  <h3>Key features</h3>
    <ul>
      <li><strong>Secure data storage:</strong> Structured database ensures reliable, persistent data.</li>
      <li><strong>Meal suggestions:</strong> Analyze available ingredients to recommend recipes.</li>
      <li><strong>Expiration tracking:</strong> Calendar view highlights upcoming expiration dates.</li>
      <li><strong>Interactive dashboard:</strong> Real-time updates with add/edit/remove item controls.</li>
      <li><strong>Smart notifications:</strong> Alerts for nearing expiration.</li>
      <li><strong>Cross-platform accessibility:</strong> Responsive experience across desktop and mobile.</li>
    </ul>

    <h3>Technologies used</h3>
    <ul>
      <li><strong>Python:</strong> Backend logic and data processing</li>
      <li><strong>Flask:</strong> APIs and server-side functionality</li>
      <li><strong>React Native:</strong> Cross-platform mobile interface</li>
      <li><strong>JSON:</strong> Structured data exchange</li>
      <li><strong>MySQL:</strong> Secure and efficient database management</li>
    </ul>
  `
},
{
  number: '02',
  project_title: 'title',
  images: [
    "../static/images/project1_img1.png",
    "../static/images/project1_img2.png",
    "../static/images/project1_img3.png"
  ],
  description: `testing`
},
  {
  number: '03',
  project_title: 'title',
  images: [
    "../static/images/project1_img1.png",
    "../static/images/project1_img2.png",
    "../static/images/project1_img3.png"
  ],
  description: ``
},
  {
  number: '04',
  project_title: 'title',
  images: [
    "../static/images/project1_img1.png",
    "../static/images/project1_img2.png",
    "../static/images/project1_img3.png"
  ],
  description: ``
},
  {
  number: '05',
  project_title: 'title',
  images: [
    "../static/images/project1_img1.png",
    "../static/images/project1_img2.png",
    "../static/images/project1_img3.png"
  ],
  description: ``
},
]

let index = 0;
let container;

window.onload = () => {
  container = document.querySelector(".projects_left");
  loadProject();
};

let imgOrder = [0, 1, 2];

function rotateImages() {
  images.forEach(img => img.classList.remove("center", "right", "left"));

  images[imgOrder[0]].classList.add("center");
  images[imgOrder[1]].classList.add("right");
  images[imgOrder[2]].classList.add("left");

  imgOrder.unshift(imgOrder.pop());
}

setInterval(rotateImages, 10000);

function loadProject() {
  const project = Projects[index];

  document.getElementById("project_title").textContent = project.project_title;
  document.getElementById("number").textContent = project.number;
  document.getElementById("description").innerHTML = project.description;

  images.forEach((img, i) => {
    img.src = project.images[i];
  });

  imgOrder = [0, 1, 2];
  rotateImages();
}

function nextProject() {
  animateChange(() => {
    index = (index + 1) % Projects.length;
  });
}

function prevProject() {
  animateChange(() => {
    index = (index - 1 + Projects.length) % Projects.length;
  });
}

function animateChange(updateIndex) {
  if (!container) return;

  container.classList.add("fade-out");

  setTimeout(() => {
    updateIndex();
    loadProject();
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
  }, 300);

  setTimeout(() => {
    container.classList.remove("fade-in");
  }, 600);
}


