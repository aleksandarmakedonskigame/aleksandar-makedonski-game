# 👑 Мисија на Александар — Патот на Светлината v6.0

> **Светска уникатна образовна PWA-игра.** Една игра — сите платформи: PC, Mac, Linux, Android, iPhone, iPad. Инсталирлива како native апликација. Подготвена за Play Store и App Store преку PWA Builder.

[![PWA](https://img.shields.io/badge/PWA-Ready-success?style=flat&logo=pwa)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](#)
[![Phaser 3](https://img.shields.io/badge/Phaser-3.60-blue?style=flat)](#)
[![Offline](https://img.shields.io/badge/Offline-Yes-success?style=flat)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📱 НОВО ВО v6.0: PWA + Multi-Platform

Сега играта работи **беспрекорно на сите уреди**:

| Платформа | Како | Native feeling |
|-----------|------|----------------|
| 💻 **PC / Mac / Linux** | Browser или инсталирај од Chrome/Edge | ⭐⭐⭐⭐⭐ |
| 📱 **Android (Chrome)** | "Add to Home screen" | ⭐⭐⭐⭐⭐ |
| 🍎 **iPhone / iPad (Safari)** | "Add to Home Screen" | ⭐⭐⭐⭐⭐ |
| 🤖 **Google Play Store** | Преку PWA Builder (бесплатно) | ⭐⭐⭐⭐ |
| 🍎 **Apple App Store** | Преку Capacitor (треба Mac) | ⭐⭐⭐⭐ |

**Видови:** Прочитај `STORE_DEPLOYMENT.md` за детални упатства за сите 3 опции.

---

## ✨ Светски уникатни функции

### 🏛️ Living Legacy Capsule
Прв систем во едукативна игра каде секој играч може да остави **своја мудрост** за идните патници. Колективен ѕид со 6 seed-цитати + неограничен простор. Без бекенд.

### 📜 Светски Пасош на Знаењето
Уникатен SVG пасош со 37 марки, персонализиран ID, QR-стилизиран знак. Се симнува и споделува.

### ⚡ Искра на Мудрост
37 историски факти → 37 уникатни градиент-картички. Web Share API за нативно споделување.

### 👁️ Magic Eye Tracking + 🤖 AI Coach
- Heatmap на каде гледа играчот
- 9-делна зонска анализа
- **AI Coach**: кога играч умре 3, 7 или 12 пати на исто ниво, Аристотел доаѓа со совет!

### 📱 NEW: Native App Experience
- Инсталирлива како native апликација
- Работи **офлајн** (service worker)
- Touch controls за мобилни (D-pad + skok)
- Safe-area подршка за iPhone notch
- Auto-detect platform (Desktop/Mobile/iOS/Android)
- App shortcuts (long-press икона → Играј / Капсула)

---

## 📦 Структура

```
aleksandar-makedonski-igra/
├── index.html              # Главен HTML + PWA meta + touch controls
├── manifest.json           # 🆕 PWA manifest (што го прави инсталирлив)
├── sw.js                   # 🆕 Service Worker (offline support)
├── pwa.js                  # 🆕 PWA logic: install, touch, orientation
├── game.js                 # Phaser 3 + responsive scaling
├── monetization.js         # 14 ad мрежи + Stripe/PayPal
├── legacy.js               # Living Legacy (Capsule + Passport + Spark)
├── tracking.js             # Magic Tracking + AI Coach
├── icons/                  # 🆕 Сите PWA икони (72-512px) + screenshots
│   ├── icon-72.png ... icon-512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16.png, favicon-32.png
│   └── screenshot-mobile.png, screenshot-desktop.png
├── PRIVACY_POLICY.md       # 🆕 За Play Store / App Store
├── TERMS.md                # 🆕 За Play Store / App Store
├── STORE_DEPLOYMENT.md     # 🆕 Како да го качиш на сторовите
├── PUSHI_ME.bat, pushi_me.sh
├── KAKO_DA_IGRASH.txt
└── README.md
```

---

## 🚀 Брз почеток

### Локално (тестирање)
```bash
# Windows: двоен клик на PUSHI_ME.bat
# Mac/Linux:
bash pushi_me.sh
```

### Веб-деплој (за PWA да работи!)

**Опција A: GitHub Pages** (бесплатно, 5 мин)
1. Нов repo на github.com
2. Качи ги сите фајлови
3. Settings → Pages → main branch → Save
4. После 1 мин: `https://username.github.io/aleksandar/`

**Опција B: Netlify Drop** (бесплатно, 30 сек)
1. Отвори https://app.netlify.com/drop
2. Drag-and-drop ja папката
3. Готово!

**Опција C: Vercel** (бесплатно)
```bash
npx vercel
```

---

## 📱 Како се инсталира како апликација?

### На Android (Chrome / Edge / Brave)
1. Отвори ja играта во browser
2. Притисни ⋮ (три точки) → **"Install app"**
3. Готово! Иконата е на home screen

### На iPhone / iPad (Safari ОБАВЕЗНО)
1. Отвори ja играта во **Safari** (не Chrome!)
2. Притисни Share (квадрат со стрелка)
3. Скролај → **"Add to Home Screen"**
4. Готово!

### На PC / Mac (Chrome / Edge)
1. Отвори ja играта
2. Во address bar-от: ⊕ или 📲 икона
3. Клик → "Install"

---

## 🏪 За Play Store и App Store

Прочитај **`STORE_DEPLOYMENT.md`** — таму е сè:
- PWA Builder workflow за Android APK ($25 еднократно)
- Capacitor workflow за iOS ($99/година)
- Privacy policy template (задолжителна)
- Marketing assets што ти требаат
- Содржински категории и age rating

---

## 🎮 Што има во играта?

| Категорија | Содржина |
|------------|----------|
| **Нивоа** | 37 (3 епизоди) |
| **Историски факти** | 37 верификувани |
| **AI Помошници** | 4 (Аристотел, Букефал, Хефестион, Птоломеј) |
| **Камаради** | 4 со XP и способности |
| **Александрија Builder** | 10 згради (по Level 37) |
| **Јазици** | Македонски + English |
| **Социјално** | 16 платформи |
| **Аналитика** | GA4, FB Pixel, TikTok, X, Eye Tracking |
| **Платформи** | PWA на сите OS-и |
| **Контроли** | Tastatura + Touch + Gamepad (Phaser) |

---

## 🔧 Пред живо лансирање

### Замени placeholder клучеви

**`monetization.js`:**
```js
config: { stripeKey: 'pk_live_...', paypalClientId: '...' }
```

**`tracking.js`:**
```js
config: { googleAnalyticsId: 'G-...', facebookPixelId: '...' }
```

### Тестирај PWA пред пуштање

1. Отвори ja играта на HTTPS URL
2. Chrome DevTools → Application → Manifest
3. Application → Service Workers (треба да биде "activated")
4. Lighthouse → PWA score треба да биде 90+

---

## 📜 Лиценца

MIT License — за лична, образовна и комерцијална употреба со атрибуција.

---

## 🏛️ За авторот

**World Protocol Academy** — образовна донација за идните генерации.

**Контакт:** aleksandarmakedonskigame@gmail.com
**Web:** worldprotocolacademy.com | ohridprotocol.org

---

## 📊 Историја на верзии

- **v6.0** (Мај 2026) — PWA + Multi-platform + Touch controls + Store-ready
- **v5.0** — Magic Eye Tracking + AI Coach
- **v4.0** — Living Legacy Capsule
- **v3.0** — 37 нивоа + камаради + Александрија
- **v2.0** — AI агенти + социјално
- **v1.0** — Phaser 3 база

---

⭐ **Ако ти се допаѓа играта, дај звезда на repo-то!**

> *"Светот е книга, а оние кои патуваат читаат повеќе страници."* — Александар
