/* ===== Seletores ===== */
const video = document.getElementById('introVideo');
const playPauseBtn = document.getElementById('playPause');
const playPauseIcon = playPauseBtn.querySelector('i');
const seek = document.getElementById('seek');
const cur = document.getElementById('currentTime');
const dur = document.getElementById('duration');

const toggleMuteBtn = document.getElementById('toggleMuteBtn');
const fsBtn = document.getElementById('fs-toggle');

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

  // tentar tocar; se estiver desmutado, deve funcionar pq veio de clique do Start
  try { await video.play(); } catch {}
});

/* ===== Som (mesmo padrão da landing) ===== */
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
}
playPauseBtn.addEventListener('click', () => {
  if (video.paused) video.play().catch(()=>{}); else video.pause();
});
video.addEventListener('click', () => { // clique no vídeo também alterna
  if (video.paused) video.play().catch(()=>{}); else video.pause();
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
});
seek.addEventListener('change', () => {
  const t = (seek.value / 100) * video.duration;
  video.currentTime = t;
  seeking = false;
});

/* ===== Atalhos ===== */
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space'){ e.preventDefault(); playPauseBtn.click(); }
  if (e.key === 'ArrowRight'){ video.currentTime = Math.min(video.currentTime + 5, video.duration || Infinity); }
  if (e.key === 'ArrowLeft'){  video.currentTime = Math.max(video.currentTime - 5, 0); }
});

/* ===== Tela Cheia (igual explore/landing) ===== */
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

/* ===== Navegação: Voltar e Pular ===== */
const backBtn = document.getElementById('backBtn');
const skipBtn = document.getElementById('skipBtn');

if (backBtn){
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Volta para a primeira tela (landing dentro de /views)
    window.location.href = '../index.html';
    // Se preferir histórico: history.length > 1 ? history.back() : (window.location.href = './index.html');
  });
}

if (skipBtn){
  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Vai para a tela de explore
    window.location.href = '../explore/explore.html'; // use '../explore.html' se seu explore estiver fora de /views
  });
}

