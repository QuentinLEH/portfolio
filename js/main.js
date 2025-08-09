
/* ----------------------------------------- */
/* LIVING BACKGROUND ----------------------- */
/* ----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  const background = document.querySelector('.background');
  background.appendChild(canvas);

  const gl = canvas.getContext('webgl2');
  const dpr = window.devicePixelRatio;

  const vertexSource = `#version 300 es
  in vec2 position;
  void main(void) {
      gl_Position = vec4(position, 0.0, 1.0);
  }
  `;

  const fragmentSource = `#version 300 es
  precision highp float;
  out vec4 fragColor;

  uniform vec2 resolution;
  uniform float time;

  #define S smoothstep

  float rnd(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 p) {
      vec2 f = fract(p), i = floor(p);
      float a = rnd(i), b = rnd(i + vec2(1, 0)), c = rnd(i + vec2(0, 1)), d = rnd(i + vec2(1, 1));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
  }

  void main(void) {
      vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.x, resolution.y);
      float t = time * 0.05; // Ralentir l'animation
      vec3 col = vec3(1.0); // Fond blanc

      vec2 p = vec2(0);
      p.x = noise(uv + vec2(0, 1));
      p.y = noise(uv + vec2(1, 0));

      p = 8.0 * (vec2(sin(t), -cos(t)) * 0.15 - p);

      float s = 0.35;
      for (float i = 0.0; i < 6.0; i++) {
          p.x += s * sin(2.0 * t - i * 1.5 * p.y) + t;
          p.y += s * cos(2.0 * t + i * 1.5 * p.x) - t;
      }

      col += vec3(sin(t + p.x + p.y));
      col = pow(S(vec3(0), vec3(1), col), vec3(0.4));
      col = mix(vec3(0.95), col, col * 0.5); // Ajuster l'intensité du grain

      fragColor = vec4(col, 1.0);
  }
  `;

  let time;
  let buffer;
  let program;
  let resolution;
  let vertices = [];

  function resize() {
    const framer = document.querySelector('.framer');
    const rect = framer.getBoundingClientRect();

    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function compile(shader, source) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(shader));
      }
  }

  function setup() {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);

      program = gl.createProgram();

      compile(vs, vertexSource);
      compile(fs, fragmentSource);

      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(program));
      }

      vertices = [
          -1.0, -1.0,
          1.0, -1.0,
          -1.0, 1.0,
          -1.0, 1.0,
          1.0, -1.0,
          1.0, 1.0
      ];

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      time = gl.getUniformLocation(program, "time");
      resolution = gl.getUniformLocation(program, 'resolution');
  }

  function draw(now) {
      gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background 
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      gl.uniform1f(time, now * 0.001);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
  }

  function loop(now) {
      draw(now);
      requestAnimationFrame(loop);
  }

  function init() {
      setup();
      resize();
      loop(0);
  }

  window.addEventListener('resize', resize);
  init();
});
/* ----------------------------------------- */


/* ----------------------------------------- */
/* INTRODUCTION ANIMATION ------------------ */
/* ----------------------------------------- */
// Solution garantie pour le centrage
function initLoader() {
  const loadingScreen = document.querySelector('.loading-screen');
  const video = document.querySelector('.video-intro');
  
  // Fonction de centrage absolu
  const centerVideo = () => {
    const vh = window.innerHeight;
    const videoHeight = video.offsetHeight;
    video.style.position = 'absolute';
    video.style.top = `${(vh - videoHeight) / 2}px`;
  };

  // Appliquer immédiatement et au redimensionnement
  centerVideo();
  window.addEventListener('resize', centerVideo);

  // Disparition progressive
  setTimeout(() => {
    loadingScreen.style.transition = 'opacity 1s ease-out';
    loadingScreen.style.opacity = '0';
    
    setTimeout(() => {
      loadingScreen.remove();
      document.querySelector('.header .logo').classList.add('visible');
      window.removeEventListener('resize', centerVideo);
    }, 1000);
  }, 1500);
}

// Démarrer quand tout est prêt
window.addEventListener('load', initLoader);
/* ----------------------------------------- */


/* ----------------------------------------- */
/* NAV ------------------------------------- */
/* ----------------------------------------- */
// Version ultra-simplifiée pour tester
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
      // Enlève la classe active de tous les items
      document.querySelectorAll('.nav-item').forEach(i => {
          i.classList.remove('active');
      });
      
      // Ajoute la classe active à l'item cliqué
      this.classList.add('active');
      
      // Affiche un message pour confirmer que le clic fonctionne
      console.log('Item cliqué :', this.getAttribute('data-page'));
  });
});
/* ----------------------------------------- */


