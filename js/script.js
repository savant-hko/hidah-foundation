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

    // ============== HELPER FUNCTIONS ==============

    // Format a date string (ISO) for display
    function formatDate(isoDate) {
      const date = new Date(isoDate);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }

    // Get today's date (midnight)
    function todayMidnight() {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // Determine if an event is in the future
    function isFutureDate(isoDate) {
      const eventDate = new Date(isoDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= todayMidnight();
    }

    // Build the featured card HTML
    function buildFeaturedCard(event) {
      const isUpcoming = event.isUpcoming || isFutureDate(event.date);
      const badgeClass = isUpcoming
        ? 'bg-[#993b3c] text-white'   // red = Upcoming
        : 'bg-green-600 text-white';  // green = Featured
      const badgeText = isUpcoming ? 'Upcoming' : 'Featured';

      return `
        <div class="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
          <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span class="${badgeClass} text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wide">${badgeText}</span>
          </div>
          ${event.location ? `<div class="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span class="bg-black/50 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">${event.location}</span>
          </div>` : ''}
        </div>
        <div class="p-4 sm:p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <span class="font-semibold text-[#993b3c]">${event.category}</span>
            <span>•</span>
            <span>${event.dateDisplay || formatDate(event.date)}</span>
          </div>
          <h3 class="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">${event.title}</h3>
          <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">${event.excerpt}</p>
          <a href="${event.link || '#'}" class="inline-block text-[#993b3c] font-semibold hover:text-[#7f2f30] transition group-hover:translate-x-1 duration-200 text-sm sm:text-base">
            Read More →
          </a>
        </div>
      `;
    }

    // Build a carousel slide HTML
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
            <a href="${event.link || '#'}" class="inline-block mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-[#993b3c] font-semibold hover:text-[#7f2f30] transition">Read More →</a>
          </div>
        </div>
      `;
    }

    // Render the news section with data
    function renderNews(events) {
      const today = todayMidnight();

      // 1. Split events into upcoming and past
      const upcoming = events
        .filter(e => {
          const eventDate = new Date(e.date);
          eventDate.setHours(0, 0, 0, 0);
          return e.isUpcoming || eventDate >= today;
        })
        // Sort upcoming ASCENDING (soonest first)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const past = events
        .filter(e => {
          const eventDate = new Date(e.date);
          eventDate.setHours(0, 0, 0, 0);
          return !e.isUpcoming && eventDate < today;
        })
        // Sort past DESCENDING (most recent first)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // 2. Pick featured event:
      //    - Soonest upcoming event (if any exist)
      //    - Otherwise, most recent past event
      const featured = upcoming.length > 0 ? upcoming[0] : past[0];

      // 3. Carousel contains ONLY past events
      //    If featured is a past event, exclude it from the carousel
      const carouselEvents = past.filter(e => e.id !== featured.id);

      // 4. Render featured cards (desktop + mobile)
      document.getElementById('featured-desktop').innerHTML = buildFeaturedCard(featured);
      document.getElementById('featured-mobile').innerHTML = buildFeaturedCard(featured);

      // 5. Render carousel slides (only past events)
      const slidesHTML = carouselEvents.map(buildSlide).join('');
      document.getElementById('news-carousel').innerHTML = slidesHTML;
      document.getElementById('news-carousel-mobile').innerHTML = slidesHTML;

      // 6. Build dots for both carousels
      const dotsDesktop = document.getElementById('news-dots-desktop');
      const dotsMobile = document.getElementById('news-dots-mobile');

      dotsDesktop.innerHTML = '';
      dotsMobile.innerHTML = '';

      carouselEvents.forEach((_, i) => {
        // Desktop dots
        const d = document.createElement('span');
        d.className = `carousel-dot w-3 h-3 rounded-full cursor-pointer transition-all ${i === 0 ? 'bg-[#993b3c]' : 'bg-gray-300'}`;
        d.dataset.index = i;
        dotsDesktop.appendChild(d);

        // Mobile dots
        const m = document.createElement('span');
        m.className = `carousel-dot-mobile w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full cursor-pointer transition-all ${i === 0 ? 'bg-[#993b3c]' : 'bg-gray-300'}`;
        m.dataset.index = i;
        dotsMobile.appendChild(m);
      });

      // 7. Show content, hide loader
      loadingEl.classList.add('hidden');
      contentEl.classList.remove('hidden');

      // 8. Re-run reveal observer for the new featured cards
      document.querySelectorAll('#news .reveal').forEach(el => observer.observe(el));

      // 9. Initialize carousels with the rendered content
      initCarousels(carouselEvents.length);
    }

    // ============== CAROUSEL INITIALIZATION ==============
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

          // Touch support
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

      // Desktop
      setupCarousel(
        document.getElementById('news-carousel'),
        document.getElementById('prev-news'),
        document.getElementById('next-news'),
        document.querySelectorAll('#news-dots-desktop .carousel-dot')
      );

      // Mobile
      setupCarousel(
        document.getElementById('news-carousel-mobile'),
        document.getElementById('prev-news-mobile'),
        document.getElementById('next-news-mobile'),
        document.querySelectorAll('#news-dots-mobile .carousel-dot-mobile')
      );
    }

    // ============== LOAD JSON ==============
    fetch('./events.json')
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