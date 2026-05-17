// ============================================================
// МИСИЈА НА АЛЕКСАНДАР v1.5 — DYNAMIC GAMEPLAY EDITION
// Препреки · ѕвезди · метеори · супер скок · музика што се слуша
// Loaded after game.js / v13 / v14, before or after pwa.js.
// ============================================================
(function () {
  'use strict';

  const SAVE_KEY = 'alexander_quest_save';
  const DYNAMIC_VERSION = 'v1.5';

  const AQDynamic = {
    audio: null,
    musicOn: false,
    currentScene: null,
    patched: false,

    init() {
      this.injectStyles();
      this.installAudioButton();
      this.patchGameplayWhenReady();
      this.patchMenuBadge();
      this.patchLevelCompleteText();
      console.log('[AQ Dynamic] v1.5 initialized');
    },

    readState() {
      try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); }
      catch (e) { return {}; }
    },

    writeState(s) {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(s || {})); }
      catch (e) {}
    },

    injectStyles() {
      if (document.getElementById('aq-dynamic-style')) return;
      const style = document.createElement('style');
      style.id = 'aq-dynamic-style';
      style.textContent = `
        .aq-dynamic-badge {
          display:inline-block;
          margin-top:8px;
          padding:8px 14px;
          border-radius:999px;
          border:1px solid rgba(255,215,0,.5);
          background:linear-gradient(135deg,rgba(255,215,0,.16),rgba(74,144,226,.12));
          color:#FFD700;
          font-size:12px;
          font-weight:800;
          letter-spacing:.25px;
        }
        .aq-music-btn {
          position:fixed;
          left:16px;
          bottom:calc(16px + env(safe-area-inset-bottom));
          z-index:9999;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(255,215,0,.45);
          background:rgba(15,12,24,.88);
          color:#FFD700;
          font-weight:800;
          font-size:13px;
          box-shadow:0 8px 28px rgba(0,0,0,.45);
          cursor:pointer;
          backdrop-filter:blur(8px);
        }
        .aq-music-btn:hover { background:rgba(255,215,0,.12); }
        .aq-mission-pop {
          position:fixed;
          top:calc(18px + env(safe-area-inset-top));
          right:18px;
          z-index:9998;
          max-width:min(360px,88vw);
          padding:14px 16px;
          border-radius:18px;
          border:1px solid rgba(255,215,0,.38);
          background:linear-gradient(135deg,rgba(26,21,37,.96),rgba(74,144,226,.28));
          color:#FFF8E7;
          box-shadow:0 12px 35px rgba(0,0,0,.55);
          font-size:13px;
          line-height:1.45;
          transform:translateY(-120px);
          opacity:0;
          transition:.45s ease;
        }
        .aq-mission-pop.show { transform:translateY(0); opacity:1; }
        .aq-mission-pop strong { color:#FFD700; }
      `;
      document.head.appendChild(style);
    },

    toast(html, duration = 3500) {
      let pop = document.getElementById('aq-dynamic-pop');
      if (!pop) {
        pop = document.createElement('div');
        pop.id = 'aq-dynamic-pop';
        pop.className = 'aq-mission-pop';
        document.body.appendChild(pop);
      }
      pop.innerHTML = html;
      pop.classList.add('show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => pop.classList.remove('show'), duration);
    },

    patchMenuBadge() {
      setTimeout(() => {
        const titleBox = document.querySelector('#screen-menu .mb-8');
        if (!titleBox || document.getElementById('aq-dynamic-badge')) return;
        const b = document.createElement('div');
        b.id = 'aq-dynamic-badge';
        b.className = 'aq-dynamic-badge';
        b.textContent = '⚡ v1.5 Dynamic Edition · препреки · ѕвезди · метеори · супер скок';
        titleBox.appendChild(b);
      }, 600);
    },

    installAudioButton() {
      if (document.getElementById('aq-music-toggle')) return;
      const btn = document.createElement('button');
      btn.id = 'aq-music-toggle';
      btn.className = 'aq-music-btn';
      btn.textContent = '🎵 Вклучи етно музика';
      btn.onclick = () => this.toggleMusic();
      document.body.appendChild(btn);

      // Autoplay is blocked by browsers, so we unlock on first user gesture.
      const unlock = () => {
        if (!this.audio) this.createAudio();
        if (this.audio && this.audio.ctx.state === 'suspended') {
          this.audio.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    },

    createAudio() {
      if (this.audio) return this.audio;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);

      const low = ctx.createOscillator();
      low.type = 'sine';
      low.frequency.value = 98;
      const lowGain = ctx.createGain();
      lowGain.gain.value = 0.13;

      const kaval = ctx.createOscillator();
      kaval.type = 'triangle';
      kaval.frequency.value = 392;
      const kavalGain = ctx.createGain();
      kavalGain.gain.value = 0.035;

      const lyre = ctx.createOscillator();
      lyre.type = 'sine';
      lyre.frequency.value = 587.33;
      const lyreGain = ctx.createGain();
      lyreGain.gain.value = 0.028;

      low.connect(lowGain).connect(master);
      kaval.connect(kavalGain).connect(master);
      lyre.connect(lyreGain).connect(master);

      low.start();
      kaval.start();
      lyre.start();

      // Macedonian/ancient ambient motif: changes every 2 seconds.
      const scale = [392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99];
      let i = 0;
      const interval = setInterval(() => {
        if (!this.audio) { clearInterval(interval); return; }
        const t = ctx.currentTime;
        const note = scale[i % scale.length];
        const note2 = scale[(i + 3) % scale.length];
        kaval.frequency.setTargetAtTime(note, t, 0.08);
        lyre.frequency.setTargetAtTime(note2, t, 0.12);

        // subtle drum pulse with oscillator burst
        if (this.musicOn && i % 2 === 0) this.drumPulse();
        i++;
      }, 2000);

      this.audio = { ctx, master, low, kaval, lyre, interval };
      return this.audio;
    },

    drumPulse() {
      if (!this.audio) return;
      const ctx = this.audio.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain).connect(this.audio.master);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    },

    toggleMusic() {
      const a = this.createAudio();
      if (!a) {
        alert('Овој browser не поддржува WebAudio музика.');
        return;
      }
      if (a.ctx.state === 'suspended') a.ctx.resume();
      this.musicOn = !this.musicOn;
      a.master.gain.setTargetAtTime(this.musicOn ? 0.9 : 0.0, a.ctx.currentTime, 0.06);
      const btn = document.getElementById('aq-music-toggle');
      if (btn) btn.textContent = this.musicOn ? '🔇 Исклучи етно музика' : '🎵 Вклучи етно музика';
      this.toast(this.musicOn ? '<strong>🎵 Етно-античка музика:</strong><br>Вклучена е оригинална WebAudio атмосфера.' : '<strong>🔇 Музика:</strong><br>Исклучена.');
    },

    patchGameplayWhenReady() {
      const tryPatch = () => {
        try {
          if (typeof GameplayScene === 'undefined' || !GameplayScene.prototype || this.patched) {
            setTimeout(tryPatch, 180);
            return;
          }
          this.patchGameplayScene();
          this.patched = true;
        } catch (e) {
          console.warn('[AQ Dynamic] Waiting for GameplayScene:', e);
          setTimeout(tryPatch, 250);
        }
      };
      tryPatch();
    },

    patchGameplayScene() {
      const proto = GameplayScene.prototype;

      const originalCreate = proto.create;
      proto.create = function dynamicCreate() {
        originalCreate.call(this);
        AQDynamic.currentScene = this;
        this.dynamicScore = 0;
        this.dynamicFalls = 0;
        this.superJumpUntil = 0;
        this.dynamicMission = AQDynamic.getMissionForLevel(this.lvl);
        AQDynamic.decorateLevel(this);
        AQDynamic.addGameplayObjects(this);
        AQDynamic.showLevelIntro(this);
        AQDynamic.ensureAudioForGameplay();
      };

      const originalUpdate = proto.update;
      proto.update = function dynamicUpdate() {
        originalUpdate.call(this);
        AQDynamic.updateMeteors(this);
        AQDynamic.updateSuperPower(this);
      };

      const originalOnEnd = proto.onEnd;
      proto.onEnd = function dynamicOnEnd() {
        // bonus before original completes
        const missionBonus = AQDynamic.calculateMissionBonus(this);
        if (missionBonus > 0) {
          this.score += missionBonus;
          AQDynamic.addWisdom(missionBonus);
        }
        originalOnEnd.call(this);
      };

      console.log('[AQ Dynamic] GameplayScene patched');
    },

    getMissionForLevel(level) {
      const missions = [
        'Собери 5 монети и стигни до крајот.',
        'Пронајди го свитокот на мудроста.',
        'Не паѓај во празнините и собери 3 ѕвезди.',
        'Избегни ги метеорите и заврши го патот.',
        'Активирај супер скок и стигни до високата платформа.',
        'Собери 2 ѕвезди и еден свиток.',
        'Заврши брзо и покажи храброст.',
        'Покажи мудрост: собери свиток пред крајот.'
      ];
      return missions[(level - 1) % missions.length];
    },

    decorateLevel(scene) {
      // Make darkness feel alive: moon glow, distant mountains, ruins, stars, road markers.
      const cam = scene.cameras.main;
      const width = 3000;
      scene.add.circle(260, 85, 52, 0xFFDFA6, 0.22).setScrollFactor(0.18);
      scene.add.circle(265, 85, 34, 0xFFD700, 0.13).setScrollFactor(0.18);

      const bg = scene.add.graphics();
      bg.fillStyle(0x2A2440, 0.34);
      for (let x = 0; x < width; x += 180) {
        const h = 70 + ((x * 17 + scene.lvl * 31) % 95);
        bg.fillTriangle(x, 455, x + 90, 455 - h, x + 190, 455);
      }
      bg.setDepth(-10);

      const ruins = scene.add.graphics();
      ruins.fillStyle(0x8B7355, 0.45);
      for (let x = 420; x < width; x += 520) {
        ruins.fillRect(x, 380, 18, 74);
        ruins.fillRect(x + 42, 390, 18, 64);
        ruins.fillRect(x - 8, 370, 78, 12);
      }
      ruins.setDepth(-5);

      for (let i = 0; i < 90; i++) {
        const star = scene.add.circle(
          Phaser.Math.Between(50, width - 50),
          Phaser.Math.Between(30, 235),
          Phaser.Math.FloatBetween(0.7, 2.2),
          0xFFECA8,
          Phaser.Math.FloatBetween(0.2, 0.75)
        );
        star.setDepth(-2);
        scene.tweens.add({
          targets: star,
          alpha: Phaser.Math.FloatBetween(0.15, 0.95),
          duration: Phaser.Math.Between(900, 2400),
          yoyo: true,
          repeat: -1
        });
      }
    },

    addGameplayObjects(scene) {
      // Collectible stars
      scene.dynamicStars = scene.physics.add.group({ allowGravity: false });
      for (let i = 0; i < 12; i++) {
        const x = 260 + i * 210 + Phaser.Math.Between(-35, 50);
        const y = Phaser.Math.Between(190, 345);
        const star = AQDynamic.makeStar(scene, x, y);
        scene.dynamicStars.add(star);
      }
      scene.physics.add.overlap(scene.player, scene.dynamicStars, function(player, star) {
        AQDynamic.collectStar(scene, star);
      }, null, scene);

      // Obstacles: ancient fire/pillar hazards
      scene.dynamicHazards = scene.physics.add.staticGroup();
      for (let i = 0; i < 7; i++) {
        const x = 520 + i * 340 + Phaser.Math.Between(-30, 40);
        const y = 438;
        const h = AQDynamic.makeHazard(scene, x, y);
        scene.dynamicHazards.add(h);
      }
      scene.physics.add.overlap(scene.player, scene.dynamicHazards, function(player, hazard) {
        AQDynamic.hitHazard(scene, hazard);
      }, null, scene);

      // Super jump shrine/orb
      scene.dynamicPowerups = scene.physics.add.group({ allowGravity: false });
      const orb = AQDynamic.makePowerOrb(scene, 720 + (scene.lvl % 4) * 330, 300);
      scene.dynamicPowerups.add(orb);
      scene.physics.add.overlap(scene.player, scene.dynamicPowerups, function(player, power) {
        AQDynamic.collectPower(scene, power);
      }, null, scene);

      // Meteors as dynamic moving hazards
      scene.dynamicMeteors = [];
      const meteorCount = scene.lvl >= 2 ? Math.min(2 + Math.floor(scene.lvl / 3), 7) : 1;
      for (let i = 0; i < meteorCount; i++) {
        scene.dynamicMeteors.push(AQDynamic.makeMeteor(scene, 650 + i * 370));
      }
    },

    makeStar(scene, x, y) {
      const g = scene.add.graphics();
      g.fillStyle(0xFFD700, 1);
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const r = i % 2 === 0 ? 12 : 5;
        pts.push(new Phaser.Geom.Point(Math.cos(a) * r + 14, Math.sin(a) * r + 14));
      }
      g.fillPoints(pts, true);
      g.generateTexture('aq_star_gold', 28, 28);
      g.destroy();

      const s = scene.physics.add.sprite(x, y, 'aq_star_gold');
      s.body.allowGravity = false;
      s.setDepth(8);
      scene.tweens.add({ targets: s, y: y - 8, angle: 360, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      return s;
    },

    makeHazard(scene, x, y) {
      if (!scene.textures.exists('aq_fire_obstacle')) {
        const g = scene.add.graphics();
        g.fillStyle(0xB94A2E, 1);
        g.fillTriangle(18, 2, 4, 38, 32, 38);
        g.fillStyle(0xFFD700, 1);
        g.fillTriangle(18, 10, 9, 38, 27, 38);
        g.fillStyle(0x6B3522, 1);
        g.fillRect(3, 38, 30, 8);
        g.generateTexture('aq_fire_obstacle', 36, 48);
        g.destroy();
      }
      const h = scene.physics.add.staticSprite(x, y, 'aq_fire_obstacle');
      h.setDepth(7);
      h.setData('lastHit', 0);
      return h;
    },

    makePowerOrb(scene, x, y) {
      if (!scene.textures.exists('aq_power_orb')) {
        const g = scene.add.graphics();
        g.fillStyle(0x4A90E2, 0.9);
        g.fillCircle(18, 18, 16);
        g.fillStyle(0xFFD700, 0.95);
        g.fillCircle(18, 18, 7);
        g.lineStyle(2, 0xFFFFFF, 0.65);
        g.strokeCircle(18, 18, 16);
        g.generateTexture('aq_power_orb', 36, 36);
        g.destroy();
      }
      const o = scene.physics.add.sprite(x, y, 'aq_power_orb');
      o.body.allowGravity = false;
      o.setDepth(8);
      scene.tweens.add({ targets: o, scale: 1.2, alpha: 0.72, duration: 800, yoyo: true, repeat: -1 });
      return o;
    },

    makeMeteor(scene, baseX) {
      if (!scene.textures.exists('aq_meteor')) {
        const g = scene.add.graphics();
        g.fillStyle(0xFF6B35, 1);
        g.fillCircle(16, 16, 13);
        g.fillStyle(0xFFD700, 1);
        g.fillCircle(12, 12, 5);
        g.lineStyle(3, 0xFFB347, 0.65);
        g.lineBetween(0, 5, 22, 23);
        g.generateTexture('aq_meteor', 34, 34);
        g.destroy();
      }
      const m = scene.physics.add.sprite(baseX, Phaser.Math.Between(55, 160), 'aq_meteor');
      m.body.allowGravity = false;
      m.setDepth(9);
      m.setVelocity(Phaser.Math.Between(-35, 35), Phaser.Math.Between(70, 125));
      m.setData('baseX', baseX);
      m.setData('lastHit', 0);
      scene.physics.add.overlap(scene.player, m, function(player, meteor) {
        AQDynamic.hitHazard(scene, meteor);
      }, null, scene);
      return m;
    },

    updateMeteors(scene) {
      if (!scene.dynamicMeteors) return;
      scene.dynamicMeteors.forEach(m => {
        if (!m || !m.active) return;
        m.angle += 3;
        if (m.y > 470 || m.x < 0 || m.x > 3000) {
          m.setPosition(m.getData('baseX') + Phaser.Math.Between(-110, 110), Phaser.Math.Between(30, 120));
          m.setVelocity(Phaser.Math.Between(-45, 45), Phaser.Math.Between(75, 140));
        }
      });
    },

    updateSuperPower(scene) {
      if (!scene || !scene.player || !scene.superJumpUntil) return;
      const active = scene.time.now < scene.superJumpUntil;
      if (active) {
        scene.player.setTint(0xFFD700);
      } else if (scene.player.tintTopLeft === 0xFFD700) {
        scene.player.clearTint();
      }
    },

    collectStar(scene, star) {
      if (!star.active) return;
      star.disableBody(true, true);
      scene.coins = (scene.coins || 0) + 1;
      scene.score = (scene.score || 0) + 25;
      scene.dynamicScore = (scene.dynamicScore || 0) + 25;

      const s = this.readState();
      s.totalCoins = Number(s.totalCoins || 0) + 1;
      s.wisdomPoints = Number(s.wisdomPoints || 0) + 5;
      this.writeState(s);

      const hud = document.getElementById('hud-coins');
      if (hud) hud.textContent = s.totalCoins;
      this.spark(scene, star.x, star.y, 0xFFD700, 8);
      this.drumPulse();
    },

    collectPower(scene, power) {
      if (!power.active) return;
      power.disableBody(true, true);
      scene.superJumpUntil = scene.time.now + 12000;
      scene.canDJ = true;
      scene.score = (scene.score || 0) + 60;
      this.addWisdom(10);
      this.spark(scene, power.x, power.y, 0x4A90E2, 14);
      this.toast('<strong>⚡ Супер моќ!</strong><br>12 секунди имаш висок скок и двоен скок.');
      this.drumPulse();

      // Boost jump by wrapping player velocity when jump is detected is already handled by original update,
      // so we add temporary upward assistance when Space/touch is active.
      if (!scene.__AQ_SUPER_TIMER) {
        scene.__AQ_SUPER_TIMER = scene.time.addEvent({
          delay: 80,
          loop: true,
          callback: () => {
            if (!scene.player || scene.time.now > scene.superJumpUntil) return;
            const keys = window.__AQ_TOUCH_KEYS || {};
            const up = (scene.cursors && (scene.cursors.up.isDown || scene.cursors.space.isDown)) ||
                       (scene.wasd && (scene.wasd.W.isDown || scene.wasd.SPACE.isDown)) ||
                       keys.Space;
            if (up && scene.player.body.velocity.y < 40) {
              scene.player.setVelocityY(Math.min(scene.player.body.velocity.y, -520));
            }
          }
        });
      }
    },

    hitHazard(scene, hazard) {
      const now = scene.time.now || Date.now();
      if (hazard.getData && now - (hazard.getData('lastHit') || 0) < 1200) return;
      if (hazard.setData) hazard.setData('lastHit', now);

      scene.dynamicFalls = (scene.dynamicFalls || 0) + 1;
      scene.score = Math.max(0, (scene.score || 0) - 30);
      this.spark(scene, scene.player.x, scene.player.y, 0xFF6B35, 10);

      // Friendly reset, not death.
      scene.player.setVelocity(0, 0);
      scene.player.setPosition(Math.max(80, scene.player.x - 120), 350);

      this.toast('<strong>🔥 Препрека!</strong><br>Внимавај, патот на мудроста има предизвици.');
      if (window.MagicTracking && typeof window.MagicTracking.trackDeath === 'function') {
        window.MagicTracking.trackDeath(scene.lvl);
      }
    },

    spark(scene, x, y, color, n) {
      for (let i = 0; i < n; i++) {
        const p = scene.add.circle(x, y, Phaser.Math.FloatBetween(2, 5), color, 0.85);
        p.setDepth(20);
        scene.tweens.add({
          targets: p,
          x: x + Phaser.Math.FloatBetween(-60, 60),
          y: y + Phaser.Math.FloatBetween(-70, 20),
          alpha: 0,
          scale: 0,
          duration: 550,
          onComplete: () => p.destroy()
        });
      }
    },

    calculateMissionBonus(scene) {
      let bonus = 0;
      if ((scene.coins || 0) >= 5) bonus += 20;
      if ((scene.scrolls || 0) >= 1) bonus += 35;
      if ((scene.dynamicFalls || 0) === 0) bonus += 30;
      return bonus;
    },

    addWisdom(points) {
      const s = this.readState();
      s.wisdomPoints = Number(s.wisdomPoints || 0) + Number(points || 0);
      this.writeState(s);
    },

    showLevelIntro(scene) {
      this.toast(
        '<strong>🎯 Мисија ниво ' + scene.lvl + ':</strong><br>' +
        scene.dynamicMission + '<br><span style="color:#FFD700">Очекувај ѕвезди, препреки и небесни знаци.</span>',
        5200
      );
    },

    patchLevelCompleteText() {
      // Enhances existing complete modal when it appears.
      const observer = new MutationObserver(() => {
        const modal = document.getElementById('modal-complete');
        if (!modal || modal.classList.contains('hidden')) return;
        if (document.getElementById('aq-dynamic-complete-note')) return;

        const level = parseInt((document.getElementById('complete-level') || {}).textContent || '1', 10);
        const note = document.createElement('div');
        note.id = 'aq-dynamic-complete-note';
        note.style.cssText = 'margin-top:14px;padding:12px;border-radius:16px;background:rgba(255,215,0,.10);border:1px solid rgba(255,215,0,.25);font-size:13px;line-height:1.45;color:#FFF8E7';
        note.innerHTML =
          '<strong style="color:#FFD700">⚡ Динамична мисија завршена!</strong><br>' +
          'Ниво ' + level + ' донесе нови ѕвезди, предизвици и мудрост. Следниот пат очекувај уште повеќе движење.';
        const box = modal.querySelector('.bg-black\\/40, .rounded-3xl, .p-6') || modal.firstElementChild || modal;
        box.appendChild(note);
      });
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    },

    ensureAudioForGameplay() {
      // Do not force audio, but keep it ready after user gesture.
      if (this.musicOn && this.audio && this.audio.ctx.state === 'suspended') {
        this.audio.ctx.resume().catch(() => {});
      }
    }
  };

  if (document.readyState !== 'loading') AQDynamic.init();
  else document.addEventListener('DOMContentLoaded', () => AQDynamic.init());

  window.AQDynamic = AQDynamic;
})();
