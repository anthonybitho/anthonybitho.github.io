/* ============================================================
   portfolio.js — Anthony Bitho
   Effets : scroll reveal, nav active, barres XP,
            effet machine à écrire, back-to-top, easter egg
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Scroll reveal ──────────────────────────────────── */
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Lance les barres XP si la section compétences est visible
          if (entry.target.id === "competences") initXPBars();
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((s) => observer.observe(s));

  /* ── 2. Nav — lien actif au scroll ────────────────────── */
  const navLinks = document.querySelectorAll("nav a");

  function updateActiveNav() {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === "#" + current
      );
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ── 3. Barres XP compétences ──────────────────────────── */
  // Données : [nom, niveau 0-100]
  const skills = [
    ["HTML / CSS", 85],
    ["JavaScript", 70],
    ["Git / GitHub", 75],
    ["Figma", 60],
    ["Canvas / Game", 65],
  ];

  function buildXPBars() {
    // On injecte les barres dans la première carte compétences
    const cards = document.querySelectorAll(".grid-competences .card");
    if (!cards.length) return;

    // On crée une section dédiée après les cards
    const wrap = document.createElement("div");
    wrap.id = "xp-section";
    wrap.style.cssText =
      "margin-top:1.5rem;display:grid;gap:.8rem;";

    skills.forEach(([name, val]) => {
      const row = document.createElement("div");
      row.innerHTML = `
        <div class="xp-label"><span>${name}</span><span>${val} XP</span></div>
        <div class="xp-bar-wrap">
          <div class="xp-bar" data-xp="${val}"></div>
        </div>`;
      wrap.appendChild(row);
    });

    const competSection = document.getElementById("competences");
    if (competSection) competSection.appendChild(wrap);
  }

  let xpDone = false;
  function initXPBars() {
    if (xpDone) return;
    xpDone = true;
    // Petite pause pour que la CSS soit appliquée
    requestAnimationFrame(() => {
      document.querySelectorAll(".xp-bar").forEach((bar) => {
        const xp = bar.dataset.xp;
        setTimeout(() => (bar.style.width = xp + "%"), 80);
      });
    });
  }

  buildXPBars(); // construit la structure (invisible jusqu'au scroll)

  /* ── 4. Effet machine à écrire sur le sous-titre header ── */
  const subtitle = document.querySelector("header p");
  if (subtitle) {
    const original = subtitle.textContent.trim();
    subtitle.textContent = "";
    let i = 0;
    const typeInterval = setInterval(() => {
      subtitle.textContent += original[i];
      i++;
      if (i >= original.length) clearInterval(typeInterval);
    }, 55);
  }

  /* ── 5. Back-to-top button ─────────────────────────────── */
  const btn = document.createElement("button");
  btn.id = "back-top";
  btn.textContent = "▲ TOP";
  btn.setAttribute("aria-label", "Retour en haut");
  document.body.appendChild(btn);

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 400),
    { passive: true }
  );

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ── 6. Smooth scroll sur les liens nav ────────────────── */
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ── 7. Hover pixel sur les cards ─────────────────────── */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", () => pixelSound());
    card.addEventListener("click", () => ripple(card));
  });

  /* petit "bruit" visuel pixel au survol */
  function pixelSound() {
    // Pas de vrai son sans user gesture, on fait un micro-flash
    // géré uniquement via CSS (hover déjà défini)
  }

  /* ripple pixel (carrés qui explosent) */
  function ripple(el) {
    const colors = ["#00e5ff", "#ff2d78", "#ffe600"];
    const rect = el.getBoundingClientRect();
    for (let k = 0; k < 6; k++) {
      const px = document.createElement("span");
      const size = 6 + Math.random() * 8;
      px.style.cssText = `
        position:fixed;
        width:${size}px;height:${size}px;
        background:${colors[k % colors.length]};
        left:${rect.left + Math.random() * rect.width}px;
        top:${rect.top + Math.random() * rect.height}px;
        pointer-events:none;
        z-index:9998;
        opacity:1;
        transition:transform .5s ease,opacity .5s ease;
        image-rendering:pixelated;
      `;
      document.body.appendChild(px);
      requestAnimationFrame(() => {
        px.style.transform = `translate(${(Math.random() - 0.5) * 80}px,${(Math.random() - 0.5) * 80}px) rotate(${Math.random() * 180}deg)`;
        px.style.opacity = "0";
      });
      setTimeout(() => px.remove(), 600);
    }
  }

  /* ── 8. Easter egg Konami code ─────────────────────────── */
  const KONAMI = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a",
  ];
  let kIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === KONAMI[kIndex]) {
      kIndex++;
      if (kIndex === KONAMI.length) {
        kIndex = 0;
        activateEasterEgg();
      }
    } else {
      kIndex = 0;
    }
  });

  function activateEasterEgg() {
    const msg = document.createElement("div");
    msg.style.cssText = `
      position:fixed;inset:0;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      background:rgba(0,0,0,.92);
      color:#ffe600;font-family:'Press Start 2P',monospace;
      font-size:.75rem;line-height:2.2;
      z-index:10000;text-align:center;padding:2rem;
      cursor:pointer;
    `;
    msg.innerHTML = `
      <div style="font-size:2rem;margin-bottom:1rem">★</div>
      KONAMI CODE !<br>
      <span style="color:#00e5ff">+9999 XP</span> GAGNÉS !<br><br>
      <span style="font-size:.55rem;color:#7878aa">Cliquer pour fermer</span>
    `;
    document.body.appendChild(msg);
    msg.addEventListener("click", () => msg.remove());
    // mini anim rainbow
    let hue = 0;
    const raf = setInterval(() => {
      hue = (hue + 3) % 360;
      msg.style.borderTop = `4px solid hsl(${hue},100%,60%)`;
    }, 30);
    setTimeout(() => { clearInterval(raf); msg.remove(); }, 5000);
  }

  /* ── 9. Année footer auto ──────────────────────────────── */
  const footer = document.querySelector("footer");
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace(
      /\d{4}/,
      new Date().getFullYear()
    );
  }
})();
