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

  // Monthly prices in USD — PLACEHOLDERS, set your real prices before launch
  prices: {
    monitoring: "29.99",
    repair: "99",
    couple: "169"
  },

  // "Log in" button → your client portal (e.g. Credit Repair Cloud client portal URL)
  portalUrl: "",

  // Monitoring enrollment link from your monitoring provider (affiliate link).
  // If empty, the Monitoring plan button goes to the sign-up form instead.
  monitoringUrl: "",

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
