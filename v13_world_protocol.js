// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.3 — WORLD PROTOCOL EDITION
// Missions · Wisdom Quiz · Protocol Points · World Map · Passport · Original WebAudio Music
// ============================================================
(function () {
  'use strict';

  const PROTOCOL_KEY = 'alexander_protocol_v13';
  const SAVE_KEY = 'alexander_quest_save';
  const TODAY = new Date().toISOString().slice(0, 10);

  const DESTINATIONS = [
    'Пела', 'Миеза', 'Гордиев Јазол', 'Ис', 'Египет', 'Сива', 'Гавгамела', 'Вавилон',
    'Персеполис', 'Суза', 'Бактрија', 'Хинду Куш', 'Индија', 'Хидаспис', 'Гедрозија',
    'Александрија', 'Фарос', 'Библиотеката', 'Патот на Мостовите', 'Вечната Светлина'
  ];

  const MISSIONS = Array.from({ length: 37 }, (_, i) => {
    const level = i + 1;
    const types = [
      { icon: '🪙', type: 'Собирање', goal: 'Собери најмалку 5 монети и стигни до крајот.' },
      { icon: '📜', type: 'Знаење', goal: 'Најди го свитокот и отклучи мудрост.' },
      { icon: '🤝', type: 'Протокол', goal: 'Играй внимателно: мостови, не ѕидови.' },
      { icon: '⚡', type: 'Брзина', goal: 'Заврши го патот со храброст и смиреност.' },
      { icon: '🏛️', type: 'Мудрост', goal: 'Собери знаење и одговори на прашање.' }
    ];
    const m = types[i % types.length];
    return {
      level,
      title: `${m.icon} Мисија ${level}: ${m.type}`,
      goal: m.goal,
      destination: DESTINATIONS[i % DESTINATIONS.length],
      quote: level <= 8
        ? 'Знаењето е оган што се пали, не сад што се полни.'
        : level <= 20
          ? 'Големиот пат не се гради со ѕидови, туку со мостови.'
          : 'Кога културите се почитуваат, светот станува поголем.'
    };
  });

  const QUESTIONS = [
    { q: 'Кој бил учител на Александар?', a: ['Аристотел', 'Птоломеј', 'Дариј'], correct: 0, why: 'Аристотел го учел Александар во Миеза.' },
    { q: 'Која вредност ја носи зборот homonia?', a: ['Единство', 'Страв', 'Бегство'], correct: 0, why: 'Homonia значи согласност, единство и поврзување.' },
    { q: 'Како Александар влегол во Египет според протоколскиот пристап?', a: ['Со почит кон локалните традиции', 'Со забрана на културата', 'Со уништување на храмови'], correct: 0, why: 'Во Египет ги почитувал локалните богови и традиции.' },
    { q: 'Што симболизира „мостови, не ѕидови“?', a: ['Поврзување на луѓе и култури', 'Изолација', 'Забрана за патување'], correct: 0, why: 'Мостот е симбол за комуникација и доверба.' },
    { q: 'Зошто бројот 37 е важен во оваа игра?', a: ['Како симболичен пат низ 37 нивоа', 'Затоа што има 37 копчиња', 'Затоа што играта трае 37 минути'], correct: 0, why: 'Во играта 37 е симболична структура на патот.' },
    { q: 'Која е најголемата сила во оваа верзија на приказната?', a: ['Мудрост и протокол', 'Само брзина', 'Само богатство'], correct: 0, why: 'Играта го претставува Александар како ученик, лидер и интегратор.' },
    { q: 'Што отклучуваат свитоците?', a: ['Историска мудрост', 'Само украс', 'Казна'], correct: 0, why: 'Свитокот е кратка лекција и клуч за Дворецот на Знаењето.' },
    { q: 'Што е Пасош на знаењето?', a: ['Личен преглед на наученото', 'Обична слика', 'Копче за излез'], correct: 0, why: 'Пасошот ги собира нивоата, свитоците, поените и мудроста.' }
  ];

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function protocolState() {
    const s = readJSON(PROTOCOL_KEY, {});
    if (!s.wisdomPoints) s.wisdomPoints = 0;
    if (!s.correctAnswers) s.correctAnswers = 0;
    if (!s.answered) s.answered = {};
    if (!s.completedMissions) s.completedMissions = {};
    if (!s.daily) s.daily = { date: TODAY, progress: 0, claimed: false };
    if (s.daily.date !== TODAY) s.daily = { date: TODAY, progress: 0, claimed: false };
    return s;
  }

  function saveProtocolState(s) { writeJSON(PROTOCOL_KEY, s); }
  function gameState() { return readJSON(SAVE_KEY, {}); }
  function currentLevelFromDom() {
    return parseInt(document.getElementById('hud-level')?.textContent || window.__AQ_SELECTED_LEVEL || '1', 10) || 1;
  }

  function addWisdomPoints(points, reason) {
    const s = protocolState();
    s.wisdomPoints += points;
    saveProtocolState(s);
    updateProtocolHud();
    showMiniToast(`+${points} мудрост · ${reason}`);
  }

  function showMiniToast(text) {
    if (window.PWA?.showToast) return window.PWA.showToast(text, 2500);
    let el = document.getElementById('v13-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'v13-toast';
      el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:99999;background:rgba(15,12,24,.95);border:1px solid rgba(255,215,0,.45);color:#FFD700;padding:10px 16px;border-radius:999px;font-weight:700;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.45)';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.display = 'block';
    clearTimeout(window.__V13_TOAST_TIMER);
    window.__V13_TOAST_TIMER = setTimeout(() => { el.style.display = 'none'; }, 2500);
  }

  function updateProtocolHud() {
    const s = protocolState();
    let badge = document.getElementById('v13-protocol-hud');
    const hud = document.querySelector('#screen-game .flex.flex-wrap') || document.getElementById('screen-game');
    if (!badge && hud) {
      badge = document.createElement('div');
      badge.id = 'v13-protocol-hud';
      badge.className = 'bg-purple-500/10 border border-purple-500/30 rounded-xl px-3 py-2 text-center';
      hud.appendChild(badge);
    }
    if (badge) badge.innerHTML = `<span class="text-purple-300 font-bold">${s.wisdomPoints}</span><span class="text-[#FFF8E7]/50 text-xs block">Мудрост</span>`;
  }

  function showMissionIntro(level) {
    const m = MISSIONS[level - 1] || MISSIONS[0];
    let modal = document.getElementById('v13-mission-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'v13-mission-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="max-w-md w-full bg-[#1A1525] border-2 border-yellow-500/40 rounded-3xl p-6 text-center shadow-2xl">
          <div id="v13-mission-icon" class="text-5xl mb-3">🧭</div>
          <h3 id="v13-mission-title" class="text-2xl font-cinzel font-bold text-yellow-400 mb-2"></h3>
          <p id="v13-mission-destination" class="text-blue-300 text-sm mb-3"></p>
          <p id="v13-mission-goal" class="text-[#FFF8E7]/80 mb-4"></p>
          <div class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
            <p id="v13-mission-quote" class="text-[#FFF8E7]/70 text-sm italic"></p>
          </div>
          <button id="v13-mission-close" class="game-btn w-full py-3">Продолжи го патот</button>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('v13-mission-close').onclick = () => modal.classList.add('hidden');
    }
    document.getElementById('v13-mission-title').textContent = m.title;
    document.getElementById('v13-mission-destination').textContent = `Следна дестинација: ${m.destination}`;
    document.getElementById('v13-mission-goal').textContent = m.goal;
    document.getElementById('v13-mission-quote').textContent = `„${m.quote}“`;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('hidden'), 4500);
  }

  function showQuizForLevel(level) {
    const s = protocolState();
    const qIndex = (level - 1) % QUESTIONS.length;
    const key = `${TODAY}-L${level}-Q${qIndex}`;
    if (s.answered[key]) return;
    const q = QUESTIONS[qIndex];

    let modal = document.getElementById('v13-quiz-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'v13-quiz-modal';
      modal.className = 'hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="max-w-lg w-full bg-[#1A1525] border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl">
          <div class="text-center mb-4">
            <div class="text-5xl mb-2">🧠</div>
            <h3 class="text-2xl font-cinzel font-bold text-purple-300">Прашање на мудроста</h3>
            <p class="text-[#FFF8E7]/50 text-xs">Одговори и добиј Поени на мудрост</p>
          </div>
          <p id="v13-quiz-question" class="text-[#FFF8E7] font-bold mb-4 text-center"></p>
          <div id="v13-quiz-answers" class="space-y-2"></div>
          <p id="v13-quiz-result" class="hidden mt-4 text-center text-sm"></p>
          <button id="v13-quiz-close" class="mt-4 w-full game-btn-sm justify-center py-3">Продолжи</button>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('v13-quiz-close').onclick = () => modal.classList.add('hidden');
    }

    document.getElementById('v13-quiz-question').textContent = q.q;
    const answers = document.getElementById('v13-quiz-answers');
    const result = document.getElementById('v13-quiz-result');
    result.className = 'hidden mt-4 text-center text-sm';
    result.textContent = '';
    answers.innerHTML = '';

    q.a.forEach((answer, i) => {
      const btn = document.createElement('button');
      btn.className = 'w-full text-left bg-white/5 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/40 rounded-xl px-4 py-3 transition-all';
      btn.textContent = `${String.fromCharCode(65 + i)}) ${answer}`;
      btn.onclick = () => {
        const st = protocolState();
        st.answered[key] = i;
        if (i === q.correct) {
          st.correctAnswers += 1;
          st.wisdomPoints += 25;
          result.className = 'mt-4 text-center text-sm text-green-300';
          result.textContent = `Точно! +25 мудрост. ${q.why}`;
          try { if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 } }); } catch (e) {}
        } else {
          st.wisdomPoints += 5;
          result.className = 'mt-4 text-center text-sm text-yellow-300';
          result.textContent = `Добар обид. +5 мудрост. ${q.why}`;
        }
        saveProtocolState(st);
        updateProtocolHud();
        Array.from(answers.querySelectorAll('button')).forEach(b => b.disabled = true);
      };
      answers.appendChild(btn);
    });

    modal.classList.remove('hidden');
  }

  function enhanceCompleteModal(level) {
    const m = MISSIONS[level - 1] || MISSIONS[0];
    const modalBox = document.querySelector('#modal-complete > div');
    if (!modalBox) return;
    let block = document.getElementById('v13-complete-insight');
    if (!block) {
      block = document.createElement('div');
      block.id = 'v13-complete-insight';
      block.className = 'bg-purple-500/10 border border-purple-500/25 rounded-2xl p-4 mb-5 text-left';
      const statsGrid = modalBox.querySelector('.grid.grid-cols-2');
      if (statsGrid) statsGrid.insertAdjacentElement('afterend', block);
      else modalBox.appendChild(block);
    }
    const st = protocolState();
    block.innerHTML = `
      <p class="text-purple-300 font-bold text-sm mb-1">🧭 Што научи?</p>
      <p class="text-[#FFF8E7]/75 text-xs mb-2">${m.quote}</p>
      <div class="flex justify-between text-xs text-[#FFF8E7]/60">
        <span>Дестинација: <b class="text-yellow-300">${m.destination}</b></span>
        <span>Мудрост: <b class="text-purple-300">${st.wisdomPoints}</b></span>
      </div>`;
  }

  function renderDailyMission() {
    const menu = document.querySelector('#screen-menu .max-w-md');
    if (!menu) return;
    let card = document.getElementById('v13-daily-mission');
    if (!card) {
      card = document.createElement('div');
      card.id = 'v13-daily-mission';
      card.className = 'mb-4 bg-green-500/10 border border-green-500/25 rounded-2xl p-4 text-center';
      const grid = menu.querySelector('.grid.grid-cols-2');
      if (grid) grid.insertAdjacentElement('beforebegin', card);
      else menu.appendChild(card);
    }
    const st = protocolState();
    const done = st.daily.progress || 0;
    card.innerHTML = `
      <p class="text-green-300 font-bold text-sm">🎯 Денешна мисија</p>
      <p class="text-[#FFF8E7]/70 text-xs mt-1">Заврши 1 ниво или одговори на прашање на мудроста.</p>
      <div class="mt-3 bg-black/30 rounded-full h-2 overflow-hidden"><div style="width:${Math.min(100, done * 100)}%" class="h-full bg-green-400"></div></div>
      <p class="text-[#FFF8E7]/45 text-xs mt-2">Напредок: ${done}/1</p>`;
  }

  function completeDailyMission() {
    const st = protocolState();
    if (st.daily.claimed) return;
    st.daily.progress = 1;
    st.daily.claimed = true;
    st.wisdomPoints += 15;
    saveProtocolState(st);
    renderDailyMission();
    updateProtocolHud();
    showMiniToast('🎯 Дневна мисија завршена · +15 мудрост');
  }

  function showWorldMap() {
    const g = gameState();
    const current = parseInt(g.currentLevel || window.__AQ_SELECTED_LEVEL || '1', 10) || 1;
    let modal = document.getElementById('v13-map-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'v13-map-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="max-w-3xl w-full bg-[#1A1525] border-2 border-yellow-500/40 rounded-3xl p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
          <div class="flex justify-between items-start gap-3 mb-4">
            <div><h3 class="text-2xl font-cinzel font-bold text-yellow-400">🗺️ Жива мапа на патувањето</h3><p class="text-[#FFF8E7]/50 text-xs">Пела → Египет → Вавилон → Александрија</p></div>
            <button id="v13-map-close" class="text-[#FFF8E7]/50 hover:text-yellow-400 text-2xl">×</button>
          </div>
          <div id="v13-map-path" class="grid grid-cols-1 sm:grid-cols-2 gap-3"></div>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('v13-map-close').onclick = () => modal.classList.add('hidden');
    }
    const path = document.getElementById('v13-map-path');
    path.innerHTML = DESTINATIONS.map((d, i) => {
      const lv = Math.min(37, i + 1);
      const active = lv <= current;
      return `<div class="rounded-2xl p-4 border ${active ? 'bg-yellow-500/10 border-yellow-500/35' : 'bg-white/5 border-white/10 opacity-60'}">
        <p class="font-bold ${active ? 'text-yellow-300' : 'text-[#FFF8E7]/60'}">${active ? '✨' : '🔒'} ${d}</p>
        <p class="text-xs text-[#FFF8E7]/50 mt-1">Симболичен дел од Патот на Светлината</p>
      </div>`;
    }).join('');
    modal.classList.remove('hidden');
  }

  const Music = {
    ctx: null,
    timer: null,
    enabled: false,
    step: 0,
    gain: null,
    notes: [220, 246.94, 261.63, 329.63, 392, 440, 392, 329.63, 293.66, 261.63, 246.94, 220],
    start() {
      if (this.enabled) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return alert('Овој browser не поддржува WebAudio музика.');
      this.ctx = this.ctx || new AudioContext();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.06;
      this.gain.connect(this.ctx.destination);
      this.enabled = true;
      this.tick();
      this.timer = setInterval(() => this.tick(), 520);
      showMiniToast('🎵 Етно-античка музика вклучена');
      this.updateButton();
    },
    stop() {
      this.enabled = false;
      clearInterval(this.timer);
      this.timer = null;
      showMiniToast('🔇 Музика исклучена');
      this.updateButton();
    },
    toggle() { this.enabled ? this.stop() : this.start(); },
    tone(freq, dur, type, vol) {
      if (!this.ctx || !this.gain) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, this.ctx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(g); g.connect(this.gain);
      osc.start(); osc.stop(this.ctx.currentTime + dur + 0.03);
    },
    drum() {
      if (!this.ctx || !this.gain) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.12, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);
      osc.connect(g); g.connect(this.gain);
      osc.start(); osc.stop(this.ctx.currentTime + 0.2);
    },
    tick() {
      if (!this.enabled) return;
      const n = this.notes[this.step % this.notes.length];
      this.tone(n, 0.45, 'sine', 0.08);
      if (this.step % 4 === 0) this.tone(n / 2, 1.4, 'triangle', 0.05);
      if (this.step % 3 === 0) this.drum();
      this.step += 1;
    },
    updateButton() {
      const btn = document.getElementById('v13-music-btn');
      if (btn) btn.innerHTML = this.enabled ? '🔇 Исклучи музика' : '🎵 Етно музика';
    }
  };

  function injectMenuButtons() {
    const grid = document.querySelector('#screen-menu .grid.grid-cols-2');
    if (!grid || document.getElementById('v13-map-btn')) return;
    const mapBtn = document.createElement('button');
    mapBtn.id = 'v13-map-btn';
    mapBtn.className = 'game-btn-sm justify-center py-3';
    mapBtn.style.cssText = 'background:linear-gradient(135deg,rgba(14,165,233,.15),rgba(168,85,247,.15));border-color:rgba(14,165,233,.4);color:#7dd3fc;';
    mapBtn.innerHTML = '🗺️ Жива мапа';
    mapBtn.onclick = showWorldMap;

    const passportBtn = document.createElement('button');
    passportBtn.id = 'v13-passport-btn';
    passportBtn.className = 'game-btn-sm justify-center py-3';
    passportBtn.style.cssText = 'background:linear-gradient(135deg,rgba(168,85,247,.15),rgba(236,72,153,.15));border-color:rgba(168,85,247,.4);color:#d8b4fe;';
    passportBtn.innerHTML = '📜 Пасош на протоколот';
    passportBtn.onclick = () => showProtocolPassport();

    const musicBtn = document.createElement('button');
    musicBtn.id = 'v13-music-btn';
    musicBtn.className = 'game-btn-sm justify-center py-3 col-span-2';
    musicBtn.style.cssText = 'background:linear-gradient(135deg,rgba(255,215,0,.16),rgba(34,197,94,.10));border-color:rgba(255,215,0,.35);color:#fde68a;';
    musicBtn.innerHTML = '🎵 Етно музика';
    musicBtn.onclick = () => Music.toggle();

    const capsuleBtn = grid.querySelector('.col-span-2');
    if (capsuleBtn) {
      grid.insertBefore(mapBtn, capsuleBtn);
      grid.insertBefore(passportBtn, capsuleBtn);
      grid.insertBefore(musicBtn, capsuleBtn);
    } else {
      grid.appendChild(mapBtn); grid.appendChild(passportBtn); grid.appendChild(musicBtn);
    }
  }

  function showProtocolPassport() {
    if (typeof window.showScreen === 'function') window.showScreen('passport');
    setTimeout(() => {
      const host = document.getElementById('passport-svg-host') || document.querySelector('#screen-passport .max-w-lg');
      if (!host) return;
      let panel = document.getElementById('v13-protocol-passport-panel');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'v13-protocol-passport-panel';
        panel.className = 'mt-4 bg-purple-500/10 border border-purple-500/25 rounded-2xl p-4';
        host.insertAdjacentElement('afterend', panel);
      }
      const ps = protocolState();
      const gs = gameState();
      const completed = (gs.completedLevels || []).length;
      const facts = (gs.collectedFacts || []).length;
      panel.innerHTML = `
        <h3 class="text-purple-300 font-bold mb-2">🏛️ Пасош на знаење и протокол</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-black/25 rounded-xl p-3"><b class="text-yellow-300 text-lg">${completed}</b><br><span class="text-[#FFF8E7]/50">Завршени нивоа</span></div>
          <div class="bg-black/25 rounded-xl p-3"><b class="text-orange-300 text-lg">${facts}</b><br><span class="text-[#FFF8E7]/50">Свитоци</span></div>
          <div class="bg-black/25 rounded-xl p-3"><b class="text-purple-300 text-lg">${ps.wisdomPoints}</b><br><span class="text-[#FFF8E7]/50">Мудрост</span></div>
          <div class="bg-black/25 rounded-xl p-3"><b class="text-green-300 text-lg">${ps.correctAnswers}</b><br><span class="text-[#FFF8E7]/50">Точни одговори</span></div>
        </div>
        <p class="text-[#FFF8E7]/60 text-xs mt-3 italic">Мој протокол: учам, почитувам, поврзувам.</p>`;
    }, 250);
  }

  function patchGameFunctions() {
    const wait = () => {
      if (window.__AQ_V13_PATCHED) return;
      if (typeof window.startLevel !== 'function' || typeof window.showFact !== 'function' || typeof window.showLevelComplete !== 'function') {
        setTimeout(wait, 150);
        return;
      }
      window.__AQ_V13_PATCHED = true;

      const originalStartLevel = window.startLevel;
      window.startLevel = function (level) {
        const lv = Math.min(Math.max(parseInt(level, 10) || 1, 1), 37);
        const result = originalStartLevel(lv);
        setTimeout(() => { showMissionIntro(lv); updateProtocolHud(); }, 500);
        return result;
      };

      const originalShowFact = window.showFact;
      window.showFact = function (text) {
        const result = originalShowFact(text);
        const lv = currentLevelFromDom();
        addWisdomPoints(10, 'откриен свиток');
        setTimeout(() => showQuizForLevel(lv), 900);
        return result;
      };

      const originalComplete = window.showLevelComplete;
      window.showLevelComplete = function (level, score, coins, scrolls, time, stars) {
        const result = originalComplete(level, score, coins, scrolls, time, stars);
        const ps = protocolState();
        ps.completedMissions[level] = true;
        ps.daily.progress = 1;
        saveProtocolState(ps);
        addWisdomPoints(20, 'завршена мисија');
        enhanceCompleteModal(level);
        completeDailyMission();
        return result;
      };

      console.log('[v1.3] World Protocol systems active');
    };
    wait();
  }

  function init() {
    injectMenuButtons();
    renderDailyMission();
    patchGameFunctions();
    updateProtocolHud();
    window.AQV13 = { showWorldMap, showProtocolPassport, toggleMusic: () => Music.toggle(), protocolState };
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
