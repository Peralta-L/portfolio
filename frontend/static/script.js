const sand = document.getElementById('sand');

for (let i = 0, a = 1; a < 5; i++, a++) {
  const umbrella = document.createElement('div');
  umbrella.style.paddingLeft = '18%';
  umbrella.className = 'umbrella';
  umbrella.style.top = `10vh`;
  umbrella.style.left = `${i * 20}vw`;
  sand.appendChild(umbrella);

  const umbrella2 = document.createElement('div');
  umbrella2.style.paddingLeft = '18%';
  umbrella2.className = 'umbrella2';
  umbrella2.style.top = `2vh`;
  umbrella2.style.left = `${i * 20}vw`;
  sand.appendChild(umbrella2);
  
  const umbrella3 = document.createElement('div');
  umbrella3.className = 'umbrella3';
  umbrella3.style.paddingLeft = '1px';
  umbrella3.style.top = `6vh`;
  umbrella3.style.left = `${a * 20}vw`;
  sand.appendChild(umbrella3);
}

const canvas = document.getElementById('water_canvas');
const ctx = canvas.getContext('2d');

let ripples = [];
let lastRippleTime = 0;
let lastMouseX = 0;
let lastMouseY = 0;

const topLimit = 180;   
const bottomLimit = 10;

function resizeCanvasAndWater() {
  const pageHeight = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );

  canvas.width = window.innerWidth;
  canvas.height = pageHeight;

  const waterBackground = document.querySelector('.water-background');
  const water = document.querySelector('.water');

  waterBackground.style.height = `${pageHeight}px`;
  water.style.height = `${pageHeight}px`;
}

window.addEventListener('resize', resizeCanvasAndWater);
window.addEventListener('scroll', resizeCanvasAndWater);
window.addEventListener('load', resizeCanvasAndWater);

resizeCanvasAndWater();

document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const now = Date.now();

  if (y < topLimit || y > canvas.height - bottomLimit) return;
  if (now - lastRippleTime < 40) return;
  lastRippleTime = now;

  lastMouseX = x;
  lastMouseY = y;

  ripples.push({ x, y, radius: 0, alpha: 1 });
  if (ripples.length > 50) ripples.shift();
});

function drawRipples() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ripples.forEach((ripple, index) => {
    ripple.radius += 0.6;        
    ripple.alpha -= ripple.radius * 0.0003;

    if (
      ripple.y - ripple.radius < topLimit ||
      ripple.y + ripple.radius > canvas.height - bottomLimit
    ) {
      ripple.alpha -= 0.05;
    }

    if (ripple.alpha <= 0) {
      ripples.splice(index, 1);
      return;
    }

    const angleToMouse = Math.atan2(lastMouseY - ripple.y, lastMouseX - ripple.x);

    ctx.beginPath();
    ctx.arc(
      ripple.x,
      ripple.y,
      ripple.radius,
      angleToMouse + Math.PI / 2,
      angleToMouse - Math.PI / 2,
      true
    );

    ctx.strokeStyle = `rgba(173, 216, 230, ${ripple.alpha * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  requestAnimationFrame(drawRipples);
}

drawRipples();