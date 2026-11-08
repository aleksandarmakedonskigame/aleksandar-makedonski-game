const DOC_TITLE_MK='Мисија на Александар';
const FACT_EN=[["Born in Pella", "Alexander was born in 356 BC in Pella, the capital of ancient Macedon."], ["The family", "His father was King Philip II, and his mother Olympias, a princess of Epirus."], ["Bucephalus", "As a boy he tamed the wild horse Bucephalus: he noticed the horse feared its own shadow and turned it toward the sun."], ["Teacher Aristotle", "From about age 13 Alexander studied with the philosopher Aristotle at Mieza."], ["The book under the pillow", "According to Plutarch, Alexander carried Homer's \"Iliad\" everywhere and kept it under his pillow."], ["King at 20", "He became king in 336 BC, at only 20 years old."], ["The Gordian knot", "In Gordium, legend says, he cut the Gordian knot — a symbol of solving a hard problem in a new way."], ["The river Granicus", "The first great battle of the campaign into Asia was at the river Granicus, in 334 BC."], ["The battle of Issus", "In 333 BC at Issus he defeated the army of the Persian king Darius III."], ["The siege of Tyre", "He captured the island city of Tyre after a seven-month siege, building a causeway from the mainland to the island."], ["Pharaoh in Egypt", "In Egypt, which was under Persian rule, Alexander was welcomed and proclaimed pharaoh."], ["Founding Alexandria", "In 331 BC he founded Alexandria in Egypt, which later became one of the most important cities of antiquity."], ["The oracle of Siwa", "He travelled through the desert to the oracle of the god Ammon in the oasis of Siwa."], ["Gaugamela", "In 331 BC at Gaugamela he crushed the great Persian army of Darius III."], ["Babylon", "The ancient city of Babylon opened its gates to him without a fight."], ["Persepolis", "He reached Persepolis, the ceremonial capital of the Persian Empire."], ["New customs", "He adopted some Persian customs and clothing, to connect Macedonians and Persians."], ["Cities with his name", "He founded many cities, and several of them bore the name Alexandria."], ["Hindu Kush", "His army crossed the high, cold mountains of the Hindu Kush."], ["Roxana", "In 327 BC he married Roxana, daughter of a nobleman of Bactria."], ["The river Hydaspes", "In 326 BC at the river Hydaspes in India he fought king Porus, who had war elephants. After the battle, Porus kept his throne."], ["The city of Bucephala", "When loyal Bucephalus died, Alexander founded the city of Bucephala in his honour."], ["The river Hyphasis", "At the river Hyphasis the tired soldiers asked to return home after eight years of campaigning — and Alexander listened."], ["Nearchus' fleet", "His friend Nearchus led a fleet from the Indus river to the Persian Gulf, exploring unknown coasts."], ["The Gedrosian desert", "The return march through the Gedrosian desert was one of the hardest journeys of the army."], ["The weddings at Susa", "In 324 BC in Susa he held great weddings between Macedonian soldiers and Persian brides."], ["Hephaestion", "Hephaestion was Alexander's closest friend since childhood."], ["Step-counters", "Surveyors (bematists) travelled with the army, counting steps to measure distances."], ["A common language", "After his campaigns, the Greek koine became a common language of trade and learning across a huge area."], ["The Hellenistic world", "The time after Alexander is called the Hellenistic period — when the cultures of East and West mixed strongly."], ["The Library of Alexandria", "The great library in Alexandria was built by the Ptolemies after his death, in the city he founded."], ["The Pharos lighthouse", "The Pharos lighthouse of Alexandria, built after Alexander's death, became one of the seven wonders of the ancient world."], ["The meeting with Diogenes", "According to tradition, when Alexander asked the philosopher Diogenes what he wanted, he answered: \"Step aside a little, you're blocking my sun.\""], ["A great commander", "According to ancient historians, Alexander never lost a single great battle."], ["Babylon, 323 BC", "Alexander died in Babylon in 323 BC, at only 32 years old."], ["The Diadochi", "After his death, his generals — called the Diadochi (successors) — divided the empire."], ["The eternal story", "The story of Alexander has been told for more than 2,300 years, in many languages, in books, songs and art."]];
const TEXTS={
 "Патот на Слободата": "Path of Freedom",
 "Мисија на Александар": "Mission of Alexander",
 "Почеток": "Start",
 "Нивоа": "Levels",
 "Помош": "Help",
 "Звук": "Sound",
 "Квиз": "Quiz",
 "Продолжи": "Continue",
 "❓ Прашање за +15 мудрост": "❓ Question for +15 wisdom",
 "Следно ниво": "Next level",
 "Избери ниво": "Choose a level",
 "Затвори": "Close",
 "Пушти": "Play",
 "Пауза": "Pause",
 "Палац на знаењето": "Palace of Knowledge"
};

