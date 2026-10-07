/* =====================================================================
   MyCrystalScore — client agreement flow (agreement.html)
   Order required by law: federal statement → Texas disclosure → contract.
   ===================================================================== */
(function () {
  'use strict';

  var C = window.MCS_CONFIG || {};
  var M = window.MCS;
  var D = window.MCSDocs;
  var app = document.getElementById('agreement-app');
  if (!app || !M || !D) return;

  var A = C.agreement || {};
  var S = A.surety || {};
  var P = C.prices || {};
  var qs = new URLSearchParams(location.search);
  var preview = qs.get('preview') === '1';
  var lang = M.lang;

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function blank(v) { return v == null || !String(v).trim(); }
  function missingMark(label) { return '<mark class="missing">[' + esc(label) + ']</mark>'; }
  function val(v, label) { return blank(v) ? missingMark(label) : esc(v); }
  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function money(n) {
    n = Number(n);
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function $(sel, ctx) { return (ctx || app).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || app).querySelectorAll(sel)); }

  /* ---------- Required settings ---------- */
  var missing = [];
  function need(v, label) { if (blank(v)) missing.push(label); }
  need(A.legalEntity, 'agreement.legalEntity');
  need(A.businessAddress, 'agreement.businessAddress');
  need(A.registeredAgentName, 'agreement.registeredAgentName');
  need(A.registeredAgentAddress, 'agreement.registeredAgentAddress');
  need(C.txCsoRegistration, 'txCsoRegistration');
  need(P.session, 'prices.session');
  if ((S.type || 'bond') === 'account') {
    need(S.depository, 'agreement.surety.depository'); need(S.depositoryAddress, 'agreement.surety.depositoryAddress');
    need(S.trustee, 'agreement.surety.trustee'); need(S.accountNumber, 'agreement.surety.accountNumber');
  } else {
    need(S.company, 'agreement.surety.company'); need(S.companyAddress, 'agreement.surety.companyAddress');
    need(S.bondNumber, 'agreement.surety.bondNumber');
  }
  if (!C.webhookUrl && !(C.supabaseUrl && C.supabaseAnonKey)) missing.push('webhookUrl / supabaseUrl + supabaseAnonKey');

  if (missing.length && !preview) {
    $('[data-unavailable]').hidden = false;
    $('[data-missing-list]').textContent = missing.join(', ');
    $('[data-flow]').hidden = true;
    return;
  }
  if (preview) {
    var pb = $('[data-preview-banner]');
    pb.hidden = false;
    if (missing.length) $('[data-missing-preview]').textContent = missing.join(', ');
    else $('[data-missing-preview-wrap]').hidden = true;
  }

  /* ---------- Dates: business days exclude weekends and federal holidays ---------- */
  var DAY = 864e5;
  function ymdToUTC(s) { var p = s.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  function utcToYMD(d) { return d.toISOString().slice(0, 10); }
  function todayCT() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }
  function holidays(y) {
    var Dt = function (m, d) { return new Date(Date.UTC(y, m, d)); };
    var nth = function (m, wd, n) { var f = Dt(m, 1); return Dt(m, 1 + ((wd - f.getUTCDay() + 7) % 7) + 7 * (n - 1)); };
    var last = function (m, wd) { var e = Dt(m + 1, 0); return Dt(m, e.getUTCDate() - ((e.getUTCDay() - wd + 7) % 7)); };
    var obs = function (d) { var w = d.getUTCDay(); return w === 6 ? new Date(d - DAY) : w === 0 ? new Date(+d + DAY) : d; };
    return [obs(Dt(0, 1)), nth(0, 1, 3), nth(1, 1, 3), last(4, 1), obs(Dt(5, 19)), obs(Dt(6, 4)),
      nth(8, 1, 1), nth(9, 1, 2), obs(Dt(10, 11)), nth(10, 4, 4), obs(Dt(11, 25))].map(utcToYMD);
  }
  var holidayCache = {};
  function isHoliday(ymd) {
    var y = Number(ymd.slice(0, 4));
    if (!holidayCache[y]) holidayCache[y] = new Set(holidays(y - 1).concat(holidays(y), holidays(y + 1)));
    return holidayCache[y].has(ymd);
  }
  function isBusinessDay(d) { var w = d.getUTCDay(); return w !== 0 && w !== 6 && !isHoliday(utcToYMD(d)); }
  function addBusinessDays(ymd, n) {
    var d = ymdToUTC(ymd), c = 0;
    while (c < n) { d = new Date(+d + DAY); if (isBusinessDay(d)) c++; }
    return utcToYMD(d);
  }
  function addDays(ymd, n) { return utcToYMD(new Date(+ymdToUTC(ymd) + n * DAY)); }
  function fmtDate(ymd, l) {
    return new Intl.DateTimeFormat(l === 'en' ? 'en-US' : 'es-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }).format(ymdToUTC(ymd));
  }
  function fmtStamp(iso, l) {
    return new Intl.DateTimeFormat(l === 'en' ? 'en-US' : 'es-US', { timeZone: 'America/Chicago', dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso)) + ' (CT)';
  }

  /* ---------- State ---------- */
  var couplesOn = !blank(P.coupleSession);
  var nSessions = parseInt(P.sessions, 10) || 4;
  var state = { step: 1, signDate: todayCT(), acks: {} };

  function planInfo() {
    var plan = ($('#ag-plan') && $('#ag-plan').value) || 'individual';
    if (plan === 'pareja' && !couplesOn) plan = 'individual';
    var price = Number(plan === 'pareja' ? P.coupleSession : P.session) || 0;
    return { plan: plan, price: price, total: price * nSessions };
  }

  function data() {
    return {
      name: $('#ag-name').value.trim(),
      email: $('#ag-email').value.trim(),
      phone: $('#ag-phone').value.trim(),
      address: $('#ag-address').value.trim(),
      coClient: ($('#ag-coclient') && !$('[data-coclient]').hidden) ? $('#ag-coclient').value.trim() : ''
    };
  }

  function ctxFor(l) {
    var d = data(), p = planInfo();
    var deadlineYMD = addBusinessDays(state.signDate, 3);
    var suretyHtml = (S.type || 'bond') === 'account'
      ? (l === 'en' ? 'Surety account: depository ' : 'Cuenta de garantía: depositario ') + val(S.depository, 'surety.depository') + ', ' + val(S.depositoryAddress, 'surety.depositoryAddress') +
        (l === 'en' ? '; trustee ' : '; fiduciario ') + val(S.trustee, 'surety.trustee') + (l === 'en' ? '; account no. ' : '; cuenta núm. ') + val(S.accountNumber, 'surety.accountNumber') + '.'
      : (l === 'en' ? 'Surety bond issued by ' : 'Fianza emitida por ') + val(S.company, 'surety.company') + ', ' + val(S.companyAddress, 'surety.companyAddress') +
        (l === 'en' ? ', bond no. ' : ', fianza núm. ') + val(S.bondNumber, 'surety.bondNumber') + '.';
    var contactBits = [];
    if (C.phone) contactBits.push(esc(C.phone));
    if (C.email) contactBits.push(esc(C.email));
    var contact = contactBits.length ? contactBits.join(l === 'en' ? ' or ' : ' o ') : (l === 'en' ? 'our office' : 'nuestra oficina');
    return {
      entity: val(A.legalEntity, 'agreement.legalEntity'),
      address: val(A.businessAddress, 'agreement.businessAddress'),
      agentName: val(A.registeredAgentName, 'agreement.registeredAgentName'),
      agentAddress: val(A.registeredAgentAddress, 'agreement.registeredAgentAddress'),
      cso: val(C.txCsoRegistration, 'txCsoRegistration'),
      surety: suretyHtml,
      price: money(p.price), total: money(p.total), sessions: nSessions,
      minutes: esc(A.sessionMinutes || '60'), programDays: esc(A.programDays || '90'), dueDays: esc(A.invoiceDueDays || '7'),
      clientName: d.name ? esc(d.name) : missingMark(l === 'en' ? 'your name' : 'su nombre'),
      clientAddress: d.address ? esc(d.address) : missingMark(l === 'en' ? 'your address' : 'su dirección'),
      clientEmail: esc(d.email), clientPhone: esc(d.phone),
      coClient: d.coClient ? esc(d.coClient) : '',
      date: fmtDate(state.signDate, l),
      deadline: fmtDate(deadlineYMD, l), deadlineEn: fmtDate(deadlineYMD, 'en'),
      earliest: fmtDate(addDays(deadlineYMD, 1), l),
      completeBy: fmtDate(addDays(state.signDate, parseInt(A.programDays, 10) || 90), l),
      contact: contact,
      extraCancel: C.email ? (l === 'en' ? 'You may also send written notice of cancellation by email to ' : 'También puede enviar su aviso de cancelación por escrito al correo ') + esc(C.email) + '.' : '',
      deadlineYMD: deadlineYMD
    };
  }

  /* ---------- Rendering ---------- */
  function render() {
    var l = lang(), ctx = ctxFor(l);
    $('[data-doc="esign"]').innerHTML = D.esign(l, ctx);
    $('[data-doc="federal"]').innerHTML = D.federal(l);
    $('[data-doc="texas"]').innerHTML = D.texas(l, ctx);
    $('[data-doc="contract"]').innerHTML = D.contract(l, ctx);
    $('[data-doc="cancel"]').innerHTML = D.cancelStatements(l);
    $('[data-doc="notices"]').innerHTML = D.notices(l, ctx, 1);
    $all('[data-name-hint]').forEach(function (el) { el.textContent = data().name || '—'; });
    $('[data-deadline-text]').textContent = ctx.deadline;
  }

  function showStep(n, noScroll) {
    state.step = n;
    $all('[data-step]').forEach(function (s) { s.hidden = Number(s.getAttribute('data-step')) !== n; });
    $all('[data-stepper] li').forEach(function (li, i) {
      li.classList.toggle('done', i + 1 < n);
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    render();
    var h = $('[data-step="' + n + '"] h2');
    if (noScroll) return;
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    window.scrollTo({ top: app.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  }

  /* ---------- Validation ---------- */
  var MSG = {
    required: { es: 'Este dato es necesario.', en: 'This field is required.' },
    email: { es: 'Revisa tu correo; parece incompleto.', en: 'Check your email; it looks incomplete.' },
    phone: { es: 'Escribe un teléfono de 10 dígitos.', en: 'Enter a 10-digit phone number.' },
    check: { es: 'Marca esta casilla para continuar.', en: 'Check this box to continue.' },
    name: { es: 'Escribe tu nombre exactamente como en el paso 1.', en: 'Type your name exactly as in step 1.' },
    preview: { es: 'Vista previa: la firma está desactivada hasta completar la configuración.', en: 'Preview: signing is disabled until setup is complete.' },
    failed: { es: 'No pudimos registrar tu firma. Intenta de nuevo o llámanos al ', en: 'We couldn\'t record your signature. Try again or call us at ' }
  };
  function setErr(input, msg) {
    var wrap = input.closest('.field') || input.closest('.consent');
    var p = wrap && wrap.querySelector('.field-error');
    if (msg) {
      if (wrap) wrap.classList.add('invalid');
      if (p) { p.textContent = M.t(msg); p.hidden = false; }
      input.setAttribute('aria-invalid', 'true');
    } else {
      if (wrap) wrap.classList.remove('invalid');
      if (p) { p.hidden = true; p.textContent = ''; }
      input.removeAttribute('aria-invalid');
    }
    return !msg;
  }
  function validateStep(n) {
    var ok = true, first = null;
    var check = function (input, msg) { if (!setErr(input, msg)) { ok = false; first = first || input; } };
    var d = data();
    if (n === 1) {
      check($('#ag-name'), d.name.split(' ').length >= 2 ? null : MSG.required);
      check($('#ag-email'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) ? null : MSG.email);
      check($('#ag-phone'), d.phone.replace(/\D/g, '').length === 10 ? null : MSG.phone);
      check($('#ag-address'), d.address.length > 8 ? null : MSG.required);
      if (!$('[data-coclient]').hidden) check($('#ag-coclient'), d.coClient ? null : MSG.required);
    }
    if (n === 2) {
      check($('#ag-esign'), $('#ag-esign').checked ? null : MSG.check);
      check($('#ag-access'), $('#ag-access').checked ? null : MSG.check);
    }
    if (n === 3) check($('#ag-ack-federal'), norm($('#ag-ack-federal').value) === norm(d.name) ? null : MSG.name);
    if (n === 4) check($('#ag-ack-texas'), norm($('#ag-ack-texas').value) === norm(d.name) ? null : MSG.name);
    if (n === 5) {
      check($('#ag-sign'), norm($('#ag-sign').value) === norm(d.name) ? null : MSG.name);
      check($('#ag-agree'), $('#ag-agree').checked ? null : MSG.check);
    }
    if (first) first.focus();
    return ok;
  }

  /* ---------- Signed package (copy for the client + record) ---------- */
  var PKG_CSS = '.pkg{font-family:Georgia,"Times New Roman",serif;color:#111;line-height:1.5;font-size:12pt;max-width:7.5in;margin:0 auto;padding:.5in 0}' +
    '.pkg h1{font-size:18pt;margin:0 0 4pt}.pkg h2{font-size:15pt;margin:0 0 6pt}.pkg h3{font-size:13pt;margin:10pt 0 6pt}.pkg h4{font-size:12pt;margin:12pt 0 4pt}' +
    '.pkg p,.pkg li{margin:0 0 6pt}.pkg .meta{font-size:10pt;color:#444}.pkg .page{break-before:page;padding-top:12pt}' +
    '.pkg .statutory{border:2px solid #111;padding:8pt 10pt;font-weight:bold;margin:10pt 0}.pkg .notice-form{border:2px dashed #111;padding:10pt;font-weight:bold;margin:8pt 0;break-inside:avoid}' +
    '.pkg .translation{border-top:1px dashed #888;margin-top:8pt;padding-top:6pt;font-size:10.5pt;color:#333;font-weight:normal}' +
    '.pkg .sig{font-style:italic;font-size:14pt;border-bottom:1px solid #111;display:inline-block;min-width:3in;padding:0 4pt}' +
    '.pkg .cut{border-top:1px dashed #666;margin:14pt 0 4pt;padding-top:4pt;font-size:9pt;color:#666}.pkg .form-src{font-size:8pt;color:#666;font-weight:normal}' +
    '.pkg mark.missing{background:#ffe8a3}.pkg .note{font-size:9.5pt;color:#555}';

  function sigLine(l, name, iso, label) {
    return '<p>' + label + '<br><span class="sig">' + esc(name) + '</span><br><span class="meta">' +
      (l === 'en' ? 'Signed electronically on ' : 'Firmado electrónicamente el ') + fmtStamp(iso, l) + '</span></p>';
  }

  function buildPackage(l, signedAt) {
    var ctx = ctxFor(l), d = data();
    var ver = esc(A.version || '1.0');
    var title = l === 'en' ? 'Client Agreement Package' : 'Paquete del acuerdo del cliente';
    var signer = esc(A.companySigner || '') + (A.companySignerTitle ? ', ' + esc(A.companySignerTitle) : '');
    return '<div class="pkg">' +
      '<div class="page"><h1>MyCrystalScore</h1><p class="meta">' + title + ', ' + (l === 'en' ? 'version ' : 'versión ') + ver + '<br>' + esc(d.name) + '</p>' +
      '<h2>' + (l === 'en' ? 'Document 1 of 3' : 'Documento 1 de 3') + '</h2>' + D.federal(l) +
      sigLine(l, state.acks.federal.name, state.acks.federal.at, l === 'en' ? 'I acknowledge that I received this statement before signing any contract:' : 'Acuso recibo de esta declaración antes de firmar cualquier contrato:') + '</div>' +
      '<div class="page"><h2>' + (l === 'en' ? 'Document 2 of 3' : 'Documento 2 de 3') + '</h2>' + D.texas(l, ctx) +
      sigLine(l, state.acks.texas.name, state.acks.texas.at, l === 'en' ? 'I acknowledge that I received this disclosure statement:' : 'Acuso recibo de esta declaración de divulgación:') + '</div>' +
      '<div class="page"><h2>' + (l === 'en' ? 'Document 3 of 3' : 'Documento 3 de 3') + '</h2>' + D.contract(l, ctx) +
      D.cancelStatements(l) +
      sigLine(l, d.name, signedAt, l === 'en' ? 'Client signature:' : 'Firma del cliente:') +
      '<p>' + (l === 'en' ? 'For ' : 'Por ') + ctx.entity + ':<br><span class="sig">' + signer + '</span><br><span class="meta">' + ctx.date + '</span></p>' +
      '<p class="meta">' + (l === 'en' ? 'Electronic consent given: ' : 'Consentimiento electrónico otorgado: ') + fmtStamp(state.acks.esign.at, l) + '</p></div>' +
      '<div class="page"><h2>' + (l === 'en' ? 'Notice of Cancellation (attached)' : 'Aviso de cancelación (adjunto)') + '</h2>' + D.notices(l, ctx, 2) + '</div>' +
      '</div>';
  }

  function standaloneHtml(l, pkg) {
    return '<!doctype html><html lang="' + l + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>MyCrystalScore — ' + (l === 'en' ? 'Signed agreement' : 'Acuerdo firmado') + '</title><style>body{margin:0 16px}' + PKG_CSS + '</style></head><body>' + pkg + '</body></html>';
  }

  async function sha256(text) {
    try {
      var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    } catch (e) { return ''; }
  }

  function send(payload) {
    var jobs = [];
    if (C.webhookUrl) {
      var body = new URLSearchParams();
      Object.keys(payload).forEach(function (k) {
        var v = payload[k];
        body.append(k, v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v));
      });
      jobs.push(fetch(C.webhookUrl, { method: 'POST', body: body }).then(
        function (r) { if (!r.ok) throw new Error('Webhook ' + r.status); return r; },
        function () { return null; } // response hidden by CORS; form POST still delivered
      ));
    }
    if (C.supabaseUrl && C.supabaseAnonKey) {
      jobs.push(fetch(C.supabaseUrl.replace(/\/$/, '') + '/rest/v1/' + (C.supabaseAgreementsTable || 'mcs_agreements'), {
        method: 'POST',
        headers: { apikey: C.supabaseAnonKey, Authorization: 'Bearer ' + C.supabaseAnonKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(payload)
      }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error('Supabase ' + r.status + ': ' + t); }); return r; }));
    }
    return Promise.allSettled(jobs).then(function (res) {
      res.forEach(function (r) { if (r.status === 'rejected') console.error(r.reason); });
      return res.some(function (r) { return r.status === 'fulfilled'; });
    });
  }

  /* ---------- Prefill + wiring ---------- */
  ['name', 'email', 'phone', 'address'].forEach(function (k) {
    var v = qs.get(k); if (v) $('#ag-' + k).value = v;
  });
  var planSel = $('#ag-plan');
  if (!couplesOn) { $('[data-plan-field]').hidden = true; }
  else if (qs.get('plan') === 'pareja') planSel.value = 'pareja';
  function syncCouple() { $('[data-coclient]').hidden = !(couplesOn && planSel.value === 'pareja'); }
  planSel.addEventListener('change', function () { syncCouple(); render(); });
  syncCouple();

  app.addEventListener('click', function (e) {
    var next = e.target.closest('[data-next]');
    var back = e.target.closest('[data-back]');
    if (back) { e.preventDefault(); showStep(state.step - 1); return; }
    if (!next) return;
    e.preventDefault();
    if (!validateStep(state.step)) return;
    var now = new Date().toISOString();
    if (state.step === 2) state.acks.esign = { at: now };
    if (state.step === 3) state.acks.federal = { name: $('#ag-ack-federal').value.trim(), at: now };
    if (state.step === 4) state.acks.texas = { name: $('#ag-ack-texas').value.trim(), at: now };
    showStep(state.step + 1);
  });

  $('#agreement-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (state.step < 5) { // Enter key on earlier steps = Continue
      var nx = $('[data-step="' + state.step + '"] [data-next]');
      if (nx) nx.click();
      return;
    }
    var alertBox = $('[data-alert]');
    alertBox.hidden = true;
    if (!validateStep(5)) return;
    if (preview && missing.length) { alertBox.textContent = M.t(MSG.preview); alertBox.hidden = false; return; }

    var btn = $('[data-sign]');
    btn.disabled = true;
    var l = lang(), signedAt = new Date().toISOString();
    var pkg = buildPackage(l, signedAt);
    var html = standaloneHtml(l, pkg);
    var hash = await sha256(html);
    var d = data(), p = planInfo(), ctx = ctxFor(l);
    var utm = {};
    try { utm = JSON.parse(localStorage.getItem('mcs-utm') || '{}'); } catch (err) {}

    var payload = {
      type: 'agreement',
      full_name: d.name, email: d.email.toLowerCase(), phone: '+1' + d.phone.replace(/\D/g, '').slice(-10), address: d.address,
      plan: p.plan, co_client_name: d.coClient, lang: l,
      esign_consent_at: state.acks.esign.at,
      federal_ack_name: state.acks.federal.name, federal_ack_at: state.acks.federal.at,
      texas_ack_name: state.acks.texas.name, texas_ack_at: state.acks.texas.at,
      contract_signed_name: $('#ag-sign').value.trim(), contract_signed_at: signedAt,
      sign_date: state.signDate, cancel_deadline: ctx.deadlineYMD, earliest_session: addDays(ctx.deadlineYMD, 1),
      session_price: p.price, sessions: nSessions, total: p.total,
      agreement_version: A.version || '1.0', doc_sha256: hash, doc_html: html,
      utm: utm, user_agent: navigator.userAgent, page: location.href, source: 'mycrystalscore.com'
    };

    var ok = preview ? true : await send(payload);
    btn.disabled = false;
    if (!ok) {
      alertBox.innerHTML = '';
      alertBox.appendChild(document.createTextNode(M.t(MSG.failed) + (C.phone || '')));
      alertBox.hidden = false;
      return;
    }

    // Done: give the client their copy right away (15 U.S.C. §1679e(c); Tex. Fin. Code §393.203)
    $('[data-flow]').hidden = true;
    var done = $('[data-done]');
    done.hidden = false;
    $('[data-done-deadline]').textContent = ctx.deadline;
    $('[data-done-earliest]').textContent = ctx.earliest;
    $('[data-done-hash]').textContent = hash ? hash.slice(0, 16) + '…' : '';
    var blob = new Blob([html], { type: 'text/html' });
    var a = $('[data-download]');
    a.href = URL.createObjectURL(blob);
    var last = (d.name.split(' ').pop() || 'cliente').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w-]/g, '');
    a.download = 'MyCrystalScore-' + (l === 'en' ? 'Agreement' : 'Acuerdo') + '-' + last + '-' + state.signDate + '.html';
    var pr = document.getElementById('print-root');
    pr.innerHTML = '<style>' + PKG_CSS + '</style>' + pkg;
    done.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $('[data-print]').addEventListener('click', function () { window.print(); });

  // Phone formatting
  var ph = $('#ag-phone');
  ph.addEventListener('input', function () {
    var d = ph.value.replace(/\D/g, '');
    if (d.length === 11 && d[0] === '1') d = d.slice(1);
    d = d.slice(0, 10);
    ph.value = d.length > 6 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6) : d.length > 3 ? '(' + d.slice(0, 3) + ') ' + d.slice(3) : d.length ? '(' + d : '';
  });

  document.addEventListener('mcs:lang', render);
  $('[data-flow]').hidden = false;
  showStep(1, true);
})();
