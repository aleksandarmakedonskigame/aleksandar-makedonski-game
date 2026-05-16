// ============================================================
// 📱 PWA + MOBILE — Александар v6.0
// Service Worker · Install Prompt · Touch Controls · Orientation
// ============================================================

const PWA = {
  deferredPrompt: null,
  isInstalled: false,
  isStandalone: false,

  init() {
    this.detectPlatform();
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupTouchControls();
    this.setupOrientationHandler();
    this.handleURLParams();
    console.log('[PWA] Initialized · platform:', this.platform, '· standalone:', this.isStandalone);
  },

  // === DETECT PLATFORM ===
  detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(ua);
    this.isAndroid = /android/.test(ua);
    this.isMobile = this.isIOS || this.isAndroid || /mobile|tablet/.test(ua);
    this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone === true;
    this.platform = this.isIOS ? 'iOS' : this.isAndroid ? 'Android' :
                    this.isMobile ? 'Mobile' : 'Desktop';

    document.body.classList.add('platform-' + this.platform.toLowerCase());
    if (this.isTouch) document.body.classList.add('touch-device');
    if (this.isStandalone) document.body.classList.add('pwa-standalone');

    // Track in analytics
    if (window.MagicTracking) {
      window.MagicTracking.trackEvent('platform_detected', {
        platform: this.platform,
        standalone: this.isStandalone,
        touch: this.isTouch,
        viewport: window.innerWidth + 'x' + window.innerHeight,
      });
    }
  },

  // === SERVICE WORKER ===
  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker not supported');
      return;
    }
    // Only register over HTTP(S), not file://
    if (window.location.protocol === 'file:') {
      console.log('[PWA] Skipping SW registration (file:// protocol)');
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('[PWA] Service Worker registered:', reg.scope);
          // Auto-update check
          reg.update();
          setInterval(() => reg.update(), 60 * 60 * 1000); // hourly

          // Handle updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showToast('🔄 Нова верзија на играта — освежи!', 5000);
              }
            });
          });
        })
        .catch(err => console.warn('[PWA] SW registration failed:', err));
    });
  },

  // === INSTALL PROMPT ===
  setupInstallPrompt() {
    // Save the prompt event for later
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      const btn = document.getElementById('pwa-install-btn');
      if (btn && !this.isStandalone) {
        btn.classList.add('show');
        btn.addEventListener('click', () => this.promptInstall());
      }
      console.log('[PWA] Install prompt ready');
    });

    // After install
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      const btn = document.getElementById('pwa-install-btn');
      if (btn) btn.classList.remove('show');
      this.showToast('🎉 Александар е инсталиран! Барај го на дома-екранот.', 5000);
      if (window.MagicTracking) {
        window.MagicTracking.trackEvent('pwa_installed', { platform: this.platform });
      }
    });

    // iOS — no beforeinstallprompt; show manual instructions if running in Safari
    if (this.isIOS && !this.isStandalone) {
      setTimeout(() => {
        const visited = localStorage.getItem('ios_install_hint_shown');
        if (!visited) {
          this.showIOSInstallHint();
          localStorage.setItem('ios_install_hint_shown', '1');
        }
      }, 10000);
    }
  },

  promptInstall() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then(result => {
      console.log('[PWA] User choice:', result.outcome);
      if (window.MagicTracking) {
        window.MagicTracking.trackEvent('pwa_install_prompt', { outcome: result.outcome });
      }
      this.deferredPrompt = null;
    });
  },

  showIOSInstallHint() {
    const hint = document.createElement('div');
    hint.id = 'ios-install-hint';
    hint.style.cssText = 'position:fixed;bottom:20px;left:20px;right:20px;background:linear-gradient(135deg,#1A1525,#4A90E2);color:white;padding:16px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:9999;font-family:Inter,sans-serif;font-size:14px;border:1px solid rgba(255,215,0,0.3)';
    hint.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:32px">📲</span>
        <div style="flex:1">
          <p style="font-weight:bold;color:#FFD700;margin-bottom:4px">Инсталирај го Александар!</p>
          <p style="opacity:0.85;font-size:12px;line-height:1.4">Притисни <strong>Share</strong> (квадратот со стрелка нагоре), потоа <strong>"Add to Home Screen"</strong></p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;opacity:0.6">×</button>
      </div>
    `;
    document.body.appendChild(hint);
    setTimeout(() => {
      if (hint.parentNode) hint.style.transition = 'opacity 0.5s';
      if (hint.parentNode) hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 500);
    }, 12000);
  },

  // === TOUCH CONTROLS ===
  setupTouchControls() {
    if (!this.isTouch) return;

    const left = document.getElementById('touch-left');
    const right = document.getElementById('touch-right');
    const jump = document.getElementById('touch-jump');
    const controls = document.getElementById('mobile-controls');

    if (!left || !right || !jump || !controls) return;

    // Show on game screen, hide elsewhere
    const observer = new MutationObserver(() => {
      const gameActive = document.getElementById('screen-game')?.classList.contains('active');
      controls.classList.toggle('active', gameActive);
    });
    document.querySelectorAll('.screen').forEach(s => {
      observer.observe(s, { attributes: true, attributeFilter: ['class'] });
    });

    // Hook touch buttons to simulated keyboard
    const sim = (key, isDown) => {
      const ev = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
        key: key,
        code: key === 'ArrowLeft' ? 'ArrowLeft' :
              key === 'ArrowRight' ? 'ArrowRight' : 'Space',
        keyCode: key === 'ArrowLeft' ? 37 : key === 'ArrowRight' ? 39 : 32,
        which: key === 'ArrowLeft' ? 37 : key === 'ArrowRight' ? 39 : 32,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(ev);
      window.dispatchEvent(ev);
    };

    const bind = (btn, key) => {
      let pressed = false;
      const start = e => { e.preventDefault(); pressed = true; btn.classList.add('pressed'); sim(key, true); };
      const end = e => { if (pressed) { e.preventDefault(); pressed = false; btn.classList.remove('pressed'); sim(key, false); } };
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end);
      btn.addEventListener('touchcancel', end);
      // Also mouse fallback for testing
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };

    bind(left, 'ArrowLeft');
    bind(right, 'ArrowRight');
    bind(jump, ' '); // Space

    console.log('[PWA] Touch controls bound');
  },

  // === ORIENTATION ===
  setupOrientationHandler() {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      document.body.classList.toggle('orientation-landscape', isLandscape);
      document.body.classList.toggle('orientation-portrait', !isLandscape);

      // Recommend landscape on small phones during gameplay
      if (this.isMobile && !isLandscape && Math.min(window.innerWidth, window.innerHeight) < 500) {
        const gameActive = document.getElementById('screen-game')?.classList.contains('active');
        if (gameActive && !this._rotationHintShown) {
          this._rotationHintShown = true;
          this.showToast('💡 Совет: ротирај го телефонот хоризонтално за подобро искуство!', 4000);
        }
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 200));
  },

  // === URL PARAMS — handle shortcuts from manifest ===
  handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    setTimeout(() => {
      if (action === 'play' && typeof startGame === 'function') {
        startGame();
      } else if (action === 'capsule' && window.Legacy?.showCapsule) {
        window.Legacy.showCapsule();
      }
    }, 1500);

    // Track source (helps measure where installs come from)
    const source = params.get('source');
    if (source && window.MagicTracking) {
      window.MagicTracking.trackEvent('app_opened', { source });
    }
  },

  // === TOAST helper ===
  showToast(msg, duration = 3000) {
    let toast = document.getElementById('pwa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pwa-toast';
      toast.style.cssText = 'position:fixed;top:calc(20px + env(safe-area-inset-top));left:50%;transform:translateX(-50%) translateY(-150px);background:linear-gradient(135deg,#1A1525,#4A90E2);color:white;padding:12px 20px;border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,0.5);z-index:9999;font-family:Inter,sans-serif;font-size:14px;font-weight:500;border:1px solid rgba(255,215,0,0.3);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);max-width:90vw;text-align:center';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(-150px)';
    }, duration);
  },
};

// Auto-init when DOM ready
if (document.readyState !== 'loading') PWA.init();
else document.addEventListener('DOMContentLoaded', () => PWA.init());

// Export
if (typeof window !== 'undefined') window.PWA = PWA;
