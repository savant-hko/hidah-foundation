// script.js

(function() {
  // --- Mobile menu toggle ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // --- Smooth scroll (anchor links) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('navbar-scroll');
      } else {
        navbar.classList.remove('navbar-scroll');
      }
    }
  });

  // --- Clean YouTube Embed (click thumbnail → swap to playable iframe) ---
  (function() {
    const container = document.getElementById('video-container');
    if (!container) return;

    const videoId = container.dataset.youtubeId;
    if (!videoId || videoId === 'YOUR_VIDEO_ID') return;

    let playerLoaded = false;

    function loadPlayer() {
      if (playerLoaded) return;
      playerLoaded = true;

      const params = new URLSearchParams({
        autoplay: '1',
        mute: '0',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        iv_load_policy: '3',
        
      });

      // Create the iframe
      const iframe = document.createElement('iframe');
      iframe.className = 'absolute inset-0 w-full h-full';
      iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      iframe.title = container.dataset.videoTitle || 'Video';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');

      // Clear the thumbnail + play button, insert the iframe
      container.innerHTML = '';
      container.appendChild(iframe);

      // Restore normal pointer behavior — this is the KEY fix
      container.classList.remove('cursor-pointer', 'group');
      container.style.cursor = 'default';
      container.style.pointerEvents = 'auto'; // ← allow clicks to reach the iframe
    }

    // Use a one-time listener so we don't re-trigger
    container.addEventListener('click', loadPlayer, { once: true });
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadPlayer();
      }
    }, { once: true });
  })();

  // --- Scroll to Top Button (appears at bottom of page) ---
  (function() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    const checkScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollY + windowHeight >= documentHeight - 300;

      if (nearBottom) {
        scrollBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4', 'pointer-events-none');
        scrollBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
      } else {
        scrollBtn.classList.add('opacity-0', 'invisible', 'translate-y-4', 'pointer-events-none');
        scrollBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
      }
    };

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    checkScroll();
  })();

  // --- Program Modals (open / close) ---
  (function() {
    const openModal = (modalId) => {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      const closeBtn = modal.querySelector('.program-modal-close');
      if (closeBtn) closeBtn.focus();
    };

    const closeModal = (modal) => {
      if (!modal) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (!document.querySelector('.program-modal.flex')) {
        document.body.style.overflow = '';
      }
    };

    document.querySelectorAll('.program-modal-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const program = btn.getAttribute('data-program');
        openModal('modal-' + program);
      });
    });

    document.querySelectorAll('.program-modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(btn.closest('.program-modal'));
      });
    });

    document.querySelectorAll('.program-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        closeModal(backdrop.closest('.program-modal'));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModalEl = document.querySelector('.program-modal.flex');
        if (openModalEl) closeModal(openModalEl);
      }
    });
  })();

  // --- Intersection Observer: reveal animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  revealElements.forEach(el => observer.observe(el));

  // --- Animated counters (Impact section) ---
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let current = 0;
      const increment = Math.ceil(target / 60);
      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          return;
        }
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(updateCounter);
      };
      updateCounter();
    });
  }

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    const impactObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
      }
    }, { threshold: 0.4 });
    impactObserver.observe(impactSection);
  }

  // ================================================================
  // NEWS & EVENTS — JSON-POWERED SECTION
  // ================================================================
  (function() {
    const newsSection = document.getElementById('news');
    if (!newsSection) return;

    const loadingEl = document.getElementById('news-loading');
    const contentEl = document.getElementById('news-content');

    const featuredSlideshows = [];

    function formatDate(isoDate) {
      const date = new Date(isoDate);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }

    function todayMidnight() {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function isFutureDate(isoDate) {
      const eventDate = new Date(isoDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= todayMidnight();
    }

    function getEventImages(event) {
      if (Array.isArray(event.images) && event.images.length > 0) {
        return event.images;
      }
      if (event.image) {
        return [event.image];
      }
      return ['./media/logo.jpg'];
    }

    function buildFeaturedCard(event) {
      const isUpcoming = event.isUpcoming || isFutureDate(event.date);
      const badgeClass = isUpcoming
        ? 'bg-[#993b3c] text-white'
        : 'bg-green-600 text-white';
      const badgeText = isUpcoming ? 'Upcoming' : 'Featured';

      const images = getEventImages(event);
      const hasMultiple = images.length > 1;

      const uniqueId = 'featured-' + Math.random().toString(36).substring(2, 11);

      const slidesHTML = images.map((src, i) => `
        <img
          src="${src}"
          alt="${event.title} - image ${i + 1}"
          class="featured-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === 0 ? 'opacity-100' : 'opacity-0'}"
          data-slide-index="${i}"
        />
      `).join('');

      const dotsHTML = hasMultiple ? `
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" data-featured-dots="${uniqueId}">
          ${images.map((_, i) => `
            <button
              type="button"
              aria-label="Go to image ${i + 1}"
              class="featured-dot w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}"
              data-dot-index="${i}"
            ></button>
          `).join('')}
        </div>
      ` : '';

      return `
        <div
          class="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden"
          data-featured-container="${uniqueId}"
          data-featured-count="${images.length}"
        >
          ${slidesHTML}
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          <div class="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span class="${badgeClass} text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wide">${badgeText}</span>
          </div>
          ${event.location ? `<div class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <span class="bg-black/50 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">${event.location}</span>
          </div>` : ''}
          ${dotsHTML}
        </div>
        <div class="p-4 sm:p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <span class="font-semibold text-[#993b3c]">${event.category}</span>
            <span>•</span>
            <span>${event.dateDisplay || formatDate(event.date)}</span>
          </div>
          <h3 class="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">${event.title}</h3>
          <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">${event.excerpt}</p>
          <a href="${event.link || '#'}" target="_blank" class="inline-block text-[#993b3c] font-semibold hover:text-[#7f2f30] transition group-hover:translate-x-1 duration-200 text-sm sm:text-base">
            Read More →
          </a>
        </div>
      `;
    }

    function buildSlide(event) {
      return `
        <div class="min-w-full p-0.5 sm:p-1">
          <div class="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition h-full">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">
              <span class="font-semibold text-[#993b3c]">${event.category}</span>
              <span>•</span>
              <span>${event.dateDisplay || formatDate(event.date)}</span>
            </div>
            <h5 class="font-bold text-gray-800 mb-1.5 sm:mb-2 text-xs sm:text-sm md:text-base line-clamp-2">${event.title}</h5>
            <p class="text-[11px] sm:text-xs md:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">${event.excerpt}</p>
            <a href="${event.link || '#'}" target="_blank" class="inline-block mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-[#993b3c] font-semibold hover:text-[#7f2f30] transition">Read More →</a>
          </div>
        </div>
      `;
    }

    function initFeaturedSlideshows() {
      featuredSlideshows.forEach(clearInterval);
      featuredSlideshows.length = 0;

      document.querySelectorAll('[data-featured-container]').forEach((container) => {
        const count = parseInt(container.dataset.featuredCount, 10);
        if (!count || count < 2) return;

        const slides = container.querySelectorAll('.featured-slide');
        const dotContainer = container.querySelector('[data-featured-dots]');
        const dots = dotContainer ? dotContainer.querySelectorAll('.featured-dot') : [];

        let current = 0;
        let interval = null;

        function showSlide(index) {
          if (index < 0) index = count - 1;
          if (index >= count) index = 0;
          current = index;

          slides.forEach((slide, i) => {
            slide.classList.toggle('opacity-100', i === current);
            slide.classList.toggle('opacity-0', i !== current);
          });

          dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === current);
            dot.classList.toggle('scale-125', i === current);
            dot.classList.toggle('bg-white/50', i !== current);
          });
        }

        dots.forEach((dot, i) => {
          dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSlide(i);
            resetInterval();
          });
        });

        function startInterval() {
          interval = setInterval(() => showSlide(current + 1), 4000);
        }

        function resetInterval() {
          clearInterval(interval);
          startInterval();
        }

        container.addEventListener('mouseenter', () => clearInterval(interval));
        container.addEventListener('mouseleave', () => startInterval());

        showSlide(0);
        startInterval();
        featuredSlideshows.push(interval);
      });
    }

    function renderNews(events) {
      const today = todayMidnight();

      const upcoming = events
        .filter(e => {
          const eventDate = new Date(e.date);
          eventDate.setHours(0, 0, 0, 0);
          return e.isUpcoming || eventDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const past = events
        .filter(e => {
          const eventDate = new Date(e.date);
          eventDate.setHours(0, 0, 0, 0);
          return !e.isUpcoming && eventDate < today;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const featured = upcoming.length > 0 ? upcoming[0] : past[0];
      const carouselEvents = past.filter(e => e.id !== featured.id);

      document.getElementById('featured-desktop').innerHTML = buildFeaturedCard(featured);
      document.getElementById('featured-mobile').innerHTML = buildFeaturedCard(featured);

      initFeaturedSlideshows();

      const slidesHTML = carouselEvents.map(buildSlide).join('');
      document.getElementById('news-carousel').innerHTML = slidesHTML;
      document.getElementById('news-carousel-mobile').innerHTML = slidesHTML;

      const dotsDesktop = document.getElementById('news-dots-desktop');
      const dotsMobile = document.getElementById('news-dots-mobile');

      dotsDesktop.innerHTML = '';
      dotsMobile.innerHTML = '';

      carouselEvents.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = `carousel-dot w-3 h-3 rounded-full cursor-pointer transition-all ${i === 0 ? 'bg-[#993b3c]' : 'bg-gray-300'}`;
        d.dataset.index = i;
        dotsDesktop.appendChild(d);

        const m = document.createElement('span');
        m.className = `carousel-dot-mobile w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full cursor-pointer transition-all ${i === 0 ? 'bg-[#993b3c]' : 'bg-gray-300'}`;
        m.dataset.index = i;
        dotsMobile.appendChild(m);
      });

      loadingEl.classList.add('hidden');
      contentEl.classList.remove('hidden');

      document.querySelectorAll('#news .reveal').forEach(el => observer.observe(el));

      initCarousels(carouselEvents.length);
    }

    function initCarousels(totalSlides) {
      function setupCarousel(carouselEl, prevBtnEl, nextBtnEl, dotsEl) {
        if (!carouselEl || !prevBtnEl || !nextBtnEl || !dotsEl.length) return;

        let currentIndex = 0;
        let autoPlayInterval;

        function updateCarousel(index) {
          if (index < 0) index = totalSlides - 1;
          if (index >= totalSlides) index = 0;
          currentIndex = index;
          carouselEl.style.transform = `translateX(${-currentIndex * 100}%)`;

          dotsEl.forEach((dot, i) => {
            dot.classList.toggle('bg-[#993b3c]', i === currentIndex);
            dot.classList.toggle('bg-gray-300', i !== currentIndex);
            dot.style.transform = i === currentIndex ? 'scale(1.3)' : 'scale(1)';
          });
        }

        function nextSlide() {
          updateCarousel(currentIndex + 1);
          resetAutoPlay();
        }

        function prevSlide() {
          updateCarousel(currentIndex - 1);
          resetAutoPlay();
        }

        prevBtnEl.addEventListener('click', prevSlide);
        nextBtnEl.addEventListener('click', nextSlide);

        dotsEl.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            updateCarousel(index);
            resetAutoPlay();
          });
        });

        function startAutoPlay() {
          autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
          clearInterval(autoPlayInterval);
          startAutoPlay();
        }

        const container = carouselEl.closest('.overflow-hidden');
        if (container) {
          container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
          container.addEventListener('mouseleave', startAutoPlay);

          let touchStartX = 0;
          container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
          }, { passive: true });

          container.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 30) {
              if (diff > 0) nextSlide();
              else prevSlide();
              resetAutoPlay();
            }
          }, { passive: true });
        }

        updateCarousel(0);
        startAutoPlay();
      }

      setupCarousel(
        document.getElementById('news-carousel'),
        document.getElementById('prev-news'),
        document.getElementById('next-news'),
        document.querySelectorAll('#news-dots-desktop .carousel-dot')
      );

      setupCarousel(
        document.getElementById('news-carousel-mobile'),
        document.getElementById('prev-news-mobile'),
        document.getElementById('next-news-mobile'),
        document.querySelectorAll('#news-dots-mobile .carousel-dot-mobile')
      );
    }

    fetch('./events.json?v=' + Date.now())
      .then(res => {
        if (!res.ok) throw new Error('Failed to load events.json');
        return res.json();
      })
      .then(data => {
        if (!data.events || !data.events.length) {
          throw new Error('No events found in events.json');
        }
        renderNews(data.events);
      })
      .catch(err => {
        console.error('News section error:', err);
        loadingEl.innerHTML = `
          <div class="text-center py-8">
            <p class="text-red-600 font-semibold">Unable to load news & events.</p>
            <p class="text-gray-500 text-sm mt-2">${err.message}</p>
          </div>
        `;
      });
  })();

})();