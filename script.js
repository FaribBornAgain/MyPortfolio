// Initialize once
document.addEventListener('DOMContentLoaded', () => {
  initializePortfolio();
});

function initializePortfolio() {
  setupNavigation();
  setupScrollEffects();
  setupAnimations();
  setupParallax();
  setupFormHandling();
  setupCursorEffects();
  setupHoverEffects();
  setupSmoothScrolling();
}

// Navigation
function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
  });

  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    hamburger.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });
  // Highlight active nav link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120; // adjust for navbar height
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      navMenu?.classList.remove('active');
    });
  });
}

// Scroll reveal
function setupScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      if (entry.target.classList.contains('stat-item')) animateCounters(entry.target);
      if (entry.target.classList.contains('work-item')) animateWorkItem(entry.target);
      if (entry.target.classList.contains('skill-item')) animateSkillItems();
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  [
    '.section-title','.section-subtitle','.about-description',
    '.stat-item','.work-item','.skill-item','.contact-item'
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('animate-in');
      observer.observe(el);
    });
  });
}

// Counters (keeps the “+”)
function animateCounters(statItem) {
  const counterEl = statItem.querySelector('h3');
  const original = counterEl.textContent.trim();
  const hadPlus = original.endsWith('+');
  const target = parseInt(original, 10) || 0;

  const duration = 2000, fps = 1000/60;
  const steps = Math.ceil(duration / fps);
  let frame = 0;

  const tick = () => {
    frame++;
    const value = Math.round((frame/steps) * target);
    counterEl.textContent = (value >= target ? target : value) + (hadPlus ? '+' : '');
    if (frame < steps) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function animateWorkItem(workItem) {
  workItem.style.transform = 'translateY(0)';
  workItem.style.opacity = '1';
}

function animateSkillItems() {
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, i) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
    }, i * 100);
  });
}


// Hero animations & floating particles (inject once)
function setupAnimations() {
  setTimeout(() => {
    document.querySelectorAll('.fade-in-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 500);

  if (!window.__particlesInjected) {
    window.__particlesInjected = true;
    createFloatingElements();
  }
}

function createFloatingElements() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const num = 15;

  for (let i = 0; i < num; i++) {
    const el = document.createElement('div');
    el.className = 'floating-particle';
    el.style.cssText = `
      position:absolute;width:${Math.random()*10+5}px;height:${Math.random()*10+5}px;
      background:rgba(52,152,219,${Math.random()*0.5+0.1});
      border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation:floatingParticle ${Math.random()*20+10}s infinite linear;
      pointer-events:none;z-index:1;
    `;
    hero.appendChild(el);
  }

  if (!document.getElementById('particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = `
      @keyframes floatingParticle {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Parallax
function setupParallax() {
  const decorations = document.querySelectorAll('.decoration');
  const avatar = document.querySelector('.avatar');

  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    decorations.forEach((el, i) => {
      const speed = (i + 1) * 0.5;
      el.style.transform = `translateY(${-(y * speed)}px) rotate(${y * 0.1}deg)`;
    });
    if (avatar) avatar.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

// Form
function setupFormHandling() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.textContent = txt;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2000);
    }, 1500);
  });

  form.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('focus', () => inp.parentElement.classList.add('focused'));
    inp.addEventListener('blur', () => { if (!inp.value) inp.parentElement.classList.remove('focused'); });
  });
}

// Cursor & hovers
function setupCursorEffects() {
  document.querySelectorAll('a, button, .work-item, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => { el.style.cursor = 'pointer'; });
  });
}

function setupHoverEffects() {
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-10px) scale(1.02)';
      item.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0) scale(1)';
      item.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
    });
  });

  // Ripple
  const rippleStyleId = 'btn-ripple-style';
  if (!document.getElementById(rippleStyleId)) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = rippleStyleId;
    rippleStyle.textContent = `
      @keyframes ripple { to { transform: scale(4); opacity: 0; } }
      .btn { position: relative; overflow: hidden; }
    `;
    document.head.appendChild(rippleStyle);
  }
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size/2;
      const y = e.clientY - rect.top - size/2;
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;
        background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);
        animation:ripple .6s ease-out;pointer-events:none;
      `;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Smooth scroll with header offset
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.navbar')?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.pageYOffset - (headerH + 10);
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
  
}

