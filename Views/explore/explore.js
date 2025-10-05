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
let startX = 0;
let startScrollX = 0;
let dragDistance = 0;
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
const SAFE_SELECTOR = ".hud-bar, #fs-toggle, #toggleMuteBtn, #backBtn, #beeFab, button, input, a, [role='button'], .flower, #flower-modal, .flower-modal-backdrop, #side-tip";

window.addEventListener("pointerdown", (e) => {
  if (e.target.closest(SAFE_SELECTOR)) return;
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
   Clique para pular (ignora drag e áreas UI)
   ========================= */
document.addEventListener("click", (e) => {
  if (dragDistance > 10 || dragging) return;
  if (e.target.closest(".hud-bar")) return;
  if (e.target.closest("#fs-toggle")) return;
  if (e.target.closest("#toggleMuteBtn")) return;
  if (e.target.closest("#backBtn")) return;

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
   Slider ⇄ Meses ⇄ Anos (2026/2027) ⇄ Botões
   ========================= */
(function () {
  const range      = document.querySelector('.hud-range');
  const months     = Array.from(document.querySelectorAll('.hud-months span'));
  const yearPills  = Array.from(document.querySelectorAll('.hud-year span'));
  const prevBtn    = document.querySelector('.nav-btn.left');
  const nextBtn    = document.querySelector('.nav-btn.right');

  if (!range || months.length !== 12 || yearPills.length !== 2) return;

  // anos fixos (só 2026 e 2027)
  const years = yearPills.map(el => parseInt(el.dataset.year, 10)); // [2026, 2027]

  // estado
  let mIdx = parseInt(range.value, 10) || 0; // 0..11
  let yIdx = Math.max(0, yearPills.findIndex(el => el.classList.contains('active')));
  if (yIdx < 0) yIdx = 0; // default 2026

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function setYear(newYIdx){
    yIdx = clamp(newYIdx, 0, yearPills.length - 1);
    yearPills.forEach((el, i) => el.classList.toggle('active', i === yIdx));
  }

  function setMonth(newIdx, from = 'code') {
    mIdx = clamp(newIdx, 0, 11);
    if (from !== 'range') range.value = mIdx;
    months.forEach((el, i) => el.classList.toggle('active', i === mIdx));
  }

  // clique direto nas pílulas de ano
  yearPills.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setYear(i);
    });
  });

  // clique nos meses
  months.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setMonth(i);
    });
  });

  // slider
  range.addEventListener('input', () => setMonth(parseInt(range.value, 10), 'range'));

  // setas com rollover de ano entre Jan/Dez
  function step(delta) {
    let nextM = mIdx + delta;

    if (nextM < 0) {
      if (yIdx > 0) { setYear(yIdx - 1); nextM = 11; }
      else nextM = 0; // trava em Jan do primeiro (2026)
    } else if (nextM > 11) {
      if (yIdx < yearPills.length - 1) { setYear(yIdx + 1); nextM = 0; }
      else nextM = 11; // trava em Dez do último (2027)
    }

    setMonth(nextM);
  }

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

  // teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft')  step(-1);
  });

  // init
  setYear(yIdx);  // marca 2026 ativo
  setMonth(mIdx); // mantém mês do slider
})();

/* =========================
   Botão de Tela Cheia (ícones iguais às outras telas)
   ========================= */
(function () {
  const btn = document.getElementById('fs-toggle');
  if (!btn) return;

  const target = document.documentElement;
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
    try { const p = req.call(el); p?.catch?.(()=>{}); } catch {}
  }

  function exitFS() {
    const ex =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (!ex) return;
    try { const p = ex.call(document); p?.catch?.(()=>{}); } catch {}
  }

  function updateUI(active){
    const i = btn.querySelector('i');
    i.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
    btn.setAttribute('aria-label', active ? 'Sair de tela cheia' : 'Tela cheia');
    btn.title = active ? 'Sair de tela cheia (F)' : 'Tela cheia (F)';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    isFS() ? exitFS() : requestFS(target);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && !e.repeat) {
      e.preventDefault();
      isFS() ? exitFS() : requestFS(target);
    }
  });

  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));

  updateUI(!!isFS());
})();

/* =========================
   Cartão lateral (direita) — independente do modal
   ========================= */
(function(){
  const tip   = document.getElementById('side-tip');
  const okBtn = document.getElementById('side-tip-ok');
  if (!tip || !okBtn) return;

  function show(){
    tip.hidden = false;
    requestAnimationFrame(()=> tip.classList.add('is-open'));
  }
  function hide(){
    tip.classList.remove('is-open');
    setTimeout(()=> tip.hidden = true, 240);
  }
  okBtn.addEventListener('click', hide);
  window.sideTip = { show, hide };
})();

// Mostra o side-tip automaticamente (sem modal)
window.addEventListener('load', () => {
  setTimeout(() => window.sideTip?.show(), 300);
});

/* =========================
   NOVO: Som sincronizado + Voltar (controla possível vídeo de fundo)
   ========================= */
