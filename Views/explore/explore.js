// === Objeto com os dados de previsão ===
const DADOS_MESES = {
  2026: [
    { name:"Janeiro", season:"Chuvosa", temp_forecast:27.43, temp_trend:"up", precip_forecast:3.68, precip_trend:"down" },
    { name:"Fevereiro", season:"Chuvosa", temp_forecast:27.17, temp_trend:"down", precip_forecast:1.97, precip_trend:"down" },
    { name:"Março", season:"Chuvosa", temp_forecast:26.80, temp_trend:"down", precip_forecast:-1.39, precip_trend:"down" },
    { name:"Abril", season:"Transição", temp_forecast:26.18, temp_trend:"down", precip_forecast:12.33, precip_trend:"up" },
    { name:"Maio", season:"Seca", temp_forecast:24.74, temp_trend:"down", precip_forecast:18.79, precip_trend:"up" },
    { name:"Junho", season:"Seca", temp_forecast:24.22, temp_trend:"down", precip_forecast:64.49, precip_trend:"up" },
    { name:"Julho", season:"Seca", temp_forecast:24.22, temp_trend:"same", precip_forecast:111.15, precip_trend:"up" },
    { name:"Agosto", season:"Seca", temp_forecast:26.23, temp_trend:"up", precip_forecast:188.46, precip_trend:"up" },
    { name:"Setembro", season:"Transição", temp_forecast:26.00, temp_trend:"up", precip_forecast:114.35, precip_trend:"up" },
    { name:"Outubro", season:"Chuvosa", temp_forecast:27.00, temp_trend:"up", precip_forecast:99.39, precip_trend:"down" },
    { name:"Novembro", season:"Chuvosa", temp_forecast:28.00, temp_trend:"up", precip_forecast:110.47, precip_trend:"up" },
    { name:"Dezembro", season:"Chuvosa", temp_forecast:29.00, temp_trend:"up", precip_forecast:63.16, precip_trend:"down" }
  ],
  2027: [
    { name:"Janeiro", season:"Chuvosa", temp_forecast:27.5, temp_trend:"up", precip_forecast:100, precip_trend:"down" },
    { name:"Fevereiro", season:"Chuvosa", temp_forecast:27.0, temp_trend:"down", precip_forecast:95, precip_trend:"down" },
    { name:"Março", season:"Chuvosa", temp_forecast:26.7, temp_trend:"down", precip_forecast:105, precip_trend:"up" },
    { name:"Abril", season:"Transição", temp_forecast:26.2, temp_trend:"down", precip_forecast:60, precip_trend:"down" },
    { name:"Maio", season:"Seca", temp_forecast:25.0, temp_trend:"down", precip_forecast:10, precip_trend:"down" },
    { name:"Junho", season:"Seca", temp_forecast:24.5, temp_trend:"down", precip_forecast:5, precip_trend:"down" },
    { name:"Julho", season:"Seca", temp_forecast:24.5, temp_trend:"same", precip_forecast:0, precip_trend:"down" },
    { name:"Agosto", season:"Seca", temp_forecast:26.0, temp_trend:"up", precip_forecast:15, precip_trend:"up" },
    { name:"Setembro", season:"Transição", temp_forecast:26.1, temp_trend:"up", precip_forecast:20, precip_trend:"up" },
    { name:"Outubro", season:"Chuvosa", temp_forecast:27.0, temp_trend:"up", precip_forecast:65, precip_trend:"up" },
    { name:"Novembro", season:"Chuvosa", temp_forecast:28.0, temp_trend:"up", precip_forecast:110, precip_trend:"up" },
    { name:"Dezembro", season:"Chuvosa", temp_forecast:28.5, temp_trend:"up", precip_forecast:190, precip_trend:"up" }
  ]
};

