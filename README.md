# MyCrystalScore — website

Static site (HTML/CSS/JS, no build step) for **mycrystalscore.com**, built for GitHub Pages.
Spanish by default with an English toggle (top right). All settings live in one file: `assets/js/config.js`.

```
index.html               Home: hero, how it works, score simulator, plans, FAQ
signup.html              Lead form (no SSN/ITIN collected)
legal.html               Privacy, terms, credit rights (draft — attorney review)
404.html                 Not-found page
assets/js/config.js      ← EDIT THIS: prices, phone, portal link, form destinations
assets/js/main.js        Language toggle, crystal graphic, simulator
assets/js/signup.js      Form validation + sending
assets/css/styles.css    All styles
assets/img/              Logo + favicon
supabase-mcs-leads.sql   Optional lead table (run in Supabase SQL editor)
```

---

## 1. Edit `assets/js/config.js`

| Setting | What it does |
|---|---|
| `prices` | Monthly prices on the Plans section. **Placeholders — set yours.** |
| `phone`, `email` | Shown in the FAQ, footer, and sign-up page. Empty = hidden. |
| `portalUrl` | "Log in" button → your client portal (e.g. Credit Repair Cloud). Empty = hidden. |
| `monitoringUrl` | Your monitoring provider's enrollment/affiliate link. Empty = Monitoring plan goes to the form. |
| `webhookUrl` | n8n webhook that receives each lead (see step 4). |
| `supabaseUrl`, `supabaseAnonKey` | Optional second copy of every lead in Supabase. |
| `txCsoRegistration` | Your Texas Credit Services Organization registration number → shown in the footer. |
| `realEstateUrl` | The "Is your goal a home?" band links here. Empty = band hidden. |

**At least one of `webhookUrl` or Supabase must be filled in**, or the form shows "not connected yet — call us" instead of saving the lead.

---

## 2. Put it on GitHub Pages

1. Create a new **public** repo, e.g. `AdminStarlingagent/mycrystalscore`.
2. Upload everything in this folder to the repo root (including the hidden `.nojekyll` file).
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. In a minute or two the site is live at `https://adminstarlingagent.github.io/mycrystalscore/` — check it there first.
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

## 5. Before you launch

- [ ] Real prices in `config.js`, and the plan features in `index.html` match what you actually deliver.
- [ ] Texas Credit Services Organization registration + bond on file with the Texas Secretary of State; number added to `txCsoRegistration`.
- [ ] Billing matches the site: no credit-repair fees collected before the work is performed (CROA), written contract, 3-business-day cancellation.
- [ ] `legal.html` reviewed by an attorney.
- [ ] Monitoring provider link (`monitoringUrl`) and client portal link (`portalUrl`) set.
- [ ] Testimonials: only add real ones, with the client's written permission.
- [ ] Submit a test lead and confirm it lands in FUB (and Supabase if used).
