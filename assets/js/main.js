/* =========================
   VISITOR WELCOME DIALOG + TRACKING
   ========================= */
(function visitorDialog() {

  // ── PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ──────────────────────
  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPVBLxNTwtnsP52xDU_roAX6RFKdcEkVwX06qbiVP-IXJF9HedugoY4BE5O2dshhTH/exec";
  // ─────────────────────────────────────────────────────────────────────────

  // Show once per browser session (clears on tab close)
  if (sessionStorage.getItem("vd_done")) return;

  /* ── Build dialog HTML ── */
  var overlay = document.createElement("div");
  overlay.id = "visitor-dialog-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "vd-title");

  overlay.innerHTML = [
    '<div class="vd-card">',
    '  <span class="vd-emoji" aria-hidden="true">👋</span>',
    '  <h2 class="vd-title" id="vd-title">Welcome to my Portfolio!</h2>',
    '  <p class="vd-sub">Hi there — glad you stopped by.</p>',
    '  <p class="vd-question">Are you visiting as a&nbsp;Recruiter?</p>',
    '  <div class="vd-btns">',
    '    <button class="vd-btn vd-btn-recruiter" id="vd-yes" autofocus>',
    '      <span class="vd-btn-icon" aria-hidden="true">💼</span>',
    '      Yes, I\'m a Recruiter',
    '    </button>',
    '    <button class="vd-btn vd-btn-other" id="vd-no">',
    '      <span class="vd-btn-icon" aria-hidden="true">🚀</span>',
    '      Just Browsing',
    '    </button>',
    '  </div>',
    '  <p class="vd-note">Your choice helps me understand who visits — no personal data collected.</p>',
    '</div>'
  ].join("\n");

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden"; // lock scroll

  /* ── Close + send ── */
  function done(type) {
    sessionStorage.setItem("vd_done", type);
    document.body.style.overflow = "";

    // Show quick thank-you before closing
    var card = overlay.querySelector(".vd-card");
    var icon = type === "recruiter" ? "🎉" : "😊";
    var msg  = type === "recruiter"
      ? "Thanks! Hope you find what you're looking for."
      : "Enjoy browsing!";
    card.innerHTML = [
      '<span class="vd-emoji vd-thanks" aria-hidden="true">' + icon + '</span>',
      '<p class="vd-title vd-thanks">' + msg + '</p>'
    ].join("\n");

    // Send data to Google Sheets (fire-and-forget)
    sendToSheet(type);

    // Fade out after 1.1 s
    setTimeout(function () {
      overlay.classList.add("vd-exit");
      setTimeout(function () { overlay.remove(); }, 400);
    }, 1100);
  }

  document.getElementById("vd-yes").addEventListener("click", function () { done("recruiter"); });
  document.getElementById("vd-no").addEventListener("click",  function () { done("non-recruiter"); });

  // ESC key → treat as "just browsing"
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") { done("non-recruiter"); document.removeEventListener("keydown", escHandler); }
  });

  /* ── Send to Google Apps Script ── */
  function sendToSheet(type) {
    if (!SCRIPT_URL || SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") return;

    try {
      var now = new Date();

      var date = now.getFullYear() + "-"
        + String(now.getMonth() + 1).padStart(2, "0") + "-"
        + String(now.getDate()).padStart(2, "0");

      var time = String(now.getHours()).padStart(2, "0") + ":"
        + String(now.getMinutes()).padStart(2, "0") + ":"
        + String(now.getSeconds()).padStart(2, "0");

      var timezone = (typeof Intl !== "undefined" && Intl.DateTimeFormat)
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "Unknown";

      var body = new URLSearchParams({
        type: type,
        date: date,
        time: time,
        timezone: timezone
      });

      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",         // avoids CORS preflight; response is opaque (that's fine)
        body: body
      }).catch(function () {});  // silent fail — never break the portfolio

    } catch (err) { /* silent */ }
  }

})();

