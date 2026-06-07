// ============================================================
// GAME.JS — SocialSurvivor CTPSecurity — Versión Final Limpia
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCFkyDxtDMrJ9muDvpZfMtsYIExXPyjHA8",
  authDomain: "feria-cientifica-ctpsegurity.firebaseapp.com",
  databaseURL: "https://feria-cientifica-ctpsegurity-default-rtdb.firebaseio.com",
  projectId: "feria-cientifica-ctpsegurity",
  storageBucket: "feria-cientifica-ctpsegurity.firebasestorage.app",
  messagingSenderId: "966178681243",
  appId: "1:966178681243:web:419bafc7939e410e9a313e",
  measurementId: "G-5ZRWJCLNY7"
};

const GAME_DURATION = 120;
const ADMIN_PASSWORD = 'feria2025';

let gameState = {
  running: false,
  health: 100,
  score: 0,
  combo: 0,
  maxCombo: 0,
  timeLeft: GAME_DURATION,
  timerInterval: null,
  messageQueue: [],
  msgIndex: 0,
  stats: {
    phish:  { correct: 0, wrong: 0 },
    social: { correct: 0, wrong: 0 },
    spam:   { correct: 0, wrong: 0 },
    clone:  { correct: 0, wrong: 0 },
    perm:   { correct: 0, wrong: 0 },
    legit_wrongly_reported: 0,
    legit_correctly_allowed: 0
  },
  currentPopupMsg: null,
  playerName: '',
  useDemoMode: true,
  activeMessages: {},
  pendingCount: 0,
  myPlayerRef: null
};

let db = null;
let lobbyCode = null;

// ============================================================
// FIREBASE
// ============================================================
function initFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    gameState.useDemoMode = false;
    console.log('✅ Firebase conectado');
  } catch(e) {
    console.warn('Firebase error:', e.message);
    gameState.useDemoMode = true;
  }
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
  if (id === 'screen-quiz-pre') initPreQuiz();
  if (id === 'screen-lobby') initLobby();
  if (id === 'screen-results') { renderResults(); initPostQuiz(); }
  if (id === 'screen-leaderboard') showLeaderboard();
}

// ============================================================
// JUEGO — INICIO
// ============================================================
function startGame() {
  gameState = {
    ...gameState,
    running: true,
    health: 100,
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeLeft: GAME_DURATION,
    messageQueue: generateMessageQueue(),
    msgIndex: 0,
    currentPopupMsg: null,
    activeMessages: {},
    pendingCount: 0,
    stats: {
      phish:  { correct: 0, wrong: 0 },
      social: { correct: 0, wrong: 0 },
      spam:   { correct: 0, wrong: 0 },
      clone:  { correct: 0, wrong: 0 },
      perm:   { correct: 0, wrong: 0 },
      legit_wrongly_reported: 0,
      legit_correctly_allowed: 0
    }
  };

  document.getElementById('game-feed').innerHTML = '<div class="feed-header">PARA TI ✦</div>';
  document.getElementById('dm-list').innerHTML = '';
  document.getElementById('notif-list').innerHTML = '';
  document.getElementById('dm-count').textContent = '0';
  document.getElementById('combo-display').textContent = '';
  updateHUD();
  showScreen('screen-game');
  showMobileTabs();
  resumeAudio();

  // Arranque muy suave — 1 mensaje al inicio, el jugador lo lee con calma
  setTimeout(() => deliverNextMessage(), 1000);
  setTimeout(() => scheduleNextMessage(), 6000);

  gameState.timerInterval = setInterval(tickTimer, 1000);
}

// ============================================================
// TIMER
// ============================================================
function tickTimer() {
  gameState.timeLeft--;
  updateTimerDisplay();
  if (gameState.timeLeft === 100) showToast('⚡ Los ataques se intensifican...', 'neutral');
  if (gameState.timeLeft === 75)  showToast('🔥 ¡Nivel alto! Cuidado con los bots', 'neutral');
  if (gameState.timeLeft === 45)  showToast('💀 ¡Modo caos! ¡Aguanta!', 'neutral');
  if (gameState.timeLeft === 20)  showToast('⏱️ ¡Últimos 20 segundos!', 'neutral');
  if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) soundCountdown();
  if (gameState.timeLeft <= 0) endGame(gameState.health > 0);
}

function updateTimerDisplay() {
  const m = Math.floor(gameState.timeLeft / 60);
  const s = gameState.timeLeft % 60;
  const el = document.getElementById('game-timer');
  if (!el) return;
  el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  el.style.color = gameState.timeLeft <= 30 ? 'var(--danger)' : 'var(--warn)';
  el.style.animation = gameState.timeLeft <= 10 ? 'timerPulse 0.5s ease infinite' : '';
}

// ============================================================
// FLUJO DE MENSAJES
// ============================================================
function getMessageInterval() {
  // Curva gradual con tiempo real de lectura:
  // 0-20s:  15s (intro, leer con calma)
  // 20-45s: 11s (ritmo normal)
  // 45-75s: 7s  (empieza presión)
  // 75-100s: 4.5s (intenso)
  // 100-120s: 3s (caos final)
  const elapsed = GAME_DURATION - gameState.timeLeft;
  let base;
  if (elapsed < 20)       base = 15000;
  else if (elapsed < 45)  base = 11000;
  else if (elapsed < 75)  base = 7000;
  else if (elapsed < 100) base = 4500;
  else                    base = 3000;
  const jitter = Math.random() * 1000;
  return Math.max(2800, base - jitter);
}

function scheduleNextMessage() {
  if (!gameState.running) return;
  setTimeout(() => {
    if (gameState.running) {
      deliverNextMessage();
      scheduleNextMessage();
    }
  }, getMessageInterval());
}

function onMessageResolved() {
  if (!gameState.running) return;
  setTimeout(() => {
    if (gameState.running) deliverNextMessage();
  }, 800);
}

function deliverNextMessage() {
  if (!gameState.running) return;
  if (gameState.msgIndex >= gameState.messageQueue.length) {
    gameState.messageQueue = generateMessageQueue();
    gameState.msgIndex = 0;
  }
  const msg = gameState.messageQueue[gameState.msgIndex++];
  const uid = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);

  if (msg.type === 'dm') addDM(msg, uid);
  else if (msg.type === 'feed') addFeedPost(msg, uid);
  else if (msg.type === 'notif') addNotification(msg, uid);

  gameState.activeMessages[uid] = { msg, expireTimer: null, expired: false };
  updatePendingCount(1);
}

