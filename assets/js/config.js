/* =====================================================================
   MyCrystalScore — site settings
   This is the ONLY file you need to edit for prices, links, contact info,
   and where the sign-up form sends leads. Empty "" = that item is hidden.
   ===================================================================== */
window.MCS_CONFIG = {
  brand: "MyCrystalScore",
  legalName: "My Crystal Score",        // shown in the footer and legal page
  defaultLang: "es",                    // "es" or "en" — what first-time visitors see
  phone: "(832) 808-6483",
  email: "",                            // e.g. "hola@mycrystalscore.com"

  // Coaching program pricing (USD). ONE invoice for the whole program, sent AFTER the final session.
  // If a program ends early, the client owes (program ÷ sessions) for each session already delivered.
  prices: {
    program: "1200",                    // individual program total
    sessions: "4",                      // sessions in the program
    coupleProgram: ""                   // couples program total — e.g. "1800" shows a Couples card; "" hides it
  },

  // Optional "Log in" button (e.g. a client portal). Empty = hidden.
  portalUrl: "",

  // Where sign-up form leads and signed agreements are sent — fill in at least ONE of these
  web3formsKey: "",                      // Web3Forms access key (free at web3forms.com) — emails each submission to you
  webhookUrl: "",                        // n8n webhook, e.g. "https://starlingagent.app.n8n.cloud/webhook/mcs-lead"
  supabaseUrl: "",                       // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey: "",                   // the public "anon" key (safe with the insert-only policy in supabase-mcs-leads.sql)
  supabaseTable: "mcs_leads",

  // Texas Credit Services Organization registration number (Texas Secretary of State)
  txCsoRegistration: "",

  // "Is your goal a home?" band links here. Empty = that band is hidden.
  realEstateUrl: "https://jasonaguirregroup.company",

  // ===================================================================
  // CLIENT AGREEMENT (agreement.html)
  // Every field marked REQUIRED must be filled in, along with
  // txCsoRegistration above and a form destination (webhookUrl or Supabase),
  // or the agreement page will not let anyone sign.
  // Preview it anytime at /agreement.html?preview=1 (signing disabled).
  // ===================================================================
  agreement: {
    version: "1.1 (2026-10-08)",
    legalEntity: "",                    // REQUIRED — exact legal name, e.g. "My Crystal Score LLC"
    businessAddress: "",                // REQUIRED — principal place of business: street, city, TX ZIP
    registeredAgentName: "",            // REQUIRED — Texas agent for service of process
    registeredAgentAddress: "",         // REQUIRED — agent's Texas street address
    companySigner: "Jason Aguirre",     // who signs for the company
    companySignerTitle: "",             // e.g. "Propietario / Owner"
    surety: {
      type: "bond",                     // "bond" (surety bond) or "account" (surety account)
      company: "",                      // REQUIRED if bond — surety company name
      companyAddress: "",               // REQUIRED if bond — surety company address
      bondNumber: "",                   // REQUIRED if bond
      depository: "",                   // REQUIRED if account — bank name
      depositoryAddress: "",            // REQUIRED if account
      trustee: "",                      // REQUIRED if account
      accountNumber: ""                 // REQUIRED if account
    },
    sessionMinutes: "60",               // approximate length of each session
    programDays: "90",                  // all services completed within this many days of signing (Texas max 180)
    invoiceDueDays: "7"                 // invoice due this many days after it is sent (after the final session)
  },
  supabaseAgreementsTable: "mcs_agreements"
};
