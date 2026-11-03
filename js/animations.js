/**
 * animations.js
 * ---------------------------------------------------------------
 * The site's motion is deliberately minimal, so this file is
 * small on purpose: one helper for cross-fading content in place,
 * used when the hero artwork switches between projects. Keep
 * additions here calm — fades and small translations only, per
 * the design brief.
 * ---------------------------------------------------------------
 */

/**
 * Fades an element out, runs `updateFn` to change its content,
 * then fades it back in. Used for the hero carousel artwork.
 */
export function fadeSwap(el, updateFn, duration = 160) {
  el.style.transition = `opacity ${duration}ms ease`;
  el.style.opacity = 0;
  window.setTimeout(() => {
    updateFn();
    el.style.opacity = 1;
  }, duration);
}
