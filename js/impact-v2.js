/* ==========================================================================
   Power Technology - Impact Page v2 JavaScript
   Case study slider with fade/slide transitions, progress bar,
   touch/swipe support, and auto-advance
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCaseStudySlider();
});

function initCaseStudySlider() {
  const slidesContainer = document.getElementById('caseStudySlides');
  const prevBtn = document.getElementById('caseStudyPrev');
  const nextBtn = document.getElementById('caseStudyNext');
  const progressBar = document.getElementById('caseStudyProgress');

  if (!slidesContainer || !prevBtn || !nextBtn || !progressBar) return;

  const slides = slidesContainer.querySelectorAll('.case-study__slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let isTransitioning = false;
  let autoplayTimer = null;
  const autoplayDelay = 7000;
  const transitionDuration = 600;

  function goToSlide(newIndex) {
    if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= totalSlides) return;

    isTransitioning = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[newIndex];
    const goingForward = newIndex > currentIndex;

    // Set starting position for incoming slide
    nextSlide.style.transform = goingForward ? 'translateX(40px)' : 'translateX(-40px)';
    nextSlide.classList.remove('is-exiting');

    // Force reflow so the starting transform is applied before transition
    nextSlide.offsetHeight;

    // Exit current slide
    currentSlide.classList.remove('is-active');
    currentSlide.classList.add('is-exiting');
    currentSlide.style.transform = goingForward ? 'translateX(-40px)' : 'translateX(40px)';

    // Enter new slide
    nextSlide.classList.add('is-active');
    nextSlide.style.transform = 'translateX(0)';

    currentIndex = newIndex;
    updateNav();

    setTimeout(() => {
      currentSlide.classList.remove('is-exiting');
      currentSlide.style.transform = '';
      nextSlide.style.transform = '';
      isTransitioning = false;
    }, transitionDuration);
  }

  function updateNav() {
    // Arrow states
    prevBtn.classList.toggle('is-disabled', currentIndex === 0);
    nextBtn.classList.toggle('is-disabled', currentIndex >= totalSlides - 1);

    // Progress bar — proportional thick bar (home page style)
    const maxIndex = totalSlides - 1;
    const progress = maxIndex > 0 ? (currentIndex / maxIndex) : 0;
    const minWidth = 60;
    const maxWidth = progressBar.parentElement.offsetWidth;
    progressBar.style.width = `${minWidth + progress * (maxWidth - minWidth)}px`;
  }

  // Arrow handlers
  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    // Only respond if the case study section is in view
    const section = slidesContainer.closest('.case-study');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    stopAutoplay();
  }, { passive: true });

  slidesContainer.addEventListener('touchend', (e) => {
    const diffX = touchStartX - e.changedTouches[0].screenX;
    const diffY = touchStartY - e.changedTouches[0].screenY;

    // Only act on horizontal swipes (not vertical scrolling)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
    startAutoplay();
  }, { passive: true });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
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

  // Pause autoplay on hover
  const section = slidesContainer.closest('.case-study');
  if (section) {
    section.addEventListener('mouseenter', stopAutoplay);
    section.addEventListener('mouseleave', startAutoplay);
  }

  // Initialize
  updateNav();
  startAutoplay();
}