/* ----------------------------------------- */
/* PAGE CHANGING --------------------------- */
/* ----------------------------------------- */
// Fonction globale pour changer de page
window.changePage = function(pageId) {
  // Masquer toutes les pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  
  // Afficher la page sélectionnée
  const activePage = document.getElementById(`${pageId}-page`);
  if (activePage) activePage.classList.add('active');
  
  // Mettre à jour la navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    }
  });

  // Gérer la bordure pour les pages projects, about et services
  const contentInner = document.querySelector('.content-inner');
  if (window.innerWidth <= 900) {
    const needsBorder = pageId === 'projects' || pageId === 'about' || pageId === 'services';
    contentInner.style.borderTop = needsBorder 
      ? '1px solid rgba(37, 37, 37, 0.1)'
      : 'none';
  } else {
    contentInner.style.borderTop = 'none';
  }

  history.pushState({ page: pageId }, '', `?page=${pageId}`);
};

document.addEventListener("DOMContentLoaded", () => {
  // Gestion de l'écran de chargement
  const loadingScreen = document.querySelector('.loading-screen');
  const logo = document.querySelector('.header .logo');
  
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.remove();
      logo.classList.add('visible');
    }, 1000);
  }, 2500);

  // Navigation entre pages
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const contentInner = document.querySelector('.content-inner');

  function handleBorderForPages() {
    if (window.innerWidth <= 900) {
      const activePage = document.querySelector('.page.active');
      const needsBorder = activePage.id === 'projects-page' || activePage.id === 'about-page' || activePage.id === 'services-page';
      contentInner.style.borderTop = needsBorder 
        ? '1px solid rgba(37, 37, 37, 0.1)'
        : 'none';
    } else {
      contentInner.style.borderTop = 'none';
    }
  }

  // Gestion des clics sur la navigation
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      changePage(pageId);
    });
  });

  // Gestion du bouton retour
  window.addEventListener('popstate', (e) => {
    const pageId = (e.state && e.state.page) || 'home';
    changePage(pageId);
  });

  // Écouteur de redimensionnement
  window.addEventListener('resize', handleBorderForPages);

  // Chargement initial
  const urlParams = new URLSearchParams(window.location.search);
  const initialPage = urlParams.get('page') || 'home';
  changePage(initialPage);
});
/* ----------------------------------------- */


/* ----------------------------------------- */
/* IOS FIXED ------------------------------- */
/* ----------------------------------------- */
// Détection iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isIOS) {
  document.documentElement.classList.add('ios');
  // Corrections spécifiques iOS
  document.querySelector('.content-inner').style.webkitOverflowScrolling = 'touch';
}
/* ----------------------------------------- */


/* ----------------------------------------- */
/* FORMSPREE ------------------------------- */
/* ----------------------------------------- */
// Formspree Submission
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const feedbackDiv = document.getElementById('formFeedback');
  const originalBtnText = submitBtn.textContent;

  // Désactiver le bouton pendant l'envoi
  submitBtn.textContent = "SENDING...";
  submitBtn.disabled = true;
  feedbackDiv.textContent = "";
  feedbackDiv.style.color = "inherit";

  try {
      const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
              'Accept': 'application/json'
          }
      });

      if (response.ok) {
          feedbackDiv.textContent = "✓ Message sent successfully!";
          feedbackDiv.style.color = "#4CAF50";
          form.reset();
      } else {
          throw new Error('Submission failed');
      }
  } catch (error) {
      feedbackDiv.textContent = "✗ Error: Please try again later";
      feedbackDiv.style.color = "#f44336";
  } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
  }
});
/* ----------------------------------------- */


/* ----------------------------------------- */
/* MOBILE MENU ----------------------------- */
/* ----------------------------------------- */
function setupMobileToggle() {
  let mobileToggle = null;

  function handleToggle() {
      if (window.innerWidth <= 550) {
          if (!mobileToggle) {
              mobileToggle = document.createElement('div');
              mobileToggle.className = 'mobile-toggle';
              mobileToggle.innerHTML = `
                  <svg viewBox="0 0 100 100">
                      <path class="line top" d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
                      <path class="line middle" d="m 70,50 h -40" />
                      <path class="line bottom" d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
                  </svg>
              `;
              document.body.appendChild(mobileToggle);

              mobileToggle.addEventListener('click', function() {
                  this.classList.toggle('active');
                  document.body.classList.toggle('mobile-active');
              });

              // Fermer le menu après un clic sur un lien
              const navLinks = document.querySelectorAll('.nav a');
              navLinks.forEach(link => {
                  link.addEventListener('click', function() {
                      document.body.classList.remove('mobile-active');
                      mobileToggle.classList.remove('active');
                  });
              });
          }
      } else {
          if (mobileToggle) {
              mobileToggle.remove();
              mobileToggle = null;
              document.body.classList.remove('mobile-active');
          }
      }
  }

  // Initial setup
  handleToggle();
  
  // Handle resize
  window.addEventListener('resize', handleToggle);
}

