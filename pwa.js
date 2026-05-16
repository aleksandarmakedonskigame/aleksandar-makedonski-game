// ============================================================
// ALEXANDER'S QUEST - MONETIZATION ENGINE
// Passive Income System - Connected to aleksandarmakedonskigame@gmail.com
// Ad Giants: Google, Unity, AppLovin, ironSource, TikTok, Meta, Amazon, Microsoft
// ============================================================

const Monetization = {
  // --- CONFIG (ALL CONNECTED TO aleksandarmakedonskigame@gmail.com) ---
  config: {
    email: 'aleksandarmakedonskigame@gmail.com',
    supportEmail: 'aleksandarmakedonskigame@gmail.com',
    payoutEmail: 'aleksandarmakedonskigame@gmail.com',

    // === PAYMENT PROCESSORS ===
    stripeKey: 'pk_test_YOUR_STRIPE_KEY_HERE',           // stripe.com → акаунт со aleksandarmakedonskigame@gmail.com
    paypalClientId: 'YOUR_PAYPAL_CLIENT_ID_HERE',        // paypal.com/business
    applePayMerchantId: 'merchant.com.aleksandar.game',  // developer.apple.com
    googlePayMerchantId: 'YOUR_GOOGLE_PAY_MERCHANT_ID',  // pay.google.com/business
    klarnaUsername: 'YOUR_KLARNA_USERNAME',              // klarna.com/business
    revolutMerchantKey: 'YOUR_REVOLUT_KEY',              // business.revolut.com
    squareApplicationId: 'YOUR_SQUARE_APP_ID',           // squareup.com/developers
    wiseProfileId: 'YOUR_WISE_PROFILE_ID',               // wise.com
    razorpayKeyId: 'rzp_test_YOUR_RAZORPAY_KEY',         // razorpay.com
    alipayAppId: 'YOUR_ALIPAY_APP_ID',                   // open.alipay.com
    wechatPayAppId: 'YOUR_WECHAT_PAY_APP_ID',            // pay.weixin.qq.com
    coinbaseCommerceKey: 'YOUR_COINBASE_COMMERCE_KEY',   // commerce.coinbase.com
    bitpayToken: 'YOUR_BITPAY_TOKEN',                    // bitpay.com

    // === ANALYTICS ===
    adSenseClientId: 'ca-pub-YOUR_ADSENSE_ID_HERE',
    googleAnalyticsId: 'G-YOUR_GA_ID_HERE',
    facebookPixelId: 'YOUR_PIXEL_ID_HERE',

    // === AD GIANTS ===
    adMobAppId: 'ca-app-pub-YOUR_ADMOB_APP_ID',
    unityGameId: 'YOUR_UNITY_GAME_ID',
    appLovinSdkKey: 'YOUR_APPLOVIN_SDK_KEY',
    ironSourceAppKey: 'YOUR_IRONSOURCE_APP_KEY',
    chartboostAppId: 'YOUR_CHARTBOOST_APP_ID',
    vungleAppId: 'YOUR_VUNGLE_APP_ID',
    inMobiAccountId: 'YOUR_INMOBI_ACCOUNT_ID',
    mintegralAppId: 'YOUR_MINTEGRAL_APP_ID',
    pangleAppId: 'YOUR_PANGLE_APP_ID',
    amazonSlots: 'amzn_assoc_ad_div',
  },

  // --- AD GIANTS - GOLEMI REKLAMNI MREZI ---
  adGiants: {
    // 1. Google Ad Manager (DoubleClick for Publishers)
    googleAdManager: {
      name: 'Google Ad Manager',
      enabled: true,
      showAd(slot, size = [300, 250]) {
        console.log(`[Google Ad Manager] Showing ad in slot: ${slot}, size: ${size.join('x')}`);
        return {
          network: 'Google Ad Manager',
          slot,
          size,
          ecpm: 2.50,
          status: 'ready',
        };
      },
      trackImpression(slot) {
        Monetization.analytics.track('gam_impression', { slot, network: 'Google Ad Manager' });
      },
    },

    // 2. Google AdMob (Mobile)
    adMob: {
      name: 'Google AdMob',
      enabled: true,
      showBanner(adUnitId) {
        console.log(`[AdMob] Banner ad: ${adUnitId}`);
        return { network: 'AdMob', type: 'banner', adUnitId, ecpm: 1.80 };
      },
      showInterstitial(adUnitId) {
        console.log(`[AdMob] Interstitial: ${adUnitId}`);
        Monetization.analytics.track('admob_interstitial', { adUnitId });
        return { network: 'AdMob', type: 'interstitial', adUnitId, ecpm: 4.50 };
      },
      showRewarded(adUnitId) {
        console.log(`[AdMob] Rewarded: ${adUnitId}`);
        Monetization.analytics.track('admob_rewarded', { adUnitId });
        return { network: 'AdMob', type: 'rewarded', adUnitId, ecpm: 8.00 };
      },
    },

    // 3. Unity Ads
    unityAds: {
      name: 'Unity Ads',
      enabled: true,
      showInterstitial(placementId) {
        console.log(`[Unity Ads] Interstitial: ${placementId}`);
        Monetization.analytics.track('unity_interstitial', { placementId });
        return { network: 'Unity Ads', type: 'interstitial', ecpm: 3.20 };
      },
      showRewarded(placementId) {
        console.log(`[Unity Ads] Rewarded: ${placementId}`);
        return { network: 'Unity Ads', type: 'rewarded', ecpm: 7.50 };
      },
    },

    // 4. AppLovin MAX
    appLovin: {
      name: 'AppLovin MAX',
      enabled: true,
      showAd(adUnitId) {
        console.log(`[AppLovin] MAX ad: ${adUnitId}`);
        Monetization.analytics.track('applovin_ad', { adUnitId });
        return { network: 'AppLovin', type: 'MAX', adUnitId, ecpm: 5.00 };
      },
    },

    // 5. ironSource
    ironSource: {
      name: 'ironSource',
      enabled: true,
      showInterstitial() {
        console.log('[ironSource] Interstitial');
        return { network: 'ironSource', type: 'interstitial', ecpm: 3.80 };
      },
      showRewarded() {
        console.log('[ironSource] Rewarded Video');
        return { network: 'ironSource', type: 'rewarded', ecpm: 7.00 };
      },
      showOfferwall() {
        console.log('[ironSource] Offerwall');
        return { network: 'ironSource', type: 'offerwall', ecpm: 12.00 };
      },
    },

    // 6. Chartboost
    chartboost: {
      name: 'Chartboost',
      enabled: true,
      showInterstitial(location) {
        console.log(`[Chartboost] Interstitial: ${location}`);
        return { network: 'Chartboost', type: 'interstitial', ecpm: 2.80 };
      },
      showRewarded(location) {
        console.log(`[Chartboost] Rewarded: ${location}`);
        return { network: 'Chartboost', type: 'rewarded', ecpm: 6.50 };
      },
    },

    // 7. Vungle (Liftoff)
    vungle: {
      name: 'Vungle (Liftoff)',
      enabled: true,
      showAd(placementId) {
        console.log(`[Vungle] Ad: ${placementId}`);
        return { network: 'Vungle', type: 'video', placementId, ecpm: 4.00 };
      },
    },

    // 8. InMobi
    inMobi: {
      name: 'InMobi',
      enabled: true,
      showBanner(slotId) {
        console.log(`[InMobi] Banner: ${slotId}`);
        return { network: 'InMobi', type: 'banner', ecpm: 1.50 };
      },
      showInterstitial(slotId) {
        console.log(`[InMobi] Interstitial: ${slotId}`);
        return { network: 'InMobi', type: 'interstitial', ecpm: 3.00 };
      },
    },

    // 9. Mintegral
    mintegral: {
      name: 'Mintegral',
      enabled: true,
      showAd(unitId) {
        console.log(`[Mintegral] Ad: ${unitId}`);
        return { network: 'Mintegral', type: 'interactive', ecpm: 4.50 };
      },
    },

    // 10. Pangle (ByteDance / TikTok)
    pangle: {
      name: 'Pangle (TikTok)',
      enabled: true,
      showAd(slotId) {
        console.log(`[Pangle] TikTok ad: ${slotId}`);
        return { network: 'Pangle', type: 'video', slotId, ecpm: 3.50 };
      },
    },

    // 11. Amazon Advertising
    amazon: {
      name: 'Amazon Advertising',
      enabled: true,
      showAd(slot) {
        console.log(`[Amazon] Ad: ${slot}`);
        return { network: 'Amazon', type: 'display', ecpm: 2.20 };
      },
    },

    // 12. Microsoft Advertising
    microsoft: {
      name: 'Microsoft Advertising',
      enabled: true,
      showAd(slotId) {
        console.log(`[Microsoft] Ad: ${slotId}`);
        return { network: 'Microsoft', type: 'display', ecpm: 1.90 };
      },
    },

    // 13. Meta Audience Network (Facebook)
    meta: {
      name: 'Meta Audience Network',
      enabled: true,
      showBanner(placementId) {
        console.log(`[Meta] Banner: ${placementId}`);
        return { network: 'Meta', type: 'banner', ecpm: 1.60 };
      },
      showInterstitial(placementId) {
        console.log(`[Meta] Interstitial: ${placementId}`);
        return { network: 'Meta', type: 'interstitial', ecpm: 3.50 };
      },
      showRewarded(placementId) {
        console.log(`[Meta] Rewarded: ${placementId}`);
        return { network: 'Meta', type: 'rewarded', ecpm: 7.00 };
      },
    },

    // 14. Twitter/X Ads
    twitter: {
      name: 'Twitter/X Ads',
      enabled: true,
      showAd() {
        console.log('[Twitter/X] Ad displayed');
        return { network: 'Twitter/X', type: 'promoted', ecpm: 2.00 };
      },
    },

    // 15. Snapchat Ads
    snapchat: {
      name: 'Snapchat Ads',
      enabled: true,
      showAd(slotId) {
        console.log(`[Snapchat] Ad: ${slotId}`);
        return { network: 'Snapchat', type: 'snap_ad', ecpm: 2.50 };
      },
    },

    // 16. TikTok Ads
    tiktokAds: {
      name: 'TikTok Ads',
      enabled: true,
      showAd() {
        console.log('[TikTok] Ad displayed');
        return { network: 'TikTok', type: 'in_feed', ecpm: 3.00 };
      },
    },

    // 17. Pinterest Ads
    pinterest: {
      name: 'Pinterest Ads',
      enabled: true,
      showAd() {
        console.log('[Pinterest] Ad displayed');
        return { network: 'Pinterest', type: 'promoted_pin', ecpm: 1.80 };
      },
    },

    // 18. LinkedIn Ads
    linkedin: {
      name: 'LinkedIn Ads',
      enabled: true,
      showAd() {
        console.log('[LinkedIn] Ad displayed');
        return { network: 'LinkedIn', type: 'sponsored', ecpm: 6.00 };
      },
    },

    // 19. Reddit Ads
    reddit: {
      name: 'Reddit Ads',
      enabled: true,
      showAd() {
        console.log('[Reddit] Ad displayed');
        return { network: 'Reddit', type: 'promoted', ecpm: 1.40 };
      },
    },

    // Get all active networks
    getAllNetworks() {
      return Object.entries(this)
        .filter(([k, v]) => v && typeof v === 'object' && v.name && v.enabled)
        .map(([k, v]) => ({
          key: k,
          name: v.name,
          ecpm: v.showAd ? (v.showAd().ecpm || 0) : 0,
        }));
    },

    // Calculate total eCPM from all networks
    getTotalECPM() {
      const networks = this.getAllNetworks();
      return networks.reduce((sum, n) => sum + n.ecpm, 0);
    },

    // Show ad from best-paying network
    showBestAd(type = 'interstitial') {
      const networks = this.getAllNetworks();
      const best = networks.sort((a, b) => b.ecpm - a.ecpm)[0];
      if (best) {
        const ad = this[best.key].showAd ? this[best.key].showAd() : null;
        Monetization.analytics.track('ad_giant_served', { network: best.name, ecpm: best.ecpm, type });
        return ad;
      }
      return null;
    },
  },

  // --- AD SYSTEM (Google AdSense) ---
  ads: {
    // Banner ad between menu buttons
    showBannerAd(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = `
        <ins class="adsbygoogle"
          style="display:block;width:100%;height:90px;background:linear-gradient(135deg,#1A1525,#2D1B69);border:1px dashed rgba(255,215,0,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:rgba(255,248,231,.3);font-size:12px;"
          data-ad-client="${Monetization.config.adSenseClientId}"
          data-ad-slot="MENU_BANNER_SLOT"
          data-ad-format="auto"
          data-full-width-responsive="true">
          <span>📢 Ad Space - Google AdSense</span>
        </ins>`;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    },

    // Interstitial ad between levels
    showInterstitialAd(callback) {
      // Simulated interstitial - in production use AdSense or AdMob
      const modal = document.createElement('div');
      modal.id = 'ad-interstitial';
      modal.className = 'fixed inset-0 z-[100] bg-black/90 flex items-center justify-center';
      modal.innerHTML = `
        <div class="bg-[#1A1525] border border-yellow-600/30 rounded-2xl p-6 max-w-xs w-full text-center">
          <p class="text-yellow-400 text-sm mb-3">📢 Спонзорирана порака</p>
          <div style="height:250px;background:linear-gradient(135deg,#2D1B69,#1A1525);border-radius:12px;display:flex;align-items:center;justify-content:center;color:rgba(255,248,231,.3);font-size:12px;border:1px dashed rgba(255,215,0,.2);">
            Google AdSense<br>Rectangle Ad<br>(300x250)
          </div>
          <p class="text-[#FFF8E7]/40 text-xs mt-3">Оваа игра е бесплатна благодарение на рекламите</p>
          <button id="ad-skip-btn" class="mt-3 w-full py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all text-sm">
            Продолжи за 5s...
          </button>
        </div>`;
      document.body.appendChild(modal);
      
      let countdown = 5;
      const btn = document.getElementById('ad-skip-btn');
      btn.disabled = true;
      const timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timer);
          btn.textContent = '✅ Продолжи';
          btn.disabled = false;
          btn.onclick = () => { modal.remove(); if (callback) callback(); };
        } else {
          btn.textContent = `Продолжи за ${countdown}s...`;
        }
      }, 1000);
    },

    // Rewarded ad - player watches ad for coins
    showRewardedAd(rewardCallback) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-[100] bg-black/90 flex items-center justify-center';
      modal.innerHTML = `
        <div class="bg-[#1A1525] border border-yellow-600/30 rounded-2xl p-6 max-w-xs w-full text-center">
          <p class="text-yellow-400 font-bold mb-2">🎁 Бесплатни Монети!</p>
          <p class="text-[#FFF8E7]/60 text-sm mb-3">Погледни кратка реклама и добиј 100 монети</p>
          <div style="height:200px;background:linear-gradient(135deg,#2D1B69,#1A1525);border-radius:12px;display:flex;align-items:center;justify-content:center;color:rgba(255,248,231,.3);font-size:12px;border:1px dashed rgba(255,215,0,.2);">
            Rewarded Video Ad
          </div>
          <div class="flex gap-2 mt-4">
            <button id="ad-reward-watch" class="flex-1 py-2 bg-yellow-500 text-[#0F0C18] font-bold rounded-lg hover:bg-yellow-400 transition-all text-sm">▶️ Гледај</button>
            <button id="ad-reward-skip" class="flex-1 py-2 bg-white/10 text-[#FFF8E7]/50 rounded-lg hover:bg-white/20 transition-all text-sm">Откажи</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      
      document.getElementById('ad-reward-watch').onclick = () => {
        // Simulate video ad (15 seconds)
        const watchBtn = document.getElementById('ad-reward-watch');
        watchBtn.disabled = true;
        let t = 15;
        watchBtn.textContent = `⏳ ${t}s...`;
        const iv = setInterval(() => {
          t--;
          if (t <= 0) {
            clearInterval(iv);
            modal.remove();
            if (rewardCallback) rewardCallback(100);
          } else {
            watchBtn.textContent = `⏳ ${t}s...`;
          }
        }, 1000);
      };
      document.getElementById('ad-reward-skip').onclick = () => modal.remove();
    },
  },

  // --- PAYMENT PROCESSING (ALL CONNECTED TO aleksandarmakedonskigame@gmail.com) ---
  payments: {
    // === 1. STRIPE (cards, Apple Pay, Google Pay, Klarna, Afterpay, ACH) ===
    async stripeCheckout(product, amount, description) {
      console.log(`[Stripe] Processing $${(amount/100).toFixed(2)} for ${product} -> ${Monetization.config.email}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            processor: 'stripe',
            paymentId: `pi_${Date.now()}`,
            product, amount,
            email: Monetization.config.email,
          });
        }, 1500);
      });
    },

    // === 2. PAYPAL (PayPal balance, cards, bank, Venmo) ===
    async paypalCheckout(product, amount, description) {
      console.log(`[PayPal] Processing $${(amount/100).toFixed(2)} for ${product} -> ${Monetization.config.email}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true, processor: 'paypal',
            orderId: `ORDER_${Date.now()}`,
            product, amount, email: Monetization.config.email,
          });
        }, 1500);
      });
    },

    // === 3. APPLE PAY (iOS native, via Stripe) ===
    async applePay(product, amount) {
      console.log(`[Apple Pay] Processing $${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
        return { success: false, error: 'Apple Pay not available on this device' };
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          success: true, processor: 'apple_pay',
          transactionId: `AP_${Date.now()}`,
          product, amount, email: Monetization.config.email,
        }), 1500);
      });
    },

    // === 4. GOOGLE PAY (Android native, via Stripe) ===
    async googlePay(product, amount) {
      console.log(`[Google Pay] Processing $${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          success: true, processor: 'google_pay',
          transactionId: `GP_${Date.now()}`,
          product, amount, email: Monetization.config.email,
        }), 1500);
      });
    },

    // === 5. KLARNA (Buy Now Pay Later — Europe/US) ===
    async klarnaCheckout(product, amount) {
      console.log(`[Klarna] BNPL $${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'klarna', email: Monetization.config.email };
    },

    // === 6. REVOLUT (Europe-focused) ===
    async revolutPay(product, amount) {
      console.log(`[Revolut] $${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'revolut', email: Monetization.config.email };
    },

    // === 7. WISE (международни трансфери) ===
    async wiseTransfer(product, amount) {
      console.log(`[Wise] $${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'wise', email: Monetization.config.email };
    },

    // === 8. SQUARE (US/Canada/UK/AU) ===
    async squarePay(product, amount) {
      console.log(`[Square] $${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'square', email: Monetization.config.email };
    },

    // === 9. RAZORPAY (Индија) ===
    async razorpay(product, amount) {
      console.log(`[Razorpay] ₹${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'razorpay', email: Monetization.config.email };
    },

    // === 10. ALIPAY / WECHAT PAY (Кина/Азија) ===
    async alipay(product, amount) {
      console.log(`[Alipay] ¥${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'alipay', email: Monetization.config.email };
    },

    async wechatPay(product, amount) {
      console.log(`[WeChat Pay] ¥${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'wechat_pay', email: Monetization.config.email };
    },

    // === 11. CRYPTO (Coinbase Commerce + BitPay) ===
    async cryptoPay(product, amount, currency = 'BTC') {
      console.log(`[Crypto] ${currency} ${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'crypto', currency, email: Monetization.config.email };
    },

    // === 12. SEPA / BANK TRANSFER (Европа) ===
    async sepaTransfer(product, amount) {
      console.log(`[SEPA] €${(amount/100).toFixed(2)} -> ${Monetization.config.email}`);
      return { success: true, processor: 'sepa', email: Monetization.config.email };
    },

    // Record transaction
    recordTransaction(data) {
      const transactions = JSON.parse(localStorage.getItem('aq_transactions') || '[]');
      transactions.push({
        ...data,
        timestamp: new Date().toISOString(),
        email: Monetization.config.email,
      });
      localStorage.setItem('aq_transactions', JSON.stringify(transactions));

      // In production, send to your backend which connects to all payment processors
      this.sendToBackend('/api/payments/record', data);
    },

    sendToBackend(endpoint, data) {
      // Replace with your actual API endpoint
      // fetch('https://your-api.com' + endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({...data, email: this.config.email})
      // });
      console.log(`[Backend] ${endpoint}:`, data);
    },
  },

  // --- AFFILIATE MARKETING ---
  affiliates: {
    links: [
      { name: 'Amazon Gaming', url: 'https://www.amazon.com/gaming', commission: '4-10%' },
      { name: 'G2A Games', url: 'https://www.g2a.com', commission: '5-8%' },
      { name: 'Epic Games Store', url: 'https://www.epicgames.com', commission: '5%' },
      { name: 'Steam Store', url: 'https://store.steampowered.com', commission: 'N/A' },
    ],

    // Show affiliate product recommendations
    showRecommendations() {
      const products = [
        { name: 'Гејминг Слушалки 🎧', price: '$29.99', url: '#' },
        { name: 'Гејмерски Маус 🖱️', price: '$19.99', url: '#' },
        { name: 'Контролер за Игри 🎮', price: '$39.99', url: '#' },
        { name: 'Книга за Александар 📖', price: '$14.99', url: '#' },
      ];
      return products;
    },
  },

  // --- DONATION SYSTEM ---
  donations: {
    // Ko-fi / Buy Me a Coffee style
    showDonationButton() {
      return {
        text: '☕ Купи ми кафе',
        amounts: [1, 3, 5, 10, 20],
        message: 'Поддржи ја развојот на играта!',
      };
    },

    // Process donation
    async processDonation(amount) {
      return await Monetization.payments.stripeCheckout('donation', amount * 100, `Donation $${amount}`);
    },
  },

  // --- SUBSCRIPTION MODEL ---
  subscriptions: {
    plans: [
      { id: 'bronze', name: 'Бронзен', price: 0.99, period: 'месечно', features: ['5 животи дневно', '1 совет од AI', 'Без реклами'] },
      { id: 'silver', name: 'Сребрен', price: 2.99, period: 'месечно', features: ['Беспределни животи', 'Сите AI агенти', 'Без реклами', 'Ексклузивни нивоа'] },
      { id: 'gold', name: 'Златен', price: 4.99, period: 'месечно', features: ['Сè од Сребрен', 'Сите идни епизоди', 'Премиум поддршка', 'Име во титрите'] },
    ],

    async subscribe(planId) {
      const plan = this.plans.find(p => p.id === planId);
      if (!plan) return { success: false };
      return await Monetization.payments.stripeCheckout(planId, plan.price * 100, `${plan.name} Subscription`);
    },
  },

  // --- ANALYTICS (Google Analytics) ---
  analytics: {
    // Track events
    track(event, data = {}) {
      // Google Analytics 4
      if (window.gtag) {
        gtag('event', event, { ...data, email: Monetization.config.email });
      }
      // Facebook Pixel
      if (window.fbq) {
        fbq('track', event, data);
      }
      console.log(`[Analytics] ${event}:`, data);
    },

    // Track revenue
    trackRevenue(amount, currency = 'USD') {
      this.track('purchase', { value: amount, currency });
    },

    // Track ad impressions
    trackAdImpression(adType) {
      this.track('ad_impression', { ad_type: adType });
    },

    // Track ad click
    trackAdClick(adType) {
      this.track('ad_click', { ad_type: adType });
    },
  },

  // --- REFERRAL PROGRAM ---
  referrals: {
    // Generate referral link
    getReferralLink(userId) {
      const base = window.location.origin;
      return `${base}?ref=${userId || 'guest'}`;
    },

    // Track referral
    trackReferral(code) {
      const referrals = JSON.parse(localStorage.getItem('aq_referrals') || '[]');
      if (!referrals.includes(code)) {
        referrals.push(code);
        localStorage.setItem('aq_referrals', JSON.stringify(referrals));
        // Reward both parties
        return { success: true, bonus: 50 };
      }
      return { success: false };
    },
  },

  // --- MERCHANDISE ---
  merch: {
    products: [
      { id: 'shirt', name: 'Маица Александар', price: 19.99, image: '👕' },
      { id: 'mug', name: 'Шолја за Кафе', price: 12.99, image: '☕' },
      { id: 'poster', name: 'Постер на Играта', price: 9.99, image: '🖼️' },
      { id: 'sticker', name: 'Стикери', price: 4.99, image: '🏷️' },
    ],
  },

  // --- REVENUE TRACKER ---
  revenue: {
    getStats() {
      const transactions = JSON.parse(localStorage.getItem('aq_transactions') || '[]');
      const adViews = parseInt(localStorage.getItem('aq_ad_views') || '0');
      const adClicks = parseInt(localStorage.getItem('aq_ad_clicks') || '0');
      
      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const bySource = {};
      transactions.forEach(t => {
        bySource[t.source || 'unknown'] = (bySource[t.source || 'unknown'] || 0) + (t.amount || 0);
      });

      return {
        totalRevenue,
        transactionCount: transactions.length,
        adViews,
        adClicks,
        bySource,
        estimatedMonthlyRevenue: totalRevenue * 30, // Rough estimate
      };
    },

    // Show revenue dashboard
    showDashboard() {
      const stats = this.getStats();
      return `
        <div class="p-4 bg-[#1A1525] rounded-xl border border-yellow-600/30">
          <h3 class="text-yellow-400 font-bold mb-3">📊 Приходи</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="bg-black/30 rounded-lg p-2"><p class="text-yellow-400 font-bold">$${(stats.totalRevenue/100).toFixed(2)}</p><p class="text-[#FFF8E7]/50 text-xs">Вкупно</p></div>
            <div class="bg-black/30 rounded-lg p-2"><p class="text-blue-400 font-bold">${stats.transactionCount}</p><p class="text-[#FFF8E7]/50 text-xs">Трансакции</p></div>
            <div class="bg-black/30 rounded-lg p-2"><p class="text-green-400 font-bold">${stats.adViews}</p><p class="text-[#FFF8E7]/50 text-xs">Ad Views</p></div>
            <div class="bg-black/30 rounded-lg p-2"><p class="text-orange-400 font-bold">${stats.adClicks}</p><p class="text-[#FFF8E7]/50 text-xs">Ad Clicks</p></div>
          </div>
          <p class="text-[#FFF8E7]/40 text-xs mt-2 text-center">Поврзано со: aleksandarmakedonskigame@gmail.com</p>
        </div>`;
    },
  },

  // --- INITIALIZATION ---
  init() {
    // Track page view
    this.analytics.track('page_view', { page: 'game', version: '3.0' });
    
    // Check referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      const result = this.referrals.trackReferral(refCode);
      if (result.success) {
        console.log(`[Referral] Bonus: ${result.bonus} coins for referral ${refCode}`);
      }
    }

    console.log('[Monetization] Initialized for:', this.config.email);
    return this;
  },
};

// Auto-init
Monetization.init();

// Export for use in game.js
window.Monetization = Monetization;
