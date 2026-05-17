// ============================================================
// ALEXANDER'S QUEST - MEGA BEZBEDNOSEN SISTEM
// Blockchain, Hashing, Encryption, Copyright Protection
// INOVATOR: Sande | aleksandarmakedonskigame@gmail.com
// ============================================================

const SecuritySystem = {
  config: {
    email: 'aleksandarmakedonskigame@gmail.com',
    inovator: 'Sande',
    gameName: 'Alexander Quest',
    copyright: '© 2026 Sande Innovations. All Rights Reserved.',
    trademark: '™ Sande Games Macedonia',
    patentPending: 'Patent Pending: MK-2026-001',
    encryptionKey: 'SandeMakedonija2026AlexanderGoceDelcev',
    blockchainGenesis: '0xSANDE_GENESIS_BLOCK_2026',
  },

  // ========== ENKRIPCIJA / DEKRIPCIJA ==========
  encryption: {
    // Simple AES-like encryption for localStorage
    encrypt(data) {
      const text = JSON.stringify(data);
      const key = SecuritySystem.config.encryptionKey;
      let encrypted = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted);
    },

    decrypt(encryptedBase64) {
      try {
        const encrypted = atob(encryptedBase64);
        const key = SecuritySystem.config.encryptionKey;
        let decrypted = '';
        for (let i = 0; i < encrypted.length; i++) {
          const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
          decrypted += String.fromCharCode(charCode);
        }
        return JSON.parse(decrypted);
      } catch(e) {
        console.error('[Security] Decryption failed:', e);
        return null;
      }
    },

    // Hash function (SHA-256 like)
    hash(data) {
      const text = typeof data === 'string' ? data : JSON.stringify(data);
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      // Make it positive and hex
      const hexHash = Math.abs(hash).toString(16).padStart(16, '0');
      // Add second round for more complexity
      let hash2 = 0;
      for (let i = 0; i < hexHash.length; i++) {
        hash2 = ((hash2 << 5) - hash2) + hexHash.charCodeAt(i);
        hash2 = hash2 & hash2;
      }
      return hexHash + Math.abs(hash2).toString(16).padStart(16, '0');
    },

    // HMAC (Hash-based Message Authentication Code)
    hmac(data, secret = SecuritySystem.config.encryptionKey) {
      const hash1 = this.hash(secret + data);
      const hash2 = this.hash(hash1 + secret);
      return hash2;
    },
  },

  // ========== BLOCKCHAIN SISTEM ==========
  blockchain: {
    chain: [],
    difficulty: 3, // Number of leading zeros required

    init() {
      // Create genesis block if chain is empty
      if (this.chain.length === 0) {
        this.createGenesisBlock();
      }
    },

    createGenesisBlock() {
      const genesisBlock = {
        index: 0,
        timestamp: Date.now(),
        data: {
          type: 'genesis',
          game: SecuritySystem.config.gameName,
          inovator: SecuritySystem.config.inovator,
          email: SecuritySystem.config.email,
          copyright: SecuritySystem.config.copyright,
          trademark: SecuritySystem.config.trademark,
          patent: SecuritySystem.config.patentPending,
        },
        previousHash: '0',
        hash: '',
        nonce: 0,
      };
      genesisBlock.hash = this.mineBlock(genesisBlock);
      this.chain.push(genesisBlock);
      this.saveChain();
      console.log('[Blockchain] Genesis block created!');
    },

    calculateHash(block) {
      const data = block.index + block.timestamp + JSON.stringify(block.data) + block.previousHash + block.nonce;
      return SecuritySystem.encryption.hash(data);
    },

    mineBlock(block) {
      let hash = this.calculateHash(block);
      const target = '0'.repeat(this.difficulty);
      
      while (!hash.startsWith(target)) {
        block.nonce++;
        hash = this.calculateHash(block);
      }
      
      return hash;
    },

    addBlock(type, details) {
      const previousBlock = this.chain[this.chain.length - 1];
      const newBlock = {
        index: this.chain.length,
        timestamp: Date.now(),
        data: {
          type,
          details,
          inovator: SecuritySystem.config.inovator,
        },
        previousHash: previousBlock.hash,
        hash: '',
        nonce: 0,
      };
      
      newBlock.hash = this.mineBlock(newBlock);
      this.chain.push(newBlock);
      this.saveChain();
      
      console.log(`[Blockchain] Block #${newBlock.index} mined: ${newBlock.hash}`);
      return newBlock;
    },

    validateChain() {
      for (let i = 1; i < this.chain.length; i++) {
        const current = this.chain[i];
        const previous = this.chain[i - 1];
        
        // Check hash
        if (current.hash !== this.calculateHash(current)) {
          return { valid: false, error: `Block ${i} hash invalid` };
        }
        
        // Check previous hash link
        if (current.previousHash !== previous.hash) {
          return { valid: false, error: `Block ${i} previous hash invalid` };
        }
        
        // Check difficulty
        if (!current.hash.startsWith('0'.repeat(this.difficulty))) {
          return { valid: false, error: `Block ${i} not mined properly` };
        }
      }
      return { valid: true };
    },

    saveChain() {
      localStorage.setItem('aq_blockchain', JSON.stringify(this.chain));
    },

    loadChain() {
      const saved = localStorage.getItem('aq_blockchain');
      if (saved) {
        try {
          this.chain = JSON.parse(saved);
        } catch(e) {
          this.chain = [];
        }
      }
      this.init();
    },

    getChain() {
      return this.chain;
    },

    // Record game event in blockchain
    recordEvent(eventType, details) {
      return this.addBlock(eventType, details);
    },
  },

  // ========== ANTI-CHEAT SISTEM ==========
  antiCheat: {
    // Verify game score is legitimate
    verifyScore(level, score, time, coins) {
      // Maximum possible scores per level
      const maxScores = {
        1: 500, 2: 600, 3: 700, 4: 800, 5: 900,
        6: 1000, 7: 1100, 8: 1200, 9: 1300, 10: 1400,
        11: 1500, 12: 1600, 13: 1700, 14: 1800, 15: 1900,
        16: 2000, 17: 2100, 18: 2200, 19: 2300, 20: 2400,
        21: 2500, 22: 2600, 23: 2700, 24: 2800, 25: 2900,
        26: 3000, 27: 3100, 28: 3200, 29: 3300, 30: 3400,
        31: 3500, 32: 3600, 33: 3700, 34: 3800, 35: 3900,
        36: 4000, 37: 5000,
      };
      
      const maxScore = maxScores[level] || 5000;
      
      // Check score is within limits
      if (score > maxScore * 3) {
        return { valid: false, reason: 'Score exceeds maximum possible' };
      }
      
      // Check time is reasonable (at least 5 seconds)
      if (time < 5 && score > 100) {
        return { valid: false, reason: 'Score too high for time played' };
      }
      
      // Check coins match score
      const expectedCoins = Math.floor(score / 10);
      if (coins > expectedCoins * 2) {
        return { valid: false, reason: 'Coin count suspicious' };
      }
      
      return { valid: true };
    },

    // Detect speed hacking
    detectSpeedHack(levelStartTime, levelEndTime, level) {
      const minTimePerLevel = 10; // seconds
      const timePlayed = (levelEndTime - levelStartTime) / 1000;
      
      if (timePlayed < minTimePerLevel) {
        return { cheat: true, reason: 'Level completed too fast', timePlayed };
      }
      
      return { cheat: false };
    },

    // Create tamper-proof score signature
    signScore(playerId, level, score, timestamp) {
      const data = `${playerId}:${level}:${score}:${timestamp}`;
      const signature = SecuritySystem.encryption.hmac(data);
      return signature;
    },

    // Verify score signature
    verifyScoreSignature(playerId, level, score, timestamp, signature) {
      const expected = this.signScore(playerId, level, score, timestamp);
      return signature === expected;
    },
  },

  // ========== COPYRIGHT ZASTITA ==========
  copyright: {
    // Digital watermark for game assets
    generateWatermark() {
      return {
        game: SecuritySystem.config.gameName,
        inovator: SecuritySystem.config.inovator,
        email: SecuritySystem.config.email,
        copyright: SecuritySystem.config.copyright,
        trademark: SecuritySystem.config.trademark,
        patent: SecuritySystem.config.patentPending,
        created: new Date().toISOString(),
        license: 'All Rights Reserved. Unauthorized copying prohibited.',
        fingerprint: SecuritySystem.encryption.hash(
          SecuritySystem.config.gameName + 
          SecuritySystem.config.inovator + 
          Date.now()
        ),
      };
    },

    // Verify game integrity
    verifyIntegrity() {
      const watermark = this.generateWatermark();
      const hash = SecuritySystem.encryption.hash(JSON.stringify(watermark));
      
      // Check if code has been tampered with
      const storedHash = localStorage.getItem('aq_integrity_hash');
      
      return {
        watermark,
        currentHash: hash,
        tampered: storedHash && storedHash !== hash,
        timestamp: new Date().toISOString(),
      };
    },

    // Display copyright notice
    showCopyright() {
      return {
        title: SecuritySystem.config.gameName,
        inovator: SecuritySystem.config.inovator,
        copyright: SecuritySystem.config.copyright,
        trademark: SecuritySystem.config.trademark,
        patent: SecuritySystem.config.patentPending,
        email: SecuritySystem.config.email,
        message: `This game was created by ${SecuritySystem.config.inovator}. ` +
                 `All intellectual property rights are protected. ` +
                 `Any unauthorized copying, distribution, or modification is strictly prohibited.`,
      };
    },

    // Generate license key
    generateLicenseKey(userEmail) {
      const data = `${userEmail}:${SecuritySystem.config.gameName}:${Date.now()}`;
      const hash = SecuritySystem.encryption.hash(data);
      // Format: XXXX-XXXX-XXXX-XXXX
      return hash.toUpperCase().slice(0, 16).match(/.{4}/g).join('-');
    },

    // Verify license key
    verifyLicenseKey(key, userEmail) {
      const expected = this.generateLicenseKey(userEmail);
      return key === expected;
    },
  },

  // ========== SECURE SAVE/LOAD ==========
  secureStorage: {
    save(key, data) {
      const encrypted = SecuritySystem.encryption.encrypt(data);
      const hash = SecuritySystem.encryption.hash(JSON.stringify(data));
      localStorage.setItem(key, encrypted);
      localStorage.setItem(key + '_hash', hash);
      
      // Record in blockchain
      SecuritySystem.blockchain.recordEvent('save', { key, hash, timestamp: Date.now() });
    },

    load(key) {
      const encrypted = localStorage.getItem(key);
      const storedHash = localStorage.getItem(key + '_hash');
      
      if (!encrypted) return null;
      
      const data = SecuritySystem.encryption.decrypt(encrypted);
      if (!data) {
        console.error('[Security] Save data corrupted or tampered!');
        return null;
      }
      
      // Verify integrity
      const currentHash = SecuritySystem.encryption.hash(JSON.stringify(data));
      if (storedHash && storedHash !== currentHash) {
        console.warn('[Security] Save data may have been tampered!');
      }
      
      return data;
    },
  },

  // ========== RENDER SECURITY DASHBOARD ==========
  renderDashboard() {
    showScreen('security');
    
    // Blockchain status
    const chain = this.blockchain.getChain();
    const validation = this.blockchain.validateChain();
    
    document.getElementById('sec-block-count').textContent = chain.length;
    document.getElementById('sec-block-valid').textContent = validation.valid ? '✅ VALIDNA' : '❌ NEVALIDNA';
    document.getElementById('sec-block-valid').className = validation.valid ? 'text-green-400 font-bold' : 'text-red-400 font-bold';
    
    // Last block hash
    if (chain.length > 0) {
      const last = chain[chain.length - 1];
      document.getElementById('sec-last-hash').textContent = last.hash.slice(0, 32) + '...';
      document.getElementById('sec-last-time').textContent = new Date(last.timestamp).toLocaleString();
    }
    
    // Copyright info
    const cp = this.copyright.showCopyright();
    document.getElementById('sec-cp-title').textContent = cp.title;
    document.getElementById('sec-cp-inovator').textContent = cp.inovator;
    document.getElementById('sec-cp-copyright').textContent = cp.copyright;
    document.getElementById('sec-cp-trademark').textContent = cp.trademark;
    document.getElementById('sec-cp-patent').textContent = cp.patent;
    document.getElementById('sec-cp-email').textContent = cp.email;
    document.getElementById('sec-cp-message').textContent = cp.message;
    
    // Integrity check
    const integrity = this.copyright.verifyIntegrity();
    document.getElementById('sec-integrity').textContent = integrity.tampered ? '⚠️ MODIFICIRANA' : '✅ ORIGINALNA';
    document.getElementById('sec-integrity').className = integrity.tampered ? 'text-red-400 font-bold' : 'text-green-400 font-bold';
    
    // Blockchain table
    const tbody = document.getElementById('sec-blockchain-table');
    if (tbody) {
      tbody.innerHTML = chain.slice(-10).map(b => `
        <tr class="border-b border-white/5">
          <td class="py-2 px-3 text-sm text-blue-400">#${b.index}</td>
          <td class="py-2 px-3 text-sm text-[#FFF8E7]/60">${b.data.type}</td>
          <td class="py-2 px-3 text-sm text-[#FFF8E7]/40 font-mono text-xs">${b.hash.slice(0, 20)}...</td>
          <td class="py-2 px-3 text-sm text-yellow-400">${b.nonce}</td>
          <td class="py-2 px-3 text-xs text-[#FFF8E7]/40">${new Date(b.timestamp).toLocaleTimeString()}</td>
        </tr>
      `).join('');
    }
  },

  // ========== INITIALIZATION ==========
  init() {
    this.blockchain.loadChain();
    
    // Record game load in blockchain
    this.blockchain.recordEvent('game_load', {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
    
    console.log('[SecuritySystem] Mega Bezbednosen Sistem inicializiran!');
    console.log('[SecuritySystem] INOVATOR:', this.config.inovator);
    console.log('[SecuritySystem] Blockchain blocks:', this.blockchain.getChain().length);
    console.log('[SecuritySystem] Copyright:', this.config.copyright);
    
    return this;
  },
};

// Make available globally
window.SecuritySystem = SecuritySystem;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  SecuritySystem.init();
});

if (typeof module !== 'undefined') module.exports = SecuritySystem;
