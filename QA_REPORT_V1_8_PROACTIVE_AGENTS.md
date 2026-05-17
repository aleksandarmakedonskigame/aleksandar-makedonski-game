# QA REPORT — v1.8 Proactive AI Agents

## Added
- v18_proactive_agents.js

## Behavior
- Runtime patch on startLevel and showLevelComplete.
- Adds agent panel to menu.
- Adds floating task button.
- Adds proactive tips during gameplay.

## Safety
- Does not remove previous v1.7 gameplay mechanics.
- Agent tips are scripted/local, no external AI API calls.
- Stores agent XP in localStorage key: alexander_agent_tasks_v18.
