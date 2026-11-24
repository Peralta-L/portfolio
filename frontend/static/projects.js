// Project slider.
//
// HOW TO ADD A PROJECT
//   1. Copy one of the entries below.
//   2. Fill in title, tags, links, images and description.
//   3. Remove the line `draft: true` -> it appears on the site automatically.
//
// Empty `links` values are hidden, so only add what you have.
// Image paths are relative to the /static/ folder.
(() => {
  const slider = document.querySelector('.projects-slider');
  if (!slider) return;

  const STATIC = slider.dataset.static || '/static/';

  const Projects = [
    {
      number: '01',
      project_title: 'Food management app',
      tags: ['Python', 'Flask', 'React Native', 'MySQL', 'JSON'],
      links: { github: '', live: '' }, // e.g. github: 'https://github.com/you/food-app'
      images: [
        'images/project1_img1.png',
        'images/project1_img2.png',
        'images/project1_img3.png'
      ],
      description: `
        <p>The project allows users to create a virtual fridge where they can add items and track their quantities.
        All data is safely stored in the database. In another tab, the project suggests meals that can be
        prepared with the available ingredients. A calendar tab highlights upcoming expiration dates, helping
        users plan ahead and reduce food waste.</p>

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
      draft: true,
      number: '02',
      project_title: 'title',
      tags: [],
      links: { github: '', live: '' },
      images: ['images/project1_img1.png', 'images/project1_img2.png', 'images/project1_img3.png'],
      description: `testing`
    },
    {
      draft: true,
      number: '03',
      project_title: 'title',
      tags: [],
      links: { github: '', live: '' },
      images: ['images/project1_img1.png', 'images/project1_img2.png', 'images/project1_img3.png'],
      description: ``
    },
    {
      draft: true,
      number: '04',
      project_title: 'title',
      tags: [],
      links: { github: '', live: '' },
      images: ['images/project1_img1.png', 'images/project1_img2.png', 'images/project1_img3.png'],
      description: ``
    },
    {
      draft: true,
      number: '05',
      project_title: 'title',
      tags: [],
      links: { github: '', live: '' },
      images: ['images/project1_img1.png', 'images/project1_img2.png', 'images/project1_img3.png'],
      description: ``
    }
  ];

  // Only published projects are shown; numbers are re-assigned in order.
  const projects = Projects.filter((p) => !p.draft).map((p, i) => ({
    ...p,
    number: String(i + 1).padStart(2, '0')
  }));
  if (!projects.length) return;

  const images = [1, 2, 3].map((n) => document.getElementById(`img${n}`));
  const carousel = document.getElementById('carousel');
  const fadeTargets = document.querySelectorAll('.projects_left, .projects_right');
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  const dotsBox = document.getElementById('project_dots');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let pos = 0; // which image is currently in the centre
  let busy = false;

  // ---- image carousel ----------------------------------------------------
  function layoutImages() {
    const classes = ['center', 'right', 'left'];
    images.forEach((img, i) => {
      img.className = classes[(i - pos + 3) % 3];
    });
  }

  function rotateImages() {
    pos = (pos + 1) % 3;
    layoutImages();
  }

  images.forEach((img, i) => {
    img.addEventListener('click', () => { pos = i; layoutImages(); });
  });

  let timer = null;
  function startAutoRotate() {
    if (reduceMotion || timer) return;
    timer = setInterval(rotateImages, 6000);
  }
  function stopAutoRotate() {
    clearInterval(timer);
    timer = null;
  }
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);

  // ---- project content ---------------------------------------------------
  function loadProject() {
    const project = projects[index];

    document.getElementById('project_title').textContent = project.project_title;
    document.getElementById('number').textContent = project.number;
    document.getElementById('description').innerHTML = project.description;

    const tags = document.getElementById('project_tags');
    tags.replaceChildren(...(project.tags || []).map((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      return li;
    }));

    const links = document.getElementById('project_links');
    links.replaceChildren();
    [['github', 'View on GitHub'], ['live', 'Live demo']].forEach(([key, label]) => {
      const url = project.links && project.links[key];
      if (!url) return;
      const a = document.createElement('a');
      a.className = 'btn';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = label;
      links.appendChild(a);
    });

    images.forEach((img, i) => {
      img.src = STATIC + project.images[i % project.images.length];
      img.alt = `${project.project_title} screenshot ${i + 1}`;
    });

    pos = 0;
    layoutImages();
    updateDots();
    history.replaceState(null, '', `#project-${index + 1}`);
  }

  // ---- navigation --------------------------------------------------------
  function animateChange(update) {
    if (busy) return;
    busy = true;
    fadeTargets.forEach((el) => el.classList.add('fade-out'));

    setTimeout(() => {
      update();
      loadProject();
      fadeTargets.forEach((el) => {
        el.classList.remove('fade-out');
        el.classList.add('fade-in');
      });
    }, reduceMotion ? 0 : 300);

    setTimeout(() => {
      fadeTargets.forEach((el) => el.classList.remove('fade-in'));
      busy = false;
    }, reduceMotion ? 0 : 600);
  }

  const goTo = (i) => animateChange(() => { index = i; });
  const nextProject = () => goTo((index + 1) % projects.length);
  const prevProject = () => goTo((index - 1 + projects.length) % projects.length);

  // ---- dots --------------------------------------------------------------
  function buildDots() {
    dotsBox.replaceChildren(...projects.map((p, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Project ${p.number}: ${p.project_title}`);
      b.addEventListener('click', () => { if (i !== index) goTo(i); });
      return b;
    }));
  }

  function updateDots() {
    [...dotsBox.children].forEach((b, i) => {
      b.classList.toggle('active', i === index);
      b.setAttribute('aria-selected', String(i === index));
    });
  }

  // ---- wire up -----------------------------------------------------------
  if (projects.length > 1) {
    buildDots();
    prevBtn.addEventListener('click', prevProject);
    nextBtn.addEventListener('click', nextProject);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextProject();
      if (e.key === 'ArrowLeft') prevProject();
    });

    // swipe on touch screens
    let startX = null;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 60) (dx < 0 ? nextProject : prevProject)();
    });
  } else {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }

  // deep link, e.g. /projects#project-2
  const match = location.hash.match(/^#project-(\d+)$/);
  if (match) {
    const wanted = parseInt(match[1], 10) - 1;
    if (wanted >= 0 && wanted < projects.length) index = wanted;
  }

  loadProject();
  startAutoRotate();
})();