(function(){
  const LANG_KEY='wpa_lang';
  function lang(){ return localStorage.getItem(LANG_KEY)||'mk'; }
  function t(mk){ return lang()==='en' ? (TEXTS[mk]||mk) : mk; }
  // swap map application via MutationObserver (covers dynamically rendered UI)
  function swapNode(node){
    if(!node.nodeValue) return;
    const v=node.nodeValue.trim();
    if(TEXTS[v]!==undefined){ node.nodeValue = node.nodeValue.replace(v, TEXTS[v]); }
  }
  function sweep(root){ const w=document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null); let n; while(n=w.nextNode()){ if(n.parentElement&&['SCRIPT','STYLE'].includes(n.parentElement.tagName)) continue; swapNode(n); } }
  const mo=new MutationObserver(ms=>{ ms.forEach(m=>m.addedNodes.forEach(nd=>{ if(nd.nodeType===3) swapNode(nd); else if(nd.nodeType===1) sweep(nd); })); });
  // toggle button
  function makeBtn(){
    const b=document.createElement('button');
    b.textContent = lang()==='en' ? '🌐 MK' : '🌐 EN';
    b.style.cssText='position:fixed;bottom:14px;right:14px;z-index:9999;background:#1a1a2e;color:#FFD700;border:2px solid #D4AF37;border-radius:10px;padding:8px 14px;font-size:15px;cursor:pointer;font-family:inherit';
    b.onclick=()=>{ localStorage.setItem(LANG_KEY, lang()==='en'?'mk':'en'); location.reload(); };
    document.body.appendChild(b);
  }
  // The optional Time Bridge challenge stores only a local mini-game souvenir.
  // It does not verify another GitHub origin or award an official national flag.
  function flagBadge(){
    if(localStorage.getItem('wpa_time_bridge_challenge') === '1'){
      const d=document.createElement('div');
      d.textContent=lang()==='en' ? 'Time Bridge mini-game completed (this device)' : 'Time Bridge: лична мини-игра завршена на овој уред';
      d.style.cssText='position:fixed;top:9px;left:50%;transform:translateX(-50%);z-index:999;background:#d4af37;color:#162032;border-radius:9px;padding:5px 12px;font:12px system-ui,sans-serif;font-weight:700;pointer-events:none';
      document.body.appendChild(d);
    }
  }

  function translateChrome(){
    if(lang()!=='en')return;
    const h=document.querySelector('#screen-menu h1');if(h)h.textContent='Mission of Alexander';
    const title=document.querySelector('#screen-menu .font-caveat');if(title)title.textContent='Path of Light';
    const translations={
      'startGame()':'Start game',
      "showScreen('levels')":'Choose level',
      "showScreen('leaderboard')":'Leaderboard',
      "showScreen('museum')":'Palace of Knowledge',
      "showScreen('rewards')":'Rewards',
      "showScreen('ai')":'Advisors',
      "showScreen('instructions')":'How to play',
      "showScreen('settings')":'Settings',
      'showDailyBonus()':'Daily bonus',
      "showScreen('companions');renderCompanions();":'Companions',
      'showKingdom()':'Alexandria',
      "showScreen('menu')":'Menu'
    };
    for(const b of document.querySelectorAll('button[onclick]')){
      const replacement=translations[b.getAttribute('onclick')];if(!replacement)continue;
      const nodes=[...b.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim());
      if(nodes.length)nodes[0].nodeValue=' '+replacement+' ';
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{ sweep(document.body); translateChrome(); mo.observe(document.body,{childList:true,subtree:true}); makeBtn(); flagBadge(); document.title=t(DOC_TITLE_MK); });
  window.I18N={lang:lang,t:t,fact:typeof FACT_EN!=='undefined'?(i)=>{ if(lang()==='en'&&FACT_EN[i]) return {title:FACT_EN[i][0],text:FACT_EN[i][1]}; return null; }:null};
})();
