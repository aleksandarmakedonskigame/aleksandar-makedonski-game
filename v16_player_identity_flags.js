// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.6 — PLAYER NAME + WORLD FLAGS
// Име на играч · знаме/земја · зачувување во прогрес
// ============================================================
(function () {
  'use strict';

  const SAVE_KEY = 'alexander_quest_save';
  const COUNTRIES = [{"code": "MK", "flag": "🇲🇰", "name": "Македонија"}, {"code": "AL", "flag": "🇦🇱", "name": "Албанија"}, {"code": "RS", "flag": "🇷🇸", "name": "Србија"}, {"code": "BG", "flag": "🇧🇬", "name": "Бугарија"}, {"code": "GR", "flag": "🇬🇷", "name": "Грција"}, {"code": "XK", "flag": "🇽🇰", "name": "Косово"}, {"code": "ME", "flag": "🇲🇪", "name": "Црна Гора"}, {"code": "BA", "flag": "🇧🇦", "name": "Босна и Херцеговина"}, {"code": "HR", "flag": "🇭🇷", "name": "Хрватска"}, {"code": "SI", "flag": "🇸🇮", "name": "Словенија"}, {"code": "RO", "flag": "🇷🇴", "name": "Романија"}, {"code": "TR", "flag": "🇹🇷", "name": "Турција"}, {"code": "IT", "flag": "🇮🇹", "name": "Италија"}, {"code": "FR", "flag": "🇫🇷", "name": "Франција"}, {"code": "DE", "flag": "🇩🇪", "name": "Германија"}, {"code": "AT", "flag": "🇦🇹", "name": "Австрија"}, {"code": "CH", "flag": "🇨🇭", "name": "Швајцарија"}, {"code": "ES", "flag": "🇪🇸", "name": "Шпанија"}, {"code": "PT", "flag": "🇵🇹", "name": "Португалија"}, {"code": "GB", "flag": "🇬🇧", "name": "Обединето Кралство"}, {"code": "IE", "flag": "🇮🇪", "name": "Ирска"}, {"code": "NL", "flag": "🇳🇱", "name": "Холандија"}, {"code": "BE", "flag": "🇧🇪", "name": "Белгија"}, {"code": "LU", "flag": "🇱🇺", "name": "Луксембург"}, {"code": "DK", "flag": "🇩🇰", "name": "Данска"}, {"code": "SE", "flag": "🇸🇪", "name": "Шведска"}, {"code": "NO", "flag": "🇳🇴", "name": "Норвешка"}, {"code": "FI", "flag": "🇫🇮", "name": "Финска"}, {"code": "IS", "flag": "🇮🇸", "name": "Исланд"}, {"code": "PL", "flag": "🇵🇱", "name": "Полска"}, {"code": "CZ", "flag": "🇨🇿", "name": "Чешка"}, {"code": "SK", "flag": "🇸🇰", "name": "Словачка"}, {"code": "HU", "flag": "🇭🇺", "name": "Унгарија"}, {"code": "UA", "flag": "🇺🇦", "name": "Украина"}, {"code": "MD", "flag": "🇲🇩", "name": "Молдавија"}, {"code": "RU", "flag": "🇷🇺", "name": "Русија"}, {"code": "BY", "flag": "🇧🇾", "name": "Белорусија"}, {"code": "LT", "flag": "🇱🇹", "name": "Литванија"}, {"code": "LV", "flag": "🇱🇻", "name": "Латвија"}, {"code": "EE", "flag": "🇪🇪", "name": "Естонија"}, {"code": "MT", "flag": "🇲🇹", "name": "Малта"}, {"code": "CY", "flag": "🇨🇾", "name": "Кипар"}, {"code": "US", "flag": "🇺🇸", "name": "САД"}, {"code": "CA", "flag": "🇨🇦", "name": "Канада"}, {"code": "MX", "flag": "🇲🇽", "name": "Мексико"}, {"code": "BR", "flag": "🇧🇷", "name": "Бразил"}, {"code": "AR", "flag": "🇦🇷", "name": "Аргентина"}, {"code": "CL", "flag": "🇨🇱", "name": "Чиле"}, {"code": "PE", "flag": "🇵🇪", "name": "Перу"}, {"code": "CO", "flag": "🇨🇴", "name": "Колумбија"}, {"code": "VE", "flag": "🇻🇪", "name": "Венецуела"}, {"code": "UY", "flag": "🇺🇾", "name": "Уругвај"}, {"code": "PY", "flag": "🇵🇾", "name": "Парагвај"}, {"code": "BO", "flag": "🇧🇴", "name": "Боливија"}, {"code": "EC", "flag": "🇪🇨", "name": "Еквадор"}, {"code": "CU", "flag": "🇨🇺", "name": "Куба"}, {"code": "DO", "flag": "🇩🇴", "name": "Доминиканска Република"}, {"code": "JP", "flag": "🇯🇵", "name": "Јапонија"}, {"code": "CN", "flag": "🇨🇳", "name": "Кина"}, {"code": "KR", "flag": "🇰🇷", "name": "Јужна Кореја"}, {"code": "IN", "flag": "🇮🇳", "name": "Индија"}, {"code": "PK", "flag": "🇵🇰", "name": "Пакистан"}, {"code": "BD", "flag": "🇧🇩", "name": "Бангладеш"}, {"code": "LK", "flag": "🇱🇰", "name": "Шри Ланка"}, {"code": "NP", "flag": "🇳🇵", "name": "Непал"}, {"code": "ID", "flag": "🇮🇩", "name": "Индонезија"}, {"code": "MY", "flag": "🇲🇾", "name": "Малезија"}, {"code": "SG", "flag": "🇸🇬", "name": "Сингапур"}, {"code": "TH", "flag": "🇹🇭", "name": "Тајланд"}, {"code": "VN", "flag": "🇻🇳", "name": "Виетнам"}, {"code": "PH", "flag": "🇵🇭", "name": "Филипини"}, {"code": "KH", "flag": "🇰🇭", "name": "Камбоџа"}, {"code": "LA", "flag": "🇱🇦", "name": "Лаос"}, {"code": "MM", "flag": "🇲🇲", "name": "Мјанмар"}, {"code": "MN", "flag": "🇲🇳", "name": "Монголија"}, {"code": "KZ", "flag": "🇰🇿", "name": "Казахстан"}, {"code": "UZ", "flag": "🇺🇿", "name": "Узбекистан"}, {"code": "KG", "flag": "🇰🇬", "name": "Киргистан"}, {"code": "TJ", "flag": "🇹🇯", "name": "Таџикистан"}, {"code": "TM", "flag": "🇹🇲", "name": "Туркменистан"}, {"code": "AF", "flag": "🇦🇫", "name": "Авганистан"}, {"code": "IR", "flag": "🇮🇷", "name": "Иран"}, {"code": "IQ", "flag": "🇮🇶", "name": "Ирак"}, {"code": "SY", "flag": "🇸🇾", "name": "Сирија"}, {"code": "LB", "flag": "🇱🇧", "name": "Либан"}, {"code": "JO", "flag": "🇯🇴", "name": "Јордан"}, {"code": "IL", "flag": "🇮🇱", "name": "Израел"}, {"code": "PS", "flag": "🇵🇸", "name": "Палестина"}, {"code": "SA", "flag": "🇸🇦", "name": "Саудиска Арабија"}, {"code": "AE", "flag": "🇦🇪", "name": "ОАЕ"}, {"code": "QA", "flag": "🇶🇦", "name": "Катар"}, {"code": "KW", "flag": "🇰🇼", "name": "Кувајт"}, {"code": "BH", "flag": "🇧🇭", "name": "Бахреин"}, {"code": "OM", "flag": "🇴🇲", "name": "Оман"}, {"code": "YE", "flag": "🇾🇪", "name": "Јемен"}, {"code": "EG", "flag": "🇪🇬", "name": "Египет"}, {"code": "MA", "flag": "🇲🇦", "name": "Мароко"}, {"code": "DZ", "flag": "🇩🇿", "name": "Алжир"}, {"code": "TN", "flag": "🇹🇳", "name": "Тунис"}, {"code": "LY", "flag": "🇱🇾", "name": "Либија"}, {"code": "SD", "flag": "🇸🇩", "name": "Судан"}, {"code": "ET", "flag": "🇪🇹", "name": "Етиопија"}, {"code": "ER", "flag": "🇪🇷", "name": "Еритреја"}, {"code": "SO", "flag": "🇸🇴", "name": "Сомалија"}, {"code": "DJ", "flag": "🇩🇯", "name": "Џибути"}, {"code": "KE", "flag": "🇰🇪", "name": "Кенија"}, {"code": "UG", "flag": "🇺🇬", "name": "Уганда"}, {"code": "TZ", "flag": "🇹🇿", "name": "Танзанија"}, {"code": "RW", "flag": "🇷🇼", "name": "Руанда"}, {"code": "BI", "flag": "🇧🇮", "name": "Бурунди"}, {"code": "ZA", "flag": "🇿🇦", "name": "Јужна Африка"}, {"code": "NA", "flag": "🇳🇦", "name": "Намибија"}, {"code": "BW", "flag": "🇧🇼", "name": "Боцвана"}, {"code": "ZW", "flag": "🇿🇼", "name": "Зимбабве"}, {"code": "ZM", "flag": "🇿🇲", "name": "Замбија"}, {"code": "MZ", "flag": "🇲🇿", "name": "Мозамбик"}, {"code": "AO", "flag": "🇦🇴", "name": "Ангола"}, {"code": "NG", "flag": "🇳🇬", "name": "Нигерија"}, {"code": "GH", "flag": "🇬🇭", "name": "Гана"}, {"code": "CI", "flag": "🇨🇮", "name": "Брег на Слонова Коска"}, {"code": "SN", "flag": "🇸🇳", "name": "Сенегал"}, {"code": "ML", "flag": "🇲🇱", "name": "Мали"}, {"code": "NE", "flag": "🇳🇪", "name": "Нигер"}, {"code": "BF", "flag": "🇧🇫", "name": "Буркина Фасо"}, {"code": "CM", "flag": "🇨🇲", "name": "Камерун"}, {"code": "CD", "flag": "🇨🇩", "name": "ДР Конго"}, {"code": "CG", "flag": "🇨🇬", "name": "Конго"}, {"code": "GA", "flag": "🇬🇦", "name": "Габон"}, {"code": "GQ", "flag": "🇬🇶", "name": "Екваторијална Гвинеја"}, {"code": "AU", "flag": "🇦🇺", "name": "Австралија"}, {"code": "NZ", "flag": "🇳🇿", "name": "Нов Зеланд"}, {"code": "FJ", "flag": "🇫🇯", "name": "Фиџи"}, {"code": "PG", "flag": "🇵🇬", "name": "Папуа Нова Гвинеја"}];

  const AQIdentity = {
    init() {
      this.injectStyles();
      this.patchUpdateMenuWhenReady();
      this.injectPlayerPanel();
      console.log('[AQ Identity] v1.6 initialized');
    },

    readState() {
      try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); }
      catch (e) { return {}; }
    },

    writeState(s) {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(s || {})); }
      catch (e) { console.warn('[AQ Identity] save failed', e); }
    },

    injectStyles() {
      if (document.getElementById('aq-identity-style')) return;
      const style = document.createElement('style');
      style.id = 'aq-identity-style';
      style.textContent = `
        .aq-player-panel {
          margin: 14px auto 0;
          max-width: 520px;
          padding: 14px;
          border-radius: 22px;
          border: 1px solid rgba(255,215,0,.28);
          background: linear-gradient(135deg, rgba(255,215,0,.10), rgba(74,144,226,.10));
          box-shadow: 0 10px 28px rgba(0,0,0,.25);
        }
        .aq-player-row {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .aq-name-input {
          min-width: 220px;
          flex: 1;
          max-width: 300px;
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,215,0,.35);
          background: rgba(0,0,0,.28);
          color: #FFF8E7;
          outline: none;
          font-weight: 700;
          text-align: center;
        }
        .aq-name-input::placeholder { color: rgba(255,248,231,.42); }
        .aq-id-btn {
          padding: 10px 13px;
          border-radius: 14px;
          border: 1px solid rgba(255,215,0,.35);
          background: rgba(255,215,0,.14);
          color: #FFD700;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }
        .aq-id-btn:hover { background: rgba(255,215,0,.24); transform: translateY(-1px); }
        .aq-player-preview {
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,248,231,.72);
          text-align: center;
        }
        .aq-flag-modal {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(8px);
        }
        .aq-flag-modal.active { display: flex; }
        .aq-flag-card {
          width: min(980px, 96vw);
          max-height: 86vh;
          overflow: hidden;
          border-radius: 26px;
          border: 1px solid rgba(255,215,0,.38);
          background: linear-gradient(135deg, #151020, #22182f);
          box-shadow: 0 22px 70px rgba(0,0,0,.65);
          color: #FFF8E7;
        }
        .aq-flag-head {
          padding: 18px;
          border-bottom: 1px solid rgba(255,255,255,.08);
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .aq-flag-title { font-size: 20px; font-weight: 900; color: #FFD700; }
        .aq-flag-search {
          width: min(420px, 100%);
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,215,0,.25);
          background: rgba(0,0,0,.25);
          color: #FFF8E7;
          outline: none;
        }
        .aq-flag-grid {
          padding: 18px;
          max-height: 62vh;
          overflow: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
        }
        .aq-flag-option {
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.05);
          color: #FFF8E7;
          border-radius: 16px;
          padding: 11px 10px;
          cursor: pointer;
          text-align: left;
          transition: .2s ease;
          font-weight: 700;
        }
        .aq-flag-option:hover {
          border-color: rgba(255,215,0,.55);
          background: rgba(255,215,0,.12);
          transform: translateY(-1px);
        }
        .aq-flag-option .flag { font-size: 24px; margin-right: 8px; }
        .aq-flag-foot {
          padding: 12px 18px 18px;
          display: flex;
          justify-content: center;
          gap: 10px;
          border-top: 1px solid rgba(255,255,255,.08);
        }
        @media (max-width: 600px) {
          .aq-player-row { flex-direction: column; }
          .aq-name-input { width: 100%; max-width: 100%; }
          .aq-id-btn { width: 100%; }
          .aq-flag-grid { grid-template-columns: 1fr 1fr; padding: 12px; }
          .aq-flag-option { font-size: 12px; padding: 10px 8px; }
        }
      `;
      document.head.appendChild(style);
    },

    patchUpdateMenuWhenReady() {
      const tryPatch = () => {
        if (typeof window.updateMenu !== 'function') {
          setTimeout(tryPatch, 160);
          return;
        }
        if (window.__AQ_IDENTITY_UPDATE_PATCHED) return;
        window.__AQ_IDENTITY_UPDATE_PATCHED = true;
        const original = window.updateMenu;
        window.updateMenu = function patchedUpdateMenu() {
          original();
          AQIdentity.refreshDisplayedName();
          AQIdentity.syncPanel();
        };
      };
      tryPatch();
    },

    injectPlayerPanel() {
      setTimeout(() => {
        if (document.getElementById('aq-player-panel')) {
          this.syncPanel();
          return;
        }

        const titleBox = document.querySelector('#screen-menu .mb-8') || document.querySelector('#screen-menu');
        if (!titleBox) {
          setTimeout(() => this.injectPlayerPanel(), 300);
          return;
        }

        const panel = document.createElement('div');
        panel.id = 'aq-player-panel';
        panel.className = 'aq-player-panel';
        panel.innerHTML = `
          <div class="aq-player-row">
            <input id="aq-player-name-input" class="aq-name-input" maxlength="24" placeholder="Напиши го твоето име" />
            <button id="aq-save-name-btn" class="aq-id-btn">✅ Зачувај име</button>
            <button id="aq-open-flags-btn" class="aq-id-btn">🌍 Избери знаме</button>
          </div>
          <div id="aq-player-preview" class="aq-player-preview"></div>
        `;
        titleBox.appendChild(panel);

        document.getElementById('aq-save-name-btn').onclick = () => this.saveName();
        document.getElementById('aq-open-flags-btn').onclick = () => this.openFlagModal();

        const input = document.getElementById('aq-player-name-input');
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') this.saveName();
        });
        input.addEventListener('blur', () => {
          if (input.value.trim()) this.saveName(false);
        });

        this.createFlagModal();
        this.syncPanel();
        this.refreshDisplayedName();
      }, 500);
    },

    saveName(showMessage = true) {
      const input = document.getElementById('aq-player-name-input');
      const name = (input?.value || '').trim().slice(0, 24);
      if (!name) return;
      const s = this.readState();
      s.playerName = name;
      this.writeState(s);
      this.refreshDisplayedName();
      this.syncPanel();
      if (showMessage) this.toast('✅ Името е зачувано: ' + name);
    },

    selectCountry(code) {
      const c = COUNTRIES.find(x => x.code === code);
      if (!c) return;
      const s = this.readState();
      s.playerCountry = c.code;
      s.playerCountryName = c.name;
      s.playerFlag = c.flag;
      this.writeState(s);
      this.refreshDisplayedName();
      this.syncPanel();
      this.closeFlagModal();
      this.toast(c.flag + ' Знамето е избрано: ' + c.name);
    },

    refreshDisplayedName() {
      const s = this.readState();
      const name = s.playerName || 'Гостин';
      const flag = s.playerFlag || '';
      const el = document.getElementById('player-name');
      if (el) el.textContent = (flag ? flag + ' ' : '') + name;
    },

    syncPanel() {
      const s = this.readState();
      const input = document.getElementById('aq-player-name-input');
      if (input && document.activeElement !== input) input.value = s.playerName && s.playerName !== 'Гостин' ? s.playerName : '';
      const preview = document.getElementById('aq-player-preview');
      if (preview) {
        const flag = s.playerFlag || '🌍';
        const country = s.playerCountryName || 'избери земја';
        const name = s.playerName || 'Гостин';
        preview.innerHTML = `Играч: <strong style="color:#FFD700">${flag} ${name}</strong> · Земја: <strong>${country}</strong>`;
      }
    },

    createFlagModal() {
      if (document.getElementById('aq-flag-modal')) return;
      const modal = document.createElement('div');
      modal.id = 'aq-flag-modal';
      modal.className = 'aq-flag-modal';
      modal.innerHTML = `
        <div class="aq-flag-card">
          <div class="aq-flag-head">
            <div>
              <div class="aq-flag-title">🌍 Избери знаме / земја</div>
              <div style="font-size:12px;color:rgba(255,248,231,.55);margin-top:4px">Знамето ќе се прикаже до името на играчот.</div>
            </div>
            <input id="aq-flag-search" class="aq-flag-search" placeholder="Барај земја..." />
          </div>
          <div id="aq-flag-grid" class="aq-flag-grid"></div>
          <div class="aq-flag-foot">
            <button id="aq-close-flags-btn" class="aq-id-btn">Затвори</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('aq-close-flags-btn').onclick = () => this.closeFlagModal();
      document.getElementById('aq-flag-search').oninput = e => this.renderFlags(e.target.value);
      modal.addEventListener('click', e => {
        if (e.target === modal) this.closeFlagModal();
      });
      this.renderFlags('');
    },

    renderFlags(query) {
      const q = (query || '').toLowerCase().trim();
      const grid = document.getElementById('aq-flag-grid');
      if (!grid) return;
      const list = COUNTRIES.filter(c =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.flag.includes(q)
      );
      grid.innerHTML = list.map(c => `
        <button class="aq-flag-option" data-code="${c.code}">
          <span class="flag">${c.flag}</span>${c.name}
        </button>
      `).join('');
      grid.querySelectorAll('.aq-flag-option').forEach(btn => {
        btn.onclick = () => this.selectCountry(btn.getAttribute('data-code'));
      });
    },

    openFlagModal() {
      this.createFlagModal();
      document.getElementById('aq-flag-modal')?.classList.add('active');
      setTimeout(() => document.getElementById('aq-flag-search')?.focus(), 100);
    },

    closeFlagModal() {
      document.getElementById('aq-flag-modal')?.classList.remove('active');
    },

    toast(message) {
      let t = document.getElementById('aq-identity-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'aq-identity-toast';
        t.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%) translateY(-120px);background:linear-gradient(135deg,#1A1525,#4A90E2);color:white;padding:12px 18px;border-radius:999px;z-index:100000;border:1px solid rgba(255,215,0,.38);font-family:Inter,sans-serif;font-weight:800;box-shadow:0 10px 32px rgba(0,0,0,.5);transition:.35s ease;text-align:center;max-width:92vw';
        document.body.appendChild(t);
      }
      t.textContent = message;
      t.style.transform = 'translateX(-50%) translateY(0)';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        t.style.transform = 'translateX(-50%) translateY(-120px)';
      }, 2600);
    }
  };

  if (document.readyState !== 'loading') AQIdentity.init();
  else document.addEventListener('DOMContentLoaded', () => AQIdentity.init());

  window.AQIdentity = AQIdentity;
})();
