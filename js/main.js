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

  // --- Desktop/tablet audience dropdown disclosures ---
  const desktopDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const setDesktopDropdownState = (dropdown, open) => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    dropdown.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  const closeDesktopDropdowns = (except = null) => {
    desktopDropdowns.forEach(dropdown => {
      if (dropdown !== except) setDesktopDropdownState(dropdown, false);
    });
  };

  desktopDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      closeDesktopDropdowns(dropdown);
      setDesktopDropdownState(dropdown, willOpen);
    });

    dropdown.addEventListener('mouseenter', () => {
      if (!finePointer.matches) return;
      closeDesktopDropdowns(dropdown);
      setDesktopDropdownState(dropdown, true);
    });

    dropdown.addEventListener('mouseleave', () => {
      if (!finePointer.matches || dropdown.contains(document.activeElement)) return;
      setDesktopDropdownState(dropdown, false);
    });

    dropdown.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
      event.preventDefault();
      event.stopPropagation();
      setDesktopDropdownState(dropdown, false);
      toggle.focus();
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown')) closeDesktopDropdowns();
  });

  document.addEventListener('focusin', event => {
    const focusedDropdown = event.target.closest('.nav-dropdown');
    closeDesktopDropdowns(focusedDropdown);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openDropdown = desktopDropdowns.find(dropdown => dropdown.classList.contains('is-open'));
    if (!openDropdown) return;
    const shouldRestoreFocus = openDropdown.contains(document.activeElement);
    const toggle = openDropdown.querySelector('.nav-dropdown-toggle');
    closeDesktopDropdowns();
    if (shouldRestoreFocus && toggle) toggle.focus();
  });

  // --- Mobile nav and audience accordions ---
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileGroups = mobileNav ? Array.from(mobileNav.querySelectorAll('[data-mobile-nav-group]')) : [];

  const setMobileGroupState = (group, open) => {
    const toggle = group.querySelector('.mobile-nav-toggle');
    const panel = group.querySelector('.mobile-nav-panel');
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };

  const closeMobileGroups = (except = null) => {
    mobileGroups.forEach(group => {
      if (group !== except) setMobileGroupState(group, false);
    });
  };

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
        closeMobileGroups();
      }
    };

    mobileGroups.forEach(group => {
      const toggle = group.querySelector('.mobile-nav-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
        closeMobileGroups(group);
        setMobileGroupState(group, willOpen);
      });

      group.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
        event.preventDefault();
        event.stopPropagation();
        setMobileGroupState(group, false);
        toggle.focus();
      });
    });

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

  // --- Active nav link ---
  const pageKey = path => (path.split('/').pop() || 'index').replace(/\.html$/, '');
  const currentPath = pageKey(window.location.pathname);
  const currentHash = window.location.hash;
  const navigationLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  navigationLinks.forEach(link => {
    link.classList.remove('active');
    const url = new URL(link.getAttribute('href'), window.location.href);
    const linkPath = pageKey(url.pathname);
    const samePage = linkPath === currentPath;
    const sameSection = !url.hash || url.hash === currentHash;
    if (samePage && sameSection) link.classList.add('active');
  });

  mobileGroups.forEach(group => {
    group.classList.toggle('has-active', Boolean(group.querySelector('.active')));
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