function updatePendingCount(delta) {
  gameState.pendingCount = Math.max(0, gameState.pendingCount + delta);
  const el = document.getElementById('dm-count');
  if (el) el.textContent = gameState.pendingCount;
}

// ============================================================
// DMs
// ============================================================
function addDM(msg, uid) {
  const time = new Date().toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'});
  const list = document.getElementById('dm-list');
  const el = document.createElement('div');
  el.className = 'dm-item unread';
  el.id = uid;
  el.style.cssText = 'display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s;animation:fadeIn .3s ease;';

  const avatarEl = getPreloadedAvatar(msg.botType, !msg.isBad, 38);
  avatarEl.style.borderRadius = '50%';

  const info = document.createElement('div');
  info.className = 'dm-info';
  info.style.cssText = 'flex:1;min-width:0;';
  info.innerHTML = `
    <div class="dm-name">${msg.name}</div>
    <div class="dm-preview">${msg.text.substring(0,45)}...</div>
  `;

  const meta = document.createElement('div');
  meta.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;';
  meta.innerHTML = `<span class="dm-time">${time}</span><div class="dm-unread-dot"></div>`;

  el.appendChild(avatarEl);
  el.appendChild(info);
  el.appendChild(meta);

  el.onclick = () => openPopup(msg, uid);
  el.dataset.isBad = msg.isBad;
  list.prepend(el);
  if (navigator.vibrate) navigator.vibrate(40);
  if (msg.isBad) soundUrgentMessage(); else soundNewMessage();
  updateMobileDMBadge();
}

// ============================================================
// FEED — Estilo Twitter
// ============================================================
function addFeedPost(msg, uid) {
  const timeStr = new Date().toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'});
  const likes = Math.floor(Math.random()*500)+1;
  const comments = Math.floor(Math.random()*80);
  const rts = Math.floor(Math.random()*120);

  const feed = document.getElementById('game-feed');
  const el = document.createElement('div');
  el.className = `feed-post ${msg.isBad ? 'feed-suspicious' : ''}`;
  el.id = uid;

  const avatarEl = getPreloadedAvatar(msg.botType, !msg.isBad, 40);
  avatarEl.style.cssText = 'width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0;margin-top:2px;background:var(--surface);';
  el.appendChild(avatarEl);

  const body = document.createElement('div');
  body.className = 'feed-post-body';

  const headerRow = document.createElement('div');
  headerRow.className = 'feed-post-header';
  headerRow.innerHTML = `
    <span class="feed-username">${msg.name}</span>
    <span class="feed-handle">@${msg.sender}</span>
    <span class="feed-dot">·</span>
    <span class="feed-time">${timeStr}</span>
  `;
  body.appendChild(headerRow);

  const textEl = document.createElement('div');
  textEl.className = 'feed-content';
  textEl.textContent = msg.text;
  body.appendChild(textEl);

  if (Math.random() > 0.70) {
    const postImg = getPreloadedPostImage(msg.botType, !msg.isBad);
    postImg.style.cssText = 'width:100%;max-height:200px;overflow:hidden;border-radius:12px;border:1px solid var(--border);margin:6px 0;';
    body.appendChild(postImg);
  }

  const actions = document.createElement('div');
  actions.className = 'feed-post-actions';
  actions.innerHTML = `
    <button class="feed-action-btn" onclick="handleFeedAction('${uid}',false,event)">💬 ${comments}</button>
    <button class="feed-action-btn" onclick="handleFeedAction('${uid}',false,event)">🔁 ${rts}</button>
    <button class="feed-action-btn" onclick="handleFeedAction('${uid}',false,event)">🤍 ${likes}</button>
    <button class="feed-action-btn report" onclick="handleFeedAction('${uid}',true,event)">🚨 Reportar</button>
  `;
  body.appendChild(actions);
  el.appendChild(body);

  el.dataset.isBad = msg.isBad;
  el.dataset.botType = msg.botType || '';
  el.dataset.clue = msg.clue || '';

  const feedHeader = feed.querySelector('.feed-header');
  feed.insertBefore(el, feedHeader.nextSibling);
  soundNewMessage();
}

function handleFeedAction(uid, isReport, e) {
  e.stopPropagation();
  const el = document.getElementById(uid);
  if (!el || el.dataset.resolved) return;
  resolveMessage(uid, isReport, el.dataset.isBad === 'true', el.dataset.botType, el.dataset.clue);
}

// ============================================================
// NOTIFICACIONES
// ============================================================
function addNotification(msg, uid) {
  const list = document.getElementById('notif-list');
  const el = document.createElement('div');
  el.className = 'notif-item';
  el.id = uid;
  el.innerHTML = `
    <div style="margin-bottom:6px">${msg.text.substring(0,90)}${msg.text.length>90?'...':''}</div>
    <div class="notif-actions">
      <button class="notif-btn ok" onclick="handleNotifAction('${uid}',false,event)">Ignorar</button>
      <button class="notif-btn report" onclick="handleNotifAction('${uid}',true,event)">🚨 Reportar</button>
    </div>
  `;
  el.dataset.isBad = msg.isBad;
  el.dataset.botType = msg.botType || '';
  el.dataset.clue = msg.clue || '';
  list.prepend(el);
  if (msg.isBad) soundUrgentMessage(); else soundNewMessage();
}

function handleNotifAction(uid, isReport, e) {
  e.stopPropagation();
  const el = document.getElementById(uid);
  if (!el || el.dataset.resolved) return;
  resolveMessage(uid, isReport, el.dataset.isBad === 'true', el.dataset.botType, el.dataset.clue);
}

// ============================================================
// POPUP DMs
// ============================================================
function openPopup(msg, uid) {
  const el = document.getElementById(uid);
  if (el && el.dataset.resolved) return;

  gameState.currentPopupMsg = { ...msg, uid };

  const avatarContainer = document.getElementById('popup-avatar');
  avatarContainer.innerHTML = '';
  avatarContainer.style.cssText = 'width:44px;height:44px;border-radius:3px;overflow:hidden;flex-shrink:0;';
  const avatarEl = getPreloadedAvatar(msg.botType, !msg.isBad, 44);
  avatarContainer.appendChild(avatarEl);

  document.getElementById('popup-name').textContent = msg.name;
  document.getElementById('popup-handle').textContent = '@' + msg.sender;

  let body = msg.text.replace(/(https?:\/\/[^\s]+|[a-z0-9-]+\.[a-z]{2,}\/[^\s]*)/gi,
    '<span style="color:var(--accent);text-decoration:underline">$1</span>');
  document.getElementById('popup-body').innerHTML = body;

  // Reset popup timer bar
  const popupBar = document.getElementById('popup-timer-bar');
  if (popupBar) {
    popupBar.style.animation = 'none';
    popupBar.style.width = '100%';
  }

  document.getElementById('msg-popup').classList.remove('hidden');

  if (el) el.classList.remove('unread');
}

