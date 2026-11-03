/**
 * gallery.js
 * ---------------------------------------------------------------
 * The single source of truth for project content, plus the
 * rendering logic for every page that displays it:
 *   - index.html    → js/hero-tour.js     (the hero tour reads PROJECTS from here)
 *   - gallery.html   → initGalleryGrid()   (the filterable collection grid)
 *   - project.html   → initProjectDetail() (a single project's full page)
 *
 * TO ADD OR EDIT A PROJECT: change the PROJECTS array below.
 * Nothing else needs to change — the hero, the grid and the
 * detail page all read from this one list.
 * ---------------------------------------------------------------
 */

import { fadeSwap } from './animations.js';

/**
 * Project schema
 * ---------------------------------------------------------------
 * Required:  id, name, tag, accent, color, year, short, desc, lessons
 * Optional rows: role, tech (hidden when omitted)
 * Optional:  context   → extra "Context" row (e.g. "Team project · 3 people")
 *            duration  → "Duration" row (row is hidden when omitted)
 *            cover     → image used on the gallery card (falls back to the accent color)
 *            artwork   → image hung inside the painting on the home page
 *                        (falls back to an abstract gradient in the accent color)
 *            screens   → real screenshots shown on the project page:
 *                        [{ src, title, caption }, ...]
 *            screenStyle → 'raw'     = plain phone screenshots, drawn inside a CSS phone frame
 *                          'framed'  = phone images that already include the bezel
 *                          'desktop' = web screenshots, shown in a browser window
 *            repo / demo → URLs. A missing or '#' repository is shown as "on request".
 *            demoLabel → text for the demo link (default "Live demo")
 *            linksNote → replaces the links with a short note (e.g. code owned by the client)
 *            qr        → QR image shown next to the links on large screens
 */
