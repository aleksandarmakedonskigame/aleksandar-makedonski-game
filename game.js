// ============================================================
// ALEXANDER'S QUEST - THE PATH OF LIGHT — v1.8.2 LEVEL 4 LIGHT FIX
// 37 Levels, 4 AI Agents, Stripe/PayPal, Social Networks
// Macedonian & English | LocalStorage Progress
// ============================================================
// ==================================================
// WPA НАДГРАДБИ – МАКЕДОНСКА ЕТНО МУЗИКА + ЗВУЧНИ ЕФЕКТИ
// ==================================================

// 1. МАКЕДОНСКА ЕТНО МУЗИКА (7/8 ритам)
const MacedonianMusic = {
  ctx: null,
  playing: false,
  
  init() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  },
  
  play7_8() {
    if (!this.ctx || !this.playing) return;
    const t = this.ctx.currentTime;
    const melody = [392, 440, 493.88, 523.25, 587.33, 523.25, 440];
    melody.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, t + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 0.4);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t + i * 0.18);
      osc.stop(t + i * 0.18 + 0.45);
    });
  },
  
  start() {
    this.playing = true;
    if (this.ctx?.state === 'suspended') this.ctx.resume();
    const loop = () => {
      if (!this.playing) return;
      this.play7_8();
      setTimeout(loop, 3600);
    };
    loop();
  },
  
  stop() { this.playing = false; }
};

// 2. ЗВУЧНИ ЕФЕКТИ
const GameAudio = {
  playSound(type) {
    if (!window.GameSounds) return;
    if (type === 'coin') window.GameSounds.collectCoin?.();
    if (type === 'scroll') window.GameSounds.collectScroll?.();
    if (type === 'victory') window.GameSounds.levelComplete?.();
    if (type === 'jump') window.GameSounds.playerJump?.();
  }
};

// 3. СУПЕР МОЌ ОД ПРИЈАТЕЛИТЕ
const FriendshipPower = {
  activePower: null,
  friends: [
    { name: 'Аристотел', power: 'Мудрост', bonus: 'x2 поени од свитоци', unlocked: true },
    { name: 'Хефестион', power: 'Братство', bonus: '+50 монети на почеток', unlocked: true },
    { name: 'Букефал', power: 'Брзина', bonus: 'подвижност x1.5', unlocked: false },
    { name: 'Птоломеј', power: 'Знаење', bonus: 'сите свитоци отклучени', unlocked: false },
    { name: 'Диоген', power: 'Светлина', bonus: 'нема темни нивоа', unlocked: false }
  ],
  
  activatePower(powerName) {
    const friend = this.friends.find(f => f.name === powerName);
    if (friend && friend.unlocked) {
      this.activePower = friend;
      this.showMessage(`✨ Активирана моќ: ${friend.power} – ${friend.bonus}`);
      return true;
    }
    return false;
  },
  
  showMessage(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:#1f2a3a;color:#d4af37;padding:12px 24px;border-radius:40px;z-index:1000;animation:fadeOut 3s forwards';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
};

// 4. ПОПРАВКА НА ТЕМНИ НИВОА – ДОДАВАЊЕ ЅВЕЗДИ И СВЕТЛИНА
function enhanceDarkLevels() {
  const style = document.createElement('style');
  style.textContent = `
    #game-container canvas {
      filter: brightness(1.05) contrast(1.02);
    }
    .level-darkness-fix {
      background: radial-gradient(circle at 50% 30%, rgba(212,175,55,0.08), transparent);
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 5;
    }
  `;
  document.head.appendChild(style);
  
  // Додај ѕвезди ако ги нема
  if (!document.querySelector('.star-particle')) {
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      star.style.cssText = `position:fixed;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;background:white;border-radius:50%;opacity:${0.3+Math.random()*0.7};animation:twinkle ${2+Math.random()*3}s infinite;pointer-events:none;z-index:0`;
      document.body.appendChild(star);
    }
  }
}

// 5. HUAWEI/HUAMI ИНТЕГРАЦИЈА (ЧЕКОРИ)
const StepIntegration = {
  steps: 0,
  connected: false,
  
  init() {
    this.checkHuawei();
    this.checkHuami();
    setInterval(() => this.sync(), 30000);
  },
  
  checkHuawei() {
    if (window.huawei?.health) {
      window.huawei.health.getSteps().then(s => { this.steps = s; this.checkLevelUp(); });
      this.connected = true;
    }
  },
  
  checkHuami() {
    if (window.Zepp) {
      window.Zepp.getUserSteps().then(s => { this.steps = s; this.checkLevelUp(); });
      this.connected = true;
    }
  },
  
  checkLevelUp() {
    const currentLevel = parseInt(localStorage.getItem('currentLevel') || '1');
    const newLevel = Math.min(37, Math.floor(this.steps / 3700) + 1);
    if (newLevel > currentLevel) {
      localStorage.setItem('currentLevel', newLevel);
      this.showNotif(`🎉 Честитки! Поместени чекори: ${this.steps}. Отклучено ниво ${newLevel}!`);
    }
  },
  
  sync() { if (this.connected) { this.checkHuawei(); this.checkHuami(); } },
  
  showNotif(msg) {
    if (Notification.permission === 'granted') new Notification('WPA Игра', { body: msg });
    else if (Notification.permission !== 'denied') Notification.requestPermission();
  }
};

// 6. PWA ИНСТАЛАЦИЈА
let pwaPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  pwaPrompt = e;
});

function installPWA() {
  if (pwaPrompt) pwaPrompt.prompt();
}

// 7. АНИМАЦИЈА ЗА ИЗБЛЕДУВАЊЕ
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `@keyframes fadeOut { 0% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } } @keyframes twinkle { 0%,100%{opacity:0.3}50%{opacity:1} }`;
document.head.appendChild(fadeStyle);

// ИНИЦИЈАЛИЗАЦИЈА
document.addEventListener('DOMContentLoaded', () => {
  enhanceDarkLevels();
  StepIntegration.init();
  if (typeof MacedonianMusic !== 'undefined') MacedonianMusic.init();
});

console.log('🏛️ WPA НАДГРАДБИ – АКТИВНИ: музика, супер моќи, ѕвезди, Huawei интеграција');
// ========== GLOBAL STATE ==========
const SAVE_KEY = 'alexander_quest_save';
const LEADER_KEY = 'alexander_quest_leaderboard';

// ========== FAIR ACCESS / PREMIUM GATE ==========
// Првите 8 нивоа се бесплатни. Од ниво 9 натаму играта бара Премиум поддршка ($0.99).
// Ова е фер модел: децата и родителите можат да пробаат, а проектот добива поддршка за развој.
const FREE_LEVEL_LIMIT = 8;
const PREMIUM_PRICE_USD = '0.99';

function hasPremiumAccess() {
  return Boolean(state?.premium || state?.premiumFree || state?.earlyAccess || state?.legendStatus);
}

function isPremiumLevel(level) {
  return Number(level) > FREE_LEVEL_LIMIT;
}

function showPremiumRequired(level) {
  const msg =
    '👑 Ниво ' + level + ' е дел од Премиум патеката.\n\n' +
    'Првите ' + FREE_LEVEL_LIMIT + ' нивоа се бесплатни за сите.\n' +
    'За да продолжиш од ниво 9 до 37, активирај Премиум поддршка за само $' + PREMIUM_PRICE_USD + '.\n\n' +
    'Ова помага играта да се одржува, подобрува и развива понатаму.';

  alert(msg);

  if (typeof buyProduct === 'function') {
    buyProduct('premium', 99);
  } else {
    showScreen('shop');
  }
}

const FACTS = [
  {id:1, title:'Кралскиот Тутор', text:'Александар бил ученик на Аристотел, најголемиот филозоф во историјата!'},
  {id:2, title:'Единство на Култури', text:'Александар го почитувал персиската култура и јазик на својот двор!'},
  {id:3, title:'Големата Библиотека', text:'Библиотеката во Александрија имала стотици илјади свитоци!'},
  {id:4, title:'Градот на Светлината', text:'Александрија била наречена "Светилникот на светот" заради своето знаење!'},
  {id:5, title:'Мост на Мирување', text:'Александар градел мостови, не ѕидови - поврзувал луѓе и култури!'},
  {id:6, title:'Армија на Единството', text:'Александар имал војници од 46 различни нации во својата армија!'},
  {id:7, title:'Градови на Знаењето', text:'Основал над 70 градови, многу од нив наречени Александрија!'},
  {id:8, title:'Јазик на Светот', text:'Коинето грчки, лингва франка на светот, се шири по целиот свет!'},
  {id:9, title:'Медицински Напредок', text:'Хирурзите на Александар биле најдобри во античкиот свет!'},
  {id:10, title:'Географски Откритија', text:'Експедициите на Александар ги пополниле празните места на картите!'},
  {id:11, title:'Трговски Патишта', text:'Походите ги поврзале Истокот и Западот за трговија!'},
  {id:12, title:'Круна на Мудроста', text:'На 12 години, Александар го примил Аристотел за учител. Знаењето е најголемата моќ!'},
  {id:13, title:'Пустински Дух', text:'Александар ја поминал пустината Гедарозија со своите војници!'},
  {id:14, title:'Планински Предизвик', text:'Ги освоил Hindu Kush планините на височина од 3000 метри!'},
  {id:15, title:'Персиската Круна', text:'Александар ја примил персиската круна со почит кон нивната култура!'},
  {id:16, title:'Египетскиот Оракул', text:'Оракулот во Сива го прогласил за син на Амон!'},
  {id:17, title:'Бабилонскиот Храм', text:'Александар ги обновил храмовите во Вавилон со голема почит!'},
  {id:18, title:'Пловечкиот Град', text:'Бродовите од Тир станале дел од поморската флота!'},
  {id:19, title:'Пустинскиот Оазис', text:'Откриле нови оази во пустината што ги поврзувале градовите!'},
  {id:20, title:'Силата на Тимот', text:'Александар секогаш водел од пред, а не од позади!'},
  {id:21, title:'Индиската Авантура', text:'Александар стигнал до реката Биас во Индија!'},
  {id:22, title:'Слоновите на Мирување', text:'Александар се восхитувал на индиските слонови!'},
  {id:23, title:'Речната Битка', text:'Битката кај Хидаспис била една од најголемите во историјата!'},
  {id:24, title:'Крилја на Победа', text:'Александар никогаш не изгубил битка во својот живот!'},
  {id:25, title:'Океанскиот Сон', text:'Александар сонувал да го открие Индискиот Океан!'},
  {id:26, title:'Пустинското Враќање', text:'Враќањето низ пустината Гедарозија било најтешкиот марш!'},
  {id:27, title:'Сватбата на Единството', text:'Организирал масовна свадба во Суза за поврзување на културите!'},
  {id:28, title:'Библиотеката од Соништата', text:'Александар сонувал за библиотека што ќе го собере целото човечко знаење!'},
  {id:29, title:'Фараонот на Мирот', text:'Во Египет, Александар бил примен како ослободувач, не како освојувач!'},
  {id:30, title:'Градот на Иднината', text:'Александрија ја планирал како главен град на светот!'},
  {id:31, title:'Водичот на Звездите', text:'Научниците на Александар ги мапирале ѕвездите!'},
  {id:32, title:'Уметноста на Единството', text:'Александар ги поттикнал уметниците да мешаат источни и западни стилови!'},
  {id:33, title:'Трговскиот Пут', text:'Ги поврзал трговските патишта од Средоземјето до Индија!'},
  {id:34, title:'Мостовите на Мирување', text:'Градел мостови наместо ѕидови - симбол на поврзување!'},
  {id:35, title:'Децата на Светот', text:'Александар верувал дека сите луѓе се деца на еден Бог!'},
  {id:36, title:'Светилникот на Надеж', text:'Фарос во Александрија бил едно од седумте светски чуда!'},
  {id:37, title:'Вечната Светлина', text:'Александар починал со 32 години, но неговото наследство живее вечно! Светот е книга, а оние кои патуваат читаат повеќе страници!'},
];

