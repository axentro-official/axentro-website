document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  });

  // 2. Ripple Effect (Global)
  window.createRipple = function(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  document.querySelectorAll('.ripple-btn, .nav-link').forEach(btn => {
    btn.addEventListener('click', window.createRipple);
  });

  // 3. Scroll Progress Bar
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = p + '%';
    }, { passive: true });
  }

  // 4. Reveal on Scroll
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          io.unobserve(e.target); // Stop observing to save performance
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  } else {
    // Fallback
    els.forEach(el => el.classList.add('show'));
  }

  // 5. 3D Cards Tilt Effect (Disabled on touch devices for performance)
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card-wrapper').forEach(wrapper => {
      const card = wrapper.querySelector('.card');
      const glare = wrapper.querySelector('.glare-card');
      let targetX = 0, targetY = 0, currX = 0, currY = 0, gX = 50, gY = 50, cgX = 50, cgY = 50;

      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        targetY = ((x / rect.width) - 0.5) * 15;
        targetX = -((y / rect.height) - 0.5) * 15;
        gX = (x / rect.width) * 100;
        gY = (y / rect.height) * 100;
      });

      wrapper.addEventListener('mouseleave', () => {
        targetX = 0; targetY = 0; gX = 50; gY = 50;
      });

      function animateCard() {
        currX += (targetX - currX) * 0.1;
        currY += (targetY - currY) * 0.1;
        cgX += (gX - cgX) * 0.1;
        cgY += (gY - cgY) * 0.1;
        card.style.transform = `rotateY(${currY}deg) rotateX(${currX}deg)`;
        glare.style.background = `radial-gradient(circle at ${cgX}% ${cgY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`;
        requestAnimationFrame(animateCard);
      }
      animateCard();
    });
  }

  // 6. Analytics & Tracking Helpers (To keep HTML clean)
  // These are already defined in ga.js, but we ensure they exist to prevent JS errors if ga.js is delayed
  window.trackClick = window.trackClick || function(category, label, page) {};
  window.trackService = window.trackService || function(serviceId, serviceName) {};
  window.whatsapp = window.whatsapp || function(source) { console.log('WhatsApp clicked from: ' + source); };

  // 7. PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
});
