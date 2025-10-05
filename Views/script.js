const video = document.getElementById('bgVideo');
const toggleMuteBtn = document.getElementById('toggleMuteBtn');
const pauseBtn = document.getElementById('pauseBtn');
const autoplayNote = document.getElementById('autoplayNote');
const enterBtn = document.getElementById('enterBtn');

// Tenta garantir autoplay em dispositivos móveis (muted + playsinline já ajuda)
async function ensureAutoplay() {
  try {
    // Alguns navegadores bloqueiam play() até interação do usuário
    await video.play();
    autoplayNote.hidden = true;
  } catch (err) {
    // Se falhar, mostra aviso para o usuário interagir
    autoplayNote.hidden = false;
  }
}

// Botão para mutar/desmutar
toggleMuteBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  toggleMuteBtn.textContent = video.muted ? 'Ativar som' : 'Silenciar';
  // Se desmutar e o vídeo estava pausado por bloqueio, tenta tocar
  if (!video.muted) {
    video.play().catch(() => { /* silencia erros */ });
  }
});

// Botão pausar/retomar
pauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play().then(() => {
      pauseBtn.textContent = 'Pausar vídeo';
      autoplayNote.hidden = true;
    }).catch(() => {
      autoplayNote.hidden = false;
    });
  } else {
    video.pause();
    pauseBtn.textContent = 'Reproduzir vídeo';
  }
});

// Exemplo de ação do botão "Entrar"
enterBtn.addEventListener('click', () => {
  // Trocar para sua rota/página real
  window.location.href = 'app.html';
});

// Quando a página carrega, tenta o autoplay
window.addEventListener('load', ensureAutoplay);

// Se o vídeo não carregar, usa o poster como fundo (CSS já cobre)
video.addEventListener('error', () => {
  autoplayNote.hidden = false;
});
