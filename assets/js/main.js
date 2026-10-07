/* =====================================================================
   MyCrystalScore — shared behavior
   ===================================================================== */
(function () {
  'use strict';

  var C = window.MCS_CONFIG || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  function lang() { return root.getAttribute('data-lang') === 'en' ? 'en' : 'es'; }
  function t(obj) { return obj ? (obj[lang()] != null ? obj[lang()] : obj.es) : ''; }

  function applyLangAttrs() {
    var l = lang();
    document.querySelectorAll('[data-es]').forEach(function (el) {
      var v = el.getAttribute('data-' + l);
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-ph-es]').forEach(function (el) {
      el.placeholder = el.getAttribute('data-ph-' + l) || '';
    });
    document.querySelectorAll('[data-aria-es]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + l));
    });
    var title = document.querySelector('meta[name="mcs-title-' + l + '"]');
    if (title) document.title = title.content;
  }

  function setLang(l) {
    l = l === 'en' ? 'en' : 'es';
    root.setAttribute('data-lang', l);
    root.lang = l;
    try { localStorage.setItem('mcs-lang', l); } catch (e) {}
    applyLangAttrs();
    document.dispatchEvent(new CustomEvent('mcs:lang', { detail: l }));
  }

  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(lang() === 'es' ? 'en' : 'es'); });
  });
  applyLangAttrs();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Settings from config.js ---------- */
  var digits = function (s) { return String(s || '').replace(/\D/g, '').slice(-10); };

  // Pricing: per-session price × number of sessions = program total
  var P = C.prices || {};
  var nSessions = parseInt(P.sessions, 10) || 4;
  var money = function (v) {
    var n = Number(v);
    return isFinite(n) ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : String(v);
  };
  var priceValues = {
    session: P.session ? money(P.session) : '',
    sessions: String(nSessions),
    total: P.session ? money(Number(P.session) * nSessions) : '',
    coupleSession: P.coupleSession ? money(P.coupleSession) : '',
    coupleTotal: P.coupleSession ? money(Number(P.coupleSession) * nSessions) : ''
  };
  document.querySelectorAll('[data-price]').forEach(function (el) {
    var v = priceValues[el.getAttribute('data-price')];
    if (v) el.textContent = v;
  });
  // Couples offer only appears when a couples price is set
  document.querySelectorAll('[data-couples]').forEach(function (el) { el.hidden = !P.coupleSession; });
  document.querySelectorAll('option[data-couples-option]').forEach(function (opt) { if (!P.coupleSession) opt.remove(); });

  document.querySelectorAll('[data-portal]').forEach(function (el) {
    if (C.portalUrl) { el.href = C.portalUrl; el.hidden = false; }
  });
  document.querySelectorAll('[data-phone]').forEach(function (el) {
    if (C.phone) {
      el.textContent = C.phone;
      if (el.tagName === 'A') el.href = 'tel:+1' + digits(C.phone);
    } else {
      (el.closest('[data-contact]') || el).hidden = true;
    }
  });
  document.querySelectorAll('[data-email]').forEach(function (el) {
    if (C.email) {
      el.textContent = C.email;
      if (el.tagName === 'A') el.href = 'mailto:' + C.email;
    } else {
      (el.closest('[data-contact]') || el).hidden = true;
    }
  });
  document.querySelectorAll('[data-cso]').forEach(function (el) {
    if (C.txCsoRegistration) {
      el.querySelectorAll('[data-cso-num]').forEach(function (n) { n.textContent = C.txCsoRegistration; });
      el.hidden = false;
    }
  });
  document.querySelectorAll('[data-realestate]').forEach(function (el) {
    if (C.realEstateUrl) {
      el.querySelectorAll('[data-realestate-link]').forEach(function (a) { a.href = C.realEstateUrl; });
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });
  document.querySelectorAll('[data-legal-name]').forEach(function (el) { el.textContent = C.legalName || C.brand || 'MyCrystalScore'; });
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Remember ad tracking (TikTok, Facebook, Google) for the sign-up form ---------- */
  try {
    var qs = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ttclid', 'fbclid', 'gclid'];
    var found = {};
    keys.forEach(function (k) { var v = qs.get(k); if (v) found[k] = v; });
    if (Object.keys(found).length) {
      found.landing_page = location.pathname;
      localStorage.setItem('mcs-utm', JSON.stringify(found));
    }
  } catch (e) {}

  /* ---------- The crystal ----------
     A cut-gem drawing whose "clarity" (0–1) follows the credit score:
     cloudy and grey near 300, clear and iridescent near 850. */
  var FACETS = [
    { p: '15,95 65,40 85,95', s: .28 },
    { p: '65,40 120,40 85,95', s: .06 },
    { p: '120,40 155,95 85,95', s: .4 },
    { p: '120,40 175,40 155,95', s: .14 },
    { p: '175,40 225,95 155,95', s: -.16 },
    { p: '15,95 85,95 120,250', s: .18 },
    { p: '85,95 155,95 120,250', s: .44 },
    { p: '155,95 225,95 120,250', s: -.24 }
  ];
  var OUTLINE = '65,40 175,40 225,95 120,250 15,95';
  function star(x, y, r) {
    return 'M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y +
      'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y +
      'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z';
  }
  var gemCount = 0;

  function createGem(host) {
    var id = 'mcsgem' + (++gemCount);
    var facets = FACETS.map(function (f) {
      return '<polygon points="' + f.p + '" fill="url(#' + id + '-iri)"/>' +
        '<polygon points="' + f.p + '" fill="' + (f.s > 0 ? '#fff' : '#1D1838') + '" fill-opacity="' + Math.abs(f.s) + '"/>';
    }).join('');
    var edges = FACETS.map(function (f) { return '<polygon points="' + f.p + '"/>'; }).join('');

    host.innerHTML =
      '<svg viewBox="0 0 240 270" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<linearGradient id="' + id + '-iri" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#7FE3E8"/><stop offset=".48" stop-color="#9B8BE0"/><stop offset="1" stop-color="#F2A7C8"/>' +
          '</linearGradient>' +
          '<radialGradient id="' + id + '-glow"><stop offset="0" stop-color="#7FE3E8" stop-opacity=".85"/><stop offset="1" stop-color="#7FE3E8" stop-opacity="0"/></radialGradient>' +
          '<filter id="' + id + '-sat"><feColorMatrix class="gem-sat" type="saturate" values="1"/></filter>' +
          '<filter id="' + id + '-frost" x="-5%" y="-5%" width="110%" height="110%">' +
            '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/>' +
            '<feColorMatrix in="n" type="saturate" values="0" result="g"/>' +
            '<feComponentTransfer in="g" result="g2"><feFuncA type="linear" slope=".4"/></feComponentTransfer>' +
            '<feComposite in="g2" in2="SourceGraphic" operator="in" result="tex"/>' +
            '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="tex"/></feMerge>' +
          '</filter>' +
        '</defs>' +
        '<ellipse class="gem-glow" cx="120" cy="140" rx="135" ry="125" fill="url(#' + id + '-glow)"/>' +
        '<g filter="url(#' + id + '-sat)">' + facets + '</g>' +
        '<polygon class="gem-frost" points="' + OUTLINE + '" fill="#CFCADB" filter="url(#' + id + '-frost)"/>' +
        '<g class="gem-edges" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round">' + edges + '</g>' +
        '<polygon points="' + OUTLINE + '" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-opacity=".9"/>' +
        '<g class="gem-sparkles" fill="#fff">' +
          '<path d="' + star(58, 30, 13) + '"/><path d="' + star(206, 132, 10) + '"/><path d="' + star(150, 182, 7) + '"/>' +
        '</g>' +
      '</svg>';

    var sat = host.querySelector('.gem-sat');
    var frost = host.querySelector('.gem-frost');
    var glow = host.querySelector('.gem-glow');
    var sparkles = host.querySelector('.gem-sparkles');
    var edgesEl = host.querySelector('.gem-edges');

    return {
      set: function (c) {
        c = Math.max(0, Math.min(1, c));
        sat.setAttribute('values', (0.1 + 0.9 * c).toFixed(3));
        frost.style.opacity = ((1 - c) * 0.85).toFixed(3);
        glow.style.opacity = (c * c * 0.6).toFixed(3);
        sparkles.style.opacity = Math.max(0, (c - 0.62) / 0.38).toFixed(3);
        edgesEl.style.opacity = (0.3 + 0.55 * c).toFixed(3);
      }
    };
  }

  // Static gems (decoration) — always fully clear
  document.querySelectorAll('[data-gem-static]').forEach(function (el) {
    createGem(el).set(parseFloat(el.getAttribute('data-gem-static')) || 1);
  });

  /* ---------- Score readouts ---------- */
  var BANDS = [
    { min: 300, es: 'Bajo', en: 'Poor' },
    { min: 580, es: 'Regular', en: 'Fair' },
    { min: 670, es: 'Bueno', en: 'Good' },
    { min: 740, es: 'Muy bueno', en: 'Very good' },
    { min: 800, es: 'Excelente', en: 'Exceptional' }
  ];
  function bandOf(s) { var b = BANDS[0]; BANDS.forEach(function (x) { if (s >= x.min) b = x; }); return b; }
  function clarityOf(s) { return (s - 300) / 550; }

  function makeReadout(name) {
    var host = document.querySelector('[data-gem="' + name + '"]');
    if (!host) return null;
    var gem = createGem(host);
    var num = document.querySelector('[data-score-out="' + name + '"]');
    var bandEl = document.querySelector('[data-band-out="' + name + '"]');
    var meter = document.querySelector('[data-meter="' + name + '"]');
    var current = null, raf = 0;

    function render(s) {
      current = s;
      var r = Math.round(s);
      if (num) num.textContent = r;
      if (bandEl) bandEl.textContent = t(bandOf(r));
      if (meter) meter.style.setProperty('--pos', (clarityOf(s) * 100).toFixed(1) + '%');
      gem.set(clarityOf(s));
    }
    function to(target, dur, onFrame) {
      cancelAnimationFrame(raf);
      var from = current == null ? target : current;
      if (reduceMotion || !dur || Math.abs(from - target) < 0.5) {
        render(target); if (onFrame) onFrame(1); return;
      }
      var t0 = performance.now();
      var step = function (now) {
        var p = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        render(from + (target - from) * e);
        if (onFrame) onFrame(e);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    document.addEventListener('mcs:lang', function () { if (current != null) render(current); });
    return { render: render, to: to };
  }

  /* ---------- Hero: one orchestrated moment, cloudy → clear ---------- */
  var hero = makeReadout('hero');
  if (hero) {
    var start = 548, end = 721;
    var bStart = [538, 548, 531], bEnd = [716, 721, 709];
    var bEls = Array.prototype.slice.call(document.querySelectorAll('[data-bureau]'));
    var setBureaus = function (e) {
      bEls.forEach(function (el, i) { el.textContent = Math.round(bStart[i] + (bEnd[i] - bStart[i]) * e); });
    };
    hero.render(start); setBureaus(0);
    setTimeout(function () { hero.to(end, 2000, setBureaus); }, reduceMotion ? 0 : 500);
  }

  /* ---------- Score simulator (educational estimate) ---------- */
  var simForm = document.querySelector('[data-sim]');
  if (simForm) {
    var sim = makeReadout('sim');
    var $ = function (id) { return document.getElementById(id); };
    var inputs = { pay: $('s-pay'), util: $('s-util'), col: $('s-col'), inq: $('s-inq'), age: $('s-age'), mix: $('s-mix') };
    var outs = { pay: $('o-pay'), util: $('o-util'), col: $('o-col'), inq: $('o-inq'), age: $('o-age') };
    var tipEl = document.querySelector('[data-sim-tip]');

    var TIPS = {
      pay: {
        es: 'Lo que más pesa ahora: los pagos tarde. Desde hoy, todo a tiempo. Activa el pago automático del mínimo para no fallar ni uno.',
        en: 'What weighs most right now: late payments. From today on, pay everything on time. Set up autopay for at least the minimum so you never miss one.'
      },
      col: {
        es: 'Lo que más pesa ahora: las colecciones. Si alguna es inexacta o no es tuya, se puede disputar. Si es correcta, a veces se puede negociar con el acreedor.',
        en: 'What weighs most right now: collections. If one is inaccurate or not yours, it can be disputed. If it is accurate, it can sometimes be negotiated with the creditor.'
      },
      util: {
        es: 'Lo que más pesa ahora: el uso de tus tarjetas. Bájalo a menos del 30% de tu límite, y mejor aún debajo del 10%, antes de la fecha de cierre de tu estado de cuenta.',
        en: 'What weighs most right now: how much of your cards you use. Get it under 30% of your limit, ideally under 10%, before your statement closing date.'
      },
      age: {
        es: 'Lo que más pesa ahora: tu historial es joven. No cierres tus tarjetas más antiguas; el tiempo trabaja a tu favor.',
        en: 'What weighs most right now: your credit history is young. Keep your oldest cards open; time works in your favor.'
      },
      inq: {
        es: 'Lo que más pesa ahora: las solicitudes de crédito recientes. Espera unos meses antes de pedir crédito nuevo; cada consulta pesa menos con el tiempo.',
        en: 'What weighs most right now: recent credit applications. Wait a few months before applying for new credit; each inquiry matters less over time.'
      },
      mix: {
        es: 'Te ayudaría un poco tener una tarjeta y un préstamo a plazos al día. No saques deuda solo por esto.',
        en: 'Having both a card and an installment loan in good standing would help a little. Don\'t take on debt just for this.'
      },
      top: {
        es: 'Vas muy bien. Mantén los pagos a tiempo, el uso de tus tarjetas bajo, y revisa tus reportes por errores.',
        en: 'You\'re in great shape. Keep paying on time, keep card use low, and check your reports for errors.'
      }
    };

    var utilFactor = function (u) {
      if (u <= 10) return 1;
      if (u <= 30) return 1 - (u - 10) / 20 * 0.25;
      if (u <= 50) return 0.75 - (u - 30) / 20 * 0.3;
      if (u <= 75) return 0.45 - (u - 50) / 25 * 0.25;
      return Math.max(0, 0.2 - (u - 75) / 25 * 0.2);
    };

    // Weights follow the general categories FICO publishes:
    // payment history 35%, amounts owed 30%, length of history 15%, new credit 10%, credit mix 10%.
    var W = { pay: 0.35, util: 0.30, age: 0.15, inq: 0.10, mix: 0.10 };

    var compute = function () {
      var v = {
        pay: +inputs.pay.value, util: +inputs.util.value, col: +inputs.col.value,
        inq: +inputs.inq.value, age: +inputs.age.value, mix: inputs.mix.checked
      };
      var payBase = Math.pow((v.pay - 80) / 20, 1.3);
      var f = {
        pay: Math.max(0, payBase - 0.18 * v.col),
        util: utilFactor(v.util),
        age: Math.pow(Math.min(v.age / 12, 1), 0.7),
        inq: Math.max(0, 1 - v.inq * 0.12),
        mix: v.mix ? 0.9 : 0.5
      };
      var sum = 0;
      Object.keys(W).forEach(function (k) { sum += W[k] * f[k]; });
      var gaps = {
        pay: W.pay * (1 - payBase),
        col: W.pay * Math.min(payBase, 0.18 * v.col),
        util: W.util * (1 - f.util),
        age: W.age * (1 - f.age),
        inq: W.inq * (1 - f.inq),
        mix: W.mix * (1 - f.mix)
      };
      var key = 'top', max = 0.02;
      Object.keys(gaps).forEach(function (k) { if (gaps[k] > max) { max = gaps[k]; key = k; } });
      return { v: v, score: Math.round(300 + 550 * sum), key: key };
    };

    var years = function (n) {
      if (lang() === 'es') return n + (n === 1 ? ' año' : ' años');
      return n + (n === 1 ? ' year' : ' years');
    };

    var paint = function (v) {
      outs.pay.textContent = v.pay + '%';
      outs.util.textContent = v.util + '%';
      outs.col.textContent = v.col;
      outs.inq.textContent = v.inq;
      outs.age.textContent = years(v.age);
      Object.keys(inputs).forEach(function (k) {
        var i = inputs[k];
        if (i.type === 'range') {
          i.style.setProperty('--fill', ((i.value - i.min) / (i.max - i.min) * 100) + '%');
          if (outs[k]) i.setAttribute('aria-valuetext', outs[k].textContent);
        }
      });
    };

    var first = true;
    var update = function () {
      var r = compute();
      paint(r.v);
      tipEl.textContent = t(TIPS[r.key]);
      sim.to(r.score, first ? 0 : 450);
      first = false;
    };

    simForm.addEventListener('input', update);
    simForm.addEventListener('change', update);
    simForm.addEventListener('submit', function (e) { e.preventDefault(); });
    document.addEventListener('mcs:lang', update);
    update();
  }

  window.MCS = { lang: lang, t: t, setLang: setLang, createGem: createGem };
})();
