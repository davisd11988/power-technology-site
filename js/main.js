/* ==========================================================================
   Power Technology - Main JavaScript (Shared across pages)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initNavbar();
  initDropdowns();
  initMobileMenu();
  initScrollAnimations();
  initContactPanel();
});

/* ==========================================================================
   ACTIVE NAV - Highlight current page link automatically
   ========================================================================== */

function initActiveNav() {
  const links = document.querySelectorAll('.navbar__nav > .navbar__link, .navbar__nav > .navbar__item');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Map page filenames to their nav link hrefs or dropdown keywords
  const impactPages = ['our-impact.html', 'our-impact-v2.html', 'our-impact-v3.html'];
  const solutionPages = ['power-one.html', 'portfolio-solutions.html', 'private-equity.html'];

  // Remove all existing is-active
  links.forEach(el => {
    el.classList.remove('is-active');
    const link = el.querySelector('.navbar__link');
    if (link) link.classList.remove('is-active');
  });
  document.querySelectorAll('.navbar__link.is-active').forEach(el => el.classList.remove('is-active'));

  // Set active based on current page
  document.querySelectorAll('.navbar__nav .navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentPage === 'index.html' && href === 'index.html') {
      link.classList.add('is-active');
    } else if (impactPages.includes(currentPage) && href.includes('impact')) {
      link.classList.add('is-active');
    } else if (currentPage === 'about.html' && href === 'about.html') {
      link.classList.add('is-active');
    } else if (currentPage === 'careers.html' && href === 'careers.html') {
      link.classList.add('is-active');
    }
  });

  // Check dropdown triggers for solutions pages
  if (solutionPages.includes(currentPage)) {
    document.querySelectorAll('.navbar__dropdown-trigger').forEach(trigger => {
      if (trigger.textContent.trim().toLowerCase().includes('solution')) {
        trigger.classList.add('is-active');
      }
    });
  }
}

/* ==========================================================================
   NAVBAR - Deloitte-style hide on scroll down / reveal on scroll up
   ========================================================================== */

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const threshold = 80; // Pixels scrolled before hiding kicks in

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const navMenu = document.getElementById('navMenu');
      const mobileOpen = navMenu && navMenu.classList.contains('is-open');

      // Don't hide/reveal while mobile menu is open
      if (mobileOpen) {
        ticking = false;
        return;
      }

      // Detect hero section bottom
      const hero = document.querySelector('.hero, .impact-hero');
      const heroBottom = hero ? hero.offsetHeight : 0;
      const inHeroZone = currentScrollY < heroBottom;

      if (currentScrollY <= 10) {
        // At the very top: transparent, no classes
        navbar.classList.remove('is-hidden', 'is-revealed', 'is-solid');
      } else if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        // Scrolling DOWN past threshold: hide nav
        navbar.classList.add('is-hidden');
        navbar.classList.remove('is-revealed', 'is-solid');
        // Close any open dropdowns when hiding
        closeAllDropdowns();
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP: reveal
        navbar.classList.remove('is-hidden');
        navbar.classList.add('is-revealed');
        // Solid when below hero, translucent when in hero zone
        navbar.classList.toggle('is-solid', !inHeroZone);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });
  }

  // Run immediately in case page is already scrolled
  if (window.scrollY > 10) {
    const hero = document.querySelector('.hero, .impact-hero');
    const heroBottom = hero ? hero.offsetHeight : 0;
    navbar.classList.add('is-revealed');
    if (window.scrollY >= heroBottom) {
      navbar.classList.add('is-solid');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   DROPDOWNS - Click-to-toggle glassmorphism panels
   ========================================================================== */

function closeAllDropdowns() {
  document.querySelectorAll('.navbar__dropdown.is-open').forEach(dropdown => {
    dropdown.classList.remove('is-open');
  });
  document.querySelectorAll('.navbar__dropdown-trigger[aria-expanded="true"]').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
  });
}

