const logo = document.querySelector(".logo");

let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

/* DRAG START */
logo.addEventListener("mousedown", (e) => {
  isDragging = true;
  logo.style.cursor = "grabbing";

  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
});

/* DRAG END */
document.addEventListener("mouseup", () => {
  isDragging = false;
  logo.style.cursor = "grab";
});

/* DRAG MOVE */
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  currentX = e.clientX - startX;
  currentY = e.clientY - startY;

  logo.style.transform =
    `translate(${currentX}px, ${currentY}px)`;
});

/* NAVIGATION */
document.querySelectorAll(".user").forEach(user => {
  if (user.classList.contains("disabled")) return;

  user.addEventListener("click", () => {
    const target = user.dataset.target;
    if (!target) return;
    window.location.href = target;
  });
});
