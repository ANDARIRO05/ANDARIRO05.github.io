/**
 * hero-scene.js
 * ---------------------------------------------------------------
 * The home hero is made of two photographs of the same room:
 *
 *   ENTRANCE  assets/images/hero-scene.jpg   (wide shot, the bench in front)
 *   SEATED    assets/images/pov-scene.jpg    (point of view from the bench)
 *
 * Photos are cropped differently depending on the window's aspect
 * ratio, yet three things have to stay glued to specific spots in them:
 *
 *   • the color panel that stands in for "the painting"  (both scenes)
 *   • the invisible bench you click to sit down          (entrance)
 *   • the wall lettering and the museum label            (seated)
 *
 * This module re-implements the browser's own image-sizing math and
 * converts positions measured in each photo's native pixels into
 * on-screen coordinates. It re-runs on resize, so the alignment holds
 * from phones to ultrawide monitors.
 *
 * WHAT TO DO IF YOU REPLACE A PHOTO
 * ---------------------------------------------------------------
 * Every position below is measured in the *native pixels of its own
 * photo*. After swapping an image, re-measure its numbers (open
 * tools/measure-corners.html — it lets you click the corners and
 * prints the arrays to paste here). Nothing else needs to change.
 * ---------------------------------------------------------------
 */

/* ------------------------------------------------------------------
   MEASUREMENTS (native pixels of each photo)
   ------------------------------------------------------------------ */

/** ENTRANCE — hero-scene.jpg (1536 × 1024). Canvas corners: TL, TR, BR, BL. */
const ENTRANCE = {
  artwork: [
    { x: 865, y: 275 },
    { x: 1299, y: 254 },
    { x: 1301, y: 683 },
    { x: 865, y: 669 },
  ],
  /** Outline of the bench — the clickable area. */
  bench: [
    { x: 668, y: 778 },
    { x: 762, y: 748 },
    { x: 1202, y: 776 },
    { x: 1204, y: 860 },
    { x: 1160, y: 895 },
    { x: 700, y: 892 },
    { x: 668, y: 860 },
  ],
  /** Where the "Take a seat" hint points to (top-centre of the cushion). */
  hint: { x: 935, y: 750 },
};

/** SEATED — pov-scene.jpg (1672 × 941). */
const POV = {
  /** Blank canvas, inside its thin frame: TL, TR, BR, BL. */
  artwork: [
    { x: 538, y: 228 },
    { x: 1135, y: 228 },
    { x: 1135, y: 636 },
    { x: 538, y: 636 },
  ],
  /** Wall lettering, on the back wall to the left of the canvas. */
  vinyl: { x: 275, y: 268, width: 240 },
  /** Museum object label, on the back wall to the right of the canvas. */
  label: { x: 1160, y: 420, width: 240 },
  /** Vertical position of the canvas centre inside the window (0–1):
   *  with wall text, with text docked along the bottom, and on tall phones. */
  focusY: 0.44,
  focusYDocked: 0.4,
  focusYPortrait: 0.32,
  /** Share of the window width the canvas may fill when the window is narrow. */
  fitWidth: 0.9,
  /** Where the back wall meets the floor/bench: wall text must end above it. */
  floorY: 712,
  /** When the text is docked, the most window height the painting may take. */
  dockedPaintingShare: { landscape: 0.42, portrait: 0.4 },
};

/** Breathing room kept between anchored labels and the window edge. */
const EDGE_MARGIN = 14;
/** Gap between the wall text and the painting / the floor line. */
const WALL_GAP = 18;
/** Below these widths the wall text would be cramped, so it docks instead. */
const VINYL_MIN_WIDTH = 150;
const LABEL_MIN_WIDTH = 210;

/* ------------------------------------------------------------------
   GEOMETRY HELPERS
   ------------------------------------------------------------------ */

