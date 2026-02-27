/* ==========================================================================
   Power Technology - Home 3 Page JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHome3ScrollAnimations();
});

/* ==========================================================================
   SCROLL ANIMATIONS - IntersectionObserver for .h3-animate elements
   ========================================================================== */

function initHome3ScrollAnimations() {
  const elements = document.querySelectorAll('.h3-animate');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
