/* ==========================================================================
   Power Technology - Home Alt Page JavaScript
   Tabs, Carousel, and page-specific interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initTabs();
  initCarousel();
});

/* ==========================================================================
   HERO SLIDER - Multi-slide hero with left/right navigation
   ========================================================================== */

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const progressBar = document.getElementById('heroProgress');
  const track = document.querySelector('.scroll-indicator__track');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const autoplayDelay = 6000;

  function goToSlide(index) {
    if (index === currentIndex) return;

    // Mark current slide as exiting
    slides[currentIndex].classList.remove('is-active');
    slides[currentIndex].classList.add('is-exiting');

    const exitingSlide = slides[currentIndex];
    setTimeout(() => {
      exitingSlide.classList.remove('is-exiting');
    }, 1000);

    // Activate new slide
    currentIndex = index;
    slides[currentIndex].classList.add('is-active');

    updateProgress();
  }

  function nextSlide() {
    const next = (currentIndex + 1) % totalSlides;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }

  function updateProgress() {
    if (progressBar && track) {
      const trackHeight = track.offsetHeight;
      const progressHeight = totalSlides > 1
        ? ((currentIndex + 1) / totalSlides) * trackHeight
        : trackHeight;
      progressBar.style.height = `${Math.max(progressHeight, 20)}px`;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Arrow click handlers — stopPropagation to prevent any parent handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      prevSlide();
      startAutoplay();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    }
  });

  // Pause autoplay on hero hover
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  // Initialize
  updateProgress();
  startAutoplay();
}

/* ==========================================================================
   OPERATING SYSTEM TABS - Spring indicator + panel transitions
   ========================================================================== */

function initTabs() {
  const tabs = document.querySelectorAll('.os-tabs__tab');
  const panels = document.querySelectorAll('.os-tabs__panel');
  const indicator = document.getElementById('tabIndicator');

  if (!tabs.length || !panels.length) return;

  let activeIndex = 0;

  function activateTab(index) {
    if (index === activeIndex && panels[index].classList.contains('is-active')) return;
    activeIndex = index;

    // Update tab active states + aria-selected
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
    });

    // Animate spring indicator
    if (indicator) {
      const tabWidth = 100 / tabs.length;
      indicator.style.left = `${index * tabWidth}%`;
      indicator.style.width = `${tabWidth}%`;
    }

    // Switch panels
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.style.display = '';
        panel.style.position = 'relative';
        // Force reflow before animating
        void panel.offsetHeight;
        panel.classList.add('is-active');
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0) scale(1)';
        panel.style.pointerEvents = 'auto';
      } else {
        panel.classList.remove('is-active');
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(12px) scale(0.98)';
        panel.style.pointerEvents = 'none';
        panel.style.position = 'absolute';
      }
    });
  }

  // Click handlers
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));
  });

  // Initialize first tab
  activateTab(0);
}

/* ==========================================================================
   OUR IMPACT CAROUSEL — Horizontal slider with proportional progress bar
   ========================================================================== */

function initCarousel() {
  const track = document.getElementById('impactTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const progressBar = document.getElementById('carouselProgress');

  if (!track || !prevBtn || !nextBtn || !progressBar) return;

  const cards = track.querySelectorAll('.impact__card');
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoplayTimer = null;
  const autoplayDelay = 5000;

  function getCardMetrics() {
    const card = cards[0];
    if (!card) return { cardWidth: 380, gap: 32, visible: 3 };
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 32;
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

  // Touch/swipe
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
  const carouselWrapper = track.closest('.impact__carousel-wrapper');
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
