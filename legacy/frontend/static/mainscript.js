// Shared behaviour for every page. Page-specific code lives in
// projects.js (project slider) and script.js (About page water effect).
(() => {
  // Header gets a solid background once the page is scrolled.
  const header = document.querySelector('header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Skill rings: <li data-percent="80"> fills the circle to 80%.
  document.querySelectorAll('.skills-list li[data-percent]').forEach((li) => {
    li.style.setProperty('--percent', li.getAttribute('data-percent') + '%');
  });

  // Contact icons: swap to the colour version on hover/focus.
  // Usage: <img src="x_black.png" data-hover="x_color.png">
  document.querySelectorAll('img[data-hover]').forEach((img) => {
    const normal = img.getAttribute('src');
    const hover = img.dataset.hover;
    new Image().src = hover; // preload so there is no flicker

    const target = img.closest('a') || img;
    const on = () => { img.src = hover; };
    const off = () => { img.src = normal; };
    target.addEventListener('mouseenter', on);
    target.addEventListener('mouseleave', off);
    target.addEventListener('focus', on);
    target.addEventListener('blur', off);
  });
})();
