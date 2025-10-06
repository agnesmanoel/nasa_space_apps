/* ===== Seletores ===== */
const video         = document.getElementById('introVideo');
const playPauseBtn  = document.getElementById('playPause');
const playPauseIcon = playPauseBtn.querySelector('i');
const seek          = document.getElementById('seek');
const cur           = document.getElementById('currentTime');
const dur           = document.getElementById('duration');

const toggleMuteBtn = document.getElementById('toggleMuteBtn');
const fsBtn         = document.getElementById('fs-toggle');

/* Controles (para auto-hide) */
const controls = document.querySelector('.controls');

const STORAGE_KEYS = {
  muted: 'bee_audio_muted',
  volume: 'bee_audio_volume'
};

/* ===== Helpers ===== */
const fmt = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2,'0')}`;
};

/* ===== Autoplay seguro (muted + playsinline) ===== */
window.addEventListener('load', async () => {
  const savedMuted  = localStorage.getItem(STORAGE_KEYS.muted);
  const savedVolume = localStorage.getItem(STORAGE_KEYS.volume);

  if (savedMuted !== null) {
    video.muted = savedMuted === 'true';
  }
  if (savedVolume !== null) {
    const v = Math.min(1, Math.max(0, parseFloat(savedVolume)));
    if (!Number.isNaN(v)) video.volume = v;
  }
  setMuteIcon(video.muted);

  try { await video.play(); } catch {}

  // mostra os controles por alguns segundos ao entrar
  showControlsTemporariamente(2500);
});

/* ===== Som ===== */
function setMuteIcon(isMuted){
  toggleMuteBtn.title = isMuted ? 'Ativar som' : 'Silenciar';
  toggleMuteBtn.setAttribute('aria-label', toggleMuteBtn.title);
  const waves = toggleMuteBtn.querySelector('.waves');
  if (waves) waves.style.opacity = isMuted ? '0.45' : '1';
  toggleMuteBtn.style.filter = isMuted ? 'grayscale(10%) brightness(0.95)' : 'none';
}
toggleMuteBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  setMuteIcon(video.muted);
  localStorage.setItem(STORAGE_KEYS.muted, String(video.muted));
  localStorage.setItem(STORAGE_KEYS.volume, String(video.volume ?? 1));
  if (!video.muted) video.play().catch(()=>{});
  showControlsTemporariamente(2000);
});
setMuteIcon(true);

function persistVolume(){
  localStorage.setItem(STORAGE_KEYS.volume, String(video.volume ?? 1));
}

/* ===== Play / Pause ===== */
function updatePlayUI(){
  const playing = !video.paused && !video.ended;
  playPauseIcon.className = playing ? 'bi bi-pause-fill' : 'bi bi-play-fill';
  playPauseBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');

  // se estiver pausado, mantenha controles visíveis sem timer
  if (video.paused || video.ended) {
    controls.classList.add('is-visible');
    clearTimeout(hideTimer);
  } else {
    showControlsTemporariamente(1200);
  }
}
playPauseBtn.addEventListener('click', () => {
  if (video.paused) video.play().catch(()=>{}); else video.pause();
  showControlsTemporariamente(2000);
});
video.addEventListener('click', () => { // clique no vídeo também alterna
  if (video.paused) video.play().catch(()=>{}); else video.pause();
  showControlsTemporariamente(2000);
});
video.addEventListener('play', updatePlayUI);
video.addEventListener('pause', updatePlayUI);
video.addEventListener('ended', updatePlayUI);

/* ===== Duração / Progresso ===== */
let seeking = false;

video.addEventListener('loadedmetadata', () => {
  dur.textContent = fmt(video.duration);
});

video.addEventListener('timeupdate', () => {
  if (seeking) return;
  const p = (video.currentTime / video.duration) * 100 || 0;
  seek.value = p;
  cur.textContent = fmt(video.currentTime);
});

seek.addEventListener('input', () => {
  seeking = true;
  const t = (seek.value / 100) * video.duration;
  cur.textContent = fmt(t);
  showControlsTemporariamente(1500);
});
seek.addEventListener('change', () => {
  const t = (seek.value / 100) * video.duration;
  video.currentTime = t;
  seeking = false;
  showControlsTemporariamente(2000);
});

/* ===== Atalhos ===== */
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space'){ e.preventDefault(); playPauseBtn.click(); }
  if (e.key === 'ArrowRight'){ video.currentTime = Math.min(video.currentTime + 5, video.duration || Infinity); }
  if (e.key === 'ArrowLeft'){  video.currentTime = Math.max(video.currentTime - 5, 0); }
  showControlsTemporariamente(2000);
});

/* ===== Auto-hide dos controles ===== */
let hideTimer = 0;

function showControlsTemporariamente(ms = 2000){
  controls.classList.add('is-visible');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    // não esconda se pausado/ended
    if (video.paused || video.ended) return;
    // não esconda se o mouse está por cima ou se algum controle tem foco
    if (controls.matches(':hover')) return;
    if (document.activeElement && controls.contains(document.activeElement)) return;
    controls.classList.remove('is-visible');
  }, ms);
}

// mouse/touch reexibe
['mousemove','touchstart','touchmove'].forEach(evt => {
  window.addEventListener(evt, () => showControlsTemporariamente(2000), { passive: true });
});
// sair de cima → inicia contagem menor
controls.addEventListener('mouseleave', () => showControlsTemporariamente(800));
// qualquer clique nos controles prolonga um pouco
controls.addEventListener('click', () => showControlsTemporariamente(1500));

/* ===== Tela Cheia ===== */
(function () {
  if (!fsBtn) return;
  const target = document.documentElement;

  const isFS = () =>
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  function requestFS(el) {
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    try { const p = req && req.call(el); p?.catch?.(()=>{}); } catch {}
  }
  function exitFS() {
    const ex = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    try { const p = ex && ex.call(document); p?.catch?.(()=>{}); } catch {}
  }
  function updateUI(active){
    const i = fsBtn.querySelector('i');
    i.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
    const label = active ? 'Sair de tela cheia' : 'Tela cheia';
    fsBtn.setAttribute('aria-label', label);
    fsBtn.title = active ? 'Sair de tela cheia (F)' : 'Tela cheia (F)';
    fsBtn.classList.toggle('is-active', !!active);
  }

  fsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isFS() ? exitFS() : requestFS(target);
    showControlsTemporariamente(1500);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && !e.repeat) {
      e.preventDefault();
      isFS() ? exitFS() : requestFS(target);
      showControlsTemporariamente(1500);
    }
  });

  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));
  updateUI(!!isFS());
})();

/* ===== Navegação: Voltar e Pular ===== */
const backBtn = document.getElementById('backBtn');
const skipBtn = document.getElementById('skipBtn');

if (backBtn){
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = '../index.html';
  });
}

if (skipBtn){
  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = '../intermediaria/intermediaria.html';
  });
}

// Avança automaticamente para a tela intermediária quando o vídeo terminar
video.addEventListener('ended', () => {
  // pequena folga opcional para não "cortar" abrupto
  setTimeout(() => {
    window.location.href = '../intermediaria/intermediaria.html';
  }, 250);
});
