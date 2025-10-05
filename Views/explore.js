// === Centraliza ao carregar ===
window.addEventListener("load", () => {
  const bg = document.querySelector(".background-scroll-container");
  if (!bg) return;
  const containerW = bg.offsetWidth || 3000;
  const center = Math.max(0, containerW - window.innerWidth) / 2;
  window.scrollTo({ left: center });
});

const bg = document.querySelector(".background-scroll-container");
const body = document.body;
let dragging = false;
let startX = 0;        // posição do ponteiro no início do gesto
let startScrollX = 0;  // scrollX no início do gesto
let dragDistance = 0;  // px acumulados para distinguir clique de arrasto
const SPEED = 1.5;

// util para limitar dentro do fundo (0 .. max)
function clampScroll(x) {
  const containerW = (bg && bg.offsetWidth) || 3000;
  const max = Math.max(0, containerW - window.innerWidth);
  return Math.min(Math.max(0, x), max);
}

// ===== Mouse/Touch via Pointer Events =====
window.addEventListener("pointerdown", (e) => {
  dragging = true;
  startX = e.clientX;
  startScrollX = window.scrollX; // base absoluta
  dragDistance = 0;
  body.style.cursor = "grabbing";
});

window.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  e.preventDefault(); // evita seleção
  const delta = (startX - e.clientX) * SPEED;
  const target = clampScroll(startScrollX + delta); // recalculado sempre
  window.scrollTo({ left: target });                // sem acumular erro
  dragDistance += Math.abs(delta);
});

window.addEventListener("pointerup", () => {
  dragging = false;
  body.style.cursor = "default";
});

window.addEventListener("pointercancel", () => {
  dragging = false;
  body.style.cursor = "default";
});

// ===== Clique para pular (ignora se houve arrasto ou se clicou no HUD) =====
document.addEventListener("click", (e) => {
  if (dragDistance > 10 || dragging) return;           // tratou como arrasto
  if (e.target.closest(".hud-bar")) return;            // não dispara sobre o HUD

  const STEP = 100; // ajuste se quiser maior/menor (ex.: window.innerWidth * 0.2)
  const dir = e.clientX > window.innerWidth / 2 ? 1 : -1;
  const next = clampScroll(window.scrollX + dir * STEP);
  window.scrollTo({ left: next, behavior: "smooth" });
});

// ===== Setas do teclado =====
document.addEventListener("keydown", (e) => {
  const STEP = 100;
  if (e.key === "ArrowRight")
    window.scrollTo({ left: clampScroll(window.scrollX + STEP), behavior: "smooth" });
  if (e.key === "ArrowLeft")
    window.scrollTo({ left: clampScroll(window.scrollX - STEP), behavior: "smooth" });
});

// ====== Binding slider ⇄ meses ⇄ botões (não altera seu código de scroll) ======
(function () {
  const range   = document.querySelector('.hud-range');
  const months  = Array.from(document.querySelectorAll('.hud-months span'));
  const prevBtn = document.querySelector('.nav-btn.left');
  const nextBtn = document.querySelector('.nav-btn.right');

  if (!range || months.length !== 12) return;

  // estado
  let idx = parseInt(range.value, 10) || 0;

  function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

  function setMonth(newIdx, from = 'code') {
    idx = clamp(newIdx, 0, 11);
    // 1) atualiza slider
    if (from !== 'range') range.value = idx;
    // 2) atualiza destaque dos meses
    months.forEach((el, i) => el.classList.toggle('active', i === idx));
  }

  // clique em um mês → move slider
  months.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation(); // evita qualquer handler global
      setMonth(i);
    });
  });

  // mover slider → atualiza mês ativo
  range.addEventListener('input', () => setMonth(parseInt(range.value, 10), 'range'));

    // botões < > → mudam mês
    function step(delta) { setMonth(idx + delta); }

    // segurando o botão repete (responsivo)
    // (um passo no pointerdown; NENHUM handler de 'click' para evitar passo duplo)
    function holdRepeat(btn, delta) {
    if (!btn) return;
    let timer, fast;
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        step(delta); // passo imediato
        fast = setTimeout(() => {
        timer = setInterval(() => step(delta), 110);
        }, 350);
    });
    ['pointerup','pointerleave','pointercancel','blur'].forEach(ev =>
        btn.addEventListener(ev, () => { clearTimeout(fast); clearInterval(timer); })
    );
    }
  holdRepeat(prevBtn, -1);
  holdRepeat(nextBtn,  1);

  // inicializa destaque
  setMonth(idx);
})();