function boundingBox(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

/** A CSS clip-path polygon in % of the points' own bounding box. Because
 *  x and y are always scaled by the same factor, it stays valid at every size. */
function clipPath(points, box) {
  const pts = points.map((p) => {
    const px = ((p.x - box.left) / box.width) * 100;
    const py = ((p.y - box.top) / box.height) * 100;
    return `${px.toFixed(2)}% ${py.toFixed(2)}%`;
  });
  return `polygon(${pts.join(', ')})`;
}

const ENTRANCE_ARTWORK_BOX = boundingBox(ENTRANCE.artwork);
const ENTRANCE_ARTWORK_CLIP = clipPath(ENTRANCE.artwork, ENTRANCE_ARTWORK_BOX);
const ENTRANCE_BENCH_BOX = boundingBox(ENTRANCE.bench);
const ENTRANCE_BENCH_CLIP = clipPath(ENTRANCE.bench, ENTRANCE_BENCH_BOX);
const POV_ARTWORK_BOX = boundingBox(POV.artwork);
const POV_ARTWORK_CLIP = clipPath(POV.artwork, POV_ARTWORK_BOX);

/** Reads the image's computed `object-position` as [x, y] fractions. */
function objectPosition(image) {
  const value = window.getComputedStyle(image).objectPosition || '50% 50%';
  const parts = value.split(' ').map((part) => {
    if (part.endsWith('%')) return parseFloat(part) / 100;
    if (part === 'left' || part === 'top') return 0;
    if (part === 'right' || part === 'bottom') return 1;
    return 0.5;
  });
  return [parts[0] ?? 0.5, parts[1] ?? 0.5];
}

/** The browser's `object-fit: cover` math: how a native-pixel point maps on screen. */
function coverPlacement(width, height, image) {
  const nw = image.naturalWidth;
  const nh = image.naturalHeight;
  if (!nw || !nh || !width || !height) return null;
  const scale = Math.max(width / nw, height / nh);
  const [px, py] = objectPosition(image);
  return {
    scale,
    offsetX: (width - nw * scale) * px,
    offsetY: (height - nh * scale) * py,
  };
}

/** Maps a native-pixel box to a screen rectangle. */
function toScreen(box, placement) {
  return {
    left: placement.offsetX + box.left * placement.scale,
    top: placement.offsetY + box.top * placement.scale,
    width: box.width * placement.scale,
    height: box.height * placement.scale,
  };
}

function setBox(el, rect) {
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.top}px`;
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
}

/* ------------------------------------------------------------------
   SCENE PLACEMENT
   ------------------------------------------------------------------ */

const refs = {};

function placeEntrance(width, height) {
  // On tall/narrow screens "cover" crops the sides of the photo. Choose the
  // horizontal crop so the painting sits in the middle instead of being cut.
  const img = refs.entranceImage;
  if (img.naturalWidth && width / height < 1.05) {
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const spare = img.naturalWidth * scale - width;
    const cx = ENTRANCE_ARTWORK_BOX.left + ENTRANCE_ARTWORK_BOX.width / 2;
    const fx = spare > 0 ? Math.min(Math.max((cx * scale - width / 2) / spare, 0), 1) : 0.5;
    refs.scene.style.setProperty('--hero-focal', `${(fx * 100).toFixed(1)}% 46%`);
  } else {
    refs.scene.style.removeProperty('--hero-focal');
  }

  const placement = coverPlacement(width, height, refs.entranceImage);
  if (!placement) return;

  // The painting overlay.
  setBox(refs.entranceArtwork, toScreen(ENTRANCE_ARTWORK_BOX, placement));
  refs.entranceArtwork.style.clipPath = ENTRANCE_ARTWORK_CLIP;

  // The bench hit area.
  setBox(refs.bench, toScreen(ENTRANCE_BENCH_BOX, placement));
  refs.bench.style.clipPath = ENTRANCE_BENCH_CLIP;

  // The hint that floats above the bench.
  refs.hint.style.left = `${placement.offsetX + ENTRANCE.hint.x * placement.scale}px`;
  refs.hint.style.top = `${placement.offsetY + ENTRANCE.hint.y * placement.scale}px`;
}

/**
 * The point-of-view photo is placed explicitly (not with object-fit) so it
 * can be zoomed *out* on narrow windows: cropping the sides there would
 * cut the painting itself. When that happens the photo no longer fills the
 * window vertically; the layer's background (see pages.css) and a soft
 * mask on the photo's top/bottom edges blend the rest.
 */
function placePov(width, height, forceDocked = false) {
  const img = refs.povImage;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh || !width || !height) return;

  const clamp = (value, a, b) => Math.min(Math.max(value, Math.min(a, b)), Math.max(a, b));
  const cx = POV_ARTWORK_BOX.left + POV_ARTWORK_BOX.width / 2;
  const cy = POV_ARTWORK_BOX.top + POV_ARTWORK_BOX.height / 2;
  const cover = Math.max(width / nw, height / nh);

  /** Where the photo sits for a given scale (painting centred horizontally). */
  const offsetXFor = (scale) => {
    const imgW = nw * scale;
    return imgW >= width ? clamp(width / 2 - cx * scale, width - imgW, 0) : (width - imgW) / 2;
  };

  /** Horizontal layout of the wall text at a given scale: never into the painting. */
  const wallColumns = (scale) => {
    const offsetX = offsetXFor(scale);
    const paintLeft = offsetX + POV_ARTWORK_BOX.left * scale;
    const vinylLeft = offsetX + POV.vinyl.x * scale;
    const vinylWidth = Math.min(POV.vinyl.width * scale, paintLeft - WALL_GAP - vinylLeft);
    const labelLeft = offsetX + POV.label.x * scale;
    const labelWidth = Math.max(POV.label.width * scale, LABEL_MIN_WIDTH);
    const fits = vinylLeft >= EDGE_MARGIN
      && vinylWidth >= VINYL_MIN_WIDTH
      && labelLeft + labelWidth <= width - EDGE_MARGIN;
    return { fits, vinylLeft, vinylWidth, labelLeft, labelWidth };
  };

  // Start from "cover", but never crop the painting's sides on narrow windows.
  let scale = Math.min(cover, (width * POV.fitWidth) / POV_ARTWORK_BOX.width);
  const columns = wallColumns(scale);
  let anchored = !forceDocked && columns.fits;

  // With the text docked along the bottom, step back so the painting
  // leaves it room instead of sitting behind it.
  const portrait = height > width * 1.05;
  if (!anchored) {
    const share = portrait ? POV.dockedPaintingShare.portrait : POV.dockedPaintingShare.landscape;
    scale = Math.min(scale, (height * share) / POV_ARTWORK_BOX.height);
  }

  const imgW = nw * scale;
  const imgH = nh * scale;
  const fitted = imgW < width || imgH < height;
  const offsetX = offsetXFor(scale);
  const focusY = anchored ? POV.focusY : portrait ? POV.focusYPortrait : POV.focusYDocked;
  const offsetY = imgH >= height
    ? clamp(height * focusY - cy * scale, height - imgH, 0)
    : clamp(height * focusY - cy * scale, 0, height - imgH);

  setBox(img, { left: offsetX, top: offsetY, width: imgW, height: imgH });
  refs.scene.dataset.labels = anchored ? 'anchored' : 'docked';
  refs.scene.dataset.fit = fitted ? 'true' : 'false';

  const placement = { scale, offsetX, offsetY };
  const painting = toScreen(POV_ARTWORK_BOX, placement);

  // The painting overlay.
  setBox(refs.povArtwork, painting);
  refs.povArtwork.style.clipPath = POV_ARTWORK_CLIP;

  if (!anchored) return;

  // Wall lettering + museum label, on the wall.
  refs.scene.style.setProperty('--k', String(Math.min(Math.max(scale, 0.9), 1.35)));
  refs.vinyl.style.setProperty('--x', `${columns.vinylLeft}px`);
  refs.vinyl.style.setProperty('--w', `${columns.vinylWidth}px`);
  refs.label.style.setProperty('--x', `${columns.labelLeft}px`);
  refs.label.style.setProperty('--w', `${columns.labelWidth}px`);

  // Vertically: keep both blocks on the wall, above the floor and the bench.
  // Their real heights depend on the text, so measure them now.
  const floor = offsetY + POV.floorY * scale - WALL_GAP;
  const placeBlock = (el, preferredY) => {
    const blockHeight = el.offsetHeight;
    const top = Math.max(painting.top, Math.min(offsetY + preferredY * scale, floor - blockHeight));
    el.style.setProperty('--y', `${top}px`);
    return top + blockHeight <= floor;
  };
  const vinylFits = placeBlock(refs.vinyl, POV.vinyl.y);
  const labelFits = placeBlock(refs.label, POV.label.y);

  // Too short a window to keep them on the wall: dock them instead.
  if (!vinylFits || !labelFits) placePov(width, height, true);
}

function layout() {
  const { scene } = refs;
  if (!scene) return;
  const width = scene.clientWidth;
  const height = scene.clientHeight;
  placeEntrance(width, height);
  placePov(width, height);
}

let frame = 0;
function scheduleLayout() {
  if (frame) window.cancelAnimationFrame(frame);
  frame = window.requestAnimationFrame(layout);
}

/** Runs `fn` once the image has its natural size. */
function whenLoaded(image, fn) {
  if (image.complete && image.naturalWidth) fn();
  else image.addEventListener('load', fn, { once: true });
}

/** Re-measure on the next frame — call after the wall text changes. */
export function relayoutHeroScene() {
  scheduleLayout();
}

/**
 * Wires up both scenes. Call once on index.html.
 */
export function initHeroScene() {
  refs.scene = document.getElementById('heroScene');
  refs.entranceImage = document.getElementById('heroSceneImage');
  refs.entranceArtwork = document.getElementById('heroArtwork');
  refs.bench = document.getElementById('benchSeat');
  refs.hint = document.getElementById('benchHint');
  refs.povImage = document.getElementById('povImage');
  refs.povArtwork = document.getElementById('povArtwork');
  refs.vinyl = document.getElementById('povVinyl');
  refs.label = document.getElementById('povLabel');

  if (!Object.values(refs).every(Boolean)) return; // not on this page

  whenLoaded(refs.entranceImage, layout);
  whenLoaded(refs.povImage, layout);
  window.addEventListener('resize', scheduleLayout);

  // Web fonts can reflow the page after load.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
}
