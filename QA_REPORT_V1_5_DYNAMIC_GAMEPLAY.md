# QA REPORT — v1.5 Dynamic Gameplay Edition

## Intent
Make gameplay less empty and more fascinating moment-to-moment.

## Added module
- v15_dynamic_gameplay.js

## Technical strategy
This module patches GameplayScene at runtime. It does not delete previous v1.3/v1.4 systems.

## Important
Music uses WebAudio and requires a user click due to browser autoplay restrictions. The player must click the music button or interact with the page first.

## Expected visual changes
- Animated stars in background
- Distant mountains and ruins
- Collectible gold stars
- Fire/stone hazards
- Falling/drifting meteors
- Super jump orb