document.addEventListener('DOMContentLoaded', setupMobileToggle);
/* ----------------------------------------- */


/* ----------------------------------------- */
/* IMAGE HOVER ----------------------------- */
/* ----------------------------------------- */
// Mapping texte -> image
const imageMap = {
  // ========= PROJECTS =========
  'ANIMATED WEBSITE': './img/projects/animated-website.webp',
  'RESPONSIVE WEBSITE': './img/projects/responsive-website.webp',
  'FIRST WEBSITE': './img/projects/first-website.webp',
  'MASTER THESIS': './img/projects/master-thesis.webp',
  'FIRST TEMPLATE': './img/projects/template.webp',
  'PRESS KIT': './img/projects/press-kit.webp',
  'COMM° & EVENTS': './img/projects/ticket-gala.webp',
  
  // ========= ABOUT =========
  'FR Chamber of Commerce - SG [🇸🇬]': './img/about/french-chamber.webp',
  'LSU Athletics [🇺🇸]': './img/about/lsu-athletics.webp',
  'Temps-2-Sport [🇫🇷]': './img/about/temps-2-sport.webp',
  'UNISTRA Student Organization [🇫🇷]': './img/about/unistra-student-organization.webp',
  'VisoFactory [🇫🇷]': './img/about/visiofactory.webp',
  'Louisiana State University [🇺🇸]': './img/about/lsu.webp',
  'EM Business School [🇫🇷]': './img/about/em-strasbourg.webp',
  'University of Strasbourg [🇫🇷]': './img/about/unistra.webp',
  'GA-ON High School [🇰🇷]': './img/about/gaon-highschool.webp',
};

// Précharge toutes les images
function preloadImages() {
  Object.values(imageMap).forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  preloadImages();
  
  // Création de l'élément d'aperçu
  const hoverElement = document.createElement('div');
  hoverElement.id = 'compact-image-preview';
  document.body.appendChild(hoverElement);

  // Configuration
  const settings = {
    previewWidth: '200px',
    previewHeight: '120px',
    offsetX: -200,
    offsetY: 0,
    zIndex: 9999,
    borderRadius: '5px',
    fadeInDelay: 80,
    fadeOutDelay: 100
  };

  // Cible les éléments à survoler
  const hoverTargets = [
    ...document.querySelectorAll('.project-item h2, .project-title'),
    ...document.querySelectorAll('.about-item h3')
  ];

  let timeout;

  hoverTargets.forEach(target => {
    const textKey = target.textContent.trim();
    
    if (imageMap[textKey]) {
      target.addEventListener('mouseenter', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          hoverElement.style.backgroundImage = `url('${imageMap[textKey]}')`;
          hoverElement.style.display = 'block';
          positionImage(e);
          hoverElement.style.opacity = '1';
          hoverElement.style.transform = 'scale(1)';
        }, settings.fadeInDelay);
      });

      target.addEventListener('mousemove', positionImage);
      
      target.addEventListener('mouseleave', () => {
        clearTimeout(timeout);
        hoverElement.style.opacity = '0';
        hoverElement.style.transform = 'scale(0.98)';
        timeout = setTimeout(() => {
          hoverElement.style.display = 'none';
        }, settings.fadeOutDelay);
      });
    }
  });

  function positionImage(e) {
    hoverElement.style.left = `${e.clientX + settings.offsetX}px`;
    hoverElement.style.top = `${e.clientY + settings.offsetY}px`;
  }

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #compact-image-preview {
      position: fixed;
      width: ${settings.previewWidth};
      height: ${settings.previewHeight};
      background-size: cover;
      background-position: center;
      background-color: #f8f8f8;
      border-radius: ${settings.borderRadius};
      pointer-events: none;
      z-index: ${settings.zIndex};
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      opacity: 0;
      transform: scale(0.98);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      display: none;
    }

    @media (hover: none) {
      #compact-image-preview { display: none !important; }
    }
  `;
  document.head.appendChild(style);
});
/* ----------------------------------------- */