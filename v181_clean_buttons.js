// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.8.1 — CLEAN BUTTONS FIX
// Ги трга floating копчињата „Задачи“ и „Етно музика“ од долу.
// Ги става како нормални копчиња во главното мени.
// ============================================================
(function(){
  'use strict';

  const AQCleanButtons = {
    init(){
      this.injectStyles();
      this.cleanFloatingButtons();
      this.addMenuButtons();
      this.keepClean();
      console.log('[AQ Clean Buttons] v1.8.1 initialized');
    },

    injectStyles(){
      if(document.getElementById('aq-clean-buttons-style')) return;
      const s = document.createElement('style');
      s.id = 'aq-clean-buttons-style';
      s.textContent = `
        /* Hide old floating controls that overlapped bottom corners */
        #aq-agent-fab,
        #aq17-music,
        #aq-music-toggle {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .aq-menu-tools-panel {
          margin: 14px auto 0;
          max-width: 560px;
          padding: 13px;
          border-radius: 20px;
          border: 1px solid rgba(255,215,0,.30);
          background: linear-gradient(135deg, rgba(255,215,0,.10), rgba(74,144,226,.10));
          box-shadow: 0 10px 26px rgba(0,0,0,.24);
        }

        .aq-menu-tools-title {
          text-align: center;
          color: #FFD700;
          font-weight: 900;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .aq-menu-tools-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .aq-menu-tool-btn {
          padding: 12px 13px;
          border-radius: 16px;
          border: 1px solid rgba(255,215,0,.34);
          background: rgba(255,215,0,.13);
          color: #FFD700;
          font-weight: 900;
          cursor: pointer;
          transition: .2s ease;
          font-family: Inter, sans-serif;
        }

        .aq-menu-tool-btn:hover {
          background: rgba(255,215,0,.24);
          transform: translateY(-1px);
        }

        .aq-menu-tool-btn.secondary {
          border-color: rgba(74,144,226,.38);
          background: rgba(74,144,226,.13);
          color: #9fd0ff;
        }

        .aq-menu-tool-note {
          text-align: center;
          margin-top: 8px;
          color: rgba(255,248,231,.55);
          font-size: 12px;
          line-height: 1.35;
        }

        @media(max-width: 560px){
          .aq-menu-tools-row { grid-template-columns: 1fr; }
        }
      `;
      document.head.appendChild(s);
    },

    cleanFloatingButtons(){
      ['aq-agent-fab','aq17-music','aq-music-toggle'].forEach(id => {
        const el = document.getElementById(id);
        if(el){
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          el.setAttribute('aria-hidden','true');
        }
      });
    },

    addMenuButtons(){
      setTimeout(() => {
        if(document.getElementById('aq-menu-tools-panel')) return;

        const box = document.querySelector('#screen-menu .mb-8') || document.querySelector('#screen-menu');
        if(!box){
          setTimeout(() => this.addMenuButtons(), 300);
          return;
        }

        const panel = document.createElement('div');
        panel.id = 'aq-menu-tools-panel';
        panel.className = 'aq-menu-tools-panel';
        panel.innerHTML = `
          <div class="aq-menu-tools-title">⚙️ Брзи алатки</div>
          <div class="aq-menu-tools-row">
            <button id="aq-menu-music-btn" class="aq-menu-tool-btn">🥁 Вклучи 7/8 ритам</button>
            <button id="aq-menu-tasks-btn" class="aq-menu-tool-btn secondary">🤖 AI задачи</button>
          </div>
          <div class="aq-menu-tool-note">
            Копчињата се преместени овде за да не се преклопуваат со играта и мобилните контроли.
          </div>
        `;

        box.appendChild(panel);

        const musicBtn = document.getElementById('aq-menu-music-btn');
        const tasksBtn = document.getElementById('aq-menu-tasks-btn');

        musicBtn.onclick = () => {
          if(window.AQ17 && typeof window.AQ17.toggleMusic === 'function'){
            window.AQ17.toggleMusic();
            setTimeout(() => {
              musicBtn.textContent = window.AQ17.playing ? '🔇 Исклучи 7/8 ритам' : '🥁 Вклучи 7/8 ритам';
            }, 80);
          } else if(window.AQDynamic && typeof window.AQDynamic.toggleMusic === 'function'){
            window.AQDynamic.toggleMusic();
          } else {
            alert('Музичкиот систем уште не е вчитан. Освежи ја страницата со ?v=1.8.1');
          }
        };

        tasksBtn.onclick = () => {
          if(window.AQAgents && typeof window.AQAgents.openTaskBoard === 'function'){
            window.AQAgents.openTaskBoard();
          } else {
            alert('AI задачите уште не се вчитани. Освежи ја страницата со ?v=1.8.1');
          }
        };
      }, 1000);
    },

    keepClean(){
      setInterval(() => this.cleanFloatingButtons(), 1000);
    }
  };

  if(document.readyState !== 'loading') AQCleanButtons.init();
  else document.addEventListener('DOMContentLoaded', () => AQCleanButtons.init());

  window.AQCleanButtons = AQCleanButtons;
})();
