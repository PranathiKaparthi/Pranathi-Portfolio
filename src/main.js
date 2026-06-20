import * as THREE from 'three';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { initScrollAnimations } from './animations.js';

// Setup Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// App State
const state = {
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
};

/* Custom Cursor Removed */

/* =========================================================================
   2. TYPEWRITER ANIMATION (HERO)
   ========================================================================= */
const initTypewriter = () => {
  const typewriter = document.getElementById('typewriter');
  if (!typewriter) return;
  
  const words = ['AI/ML Systems.', 'IoT & Embedded Devices.', 'Full-Stack Apps.', 'Edge Computing Solutions.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 150;
  
  const type = () => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typewriter.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      typewriter.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      isDeleting = true;
      delay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 500;
    }
    
    setTimeout(type, delay);
  };
  
  setTimeout(type, 1000);
};

/* =========================================================================
   3. MOBILE NAVBAR DRAWER
   ========================================================================= */
const initMobileNav = () => {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');
  
  if (!toggle || !menu) return;
  
  const toggleMenu = () => {
    menu.classList.toggle('active');
    const icon = toggle.querySelector('i');
    if (icon && window.lucide) {
      const isClose = menu.classList.contains('active');
      toggle.innerHTML = `<i data-lucide="${isClose ? 'x' : 'menu'}"></i>`;
      window.lucide.createIcons();
    }
  };
  
  toggle.addEventListener('click', toggleMenu);
  
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  // Header scroll appearance
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
};

/* =========================================================================
   4. THREE.JS 3D BACKGROUND & HERO INTERACTIVE GLOBE
   ========================================================================= */
let globalGlobe = null; // Reference for scroll-bound animations

const initThreeJS = () => {
  const bgCanvas = document.getElementById('canvas-3d');
  const heroContainer = document.getElementById('interactive-mesh-container');
  
  if (!bgCanvas) return;
  
  // -- Scene 1: Background Stars (Full screen) --
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  bgCamera.position.z = 30;
  
  const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Background particles starfield
  const starsCount = 1200;
  const starsGeometry = new THREE.BufferGeometry();
  const starsPositions = new Float32Array(starsCount * 3);
  const starsColors = new Float32Array(starsCount * 3);
  
  const colorPalette = [
    new THREE.Color('#00f2fe'), // Cyan
    new THREE.Color('#7f00ff'), // Purple
    new THREE.Color('#4facfe'), // Blue Accent
    new THREE.Color('#ffffff')  // White
  ];
  
  for (let i = 0; i < starsCount * 3; i += 3) {
    // Distribute randomly in a cube
    starsPositions[i] = (Math.random() - 0.5) * 100;
    starsPositions[i + 1] = (Math.random() - 0.5) * 100;
    starsPositions[i + 2] = (Math.random() - 0.5) * 100;
    
    // Random color from palette
    const randColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    starsColors[i] = randColor.r;
    starsColors[i + 1] = randColor.g;
    starsColors[i + 2] = randColor.b;
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
  
  const starsMaterial = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  bgScene.add(starField);
  
  // -- Scene 2: Interactive Cyber-IoT Globe (In Hero Container) --
  let heroScene, heroCamera, heroRenderer, innerGlobe, outerGlobe;
  const hasHeroContainer = !!heroContainer;
  
  if (hasHeroContainer) {
    const width = heroContainer.clientWidth || 300;
    const height = heroContainer.clientHeight || 300;
    
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    heroCamera.position.z = 6;
    
    heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroContainer.appendChild(heroRenderer.domElement);
    
    // 1. Inner Wireframe Globe (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    innerGlobe = new THREE.Mesh(innerGeo, innerMat);
    heroScene.add(innerGlobe);
    
    // 2. Outer Particle Sphere
    const outerGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const outerMat = new THREE.PointsMaterial({
      color: 0x7f00ff,
      size: 0.05,
      transparent: true,
      opacity: 0.65
    });
    outerGlobe = new THREE.Points(outerGeo, outerMat);
    heroScene.add(outerGlobe);
    
    // Combine into a single group for unified manipulation
    const globeGroup = new THREE.Group();
    globeGroup.add(innerGlobe);
    globeGroup.add(outerGlobe);
    heroScene.add(globeGroup);
    globalGlobe = globeGroup; // Expose globally for GSAP scroll trigger
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    heroScene.add(ambientLight);
  }
  
  // Track inputs (Mouse Move & Touch Move)
  const onInputMove = (clientX, clientY) => {
    state.mouse.targetX = (clientX - state.windowHalfX) / 100;
    state.mouse.targetY = (clientY - state.windowHalfY) / 100;
  };

  window.addEventListener('mousemove', (event) => {
    onInputMove(event.clientX, event.clientY);
  });

  window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      // Prevent scrolling the page while interacting with the globe if dragging on it directly
      if (event.target.closest('#interactive-mesh-container')) {
        event.preventDefault();
      }
      onInputMove(event.touches[0].clientX, event.touches[0].clientY);
    }
  }, { passive: false });
  
  // Resize handler
  window.addEventListener('resize', () => {
    state.windowHalfX = window.innerWidth / 2;
    state.windowHalfY = window.innerHeight / 2;
    
    // Resize background canvas
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    
    // Resize hero canvas if container exists
    if (hasHeroContainer && heroContainer && heroRenderer) {
      const w = heroContainer.clientWidth;
      const h = heroContainer.clientHeight;
      heroCamera.aspect = w / h;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(w, h);
    }
  });
  
  // Animation loop
  const clock = new THREE.Clock();
  
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    
    // Slow drift for background stars
    starField.rotation.y = elapsedTime * 0.02;
    starField.rotation.x = elapsedTime * 0.01;
    
    // Parallax background reaction to mouse movement
    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.05;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.05;
    
    bgCamera.position.x = state.mouse.x * 0.5;
    bgCamera.position.y = -state.mouse.y * 0.5;
    bgCamera.lookAt(bgScene.position);
    bgRenderer.render(bgScene, bgCamera);
    
    // Hero interactive globe animation
    if (hasHeroContainer && heroRenderer && heroScene && heroCamera && globalGlobe) {
      // Rotation
      innerGlobe.rotation.y = elapsedTime * 0.15;
      innerGlobe.rotation.x = -elapsedTime * 0.05;
      outerGlobe.rotation.y = -elapsedTime * 0.08;
      
      // Tilt toward input
      globalGlobe.rotation.x = -state.mouse.y * 0.3;
      globalGlobe.rotation.y = state.mouse.x * 0.3;
      
      heroRenderer.render(heroScene, heroCamera);
    }
    
    window.requestAnimationFrame(tick);
  };
  
  tick();
};