// ========== SAVE / LOAD ==========
function getState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {
    playerName: 'Гостин',
    currentLevel: 1,
    completedLevels: [],
    levelStars: {},
    totalCoins: 0,
    collectedFacts: [],
    unlockedGifts: [],
    totalScore: 0,
    sound: true,
    music: true,
    lang: 'mk',
    bonusStreak: 0,
    bonusDate: null,
    premium: false,
    // LEGEND WINNER
    legendStatus: false,
    legendDate: null,
    legendSeason: null,
    premiumFree: false,
    premiumExpiry: null,
    earlyAccess: false,
    legendTrophies: [],
    // COMPANIONS
    unlockedCompanions: [],
    activeCompanion: null,
    companionXP: {},
    // KINGDOM BUILDER
    kingdomBuildings: [],
    kingdomCoins: 0,
    kingdomLevel: 1,
    wisdomPoints: 0,
    playerFlag: '',
    playerCountryName: '',
  };
}

function saveState(s) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}

let state = getState();

function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem(LEADER_KEY) || '[]'); } catch(e) { return []; }
}
function saveLeaderboard(lb) { localStorage.setItem(LEADER_KEY, JSON.stringify(lb)); }

// ========== SCREEN MANAGEMENT ==========
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  if (name === 'levels') renderLevelSelect();
  if (name === 'museum') renderMuseum();
  if (name === 'rewards') renderRewards();
  if (name === 'leaderboard') renderLeaderboard();
  // 🏛️ Living Legacy auto-renders
  if (name === 'passport' && typeof Legacy !== 'undefined') Legacy.showPassport();
  if (name === 'wisdomwall' && typeof Legacy !== 'undefined') Legacy.renderWisdomWall();
  if (name === 'capsule' && typeof Legacy !== 'undefined') Legacy.showCapsule();
  if (window.lucide?.createIcons) lucide.createIcons();
  // Scroll to top so people see the new screen header
  window.scrollTo(0,0);
}

// ========== PARTICLES ==========
(function(){
  const bg = document.getElementById('particles-bg');
  for(let i=0;i<25;i++){
    const d = document.createElement('div');
    d.className = 'particle';
    d.style.left = Math.random()*100+'%';
    d.style.top = Math.random()*100+'%';
    d.style.width = d.style.height = (Math.random()*4+1)+'px';
    d.style.animationDelay = (Math.random()*8)+'s';
    d.style.animationDuration = (8+Math.random()*12)+'s';
    bg.appendChild(d);
  }
})();

// ========== MENU ==========
function updateMenu() {
  const stats = document.getElementById('menu-stats');
  if (state.completedLevels.length > 0) {
    stats.classList.remove('hidden');
    document.getElementById('stat-level').textContent = state.currentLevel;
    document.getElementById('stat-coins').textContent = state.totalCoins;
    const totalStars = Object.values(state.levelStars).reduce((a,b)=>a+b,0);
    document.getElementById('stat-stars').textContent = totalStars;
  }
  document.getElementById('player-name').textContent = (state.playerFlag ? state.playerFlag + ' ' : '') + (state.playerName || 'Гостин');
}

// ========== LEVEL SELECT ==========
const EPISODES = [
  {id:1, name:'Кралскиот Пат', range:[1,12]},
  {id:2, name:'Источното Патување', range:[13,24]},
  {id:3, name:'Градителот на Мостови', range:[25,37]},
];

function renderLevelSelect() {
  const el = document.getElementById('episodes-container');
  el.innerHTML = '';
  EPISODES.forEach(ep => {
    const colors = ep.id===1?'from-blue-600/20 to-blue-900/10':ep.id===2?'from-orange-600/20 to-orange-900/10':'from-teal-600/20 to-teal-900/10';
    const div = document.createElement('div');
    div.className = `bg-gradient-to-r ${colors} border border-white/10 rounded-2xl p-5`;
    div.innerHTML = `<h3 class="text-lg font-bold text-yellow-400 mb-3">${ep.name}</h3><div class="grid grid-cols-6 md:grid-cols-12 gap-2" id="ep-grid-${ep.id}"></div>`;
    el.appendChild(div);
    const grid = div.querySelector(`#ep-grid-${ep.id}`);
    for (let lv = ep.range[0]; lv <= ep.range[1]; lv++) {
      const progressionUnlocked = lv <= state.currentLevel || state.completedLevels.includes(lv-1);
      const premiumLocked = isPremiumLevel(lv) && !hasPremiumAccess();
      const unlocked = progressionUnlocked && !premiumLocked;
      const completed = state.completedLevels.includes(lv);
      const stars = state.levelStars[lv] || 0;
      const milestone = lv===12||lv===24||lv===37;
      const isGift = lv===12?'👑':lv===24?'🪽':lv===37?'🏆':'';
      const btn = document.createElement('button');
      btn.className = `level-dot ${completed?'completed':unlocked?'unlocked':'locked'}`;
      btn.title = premiumLocked ? 'Премиум ниво — потребна е поддршка од $0.99' : '';
      btn.innerHTML = unlocked
        ? `<span>${lv}</span>${stars>0?'<div class="flex gap-0.5 mt-0.5">'+Array(3).fill(0).map((_,i)=>'<span style="font-size:8px;color:'+(i<stars?'#FFD700':'#555')+'">★</span>').join('')+'</div>':''}${milestone&&unlocked?'<div class="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">'+isGift+'</div>':''}`
        : (premiumLocked ? `<span>${lv}</span><span style="font-size:11px">👑</span>` : '🔒');
      btn.onclick = () => {
        if (premiumLocked) { showPremiumRequired(lv); return; }
        if (unlocked) startLevel(lv);
      };
      grid.appendChild(btn);
    }
  });
}

// ========== GAME ENGINE (Phaser 3) ==========
let game = null;
let currentScene = null;

function startGame() { startLevel(state.currentLevel); }

function startLevel(level) {
  level = Math.min(Math.max(parseInt(level, 10) || 1, 1), 37);

  if (isPremiumLevel(level) && !hasPremiumAccess()) {
    showPremiumRequired(level);
    return;
  }

  showScreen('game');
  state.currentLevel = level;
  window.__AQ_SELECTED_LEVEL = state.currentLevel;
  saveState(state);
  updateMenu();

  // 👁️ Magic Tracking
  if(window.MagicTracking) MagicTracking.trackLevelStart(level);

  document.getElementById('hud-level').textContent = level;
  document.getElementById('hud-episode').textContent = level<=12?1:level<=24?2:3;
  document.getElementById('hud-episode-name').textContent = EPISODES[level<=12?0:level<=24?1:2].name;
  document.getElementById('hud-coins').textContent = state.totalCoins;

  if (game) { game.destroy(true); game=null; }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    parent: 'game-container',
    backgroundColor: '#1a1525',
    physics: { default: 'arcade', arcade: { gravity: { y: 800 } } },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 500,
      // 📱 Mobile-friendly: adapt to any aspect ratio
      min: { width: 320, height: 200 },
      max: { width: 1600, height: 1000 }
    },
    input: {
      activePointers: 3, // Multi-touch support for mobile
    },
    scene: [GameplayScene]
  };
  game = new Phaser.Game(config);
}

class GameplayScene extends Phaser.Scene {
  constructor() { super({ key: 'Game' }); }
  init(data = {}) { const selectedLevel = data.level || window.__AQ_SELECTED_LEVEL || 1; this.lvl = Math.min(Math.max(parseInt(selectedLevel, 10) || 1, 1), 37); this.score=0; this.coins=0; this.scrolls=0; this.timeE=0; this.canDJ=this.lvl>=3; this.jumps=0; }

