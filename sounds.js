// ============================================================
// ALEXANDER & GOCE DELCHEV - ZVUCNI EFEKTI
// Prepoznatlivi zvuci za Aleksandar Makedonski i Goce Delcev
// Sande e INOVATOROT na ovie igri!
// ============================================================

const GameSounds = {
  audioCtx: null,
  enabled: true,
  musicEnabled: true,

  // Inicializacija na Audio Context
  init() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      console.log('[GameSounds] Audio sistem inicializiran!');
    } catch(e) {
      console.log('[GameSounds] Audio ne e poddrzan na ovoj prebaruvac');
    }
  },

  // Pomosna funkcija za kreiranje na zvuk
  playTone(freq, duration, type = 'sine', volume = 0.3) {
    if (!this.audioCtx || !this.enabled) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(this.audioCtx.currentTime);
    osc.stop(this.audioCtx.currentTime + duration);
  },

  // ============================================================
  // ALEKSANDAR MAKEDONSKI - ZVUCNI EFEKTI
  // ============================================================
  
  // Zvuk na makedonska bukla (bronzena truba)
  macedonianTrumpet() {
    // Dlabok, mocen zvuk na starovremenska truba
    this.playTone(180, 0.8, 'sawtooth', 0.4);
    setTimeout(() => this.playTone(220, 0.6, 'square', 0.3), 100);
    setTimeout(() => this.playTone(180, 1.0, 'sawtooth', 0.35), 200);
  },

  // Zvuk na srcevo na Bukefal
  bukefalGallop() {
    // Ritmicen zvuk na kopita
    const beat = () => this.playTone(60, 0.15, 'triangle', 0.5);
    beat();
    setTimeout(beat, 150);
    setTimeout(beat, 300);
    setTimeout(beat, 450);
  },

  // Zvuk na makedonski koplje
  spearThrow() {
    Brz, ostar zvuk
    this.playTone(800, 0.1, 'sine', 0.3);
    setTimeout(() => this.playTone(400, 0.3, 'sawtooth', 0.2), 50);
  },

  // Zlaten zvuk na moneta
  goldenCoin() {
    // Svetol, zlaten zvuk
    this.playTone(1200, 0.1, 'sine', 0.3);
    setTimeout(() => this.playTone(1800, 0.2, 'sine', 0.25), 50);
  },

  // Zvuk na pobeda (Aleksandrov trijumf)
  victoryAlexander() {
    // Triumfalna melodija vo starovremenski stil
    const notes = [261, 329, 392, 523, 392, 523];
    let delay = 0;
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'sine', 0.25), delay);
      delay += 200;
    });
    // Makedonska bukla na kraj
    setTimeout(() => this.macedonianTrumpet(), delay + 100);
  },

  // Zvuk na Vergina Sonce (symbol na Makedonija)
  verginaSun() {
    // Svetol, magicen zvuk
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.playTone(440 + (i * 50), 0.2, 'sine', 0.15);
      }, i * 80);
    }
  },

  // ============================================================
  // GOCE DELCEV - ZVUCNI EFEKTI
  // ============================================================

  // Zvuk na rogot na pobunata (Ilindensko vostanie)
  revolutionHorn() {
    // Mocen, dramatiten zvuk na rog
    this.playTone(150, 1.2, 'sawtooth', 0.45);
    setTimeout(() => this.playTone(200, 0.8, 'square', 0.35), 300);
    setTimeout(() => this.playTone(150, 1.5, 'sawtooth', 0.4), 600);
  },

  // Zvuk na planinski veter (Makedonski planini)
  mountainWind() {
    // Tecen, sirok zvuk na veter
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 2);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    noise.start();
    noise.stop(this.audioCtx.currentTime + 2);
  },

  // Zvuk na selska kambana (Goce kako ucitel)
  schoolBell() {
    // Cisto zvonce
    this.playTone(800, 0.3, 'sine', 0.3);
    setTimeout(() => this.playTone(1000, 0.5, 'sine', 0.25), 200);
  },

  // Zvuk na orlov krik (simbol na sloboda)
  eagleScream() {
    // Visok, ostar zvuk na orlov krik
    this.playTone(2000, 0.3, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(2500, 0.4, 'square', 0.15), 100);
    setTimeout(() => this.playTone(1800, 0.5, 'sawtooth', 0.18), 250);
  },

  // Zvuk na revolutionarna pobeda (Goce Delcev)
  victoryRevolution() {
    // Dramatiten, pobedonosen zvuk
    this.revolucionarenHorn();
    setTimeout(() => {
      const notes = [329, 392, 440, 523, 659];
      let delay = 0;
      notes.forEach((note) => {
        setTimeout(() => this.playTone(note, 0.4, 'sine', 0.2), delay);
        delay += 150;
      });
    }, 500);
    setTimeout(() => this.eagleScream(), 1200);
  },

  // Zvuk na skriena svitok (istoriski fakti)
  scrollReveal() {
    // Zvuk na otvoranje svitok
    this.playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(800, 0.15, 'sine', 0.18), 100);
    setTimeout(() => this.playTone(1000, 0.3, 'sine', 0.15), 250);
  },

  // ============================================================
  // OPSTI ZVUCNI EFEKTI (za dvete igri)
  // ============================================================

  // Skok na igrac
  playerJump() {
    this.playTone(300, 0.15, 'sine', 0.2);
  },

  // Zbiraj moneta
  collectCoin() {
    this.playTone(880, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(1320, 0.15, 'sine', 0.12), 50);
  },

  // Zbiraj svitok
  collectScroll() {
    this.scrollReveal();
  },

  // Udar so neprijatel
  enemyHit() {
    this.playTone(150, 0.3, 'sawtooth', 0.25);
    setTimeout(() => this.playTone(100, 0.2, 'square', 0.2), 100);
  },

  // Nivo zavrseno
  levelComplete() {
    // Zavisno od igrata, razlicen zvuk
    if (window.GAME_TYPE === 'goce') {
      this.victoryRevolution();
    } else {
      this.victoryAlexander();
    }
  },

  // Klik na kopce
  buttonClick() {
    this.playTone(500, 0.08, 'sine', 0.1);
  },

  // Greska / zabrana
  errorSound() {
    this.playTone(200, 0.3, 'sawtooth', 0.2);
  },

  // ============================================================
  // POZADINSKA MUZIKA
  // ============================================================

  // Makedonska pozadinska melodija (prosta, etnicka)
  backgroundMusic() {
    if (!this.musicEnabled) return;
    
    // Prosta pentatonska skala vo makedonski stil
    const macedonianScale = [261, 293, 349, 392, 440];
    
    const playNote = () => {
      if (!this.musicEnabled) return;
      const note = macedonianScale[Math.floor(Math.random() * macedonianScale.length)];
      this.playTone(note, 0.5, 'sine', 0.05);
      setTimeout(playNote, 800 + Math.random() * 400);
    };
    
    playNote();
  },

  // Zvuci za specijalni momenti
  milestoneUnlocked() {
    // Triumfalen zvuk za otklucuvanje
    const notes = [523, 659, 784, 1047];
    let delay = 0;
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.4, 'sine', 0.2), delay);
      delay += 200;
    });
  },

  legendActivated() {
    // Grandiozen zvuk za LEGEND status
    this.verginaSun();
    setTimeout(() => this.victoryAlexander(), 500);
    setTimeout(() => this.macedonianTrumpet(), 1500);
  },

  // ============================================================
  // KONTROLA
  // ============================================================

  enable() { this.enabled = true; },
  disable() { this.enabled = false; },
  
  enableMusic() { 
    this.musicEnabled = true; 
    this.backgroundMusic();
  },
  disableMusic() { this.musicEnabled = false; },

  toggle() { this.enabled = !this.enabled; return this.enabled; },
  toggleMusic() { this.musicEnabled = !this.musicMusic; return this.musicEnabled; }
};

// Auto-inicijalizacija
if (typeof window !== 'undefined') {
  window.GameSounds = GameSounds;
  // Inicijaliziraj pri prvo klikanje (browser politika)
  document.addEventListener('click', () => {
    if (!GameSounds.audioCtx) {
      GameSounds.init();
    }
  }, { once: true });
}

// Eksport
if (typeof module !== 'undefined') module.exports = GameSounds;
