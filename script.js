/**
 * CAROLYN DHU - 55TH BIRTHDAY CELEBRATION
 * Dedicated by Her Best Friend, Frank Muhindo
 * Interactive Logic, Fifty-Five Roses Audio Autoplay with Optional Pause,
 * Real Roses & Surprise Present Box Interactions
 * Strictly Zero Emojis.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetalCanvas();
  initSongAudio();
  initHeroTextLetters();
  initGardenInteractions();
  initPhotoGallery();
  initScrollAnimations();
  initWishesInteraction();
  initGiftBoxSurprise();
  initBloomFireworks();
});

/* ==========================================================================
   1. REALISTIC ROSE PETAL CANVAS SYSTEM
   ========================================================================== */
function initPetalCanvas() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const maxPetals = window.innerWidth < 768 ? 20 : 40;

  const petalColors = [
    { fill: '#c42345', shadow: '#7a0e20' },
    { fill: '#e64968', shadow: '#961e33' },
    { fill: '#f8b6c4', shadow: '#d67588' },
    { fill: '#fceced', shadow: '#e8a9b6' },
    { fill: '#fff5ee', shadow: '#edd3d8' }
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.0 - 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      this.swing = Math.random() * Math.PI * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.aspect = Math.random() * 0.4 + 0.6;
    }

    update() {
      this.y += this.speedY;
      this.swing += this.swingSpeed;
      this.x += Math.sin(this.swing) * 0.9 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1, Math.cos(this.swing) * this.aspect);

      ctx.fillStyle = this.color.fill;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size * 0.9, this.size * 0.4, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.4, -this.size * 0.8, -this.size * 0.8, 0, -this.size);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = this.color.shadow;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(0, this.size * 0.6);
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < maxPetals; i++) {
    petals.push(new Petal());
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    petals.forEach((p) => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        p.speedX += (dx / dist) * 0.15;
      }
    });
  });

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. SONG AUDIO CONTROLLER WITH AUTOPLAY & EXPLICIT PAUSE OPTION
   ========================================================================== */
function initSongAudio() {
  const audio = document.getElementById('birthdaySong');
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicBtnText = document.getElementById('musicBtnText');
  const soundwave = document.getElementById('soundwaveIndicator');

  if (!audio || !musicBtn) return;

  function updateUiPlaying() {
    musicBtn.classList.add('playing');
    if (musicBtnText) musicBtnText.textContent = 'Pause';
    if (soundwave) soundwave.classList.add('active');
  }

  function updateUiPaused() {
    musicBtn.classList.remove('playing');
    if (musicBtnText) musicBtnText.textContent = 'Play';
    if (soundwave) soundwave.classList.remove('active');
  }

  // Attempt autoplay immediately
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateUiPlaying();
      })
      .catch(() => {
        // Autoplay prevented by browser policy: start on first touch/click/scroll
        updateUiPaused();

        const startOnInteraction = () => {
          audio.play().then(() => {
            updateUiPlaying();
          }).catch(() => {});

          window.removeEventListener('click', startOnInteraction);
          window.removeEventListener('touchstart', startOnInteraction);
          window.removeEventListener('scroll', startOnInteraction);
          window.removeEventListener('keydown', startOnInteraction);
        };

        window.addEventListener('click', startOnInteraction, { once: true });
        window.addEventListener('touchstart', startOnInteraction, { once: true, passive: true });
        window.addEventListener('scroll', startOnInteraction, { once: true, passive: true });
        window.addEventListener('keydown', startOnInteraction, { once: true });
      });
  }

  // Manual click on toggle button
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(() => {
        updateUiPlaying();
      }).catch(err => {
        console.warn('Audio play request failed', err);
      });
    } else {
      audio.pause();
      updateUiPaused();
    }
  });

  audio.addEventListener('play', updateUiPlaying);
  audio.addEventListener('pause', updateUiPaused);
}

/* ==========================================================================
   3. HERO SECTION ENTRANCE & LETTER REVEALS
   ========================================================================== */