  preload() {
    // Create textures programmatically
    const pg = this.make.graphics({x:0,y:0,add:false});
    pg.fillStyle(0x4A90E2,1);pg.fillRoundedRect(0,0,24,36,3);
    pg.fillStyle(0xFFD700,1);pg.fillCircle(12,8,5);
    pg.generateTexture('player',24,36);

    const p1=this.make.graphics({x:0,y:0,add:false});
    p1.fillStyle(0x2D6B3F,1);p1.fillRect(0,0,64,4);
    p1.fillStyle(0x8B7355,1);p1.fillRect(0,4,64,12);
    p1.generateTexture('plat1',64,16);

    const p2=this.make.graphics({x:0,y:0,add:false});
    p2.fillStyle(0xC2B280,1);p2.fillRect(0,0,64,4);
    p2.fillStyle(0xA89060,1);p2.fillRect(0,4,64,12);
    p2.generateTexture('plat2',64,16);

    const p3=this.make.graphics({x:0,y:0,add:false});
    p3.fillStyle(0xFFD700,1);p3.fillRect(0,0,64,3);
    p3.fillStyle(0xB8860B,1);p3.fillRect(0,3,64,13);
    p3.generateTexture('plat3',64,16);

    const cg=this.make.graphics({x:0,y:0,add:false});
    cg.fillStyle(0xFFD700,1);cg.fillCircle(8,8,8);
    cg.fillStyle(0xB8860B,1);cg.fillCircle(8,8,5);
    cg.generateTexture('coin',16,16);

    const sg=this.make.graphics({x:0,y:0,add:false});
    sg.fillStyle(0xF5DEB3,1);sg.fillRoundedRect(0,0,12,16,2);
    sg.fillStyle(0xB8860B,1);sg.fillCircle(6,5,2);
    sg.generateTexture('scroll',12,16);

    const cpg=this.make.graphics({x:0,y:0,add:false});
    cpg.fillStyle(0xFF6B35,1);cpg.fillCircle(8,8,7);
    cpg.fillStyle(0xFFD700,1);cpg.fillCircle(8,8,3);
    cpg.generateTexture('cp',16,16);

    const eg=this.make.graphics({x:0,y:0,add:false});
    eg.fillStyle(0xFFD700,1);eg.fillRoundedRect(0,0,36,50,4);
    eg.fillStyle(0xFFFFFF,0.6);eg.fillCircle(18,25,10);
    eg.generateTexture('end',36,50);

    // v1.7 Dynamic textures: stars, meteors, obstacles, super power orb, landmarks
    const starG=this.make.graphics({x:0,y:0,add:false});
    starG.fillStyle(0xFFD700,1);
    const starPts=[];
    for(let i=0;i<10;i++){
      const a=-Math.PI/2+i*Math.PI/5;
      const r=i%2===0?14:6;
      starPts.push(new Phaser.Geom.Point(16+Math.cos(a)*r,16+Math.sin(a)*r));
    }
    starG.fillPoints(starPts,true);
    starG.lineStyle(1,0xFFF8E7,0.7); starG.strokePoints(starPts,true);
    starG.generateTexture('dyn_star',32,32);

    const fireG=this.make.graphics({x:0,y:0,add:false});
    fireG.fillStyle(0x8B2E19,1); fireG.fillTriangle(18,0,2,42,34,42);
    fireG.fillStyle(0xFF6B35,1); fireG.fillTriangle(18,8,7,43,29,43);
    fireG.fillStyle(0xFFD700,1); fireG.fillTriangle(18,18,12,43,24,43);
    fireG.fillStyle(0x3D2A1F,1); fireG.fillRect(3,42,32,8);
    fireG.generateTexture('dyn_fire',36,52);

    const meteorG=this.make.graphics({x:0,y:0,add:false});
    meteorG.fillStyle(0xFF6B35,1); meteorG.fillCircle(18,18,14);
    meteorG.fillStyle(0xFFD700,1); meteorG.fillCircle(13,13,5);
    meteorG.lineStyle(4,0xFFA500,0.65); meteorG.lineBetween(2,4,27,29);
    meteorG.generateTexture('dyn_meteor',38,38);

    const orbG=this.make.graphics({x:0,y:0,add:false});
    orbG.fillStyle(0x4A90E2,0.9); orbG.fillCircle(20,20,18);
    orbG.fillStyle(0xFFD700,0.95); orbG.fillCircle(20,20,8);
    orbG.lineStyle(2,0xFFF8E7,0.7); orbG.strokeCircle(20,20,18);
    orbG.generateTexture('dyn_orb',40,40);

    const pillarG=this.make.graphics({x:0,y:0,add:false});
    pillarG.fillStyle(0xBFA66A,0.9); pillarG.fillRect(8,8,28,70);
    pillarG.fillStyle(0xD9C27A,0.9); pillarG.fillRect(2,0,40,12); pillarG.fillRect(2,76,40,10);
    pillarG.generateTexture('dyn_pillar',44,88);
  }

  create() {
    currentScene = this;
    this.cameras.main.setBackgroundColor('#1a1525');
    this.cameras.main.setBounds(0,0,3000,500);
    this.physics.world.setBounds(0,0,3000,500);

    // Stars bg — v1.8.2: keep old dark layer behind everything, not on top of dynamic world
    const g=this.add.graphics();
    g.fillGradientStyle(0x0F0C18,0x0F0C18,0x1A1525,0x1A1525,1);
    g.fillRect(0,0,3000,500);
    g.setDepth(-100);
    for(let i=0;i<80;i++){
      const tinyStar=this.add.circle(
        Phaser.Math.Between(0,3000),
        Phaser.Math.Between(0,400),
        Phaser.Math.FloatBetween(0.5,1.5),
        0xFFD700,
        Phaser.Math.FloatBetween(0.1,0.4)
      );
      tinyStar.setDepth(-90);
    }

    this.platforms=this.physics.add.staticGroup();
    this.coinGroup=this.physics.add.group({allowGravity:false});
    this.scrollGroup=this.physics.add.group({allowGravity:false});
    this.cpGroup=this.physics.add.group({allowGravity:false});

    // v1.7 Dynamic groups
    this.dynamicStarGroup=this.physics.add.group({allowGravity:false});
    this.dynamicHazardGroup=this.physics.add.staticGroup();
    this.dynamicPowerGroup=this.physics.add.group({allowGravity:false});
    this.dynamicMeteorGroup=this.physics.add.group({allowGravity:false});
    this.dynamicFalls=0;
    this.superJumpUntil=0;
    this.dynamicStarsCollected=0;

    // Build level
    this.buildLevel(this.lvl);
    this.decorateDynamicWorld(this.lvl);
    this.addDynamicGameplay(this.lvl);
    this.showDynamicMission(this.lvl);

    // Player
    this.player=this.physics.add.sprite(80,350,'player');
    this.player.setBounce(0.1).setCollideWorldBounds(false).setGravityY(800);
    this.cursors=this.input.keyboard.createCursorKeys();
    this.wasd=this.input.keyboard.addKeys({A:Phaser.Input.Keyboard.KeyCodes.A,D:Phaser.Input.Keyboard.KeyCodes.D,W:Phaser.Input.Keyboard.KeyCodes.W,SPACE:Phaser.Input.Keyboard.KeyCodes.SPACE});

    this.physics.add.collider(this.player,this.platforms);
    this.physics.add.overlap(this.player,this.coinGroup,this.onCoin,null,this);
    this.physics.add.overlap(this.player,this.scrollGroup,this.onScroll,null,this);
    this.physics.add.overlap(this.player,this.cpGroup,this.onCp,null,this);
    this.physics.add.overlap(this.player,this.dynamicStarGroup,this.onDynamicStar,null,this);
    this.physics.add.overlap(this.player,this.dynamicPowerGroup,this.onDynamicPower,null,this);
    this.physics.add.overlap(this.player,this.dynamicHazardGroup,this.onDynamicHazard,null,this);
    this.physics.add.overlap(this.player,this.dynamicMeteorGroup,this.onDynamicHazard,null,this);
    if (this.endpoint) this.physics.add.overlap(this.player,this.endpoint,this.onEnd,null,this);
    this.cameras.main.startFollow(this.player,true,0.1,0.1);

    this.timer=this.time.addEvent({delay:1000,callback:()=>{this.timeE++;},loop:true});

    this.input.keyboard.on('keydown-ESC',()=>{showScreen('menu');});
    this.input.keyboard.on('keydown-P',()=>{showScreen('menu');});
  }

  buildLevel(l) {
    const tex = l<=12?'plat1':l<=24?'plat2':'plat3';
    const groundY=460;
    const W=3000;

    // Ground
    for(let x=0;x<W;x+=64) this.platforms.create(x+32,groundY,tex).refreshBody();

    // Level generation
    const seed=l*137;
    let x=200,y=400;
    const numPlats=8+Math.floor(l*1.5);

    for(let i=0;i<numPlats;i++){
      const gap=80+Math.sin(x*0.01+seed)*40+l*2;
      const hChange=Math.sin(x*0.015+seed+i)*60;
      y=Phaser.Math.Clamp(320+hChange,260,420);
      x+=gap;
      this.platforms.create(x,y,tex).refreshBody();

      // Coins
      if(Math.random()>0.15) this.spawnCoin(x,y-40);
      if(Math.random()>0.6) this.spawnCoin(x+25,y-65);

      // Moving platforms for higher levels
      if(l>8 && Math.random()>0.7) {
        const mp=this.platforms.create(x+60,y-80,tex).refreshBody();
        this.tweens.add({targets:mp,y:y-40,y:y-100,duration:2000+l*100,yoyo:true,repeat:-1,ease:'Sine.InOut'});
      }
    }

    // Scroll
    const sx=500+(l*80)%2000;
    const sy=300-(l%3)*30;
    const scroll=this.scrollGroup.create(sx,sy,'scroll');
    this.tweens.add({targets:scroll,alpha:0.5,duration:800,yoyo:true,repeat:-1});

    // Checkpoints
    this.cpGroup.create(500,groundY-30,'cp');
    if(l>6) this.cpGroup.create(1400,groundY-30,'cp');
    if(l>15) this.cpGroup.create(2200,groundY-30,'cp');

    // Endpoint
    this.endpoint=this.physics.add.sprite(W-150,groundY-60,'end');
    this.endpoint.setImmovable(true);
    this.endpoint.body.allowGravity=false;

    // Pits (missing ground segments)
    if(l>3) {
      const pitCount=Math.min(Math.floor(l/3),5);
      for(let i=0;i<pitCount;i++){
        const px=400+i*400+(l*50)%300;
        // Remove ground platforms at pit positions
        this.platforms.children.iterate(child=>{
          if(Math.abs(child.x-px)<40) this.platforms.remove(child,true);
        });
      }
    }
  }

  // ========== v1.7 FULL GAMEPLAY REVISION ==========
  decorateDynamicWorld(l){
    const W=3000;
    const palette = l<=8
      ? {sky1:0x10162F,sky2:0x1A2E46,mountain:0x263B55,ruin:0xBFA66A}
      : l<=16
      ? {sky1:0x1C1426,sky2:0x402315,mountain:0x5D3B22,ruin:0xD4A54D}
      : l<=24
      ? {sky1:0x0F1C22,sky2:0x163E44,mountain:0x245A5E,ruin:0xC2B280}
      : {sky1:0x120B20,sky2:0x2D1744,mountain:0x3B2A55,ruin:0xFFD700};

    const bg=this.add.graphics();
    bg.fillGradientStyle(palette.sky1,palette.sky1,palette.sky2,palette.sky2,1);
    bg.fillRect(0,0,W,500);
    bg.setDepth(-30);

    // Moon / sun glow
    const orbX=260+(l%5)*60;
    this.add.circle(orbX,80,58,0xFFDFA6,0.16).setDepth(-25);
    this.add.circle(orbX,80,32,0xFFD700,0.20).setDepth(-24);

    // Mountains
    const mg=this.add.graphics();
    mg.fillStyle(palette.mountain,0.50);
    for(let x=0;x<W;x+=170){
      const h=70+((x*19+l*53)%120);
      mg.fillTriangle(x,455,x+90,455-h,x+190,455);
    }
    mg.setDepth(-22);

    // Ancient pillars / ruins
    for(let x=360;x<W;x+=420){
      const baseY=408+((x+l*17)%24);
      const p=this.add.image(x,baseY,'dyn_pillar');
      p.setAlpha(0.38);
      p.setDepth(-10);
      p.setScale(0.8+((x+l)%3)*0.12);
    }

    // Moving sky stars
    for(let i=0;i<70;i++){
      const s=this.add.circle(
        Phaser.Math.Between(20,W-20),
        Phaser.Math.Between(25,230),
        Phaser.Math.FloatBetween(0.8,2.2),
        0xFFF0B8,
        Phaser.Math.FloatBetween(0.18,0.75)
      );
      s.setDepth(-18);
      this.tweens.add({targets:s,alpha:Phaser.Math.FloatBetween(0.15,0.95),duration:900+((i*137)%1600),yoyo:true,repeat:-1});
    }

    // Road signs to make progress visible
    for(let x=500;x<W;x+=500){
      const sign=this.add.text(x,425,'✦', {fontSize:'22px',color:'#FFD700'});
      sign.setDepth(2);
      sign.setAlpha(0.65);
    }

    // v1.8.2: visible start-zone scenery so level 4 and all levels never start as empty darkness.
    const startGlow=this.add.graphics();
    startGlow.fillStyle(0xFFD700,0.10);
    startGlow.fillCircle(135,350,90);
    startGlow.fillStyle(0x4A90E2,0.08);
    startGlow.fillCircle(220,300,70);
    startGlow.setDepth(-3);

    const startText=this.add.text(95,160,'Патот е жив — следи ја светлината', {
      fontSize:'18px',
      color:'#FFD700',
      fontFamily:'Inter',
      fontStyle:'bold',
      stroke:'#0F0C18',
      strokeThickness:4
    });
    startText.setDepth(6);
    startText.setAlpha(0.86);
    this.tweens.add({targets:startText,alpha:0.45,duration:1400,yoyo:true,repeat:-1});

    // Level 4 gets extra visible identity: Meteors / stars / ruins from the first screen.
    if(l===4){
      const title=this.add.text(130,105,'Ниво 4 · Небесни Знаци', {
        fontSize:'24px',
        color:'#9fd0ff',
        fontFamily:'Cinzel Decorative',
        stroke:'#0F0C18',
        strokeThickness:5
      });
      title.setDepth(7);
      const glow=this.add.graphics();
      glow.fillStyle(0x4A90E2,0.16);
      glow.fillCircle(420,120,120);
      glow.fillStyle(0xFFD700,0.12);
      glow.fillCircle(580,190,85);
      glow.setDepth(-2);
    }
  }

