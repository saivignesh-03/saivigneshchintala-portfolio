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
