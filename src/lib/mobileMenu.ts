/**
 * Menu Toggle Script
 * Handles mobile menu open/close functionality
 * Extracted from inline script for CSP compliance
 */

export function initMobileMenu() {
  const menuContent = document.querySelector('#menu-content');
  const menuOpen = document.querySelector('#menu-open');
  const menuClose = document.querySelector('#menu-close');

  if (!menuContent || !menuOpen || !menuClose) return;

  menuOpen.addEventListener('click', (e) => {
    e.preventDefault();
    menuContent.classList.remove('-translate-x-full');
  });

  menuClose.addEventListener('click', (e) => {
    e.preventDefault();
    menuContent.classList.add('-translate-x-full');
  });

  menuContent.querySelectorAll('li a').forEach((item) => {
    item.addEventListener('click', () =>
      menuContent.classList.add('-translate-x-full')
    );
  });
}

// Initialize menu on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}
