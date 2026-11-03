/**
 * hero-tour.js
 * ---------------------------------------------------------------
 * Drives the home hero. It has two states:
 *
 *   ENTRANCE   The wide photo of the room, with the introduction.
 *              The visitor sits down by clicking the bench, or the
 *              page does it for them after AUTO_SIT_MS of calm.
 *
 *   SEATED     A point of view from the bench. The featured painting
 *              is described on the wall like in a museum. Unless the
 *              visitor engages, the tour moves to the next painting
 *              every ADVANCE_MS and loops forever.
 *
 * Engaging with a painting:
 *   • Click anywhere on the wall  → pins the painting so it can be read.
 *     Click again               → the tour resumes.
 *   • Hover or focus the label    → the tour waits (so nobody is cut off
 *                                    mid-sentence); it resumes on leave.
 *   • Dots / arrow keys           → jump to a painting and pin it.
 *   • "Stand up" / Esc            → back to the entrance (no auto-sit).
 *
 * Leaving the page (any other section) simply ends everything; there is
 * nothing to clean up because each section is its own HTML page.
 *
 * Geometry (where things sit on the photos) lives in js/hero-scene.js.
 * Project content lives in the PROJECTS array in js/gallery.js.
 * ---------------------------------------------------------------
 */

import { PROJECTS, ACCENTS, artworkGradient } from './gallery.js';
import { relayoutHeroScene } from './hero-scene.js';

/* ------------------------------------------------------------------
   TIMING — change these to tune the experience
   ------------------------------------------------------------------ */
const AUTO_SIT_MS = 10000; // calm time in the entrance before sitting down on its own
const ADVANCE_MS = 3500;   // how long each painting stays before the tour moves on
const SIT_MS = 1600;       // length of the sit-down dissolve (keep equal to --sit-dur in pages.css)
const SWAP_MS = 320;       // fade-out time of the wall text when a painting changes

const KIND_LABEL = { mobile: 'Mobile application', web: 'Web application', ai: 'AI application' };

/* ------------------------------------------------------------------
   STATE
   ------------------------------------------------------------------ */
const state = {
  view: 'entrance', // 'entrance' | 'seated'
  index: 0,
  pinned: false,    // the visitor clicked to stay on this painting
  hovering: false,  // pointer or focus is on the wall text
  autoSit: true,    // switched off once the visitor stands up on purpose
};

const el = {};
let sitTimer = 0;
let tourTimer = 0;

const pad = (n) => String(n).padStart(2, '0');
const wrap = (i) => (i + PROJECTS.length) % PROJECTS.length;

/* ------------------------------------------------------------------
   RENDERING
   ------------------------------------------------------------------ */

/** What hangs in the painting: the project's own image, or a gradient in its color. */
function artworkFill(project) {
  return project.artwork
    ? `center / cover no-repeat url("${project.artwork}")`
    : artworkGradient(project.color);
}

/**
 * Shows a project's artwork inside a painting. Two stacked layers
 * cross-fade, so the old color never dips to transparent (which would
 * reveal the photo's own painting underneath).
 */
function paintArtwork(artwork, project) {
  let layers = artwork.querySelectorAll('.art-fill');
  if (layers.length === 0) {
    artwork.innerHTML = '<div class="art-fill is-active"></div><div class="art-fill"></div>';
    layers = artwork.querySelectorAll('.art-fill');
    layers[0].style.background = artworkFill(project);
    return;
  }
  const current = artwork.querySelector('.art-fill.is-active');
  const next = [...layers].find((layer) => layer !== current);
  next.style.background = artworkFill(project);
  current.classList.remove('is-active');
  current.classList.add('is-leaving');
  next.classList.add('is-active');
  window.setTimeout(() => current.classList.remove('is-leaving'), 1000);
}

