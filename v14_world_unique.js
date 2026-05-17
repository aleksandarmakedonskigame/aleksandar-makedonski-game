// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.4 — MORE DYNAMIC MACEDONIAN EDITION
// Episodes · Protocol Choices · Scroll of the Day · Certificates
// Parents Screen · Founder Tools · Macedonian Ethno Music Modes
// ============================================================
(function () {
  'use strict';

  const SAVE_KEY = 'alexander_quest_save';
  const PROTOCOL_KEY = 'alexander_protocol_v13';
  const V14_KEY = 'alexander_world_unique_v14';
  const TODAY = new Date().toISOString().slice(0, 10);

  const EPISODES_V14 = [
    { id: 1, range: [1, 6], title: 'Пела и Миеза — Огнот на знаењето', icon: '🔥', theme: 'учење, учител, почеток' },
    { id: 2, range: [7, 12], title: 'Гордиев Јазол — Храброст и одлука', icon: '⚔️', theme: 'одлука, истрајност, пат' },
    { id: 3, range: [13, 18], title: 'Египет — Почит кон културите', icon: '☀️', theme: 'почит, храмови, различност' },
    { id: 4, range: [19, 24], title: 'Вавилон — Протокол и дипломатија', icon: '🏛️', theme: 'договор, мостови, управување' },
    { id: 5, range: [25, 31], title: 'Александрија — Градот на светлината', icon: '📚', theme: 'библиотека, наука, светлина' },
    { id: 6, range: [32, 37], title: 'Патот на наследството — Мудрост за иднината', icon: '🌍', theme: 'наследство, порака, светот' },
  ];

  const PROTOCOL_CHOICES = [
    {
      id: 'egypt-respect',
      title: 'Египетскиот храм',
      text: 'Пристигнуваш во земја со свои богови, обичаи и храмови. Како постапува мудар водач?',
      options: [
        { t: 'Ги игнорира локалните обичаи.', good: false, reply: 'Тоа создава недоверба. Протоколот почнува со почит.' },
        { t: 'Ги прашува старешините за нивните обичаи и покажува почит.', good: true, reply: 'Точно. Почитта отвора врати што силата не може.' },
        { t: 'Сака сите веднаш да зборуваат исто.', good: false, reply: 'Единството не значи бришење на различностите.' },
      ]
    },
    {
      id: 'bridge-wall',
      title: 'Мост или ѕид',
      text: 'Две групи не се разбираат. Што е протоколскиот избор?',
      options: [
        { t: 'Да изградиш мост и да ги слушнеш двете страни.', good: true, reply: 'Точно. Мостот е симбол на лидерство и доверба.' },
        { t: 'Да ги разделиш засекогаш.', good: false, reply: 'Тоа го намалува конфликтот за момент, но не гради иднина.' },
        { t: 'Да одбереш една страна без разговор.', good: false, reply: 'Мудриот водач прво слуша, потоа одлучува.' },
      ]
    },
    {
      id: 'aristotle-fire',
      title: 'Огнот на знаењето',
      text: 'Учителот не го полни умот како сад, туку пали оган. Што значи тоа?',
      options: [
        { t: 'Дека ученикот треба само да памети.', good: false, reply: 'Паметењето е корисно, но не е целата мудрост.' },
        { t: 'Дека знаењето треба да ја разбуди љубопитноста.', good: true, reply: 'Точно. Љубопитноста го движи патот на светлината.' },
        { t: 'Дека прашањата не се важни.', good: false, reply: 'Прашањата се почеток на секое откритие.' },
      ]
    },
    {
      id: 'susa-unity',
      title: 'Свадбата на единството',
      text: 'Кога различни народи треба да живеат заедно, што носи трајна стабилност?',
      options: [
        { t: 'Соработка, почит и заеднички правила.', good: true, reply: 'Точно. Тоа е протокол на заеднички живот.' },
        { t: 'Постојана недоверба.', good: false, reply: 'Недовербата руши побрзо отколку што гради.' },
        { t: 'Немање правила.', good: false, reply: 'Без правила нема правичност.' },
      ]
    }
  ];

  const SCROLLS_OF_DAY = [
    'Знаењето е оган што се пали, не сад што се полни.',
    'Мостовите го прават светот поголем од ѕидовите.',
    'Почитта кон различноста е првиот чекор кон мир.',
    'Вистинскиот водач не освојува само земји, туку доверба.',
    'Секој свиток е мала врата кон поголем свет.',
    'Храброста без мудрост е брза; мудроста со храброст е пат.',
    'Културата не се брише — се разбира, се почитува и се поврзува.'
  ];

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('[v1.4] save failed', key, e); }
  }

  function protocolState() {
    return readJSON(PROTOCOL_KEY, {
      wisdomPoints: 0,
      correctAnswers: 0,
      scrollsRead: 0,
      completedMissions: {},
      daily: { date: TODAY, progress: 0, claimed: false }
    });
  }

  function saveProtocolState(ps) { writeJSON(PROTOCOL_KEY, ps); }

  function v14State() {
    return readJSON(V14_KEY, {
      scrollDay: null,
      scrollClaimedDate: null,
      protocolChoices: {},
      certificates: {},
      musicMode: 'calm',
      parentsSeen: false
    });
  }

  function saveV14(s) { writeJSON(V14_KEY, s); }

  function addWisdom(points, reason) {
    const ps = protocolState();
    ps.wisdomPoints = (ps.wisdomPoints || 0) + points;
    saveProtocolState(ps);
    updateWisdomMiniHud();
    showSmallToast('+' + points + ' мудрост · ' + reason);
  }

  function readGameState() {
    return readJSON(SAVE_KEY, {});
  }

  function currentLevel() {
    const s = readGameState();
    return Number(s.currentLevel || window.__AQ_SELECTED_LEVEL || 1) || 1;
  }

  function completedCount() {
    const s = readGameState();
    return Array.isArray(s.completedLevels) ? s.completedLevels.length : 0;
  }

  function getEpisodeForLevel(lv) {
    return EPISODES_V14.find(ep => lv >= ep.range[0] && lv <= ep.range[1]) || EPISODES_V14[0];
  }

  function showSmallToast(msg, duration = 2600) {
    if (window.PWA && typeof window.PWA.showToast === 'function') {
      window.PWA.showToast(msg, duration);
      return;
    }
    let el = document.getElementById('v14-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'v14-toast';
      el.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%) translateY(-120px);z-index:99999;background:linear-gradient(135deg,#1A1525,#7c2d12);color:#fff;padding:10px 16px;border-radius:999px;border:1px solid rgba(255,215,0,.45);font-family:Inter,sans-serif;font-size:13px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.45);transition:transform .35s;max-width:92vw;text-align:center';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(window.__V14_TOAST);
    window.__V14_TOAST = setTimeout(() => { el.style.transform = 'translateX(-50%) translateY(-120px)'; }, duration);
  }

  function ensureStyles() {
    if (document.getElementById('v14-styles')) return;
    const style = document.createElement('style');
    style.id = 'v14-styles';
    style.textContent = `
      .v14-card{background:rgba(0,0,0,.30);border:1px solid rgba(255,215,0,.20);border-radius:24px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,.25)}
      .v14-panel{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:16px}
      .v14-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,215,0,.35);background:rgba(255,215,0,.10);color:#FFD700;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700}
      .v14-btn{background:rgba(255,215,0,.15);border:1px solid rgba(255,215,0,.35);color:#FFD700;border-radius:14px;padding:10px 14px;font-weight:700;transition:.2s}
      .v14-btn:hover{background:rgba(255,215,0,.25);transform:translateY(-2px)}
      .v14-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
      @media(max-width:768px){.v14-grid{grid-template-columns:1fr}.v14-card{padding:16px}}
    `;
    document.head.appendChild(style);
  }

  function createScreen(id, html) {
    let screen = document.getElementById('screen-' + id);
    if (!screen) {
      screen = document.createElement('div');
      screen.id = 'screen-' + id;
      screen.className = 'screen min-h-screen p-4 relative z-10';
      document.body.insertBefore(screen, document.getElementById('mobile-controls') || null);
    }
    screen.innerHTML = html;
    return screen;
  }

  function menuButton(label, icon, onclick, extra = '') {
    return `<button onclick="${onclick}" class="game-btn-sm justify-center py-3 ${extra}">${icon} ${label}</button>`;
  }

  function injectMenuButtons() {
    const menuGrid = document.querySelector('#screen-menu .grid.grid-cols-2');
    if (!menuGrid || document.getElementById('btn-v14-episodes')) return;

    const wrap = document.createElement('div');
    wrap.className = 'contents';
    wrap.innerHTML = `
      <button id="btn-v14-episodes" onclick="AQV14.showEpisodes()" class="game-btn-sm justify-center py-3" style="background:linear-gradient(135deg,rgba(255,215,0,.14),rgba(168,85,247,.12));border-color:rgba(255,215,0,.35);color:#fde68a;">🧭 Епизоди</button>
      <button onclick="AQV14.showProtocolChoice()" class="game-btn-sm justify-center py-3" style="background:linear-gradient(135deg,rgba(34,197,94,.14),rgba(59,130,246,.12));border-color:rgba(34,197,94,.35);color:#86efac;">🤝 Протокол избор</button>
      <button onclick="AQV14.showScrollOfDay()" class="game-btn-sm justify-center py-3">📜 Свиток на денот</button>
      <button onclick="AQV14.showCertificates()" class="game-btn-sm justify-center py-3">🎓 Сертификати</button>
      <button onclick="AQV14.showParents()" class="game-btn-sm justify-center py-3">👨‍👩‍👧 За родители</button>
      <button onclick="AQV14.showMusic()" class="game-btn-sm justify-center py-3">🎵 Музика</button>
    `;
    menuGrid.appendChild(wrap);

    const dailyBtn = Array.from(menuGrid.querySelectorAll('button')).find(b => b.textContent.includes('Дневен Бонус'));
    if (dailyBtn) dailyBtn.innerHTML = dailyBtn.innerHTML.replace('Дневен Бонус', 'Дневна награда');

    applyFounderToolsMode();
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  function applyFounderToolsMode() {
    const isAdmin = new URLSearchParams(location.search).get('admin') === '1';
    const menuGrid = document.querySelector('#screen-menu .grid.grid-cols-2');
    if (!menuGrid) return;

    const keywords = ['Пасивни', 'Ad Giganti', 'Tracking', 'Bezbednos', 'Security'];
    Array.from(menuGrid.querySelectorAll('button')).forEach(btn => {
      if (keywords.some(k => btn.textContent.includes(k))) {
        btn.style.display = isAdmin ? '' : 'none';
      }
    });

    if (!isAdmin && !document.getElementById('v14-admin-hint')) {
      const hint = document.createElement('p');
      hint.id = 'v14-admin-hint';
      hint.className = 'text-center text-[#FFF8E7]/30 text-xs mt-2 col-span-2';
      hint.textContent = 'Founder tools се скриени од детското мени. Отвори со ?admin=1.';
      menuGrid.appendChild(hint);
    }
  }

  function renderDailyMiniCard() {
    const menu = document.querySelector('#screen-menu .max-w-md');
    if (!menu || document.getElementById('v14-scroll-mini')) return;
    const quote = SCROLLS_OF_DAY[new Date().getDay() % SCROLLS_OF_DAY.length];
    const div = document.createElement('div');
    div.id = 'v14-scroll-mini';
    div.className = 'v14-panel mb-4 text-center';
    div.innerHTML = `
      <div class="v14-chip mb-2">📜 Свиток на денот</div>
      <p class="text-sm text-[#FFF8E7]/75 italic">„${quote}“</p>
      <button onclick="AQV14.showScrollOfDay()" class="v14-btn mt-3 text-xs">Отвори свиток</button>
    `;
    const grid = menu.querySelector('.grid.grid-cols-2');
    if (grid) menu.insertBefore(div, grid);
  }

  function updateWisdomMiniHud() {
    const ps = protocolState();
    let row = document.getElementById('v14-wisdom-hud');
    const stats = document.getElementById('menu-stats');
    if (!stats) return;
    if (!row) {
      row = document.createElement('div');
      row.id = 'v14-wisdom-hud';
      row.className = 'text-center mb-4';
      stats.insertAdjacentElement('afterend', row);
    }
    row.innerHTML = `<span class="v14-chip">🧠 Мудрост: ${ps.wisdomPoints || 0}</span> <span class="v14-chip">✅ Одговори: ${ps.correctAnswers || 0}</span>`;
  }

  function showEpisodes() {
    const lv = currentLevel();
    const html = `
      <div class="max-w-5xl mx-auto py-8">
        <div class="v14-card text-center">
          <div class="v14-chip mb-4">🧭 Жива мапа на патувањето</div>
          <h2 class="text-3xl md:text-4xl font-cinzel text-yellow-400 mb-3">Епизодна приказна</h2>
          <p class="text-[#FFF8E7]/70 mb-6">Патот на Александар е поделен на шест образовни епизоди — од огнот на знаењето до наследството за светот.</p>
          <div class="v14-grid text-left">
            ${EPISODES_V14.map(ep => {
              const active = lv >= ep.range[0] && lv <= ep.range[1];
              const unlocked = lv >= ep.range[0] || completedCount() >= ep.range[0] - 1;
              return `<div class="v14-panel ${active ? 'ring-2 ring-yellow-400/60' : ''}" style="${unlocked ? '' : 'opacity:.45'}">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-4xl">${ep.icon}</span>
                  <div>
                    <p class="font-bold text-yellow-400">${ep.title}</p>
                    <p class="text-xs text-[#FFF8E7]/45">Ниво ${ep.range[0]}–${ep.range[1]}</p>
                  </div>
                </div>
                <p class="text-sm text-[#FFF8E7]/65">Тема: ${ep.theme}</p>
                <p class="text-xs mt-2 ${active ? 'text-green-400' : 'text-[#FFF8E7]/40'}">${active ? '▶ Тековна епизода' : unlocked ? 'Отклучена' : 'Заклучена'}</p>
              </div>`;
            }).join('')}
          </div>
          <button onclick="showScreen('menu')" class="game-btn mt-6">← Назад во мени</button>
        </div>
      </div>`;
    createScreen('episodes', html);
    showScreen('episodes');
  }

  function showProtocolChoice() {
    const state = v14State();
    const index = (currentLevel() + Object.keys(state.protocolChoices || {}).length) % PROTOCOL_CHOICES.length;
    const c = PROTOCOL_CHOICES[index];
    const answered = state.protocolChoices[c.id];
    const html = `
      <div class="max-w-3xl mx-auto py-8">
        <div class="v14-card text-center">
          <div class="v14-chip mb-4">🤝 Протокол избор</div>
          <h2 class="text-3xl font-cinzel text-yellow-400 mb-2">${c.title}</h2>
          <p class="text-[#FFF8E7]/75 mb-6">${c.text}</p>
          <div class="space-y-3">
            ${c.options.map((o, i) => `<button onclick="AQV14.answerProtocol('${c.id}', ${i})" class="w-full v14-btn text-left ${answered ? 'opacity-60' : ''}">${String.fromCharCode(65+i)}) ${o.t}</button>`).join('')}
          </div>
          <div id="v14-choice-result" class="mt-5 text-sm text-[#FFF8E7]/70">${answered ? 'Овој избор е веќе одговорен. Можеш да продолжиш со следниот предизвик.' : 'Избери мудро — протоколот е уметност на однесување.'}</div>
          <button onclick="showScreen('menu')" class="game-btn mt-6">← Назад</button>
        </div>
      </div>`;
    createScreen('protocolchoice', html);
    showScreen('protocolchoice');
  }

  function answerProtocol(id, optionIndex) {
    const c = PROTOCOL_CHOICES.find(x => x.id === id);
    if (!c) return;
    const opt = c.options[optionIndex];
    const state = v14State();
    state.protocolChoices = state.protocolChoices || {};
    if (!state.protocolChoices[id]) {
      state.protocolChoices[id] = { answer: optionIndex, correct: !!opt.good, date: new Date().toISOString() };
      saveV14(state);
      if (opt.good) {
        const ps = protocolState();
        ps.correctAnswers = (ps.correctAnswers || 0) + 1;
        saveProtocolState(ps);
        addWisdom(25, 'правилен протокол избор');
      } else {
        addWisdom(5, 'обид за протокол избор');
      }
    }
    const res = document.getElementById('v14-choice-result');
    if (res) res.innerHTML = `<strong class="${opt.good ? 'text-green-400' : 'text-orange-300'}">${opt.good ? 'Точно!' : 'Размисли повторно.'}</strong><br>${opt.reply}`;
  }

  function showScrollOfDay() {
    const quote = SCROLLS_OF_DAY[new Date().getDay() % SCROLLS_OF_DAY.length];
    const state = v14State();
    const claimed = state.scrollClaimedDate === TODAY;
    const html = `
      <div class="max-w-3xl mx-auto py-8">
        <div class="v14-card text-center">
          <div class="text-6xl mb-3">📜</div>
          <h2 class="text-3xl font-cinzel text-yellow-400 mb-4">Свиток на денот</h2>
          <p class="text-xl md:text-2xl font-caveat text-[#FFF8E7]/85 mb-6">„${quote}“</p>
          <p class="text-[#FFF8E7]/60 mb-5">Прочитај го свитокот и земи мала дневна мудрост.</p>
          <button onclick="AQV14.claimScrollOfDay()" class="game-btn" ${claimed ? 'disabled style="opacity:.55"' : ''}>${claimed ? '✅ Денес е прочитан' : 'Земи +10 мудрост'}</button>
          <br><button onclick="showScreen('menu')" class="v14-btn mt-5">← Назад</button>
        </div>
      </div>`;
    createScreen('scrollofday', html);
    showScreen('scrollofday');
  }

  function claimScrollOfDay() {
    const s = v14State();
    if (s.scrollClaimedDate === TODAY) {
      showSmallToast('Свитокот денес веќе е прочитан.');
      return;
    }
    s.scrollClaimedDate = TODAY;
    saveV14(s);
    const ps = protocolState();
    ps.scrollsRead = (ps.scrollsRead || 0) + 1;
    saveProtocolState(ps);
    addWisdom(10, 'свиток на денот');
    showScrollOfDay();
  }

  function certificateStatus() {
    const c = completedCount();
    return [
      { id: 'traveler', at: 8, icon: '🎓', title: 'Мал Патник на Светлината', ok: c >= 8 },
      { id: 'keeper', at: 20, icon: '🏛️', title: 'Чувар на Знаењето', ok: c >= 20 },
      { id: 'ambassador', at: 37, icon: '👑', title: 'Амбасадор на Мудроста', ok: c >= 37 },
    ];
  }

  function showCertificates() {
    const ps = protocolState();
    const html = `
      <div class="max-w-5xl mx-auto py-8">
        <div class="v14-card text-center">
          <div class="v14-chip mb-4">🎓 Детски сертификати</div>
          <h2 class="text-3xl font-cinzel text-yellow-400 mb-3">Пат на признанија</h2>
          <p class="text-[#FFF8E7]/70 mb-6">Сертификатите се отклучуваат со напредок низ играта.</p>
          <div class="v14-grid">
            ${certificateStatus().map(cert => `<div class="v14-panel text-center ${cert.ok ? 'ring-2 ring-green-400/50' : 'opacity:.55'}">
              <div class="text-6xl mb-3">${cert.icon}</div>
              <h3 class="font-bold text-yellow-400 text-lg">${cert.title}</h3>
              <p class="text-sm text-[#FFF8E7]/60">Се отклучува после ниво ${cert.at}</p>
              <p class="mt-3 ${cert.ok ? 'text-green-400' : 'text-[#FFF8E7]/40'}">${cert.ok ? '✅ Отклучен' : '🔒 Заклучен'}</p>
              ${cert.ok ? `<button onclick="AQV14.printCertificate('${cert.id}')" class="v14-btn mt-3 text-sm">Покажи сертификат</button>` : ''}
            </div>`).join('')}
          </div>
          <p class="text-xs text-[#FFF8E7]/40 mt-5">Мудрост: ${ps.wisdomPoints || 0} · Завршени нивоа: ${completedCount()}</p>
          <button onclick="showScreen('menu')" class="game-btn mt-6">← Назад</button>
        </div>
      </div>`;
    createScreen('certificates', html);
    showScreen('certificates');
  }

  function printCertificate(id) {
    const cert = certificateStatus().find(c => c.id === id);
    if (!cert || !cert.ok) return;
    const ps = protocolState();
    const s = readGameState();
    const name = s.playerName || 'Гостин';
    const html = `
      <div class="max-w-3xl mx-auto py-8">
        <div class="v14-card text-center" style="border:3px solid rgba(255,215,0,.5)">
          <div class="text-7xl mb-4">${cert.icon}</div>
          <h2 class="text-3xl font-cinzel text-yellow-400 mb-2">${cert.title}</h2>
          <p class="text-[#FFF8E7]/70 mb-4">се доделува на</p>
          <h3 class="text-2xl text-white font-bold mb-4">${name}</h3>
          <p class="text-[#FFF8E7]/70">за патување низ „Мисија на Александар — Патот на Светлината“</p>
          <div class="mt-5 v14-chip">🧠 Мудрост: ${ps.wisdomPoints || 0}</div>
          <p class="text-xs text-[#FFF8E7]/40 mt-5">Креирано од Санде — ИНОВАТОРОТ · ${new Date().toLocaleDateString()}</p>
          <button onclick="window.print()" class="game-btn mt-6">Печати / Зачувај PDF</button>
          <button onclick="AQV14.showCertificates()" class="v14-btn mt-6 ml-2">Назад</button>
        </div>
      </div>`;
    createScreen('certificateprint', html);
    showScreen('certificateprint');
  }

  function showParents() {
    const html = `
      <div class="max-w-4xl mx-auto py-8">
        <div class="v14-card">
          <div class="text-center">
            <div class="v14-chip mb-4">👨‍👩‍👧 За родители</div>
            <h2 class="text-3xl font-cinzel text-yellow-400 mb-3">Безбедна образовна авантура</h2>
            <p class="text-[#FFF8E7]/70 mb-6">Овој екран објаснува што е играта и како е поставена.</p>
          </div>
          <div class="v14-grid">
            <div class="v14-panel"><h3 class="font-bold text-yellow-400 mb-2">🎓 Образовна цел</h3><p class="text-sm text-[#FFF8E7]/70">Играта ги учи децата за знаење, мудрост, културна почит, протокол и лидерство преку авантура.</p></div>
            <div class="v14-panel"><h3 class="font-bold text-yellow-400 mb-2">🧒 За деца</h3><p class="text-sm text-[#FFF8E7]/70">Фокусот е на истражување, собирање свитоци, прашања и позитивни вредности — не на насилство.</p></div>
            <div class="v14-panel"><h3 class="font-bold text-yellow-400 mb-2">🤖 AI помошници</h3><p class="text-sm text-[#FFF8E7]/70">AI помошниците во играта се контролирани/симулирани водичи во интерфејсот, не отворен chat со непознати луѓе.</p></div>
            <div class="v14-panel"><h3 class="font-bold text-yellow-400 mb-2">💛 Поддршка</h3><p class="text-sm text-[#FFF8E7]/70">Првите 8 нивоа се бесплатни. Поддршката од $0.99 е наменета за развој и одржување на проектот.</p></div>
          </div>
          <div class="text-center mt-6">
            <button onclick="showScreen('menu')" class="game-btn">← Назад во мени</button>
          </div>
        </div>
      </div>`;
    createScreen('parents', html);
    showScreen('parents');
  }

  // Original WebAudio Macedonian ethno-antique inspired modes.
  const Music = {
    ctx: null,
    timer: null,
    playing: false,
    mode: null,
    modes: {
      calm: { name: 'Мирен кавал', notes: [293.66, 329.63, 392, 440, 392, 329.63], tempo: 900, wave: 'sine' },
      adventure: { name: 'Авантуристички тапан', notes: [220, 293.66, 329.63, 392, 440, 392, 329.63, 293.66], tempo: 520, wave: 'triangle' },
      victory: { name: 'Победничка светлина', notes: [392, 440, 493.88, 587.33, 493.88, 440, 392], tempo: 420, wave: 'sine' }
    },
    start(mode) {
      this.stop();
      this.mode = mode || v14State().musicMode || 'calm';
      const cfg = this.modes[this.mode] || this.modes.calm;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) { showSmallToast('Овој browser не поддржува WebAudio.'); return; }
      this.ctx = new AudioContext();
      this.playing = true;
      let i = 0;
      const playNote = () => {
        if (!this.playing || !this.ctx) return;
        const freq = cfg.notes[i % cfg.notes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = cfg.wave;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);

        // soft drone every 4 notes
        if (i % 4 === 0) {
          const d = this.ctx.createOscillator();
          const dg = this.ctx.createGain();
          d.type = 'sine';
          d.frequency.value = 110;
          dg.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          dg.gain.exponentialRampToValueAtTime(0.018, this.ctx.currentTime + 0.1);
          dg.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
          d.connect(dg).connect(this.ctx.destination);
          d.start();
          d.stop(this.ctx.currentTime + 1.25);
        }
        i++;
      };
      playNote();
      this.timer = setInterval(playNote, cfg.tempo);
      showSmallToast('🎵 Музика: ' + cfg.name);
    },
    stop() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      if (this.ctx) {
        try { this.ctx.close(); } catch (e) {}
      }
      this.ctx = null;
    },
    toggle(mode) {
      const s = v14State();
      if (mode) { s.musicMode = mode; saveV14(s); }
      if (this.playing && (!mode || mode === this.mode)) this.stop();
      else this.start(mode || s.musicMode || 'calm');
      renderMusicButtons();
    }
  };

  function showMusic() {
    const s = v14State();
    const html = `
      <div class="max-w-3xl mx-auto py-8">
        <div class="v14-card text-center">
          <div class="v14-chip mb-4">🎵 Македонска етно-античка атмосфера</div>
          <h2 class="text-3xl font-cinzel text-yellow-400 mb-3">Музички режими</h2>
          <p class="text-[#FFF8E7]/70 mb-6">Ова е оригинална WebAudio музика генерирана во browser — без туѓи copyrighted песни.</p>
          <div id="v14-music-buttons" class="v14-grid"></div>
          <button onclick="AQV14.musicStop()" class="v14-btn mt-5">⏹ Исклучи музика</button>
          <button onclick="showScreen('menu')" class="game-btn mt-5 ml-2">← Назад</button>
        </div>
      </div>`;
    createScreen('music', html);
    showScreen('music');
    renderMusicButtons();
  }

  function renderMusicButtons() {
    const box = document.getElementById('v14-music-buttons');
    if (!box) return;
    const s = v14State();
    box.innerHTML = Object.keys(Music.modes).map(key => {
      const cfg = Music.modes[key];
      return `<button onclick="AQV14.musicToggle('${key}')" class="v14-panel text-center ${s.musicMode === key ? 'ring-2 ring-yellow-400/60' : ''}">
        <div class="text-4xl mb-2">${key === 'calm' ? '🪈' : key === 'adventure' ? '🥁' : '👑'}</div>
        <p class="font-bold text-yellow-400">${cfg.name}</p>
        <p class="text-xs text-[#FFF8E7]/50">${Music.playing && Music.mode === key ? 'Се репродуцира' : 'Кликни за пуштање'}</p>
      </button>`;
    }).join('');
  }

  function patchLevelComplete() {
    if (window.__V14_COMPLETE_PATCH || typeof window.showLevelComplete !== 'function') return;
    window.__V14_COMPLETE_PATCH = true;
    const original = window.showLevelComplete;
    window.showLevelComplete = function (level, score, coins, scrolls, time, stars) {
      const result = original(level, score, coins, scrolls, time, stars);
      setTimeout(() => {
        const ep = getEpisodeForLevel(Number(level) || 1);
        const modal = document.getElementById('modal-complete');
        if (!modal || document.getElementById('v14-complete-extra')) return;
        const target = modal.querySelector('.bg-gradient-to-br, .rounded-3xl, .bg-black\\/80') || modal.firstElementChild;
        const extra = document.createElement('div');
        extra.id = 'v14-complete-extra';
        extra.className = 'v14-panel mt-4 text-center';
        extra.innerHTML = `
          <div class="v14-chip mb-2">${ep.icon} ${ep.title}</div>
          <p class="text-sm text-[#FFF8E7]/70">Што научи: мудриот пат не е само да стигнеш до крај, туку да собереш знаење, почит и протокол.</p>
          <p class="text-xs text-yellow-400 mt-2">Следна дестинација: ${getEpisodeForLevel(Math.min((Number(level)||1)+1,37)).title}</p>
        `;
        if (target) target.appendChild(extra);
      }, 100);
      return result;
    };
  }

  function patchStartLevelStory() {
    if (window.__V14_START_PATCH || typeof window.startLevel !== 'function') return;
    window.__V14_START_PATCH = true;
    const original = window.startLevel;
    window.startLevel = function (level) {
      const lv = Number(level) || 1;
      const ep = getEpisodeForLevel(lv);
      showSmallToast(`${ep.icon} Ниво ${lv}: ${ep.title}`, 3200);
      return original(level);
    };
  }

  function waitForGameFunctions() {
    if (typeof window.startLevel === 'function') {
      patchStartLevelStory();
      patchLevelComplete();
      return;
    }
    setTimeout(waitForGameFunctions, 150);
  }

  function init() {
    ensureStyles();
    injectMenuButtons();
    renderDailyMiniCard();
    updateWisdomMiniHud();
    waitForGameFunctions();

    window.AQV14 = {
      showEpisodes,
      showProtocolChoice,
      answerProtocol,
      showScrollOfDay,
      claimScrollOfDay,
      showCertificates,
      printCertificate,
      showParents,
      showMusic,
      musicToggle: mode => Music.toggle(mode),
      musicStop: () => { Music.stop(); renderMusicButtons(); showSmallToast('Музиката е исклучена.'); },
      state: v14State
    };

    console.log('[v1.4] More Dynamic Macedonian Edition active');
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
