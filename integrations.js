# 📧 Поврзување на сервиси со aleksandarmakedonskigame@gmail.com

> **Целосен чекор-по-чекор водич за активирање на сите платежни системи, социјални мрежи и месинџери за играта.**

---

## ✅ ВАЖНО ПРВО: Создади ги акаунтите

Сите овие сервиси треба **истиот мejl** за лесно следење. Користи:
**`aleksandarmakedonskigame@gmail.com`**

Препорачуваме исто така да го заштитиш мејлот со:
- ✅ 2-Factor Authentication (Google)
- ✅ Backup телефон број
- ✅ Recovery email
- ✅ Силна лозинка (мин 14 знака)

---

## 💳 ПЛАТЕЖНИ СИСТЕМИ (12 опции)

### 1. **Stripe** (НАЈВАЖНО — главен платежен процесор)
- 🌐 Регистрирај се: https://stripe.com → Sign up со `aleksandarmakedonskigame@gmail.com`
- 🔑 Земи го API клучот: Dashboard → Developers → API keys
- 📝 Во `monetization.js`, замени:
  ```js
  stripeKey: 'pk_live_TVOJ_VISTINSKI_KLUC_OVDE'
  ```
- 💰 **Цена:** 2.9% + 30¢ по трансакција
- ✅ **Поддршка:** Сите картички, Apple Pay, Google Pay, Klarna, ACH автоматски

### 2. **PayPal Business**
- 🌐 Регистрирај се: https://paypal.com/business → со истиот email
- 🔑 Земи Client ID: Developer → My Apps & Credentials
- 📝 Во `monetization.js`:
  ```js
  paypalClientId: 'TVOJ_VISTINSKI_PAYPAL_CLIENT_ID'
  ```
- 💰 **Цена:** 2.9% + 30¢
- ✅ **Поддршка:** Корисници кои не сакаат картичка

### 3. **Apple Pay** (преку Stripe — нема посебна регистрација!)
- ✅ Автоматски активно ако имаш Stripe!
- 📝 Само додај Merchant ID во `manifest.json`:
  ```json
  "apple_pay_merchant_id": "merchant.com.aleksandar.game"
  ```
- 💡 Регистрирај Merchant ID на: https://developer.apple.com (треба $99/год developer акаунт)

### 4. **Google Pay** (преку Stripe — нема посебна регистрација!)
- ✅ Автоматски активно ако имаш Stripe!
- 📝 За Android native: https://pay.google.com/business → Merchant ID

### 5. **Klarna** (BNPL — Купи Сега, Плати Подоцна) - Европа/САД
- 🌐 https://klarna.com/business → регистрација
- 📝 Во `monetization.js`:
  ```js
  klarnaUsername: 'TVOJ_KLARNA_USERNAME'
  ```
- 💡 Зголемува конверзија ~30% во Европа

### 6. **Revolut Business** (Европа)
- 🌐 https://business.revolut.com → регистрација
- ✅ Без месечни таксации, ниски такси

### 7. **Wise Business** (за интернационални трансфери)
- 🌐 https://wise.com/business
- 💰 Без скриени такси

### 8. **Square** (Северна Америка/Австралија/UK)
- 🌐 https://squareup.com/developers
- ✅ Алтернатива на Stripe

### 9. **Razorpay** (за Индискиот пазар)
- 🌐 https://razorpay.com
- ✅ Поддржува UPI, картички, banking

### 10. **Alipay + WeChat Pay** (за Кина)
- 🌐 https://open.alipay.com
- 🌐 https://pay.weixin.qq.com
- ⚠️ Бара кинески бизнис регистрација (комплицирано)

### 11. **Coinbase Commerce** (Крипто)
- 🌐 https://commerce.coinbase.com → регистрација
- 📝 Прима Bitcoin, Ethereum, USDC и др.
- 💰 1% такса

### 12. **SEPA Bank Transfer** (Европа)
- ✅ Преку Stripe автоматски
- 💰 0.8% такса (€5 max)

---

## 📱 СОЦИЈАЛНИ МРЕЖИ (13 платформи)

Создади профили со **истиот email** на сите овие:

### 🏆 ОБАВЕЗНИ ЗА ДЕТСКА ИГРА

| Платформа | Зошто | URL за регистрација |
|-----------|-------|---------------------|
| **Facebook Page** | Родителите се таму | https://facebook.com/pages/create |
| **Instagram** | Визуелна содржина за играта | https://instagram.com/accounts/emailsignup/ |
| **YouTube** | Trailer + gameplay видеа | https://youtube.com/account |
| **TikTok** | Виралност за младите | https://tiktok.com/signup |

### 🥈 ПРЕПОРАЧАНИ

| Платформа | Зошто |
|-----------|-------|
| **X (Twitter)** | Updates, анонси, community |
| **LinkedIn** | За B2B (школи, спонзори) |
| **Pinterest** | Слики, infographics |
| **Reddit** | r/macedonia, r/IndieGaming |
| **Threads** | Алтернатива на X |

### 🥉 РЕГИОНАЛНИ

| Платформа | Регион |
|-----------|--------|
| **VK** | Русија / источна Европа |
| **Snapchat** | Млади 13-24 |
| **Mastodon** | Tech community |
| **Bluesky** | Развој на алтернативна платформа |

**📝 За секоја:** Користи username `aleksandarmakedonskigame` (или варијанта ако е зафатен)

---

## 💬 МЕСИНЏЕРИ (9 опции)

### 🏆 НАЈВАЖНИ ЗА БАЛКАН

