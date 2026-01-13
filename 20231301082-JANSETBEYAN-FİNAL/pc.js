/* ==================================================
   ELEMENTLER
================================================== */
const bottomScreen = document.getElementById("bottomScreen");
const consoleEl = document.querySelector(".console");
const toggle = document.getElementById("themeToggle");
const toggleText = toggle.querySelector(".toggle-text");
const mike = document.getElementById("mike");
const menuItems = document.querySelectorAll(".top-screen .menu-item");

/* ==================================================
   STATE
================================================== */
let carouselIndex = 0;
let darkMode = false;

/* ==================================================
   ABOUT ME
================================================== */
function openAbout() {
  bottomScreen.innerHTML = `
    <p>
      Hi there. I'm Janset, an architectural student in Mimar Sinan Fine Arts University.

This is my portfolio site for my arcitectural projects, my art, and the games I'm working on.

Currently, I'm working as a 2D game artist, but I also frequently do comic work. If any of my work catches your eye, feel free to contact me.
    </p>
  `;
}

/* ==================================================
   PORTFOLIO (ANA)
================================================== */
const mainPortfolioImages = [
  "imajlar/mimari.jpeg",
  "imajlar/resim.png",
  "imajlar/oyun.png"
];

function openPortfolio() {
  carouselIndex = 0;

  bottomScreen.innerHTML = `
    <div class="carousel-wrapper">

      <button class="carousel-arrow left" data-dir="-1">‹</button>

      <div class="carousel main-carousel" id="mainCarousel">
        ${mainPortfolioImages.map(
          (img, i) =>
            `<img src="${img}" data-index="${i}" class="carousel-item">`
        ).join("")}
      </div>

      <button class="carousel-arrow right" data-dir="1">›</button>

    </div>
  `;
}

/* ==================================================
   GAME CAROUSEL
================================================== */
function openGameCarousel() {
  carouselIndex = 0;

  bottomScreen.innerHTML = `
    <div class="carousel-wrapper">

      <button class="carousel-arrow left" data-dir="-1">‹</button>

      <div class="carousel game-carousel" id="gameCarousel">

        <div class="game-slide">
          <img src="imajlar/dy.png">
          <div class="game-info">
            <h4>Project:Riverbed</h4>
            <p>My current project, work in progress. A thriller mystery themed visual novel. Play as Rick, the generic angsty guy. After cutting almost all ties to your hometown you return for your childhood best friends funeral, until you start noticing the weirdness surrounding you.</p>
            <p>The little guy at the bottom is one of the game's protagonists.</p>
          </div>
          <div class="crt"></div>
        </div>

        <div class="game-slide">
          <img src="imajlar/Apartment of.png">
          <div class="game-info">
            <h4>Apartment Of Freaks</h4>
            <p>Horor movie cliches themed dating sim, currently available on itch.io. My latest gamejam entry. You play as a college age sucubus, trying to 'capture the feelings' of your new neighbors in the apartment, who are designed after the said cliches.</p>
          </div>
          <div class="crt"></div>
        </div>

        <div class="game-slide">
          <img src="imajlar/OjLjdU.png">
          <div class="game-info">
            <h4>Valere</h4>
            <p>First ever game design project I was a part of, made for a gamejam. Valere is a 2D to 3D style platformer. Available on itch.io.</p>
          </div>
          <div class="crt"></div>
        </div>

      </div>

      <button class="carousel-arrow right" data-dir="1">›</button>

    </div>
  `;
}

/* ==================================================
   CLICK ROUTER (TEK)
================================================== */
bottomScreen.addEventListener("click", (e) => {

  /* OKLAR → CAROUSEL */
  const arrow = e.target.closest(".carousel-arrow");
  if (arrow) {
    const dir = Number(arrow.dataset.dir);
    const carousel = arrow.parentElement.querySelector(".carousel");
    const total = carousel.children.length;

    carouselIndex = (carouselIndex + dir + total) % total;
    carousel.style.transform =
      `translateX(-${carouselIndex * 100}%)`;
    return;
  }

  /* ANA PORTFOLIO TIK */
  const mainItem = e.target.closest(".carousel-item");
  if (mainItem) {
    const index = Number(mainItem.dataset.index);

    if (index === 0 || index === 1) {
      bottomScreen.innerHTML = `
        <div class="empty-screen">
          Sorry, but this page is currently empty.
        </div>
      `;
      return;
    }

    if (index === 2) {
      openGameCarousel();
      return;
    }
  }

  /* OYUN INFO AKORDİYON */
  const slide = e.target.closest(".game-slide");
  if (slide) {
    const isOpen = slide.classList.contains("open");

    document.querySelectorAll(".game-slide.open")
      .forEach(s => s.classList.remove("open"));

    if (!isOpen) slide.classList.add("open");
  }
});

