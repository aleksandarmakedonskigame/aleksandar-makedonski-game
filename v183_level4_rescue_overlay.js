// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.8.3 — LEVEL 4 RESCUE OVERLAY
// Ова не зависи од Phaser depth. Ако ниво 4 изгледа темно,
// додава видлива светлина, ѕвезди, метеори и знаци директно врз canvas.
// ============================================================
(function(){
  'use strict';

  const AQ183 = {
    active:false,
    timer:null,

    init(){
      this.injectStyles();
      this.patchStartLevel();
      this.watchGameScreen();
      this.addMarker();
      console.log('[AQ183] Level 4 Rescue Overlay loaded');
    },

    injectStyles(){
      if(document.getElementById('aq183-style')) return;
      const s=document.createElement('style');
      s.id='aq183-style';
      s.textContent=`
        #game-container{position:relative!important;overflow:hidden!important;background:linear-gradient(180deg,#16213e,#0f0c18)!important}
        .aq183-overlay{
          position:absolute;inset:0;z-index:50;pointer-events:none;
          overflow:hidden;border-radius:1rem;
          background:
            radial-gradient(circle at 18% 18%, rgba(255,215,0,.24), transparent 18%),
            radial-gradient(circle at 66% 28%, rgba(74,144,226,.18), transparent 22%),
            linear-gradient(180deg, rgba(20,40,82,.38), rgba(15,12,24,.10));
        }
        .aq183-title{
          position:absolute;left:22px;top:18px;
          color:#FFD700;font-weight:900;font-size:20px;
          text-shadow:0 3px 10px #000;
          font-family:Inter,system-ui,sans-serif;
        }
        .aq183-sub{
          position:absolute;left:22px;top:48px;
          color:#FFF8E7;font-weight:700;font-size:13px;opacity:.88;
          text-shadow:0 2px 8px #000;
        }
        .aq183-star{
          position:absolute;width:20px;height:20px;color:#FFD700;font-size:20px;
          text-shadow:0 0 10px rgba(255,215,0,.9),0 2px 8px #000;
          animation:aq183Float 1.8s ease-in-out infinite alternate;
        }
        .aq183-meteor{
          position:absolute;font-size:28px;filter:drop-shadow(0 0 10px rgba(255,107,53,.8));
          animation:aq183Meteor 3.3s linear infinite;
        }
        .aq183-orb{
          position:absolute;width:44px;height:44px;border-radius:50%;
          background:radial-gradient(circle,#FFD700 0 20%,#4A90E2 28% 66%,rgba(74,144,226,.2) 72%);
          box-shadow:0 0 26px rgba(74,144,226,.9),0 0 16px rgba(255,215,0,.8);
          animation:aq183Pulse .9s ease-in-out infinite alternate;
        }
        .aq183-pillar{
          position:absolute;bottom:35px;width:28px;height:86px;
          background:linear-gradient(90deg,#8B7355,#D9C27A,#8B7355);
          opacity:.62;border-radius:5px 5px 0 0;
          box-shadow:0 0 12px rgba(255,215,0,.18);
        }
        .aq183-ground-light{
          position:absolute;left:0;right:0;bottom:26px;height:8px;
          background:linear-gradient(90deg,transparent,#FFD700,transparent);
          opacity:.45;filter:blur(2px);
        }
        @keyframes aq183Float{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(-12px) rotate(14deg)}}
        @keyframes aq183Pulse{from{transform:scale(.92);opacity:.78}to{transform:scale(1.14);opacity:1}}
        @keyframes aq183Meteor{from{transform:translate(0,0) rotate(-20deg);opacity:0}10%{opacity:1}to{transform:translate(-420px,330px) rotate(35deg);opacity:0}}
      `;
      document.head.appendChild(s);
    },

    patchStartLevel(){
      const tryPatch=()=>{
        if(typeof window.startLevel !== 'function'){
          setTimeout(tryPatch,150);
          return;
        }
        if(window.__AQ183_PATCHED) return;
        window.__AQ183_PATCHED=true;
        const original=window.startLevel;
        window.startLevel=function(level){
          const lv=parseInt(level,10)||1;
          const res=original.apply(this,arguments);
          setTimeout(()=>AQ183.sync(lv),600);
          setTimeout(()=>AQ183.sync(lv),1600);
          return res;
        };
      };
      tryPatch();
    },

    watchGameScreen(){
      setInterval(()=>{
        const active=document.getElementById('screen-game')?.classList.contains('active');
        if(!active){this.removeOverlay();return}
        const hud=parseInt(document.getElementById('hud-level')?.textContent||'0',10);
        this.sync(hud);
      },1200);
    },

    sync(level){
      if(level===4){
        this.ensureOverlay();
      }else{
        this.removeOverlay();
      }
    },

    ensureOverlay(){
      const container=document.getElementById('game-container');
      if(!container) return;
      if(document.getElementById('aq183-overlay')) return;

      const ov=document.createElement('div');
      ov.id='aq183-overlay';
      ov.className='aq183-overlay';
      ov.innerHTML=`
        <div class="aq183-title">Ниво 4 · Небесни Знаци</div>
        <div class="aq183-sub">Следи ја светлината · собери ѕвезди · искористи супер скок</div>
        <div class="aq183-ground-light"></div>
        <div class="aq183-orb" style="left:64%;top:54%"></div>
        <div class="aq183-meteor" style="right:6%;top:8%">☄️</div>
        <div class="aq183-meteor" style="right:26%;top:0%;animation-delay:1.2s">☄️</div>
        <div class="aq183-pillar" style="left:14%"></div>
        <div class="aq183-pillar" style="left:23%;height:64px"></div>
        <div class="aq183-pillar" style="right:18%;height:76px"></div>
      `;
      const positions=[
        ['18%','66%'],['27%','56%'],['36%','46%'],['48%','60%'],['58%','42%'],['72%','58%'],['83%','34%'],
        ['15%','24%'],['38%','18%'],['62%','22%'],['78%','16%']
      ];
      positions.forEach((p,i)=>{
        const st=document.createElement('div');
        st.className='aq183-star';
        st.textContent='✦';
        st.style.left=p[0]; st.style.top=p[1];
        st.style.animationDelay=(i*.17)+'s';
        ov.appendChild(st);
      });
      container.appendChild(ov);
      this.active=true;
      this.toast('✅ Ниво 4 rescue overlay е активен: светлина, ѕвезди и метеори се додадени.');
    },

    removeOverlay(){
      const ov=document.getElementById('aq183-overlay');
      if(ov) ov.remove();
      this.active=false;
    },

    addMarker(){
      setTimeout(()=>{
        const box=document.querySelector('#screen-menu .mb-8');
        if(!box||document.getElementById('aq183-marker'))return;
        const b=document.createElement('div');
        b.id='aq183-marker';
        b.style.cssText='display:inline-block;margin-top:8px;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,215,0,.55);background:rgba(255,215,0,.12);color:#FFD700;font-size:12px;font-weight:900';
        b.textContent='✅ v1.8.3 активна · ниво 4 rescue overlay';
        box.appendChild(b);
      },1100);
    },

    toast(msg){
      let t=document.getElementById('aq183-toast');
      if(!t){
        t=document.createElement('div');
        t.id='aq183-toast';
        t.style.cssText='position:fixed;top:18px;left:50%;transform:translateX(-50%) translateY(-130px);z-index:100005;background:linear-gradient(135deg,#151020,#263b75);color:white;padding:12px 18px;border-radius:999px;border:1px solid rgba(255,215,0,.45);font-weight:900;transition:.35s;box-shadow:0 12px 32px rgba(0,0,0,.55);text-align:center;max-width:92vw';
        document.body.appendChild(t);
      }
      t.textContent=msg;
      t.style.transform='translateX(-50%) translateY(0)';
      clearTimeout(this.tt);
      this.tt=setTimeout(()=>t.style.transform='translateX(-50%) translateY(-130px)',3000);
    }
  };

  if(document.readyState!=='loading') AQ183.init();
  else document.addEventListener('DOMContentLoaded',()=>AQ183.init());

  window.AQ183=AQ183;
})();
