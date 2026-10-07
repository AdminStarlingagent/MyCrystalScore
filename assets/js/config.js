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

  // Coaching program pricing (USD). Each session is invoiced AFTER it is delivered.
  // The site shows the per-session price and the program total (session × sessions).
  prices: {
    session: "300",                     // individual, per session
    sessions: "4",                      // sessions in the program
    coupleSession: ""                   // per session for couples — e.g. "450" to show a Couples card; "" hides it
  },

  // Optional "Log in" button (e.g. a client portal). Empty = hidden.
  portalUrl: "",

  // Where sign-up form leads are sent — fill in at least ONE of these
  webhookUrl: "",                        // n8n webhook, e.g. "https://starlingagent.app.n8n.cloud/webhook/mcs-lead"
  supabaseUrl: "",                       // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey: "",                   // the public "anon" key (safe with the insert-only policy in supabase-mcs-leads.sql)
  supabaseTable: "mcs_leads",

  // Texas Credit Services Organization registration number (Texas Secretary of State)
  txCsoRegistration: "",

  // "Is your goal a home?" band links here. Empty = that band is hidden.
  realEstateUrl: "https://jasonaguirregroup.company"
};
