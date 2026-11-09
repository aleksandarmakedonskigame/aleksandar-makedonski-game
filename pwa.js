// ============================================================
// ALEXANDER GAME PWA + STABILITY PATCH v1.2.2
// Safe GitHub Pages patch loaded after game.js
// Fixes: next level after level 2, touch controls, safe guards,
// and 8-free-level access notice.
// ============================================================
(function () {
  'use strict';

  var SAVE_KEY = 'alexander_quest_save';
  var FREE_LEVEL_LIMIT = (window.GAME_EDITION && window.GAME_EDITION.fullUnlock) ? 37 : 8;
  var SUPPORT_PRICE = '$0.99';

  function readState() {
    if (window.AQStore) return window.AQStore.read();
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writeState(state) {
    if (window.AQStore) { window.AQStore.write(state); return; }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state || {}));
    } catch (e) {
      console.warn('[AQ] save failed', e);
    }
  }

  function isSupportActive() {
    var s = readState();
    return !!((window.GAME_EDITION && window.GAME_EDITION.fullUnlock) || s.premium || s.premiumFree || s.legendStatus || s.earlyAccess);
  }

  function showSupportNotice(level) {
    var target = Math.max(FREE_LEVEL_LIMIT + 1, Number(level) || FREE_LEVEL_LIMIT + 1);
    var msg =
      'Првите ' + FREE_LEVEL_LIMIT + ' нивоа се бесплатни.\n\n' +
      'За да продолжиш од ниво ' + target + ' до 37, потребна е Premium поддршка од ' + SUPPORT_PRICE + '.\n\n' +
      'Ова помага играта да продолжи да се развива.';

    if (typeof window.showPremiumRequired === 'function') {
      window.showPremiumRequired(target);
    } else {
      toast(msg, 4000);
    }
  }

  function closeElement(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  function toast(message, duration) {
    duration = duration || 3000;
    var t = document.getElementById('pwa-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pwa-toast';
      t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-120px);background:linear-gradient(135deg,#1A1525,#4A90E2);color:white;padding:12px 18px;border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,.5);z-index:99999;font-family:Inter,sans-serif;font-size:14px;font-weight:600;border:1px solid rgba(255,215,0,.35);transition:transform .35s;max-width:90vw;text-align:center';
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(window.__AQ_TOAST_TIMER);
    window.__AQ_TOAST_TIMER = setTimeout(function () {
      t.style.transform = 'translateX(-50%) translateY(-120px)';
    }, duration);
  }

  function installServiceWorker() {
    if (window.GAME_EDITION && GAME_EDITION.pwa===false) return;
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        console.log('[PWA] Service Worker registered:', reg.scope);
        reg.update();
      }).catch(function (err) {
        console.warn('[PWA] SW registration failed:', err);
      });
    });
  }

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      window.__AQ_DEFERRED_PROMPT = e;
      var btn = document.getElementById('pwa-install-btn');
      if (btn) {
        btn.classList.add('show');
        btn.onclick = function () {
          if (!window.__AQ_DEFERRED_PROMPT) return;
          window.__AQ_DEFERRED_PROMPT.prompt();
          window.__AQ_DEFERRED_PROMPT.userChoice.finally(function () {
            window.__AQ_DEFERRED_PROMPT = null;
          });
        };
      }
    });
  }

  function installTouchControls() {
    window.__AQ_TOUCH_KEYS = window.__AQ_TOUCH_KEYS || {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    };

    var left = document.getElementById('touch-left');
    var right = document.getElementById('touch-right');
    var jump = document.getElementById('touch-jump');
    var controls = document.getElementById('mobile-controls');
    if (!left || !right || !jump || !controls) return;

    function syncVisibility() {
      var gameScreen = document.getElementById('screen-game');
      var active = gameScreen && gameScreen.classList.contains('active');
      controls.classList.toggle('active', !!active);
      // Avoid covering the large blue JUMP control with the floating language switch
      // on mobile touch devices; the switch remains available in the main menu.
      var langSwitch = document.getElementById('wpa-language-toggle');
      var isTouch = !!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
      if (langSwitch) langSwitch.hidden = !!(active && isTouch);
    }

    var observer = new MutationObserver(syncVisibility);
    document.querySelectorAll('.screen').forEach(function (screen) {
      observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
    });
    syncVisibility();

    function bind(btn, key) {
      var down = false;
      function start(e) {
        if (e && e.preventDefault) e.preventDefault();
        down = true;
        btn.classList.add('pressed');
        window.__AQ_TOUCH_KEYS[key] = true;
      }
      function end(e) {
        if (!down) return;
        if (e && e.preventDefault) e.preventDefault();
        down = false;
        btn.classList.remove('pressed');
        window.__AQ_TOUCH_KEYS[key] = false;
      }
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('touchcancel', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    }

    bind(left, 'ArrowLeft');
    bind(right, 'ArrowRight');
    bind(jump, 'Space');
    console.log('[AQ] Touch controls bound via __AQ_TOUCH_KEYS');
  }

  function installSafeGuards() {
    if (!window.Monetization) {
      window.Monetization = {
        analytics: { track: function () {} },
        adGiants: {
          getAllNetworks: function () { return []; },
          getTotalECPM: function () { return 0; }
        }
      };
    }
    if (!window.MagicTracking) {
      window.MagicTracking = {
        trackEvent: function () {},
        trackLevelStart: function () {},
        trackLevelComplete: function () {},
        trackCoinCollected: function () {},
        trackDeath: function () {},
        trackShopVisit: function () {},
        trackSocialShare: function () {},
        trackAIChat: function () {}
      };
    }
  }

  function installGameplayPatch() {
    if (window.__AQ_PATCH_V122) return;
    if (typeof window.startLevel !== 'function' || typeof window.startGame !== 'function') {
      setTimeout(installGameplayPatch, 150);
      return;
    }
    window.__AQ_PATCH_V122 = true;

    var originalStartLevel = window.startLevel;

    window.startLevel = function patchedStartLevel(level) {
      var lv = Math.min(Math.max(parseInt(level, 10) || 1, 1), 37);
      if (lv > FREE_LEVEL_LIMIT && !isSupportActive()) {
        showSupportNotice(lv);
        return;
      }
      window.__AQ_SELECTED_LEVEL = lv;
      return originalStartLevel(lv);
    };

    window.startGame = function patchedStartGame() {
      var s = readState();
      var lv = Math.min(Math.max(parseInt(s.currentLevel, 10) || 1, 1), 37);
      return window.startLevel(lv);
    };

    window.nextLevel = function patchedNextLevel() {
      closeElement('modal-complete');
      var completeLevel = parseInt((document.getElementById('complete-level') || {}).textContent || '', 10);
      var hudLevel = parseInt((document.getElementById('hud-level') || {}).textContent || '', 10);
      var selectedLevel = parseInt(window.__AQ_SELECTED_LEVEL || '', 10);
      var current = completeLevel || hudLevel || selectedLevel || 1;
      return window.startLevel(Math.min(current + 1, 37));
    };

    window.retryLevel = function patchedRetryLevel() {
      closeElement('modal-complete');
      var completeLevel = parseInt((document.getElementById('complete-level') || {}).textContent || '', 10);
      var hudLevel = parseInt((document.getElementById('hud-level') || {}).textContent || '', 10);
      var selectedLevel = parseInt(window.__AQ_SELECTED_LEVEL || '', 10);
      var current = completeLevel || hudLevel || selectedLevel || 1;
      return window.startLevel(current);
    };

    if (typeof window.renderLevelSelect === 'function') {
      var originalRenderLevelSelect = window.renderLevelSelect;
      window.renderLevelSelect = function patchedRenderLevelSelect() {
        originalRenderLevelSelect();
        if (isSupportActive()) return;
        var buttons = Array.prototype.slice.call(document.querySelectorAll('#episodes-container .level-dot'));
        buttons.forEach(function (btn, index) {
          var lv = index + 1;
          if (lv > FREE_LEVEL_LIMIT) {
            btn.classList.remove('unlocked', 'completed');
            btn.classList.add('locked');
            btn.innerHTML = '<span>' + lv + '</span><span style="font-size:11px">👑</span>';
            btn.onclick = function () { showSupportNotice(lv); };
          }
        });
      };
    }

    console.log('[AQ] v1.2.2 patch installed: next-level, touch controls, safe guards, access notice');
  }

  function init() {
    installSafeGuards();
    installServiceWorker();
    setupInstallPrompt();
    installTouchControls();
    installGameplayPatch();
    console.log('[PWA] v1.2.2 initialized');
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

  window.PWA = { showToast: toast, init: init };
})();
