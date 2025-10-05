// // flowers.js — girassóis + modal glass

// (function () {
//   const layer = document.getElementById('fx-layer');
//   if (!layer) return;

//   const flores = [
//   {
//     nome: "Sucupira-branca",
//     nome_cientifico: "Pterodon emarginatus",
//     floracao: "April - June",
//     descricao: "Blooms at the beginning of the dry season, taking advantage of the still residual moisture in the soil. Flowers are lilac or pale purple, with a sweet fragrance. Flowering is abundant.",
//     polinizacao: "Mainly by medium to large bees, including mamangavas, and certainly visited by social bees like uruçu in search of nectar and pollen.",
//     relevancia: "It is an excellent indicator of the beginning of the dry season. Its purple flowering stands out when the landscape is still relatively green, but the rains have already ceased. Monitoring it helps us define the start of the water stress period.",
//     porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 60, May: 80, Jun: 60, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
//   },
//   {
//     nome: "Candeia",
//     nome_cientifico: "Plathymenia reticulata",
//     floracao: "June - August",
//     descricao: "Blooms at the peak of the dry season, a period of extreme resource scarcity. Large tree covered with inflorescences of small yellow flowers. Flowering is ecologically crucial as few other plants are blooming.",
//     polinizacao: "Vital for apiculture and meliponiculture. Attracts a huge diversity of bees, which collect nectar and pollen, sustaining colonies during the dry season.",
//     relevancia: "An indicator of resilience and critical resources during the dry season. Detecting its mass flowering allows mapping 'food oases' for pollinators and understanding ecosystem health.",
//     porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 60, Jul: 80, Aug: 60, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
//   },
//   {
//     nome: "Ipê-amarelo",
//     nome_cientifico: "Handroanthus ochraceus",
//     floracao: "August - September",
//     descricao: "The most iconic bloom marking the end of the dry winter. The tree loses all leaves and, after strong water stress, bursts into intense golden-yellow flowers. Triggered by increases in temperature and humidity before the rains. Flowering lasts about a week.",
//     polinizacao: "Pollinated by large bees (mamangavas, uruçu) and visited by hummingbirds. Bees are the main agents of cross-pollination.",
//     relevancia: "Best visual indicator of dry-to-rain transition. Its strong and synchronized color makes it perfect for satellite detection and testing predictive models based on temperature and humidity.",
//     porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 60, Sep: 80, Oct: 0, Nov: 0, Dec: 0 }
//   },
//   {
//     nome: "Barbatimão",
//     nome_cientifico: "Stryphnodendron adstringens",
//     floracao: "September - November",
//     descricao: "One of the main events following the first rains. Small white-yellow flowers appear in spikes as soon as the rains return, providing the necessary water for seed production.",
//     polinizacao: "Important for bees in the Cerrado, especially for pollen collection. Attracts a large diversity of bees, including uruçu, wasps, and other insects.",
//     relevancia: "Indicator of flora response to the start of the rainy season. Its massive flowering signals the beginning of abundant pollen, essential for bee colony growth after dry season scarcity.",
//     porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 60, Oct: 80, Nov: 60, Dec: 0 }
//   },
//   {
//     nome: "Puçá / Pindabuna",
//     nome_cientifico: "Mouriri pusa",
//     floracao: "December - February",
//     descricao: "Blooms at the peak of the rainy summer. A phenomenon called 'cauliflory': purple, highly fragrant flowers grow directly on the trunk and thick branches.",
//     polinizacao: "Pollinated by medium-sized bees attracted by the perfume and vibrant color of trunk flowers.",
//     relevancia: "Cauliflory is rare and interesting. Detecting this bloom can be challenging as flowers may be obscured by foliage, but it indicates peak humidity and biological activity. Its fruits are very important for fauna.",
//     porcentagem_mes: { Jan: 60, Feb: 80, Mar: 60, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 60 }
//   },
//   {
//     nome: "Tingui",
//     nome_cientifico: "Magonia pubescens",
//     floracao: "February - April",
//     descricao: "Medium-sized tree with small red or yellow flowers. Not a massive bloom, but ecologically significant.",
//     polinizacao: "Pollinated by small bees and flies.",
//     relevancia: "Indicator of the end of the rainy season. Its fruit develops immediately after flowering, dispersing seeds before the dry season. Monitoring helps define the end of the reproductive period of most plants.",
//     porcentagem_mes: { Jan: 0, Feb: 60, Mar: 80, Apr: 60, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
//   },
//   {
//     nome: "Velame",
//     nome_cientifico: "Croton spp.",
//     floracao: "Opportunistic pulses after rain",
//     descricao: "Blooms in pulses almost all year, responding quickly to rain events, especially after a short dry period. Pioneer shrub growing in open areas. Small white flowers appear quickly after rain.",
//     polinizacao: "Attracts mainly small bees and wasps.",
//     relevancia: "A natural 'moisture sensor'. Blooming does not mark a season but rain events. Mapping its flowering can identify precisely where enough rain triggered vegetation response.",
//     porcentagem_mes: { Jan: 20, Feb: 20, Mar: 20, Apr: 20, May: 20, Jun: 20, Jul: 20, Aug: 20, Sep: 20, Oct: 20, Nov: 20, Dec: 20 }
//   }
// ];