function closePopup() {
  document.getElementById('msg-popup').classList.add('hidden');
  gameState.currentPopupMsg = null;
}

function respondMessage(isLegit) {
  const msg = gameState.currentPopupMsg;
  if (!msg) return;
  closePopup();
  resolveMessage(msg.uid, !isLegit, msg.isBad, msg.botType, msg.clue);
}

// ============================================================
// RESOLVER MENSAJE — Lógica central
// ============================================================
function resolveMessage(uid, userReports, isBad, botType, clue) {
  const el = document.getElementById(uid);
  if (!el || el.dataset.resolved) return;
  el.dataset.resolved = 'true';

  const active = gameState.activeMessages[uid];
  const damage = active?.msg?.damage || 15;

  if (active) {
    clearTimeout(active.expireTimer);
    delete gameState.activeMessages[uid];
  }
  updatePendingCount(-1);

  if (userReports && isBad) {
    const comboBonus = Math.min(gameState.combo * 5, 30);
    const pts = 20 + comboBonus;
    gameState.combo++;
    gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
    awardPoints(pts, botType, true);
    showCombo(gameState.combo);
    soundSuccess();
    if (comboBonus > 0) soundCombo(gameState.combo);
    showToast(`🚨 ¡Bot detectado! +${pts} pts${comboBonus > 0 ? ` (combo x${gameState.combo})` : ''}`, 'good');
    if (clue) setTimeout(() => showToast('💡 ' + clue, 'neutral'), 1800);
    el.style.opacity = '0.35';
    el.style.borderLeft = '3px solid var(--green)';
    spawnParticles(el, '#00ff8c');

  } else if (!userReports && !isBad) {
    gameState.combo++;
    gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
    awardPoints(5, null, false);
    gameState.stats.legit_correctly_allowed++;
    if (gameState.combo >= 3) showToast(`👍 Correcto! Combo x${gameState.combo}`, 'good');

  } else if (userReports && !isBad) {
    gameState.combo = 0;
    penalize(10);
    gameState.stats.legit_wrongly_reported++;
    showToast('❌ Era un mensaje real. Falso positivo -10 pts', 'bad');
    el.style.opacity = '0.35';

  } else if (!userReports && isBad) {
    gameState.combo = 0;
    penalize(damage);
    if (botType && gameState.stats[botType]) gameState.stats[botType].wrong++;
    showToast('⚠️ ¡Era un ataque! Dejaste pasar un ' + (BOTS[botType]?.label || 'bot'), 'bad');
    if (clue) setTimeout(() => showToast('💡 ' + clue, 'neutral'), 1800);
  }

  onMessageResolved();
}

// ============================================================
// PUNTOS Y DAÑO
// ============================================================
function awardPoints(pts, botType, isDetection) {
  gameState.score += pts;
  if (botType && isDetection && gameState.stats[botType]) gameState.stats[botType].correct++;
  updateHUD();
  floatScore('+' + pts);
}

function penalize(dmg) {
  gameState.health = Math.max(0, gameState.health - dmg);
  gameState.combo = 0;
  updateHUD();
  glitchEffect();
  soundDamage();
  floatScore('-' + dmg, true);
  if (gameState.health <= 30 && gameState.health > 0) startHealthAlarm();
  if (gameState.health <= 0) endGame(false);
}

function updateHUD() {
  const bar = document.getElementById('health-bar');
  const val = document.getElementById('health-val');
  const score = document.getElementById('game-score');
  if (bar) {
    bar.style.width = gameState.health + '%';
    bar.style.background = gameState.health > 60 ? 'var(--green)' : gameState.health > 30 ? 'var(--warn)' : 'var(--danger)';
    bar.style.animation = gameState.health <= 30 ? 'healthPulse 0.8s ease infinite' : '';
  }
  if (val) val.textContent = gameState.health;
  if (score) score.textContent = gameState.score;
}

// ============================================================
// EFECTOS VISUALES
// ============================================================
function showCombo(n) {
  if (n < 2) return;
  const el = document.getElementById('combo-display');
  if (!el) return;
  const labels = {2:'DOBLE',3:'TRIPLE',4:'CUÁDRUPLE',5:'¡IMPARABLE!'};
  el.textContent = (labels[n] || '🔥 x' + n) + ' COMBO!';
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'comboPop 1.2s ease forwards';
}

function glitchEffect() {
  const game = document.getElementById('screen-game');
  if (!game) return;
  game.classList.add('glitch');
  setTimeout(() => game.classList.remove('glitch'), 500);
}

