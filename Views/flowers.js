// flowers.js — espalha girassóis pela camada #fx-layer

(function () {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;

  // Ajuste de caminho: assets está UM nível acima do HTML/JS
  const SRC = '../assets/girassol.png';
  const WIDTH = 3000;   // deve bater com a .fx-layer
  const COUNT = 18;

  const Y_MIN = 0.55;   // 55% da altura da viewport
  const Y_MAX = 0.90;   // até 90%

  const rand = (a,b) => a + Math.random()*(b-a);

  function sizeLayer(){
    layer.style.width = WIDTH + 'px';
    layer.style.height = window.innerHeight + 'vh';
  }
  sizeLayer();
  window.addEventListener('resize', sizeLayer);

  function createFlower(idx) {
    const el = document.createElement('div');
    el.className = 'flower is-swaying';

    const img = document.createElement('img');
    img.alt = 'Girassol';
    img.loading = 'lazy';
    img.src = SRC;

    const css = getComputedStyle(document.documentElement);
    const min = parseInt(css.getPropertyValue('--flower-min')) || 56;
    const max = parseInt(css.getPropertyValue('--flower-max')) || 120;
    const size = Math.round(rand(min, max));
    el.style.width = size + 'px';

    const h = window.innerHeight;
    const top = Math.round(rand(h*Y_MIN - size/2, h*Y_MAX - size/2));
    const left = Math.round(rand(0, WIDTH - size));
    el.style.top  = `${top}px`;
    el.style.left = `${left}px`;

    const tilt = (rand(-2, 2)).toFixed(2);
    el.style.setProperty('--tilt', `rotate(${tilt}deg)`);

    el.addEventListener('mouseenter', () => el.classList.remove('is-swaying'));
    el.addEventListener('mouseleave', () => el.classList.add('is-swaying'));
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      el.classList.remove('is-pop');
      void el.offsetWidth;
      el.classList.add('is-pop');
    });

    el.appendChild(img);
    layer.appendChild(el);
  }

  function init() {
    for (let i = 0; i < COUNT; i++) createFlower(i);
  }

  const test = new Image();
  test.onload = init;
  test.onerror = init;
  test.src = SRC;
})();
