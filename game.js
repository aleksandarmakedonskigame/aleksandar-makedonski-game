// ============================================================
// ALEXANDER'S QUEST - THE PATH OF LIGHT — v2.3.1
// 37 Levels, historical advisors, honest premium unlock (access code)
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
    { name: 'Птолемеј', power: 'Знаење', bonus: 'сите свитоци отклучени', unlocked: false },
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
// PUBLIC PLAYTEST: all 37 levels are free through sequential progression; paid edition is not active.
// Ова е фер модел: децата и родителите можат да пробаат, а проектот добива поддршка за развој.
const FREE_LEVEL_LIMIT = (window.GAME_EDITION && window.GAME_EDITION.fullUnlock) ? 37 : 8; // web: нивоа 1-8 бесплатни, 9-37 со код; itch/GameMonetize: целосно отклучено
const PREMIUM_PRICE_USD = '0.99';

function hasPremiumAccess() {
  return Boolean(state?.premium || state?.premiumFree || state?.earlyAccess || state?.legendStatus || (window.GAME_EDITION && window.GAME_EDITION.fullUnlock));
}

function isPremiumLevel(level) {
  return Number(level) > FREE_LEVEL_LIMIT;
}

function showPremiumRequired(level) {
  showScreen('shop');
  if (window.PWA && PWA.showToast) {
    PWA.showToast('👑 Ниво ' + level + ' е дел од Премиум патеката. Прашај родител.', 4200);
  }
}

// v2.0: место за секое ниво (се прикажува во воведната картичка)
const LEVEL_PLACES = ['Пела','Пела','Пела','Миеза','Миеза','Пела','Гордион','Граник','Ис','Тир','Египет','Александрија','Сива','Гавгамела','Вавилон','Персепол','Персепол','Бактрија','Хинду Куш','Бактрија','Хидасп','Букефала','Хифасис','Инд','Гедросија','Суза','Суза','Патот на војската','Средоземјето','Исток и Запад','Александрија','Фарос','Коринт','Македонија','Вавилон','Вавилон','Светот'];

const FACTS = [
  {id:1, title:'Роден во Пела', text:'Александар е роден во 356 г. п.н.е. во Пела, престолнината на античка Македонија.'},
  {id:2, title:'Семејството', text:'Татко му бил кралот Филип II, а мајка му Олимпијада, принцеза од Епир.'},
  {id:3, title:'Букефал', text:'Како момче го скротил дивиот коњ Букефал: забележал дека коњот се плаши од својата сенка и го свртел кон сонцето.'},
  {id:4, title:'Учителот Аристотел', text:'Од околу 13-годишна возраст Александар учел кај филозофот Аристотел во Миеза.'},
  {id:5, title:'Книгата под перницата', text:'Според Плутарх, Александар ја носел „Илијада“ од Хомер насекаде и ја чувал под перницата.'},
  {id:6, title:'Крал на 20 години', text:'Станал крал во 336 г. п.н.е., кога имал само 20 години.'},
  {id:7, title:'Гордиевиот јазол', text:'Во Гордион, според легендата, го пресекол Гордиевиот јазол — симбол за решавање тежок проблем на нов начин.'},
  {id:8, title:'Реката Граник', text:'Првата голема битка од походот кон Азија била кај реката Граник, во 334 г. п.н.е.'},
  {id:9, title:'Битката кај Ис', text:'Во 333 г. п.н.е. кај Ис ја победил војската на персискиот крал Дариј III.'},
  {id:10, title:'Опсадата на Тир', text:'Островскиот град Тир го освоил по седуммесечна опсада, откако изградил насип од копното до островот.'},
  {id:11, title:'Фараон во Египет', text:'Во Египет, кој бил под персиска власт, Александар бил примен и прогласен за фараон.'},
  {id:12, title:'Основање на Александрија', text:'Во 331 г. п.н.е. ја основал Александрија во Египет, која подоцна станала еден од најважните градови на антиката.'},
  {id:13, title:'Оракулот во Сива', text:'Патувал низ пустината до оракулот на богот Амон во оазата Сива.'},
  {id:14, title:'Гавгамела', text:'Во 331 г. п.н.е. кај Гавгамела ја поразил големата персиска војска на Дариј III.'},
  {id:15, title:'Вавилон', text:'Древниот град Вавилон му ги отворил портите без борба.'},
  {id:16, title:'Персепол', text:'Стигнал до Персепол, свечениот главен град на Персиското Царство.'},
  {id:17, title:'Нови обичаи', text:'Прифатил некои персиски обичаи и облека, за да ги поврзе Македонците и Персијците.'},
  {id:18, title:'Градови со негово име', text:'Основал многу градови, а повеќе од нив го носеле името Александрија.'},
  {id:19, title:'Хинду Куш', text:'Неговата војска ги преминала високите и студени планини Хинду Куш.'},
  {id:20, title:'Роксана', text:'Во 327 г. п.н.е. се оженил со Роксана, ќерка на благородник од Бактрија.'},
  {id:21, title:'Реката Хидасп', text:'Во 326 г. п.н.е. кај реката Хидасп во Индија се борел против кралот Пор, кој имал воени слонови. По битката, Пор останал да владее.'},
  {id:22, title:'Градот Букефала', text:'Кога верниот Букефал угинал, Александар во негова чест го основал градот Букефала.'},
  {id:23, title:'Реката Хифасис', text:'Кај реката Хифасис уморните војници побарале да се вратат дома по осум години поход — и Александар ги послушал.'},
  {id:24, title:'Флотата на Неарх', text:'Неговиот пријател Неарх водел флота од реката Инд до Персискиот Залив и истражувал непознати брегови.'},
  {id:25, title:'Гедросиската пустина', text:'Враќањето низ Гедросиската пустина било едно од најтешките патувања на војската.'},
  {id:26, title:'Свадбите во Суза', text:'Во 324 г. п.н.е. во Суза приредил големи свадби меѓу македонски војници и персиски невести.'},
  {id:27, title:'Хефестион', text:'Хефестион бил најблискиот пријател на Александар уште од детството.'},
  {id:28, title:'Мерачи на чекори', text:'Со војската патувале мерачи (биматисти) кои ги броеле чекорите за да ги измерат растојанијата.'},
  {id:29, title:'Заеднички јазик', text:'По неговите походи, грчкиот јазик коине станал заеднички јазик за трговија и учење на огромен простор.'},
  {id:30, title:'Хеленистичкиот свет', text:'Времето по Александар се вика хеленистички период — тогаш културите на Истокот и Западот силно се мешале.'},
  {id:31, title:'Александриската библиотека', text:'Големата библиотека во Александрија ја изградиле Птолемеите по неговата смрт, во градот што тој го основал.'},
  {id:32, title:'Светилникот Фарос', text:'Светилникот Фарос во Александрија, изграден по смртта на Александар, станал едно од седумте чуда на античкиот свет.'},
  {id:33, title:'Средба со Диоген', text:'Според преданието, кога Александар го прашал филозофот Диоген што сака, тој одговорил: „Тргни се малку, ми го закриваш сонцето.“'},
  {id:34, title:'Голем војсководец', text:'Според античките историчари, Александар не изгубил ниту една голема битка.'},
  {id:35, title:'Вавилон, 323 г. п.н.е.', text:'Александар починал во Вавилон во 323 г. п.н.е., на само 32 години.'},
  {id:36, title:'Дијадосите', text:'По неговата смрт, царството го поделиле неговите генерали, наречени дијадоси (наследници).'},
  {id:37, title:'Вечната приказна', text:'Приказната за Александар се раскажува повеќе од 2.300 години, на многу јазици, во книги, песни и уметност.'},
];

