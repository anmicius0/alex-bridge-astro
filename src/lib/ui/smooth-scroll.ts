/**
 * Smooth Scroll Library
 * Handles smooth scrolling to anchor links.
 *
 * Features:
 * - Captures clicks immediately to prevent default jump.
 * - Uses easing for natural movement.
 * - Compatible with hash navigation and Astro View Transitions.
 */

// Configuration
const SCROLL_DURATION = 700; // Animation duration in ms (reduced for faster scroll)
const SCROLL_OFFSET = 80; // Offset from top in pixels

// Current animation tracker
let currentAnimation: { cancel: () => void } | null = null;

/**
 * Easing function: ease-in-out cubic.
 * @param t - Progress (0-1)
 * @returns Eased value
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smoothly scroll to target element.
 * @param targetElement - Element to scroll to
 * @param duration - Animation duration
 * @param offset - Top offset
 * @returns Object with cancel method to abort animation
 */
export function smoothScrollToElement(
  targetElement: HTMLElement,
  duration: number = SCROLL_DURATION,
  offset: number = SCROLL_OFFSET
): { cancel: () => void } {
  const startPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  const targetPosition =
    targetElement.getBoundingClientRect().top + startPosition - offset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;
  let animationId: number | null = null;
  let isCancelled = false;

  function animation(currentTime: number) {
    if (isCancelled) return;
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    const currentPosition = startPosition + distance * ease;
    window.scrollTo(0, currentPosition);
    if (progress < 1) {
      animationId = requestAnimationFrame(animation);
    }
  }

  animationId = requestAnimationFrame(animation);

  return {
    cancel: () => {
      isCancelled = true;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    },
  };
}

/**
 * Handle anchor link clicks.
 * Intercepts clicks and smooth scrolls instead of jumping.
 * @param event - Click event
 */
function handleAnchorClick(event: MouseEvent): void {
  const link = (event.target as HTMLElement).closest(
    'a[href^="#"]'
  ) as HTMLAnchorElement | null;
  if (!link) return;
  const hash = link.getAttribute('href');
  if (!hash || hash === '#') return;
  const targetId = hash.substring(1);
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;
  event.preventDefault();
  event.stopPropagation();
  // Cancel any existing animation
  if (currentAnimation) {
    currentAnimation.cancel();
  }
  currentAnimation = smoothScrollToElement(targetElement);
  if (history.pushState) {
    history.pushState(null, '', hash);
  } else {
    location.hash = hash;
  }
}

/**
 * Cancel current animation on user input.
 */
function cancelOnUserInput(): void {
  if (currentAnimation) {
    currentAnimation.cancel();
    currentAnimation = null;
  }
}

/**
 * Initialize smooth scroll.
 * Sets up event listeners and handles initial hash navigation.
 */
export function initSmoothScroll(): void {
  document.addEventListener('click', handleAnchorClick, true);
  document.addEventListener('wheel', cancelOnUserInput, { passive: true });
  document.addEventListener('keydown', cancelOnUserInput, { passive: true });
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      if (history.scrollRestoration) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      setTimeout(() => {
        currentAnimation = smoothScrollToElement(targetElement);
      }, 800);
    }
  }
}

/**
 * Clean up event listeners.
 */
export function cleanupSmoothScroll(): void {
  document.removeEventListener('click', handleAnchorClick, true);
  document.removeEventListener('wheel', cancelOnUserInput);
  document.removeEventListener('keydown', cancelOnUserInput);
}
