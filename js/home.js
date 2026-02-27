/* ==========================================================================
   Power Technology - Home Page JavaScript
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
  const autoplayDelay = 6000; // 6 seconds per slide

  function goToSlide(index) {
    if (index === currentIndex) return;

    // Mark current slide as exiting
    slides[currentIndex].classList.remove('is-active');
    slides[currentIndex].classList.add('is-exiting');

    // Clean up exiting state after transition
    const exitingSlide = slides[currentIndex];
    setTimeout(() => {
      exitingSlide.classList.remove('is-exiting');
    }, 1000);

    // Activate new slide
    currentIndex = index;
    slides[currentIndex].classList.add('is-active');

    // Update progress indicator
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
      const progressHeight = (currentIndex / (totalSlides - 1)) * trackHeight;
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

  // Navigation click handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay(); // Reset timer on manual nav
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay(); // Reset timer on manual nav
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
    activeIndex = index;

    // Update tab active states + aria-selected
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
    });

    // Animate spring indicator using actual tab position
    if (indicator) {
      const tab = tabs[index];
      const tabList = tab.parentElement;
      const listRect = tabList.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const scrollOffset = tabList.scrollLeft;
      indicator.style.left = `${tabRect.left - listRect.left + scrollOffset}px`;
      indicator.style.width = `${tabRect.width}px`;
      // Auto-scroll tab into view on mobile
      if (tabList.scrollWidth > tabList.clientWidth) {
        tabList.scrollTo({ left: tab.offsetLeft - 16, behavior: 'smooth' });
      }
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

  // Recalculate indicator on resize / orientation change
  window.addEventListener('resize', () => activateTab(activeIndex));

  // Initialize first tab
  activateTab(0);
}

/* ==========================================================================
   OUR IMPACT CAROUSEL — Horizontal card slider with circular nav
   ========================================================================== */

function initCarousel() {
  const track = document.getElementById('impactTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const progressBar = document.getElementById('carouselProgress');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.impact__card');
  const totalCards = cards.length;

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

  // Touch/swipe
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
