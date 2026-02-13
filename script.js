const isMobileDevice =
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.matchMedia("(pointer: coarse)").matches;

let celebrationLocked = false;
const THEME_STORAGE_KEY = "valentine-theme";
const DEFAULT_CONFIG = {
  meta: {
    siteTitle: "valentine",
  },
  person: {
    name: "Dilzy",
  },
  pages: {
    index: {
      title: "Do you love me? 🤗",
      subtitle: "I'm all yours",
    },
    no1: {
      title: "Please think again! 🙄",
      subtitle: "itni jaldi na matt bolo😥",
    },
    no2: {
      title: "Ek aur baar Soch lo! 😣",
      subtitle: "kyu aisa kar rahi ho Plzzz Man jao😣",
    },
    no3: {
      title: "Baby Man jao na! Kitna bhav khaogi 😭",
      subtitle: "bhut glt baat hai yrr😭",
    },
    yes: {
      title: "I knew it! You Love me a lot 😘",
    },
  },
  celebration: {
    envelopeTitle: "Tap the Envelope",
    envelopeSubtitle: "Your letter is waiting inside",
    letter: {
      title: "My Love",
      body: "You are my peace, my smile, and my forever favorite person. Every day with you feels like magic. I love you endlessly.",
      tapHint: "Tap letter to reveal your couple coupon",
    },
    ticket: {
      title: "Ticket for {name}",
      line1: "Special Couple",
      line2: "Get unlimited hugs and kiss",
      line3: "Validity: Unlimited",
    },
  },
};

let appConfig = DEFAULT_CONFIG;