export const PROJECTS = [
  {
    id: 'moneymind',
    name: 'MoneyMind',
    tag: 'mobile',
    accent: 'emerald',
    color: '#1E5B45',
    year: '2026',
    cover: 'assets/images/moneymind-cover.jpg',
    artwork: 'assets/images/artworks/moneymind.jpg',
    short: 'Mobile app to log personal expenses and understand where the month went.',
    desc: 'MoneyMind is a mobile app for tracking personal spending. Log an expense in seconds, review everything you have spent, and read a monthly summary with a chart, a category breakdown and a comparison against the previous month.',
    role: 'Full Stack Developer & Team Lead',
    context: 'Team project',
    duration: 'Semester project',
    tech: 'React Native, Firebase, TypeScript',
    repo: '#',
    demo: 'https://bm00n-21.github.io/App-MoneyMind/',
    demoLabel: 'Download the Android app',
    qr: 'assets/images/moneymind-apk-qr.svg',
    lessons: 'A total on its own says very little. The monthly comparison does the real work: it shows the change against last month and warns plainly when spending goes up, so the number leads to a decision.',
    screenStyle: 'raw',
    screens: [
      { src: 'assets/images/moneymind/moneymind-01-summary.webp', title: 'Monthly summary', caption: 'The month’s total, a comparison against the previous month with a plain warning when spending rises, and a chart of where the money went.' },
      { src: 'assets/images/moneymind/moneymind-02-expenses.webp', title: 'My expenses', caption: 'Every expense with its category, amount and timestamp, a running total, and one-tap deletion.' },
      { src: 'assets/images/moneymind/moneymind-03-add-expense.webp', title: 'Add expense', caption: 'Amount and category are the only two fields, so logging a purchase takes a few seconds.' },
      { src: 'assets/images/moneymind/moneymind-04-summary-detail.webp', title: 'Category breakdown', caption: 'Each category carries the same color as its slice in the chart, so the list and the chart read as one.' },
      { src: 'assets/images/moneymind/moneymind-05-profile.webp', title: 'Profile', caption: 'Account profile with photo and name, password change and sign out.' },
      { src: 'assets/images/moneymind/moneymind-06-sign-in.webp', title: 'Sign in', caption: 'Email and password sign-in, with account creation one tap away.' },
    ],
  },
  {
    id: 'palewia',
    name: 'Palewia',
    tag: 'mobile',
    accent: 'pine',
    color: '#0F6B5C',
    year: '2026',
    cover: 'assets/images/palewia-cover.jpg',
    artwork: 'assets/images/artworks/palewia.jpg',
    short: 'iOS app that keeps patient and doctor connected after the appointment.',
    desc: 'Palewia is an iOS app for post-consultation follow-up between patient and medical staff. It brings the health summary, nutrition plan, clinical history, prescriptions and a temporary chat with the care team into one calm place, designed for two roles: patient and medical staff.',
    role: 'iOS app — Swift & SwiftUI',
    context: 'UANL iOS Development Lab · Team of 3',
    duration: 'Semester project',
    tech: 'Swift, SwiftUI, Xcode',
    linksNote: 'Built for the UANL iOS Development Lab — not published.',
    lessons: 'The 24-hour chat is a deliberate constraint. It lets a patient ask a small question without turning the app into an open support channel, and keeps the clinical record as the single source of truth.',
    screenStyle: 'framed',
    screens: [
      { src: 'assets/images/palewia/palewia-01-home.webp', title: 'Home', caption: 'Health summary at a glance: current weight and height, an automatically calculated BMI, and a reminder of the next appointment.' },
      { src: 'assets/images/palewia/palewia-02-home-progress.webp', title: 'Progress & activity', caption: 'Weekly nutrition-plan tracking and the latest changes to the patient’s record.' },
      { src: 'assets/images/palewia/palewia-03-sidebar.webp', title: 'Navigation', caption: 'Personal information, every section of the app, and a direct line to support if something fails.' },
      { src: 'assets/images/palewia/palewia-04-nutrition.webp', title: 'My nutrition', caption: 'The plan prepared by the nutritionist, daily personal records that feed the home screen, and quick access to the daily diet.' },
      { src: 'assets/images/palewia/palewia-05-clinical-history.webp', title: 'Clinical history', caption: 'A searchable, downloadable record, the latest prescription one tap away, and entries grouped by type of consultation.' },
      { src: 'assets/images/palewia/palewia-06-prescriptions.webp', title: 'My prescriptions', caption: 'Quick access to the latest prescription and a history of past treatments.' },
      { src: 'assets/images/palewia/palewia-07-messages.webp', title: 'Messages', caption: 'A temporary 24-hour chat with the doctor or care staff for small questions that should not overload the medical system.' },
    ],
  },
  {
    id: 'airbnb-admin',
    name: 'Airbnb Admin',
    tag: 'web',
    accent: 'walnut',
    color: '#5B3A1A',
    year: '2026',
    cover: 'assets/images/airbnb-admin-cover.jpg',
    artwork: 'assets/images/artworks/airbnb-admin.jpg',
    short: 'Booking site and administration panel for a short-term rental in Playa del Carmen.',
    desc: 'A complete system for a short-term rental apartment in Playa del Carmen. The public site, shared with anyone interested, shows photos, live availability and a price range, and lets visitors get a quote and request a booking. Behind it, an administration panel lets the owner track bookings on a calendar and a searchable table, follow each stay from reservation to check-out, read occupancy and income statistics, review an activity log of every change, and edit the public listing.',
    role: 'Full Stack Developer — solo project',
    context: 'Personal project · Real client · Playa del Carmen',
    duration: 'About 1 month',
    tech: 'React, Recharts, FullCalendar',
    repo: '#',
    demo: 'https://sergio-rentals.vercel.app',
    demoLabel: 'Visit the live site',
    lessons: 'Status is the heartbeat of the panel. Every stay moves from reserved to cleaning, in use and checked out, and the same colors carry through the calendar and the table, so the apartment’s state reads at a glance.',
    screenStyle: 'desktop',
    screens: [
      { src: 'assets/images/airbnb/airbnb-public-01-listing.webp', title: 'Public site — listing', caption: 'The page shared with the public: a photo gallery of the apartment and its description.' },
      { src: 'assets/images/airbnb/airbnb-public-02-availability.webp', title: 'Public site — availability & quote', caption: 'Live availability by day, a price range per night, a quote form and a direct WhatsApp contact to request the booking.' },
      { src: 'assets/images/airbnb/airbnb-01-dashboard.webp', title: 'Admin — dashboard', caption: 'Active and total reservations, the next check-in and check-out, and monthly occupancy at a glance.' },
      { src: 'assets/images/airbnb/airbnb-02-calendar.webp', title: 'Admin — calendar', caption: 'Every booking on a monthly calendar, color-coded by the status of the stay.' },
      { src: 'assets/images/airbnb/airbnb-03-reservations.webp', title: 'Admin — reservations', caption: 'A searchable, filterable table of bookings with their status and a quick edit action.' },
      { src: 'assets/images/airbnb/airbnb-04-statistics.webp', title: 'Admin — statistics', caption: 'Reservations, nights booked, occupancy and estimated income, plus the strongest season of the year.' },
      { src: 'assets/images/airbnb/airbnb-05-monthly-charts.webp', title: 'Admin — monthly charts', caption: 'Reservations and income per month across the whole year.' },
      { src: 'assets/images/airbnb/airbnb-06-activity-log.webp', title: 'Admin — activity log', caption: 'Every action taken by an administrator — who changed what, and when.' },
      { src: 'assets/images/airbnb/airbnb-07-settings.webp', title: 'Admin — settings', caption: 'The public listing’s name, description, contact and location, edited in one place.' },
    ],
  },
  {
    id: 'n9',
    name: 'N9 — Policy & Sales Management',
    tag: 'web',
    accent: 'deepblue',
    color: '#1F3556',
    year: '2025',
    cover: 'assets/images/n9-cover.jpg',
    artwork: 'assets/images/artworks/n9.jpg',
    short: 'Prototype of a policy and sales management system for an insurance agency.',
    desc: 'A prototype of a policy and sales management system for N9 Asociados, an insurance agency. It covers the whole cycle: clients and policies, with renewals and cancellations; a sales pipeline of leads, quotes and a call schedule; payments, receipts and commissions; seller performance and ranking; and priority alerts with user roles and permissions.',
    role: 'Project Manager · Full Stack Developer',
    context: 'Academic prototype for a real client · Team of 3',
    duration: 'Semester project (Aug–Dec 2025)',
    tech: 'Next.js, React, JavaScript, Python',
    linksNote: 'The prototype and its source code belong to the client.',
    lessons: 'Every module mirrors a step of the agency’s day: a lead becomes a quote, a quote becomes a policy, and a policy comes up for renewal. Following the business instead of the database is what kept such a wide scope easy to navigate.',
    screenStyle: 'desktop',
    screens: [
      { src: 'assets/images/policies/policies-01-dashboard.webp', title: 'Dashboard', caption: 'Active policies, registered clients, active leads and monthly sales, with sales and renewals-versus-cancellations charts and upcoming expirations.' },
      { src: 'assets/images/policies/policies-02-prospects-table.webp', title: 'Leads table', caption: 'Every lead with its contact, insurance type, status, priority and assigned seller — searchable, filterable and exportable.' },
      { src: 'assets/images/policies/policies-03-sales-agent-profile.webp', title: 'Agent profile', caption: 'A seller’s active leads, conversions and ranking, next to the leads assigned to them.' },
      { src: 'assets/images/policies/policies-04-call-schedule.webp', title: 'Call schedule', caption: 'A calendar of follow-up calls and today’s schedule, by priority and status.' },
      { src: 'assets/images/policies/policies-05-payments.webp', title: 'Payments', caption: 'Payment status and history across policies, with totals for completed and pending payments.' },
      { src: 'assets/images/policies/policies-06-payment-receipt.webp', title: 'Payment receipt', caption: 'A payment receipt ready to email, print or download as PDF.' },
      { src: 'assets/images/policies/policies-07-seller-performance.webp', title: 'Seller performance', caption: 'Monthly sales, distribution by insurance type and performance metrics for each seller.' },
      { src: 'assets/images/policies/policies-08-seller-ranking.webp', title: 'Seller ranking', caption: 'Sellers ranked by sales, total premium and goal completion.' },
      { src: 'assets/images/policies/policies-09-priority-alerts.webp', title: 'Priority alerts', caption: 'Critical, urgent and important alerts: renewals, overdue payments and leads to follow up.' },
    ],
  },
];