/* ==================================================
   MENU
================================================== */
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const page = item.dataset.page;
    if (page === "about") openAbout();
    if (page === "portfolio") openPortfolio();
  });
});

/* ==================================================
   DARK / LIGHT MODE
================================================== */
toggle.addEventListener("click", () => {
  darkMode = !darkMode;

  if (darkMode) {
    consoleEl.style.backgroundImage = "url('imajlar/3ds_dark.png')";
    toggle.classList.add("light");
    toggleText.textContent = "LIGHT MODE";
  } else {
    consoleEl.style.backgroundImage = "url('imajlar/3ds.png')";
    toggle.classList.remove("light");
    toggleText.textContent = "DARK MODE";
  }
});

/* ==================================================
   MIKE – DRAG + THROW (AYNEN KORUNDU)
================================================== */
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

let velocityX = 0;
let velocityY = 0;

const gravity = 0.7;
const bounce = 0.45;
const friction = 0.995;

let lastMouseX = 0;
let lastMouseY = 0;
let throwSamples = [];
const maxSamples = 5;

let groundY = 0;
let dropHeight = 0;
let hasFirstImpact = false;

window.addEventListener("load", () => {
  groundY = mike.offsetTop;
});

/* TUT */
mike.addEventListener("mousedown", (e) => {
  isDragging = true;
  mike.classList.add("dragging");
  document.body.classList.add("dragging");

  const rect = mike.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  throwSamples = [];

  velocityX = 0;
  velocityY = 0;

  dropHeight = mike.offsetTop;
  hasFirstImpact = false;
});

/* SÜRÜKLE */
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const parentRect = consoleEl.getBoundingClientRect();
  const newLeft = e.clientX - parentRect.left - offsetX;
  const newTop = e.clientY - parentRect.top - offsetY;

  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;

  throwSamples.push({ x: dx, y: dy });
  if (throwSamples.length > maxSamples) throwSamples.shift();

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  mike.style.left = newLeft + "px";
  mike.style.top = newTop + "px";
});

/* BIRAK */
document.addEventListener("mouseup", () => {
  if (!isDragging) return;

  isDragging = false;
  mike.classList.remove("dragging");
  document.body.classList.remove("dragging");

  let avgX = 0;
  let avgY = 0;

  throwSamples.forEach(v => {
    avgX += v.x;
    avgY += v.y;
  });

  avgX /= throwSamples.length || 1;
  avgY /= throwSamples.length || 1;

  velocityX = avgX * 1.4;
  velocityY = avgY * 1.4 - 2;

  throwSamples = [];
  requestAnimationFrame(fall);
});

/* DÜŞME */
function fall() {
  let top = mike.offsetTop;
  let left = mike.offsetLeft;

  velocityY += gravity;

  if (Math.abs(velocityY) < 0.5) velocityX *= friction;

  top += velocityY;
  left += velocityX;

  if (top >= groundY) {
    top = groundY;

    if (!hasFirstImpact) {
      velocityY = -12;
      hasFirstImpact = true;
    } else {
      velocityY = -velocityY * bounce;
    }

    if (Math.abs(velocityY) < 0.8 && Math.abs(velocityX) < 0.4) {
      velocityX = 0;
      velocityY = 0;
      mike.style.top = groundY + "px";
      return;
    }
  }

  mike.style.top = top + "px";
  mike.style.left = left + "px";

  requestAnimationFrame(fall);
}

/* ==================================================
   MAIN BUTTON → INDEX
================================================== */
const mainBtn = document.getElementById("mainBtn");

if (mainBtn) {
  mainBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