function initDropdowns() {
  const items = document.querySelectorAll('.navbar__item[data-dropdown]');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.navbar__dropdown-trigger');
    const dropdown = item.querySelector('.navbar__dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');

      // Close all others first
      closeAllDropdowns();

      // Toggle this one
      if (!isOpen) {
        dropdown.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar__item[data-dropdown]')) {
      closeAllDropdowns();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

/* ==========================================================================
   MOBILE MENU - Hamburger toggle + accordion sub-menus
   ========================================================================== */

function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');
  if (!hamburger || !navMenu) return;

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'navMenu');
  navMenu.setAttribute('role', 'navigation');

  function openMenu() {
    navMenu.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (navbar) {
      navbar.classList.remove('is-hidden');
      navbar.classList.add('menu-open');
    }
  }

  function closeMenu() {
    navMenu.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (navbar) {
      navbar.classList.remove('menu-open');
    }
    // Close any open mobile accordion dropdowns
    navMenu.querySelectorAll('.navbar__dropdown.is-open').forEach(d => {
      d.classList.remove('is-open');
    });
    navMenu.querySelectorAll('.navbar__dropdown-trigger[aria-expanded="true"]').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
    });
  }

  hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a direct nav link (not dropdown triggers)
  navMenu.querySelectorAll('a.navbar__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking a dropdown sub-link
  navMenu.querySelectorAll('.navbar__dropdown-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });
}

/* ==========================================================================
   SCROLL ANIMATIONS - IntersectionObserver for .scroll-animate elements
   ========================================================================== */

function initScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-animate');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // Stagger children animations
        const children = entry.target.querySelectorAll(
          '.apart__card, .services__card'
        );
        children.forEach((child, index) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(24px)';

          setTimeout(() => {
            child.style.transition = 'opacity 0.7s cubic-bezier(0, 0, 0.2, 1), transform 0.7s cubic-bezier(0, 0, 0.2, 1)';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';

            // Clear inline styles after entrance animation so CSS hover rules take over
            setTimeout(() => {
              child.style.transition = '';
              child.style.transform = '';
              child.style.opacity = '';
            }, 800);
          }, index * 120 + 200);
        });
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   CONTACT PANEL — Deloitte-style slide-in from right
   ========================================================================== */

function initContactPanel() {
  const panel = document.getElementById('contactPanel');
  const overlay = document.getElementById('contactOverlay');
  const closeBtn = document.getElementById('contactClose');
  const trigger = document.getElementById('contactTrigger');
  const form = document.getElementById('contactForm');

  if (!panel || !overlay) return;

  function openPanel() {
    panel.classList.add('is-active');
    overlay.classList.add('is-active');
    document.body.classList.add('contact-open');
    // Focus the close button for accessibility
    setTimeout(() => closeBtn && closeBtn.focus(), 400);
  }

  function closePanel() {
    panel.classList.remove('is-active');
    overlay.classList.remove('is-active');
    document.body.classList.remove('contact-open');
    // Return focus to trigger
    if (trigger) trigger.focus();
  }

  // Open from navbar CTA (desktop)
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPanel();
    });
  }

  // Open from mobile nav contact link
  document.querySelectorAll('[data-contact-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile menu first if open
      const navMenu = document.getElementById('navMenu');
      const hamburger = document.getElementById('navHamburger');
      const navbar = document.getElementById('navbar');
      if (navMenu && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        if (hamburger) hamburger.classList.remove('is-active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        if (navbar) navbar.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
      // Small delay to let menu close animation start
      setTimeout(openPanel, 150);
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  // Close on overlay click
  overlay.addEventListener('click', closePanel);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-active')) {
      closePanel();
    }
  });

  // Trap focus inside panel when open
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = panel.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple visual feedback
      const submitBtn = form.querySelector('.contact-panel__submit');
      if (submitBtn) {
        submitBtn.textContent = 'SENT!';
        submitBtn.style.background = '#1a8a4a';
        setTimeout(() => {
          closePanel();
          form.reset();
          submitBtn.innerHTML = '<span>SUBMIT</span><svg viewBox="0 0 16 12" fill="none"><path d="M1 6h12M9.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          submitBtn.style.background = '';
        }, 1500);
      }
    });
  }
}