export const ACCENTS = {
  emerald:  { soft: 'var(--emerald-soft)',  main: 'var(--emerald)' },
  pine:     { soft: 'var(--pine-soft)',     main: 'var(--pine)' },
  walnut:   { soft: 'var(--walnut-soft)',   main: 'var(--walnut)' },
  amber:    { soft: 'var(--amber-soft)',    main: 'var(--amber)' },
  deepblue: { soft: 'var(--deepblue-soft)', main: 'var(--deepblue)' },
  purple:   { soft: 'var(--purple-soft)',   main: 'var(--purple)' },
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
];

/** Builds the abstract gradient used as a project's "artwork". */
export function artworkGradient(accentHex) {
  return `radial-gradient(120% 100% at 20% 15%, ${accentHex}CC 0%, transparent 55%),
          radial-gradient(120% 120% at 85% 80%, ${accentHex}88 0%, transparent 60%),
          linear-gradient(160deg, #F7F5F2 0%, #EDEBE7 100%)`;
}

/* ============================================================
   GALLERY — filterable collection grid
   ============================================================ */
export function initGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  const filterBar = document.getElementById('filterBar');
  if (!grid || !filterBar) return; // not on this page

  let activeFilter = 'all';

  function renderFilters() {
    filterBar.innerHTML = FILTERS.map((f) => `<button type="button" class="filter-btn ${f.id === activeFilter ? 'active' : ''}" data-f="${f.id}">${f.label}</button>`).join('');
    filterBar.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.f;
        renderFilters();
        renderGrid();
      });
    });
  }

  /** One collection card. Projects with a `cover` get a photographic card;
   *  the rest keep the tinted accent-color card. */
  function cardMarkup(p) {
    const hasCover = Boolean(p.cover);
    const variant = hasCover ? 'gcard--image' : `gcard--tint ${p.accent}`;
    const backdrop = hasCover
      ? `<img class="gcard-image" src="${p.cover}" alt="" loading="lazy"><div class="gcard-scrim"></div>`
      : '<div class="gc-swatch"></div>';
    return `
      <a class="gcard ${variant}" href="project.html?id=${p.id}" style="--gcard-accent:${p.color}">
        ${backdrop}
        <div class="gc-top">
          <span class="gc-year">${p.year}</span>
          <span class="gc-arrow">→</span>
        </div>
        <div class="gcard-info">
          <h3>${p.name}</h3>
          <p>${p.short}</p>
        </div>
      </a>
    `;
  }

  function renderGrid() {
    const items = PROJECTS.filter((p) => activeFilter === 'all' || p.tag === activeFilter);
    grid.innerHTML = items.map(cardMarkup).join('');
  }

  renderFilters();
  renderGrid();
}