  addDynamicGameplay(l){
    // Collectible stars in all 37 levels
    const starCount=10+Math.min(8,Math.floor(l/4));
    for(let i=0;i<starCount;i++){
      const x=250+i*(2450/starCount)+Phaser.Math.Between(-30,40);
      const y=Phaser.Math.Between(165,335);
      const st=this.dynamicStarGroup.create(x,y,'dyn_star');
      st.setDepth(10);
      st.setData('kind','star');
      this.tweens.add({targets:st,y:y-8,angle:360,duration:1400+Phaser.Math.Between(0,700),yoyo:true,repeat:-1,ease:'Sine.InOut'});
    }

    // v1.8.2: guaranteed visible collectibles in the first camera view
    const firstStarPositions = [
      [210, 330], [295, 290], [380, 250], [465, 310]
    ];
    firstStarPositions.forEach((pos, idx)=>{
      const st=this.dynamicStarGroup.create(pos[0],pos[1],'dyn_star');
      st.setDepth(14);
      st.setData('kind','start-star');
      this.tweens.add({targets:st,y:pos[1]-10,angle:360,duration:1200+idx*160,yoyo:true,repeat:-1,ease:'Sine.InOut'});
    });

    // v1.8.2: first super-jump orb is visible early, so player immediately feels a power-up.
    const firstOrb=this.dynamicPowerGroup.create(560,300,'dyn_orb');
    firstOrb.setDepth(15);
    firstOrb.setData('kind','start-superjump');
    this.tweens.add({targets:firstOrb,scale:1.22,alpha:0.72,duration:780,yoyo:true,repeat:-1});

    // v1.8.2: level 4 special first-screen meteor, high enough to be visible but fair.
    if(l===4){
      const m=this.dynamicMeteorGroup.create(640,80,'dyn_meteor');
      m.body.allowGravity=false;
      m.setDepth(16);
      m.setVelocity(-15,95);
      m.setData('baseX',640);
      m.setData('lastHit',0);
    }

    // Obstacles start early, but stay fair
    const hazardCount= l<3 ? 3 : Math.min(10,4+Math.floor(l/3));
    for(let i=0;i<hazardCount;i++){
      const x=520+i*(2200/hazardCount)+Phaser.Math.Between(-45,45);
      const h=this.dynamicHazardGroup.create(x,438,'dyn_fire');
      h.setDepth(8);
      h.setData('lastHit',0);
      h.refreshBody();
    }

    // Super power orbs: friends/companions help jump higher
    const orbX=620+(l%5)*310;
    const orb=this.dynamicPowerGroup.create(orbX,285,'dyn_orb');
    orb.setDepth(11);
    orb.setData('kind','superjump');
    this.tweens.add({targets:orb,scale:1.22,alpha:0.70,duration:800,yoyo:true,repeat:-1});

    if(l>=2){
      const meteorCount=Math.min(7,1+Math.floor(l/4));
      for(let i=0;i<meteorCount;i++){
        const x=760+i*(1900/meteorCount)+Phaser.Math.Between(-60,60);
        const m=this.dynamicMeteorGroup.create(x,Phaser.Math.Between(45,135),'dyn_meteor');
        m.body.allowGravity=false;
        m.setDepth(12);
        m.setVelocity(Phaser.Math.Between(-45,45),Phaser.Math.Between(70,145));
        m.setData('baseX',x);
        m.setData('lastHit',0);
      }
    }
  }

  showDynamicMission(l){
    const missions=[
      'Собери 5 ѕвезди и стигни до крајот.',
      'Избегни ги препреките и најди го свитокот.',
      'Активирај супер скок од другарчињата.',
      'Внимавај на небесните метеори.',
      'Собери мудрост без да паднеш.',
      'Следи ги златните знаци до крајот.',
      'Најди ја светлината помеѓу урнатините.',
      'Докажи дека си патник на протоколот.'
    ];
    if(window.AQDynamic && AQDynamic.toast){
      AQDynamic.toast('<strong>🎯 Мисија ниво '+l+':</strong><br>'+missions[(l-1)%missions.length],4200);
    }
  }

  updateDynamicMeteors(){
    if(!this.dynamicMeteorGroup)return;
    this.dynamicMeteorGroup.children.iterate(m=>{
      if(!m||!m.active)return;
      m.angle+=4;
      if(m.y>480||m.x<0||m.x>3000){
        const bx=m.getData('baseX')||900;
        m.setPosition(bx+Phaser.Math.Between(-120,120),Phaser.Math.Between(35,120));
        m.setVelocity(Phaser.Math.Between(-50,50),Phaser.Math.Between(75,155));
      }
    });
  }

  onDynamicStar(p,st){
    if(!st.active)return;
    this.particles(st.x,st.y,0xFFD700,9);
    if(window.GameSounds) GameSounds.coin();
    st.disableBody(true,true);
    this.dynamicStarsCollected++;
    this.coins++;
    this.score+=25;
    state.totalCoins=(state.totalCoins||0)+1;
    state.wisdomPoints=(state.wisdomPoints||0)+5;
    saveState(state);
    const hud=document.getElementById('hud-coins');
    if(hud)hud.textContent=state.totalCoins;
  }

  onDynamicPower(p,power){
    if(!power.active)return;
    power.disableBody(true,true);
    this.superJumpUntil=this.time.now+14000;
    this.canDJ=true;
    this.score+=80;
    state.wisdomPoints=(state.wisdomPoints||0)+10;
    saveState(state);
    this.particles(power.x,power.y,0x4A90E2,18);
    if(window.AQDynamic&&AQDynamic.toast){
      AQDynamic.toast('<strong>⚡ Супер моќ од другарчињата!</strong><br>14 секунди имаш двоен и повисок скок.',4500);
    }
    if(window.GameSounds) GameSounds.power();
  }

  onDynamicHazard(p,h){
    const now=this.time.now||Date.now();
    if(h.getData&&now-(h.getData('lastHit')||0)<1200)return;
    if(h.setData)h.setData('lastHit',now);
    this.dynamicFalls++;
    this.score=Math.max(0,this.score-35);
    this.particles(this.player.x,this.player.y,0xFF6B35,12);
    this.player.setVelocity(0,0);
    this.player.setPosition(Math.max(80,this.player.x-130),350);
    if(window.GameSounds) GameSounds.hit();
    if(window.AQDynamic&&AQDynamic.toast){
      AQDynamic.toast('<strong>🔥 Предизвик!</strong><br>Патот на Александар бара внимание и мудрост.',2600);
    }
  }

  spawnCoin(x,y){
    const c=this.coinGroup.create(x,y,'coin');
    this.tweens.add({targets:c,y:y-4,duration:1000,yoyo:true,repeat:-1,ease:'Sine.InOut'});
  }

  onCoin(p,c){
    this.particles(c.x,c.y,0xFFD700,5);
    if(window.GameSounds) GameSounds.coin();
    c.destroy();this.coins++;
    const fx = getCompanionEffects();
    this.score += Math.floor(10 * fx.score);
    state.totalCoins++;saveState(state);
    document.getElementById('hud-coins').textContent=state.totalCoins;
  }

  onScroll(p,s){
    this.particles(s.x,s.y,0xFFA500,8);
    if(window.GameSounds) GameSounds.scroll();
    s.destroy();this.scrolls++;
    const fx = getCompanionEffects();
    this.score += Math.floor(50 * fx.score);
    // Auto-collect with knowledge companion
    if(fx.autoScroll && Math.random() > 0.7){
      this.scrolls++;
      this.score += Math.floor(25 * fx.score);
      showFact('📚 ' + COMPANIONS.aristotel.quote);
    }
    const fact=FACTS[Math.min(this.lvl-1,FACTS.length-1)];
    if(fact && !state.collectedFacts.includes(fact.id)){
      state.collectedFacts.push(fact.id);
      saveState(state);
      // 🌟 LIVING LEGACY: Show shareable wisdom spark for new facts!
      if (typeof Legacy !== 'undefined' && Legacy.showWisdomSpark) {
        setTimeout(() => Legacy.showWisdomSpark(fact), 800);
      }
    }
    showFact(fact?fact.text:'');
  }

  onCp(p,cp){
    if(cp.getData('act'))return;
    cp.setData('act',true);
    this.particles(cp.x,cp.y,0xFF6B35,8);
    this.tweens.add({targets:cp,scale:1.5,alpha:0,duration:400});
  }