// ======== EDIT THESE LINKS (important) ========
// Replace project "link" values with your real GitHub repo links.
// Replace LinkedIn/GitHub links in index.html too.

const projects = [
  {
    title: "NYC Taxi Demand Forecasting & Analytics Pipeline",
    desc: "Processed 10M+ trips, engineered 30+ features, improved forecast accuracy by 12%, built Power BI + Streamlit dashboards, automated refresh with AWS Glue + Lambda.",
    tech: ["Python", "SQL", "PostgreSQL", "Power BI", "Streamlit", "AWS Glue", "AWS Lambda"],
    link: "https://github.com/saivignesh-03",
    image: "assets/img/projects/nyc-taxi.jpg"
  },
  {
    title: "Citi Bike Demand Forecasting (Time Series Analysis)",
    desc: "Built SARIMA/Prophet models on 1M+ rides, identified seasonality with ~85% accuracy, proposed rebalancing strategy projected to cut costs by 15%.",
    tech: ["Python", "Time Series", "SARIMA", "Prophet"],
    link: "https://github.com/saivignesh-03",
    image: "assets/img/projects/citibike.png"
  },
  {
    title: "Insurance Renewal Prediction System",
    desc: "Trained Logistic Regression + XGBoost on 50K+ records, tracked 20+ experiments with MLflow/DagsHub improving precision/recall by ~10%.",
    tech: ["Python", "XGBoost", "MLflow"],
    link: "https://github.com/saivignesh-03",
    image: "assets/img/projects/insurance.jpg"
  },
  {
    title: "Bitcoin Price Prediction & Trading Analytics",
    desc: "Modeled crypto volatility, validated across rolling windows, simulated risk-aware strategies improving Sharpe Ratio vs buy-and-hold.",
    tech: ["Python", "Time Series", "Finance"],
    link: "https://github.com/saivignesh-03",
    image: "assets/img/projects/bitcoin.png"
  },
  {
    title: "Healthcare Analytics Database System",
    desc: "Designed normalized PostgreSQL schemas and built Python ETL pipelines populating 10+ analytical tables for reporting.",
    tech: ["PostgreSQL", "Data Modeling", "ETL", "Python"],
    link: "https://github.com/saivignesh-03",
    image: "assets/img/projects/healthcare.webp"
  }
];

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Escape helper (ONLY ONCE)
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Card renderer with fallback (prevents broken image icon)
function projectCard(p) {
  const title = escapeHtml(p.title);
  const desc = escapeHtml(p.desc);
  const techBadges = (p.tech || [])
    .map((t) => `<span class="badge">${escapeHtml(t)}</span>`)
    .join("");

  const imgBlock = p.image
    ? `
      <div class="thumb">
        <img
          src="${p.image}"
          alt="${title} thumbnail"
          loading="lazy"
          onerror="this.closest('.thumb').classList.add('thumb-fallback'); this.remove();"
        />
      </div>
    `
    : `<div class="thumb thumb-fallback"></div>`;

  return `
    <article class="card">
      ${imgBlock}
      <h3 style="margin-top:12px;">${title}</h3>
      <p>${desc}</p>
      <div class="badges">${techBadges}</div>
      <a href="${p.link}" target="_blank" rel="noreferrer">View repo →</a>
    </article>
  `;
}

// Render projects on index page (preview first 2)
const gridIndex = document.getElementById("projectsGrid");
if (gridIndex) {
  gridIndex.innerHTML = projects.map(projectCard).join("");

}

// Render all projects on projects page
const gridAll = document.getElementById("allProjectsGrid");
if (gridAll) {
  gridAll.innerHTML = projects.map(projectCard).join("");
}