/* ============================================================
   PROJECT DETAIL — single project page
   ============================================================ */
function phoneScreen(project, variant) {
  const c = project.color;
  if (variant === 'overview') {
    return `
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <div class="ps-label">Overview</div>
        <div class="ps-big">${project.name}</div>
        <div class="ps-sub">${project.short}</div>
        <div class="ps-chart">
          ${[38, 62, 44, 70, 52, 80, 60].map((h) => `<span style="height:${h}%; background:${c}"></span>`).join('')}
        </div>
        <div class="ps-list">
          <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Design</span><span>—</span></div>
          <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Engineering</span><span>—</span></div>
          <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Delivery</span><span>—</span></div>
        </div>
      </div>
    `;
  }
  return `
    <div class="phone-notch"></div>
    <div class="phone-screen">
      <div class="ps-label">Summary</div>
      <div class="ps-donut" style="background:conic-gradient(${c} 0% 72%, rgba(255,255,255,0.12) 72% 100%)">
        <span>72%</span>
      </div>
      <div class="ps-list">
        <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Category A</span><span>—</span></div>
        <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Category B</span><span>—</span></div>
        <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Category C</span><span>—</span></div>
        <div class="ps-row"><span class="ps-name"><span class="ps-dot" style="background:${c}"></span>Category D</span><span>—</span></div>
      </div>
    </div>
  `;
}