  onEnd(){
    if(this.ended)return;this.ended=true;this.timer.destroy();
    this.particles(this.player.x,this.player.y,0xFFD700,15);
    if(window.GameSounds) GameSounds.victory();
    const tb=Math.max(0,300-this.timeE)*5;
    this.score+=tb;
    let stars=1;
    if(this.coins>=5)stars=2;
    if(this.coins>=8 && this.scrolls>=1 && this.timeE<120)stars=3;
    if((this.dynamicStarsCollected||0)>=8 && this.dynamicFalls===0)stars=Math.max(stars,3);

    if(!state.completedLevels.includes(this.lvl)){
      state.completedLevels.push(this.lvl);
      state.levelStars[this.lvl]=stars;
    } else {
      state.levelStars[this.lvl]=Math.max(state.levelStars[this.lvl]||0,stars);
    }
    state.totalScore+=this.score;
    saveState(state);

    // Milestone gifts
    if(this.lvl===12) unlockGift('12');
    if(this.lvl===24) unlockGift('24');
    if(this.lvl===37) { unlockGift('37'); activateLegendWinner(); }

    // Apply companion score bonus
    const fx = getCompanionEffects();
    this.score = Math.floor(this.score * fx.score);

    // Extra lives from companion
    if(fx.extraLives > 0){
      this.score += fx.extraLives * 100;
    }

    // Leaderboard
    const lb=getLeaderboard();
    lb.push({name:state.playerName,score:this.score,level:this.lvl,stars,time:this.timeE,companion:state.activeCompanion});
    lb.sort((a,b)=>b.score-a.score);
    saveLeaderboard(lb.slice(0,50));

    // Companion XP
    if(state.activeCompanion){
      addCompanionXP(state.activeCompanion, this.score / 10);
    }
    // Kingdom coins
    earnKingdomCoins(this.score);

    // 👁️ Magic Tracking
    if(window.MagicTracking){
      MagicTracking.trackLevelComplete(this.lvl, this.score, stars, this.timeE);
      MagicTracking.trackCoinCollected(this.coins);
    }

    showLevelComplete(this.lvl,this.score,this.coins,this.scrolls,this.timeE,stars);
  }

  particles(x,y,c,n){
    for(let i=0;i<n;i++){
      const p=this.add.circle(x,y,Phaser.Math.FloatBetween(2,4),c,0.8);
      this.tweens.add({targets:p,x:x+Phaser.Math.FloatBetween(-50,50),y:y+Phaser.Math.FloatBetween(-60,10),alpha:0,scale:0,duration:500});
    }
  }

  update(){
    if(this.ended)return;
    this.updateDynamicMeteors();
    // Apply companion effects
    const fx = getCompanionEffects();
    const touchKeys = window.__AQ_TOUCH_KEYS || {};
    const left=this.cursors.left.isDown||this.wasd.A.isDown||touchKeys.ArrowLeft;
    const right=this.cursors.right.isDown||this.wasd.D.isDown||touchKeys.ArrowRight;
    const jump=Phaser.Input.Keyboard.JustDown(this.cursors.space)||Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.wasd.W)||Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)||touchKeys.Space;

    const speed = 200 * fx.speed;
    if(left){this.player.setVelocityX(-speed);this.player.setFlipX(true);}
    else if(right){this.player.setVelocityX(speed);this.player.setFlipX(false);}
    else this.player.setVelocityX(0);

    const ground=this.player.body.touching.down;
    if(ground)this.jumps=0;
    const jumpPower = 400 * fx.jump * (this.superJumpUntil && this.time.now < this.superJumpUntil ? 1.75 : 1);
    if(jump){
      if(ground){this.player.setVelocityY(-jumpPower);this.jumps=1;this.particles(this.player.x,this.player.y+15,0x4A90E2,3);}
      else if((this.canDJ||fx.jump>1.3)&&this.jumps<2){this.player.setVelocityY(-jumpPower*0.85);this.jumps=2;this.particles(this.player.x,this.player.y+15,0x4A90E2,5);}
    }

    if(this.player.y>520){
      this.player.setVelocity(0,0);
      this.player.setPosition(80,350);
      // 👁️ Magic Tracking — player fell
      if(window.MagicTracking) MagicTracking.trackDeath(this.lvl);
    }
  }
}

// ========== LEVEL COMPLETE ==========
function showLevelComplete(level,score,coins,scrolls,time,stars){
  document.getElementById('complete-level').textContent=level;
  document.getElementById('complete-score').textContent=score;
  document.getElementById('complete-coins').textContent=coins;
  document.getElementById('complete-scrolls').textContent=scrolls;
  document.getElementById('complete-time').textContent=time+'s';

  const scEl=document.getElementById('complete-stars');
  scEl.innerHTML='';
  for(let i=1;i<=3;i++){
    const s=document.createElement('span');
    s.textContent='★';s.style.fontSize='36px';
    s.style.color=i<=stars?'#FFD700':'#555';
    scEl.appendChild(s);
  }

  if(stars===3 && typeof confetti === 'function') confetti({particleCount:100,spread:70,origin:{y:0.6},colors:['#FFD700','#FFA500','#4A90E2']});

  document.getElementById('modal-complete').classList.remove('hidden');
  if (window.lucide?.createIcons) lucide.createIcons();
}
function nextLevel(){closeModal('modal-complete');const nl=Math.min(currentScene?.lvl||state.currentLevel,36)+1;startLevel(nl);}
function retryLevel(){closeModal('modal-complete');const l=currentScene?.lvl||state.currentLevel;startLevel(l);}

// ========== FACT POPUP ==========
function showFact(text){
  const el=document.getElementById('modal-fact');
  document.getElementById('fact-text').textContent=text;
  el.classList.remove('hidden');
  setTimeout(()=>el.classList.add('hidden'),5000);
}

// ========== MUSEUM ==========
function renderMuseum(){
  const el=document.getElementById('museum-scrolls');
  el.innerHTML='';
  document.getElementById('museum-count').textContent=state.collectedFacts.length;
  FACTS.forEach(f=>{
    const found=state.collectedFacts.includes(f.id);
    const div=document.createElement('div');
    div.className=`p-4 rounded-xl border transition-all ${found?'bg-yellow-500/10 border-yellow-500/40 cursor-pointer hover:bg-yellow-500/20':'bg-white/5 border-white/10 opacity-40'}`;
    if (found) {
      div.onclick = () => { if (typeof Legacy !== 'undefined') Legacy.showWisdomSpark(f); };
      div.title = 'Кликни за искра-картичка';
    }
    div.innerHTML=`<h3 class="font-bold mb-1 ${found?'text-yellow-400':'text-[#FFF8E7]/40'}">${found?'📜':'🔒'} ${f.title} ${found?'<span class="text-xs opacity-50 ml-2">⚡ кликни</span>':''}</h3><p class="text-sm text-[#FFF8E7]/70">${found?f.text:'????????????'}</p>`;
    el.appendChild(div);
  });
}

// ========== REWARDS ==========
function unlockGift(lvl){
  if(state.unlockedGifts.includes(lvl))return;
  state.unlockedGifts.push(lvl);
  saveState(state);
  confetti({particleCount:150,spread:100,origin:{y:0.5},colors:['#FFD700','#FFA500','#FF6B35']});
}

// ========== LEGEND WINNER SYSTEM ==========
// Decata koi sto ke go zavrshat 37-to nivo dobivaat BESPLATEN VIP
function activateLegendWinner(){
  // Mark as legend
  state.legendStatus=true;
  state.legendDate=new Date().toISOString();
  state.legendSeason=2; // Besplatna naredna sezona

  // Besplaten VIP PREMIUM za naredniot period
  state.premium=true;
  state.premiumFree=true; // Označuva deka e besplatno od level 37
  state.premiumExpiry=new Date(Date.now()+90*24*60*60*1000).toISOString(); // 90 dena besplatno

  // Rana pristap na novi nivoa
  state.earlyAccess=true;

  // Zlaten trofej
  if(!state.legendTrophies) state.legendTrophies=[];
  state.legendTrophies.push({
    id:'legend_37',
    name:'🏆 ЛЕГЕНДА НА СВЕТЛИНАТА',
    desc:'Го освои 37-то ниво и стана Легенда!',
    date:new Date().toISOString(),
  });

  saveState(state);

  // Email notifikacija (simulirana) do aleksandarmakedonskigame@gmail.com
  console.log('[LEGEND] Nov LEGENDA! Igrac: '+state.playerName+' ja zavrshi igrata!');
  console.log('[EMAIL] Notifikacija ispratena do: aleksandarmakedonskigame@gmail.com');

  // Analytics
  if(window.Monetization && Monetization.analytics){
    Monetization.analytics.track('legend_winner',{
      player:state.playerName,
      level:37,
      season:2,
      premium:true,
      email:'aleksandarmakedonskigame@gmail.com',
    });
  }

  // Prikazi LEGEND ekran
  setTimeout(()=>{
    showLegendScreen();
    // 🏛️ LIVING LEGACY: Auto-show the world-unique capsule after legend modal
    if (typeof Legacy !== 'undefined') {
      setTimeout(()=>Legacy.showToast('🏛️ Откучена е Тестамент-Капсулата!'), 3500);
    }
  },1500);
}

function showLegendScreen(){
  const modal=document.getElementById('modal-legend');
  if(modal) modal.classList.remove('hidden');
}

function closeLegend(){
  closeModal('modal-legend');
}

function checkLegendStatus(){
  // Proveri dali premium istekol
  if(state.premiumFree && state.premiumExpiry){
    const now=new Date();
    const expiry=new Date(state.premiumExpiry);
    if(now>expiry){
      state.premiumFree=false;
      state.premium=false;
      saveState(state);
      return false;
    }
    return true;
  }
  return state.premiumFree || false;
}

// ========== ALEXANDER'S COMPANIONS ==========
// 4 legendary companions that follow you through levels
const COMPANIONS = {
  bukefal: {
    id: 'bukefal',
    name: 'Букефал',
    title: 'Верниот Коњ',
    emoji: '🐴',
    color: 'text-amber-400',
    unlockLevel: 5,
    desc: 'Легендарниот коњ на Александар! Ти дава +50% брзина и можност за двоен скок!',
    ability: 'speed',
    abilityValue: 1.5,
    quote: 'Букефал никогаш не се плашеше од сенките!',
  },
  aristotel: {
    id: 'aristotel',
    name: 'Аристотел',
    title: 'Мудриот Учител',
    emoji: '📚',
    color: 'text-blue-400',
    unlockLevel: 10,
    desc: 'Најголемиот филозоф! Открива скриени монети и дава совети за загатките!',
    ability: 'wisdom',
    abilityValue: 2,
    quote: 'Секоја загатка има решение - треба само да го најдеш!',
  },
  hephestion: {
    id: 'hephestion',
    name: 'Хефестион',
    title: 'Најдобриот Пријател',
    emoji: '⚔️',
    color: 'text-red-400',
    unlockLevel: 15,
    desc: 'Најдобриот другар на Александар! Ти дава екстра живот и двојни поени!',
    ability: 'strength',
    abilityValue: 2,
    quote: 'Заедно сме непобедливи!',
  },
  ptolomej: {
    id: 'ptolomej',
    name: 'Птоломеј',
    title: 'Чуварот на Знаењето',
    emoji: '🏛️',
    color: 'text-teal-400',
    unlockLevel: 20,
    desc: 'Лојален генерал! Собира свитоци автоматски и отклучува тајни врати!',
    ability: 'knowledge',
    abilityValue: 1,
    quote: 'Знаењето е вечно!',
  },
};

