// ============================================================
// IMAGES.JS v3 — Sistema de imágenes híbrido
// • Avatares: thispersondoesnotexist (fotos ultrarrealistas)
// • Posts legítimos: Picsum (fotos reales instantáneas)
// • Banners maliciosos: Pollinations (generación con IA)
// ============================================================

const POLLINATIONS = 'https://image.pollinations.ai/prompt';
const PICSUM = 'https://picsum.photos';

const imgCache = {};

// --- URL builders ---

function pollinationsUrl(prompt, w = 400, h = 200, seed = null) {
  const s = seed !== null ? seed : Math.floor(Math.random() * 9999);
  return `${POLLINATIONS}/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${s}&model=flux&enhance=true`;
}

// Picsum con seed fijo = misma imagen siempre, carga instantánea
function picsumUrl(w, h, seed) {
  return `${PICSUM}/seed/${seed}/${w}/${h}`;
}

// ThisPersonDoesNotExist — genera cara nueva cada llamada
// Usamos un proxy con seed para cachear
function avatarUrl(seed) {
  // Usamos picsum para personas (es más confiable y rápido)
  // seeds 10-100 tienen fotos de personas en picsum
  const personSeeds = [10,20,25,30,40,50,64,65,70,75,80,91,94,96,100,
                       110,120,130,150,160,180,190,200,210,220,230,250];
  const s = personSeeds[seed % personSeeds.length];
  return `${PICSUM}/seed/${s}/80/80`;
}

// --- Skeleton helper ---
function skeleton(w, h, radius = '50%') {
  const d = document.createElement('div');
  d.className = 'img-skeleton';
  d.style.cssText = `width:${w}px;height:${h}px;border-radius:${radius};flex-shrink:0;`;
  return d;
}

