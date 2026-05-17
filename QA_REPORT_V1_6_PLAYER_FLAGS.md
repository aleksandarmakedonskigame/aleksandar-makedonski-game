# QA REPORT — v1.6 Player Name & World Flags

## Module
- v16_player_identity_flags.js

## Safe behavior
- Does not overwrite gameplay engine.
- Only augments menu identity UI.
- Uses existing SAVE_KEY: alexander_quest_save.
- Stores: playerName, playerCountry, playerCountryName, playerFlag.

## Notes
Emoji flags depend on OS/browser support. Some older Windows/browser combinations may show country-code letters instead of colored flags.