function getUnlockedCompanions(){
  return Object.values(COMPANIONS).filter(c => state.completedLevels.length >= c.unlockLevel || state.unlockedCompanions.includes(c.id));
}

function selectCompanion(compId){
  state.activeCompanion = compId;
  if(!state.companionXP[compId]) state.companionXP[compId] = 0;
  saveState(state);
  renderCompanions();
}

function renderCompanions(){
  const container = document.getElementById('companions-list');
  if(!container) return;
  const unlocked = getUnlockedCompanions();

  container.innerHTML = unlocked.map(c => {
    const isActive = state.activeCompanion === c.id;
    const xp = state.companionXP[c.id] || 0;
    const level = Math.floor(xp / 100) + 1;
    return `
      <div onclick="selectCompanion('${c.id}')" class="cursor-pointer p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-4xl">${c.emoji}</span>
          <div class="flex-1">
            <p class="font-bold ${c.color}">${c.name}</p>
            <p class="text-xs text-[#FFF8E7]/50">${c.title}</p>
          </div>
          ${isActive ? '<span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">✅ Активен</span>' : ''}
        </div>
        <p class="text-xs text-[#FFF8E7]/60 mb-2">${c.desc}</p>
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-black/30 rounded-full h-2 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" style="width:${(xp % 100)}%"></div>
          </div>
          <span class="text-xs text-yellow-400 font-bold">Lvl ${level}</span>
        </div>
        <p class="text-[#FFF8E7]/30 text-xs mt-1 italic">"${c.quote}"</p>
      </div>`;
  }).join('');

  // Locked companions
  const locked = Object.values(COMPANIONS).filter(c => !unlocked.includes(c));
  if(locked.length > 0){
    container.innerHTML += `<div class="mt-4 pt-4 border-t border-white/10"><p class="text-[#FFF8E7]/40 text-xs mb-2">🔒 Уште да се отклучат:</p><div class="grid grid-cols-2 gap-2">` +
      locked.map(c => `
        <div class="p-3 rounded-xl bg-black/20 border border-white/5 opacity-40">
          <span class="text-2xl">${c.emoji}</span>
          <p class="text-xs text-[#FFF8E7]/50">${c.name}</p>
          <p class="text-xs text-[#FFF8E7]/30">Ниво ${c.unlockLevel}</p>
        </div>`).join('') + `</div></div>`;
  }

  // Show active companion in HUD
  const hud = document.getElementById('companion-hud');
  if(hud && state.activeCompanion){
    const c = COMPANIONS[state.activeCompanion];
    hud.innerHTML = `<span class="text-lg">${c.emoji}</span><span class="text-xs text-[#FFF8E7]/70">${c.name}</span>`;
    hud.classList.remove('hidden');
  } else if(hud){
    hud.classList.add('hidden');
  }
}

function addCompanionXP(compId, amount){
  if(!state.companionXP[compId]) state.companionXP[compId] = 0;
  state.companionXP[compId] += amount;
  saveState(state);
}

// Apply companion abilities during gameplay
function getCompanionEffects(){
  if(!state.activeCompanion) return {speed:1, jump:1, score:1, autoScroll:false, extraLives:0};
  const c = COMPANIONS[state.activeCompanion];
  const xp = state.companionXP[state.activeCompanion] || 0;
  const lvl = Math.floor(xp / 100) + 1;
  switch(c.ability){
    case 'speed': return {speed: c.abilityValue + lvl*0.1, jump:1, score:1, autoScroll:false, extraLives:0};
    case 'wisdom': return {speed:1, jump:1 + lvl*0.1, score:1, autoScroll: lvl>=3, extraLives:0};
    case 'strength': return {speed:1, jump:1, score: c.abilityValue + lvl*0.2, autoScroll:false, extraLives: Math.floor(lvl/3)};
    case 'knowledge': return {speed:1, jump:1, score:1 + lvl*0.1, autoScroll: true, extraLives:0};
    default: return {speed:1, jump:1, score:1, autoScroll:false, extraLives:0};
  }
}

// ========== KINGDOM BUILDER ==========
// Build Alexandria after completing level 37!
const BUILDINGS = [
  {id:'library', name:'Големата Библиотека', emoji:'📚', cost:100, desc:'Собирај го целото човечко знаење!', income:10},
  {id:'lighthouse', name:'Фарос - Светилник', emoji:'🏮', cost:200, desc:'Едно од седумте светски чуда!', income:20},
  {id:'theater', name:'Големиот Театар', emoji:'🎭', cost:150, desc:'Уметноста ги поврзува срцата!', income:15},
  {id:'university', name:'Универзитет', emoji:'🎓', cost:300, desc:'Најдобрите умови на светот!', income:25},
  {id:'temple', name:'Храм на Единството', emoji:'🏛️', cost:250, desc:'Сите богови под еден покрив!', income:20},
  {id:'market', name:'Трговски Пазар', emoji:'🏪', cost:120, desc:'Трговија од целиот свет!', income:12},
  {id:'port', name:'Пристаниште', emoji:'⚓', cost:180, desc:'Врата кон нови светови!', income:18},
  {id:'garden', name:'Висечки Градини', emoji:'🌳', cost:350, desc:'Уште едно светско чудо!', income:30},
  {id:'palace', name:'Кралска Палата', emoji:'👑', cost:500, desc:'Домот на владетелот!', income:40},
  {id:'academy', name:'Воена Академија', emoji:'⚔️', cost:400, desc:'Ги учи младите на храброст!', income:35},
];

function showKingdom(){
  showScreen('kingdom');
  renderKingdom();
}

function renderKingdom(){
  const container = document.getElementById('kingdom-grid');
  if(!container) return;

  // Check if legend
  const isLegend = state.legendStatus;
  if(!isLegend){
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">🔒</span>
        <h3 class="text-xl font-bold text-yellow-400 mb-2">Градителот на Александрија е заклучен!</h3>
        <p class="text-[#FFF8E7]/60 text-sm mb-4">Заврши ги сите 37 нивоа за да го отклучиш овој режим!</p>
        <button onclick="showScreen('menu')" class="game-btn py-2 px-6">Назад</button>
      </div>`;
    return;
  }

  // Kingdom coins
  document.getElementById('kingdom-coins').textContent = state.kingdomCoins;
  document.getElementById('kingdom-level').textContent = state.kingdomLevel;
  document.getElementById('kingdom-income').textContent = calculateKingdomIncome();

  // Buildings
  container.innerHTML = BUILDINGS.map(b => {
    const owned = state.kingdomBuildings.includes(b.id);
    const canAfford = state.kingdomCoins >= b.cost;
    return `
      <div class="p-4 rounded-2xl border-2 transition-all ${owned ? 'border-green-500 bg-green-500/10' : canAfford ? 'border-yellow-500/40 bg-white/5 hover:border-yellow-500' : 'border-white/10 bg-white/5 opacity-50'}">
        <div class="text-4xl mb-2">${b.emoji}</div>
        <h4 class="font-bold text-yellow-400 text-sm mb-1">${b.name}</h4>
        <p class="text-xs text-[#FFF8E7]/50 mb-2">${b.desc}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs ${owned ? 'text-green-400' : 'text-yellow-400'}">${owned ? '✅ Изградено' : '🪙 ' + b.cost}</span>
          ${owned ? `<span class="text-xs text-green-400">+${b.income}/мин</span>` : `<button onclick="buildBuilding('${b.id}')" class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg ${canAfford ? 'hover:bg-yellow-500/40' : 'opacity-50 cursor-not-allowed'}" ${canAfford ? '' : 'disabled'}>Изгради</button>`}
        </div>
      </div>`;
  }).join('');
}

function buildBuilding(buildingId){
  const b = BUILDINGS.find(x => x.id === buildingId);
  if(!b || state.kingdomBuildings.includes(b.id)) return;
  if(state.kingdomCoins < b.cost){
    alert('Немаш доволно Александриски Монети! Играј нивоа за да заработиш повеќе!');
    return;
  }
  state.kingdomCoins -= b.cost;
  state.kingdomBuildings.push(b.id);

  // Kingdom level up
  const newLevel = Math.floor(state.kingdomBuildings.length / 2) + 1;
  if(newLevel > state.kingdomLevel){
    state.kingdomLevel = newLevel;
    confetti({particleCount:80, spread:60, origin:{y:0.6}, colors:['#FFD700','#2ECC71','#4A90E2']});
  }

  saveState(state);
  renderKingdom();
}

function calculateKingdomIncome(){
  return state.kingdomBuildings.reduce((sum, id) => {
    const b = BUILDINGS.find(x => x.id === id);
    return sum + (b ? b.income : 0);
  }, 0);
}

// Kingdom coin generator - earn kingdom coins by playing levels
function earnKingdomCoins(levelScore){
  if(!state.legendStatus) return;
  const earned = Math.floor(levelScore / 10);
  state.kingdomCoins += earned;
  saveState(state);
}

// Passive kingdom income every minute
setInterval(() => {
  if(state.legendStatus && state.kingdomBuildings.length > 0){
    const income = calculateKingdomIncome();
    state.kingdomCoins += income;
    saveState(state);
    // Update if kingdom screen is visible
    const el = document.getElementById('kingdom-coins');
    if(el) el.textContent = state.kingdomCoins;
  }
}, 60000);

// Pokazi Ad Giants ekran
function showAdGiants(){
  showScreen('adgiants');
  renderAdGiants();
}

function renderAdGiants(){
  const container=document.getElementById('adgiants-list');
  if(!container) return;

  const networks=Monetization.adGiants.getAllNetworks();
  const totalECPM=Monetization.adGiants.getTotalECPM();

  container.innerHTML=networks.map((n,i)=>{
    const colors=['#FFD700','#4A90E2','#FF6B35','#9B59B6','#2ECC71','#E74C3C','#1ABC9C','#F39C12','#3498DB','#E67E22','#27AE60','#C0392B','#2980B9','#8E44AD','#16A085','#D35400','#2C3E50','#7F8C8D','#C0C0C0'];
    const c=colors[i%colors.length];
    return `
      <div class="bg-black/30 rounded-xl p-4 border border-white/10 flex items-center gap-4 hover:border-yellow-500/40 transition-all">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style="background:${c}20;color:${c}">${i+1}</div>
        <div class="flex-1">
          <p class="font-bold text-[#FFF8E7]">${n.name}</p>
          <p class="text-xs text-[#FFF8E7]/50">eCPM: $${n.ecpm.toFixed(2)}</p>
        </div>
        <div class="text-right">
          <span class="px-2 py-1 rounded-full text-xs font-bold" style="background:${c}20;color:${c}">$${n.ecpm.toFixed(2)}</span>
        </div>
      </div>`;
  }).join('');

  document.getElementById('adgiants-total').textContent='$'+totalECPM.toFixed(2);
  document.getElementById('adgiants-count').textContent=networks.length;
}

function renderRewards(){
  ['12','24','37'].forEach(l=>{
    const el=document.getElementById('reward-'+l);
    const badge=document.getElementById('badge-'+l);
    if(state.unlockedGifts.includes(l)){
      el.classList.add('unlocked');
      badge.textContent='✅ Отклучено';
      badge.className='inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full';
    } else {
      el.classList.remove('unlocked');
      badge.textContent='🔒 Заклучено';
      badge.className='inline-block mt-2 px-3 py-1 bg-gray-600/30 text-gray-400 text-xs rounded-full';
    }
  });
}

// ========== LEADERBOARD ==========
function renderLeaderboard(){
  const lb=getLeaderboard().slice(0,20);
  const el=document.getElementById('leaderboard-list');
  el.innerHTML='';
  if(lb.length===0){
    el.innerHTML='<p class="text-center text-[#FFF8E7]/40 py-8">Нема резултати уште. Играј за да бидеш прв!</p>';
    return;
  }
  lb.forEach((e,i)=>{
    const div=document.createElement('div');
    div.className=`flex items-center gap-4 p-3 rounded-xl ${i<3?'bg-yellow-500/10 border border-yellow-500/30':'bg-white/5 border border-white/5'}`;
    const compEmoji = e.companion ? (COMPANIONS[e.companion]?.emoji || '') : '';
    div.innerHTML=`<div class="w-8 text-center font-bold ${i===0?'text-yellow-400':i===1?'text-gray-300':i===2?'text-orange-400':'text-[#FFF8E7]/40'}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div><div class="flex-1"><p class="font-bold ${i<3?'text-yellow-400':'text-[#FFF8E7]'}">${e.name} ${compEmoji}</p><p class="text-xs text-[#FFF8E7]/40">Ниво ${e.level} - ${e.stars}★</p></div><div class="text-right"><p class="font-bold ${i<3?'text-yellow-400':'text-[#FFF8E7]'}">${e.score}</p></div>`;
    el.appendChild(div);
  });
}