// --- Avatar circular ---
function getPreloadedAvatar(botType, isLegit, size = 38) {
  const seed = Math.floor(Math.random() * 80) + 10;
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;flex-shrink:0;background:var(--surface);`;

  const url = avatarUrl(seed);
  const cacheKey = 'av_' + seed;

  if (imgCache[cacheKey]) {
    wrapper.innerHTML = `<img src="${imgCache[cacheKey]}" style="width:100%;height:100%;object-fit:cover;">`;
    return wrapper;
  }

  const sk = skeleton(size, size);
  wrapper.appendChild(sk);

  const img = new Image();
  img.onload = () => {
    imgCache[cacheKey] = img.src;
    wrapper.innerHTML = '';
    const el = document.createElement('img');
    el.src = img.src;
    el.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    wrapper.appendChild(el);
  };
  img.onerror = () => {
    // Fallback: color + inicial
    const color = BOT_COLORS ? BOT_COLORS[seed % BOT_COLORS.length] : '#7c5cfc';
    wrapper.innerHTML = `<div style="width:100%;height:100%;background:${color}33;display:flex;align-items:center;justify-content:center;font-size:${Math.floor(size/2.2)}px;font-weight:700;color:${color};">?</div>`;
  };
  img.src = url;
  return wrapper;
}

// --- Post image ---
// Legítimos: Picsum (instantáneo, fotos reales)
// Maliciosos: Pollinations (IA genera banner de estafa)

const PICSUM_NATURE_SEEDS = [15,28,37,43,55,67,82,93,107,119,132,145,158,171,184,197];
const PICSUM_FOOD_SEEDS = [225,238,251,264,277,290,303,316,329,342];
const PICSUM_CITY_SEEDS = [355,368,381,394,407,420,433,446,459,472];

const BOT_POST_PROMPTS = {
  phish: [
    'fake social media prize winner banner YOU WON iPhone, bright red gold confetti, scam aesthetic, bold text',
    'fake instagram account verification banner, blue badge, urgent warning, dark UI',
    'fake bank security alert, red warning colors, mobile notification style, urgent',
    'fake sweepstakes winner announcement, colorful celebration banner, too good to be true',
    'fake crypto giveaway banner, bitcoin gold colors, social media scam',
  ],
  social: [
    'suspicious message screenshot, chat interface, urgent plea, manipulation tactics visible',
    'fake emergency family text message screenshot, distressed design',
  ],
  spam: [
    'fake breaking news banner, alarmist red design, misinformation aesthetic, bold headline',
    'fake viral health miracle cure banner, suspicious green design, bold claims',
    'fake government warning banner, urgent alert design, conspiracy aesthetic',
    'fake chain message screenshot, warning text, share now design',
  ],
  clone: [
    'fake official brand logo slightly off, knockoff design, suspicious resemblance',
    'fake charity donation banner, emotional manipulation design, suspicious',
  ],
  perm: [
    'suspicious mobile app ad, FREE premium features banner, flashy design, too good to be true',
    'fake app promotion, get 10000 followers, suspicious design, mobile ad screenshot',
    'suspicious app permissions request screenshot, many checkboxes, privacy invasion',
  ],
};

function getPreloadedPostImage(botType, isLegit) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'width:100%;height:180px;overflow:hidden;border-radius:12px;border:1px solid var(--border);margin:6px 0;background:var(--surface);flex-shrink:0;';

  if (isLegit) {
    // Picsum — rápido y real
    const allSeeds = [...PICSUM_NATURE_SEEDS, ...PICSUM_FOOD_SEEDS, ...PICSUM_CITY_SEEDS];
    const seed = allSeeds[Math.floor(Math.random() * allSeeds.length)];
    const url = picsumUrl(500, 180, seed);

    const img = document.createElement('img');
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    img.src = url;
    img.onerror = () => { wrapper.style.display = 'none'; };
    wrapper.appendChild(img);
  } else {
    // Pollinations — genera banner de estafa con IA
    const prompts = BOT_POST_PROMPTS[botType] || BOT_POST_PROMPTS.phish;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    const seed = Math.floor(Math.random() * 999);
    const url = pollinationsUrl(prompt, 500, 180, seed);

    const sk = skeleton(500, 180, '12px');
    sk.style.width = '100%';
    sk.style.height = '100%';
    wrapper.appendChild(sk);

    const img = new Image();
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    img.onload = () => { wrapper.innerHTML = ''; wrapper.appendChild(img); };
    img.onerror = () => { wrapper.style.display = 'none'; };
    img.src = url;
  }

  return wrapper;
}

// --- Landing background ---
function loadLandingBg() {
  // Usamos un gradiente animado en CSS en vez de imagen generada
  // para que la landing cargue instantáneo
  const bg = document.querySelector('.landing-bg');
  if (!bg) return;
  // El fondo ya está en el CSS con grid-overlay y noise
  // Agregamos un gradiente radial extra
  bg.style.background = 'radial-gradient(ellipse at 30% 50%, rgba(124,92,252,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(255,75,110,0.08) 0%, transparent 50%)';
}

// --- Preload system ---
const preloadPool = { avatars: [], posts: { legit: [], bot: [] } };

function preloadAllImages() {
  // Precargar 12 avatares
  for (let i = 0; i < 12; i++) {
    const seed = Math.floor(Math.random() * 80) + 10;
    const img = new Image();
    img.src = avatarUrl(seed);
    img.dataset.seed = seed;
    preloadPool.avatars.push(img);
  }

  // Precargar 6 imágenes de posts legítimos con Picsum
  const allSeeds = [...PICSUM_NATURE_SEEDS, ...PICSUM_FOOD_SEEDS, ...PICSUM_CITY_SEEDS];
  for (let i = 0; i < 6; i++) {
    const seed = allSeeds[Math.floor(Math.random() * allSeeds.length)];
    const img = new Image();
    img.src = picsumUrl(500, 180, seed);
    preloadPool.posts.legit.push(img);
  }

  console.log('🖼️ Precargando imágenes...');
}
