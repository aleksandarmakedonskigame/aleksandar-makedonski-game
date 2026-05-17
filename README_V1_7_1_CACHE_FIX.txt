# Мисија на Александар v1.7.1 — Dynamic Cache Fix

Оваа верзија не додава нова механика, туку ја прави v1.7 сигурно видлива во browser.

## Што поправа

- `index.html` ги повикува локалните JS фајлови со `?v=1.7.1`
- `sw.js` е network-first за HTML/JS
- Service Worker cache е нов: `alexander-quest-v1-7-1`
- Во главното мени се додава маркер:
  `✅ v1.7.1 активна · нова динамична верзија вчитана`

## Зошто

На GitHub фајловите за v1.7 постојат, но browser/service worker може да држи стара верзија од `game.js` и `pwa.js`.

## Upload

Качи ги сите фајлови во GitHub.

Commit summary:
Add v1.7.1 cache fix

## Test URL

https://aleksandarmakedonskigame.github.io/aleksandar-makedonski-game/?v=1.7.1

## Важно

По upload направи:
1. Отвори во private/incognito или
2. Chrome F12 → Application → Service Workers → Unregister → Storage → Clear site data