// ========== AI AGENTS ==========
let currentAgent='kimi';

const AGENT_PROFILES={
  kimi:{name:'Кими',role:'Водич',desc:'🧭 Кими е твојот личен водич низ играта! Знае сè за нивоата, монетите и свитоците. Прашај го за совети и тој ќе те води до победа!',emoji:'🧭',color:'text-blue-400'},
  gpt:{name:'GPT',role:'Учител',desc:'🎓 GPT е најмудриот учител! Објаснува историски факти за Александар Македонски и древните култури. Секој свиток е нова лекција!',emoji:'🎓',color:'text-yellow-400'},
  claude:{name:'Клод',role:'Мајстор на Загатки',desc:'🧩 Клод е експерт за загатки! Ако си заглавен на некое ниво, тој ќе ти даде совет без да ти го расипе решението. Умен и стрплив!',emoji:'🧩',color:'text-purple-400'},
  harvey:{name:'Харви',role:'Мотиватор',desc:'⚡ Харви е твојот личен обожавател! Секоја победа ја слави со тебе, а кога ќе паднеш те крева на нозе. Никогаш не се откажува!',emoji:'⚡',color:'text-red-400'},
};

function selectAgent(key){
  currentAgent=key;
  ['kimi','gpt','claude','harvey'].forEach(k=>{
    const btn=document.getElementById('agent-btn-'+k);
    const profile=AGENT_PROFILES[k];
    if(k===key){
      btn.className=`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-all ${profile.color.replace('text-','border-').replace('400','500')} ${profile.color.replace('text-','bg-').replace('400','500')}/20 ${profile.color}`;
    } else {
      btn.className=`flex-1 py-2 rounded-lg border border-white/10 text-[#FFF8E7]/40 text-sm transition-all hover:border-white/20`;
    }
  });
  const p=AGENT_PROFILES[key];
  document.getElementById('agent-desc').innerHTML=`<strong class="${p.color}">${p.emoji} ${p.name} - ${p.role}</strong><br><span class="text-[#FFF8E7]/60">${p.desc}</span>`;
}

function sendAIMessage(){
  const input=document.getElementById('ai-input');
  const msg=input.value.trim();
  if(!msg)return;
  input.value='';

  // 👁️ Magic Tracking
  if(window.MagicTracking) MagicTracking.trackAIChat(currentAgent);

  const chat=document.getElementById('ai-chat-area');
  chat.innerHTML+=`<div class="ai-bubble user">${msg}</div>`;
  chat.scrollTop=chat.scrollHeight;

  // Simulated responses
  const agent=AGENT_PROFILES[currentAgent];
  let resp='';
  const m=msg.toLowerCase();
  if(currentAgent==='kimi'){
    if(m.includes('hint')||m.includes('помош')||m.includes('совет')) resp='Кими: 🌟 Погледни околу себе! Секој детал е важен. Ако си заглавен, пробај да скокнеш повисоко или да побараш алтернативен пат!';
    else if(m.includes('монет')) resp='Кими: 💰 Монетите се скриени на платформите и во воздухот! Собери ги сите за повеќе поени и ѕвезди!';
    else resp=`Кими: ✨ Одлична работа, херој! Продолжи напред. Секое ниво те носи поблиску до мудроста! Ти си на ниво ${state.currentLevel}.`;
  } else if(currentAgent==='gpt'){
    if(m.includes('историј')||m.includes('александар')) resp='GPT: 📚 Дали знаеше? Александар Велики ги зачувал персиската култура и јазик на својот двор? Тоа е пример за како знаењето ги поврзува луѓето!';
    else resp='GPT: 🎓 Светот е книга, а оние кои патуваат читаат повеќе страници. Продолжи да учиш низ секое ниво!';
  } else if(currentAgent==='claude'){
    if(m.includes('тешко')||m.includes('загатка')||m.includes('помогни')) resp='Клод: 🧩 Размисли чекор по чекор. Секоја загатка има решение. Обиди се да ги поврзеш точките поинаку - понекогаш најлесниот пат не е најдобриот!';
    else resp='Клод: 💡 Твојот ум е остар како македонскиот бронзен меч! Продолжи да ги решаваш предизвиците со мудрост и трпение!';
  } else {
    if(m.includes('победа')||m.includes('освој')) resp='Харви: 🎉🎉🎉 YEAH! Ти си НЕВЕРОЈАТЕН! Секое освоено ниво е победа! Собери ја круната на мудроста!';
    else resp='Харви: 💪 Не се откажувај! Секој шампион почнал како почетник! Ти можеш да ги освоиш сите 37 нивоа! Верувам во тебе!';
  }

  setTimeout(()=>{
    chat.innerHTML+=`<div class="ai-bubble agent"><strong class="${agent.color}">${agent.emoji} ${agent.name}</strong><br>${resp}</div>`;
    chat.scrollTop=chat.scrollHeight;
  },600);
}

// ========== SETTINGS ==========
function toggleSetting(key){
  state[key]=!state[key];
  saveState(state);
  updateToggle(key,state[key]);
}
function updateToggle(key,val){
  const el=document.getElementById('toggle-'+key);
  el.className=`w-12 h-6 rounded-full relative transition-all ${val?'bg-yellow-500':'bg-gray-600'}`;
  el.innerHTML=`<div class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${val?'right-1':'left-1'}"></div>`;
}
function setLang(l){
  // Public clean build: Macedonian is the default interface.
  state.lang = 'mk';
  saveState(state);
  const mk = document.getElementById('lang-mk');
  const en = document.getElementById('lang-en');
  if (mk) mk.className = 'flex-1 py-2 rounded-lg border-2 border-yellow-500 bg-yellow-500/10 text-yellow-400 text-sm font-medium';
  if (en) en.className = 'flex-1 py-2 rounded-lg border-2 border-white/10 text-[#FFF8E7]/50 text-sm font-medium hover:border-yellow-600/40';
}
function resetProgress(){
  if(!confirm('Дали си сигурен? Целиот прогрес ќе биде избришан!'))return;
  state={playerName:'Гостин',currentLevel:1,completedLevels:[],levelStars:{},totalCoins:0,collectedFacts:[],unlockedGifts:[],totalScore:0,sound:true,music:true,lang:'mk',bonusStreak:0,bonusDate:null,premium:false,premiumFree:false,premiumExpiry:null,earlyAccess:false,legendStatus:false,legendDate:null,legendSeason:null,legendTrophies:[],unlockedCompanions:[],activeCompanion:null,companionXP:{},kingdomBuildings:[],kingdomCoins:0,kingdomLevel:1};
  saveState(state);
  localStorage.removeItem(LEADER_KEY);
  alert('Прогресот е ресетиран!');
  showScreen('menu');
}

// ========== DAILY BONUS ==========
function showDailyBonus(){
  const today=new Date().toISOString().split('T')[0];
  let amount=50;
  if(state.bonusDate===today){
    // Already claimed today
    document.getElementById('bonus-amount').textContent='0';
  } else {
    // New day
    if(state.bonusDate){
      const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
      if(state.bonusDate===yesterday.toISOString().split('T')[0]) state.bonusStreak++;
      else state.bonusStreak=1;
    } else state.bonusStreak=1;
    state.bonusDate=today;
    amount=50+state.bonusStreak*10;
    saveState(state);
  }
  document.getElementById('bonus-streak').textContent=state.bonusStreak;
  document.getElementById('bonus-amount').textContent=amount;
  document.getElementById('modal-bonus').classList.remove('hidden');
}
function claimBonus(){
  const amount=parseInt(document.getElementById('bonus-amount').textContent);
  state.totalCoins+=amount;saveState(state);
  closeModal('modal-bonus');
  updateMenu();
}

// ========== SHOP / PAYMENTS ==========
let pendingProduct=null,pendingPrice=0;
function buyProduct(product,priceCents){
  // 👁️ Magic Tracking
  if(window.MagicTracking) MagicTracking.trackShopVisit(product);
  const names={premium:'Премиум Пакет',coins:'500 Монети',lives:'Беспределни Животи',season:'Сезонска Картичка'};
  const prices={premium:0.99,coins:0.49,lives:0.29,season:1.99};
  pendingProduct=product;
  pendingPrice=priceCents;
  document.getElementById('payment-product').textContent=names[product];
  document.getElementById('payment-price').textContent='$'+prices[product].toFixed(2);
  document.getElementById('modal-payment').classList.remove('hidden');
}