/* ===== Super light parallax (performance-first) ===== */
/* ===== Ultra-fast parallax (no continuous loop) ===== */
(function setupMotionParallax() {
  const motionBg = document.querySelector(".motion-bg");
  if (!motionBg) return;

  // Skip on touch devices
  const isTouch =
    "ontouchstart" in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

  // Respect reduced motion preference
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isTouch || reduceMotion) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;

  // Don’t spam updates for tiny mouse jitter
  const THRESHOLD = 0.25;

  // Keep your parallax strength (not reduced)
  const STRENGTH_X = 18;
  const STRENGTH_Y = 12;

  // Cache viewport size (avoid recalculating on every move)
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  window.addEventListener(
    "resize",
    () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    },
    { passive: true }
  );

  function applyTransform() {
    motionBg.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    rafId = null;
  }

  function onMove(e) {
    if (document.hidden) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (clientX == null || clientY == null) return;

    const nextX = (clientX / vw - 0.5) * STRENGTH_X;
    const nextY = (clientY / vh - 0.5) * STRENGTH_Y;

    // Ignore very tiny changes
    if (Math.abs(nextX - targetX) < THRESHOLD && Math.abs(nextY - targetY) < THRESHOLD) {
      return;
    }

    targetX = nextX;
    targetY = nextY;

    // Schedule a single paint for this frame
    if (!rafId) rafId = requestAnimationFrame(applyTransform);
  }

  // Use pointermove (more efficient + modern)
  window.addEventListener("pointermove", onMove, { passive: true });

  // Reset when tab hidden (saves work)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      targetX = 0;
      targetY = 0;
      motionBg.style.transform = "translate3d(0,0,0)";
    }
  });
})();
/* =========================
   SCROLL REVEAL (IntersectionObserver)
   ========================= */
(function setupScrollReveal(){
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  // What should animate:
  // - each section
  // - each card
  // - grid wrappers (to stagger children)
  const targets = [
    ...document.querySelectorAll(".section"),
    ...document.querySelectorAll(".card"),
    ...document.querySelectorAll(".contact-card"),
    ...document.querySelectorAll(".profile-card"),
    ...document.querySelectorAll(".grid-2"),
  ];

  // Add base classes
  targets.forEach(el => {
    // Grids animate children with stagger
    if (el.classList.contains("grid-2")) {
      el.classList.add("reveal-stagger");
    } else {
      el.classList.add("reveal");
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
  entry.target.classList.add("in-view");
} else {
  entry.target.classList.remove("in-view");
}

    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -10% 0px"
  });

  targets.forEach(el => io.observe(el));
})();
/* =========================
   LIVE BACKGROUND PARTICLES
   ========================= */
(function motionParticles(){
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const host = document.querySelector(".motion-particles");
  if (!host) return;

  // avoid duplicating if hot reloaded or re-run
  if (host.dataset.ready === "1") return;
  host.dataset.ready = "1";

  const COUNT = 28; // bump to 40 if you want more (28 is smooth)

  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement("i");

    // random position
    const left = Math.random() * 100;
    const top = Math.random() * 100;

    // random float amounts
    const dx = (Math.random() * 120 - 60).toFixed(0) + "px";
    const dy = (Math.random() * 140 - 70).toFixed(0) + "px";

    // random duration + opacity + size
    const dur = (9 + Math.random() * 10).toFixed(2) + "s";
    const op = (0.08 + Math.random() * 0.22).toFixed(2);
    const size = (4 + Math.random() * 7).toFixed(0) + "px";

    dot.style.left = left + "%";
    dot.style.top = top + "%";
    dot.style.setProperty("--dx", dx);
    dot.style.setProperty("--dy", dy);
    dot.style.setProperty("--dur", dur);
    dot.style.setProperty("--op", op);
    dot.style.width = size;
    dot.style.height = size;

    // slight color variation (green/orange/white)
    const pick = Math.random();
    if (pick < 0.33) dot.style.background = "rgba(var(--motion-primary), 0.18)";
    else if (pick < 0.66) dot.style.background = "rgba(var(--motion-accent), 0.14)";
    else dot.style.background = "rgba(var(--motion-secondary), 0.14)";

    host.appendChild(dot);
  }
})();
