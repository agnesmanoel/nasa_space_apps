// flowers.js — sunflowers + modal + NDVI (amount) + per-species abundance (EN data)
(function () {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;

  // Layout (match .fx-layer in CSS)
  const WIDTH = 3000;
  const Y_MIN = 0.35;
  const Y_MAX = 0.70;

  // Month keys used in month_percentage objects
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // ————— Flower data (EN) —————
  const flowers = [
    {
      name: "White Sucupira",
      scientific_name: "Pterodon emarginatus",
      flowering: "April – June",
      description: "Early dry-season bloom taking advantage of residual soil moisture; lilac to pale purple flowers with a sweet fragrance.",
      pollination: "Mainly by medium to large bees (including carpenter bees) and also visited by social bees like uruçu for nectar and pollen.",
      relevance: "Excellent indicator of the dry season onset; stands out when the landscape is still relatively green after rains cease.",
      month_percentage: { Jan: 0, Feb: 0, Mar: 0, Apr: 60, May: 80, Jun: 60, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      name: "Candeia",
      scientific_name: "Plathymenia reticulata",
      flowering: "June – August",
      description: "Peaks during the harsh dry season; large tree covered with small yellow inflorescences; ecologically crucial when few plants bloom.",
      pollination: "Highly important for apiculture and meliponiculture; attracts many bee species collecting nectar and pollen.",
      relevance: "Indicator of resilience and critical resources in the dry season; mapping mass bloom helps locate ‘food oases’ for pollinators.",
      month_percentage: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 60, Jul: 80, Aug: 60, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      name: "Yellow Ipê",
      scientific_name: "Handroanthus ochraceus",
      flowering: "August – September",
      description: "Iconic bloom marking the end of the dry winter; leafless trees burst into intense golden flowers shortly before rains.",
      pollination: "Pollinated by large bees (e.g., carpenter bees); also visited by hummingbirds; bees are key for cross-pollination.",
      relevance: "Great visual indicator of the dry-to-rain transition; strong, synchronized color suits satellite detection and modeling.",
      month_percentage: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 60, Sep: 80, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      name: "Barbatimao",
      scientific_name: "Stryphnodendron adstringens",
      flowering: "September – November",
      description: "Among the first events after rains return; small whitish-yellow spike flowers enable rapid seed production.",
      pollination: "Important pollen source for Cerrado bees; attracts diverse bees (including uruçu), wasps, and other insects.",
      relevance: "Signals flora response at the start of the rainy season; abundant pollen is essential for colony growth after scarcity.",
      month_percentage: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 60, Oct: 80, Nov: 60, Dec: 0 }
    },
    {
      name: "Puca (Pindabuna)",
      scientific_name: "Mouriri pusa",
      flowering: "December – February",
      description: "Rainy-summer peak; cauliflory with purple, highly fragrant flowers growing on trunk and thick branches.",
      pollination: "Pollinated by medium-sized bees attracted by perfume and vibrant trunk flowers.",
      relevance: "Indicates peak humidity and biological activity; fruits are important for fauna; bloom may be obscured by foliage.",
      month_percentage: { Jan: 60, Feb: 80, Mar: 60, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 60 }
    },
    {
      name: "Tingui",
      scientific_name: "Magonia pubescens",
      flowering: "February – April",
      description: "Medium-sized tree with small red/yellow flowers; not a massive bloom but ecologically significant.",
      pollination: "Pollinated by small bees and flies.",
      relevance: "Marks the end of the rainy season; fruit develops right after flowering, dispersing before the dry season.",
      month_percentage: { Jan: 0, Feb: 60, Mar: 80, Apr: 60, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
    },
    {
      name: "Velame",
      scientific_name: "Croton spp.",
      flowering: "Opportunistic pulses after rain",
      description: "Pioneer shrub in open areas; small white flowers appear rapidly after rain; can pulse most of the year.",
      pollination: "Attracts mainly small bees and wasps.",
      relevance: "A natural ‘moisture sensor’; bloom maps pinpoint where rainfall triggered vegetation response.",
      month_percentage: { Jan: 20, Feb: 20, Mar: 20, Apr: 20, May: 20, Jun: 20, Jul: 20, Aug: 20, Sep: 20, Oct: 20, Nov: 20, Dec: 20 }
    }
  ];

  // Image paths (keys must match `name`)
  const imagesZoom = {
    "White Sucupira": "/imagens_zoom/Sucupira-brancazoom.png",
    "Candeia": "/imagens_zoom/Candeiazoom.png",
    "Yellow Ipê": "/imagens_zoom/Ipê-amarelozoom.png",
    "Barbatimao": "/imagens_zoom/barbatimaozoom.png",
    "Puca (Pindabuna)": "/imagens_zoom/pucazoom.png",
    "Tingui": "/imagens_zoom/Tinguizoom.png",
    "Velame": "/imagens_zoom/velamezoom.png"
  };
  const images = {
    "White Sucupira": "/imagens/Sucupira-branca.png",
    "Candeia": "/imagens/Candeia.png",
    "Yellow Ipê": "/imagens/Ipê-amarelo.png",
    "Barbatimao": "/imagens/barbatimao.png",
    "Puca (Pindabuna)": "/imagens/puca.png",
    "Tingui": "/imagens/Tingui.png",
    "Velame": "/imagens/velame.png"
  };
  const SRC = '/assets/girassol.png'; // fallback

  // Utils
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const rand = (a,b) => a + Math.random()*(b-a);

  // NDVI (0..1) → total flower count [MIN..MAX]
  function ndviToCount(ndvi) {
    const MIN = 50, MAX = 200;
    const t = Number.isFinite(ndvi) ? clamp01((ndvi - 0.30) / 0.70) : 0;
    return Math.round(MIN + (MAX - MIN) * t);
  }

  // Fit layer size
  function sizeLayer(){
    layer.style.width = WIDTH + 'px';
    layer.style.height = '100vh';
  }
  sizeLayer();
  window.addEventListener('resize', sizeLayer);

  // ===== Modal =====
  const modal      = document.getElementById('flower-modal');
  const backdrop   = document.getElementById('flower-modal-backdrop');
  const modalImg   = document.getElementById('flower-modal-img');
  const modalTitle = document.getElementById('flower-modal-title');
  const modalDesc  = document.getElementById('flower-modal-desc');
  const modalClose = document.querySelector('.flower-modal-close');
  let lastFocusEl = null;

  function openFlowerModal(flower) {
    modalImg.src = imagesZoom[flower?.name] || SRC;
    modalImg.alt = flower?.name || 'Flower';
    modalTitle.textContent = flower?.name || 'Flower';
    modalDesc.innerHTML = `
      <ul class="flower-bullets">
        ${flower?.scientific_name ? `<li><strong>Scientific name:</strong> ${flower.scientific_name}</li>` : ''}
        ${flower?.flowering ? `<li><strong>Flowering season:</strong> ${flower.flowering}</li>` : ''}
        ${flower?.description ? `<li><strong>Description:</strong> ${flower.description}</li>` : ''}
        ${flower?.pollination ? `<li><strong>Pollination:</strong> ${flower.pollination}</li>` : ''}
        ${flower?.relevance ? `<li><strong>Relevance:</strong> ${flower.relevance}</li>` : ''}
      </ul>
    `;
    backdrop.hidden = false;
    modal.hidden = false;
    lastFocusEl = document.activeElement;
    modalClose?.focus();
  }
  function closeModal() {
    backdrop.hidden = true;
    modal.hidden = true;
    if (lastFocusEl?.focus) lastFocusEl.focus();
  }
  modalClose?.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });
  backdrop?.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // Pool of active species for given monthIndex
  function getFlowersPoolForMonth(monthIndex) {
    const key = monthNames[monthIndex];
    return flowers.filter(f => (f.month_percentage[key] || 0) > 0);
  }

  // ===== Render using NDVI + per-species abundance =====
  function renderFlowersByNDVI(monthIndex, ndvi){
    layer.innerHTML = '';

    const COUNT = ndviToCount(ndvi);
    const key = monthNames[monthIndex];
    const pool = getFlowersPoolForMonth(monthIndex);

    // No active species this month → generic fallback
    if (!pool.length) {
      const h = window.innerHeight;
      for (let i = 0; i < COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'flower is-swaying';
        const img = document.createElement('img');
        img.alt = 'Flower';
        img.loading = 'lazy';
        img.src = SRC;

        const size = Math.round(50 + Math.random() * 70);
        el.style.width = size + 'px';

        const top  = Math.round(rand(h * Y_MIN - size/2, h * Y_MAX - size/2));
        const left = Math.round(rand(0, WIDTH - size));
        el.style.top  = `${top}px`;
        el.style.left = `${left}px`;
        el.style.setProperty('--tilt', `rotate(${(rand(-2, 2)).toFixed(2)}deg)`);

        el.appendChild(img);
        layer.appendChild(el);
      }
      return;
    }

    // Distribute COUNT proportionally to month_percentage
    const weights = pool.map(f => Math.max(0, f.month_percentage[key] || 0));
    let W = weights.reduce((a,b)=>a+b, 0);
    if (W <= 0) W = 1;

    let quotas = weights.map(w => Math.round(COUNT * w / W));
    if (COUNT >= pool.length) quotas = quotas.map(q => Math.max(1, q)); // ensure ≥1 when possible

    // Adjust to match COUNT exactly
    let sumQ = quotas.reduce((a,b)=>a+b,0);
    let diff = COUNT - sumQ;
    if (diff !== 0) {
      const idx = pool.map((_,i)=>i).sort((a,b)=>weights[b]-weights[a]); // prioritize heavier
      let k = 0;
      while (diff !== 0 && idx.length) {
        const i = idx[k % idx.length];
        if (diff > 0) { quotas[i]++; diff--; }
        else if (diff < 0 && quotas[i] > 0) { quotas[i]--; diff++; }
        k++;
      }
    }

    // Render per species
    const h = window.innerHeight;
    pool.forEach((spec, i) => {
      const n = quotas[i] || 0;
      if (n <= 0) return;

      const pct = spec.month_percentage[key] || 50; // drives base size
      const min = 50, max = 120;
      const baseSize = Math.round(min + (max - min) * (pct / 100));

      for (let k = 0; k < n; k++) {
        const el = document.createElement('div');
        el.className = 'flower is-swaying';

        const img = document.createElement('img');
        img.alt = spec.name;
        img.loading = 'lazy';
        img.src = images[spec.name] || SRC;

        const jitter = rand(-10, 10);
        const size = Math.max(36, baseSize + jitter);
        el.style.width = size + 'px';

        const top  = Math.round(rand(h * Y_MIN - size/2, h * Y_MAX - size/2));
        const left = Math.round(rand(0, WIDTH - size));
        el.style.top  = `${top}px`;
        el.style.left = `${left}px`;
        el.style.setProperty('--tilt', `rotate(${(rand(-2, 2)).toFixed(2)}deg)`);

        // interactions + modal
        el.addEventListener('mouseenter', () => el.classList.remove('is-swaying'));
        el.addEventListener('mouseleave', () => el.classList.add('is-swaying'));
        el.addEventListener('click', () => openFlowerModal(spec));

        el.appendChild(img);
        layer.appendChild(el);
      }
    });
  }

  // ===== Integration with explore.js =====
  // explore.js should dispatch on month/year change:
  // window.dispatchEvent(new CustomEvent('ndvi-change', { detail: { year, monthIndex, ndvi } }));
  window.addEventListener('ndvi-change', (e) => {
    const { monthIndex, ndvi } = e.detail || {};
    renderFlowersByNDVI(monthIndex, ndvi);
  });

  // Click on months (compatibility with existing UI)
  const monthSpans = document.querySelectorAll('.hud-months span');
  monthSpans.forEach((span, idx) => {
    span.addEventListener('click', () => {
      const activeYearEl = document.querySelector('.hud-year span.active');
      const year = parseInt(activeYearEl?.dataset.year || '2026', 10);
      const ndvi = window.MONTH_DATA?.[year]?.[idx]?.ndvi; // fallback if event not fired yet
      renderFlowersByNDVI(idx, ndvi);
    });
  });

  // Initial render: read active month/year from UI and try NDVI from MONTH_DATA
  function initialRenderFromUI(){
    const activeYearEl  = document.querySelector('.hud-year span.active');
    const activeMonthEl = document.querySelector('.hud-months span.active');
    const year = parseInt(activeYearEl?.dataset.year || '2026', 10);
    const monthIndex = Math.max(0, Array.from(document.querySelectorAll('.hud-months span')).indexOf(activeMonthEl));
    const ndvi = window.MONTH_DATA?.[year]?.[monthIndex]?.ndvi; // may be undefined
    renderFlowersByNDVI(monthIndex, ndvi);
  }

  // Preload base image then render
  const preload = new Image();
  preload.onload = () => initialRenderFromUI();
  preload.onerror = () => initialRenderFromUI();
  preload.src = SRC;
})();