function processStripePayment(){
  closeModal('modal-payment');
  // Demo Stripe flow
  const msg=pendingProduct==='premium'?'🎉 Премиум е активиран!'
    :pendingProduct==='coins'?'🪙 500 монети додадени!'
    :pendingProduct==='lives'?'❤️ Беспределни животи за 24ч!'
    :'🎫 Сезонска картичка активирана!';
  alert(msg + '\n\n(Демо режим - за реално плаќање потребен е Stripe акаунт за aleksandarmakedonskigame@gmail.com)');
  if(pendingProduct==='coins'){state.totalCoins+=500;saveState(state);updateMenu();}
  if(pendingProduct==='premium'){
    state.premium=true;
    saveState(state);
    updateMenu();
    alert('👑 Премиум е активиран! Сега се отклучени нивоата 9–37.');
    showScreen('levels');
  }
}

function processPayPalPayment(){
  closeModal('modal-payment');
  const msg=pendingProduct==='premium'?'🎉 Премиум е активиран преку PayPal!'
    :pendingProduct==='coins'?'🪙 500 монети додадени преку PayPal!'
    :pendingProduct==='lives'?'❤️ Беспределни животи преку PayPal!'
    :'🎫 Сезонска картичка преку PayPal!';
  alert(msg + '\n\n(Демо режим - за реално плаќање потребен е PayPal акаунт за aleksandarmakedonskigame@gmail.com)');
  if(pendingProduct==='coins'){state.totalCoins+=500;saveState(state);updateMenu();}
  if(pendingProduct==='premium'){
    state.premium=true;
    saveState(state);
    updateMenu();
    alert('👑 Премиум е активиран! Сега се отклучени нивоата 9–37.');
    showScreen('levels');
  }
}

// ========== SOCIAL SHARE ==========
function shareSocial(platform){
  // 👁️ Magic Tracking
  if(window.MagicTracking) MagicTracking.trackSocialShare(platform);
  const url=encodeURIComponent(window.location.href);
  const text=encodeURIComponent('Мисија на Александар - Патот на Светлината! 37 нивоа, 4 AI агенти, најевтина игра на светот! 🇲🇰👑');
  const urls={
    facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp:`https://wa.me/?text=${text}%20${url}`,
    twitter:`https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    telegram:`https://t.me/share/url?url=${url}&text=${text}`,
    viber:`viber://forward?text=${text}%20${url}`,
    messenger:`https://www.messenger.com/t/?link=${url}`,
    instagram:`https://www.instagram.com/`,
    tiktok:`https://www.tiktok.com/upload?ref=${url}`,
    youtube:`https://www.youtube.com/share?url=${url}`,
    discord:`https://discord.com/channels/@me`,
    snapchat:`https://www.snapchat.com/share?url=${url}`,
    linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    reddit:`https://www.reddit.com/submit?url=${url}&title=${text}`,
    pinterest:`https://pinterest.com/pin/create/button/?url=${url}&description=${text}`,
    vk:`https://vk.com/share.php?url=${url}&title=${text}`,
    line:`https://social-plugins.line.me/lineit/share?url=${url}`,
    wechat:`weixin://dl/share?text=${text}%20${url}`,
    email:`mailto:?subject=Мисија на Александар&body=${text}%20${url}`,
    // +15 Novi Socialni Mrezi
    tumblr:`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${text}`,
    skype:`https://web.skype.com/share?url=${url}&text=${text}`,
    teams:`https://teams.microsoft.com/share?href=${url}&msgText=${text}`,
    threads:`https://threads.net/intent/post?text=${text}%20${url}`,
    bluesky:`https://bsky.app/intent/compose?text=${text}%20${url}`,
    mastodon:`https://mastodon.social/share?text=${text}%20${url}`,
    weibo:`http://service.weibo.com/share/share.php?url=${url}&title=${text}`,
    qq:`http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${text}`,
    kakao:`https://sharer.kakao.com/talk?text=${text}%20${url}`,
    zalo:`https://chat.zalo.me/share?text=${text}%20${url}`,
    odnoklassniki:`https://connect.ok.ru/offer?url=${url}&title=${text}`,
    mailru:`https://connect.mail.ru/share?url=${url}&title=${text}`,
    xing:`https://www.xing.com/app/user?op=share&url=${url}`,
    douban:`https://www.douban.com/share/service?name=${text}&href=${url}`,
    qzone:`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${text}`,
  };
  if(urls[platform]) window.open(urls[platform],'_blank');
}

function shareTo(platform){
  shareSocial(platform);
}

function copyShareLink(){
  const text='Мисија на Александар - Патот на Светлината! 37 нивоа, 4 AI агенти, најевтина на светот! 👑\n'+window.location.href;
  navigator.clipboard.writeText(text).then(()=>{
    const btn=document.getElementById('copy-btn');
    btn.innerHTML='✅ Копирано!';
    setTimeout(()=>btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link w-3 h-3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Копирај линк',2000);
  });
}

function copyLink(){
  copyShareLink();
}

// ========== MODAL HELPERS ==========
function closeModal(id){document.getElementById(id).classList.add('hidden');}

// ========== PASSIVE INCOME SCREEN ==========
function renderIncomeScreen(){
  // Load stats
  const transactions=JSON.parse(localStorage.getItem('aq_transactions')||'[]');
  const adViews=parseInt(localStorage.getItem('aq_ad_views')||'0');
  const adClicks=parseInt(localStorage.getItem('aq_ad_clicks')||'0');
  const totalRev=transactions.reduce((s,t)=>s+(t.amount||0),0);
  const referrals=JSON.parse(localStorage.getItem('aq_referrals')||'[]');

  // Stats grid
  const stats=document.getElementById('income-stats');
  if(stats){
    stats.innerHTML=`
      <div class="bg-black/30 rounded-xl p-3 text-center border border-yellow-600/20">
        <p class="text-2xl font-bold text-yellow-400">$${(totalRev/100).toFixed(2)}</p>
        <p class="text-xs text-[#FFF8E7]/50">Вкупно</p>
      </div>
      <div class="bg-black/30 rounded-xl p-3 text-center border border-green-600/20">
        <p class="text-2xl font-bold text-green-400">${adViews}</p>
        <p class="text-xs text-[#FFF8E7]/50">Ad Views</p>
      </div>
      <div class="bg-black/30 rounded-xl p-3 text-center border border-blue-600/20">
        <p class="text-2xl font-bold text-blue-400">${transactions.length}</p>
        <p class="text-xs text-[#FFF8E7]/50">Купувања</p>
      </div>
      <div class="bg-black/30 rounded-xl p-3 text-center border border-purple-600/20">
        <p class="text-2xl font-bold text-purple-400">${referrals.length}</p>
        <p class="text-xs text-[#FFF8E7]/50">Реферали</p>
      </div>`;
  }

  // Update detail stats
  const sv=document.getElementById('stat-ad-views');
  if(sv)sv.textContent=adViews;
  const sc=document.getElementById('stat-ad-clicks');
  if(sc)sc.textContent=adClicks;
  const sr=document.getElementById('stat-ad-revenue');
  if(sr)sr.textContent='$'+((adClicks*0.5+adViews*0.001)/100).toFixed(2);

  // Referral link
  const refInput=document.getElementById('ref-link');
  if(refInput)refInput.value=window.location.origin+'?ref='+(state.playerName||'guest');

  // Projections based on active players
  const activePlayers=Math.max(1,transactions.length);
  const daily=0.5*activePlayers;
  document.getElementById('proj-daily').textContent='$'+daily.toFixed(2);
  document.getElementById('proj-weekly').textContent='$'+(daily*7).toFixed(2);
  document.getElementById('proj-monthly').textContent='$'+(daily*30).toFixed(2);
  document.getElementById('proj-yearly').textContent='$'+(daily*365).toFixed(2);

  if (window.lucide?.createIcons) lucide.createIcons();
}

function copyRefLink(){
  const el=document.getElementById('ref-link');
  if(el){
    navigator.clipboard.writeText(el.value).then(()=>{
      alert('📋 Реферален линк копиран! Сподели со пријатели и заработи 50 монети по пријател!');
    });
  }
}

function donate(amount){
  alert(`☕ Благодариме за $${amount} донација!\n\nОва ја поддржува развојот на играта.\nСите приходи одат на: aleksandarmakedonskigame@gmail.com\n\nЗа реално плаќање потребен е Stripe/PayPal акаунт.`);
}

// ========== INIT ==========
window.onload=function(){
  updateMenu();
  updateToggle('sound',state.sound);
  updateToggle('music',state.music);
  setLang(state.lang);
  selectAgent('kimi');
  if (window.lucide?.createIcons) lucide.createIcons();

  // Check referral
  const params=new URLSearchParams(window.location.search);
  const ref=params.get('ref');
  if(ref){
    const refs=JSON.parse(localStorage.getItem('aq_referrals')||'[]');
    if(!refs.includes(ref)){
      refs.push(ref);
      localStorage.setItem('aq_referrals',JSON.stringify(refs));
      state.totalCoins+=50;
      saveState(state);
      alert(`🎉 Добредојде! Доби 50 монети бонус од ${ref}!`);
    }
  }
};

window.AQ_GAME_BUILD_VERSION='1.8.2';
console.log('[AQ Game] v1.8.2 Level 4 Light Fix loaded');
// ==================================================
// WPA МУЛТИПЛЕЈЕР – ДЕЦА ЗАЕДНО ИГРААТ
// ==================================================
const WPA_Multiplayer = {
  roomId: null,
  players: [],
  myId: Math.random().toString(36).substring(2, 8),
  
  createRoom() {
    this.roomId = 'room_' + Date.now();
    localStorage.setItem('wpa_room', this.roomId);
    this.players = [{ id: this.myId, level: 1, score: 0 }];
    this.saveRoom();
    alert(`🎮 Соба креирана! ID: ${this.roomId}\nСподели го ID-то со пријател.`);
    return this.roomId;
  },
  
  joinRoom(roomId) {
    this.roomId = roomId;
    this.loadRoom();
    alert(`🎮 Се приклучи во соба ${roomId}`);
  },
  
  saveRoom() {
    localStorage.setItem(`wpa_room_${this.roomId}`, JSON.stringify(this.players));
  },
  
  loadRoom() {
    const saved = localStorage.getItem(`wpa_room_${this.roomId}`);
    if (saved) this.players = JSON.parse(saved);
  },
  
  getLeaderboard() {
    return [...this.players].sort((a,b) => b.score - a.score);
  },
  
  updateScore(level, score) {
    const player = this.players.find(p => p.id === this.myId);
    if (player) {
      player.level = level;
      player.score = score;
      this.saveRoom();
    }
  }
};

// Додај копче за мултиплејер во менито
function showMultiplayer() {
  const action = confirm('🎮 Креирај нова соба (OK) или приклучи се (Cancel)?');
  if (action) {
    WPA_Multiplayer.createRoom();
  } else {
    const roomId = prompt('Внеси ID на соба:');
    if (roomId) WPA_Multiplayer.joinRoom(roomId);
  }
}