// ========== SAVE / LOAD ==========
function getState() {
  const defaults = defaultState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') return Object.assign(defaults, saved);
    }
  } catch(e) {}
  return defaults;
}

function defaultState() {
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
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { console.warn('[AQ] save failed', e); }
}

let state = getState();

// v1.9: единствен извор на прогресот. Сите додатоци (v13–v18, pwa.js)
// читаат и пишуваат преку AQStore, за да не се бришат меѓусебно промените.
window.AQStore = {
  read() { return state; },
  write(s) { if (s && s !== state) Object.assign(state, s); saveState(state); }
};

function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem(LEADER_KEY) || '[]'); } catch(e) { return []; }
}
function saveLeaderboard(lb) { localStorage.setItem(LEADER_KEY, JSON.stringify(lb)); }

// ========== SCREEN MANAGEMENT ==========
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  if(name !== 'game' && window.WPALiving) WPALiving.setGameActive(false);
  if (name === 'levels') renderLevelSelect();
  if (name === 'museum') renderMuseum();
  if (name === 'rewards') renderRewards();
  if (name === 'leaderboard') renderLeaderboard();
  if (name === 'shop' && typeof refreshPremiumUI === 'function') refreshPremiumUI();
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
  if(window.WPALiving){ WPALiving.setLevel(level); WPALiving.setGameActive(true); }
  window.__AQ_SELECTED_LEVEL = state.currentLevel;
  saveState(state);
  updateMenu();

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
    // v1.9: нацртан лик на Александар (шлем со перјаница, наметка, оклоп)
    // наместо сината правоаголна кутија. 4 рамки: стои, трча×2, скок.
    const drawHero = (key, frame) => {
      const g = this.make.graphics({x:0,y:0,add:false});
      const px = (x,y,w,h,c)=>{ g.fillStyle(c,1); g.fillRect(x,y,w,h); };
      const SKIN=0xF1C27D, BRONZE=0xC9A227, BRONZE_D=0x8C6D12, RED=0xB3261E, RED_D=0x7F1712,
            BLUE=0x2B4C9B, GOLD=0xFFD54A, BROWN=0x6B3E1E, DARK=0x1A1525;
      // наметка (позади телото)
      const capeSwing = frame==='run1'?1:frame==='run2'?-1:frame==='jump'?2:0;
      px(3-capeSwing,12,6,15,RED_D); px(4-capeSwing,12,5,14,RED);
      // перјаница
      px(8,0,9,2,RED); px(7,1,2,3,RED); px(15,1,3,3,RED_D);
      // шлем
      px(7,3,11,4,BRONZE); px(7,7,3,6,BRONZE); px(16,6,2,2,BRONZE_D);
      // лице
      px(10,7,7,6,SKIN); px(14,8,2,2,DARK); px(16,11,1,1,0xD9A066);
      // врат
      px(11,13,4,1,SKIN);
      // оклоп
      px(8,14,10,8,BRONZE); px(9,15,8,1,GOLD); px(9,18,8,1,BRONZE_D); px(12,16,2,2,GOLD);
      // рака напред
      const armY = frame==='jump'?12:15;
      px(18,armY,3,6,SKIN); px(18,armY,3,2,BRONZE_D);
      // поличка (хитон)
      px(8,22,10,4,BLUE); px(8,25,10,1,GOLD);
      // нозе
      if(frame==='run1'){ px(9,26,3,6,SKIN); px(15,26,3,5,SKIN); px(8,32,4,3,BROWN); px(15,31,4,3,BROWN); }
      else if(frame==='run2'){ px(10,26,3,5,SKIN); px(13,26,3,6,SKIN); px(9,31,4,3,BROWN); px(13,32,4,3,BROWN); }
      else if(frame==='jump'){ px(9,26,3,4,SKIN); px(14,26,3,5,SKIN); px(8,30,4,3,BROWN); px(15,31,4,3,BROWN); }
      else { px(10,26,3,7,SKIN); px(14,26,3,7,SKIN); px(9,33,4,3,BROWN); px(14,33,4,3,BROWN); }
      g.generateTexture(key,24,36);
      g.destroy();
    };
    drawHero('player','stand');
    drawHero('player_run1','run1');
    drawHero('player_run2','run2');
    drawHero('player_jump','jump');

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

    // Legible scroll artwork: the previous 12x16 icon was almost invisible on phones.
    const sg=this.make.graphics({x:0,y:0,add:false});
    sg.fillStyle(0x2A1C0A,0.85);sg.fillRoundedRect(1,2,30,38,6);
    sg.fillStyle(0xF8E4AB,1);sg.fillRoundedRect(5,4,22,32,3);
    sg.fillStyle(0xBE8B34,1);sg.fillRoundedRect(2,3,28,6,3);sg.fillRoundedRect(2,32,28,6,3);
    sg.lineStyle(2,0x8B641D,0.9);sg.lineBetween(9,14,23,14);sg.lineBetween(9,20,23,20);sg.lineBetween(9,26,20,26);
    sg.fillStyle(0xBC2039,1);sg.fillCircle(16,32,3);
    sg.generateTexture('scroll',32,40);sg.destroy();

    const cpg=this.make.graphics({x:0,y:0,add:false});
    cpg.fillStyle(0xFF6B35,1);cpg.fillCircle(8,8,7);
    cpg.fillStyle(0xFFD700,1);cpg.fillCircle(8,8,3);
    cpg.generateTexture('cp',16,16);

    // v2.0: порта на целта (два столба, лак, знаме) наместо жолта кутија
    const eg=this.make.graphics({x:0,y:0,add:false});
    eg.fillStyle(0xBFA66A,1); eg.fillRect(6,30,14,80); eg.fillRect(60,30,14,80);
    eg.fillStyle(0xD9C27A,1); eg.fillRect(2,104,22,6); eg.fillRect(56,104,22,6); eg.fillRect(2,26,22,6); eg.fillRect(56,26,22,6);
    eg.fillStyle(0xFFD700,1); eg.fillRect(0,18,80,10);
    eg.fillTriangle(0,18,40,0,80,18);
    eg.fillStyle(0xB8860B,1); eg.fillCircle(40,11,4);
    eg.fillStyle(0xFFF2B0,0.35); eg.fillRect(20,32,40,78);
    eg.generateTexture('end',80,110);

    const flg=this.make.graphics({x:0,y:0,add:false});
    flg.fillStyle(0x8B5A2B,1); flg.fillRect(0,0,3,40);
    flg.fillStyle(0xC8102E,1); flg.fillTriangle(3,2,30,10,3,18);
    flg.fillStyle(0xFFD700,1); flg.fillCircle(11,10,3);
    flg.generateTexture('goal_flag',32,40);

    const dust=this.make.graphics({x:0,y:0,add:false});
    dust.fillStyle(0xE8DCC0,1); dust.fillCircle(4,4,4);
    dust.generateTexture('dust',8,8);

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

    // Build level — v2.0: секое ниво е секогаш исто (фиксно „семе“),
    // за детето да може да го научи и да го надмине.
    const _rnd=Math.random;
    let _seed=(this.lvl*7919+104729)>>>0;
    Math.random=()=>{ _seed=(Math.imul(_seed,1664525)+1013904223)>>>0; return _seed/4294967296; };
    try {
      this.buildLevel(this.lvl);
      this.decorateDynamicWorld(this.lvl);
      if(window.WPALiving) WPALiving.decoratePhaser(this,this.lvl);
      this.addDynamicGameplay(this.lvl);
    } finally { Math.random=_rnd; }
    this.addGoalAndIntro(this.lvl);

    // Player
    this.player=this.physics.add.sprite(80,350,'player');
    this.player.setBounce(0.1).setCollideWorldBounds(false).setGravityY(800);
    this.player.setDepth(20);
    this.depthShadow=this.add.ellipse(80,447,44,8,0x121D2B,0.29).setDepth(1);
    this.respawnX=80;
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
        const mp=this.platforms.create(x+60,y-60,tex).refreshBody();
        this.tweens.add({targets:mp,y:y-110,duration:2000+l*100,yoyo:true,repeat:-1,ease:'Sine.InOut',onUpdate:()=>mp.refreshBody()});
      }
    }

    // Core gameplay: six guaranteed, visible and physically reachable scrolls.
    // On the original build, the ONLY scroll was at x=580/y=270 (level 1),
    // ~164px above the standing hero; players routinely finished with zero scrolls.
    // Keep one elevated optional bonus scroll for skilled players, but make the
    // history-learning objective discoverable and achievable for children.
    const safeScrollPositions=[250,760,1220,1700,2220,2660];
    safeScrollPositions.forEach((x,i)=>{
      const y=groundY-42-(i%2)*6;
      const scroll=this.scrollGroup.create(x,y,'scroll').setDepth(16);
      scroll.setData('groundScroll',true);
      const hint=this.add.text(x,y-45,'📜',{
        fontFamily:'Arial, sans-serif',fontSize:'26px',color:'#FFF4CE',
        stroke:'#17102E',strokeThickness:3
      }).setOrigin(0.5).setDepth(17);
      scroll.setData('hint',hint);
      this.tweens.add({targets:scroll,alpha:0.78,duration:850,yoyo:true,repeat:-1});
      this.tweens.add({targets:hint,y:y-49,duration:900,yoyo:true,repeat:-1});
    });
    const bonus=this.scrollGroup.create(500+(l*80)%2000,300-(l%3)*30,'scroll').setDepth(12);
    bonus.setData('bonusScroll',true);
    this.tweens.add({targets:bonus,alpha:0.65,duration:800,yoyo:true,repeat:-1});

    // Checkpoints
    this.cpGroup.create(500,groundY-30,'cp');
    if(l>6) this.cpGroup.create(1400,groundY-30,'cp');
    if(l>15) this.cpGroup.create(2200,groundY-30,'cp');

    // Endpoint
    this.endpoint=this.physics.add.sprite(W-150,groundY-8-55,'end');
    this.endpoint.setDepth(5);
    this.endpoint.body.setSize(30,100).setOffset(25,10);
    this.endpoint.setImmovable(true);
    this.endpoint.body.allowGravity=false;

    // Pits (missing ground segments)
    if(l>3) {
      const pitCount=Math.min(Math.floor(l/3),5);
      for(let i=0;i<pitCount;i++){
        let px=650+i*420+(l*50)%260;
        if(Math.abs(px-1400)<90||Math.abs(px-2200)<90) px+=140;
        // Remove ground platforms at pit positions.
        // v1.9 FIX: порано се бришеше за време на iterate() → TypeError и празна
        // (темна) сцена од ниво 4 до 37. Сега прво се собираат, па се бришат.
        const toRemove=this.platforms.getChildren().filter(child=>child&&child.y>=groundY-1&&Math.abs(child.x-px)<32);
        toRemove.forEach(child=>this.platforms.remove(child,true,true));
      }
    }
  }

  // ========== v2.0: ЦЕЛ, ВОВЕД, НАПРЕДОК ==========
  addGoalAndIntro(l){
    const gx=this.endpoint.x, gy=this.endpoint.y;
    const glow=this.add.circle(gx,gy,90,0xFFD700,0.14).setDepth(4);
    this.tweens.add({targets:glow,scale:1.25,alpha:0.05,duration:1100,yoyo:true,repeat:-1});
    const flag=this.add.image(gx+48,gy-70,'goal_flag').setOrigin(0,1).setDepth(6);
    this.tweens.add({targets:flag,scaleX:0.82,duration:420,yoyo:true,repeat:-1,ease:'Sine.InOut'});
    this.add.text(gx,gy-82,(window.I18N&&I18N.lang()==='en'?'FINISH':'🏁 ЦЕЛ'),{fontSize:'18px',color:'#FFD700',fontFamily:'Inter',fontStyle:'bold',stroke:'#0F0C18',strokeThickness:4}).setOrigin(0.5).setDepth(6);
    // насочувачки стрелки на земјата на секои 600px
    for(let x=700;x<gx-200;x+=600){
      const a=this.add.text(x,395,'➜',{fontSize:'26px',color:'#FFD700'}).setAlpha(0.5).setDepth(3);
      this.tweens.add({targets:a,x:x+14,alpha:0.85,duration:700,yoyo:true,repeat:-1});
    }
    // воведна картичка
    const place=(window.I18N&&I18N.lang()==='en')?['Pella','Pella','Pella','Mieza','Mieza','Pella','Gordium','Granicus','Issus','Tyre','Egypt','Alexandria','Siwa','Gaugamela','Babylon','Persepolis','Persepolis','Bactria','Hindu Kush','Bactria','Hydaspes','Bucephala','Hyphasis','Indus','Gedrosia','Susa','Susa','Army route','Mediterranean','East and West','Alexandria','Pharos','Corinth','Macedonia','Babylon','Babylon','The world'][l-1]:((typeof LEVEL_PLACES!=='undefined'&&LEVEL_PLACES[l-1])||'');
    const fact=(window.I18N&&I18N.fact&&I18N.fact((l-1)%FACTS.length))||FACTS[(l-1)%FACTS.length];
    const cam=this.cameras.main;
    const card=this.add.container(cam.width/2,cam.height/2-40).setScrollFactor(0).setDepth(100);
    const bg=this.add.rectangle(0,0,440,120,l<=4?0x19354B:0x0F0C18,0.90).setStrokeStyle(2,0xFFD700,0.85);
    const t1=this.add.text(0,-30,(window.I18N&&I18N.lang()==='en'?'Level ':'Ниво ')+l+(place?' · '+place:''),{fontSize:'28px',color:'#FFD700',fontFamily:'Forum, serif'}).setOrigin(0.5);
    const t2=this.add.text(0,12,fact?('📜 '+fact.title):'',{fontSize:'16px',color:'#FFF8E7',fontFamily:'Inter'}).setOrigin(0.5);
    const t3=this.add.text(0,40,(window.I18N&&I18N.lang()==='en'?'Collect 📜 scrolls and reach the finish gate':'Собирај 📜 свитоци и стигни до 🏁'),{fontSize:'13px',color:'#c9c2b0',fontFamily:'Inter'}).setOrigin(0.5);
    card.add([bg,t1,t2,t3]); card.setScale(0.7); card.setAlpha(0);
    this.tweens.add({targets:card,alpha:1,scale:1,duration:350,ease:'Back.Out'});
    this.tweens.add({targets:card,alpha:0,y:card.y-30,delay:2300,duration:450,onComplete:()=>card.destroy()});
    this.goalX=gx;
    this.updateProgress(true);
  }

  updateProgress(force){
    const bar=document.getElementById('aq-progress-fill');
    if(!bar||!this.player) return;
    const pct=Math.max(0,Math.min(100,(this.player.x-80)/((this.goalX||2850)-80)*100));
    if(force||Math.abs(pct-(this._lastPct||0))>0.5){ bar.style.width=pct+'%'; this._lastPct=pct; }
  }

  floatText(x,y,txt,color){
    const t=this.add.text(x,y,txt,{fontSize:'16px',color:color||'#FFD700',fontFamily:'Inter',fontStyle:'bold',stroke:'#0F0C18',strokeThickness:3}).setOrigin(0.5).setDepth(30);
    this.tweens.add({targets:t,y:y-36,alpha:0,duration:700,onComplete:()=>t.destroy()});
  }

  landingDust(){
    for(let i=0;i<6;i++){
      const d=this.add.image(this.player.x+Phaser.Math.Between(-8,8),this.player.y+17,'dust').setDepth(19).setAlpha(0.7).setScale(0.6);
      this.tweens.add({targets:d,x:d.x+Phaser.Math.Between(-22,22),y:d.y-Phaser.Math.Between(2,10),alpha:0,scale:1.4,duration:380,onComplete:()=>d.destroy()});
    }
  }

  // ========== v1.7 FULL GAMEPLAY REVISION ==========
  decorateDynamicWorld(l){
    const W=3000;
    const depthScroll = f => (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 0 : f;
    // v2.2.1: Bright and readable early levels. Levels 1-3 are daylight,
    // level 4 is luminous twilight; later levels preserve their own atmosphere.
    const palette = l<=3
      ? {sky1:0x447EA8,sky2:0xAED4D6,mountain:0x486C7C,ruin:0xEBD197}
      : l===4
      ? {sky1:0x375A87,sky2:0x86AAC0,mountain:0x405E78,ruin:0xE9C98D}
      : l<=8
      ? {sky1:0x203658,sky2:0x476580,mountain:0x304C66,ruin:0xD5BA86}
      : l<=16
      ? {sky1:0x1C1426,sky2:0x402315,mountain:0x5D3B22,ruin:0xD4A54D}
      : l<=24
      ? {sky1:0x0F1C22,sky2:0x163E44,mountain:0x245A5E,ruin:0xC2B280}
      : {sky1:0x120B20,sky2:0x2D1744,mountain:0x3B2A55,ruin:0xFFD700};

    const bg=this.add.graphics();
    // Cross-renderer sky bands: Phaser Graphics.fillGradientStyle is not reliable
    // on the Canvas renderer, which left the first levels looking pitch black.
    // Explicit flat-color bands render on both Canvas and WebGL.
    const blendColor = (c1,c2,t) => {
      const blend = shift => Math.round(((c1 >> shift)&255)*(1-t)+((c2 >> shift)&255)*t);
      return (blend(16)<<16)|(blend(8)<<8)|blend(0);
    };
    const skyBands=32;
    for(let i=0;i<skyBands;i++){
      const t=i/(skyBands-1);
      bg.fillStyle(blendColor(palette.sky1,palette.sky2,t),1);
      bg.fillRect(0,Math.floor(i*500/skyBands),800,Math.ceil(500/skyBands)+1);
    }
    // A camera-fixed sky prevents the background from scrolling like a flat wall.
    bg.setDepth(-30).setScrollFactor(0);

    // Sun / bright sky guide. Keep gameplay text and player legible from frame 1.
    const orbX=260+(l%5)*60;
    const earlyDay = l <= 4;
    this.add.circle(orbX,80,earlyDay?84:58,0xFFF2D0,earlyDay?0.36:0.16).setDepth(-25).setScrollFactor(depthScroll(0.025));
    this.add.circle(orbX,80,earlyDay?42:32,0xFFE49A,earlyDay?0.55:0.20).setDepth(-24).setScrollFactor(depthScroll(0.025));

    // Mountains
    const mg=this.add.graphics();
    mg.fillStyle(palette.mountain,0.50);
    for(let x=0;x<W;x+=170){
      const h=70+((x*19+l*53)%120);
      mg.fillTriangle(x,455,x+90,455-h,x+190,455);
    }
    mg.setDepth(-22).setScrollFactor(depthScroll(0.18));

    // WPA cinematic 2.5D — three parallax visual planes, with no physics bodies.
    // Unlike a 3D engine, perspective is simulated by different scroll speeds.
    const middle=this.add.graphics();
    middle.fillStyle(palette.mountain,0.45);
    for(let x=-80;x<W+200;x+=235){
      const peak=270+((x*13+l*97)%85);
      middle.fillTriangle(x,452,x+112,peak,x+260,452);
      middle.fillStyle(0xC5DEE2,0.13);
      middle.fillTriangle(x+112,peak,x+86,peak+45,x+137,peak+51);
      middle.fillStyle(palette.mountain,0.45);
    }
    middle.setDepth(-20).setScrollFactor(depthScroll(0.42));

    // Ancient architectural silhouettes: columns and arches recede behind play.
    const arcade=this.add.graphics();
    for(let x=170;x<W+200;x+=520){
      const base=434;const hh=100+((l+x)%37);
      arcade.fillStyle(palette.ruin,0.16);
      arcade.fillRect(x,base-hh,15,hh);
      arcade.fillRect(x+75,base-hh,15,hh);
      arcade.fillRect(x-9,base-hh-12,107,14);
      arcade.fillRect(x-13,base-6,112,9);
      arcade.fillStyle(0x152D43,0.40);
      arcade.fillTriangle(x+8,base-hh-13,x+43,base-hh-42,x+81,base-hh-13);
    }
    arcade.setDepth(-14).setScrollFactor(depthScroll(0.68));

    // Very subtle fixed atmospheric light, avoiding shaders or flashing.
    const shafts=this.add.graphics();
    shafts.fillStyle(0xFFEFBE,earlyDay?0.06:0.025);
    shafts.fillTriangle(orbX-15,115,Math.max(0,orbX-190),445,Math.min(800,orbX+210),445);
    shafts.setDepth(-19).setScrollFactor(0);

    // Ancient pillars / ruins
    for(let x=360;x<W-280;x+=420){
      const baseY=408+((x+l*17)%24);
      const p=this.add.image(x,baseY,'dyn_pillar');
      p.setAlpha(0.43);
      p.setDepth(-10);
      p.setScrollFactor(depthScroll(0.80));
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

    // v2.0: стариот натпис на почетокот е заменет со воведната картичка

    // Level 4 gets extra visible identity: Meteors / stars / ruins from the first screen.
    if(l===4){
      const title=this.add.text(130,105,(window.I18N&&I18N.lang()==='en'?'Mieza | Path of Learning':'Миеза · Патот на учењето'), {
        fontSize:'24px',
        color:'#9fd0ff',
        fontFamily:'Forum, serif',
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
      let x=520+i*(2200/hazardCount)+Phaser.Math.Between(-45,45);
      // v1.9: огнот не смее да стои над дупка или веднаш до неа
      const groundXs=this.platforms.getChildren().filter(c=>c.y>=455).map(c=>c.x);
      const solid=(xx)=>groundXs.some(gx=>Math.abs(gx-xx)<=32);
      for(let k=0;k<6&&!(solid(x)&&solid(x-70)&&solid(x+70));k++) x+=70;
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
    this.floatText(st.x,st.y-10,'+25');
    if(window.GameSounds) GameSounds.coin();
    st.disableBody(true,true);
    this.dynamicStarsCollected++;
    this.coins++;
    this.score+=25;
    state.totalCoins=(state.totalCoins||0)+1;
    if(window.AQV13&&AQV13.addWisdomQuiet) AQV13.addWisdomQuiet(5);
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
    if(window.AQV13&&AQV13.addWisdomQuiet) AQV13.addWisdomQuiet(10);
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
    this.hurtPlayer();
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
    const hint=s.getData('hint');if(hint?.active)hint.destroy();
    this.floatText(s.x,s.y-26,(window.I18N&&I18N.lang()==='en'?'📜 History discovered!':'📜 Откриена историја!'),'#FFF4CE');
    s.destroy();this.scrolls++;
    const hs=document.getElementById('hud-scrolls'); if(hs) hs.textContent=this.scrolls;
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
    this.respawnX=cp.x;
    if(window.PWA&&PWA.showToast) PWA.showToast('🚩 Контролна точка зачувана',1600);
    this.particles(cp.x,cp.y,0xFF6B35,8);
    this.tweens.add({targets:cp,scale:1.5,alpha:0,duration:400});
  }

  onEnd(){
    if(this.ended)return;this.ended=true;this.timer.destroy();
    if(window.WPALiving) WPALiving.setGameActive(false);
    this.particles(this.player.x,this.player.y,0xFFD700,15);
    // v2.0: кратко славење пред прозорецот за крај
    this.player.setVelocity(0,0); this.player.body.allowGravity=false;
    this.tweens.add({targets:this.player,x:this.endpoint.x,alpha:0.2,duration:700,ease:'Sine.In'});
    this.cameras.main.flash(350,255,215,0);
    if(typeof confetti==='function') confetti({particleCount:90,spread:80,origin:{y:0.55},colors:['#FFD700','#FFA500','#4A90E2']});
    const bar=document.getElementById('aq-progress-fill'); if(bar) bar.style.width='100%';
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
    // Total score is written after applying the companion bonuses below.

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
    state.totalScore+=this.score;
    saveState(state);

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

    const _args=[this.lvl,this.score,this.coins,this.scrolls,this.timeE,stars];
    setTimeout(()=>showLevelComplete(..._args),900);
  }

  hurtPlayer(){
    const now=this.time.now;
    if(this.invulnUntil&&now<this.invulnUntil)return false;
    this.invulnUntil=now+1300;
    const dir=this.player.flipX?1:-1;
    this.player.setVelocity(160*dir,-330);
    this.tweens.add({targets:this.player,alpha:0.25,duration:110,yoyo:true,repeat:5,onComplete:()=>this.player.setAlpha(1)});
    if(this.cameras&&this.cameras.main) this.cameras.main.shake(140,0.006);
    return true;
  }

  respawn(){
    const x=this.respawnX||80;
    this.player.setVelocity(0,0);
    this.player.setPosition(x,330);
    this.invulnUntil=this.time.now+1200;
    this.tweens.add({targets:this.player,alpha:0.25,duration:120,yoyo:true,repeat:4,onComplete:()=>this.player.setAlpha(1)});
  }

  particles(x,y,c,n){
    for(let i=0;i<n;i++){
      const p=this.add.circle(x,y,Phaser.Math.FloatBetween(2,4),c,0.8);
      this.tweens.add({targets:p,x:x+Phaser.Math.FloatBetween(-50,50),y:y+Phaser.Math.FloatBetween(-60,10),alpha:0,scale:0,duration:500});
    }
  }

  update(){
    if(this.ended)return;
    if(this.depthShadow && this.player){
      const elevation=Math.max(0, 428-this.player.y);
      this.depthShadow.setX(this.player.x);
      this.depthShadow.setScale(Math.max(0.48,1-elevation/460),1);
      this.depthShadow.setAlpha(Math.max(0.11,0.29-elevation/1000));
    }
    this.updateDynamicMeteors();
    if(this.player.x<12){this.player.x=12;if(this.player.body.velocity.x<0)this.player.setVelocityX(0);}
    // Apply companion effects
    const fx = getCompanionEffects();
    const touchKeys = window.__AQ_TOUCH_KEYS || {};
    const left=this.cursors.left.isDown||this.wasd.A.isDown||touchKeys.ArrowLeft;
    const right=this.cursors.right.isDown||this.wasd.D.isDown||touchKeys.ArrowRight;
    const touchJump=!!touchKeys.Space&&!this._prevTouchJump;
    this._prevTouchJump=!!touchKeys.Space;
    const jump=Phaser.Input.Keyboard.JustDown(this.cursors.space)||Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.wasd.W)||Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)||touchJump;

    const speed = 200 * fx.speed;
    if(left){this.player.setVelocityX(-speed);this.player.setFlipX(true);}
    else if(right){this.player.setVelocityX(speed);this.player.setFlipX(false);}
    else this.player.setVelocityX(0);

    const ground=this.player.body.touching.down||this.player.body.blocked.down;
    if(ground&&this._wasAir&&this._fallSpeed>260) this.landingDust();
    this._wasAir=!ground; if(!ground) this._fallSpeed=this.player.body.velocity.y;
    this.updateProgress();
    if(ground)this.jumps=0;
    const jumpPower = 520 * fx.jump * (this.superJumpUntil && this.time.now < this.superJumpUntil ? 1.75 : 1);
    if(jump){
      if(ground){this.player.setVelocityY(-jumpPower);this.jumps=1;this.particles(this.player.x,this.player.y+15,0x4A90E2,3);}
      else if((this.canDJ||fx.jump>1.3)&&this.jumps<2){this.player.setVelocityY(-jumpPower*0.85);this.jumps=2;this.particles(this.player.x,this.player.y+15,0x4A90E2,5);}
    }

    // анимација на ликот
    let tex='player';
    if(!ground) tex='player_jump';
    else if(Math.abs(this.player.body.velocity.x)>10) tex=(Math.floor(this.time.now/120)%2)?'player_run1':'player_run2';
    if(this.player.texture.key!==tex) this.player.setTexture(tex);

    if(this.player.y>520){
      this.dynamicFalls=(this.dynamicFalls||0)+1;
      this.respawn();
      if(window.PWA&&PWA.showToast) PWA.showToast('Се враќаш на последната контролна точка 🚩',1800);
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
function nextLevel(){closeModal('modal-complete');const nl=Math.min(currentScene?.lvl||state.currentLevel,36)+1;if(window.EditionAds&&window.GAME_EDITION&&GAME_EDITION.ads){EditionAds.between(()=>startLevel(nl));}else{startLevel(nl);}}
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
  // v2.1: на финалниот екран свири песната на играта
  if(window.AQSong && AQSong.isPlaying()) AQSong.play(true);
  const modal=document.getElementById('modal-legend');
  if(modal) modal.classList.remove('hidden');
}

function closeLegend(){
  closeModal('modal-legend');
}

function checkLegendStatus(){
  return !!state.legendStatus;
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
    desc: 'Учителот на Александар во Миеза. Ти дава двојно повеќе мудрост од свитоците!',
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
    name: 'Птолемеј',
    title: 'Чуварот на Знаењето',
    emoji: '🏛️',
    color: 'text-teal-400',
    unlockLevel: 20,
    desc: 'Генерал и пријател од детството. Подоцна станал крал на Египет и напишал историја на походите. Ти помага да собираш свитоци!',
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

// ========== ADVISORS (историски советници) ==========
// Внатрешните клучеви (kimi/gpt/claude/harvey) остануваат заради компатибилност
// со зачуваниот прогрес; на екранот се прикажуваат историски личности.
// Одговорите се однапред напишани совети — не е вештачка интелигенција.
let currentAgent='kimi';

const AGENT_PROFILES={
  kimi:{name:'Неарх',role:'Водич',emoji:'🧭',color:'text-blue-400',ring:'border-blue-500 bg-blue-500/20 text-blue-300',
    desc:'Неарх бил пријател од детството и морепловец на Александар. Тој ќе ти каже како да ги поминеш нивоата.'},
  gpt:{name:'Леонид',role:'Учител',emoji:'🎓',color:'text-yellow-400',ring:'border-yellow-500 bg-yellow-500/20 text-yellow-300',
    desc:'Леонид бил првиот, строг учител на младиот Александар. Прашај го за историјата.'},
  claude:{name:'Аристандар',role:'Толкувач на знаци',emoji:'🧩',color:'text-purple-400',ring:'border-purple-500 bg-purple-500/20 text-purple-300',
    desc:'Аристандар ги толкувал знаците за Александар. Тој дава кратки предизвици и загатки.'},
  harvey:{name:'Кратер',role:'Храбар генерал',emoji:'⚡',color:'text-red-400',ring:'border-red-500 bg-red-500/20 text-red-300',
    desc:'Кратер бил еден од најверните генерали. Кога ќе паднеш, тој те охрабрува да продолжиш.'},
};

function escapeHTML(str){
  return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function selectAgent(key){
  if(!AGENT_PROFILES[key]) key='kimi';
  currentAgent=key;
  Object.keys(AGENT_PROFILES).forEach(k=>{
    const btn=document.getElementById('agent-btn-'+k);
    if(!btn) return;
    const p=AGENT_PROFILES[k];
    btn.textContent=p.emoji+' '+p.name;
    btn.className = k===key
      ? `flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-all ${p.ring}`
      : 'flex-1 py-2 rounded-lg border border-white/10 text-[#FFF8E7]/50 text-sm transition-all hover:border-white/30';
  });
  const p=AGENT_PROFILES[key];
  const d=document.getElementById('agent-desc');
  if(d) d.innerHTML=`<strong class="${p.color}">${p.emoji} ${p.name} — ${p.role}</strong><br><span class="text-[#FFF8E7]/70">${p.desc}</span>`;
}

function advisorReply(key,msg){
  const m=msg.toLowerCase();
  const lvl=state.currentLevel||1;
  const fact=FACTS[(lvl-1)%FACTS.length];
  const randomFact=()=>FACTS[Math.floor(Math.random()*FACTS.length)];
  if(key==='kimi'){
    if(/скок|скокн|jump/.test(m)) return 'Од ниво 3 имаш двоен скок: притисни скок уште еднаш во воздух. Сината топка ти дава супер скок!';
    if(/пад|дупк|празн/.test(m)) return 'Ако паднеш, се враќаш на последната 🚩 контролна точка. Помини преку неа за да ја зачуваш.';
    if(/оган|пожар|метеор|препрек/.test(m)) return 'Оганот на земјата прескокни го. Метеорите паѓаат од небото — почекај да поминат, па продолжи.';
    if(/свит|scroll/.test(m)) return 'Секое ниво крие еден свиток со вистински историски факт. Барај го високо над патот.';
    return `Ниво ${lvl}: следи ги златните ✦ знаци до портата на крајот. Собирај ѕвезди и пази на оганот!`;
  }
  if(key==='gpt'){
    if(/аристотел/.test(m)) return FACTS[3].text;
    if(/букефал|коњ/.test(m)) return FACTS[2].text;
    if(/александриј/.test(m)) return FACTS[11].text;
    if(/роден|пела|детство/.test(m)) return FACTS[0].text;
    if(/умре|почина|смрт/.test(m)) return FACTS[34].text;
    return fact ? `За ова ниво: ${fact.text}` : randomFact().text;
  }
  if(key==='claude'){
    const riddles=[
      'Загатка: имам четири нозе и грива, а се плашев од сопствената сенка. Кој сум? (Букефал)',
      'Предизвик: заврши го ова ниво без да паднеш ниту еднаш.',
      'Загатка: јазол што никој не можеше да го одврзе. Како се викаше? (Гордиев)',
      'Предизвик: собери ги сите ѕвезди во првиот дел од нивото.',
      'Загатка: светилник што стана едно од седумте чуда. Како се вика? (Фарос)'
    ];
    return riddles[Math.floor(Math.random()*riddles.length)];
  }
  const cheers=[
    'Не се откажувај! И најголемите патувања се прават чекор по чекор.',
    'Секој пад е лекција. Стани и обиди се повторно!',
    `Веќе си завршил ${state.completedLevels.length} нивоа. Продолжи храбро!`,
    'Одлично! Тимот е посилен кога сите се поддржуваат.'
  ];
  return cheers[Math.floor(Math.random()*cheers.length)];
}

function sendAIMessage(){
  const input=document.getElementById('ai-input');
  const msg=(input.value||'').trim().slice(0,200);
  if(!msg)return;
  input.value='';
  const chat=document.getElementById('ai-chat-area');
  chat.insertAdjacentHTML('beforeend',`<div class="ai-bubble user">${escapeHTML(msg)}</div>`);
  chat.scrollTop=chat.scrollHeight;
  const agent=AGENT_PROFILES[currentAgent];
  const resp=advisorReply(currentAgent,msg);
  setTimeout(()=>{
    chat.insertAdjacentHTML('beforeend',`<div class="ai-bubble agent"><strong class="${agent.color}">${agent.emoji} ${agent.name}</strong><br>${escapeHTML(resp)}</div>`);
    chat.scrollTop=chat.scrollHeight;
  },500);
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
  state=defaultState();
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

// ========== PREMIUM / PAYMENTS ==========
// Чесен тек: родителска проверка → надворешна страница за плаќање
// (на пр. Gumroad) → купувачот добива код за пристап → кодот се внесува
// во играта. Играта НИКОГАШ не отклучува без валиден код.
//
// ЗА СОПСТВЕНИКОТ:
//   1. Во paymentUrl стави го линкот од Gumroad (или друг checkout).
//   2. Во содржината што купувачот ја добива по плаќањето стави го кодот.
//   3. За нов код: SHA-256 од кодот (со големи букви) додај го во codeHashes.
// SECURITY NOTICE: local access codes are not verifiable payment receipts.
// Real purchases need a hosted checkout and server-side verification.
const PREMIUM_CONFIG = {
  price: '$0.99',
  paymentUrl: '',
  contactEmail: 'aleksandarmakedonskigame@gmail.com',
  codeHashes: []
};

let parentGateAnswer = null;

function refreshPremiumUI(){
  document.querySelectorAll('[data-premium-price]').forEach(el=>{ el.textContent = (FREE_LEVEL_LIMIT === 37 ? 'Нема наплата (јавен тест)' : PREMIUM_CONFIG.price); });
  const status = document.getElementById('premium-status');
  if (status) status.classList.toggle('hidden', !hasPremiumAccess());
}

function buyProduct(){
  if (FREE_LEVEL_LIMIT === 37) {
    const msg = "🎮 Јавна тест-верзија: сите 37 нивоа се бесплатни; плаќање не е активно.";
    if (window.PWA && typeof PWA.showToast === "function") PWA.showToast(msg, 4500);
    else alert(msg);
    return;
  }
  const a = 6 + Math.floor(Math.random()*7);   // 6–12
  const b = 3 + Math.floor(Math.random()*7);   // 3–9
  parentGateAnswer = a*b;
  const q = document.getElementById('gate-question');
  if (q) q.textContent = a + ' × ' + b + ' = ?';
  const ans = document.getElementById('gate-answer');
  if (ans) ans.value = '';
  document.getElementById('gate-error')?.classList.add('hidden');
  const adult = document.getElementById('adult-confirm'); if (adult) adult.checked = false;
  document.getElementById('pay-step-gate')?.classList.remove('hidden');
  document.getElementById('pay-step-main')?.classList.add('hidden');
  const msg = document.getElementById('code-msg'); if (msg) msg.textContent = '';
  refreshPremiumUI();
  document.getElementById('modal-payment').classList.remove('hidden');
  setTimeout(()=>ans && ans.focus(), 50);
}

function checkParentGate(){
  if (!document.getElementById('adult-confirm')?.checked) { const el=document.getElementById('gate-error'); if(el){el.textContent='Потребна е потврда од возрасен. Ова прашање не ја проверува вистинската возраст.';el.classList.remove('hidden');} return; }
  const v = parseInt(document.getElementById('gate-answer').value, 10);
  if (v === parentGateAnswer) {
    document.getElementById('pay-step-gate').classList.add('hidden');
    document.getElementById('pay-step-main').classList.remove('hidden');
    const ready = !!PREMIUM_CONFIG.paymentUrl;
    document.getElementById('pay-open-btn').classList.toggle('hidden', !ready);
    const nr = document.getElementById('pay-not-ready');
    nr.classList.toggle('hidden', ready);
    const c = document.getElementById('pay-contact');
    if (c) { c.href = 'mailto:' + PREMIUM_CONFIG.contactEmail + '?subject=' + encodeURIComponent('Премиум — Мисија на Александар'); c.textContent = PREMIUM_CONFIG.contactEmail; }
  } else {
    document.getElementById('gate-error').classList.remove('hidden');
    document.getElementById('gate-error').textContent = 'Не е точно. Обидете се повторно.';
  }
}

function openPaymentPage(){
  if (!PREMIUM_CONFIG.paymentUrl) return;
  window.open(PREMIUM_CONFIG.paymentUrl, '_blank', 'noopener');
}

async function sha256Hex(text){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function redeemAccessCode(){
  const input = document.getElementById('access-code');
  const msg = document.getElementById('code-msg');
  const code = (input.value || '').trim().toUpperCase().replace(/\s+/g,'');
  if (!code) return;
  if(!Array.isArray(PREMIUM_CONFIG.codeHashes) || !PREMIUM_CONFIG.codeHashes.length){ msg.textContent='Плаќање и кодови за пристап сè уште не се активирани.'; return; }
  if (!window.crypto || !crypto.subtle) {
    msg.className = 'text-sm text-center mt-2 text-red-400';
    msg.textContent = 'Кодот може да се провери само на безбедна (https) страница.';
    return;
  }
  const hash = await sha256Hex(code);
  if (PREMIUM_CONFIG.codeHashes.includes(hash)) {
    state.premium = true;
    state.supportActivatedAt = new Date().toISOString();
    state.supportSource = 'access_code';
    saveState(state);
    updateMenu();
    refreshPremiumUI();
    msg.className = 'text-sm text-center mt-2 text-green-400';
    msg.textContent = '🎉 Премиум е отклучен! Нивоата 9–37 се достапни.';
    if (typeof confetti === 'function') confetti({particleCount:120,spread:80,origin:{y:0.6}});
    setTimeout(()=>{ closeModal('modal-payment'); showScreen('levels'); }, 1600);
  } else {
    msg.className = 'text-sm text-center mt-2 text-red-400';
    msg.textContent = 'Кодот не е валиден. Проверете го и обидете се повторно.';
  }
}

// ========== SOCIAL SHARE ==========
function shareSocial(platform){
  // 👁️ Magic Tracking
  const url=encodeURIComponent(window.location.href);
  const text=encodeURIComponent('Мисија на Александар — Патот на Светлината! Образовна авантура со 37 нивоа и вистински историски факти. 👑');
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
  const text='Мисија на Александар - Патот на Светлината! 37 нивоа, вистински историски факти и квизови! 👑\n'+window.location.href;
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

// ========== INIT ==========
window.onload=function(){
  // v1.9: стари податоци од отстранети модули (лажен „blockchain“, следење, реферали)
  ['aq_blockchain','aq_integrity_hash','aq_referrals','aq_transactions','aq_ad_views','aq_ad_clicks']
    .forEach(k=>{ try { localStorage.removeItem(k); } catch(e){} });
  updateMenu();
  updateToggle('sound',state.sound);
  updateToggle('music',state.music);
  setLang(state.lang);
  selectAgent('kimi');
  if (window.lucide?.createIcons) lucide.createIcons();

  if (typeof refreshPremiumUI === 'function') refreshPremiumUI();
};

window.AQ_GAME_BUILD_VERSION='2.0.0';
