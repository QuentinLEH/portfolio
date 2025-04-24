/* ----------------------------------------- */
/* SMOOTH SCROLLING ------------------------ */
/* ----------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Enregistrer le plugin ScrollSmoother de GSAP
  gsap.registerPlugin(ScrollSmoother);

  // Créer un effet de scroll fluide
  ScrollSmoother.create({
      wrapper: ".framer",   // Cible l'élément qui contient le scroll
      content: ".content-inner",  // Cible l'élément à faire défiler
      smooth: window.innerWidth > 768 ? 3 : 1.5,  // Fluidité du scroll (plus faible sur mobile)
      effects: true,  // Active les effets d'animation pendant le scroll
  });
});
/* ----------------------------------------- */


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
      gl.clearColor(1.0, 1.0, 1.0, 1.0); // Fond blanc
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
// Ajoutez ceci à votre fichier JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.querySelector('.loading-screen');
  const logo = document.querySelector('.header .logo');

  // Attendez la fin de l'animation de la vidéo
  setTimeout(() => {
    loadingScreen.classList.add('hidden');

    // Supprimez l'écran de chargement après la transition
    setTimeout(() => {
      loadingScreen.remove();
      logo.classList.add('visible'); // Rendre le logo visible sur la landing page
    }, 1000); // Correspond à la durée de la transition CSS
  }, 1500); // Durée totale de l'animation de la vidéo
});
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

  function handleBorderForProjectsPage() {
    if (window.innerWidth <= 900) {
      const isProjectsPage = document.querySelector('#projects-page.active');
      contentInner.style.borderTop = isProjectsPage 
        ? '1px solid rgba(37, 37, 37, 0.1)'
        : 'none';
    } else {
      contentInner.style.borderTop = 'none';
    }
  }

  function changePage(pageId) {
    // Masquer toutes les pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Afficher la page sélectionnée
    const activePage = document.getElementById(`${pageId}-page`);
    if (activePage) activePage.classList.add('active');
    
    // Mettre à jour la navigation
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      }
    });

    // Gérer la bordure pour la page projects
    handleBorderForProjectsPage();
  }

  // Gestion des clics sur la navigation
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      changePage(pageId);
      history.pushState({ page: pageId }, '', `?page=${pageId}`);
    });
  });

  // Gestion du bouton retour
  window.addEventListener('popstate', (e) => {
    const pageId = (e.state && e.state.page) || 'home';
    changePage(pageId);
  });

  // Écouteur de redimensionnement
  window.addEventListener('resize', handleBorderForProjectsPage);

  // Chargement initial
  const urlParams = new URLSearchParams(window.location.search);
  const initialPage = urlParams.get('page') || 'home';
  changePage(initialPage);
});
/* ----------------------------------------- */





// Détection iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isIOS) {
  document.documentElement.classList.add('ios');
  // Corrections spécifiques iOS
  document.querySelector('.content-inner').style.webkitOverflowScrolling = 'touch';
}