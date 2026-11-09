// WPA soundtrack player 2.3.2 - opt-in audio, no autoplay, local volume.
(function(){
  'use strict';
  const SRC='audio/pesna-patot-na-svetlinata.m4a';
  let audio=null;
  let volume=65;
  try{const raw=localStorage.getItem('aq_song_volume');if(raw!==null){const n=Number(raw);if(Number.isFinite(n)&&n>=0&&n<=100)volume=n;}}catch(e){}
  function tr(mk,en){return window.I18N&&I18N.lang&&I18N.lang()==='en'?en:mk;}
  function stamp(n){return Math.floor((Number.isFinite(n)?n:0)/60)+':'+String(Math.floor((Number.isFinite(n)?n:0)%60)).padStart(2,'0');}
  function status(s){const e=document.getElementById('songStatus');if(e)e.textContent=s;}
  function sync(){
    const playing=!!audio&&!audio.paused&&!audio.ended;
    if(window.WPALiving) WPALiving.setMusicPlaying(playing);
    for(const b of document.querySelectorAll('[data-song-btn]')){
      b.textContent=playing?tr('\u23f8 \u041f\u0430\u0443\u0437\u0438\u0440\u0430\u0458','\u23f8 Pause soundtrack'):tr('\u25b6 \u041f\u0443\u0448\u0442\u0438 \u0458\u0430 \u043f\u0435\u0441\u043d\u0430\u0442\u0430','\u25b6 Play soundtrack');
      b.classList.toggle('song-playing',playing);
      b.setAttribute('aria-pressed',String(playing));
    }
    if(audio&&audio.error)return;
    if(audio){
      const d=Number.isFinite(audio.duration)?audio.duration:174.1;
      const pg=document.getElementById('songProgress');if(pg){pg.max=d;pg.value=Math.min(audio.currentTime||0,d);pg.setAttribute('aria-valuetext',stamp(audio.currentTime)+' / '+stamp(d));}
      status((playing?tr('\u0421\u0432\u0438\u0440\u0438','Playing'):audio.ended?tr('\u0417\u0430\u0432\u0440\u0448\u0435\u043d\u043e','Finished'):tr('\u041f\u0430\u0443\u0437\u0430','Paused'))+' \u00b7 '+stamp(audio.currentTime)+' / '+stamp(d));
    }
  }
  function el(){
    if(!audio){
      audio=new Audio(SRC);audio.preload='metadata';audio.volume=volume/100;
      for(const ev of ['play','pause','ended','loadedmetadata','timeupdate','durationchange'])audio.addEventListener(ev,sync);
      audio.addEventListener('error',()=>status(tr('\u041d\u0435\u043c\u0430 \u043f\u0440\u0438\u0441\u0442\u0430\u043f \u0434\u043e \u043f\u0435\u0441\u043d\u0430\u0442\u0430.','Audio unavailable. Check your connection.')));
    }
    return audio;
  }
  function setVolume(v){
    volume=Math.max(0,Math.min(100,Number(v)||0));
    const i=document.getElementById('songVolume');if(i)i.value=String(volume);
    if(audio)audio.volume=volume/100;
    try{localStorage.setItem('aq_song_volume',String(volume));}catch(e){}
  }
  function play(fromStart){
    if(window.GAME_EDITION&&GAME_EDITION.songs===false)return;
    document.dispatchEvent(new CustomEvent('aq-music-start',{detail:'song'}));
    const a=el();if(fromStart){try{a.currentTime=0;}catch(e){}}
    const res=a.play();if(res&&typeof res.catch==='function')res.catch(()=>status(tr('\u041a\u043b\u0438\u043a\u043d\u0438 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e \u0437\u0430 \u0437\u0432\u0443\u043a.','Click play again to enable sound.')));
    return res;
  }
  function stop(){if(audio&&!audio.paused)audio.pause();}
  function toggle(){if(window.GAME_EDITION&&GAME_EDITION.songs===false)return;(audio&&!audio.paused)?stop():play(false);}
  function isPlaying(){return !!audio&&!audio.paused&&!audio.ended;}
  document.addEventListener('aq-music-start',e=>{if(e.detail!=='song')stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  window.AQSong={play,stop,toggle,setVolume,isPlaying};
  function init(){setVolume(volume);sync();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