// const imagensFlores = {
//   "Sucupira-branca": "imagens_zoom/Sucupira-brancazoom.png",
//   "Candeia": "imagens_zoom/Candeiazoom.png",
//   "Ipê-amarelo": "imagens_zoom/Ipê-amarelozoom.png",
//   "Barbatimão": "imagens_zoom/barbatimaozoom.png",
//   "Puçá": "imagens_zoom/pucazoom.png",
//   "Tingui": "imagens_zoom/Tinguizoom.png",
//   "Velame": "imagens_zoom/velamezoom.png"
// };


//   // Caminho da sua imagem (assets está um nível acima)
//   const SRC = '../../assets/girassol.png';
//   const WIDTH = 3000;   // combine com .fx-layer
//   const COUNT = 18;

//   const Y_MIN = 0.55;   // 55% da viewport
//   const Y_MAX = 0.90;   // 90% da viewport

//   // elementos do modal
//   const modal      = document.getElementById('flower-modal');
//   const backdrop   = document.getElementById('flower-modal-backdrop');
//   const modalImg   = document.getElementById('flower-modal-img');
//   const modalTitle = document.getElementById('flower-modal-title');
//   const modalDesc  = document.getElementById('flower-modal-desc');
//   const modalClose = document.querySelector('.flower-modal-close');

//   // acessibilidade: lembrar último foco para devolver depois
//   let lastFocusEl = null;

//   const rand = (a,b) => a + Math.random()*(b-a);

//   function sizeLayer(){
//     layer.style.width = WIDTH + 'px';
//     layer.style.height = '100vh';
//   }
//   sizeLayer();
//   window.addEventListener('resize', sizeLayer);

//   // —————————————— Modal control ——————————————
//   function openSunflowerModal() {
//     // se tiver o arquivo da sucupira, troque o src abaixo
//     // modalImg.src = "../../assets/sucupira.png";
//     modalImg.alt = "Sucupira-branca";
//     modalTitle.textContent = "Sucupira-branca";
//     modalDesc.innerHTML = `
//       <li><strong>Planta:</strong> Sucupira-branca <em>(Pterodon emarginatus)</em></li>
//       <li><strong>Época de Floração:</strong> Abril a Junho. É uma das primeiras árvores a florescer massivamente após o fim das chuvas.</li>
//       <li><strong>Floração e Condições:</strong> Floresce no início do período seco, aproveitando a umidade ainda residual no solo. Flores lilás ou roxo-pálido, perfume adocicado; floração abundante.</li>
//       <li><strong>Polinização:</strong> Principalmente por abelhas de médio a grande porte (incluindo mamangavas) e também visitada por abelhas sociais como a uruçu em busca de néctar e pólen.</li>
//       <li><strong>Relevância para o BloomWatch:</strong> Excelente indicador do início da estação seca. A floração roxa se destaca quando a paisagem ainda está relativamente verde, mas as chuvas já cessaram; monitorá-la ajuda a definir o começo do período de estresse hídrico.</li>
//     `;
//     // garantir tags <li> dentro de <ul>
//     if (modalDesc.tagName !== "UL") {
//       modalDesc.innerHTML = `<ul class="flower-bullets">${modalDesc.innerHTML}</ul>`;
//     }

