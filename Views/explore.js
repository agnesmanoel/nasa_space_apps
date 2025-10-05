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

/* =========================
   Drag horizontal (ignora áreas interativas)
   ========================= */
const SAFE_SELECTOR = ".hud-bar, #fs-toggle, button, input, a, [role='button']";

window.addEventListener("pointerdown", (e) => {
  if (e.target.closest(SAFE_SELECTOR)) return; // não inicia drag em áreas interativas
  dragging = true;
  startX = e.clientX;
  startScrollX = window.scrollX;
  dragDistance = 0;
  body.style.cursor = "grabbing";
});

window.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  e.preventDefault();
  const delta = (startX - e.clientX) * SPEED;
  const target = clampScroll(startScrollX + delta);
  window.scrollTo({ left: target });
  dragDistance += Math.abs(delta);
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  body.style.cursor = "default";
}
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);

/* =========================
   Clique para pular (ignora drag, HUD e botão FS)
   ========================= */
document.addEventListener("click", (e) => {
  if (dragDistance > 10 || dragging) return;
  if (e.target.closest(".hud-bar")) return;
  if (e.target.closest("#fs-toggle")) return;

  const STEP = 100;
  const dir = e.clientX > window.innerWidth / 2 ? 1 : -1;
  const next = clampScroll(window.scrollX + dir * STEP);
  window.scrollTo({ left: next, behavior: "smooth" });
});

/* =========================
   Setas do teclado
   ========================= */
document.addEventListener("keydown", (e) => {
  const STEP = 100;
  if (e.key === "ArrowRight")
    window.scrollTo({ left: clampScroll(window.scrollX + STEP), behavior: "smooth" });
  if (e.key === "ArrowLeft")
    window.scrollTo({ left: clampScroll(window.scrollX - STEP), behavior: "smooth" });
});

/* =========================
   Slider ⇄ meses ⇄ botões
   ========================= */
(function () {
  const range   = document.querySelector('.hud-range');
  const months  = Array.from(document.querySelectorAll('.hud-months span'));
  const prevBtn = document.querySelector('.nav-btn.left');
  const nextBtn = document.querySelector('.nav-btn.right');

  if (!range || months.length !== 12) return;

  let idx = parseInt(range.value, 10) || 0;
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function setMonth(newIdx, from = 'code') {
    idx = clamp(newIdx, 0, 11);
    if (from !== 'range') range.value = idx;
    months.forEach((el, i) => el.classList.toggle('active', i === idx));
  }

  months.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setMonth(i);
    });
  });

  range.addEventListener('input', () => setMonth(parseInt(range.value, 10), 'range'));

  function step(delta) { setMonth(idx + delta); }
  function holdRepeat(btn, delta) {
    if (!btn) return;
    let timer, fast;
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      step(delta);
      fast = setTimeout(() => { timer = setInterval(() => step(delta), 110); }, 350);
    });
    ['pointerup','pointerleave','pointercancel','blur'].forEach(ev =>
      btn.addEventListener(ev, () => { clearTimeout(fast); clearInterval(timer); })
    );
  }
  holdRepeat(prevBtn, -1);
  holdRepeat(nextBtn,  1);

  setMonth(idx);
})();
/* =========================
   Botão de Tela Cheia (versão única)
   ========================= */
(function () {
  const btn = document.getElementById('fs-toggle');
  if (!btn) return; // botão precisa existir no HTML (dentro do <body>, antes do <script>)

  const target = document.documentElement; // mude para document.body se preferir

  const isFS = () =>
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  function requestFS(el) {
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (!req) return;
    try {
      const p = req.call(el);
      if (p && typeof p.catch === 'function') p.catch(()=>{});
    } catch {}
  }

  function exitFS() {
    const ex =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (!ex) return;
    try {
      const p = ex.call(document);
      if (p && typeof p.catch === 'function') p.catch(()=>{});
    } catch {}
  }

  function updateUI(active){
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.setAttribute('aria-label', active ? 'Sair de tela cheia' : 'Entrar em tela cheia');
    btn.title = active ? 'Sair de tela cheia (F)' : 'Tela cheia (F)';
    btn.textContent = active ? '🗗' : '⛶';
  }

  // evita conflito com o clique global/drag
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    isFS() ? exitFS() : requestFS(target); // síncrono
  });

  // tecla F alterna fullscreen
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && !e.repeat) {
      e.preventDefault();
      isFS() ? exitFS() : requestFS(target);
    }
  });

  // sincroniza estado do botão
  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));

  updateUI(!!isFS());
})();