/** Replaces a wall text block, fading the old one out and the new one in. */
function swapContent(container, html, animate) {
  const apply = () => {
    container.innerHTML = `<div class="swap is-entering">${html}</div>`;
    const incoming = container.firstElementChild;
    void incoming.offsetWidth; // commit the starting state
    incoming.classList.remove('is-entering');
    relayoutHeroScene(); // the new text may be taller or shorter
  };
  if (!animate || !container.firstElementChild) {
    apply();
    return;
  }
  container.classList.add('is-swapping');
  window.setTimeout(() => {
    apply();
    container.classList.remove('is-swapping');
  }, SWAP_MS);
}

function renderEntranceInfo(project) {
  el.info.innerHTML = `
    <span class="proj-tag" style="background:${ACCENTS[project.accent].soft}; color:${project.color}">${project.year}</span>
    <h3>${project.name}</h3>
    <p>${project.short}</p>
    <a class="btn-min" href="project.html?id=${project.id}">View project →</a>
  `;
}

function renderWall(project, index, animate) {
  const kind = KIND_LABEL[project.tag] || 'Project';
  swapContent(el.vinyl, `
    <p class="pov-vinyl__eyebrow">Exhibition ${pad(index + 1)}</p>
    <h2 class="pov-vinyl__title">${project.name}</h2>
    <p class="pov-vinyl__sub">${kind}</p>
    <a class="pov-vinyl__all" href="gallery.html">View all projects →</a>
  `, animate);

  swapContent(el.label, `
    <p class="pov-label__meta"><span>${project.year}</span><span>${kind}</span></p>
    <h3 class="pov-label__title">${project.name}</h3>
    <p class="pov-label__text">${project.short}</p>
    ${project.tech ? `<p class="pov-label__medium"><em>Medium</em> ${project.tech}</p>` : ''}
    <a class="btn-min pov-label__link" href="project.html?id=${project.id}">View project →</a>
  `, animate);
}

function renderIndicator() {
  el.current.textContent = pad(state.index + 1);
  el.total.textContent = pad(PROJECTS.length);
  el.dots.querySelectorAll('button').forEach((button, i) => {
    button.classList.toggle('active', i === state.index);
  });
}

function renderTourState() {
  el.tourState.textContent = state.pinned && state.view === 'seated'
    ? 'Reading — click the wall to resume the tour'
    : '';
  // Announce changes to assistive tech only when the visitor is driving.
  el.label.setAttribute('aria-live', state.pinned ? 'polite' : 'off');
}

/* ------------------------------------------------------------------
   TIMERS
   ------------------------------------------------------------------ */

function clearTimers() {
  window.clearTimeout(sitTimer);
  window.clearTimeout(tourTimer);
}

/** Entrance: sit down on our own after a calm AUTO_SIT_MS. */
function armSit() {
  window.clearTimeout(sitTimer);
  if (state.view !== 'entrance' || !state.autoSit || document.hidden) return;
  sitTimer = window.setTimeout(sit, AUTO_SIT_MS);
}

/** Seated: move to the next painting after `delay`, unless the visitor is engaged. */
function armTour(delay = ADVANCE_MS) {
  window.clearTimeout(tourTimer);
  if (state.view !== 'seated' || state.pinned || state.hovering || document.hidden) return;
  tourTimer = window.setTimeout(() => go(state.index + 1), delay);
}

/* ------------------------------------------------------------------
   ACTIONS
   ------------------------------------------------------------------ */

/** Shows painting `index`. `pin` marks it as chosen by the visitor. */
function go(index, { pin = false } = {}) {
  state.index = wrap(index);
  const project = PROJECTS[state.index];

  renderEntranceInfo(project);
  paintArtwork(el.entranceArtwork, project);
  paintArtwork(el.povArtwork, project);
  renderWall(project, state.index, state.view === 'seated');
  renderIndicator();

  if (pin) state.pinned = true;
  renderTourState();

  if (state.view === 'seated') armTour();
  else armSit();
}