//     backdrop.hidden = false;
//     modal.hidden = false;
//     lastFocusEl = document.activeElement;
//     modalClose.focus();
//   }


//   function closeModal() {
//     backdrop.hidden = true;
//     modal.hidden = true;
//     if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
//       lastFocusEl.focus();
//     }
//     window.flyBeeHome?.();
//   }

//   // clique no X
//   if (modalClose) {
//     modalClose.addEventListener('click', (e) => {
//       e.stopPropagation();
//       closeModal();
//     });
//   }
//   // clique fora
//   if (backdrop) {
//     backdrop.addEventListener('click', () => closeModal());
//   }
//   // ESC para fechar
//   window.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && !modal.hidden) closeModal();
//   });

//   // —————————————— Flores ——————————————
//   function createFlower(idx) {
//     const el = document.createElement('div');
//     el.className = 'flower is-swaying';

//     const img = document.createElement('img');
//     img.alt = 'Girassol';
//     img.loading = 'lazy';
//     img.src = SRC;

//     // tamanho
//     const css = getComputedStyle(document.documentElement);
//     const min = parseInt(css.getPropertyValue('--flower-min')) || 56;
//     const max = parseInt(css.getPropertyValue('--flower-max')) || 120;
//     const size = Math.round(rand(min, max));
//     el.style.width = size + 'px';

//     // posição
//     const h = window.innerHeight;
//     const top = Math.round(rand(h*Y_MIN - size/2, h*Y_MAX - size/2));
//     const left = Math.round(rand(0, WIDTH - size));
//     el.style.top  = `${top}px`;
//     el.style.left = `${left}px`;

//     // tilt leve
//     const tilt = (rand(-2, 2)).toFixed(2);
//     el.style.setProperty('--tilt', `rotate(${tilt}deg)`);

//     // interações
//     el.addEventListener('mouseenter', () => el.classList.remove('is-swaying'));
//     el.addEventListener('mouseleave', () => el.classList.add('is-swaying'));

//     el.addEventListener('click', async (e) => {
//       e.stopPropagation();
//       el.classList.remove('is-pop'); void el.offsetWidth; el.classList.add('is-pop');

//       // se existir a função de voo, aguarde o voo até a flor
//       if (typeof window.flyBeeTo === 'function') {
//         try { await window.flyBeeTo(el); } catch {}
//       }

//       // ↓ coloca a abelha ATRÁS do modal (e também atrás do backdrop)
//       // backdrop = z-index: 4, modal = 5 → usar 3 garante ficar atrás de ambos
//       window.setBeeZIndex?.(3);

//       openSunflowerModal();
//     });


//     el.appendChild(img);
//     layer.appendChild(el);
//   }

//   function init() {
//     for (let i = 0; i < COUNT; i++) createFlower(i);
//   }

//   // pré-carrega a imagem (não trava se falhar)
//   const test = new Image();
//   test.onload = init;
//   test.onerror = init;
//   test.src = SRC;

// })();


