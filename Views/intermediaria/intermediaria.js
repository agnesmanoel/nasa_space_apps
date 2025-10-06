// =====================
// Centralizar faixa ao carregar
// =====================
window.addEventListener("load", () => {
  const bg = document.querySelector(".background-scroll-container");
  if (!bg) return;
  const containerW = bg.offsetWidth || 3000;
  const center = Math.max(0, containerW - window.innerWidth) / 2;
  window.scrollTo({ left: center });
});

// =====================
// Drag horizontal simples
// =====================
(function(){
  const bg = document.querySelector(".background-scroll-container");
  const body = document.body;
  let dragging = false, startX = 0, startScrollX = 0, dragDistance = 0;
  const SPEED = 1.5;

  const SAFE_SELECTOR = "#fs-toggle, #nextBtn, #toggleMuteBtn, #backBtn, #hudOk, button, a, [role='button']";

  function clampScroll(x){
    const containerW = (bg && bg.offsetWidth) || 3000;
    const max = Math.max(0, containerW - window.innerWidth);
    return Math.min(Math.max(0, x), max);
  }

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
    window.scrollTo({ left: clampScroll(startScrollX + delta) });
    dragDistance += Math.abs(delta);
  });
  function endDrag(){ if (!dragging) return; dragging = false; body.style.cursor = "default"; }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  // Clique para pular um pouco
  document.addEventListener("click", (e) => {
    if (dragDistance > 10 || dragging) return;
    if (e.target.closest(SAFE_SELECTOR)) return;
    const STEP = 100;
    const dir = e.clientX > window.innerWidth / 2 ? 1 : -1;
    window.scrollTo({ left: clampScroll(window.scrollX + dir * STEP), behavior: "smooth" });
  });

  // Setas do teclado
  document.addEventListener("keydown", (e) => {
    const STEP = 100;
    if (e.key === "ArrowRight")
      window.scrollTo({ left: clampScroll(window.scrollX + STEP), behavior: "smooth" });
    if (e.key === "ArrowLeft")
      window.scrollTo({ left: clampScroll(window.scrollX - STEP), behavior: "smooth" });
  });
})();

// =====================
// Passo-a-passo do texto + Abelha animada (overlay) movendo ESQ → DIR
// =====================
(function(){
  const parts = [
    "Today, you are a Uruçu, a Cerrado bee.",
    "Fly through the Cerrado, follow the rhythm of the flowers, and discover how every season tells a story of life, balance, and change.",
    "Drag, click, or tap to explore.<br/>Every flower holds a clue to the future of this biome."
  ];

  const hudText = document.getElementById("hudText");
  const okBtn   = document.getElementById("hudOk");
  const beeEl   = document.getElementById("beeIntro");

  // garante 1º frame visível como fallback
  if (beeEl) beeEl.src = "../../assets/abelha/abelha0.png";

  // Frações horizontais da viewport (0=esq, 1=dir)
  const beeFractions = [0.08, 0.50, 0.82];
  const beeFinal     = 0.97;

  let idx = 0;
  let beeAnimatorStarted = false;
  let fallbackTimer = null;

  function startFallbackAnimator(){
    if (fallbackTimer) return;
    let f = 0;
    const frames = 10;
    const fps = 12;
    const base = "../../assets/abelha/abelha";
    const ext  = "png";
    fallbackTimer = setInterval(() => {
      f = (f + 1) % frames;
      beeEl.src = `${base}${f}.${ext}`;
    }, 1000 / fps);
  }
  function stopFallbackAnimator(){
    if (fallbackTimer){
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function render(){
    hudText.innerHTML = parts[idx];

    if (beeEl.hidden){
      beeEl.hidden = false;

      // (opcional) tamanho extra
      beeEl.style.setProperty('--bee-scale', '1');

      // tenta BeeAnimator; se não existir, cai no fallback
      if (!beeAnimatorStarted){
        if (window.BeeAnimator){
          try{
            new window.BeeAnimator(beeEl, {
              basePath: "../../assets/abelha",
              prefix: "abelha",
              ext: "png",
              frames: 10,
              fps: 12,
              scale: 1.5,
              autoplay: true,
              loop: true
            });
            beeAnimatorStarted = true;
            stopFallbackAnimator();
          }catch{
            startFallbackAnimator();
          }
        } else {
          startFallbackAnimator();
        }
      }

      // primeira posição (instantaneamente)
      moveBeeToFraction(beeFractions[0], true);
    } else {
      moveBeeToFraction(beeFractions[idx]);
    }
  }

  // Move a abelha horizontalmente (mantém centro vertical)
  function moveBeeToFraction(frac = 0.5, instant = false){
    if (!beeEl) return;
    const clamped = Math.max(0.02, Math.min(0.98, frac));
    const dx = (clamped - 0.5) * window.innerWidth;
    if (instant) beeEl.style.transitionDuration = "0ms";
    beeEl.style.transform = `translate(calc(-50% + ${dx}px), -50%)`;
    if (instant) requestAnimationFrame(()=> beeEl.style.transitionDuration = "");
  }

  okBtn.addEventListener("click", () => {
    if (idx < parts.length - 1){
      idx++;
      render();
      return;
    }
    const handleEnd = () => {
      beeEl.removeEventListener("transitionend", handleEnd);
      window.location.href = "../explore/explore.html";
    };
    beeEl.addEventListener("transitionend", handleEnd, { once: true });
    moveBeeToFraction(beeFinal);
  });

  window.addEventListener("resize", () =>
    moveBeeToFraction(
      (idx < beeFractions.length ? beeFractions[idx] : beeFinal),
      true
    )
  );

  render();
})();


// =====================
// Fullscreen
// =====================
(function () {
  const btn = document.getElementById('fs-toggle');
  if (!btn) return;
  const target = document.documentElement;
  const isFS = () =>
    document.fullscreenElement || document.webkitFullscreenElement ||
    document.mozFullScreenElement || document.msFullscreenElement;

  function requestFS(el){
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    try { req?.call(el)?.catch?.(()=>{}); } catch {}
  }
  function exitFS(){
    const ex = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    try { ex?.call(document)?.catch?.(()=>{}); } catch {}
  }
  function updateUI(active){
    const i = btn.querySelector('i');
    if (i) i.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
    btn.setAttribute('aria-label', active ? 'Sair de tela cheia' : 'Tela cheia');
    btn.title = active ? 'Sair de tela cheia (F)' : 'Tela cheia (F)';
  }

  btn.addEventListener('click', (e) => { e.stopPropagation(); isFS() ? exitFS() : requestFS(target); });
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && !e.repeat) { e.preventDefault(); isFS() ? exitFS() : requestFS(target); }
  });
  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(ev => document.addEventListener(ev, () => updateUI(!!isFS())));
  updateUI(!!isFS());
})();

