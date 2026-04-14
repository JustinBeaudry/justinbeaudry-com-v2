// js/animations.js
// Entrance animations, scroll-triggered graph reveal, nav tracking, smooth scroll

import { renderEdges, setPhase } from './graph.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
);

// ---------------------------------------------------------------------------
// Hero entrance (CSS handles animation; this is a no-op since styles.css
// already applies fadeUp/slideDown with delays on hero elements and nav)
// ---------------------------------------------------------------------------

// The CSS already declares:
//   nav { animation: slideDown 0.6s ease-out; }
//   .hero h1 { opacity: 0; animation: fadeUp 0.8s ease-out 0.2s forwards; }
//   .hero .hero-sub { opacity: 0; animation: fadeUp 0.8s ease-out 0.4s forwards; }
//   .hero .hero-body { opacity: 0; animation: fadeUp 0.7s ease-out 0.6s forwards; }
//   .anchor { opacity: 0; animation: fadeUp 0.7s ease-out 0.8s forwards; }
//
// The prefers-reduced-motion media query in CSS resets animation-duration and
// animation-delay to 0s and sets opacity: 1 on those elements.
// No JS work needed for the hero entrance.

// ---------------------------------------------------------------------------
// Ecosystem scroll entrance
// ---------------------------------------------------------------------------

function initEcosystemEntrance() {
  const workSection = document.getElementById('work');
  if (!workSection) return;

  const graphEl = document.getElementById('graph');
  if (!graphEl) return;

  const nodes = graphEl.querySelectorAll('.node');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Fire once
        observer.unobserve(entry.target);

        if (prefersReducedMotion.matches) {
          // Reduced motion: show everything immediately
          nodes.forEach((node) => node.classList.add('entered'));
          renderEdges(false);
          setPhase('interactive');
          return;
        }

        // Stagger node entrances using data-delay attributes
        nodes.forEach((node) => {
          const delay = parseInt(node.getAttribute('data-delay') || '0', 10);
          setTimeout(() => {
            node.style.animation = `nodeIn 0.5s ease-out forwards`;
            node.classList.add('entered');
          }, delay);
        });

        // After nodes appear, draw edges
        setTimeout(() => {
          renderEdges(true);
          setPhase('drawing');
        }, 600);

        // After drawing completes, switch to breathing
        setTimeout(() => {
          setPhase('breathing');

          // Clear drawing state and switch to breathing on non-active edges
          const svg = document.getElementById('edges');
          if (svg) {
            svg.querySelectorAll('.edge:not(.active)').forEach((edge) => {
              edge.classList.remove('drawing');
              // Clear inline dash styles left from drawing animation
              edge.style.strokeDasharray = '';
              edge.style.strokeDashoffset = '';
              edge.classList.add('breathing');
            });
          }
        }, 2200);
      });
    },
    { threshold: 0.12 },
  );

  observer.observe(workSection);
}

// ---------------------------------------------------------------------------
// Nav scroll tracking
// ---------------------------------------------------------------------------

function initNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav .links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`,
          );
        });
      });
    },
    { rootMargin: '-80px 0px -60% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------------------------
// Smooth scroll
// ---------------------------------------------------------------------------

function initSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---------------------------------------------------------------------------
// Public init
// ---------------------------------------------------------------------------

export function initAnimations() {
  initEcosystemEntrance();
  initNavTracking();
  initSmoothScroll();
}
