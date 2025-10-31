// File: src/lib/ui/mobile-menu.ts

/**
 * Mobile menu controller: delegated handlers, survives Astro swaps, animates dropdowns via max-height.
 * API: initMobileMenu(), cleanupMobileMenu()
 */

let initialized = false;

// Track bound handlers for cleanup
let onDocumentClick: ((e: MouseEvent) => void) | null = null;
let onDocumentKeydown: ((e: KeyboardEvent) => void) | null = null;

/* Helpers */

/** Current overlay element (DOM may change after swaps). */
function getMenuContent(): HTMLElement | null {
  return document.getElementById('menu-content') as HTMLElement | null;
}

/** Open overlay and lock body scroll. */
function openMenu(): void {
  const menuContent = getMenuContent();
  if (!menuContent) return;
  menuContent.classList.remove('-translate-x-full');
  document.body.style.overflow = 'hidden';
}

/** Close overlay, unlock scroll, collapse all dropdowns. */
function closeMenu(): void {
  const menuContent = getMenuContent();
  if (!menuContent) return;

  menuContent.classList.add('-translate-x-full');
  document.body.style.overflow = '';

  const dropdowns = menuContent.querySelectorAll('.mobile-dropdown-content');
  dropdowns.forEach((node) => {
    const el = node as HTMLElement;
    el.style.maxHeight = '0';

    const trigger = document.querySelector(
      `[data-dropdown-toggle="${el.id}"]`
    ) as HTMLElement | null;

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      const icon = trigger.querySelector('.mobile-dropdown-icon');
      icon?.classList.remove('rotate-180');
    }
  });
}

/** Toggle one accordion using inline max-height for smooth transitions. */
function toggleMobileDropdown(trigger: HTMLElement): void {
  const dropdownId = trigger.getAttribute('data-dropdown-toggle');
  if (!dropdownId) return;

  const dropdown = document.getElementById(dropdownId) as HTMLElement | null;
  if (!dropdown) return;

  const icon = trigger.querySelector('.mobile-dropdown-icon');
  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    trigger.setAttribute('aria-expanded', 'false');
    dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
    dropdown.getBoundingClientRect(); // reflow
    dropdown.style.maxHeight = '0';
    icon?.classList.remove('rotate-180');
  } else {
    trigger.setAttribute('aria-expanded', 'true');
    dropdown.style.maxHeight = 'none';
    const h = dropdown.scrollHeight;
    dropdown.style.maxHeight = '0';
    dropdown.getBoundingClientRect(); // reflow
    dropdown.style.maxHeight = h + 'px';
    icon?.classList.add('rotate-180');

    // Allow minor content growth while open
    window.setTimeout(() => {
      if (trigger.getAttribute('aria-expanded') === 'true') {
        dropdown.style.maxHeight = '1000px';
      }
    }, 300);
  }
}

/* Delegated handlers */

/** Single delegated click handler for open/close, toggles, and link auto-close. */
function handleDocumentClick(e: MouseEvent): void {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const openBtn = target.closest('#menu-open');
  if (openBtn) {
    e.preventDefault();
    openMenu();
    return;
  }

  const closeBtn = target.closest('#menu-close');
  if (closeBtn) {
    e.preventDefault();
    closeMenu();
    return;
  }

  const menuContent = getMenuContent();
  if (!menuContent) return;

  const dropdownTrigger = target.closest('[data-dropdown-toggle]');
  if (dropdownTrigger && menuContent.contains(dropdownTrigger)) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileDropdown(dropdownTrigger as HTMLElement);
    return;
  }

  const anchor = target.closest('a');
  if (anchor && menuContent.contains(anchor)) {
    window.setTimeout(closeMenu, 100);
  }
}

/** ESC closes the overlay. */
function handleDocumentKeydown(e: KeyboardEvent): void {
  if (e.key !== 'Escape') return;
  const menuContent = getMenuContent();
  if (!menuContent) return;
  const isOpen = !menuContent.classList.contains('-translate-x-full');
  if (isOpen) {
    e.preventDefault();
    closeMenu();
  }
}

/* Public API */

/** Idempotent init: bind delegated handlers and ensure overlay starts closed. */
export function initMobileMenu(): void {
  if (initialized) return;
  initialized = true;

  onDocumentClick = handleDocumentClick;
  document.addEventListener('click', onDocumentClick, { passive: false });

  onDocumentKeydown = handleDocumentKeydown;
  document.addEventListener('keydown', onDocumentKeydown);

  const menuContent = getMenuContent();
  if (menuContent) {
    menuContent.classList.add('-translate-x-full');
  }
}

/** Remove handlers and reset state. */
export function cleanupMobileMenu(): void {
  if (!initialized) return;

  if (onDocumentClick) {
    document.removeEventListener('click', onDocumentClick as EventListener);
    onDocumentClick = null;
  }

  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown as EventListener);
    onDocumentKeydown = null;
  }

  initialized = false;
}

/* Auto-init and Astro lifecycle */

/** Auto-init on DOM ready and re-init across Astro view transitions. */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initMobileMenu(), {
      once: true,
    });
  } else {
    initMobileMenu();
  }

  document.addEventListener('astro:before-preparation', () => {
    cleanupMobileMenu();
  });
  document.addEventListener('astro:after-swap', () => {
    initMobileMenu();
  });
  document.addEventListener('astro:page-load', () => {
    initMobileMenu();
  });
}