// =====================
// Som + Voltar + Avançar (atalho)
// =====================
(function(){
  const STORAGE_KEYS = { muted: 'bee_audio_muted', volume: 'bee_audio_volume' };
  const muteBtn = document.getElementById('toggleMuteBtn');
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const bgAudio = document.getElementById('bg-audio');

  // força a trilha "chuvoso" nesta tela
  if (bgAudio) {
    // ajuste o caminho se necessário
    const rainSrc = '../../assets/audioCHUVA.mp3';
    if (bgAudio.src !== rainSrc) {
      bgAudio.src = rainSrc;
      bgAudio.load();
    }
    // tenta iniciar (fica mudo até o usuário clicar no botão de som)
    try { bgAudio.play()?.catch(()=>{}); } catch {}
  }


  function setMuteIcon(isMuted){
    if (!muteBtn) return;
    muteBtn.title = isMuted ? 'Ativar som' : 'Silenciar';
    muteBtn.setAttribute('aria-label', muteBtn.title);
    const waves = muteBtn.querySelector('.waves');
    if (waves) waves.style.opacity = isMuted ? '0.45' : '1';
    muteBtn.style.filter = isMuted ? 'grayscale(10%) brightness(0.95)' : 'none';
  }
  function applyAudioState(isMuted, volume){
    if (!bgAudio) return;
    bgAudio.muted = isMuted;
    bgAudio.volume = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 1));
    if (!isMuted) { try { bgAudio.play()?.catch(()=>{}); } catch {} }
  }

  // Estado inicial (muted por padrão)
  (function restore(){
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
    if (localStorage.getItem(STORAGE_KEYS.volume) === null) localStorage.setItem(STORAGE_KEYS.volume, '1');
    const vol = parseFloat(localStorage.getItem(STORAGE_KEYS.volume)) || 1;
    setMuteIcon(nextMuted);
    applyAudioState(nextMuted, vol);
  });

  bgAudio?.addEventListener('volumechange', () => {
    if (!bgAudio) return;
    if (!bgAudio.muted) localStorage.setItem(STORAGE_KEYS.volume, String(bgAudio.volume));
    localStorage.setItem(STORAGE_KEYS.muted, String(bgAudio.muted));
    setMuteIcon(bgAudio.muted);
  });

  // Voltar -> tela início
  backBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = "../intro/intro.html"; // ajuste se seu arquivo inicial for outro
  });

  // Avançar (atalho) -> explore
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = "../explore/explore.html";
  });
})();
