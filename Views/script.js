const video = document.getElementById('bgVideo');
const toggleMuteBtn = document.getElementById('toggleMuteBtn');
const autoplayNote = document.getElementById('autoplayNote');
const startBtn = document.getElementById('startBtn');

/* Autoplay + Som */
async function ensureAutoplay() {
  try {
    await video.play();
    if (autoplayNote) autoplayNote.hidden = true;
  } catch {
    if (autoplayNote) autoplayNote.hidden = false;
  }
}
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
  if (!video.muted) video.play().catch(()=>{});
});
startBtn.addEventListener('click', () => {
  video.muted = false;
  setMuteIcon(false);
  video.play().catch(()=>{});
  // window.location.href = './explore.html';
});
window.addEventListener('load', () => { setMuteIcon(true); ensureAutoplay(); });
video.addEventListener('error', () => { if (autoplayNote) autoplayNote.hidden = false; });

/* Botão de Tela Cheia (mesma lógica do explore) */
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
    try { const p = req.call(el); if (p?.catch) p.catch(()=>{}); } catch {}
  }
  function exitFS() {
    const ex =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (!ex) return;
    try { const p = ex.call(document); if (p?.catch) p.catch(()=>{}); } catch {}
  }
  function updateUI(active){
    const i = btn.querySelector('i');
    i.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
    const label = active ? 'Sair de tela cheia' : 'Tela cheia';
    btn.setAttribute('aria-label', label);
    btn.title = active ? 'Sair de tela cheia (F)' : 'Tela cheia (F)';
    btn.classList.toggle('is-active', !!active);
  }
  btn.addEventListener('click', (e) => { e.stopPropagation(); isFS() ? exitFS() : requestFS(target); });
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && !e.repeat) { e.preventDefault(); isFS() ? exitFS() : requestFS(target); }
  });
  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));
  updateUI(!!isFS());
})();
