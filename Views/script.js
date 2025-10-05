(() => {
  'use strict';

  // =====================
  // Util: safe query + logs
  // =====================
  const $id = (id) => document.getElementById(id);
  const log = (...a) => console.log('[Bee]', ...a);
  const warn = (...a) => console.warn('[Bee]', ...a);
  const err = (...a) => console.error('[Bee]', ...a);

  const STORAGE_KEYS = {
    muted: 'bee_audio_muted',
    volume: 'bee_audio_volume',
  };

  // =====================
  // Boot quando DOM pronto
  // =====================
  document.addEventListener('DOMContentLoaded', () => {
    const video         = $id('bgVideo');
    const toggleMuteBtn = $id('toggleMuteBtn');
    const autoplayNote  = $id('autoplayNote');
    const startBtn      = $id('startBtn');
    const fsBtn         = $id('fs-toggle');
    const beeEl         = $id('beeSprite');

    if (!video) warn('Elemento #bgVideo não encontrado.');
    if (!toggleMuteBtn) warn('Botão de som #toggleMuteBtn não encontrado.');
    if (!startBtn) warn('Botão Start #startBtn não encontrado.');
    if (!fsBtn) warn('Botão Fullscreen #fs-toggle não encontrado.');
    if (!beeEl) warn('Imagem da abelha #beeSprite não encontrada.');

    // ===========
    // Áudio / Vídeo
    // ===========
    function setMuteIcon(isMuted){
      if (!toggleMuteBtn) return;
      toggleMuteBtn.title = isMuted ? 'Ativar som' : 'Silenciar';
      toggleMuteBtn.setAttribute('aria-label', toggleMuteBtn.title);
      const waves = toggleMuteBtn.querySelector('.waves');
      if (waves) waves.style.opacity = isMuted ? '0.45' : '1';
      toggleMuteBtn.style.filter = isMuted ? 'grayscale(10%) brightness(0.95)' : 'none';
    }

    async function ensureAutoplay(){
      if (!video) return false;
      try {
        await video.play();
        if (autoplayNote) autoplayNote.hidden = true;
        return true;
      } catch (e) {
        if (autoplayNote) autoplayNote.hidden = false;
        warn('Autoplay bloqueado pelo navegador.', e);
        return false;
      }
    }

    function initAudio(){
      if (!video) return;

      const savedMuted  = localStorage.getItem(STORAGE_KEYS.muted);
      const savedVolume = localStorage.getItem(STORAGE_KEYS.volume);

      // Padrão: mutado (se nunca salvou)
      video.muted = savedMuted === 'true' || savedMuted === null;
      setMuteIcon(video.muted);

      if (savedVolume !== null) {
        const v = Math.min(1, Math.max(0, parseFloat(savedVolume)));
        if (!Number.isNaN(v)) video.volume = v;
      }

      ensureAutoplay();
    }

    // ===========
    // Abelha: usa BeeAnimator se existir, senão fallback por frames
    // ===========
    function startBee(){
      if (!beeEl) return;

      const basePath = "../assets/abelha";
      const prefix = "abelha";
      const ext = "png";
      const frames = 10;
      const fps = 12;

      // 1) Tenta a lib externa
      if (window.BeeAnimator && typeof window.BeeAnimator === 'function') {
        try {
          new window.BeeAnimator(beeEl, {
            basePath, prefix, ext, frames, fps,
            scale: 1.5, autoplay: true, loop: true
          });
          log('BeeAnimator inicializado com sucesso.');
          return;
        } catch (e) {
          warn('BeeAnimator falhou, caindo para fallback de frames.', e);
        }
      } else {
        warn('BeeAnimator não está disponível. Usando fallback por frames.');
      }

      // 2) Fallback por frames com carregamento tolerante
      const msPerFrame = 1000 / fps;
      const imgs = Array.from({ length: frames }, (_, i) => {
        const im = new Image();
        im.decoding = 'async';
        im.loading = 'eager';
        im.src = `${basePath}/${prefix}${i}.${ext}`;
        im.onerror = () => warn(`Falha ao carregar frame ${im.src}`);
        return im;
      });

      let idx = 0;
      let acc = 0;
      let last = performance.now();
      let running = true;

      function loop(now){
        if (!running) return;
        const dt = now - last; last = now; acc += dt;

        if (acc >= msPerFrame){
          acc -= msPerFrame;
          idx = (idx + 1) % frames;
          const candidate = imgs[idx];
          // só troca se já tem um src definido (mesmo que ainda esteja carregando, o navegador mantém o anterior)
          if (candidate && candidate.src) {
            beeEl.src = candidate.src;
          }
        }
        requestAnimationFrame(loop);
      }

      // garante que o primeiro frame apareça rápido mesmo que os outros demorem
      imgs[0].onload = () => { if (beeEl.src !== imgs[0].src) beeEl.src = imgs[0].src; };
      if (imgs[0].complete && imgs[0].naturalWidth > 0) {
        beeEl.src = imgs[0].src;
      }

      requestAnimationFrame(loop);

      // Se a aba perder o foco por muito tempo, podemos pausar (opcional)
      document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) {
          last = performance.now();
          requestAnimationFrame(loop);
        }
      });
    }

    // ===========
    // UI: botões
    // ===========
    function wireUI(){
      // Som
      if (toggleMuteBtn && video){
        toggleMuteBtn.addEventListener('click', () => {
          video.muted = !video.muted;
          setMuteIcon(video.muted);
          try {
            localStorage.setItem(STORAGE_KEYS.muted, String(video.muted));
            localStorage.setItem(STORAGE_KEYS.volume, String(video.volume ?? 1));
          } catch {}
          if (!video.muted) {
            video.play().catch(() => {});
          }
        });
      }

      // Start (navegação)
      if (startBtn){
        startBtn.addEventListener('click', () => {
          if (video){
            try {
              localStorage.setItem(STORAGE_KEYS.muted, String(video.muted));
              localStorage.setItem(STORAGE_KEYS.volume, String(video.volume ?? 1));
            } catch {}
          }
          // Ajuste este caminho se sua pasta for diferente
          window.location.href = './intro/intro.html';
        });
      }

      // Fullscreen
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
          try { const p = req && req.call(el); p?.catch?.(() => {}); } catch {}
        }
        function exitFS() {
          const ex =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;
          try { const p = ex && ex.call(document); p?.catch?.(() => {}); } catch {}
        }
        function updateUI(active){
          const i = fsBtn.querySelector('i');
          if (i) i.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
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
          if (e.key?.toLowerCase() === 'f' && !e.repeat) {
            e.preventDefault();
            isFS() ? exitFS() : requestFS(target);
          }
        });
        ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
          .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));
        updateUI(!!isFS());
      })();

      // Se o autoplay falhar por política, mostrar aviso de forma reativa
      if (video){
        video.addEventListener('error', () => {
          if (autoplayNote) autoplayNote.hidden = false;
        });
      }
    }

    // ===========
    // Inicialização
    // ===========
    try {
      initAudio();
      wireUI();
      startBee();
      log('Inicialização concluída.');
    } catch (e) {
      err('Falha ao inicializar a página:', e);
    }
  });
})();
