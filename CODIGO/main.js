import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize Data using placeholder high-end food images
const showcaseImages = [
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=2070'
];

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCursor();
  buildShowcase();
  initAnimations();
});

// Mobile Menu Navigation
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const links = document.querySelectorAll('.nav__link');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      // Toggle icon
      if (navLinks.classList.contains('active')) {
        toggleBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>`;
      } else {
        toggleBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>`;
      }
    });

    // Close menu when clicking a link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>`;
      });
    });
  }
}

// Custom Cursor Animation (Only for pointer: fine devices)
function initCursor() {
  // Only initialize custom cursor logic if device has a fine pointer (mouse)
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.querySelector('.cursor');
    const hoverElements = document.querySelectorAll('a, button, .menu__item');

    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    });

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }
}

function buildShowcase() {
  const showcaseContainer = document.querySelector('.showcase__images');
  if(!showcaseContainer) return;
  showcaseContainer.innerHTML = '';
  
  showcaseImages.forEach(src => {
    const div = document.createElement('div');
    div.classList.add('showcase__img-panel');
    div.style.backgroundImage = `url(${src})`;
    showcaseContainer.appendChild(div);
  });
}

function initAnimations() {
  // Hero Animation Setup
  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 }});

  // Scale down the hero image
  tl.to('.hero__image', {
    scale: 1,
    duration: 2.5
  }, 0);

  // Reveal Title elements (Kinetic typography)
  tl.to('.hero__title-inner', {
    y: '0%',
    stagger: 0.2
  }, 0.5);

  // Fade in subtitle and scroll indicator
  tl.to(['.hero__subtitle', '.hero__scroll-indicator', '.nav'], {
    opacity: 1,
    y: 0,
    stagger: 0.1
  }, 1.5);

  // Parallax Effect on Hero Image on Scroll
  gsap.to('.hero__image-wrapper', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // About Section Animations
  gsap.to('.about__heading', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
    }
  });

  gsap.to('.about__text', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 60%',
    }
  });

  // Scrollytelling Setup
  ScrollTrigger.matchMedia({
    // Desktop only (Pinned Showcase)
    "(min-width: 769px)": function() {
      const showcaseTitle = document.querySelector('.showcase__title');
      const showcaseDesc = document.querySelector('.showcase__desc');

      // Pin the whole showcase and animate the images up
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.showcase',
          start: 'top top',
          end: '+=150%', // duration of the scroll
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            if(self.progress < 0.5) {
              showcaseTitle.textContent = "El Arte de Emplatar";
              showcaseDesc.textContent = "Cada ingrediente es seleccionado en el punto máximo de su temporada, transformando la naturaleza cruda en una obra maestra.";
            } else {
              showcaseTitle.textContent = "Sinfonía Dulce";
              showcaseDesc.textContent = "Un delicado equilibrio de texturas y sabores, terminando tu viaje con una nota memorable.";
            }
          }
        }
      });

      // Move the images container up by 50% (to show the second 100vh panel)
      tl.to('.showcase__images', {
        y: '-50%',
        ease: 'none'
      });
    },
    // Mobile only (Fade in images as they scroll into view)
    "(max-width: 768px)": function() {
      const panels = document.querySelectorAll('.showcase__img-panel');
      panels.forEach((panel) => {
        gsap.fromTo(panel, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
            }
          }
        );
      });
    }
  });

  // Menu Stagger Reveal
  gsap.to('.menu__item', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.menu',
      start: 'top 80%'
    }
  });
}
