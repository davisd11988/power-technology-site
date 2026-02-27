/* ==========================================================================
   Power Technology - Impact Page JavaScript
   Companies card carousel with proportional progress bar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCompaniesCarousel();
});

/* ==========================================================================
   COMPANIES CAROUSEL — Horizontal card slider with proportional progress bar,
   circular arrows, autoplay, and touch/swipe support
   ========================================================================== */

function initCompaniesCarousel() {
  const track = document.getElementById('companiesTrack');
  const prevBtn = document.getElementById('companiesPrev');
  const nextBtn = document.getElementById('companiesNext');
  const progressBar = document.getElementById('companiesProgress');

  if (!track || !prevBtn || !nextBtn || !progressBar) return;

  const cards = track.querySelectorAll('.companies__card');
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoplayTimer = null;
  const autoplayDelay = 5000;

  function getCardMetrics() {
    const card = cards[0];
    if (!card) return { cardWidth: 360, gap: 24, visible: 3 };
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 24;
    const viewport = track.parentElement.offsetWidth;
    const cardW = card.offsetWidth;
    const visible = Math.max(1, Math.floor((viewport + gap) / (cardW + gap)));
    return { cardWidth: cardW, gap, visible };
  }

  function updateCarousel() {
    const { cardWidth, gap, visible } = getCardMetrics();
    const maxIndex = Math.max(0, totalCards - visible);

    currentIndex = Math.min(currentIndex, maxIndex);
    currentIndex = Math.max(currentIndex, 0);

    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Arrow states
    prevBtn.classList.toggle('is-disabled', currentIndex === 0);
    nextBtn.classList.toggle('is-disabled', currentIndex >= maxIndex);

    // Proportional progress bar
    const progress = maxIndex > 0 ? (currentIndex / maxIndex) : 0;
    const minWidth = 60;
    const maxWidth = progressBar.parentElement.offsetWidth;
    progressBar.style.width = `${minWidth + progress * (maxWidth - minWidth)}px`;
  }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      const { visible } = getCardMetrics();
      const maxIndex = Math.max(0, totalCards - visible);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    }, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Arrow click handlers
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      resetAutoplay();
    }
  });

  nextBtn.addEventListener('click', () => {
    const { visible } = getCardMetrics();
    const maxIndex = Math.max(0, totalCards - visible);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
      resetAutoplay();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      const { visible } = getCardMetrics();
      const maxIndex = Math.max(0, totalCards - visible);
      if (diff > 0 && currentIndex < maxIndex) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
    }
    startAutoplay();
  }, { passive: true });

  // Pause autoplay on hover
  const carouselWrapper = track.closest('.companies__carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoplay);
    carouselWrapper.addEventListener('mouseleave', startAutoplay);
  }

  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 150);
  });

  // Initialize
  updateCarousel();
  startAutoplay();
}