(function(){
  const STORAGE_KEYS = { muted: 'bee_audio_muted', volume: 'bee_audio_volume' };
  const muteBtn = document.getElementById('toggleMuteBtn');
  const backBtn = document.getElementById('backBtn');
  const bgVideo = document.getElementById('bg-video'); // pode ser null nesta tela (fundo por imagem)

  function setMuteIcon(isMuted){
    if (!muteBtn) return;
    muteBtn.title = isMuted ? 'Ativar som' : 'Silenciar';
    muteBtn.setAttribute('aria-label', muteBtn.title);
    const waves = muteBtn.querySelector('.waves');
    if (waves) waves.style.opacity = isMuted ? '0.45' : '1';
    muteBtn.style.filter = isMuted ? 'grayscale(10%) brightness(0.95)' : 'none';
  }

  function applyAudioState(isMuted, volume){
    if (!bgVideo) return; // nesta página não tem vídeo — apenas mantém o estado salvo
    bgVideo.muted = isMuted;
    bgVideo.volume = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 1));
    if (!isMuted) { try { bgVideo.play()?.catch(()=>{}); } catch {} }
  }

  // Restaurar estado salvo
  (function restoreAudioState(){
    const savedMuted  = localStorage.getItem(STORAGE_KEYS.muted);
    const savedVolume = parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
    const isMuted = savedMuted === 'true' || savedMuted === null; // padrão: mutado
    const vol = Number.isFinite(savedVolume) ? savedVolume : 1;
    setMuteIcon(isMuted);
    applyAudioState(isMuted, vol);
  })();

  // Alternar e persistir
  muteBtn?.addEventListener('click', () => {
    const currentMuted = localStorage.getItem(STORAGE_KEYS.muted) === 'true' || localStorage.getItem(STORAGE_KEYS.muted) === null;
    const nextMuted = !currentMuted;
    localStorage.setItem(STORAGE_KEYS.muted, String(nextMuted));
    if (localStorage.getItem(STORAGE_KEYS.volume) === null) {
      localStorage.setItem(STORAGE_KEYS.volume, '1');
    }
    const vol = parseFloat(localStorage.getItem(STORAGE_KEYS.volume)) || 1;
    setMuteIcon(nextMuted);
    applyAudioState(nextMuted, vol);
  });

  // Persistência se ajustar volume em algum outro player
  bgVideo?.addEventListener('volumechange', () => {
    if (!bgVideo) return;
    if (!bgVideo.muted) localStorage.setItem(STORAGE_KEYS.volume, String(bgVideo.volume));
    localStorage.setItem(STORAGE_KEYS.muted, String(bgVideo.muted));
    setMuteIcon(bgVideo.muted);
  });

  // Voltar (histórico com fallback)
  backBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (history.length > 1) history.back();
    else window.location.href = '../intermediaria/intermediaria.html';
  });
})();

/* =========================
   Abelha-mini: frames + voo (imagem sai do vidro)
   Requer bee-anim.js.
   ========================= */
(function(){
  const fab = document.getElementById('beeFab');
  const img = document.getElementById('beeMini');
  if (!fab || !img) return;

  // animação de frames (reaproveita do projeto)
  if (window.BeeAnimator) {
    new BeeAnimator(img, {
      basePath: "../assets/abelha",
      prefix: "abelha",
      ext: "png",
      frames: 10,
      fps: 12,
      scale: 1,
      autoplay: true,
      loop: true
    });
  }

  // estado interno
  let inFlight = false;

  // posição base (centro do fab)
  function getHomeCenter(){
    const r = fab.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  }

  // tira a IMG do vidro e coloca no body, mantendo tamanho/posição
  function undockImageAt({x, y}){
    const rect = img.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (img.parentElement !== document.body) document.body.appendChild(img);

    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    img.style.position = 'fixed';
    img.style.left = `${x - w/2}px`;
    img.style.top  = `${y - h/2}px`;
    img.style.transform = 'translate3d(0,0,0)';
    img.style.transition = 'transform 0ms linear';
    img.style.willChange = 'transform';
    img.style.zIndex = '6'; // acima de modais
  }

  // volta a IMG pro FAB e limpa estilos
  function dockImage(){
    img.style.transition = '';
    img.style.transform = '';
    img.style.position = '';
    img.style.left = '';
    img.style.top = '';
    img.style.width = '';
    img.style.height = '';
    img.style.willChange = '';
    img.style.zIndex = '';
    fab.appendChild(img);
  }

  function durationFromDistance(dx, dy){
    const dist = Math.hypot(dx, dy);
    const pxPerMs = 0.7;
    const ms = dist / pxPerMs;
    return Math.max(400, Math.min(1600, ms));
  }

  function flyToEl(el, { offsetYFactor = 0.25 } = {}){
    return new Promise((resolve) => {
      if (inFlight) return resolve();
      inFlight = true;
      fab.classList.add('is-moving');

      const home = getHomeCenter();
      undockImageAt(home);

      const r = el.getBoundingClientRect();
      const target = { x: r.left + r.width/2, y: r.top + r.height*offsetYFactor };

      const dx = Math.round(target.x - home.x);
      const dy = Math.round(target.y - home.y);
      const dur = durationFromDistance(dx, dy);

      requestAnimationFrame(() => {
        img.style.transition = `transform ${dur}ms cubic-bezier(.22,.61,.36,1)`;
        img.style.transform  = `translate3d(${dx}px, ${dy}px, 0)`;
      });

      const onEnd = () => { img.removeEventListener('transitionend', onEnd); resolve(); };
      img.addEventListener('transitionend', onEnd);
    });
  }

  function flyHome(){
    return new Promise((resolve) => {
      const handleEnd = () => {
        img.removeEventListener('transitionend', handleEnd);
        dockImage();
        fab.classList.remove('is-moving');
        inFlight = false;
        resolve();
      };

      requestAnimationFrame(() => {
        img.style.transition = `transform 520ms cubic-bezier(.22,.61,.36,1)`;
        img.style.transform  = `translate3d(0,0,0)`;
      });

      img.addEventListener('transitionend', handleEnd);
    });
  }

  function setBeeZIndex(z){
    img.style.zIndex = (z == null ? '' : String(z));
  }

  // Expor para flowers.js
  window.setBeeZIndex = setBeeZIndex;
  window.flyBeeTo   = flyToEl;
  window.flyBeeHome = flyHome;
})();
