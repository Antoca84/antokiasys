/* ═══════════════════════════════════════
   Antokia System — main.js
   Requires: GSAP 3.12.5 + ScrollTrigger
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  const isMobile = window.innerWidth < 768;
  const dur = isMobile ? 0.4 : 0.7;
  const ease = 'power3.out';

  /* ─── GSAP init ─── */
  gsap.registerPlugin(ScrollTrigger);

  /* ─── Nav: blur on scroll ─── */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    nav.classList.toggle('blur-active', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── Mobile nav overlay ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navClose   = document.getElementById('nav-close');
  const overlayLinks = mobileMenu.querySelectorAll('.nav__overlay-link, .nav__overlay-cta');

  function openMenu() {
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
  }

  hamburger.addEventListener('click', openMenu);
  navClose.addEventListener('click', closeMenu);
  overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ─── Hero: entrata kinetica ─── */
  const heroWords = gsap.utils.toArray('.hero__h1-word');
  const heroTl = gsap.timeline({ delay: 0.12, defaults: { ease } });
  heroTl
    .from('.hero__eyebrow', { y: 16, opacity: 0, duration: 0.55 })
    .from(heroWords, { y: 44, opacity: 0, duration: 0.6, stagger: 0.055 }, '-=0.25')
    .from('.hero__lead', { y: 18, opacity: 0, duration: 0.55 }, '-=0.3')
    .from('.hero__ctas', { y: 16, opacity: 0, duration: 0.55 }, '-=0.35')
    .from('.hero__trust li', { y: 12, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.35')
    .from('.hp', { y: 34, opacity: 0, scale: 0.96, duration: 0.85 }, '-=0.75');

  /* ─── Hero phone: caos → calma (loop) ─── */
  const hpNotifs   = gsap.utils.toArray('.hp-notif');
  const hpCalm     = document.querySelector('.hp__calm');
  const hpSweep    = document.querySelector('.hp__sweep');
  const hpBadge    = document.getElementById('hpBadge');
  const hpBadgeWrap = document.querySelector('.hp__bar-badge');

  if (hpNotifs.length && hpCalm) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setBadge(n) {
      if (hpBadge) hpBadge.textContent = n;
      if (hpBadgeWrap) hpBadgeWrap.classList.toggle('is-zero', n === 0);
    }

    if (prefersReduced) {
      gsap.set(hpNotifs, { opacity: 0 });
      gsap.set(hpCalm, { opacity: 1, scale: 1, y: 0 });
      setBadge(0);
    } else {
      gsap.set(hpNotifs, { opacity: 0, y: 18, scale: 0.97 });
      gsap.set(hpCalm, { opacity: 0, scale: 0.94, y: 10 });
      setBadge(0);

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.0, delay: 1.0 });

      // 1 — caos: le notifiche piovono
      hpNotifs.forEach((n, i) => {
        loop.to(n, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(1.6)' }, i * 0.52)
            .add(() => setBadge(i + 1), '<0.05');
      });

      // 2 — tiene il caos un attimo
      loop.to({}, { duration: 0.7 });

      // 3 — il sistema interviene: sweep + le notifiche escono
      loop.fromTo(hpSweep,
            { top: '-40%', opacity: 0 },
            { top: '115%', opacity: 1, duration: 0.7, ease: 'power2.inOut' })
          .to(hpNotifs, { opacity: 0, y: -16, duration: 0.4, stagger: 0.05 }, '<0.08')
          .add(() => setBadge(0), '<0.2')
          .set(hpSweep, { opacity: 0 })

      // 4 — calma
          .to(hpCalm, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.08')
          .to({}, { duration: 1.9 })

      // 5 — reset per il loop
          .to(hpCalm, { opacity: 0, scale: 0.94, y: 10, duration: 0.4 });
    }
  }

  /* ─── Utility: reveal blocks on scroll ─── */
  function revealOnScroll(selector, options = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    els.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.dur || dur,
          ease,
          delay: options.stagger ? i * options.stagger : 0,
          scrollTrigger: {
            trigger: el,
            start: options.start || 'top 88%',
            once: true
          }
        }
      );
    });
  }

  /* ─── Before/After: slide in from sides ─── */
  const primaCol = document.querySelector('.before-after__col--prima');
  const dopoCol  = document.querySelector('.before-after__col--dopo');

  if (primaCol && dopoCol) {
    const baTrigger = { trigger: '.before-after__inner', start: 'top 80%', once: true };
    if (isMobile) {
      gsap.fromTo(primaCol, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: dur, ease, scrollTrigger: baTrigger });
      gsap.fromTo(dopoCol,  { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: dur, ease, delay: 0.1, scrollTrigger: baTrigger });
    } else {
      gsap.fromTo(primaCol, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: dur, ease, scrollTrigger: baTrigger });
      gsap.fromTo(dopoCol,  { x: 60, opacity: 0 },  { x: 0, opacity: 1, duration: dur, ease, scrollTrigger: baTrigger });
    }
  }

  /* ─── How it works: SVG line draw ─── */
  const connectorLine = document.querySelector('.connector-line');
  if (connectorLine) {
    const lineLength = connectorLine.getTotalLength ? connectorLine.getTotalLength() : 300;
    gsap.set(connectorLine, { strokeDasharray: lineLength, strokeDashoffset: lineLength });

    gsap.to(connectorLine, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.how-it-works__track',
        start: 'top 75%',
        end: 'bottom 30%',
        scrub: 0.8
      }
    });
  }

  /* ─── How it works: steps stagger ─── */
  revealOnScroll('.step', { stagger: 0.15, start: 'top 85%' });

  /* ─── Testimonials: random 3 + animate ─── */
  const testimonials = [
    { name: 'Luca R.',       city: 'Milano',   text: 'Prima mandavo le istruzioni di accesso a mano ogni volta. Adesso arrivano in automatico il giorno prima. Un ospite mi ha scritto \'tutto chiarissimo, grazie\' — non aveva fatto nessuna domanda.' },
    { name: 'Sara M.',       city: 'Firenze',  text: 'Ho scoperto che i miei ospiti coreani non capivano le istruzioni in inglese. Adesso il sito le mostra in coreano automaticamente. Ho smesso di ricevere messaggi confusi la sera del check-in.' },
    { name: 'Marco T.',      city: 'Bologna',  text: 'Gestisco tre appartamenti. Sapere in tempo reale quando arriva un pagamento, senza aprire Airbnb, sembra una cosa piccola. Non lo è. Controllo il telefono la metà delle volte e vedo solo quello che conta.' },
    { name: 'Giulia F.',     city: 'Torino',   text: 'Un ospite è arrivato alle 2 di notte. Ho saputo che la serratura aveva aperto in tempo reale, senza aspettare messaggi. Mi sono addormentata tranquilla per la prima volta in mesi.' },
    { name: 'Alessandro P.', city: 'Roma',     text: 'Dimenticavo di rispondere alle recensioni. Non per menefreghismo — semplicemente le perdevo. Adesso ricevo la bozza su Telegram, la approvo in due secondi e viene pubblicata. Il mio profilo non ha più silenzi.' },
    { name: 'Francesca N.',  city: 'Napoli',   text: 'La verifica dei documenti su Vikey mi portava via venti minuti al giorno. Adesso ricevo una notifica quando è già fatto. Non ho ancora capito bene come funziona e non mi importa.' },
    { name: 'Matteo G.',     city: 'Venezia',  text: 'Ogni mattina alle sette ricevo un messaggio con i check-in e checkout del giorno. Niente di più. Ho smesso di aprire il calendario ogni mezz\'ora per controllare se mi ero dimenticato qualcosa.' },
    { name: 'Elena C.',      city: 'Bergamo',  text: 'Mi hanno segnalato che i competitor nella mia zona avevano abbassato i prezzi di un weekend. Ho sistemato in cinque minuti. Quel weekend era pieno, il precedente era vuoto. Non ci avrei mai fatto caso da sola.' },
    { name: 'Paolo S.',      city: 'Bari',     text: 'Gli ospiti mi scrivono ancora, ma sono domande diverse. Non più \'dov\'è il WiFi\' o \'a che ora devo uscire\'. Quelle le risponde il sistema. Adesso mi scrivono per ringraziarmi.' },
    { name: 'Valentina R.',  city: 'Padova',   text: 'Prima di configurarlo mi hanno fatto l\'analisi dell\'annuncio. Avevo la foto sbagliata come copertina da due anni. Due anni. Quella settimana ho cambiato e le richieste sono aumentate.' },
    { name: 'Roberto L.',    city: 'Verona',   text: 'Il mio addetto alle pulizie sapeva già quando intervenire prima che io lo chiamassi. Gli arriva un messaggio dopo ogni checkout con l\'orario del prossimo check-in. Non ci sentiamo quasi più — nel senso migliore.' },
    { name: 'Chiara M.',     city: 'Genova',   text: 'Ho ospiti da tutto il mondo. Non parlo spagnolo, non parlo cinese. Adesso la guida è nella loro lingua e non ricevo più messaggi in lingue che non capisco alle undici di sera su WhatsApp.' },
    { name: 'Davide B.',     city: 'Catania',  text: 'A fine mese non dovevo più ricostruire quanto avevo guadagnato da zero. Ce l\'avevo già, in tempo reale. Piccola cosa, ma cambia come vivi il lavoro.' },
    { name: 'Marta V.',      city: 'Brescia',  text: 'Un ospite aveva avuto problemi con il riscaldamento e non me lo aveva detto. Lo scopro dalla recensione. Adesso se qualcosa non va il sistema me lo segnala. Quella recensione non si ripete.' },
    { name: 'Filippo A.',    city: 'Modena',   text: 'Avevo paura che automatizzare le risposte rendesse tutto più freddo. Il contrario. Gli ospiti ricevono tutto prima ancora di chiederlo. L\'ultimo ha scritto che era la prima volta che capiva le istruzioni di una casa al primo tentativo.' },
    { name: 'Simona T.',     city: 'Milano',   text: 'Ho una coppia di anziani olandesi che non apriva l\'app dopo la prenotazione. Adesso ricevono tutto su WhatsApp nella loro lingua. Mi hanno lasciato cinque stelle scrivendo che ero stata "sempre disponibile e chiara". Non ho scritto una parola in olandese in vita mia.' },
    { name: 'Andrea C.',     city: 'Roma',     text: 'I miei ospiti spagnoli non controllavano Airbnb dopo aver prenotato. Classico. Adesso scrivo da Telegram come se mandassi un messaggio a un amico — e loro ricevono tutto in spagnolo sul loro WhatsApp. Per me è trasparente. Per loro sembra che parli la loro lingua.' }
  ];

  const avatarMap = {
    'Luca R.':       'assets/img/avatars/av1.webp',
    'Marco T.':      'assets/img/avatars/av3.webp',
    'Alessandro P.': 'assets/img/avatars/av5.webp',
    'Matteo G.':     'assets/img/avatars/av1.webp',
    'Paolo S.':      'assets/img/avatars/av3.webp',
    'Davide B.':     'assets/img/avatars/av5.webp',
    'Roberto L.':    'assets/img/avatars/av3.webp',
    'Filippo A.':    'assets/img/avatars/av5.webp',
    'Andrea C.':     'assets/img/avatars/av1.webp',
    'Sara M.':       'assets/img/avatars/av2.webp',
    'Giulia F.':     'assets/img/avatars/av4.webp',
    'Francesca N.':  'assets/img/avatars/av6.webp',
    'Elena C.':      'assets/img/avatars/av2.webp',
    'Valentina R.':  'assets/img/avatars/av4.webp',
    'Chiara M.':     'assets/img/avatars/av6.webp',
    'Marta V.':      'assets/img/avatars/av2.webp',
    'Simona T.':     'assets/img/avatars/av4.webp'
  };

  function pickRandom(arr, n) {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  }

  function pickUniqueAvatars(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    const picked = [];
    const usedAvatars = new Set();
    for (const t of shuffled) {
      const av = avatarMap[t.name] || 'assets/img/avatars/av1.webp';
      if (!usedAvatars.has(av)) {
        usedAvatars.add(av);
        picked.push(t);
        if (picked.length === n) break;
      }
    }
    return picked;
  }

  const tGrid = document.getElementById('testimonialsGrid');
  if (tGrid) {
    pickUniqueAvatars(testimonials, 3).forEach(t => {
      const avatar = avatarMap[t.name] || 'assets/img/avatars/av1.webp';
      const card = document.createElement('article');
      card.className = 'testi-card';
      card.setAttribute('aria-label', 'Testimonianza di ' + t.name);
      card.innerHTML =
        '<div class="testi-card-inner">' +
          '<div class="testi-card__back">' +
            '<img class="testi-card__back-bg" src="assets/img/aks-card-back.png" alt="Antokia System">' +
            '<div class="testi-card__watermark">' +
              '<svg class="testi-card__aks-svg" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                  '<linearGradient id="rainbow-aks" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '<stop offset="0%" stop-color="#ff2020"/>' +
                    '<stop offset="16%" stop-color="#ff8800"/>' +
                    '<stop offset="32%" stop-color="#ffee00"/>' +
                    '<stop offset="50%" stop-color="#00cc44"/>' +
                    '<stop offset="66%" stop-color="#0088ff"/>' +
                    '<stop offset="83%" stop-color="#6622ff"/>' +
                    '<stop offset="100%" stop-color="#cc00ff"/>' +
                  '</linearGradient>' +
                  '<pattern id="aks-tile" x="0" y="0" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(45 200 300)">' +
                    '<text x="4" y="14" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12" fill="none" stroke="url(#rainbow-aks)" stroke-width="0.8" letter-spacing="1">AKS</text>' +
                  '</pattern>' +
                '</defs>' +
                '<rect width="100%" height="100%" fill="url(#aks-tile)"/>' +
              '</svg>' +
              '<div class="testi-card__gold-wave"></div>' +
            '</div>' +
          '</div>' +
          '<div class="testi-card__front">' +
            '<img class="testi-card__photo" src="' + avatar + '" alt="' + t.name + '" loading="lazy">' +
            '<div class="testi-card__body">' +
              '<div class="testi-card__stars" aria-label="5 stelle">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
              '<p class="testi-card__text">' + t.text + '</p>' +
              '<div class="testi-card__footer">' +
                '<div class="testi-card__meta">' +
                  '<span class="testi-card__name">' + t.name + '</span>' +
                  '<span class="testi-card__city">' + t.city + '</span>' +
                '</div>' +
                '<span class="testi-card__verified">Host verificato</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      tGrid.appendChild(card);
    });

    var tCards = Array.from(document.querySelectorAll('.testi-card'));

    // entrance: slide up from below (back face shows Antokia Verified)
    tCards.forEach(function(card, i) {
      gsap.fromTo(card,
        { y: 64, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: tGrid, start: 'top 80%', once: true }
        }
      );
    });

    // flip via IntersectionObserver — reliable across all ScrollTrigger states
    var _flipDone = false;
    var _flipObs = new IntersectionObserver(function(entries) {
      if (_flipDone) return;
      if (entries[0].isIntersecting) {
        _flipDone = true;
        _flipObs.disconnect();
        tCards.forEach(function(c) {
          var inner = c.querySelector('.testi-card-inner');
          if (!inner) return;
          var delay = 700 + Math.round(Math.random() * 1300);
          setTimeout(function() { inner.classList.add('is-flipped'); }, delay);
        });
      }
    }, { threshold: 0.4 });
    _flipObs.observe(tGrid);

    // mouse repulsion with per-card cage
    var cages = tCards.map(function() { return { x: 22, y: 14 }; });

    // persist cage sizes
    try {
      var _sc = JSON.parse(localStorage.getItem('testiCages'));
      if (_sc && _sc.length === cages.length) _sc.forEach(function(c,i){ cages[i].x=c.x; cages[i].y=c.y; });
    } catch(e) {}

    // complementary color from photo
    function _dominantRGB(img) {
      try {
        var cv=document.createElement('canvas'); cv.width=16; cv.height=16;
        var cx=cv.getContext('2d'); cx.drawImage(img,0,0,16,16);
        var d=cx.getImageData(0,0,16,16).data, r=0,g=0,b=0,n=d.length/4;
        for(var i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];}
        return [r/n,g/n,b/n];
      } catch(e) { return [200,180,155]; }
    }
    function _rgb2hsl(r,g,b){
      r/=255;g/=255;b/=255;
      var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h,s,l=(mx+mn)/2;
      if(mx===mn){h=s=0;}
      else{var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);
        if(mx===r)h=(g-b)/d+(g<b?6:0);
        else if(mx===g)h=(b-r)/d+2;
        else h=(r-g)/d+4;h/=6;}
      return [h*360,s*100,l*100];
    }
    function _hsl2hex(h,s,l){
      s/=100;l/=100;var a=s*Math.min(l,1-l);
      function f(n){var k=(n+h/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0');}
      return '#'+f(0)+f(8)+f(4);
    }
    function _applyCompBorder(card,img){
      var rgb=_dominantRGB(img),hsl=_rgb2hsl(rgb[0],rgb[1],rgb[2]);
      var ch=(hsl[0]+180)%360, cs=Math.max(40,Math.min(70,hsl[1])), cl=58;
      var hex=_hsl2hex(ch,cs,cl);
      card.style.boxShadow='0 0 0 5px '+hex+', 0 0 0 7px rgba(23,20,17,0.11), 0 8px 32px rgba(23,20,17,0.13)';
    }

    tCards.forEach(function(card){
      var img=card.querySelector('.testi-card__photo');
      if(!img) return;
      if(img.complete && img.naturalWidth>0){ _applyCompBorder(card,img); }
      else img.addEventListener('load',function(){ _applyCompBorder(card,img); });
    });

    // fix: repulse uses .testi-card rects, still correct

    function repulse(e) {
      tCards.forEach(function(card, i) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        var R = 220;
        if (d < R && d > 1) {
          var f = Math.pow((R - d) / R, 1.6);
          var tx = Math.max(-cages[i].x, Math.min(cages[i].x, -(dx / d) * f * cages[i].x * 1.4));
          var ty = Math.max(-cages[i].y, Math.min(cages[i].y, -(dy / d) * f * cages[i].y * 1.4));
          gsap.to(card, { x: tx, y: ty, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        } else {
          gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    }

    function resetCards() {
      tCards.forEach(function(card) {
        gsap.to(card, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      });
    }

    tGrid.addEventListener('mousemove', repulse);
    tGrid.addEventListener('mouseleave', resetCards);

    // HUD overlay
    var hudActive = false;
    var hudBtn = document.createElement('button');
    hudBtn.className = 'testi-hud-btn';
    hudBtn.textContent = 'HUD';
    document.querySelector('.testimonials').appendChild(hudBtn);

    var hudOverlay = document.createElement('div');
    hudOverlay.className = 'testi-hud-overlay';
    hudOverlay.hidden = true;
    tGrid.style.position = 'relative';
    tGrid.appendChild(hudOverlay);

    var cageEls = tCards.map(function(card, i) {
      var el = document.createElement('div');
      el.className = 'testi-hud-cage';
      ['nw', 'ne', 'sw', 'se'].forEach(function(corner) {
        var h = document.createElement('div');
        h.className = 'testi-hud-handle testi-hud-handle--' + corner;
        var sx, sy, scx, scy;
        h.addEventListener('mousedown', function(e) {
          e.preventDefault();
          sx = e.clientX; sy = e.clientY;
          scx = cages[i].x; scy = cages[i].y;
          var signX = corner.indexOf('e') >= 0 ? 1 : -1;
          var signY = corner.indexOf('s') >= 0 ? 1 : -1;
          function onMove(e) {
            cages[i].x = Math.max(6, Math.min(70, scx + (e.clientX - sx) * signX));
            cages[i].y = Math.max(6, Math.min(50, scy + (e.clientY - sy) * signY));
            updateCage(i);
          }
          function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            try { localStorage.setItem('testiCages', JSON.stringify(cages)); } catch(e) {}
            if (hudActive) tCards.forEach(function(_,i){ updateCage(i); });
          }
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
        el.appendChild(h);
      });
      hudOverlay.appendChild(el);
      return el;
    });

    function updateCage(i) {
      var card = tCards[i];
      var c = cages[i];
      var el = cageEls[i];
      el.style.left = (card.offsetLeft - c.x) + 'px';
      el.style.top  = (card.offsetTop  - c.y) + 'px';
      el.style.width  = (card.offsetWidth  + c.x * 2) + 'px';
      el.style.height = (card.offsetHeight + c.y * 2) + 'px';
    }

    // HUD control panel
    var hudPanel = document.createElement('div');
    hudPanel.className = 'testi-hud-panel';
    hudPanel.innerHTML =
      '<div class="testi-hud-panel__title">Controls</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Watermark</span>' +
        '<button class="testi-hud-ctrl__btn" id="hud-wm-btn">ON</button>' +
      '</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Opacita WM</span>' +
        '<input type="range" class="testi-hud-ctrl__slider" id="hud-wm-opacity" min="0" max="100" value="48">' +
        '<span class="testi-hud-ctrl__val" id="hud-wm-opacity-val">48</span>' +
      '</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Font AKS</span>' +
        '<input type="range" class="testi-hud-ctrl__slider" id="hud-font-size" min="6" max="40" value="12">' +
        '<span class="testi-hud-ctrl__val" id="hud-font-val">12</span>' +
      '</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Gold wave</span>' +
        '<button class="testi-hud-ctrl__btn" id="hud-wave-btn">ON</button>' +
      '</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Opacita wave</span>' +
        '<input type="range" class="testi-hud-ctrl__slider" id="hud-wave-opacity" min="0" max="100" value="48">' +
        '<span class="testi-hud-ctrl__val" id="hud-wave-opacity-val">48</span>' +
      '</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Repulsione</span>' +
        '<button class="testi-hud-ctrl__btn" id="hud-rep-btn">ON</button>' +
      '</div>' +
      '<div class="testi-hud-ctrl">' +
        '<span class="testi-hud-ctrl__label">Flip preview</span>' +
        '<button class="testi-hud-ctrl__btn" id="hud-flip-btn">FLIP</button>' +
      '</div>';
    hudOverlay.appendChild(hudPanel);

    // persist slider values
    function _hudSave() {
      try {
        localStorage.setItem('testiHud', JSON.stringify({
          wmOpacity: hudOverlay.querySelector('#hud-wm-opacity').value,
          fontSize:  hudOverlay.querySelector('#hud-font-size').value,
          waveOpacity: hudOverlay.querySelector('#hud-wave-opacity').value
        }));
      } catch(e) {}
    }

    function _hudLoad() {
      try {
        var s = JSON.parse(localStorage.getItem('testiHud'));
        if (!s) return;
        var wm  = hudOverlay.querySelector('#hud-wm-opacity');
        var fs  = hudOverlay.querySelector('#hud-font-size');
        var wo  = hudOverlay.querySelector('#hud-wave-opacity');
        if (s.wmOpacity !== undefined) {
          wm.value = s.wmOpacity;
          hudOverlay.querySelector('#hud-wm-opacity-val').textContent = s.wmOpacity;
          document.querySelectorAll('.testi-card__aks-svg').forEach(function(el){ el.style.opacity = s.wmOpacity/100; });
        }
        if (s.fontSize !== undefined) {
          fs.value = s.fontSize;
          hudOverlay.querySelector('#hud-font-val').textContent = s.fontSize;
          var v = parseInt(s.fontSize);
          document.querySelectorAll('.testi-card__aks-svg text').forEach(function(el){ el.setAttribute('font-size', v); });
          var tileSize = Math.max(20, Math.round(v * 3.5));
          document.querySelectorAll('#aks-tile').forEach(function(el){ el.setAttribute('width', tileSize); el.setAttribute('height', tileSize); });
        }
        if (s.waveOpacity !== undefined) {
          wo.value = s.waveOpacity;
          hudOverlay.querySelector('#hud-wave-opacity-val').textContent = s.waveOpacity;
          document.querySelectorAll('.testi-card__gold-wave').forEach(function(el){ el.style.opacity = s.waveOpacity/100; });
        }
      } catch(e) {}
    }

    hudOverlay.querySelector('#hud-wm-btn').addEventListener('click', function() {
      var on = this.textContent === 'ON';
      document.querySelectorAll('.testi-card__watermark').forEach(function(el) {
        el.style.display = on ? 'none' : '';
      });
      this.textContent = on ? 'OFF' : 'ON';
      this.classList.toggle('is-off', on);
    });

    hudOverlay.querySelector('#hud-wm-opacity').addEventListener('input', function() {
      var v = this.value / 100;
      hudOverlay.querySelector('#hud-wm-opacity-val').textContent = this.value;
      document.querySelectorAll('.testi-card__aks-svg').forEach(function(el) { el.style.opacity = v; });
      _hudSave();
    });

    hudOverlay.querySelector('#hud-font-size').addEventListener('input', function() {
      var v = parseInt(this.value);
      hudOverlay.querySelector('#hud-font-val').textContent = v;
      document.querySelectorAll('.testi-card__aks-svg text').forEach(function(el) { el.setAttribute('font-size', v); });
      var tileSize = Math.max(20, Math.round(v * 3.5));
      document.querySelectorAll('#aks-tile').forEach(function(el) { el.setAttribute('width', tileSize); el.setAttribute('height', tileSize); });
      _hudSave();
    });

    hudOverlay.querySelector('#hud-wave-btn').addEventListener('click', function() {
      var on = this.textContent === 'ON';
      document.querySelectorAll('.testi-card__gold-wave').forEach(function(el) {
        el.style.opacity = on ? '0' : '';
      });
      this.textContent = on ? 'OFF' : 'ON';
      this.classList.toggle('is-off', on);
    });

    hudOverlay.querySelector('#hud-wave-opacity').addEventListener('input', function() {
      var v = this.value / 100;
      hudOverlay.querySelector('#hud-wave-opacity-val').textContent = this.value;
      document.querySelectorAll('.testi-card__gold-wave').forEach(function(el) { el.style.opacity = v; });
      _hudSave();
    });

    var repulseActive = true;
    hudOverlay.querySelector('#hud-rep-btn').addEventListener('click', function() {
      repulseActive = !repulseActive;
      this.textContent = repulseActive ? 'ON' : 'OFF';
      this.classList.toggle('is-off', !repulseActive);
      if (!repulseActive) tCards.forEach(function(card) { gsap.to(card, { x: 0, y: 0, duration: 0.4 }); });
    });

    hudOverlay.querySelector('#hud-flip-btn').addEventListener('click', function() {
      tCards.forEach(function(c) {
        var inner = c.querySelector('.testi-card-inner');
        if (!inner) return;
        var flipped = inner.classList.contains('is-flipped');
        if (flipped) { inner.classList.remove('is-flipped'); }
        else { inner.classList.add('is-flipped'); }
      });
    });

    // patch repulse to check flag
    tGrid.addEventListener('mousemove', function(e2) {
      if (!repulseActive) return;
    });

    hudBtn.addEventListener('click', function() {
      hudActive = !hudActive;
      hudOverlay.hidden = !hudActive;
      hudBtn.classList.toggle('is-active', hudActive);
      if (hudActive) {
        tCards.forEach(function(_, i) { updateCage(i); });
        _hudLoad();
      }
    });

    // also apply saved values on page load (no HUD open needed)
    (function() {
      try {
        var s = JSON.parse(localStorage.getItem('testiHud'));
        if (!s) return;
        if (s.wmOpacity !== undefined) document.querySelectorAll('.testi-card__aks-svg').forEach(function(el){ el.style.opacity = s.wmOpacity/100; });
        if (s.waveOpacity !== undefined) document.querySelectorAll('.testi-card__gold-wave').forEach(function(el){ el.style.opacity = s.waveOpacity/100; });
        if (s.fontSize !== undefined) {
          var v = parseInt(s.fontSize);
          document.querySelectorAll('.testi-card__aks-svg text').forEach(function(el){ el.setAttribute('font-size', v); });
          var ts = Math.max(20, Math.round(v * 3.5));
          document.querySelectorAll('#aks-tile').forEach(function(el){ el.setAttribute('width', ts); el.setAttribute('height', ts); });
        }
      } catch(e) {}
    })();
  }

  /* ─── Guest guide: slide in from sides ─── */
  const ggText   = document.querySelector('.guest-guide__text');
  const ggVisual = document.querySelector('.guest-guide__visual');

  if (ggText) {
    const ggFrom = isMobile ? { y: 24, opacity: 0 } : { x: -50, opacity: 0 };
    const ggTo   = isMobile ? { y: 0, opacity: 1 }  : { x: 0, opacity: 1 };
    gsap.fromTo(ggText, ggFrom, { ...ggTo, duration: dur, ease, scrollTrigger: { trigger: '.guest-guide__inner', start: 'top 80%', once: true } });
  }

  if (ggVisual) {
    const ggObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        ggObs.disconnect();
        if (typeof ggDemoStart === 'function') ggDemoStart();
      }
    }, { threshold: 0.3 });
    ggObs.observe(ggVisual);
  }

  /* ─── Pricing cards stagger ─── */
  revealOnScroll('.pricing-card', { stagger: 0.12, start: 'top 85%' });

  /* ─── Health check content ─── */
  revealOnScroll('.health-check__content > *', { stagger: 0.08, start: 'top 85%' });

  /* ─── Before/After reveal via clip-path ─── */
  const afterPanel = document.querySelector('.ba-panel--after');
  if (afterPanel) {
    gsap.fromTo(afterPanel,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: '.ba-container',
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1.2
        }
      }
    );
  }

  /* ─── Pricing accordion ─── */
  document.querySelectorAll('.pricing-accordion__trigger').forEach(trigger => {
    const content = trigger.nextElementSibling;
    gsap.set(content, { height: 0, overflow: 'hidden' });

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        gsap.to(content, { height: 0, duration: 0.3, ease: 'power2.inOut' });
      } else {
        gsap.set(content, { height: 'auto' });
        const h = content.getBoundingClientRect().height;
        gsap.fromTo(content,
          { height: 0 },
          { height: h, duration: 0.35, ease: 'power2.out' }
        );
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });

  /* ─── FAQ accordion ─── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    const content = item.querySelector('.faq-item__content');

    gsap.set(content, { height: 0, overflow: 'hidden' });

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        gsap.to(content, {
          height: 0,
          duration: 0.32,
          ease: 'power2.inOut'
        });
      } else {
        gsap.set(content, { height: 'auto' });
        const h = content.getBoundingClientRect().height;
        gsap.fromTo(content,
          { height: 0 },
          { height: h, duration: 0.38, ease: 'power2.out' }
        );
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });

  /* ─── FAQ items reveal ─── */
  revealOnScroll('.faq-item', { stagger: 0.06, start: 'top 90%' });

  /* ─── Footer CTA ─── */
  revealOnScroll('.footer-cta__title', { start: 'top 85%' });
  revealOnScroll('.footer-cta__buttons', { stagger: 0.1, start: 'top 88%' });

  /* ─── Smooth anchor scroll (mobile menu links) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── ScrollTrigger refresh on font load ─── */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

})();
