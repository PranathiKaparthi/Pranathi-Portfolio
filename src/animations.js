import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = (globalGlobe) => {
  // ==========================================
  // 1. PAGE LOAD ANIMATIONS (HERO SECTION)
  // ==========================================
  const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  loadTl.from('.header', {
    y: -50,
    opacity: 0,
    duration: 1.2
  })
  .from('.hero-content .badge', {
    y: 20,
    opacity: 0,
    duration: 0.6
  }, '-=0.8')
  .from('.hero-title', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.6')
  .from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.6
  }, '-=0.5')
  .from('.hero-description', {
    y: 20,
    opacity: 0,
    duration: 0.6
  }, '-=0.4')
  .from('.hero-actions .btn', {
    y: 20,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6
  }, '-=0.4')
  .from('.hero-canvas-container', {
    opacity: 0,
    scale: 0.9,
    duration: 1.5
  }, '-=1.0');

  // ==========================================
  // 2. SCROLL TRIGGERED SECTIONS REVEAL
  // ==========================================
  const sections = document.querySelectorAll('section:not(#home)');
  
  sections.forEach(section => {
    // Fade in section headers
    const header = section.querySelector('.section-header');
    if (header) {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }
  });

  // ==========================================
  // 3. ABOUT SECTION ANIMATIONS
  // ==========================================
  if (document.querySelector('.about-section')) {
    gsap.from('.about-bio', {
      scrollTrigger: {
        trigger: '.about-bio',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: -60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.education-card', {
      scrollTrigger: {
        trigger: '.education-card',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
    
    // Animate Education Timeline Items Staggered
    gsap.from('.education-timeline .timeline-item', {
      scrollTrigger: {
        trigger: '.education-timeline',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      stagger: 0.25,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  // ==========================================
  // 4. SKILLS PROGRESS BARS TRIGGER
  // ==========================================
  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length > 0) {
    skillCards.forEach(card => {
      const progresses = card.querySelectorAll('.progress');
      
      // Animate card entrance
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Animate child progress bars
      progresses.forEach(prog => {
        const targetWidth = prog.style.width;
        // Reset width to 0 for GSAP to control
        prog.style.width = '0%';
        
        gsap.to(prog, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          width: targetWidth,
          duration: 1.5,
          ease: 'power4.out',
          delay: 0.2
        });
      });
    });
  }

  // ==========================================
  // 5. EXPERIENCE TIMELINE ANIMATION
  // ==========================================
  if (document.querySelector('.experience-section')) {
    gsap.from('.experience-card', {
      scrollTrigger: {
        trigger: '.experience-card',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
  }

  // ==========================================
  // 6. PROJECTS GRID CARDS ANIMATION
  // ==========================================
  if (document.querySelector('.projects-grid')) {
    gsap.from('.projects-grid', {
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
  }

  // ==========================================
  // 7. CONTACT SECTION ANIMATIONS
  // ==========================================
  if (document.querySelector('.contact-section')) {
    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.contact-form-container', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }

  // ==========================================
  // 8. SCROLL-LINKED HERO GLOBE ROTATION & ZOOM
  // ==========================================
  if (globalGlobe) {
    gsap.to(globalGlobe.rotation, {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: Math.PI * 2, // Spin a full rotation over scrolling
      ease: 'none'
    });
    
    gsap.to(globalGlobe.position, {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: -2, // Move globe down
      z: -3, // Zoom globe away
      ease: 'none'
    });
  }
};