// === Função para atualizar os cards de informação ===
function atualizarCards(ano, indiceMes) {
  const elNomeMes = document.querySelector('.hud-subcard .month');
  const elEstacao = document.querySelector('.hud-subcard .season');
  const elTituloTemp = document.querySelector('.hud-subcard .pill-title');
  const elSubTemp = document.querySelector('.hud-subcard .pill-sub');
  const elDescricao = document.querySelector('.hud-rightcard .right-text p');
  const elIconeEstacao = document.querySelector('.icon-sq.alt .i');

  const dadosDoAno = DADOS_MESES[ano] || DADOS_MESES[2026];
  const dadosDoMes = dadosDoAno[indiceMes];

  if (!dadosDoMes) return;

  const nomeMesCompleto = new Date(ano, indiceMes).toLocaleString('pt-BR', { month: 'long' });
  elNomeMes.textContent = nomeMesCompleto.charAt(0).toUpperCase() + nomeMesCompleto.slice(1);
  
  elEstacao.textContent = `Estação ${dadosDoMes.season}`;
  
  const tempFormatada = dadosDoMes.temp_forecast.toFixed(1);
  elTituloTemp.textContent = `Previsão: ${tempFormatada}°C`;

  const tendenciaTemp = { up: '▲ subindo', down: '▼ caindo', same: '▬ estável' };
  elSubTemp.textContent = `Tendência: ${tendenciaTemp[dadosDoMes.temp_trend] || 'N/A'}`;

  const tendenciaPrecip = { up: 'aumentando', down: 'diminuindo', same: 'estável' };
  elDescricao.innerHTML = `A previsão de precipitação para <strong>${dadosDoMes.name}</strong> é de <strong>${dadosDoMes.precip_forecast.toFixed(1)}mm</strong>, com tendência ${tendenciaPrecip[dadosDoMes.precip_trend] || 'N/A'}.`;

  const iconeEstacao = { Chuvosa: '💧', Seca: '☀️', Transição: '🌀' };
  elIconeEstacao.textContent = iconeEstacao[dadosDoMes.season] || '❔';
}

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

function clampScroll(x) {
  const containerW = (bg && bg.offsetWidth) || 3000;
  const max = Math.max(0, containerW - window.innerWidth);
  return Math.min(Math.max(0, x), max);
}

const SAFE_SELECTOR = ".hud-bar, #fs-toggle, #toggleMuteBtn, #backBtn, #beeFab, button, input, a, [role='button'], .flower, #flower-modal, .flower-modal-backdrop, #intro-modal, #intro-backdrop, #side-tip";

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

document.addEventListener("click", (e) => {
  if (dragDistance > 10 || dragging) return;
  if (e.target.closest(".hud-bar, #fs-toggle, #toggleMuteBtn, #backBtn")) return;

  const STEP = 100;
  const dir = e.clientX > window.innerWidth / 2 ? 1 : -1;
  const next = clampScroll(window.scrollX + dir * STEP);
  window.scrollTo({ left: next, behavior: "smooth" });
});

document.addEventListener("keydown", (e) => {
  if (e.target.closest('input, button')) return;
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

  const years = yearPills.map(el => parseInt(el.dataset.year, 10));
  let mIdx = parseInt(range.value, 10) || 0;
  let yIdx = Math.max(0, yearPills.findIndex(el => el.classList.contains('active')));
  if (yIdx < 0) yIdx = 0;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function setYear(newYIdx){
    yIdx = clamp(newYIdx, 0, yearPills.length - 1);
    yearPills.forEach((el, i) => el.classList.toggle('active', i === yIdx));
    atualizarCards(years[yIdx], mIdx); // ATUALIZA OS DADOS
  }

  function setMonth(newIdx, from = 'code') {
    mIdx = clamp(newIdx, 0, 11);
    if (from !== 'range') range.value = mIdx;
    months.forEach((el, i) => el.classList.toggle('active', i === mIdx));
    atualizarCards(years[yIdx], mIdx); // ATUALIZA OS DADOS
  }

  yearPills.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setYear(i);
    });
  });

  months.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setMonth(i);
    });
  });

  range.addEventListener('input', () => setMonth(parseInt(range.value, 10), 'range'));

  function step(delta) {
    let nextM = mIdx + delta;

    if (nextM < 0) {
      if (yIdx > 0) { setYear(yIdx - 1); nextM = 11; }
      else nextM = 0;
    } else if (nextM > 11) {
      if (yIdx < yearPills.length - 1) { setYear(yIdx + 1); nextM = 0; }
      else nextM = 11;
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

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, button')) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft')  step(-1);
  });

  setYear(yIdx);
  setMonth(mIdx);
})();

