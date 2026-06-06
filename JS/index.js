(() => {
  'use strict';

  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    const heroImg = new Image();
    heroImg.onload = () => heroBg.classList.add('loaded');
    heroImg.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop';
  }

  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  const fabMain = document.getElementById('fabMain');
  const fabSocials = document.getElementById('fabSocials');
  const fabTop = document.getElementById('fabTop');

  if (fabMain && fabSocials) {
    fabMain.addEventListener('click', () => {
      const isOpen = fabSocials.classList.toggle('open');
      fabMain.classList.toggle('open', isOpen);
      fabMain.textContent = isOpen ? '+' : '🍕';
      fabMain.setAttribute('aria-expanded', String(isOpen));
    });

    fabSocials.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        fabSocials.classList.remove('open');
        fabMain.classList.remove('open');
        fabMain.textContent = '🍕';
        fabMain.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (fabTop) {
    window.addEventListener('scroll', () => {
      fabTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const pizzaBtn = document.getElementById('pizzaMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('mobileNavClose');
  const pizzaSlice = document.getElementById('pizzaSlice');

  if (pizzaBtn && mobileNav && closeBtn) {
    const openMobile = () => {
      mobileNav.classList.remove('closing');
      mobileNav.classList.add('open');
      pizzaBtn.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      pizzaBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      if (pizzaSlice) {
        pizzaSlice.classList.remove('close');
        void pizzaSlice.offsetWidth;
        pizzaSlice.classList.add('spin');
        pizzaSlice.addEventListener('animationend', () => pizzaSlice.classList.remove('spin'), { once: true });
      }
    };

    const closeMobile = () => {
      mobileNav.classList.remove('open');
      mobileNav.classList.add('closing');
      pizzaBtn.classList.remove('is-open');

      if (pizzaSlice) {
        pizzaSlice.classList.remove('spin');
        void pizzaSlice.offsetWidth;
        pizzaSlice.classList.add('close');
        pizzaSlice.addEventListener('animationend', () => pizzaSlice.classList.remove('close'), { once: true });
      }

      mobileNav.addEventListener('animationend', () => {
        mobileNav.classList.remove('closing');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }, { once: true });
      pizzaBtn.setAttribute('aria-expanded', 'false');
    };

    pizzaBtn.addEventListener('click', openMobile);
    closeBtn.addEventListener('click', closeMobile);
    document.querySelectorAll('.mobile-link').forEach((link) => link.addEventListener('click', closeMobile));
  }

  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (track && dotsContainer) {
    const slides = track.querySelectorAll('.carousel-slide');
    let current = 0;
    let autoplayInterval;

    function goTo(n) {
      if (!slides.length) return;
      current = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function startAutoplay() {
      if (slides.length > 1) autoplayInterval = setInterval(() => goTo(current + 1), 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
    });

    startAutoplay();
  }
})();
