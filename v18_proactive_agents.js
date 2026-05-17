// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.8 — PROACTIVE AI AGENTS
// Кими · GPT · Клод · Харви добиваат активни задачи
// ============================================================
(function(){
  'use strict';

  const SAVE_KEY = 'alexander_quest_save';
  const AGENT_KEY = 'alexander_agent_tasks_v18';

  const AGENTS = {
    kimi: {
      name: 'Кими',
      role: 'Водич на патот',
      emoji: '🧭',
      color: '#60A5FA',
      taskTitle: 'Провери ја следната дестинација',
      action: 'Води го играчот кон следниот чекор и потсети го на мисијата.',
      tips: [
        'Погледни напред: златните знаци го покажуваат патот.',
        'Ако патот е празен, барај ѕвезди и свитоци над платформите.',
        'Не брзај — прво набљудувај, потоа скокни.',
        'Секое ниво има свој ритам: најди го и ќе поминеш полесно.'
      ]
    },
    gpt: {
      name: 'GPT',
      role: 'Учител на мудроста',
      emoji: '🎓',
      color: '#FACC15',
      taskTitle: 'Додади историска поука',
      action: 'Објасни што детето учи од нивото и поврзи го со Александар.',
      tips: [
        'Знаењето е оган што се пали, не сад што се полни.',
        'Александар учел од Аристотел дека мудроста е поголема од силата.',
        'Мостовите се посилни од ѕидовите кога сакаме да поврземе луѓе.',
        'Кога почитуваш туѓа култура, стануваш посилен лидер.'
      ]
    },
    claude: {
      name: 'Клод',
      role: 'Мајстор на загатки',
      emoji: '🧩',
      color: '#C084FC',
      taskTitle: 'Постави микро-предизвик',
      action: 'Дава кратка задача за повеќе динамика во нивото.',
      tips: [
        'Мини задача: собери 3 ѕвезди без да паднеш.',
        'Мини задача: прескокни препрека со двоен скок.',
        'Мини задача: најди го свитокот пред да стигнеш до крајот.',
        'Мини задача: избегни метеор и продолжи без паника.'
      ]
    },
    harvey: {
      name: 'Харви',
      role: 'Мотиватор',
      emoji: '⚡',
      color: '#FB7185',
      taskTitle: 'Крени енергија',
      action: 'Охрабри го играчот и слави мали победи.',
      tips: [
        'Одлично одиш! Секој скок е чекор кон светлината.',
        'Не се откажувај — шампионите учат и кога ќе паднат.',
        'Собери уште една ѕвезда! Ти можеш повеќе.',
        'Ова е твоја мисија. Продолжи храбро!'
      ]
    }
  };

  const LEVEL_TASKS = [
    {type:'guide', title:'Патоказ', goal:'Стигни до крајот и собери барем 3 ѕвезди.', agents:['kimi','harvey']},
    {type:'wisdom', title:'Свиток на мудроста', goal:'Најди свиток и прочитај ја поуката.', agents:['gpt','kimi']},
    {type:'challenge', title:'Предизвик без пад', goal:'Поминеш дел од патот без да паднеш во празнина.', agents:['claude','harvey']},
    {type:'power', title:'Супер скок', goal:'Најди ја моќта од другарчињата и искористи двоен скок.', agents:['kimi','claude']},
    {type:'protocol', title:'Протокол избор', goal:'Избери мудар/мирен одговор кога ќе се појави избор.', agents:['gpt','claude']},
    {type:'focus', title:'Фокус и ритам', goal:'Следи го 7/8 ритамот и темпирај го скокот.', agents:['harvey','kimi']}
  ];

  const AQAgents = {
    currentLevel: 1,
    tickTimer: null,
    lastTipAt: 0,

    init(){
      this.injectStyles();
      this.injectAgentPanel();
      this.patchGameStart();
      this.patchLevelComplete();
      this.addMenuBadge();
      console.log('[AQ Agents] v1.8 initialized');
    },

    readState(){
      try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); }
      catch(e){ return {}; }
    },

    readAgentState(){
      try { return JSON.parse(localStorage.getItem(AGENT_KEY) || '{}'); }
      catch(e){ return {}; }
    },

    writeAgentState(s){
      try { localStorage.setItem(AGENT_KEY, JSON.stringify(s || {})); }
      catch(e){}
    },

    injectStyles(){
      if(document.getElementById('aq-agents-style')) return;
      const style = document.createElement('style');
      style.id = 'aq-agents-style';
      style.textContent = `
        .aq-agent-panel{
          margin:14px auto 0;
          max-width:740px;
          border:1px solid rgba(255,215,0,.28);
          background:linear-gradient(135deg,rgba(255,215,0,.10),rgba(74,144,226,.10));
          border-radius:24px;
          padding:14px;
          box-shadow:0 12px 30px rgba(0,0,0,.25);
        }
        .aq-agent-title{
          color:#FFD700;
          font-weight:900;
          text-align:center;
          margin-bottom:10px;
          font-size:15px;
        }
        .aq-agent-grid{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:9px;
        }
        .aq-agent-card{
          border:1px solid rgba(255,255,255,.10);
          background:rgba(0,0,0,.22);
          border-radius:18px;
          padding:10px;
          text-align:center;
          min-height:118px;
          position:relative;
          overflow:hidden;
        }
        .aq-agent-card.active{
          border-color:rgba(255,215,0,.58);
          background:rgba(255,215,0,.10);
          box-shadow:0 0 18px rgba(255,215,0,.18);
        }
        .aq-agent-emoji{font-size:28px;margin-bottom:4px}
        .aq-agent-name{font-weight:900;font-size:13px}
        .aq-agent-role{font-size:10px;color:rgba(255,248,231,.56);margin-bottom:5px}
        .aq-agent-task{font-size:10px;color:rgba(255,248,231,.78);line-height:1.25}
        .aq-agent-progress{
          height:5px;border-radius:999px;background:rgba(255,255,255,.08);
          overflow:hidden;margin-top:7px;
        }
        .aq-agent-progress > div{
          height:100%;border-radius:999px;background:linear-gradient(90deg,#FFD700,#4A90E2);
          width:0%;
        }
        .aq-agent-toast{
          position:fixed;
          left:50%;
          top:calc(18px + env(safe-area-inset-top));
          transform:translateX(-50%) translateY(-130px);
          z-index:100003;
          width:min(460px,92vw);
          border:1px solid rgba(255,215,0,.35);
          background:linear-gradient(135deg,rgba(21,16,32,.97),rgba(40,45,80,.94));
          color:#FFF8E7;
          padding:14px 16px;
          border-radius:22px;
          box-shadow:0 16px 50px rgba(0,0,0,.58);
          transition:.42s cubic-bezier(.2,.9,.25,1.2);
          font-family:Inter,sans-serif;
          font-size:13px;
          line-height:1.45;
        }
        .aq-agent-toast.show{transform:translateX(-50%) translateY(0)}
        .aq-agent-toast strong{color:#FFD700}
        .aq-agent-fab{
          position:fixed;
          left:16px;
          bottom:calc(72px + env(safe-area-inset-bottom));
          z-index:100000;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(255,215,0,.42);
          background:rgba(15,12,24,.92);
          color:#FFD700;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 8px 28px rgba(0,0,0,.5);
        }
        .aq-agent-modal{
          display:none;position:fixed;inset:0;z-index:100004;
          background:rgba(0,0,0,.72);backdrop-filter:blur(8px);
          align-items:center;justify-content:center;padding:18px;
        }
        .aq-agent-modal.active{display:flex}
        .aq-agent-modal-card{
          width:min(780px,95vw);max-height:84vh;overflow:auto;
          border-radius:26px;border:1px solid rgba(255,215,0,.38);
          background:linear-gradient(135deg,#151020,#241936);
          color:#FFF8E7;padding:20px;
        }
        .aq-task-row{
          padding:13px;border-radius:16px;border:1px solid rgba(255,255,255,.10);
          background:rgba(255,255,255,.05);margin-bottom:10px;
        }
        @media(max-width:760px){
          .aq-agent-grid{grid-template-columns:1fr 1fr}
          .aq-agent-panel{padding:11px}
          .aq-agent-card{min-height:104px}
        }
      `;
      document.head.appendChild(style);
    },

    injectAgentPanel(){
      setTimeout(() => {
        if(document.getElementById('aq-agent-panel')) {
          this.refreshAgentPanel();
          return;
        }
        const box = document.querySelector('#screen-menu .mb-8') || document.querySelector('#screen-menu');
        if(!box){
          setTimeout(() => this.injectAgentPanel(), 300);
          return;
        }
        const panel = document.createElement('div');
        panel.id = 'aq-agent-panel';
        panel.className = 'aq-agent-panel';
        panel.innerHTML = `
          <div class="aq-agent-title">🤖 Проактивни AI Помошници — секој има задача</div>
          <div id="aq-agent-grid" class="aq-agent-grid"></div>
        `;
        box.appendChild(panel);

        const fab = document.createElement('button');
        fab.id = 'aq-agent-fab';
        fab.className = 'aq-agent-fab';
        fab.textContent = '🤖 Задачи';
        fab.onclick = () => this.openTaskBoard();
        document.body.appendChild(fab);

        this.createTaskBoard();
        this.refreshAgentPanel();
      }, 700);
    },

    addMenuBadge(){
      setTimeout(() => {
        const box = document.querySelector('#screen-menu .mb-8');
        if(!box || document.getElementById('aq-agent-badge')) return;
        const b = document.createElement('div');
        b.id = 'aq-agent-badge';
        b.style.cssText = 'display:inline-block;margin-top:8px;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,215,0,.45);background:rgba(255,215,0,.10);color:#FFD700;font-size:12px;font-weight:900';
        b.textContent = '🤖 v1.8: AI агентите имаат активни задачи';
        box.appendChild(b);
      }, 900);
    },

    getLevelTask(level){
      return LEVEL_TASKS[(Math.max(1, Number(level)||1)-1) % LEVEL_TASKS.length];
    },

    getAgentProgress(agentKey){
      const s = this.readAgentState();
      return Math.min(100, Number(s[agentKey + '_xp'] || 0) % 100);
    },

    addAgentXP(agentKey, amount){
      const s = this.readAgentState();
      s[agentKey + '_xp'] = Number(s[agentKey + '_xp'] || 0) + Number(amount || 0);
      s.totalTasks = Number(s.totalTasks || 0) + 1;
      this.writeAgentState(s);
      this.refreshAgentPanel();
    },

    refreshAgentPanel(){
      const grid = document.getElementById('aq-agent-grid');
      if(!grid) return;
      const task = this.getLevelTask(this.currentLevel);
      grid.innerHTML = Object.keys(AGENTS).map(key => {
        const a = AGENTS[key];
        const active = task.agents.includes(key);
        const progress = this.getAgentProgress(key);
        return `
          <div class="aq-agent-card ${active ? 'active' : ''}" style="--agent-color:${a.color}">
            <div class="aq-agent-emoji">${a.emoji}</div>
            <div class="aq-agent-name" style="color:${a.color}">${a.name}</div>
            <div class="aq-agent-role">${a.role}</div>
            <div class="aq-agent-task">${active ? a.taskTitle : 'Подготвен за следна задача'}</div>
            <div class="aq-agent-progress"><div style="width:${progress}%"></div></div>
          </div>
        `;
      }).join('');
    },

    agentTip(agentKey, custom){
      const a = AGENTS[agentKey] || AGENTS.kimi;
      const tip = custom || a.tips[Math.floor(Math.random()*a.tips.length)];
      this.showToast(`<strong>${a.emoji} ${a.name} — ${a.role}</strong><br>${tip}`);
      this.addAgentXP(agentKey, 12);
    },

    showToast(html, duration=4300){
      let t = document.getElementById('aq-agent-toast');
      if(!t){
        t = document.createElement('div');
        t.id = 'aq-agent-toast';
        t.className = 'aq-agent-toast';
        document.body.appendChild(t);
      }
      t.innerHTML = html;
      t.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => t.classList.remove('show'), duration);
    },

    patchGameStart(){
      const tryPatch = () => {
        if(typeof window.startLevel !== 'function'){
          setTimeout(tryPatch, 180);
          return;
        }
        if(window.__AQ_AGENTS_START_PATCHED) return;
        window.__AQ_AGENTS_START_PATCHED = true;

        const originalStartLevel = window.startLevel;
        window.startLevel = function(level){
          const lv = Math.max(1, Math.min(37, parseInt(level,10) || 1));
          AQAgents.currentLevel = lv;
          AQAgents.refreshAgentPanel();
          const result = originalStartLevel(lv);
          AQAgents.onLevelStart(lv);
          return result;
        };

        console.log('[AQ Agents] startLevel patched');
      };
      tryPatch();
    },

    patchLevelComplete(){
      const tryPatch = () => {
        if(typeof window.showLevelComplete !== 'function'){
          setTimeout(tryPatch, 180);
          return;
        }
        if(window.__AQ_AGENTS_COMPLETE_PATCHED) return;
        window.__AQ_AGENTS_COMPLETE_PATCHED = true;

        const original = window.showLevelComplete;
        window.showLevelComplete = function(level, score, coins, scrolls, time, stars){
          const res = original(level, score, coins, scrolls, time, stars);
          AQAgents.onLevelComplete(level, score, coins, scrolls, stars);
          return res;
        };

        console.log('[AQ Agents] showLevelComplete patched');
      };
      tryPatch();
    },

    onLevelStart(level){
      this.currentLevel = level;
      const task = this.getLevelTask(level);
      this.refreshAgentPanel();
      const firstAgent = task.agents[0] || 'kimi';
      const secondAgent = task.agents[1] || 'harvey';
      setTimeout(() => {
        this.agentTip(firstAgent, `Денешна задача: <b>${task.title}</b><br>${task.goal}`);
      }, 900);
      setTimeout(() => {
        this.agentTip(secondAgent);
      }, 4200);

      this.startActiveLoop(level);
    },

    startActiveLoop(level){
      clearInterval(this.tickTimer);
      this.lastTipAt = Date.now();
      this.tickTimer = setInterval(() => {
        const gameActive = document.getElementById('screen-game')?.classList.contains('active');
        if(!gameActive) return;
        const now = Date.now();
        if(now - this.lastTipAt < 14500) return;
        this.lastTipAt = now;
        const task = this.getLevelTask(level);
        const candidates = task.agents.length ? task.agents : Object.keys(AGENTS);
        const key = candidates[Math.floor(Math.random()*candidates.length)];
        this.agentTip(key);
      }, 5000);
    },

    onLevelComplete(level, score, coins, scrolls, stars){
      const task = this.getLevelTask(level);
      const bonusAgent = stars >= 3 ? 'harvey' : (scrolls > 0 ? 'gpt' : 'kimi');
      this.addAgentXP(bonusAgent, stars >= 3 ? 28 : 18);

      const s = this.readAgentState();
      s.lastCompletedLevel = level;
      s.lastTask = task.title;
      s.lastScore = score;
      s.lastStars = stars;
      this.writeAgentState(s);

      setTimeout(() => {
        this.agentTip(bonusAgent, stars >= 3
          ? 'Совршено! 3 ѕвезди — ова е вистински Пат на Светлината.'
          : 'Добро помина. Следниот пат пробај да собереш повеќе ѕвезди и свитоци.');
      }, 1100);
    },

    createTaskBoard(){
      if(document.getElementById('aq-agent-modal')) return;
      const modal = document.createElement('div');
      modal.id = 'aq-agent-modal';
      modal.className = 'aq-agent-modal';
      modal.innerHTML = `
        <div class="aq-agent-modal-card">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px;flex-wrap:wrap">
            <div>
              <h2 style="color:#FFD700;font-size:24px;font-weight:900;margin:0">🤖 Табла на AI задачи</h2>
              <p style="opacity:.65;font-size:13px;margin-top:4px">Агентите не спијат — секој има улога во патот на играчот.</p>
            </div>
            <button id="aq-agent-close" class="aq-agent-fab" style="position:static">Затвори</button>
          </div>
          <div id="aq-agent-task-list"></div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('aq-agent-close').onclick = () => modal.classList.remove('active');
      modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('active'); });
    },

    openTaskBoard(){
      this.createTaskBoard();
      this.renderTaskBoard();
      document.getElementById('aq-agent-modal').classList.add('active');
    },

    renderTaskBoard(){
      const list = document.getElementById('aq-agent-task-list');
      if(!list) return;
      const s = this.readAgentState();
      const current = this.getLevelTask(this.currentLevel);
      const agentRows = Object.keys(AGENTS).map(key => {
        const a = AGENTS[key];
        const xp = Number(s[key + '_xp'] || 0);
        const lvl = Math.floor(xp / 100) + 1;
        return `
          <div class="aq-task-row">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:28px">${a.emoji}</span>
              <div style="flex:1">
                <b style="color:${a.color}">${a.name}</b> · <span style="opacity:.7">${a.role}</span>
                <div style="font-size:12px;opacity:.72;margin-top:3px">${a.action}</div>
              </div>
              <div style="color:#FFD700;font-weight:900">Lvl ${lvl}</div>
            </div>
          </div>
        `;
      }).join('');

      list.innerHTML = `
        <div class="aq-task-row" style="border-color:rgba(255,215,0,.35);background:rgba(255,215,0,.08)">
          <b style="color:#FFD700">Тековна задача за ниво ${this.currentLevel}: ${current.title}</b>
          <div style="font-size:13px;opacity:.8;margin-top:4px">${current.goal}</div>
        </div>
        ${agentRows}
        <div style="text-align:center;margin-top:14px">
          <button class="aq-agent-fab" style="position:static" onclick="AQAgents.agentTip('kimi')">🧭 Совет од Кими</button>
          <button class="aq-agent-fab" style="position:static;margin-left:6px" onclick="AQAgents.agentTip('gpt')">🎓 Поука од GPT</button>
          <button class="aq-agent-fab" style="position:static;margin-left:6px" onclick="AQAgents.agentTip('claude')">🧩 Предизвик од Клод</button>
          <button class="aq-agent-fab" style="position:static;margin-left:6px" onclick="AQAgents.agentTip('harvey')">⚡ Мотивација</button>
        </div>
      `;
    }
  };

  if(document.readyState !== 'loading') AQAgents.init();
  else document.addEventListener('DOMContentLoaded', () => AQAgents.init());

  window.AQAgents = AQAgents;
})();