function sit() {
  if (state.view === 'seated') return;
  clearTimers();
  state.view = 'seated';
  state.pinned = false;
  state.hovering = false;

  el.scene.dataset.view = 'seated';
  el.layerEntrance.setAttribute('aria-hidden', 'true');
  el.layerPov.setAttribute('aria-hidden', 'false');
  el.bench.tabIndex = -1;

  renderWall(PROJECTS[state.index], state.index, false);
  renderTourState();
  el.stand.focus({ preventScroll: true });

  // The first painting gets the whole dissolve plus its reading time.
  armTour(SIT_MS + ADVANCE_MS);
}

function stand() {
  if (state.view === 'entrance') return;
  clearTimers();
  state.view = 'entrance';
  state.pinned = false;
  state.autoSit = false; // they chose to stand: do not pull them back down
  state.hovering = false;

  el.scene.dataset.view = 'entrance';
  el.layerEntrance.setAttribute('aria-hidden', 'false');
  el.layerPov.setAttribute('aria-hidden', 'true');
  el.bench.tabIndex = 0;

  renderTourState();
  el.bench.focus({ preventScroll: true });
}

function togglePinned() {
  state.pinned = !state.pinned;
  renderTourState();
  if (state.pinned) window.clearTimeout(tourTimer);
  else armTour();
}

/* ------------------------------------------------------------------
   EVENTS
   ------------------------------------------------------------------ */

function bindEvents() {
  // Sitting down.
  el.bench.addEventListener('click', sit);
  el.stand.addEventListener('click', stand);

  // A click on the wall pins / unpins the painting (links and buttons keep their own job).
  el.layerPov.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    togglePinned();
  });

  // Reading: the tour waits while the pointer or focus is on the wall text.
  // (Only a real mouse counts: on touch screens there is no "leave", so a tap
  //  would otherwise stop the tour for good.)
  [el.vinyl, el.label].forEach((node) => {
    node.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      state.hovering = true;
      window.clearTimeout(tourTimer);
    });
    node.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      state.hovering = false;
      armTour();
    });
    node.addEventListener('focusin', () => { state.hovering = true; window.clearTimeout(tourTimer); });
    node.addEventListener('focusout', () => { state.hovering = false; armTour(); });
  });

  // Dots.
  el.dots.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    go(parseInt(button.dataset.i, 10), { pin: state.view === 'seated' });
  });

  // Keyboard.
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') go(state.index + 1, { pin: state.view === 'seated' });
    else if (event.key === 'ArrowLeft') go(state.index - 1, { pin: state.view === 'seated' });
    else if (event.key === 'Escape') stand();
  });

  // Do not run the clock while the tab is in the background.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimers();
    else if (state.view === 'entrance') armSit();
    else armTour();
  });
}

/* ------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------ */

/** Call once on index.html. */
export function initHeroTour() {
  el.scene = document.getElementById('heroScene');
  el.layerEntrance = document.getElementById('layerEntrance');
  el.layerPov = document.getElementById('layerPov');
  el.entranceArtwork = document.getElementById('heroArtwork');
  el.povArtwork = document.getElementById('povArtwork');
  el.info = document.getElementById('heroInfo');
  el.bench = document.getElementById('benchSeat');
  el.vinyl = document.getElementById('povVinyl');
  el.label = document.getElementById('povLabel');
  el.stand = document.getElementById('standUp');
  el.dots = document.getElementById('heroDots');
  el.current = document.getElementById('roomLabelCurrent');
  el.total = document.getElementById('roomLabelTotal');
  el.tourState = document.getElementById('tourState');

  if (!Object.values(el).every(Boolean)) return; // not on this page

  // Warm the cache so paintings never appear half-loaded.
  PROJECTS.forEach((project) => {
    if (project.artwork) { const img = new Image(); img.src = project.artwork; }
  });

  el.dots.innerHTML = PROJECTS
    .map((project, i) => `<button type="button" aria-label="Go to ${project.name}" data-i="${i}"></button>`)
    .join('');

  bindEvents();
  go(0);
}
