/**
 * El Ritual Barbershop — app.js
 * Controlador principal de interacciones del sitio.
 * Principios: accesibilidad, rendimiento, seguridad y claridad.
 */

'use strict';

/* ============================================================
   1. INIT: esperar a que el DOM esté disponible
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);

function init() {
  setupHeader();
  setupMobileNav();
  setupBackToTop();
  setupScrollAnimations();
  setCurrentYear();
}

/* ============================================================
   2. HEADER — clase scrolled para fondo con blur al hacer scroll
   ============================================================ */
function setupHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 80;

  const onScroll = throttle(() => {
    const pastThreshold = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle('scrolled', pastThreshold);
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });

  // Estado inicial
  onScroll();
}

/* ============================================================
   3. MENÚ MOBILE — toggle accesible
   ============================================================ */
function setupMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  // Cerrar menú al hacer clic en un enlace interno
  const navLinks = nav.querySelectorAll('a[href^="#"]');

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Cerrar al redimensionar a pantalla grande
  const mediaQuery = window.matchMedia('(min-width: 769px)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
}

/* ============================================================
   4. BOTÓN VOLVER ARRIBA
   ============================================================ */
function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_AFTER_PX = 600;

  const onScroll = throttle(() => {
    const shouldShow = window.scrollY > SHOW_AFTER_PX;

    if (shouldShow) {
      btn.removeAttribute('hidden');
      // Pequeño delay para que la transición CSS se aplique correctamente
      requestAnimationFrame(() => btn.classList.add('show'));
    } else {
      btn.classList.remove('show');
    }
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Devolver el foco al primer elemento enfocable del documento
    const firstFocusable = document.querySelector('a, button, [tabindex]');
    if (firstFocusable) {
      firstFocusable.focus({ preventScroll: true });
    }
  });

  // Soporte de teclado en la transición animada
  btn.addEventListener('transitionend', () => {
    if (!btn.classList.contains('show')) {
      btn.setAttribute('hidden', '');
    }
  });
}

/* ============================================================
   5. ANIMACIONES DE ENTRADA — Intersection Observer
   ============================================================ */
function setupScrollAnimations() {
  // Respetar preferencia de movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const options = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Dejar de observar tras animar
      }
    });
  }, options);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ============================================================
   6. AÑO DINÁMICO EN FOOTER
   ============================================================ */
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  const year = new Date().getFullYear();
  yearEl.textContent = year;
  yearEl.setAttribute('datetime', String(year));
}

/* ============================================================
   UTILIDADES
   ============================================================ */

/**
 * Limita la frecuencia de ejecución de una función.
 * @param {Function} fn — Función a limitar
 * @param {number}   wait — Tiempo mínimo entre ejecuciones (ms)
 * @returns {Function}
 */
function throttle(fn, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
