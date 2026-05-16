# 📱 Како да го качиш Александар на Play Store и App Store

> **Овој водич ти ги дава 3-те реални начини да ја имаш играта како апликација на телефон.**

---

## 🎯 ОПЦИЈА 1: PWA — ЗА 0 ДЕНАРИ И 0 МИНУТИ (ВЕЌЕ ГОТОВО!)

**Тоа е најмудрото и најбрзото решение.** Играта **веќе е PWA** во овој ZIP — секој играч на iPhone, Android, или PC може директно да ја инсталира како апликација од browser-от, **без store, без чекање за одобрување, без $99 годишно**.

### Како се инсталира?

**📱 Android (Chrome):**
1. Отвори ја играта во Chrome
2. Притисни ⋮ менито горе десно
3. Кликни **"Install app"** или **"Add to Home screen"**
4. Готово! Иконата е на дома-екранот, апликацијата работи offline.

**🍎 iOS (Safari):**
1. Отвори ја играта во Safari (МОРА Safari, не Chrome!)
2. Притисни Share копчето (квадрат со стрелка нагоре)
3. Скролај надолу → **"Add to Home Screen"**
4. Готово! Изгледа како native апликација.

**💻 PC / Mac (Chrome, Edge, Brave):**
1. Отвори ја играта
2. Во address bar-от, десно ќе се појави икона ⊕ или 📲
3. Кликни → "Install"
4. Играта се отвора во посебно прозорче како native апликација.

### Што ти треба за PWA да работи?

Само **една работа**: играта да биде на HTTPS URL. Тоа значи треба online хостинг. Бесплатни опции:

| Сервис | Цена | Време | URL пример |
|--------|------|-------|------------|
| **GitHub Pages** | $0 | 5 мин | `username.github.io/aleksandar` |
| **Netlify Drop** | $0 | 30 сек | `random.netlify.app` |
| **Vercel** | $0 | 5 мин | `aleksandar.vercel.app` |
| **Cloudflare Pages** | $0 | 5 мин | `aleksandar.pages.dev` |

**Препорака:** GitHub Pages (професионално + бесплатно засекогаш).

---

## 🤖 ОПЦИЈА 2: GOOGLE PLAY STORE — ПРЕКУ PWA BUILDER

Тоа е **најлесниот реален начин** да биде на Play Store. **PWA Builder** е бесплатна Microsoft алатка што ја претвора PWA-та во вистински Android APK/AAB.

### Чекор по чекор:

1. **Прво качи ја играта како PWA** (Опција 1 — на пр. GitHub Pages)
2. Отвори **https://www.pwabuilder.com**
3. Внеси го URL-от на твојата играта
4. Алатката ќе скенира — ќе види дека PWA-та е готова (има manifest, sw.js, икони)
5. Кликни **"Package for Stores"** → **Android**
6. Симни го генерираниот `.aab` (Android App Bundle) фајл
7. Регистрирај се на **Google Play Console**: https://play.google.com/console
   - **Цена:** $25 USD еднократно
8. Создади нов app → Upload `.aab` фајл
9. Пополни ги информациите:
   - **Име:** Мисија на Александар
   - **Краток опис:** Образовна игра за деца — 37 нивоа за Александар Велики
   - **Долг опис:** (земи од README.md)
   - **Категорија:** Education / Kids
   - **Возраст:** 7+ или 4+ (зависи од содржината)
   - **Screenshots:** треба 2-8 слики (можеш да земеш од играта)
   - **Privacy Policy:** ВАЖНО — мора да биде линк! Имаш и шаблон во `PRIVACY_POLICY.md`
10. Прати за преглед — обично **2-7 дена** одговор
11. Кога е одобрено → играта е на Play Store!

### Што го прави PWA Builder супер?
- Игра остануа PWA — кога ажурираш на GitHub, апликацијата автоматски ажурира!
- Не треба да научиш Android Studio
- Не треба Java/Kotlin

---

## 🍎 ОПЦИЈА 3: APPLE APP STORE — НАЈТЕШКО, БАРА MAC

Apple бара **Mac компјутер** и Apple Developer account ($99 USD/година).

### Опција 3a: Преку Capacitor (препорачано)

1. Купи Apple Developer account на https://developer.apple.com ($99/година)
2. На Mac компјутер, инсталирај Node.js и Xcode
3. Во terminal:
   ```bash
   npm install -g @capacitor/cli
   npx cap init "Aleksandar" "com.worldprotocolacademy.aleksandar"
   npm install @capacitor/core @capacitor/ios
   npx cap add ios
   # Копирај index.html + сите фајлови во www/ папка
   npx cap copy ios
   npx cap open ios
   ```
4. Во Xcode: Build → Archive → Upload to App Store Connect
5. Пополни info на https://appstoreconnect.apple.com
6. Submit for Review (обично 1-3 дена)

### Опција 3b: PWA Builder за iOS

PWA Builder исто така генерира iOS package, **но мора Mac за финален потпис**. Тоа е попростно ако веќе имаш Mac.

### Apple специфики:
- **Cena:** $99 USD годишно (recurring)
- **Може да биде одбиено!** Apple е строг
- Мора privacy policy + ToS
- App size limit 4GB
- Реклами се компликувани (треба IDFA permissions)

---

## 💡 ИСКРЕНА ПРЕПОРАКА ЗА ТЕБЕ

Како другар, моето искрено мислење:

| Чекор | Кога | Зошто |
|-------|------|-------|
| **1. PWA на GitHub Pages** | СЕГА (5 мин) | $0, веднаш функционира, сите ја играат |
| **2. Google Play преку PWA Builder** | По 1-2 месеци | $25, ширење на Android корисници |
| **3. Apple App Store** | Само ако имаш Mac + сериозно сакаш | $99/година е сериозна инвестиција |

**Зошто прво PWA?** Затоа што:
- Можеш да тестираш без чекање store одобрување
- Корисниците ја „инсталираат" без store
- Кога ќе сакаш, лесно се претвора во native app
- Ажурирања се **автоматски** (не чекаш Apple преглед!)

---

## 📋 ШТО ТРЕБА ЗА STORE СУБМИШН?

Без разлика дали оди на Play или App Store, треба:

### Документи
- ✅ **Privacy Policy** → имаш шаблон во `PRIVACY_POLICY.md`
- ✅ **Terms of Service** → имаш шаблон во `TERMS.md`
- ✅ **Content rating** → Education / Kids, безбедно

### Marketing assets
- ✅ Икона 512x512 → имаш `icons/icon-512.png`
- ✅ Feature graphic 1024x500 (само Google Play)
- ✅ Screenshots:
  - Android: 2-8 phone + tablet
  - iOS: 6.5" iPhone + iPad Pro (можеш да земеш во симулатор)

### Текст
- ✅ Краток опис (80 знаци Google, 30 Apple)
- ✅ Долг опис (4000 знаци Google, нема лимит Apple)
- ✅ Keywords (само Apple, 100 знаци)
- ✅ Промо текст

### Технички
- ✅ Privacy questionnaire (што собира играта)
- ✅ Data safety section
- ✅ Age rating questionnaire

---

## 🆘 КОНТАКТИ И ПОМОШ

**GitHub Pages помош:** https://docs.github.com/en/pages
**PWA Builder:** https://www.pwabuilder.com
**Google Play Console:** https://play.google.com/console
**Apple Developer:** https://developer.apple.com
**Capacitor (iOS bridge):** https://capacitorjs.com

**За дополнителна помош:** aleksandarmakedonskigame@gmail.com

---

*"Светот е книга, а оние кои патуваат читаат повеќе страници."*

— World Protocol Academy
