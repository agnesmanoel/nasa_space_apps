document.addEventListener('DOMContentLoaded', () => {
  const video         = document.getElementById('bgVideo');
  const toggleMuteBtn = document.getElementById('toggleMuteBtn');
  const autoplayNote  = document.getElementById('autoplayNote');
  const startBtn      = document.getElementById('startBtn');
  const fsBtn         = document.getElementById('fs-toggle');
  const beeEl         = document.getElementById('beeSprite');

  if (!video) {
    console.warn('[index] #bgVideo não encontrado.');
    return;
  }

  const STORAGE_KEYS = {
    muted: 'bee_audio_muted',
    volume: 'bee_audio_volume'
  };

  /* ---------- Helpers ---------- */
  const setMuteIcon = (isMuted) => {
    if (!toggleMuteBtn) return;
    toggleMuteBtn.title = isMuted ? 'Ativar som' : 'Silenciar';
    toggleMuteBtn.setAttribute('aria-label', toggleMuteBtn.title);
    const waves = toggleMuteBtn.querySelector('.waves');
    if (waves) waves.style.opacity = isMuted ? '0.45' : '1';
    toggleMuteBtn.style.filter = isMuted ? 'grayscale(10%) brightness(0.95)' : 'none';
  };

  const ensureAutoplay = async () => {
    try {
      await video.play();
      if (autoplayNote) autoplayNote.hidden = true;
    } catch {
      if (autoplayNote) autoplayNote.hidden = false;
    }
  };

  /* ---------- Estado inicial (som) ---------- */
  (() => {
    const savedMuted  = localStorage.getItem(STORAGE_KEYS.muted);
    const savedVolume = localStorage.getItem(STORAGE_KEYS.volume);

    if (savedMuted !== null) {
      video.muted = savedMuted === 'true';
    } else {
      video.muted = true; // padrão
    }
    setMuteIcon(video.muted);

    if (savedVolume !== null) {
      const v = Math.min(1, Math.max(0, parseFloat(savedVolume)));
      if (!Number.isNaN(v)) video.volume = v;
    }
  })();

  /* ---------- Autoplay ---------- */
  ensureAutoplay();
  video.addEventListener('error', () => { if (autoplayNote) autoplayNote.hidden = false; });

  /* ---------- Botão Som ---------- */
  toggleMuteBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
    setMuteIcon(video.muted);
    localStorage.setItem(STORAGE_KEYS.muted, String(video.muted));
    localStorage.setItem(STORAGE_KEYS.volume, String(video.volume ?? 1));
    if (!video.muted) video.play().catch(()=>{});
  });

  /* ---------- Botão Start ---------- */
  startBtn?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.muted, String(video.muted));
    localStorage.setItem(STORAGE_KEYS.volume, String(video.volume ?? 1));
    window.location.href = './intro/intro.html';
  });

  /* ---------- Fullscreen ---------- */
  (function () {
    if (!fsBtn) return;

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
      try { req?.call(el)?.catch?.(()=>{}); } catch {}
    }
    function exitFS() {
      const ex =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
      try { ex?.call(document)?.catch?.(()=>{}); } catch {}
    }
    function updateUI(active){
      const i = fsBtn.querySelector('i');
      if (i) i.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
      const label = active ? 'Sair de tela cheia' : 'Tela cheia';
      fsBtn.setAttribute('aria-label', label);
      fsBtn.title = active ? 'Sair de tela cheia (F)' : 'Tela cheia (F)';
      fsBtn.classList.toggle('is-active', !!active);
    }

    fsBtn.addEventListener('click', (e) => { e.stopPropagation(); isFS() ? exitFS() : requestFS(target); });
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'f' && !e.repeat) { e.preventDefault(); isFS() ? exitFS() : requestFS(target); }
    });
    ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
      .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));
    updateUI(!!isFS());
  })();

  /* ---------- Abelha animada ---------- */
  if (beeEl && window.BeeAnimator) {
    try {
      window.beeAnim = new BeeAnimator(beeEl, {
        basePath: "../assets/abelha",
        prefix: "abelha",
        ext: "png",
        frames: 10,
        fps: 10,
        scale: 1.5,
        autoplay: true,
        loop: true
      });
    } catch (err) {
      console.warn('BeeAnimator falhou:', err);
    }
  }
});