/* =========================
   Demais scripts (sem alteração)
   ========================= */

(function () {
  const btn = document.getElementById('fs-toggle');
  if (!btn) return;
  const target = document.documentElement;
  const isFS = () => document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  function requestFS(el) {
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!req) return;
    try { const p = req.call(el); p?.catch?.(()=>{}); } catch {}
  }
  function exitFS() {
    const ex = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
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
  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange'].forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));
  updateUI(!!isFS());
})();

(function () {
  const backdrop = document.getElementById('intro-backdrop');
  const modal    = document.getElementById('intro-modal');
  const btnOk    = document.getElementById('intro-ok');
  const btnX     = document.querySelector('.intro-close');
  if (!backdrop || !modal || !btnOk || !btnX) return;
  function openIntro(){
    backdrop.hidden = false;
    modal.hidden = false;
    btnOk.focus();
  }
  function closeIntro(){
    backdrop.hidden = true;
    modal.hidden = true;
    setTimeout(() => window.sideTip?.show(), 150);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    openIntro();
  } else {
    window.addEventListener('DOMContentLoaded', openIntro, { once:true });
  }
  btnOk.addEventListener('click', closeIntro);
  btnX.addEventListener('click', closeIntro);
  backdrop.addEventListener('click', closeIntro);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeIntro();
  });
})();

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

(function(){
  const STORAGE_KEYS = { muted: 'bee_audio_muted', volume: 'bee_audio_volume' };
  const muteBtn = document.getElementById('toggleMuteBtn');
  const backBtn = document.getElementById('backBtn');
  const bgVideo = document.getElementById('bg-video');
  function setMuteIcon(isMuted){
    if (!muteBtn) return;
    muteBtn.title = isMuted ? 'Ativar som' : 'Silenciar';
    muteBtn.setAttribute('aria-label', muteBtn.title);
    const waves = muteBtn.querySelector('.waves');
    if (waves) waves.style.opacity = isMuted ? '0.45' : '1';
    muteBtn.style.filter = isMuted ? 'grayscale(10%) brightness(0.95)' : 'none';
  }
  function applyAudioState(isMuted, volume){
    if (!bgVideo) return;
    bgVideo.muted = isMuted;
    bgVideo.volume = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 1));
    if (!isMuted) {
      try { bgVideo.play()?.catch(()=>{}); } catch {}
    }
  }
  (function restoreAudioState(){
    const savedMuted  = localStorage.getItem(STORAGE_KEYS.muted);
    const savedVolume = parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
    const isMuted = savedMuted === 'true' || savedMuted === null;
    const vol = Number.isFinite(savedVolume) ? savedVolume : 1;
    setMuteIcon(isMuted);
    applyAudioState(isMuted, vol);
  })();
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
  bgVideo?.addEventListener('volumechange', () => {
    if (!bgVideo) return;
    if (!bgVideo.muted) {
      localStorage.setItem(STORAGE_KEYS.volume, String(bgVideo.volume));
    }
    localStorage.setItem(STORAGE_KEYS.muted, String(bgVideo.muted));
    setMuteIcon(bgVideo.muted);
  });
  backBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (history.length > 1) history.back();
    else window.location.href = '../intermediaria/intermediaria.html';
  });
})();

(function(){
  const fab = document.getElementById('beeFab');
  const img = document.getElementById('beeMini');
  if (!fab || !img) return;
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
  let inFlight = false;
  function getHomeCenter(){
    const r = fab.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  }
  function undockImageAt({x, y}){
    const rect = img.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (img.parentElement !== document.body) {
      document.body.appendChild(img);
    }
    img.style.cssText = `width:${w}px; height:${h}px; position:fixed; left:${x-w/2}px; top:${y-h/2}px; transform:translate3d(0,0,0); transition:transform 0ms linear; will-change:transform; z-index:6;`;
  }
  function dockImage(){
    img.style.cssText = '';
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
      const home = getHomeCenter();
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
  window.setBeeZIndex = setBeeZIndex;
  window.flyBeeTo   = flyToEl;
  window.flyBeeHome = flyHome;
})();