function replaceTokens(text, values) {
  return String(text || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

async function loadConfig() {
  try {
    const response = await fetch("./config.json", { cache: "no-store" });
    if (!response.ok) return DEFAULT_CONFIG;
    const json = await response.json();
    return {
      ...DEFAULT_CONFIG,
      ...json,
      meta: { ...DEFAULT_CONFIG.meta, ...(json.meta || {}) },
      person: { ...DEFAULT_CONFIG.person, ...(json.person || {}) },
      pages: { ...DEFAULT_CONFIG.pages, ...(json.pages || {}) },
      celebration: {
        ...DEFAULT_CONFIG.celebration,
        ...(json.celebration || {}),
        letter: {
          ...DEFAULT_CONFIG.celebration.letter,
          ...(json.celebration?.letter || {}),
        },
        ticket: {
          ...DEFAULT_CONFIG.celebration.ticket,
          ...(json.celebration?.ticket || {}),
        },
      },
    };
  } catch (_) {
    return DEFAULT_CONFIG;
  }
}

function applyPageConfig(config) {
  const pageKey = document.body.dataset.page;
  const pageConfig = config.pages?.[pageKey];
  if (!pageConfig) return;

  const titleNode = document.querySelector('[data-role="title"]');
  const subtitleNode = document.querySelector('[data-role="subtitle"]');

  if (titleNode && pageConfig.title) titleNode.textContent = pageConfig.title;
  if (subtitleNode && pageConfig.subtitle) subtitleNode.textContent = pageConfig.subtitle;
  if (config.meta?.siteTitle) document.title = config.meta.siteTitle;
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch (_) {
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (_) {
  }

  const toggleIcon = document.querySelector(".theme-toggle-icon");
  if (toggleIcon) toggleIcon.textContent = theme === "dark" ? "☀️" : "🌙";
}

function createThemeToggle() {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "theme-toggle";
  toggle.setAttribute("aria-label", "Toggle dark and light mode");
  toggle.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">🌙</span>';

  toggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    setTheme(nextTheme);
  });

  document.body.appendChild(toggle);
}

function createCelebrationOverlay() {
  const existingOverlay = document.querySelector("#celebrate-overlay");
  if (existingOverlay) existingOverlay.remove();

  const personName = appConfig.person?.name || "Dilzy";
  const celebration = appConfig.celebration || DEFAULT_CONFIG.celebration;
  const letter = celebration.letter || DEFAULT_CONFIG.celebration.letter;
  const ticket = celebration.ticket || DEFAULT_CONFIG.celebration.ticket;

  const overlay = document.createElement("div");
  overlay.className = "celebrate-overlay";
  overlay.id = "celebrate-overlay";
  overlay.innerHTML = `
    <div class="firework-stage" id="firework-stage"></div>
    <button class="celebrate-close" id="celebrate-close" type="button" aria-label="Close">×</button>
    <div class="envelope-wrap" id="envelope-wrap">
      <h2>${celebration.envelopeTitle}</h2>
      <p>${celebration.envelopeSubtitle}</p>
      <div class="envelope-scene" id="envelope-scene">
        <div class="letter-paper" id="letter-paper">
          <h3>${letter.title}</h3>
          <p>
            ${letter.body}
          </p>
          <p class="tap-note">${letter.tapHint}</p>
        </div>
        <div class="envelope-icon" id="envelope-icon" role="button" aria-label="Open envelope"></div>
      </div>
    </div>
    <div class="ticket-wrap" id="ticket-wrap">
      <div class="ticket-card">
        <h2>${replaceTokens(ticket.title, { name: personName })}</h2>
        <p>${ticket.line1}</p>
        <p>${ticket.line2}</p>
        <p>${ticket.line3}</p>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeButton = overlay.querySelector("#celebrate-close");
  closeButton.addEventListener("click", () => {
    overlay.classList.remove("active");
    setTimeout(() => {
      overlay.remove();
      celebrationLocked = false;
    }, 260);
  });

  const envelopeIcon = overlay.querySelector("#envelope-icon");
  envelopeIcon.addEventListener("click", () => {
    overlay.querySelector("#envelope-wrap")?.classList.add("letter-out");
  });

  const letterPaper = overlay.querySelector("#letter-paper");
  letterPaper.addEventListener("click", () => {
    overlay.querySelector("#envelope-wrap")?.classList.remove("show");
    overlay.querySelector("#ticket-wrap")?.classList.add("show");
  });

  return overlay;
}

function burstAt(stage, x, y) {
  const colors = ["#ffe066", "#ff7ab7", "#8df1ff", "#ffffff", "#ffa2a2"];

  const core = document.createElement("div");
  core.className = "firework-core";
  core.style.left = `${x}px`;
  core.style.top = `${y}px`;
  stage.appendChild(core);

  for (let index = 0; index < 26; index += 1) {
    const particle = document.createElement("span");
    particle.className = "firework-particle";
    const angle = (Math.PI * 2 * index) / 26;
    const distance = 35 + Math.random() * 120;
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;
    particle.style.setProperty("--dx", `${deltaX}px`);
    particle.style.setProperty("--dy", `${deltaY}px`);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    stage.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1050);
  }

  setTimeout(() => {
    core.remove();
  }, 700);
}

function runCelebrationFlow() {
  if (celebrationLocked) return;
  celebrationLocked = true;

  const overlay = createCelebrationOverlay();
  const fireworkStage = overlay.querySelector("#firework-stage");
  const envelopeWrap = overlay.querySelector("#envelope-wrap");

  overlay.classList.add("active");

  let bursts = 0;
  const burstTimer = setInterval(() => {
    const x = Math.floor(window.innerWidth * (0.2 + Math.random() * 0.6));
    const y = Math.floor(window.innerHeight * (0.18 + Math.random() * 0.4));
    burstAt(fireworkStage, x, y);
    bursts += 1;

    if (bursts > 8) {
      clearInterval(burstTimer);
      setTimeout(() => {
        envelopeWrap.classList.add("show");
      }, 420);
    }
  }, 180);
}

function createLoader() {
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = '<div class="loader-heart" aria-label="Loading"></div>';
  document.body.prepend(loader);
  return loader;
}

function preloadInternalLinks() {
  const links = Array.from(document.querySelectorAll("a[href]"));
  const internalPaths = new Set();

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;
    internalPaths.add(href);
  });

  internalPaths.forEach((path) => {
    const preload = document.createElement("link");
    preload.rel = "prefetch";
    preload.href = path;
    document.head.appendChild(preload);
  });
}

function getNoButtonBounds(button) {
  const margin = 12;
  const container = document.querySelector(".container");
  const gif = document.querySelector(".container .tenor-gif-embed");

  const containerRect = container?.getBoundingClientRect();
  const gifRect = gif?.getBoundingClientRect();

  const left = containerRect
    ? Math.max(margin, Math.floor(containerRect.left))
    : margin;
  const right = containerRect
    ? Math.min(window.innerWidth - margin, Math.floor(containerRect.right))
    : window.innerWidth - margin;

  const minTopFromGif = gifRect
    ? Math.floor(gifRect.bottom + 10)
    : margin;
  const containerTop = containerRect
    ? Math.floor(containerRect.top + 10)
    : margin;
  const containerBottom = containerRect
    ? Math.floor(containerRect.bottom - 10)
    : window.innerHeight - margin;

  const top = Math.max(margin, minTopFromGif, containerTop);
  const bottom = Math.min(window.innerHeight - margin, containerBottom);

  const maxX = Math.max(left, right - button.offsetWidth);
  const maxY = Math.max(top, bottom - button.offsetHeight);

  if (top > maxY) {
    return {
      minX: margin,
      maxX: Math.max(margin, window.innerWidth - button.offsetWidth - margin),
      minY: Math.min(window.innerHeight - button.offsetHeight - margin, minTopFromGif),
      maxY: Math.max(
        Math.min(window.innerHeight - button.offsetHeight - margin, minTopFromGif),
        window.innerHeight - button.offsetHeight - margin
      ),
    };
  }

  return {
    minX: left,
    maxX,
    minY: top,
    maxY,
  };
}

function randomizeNoButton(button) {
  const bounds = getNoButtonBounds(button);
  const rangeX = Math.max(0, bounds.maxX - bounds.minX);
  const rangeY = Math.max(0, bounds.maxY - bounds.minY);
  const nextX = bounds.minX + Math.floor(Math.random() * (rangeX + 1));
  const nextY = bounds.minY + Math.floor(Math.random() * (rangeY + 1));

  button.style.position = "fixed";
  button.style.left = `${nextX}px`;
  button.style.top = `${nextY}px`;
  button.classList.remove("dodge");
  void button.offsetWidth;
  button.classList.add("dodge");
}

function wireNoButtons() {
  const noButtons = document.querySelectorAll(".no-btn, #move-random");
  if (!noButtons.length) return;

  noButtons.forEach((button) => {
    if (isMobileDevice) {
      randomizeNoButton(button);

      button.addEventListener("click", (event) => {
        event.preventDefault();
        randomizeNoButton(button);
      });

      button.addEventListener("touchstart", (event) => {
        event.preventDefault();
        randomizeNoButton(button);
      }, { passive: false });
    } else if (button.id === "move-random") {
      button.addEventListener("mouseenter", () => {
        randomizeNoButton(button);
      });
    }
  });
}

function isYesLink(anchor, href) {
  if (anchor.classList.contains("yes-btn")) return true;

  try {
    const parsedUrl = new URL(href, window.location.href);
    const path = parsedUrl.pathname.toLowerCase();
    return path.endsWith("/yes") || path.endsWith("/yes.html");
  } catch (_) {
    const cleanedHref = String(href || "").toLowerCase().replace(/^\.\//, "");
    return cleanedHref === "yes" || cleanedHref === "yes.html";
  }
}

function wireSmoothNavigation() {
  document.querySelectorAll("a[href]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;

      if (isYesLink(anchor, href)) {
        event.preventDefault();
        runCelebrationFlow();
        return;
      }

      if (isMobileDevice && anchor.classList.contains("no-btn")) {
        event.preventDefault();
        randomizeNoButton(anchor);
        return;
      }

      event.preventDefault();
      document.body.style.opacity = "0";
      document.body.style.transform = "translateY(10px)";
      setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const loader = createLoader();
  createThemeToggle();
  setTheme(getInitialTheme());
  appConfig = await loadConfig();
  applyPageConfig(appConfig);

  preloadInternalLinks();
  wireNoButtons();
  wireSmoothNavigation();

  window.addEventListener("load", () => {
    loader.classList.add("hidden");
    document.body.classList.add("page-loaded");
  });
});