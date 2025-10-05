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