function initHeroTextLetters() {
  const heroTitle = document.getElementById('heroAnimatedTitle');
  if (heroTitle) {
    const rawText = heroTitle.textContent.trim();
    heroTitle.textContent = '';

    const words = rawText.split(' ');
    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      wordSpan.style.marginRight = '0.3em';

      if (word.includes('Carolyn') || word.includes('Dhu!')) {
        wordSpan.classList.add('name-highlight');
      }

      for (let i = 0; i < word.length; i++) {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = word[i];
        letterSpan.className = 'letter';
        letterSpan.style.animationDelay = `${0.3 + (wIdx * 6 + i) * 0.04}s`;
        wordSpan.appendChild(letterSpan);
      }

      heroTitle.appendChild(wordSpan);
    });
  }

  const enterBtn = document.getElementById('enterGardenBtn');
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('gardenSection');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        triggerRoseBloomShower(50);
      }
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE ROSE GARDEN
   ========================================================================== */
function initGardenInteractions() {
  const cards = document.querySelectorAll('.rose-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.style.transform = 'translateY(-12px) scale(1.03)';
      const photoFrame = card.querySelector('.rose-photo-frame');
      if (photoFrame) {
        photoFrame.style.transform = 'scale(1.15) rotate(8deg)';
        setTimeout(() => {
          photoFrame.style.transform = '';
          card.style.transform = '';
        }, 700);
      }

      const rect = card.getBoundingClientRect();
      burstMiniPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
    });
  });
}

/* ==========================================================================
   5. PHOTO GALLERY LIGHTBOX & INTERACTION
   ========================================================================== */
function initPhotoGallery() {
  const photoCards = document.querySelectorAll('.photo-card');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!lightbox) return;

  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.photo-title')?.textContent || '';
      const desc = card.querySelector('.photo-desc')?.textContent || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. SCROLL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const paragraphs = document.querySelectorAll('.letter-paragraph');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.2 }
  );

  paragraphs.forEach((p) => observer.observe(p));
}

/* ==========================================================================
   7. PLAYFUL INTERACTION: "CHOOSE A ROSE, DISCOVER A WISH"
   ========================================================================== */
function initWishesInteraction() {
  const buttons = document.querySelectorAll('.wish-rose-button');
  const displayTitle = document.getElementById('wishDisplayTitle');
  const displayText = document.getElementById('wishDisplayText');
  const meterFill = document.getElementById('wishesMeterFill');
  const counterText = document.getElementById('wishesCounterText');

  const discoveredWishes = new Set();

  const wishesData = [
    {
      title: 'A Rose for Happiness',
      text: 'May happiness find you in every small moment and every milestone celebration.'
    },
    {
      title: 'A Rose for Love',
      text: 'May you always be surrounded by genuine love, warmth, and people who treasure you.'
    },
    {
      title: 'A Rose for Good Health',
      text: 'May strength, wellness, vitality, and serene peace accompany your every step.'
    },
    {
      title: 'A Rose for Beautiful Memories',
      text: 'May every new season bring experiences and memories you will forever hold dear.'
    },
    {
      title: 'A Rose for New Beginnings',
      text: 'May turning 55 open doors to inspiring opportunities and fulfilled dreams.'
    }
  ];

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      btn.classList.add('revealed');

      discoveredWishes.add(index);
      const count = discoveredWishes.size;
      if (meterFill) meterFill.style.width = `${(count / 5) * 100}%`;
      if (counterText) counterText.textContent = `${count} of 5 Wishes Discovered`;

      const wish = wishesData[index];
      if (displayTitle && displayText && wish) {
        displayTitle.style.opacity = '0';
        displayText.style.opacity = '0';

        setTimeout(() => {
          displayTitle.textContent = wish.title;
          displayText.textContent = `“${wish.text}”`;
          displayTitle.style.opacity = '1';
          displayText.style.opacity = '1';
        }, 200);
      }

      const rect = btn.getBoundingClientRect();
      burstMiniPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    });
  });
}

