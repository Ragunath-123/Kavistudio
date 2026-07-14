/* ============================================
   KAVI PHOTO STUDIO — Main JavaScript
   ============================================ */

/* Preloader */
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) setTimeout(() => preloader.classList.add('hidden'), 1800);
});

/* Navbar Scroll */
const navbar = document.querySelector('.navbar-custom');
function handleNavScroll() {
  if (!navbar) return;
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

/* Active Nav Link */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-custom .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNavLink();

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '#!') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* Back to Top */
const backTopBtn = document.querySelector('.floating-btn.back-top');
if (backTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTopBtn.classList.add('visible');
    else backTopBtn.classList.remove('visible');
  }, { passive: true });
  backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Hero Text Rotation (Theater.js-style typewriter) */
const heroTitle = document.querySelector('.hero-title .typed-text');
const heroTexts = [
  'Capturing Moments',
  'Creating Memories',
  'Professional Photography',
  'Wedding Specialists',
  'Kavi Photo Studio'
];

if (heroTitle) {
  let textIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 80;
  function typeWriter() {
    const currentText = heroTexts[textIndex];
    if (isDeleting) {
      heroTitle.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      heroTitle.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % heroTexts.length;
      typingSpeed = 400;
    }
    setTimeout(typeWriter, typingSpeed);
  }
  setTimeout(typeWriter, 1000);
}

/* GSAP-style Counter Animation */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(easeOut * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(update);
}

/* Intersection Observer for Counters */
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.counter-number[data-target]').forEach(el => counterObserver.observe(el));

/* Three.js Hero Background */
function initThreeJS() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 60 : 120;

  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.08, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xD4AF37, transparent: true, opacity: Math.random() * 0.5 + 0.2
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
      (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10
    );
    particle.userData = { speed: Math.random() * 0.01 + 0.003, direction: Math.random() > 0.5 ? 1 : -1 };
    particles.push(particle);
    scene.add(particle);
  }

  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    particles.forEach(p => {
      p.position.y += p.userData.speed * p.userData.direction;
      if (p.position.y > 6) p.position.y = -6;
      if (p.position.y < -6) p.position.y = 6;
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.getElementById('hero-canvas') && !window.THREE) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initThreeJS;
  document.head.appendChild(script);
} else {
  initThreeJS();
}

/* Contact Form — opens WhatsApp with form data */
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name')?.value || '';
    const phone = contactForm.querySelector('#phone')?.value || '';
    const message = contactForm.querySelector('#message')?.value || '';
    const waMessage = `Hello Kavi Photo Studio, I'm ${name}. ${message} You can reach me at ${phone}.`;
    window.open(`https://wa.me/919942022789?text=${encodeURIComponent(waMessage)}`, '_blank');
  });
}

/* Book Now Buttons */
document.querySelectorAll('.btn-book-now').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const pkg = btn.dataset.package || 'a package';
    const waMessage = `Hello Kavi Photo Studio, I'm interested in the ${pkg}. Please share more details.`;
    window.open(`https://wa.me/919942022789?text=${encodeURIComponent(waMessage)}`, '_blank');
  });
});

/* Navbar Collapse on Click (mobile) */
const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');
if (navLinks.length && navbarCollapse && window.bootstrap) {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (collapse && navbarCollapse.classList.contains('show')) collapse.hide();
    });
  });
}
