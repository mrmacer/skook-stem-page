/* =========================================
   STEM@Skook29 — Main JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Skip navigation focus handoff ---
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', () => {
      window.setTimeout(() => mainContent.focus(), 0);
    });
  }

  // --- Sticky nav shadow ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile navigation ---
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    const setMobileNavState = (open) => {
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      const spans = hamburger.querySelectorAll('span');

      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    };


    hamburger.addEventListener('click', () => {
      setMobileNavState(!mobileNav.classList.contains('open'));
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMobileNavState(false));
    });

    document.addEventListener('click', event => {
      if (!mobileNav.classList.contains('open')) return;
      if (!mobileNav.contains(event.target) && !hamburger.contains(event.target)) {
        setMobileNavState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMobileNavState(false);
        hamburger.focus();
      }
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', event => {
      if (event.matches) setMobileNavState(false);
    });
  }

  // --- Active public journey ---
  const pageKey = path => (path.split('/').pop() || 'index').replace(/\.html$/, '');
  const currentPath = pageKey(window.location.pathname);
  const navigationLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  const navSectionByPage = {
    index: 'home',
    students: 'students',
    programs: 'students',
    'student-leadership': 'students',
    'how-action-plans-work': 'students',
    'leadership-training-institute': 'students',
    'cso-advisor-center': 'students',
    'cso-administrator-center': 'students',
    wscam: 'students',
    teachers: 'educators',
    districts: 'educators',
    'steels-support': 'educators',
    'edtech-ai': 'educators',
    'phenomenon-sessions': 'educators',
    'lesson-hook-generator': 'educators',
    'classroom-resources': 'resources',
    'steels-resource-library': 'resources',
    'ai-edtech-resource-library': 'resources',
    events: 'events',
    connect: 'connect',
    contact: 'connect',
    community: 'connect'
  };
  const activeSection = navSectionByPage[currentPath];

  navigationLinks.forEach(link => {
    link.classList.remove('active');
    if (activeSection && link.dataset.navSection === activeSection) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });


  // --- Intersection observer for fade-in animations ---
  if (reducedMotion) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }

  // --- Counter animation for stats ---
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';

    if (reducedMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    const duration = 1800;
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

});

// --- Utility: add fade-in class support ---
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-in:nth-child(2) { transition-delay: 0.1s; }
  .fade-in:nth-child(3) { transition-delay: 0.2s; }
  .fade-in:nth-child(4) { transition-delay: 0.3s; }
  .fade-in:nth-child(5) { transition-delay: 0.4s; }
  .fade-in:nth-child(6) { transition-delay: 0.5s; }
`;
document.head.appendChild(style);
