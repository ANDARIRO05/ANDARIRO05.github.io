/**
 * navigation.js
 * ---------------------------------------------------------------
 * Builds the sidebar and mobile topbar once, from a single list
 * of nav items, and injects them into every page. This keeps the
 * navigation markup (and its "active" logic) in exactly one place
 * instead of duplicated across seven HTML files.
 *
 * Each page just needs:
 *   <header class="topbar" id="shell-topbar"></header>
 *   <nav class="topbar-menu" id="shell-topbar-menu"></nav>
 *   <aside class="sidebar" id="shell-sidebar"></aside>
 *   <body data-page="home"> (or "gallery" / "project" / "about" / …)
 * ---------------------------------------------------------------
 */

export const NAV_ITEMS = [
  { label: 'Gallery',    href: 'index.html',      pages: ['home', 'gallery', 'project'] },
  { label: 'About',      href: 'about.html',      pages: ['about'] },
  { label: 'Experience', href: 'experience.html', pages: ['experience'] },
  { label: 'Contact',    href: 'contact.html',    pages: ['contact'] },
];

function buildNavLinks(activePage) {
  return NAV_ITEMS.map((item) => {
    const isActive = item.pages.includes(activePage);
    return `<a class="nav-item${isActive ? ' active' : ''}" href="${item.href}"><span class="dot"></span>${item.label}</a>`;
  }).join('');
}

/**
 * Renders the sidebar (desktop) and topbar + mobile menu (small
 * screens), and marks the link matching the current page active.
 * Call once per page, passing the page's data-page value.
 */
/**
 * The "AR" monogram is an outlined SVG (not text), so browser translators
 * leave it alone, and it links back to the home page.
 */
export function initShell(activePage) {
  const sidebar = document.getElementById('shell-sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <a class="logo" href="index.html" aria-label="Home — Ángel Rosas" translate="no"><img src="assets/icons/logo-ar.svg" alt="" width="32" height="16"></a>
      <nav>${buildNavLinks(activePage)}</nav>
      <div class="sidebar-foot">© 2026 Ángel Rosas<br>Software engineering, curated.</div>
    `;
  }

  const topbar = document.getElementById('shell-topbar');
  if (topbar) {
    topbar.innerHTML = `
      <a class="logo" href="index.html" aria-label="Home — Ángel Rosas" translate="no"><img src="assets/icons/logo-ar.svg" alt="" width="32" height="16"></a>
      <button class="topbar-toggle" id="topbarToggle" aria-label="Toggle menu">Menu</button>
    `;
  }

  const topbarMenu = document.getElementById('shell-topbar-menu');
  if (topbarMenu) {
    topbarMenu.innerHTML = buildNavLinks(activePage);
  }

  initMobileMenu();
}

/** Wires up the mobile "Menu" toggle button. */
export function initMobileMenu() {
  const toggle = document.getElementById('topbarToggle');
  const menu = document.getElementById('shell-topbar-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close the menu automatically once a destination is chosen.
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}
