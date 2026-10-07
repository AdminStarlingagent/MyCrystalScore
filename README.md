# MyCrystalScore — website

Static site (HTML/CSS/JS, no build step) for **mycrystalscore.com** — credit coaching (4 sessions, each billed after it's delivered), built for GitHub Pages.
Spanish by default with an English toggle (top right). All settings live in one file: `assets/js/config.js`.

```
index.html               Home: hero, the 4 sessions, score simulator, pricing, FAQ
signup.html              Lead form (no SSN/ITIN collected)
agreement.html           Client agreement: disclosures, e-sign, contract, cancellation forms
legal.html               Privacy, terms, credit rights (draft — attorney review)
404.html                 Not-found page
assets/js/config.js      ← EDIT THIS: session price, phone, form destinations
assets/js/main.js        Language toggle, crystal graphic, simulator
assets/js/signup.js      Form validation + sending
assets/js/agreement*.js  Agreement flow + legal texts (statutory text is verbatim — don't edit)
assets/css/styles.css    All styles
assets/img/              Logo + favicon
supabase-mcs-leads.sql   Optional lead + signed-agreement tables (run in Supabase SQL editor)
```

---

## 1. Edit `assets/js/config.js`

| Setting | What it does |
|---|---|
| `prices.session` | Price per coaching session (default `300`). |
| `prices.sessions` | Sessions in the program (default `4`). The site shows the total automatically ($1,200). |
| `prices.coupleSession` | Per-session price for couples, e.g. `450`. Empty = the Couples card is hidden. |
| `phone`, `email` | Shown in the FAQ, footer, and sign-up page. Empty = hidden. |
| `portalUrl` | Optional "Log in" button. Empty = hidden. |
| `webhookUrl` | n8n webhook that receives each lead (see step 4). |
| `supabaseUrl`, `supabaseAnonKey` | Optional second copy of every lead in Supabase. |
| `txCsoRegistration` | Your Texas Credit Services Organization registration number → shown in the footer. |
| `realEstateUrl` | The "Is your goal a home?" band links here. Empty = band hidden. |

**At least one of `webhookUrl` or Supabase must be filled in**, or the form shows "not connected yet — call us" instead of saving the lead.

---

## 2. Put it on GitHub Pages

1. Repo: **`AdminStarlingagent/MyCrystalScore`** (already created and pushed).
2. To update: upload the changed files to the repo root (drag and drop on GitHub, or push with git).
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. In a minute or two the site is live at `https://adminstarlingagent.github.io/MyCrystalScore/` — check it there first.
5. Same Pages screen → **Custom domain** → type `mycrystalscore.com` → Save. (GitHub creates the `CNAME` file for you.) Then do step 3 below.

---

## 3. Point mycrystalscore.com at GitHub

**Where things stand today:** the domain is registered at Cheapnames, but its nameservers are
`ns1–ns4.a2hosting.com`, so DNS is controlled at **A2 Hosting**, not Cheapnames. Pick one:

**Option A — Move DNS back to Cheapnames (simplest if you're done with A2).**
Cheapnames → DNS → Nameservers → *Change Nameservers* → choose Cheapnames' **default** nameservers.
Then, in the *DNS Records* tab, delete the default "parked" `@` A record and set the records below.

**Option B — Keep A2 Hosting.** Log into A2's cPanel → *Zone Editor* → mycrystalscore.com, remove the old `@` A record and `www` record, and add the records below.

> ⚠️ Before Option A, open A2's zone and copy any **MX, TXT (SPF/DKIM/Google verification), or other records** you still use — especially email on @mycrystalscore.com. Switching nameservers drops everything not re-created at Cheapnames.

| Type | Name/Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA *(optional)* | `@` | `2606:50c0:8000::153` |
| AAAA *(optional)* | `@` | `2606:50c0:8001::153` |
| AAAA *(optional)* | `@` | `2606:50c0:8002::153` |
| AAAA *(optional)* | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `adminstarlingagent.github.io` |

Then:
- **Verify the domain** (prevents domain takeover): GitHub → your profile/org **Settings → Pages → Add a domain** → it gives you a TXT record (`_github-pages-challenge-…`) → add it in the same DNS screen → Verify.
- Back in the repo's Pages settings, wait for the DNS check to turn green, then tick **Enforce HTTPS** (the certificate can take up to a few hours).
- A nameserver change (Option A) can take up to 24–48 hours to spread; plain record changes are usually minutes to an hour.

---

## 4. Getting leads into Follow Up Boss

The form posts these fields: `first_name, last_name, phone (+1XXXXXXXXXX), email, goal, timeline, plan, heard_from, lang, sms_consent, consent_text, utm (JSON text), page, referrer, user_agent, submitted_at, source`.

**n8n (recommended)** — new workflow on starlingagent.app.n8n.cloud:
1. **Webhook** node → Method `POST`, path `mcs-lead`, Respond *Immediately*. Activate the workflow and paste the **production** URL into `webhookUrl`.
2. **HTTP Request** node → `POST https://api.followupboss.com/v1/events`, Basic Auth credential (FUB API key as username, blank password), Body = JSON, field switched to *Expression*:
   ```json
   {
     "source": "MyCrystalScore.com",
     "system": "MyCrystalScore",
     "type": "Registration",
     "message": "Meta: {{$json.body.goal}} | Plazo: {{$json.body.timeline}} | Plan: {{$json.body.plan}} | Idioma: {{$json.body.lang}} | SMS consent: {{$json.body.sms_consent}}",
     "person": {
       "firstName": "{{$json.body.first_name}}",
       "lastName": "{{$json.body.last_name}}",
       "emails": [{ "value": "{{$json.body.email}}" }],
       "phones": [{ "value": "{{$json.body.phone}}" }],
       "tags": ["MyCrystalScore", "{{$json.body.plan}}", "{{$json.body.heard_from}}"]
     }
   }
   ```
   Save `consent_text` + `submitted_at` somewhere permanent (FUB note or Supabase) — that's your TCPA/A2P proof of opt-in.

**Supabase (optional backup copy)** — run `supabase-mcs-leads.sql` in the SQL editor, then fill `supabaseUrl` and the **anon** key. The table is insert-only for the website, so the public key can't read leads. Never put the `service_role` key in this repo.

---

## 5. Billing (QuickBooks)

The business model is **credit coaching, billed after each session** — there are no pay buttons on the site on purpose.

- QuickBooks product: **"Sesión de asesoría de crédito / Credit coaching session"**, $300, service, non-taxable.
- After each session: create an invoice for that client with one line of that product (edit the line description to "Sesión 1 de 4", "Sesión 2 de 4"…) and send it. The client pays from the invoice.
- Deactivate the old reusable payment links in QuickBooks (Sales → Payment links). They all charge up front: $200 monthly plans (2), $1,200 "One Time High…", $1,200 "GOLD PACKAGE", $1,500 and $1,800 "HIGH Repo Evictions Judgements…", $120 "Client Report", $1,200 "Servicios Financieros / Financial Services".

---

## 6. Client agreement (agreement.html)

Clients sign here **before the first session** — and since every session is invoiced after it's delivered, they always sign before they pay.

**Send each client a personal link** (from FUB, SMS, or email) so their info is pre-filled:

```
https://mycrystalscore.com/agreement.html?name=Maria%20Lopez&email=maria@example.com&phone=8325550123
```

What the page does, in the order the law requires:

| Step | What happens | Why |
|---|---|---|
| 1. Tus datos | Name, email, phone, address | Contract parties |
| 2. Firma electrónica | E-SIGN consent + "I can open/print this" | 15 U.S.C. §7001(c) |
| 3. Documento 1 | Federal "Consumer Credit File Rights" statement (verbatim), signed acknowledgment | 15 U.S.C. §1679c — separate document, before any contract |
| 4. Documento 2 | Texas disclosure statement, signed acknowledgment | Tex. Fin. Code §393.105 |
| 5. Documento 3 | Contract + both cancellation statements next to the signature + Notice of Cancellation forms | 15 U.S.C. §§1679d–1679e; Tex. Fin. Code §§393.201–393.202 |
| Done | Download / print a full copy (2 copies of each cancellation form), cancellation deadline, earliest session date | 15 U.S.C. §1679e(c); Tex. Fin. Code §393.203 |

- The cancellation deadline counts **3 business days** (skips weekends and federal holidays) — the later of the federal and Texas deadlines, so both are met. **Don't hold a session before the "earliest session" date** (15 U.S.C. §1679d(a)(2)).
- Every signature is sent to your webhook (with `type=agreement`) and/or the `mcs_agreements` Supabase table, including the full signed document (`doc_html`) and a SHA-256 fingerprint. **Keep these at least 2 years.** In n8n, branch on `type` (`lead` vs `agreement`), email the client a copy, and add a note in FUB. The n8n webhook can also log the client's IP from request headers.
- The page **will not allow signing** until these are filled in `config.js`: `agreement.legalEntity`, `businessAddress`, `registeredAgentName`, `registeredAgentAddress`, `txCsoRegistration`, the surety bond (or surety account) details, and a form destination. Preview it anytime at `/agreement.html?preview=1` (signing disabled) — that's the version to send your attorney.
- Changing the contract later? Bump `agreement.version` so each signed record shows which version the client saw.
- When you invoice in QuickBooks, add a note like *"Sesión 1 de 4 — Acuerdo firmado el 7 de octubre de 2026."*

---

## 7. Before you launch

- [ ] Texas Credit Services Organization registration + bond on file with the Texas Secretary of State; number added to `txCsoRegistration`. (Paid advice about improving credit counts as a CSO under Texas law and federal CROA.)
- [ ] Attorney has reviewed `agreement.html?preview=1` (all three documents and the cancellation forms).
- [ ] $10,000 surety bond (or surety account) in place. Texas only allows billing before *all* services are finished if the CSO is bonded (Tex. Fin. Code §393.302) — per-session billing depends on it.
- [ ] Confirm with Intuit (or a processor that accepts credit-services businesses) that you can take card/ACH payments for this service. Intuit's Acceptable Use Policy lists "Credit Repair, Counseling and Protection Services" as restricted.
- [ ] `legal.html` reviewed by an attorney.
- [ ] Old prepaid QuickBooks payment links deactivated.
- [ ] Testimonials: only add real ones, with the client's written permission.
- [ ] Submit a test lead and confirm it lands in FUB (and Supabase if used).
