"use strict";

// the hero: Life on a torus, drawn a pixel a cell with fading trails as cellar's trails mode does
(function () {
  const CELL = 6;
  const RATE = 15;
  const canvas = document.getElementById("life");
  const hero = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const genEl = document.getElementById("gen");
  const popEl = document.getElementById("pop");
  const toggle = document.getElementById("toggle");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const BG = [13, 16, 21];
  const TRAIL = [50, 115, 86];
  const LIVE = [95, 212, 160];

  let cols = 0, rows = 0, cells, next, heat, image, gen = 0, pop = 0;
  let playing = !still, visible = true, last = 0, carry = 0;

  function build() {
    cols = Math.ceil(hero.clientWidth / CELL);
    rows = Math.ceil(hero.clientHeight / CELL);
    canvas.width = cols;
    canvas.height = rows;
    canvas.style.width = cols * CELL + "px";
    canvas.style.height = rows * CELL + "px";
    cells = new Uint8Array(cols * rows);
    next = new Uint8Array(cols * rows);
    heat = new Uint8Array(cols * rows);
    image = ctx.createImageData(cols, rows);
    gen = 0;
    soup(0, 0, cols, rows, 0.22);
    if (still) { for (let i = 0; i < 80; i++) step(); }
    draw();
  }

  function soup(x0, y0, w, h, p) {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        if (Math.random() < p) { set(x, y); }
      }
    }
  }

  function set(x, y) {
    const i = ((y + rows) % rows) * cols + ((x + cols) % cols);
    cells[i] = 1;
    heat[i] = 255;
  }

  function step() {
    let n = 0;
    for (let y = 0; y < rows; y++) {
      const up = ((y + rows - 1) % rows) * cols, mid = y * cols, dn = ((y + 1) % rows) * cols;
      for (let x = 0; x < cols; x++) {
        const l = (x + cols - 1) % cols, r = (x + 1) % cols;
        const s = cells[up + l] + cells[up + x] + cells[up + r] + cells[mid + l] + cells[mid + r] + cells[dn + l] + cells[dn + x] + cells[dn + r];
        const i = mid + x;
        const alive = s === 3 || (s === 2 && cells[i] === 1) ? 1 : 0;
        next[i] = alive;
        if (alive) { heat[i] = 255; n++; } else { heat[i] = heat[i] * 0.86; }
      }
    }
    [cells, next] = [next, cells];
    gen++;
    pop = n;
    // a settled soup gets a fresh patch, away from the copy on the left
    if (pop < cols * rows * 0.025) {
      const w = 24 + Math.floor(Math.random() * 24);
      soup(Math.floor(cols * (0.45 + Math.random() * 0.4)), Math.floor(Math.random() * rows), w, w, 0.4);
    }
  }

  function draw() {
    const d = image.data;
    for (let i = 0, o = 0; i < cells.length; i++, o += 4) {
      if (cells[i]) { d[o] = LIVE[0]; d[o + 1] = LIVE[1]; d[o + 2] = LIVE[2]; }
      else {
        const t = heat[i] / 255;
        d[o] = BG[0] + (TRAIL[0] - BG[0]) * t;
        d[o + 1] = BG[1] + (TRAIL[1] - BG[1]) * t;
        d[o + 2] = BG[2] + (TRAIL[2] - BG[2]) * t;
      }
      d[o + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    genEl.textContent = gen.toLocaleString("en-US");
    popEl.textContent = pop.toLocaleString("en-US");
  }

  function frame(now) {
    if (playing && visible) {
      carry += Math.min(now - last, 250);
      while (carry >= 1000 / RATE) { step(); carry -= 1000 / RATE; }
      draw();
    }
    last = now;
    requestAnimationFrame(frame);
  }

  function paint(e) {
    const box = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - box.left) / CELL), y = Math.floor((e.clientY - box.top) / CELL);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (Math.random() < 0.5) { set(x + dx, y + dy); }
      }
    }
    draw();
  }

  function show() { toggle.textContent = playing ? "❚❚" : "▶"; toggle.setAttribute("aria-label", playing ? "Pause" : "Play"); }

  let down = false;
  canvas.addEventListener("pointerdown", (e) => { down = true; canvas.setPointerCapture(e.pointerId); paint(e); });
  canvas.addEventListener("pointermove", (e) => { if (down) { paint(e); } });
  canvas.addEventListener("pointerup", () => { down = false; });
  toggle.addEventListener("click", () => { playing = !playing; show(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  let width = hero.clientWidth;
  addEventListener("resize", () => {
    if (Math.abs(hero.clientWidth - width) > 40) { width = hero.clientWidth; build(); }
  });

  build();
  show();
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(frame); });
})();

// the rule presets switch the example beside them
(function () {
  const RULES = {
    "life": {
      img: "life.png",
      alt: "A Gosper glider gun firing a stream of gliders",
      rule: "B3/S23",
      text: "Life and its relatives: Life-like, Generations, isotropic non-totalistic and Larger-than-Life rules, with weighted kernels up to radius 16.",
    },
    "gray-scott": {
      img: "gray-scott.png",
      alt: "Gray-Scott mitosis, a ring of dividing spots",
      rule: "F=0.0367,k=0.0649",
      text: "Gray-Scott reaction-diffusion, stepped in exact integers so the CPU and the GPU give the same cells. The library holds seeds for spots, stripes and mitosis.",
    },
    "lenia": {
      img: "lenia.png",
      alt: "Hydrogeminium natans, a Lenia creature, drawn on a rainbow colour map",
      rule: "R=18,T=10,b=[1/2,1,2/3],m=0.26,s=0.036",
      text: "Bert Chan's Lenia, continuous automata with smooth kernels up to radius 64. Chakazul's creatures are in the pattern library, their values kept exactly.",
    },
  };
  const img = document.getElementById("rule-img");
  const str = document.getElementById("rule-str");
  const text = document.getElementById("rule-text");
  const tabs = document.querySelectorAll(".presets button");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    const r = RULES[tab.dataset.rule];
    tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
    img.src = r.img;
    img.alt = r.alt;
    str.textContent = r.rule;
    text.textContent = r.text;
  }));
})();

// download links point straight at the latest release's archives, the releases page until then
(function () {
  const links = document.querySelectorAll(".downloads a");
  const ua = navigator.userAgent;
  const os = /Windows/.test(ua) ? "windows" : /Mac/.test(ua) ? "darwin" : /Linux/.test(ua) && !/Android/.test(ua) ? "linux" : null;
  if (os) {
    const mine = [...links].filter((a) => a.dataset.asset.startsWith(os));
    if (mine.length) { mine[0].classList.add("mine"); }
  }
  fetch("https://api.github.com/repos/octalide/cellar/releases/latest")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rel) => {
      document.getElementById("version").textContent = rel.tag_name;
      links.forEach((a) => {
        const asset = rel.assets.find((x) => x.name.includes("-" + a.dataset.asset + "."));
        if (asset) { a.href = asset.browser_download_url; }
      });
    })
    .catch(() => {});
})();
