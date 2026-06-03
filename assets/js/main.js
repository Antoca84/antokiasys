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
    gsap.fromTo(primaCol,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: dur, ease, scrollTrigger: baTrigger }
    );
    gsap.fromTo(dopoCol,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: dur, ease, scrollTrigger: baTrigger }
    );
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

  const tGrid = document.getElementById('testimonialsGrid');
  if (tGrid) {
    pickRandom(testimonials, 3).forEach(t => {
      const avatar = avatarMap[t.name] || 'assets/img/avatars/av1.webp';
      const card = document.createElement('article');
      card.className = 'testi-card';
      card.setAttribute('aria-label', 'Testimonianza di ' + t.name);
      card.innerHTML =
        '<div class=”testi-card__header”>' +
          '<img class=”testi-card__avatar” src=”' + avatar + '” alt=”' + t.name + '” loading=”lazy”>' +
          '<div class=”testi-card__meta”>' +
            '<span class=”testi-card__name”>' + t.name + '</span>' +
            '<span class=”testi-card__city”>' + t.city + '</span>' +
          '</div>' +
          '<div class=”testi-card__stars” aria-label=”5 stelle”>★★★★★</div>' +
        '</div>' +
        '<p class=”testi-card__text”>' + t.text + '</p>' +
        '<div class=”testi-card__footer”>' +
          '<span class=”testi-card__verified”>Host verificato</span>' +
        '</div>';
      tGrid.appendChild(card);
    });

    gsap.fromTo('.testi-card',
      { y: 56, opacity: 0, scale: 0.92 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.65,
        ease: 'back.out(1.4)',
        stagger: 0.13,
        scrollTrigger: {
          trigger: tGrid,
          start: 'top 82%',
          once: true
        }
      }
    );
  }

  /* ─── Guest guide: slide in from sides ─── */
  const ggText   = document.querySelector('.guest-guide__text');
  const ggVisual = document.querySelector('.guest-guide__visual');

  if (ggText && ggVisual) {
    const ggTrigger = { trigger: '.guest-guide__inner', start: 'top 80%', once: true };
    gsap.fromTo(ggText,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: dur, ease, scrollTrigger: ggTrigger }
    );
    gsap.fromTo(ggVisual,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: dur, ease, scrollTrigger: ggTrigger }
    );
  }

  /* ─── Pricing cards stagger ─── */
  revealOnScroll('.pricing-card', { stagger: 0.12, start: 'top 85%' });

  /* ─── Health check content ─── */
  revealOnScroll('.health-check__content > *', { stagger: 0.08, start: 'top 85%' });

  /* ─── Before/After: ciclo automatico leggibile ─── */
  const afterPanel = document.querySelector('.ba-panel--after');
  if (afterPanel) {
    const baReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (baReduced) {
      gsap.set(afterPanel, { clipPath: 'inset(0 0% 0 0)' });
    } else {
      gsap.set(afterPanel, { clipPath: 'inset(0 100% 0 0)' });

      const baLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });
      baLoop
        .to({}, { duration: 1.9 })                                                   // leggi PRIMA
        .to(afterPanel, { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power2.inOut' })  // tendina →
        .to({}, { duration: 2.4 })                                                   // leggi DOPO
        .to(afterPanel, { clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power2.inOut' }); // ← reset

      ScrollTrigger.create({
        trigger: '.ba-container',
        start: 'top 80%',
        onEnter: () => baLoop.play(),
        onLeaveBack: () => { baLoop.pause(0); gsap.set(afterPanel, { clipPath: 'inset(0 100% 0 0)' }); }
      });
    }
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
