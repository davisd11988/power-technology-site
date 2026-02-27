/* ==========================================================================
   Power Technology - Home V2 Page JavaScript
   Business Impact Carousel and page-specific interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBizImpactCarousel();
});

/* ==========================================================================
   BUSINESS IMPACT CAROUSEL — Horizontal card slider with circular nav
   Same pattern as initCarousel in home.js
   ========================================================================== */

function initBizImpactCarousel() {
  const track = document.getElementById('bizImpactTrack');
  const prevBtn = document.getElementById('bizCarouselPrev');
  const nextBtn = document.getElementById('bizCarouselNext');
  const progressBar = document.getElementById('bizCarouselProgress');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.biz-impact__card');
  const totalCards = cards.length;

  function getCardMetrics() {
    const card = cards[0];
    if (!card) return { cardWidth: 411, gap: 32, visible: 3 };
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 32;
    const viewport = track.parentElement.offsetWidth;
    const cardW = card.offsetWidth;
    const visible = Math.max(1, Math.floor((viewport + gap) / (cardW + gap)));
    return { cardWidth: cardW, gap, visible };
  }

  let currentIndex = 0;

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

    // Progress bar — proportional fill
    if (progressBar) {
      const progress = maxIndex > 0 ? (currentIndex / maxIndex) : 0;
      const minWidth = 60;
      const maxWidth = progressBar.parentElement.offsetWidth;
      progressBar.style.width = `${minWidth + progress * (maxWidth - minWidth)}px`;
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    const { visible } = getCardMetrics();
    const maxIndex = Math.max(0, totalCards - visible);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
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
  }, { passive: true });

  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCarousel, 150);
  });

  // Initialize
  updateCarousel();
}
