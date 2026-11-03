/**
 * main.js
 * ---------------------------------------------------------------
 * Entry point loaded by every page via:
 *   <script type="module" src="js/main.js"></script>
 *
 * It reads which page is currently active from
 * <body data-page="..."> and initializes exactly the shared
 * shell (sidebar/topbar) plus whatever that page needs.
 *
 * NOTE: because this uses native ES modules, the site must be
 * served over http(s) rather than opened directly as a file://
 * URL. See README.md for a one-line local server command.
 * ---------------------------------------------------------------
 */

import { initShell } from './navigation.js';
import { initGalleryGrid, initProjectDetail } from './gallery.js';
import { initHeroScene } from './hero-scene.js';
import { initHeroTour } from './hero-tour.js';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';

  initShell(page);

  switch (page) {
    case 'home':
      initHeroScene(); // keeps artwork, bench and wall labels glued to the photos
      initHeroTour();  // entrance → sit down → looping tour of the paintings
      break;
    case 'gallery':
      initGalleryGrid();
      break;
    case 'project':
      initProjectDetail();
      break;
    default:
      // about / experience / contact are fully static —
      // nothing further to initialize.
      break;
  }
});
