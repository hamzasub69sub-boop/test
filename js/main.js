/**
 * AUREON — Interactive Engine & UI Handlers
 * Clean, lightweight, vanilla JavaScript
 */

const initAureonApp = () => {
  // --- 1. Sticky Navigation & Active Link Highlighting ---
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Active anchor tracking
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile navigation toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // --- 2. Google Antigravity Interactive Cursor Particle System ---
  const initAntigravityParticles = () => {
    const canvas = document.getElementById('antigravityCanvas');
    const zone = document.getElementById('antigravityZone');
    if (!canvas || !zone) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;

    // Mouse tracker state with smooth trailing
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 170, // influence distance
      isActive: false
    };

    // Responsive canvas dimensions
    const resizeCanvas = () => {
      const rect = zone.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Track mouse coordinates relative to the antigravity zone
    window.addEventListener('mousemove', (e) => {
      const rect = zone.getBoundingClientRect();
      const clientY = e.clientY;
      const clientX = e.clientX;

      if (clientY >= rect.top - 80 && clientY <= rect.bottom + 40 && clientX >= rect.left && clientX <= rect.right) {
        mouse.targetX = clientX - rect.left;
        mouse.targetY = clientY - rect.top;
        mouse.isActive = true;
      } else {
        mouse.isActive = false;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.isActive = false;
    });

    // Particle Class
    const particleCount = Math.min(Math.floor((window.innerWidth * 1200) / 10000), 130);
    const particles = [];
    const colors = [
      'rgba(0, 240, 255, ',     // Cyan primary
      'rgba(99, 102, 241, ',    // Indigo
      'rgba(16, 185, 129, ',    // Emerald accent
      'rgba(255, 255, 255, '     // Pure white accent
    ];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : Math.random() * width;
        this.y = init ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2.2 + 0.8;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.55 + 0.25;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.friction = 0.94;
        this.spring = 0.035;
        this.mass = this.size * 1.2;
      }

      update() {
        // Natural ambient drift
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Wrap around boundaries
        if (this.baseX < -20) this.baseX = width + 20;
        if (this.baseX > width + 20) this.baseX = -20;
        if (this.baseY < -20) this.baseY = height + 20;
        if (this.baseY > height + 20) this.baseY = -20;

        // Interactive Antigravity Cursor Physics (Force Field Repulsion & Orbital Swirl)
        if (mouse.isActive) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius && distance > 0.1) {
            // Strong inverse exponential antigravity push
            const force = (1 - distance / mouse.radius);
            const repelForce = force * 16 / this.mass;
            const angle = Math.atan2(dy, dx);

            // Antigravity repulsion away from cursor
            this.x -= Math.cos(angle) * repelForce * 6;
            this.y -= Math.sin(angle) * repelForce * 6;

            // Orbital vortex swirl tangent
            this.x += -Math.sin(angle) * repelForce * 2.2;
            this.y += Math.cos(angle) * repelForce * 2.2;
          }
        }

        // Smooth spring return to floating trajectory
        const homeX = this.baseX;
        const homeY = this.baseY;
        this.x += (homeX - this.x) * this.spring;
        this.y += (homeY - this.y) * this.spring;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + this.alpha + ')';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Initialize particle pool
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const render = () => {
      // Smooth cursor interpolation for buttery responsiveness
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle neural threads (like Google Antigravity / AI nodes)
      const connectDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectDist) {
            const opacity = (1 - dist / connectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Connect particles to cursor when nearby
      if (mouse.isActive) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius * 0.9) {
            const cursorLineOpacity = (1 - dist / (mouse.radius * 0.9)) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${cursorLineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
  };

  initAntigravityParticles();

  // --- 3. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean enterprise feel
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // Open first FAQ item by default for demonstration
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }

  // --- 4. Consultation Booking Modal & 4-Step Stepper ---
  const modal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const finishBookingBtn = document.getElementById('finishBookingBtn');

  // Booking form state
  const bookingState = {
    date: 'Mon, Sep 21',
    time: '10:00 AM',
    name: '',
    email: '',
    phone: ''
  };

  const steps = [
    document.getElementById('bookingStep1'),
    document.getElementById('bookingStep2'),
    document.getElementById('bookingStep3'),
    document.getElementById('bookingStep4')
  ];

  const stepDots = document.querySelectorAll('.modal-step-dot');

  const goToStep = (stepNumber) => {
    steps.forEach((step, idx) => {
      if (idx + 1 === stepNumber) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    stepDots.forEach((dot, idx) => {
      const dotStep = idx + 1;
      dot.classList.remove('active', 'completed');
      if (dotStep === stepNumber) {
        dot.classList.add('active');
      } else if (dotStep < stepNumber) {
        dot.classList.add('completed');
      }
    });
  };

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    goToStep(1);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (finishBookingBtn) finishBookingBtn.addEventListener('click', closeModal);

  // Close when clicking outside modal box
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Date selection
  const dateButtons = document.querySelectorAll('#dateGrid .slot-btn');
  dateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dateButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.date = btn.textContent.trim();
    });
  });

  // Time selection
  const timeButtons = document.querySelectorAll('#timeGrid .slot-btn');
  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.time = btn.textContent.trim();
    });
  });

  // Stepper navigation buttons
  const goToStep2 = document.getElementById('goToStep2');
  const backToStep1 = document.getElementById('backToStep1');
  const goToStep3 = document.getElementById('goToStep3');
  const backToStep2 = document.getElementById('backToStep2');
  const goToStep4 = document.getElementById('goToStep4');

  if (goToStep2) goToStep2.addEventListener('click', () => goToStep(2));
  if (backToStep1) backToStep1.addEventListener('click', () => goToStep(1));
  if (goToStep3) goToStep3.addEventListener('click', () => goToStep(3));
  if (backToStep2) backToStep2.addEventListener('click', () => goToStep(2));

  if (goToStep4) {
    goToStep4.addEventListener('click', () => {
      const name = document.getElementById('bookName').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();

      if (!name || !email || !phone) {
        alert('Please fill in your name, email, and contact number to confirm the consultation.');
        return;
      }

      bookingState.name = name;
      bookingState.email = email;
      bookingState.phone = phone;

      // Update confirmation summary
      const summaryDate = document.getElementById('bookingSummaryDate');
      const summaryTime = document.getElementById('bookingSummaryTime');
      const summaryAttendee = document.getElementById('bookingSummaryAttendee');

      if (summaryDate) summaryDate.textContent = `Date: ${bookingState.date}`;
      if (summaryTime) summaryTime.textContent = `Time: ${bookingState.time}`;
      if (summaryAttendee) summaryAttendee.textContent = `Attendee: ${bookingState.name} (${bookingState.email})`;

      goToStep(4);
    });
  }

  // --- 5. Contact Form Submission Handler ---
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const method = document.getElementById('contactMethod').value;
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Visual loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing Request...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        formFeedback.className = 'form-status-msg success';
        formFeedback.innerHTML = `
          <strong>Inquiry Transmitted Successfully.</strong><br>
          Thank you, ${name}. Your automation requirements have been logged with Aureon engineering. We will contact you via ${method} shortly.
        `;

        contactForm.reset();

        // Hide notice after 8 seconds
        setTimeout(() => {
          formFeedback.className = 'form-status-msg';
          formFeedback.innerHTML = '';
        }, 8000);
      }, 700);
    });
  }

  // --- 6. Interactive Animated Stats Counters (Unico Connect Inspired) ---
  const statsSection = document.querySelector('.stats-section');
  const statCounters = document.querySelectorAll('.stat-counter');
  const statItems = document.querySelectorAll('.stat-item');

  if (statsSection && statCounters.length > 0) {
    const formatNumber = (num, target) => {
      if (target >= 1000) {
        return Math.floor(num).toLocaleString('en-US');
      }
      return Math.floor(num).toString();
    };

    const runCounterAnimation = (counter, parentItem, index = 0) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      if (parentItem) {
        parentItem.classList.remove('counting-complete');
        parentItem.classList.add('is-counting');
      }

      // 2.2s to 2.5s duration for a rich, premium Unico Connect feel
      const duration = 2200 + index * 120;
      let startTimestamp = null;

      // Custom smooth ease-out that stays visible longer
      const easeOutQuad = (t) => t * (2 - t);

      const step = (now) => {
        if (!startTimestamp) startTimestamp = now;
        const elapsed = now - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);

        let currentVal;
        if (target === 3) {
          // Explicit step intervals so 0, 1, 2, 3 are crystal clear
          if (progress < 0.25) currentVal = 0;
          else if (progress < 0.55) currentVal = 1;
          else if (progress < 0.82) currentVal = 2;
          else currentVal = 3;
        } else {
          currentVal = Math.round(eased * target);
        }

        counter.textContent = formatNumber(currentVal, target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = formatNumber(target, target);
          if (parentItem) {
            parentItem.classList.remove('is-counting');
            parentItem.classList.add('counting-complete');
          }
        }
      };

      // Set to 0 right before starting frame sequence
      counter.textContent = '0';
      requestAnimationFrame(step);
    };

    let hasTriggered = false;
    const triggerStatsCount = () => {
      statsSection.classList.add('is-visible');
      statCounters.forEach((counter, idx) => {
        const parentItem = counter.closest('.stat-item');
        if (parentItem) parentItem.classList.add('revealed');
        setTimeout(() => {
          runCounterAnimation(counter, parentItem, idx);
        }, 120 * idx);
      });
    };

    // IntersectionObserver with sensible threshold
    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTriggered) {
            hasTriggered = true;
            triggerStatsCount();
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      });

      statsObserver.observe(statsSection);
    }

    // Direct scroll checking fallback
    const checkScrollPosition = () => {
      if (hasTriggered) return;
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        hasTriggered = true;
        triggerStatsCount();
      }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    // Check after brief pause to allow DOM layout
    setTimeout(checkScrollPosition, 300);

    // Interactive Replay: Clicking any stat card replays its count-up
    statItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const counter = item.querySelector('.stat-counter');
        if (counter) {
          runCounterAnimation(counter, item, idx);
        }
      });
    });
  }

  // --- 7. Universal Smooth Scroll Reveal for All Text & Sections ---
  const setupScrollReveal = () => {
    // 1. Tag all section headers
    document.querySelectorAll('.section-header').forEach(hdr => {
      hdr.classList.add('scroll-reveal');
    });

    // 2. Tag grids with staggered child reveal
    const gridSelectors = [
      '.stats-grid',
      '.services-grid',
      '.process-grid',
      '.why-grid',
      '.usecases-grid',
      '.workflows-grid',
      '.testimonials-grid',
      '.leadership-grid',
      '.faq-grid',
      '.timeline-stepper',
      '.layer-system-grid'
    ];

    gridSelectors.forEach(selector => {
      const grids = document.querySelectorAll(selector);
      grids.forEach(grid => {
        const children = Array.from(grid.children);
        children.forEach((child, i) => {
          child.classList.add('scroll-reveal');
          child.style.transitionDelay = `${(i % 4) * 0.08}s`;
        });
      });
    });

    // 3. Tag standalone content boxes and text wrappers
    const individualSelectors = [
      '.architecture-wrapper',
      '.layer-box',
      '.exp-card',
      '.contact-card',
      '.contact-form-wrapper',
      '.consultation-card',
      '.final-cta-card',
      '.stats-disclaimer-wrapper'
    ];

    individualSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('scroll-reveal');
      });
    });

    // 4. Observe all reveal elements
    const allRevealElements = document.querySelectorAll('.scroll-reveal');

    const checkReveals = () => {
      allRevealElements.forEach(el => {
        if (!el.classList.contains('revealed')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
            el.classList.add('revealed');
          }
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
      });

      allRevealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
          el.classList.add('revealed');
        } else {
          revealObserver.observe(el);
        }
      });
    }

    checkReveals();
    window.addEventListener('scroll', checkReveals, { passive: true });
  };

  setupScrollReveal();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAureonApp);
} else {
  initAureonApp();
}
