// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.7 — 7/8 MACEDONIAN RHYTHM + ID FIX
// Македонски 7/8 ритам · име/знаме fix · music unlock
// ============================================================
(function(){
  'use strict';
  const SAVE_KEY='alexander_quest_save';

  function readState(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}catch(e){return {}}}
  function saveState(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s||{}))}catch(e){}}

  const countries=[
    ['MK','🇲🇰','Македонија'],['AL','🇦🇱','Албанија'],['RS','🇷🇸','Србија'],['BG','🇧🇬','Бугарија'],['GR','🇬🇷','Грција'],['XK','🇽🇰','Косово'],
    ['ME','🇲🇪','Црна Гора'],['BA','🇧🇦','Босна и Херцеговина'],['HR','🇭🇷','Хрватска'],['SI','🇸🇮','Словенија'],['RO','🇷🇴','Романија'],
    ['TR','🇹🇷','Турција'],['IT','🇮🇹','Италија'],['FR','🇫🇷','Франција'],['DE','🇩🇪','Германија'],['GB','🇬🇧','Обединето Кралство'],
    ['US','🇺🇸','САД'],['CA','🇨🇦','Канада'],['BR','🇧🇷','Бразил'],['AR','🇦🇷','Аргентина'],['JP','🇯🇵','Јапонија'],['CN','🇨🇳','Кина'],
    ['KR','🇰🇷','Јужна Кореја'],['IN','🇮🇳','Индија'],['AU','🇦🇺','Австралија'],['NZ','🇳🇿','Нов Зеланд'],['EG','🇪🇬','Египет'],
    ['IR','🇮🇷','Иран'],['IQ','🇮🇶','Ирак'],['IL','🇮🇱','Израел'],['PS','🇵🇸','Палестина'],['SA','🇸🇦','Саудиска Арабија'],
    ['ZA','🇿🇦','Јужна Африка'],['NG','🇳🇬','Нигерија'],['KE','🇰🇪','Кенија'],['ET','🇪🇹','Етиопија'],['MA','🇲🇦','Мароко'],
    ['MX','🇲🇽','Мексико'],['ES','🇪🇸','Шпанија'],['PT','🇵🇹','Португалија'],['SE','🇸🇪','Шведска'],['NO','🇳🇴','Норвешка'],
    ['FI','🇫🇮','Финска'],['PL','🇵🇱','Полска'],['CZ','🇨🇿','Чешка'],['SK','🇸🇰','Словачка'],['UA','🇺🇦','Украина'],['RU','🇷🇺','Русија']
  ];

  const AQ17={
    ctx:null,master:null,playing:false,step:0,timer:null,
    init(){
      this.styles();
      this.playerIdentity();
      this.musicButton();
      this.badge();
      console.log('[AQ17] v1.7 loaded');
    },
    styles(){
      if(document.getElementById('aq17-style'))return;
      const s=document.createElement('style');s.id='aq17-style';
      s.textContent=`
        .aq17-panel{margin:12px auto 0;max-width:540px;padding:13px;border-radius:20px;border:1px solid rgba(255,215,0,.32);background:linear-gradient(135deg,rgba(255,215,0,.12),rgba(74,144,226,.10))}
        .aq17-row{display:flex;gap:9px;flex-wrap:wrap;justify-content:center;align-items:center}
        .aq17-input{min-width:210px;flex:1;max-width:290px;padding:10px 13px;border-radius:13px;border:1px solid rgba(255,215,0,.35);background:rgba(0,0,0,.3);color:#FFF8E7;text-align:center;font-weight:800}
        .aq17-btn{padding:10px 12px;border-radius:13px;border:1px solid rgba(255,215,0,.36);background:rgba(255,215,0,.15);color:#FFD700;font-weight:900;cursor:pointer}
        .aq17-btn:hover{background:rgba(255,215,0,.25)}
        .aq17-preview{text-align:center;color:rgba(255,248,231,.72);font-size:13px;margin-top:8px}
        .aq17-music{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:100000;padding:11px 15px;border-radius:999px;border:1px solid rgba(255,215,0,.45);background:rgba(15,12,24,.92);color:#FFD700;font-weight:900;box-shadow:0 8px 28px rgba(0,0,0,.5);cursor:pointer}
        .aq17-modal{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:100001;display:none;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(8px)}
        .aq17-modal.active{display:flex}
        .aq17-card{width:min(850px,95vw);max-height:84vh;overflow:hidden;border-radius:24px;border:1px solid rgba(255,215,0,.4);background:linear-gradient(135deg,#151020,#241936);color:#FFF8E7}
        .aq17-head{padding:16px;border-bottom:1px solid rgba(255,255,255,.09);display:flex;gap:10px;justify-content:space-between;align-items:center;flex-wrap:wrap}
        .aq17-grid{padding:16px;max-height:62vh;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px}
        .aq17-flag{padding:10px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#FFF8E7;text-align:left;font-weight:800;cursor:pointer}
        .aq17-flag:hover{border-color:#FFD700;background:rgba(255,215,0,.12)}
        @media(max-width:600px){.aq17-row{flex-direction:column}.aq17-input,.aq17-btn{width:100%;max-width:100%}.aq17-grid{grid-template-columns:1fr 1fr}}
      `;
      document.head.appendChild(s);
    },
    playerIdentity(){
      setTimeout(()=>{
        if(document.getElementById('aq17-player')){this.refreshName();return}
        const box=document.querySelector('#screen-menu .mb-8')||document.querySelector('#screen-menu');
        if(!box){setTimeout(()=>this.playerIdentity(),300);return}
        const panel=document.createElement('div');panel.id='aq17-player';panel.className='aq17-panel';
        panel.innerHTML=`<div class="aq17-row"><input id="aq17-name" class="aq17-input" placeholder="Напиши го твоето име" maxlength="24"><button id="aq17-save" class="aq17-btn">✅ Зачувај</button><button id="aq17-flags" class="aq17-btn">🌍 Знаме</button></div><div id="aq17-preview" class="aq17-preview"></div>`;
        box.appendChild(panel);
        document.getElementById('aq17-save').onclick=()=>this.saveName(true);
        document.getElementById('aq17-flags').onclick=()=>this.openFlags();
        document.getElementById('aq17-name').addEventListener('keydown',e=>{if(e.key==='Enter')this.saveName(true)});
        this.flagModal();
        this.syncPanel();
        this.refreshName();
      },600);
    },
    saveName(msg){
      const input=document.getElementById('aq17-name'); const name=(input?.value||'').trim().slice(0,24);
      if(!name)return;
      const st=readState(); st.playerName=name; saveState(st); this.syncPanel(); this.refreshName();
      if(msg)this.toast('✅ Името е зачувано: '+name);
    },
    syncPanel(){
      const st=readState(); const input=document.getElementById('aq17-name'); const prev=document.getElementById('aq17-preview');
      if(input&&document.activeElement!==input)input.value=(st.playerName&&st.playerName!=='Гостин')?st.playerName:'';
      if(prev)prev.innerHTML=`Играч: <b style="color:#FFD700">${st.playerFlag||'🌍'} ${st.playerName||'Гостин'}</b> · ${st.playerCountryName||'избери земја'}`;
    },
    refreshName(){
      const st=readState(); const el=document.getElementById('player-name');
      if(el)el.textContent=(st.playerFlag?st.playerFlag+' ':'')+(st.playerName||'Гостин');
    },
    flagModal(){
      if(document.getElementById('aq17-flag-modal'))return;
      const m=document.createElement('div');m.id='aq17-flag-modal';m.className='aq17-modal';
      m.innerHTML=`<div class="aq17-card"><div class="aq17-head"><div><b style="color:#FFD700;font-size:20px">🌍 Избери знаме</b><div style="font-size:12px;opacity:.65">Знамето ќе стои до името.</div></div><button id="aq17-close" class="aq17-btn">Затвори</button></div><div id="aq17-grid" class="aq17-grid"></div></div>`;
      document.body.appendChild(m);
      document.getElementById('aq17-close').onclick=()=>m.classList.remove('active');
      m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('active')});
      const grid=document.getElementById('aq17-grid');
      grid.innerHTML=countries.map(c=>`<button class="aq17-flag" data-c="${c[0]}"><span style="font-size:24px;margin-right:8px">${c[1]}</span>${c[2]}</button>`).join('');
      grid.querySelectorAll('button').forEach(b=>b.onclick=()=>{
        const c=countries.find(x=>x[0]===b.dataset.c); if(!c)return;
        const st=readState(); st.playerCountry=c[0]; st.playerFlag=c[1]; st.playerCountryName=c[2]; saveState(st);
        m.classList.remove('active'); this.syncPanel(); this.refreshName(); this.toast(c[1]+' '+c[2]+' избрано');
      });
    },
    openFlags(){this.flagModal();document.getElementById('aq17-flag-modal').classList.add('active')},
    musicButton(){
      if(document.getElementById('aq17-music'))return;
      const b=document.createElement('button');b.id='aq17-music';b.className='aq17-music';b.textContent='🥁 Вклучи 7/8 ритам';
      b.onclick=()=>this.toggleMusic();
      document.body.appendChild(b);
    },
    makeAudio(){
      if(this.ctx)return;
      const AC=window.AudioContext||window.webkitAudioContext; if(!AC){alert('Browser-от не поддржува WebAudio.');return}
      this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.gain.value=0; this.master.connect(this.ctx.destination);
      const drone=this.ctx.createOscillator(); drone.type='sine'; drone.frequency.value=110;
      const dg=this.ctx.createGain(); dg.gain.value=.10; drone.connect(dg).connect(this.master); drone.start();
      const kaval=this.ctx.createOscillator(); kaval.type='triangle'; kaval.frequency.value=440;
      const kg=this.ctx.createGain(); kg.gain.value=.045; kaval.connect(kg).connect(this.master); kaval.start();
      this.kaval=kaval;
    },
    toggleMusic(){
      this.makeAudio(); if(!this.ctx)return;
      if(this.ctx.state==='suspended')this.ctx.resume();
      this.playing=!this.playing;
      this.master.gain.setTargetAtTime(this.playing?.85:0,this.ctx.currentTime,.05);
      document.getElementById('aq17-music').textContent=this.playing?'🔇 Исклучи 7/8 ритам':'🥁 Вклучи 7/8 ритам';
      if(this.playing)this.start78(); else this.stop78();
    },
    start78(){
      this.stop78();
      // 7/8 pattern: 3+2+2, Macedonian/Balkan feel
      const pattern=[1,0,0,1,0,1,0]; const notes=[392,440,493.88,523.25,587.33,523.25,440];
      let i=0;
      this.timer=setInterval(()=>{
        if(!this.playing||!this.ctx)return;
        const t=this.ctx.currentTime;
        this.kaval.frequency.setTargetAtTime(notes[i%notes.length],t,.08);
        if(pattern[i%7]===1)this.drum(150,.09); else this.drum(240,.035);
        i++;
      },185);
      this.toast('🥁 Македонски 7/8 ритам е вклучен');
    },
    stop78(){if(this.timer){clearInterval(this.timer);this.timer=null}},
    drum(freq,vol){
      const o=this.ctx.createOscillator(); const g=this.ctx.createGain();
      o.type='sine'; o.frequency.setValueAtTime(freq,this.ctx.currentTime); o.frequency.exponentialRampToValueAtTime(55,this.ctx.currentTime+.16);
      g.gain.setValueAtTime(vol,this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.18);
      o.connect(g).connect(this.master); o.start(); o.stop(this.ctx.currentTime+.2);
    },
    toast(msg){
      let t=document.getElementById('aq17-toast');
      if(!t){t=document.createElement('div');t.id='aq17-toast';t.style.cssText='position:fixed;top:18px;left:50%;transform:translateX(-50%) translateY(-120px);z-index:100002;background:linear-gradient(135deg,#1A1525,#4A90E2);color:white;padding:11px 17px;border-radius:999px;border:1px solid rgba(255,215,0,.4);font-weight:900;transition:.35s;box-shadow:0 10px 30px rgba(0,0,0,.5)';document.body.appendChild(t)}
      t.textContent=msg;t.style.transform='translateX(-50%) translateY(0)';clearTimeout(this.tt);this.tt=setTimeout(()=>t.style.transform='translateX(-50%) translateY(-120px)',2600);
    },
    badge(){
      setTimeout(()=>{
        const box=document.querySelector('#screen-menu .mb-8'); if(!box||document.getElementById('aq17-badge'))return;
        const b=document.createElement('div');b.id='aq17-badge';b.style.cssText='display:inline-block;margin-top:8px;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,215,0,.45);background:rgba(255,215,0,.10);color:#FFD700;font-size:12px;font-weight:900';
        b.textContent='⚡ v1.7: живи нивоа · ѕвезди · метеори · супер скок · 7/8 ритам';
        box.appendChild(b);
      },700);
    }
  };
  if(document.readyState!=='loading')AQ17.init(); else document.addEventListener('DOMContentLoaded',()=>AQ17.init());
  window.AQ17=AQ17;
})();