/** One row of the project's metadata column. Hidden when there is no value. */
function metaRow(label, valueHtml) {
  if (!valueHtml) return '';
  return `
    <div class="pd-meta-row">
      <div>
        <div class="pd-meta-label">${label}</div>
        <div class="pd-meta-val">${valueHtml}</div>
      </div>
    </div>`;
}

/** A real link when a URL is set; otherwise a quiet "on request" note,
 *  so the page never shows a dead "#" link. */
function linkMarkup(label, url, color) {
  if (url && url !== '#') {
    return `<a href="${url}" style="color:${color}" target="_blank" rel="noopener">${label} ↗</a>`;
  }
  return `<span class="pd-link-muted">${label} — on request</span>`;
}

/** The "Links" row: a note, or the demo/download link + repository (+ QR). */
function linksMarkup(project) {
  if (project.linksNote) return `<span class="pd-link-muted">${project.linksNote}</span>`;
  const rows = [];
  if (project.demo && project.demo !== '#') rows.push(linkMarkup(project.demoLabel || 'Live demo', project.demo, project.color));
  rows.push(linkMarkup('Repository', project.repo, project.color));
  const qr = project.qr
    ? `<figure class="pd-qr"><img src="${project.qr}" alt="QR code: ${project.demoLabel || 'open the demo'}"><figcaption>Scan with your phone</figcaption></figure>`
    : '';
  return rows.join('<br>') + qr;
}

/** One phone in the screenshot viewer. `position` is "front" or "back". */
function screenshotPhone(screen, project, position) {
  const alt = position === 'front' ? `${project.name} — ${screen.title}` : '';
  if (project.screenStyle === 'desktop') {
    // Web screenshot inside a minimal browser window (one window, no "back" device).
    return `
      <div class="browser-frame">
        <div class="browser-frame__bar" aria-hidden="true"><span></span><span></span><span></span></div>
        <img src="${screen.src}" alt="${alt}">
      </div>`;
  }
  if (project.screenStyle === 'framed') {
    // The image already includes the phone bezel.
    return `<img class="phone-shot ${position}" src="${screen.src}" alt="${alt}">`;
  }
  // Plain screenshot: draw it inside the CSS phone frame.
  return `
    <div class="phone ${position}">
      <div class="phone-notch"></div>
      <div class="phone-screen phone-screen--shot"><img src="${screen.src}" alt="${alt}"></div>
    </div>`;
}