// flowers.js — girassóis + modal + filtro por mês
// flowers.js — girassóis + modal + filtro por mês
(function () {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;

  const WIDTH = 3000;
  const Y_MIN = 0.55; 
  const Y_MAX = 0.90;

  // ————— Dados das flores —————
  const flores = [
    {
      nome: "Sucupira-branca",
      nome_cientifico: "Pterodon emarginatus",
      floracao: "April - June",
      descricao: "Blooms at the beginning of the dry season, taking advantage of the still residual moisture in the soil. Flowers are lilac or pale purple, with a sweet fragrance. Flowering is abundant.",
      polinizacao: "Mainly by medium to large bees, including mamangavas, and certainly visited by social bees like uruçu in search of nectar and pollen.",
      relevancia: "It is an excellent indicator of the beginning of the dry season. Its purple flowering stands out when the landscape is still relatively green, but the rains have already ceased. Monitoring it helps us define the start of the water stress period.",
      porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 60, May: 80, Jun: 60, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      nome: "Candeia",
      nome_cientifico: "Plathymenia reticulata",
      floracao: "June - August",
      descricao: "Blooms at the peak of the dry season, a period of extreme resource scarcity. Large tree covered with inflorescences of small yellow flowers. Flowering is ecologically crucial as few other plants are blooming.",
      polinizacao: "Vital for apiculture and meliponiculture. Attracts a huge diversity of bees, which collect nectar and pollen, sustaining colonies during the dry season.",
      relevancia: "An indicator of resilience and critical resources during the dry season. Detecting its mass flowering allows mapping 'food oases' for pollinators and understanding ecosystem health.",
      porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 60, Jul: 80, Aug: 60, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      nome: "Ipê-amarelo",
      nome_cientifico: "Handroanthus ochraceus",
      floracao: "August - September",
      descricao: "The most iconic bloom marking the end of the dry winter. The tree loses all leaves and, after strong water stress, bursts into intense golden-yellow flowers. Triggered by increases in temperature and humidity before the rains. Flowering lasts about a week.",
      polinizacao: "Pollinated by large bees (mamangavas, uruçu) and visited by hummingbirds. Bees are the main agents of cross-pollination.",
      relevancia: "Best visual indicator of dry-to-rain transition. Its strong and synchronized color makes it perfect for satellite detection and testing predictive models based on temperature and humidity.",
      porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 60, Sep: 80, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      nome: "Barbatimão",
      nome_cientifico: "Stryphnodendron adstringens",
      floracao: "September - November",
      descricao: "One of the main events following the first rains. Small white-yellow flowers appear in spikes as soon as the rains return, providing the necessary water for seed production.",
      polinizacao: "Important for bees in the Cerrado, especially for pollen collection. Attracts a large diversity of bees, including uruçu, wasps, and other insects.",
      relevancia: "Indicator of flora response to the start of the rainy season. Its massive flowering signals the beginning of abundant pollen, essential for bee colony growth after dry season scarcity.",
      porcentagem_mes: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 60, Oct: 80, Nov: 60, Dec: 0 }
    },
    {
      nome: "Puçá / Pindabuna",
      nome_cientifico: "Mouriri pusa",
      floracao: "December - February",
      descricao: "Blooms at the peak of the rainy summer. A phenomenon called 'cauliflory': purple, highly fragrant flowers grow directly on the trunk and thick branches.",
      polinizacao: "Pollinated by medium-sized bees attracted by the perfume and vibrant color of trunk flowers.",
      relevancia: "Cauliflory is rare and interesting. Detecting this bloom can be challenging as flowers may be obscured by foliage, but it indicates peak humidity and biological activity. Its fruits are very important for fauna.",
      porcentagem_mes: { Jan: 60, Feb: 80, Mar: 60, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 60 }
    },
    {
      nome: "Tingui",
      nome_cientifico: "Magonia pubescens",
      floracao: "February - April",
      descricao: "Medium-sized tree with small red or yellow flowers. Not a massive bloom, but ecologically significant.",
      polinizacao: "Pollinated by small bees and flies.",
      relevancia: "Indicator of the end of the rainy season. Its fruit develops immediately after flowering, dispersing seeds before the dry season. Monitoring helps define the end of the reproductive period of most plants.",
      porcentagem_mes: { Jan: 0, Feb: 60, Mar: 80, Apr: 60, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      nome: "Velame",
      nome_cientifico: "Croton spp.",
      floracao: "Opportunistic pulses after rain",
      descricao: "Blooms in pulses almost all year, responding quickly to rain events, especially after a short dry period. Pioneer shrub growing in open areas. Small white flowers appear quickly after rain.",
      polinizacao: "Attracts mainly small bees and wasps.",
      relevancia: "A natural 'moisture sensor'. Blooming does not mark a season but rain events. Mapping its flowering can identify precisely where enough rain triggered vegetation response.",
      porcentagem_mes: { Jan: 20, Feb: 20, Mar: 20, Apr: 20, May: 20, Jun: 20, Jul: 20, Aug: 20, Sep: 20, Oct: 20, Nov: 20, Dec: 20 }
    }
  ];

  const imagensFlores = {
    "Sucupira-branca": "/imagens_zoom/Sucupira-brancazoom.png",
    "Candeia": "/imagens_zoom/Candeiazoom.png",
    "Ipê-amarelo": "/imagens_zoom/Ipê-amarelozoom.png",
    "Barbatimão": "/imagens_zoom/barbatimaozoom.png",
    "Puçá / Pindabuna": "/imagens_zoom/pucazoom.png",
    "Tingui": "/imagens_zoom/Tinguizoom.png",
    "Velame": "/imagens_zoom/velamezoom.png"
  };
  const SRC = '/assets/girassol.png'; // fallback

  // Elementos do modal
  const modal      = document.getElementById('flower-modal');
  const backdrop   = document.getElementById('flower-modal-backdrop');
  const modalImg   = document.getElementById('flower-modal-img');
  const modalTitle = document.getElementById('flower-modal-title');
  const modalDesc  = document.getElementById('flower-modal-desc');
  const modalClose = document.querySelector('.flower-modal-close');
  let lastFocusEl = null;

  const rand = (a,b) => a + Math.random()*(b-a);

  // Ajusta layer
  function sizeLayer(){
    layer.style.width = WIDTH + 'px';
    layer.style.height = '100vh';
  }
  sizeLayer();
  window.addEventListener('resize', sizeLayer);

  // Modal
  function openFlowerModal(flower) {
    modalImg.src = imagensFlores[flower.nome] || SRC;
    modalImg.alt = flower.nome;
    modalTitle.textContent = flower.nome;
    modalDesc.innerHTML = `
      <ul class="flower-bullets">
        <li><strong>Nome científico:</strong> ${flower.nome_cientifico}</li>
        <li><strong>Época de Floração:</strong> ${flower.floracao}</li>
        <li><strong>Descrição:</strong> ${flower.descricao}</li>
        <li><strong>Polinização:</strong> ${flower.polinizacao}</li>
        <li><strong>Relevância:</strong> ${flower.relevancia}</li>
      </ul>
    `;
    backdrop.hidden = false;
    modal.hidden = false;
    lastFocusEl = document.activeElement;
    modalClose.focus();
  }

  function closeModal() {
    backdrop.hidden = true;
    modal.hidden = true;
    if (lastFocusEl?.focus) lastFocusEl.focus();
  }

  modalClose?.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });
  backdrop?.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => { if(e.key==='Escape') closeModal(); });

  // Filtra flores do mês
  function getFlowersForMonth(month) {
    return flores.filter(f => (f.porcentagem_mes[month] || 0) > 0);
  }

  // Renderiza flores no layer
  function renderFlowers(month) {
    layer.innerHTML = '';
    const selectedFlowers = getFlowersForMonth(month);

    selectedFlowers.forEach(flower => {
      const el = document.createElement('div');
      el.className = 'flower is-swaying';

      const img = document.createElement('img');
      img.alt = flower.nome;
      img.src = imagensFlores[flower.nome] || SRC;
      img.loading = 'lazy';

      const pct = flower.porcentagem_mes[month];
      const min = 50, max = 120;
      const size = min + (max - min) * (pct/100);
      el.style.width = size+'px';

      const h = window.innerHeight;
      const top = Math.round(rand(h*Y_MIN - size/2, h*Y_MAX - size/2));
      const left = Math.round(rand(0, WIDTH - size));
      el.style.top = `${top}px`;
      el.style.left = `${left}px`;

      el.style.setProperty('--tilt', `rotate(${(rand(-2,2)).toFixed(2)}deg)`);

      el.addEventListener('mouseenter', () => el.classList.remove('is-swaying'));
      el.addEventListener('mouseleave', () => el.classList.add('is-swaying'));

      el.addEventListener('click', () => openFlowerModal(flower));

      el.appendChild(img);
      layer.appendChild(el);
    });
  }

  // Seleção de mês
  const monthSpans = document.querySelectorAll('.hud-months span');
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  monthSpans.forEach(span => {
    span.addEventListener('click', () => {
      monthSpans.forEach(s => s.classList.remove('active'));
      span.classList.add('active');
      renderFlowers(span.textContent);
    });
  });

  // Renderiza mês atual por padrão
  const now = new Date();
  renderFlowers(monthNames[now.getMonth()]);
})();
