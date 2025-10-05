// flowers.js — girassóis + modal glass

(function () {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;

  // Caminho da sua imagem (assets está um nível acima)
  const SRC = '../assets/girassol.png';
  const WIDTH = 3000;   // combine com .fx-layer
  const COUNT = 18;

  const Y_MIN = 0.55;   // 55% da viewport
  const Y_MAX = 0.90;   // 90% da viewport

  // elementos do modal
  const modal      = document.getElementById('flower-modal');
  const backdrop   = document.getElementById('flower-modal-backdrop');
  const modalImg   = document.getElementById('flower-modal-img');
  const modalTitle = document.getElementById('flower-modal-title');
  const modalDesc  = document.getElementById('flower-modal-desc');
  const modalClose = document.querySelector('.flower-modal-close');

  // acessibilidade: lembrar último foco para devolver depois
  let lastFocusEl = null;

  const rand = (a,b) => a + Math.random()*(b-a);

  function sizeLayer(){
    layer.style.width = WIDTH + 'px';
    layer.style.height = '100vh';
  }
  sizeLayer();
  window.addEventListener('resize', sizeLayer);

  // —————————————— Modal control ——————————————
  function openSunflowerModal() {
    // conteúdo do Girassol (pode personalizar depois)
    modalImg.src = SRC;
    modalImg.alt = 'Girassol';
    modalTitle.textContent = 'Girassol';
    modalDesc.innerHTML =
      '<strong>Helianthus annuus</strong> — Famoso pelo heliotropismo na fase jovem e cabeças florais grandes que atraem polinizadores. ' +
      'Gosta de sol pleno, regas regulares e solo bem drenado.';

    backdrop.hidden = false;
    modal.hidden = false;

    // foco
    lastFocusEl = document.activeElement;
    modalClose.focus();
  }

  function closeModal() {
    backdrop.hidden = true;
    modal.hidden = true;
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
      lastFocusEl.focus();
    }
    window.flyBeeHome?.();
  }

  // clique no X
  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }
  // clique fora
  if (backdrop) {
    backdrop.addEventListener('click', () => closeModal());
  }
  // ESC para fechar
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // —————————————— Flores ——————————————
  function createFlower(idx) {
    const el = document.createElement('div');
    el.className = 'flower is-swaying';

    const img = document.createElement('img');
    img.alt = 'Girassol';
    img.loading = 'lazy';
    img.src = SRC;

    // tamanho
    const css = getComputedStyle(document.documentElement);
    const min = parseInt(css.getPropertyValue('--flower-min')) || 56;
    const max = parseInt(css.getPropertyValue('--flower-max')) || 120;
    const size = Math.round(rand(min, max));
    el.style.width = size + 'px';

    // posição
    const h = window.innerHeight;
    const top = Math.round(rand(h*Y_MIN - size/2, h*Y_MAX - size/2));
    const left = Math.round(rand(0, WIDTH - size));
    el.style.top  = `${top}px`;
    el.style.left = `${left}px`;

    // tilt leve
    const tilt = (rand(-2, 2)).toFixed(2);
    el.style.setProperty('--tilt', `rotate(${tilt}deg)`);

    // interações
    el.addEventListener('mouseenter', () => el.classList.remove('is-swaying'));
    el.addEventListener('mouseleave', () => el.classList.add('is-swaying'));

    el.addEventListener('click', async (e) => {
      e.stopPropagation();
      el.classList.remove('is-pop'); void el.offsetWidth; el.classList.add('is-pop');

      // se existir a função de voo, aguarde o voo até a flor
      if (typeof window.flyBeeTo === 'function') {
        try { await window.flyBeeTo(el); } catch {}
      }

      // ↓ coloca a abelha ATRÁS do modal (e também atrás do backdrop)
      // backdrop = z-index: 4, modal = 5 → usar 3 garante ficar atrás de ambos
      window.setBeeZIndex?.(3);

      openSunflowerModal();
    });


    el.appendChild(img);
    layer.appendChild(el);
  }

  function init() {
    for (let i = 0; i < COUNT; i++) createFlower(i);
  }

  // pré-carrega a imagem (não trava se falhar)
  const test = new Image();
  test.onload = init;
  test.onerror = init;
  test.src = SRC;

})();
