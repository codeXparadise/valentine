const isMobileDevice =
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.matchMedia("(pointer: coarse)").matches;

let celebrationLocked = false;

function createCelebrationOverlay() {
  const existingOverlay = document.querySelector("#celebrate-overlay");
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.className = "celebrate-overlay";
  overlay.id = "celebrate-overlay";
  overlay.innerHTML = `
    <div class="firework-stage" id="firework-stage"></div>
    <button class="celebrate-close" id="celebrate-close" type="button" aria-label="Close">×</button>
    <div class="envelope-wrap" id="envelope-wrap">
      <h2>Tap the Envelope</h2>
      <p>Your letter is waiting inside</p>
      <div class="envelope-scene" id="envelope-scene">
        <div class="letter-paper" id="letter-paper">
          <h3>My Love</h3>
          <p>
            You are my peace, my smile, and my forever favorite person.
            Every day with you feels like magic. I love you endlessly.
          </p>
          <p class="tap-note">Tap letter to reveal your couple coupon</p>
        </div>
        <div class="envelope-icon" id="envelope-icon" role="button" aria-label="Open envelope"></div>
      </div>
    </div>
    <div class="ticket-wrap" id="ticket-wrap">
      <div class="ticket-card">
        <h2>Ticket for Dilzy</h2>
        <p>Special Couple</p>
        <p>Get unlimited hugs and kiss</p>
        <p>Validity: Unlimited</p>
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

function wireSmoothNavigation() {
  document.querySelectorAll("a[href]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;

      if (href === "yes.html") {
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

document.addEventListener("DOMContentLoaded", () => {
  const loader = createLoader();

  preloadInternalLinks();
  wireNoButtons();
  wireSmoothNavigation();

  window.addEventListener("load", () => {
    loader.classList.add("hidden");
    document.body.classList.add("page-loaded");
  });
});