/* ==========================================================================
   8. INTERACTIVE BIRTHDAY SURPRISE (PRESENT BOX IMAGE)
   ========================================================================== */
function initGiftBoxSurprise() {
  const giftBox = document.getElementById('giftBoxInteractive');
  const revealedCard = document.getElementById('revealedSurpriseCard');
  const bloomBtn = document.getElementById('letRosesBloomBtn');

  if (!giftBox) return;

  giftBox.addEventListener('click', () => {
    if (giftBox.classList.contains('opened')) return;

    giftBox.classList.add('opened');

    triggerRoseBloomShower(80);

    setTimeout(() => {
      if (revealedCard) {
        revealedCard.classList.add('active');
        revealedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 600);
  });

  if (bloomBtn) {
    bloomBtn.addEventListener('click', () => {
      triggerRoseBloomShower(100);
    });
  }

  const finaleBloomBtn = document.getElementById('finaleBloomAgainBtn');
  if (finaleBloomBtn) {
    finaleBloomBtn.addEventListener('click', () => {
      triggerRoseBloomShower(120);
    });
  }
}

/* ==========================================================================
   9. BLOOM FIREWORKS & PARTICLE EXPLOSION SYSTEM
   ========================================================================== */
let fireworksCanvas = null;
let fireworksCtx = null;
let fireworksParticles = [];
let isFireworksRunning = false;

function initBloomFireworks() {
  fireworksCanvas = document.getElementById('bloomFireworksCanvas');
  if (!fireworksCanvas) return;
  fireworksCtx = fireworksCanvas.getContext('2d');

  function resize() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
}

function triggerRoseBloomShower(count = 70) {
  if (!fireworksCanvas || !fireworksCtx) return;

  const w = fireworksCanvas.width;
  const h = fireworksCanvas.height;

  const centers = [
    { x: w * 0.25, y: h * 0.4 },
    { x: w * 0.5, y: h * 0.3 },
    { x: w * 0.75, y: h * 0.4 }
  ];

  const colors = ['#b31b34', '#c42345', '#e64968', '#f8b6c4', '#f7e7a9', '#c59b27', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const center = centers[Math.floor(Math.random() * centers.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;

    fireworksParticles.push({
      x: center.x + (Math.random() - 0.5) * 80,
      y: center.y + (Math.random() - 0.5) * 80,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.15,
      friction: 0.96,
      size: Math.random() * 12 + 8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.012 + 0.008
    });
  }

  if (!isFireworksRunning) {
    isFireworksRunning = true;
    animateFireworks();
  }
}

function burstMiniPetals(x, y, count = 15) {
  if (!fireworksCanvas || !fireworksCtx) return;

  const colors = ['#b31b34', '#c42345', '#e64968', '#f8b6c4', '#f7e7a9'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;

    fireworksParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.18,
      friction: 0.95,
      size: Math.random() * 9 + 6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015
    });
  }

  if (!isFireworksRunning) {
    isFireworksRunning = true;
    animateFireworks();
  }
}

function animateFireworks() {
  if (!fireworksCanvas || !fireworksCtx) return;

  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i];
    p.vx *= p.friction;
    p.vy *= p.friction;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      fireworksParticles.splice(i, 1);
      continue;
    }

    fireworksCtx.save();
    fireworksCtx.globalAlpha = p.alpha;
    fireworksCtx.translate(p.x, p.y);
    fireworksCtx.rotate(p.rotation);

    fireworksCtx.fillStyle = p.color;
    fireworksCtx.beginPath();
    fireworksCtx.moveTo(0, -p.size);
    fireworksCtx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.8, p.size * 0.6, 0, p.size);
    fireworksCtx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
    fireworksCtx.closePath();
    fireworksCtx.fill();

    fireworksCtx.restore();
  }

  if (fireworksParticles.length > 0) {
    requestAnimationFrame(animateFireworks);
  } else {
    isFireworksRunning = false;
  }
}
