// ============================================================
// 🌐 ALEKSANDAR'S QUEST — SOCIAL & MESSENGER INTEGRATIONS
// All channels connected to: aleksandarmakedonskigame@gmail.com
// Social: FB, IG, X, TikTok, YouTube, LinkedIn, Pinterest, Snapchat, Reddit, VK, Threads, Bluesky
// Messengers: WhatsApp, Telegram, Viber, Messenger, Discord, Signal, Line, WeChat, KakaoTalk
// ============================================================

const Integrations = {
  // === MASTER CONFIG — sè оди на овој мail ===
  config: {
    contactEmail: 'aleksandarmakedonskigame@gmail.com',
    supportEmail: 'aleksandarmakedonskigame@gmail.com',
    notificationsEmail: 'aleksandarmakedonskigame@gmail.com',
    gameTitle: 'Мисија на Александар',
    gameTagline: 'Патот на Светлината',
    gameDescription: '37 нивоа · 4 AI агенти · Светска уникатна игра!',
    websiteURL: window.location.origin + window.location.pathname,
    hashtags: '#АлександарМакедонски #Македонија #Игра #Образование #PWA',
  },

  // === SOCIAL MEDIA PROFILES (place your real handles) ===
  social: {
    facebook: {
      page: 'AleksandarMakedonskiGame',          // facebook.com/AleksandarMakedonskiGame
      url: 'https://facebook.com/AleksandarMakedonskiGame',
      messengerUsername: 'AleksandarMakedonskiGame',
      shareURL: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      messageURL: 'https://m.me/AleksandarMakedonskiGame',
    },
    instagram: {
      username: 'aleksandarmakedonskigame',
      url: 'https://instagram.com/aleksandarmakedonskigame',
      directURL: 'https://ig.me/m/aleksandarmakedonskigame',
    },
    twitter: { // X
      handle: 'aleksandar_game',
      url: 'https://x.com/aleksandar_game',
      shareURL: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AleksandarMakedonski`,
      dmURL: 'https://twitter.com/messages/compose?recipient_id=aleksandar_game',
    },
    tiktok: {
      username: 'aleksandarmakedonskigame',
      url: 'https://tiktok.com/@aleksandarmakedonskigame',
      shareURL: (url) => `https://www.tiktok.com/upload?ref=${encodeURIComponent(url)}`,
    },
    youtube: {
      channel: '@AleksandarMakedonskiGame',
      url: 'https://youtube.com/@AleksandarMakedonskiGame',
    },
    linkedin: {
      page: 'aleksandar-makedonski-game',
      url: 'https://linkedin.com/company/aleksandar-makedonski-game',
      shareURL: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    pinterest: {
      username: 'aleksandarmakedonskigame',
      url: 'https://pinterest.com/aleksandarmakedonskigame',
      shareURL: (url, desc) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc)}`,
    },
    snapchat: {
      username: 'aleksandarmakedonskigame',
      url: 'https://snapchat.com/add/aleksandarmakedonskigame',
      shareURL: (url) => `https://www.snapchat.com/share?url=${encodeURIComponent(url)}`,
    },
    reddit: {
      url: 'https://reddit.com/u/AleksandarMakedonskiGame',
      shareURL: (url, title) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    vk: {
      url: 'https://vk.com/aleksandarmakedonskigame',
      shareURL: (url, title) => `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    threads: {
      username: 'aleksandarmakedonskigame',
      url: 'https://threads.net/@aleksandarmakedonskigame',
    },
    bluesky: {
      handle: 'aleksandar.bsky.social',
      url: 'https://bsky.app/profile/aleksandar.bsky.social',
    },
    mastodon: {
      handle: '@aleksandar@mastodon.social',
      url: 'https://mastodon.social/@aleksandar',
    },
  },

  // === MESSENGER INTEGRATIONS ===
  messengers: {
    whatsapp: {
      // Use wa.me/PHONE_NUMBER once you set up WhatsApp Business
      number: '38970000000', // Replace with your real WhatsApp Business number
      url: 'https://wa.me/38970000000',
      shareURL: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
      directMessage: (text) => `https://wa.me/38970000000?text=${encodeURIComponent(text)}`,
    },
    telegram: {
      botUsername: 'AleksandarMakedonskiBot',     // Create on @BotFather, link to email
      channelUsername: 'AleksandarMakedonskiGame',
      groupUsername: 'AleksandarMakedonskiChat',
      url: 'https://t.me/AleksandarMakedonskiGame',
      botURL: 'https://t.me/AleksandarMakedonskiBot',
      shareURL: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    viber: {
      publicAccount: 'AleksandarMakedonski',
      url: 'viber://chat?number=38970000000',
      shareURL: (text, url) => `viber://forward?text=${encodeURIComponent(text + ' ' + url)}`,
    },
    messenger: { // Facebook Messenger
      pageId: 'AleksandarMakedonskiGame',
      url: 'https://m.me/AleksandarMakedonskiGame',
      shareURL: (url) => `https://www.facebook.com/dialog/send?app_id=YOUR_FB_APP_ID&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(window.location.href)}`,
    },
    discord: {
      serverInvite: 'https://discord.gg/aleksandar',  // Create Discord server
      serverId: 'YOUR_DISCORD_SERVER_ID',
      botToken: 'YOUR_DISCORD_BOT_TOKEN', // server-side only
      url: 'https://discord.gg/aleksandar',
    },
    signal: {
      // Signal doesn't have public usernames, use email/phone
      phone: '+38970000000',
      url: 'https://signal.me/#p/+38970000000',
    },
    line: {
      lineId: '@aleksandar',
      url: 'https://line.me/R/ti/p/@aleksandar',
      shareURL: (url) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
    },
    wechat: {
      // WeChat ID (set up via WeChat Official Account Platform)
      officialId: 'AleksandarMakedonski',
      url: 'weixin://dl/business/?ticket=YOUR_TICKET',
    },
    kakaotalk: {
      channelUrl: 'http://pf.kakao.com/_aleksandar',
      url: 'http://pf.kakao.com/_aleksandar',
    },
    skype: {
      username: 'live:aleksandarmakedonskigame',
      url: 'skype:live:aleksandarmakedonskigame?chat',
    },
  },

  // === MAIN SOCIAL SHARE FUNCTION (uses Web Share API on mobile) ===
  shareGame(platform = null) {
    const url = this.config.websiteURL;
    const title = `👑 ${this.config.gameTitle}`;
    const text = `${this.config.gameTitle} — ${this.config.gameTagline}\n${this.config.gameDescription}\n${this.config.hashtags}`;

    // Try native share first (mobile)
    if (!platform && navigator.share) {
      return navigator.share({ title, text, url })
        .then(() => this._trackShare('native'))
        .catch(err => console.log('[Share] User cancelled or failed:', err));
    }

    // Specific platform share
    if (platform && this.social[platform]) {
      const s = this.social[platform];
      const shareURL = s.shareURL ? s.shareURL(url, text) : s.url;
      window.open(shareURL, '_blank', 'width=600,height=500');
      this._trackShare(platform);
      return;
    }

    if (platform && this.messengers[platform]) {
      const m = this.messengers[platform];
      const shareURL = m.shareURL ? m.shareURL(url, text) : m.url;
      window.open(shareURL, '_blank');
      this._trackShare(platform);
      return;
    }

    // Fallback: copy link
    return this._copyLink(url);
  },

  // === DIRECT CONTACT ===
  contactSupport(subject = 'Аleksandar Game Support', body = '') {
    const mailto = `mailto:${this.config.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    this._trackEvent('contact_support', { subject });
  },

  contactViaMessenger(messenger = 'whatsapp', text = '') {
    const m = this.messengers[messenger];
    if (!m) return console.warn(`[Integrations] Unknown messenger: ${messenger}`);
    const url = m.directMessage ? m.directMessage(text || 'Здраво! Имам прашање за играта Александар.') : m.url;
    window.open(url, '_blank');
    this._trackEvent('contact_messenger', { messenger });
  },

  // === NEWSLETTER SIGNUP (via mailto for simplicity) ===
  newsletterSignup() {
    const subject = 'Newsletter Signup — Aleksandar Game';
    const body = `Здраво!\n\nСакам да се претплатам на newsletter за играта.\n\nЕ-mail: \nИме (опционално): \nЈазик: МК/EN\n\nХвала!`;
    this.contactSupport(subject, body);
  },

  // === BUSINESS / SPONSORSHIP INQUIRIES ===
  businessInquiry() {
    const subject = 'Business Inquiry — Aleksandar Game';
    const body = `Здраво!\n\nСум заинтересиран/а за:\n[ ] Спонзорство\n[ ] Партнерство\n[ ] Reklamiranje\n[ ] Други можности\n\nКомпанија: \nЛице за контакт: \nПорака: \n`;
    this.contactSupport(subject, body);
  },

  // === BUG REPORT ===
  reportBug() {
    const subject = 'Bug Report — Aleksandar Game';
    const userAgent = navigator.userAgent;
    const url = window.location.href;
    const body = `Опис на проблемот:\n\n\n---\nТехнички детали:\nURL: ${url}\nUser-Agent: ${userAgent}\nДата: ${new Date().toISOString()}`;
    this.contactSupport(subject, body);
  },

  // === RENDER SOCIAL HUB UI (callable from main menu) ===
  renderSocialHub() {
    const existing = document.getElementById('social-hub-modal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'social-hub-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;font-family:Inter,sans-serif';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const socialButtons = Object.entries(this.social).map(([key, s]) => `
      <button onclick="Integrations.shareGame('${key}')" class="social-hub-btn" data-platform="${key}">
        <span style="font-size:24px">${this._getEmoji(key)}</span>
        <span style="font-size:11px;text-transform:capitalize">${key === 'twitter' ? 'X (Twitter)' : key}</span>
      </button>
    `).join('');

    const messengerButtons = Object.entries(this.messengers).map(([key, m]) => `
      <button onclick="Integrations.contactViaMessenger('${key}')" class="social-hub-btn messenger" data-platform="${key}">
        <span style="font-size:24px">${this._getEmoji(key)}</span>
        <span style="font-size:11px;text-transform:capitalize">${key}</span>
      </button>
    `).join('');

    modal.innerHTML = `
      <div style="background:linear-gradient(135deg,#1A1525,#0F0C18);border:2px solid rgba(255,215,0,0.4);border-radius:24px;padding:24px;max-width:540px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 60px rgba(255,215,0,0.2)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div>
            <h2 style="color:#FFD700;font-size:22px;font-weight:bold;margin:0">🌐 Поврзи се со нас</h2>
            <p style="color:#FFF8E7;opacity:0.5;font-size:12px;margin-top:4px">${this.config.contactEmail}</p>
          </div>
          <button onclick="document.getElementById('social-hub-modal').remove()" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px">×</button>
        </div>

        <h3 style="color:#FFA500;font-size:14px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">📱 Социјални Мрежи</h3>
        <div class="social-hub-grid">${socialButtons}</div>

        <h3 style="color:#4A90E2;font-size:14px;margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px">💬 Месинџери</h3>
        <div class="social-hub-grid">${messengerButtons}</div>

        <h3 style="color:#22c55e;font-size:14px;margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px">📧 Директен Контакт</h3>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
          <button onclick="Integrations.contactSupport()" class="social-hub-btn" style="background:rgba(34,197,94,0.15);border-color:rgba(34,197,94,0.4);color:#22c55e">
            <span style="font-size:24px">📧</span>
            <span style="font-size:11px">Поддршка</span>
          </button>
          <button onclick="Integrations.businessInquiry()" class="social-hub-btn" style="background:rgba(168,85,247,0.15);border-color:rgba(168,85,247,0.4);color:#a855f7">
            <span style="font-size:24px">💼</span>
            <span style="font-size:11px">Бизнис</span>
          </button>
          <button onclick="Integrations.newsletterSignup()" class="social-hub-btn" style="background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.4);color:#3b82f6">
            <span style="font-size:24px">📰</span>
            <span style="font-size:11px">Newsletter</span>
          </button>
          <button onclick="Integrations.reportBug()" class="social-hub-btn" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#ef4444">
            <span style="font-size:24px">🐛</span>
            <span style="font-size:11px">Грешка</span>
          </button>
        </div>

        <p style="color:#FFF8E7;opacity:0.4;font-size:11px;text-align:center;margin-top:20px">Сите канали се поврзани со <span style="color:#FFD700">${this.config.contactEmail}</span></p>
      </div>

      <style>
        .social-hub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 6px;
        }
        .social-hub-btn {
          background: rgba(255,215,0,0.08);
          border: 1px solid rgba(255,215,0,0.25);
          color: #FFD700;
          border-radius: 12px;
          padding: 10px 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          min-height: 70px;
          touch-action: manipulation;
        }
        .social-hub-btn:hover {
          background: rgba(255,215,0,0.18);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255,215,0,0.2);
        }
        .social-hub-btn.messenger {
          background: rgba(74,144,226,0.1);
          border-color: rgba(74,144,226,0.3);
          color: #4A90E2;
        }
      </style>
    `;

    document.body.appendChild(modal);
    this._trackEvent('social_hub_opened');
  },

  // === HELPER: emoji per platform ===
  _getEmoji(platform) {
    const emojis = {
      facebook: '📘', instagram: '📷', twitter: '𝕏', tiktok: '🎵',
      youtube: '▶️', linkedin: '💼', pinterest: '📌', snapchat: '👻',
      reddit: '🤖', vk: '🇷🇺', threads: '🧵', bluesky: '🦋', mastodon: '🐘',
      whatsapp: '💚', telegram: '✈️', viber: '💜', messenger: '💬',
      discord: '🎮', signal: '🔒', line: '🟢', wechat: '💚',
      kakaotalk: '💛', skype: '🔵',
    };
    return emojis[platform] || '🔗';
  },

  // === HELPER: copy link to clipboard ===
  _copyLink(url) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(url).then(() => {
        if (window.Legacy?.showToast) window.Legacy.showToast('📋 Линк копиран!');
        else if (window.PWA?.showToast) window.PWA.showToast('📋 Линк копиран!');
        this._trackShare('copy_link');
      });
    }
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  },

  _trackShare(platform) {
    if (window.MagicTracking?.trackSocialShare) {
      window.MagicTracking.trackSocialShare(platform);
    }
  },

  _trackEvent(name, data = {}) {
    if (window.MagicTracking?.trackEvent) {
      window.MagicTracking.trackEvent(name, { ...data, email: this.config.contactEmail });
    }
  },

  // === INIT ===
  init() {
    window.Integrations = this;
    console.log(`[Integrations] All channels connected to: ${this.config.contactEmail}`);
    console.log(`[Integrations] Social platforms: ${Object.keys(this.social).length}`);
    console.log(`[Integrations] Messengers: ${Object.keys(this.messengers).length}`);
    return this;
  },
};

// Auto-init
if (typeof window !== 'undefined') {
  window.Integrations = Integrations;
  if (document.readyState !== 'loading') Integrations.init();
  else document.addEventListener('DOMContentLoaded', () => Integrations.init());
}