#### 1. **WhatsApp Business**
- 🌐 Симни WhatsApp Business app на телефон
- 📝 Регистрирај број → автоматски е WhatsApp Business
- 🔗 https://wa.me/YOUR_PHONE — корисниците можат веднаш да пишат
- ⚡ **Активирај автоматски одговори** во апликацијата

#### 2. **Telegram Bot + Channel + Group**
- 🤖 Создади бот: Отвори @BotFather на Telegram → `/newbot`
- 📢 Создади channel: `@AleksandarMakedonskiGame`
- 👥 Создади group: `@AleksandarMakedonskiChat`
- 🔗 https://t.me/AleksandarMakedonskiGame

#### 3. **Viber Public Account**
- 🌐 https://www.viber.com/en/business/
- 📝 Регистрирај Public Account за играта

#### 4. **Facebook Messenger** (преку Facebook Page)
- ✅ Активира се автоматски кога правиш FB Page
- 🔗 m.me/AleksandarMakedonskiGame

### 🥈 ИНТЕРНАЦИОНАЛНИ

#### 5. **Discord Server**
- 🌐 https://discord.com → Create Server → "Aleksandar Game"
- 🤖 Додај бот за повеќе функции
- 🔗 Сподели invite link

#### 6. **Line** (Јапонија, Тајланд, Тајван)
- 🌐 https://account.line.biz → Official Account

#### 7. **WeChat** (Кина)
- 🌐 https://mp.weixin.qq.com → Official Account
- ⚠️ Бара регистрација во Кина

#### 8. **KakaoTalk** (Кореја)
- 🌐 https://business.kakao.com

#### 9. **Signal** (приватност-фокусирано)
- ✅ Користи го твојот телефонски број

---

## 📊 АНАЛИТИКА (за следење на сè)

### 1. **Google Analytics 4** (БЕСПЛАТНО, ОБАВЕЗНО)
- 🌐 https://analytics.google.com → Sign in
- 📝 Создади Property → земи ID `G-XXXXXXXXXX`
- Во `tracking.js`:
  ```js
  googleAnalyticsId: 'G-TVOJ_VISTINSKI_ID'
  ```

### 2. **Facebook Pixel** (за FB реклами)
- 🌐 https://business.facebook.com → Events Manager
- 📝 Земи Pixel ID
- Во `tracking.js`:
  ```js
  facebookPixelId: 'TVOJ_PIXEL_ID'
  ```

### 3. **TikTok Pixel** (за TikTok реклами)
- 🌐 https://ads.tiktok.com → Events
- 📝 Земи Pixel ID

### 4. **Google Search Console** (за SEO)
- 🌐 https://search.google.com/search-console
- ✅ Верификувај го URL-от на играта

---

## 🚀 ПРИОРИТЕТНА ЛИСТА (правилен редослед)

**📅 Прва недела:**
1. ✅ Gmail акаунт со 2FA
2. ✅ Stripe регистрација
3. ✅ PayPal Business
4. ✅ Google Analytics 4
5. ✅ Facebook Page + Messenger
6. ✅ Instagram
7. ✅ WhatsApp Business
8. ✅ Telegram Bot + Channel

**📅 Втора недела:**
9. ✅ YouTube channel
10. ✅ TikTok
11. ✅ Discord server
12. ✅ X (Twitter)

**📅 Третата недела:**
13. ✅ LinkedIn Page
14. ✅ Pinterest
15. ✅ Reddit username
16. ✅ Viber Public Account

**📅 Месец 2:**
17. ✅ Klarna, Revolut Business
18. ✅ Apple Pay (треба Apple Developer)
19. ✅ Google Pay merchant
20. ✅ Coinbase Commerce (за крипто)

---

## 🔐 БЕЗБЕДНОСНИ ПРЕПОРАКИ

- 🔒 **2FA на сите акаунти** (особено финансиски)
- 🔒 **Different passwords** — користи password manager (Bitwarden бесплатно)
- 🔒 **API клучеви** — никогаш не ги ставај во публичен Git repo!
- 🔒 **Environment variables** — користи `.env` фајл (веќе во .gitignore)
- 🔒 **Backup recovery codes** за секој сервис

---

## 💡 ПРЕДЛОГ ЗА ФАЗИРАН РАЗВОЈ

**Фаза 1: MVP (бесплатно)**
- Само Stripe + Google Analytics + Facebook + Instagram
- Cost: $0/месец

**Фаза 2: Growth ($25 еднократно)**
- Додај Google Play Store ($25)
- Додај WhatsApp Business + Telegram бот
- Cost: $25 еднократно

**Фаза 3: Scale ($99/год + reklami buget)**
- Додај Apple App Store ($99/год)
- Додај TikTok + YouTube content creation
- Додај платени реклами буџет
- Cost: ~$200-500/месец

---

## 📧 СУПЕР-ЕДНОСТАВЕН ПРИСТАП

Ако сите овие чекори ти изгледаат комплицирани, започни СО МИНИМУМ:

```
1. Stripe (за плаќања)
2. Google Analytics (за следење)
3. Facebook Page (за маркетинг)
4. WhatsApp Business (за подршка)
```

Тоа е 4 акаунти, 1 ден работа, и веднаш можеш да примаш плаќања + да следиш кориснички. Остатокот може да биде вклучен подоцна.

---

## 🆘 ПОТРЕБА ОД ПОМОШ?

Сите интеграции се веќе **кодирани во играта** — ти само треба да:
1. Регистрираш акаунти
2. Земеш API клучеви
3. Ги замениш placeholder вредностите во `monetization.js` и `tracking.js`

Целиот тек на пари оди директно на твојот email **`aleksandarmakedonskigame@gmail.com`**.

---

*"Преговарањето е опционално. Протоколот е апсолутен."*

— World Protocol Academy doctrine