/** Interactive viewer for projects that ship real screenshots. */
function screenViewerMarkup(project) {
  return `
    <div class="pd-visual" style="background:${ACCENTS[project.accent].soft}">
      <div class="phones${project.screenStyle === 'desktop' ? ' phones--desktop' : ''}" id="pdPhones"></div>
    </div>
    <div class="pd-caption" id="pdCaption" aria-live="polite"></div>
    <div class="thumb-strip" id="pdThumbs">
      ${project.screens.map((s, i) => `
        <button type="button" class="thumb thumb--shot${project.screenStyle === 'desktop' ? ' thumb--wide' : ''}" data-i="${i}" aria-label="Show screen: ${s.title}">
          <img src="${s.src}" alt="" loading="lazy">
        </button>`).join('')}
    </div>`;
}

/** Wires the screenshot viewer: thumbnails, caption and arrow keys. */
function initScreenViewer(project) {
  const phones = document.getElementById('pdPhones');
  const caption = document.getElementById('pdCaption');
  const thumbs = document.querySelectorAll('#pdThumbs .thumb');
  const screens = project.screens;
  let current = 0;

  // Warm the cache so switching screens never flashes empty.
  screens.forEach((s) => { const img = new Image(); img.src = s.src; });

  function paint() {
    const front = screens[current];
    const back = screens[(current + 1) % screens.length];
    const showBack = screens.length > 1 && project.screenStyle !== 'desktop';
    phones.innerHTML = (showBack ? screenshotPhone(back, project, 'back') : '')
      + screenshotPhone(front, project, 'front');
    caption.innerHTML = `
      <span class="pd-caption-count" style="color:${project.color}">${String(current + 1).padStart(2, '0')} / ${String(screens.length).padStart(2, '0')}</span>
      <strong>${front.title}</strong>
      <span>${front.caption}</span>`;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
  }

  function show(index, animate = true) {
    current = (index + screens.length) % screens.length;
    if (animate) fadeSwap(phones, paint); else paint();
  }

  thumbs.forEach((t) => t.addEventListener('click', () => show(parseInt(t.dataset.i, 10))));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  show(0, false);
}

/** Decorative placeholder visual for projects without real screenshots. */
function placeholderViewerMarkup(project) {
  return `
    <div class="pd-visual" style="background:${ACCENTS[project.accent].soft}">
      <div class="phones">
        <div class="phone back">${phoneScreen(project, 'detail')}</div>
        <div class="phone front">${phoneScreen(project, 'overview')}</div>
      </div>
    </div>
    <div class="thumb-strip">
      ${[0, 1, 2, 3].map((i) => `<div class="thumb" style="background:linear-gradient(135deg, ${project.color}${i % 2 ? '33' : '22'}, ${project.color}11)"></div>`).join('')}
    </div>`;
}

export function initProjectDetail() {
  const room = document.getElementById('projectRoom');
  if (!room) return; // not on this page

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const project = PROJECTS.find((p) => p.id === requestedId) || PROJECTS[0];
  const index = PROJECTS.findIndex((p) => p.id === project.id);
  const hasScreens = Array.isArray(project.screens) && project.screens.length > 0;

  document.title = `${project.name} — Ángel Rosas`;

  room.innerHTML = `
    <a class="pd-back" href="gallery.html">← Back to gallery</a>
    <div class="pd-layout">
      <div class="pd-info">
        <div class="pd-room" style="color:${project.color}">${String(index + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</div>
        <h2>${project.name}</h2>
        <p class="pd-desc">${project.desc}</p>
        <div class="pd-rule" style="background:${project.color}"></div>
        <div class="pd-meta">
          ${metaRow('Role', project.role)}
          ${metaRow('Context', project.context)}
          ${metaRow('Duration', project.duration)}
          ${metaRow('Technologies', project.tech)}
          ${metaRow('Links', linksMarkup(project))}
        </div>
        <div class="pd-lessons">
          <div class="pd-meta-label">Lessons learned</div>
          <p>${project.lessons}</p>
        </div>
      </div>

      <div class="pd-stage">
        ${hasScreens ? screenViewerMarkup(project) : placeholderViewerMarkup(project)}
      </div>
    </div>
  `;

  if (hasScreens) initScreenViewer(project);
}
