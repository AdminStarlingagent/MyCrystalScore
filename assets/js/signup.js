/* =====================================================================
   MyCrystalScore — sign-up form
   Sends each lead to the n8n webhook and/or Supabase set in config.js.
   ===================================================================== */
(function () {
  'use strict';

  var C = window.MCS_CONFIG || {};
  var M = window.MCS;
  var form = document.getElementById('signup');
  if (!form || !M) return;

  var alertBox = form.querySelector('[data-form-alert]');
  var submitBtn = form.querySelector('[data-submit]');
  var success = document.querySelector('[data-success]');

  var MSG = {
    required: { es: 'Este dato es necesario.', en: 'This field is required.' },
    phone: { es: 'Escribe un teléfono de 10 dígitos.', en: 'Enter a 10-digit phone number.' },
    email: { es: 'Revisa tu correo; parece incompleto.', en: 'Check your email; it looks incomplete.' },
    goal: { es: 'Elige una opción.', en: 'Choose an option.' },
    sending: { es: 'Enviando…', en: 'Sending…' },
    notConnected: {
      es: 'Este formulario todavía no está conectado. Por favor llámanos al ',
      en: 'This form isn\'t connected yet. Please call us at '
    },
    failed: {
      es: 'No pudimos enviar tu solicitud. Intenta de nuevo o llámanos al ',
      en: 'We couldn\'t send your request. Try again or call us at '
    },
    successTitle: { es: '¡Listo, {name}!', en: 'You\'re all set, {name}!' },
    successBody: {
      es: 'Recibimos tu solicitud. Te vamos a llamar al {phone} para empezar.',
      en: 'We got your request. We\'ll call you at {phone} to get started.'
    }
  };

  /* ---------- Pre-select plan from ?plan= ---------- */
  var qs = new URLSearchParams(location.search);
  var planParam = qs.get('plan');
  if (planParam && form.plan) {
    Array.prototype.forEach.call(form.plan.options, function (o) { if (o.value === planParam) form.plan.value = planParam; });
  }

  /* ---------- Phone formatting: (832) 555-0123 ---------- */
  var phone = form.phone;
  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    d = d.slice(0, 10);
    var out = d;
    if (d.length > 6) out = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
    else if (d.length > 3) out = '(' + d.slice(0, 3) + ') ' + d.slice(3);
    else if (d.length > 0) out = '(' + d;
    phone.value = out;
  });

  /* ---------- Validation ---------- */
  function setError(name, msgObj) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (!wrap) return;
    var p = wrap.querySelector('.field-error');
    if (msgObj) {
      wrap.classList.add('invalid');
      p.textContent = M.t(msgObj);
      p.hidden = false;
      p.setAttribute('data-es', msgObj.es);
      p.setAttribute('data-en', msgObj.en);
      var input = wrap.querySelector('input, select');
      if (input) input.setAttribute('aria-invalid', 'true');
    } else {
      wrap.classList.remove('invalid');
      p.hidden = true;
      p.textContent = '';
      p.removeAttribute('data-es'); p.removeAttribute('data-en');
      var i2 = wrap.querySelector('input, select');
      if (i2) i2.removeAttribute('aria-invalid');
    }
  }

  var RULES = {
    first_name: function () { return form.first_name.value.trim().length > 0 ? null : MSG.required; },
    last_name: function () { return form.last_name.value.trim().length > 0 ? null : MSG.required; },
    phone: function () { return form.phone.value.replace(/\D/g, '').length === 10 ? null : MSG.phone; },
    email: function () { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()) ? null : MSG.email; },
    goal: function () { return form.querySelector('input[name="goal"]:checked') ? null : MSG.goal; }
  };

  function validate() {
    var firstBad = null;
    Object.keys(RULES).forEach(function (name) {
      var err = RULES[name]();
      setError(name, err);
      if (err && !firstBad) firstBad = form.querySelector('[data-field="' + name + '"] input');
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Once a field has shown an error, clear it as soon as the person fixes it
  // (on input, not blur, so the layout never shifts under a click)
  ['first_name', 'last_name', 'phone', 'email'].forEach(function (n) {
    form[n].addEventListener('input', function () {
      var wrap = form.querySelector('[data-field="' + n + '"]');
      if (wrap.classList.contains('invalid') && !RULES[n]()) setError(n, null);
    });
  });
  form.addEventListener('change', function (e) {
    if (e.target.name === 'goal') setError('goal', null);
  });

  /* ---------- Submit ---------- */
  function contactLink() {
    if (!C.phone) return '';
    return '<a href="tel:+1' + C.phone.replace(/\D/g, '').slice(-10) + '">' + C.phone + '</a>.';
  }
  function showAlert(msgObj) {
    alertBox.innerHTML = '';
    alertBox.appendChild(document.createTextNode(M.t(msgObj)));
    if (C.phone) alertBox.insertAdjacentHTML('beforeend', contactLink());
    alertBox.hidden = false;
  }

  function payload() {
    var l = M.lang();
    var consentEl = form.querySelector('[data-consent-text][lang="' + l + '"]');
    var utm = {};
    try { utm = JSON.parse(localStorage.getItem('mcs-utm') || '{}'); } catch (e) {}
    qs.forEach(function (v, k) { if (/^(utm_|ttclid|fbclid|gclid)/.test(k)) utm[k] = v; });
    var digits = form.phone.value.replace(/\D/g, '');
    return {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      phone: '+1' + digits,
      email: form.email.value.trim().toLowerCase(),
      goal: (form.querySelector('input[name="goal"]:checked') || {}).value || '',
      timeline: form.timeline.value,
      plan: form.plan.value,
      heard_from: form.heard_from.value,
      lang: l,
      sms_consent: form.sms_consent.checked,
      consent_text: form.sms_consent.checked && consentEl ? consentEl.textContent.trim() : '',
      utm: utm,
      page: location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      submitted_at: new Date().toISOString(),
      source: 'mycrystalscore.com'
    };
  }

  function sendWebhook(data) {
    // Form-encoded keeps this a "simple" request (no CORS preflight), which n8n accepts.
    var body = new URLSearchParams();
    Object.keys(data).forEach(function (k) {
      var v = data[k];
      body.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    });
    return fetch(C.webhookUrl, { method: 'POST', body: body }).then(
      function (res) {
        // Readable response: an inactive n8n workflow returns 404 — treat that as a failure.
        if (!res.ok) throw new Error('Webhook ' + res.status);
        return res;
      },
      function (err) {
        // Response blocked by CORS: a form-encoded POST still reaches n8n, so count it as sent.
        console.warn('MyCrystalScore: webhook response not readable (CORS); request was sent.', err);
        return null;
      }
    );
  }

  function sendSupabase(data) {
    var row = Object.assign({}, data);
    return fetch(C.supabaseUrl.replace(/\/$/, '') + '/rest/v1/' + (C.supabaseTable || 'mcs_leads'), {
      method: 'POST',
      headers: {
        'apikey': C.supabaseAnonKey,
        'Authorization': 'Bearer ' + C.supabaseAnonKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (txt) { throw new Error('Supabase ' + res.status + ': ' + txt); });
      return res;
    });
  }

  function showSuccess(data) {
    var name = data.first_name;
    var shownPhone = form.phone.value;
    var titleEl = success.querySelector('[data-success-title]');
    var bodyEl = success.querySelector('[data-success-body]');
    var fill = function () {
      titleEl.textContent = M.t(MSG.successTitle).replace('{name}', name);
      bodyEl.textContent = M.t(MSG.successBody).replace('{phone}', shownPhone);
    };
    fill();
    document.addEventListener('mcs:lang', fill);
    form.hidden = true;
    success.hidden = false;
    var g = success.querySelector('[data-gem-static]');
    if (g && M.createGem && !g.firstChild) M.createGem(g).set(1);
    success.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertBox.hidden = true;
    if (!validate()) return;

    var data = payload();

    // Bots fill the hidden field; pretend it worked and send nothing.
    if (form.company.value) { showSuccess(data); return; }

    var jobs = [];
    if (C.webhookUrl) jobs.push(sendWebhook(data));
    if (C.supabaseUrl && C.supabaseAnonKey) jobs.push(sendSupabase(data));

    if (!jobs.length) {
      console.error('MyCrystalScore: no webhookUrl or Supabase settings in assets/js/config.js — lead was NOT saved.', data);
      showAlert(MSG.notConnected);
      return;
    }

    var label = submitBtn.querySelector('span');
    submitBtn.disabled = true;
    label.textContent = M.t(MSG.sending);

    Promise.allSettled(jobs).then(function (results) {
      var anyOk = results.some(function (r) { return r.status === 'fulfilled'; });
      results.forEach(function (r) { if (r.status === 'rejected') console.error(r.reason); });
      submitBtn.disabled = false;
      label.textContent = label.getAttribute('data-' + M.lang());
      if (anyOk) {
        if (window.ttq && ttq.track) { try { ttq.track('SubmitForm'); } catch (err) {} }
        if (window.fbq) { try { fbq('track', 'Lead'); } catch (err) {} }
        showSuccess(data);
      } else {
        showAlert(MSG.failed);
      }
    });
  });

  // Re-translate visible errors when the language changes
  document.addEventListener('mcs:lang', function () {
    if (!alertBox.hidden) alertBox.hidden = true;
  });
})();