function floatScore(text, isNeg = false) {
  const el = document.createElement('div');
  el.className = 'float-score ' + (isNeg ? 'neg' : 'pos');
  el.textContent = text;
  el.style.cssText = `position:fixed;top:60px;right:${80 + Math.random()*60}px;z-index:999;pointer-events:none;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function spawnParticles(el, color) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed;
      left:${rect.left + rect.width/2}px;
      top:${rect.top + rect.height/2}px;
      width:6px;height:6px;border-radius:50%;
      background:${color};pointer-events:none;z-index:999;
      animation:particleFly 0.6s ease forwards;
      --dx:${(Math.random()-0.5)*80}px;
      --dy:${(Math.random()-0.5)*80}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

// ============================================================
// TOAST
// ============================================================
let toastQ = [];
let toastActive = false;

function showToast(msg, type = 'neutral') {
  toastQ.push({ msg, type });
  if (!toastActive) nextToast();
}

function nextToast() {
  if (!toastQ.length) { toastActive = false; return; }
  toastActive = true;
  const { msg, type } = toastQ.shift();
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => {
    toast.className = 'toast hidden';
    setTimeout(nextToast, 200);
  }, 2200);
}

// ============================================================
// FIN DEL JUEGO
// ============================================================
function endGame(survived) {
  gameState.running = false;
  clearInterval(gameState.timerInterval);
  stopHealthAlarm();
  Object.values(gameState.activeMessages).forEach(a => {
    if (a.expireTimer) clearTimeout(a.expireTimer);
  });
  closePopup();
  if (survived) soundVictory(); else soundDefeat();
  saveLocalResult();
  showScreen('screen-results');
}

function renderResults() {
  const survived = gameState.health > 0;
  document.getElementById('results-badge').textContent = survived ? '🏆 ¡Sobreviviste!' : '💀 Los bots te vencieron...';
  document.getElementById('results-title').textContent = survived
    ? '¡Excelente, ' + (gameState.playerName || 'jugador') + '!'
    : 'Pero aprendiste algo valioso';

  document.getElementById('results-score').textContent = gameState.score;

  let totalCorrect = 0, totalWrong = 0;
  Object.values(BOTS).forEach(b => {
    totalCorrect += gameState.stats[b.id]?.correct || 0;
    totalWrong   += gameState.stats[b.id]?.wrong   || 0;
  });

  document.getElementById('res-correct').textContent = totalCorrect;
  document.getElementById('res-wrong').textContent = totalWrong;
  document.getElementById('res-fp').textContent = gameState.stats.legit_wrongly_reported;
  document.getElementById('res-health').textContent = gameState.health + '%';
  document.getElementById('res-combo').textContent = gameState.maxCombo + 'x';

  const bd = document.getElementById('results-breakdown');
  bd.innerHTML = '<div style="font-size:.85rem;font-weight:600;color:var(--text2);margin-bottom:.75rem;font-family:var(--font-mono)">RENDIMIENTO POR TIPO DE ATAQUE</div>';
  Object.values(BOTS).forEach(bot => {
    const s = gameState.stats[bot.id] || { correct:0, wrong:0 };
    if (s.correct + s.wrong === 0) return;
    const pct = Math.round((s.correct / (s.correct + s.wrong)) * 100) || 0;
    const color = pct >= 60 ? 'var(--green)' : 'var(--danger)';
    bd.innerHTML += `
      <div class="breakdown-item">
        <span class="breakdown-bot">${bot.emoji} ${bot.label}</span>
        <div class="breakdown-bar-wrap"><div class="breakdown-bar" style="width:${pct}%;background:${color}"></div></div>
        <span class="breakdown-pct" style="color:${color}">${pct}%</span>
      </div>
    `;
  });
}

function restartGame() {
  quizAnswers.pre = {};
  quizAnswers.post = {};
  showScreen('screen-quiz-pre');
}

// ============================================================
// GUARDAR RESULTADOS
// ============================================================
function saveLocalResult() {
  try {
    const results = JSON.parse(localStorage.getItem('ss_results') || '[]');
    results.push({
      name: gameState.playerName || 'Anónimo',
      score: gameState.score,
      health: gameState.health,
      survived: gameState.health > 0,
      maxCombo: gameState.maxCombo,
      timestamp: Date.now()
    });
    localStorage.setItem('ss_results', JSON.stringify(results));
  } catch(e) {}
  if (!gameState.useDemoMode && db) savePlayerResult();
}

function savePlayerResult() {
  if (!db) return;
  db.ref('results').push({
    name: gameState.playerName || 'Anónimo',
    score: gameState.score,
    health: gameState.health,
    survived: gameState.health > 0,
    maxCombo: gameState.maxCombo,
    finished: true,
    timestamp: Date.now(),
    stats: gameState.stats,
    quizPre: quizAnswers.pre,
    quizPost: quizAnswers.post
  }).then(() => {
    if (gameState.myPlayerRef) {
      gameState.myPlayerRef.update({ score: gameState.score, survived: gameState.health > 0 });
    }
  }).catch(e => console.warn('Error guardando:', e));
}

// ============================================================
// LOBBY
// ============================================================
function initLobby() {
  // checkURLParams ya pudo haber seteado lobbyCode, respetarlo
  const urlCode = new URLSearchParams(window.location.search).get('sala') || lobbyCode;

  if (urlCode) {
    lobbyCode = urlCode.toUpperCase();
    const codeInput = document.getElementById('lobby-code-input');
    if (codeInput) { codeInput.value = lobbyCode; codeInput.readOnly = true; codeInput.style.opacity = '0.6'; }
    document.getElementById('lobby-code-display').textContent = lobbyCode;
    document.getElementById('lobby-status').innerHTML =
      '<div class="pulse-dot"></div><span>Sala <strong style="color:var(--green)">' + lobbyCode + '</strong> — escribí tu nombre para unirte</span>';
    const qrSide = document.querySelector('.lobby-qr-side');
    if (qrSide) qrSide.style.display = 'none';
    if (!gameState.useDemoMode && db) listenToLobbyPlayers();
  } else {
    lobbyCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('lobby-code-display').textContent = lobbyCode;
    document.getElementById('lobby-status').innerHTML =
      '<div class="pulse-dot"></div><span>Sala creada. Compartí el código o QR.</span>';
    generateQR();
    if (!gameState.useDemoMode && db) listenToLobbyPlayers();
  }
}

function joinLobby() {
  const name = document.getElementById('lobby-name-input').value.trim();
  const codeInput = document.getElementById('lobby-code-input');
  const typedCode = codeInput ? codeInput.value.trim().toUpperCase() : '';

  if (!name) { showToast('Escribí tu nombre', 'bad'); return; }

  // Si escribió un código manualmente, usarlo
  if (typedCode && typedCode.length >= 4) {
    lobbyCode = typedCode;
    document.getElementById('lobby-code-display').textContent = lobbyCode;
  }
  if (!lobbyCode) { showToast('Escribí el código de sala', 'bad'); return; }

  gameState.playerName = name;
  document.getElementById('lobby-name-form').style.display = 'none';
  showToast('Unido a sala ' + lobbyCode, 'good');

  if (!gameState.useDemoMode && db) {
    const playerRef = db.ref('lobbies/' + lobbyCode + '/players').push();
    playerRef.set({ name, joinedAt: Date.now() });
    playerRef.onDisconnect().remove();
    gameState.myPlayerRef = playerRef;

    // Siempre escuchar jugadores y señal de inicio
    listenToLobbyPlayers();
    listenToLobbyStart();

    document.getElementById('lobby-status').innerHTML =
      '<div class="pulse-dot"></div><span>En sala <strong style="color:var(--green)">' + lobbyCode + '</strong> — esperando al investigador...</span>';
  } else {
    addPlayerToList({ name });
    document.getElementById('lobby-count').textContent =
      document.getElementById('lobby-player-list').children.length;
    document.getElementById('lobby-status').innerHTML =
      '<div class="pulse-dot"></div><span>Unido — esperando inicio...</span>';
  }
}

function listenToLobbyPlayers() {
  if (!db || !lobbyCode) return;
  db.ref('lobbies/' + lobbyCode + '/players').on('value', snap => {
    const players = snap.val() || {};
    const list = document.getElementById('lobby-player-list');
    list.innerHTML = '';
    Object.values(players).forEach(p => addPlayerToList(p));
    document.getElementById('lobby-count').textContent = Object.keys(players).length;
  });
}

function listenToLobbyStart() {
  if (!db || !lobbyCode) return;
  db.ref('lobbies/' + lobbyCode + '/status').on('value', snap => {
    if (snap.val() === 'started' && gameState.playerName) {
      document.getElementById('lobby-status').innerHTML =
        '<div class="pulse-dot" style="background:var(--warn)"></div><span>¡Iniciando misión!</span>';
      setTimeout(() => startGame(), 2000);
    }
  });
}

function addPlayerToList(player) {
  const list = document.getElementById('lobby-player-list');
  const color = getAvatarColor(player.name);
  const el = document.createElement('div');
  el.className = 'player-item';
  el.innerHTML = `<div class="player-avatar" style="background:${color}22;color:${color}">${player.name.charAt(0).toUpperCase()}</div><span>${player.name}</span>`;
  list.appendChild(el);
}

function copyLobbyCode() {
  const url = window.location.href.split('?')[0] + '?sala=' + lobbyCode;
  navigator.clipboard?.writeText(url)
    .then(() => showToast('📋 Link copiado!', 'good'))
    .catch(() => showToast('Código: ' + lobbyCode, 'neutral'));
}

function generateQR() {
  const container = document.getElementById('lobby-qr-container');
  if (!container) return;
  container.innerHTML = '';
  const url = window.location.href.split('?')[0] + '?sala=' + lobbyCode;
  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(container, { text: url, width: 110, height: 110,
        colorDark: '#00ff8c', colorLight: '#0d1117', correctLevel: QRCode.CorrectLevel.M });
    } else {
      container.innerHTML = `<a href="${url}" style="font-family:var(--font-mono);font-size:.65rem;color:var(--green);word-break:break-all">${url}</a>`;
    }
  } catch(e) {
    container.innerHTML = '<div class="qr-placeholder">QR no disponible</div>';
  }
}

// ============================================================
// PANEL ADMIN
// ============================================================
function adminLogin() {
  if (document.getElementById('admin-pass').value !== ADMIN_PASSWORD) {
    showToast('Contraseña incorrecta', 'bad');
    return;
  }
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
}

function adminCreateRoom() {
  lobbyCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  adminActivateRoom();
}

function adminJoinRoom() {
  const input = document.getElementById('admin-room-input');
  const code = input ? input.value.trim().toUpperCase() : '';
  if (!code || code.length < 4) { showToast('Escribí el código de sala', 'bad'); return; }
  lobbyCode = code;
  adminActivateRoom();
}

function adminActivateRoom() {
  document.getElementById('admin-live-panel').style.display = 'block';
  const shareUrl = window.location.href.split('?')[0] + '?sala=' + lobbyCode;
  const infoEl = document.getElementById('admin-sala-info');
  if (infoEl) {
    infoEl.innerHTML = `
      SALA ACTIVA: <span style="color:var(--green);font-size:1.1rem;font-weight:700;letter-spacing:4px">${lobbyCode}</span>
      <br><span style="color:var(--text3);font-size:.65rem;word-break:break-all">${shareUrl}</span>
      <br><button onclick="navigator.clipboard?.writeText('${shareUrl}').then(()=>showToast('Link copiado','good'))"
        style="margin-top:6px;background:none;border:1px solid var(--border2);color:var(--text2);
        padding:4px 10px;border-radius:3px;cursor:pointer;font-family:var(--font-mono);font-size:.65rem">
        COPIAR LINK
      </button>
    `;
  }
  loadAdminStats();
}

function loadAdminStats() {
  if (!gameState.useDemoMode && db) {
    // Escuchar resultados en tiempo real
    db.ref('results').on('value', snap => {
      const data = snap.val() || {};
      const results = Object.values(data);
      const finished = results.filter(r => r.finished);
      const survived = finished.filter(r => r.survived).length;
      const avg = finished.length ? Math.round(finished.reduce((s,r)=>s+(r.score||0),0)/finished.length) : 0;

      document.getElementById('admin-connected').textContent = results.length;
      document.getElementById('admin-finished').textContent = finished.length;
      document.getElementById('admin-avg-score').textContent = avg || '—';

      // Stats extra
      const survRate = finished.length ? Math.round((survived/finished.length)*100) : 0;
      const saEl = document.getElementById('admin-survival-rate');
      const topEl = document.getElementById('admin-top-player');
      const aliveEl = document.getElementById('admin-still-playing');
      if (saEl) saEl.textContent = survRate + '%';
      if (aliveEl) aliveEl.textContent = (results.length - finished.length);
      if (topEl && finished.length) {
        const top = finished.reduce((a,b)=>(a.score||0)>(b.score||0)?a:b);
        topEl.textContent = (top.name||'—') + ' (' + (top.score||0) + 'pts)';
      }

      // Tabla de jugadores en tiempo real
      renderAdminPlayerTable(results, finished);
    });

    // Jugadores en lobby
    if (lobbyCode) {
      db.ref('lobbies/' + lobbyCode + '/players').on('value', snap => {
        const lobbyEl = document.getElementById('admin-in-lobby');
        if (lobbyEl) lobbyEl.textContent = snap.numChildren();
      });
    }
  } else {
    // Demo
    renderAdminPlayerTable([
      { name:'Sofía V.', score:185, survived:true, health:80, finished:true },
      { name:'Diego P.', score:140, survived:true, health:50, finished:true },
      { name:'Carlos M.', score:95, survived:false, health:0, finished:true },
      { name:'Laura R.', score:0, survived:false, health:60, finished:false },
    ], []);
  }
}

function renderAdminPlayerTable(results, finished) {
  const list = document.getElementById('admin-player-list');
  if (!list) return;
  if (!results.length) {
    list.innerHTML = '<div style="color:var(--text3);font-size:.75rem;font-family:var(--font-mono);padding:.5rem 0">Esperando jugadores...</div>';
    return;
  }

  const sorted = [...results].sort((a,b) => {
    if (a.finished && !b.finished) return -1;
    if (!a.finished && b.finished) return 1;
    return (b.score||0) - (a.score||0);
  });

  list.innerHTML = sorted.map((r, i) => {
    const isPlaying = !r.finished;
    const healthColor = (r.health||0) > 60 ? '#00ff8c' : (r.health||0) > 30 ? '#ffb800' : '#ff3355';
    const healthBar = r.finished
      ? `<div style="width:50px;height:4px;background:var(--bg3);border-radius:2px;overflow:hidden">
           <div style="width:${r.health||0}%;height:100%;background:${healthColor}"></div>
         </div>`
      : `<span style="color:var(--warn);font-size:.65rem;animation:pulse 1s infinite">EN JUEGO</span>`;

    const botCount = r.stats ? Object.values(r.stats)
      .filter(s => typeof s === 'object')
      .reduce((sum, s) => sum + (s.correct||0), 0) : '—';

    return `
      <div style="display:grid;grid-template-columns:20px 1fr 55px 45px 60px;
        gap:6px;align-items:center;padding:7px 0;
        border-bottom:1px solid var(--border);font-family:var(--font-mono);font-size:.75rem;
        ${isPlaying?'background:rgba(0,255,140,.03)':''}">
        <span style="color:var(--text3)">${i+1}</span>
        <span style="color:${isPlaying?'var(--green)':'var(--text)'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${isPlaying?'● ':''} ${r.name||'Anónimo'}
        </span>
        <span style="color:var(--green);text-align:right">${r.score||0}</span>
        <span style="color:var(--accent);text-align:center">${botCount}</span>
        <div>${healthBar}</div>
      </div>`;
  }).join('');
}

function adminStartGame() {
  if (!gameState.useDemoMode && db && lobbyCode) {
    db.ref('lobbies/' + lobbyCode + '/status').set('started');
    showToast('🚀 Señal enviada — todos inician!', 'good');
  } else {
    showToast('Modo demo: jugadores inician individualmente', 'neutral');
  }
}

function exportResults() {
  if (!gameState.useDemoMode && db) {
    db.ref('results').once('value', snap => {
      const data = snap.val() || {};
      const results = Object.values(data);
      if (!results.length) { showToast('No hay resultados en Firebase aún', 'neutral'); return; }
      const headers = ['nombre','puntaje','sobrevivio','salud','combo_max','timestamp'];
      const rows = results.map(r => [
        r.name||'Anónimo', r.score||0, r.survived?'SI':'NO',
        r.health||0, r.maxCombo||0,
        r.timestamp ? new Date(r.timestamp).toLocaleString('es-CR') : ''
      ].join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const a = document.createElement('a');
      a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      a.download = 'ctpsecurity_resultados.csv';
      a.click();
      showToast('✅ CSV exportado con ' + results.length + ' resultados', 'good');
    });
  } else {
    try {
      const results = JSON.parse(localStorage.getItem('ss_results') || '[]');
      if (!results.length) { showToast('No hay resultados guardados', 'neutral'); return; }
      const csv = ['nombre,puntaje,sobrevivio,timestamp',
        ...results.map(r=>`${r.name},${r.score},${r.survived?'SI':'NO'},${new Date(r.timestamp).toLocaleString('es-CR')}`)
      ].join('\n');
      const a = document.createElement('a');
      a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      a.download = 'ctpsecurity_resultados.csv';
      a.click();
    } catch(e) { showToast('Error al exportar', 'bad'); }
  }
}

function clearSessionData() {
  if (!confirm('¿Seguro que querés limpiar todos los resultados? Esto no se puede deshacer.')) return;
  if (!gameState.useDemoMode && db) {
    db.ref('results').remove().then(() => {
      if (lobbyCode) db.ref('lobbies/' + lobbyCode).remove();
      showToast('✅ Partida limpiada. Lista para nueva sesión.', 'good');
      lobbyCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      adminActivateRoom();
    }).catch(e => showToast('Error: ' + e.message, 'bad'));
  } else {
    localStorage.removeItem('ss_results');
    showToast('✅ Datos locales limpiados.', 'good');
  }
}

// ============================================================
// LEADERBOARD & ANÁLISIS
// ============================================================
function showLeaderboard() {
  showScreen('screen-leaderboard');
  if (!gameState.useDemoMode && db) {
    db.ref('results').once('value', snap => {
      const results = Object.values(snap.val() || {}).filter(r => r.finished);
      results.length ? renderLeaderboard(results) : loadLeaderboardDemo();
    });
  } else {
    loadLeaderboardDemo();
  }
}

function loadLeaderboardDemo() {
  renderLeaderboard([
    { name: 'Sofía V.', score: 285, survived: true, health: 80, maxCombo: 5, stats: { phish:{correct:3,wrong:1}, social:{correct:2,wrong:0}, spam:{correct:2,wrong:1}, clone:{correct:1,wrong:1}, perm:{correct:2,wrong:0} }, quizPre:{p1:{selected:1,correct:1},p2:{selected:1,correct:1},p3:{selected:1,correct:1}}, quizPost:{post1:{selected:1,correct:1},post4:{selected:1,correct:1}} },
    { name: 'Diego P.', score: 210, survived: true, health: 55, maxCombo: 3, stats: { phish:{correct:2,wrong:2}, social:{correct:3,wrong:0}, spam:{correct:1,wrong:1}, clone:{correct:2,wrong:0}, perm:{correct:1,wrong:1} }, quizPre:{p1:{selected:0,correct:1},p2:{selected:1,correct:1},p3:{selected:1,correct:1}}, quizPost:{post1:{selected:1,correct:1},post4:{selected:1,correct:1}} },
    { name: 'Carlos M.', score: 140, survived: true, health: 30, maxCombo: 2, stats: { phish:{correct:1,wrong:2}, social:{correct:1,wrong:2}, spam:{correct:2,wrong:0}, clone:{correct:1,wrong:1}, perm:{correct:0,wrong:2} }, quizPre:{p1:{selected:0,correct:1},p2:{selected:0,correct:1},p3:{selected:1,correct:1}}, quizPost:{post1:{selected:1,correct:1},post4:{selected:0,correct:1}} },
    { name: 'Laura R.', score: 95, survived: false, health: 0, maxCombo: 1, stats: { phish:{correct:0,wrong:3}, social:{correct:1,wrong:2}, spam:{correct:1,wrong:1}, clone:{correct:0,wrong:2}, perm:{correct:1,wrong:1} }, quizPre:{p1:{selected:0,correct:1},p2:{selected:0,correct:1},p3:{selected:0,correct:1}}, quizPost:{post1:{selected:1,correct:1},post4:{selected:1,correct:1}} },
    { name: 'Mariela T.', score: 75, survived: false, health: 0, maxCombo: 1, stats: { phish:{correct:1,wrong:3}, social:{correct:0,wrong:3}, spam:{correct:1,wrong:1}, clone:{correct:0,wrong:2}, perm:{correct:0,wrong:2} }, quizPre:{p1:{selected:0,correct:1},p2:{selected:0,correct:1},p3:{selected:0,correct:1}}, quizPost:{post1:{selected:0,correct:1},post4:{selected:1,correct:1}} },
  ]);
}

function renderLeaderboard(results) {
  const sorted = [...results].sort((a,b)=>(b.score||0)-(a.score||0));
  const total = sorted.length;
  const survived = sorted.filter(r=>r.survived).length;
  const now = new Date().toLocaleString('es-CR',{dateStyle:'medium',timeStyle:'short'});
  document.getElementById('lb-session-info').textContent = `${total} participantes · ${survived} sobrevivieron · ${now}`;
  renderPodium(sorted.slice(0,3));
  renderTable(sorted);
  renderAnalysis(sorted);
  renderQuizComparison(sorted);
}

function renderPodium(top) {
  const podium = document.getElementById('lb-podium');
  if (!podium || !top.length) return;
  const order = [1,0,2];
  const rankClass = ['rank-2','rank-1','rank-3'];
  const medals = ['🥇','🥈','🥉'];
  const heights = [75,100,55];
  const colors = ['#c8c8dc','#ffb800','#cd7f32'];
  podium.innerHTML = order.map((idx,i) => {
    const p = top[idx];
    if (!p) return '';
    const color = getAvatarColor(p.name);
    return `
      <div class="podium-place ${rankClass[i]}">
        <div class="podium-avatar" style="background:${color}22;color:${color};font-size:1.1rem;font-weight:800">${p.name.charAt(0).toUpperCase()}</div>
        <div class="podium-name">${p.name}</div>
        <div class="podium-score">${p.score} pts</div>
        <div class="podium-block" style="height:${heights[i]}px;color:${colors[i]}">${medals[i===0?1:i===1?0:2]}</div>
      </div>`;
  }).join('');
}

function renderTable(sorted) {
  const body = document.getElementById('lb-table-body');
  if (!body) return;
  body.innerHTML = sorted.map((r,i) => {
    const rank = i+1;
    const rankClass = rank <= 3 ? `r${rank}` : '';
    const bots = Object.values(BOTS).reduce((s,b)=>s+(r.stats?.[b.id]?.correct||0),0);
    const healthColor = r.health > 60 ? 'var(--green)' : r.health > 30 ? 'var(--warn)' : 'var(--danger)';
    return `
      <div class="lb-row ${r.survived?'lb-winner':'lb-dead'}" style="animation-delay:${i*0.05}s">
        <span class="lb-rank ${rankClass}">${rank<=3?['🥇','🥈','🥉'][rank-1]:rank}</span>
        <span class="lb-player-name">${r.name||'Anónimo'}</span>
        <span class="lb-score">${r.score||0}</span>
        <span class="lb-bots">${bots}</span>
        <span class="lb-health" style="color:${healthColor}">${r.health||0}%</span>
        <span class="lb-status ${r.survived?'survived':'died'}">${r.survived?'VIVO':'CAÍDO'}</span>
      </div>`;
  }).join('');
}

function renderAnalysis(sorted) {
  const container = document.getElementById('analysis-content');
  if (!container) return;
  const total = sorted.length;
  const survived = sorted.filter(r=>r.survived).length;
  const avgScore = Math.round(sorted.reduce((s,r)=>s+(r.score||0),0)/total);
  const avgHealth = Math.round(sorted.reduce((s,r)=>s+(r.health||0),0)/total);
  const survivalRate = Math.round((survived/total)*100);

  const botStats = {};
  Object.keys(BOTS).forEach(key => { botStats[key] = {correct:0,wrong:0}; });
  sorted.forEach(r => {
    if (!r.stats) return;
    Object.keys(BOTS).forEach(key => {
      botStats[key].correct += r.stats[key]?.correct||0;
      botStats[key].wrong   += r.stats[key]?.wrong||0;
    });
  });

  let hardestBot = null, lowestAcc = 101;
  Object.entries(botStats).forEach(([key,s]) => {
    const t = s.correct+s.wrong;
    if (t === 0) return;
    const acc = Math.round((s.correct/t)*100);
    if (acc < lowestAcc) { lowestAcc = acc; hardestBot = key; }
  });

  container.innerHTML = `
    <div class="analysis-stat"><span class="analysis-label">Total participantes</span><span class="analysis-value">${total}</span></div>
    <div class="analysis-stat"><span class="analysis-label">Tasa de supervivencia</span><span class="analysis-value" style="color:${survivalRate>=50?'var(--green)':'var(--danger)'}">${survivalRate}%</span></div>
    <div class="analysis-stat"><span class="analysis-label">Puntaje promedio</span><span class="analysis-value">${avgScore} pts</span></div>
    <div class="analysis-stat"><span class="analysis-label">Salud promedio final</span><span class="analysis-value">${avgHealth}%</span></div>
    <div class="analysis-stat"><span class="analysis-label">Bot más difícil</span><span class="analysis-value" style="color:var(--danger)">${hardestBot?BOTS[hardestBot].emoji+' '+BOTS[hardestBot].label:'—'} (${lowestAcc}%)</span></div>
    <div style="margin-top:1rem;margin-bottom:.5rem;font-family:var(--font-mono);font-size:.65rem;color:var(--green);letter-spacing:2px">PRECISIÓN POR TIPO DE ATAQUE</div>
    ${Object.entries(botStats).map(([key,s]) => {
      const t = s.correct+s.wrong;
      const pct = t > 0 ? Math.round((s.correct/t)*100) : 0;
      const color = pct>=70?'var(--green)':pct>=40?'var(--warn)':'var(--danger)';
      return `<div class="bot-accuracy-row"><span class="bot-name">${BOTS[key].emoji} ${BOTS[key].label}</span><div class="bot-bar-wrap"><div class="bot-bar" style="width:${pct}%;background:${color}"></div></div><span class="bot-pct" style="color:${color}">${pct}%</span></div>`;
    }).join('')}
    <div class="analysis-summary">
      ▸ De los ${total} participantes, ${survived} (${survivalRate}%) lograron sobrevivir los 2 minutos.<br>
      ▸ El puntaje promedio fue ${avgScore} pts, con rango entre ${Math.min(...sorted.map(r=>r.score||0))} y ${Math.max(...sorted.map(r=>r.score||0))} pts.<br>
      ▸ El ataque más difícil fue ${hardestBot?BOTS[hardestBot].label:'phishing'}, lo que indica que requiere mayor educación específica.<br>
      ▸ ${survivalRate<50?'Menos del 50% sobrevivió, indicando bajo conocimiento previo sobre ciberseguridad.':'La mayoría sobrevivió, indicando un nivel básico de conciencia sobre amenazas digitales.'}
    </div>
  `;
}

function renderQuizComparison(sorted) {
  const container = document.getElementById('quiz-comparison-content');
  if (!container) return;
  const withQuiz = sorted.filter(r=>r.quizPre&&r.quizPost);
  if (!withQuiz.length) {
    container.innerHTML = '<div style="font-family:var(--font-mono);font-size:.8rem;color:var(--text3);padding:.5rem">No hay datos de quiz disponibles aún.</div>';
    return;
  }
  const rows = withQuiz.map(r => {
    let preC=0,preT=0,postC=0,postT=0;
    Object.values(r.quizPre||{}).forEach(q=>{if(q.correct>=0){preT++;if(q.selected===q.correct)preC++;}});
    Object.values(r.quizPost||{}).forEach(q=>{if(q.correct>=0){postT++;if(q.selected===q.correct)postC++;}});
    const prePct  = preT  > 0 ? Math.round((preC/preT)*100)   : 0;
    const postPct = postT > 0 ? Math.round((postC/postT)*100) : 0;
    return { name:r.name, prePct, postPct, delta:postPct-prePct };
  });
  const avgPre  = Math.round(rows.reduce((s,r)=>s+r.prePct,0)/rows.length);
  const avgPost = Math.round(rows.reduce((s,r)=>s+r.postPct,0)/rows.length);
  const avgDelta = avgPost-avgPre;
  const improved = rows.filter(r=>r.delta>0).length;
  container.innerHTML = `
    <div style="font-family:var(--font-mono);font-size:.75rem;color:var(--text2);margin-bottom:1rem">
      El ${Math.round((improved/rows.length)*100)}% mejoró su puntaje después de jugar.
      Mejora promedio: <span style="color:${avgDelta>=0?'var(--green)':'var(--danger)'};font-weight:700">${avgDelta>=0?'+':''}${avgDelta}%</span>
    </div>
    <div class="quiz-comp-row quiz-comp-header"><span>Jugador</span><span>PRE</span><span>POST</span><span>Δ</span></div>
    ${rows.map(r=>`
      <div class="quiz-comp-row">
        <span class="quiz-comp-name">${r.name}</span>
        <span class="quiz-comp-pre">${r.prePct}%</span>
        <span class="quiz-comp-post">${r.postPct}%</span>
        <span class="quiz-comp-delta ${r.delta>0?'delta-pos':r.delta<0?'delta-neg':'delta-neu'}">${r.delta>0?'+':''}${r.delta}%</span>
      </div>`).join('')}
    <div class="analysis-stat" style="margin-top:.75rem"><span class="analysis-label">Promedio PRE</span><span class="analysis-value" style="color:var(--text2)">${avgPre}%</span></div>
    <div class="analysis-stat"><span class="analysis-label">Promedio POST</span><span class="analysis-value">${avgPost}%</span></div>
    <div class="analysis-stat"><span class="analysis-label">Mejora promedio</span><span class="analysis-value" style="color:${avgDelta>=0?'var(--green)':'var(--danger)'}">${avgDelta>=0?'+':''}${avgDelta}%</span></div>
  `;
}

// ============================================================
// LANDING STATS & INIT
// ============================================================
function updateLandingStats() {
  try {
    const r = JSON.parse(localStorage.getItem('ss_results') || '[]');
    if (r.length > 0) {
      document.getElementById('stat-players').textContent = r.length;
      document.getElementById('stat-games').textContent = r.length;
    }
  } catch(e) {}
  if (!gameState.useDemoMode && db) {
    db.ref('results').on('value', snap => {
      const count = snap.numChildren();
      if (count > 0) {
        document.getElementById('stat-players').textContent = count;
        document.getElementById('stat-games').textContent = count;
      }
    });
  }
}

function checkURLParams() {
  const sala = new URLSearchParams(window.location.search).get('sala');
  if (sala) {
    lobbyCode = sala.toUpperCase();
    showScreen('screen-lobby');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  updateLandingStats();
  checkURLParams();
  loadLandingBg();
  document.addEventListener('click', resumeAudio, { once: true });
});

// ============================================================
// MOBILE TABS
// ============================================================

let activeTab = 'feed';

function switchTab(tab) {
  activeTab = tab;
  // Desactivar todas
  ['feed','dms','notifs'].forEach(t => {
    const panel = document.getElementById(t === 'feed' ? 'game-feed' : t === 'dms' ? 'game-dms-panel' : 'game-notifs-panel');
    const tabBtn = document.getElementById('tab-' + (t === 'dms' ? 'dms' : t));
    if (panel) panel.classList.remove('tab-active');
    if (tabBtn) tabBtn.classList.remove('active');
  });
  // Activar la seleccionada
  const activePanel = document.getElementById(tab === 'feed' ? 'game-feed' : tab === 'dms' ? 'game-dms-panel' : 'game-notifs-panel');
  const activeBtn = document.getElementById('tab-' + tab);
  if (activePanel) activePanel.classList.add('tab-active');
  if (activeBtn) activeBtn.classList.add('active');

  // Limpiar badge de DMs al ver esa tab
  if (tab === 'dms') {
    const badge = document.getElementById('tab-dm-badge');
    if (badge) { badge.style.display = 'none'; badge.textContent = '0'; }
  }
}

// Actualizar badge de DMs cuando llega un mensaje
function updateMobileDMBadge() {
  if (activeTab !== 'dms') {
    const badge = document.getElementById('tab-dm-badge');
    if (!badge) return;
    const current = parseInt(badge.textContent) || 0;
    badge.textContent = current + 1;
    badge.style.display = 'block';
  }
}

// Esconder tabs fuera del juego
function hideMobileTabs() {
  const tabs = document.getElementById('mobile-tabs');
  if (tabs) tabs.style.display = 'none';
}

function showMobileTabs() {
  const tabs = document.getElementById('mobile-tabs');
  if (tabs) tabs.style.display = '';
  switchTab('feed'); // Resetear a feed al iniciar
}
