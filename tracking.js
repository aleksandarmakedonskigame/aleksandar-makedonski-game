// ============================================================
// ALEXANDER'S QUEST - MAGIC EYE TRACKING SYSTEM
// Mouse Tracking + Heatmap + Google Analytics + Social Pixel
// Connected to aleksandarmakedonskigame@gmail.com
// ============================================================

const MagicTracking = {
  config: {
    email: 'aleksandarmakedonskigame@gmail.com',
    googleAnalyticsId: 'G-YOUR_GA_ID_HERE',
    facebookPixelId: 'YOUR_PIXEL_ID_HERE',
    tiktokPixelId: 'YOUR_TIKTOK_PIXEL_ID',
    twitterPixelId: 'YOUR_TWITTER_PIXEL_ID',
  },

  // ========== MOUSE HEATMAP TRACKING ==========
  mouseData: {
    positions: [],
    clicks: [],
    scrollDepth: 0,
    timeOnPage: 0,
    sectionsViewed: new Set(),
    startTime: Date.now(),
  },

  initMouseTracking() {
    // Track every mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseData.positions.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        element: e.target.id || e.target.className || 'unknown',
      });
      // Keep only last 5000 points
      if (this.mouseData.positions.length > 5000) {
        this.mouseData.positions = this.mouseData.positions.slice(-5000);
      }
    });

    // Track all clicks
    document.addEventListener('click', (e) => {
      this.mouseData.clicks.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        element: e.target.id || e.target.className || 'unknown',
        button: e.button,
      });
      this.trackClick(e);
    });

    // Track scroll depth
    document.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.mouseData.scrollDepth = Math.floor((scrollTop / docHeight) * 100);
    });

    // Update time on page every second
    setInterval(() => {
      this.mouseData.timeOnPage = Math.floor((Date.now() - this.mouseData.startTime) / 1000);
    }, 1000);

    console.log('[MagicTracking] Mouse tracking initialized');
  },

  // ========== EYE TRACKING SIMULATION ==========
  // Uses mouse movement patterns to predict where user is looking
  eyeTracking: {
    gazePoints: [],
    currentGaze: { x: 0, y: 0 },
    focusAreas: {},
    attentionScore: 0,
  },

  initEyeTracking() {
    // Simulate eye tracking using mouse velocity and patterns
    let lastMousePos = { x: 0, y: 0 };
    let lastTimestamp = Date.now();
    let stationaryTime = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = now - lastTimestamp;
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      const velocity = Math.sqrt(dx * dx + dy * dy) / (dt || 1);

      // If mouse is slow/stationary, user is likely "looking" there
      if (velocity < 0.5) {
        stationaryTime += dt;
        if (stationaryTime > 200) { // Looking at this spot for 200ms+
          this.recordGazePoint(e.clientX, e.clientY, stationaryTime);
        }
      } else {
        stationaryTime = 0;
      }

      lastMousePos = { x: e.clientX, y: e.clientY };
      lastTimestamp = now;
    });

    console.log('[MagicTracking] Eye tracking simulation initialized');
  },

  recordGazePoint(x, y, duration) {
    const zone = this.getZoneName(x, y);
    if (!this.eyeTracking.focusAreas[zone]) {
      this.eyeTracking.focusAreas[zone] = 0;
    }
    this.eyeTracking.focusAreas[zone] += duration;

    this.eyeTracking.gazePoints.push({ x, y, duration, timestamp: Date.now() });
    if (this.eyeTracking.gazePoints.length > 1000) {
      this.eyeTracking.gazePoints = this.eyeTracking.gazePoints.slice(-1000);
    }
  },

  getZoneName(x, y) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const col = x < w * 0.33 ? 'left' : x < w * 0.66 ? 'center' : 'right';
    const row = y < h * 0.33 ? 'top' : y < h * 0.66 ? 'middle' : 'bottom';
    return `${row}-${col}`;
  },

  // ========== HEATMAP GENERATION ==========
  generateHeatmap() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Draw base
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gaze points
    this.eyeTracking.gazePoints.forEach(point => {
      const intensity = Math.min(point.duration / 1000, 1);
      const radius = 20 + intensity * 30;
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      gradient.addColorStop(0, `rgba(255, 215, 0, ${intensity * 0.6})`);
      gradient.addColorStop(0.5, `rgba(255, 165, 0, ${intensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
    });

    return canvas.toDataURL('image/png');
  },

  // ========== GAME AREA TRACKING ==========
  gameTracking: {
    levelsPlayed: [],
    timePerLevel: {},
    deathsPerLevel: {},
    coinsCollected: 0,
    scrollsCollected: 0,
    aiChats: 0,
    shopVisits: 0,
    companionUsed: null,
  },

  trackLevelStart(level) {
    this.gameTracking.levelsPlayed.push({
      level,
      startTime: Date.now(),
    });
    this.trackEvent('level_start', { level });
  },

  trackLevelComplete(level, score, stars, time) {
    const startRecord = this.gameTracking.levelsPlayed
      .filter(l => l.level === level && !l.endTime)
      .pop();
    if (startRecord) {
      startRecord.endTime = Date.now();
      startRecord.duration = Math.floor((startRecord.endTime - startRecord.startTime) / 1000);
    }

    this.gameTracking.timePerLevel[level] = time;
    this.trackEvent('level_complete', { level, score, stars, time });

    // Track to Google Analytics
    if (window.gtag) {
      gtag('event', 'level_complete', {
        level,
        score,
        stars,
        time,
      });
    }
  },

  trackDeath(level) {
    if (!this.gameTracking.deathsPerLevel[level]) {
      this.gameTracking.deathsPerLevel[level] = 0;
    }
    this.gameTracking.deathsPerLevel[level]++;
    this.trackEvent('player_death', { level });
  },

  trackCoinCollected(amount) {
    this.gameTracking.coinsCollected += amount;
    this.trackEvent('coin_collected', { amount: this.gameTracking.coinsCollected });
  },

  trackAIChat(agent) {
    this.gameTracking.aiChats++;
    this.trackEvent('ai_chat', { agent, total: this.gameTracking.aiChats });
  },

  trackShopVisit(product) {
    this.gameTracking.shopVisits++;
    this.trackEvent('shop_visit', { product });
  },

  // ========== SOCIAL MEDIA TRACKING ==========
  trackSocialShare(platform) {
    this.trackEvent('social_share', {
      platform,
      game: 'alexander_quest',
      timestamp: new Date().toISOString(),
    });

    // Facebook Pixel
    if (window.fbq) {
      fbq('track', 'Share', { platform, content: 'alexander_quest' });
    }

    // Google Analytics
    if (window.gtag) {
      gtag('event', 'share', {
        method: platform,
        content_type: 'game',
        item_id: 'alexander_quest',
      });
    }
  },

  // ========== GOOGLE ANALYTICS 4 ==========
  initGoogleAnalytics() {
    if (this.config.googleAnalyticsId === 'G-YOUR_GA_ID_HERE') {
      console.log('[GA] Placeholder ID - replace with real GA4 ID');
      return;
    }

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', this.config.googleAnalyticsId, {
      custom_map: {
        custom_parameter_1: 'game_version',
        custom_parameter_2: 'player_level',
        custom_parameter_3: 'companion',
      },
    });

    console.log('[GA] Google Analytics 4 initialized');
  },

  // ========== FACEBOOK PIXEL ==========
  initFacebookPixel() {
    if (this.config.facebookPixelId === 'YOUR_PIXEL_ID_HERE') {
      console.log('[FB] Placeholder ID - replace with real Pixel ID');
      return;
    }

    !function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', this.config.facebookPixelId);
    window.fbq('track', 'PageView');

    console.log('[FB] Facebook Pixel initialized');
  },

  // ========== TIKTOK PIXEL ==========
  initTikTokPixel() {
    if (this.config.tiktokPixelId === 'YOUR_TIKTOK_PIXEL_ID') return;

    !function(w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group'];
      ttq.setAndDefer = function(t, e) {
        t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function(t) {
        var e = ttq._i[t] || [];
        for (var n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[i]);
        return e;
      };
      ttq.load = function(e, n) {
        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = i;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        var o = document.createElement('script');
        o.type = 'text/javascript';
        o.async = !0;
        o.src = i + '?sdkid=' + e + '&lib=' + t;
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(o, a);
      };
      ttq.load(this.config.tiktokPixelId);
      ttq.page();
    }(window, document, 'ttq');
  },

  // ========== TWITTER PIXEL ==========
  initTwitterPixel() {
    if (this.config.twitterPixelId === 'YOUR_TWITTER_PIXEL_ID') return;

    !function(e, t, n, s, u, a) {
      e.twq || (s = e.twq = function() {
        s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
      }, s.version = '1.1', s.queue = [], u = t.createElement(n), u.async = !0,
      u.src = '//static.ads-twitter.com/uwt.js', a = t.getElementsByTagName(n)[0],
      a.parentNode.insertBefore(u, a));
    }(window, document, 'script');
    window.twq('init', this.config.twitterPixelId);
    window.twq('track', 'PageView');
  },

  // ========== UNIVERSAL EVENT TRACKER ==========
  trackEvent(eventName, data = {}) {
    const payload = {
      event: eventName,
      data: { ...data, email: this.config.email, timestamp: new Date().toISOString() },
    };

    // Store locally
    const events = JSON.parse(localStorage.getItem('aq_tracking_events') || '[]');
    events.push(payload);
    localStorage.setItem('aq_tracking_events', JSON.stringify(events.slice(-1000)));

    // Send to Google Analytics
    if (window.gtag) {
      gtag('event', eventName, data);
    }

    // Send to Facebook Pixel
    if (window.fbq) {
      fbq('trackCustom', eventName, data);
    }

    console.log(`[MagicTracking] ${eventName}:`, data);
  },

  // ========== ANALYTICS DASHBOARD ==========
  getDashboardData() {
    const events = JSON.parse(localStorage.getItem('aq_tracking_events') || '[]');
    const state = JSON.parse(localStorage.getItem('alexander_quest_save') || '{}');

    // Calculate metrics
    const totalPlayTime = this.mouseData.timeOnPage;
    const avgSessionTime = events.length > 0
      ? Math.floor(totalPlayTime / Math.max(1, new Set(events.map(e => e.data?.session_id)).size))
      : 0;

    const levelsCompleted = Object.keys(state.levelStars || {}).length;
    const totalCoins = state.totalCoins || 0;
    const totalScore = state.totalScore || 0;

    // Social shares count
    const socialShares = events.filter(e => e.event === 'social_share').length;

    // AI chats
    const aiChats = events.filter(e => e.event === 'ai_chat').length;

    // Most played level
    const levelPlays = {};
    events.forEach(e => {
      if (e.event === 'level_start' && e.data?.level) {
        levelPlays[e.data.level] = (levelPlays[e.data.level] || 0) + 1;
      }
    });
    const favoriteLevel = Object.entries(levelPlays)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      totalPlayTime: Math.floor(totalPlayTime / 60) + ' min',
      avgSessionTime: avgSessionTime + ' sec',
      levelsCompleted,
      totalCoins,
      totalScore,
      socialShares,
      aiChats,
      favoriteLevel,
      heatmapImage: this.generateHeatmap(),
      focusAreas: this.eyeTracking.focusAreas,
      gazePoints: this.eyeTracking.gazePoints.length,
      email: this.config.email,
    };
  },

  // ========== REAL-TIME TRACKER ==========
  initRealtimeTracking() {
    // Send heartbeat every 30 seconds
    setInterval(() => {
      this.trackEvent('heartbeat', {
        timeOnPage: this.mouseData.timeOnPage,
        scrollDepth: this.mouseData.scrollDepth,
        sectionsViewed: Array.from(this.mouseData.sectionsViewed),
      });
    }, 30000);

    // Track visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', {
        visible: !document.hidden,
        timeOnPage: this.mouseData.timeOnPage,
      });
    });
  },

  // ========== MAGIC EYE DASHBOARD UI ==========
  renderMagicDashboard() {
    const data = this.getDashboardData();
    const modal = document.createElement('div');
    modal.id = 'magic-tracking-dashboard';
    modal.className = 'fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 overflow-y-auto';
    modal.innerHTML = `
      <div class="bg-gradient-to-b from-[#1A1525] to-[#2D1B69] border-2 border-purple-500/50 rounded-3xl max-w-3xl w-full p-8 relative">
        <button onclick="document.getElementById('magic-tracking-dashboard').remove()" 
          class="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
          ✕
        </button>

        <!-- Header -->
        <div class="text-center mb-6">
          <div class="text-5xl mb-2">👁️</div>
          <h2 class="text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
            MAGIC TRACKING
          </h2>
          <p class="text-purple-300 text-sm">Анализа на однесување на играчите</p>
          <p class="text-[#FFF8E7]/40 text-xs mt-1">📧 Поврзано со: ${data.email}</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-black/30 rounded-xl p-3 text-center border border-purple-600/20">
            <p class="text-2xl font-bold text-purple-400">${data.totalPlayTime}</p>
            <p class="text-xs text-[#FFF8E7]/50">Време на играње</p>
          </div>
          <div class="bg-black/30 rounded-xl p-3 text-center border border-yellow-600/20">
            <p class="text-2xl font-bold text-yellow-400">${data.levelsCompleted}</p>
            <p class="text-xs text-[#FFF8E7]/50">Завршени нивоа</p>
          </div>
          <div class="bg-black/30 rounded-xl p-3 text-center border border-blue-600/20">
            <p class="text-2xl font-bold text-blue-400">${data.socialShares}</p>
            <p class="text-xs text-[#FFF8E7]/50">Социјални споделувања</p>
          </div>
          <div class="bg-black/30 rounded-xl p-3 text-center border border-pink-600/20">
            <p class="text-2xl font-bold text-pink-400">${data.aiChats}</p>
            <p class="text-xs text-[#FFF8E7]/50">AI разговори</p>
          </div>
        </div>

        <!-- Focus Areas -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-purple-400 mb-2">👁️ Зони на фокус (Eye Tracking)</h3>
          <div class="grid grid-cols-3 gap-2">
            ${Object.entries(data.focusAreas).sort((a, b) => b[1] - a[1]).slice(0, 9).map(([zone, time]) => `
              <div class="bg-black/30 rounded-lg p-2 text-center border border-purple-600/10">
                <p class="text-purple-400 font-bold text-sm">${zone}</p>
                <p class="text-xs text-[#FFF8E7]/50">${Math.floor(time / 1000)}s</p>
              </div>
            `).join('') || '<p class="text-[#FFF8E7]/40 text-sm col-span-3 text-center">Се собираат податоци...</p>'}
          </div>
        </div>

        <!-- Heatmap Preview -->
        ${data.gazePoints > 0 ? `
          <div class="mb-6">
            <h3 class="text-lg font-bold text-yellow-400 mb-2">🔥 Heatmap (${data.gazePoints} точки)</h3>
            <div class="bg-black/30 rounded-xl p-4 border border-yellow-600/20 text-center">
              <img src="${data.heatmapImage}" class="w-full rounded-lg" style="max-height:200px;object-fit:contain;" />
              <p class="text-[#FFF8E7]/40 text-xs mt-2">Жолто = каде играчот гледа најдолго</p>
            </div>
          </div>
        ` : ''}

        <!-- Connected Services -->
        <div class="mb-4">
          <h3 class="text-lg font-bold text-green-400 mb-2">🔗 Поврзани сервиси</h3>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-blue-600/30 text-blue-400 rounded-full text-xs">📊 Google Analytics 4</span>
            <span class="px-3 py-1 bg-blue-800/30 text-blue-400 rounded-full text-xs">📘 Facebook Pixel</span>
            <span class="px-3 py-1 bg-black/30 text-white rounded-full text-xs border border-white/10">🎵 TikTok Pixel</span>
            <span class="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-xs">𝕏 Twitter Pixel</span>
            <span class="px-3 py-1 bg-purple-600/30 text-purple-400 rounded-full text-xs">👁️ Eye Tracking</span>
            <span class="px-3 py-1 bg-orange-600/30 text-orange-400 rounded-full text-xs">🔥 Heatmap</span>
          </div>
        </div>

        <!-- Email -->
        <p class="text-[#FFF8E7]/30 text-xs text-center">
          Сите податоци одат на: <span class="text-yellow-400">${data.email}</span>
        </p>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // ========== INITIALIZATION ==========
  init() {
    this.initMouseTracking();
    this.initEyeTracking();
    this.initGoogleAnalytics();
    this.initFacebookPixel();
    this.initTikTokPixel();
    this.initTwitterPixel();
    this.initRealtimeTracking();

    // Track page view
    this.trackEvent('game_loaded', {
      version: '4.0',
      screen: window.innerWidth + 'x' + window.innerHeight,
      language: navigator.language,
    });

    // Make dashboard accessible globally
    window.showMagicTracking = () => this.renderMagicDashboard();

    console.log('[MagicTracking] ✨ Magic Eye Tracking initialized!');
    return this;
  },
};

// Auto-init
MagicTracking.init();

// Export
if (typeof module !== 'undefined') module.exports = MagicTracking;
