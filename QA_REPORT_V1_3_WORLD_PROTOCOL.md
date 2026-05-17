# QA Report — v1.3 World Protocol Edition

## Added
- `v13_world_protocol.js` loaded after `game.js` and before `pwa.js`.
- Mission intro for each level.
- Wisdom questions after scroll/fact discovery.
- Wisdom/Protocol points stored in `localStorage` under `alexander_protocol_v13`.
- Enhanced level-complete modal with learning insight.
- Daily mission card.
- Live travel map.
- Protocol passport panel.
- Original WebAudio generated ethno-antique music toggle.

## Stability
- Includes `pwa.js` v1.2.2 stability patch.
- Does not overwrite core Phaser gameplay generation.
- Music is generated in-browser; no copyrighted audio files included.

## Test checklist
1. Open with `?v=1.3`.
2. Click "Етно музика" and confirm sound starts after user click.
3. Start level 1 and confirm mission intro appears.
4. Collect scroll and confirm quiz appears.
5. Finish level and confirm enhanced completion text appears.
6. Click next level until level 3 or 4.
7. Open "Жива мапа" and "Пасош на протоколот" from menu.