/* =========================================================================
   5. PROJECT CARD FILTERS & DETAILED MODAL
   ========================================================================= */
const initProjectsManager = () => {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  
  // Filter Functionality (Smooth GSAP animations without race conditions)
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const matches = filterValue === 'all' || cat === filterValue;
        
        gsap.killTweensOf(card); // Stop any running animations to prevent glitches
        
        if (matches) {
          if (card.style.display === 'none') {
            card.style.display = 'flex';
            gsap.set(card, { opacity: 0, scale: 0.9, y: 15 });
          }
          
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            clearProps: 'transform' // Clear inline transform so CSS 3D hover tilts still work!
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            y: 15,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });
  
  // Modal Details Functionality
  const openModal = (card) => {
    if (!modal) return;
    
    const title = card.querySelector('.project-title').textContent;
    const tags = card.querySelector('.project-meta').innerHTML;
    const desc = card.querySelector('.project-description').textContent;
    const stats = card.querySelector('.project-stats').innerHTML;
    const tech = card.querySelector('.project-tech').innerHTML;
    
    // Get hidden bullets from the card structure
    const bulletsList = card.querySelector('.project-bullets-hidden');
    let bulletsHTML = '';
    if (bulletsList) {
      bulletsHTML = bulletsList.innerHTML;
    }
    
    // Populate modal contents
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-meta').innerHTML = tags;
    document.getElementById('modal-stats').innerHTML = stats;
    document.getElementById('modal-bullets').innerHTML = bulletsHTML;
    document.getElementById('modal-tech').innerHTML = tech;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    
    // Relight icons in the modal
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };
  
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scroll
  };
  
  cards.forEach(card => {
    const detailBtn = card.querySelector('.project-details-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(card);
      });
    }
  });
  
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  
  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
};

/* =========================================================================
   6. CONTACT FORM & EMAILJS INTEGRATION
   ========================================================================= */
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  // =========================================================================
  // CONFIGURATION: Replace these values with your actual EmailJS credentials.
  // Register at https://dashboard.emailjs.com/ to get your IDs.
  // =========================================================================
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_8hzwey8';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_nbkl10j';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'XSVvszu1ybqgMBJhA';
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Extract input fields
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Button submission loading state
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Transmitting...</span>';
    submitBtn.disabled = true;

    // Helper: Trigger success state celebration (confetti)
    const triggerConfetti = () => {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#00f2fe', '#7f00ff', '#4facfe']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#00f2fe', '#7f00ff', '#4facfe']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    };
    
    // Helper: Show custom visual toast message
    const showToast = (msg, isSuccess = true) => {
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.right = '30px';
      toast.style.background = isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)';
      toast.style.color = '#fff';
      toast.style.padding = '16px 24px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = isSuccess ? '0 10px 30px rgba(16, 185, 129, 0.4)' : '0 10px 30px rgba(239, 68, 68, 0.4)';
      toast.style.zIndex = '99999';
      toast.style.fontFamily = 'var(--font-title)';
      toast.style.fontWeight = '600';
      toast.style.backdropFilter = 'blur(10px)';
      toast.style.border = isSuccess ? '1px solid #10b981' : '1px solid #ef4444';
      toast.innerText = msg;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    };

    // Prepare template parameters dynamically
    const templateParams = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      content: message, // Provided in case template references {{content}}
      time: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }) // Generates structured local timestamp
    };

    // Check if credentials are still placeholder keys. If so, fallback to mockup mode for local testing.
    const isPlaceholder = EMAILJS_SERVICE_ID.includes('xxxxxx') || EMAILJS_PUBLIC_KEY.includes('xxxxx');

    if (isPlaceholder) {
      console.warn("EmailJS credentials not configured yet. Simulating message transmission in local demo mode.");
      console.log("Template Parameters generated:", templateParams);
      setTimeout(() => {
        triggerConfetti();
        showToast('Demo Mode: Message transmitted successfully! 🚀');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 1200);
    } else {
      // Send Email via EmailJS send API
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
        publicKey: EMAILJS_PUBLIC_KEY
      })
      .then(() => {
        triggerConfetti();
        showToast('Message Transmitted Successfully! 🚀');
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS Send Failure:', error);
        showToast('Transmission Failed! Check console logs.', false);
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    }
  });
};

/* =========================================================================
   7. NAVIGATION ACTIVE SECTION TRACKER (SCROLL SPY)
   ========================================================================= */
const initScrollSpy = () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

/* =========================================================================
   8. CORE INITIALIZATION
   ========================================================================= */
const init = () => {
  initTypewriter();
  initMobileNav();
  initThreeJS();
  initProjectsManager();
  initContactForm();
  initScrollSpy();
  
  // Start GSAP scroll animations
  initScrollAnimations(globalGlobe);
};

window.addEventListener('load', init);
export { globalGlobe };
