-- =====================================================================
-- MyCrystalScore — lead table for the sign-up form
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- The website can only INSERT rows (never read them), so the public
-- "anon" key in config.js can't be used to pull your leads.
-- =====================================================================

create table if not exists public.mcs_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  first_name    text not null,
  last_name     text not null,
  phone         text not null,
  email         text not null,
  goal          text,
  timeline      text,
  plan          text,
  heard_from    text,
  lang          text,
  sms_consent   boolean not null default false,
  consent_text  text,
  utm           jsonb not null default '{}'::jsonb,
  page          text,
  referrer      text,
  user_agent    text,
  submitted_at  timestamptz,
  source        text,
  type          text,
  status        text not null default 'new'
);

alter table public.mcs_leads enable row level security;

-- Website visitors may add a lead, nothing else
drop policy if exists "website can insert leads" on public.mcs_leads;
create policy "website can insert leads"
  on public.mcs_leads for insert
  to anon
  with check (
    char_length(first_name) between 1 and 80
    and char_length(last_name) between 1 and 80
    and phone ~ '^\+1[0-9]{10}$'
    and char_length(email) between 5 and 200
  );

grant insert on public.mcs_leads to anon;
revoke select, update, delete on public.mcs_leads from anon;

create index if not exists mcs_leads_created_at_idx on public.mcs_leads (created_at desc);

-- Self-check: should return rls_enabled = true and one insert policy
select relrowsecurity as rls_enabled,
       (select count(*) from pg_policies where tablename = 'mcs_leads' and cmd = 'INSERT') as insert_policies
from pg_class where relname = 'mcs_leads';


-- =====================================================================
-- Signed client agreements (agreement.html)
-- Keep at least 2 years (15 U.S.C. §1679c(c); Tex. Fin. Code §393.106).
-- Insert-only for the website; read them from the Supabase dashboard.
-- =====================================================================
create table if not exists public.mcs_agreements (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  type                  text,
  full_name             text not null,
  email                 text not null,
  phone                 text not null,
  address               text not null,
  plan                  text,
  co_client_name        text,
  lang                  text,
  esign_consent_at      timestamptz not null,
  federal_ack_name      text not null,
  federal_ack_at        timestamptz not null,
  texas_ack_name        text not null,
  texas_ack_at          timestamptz not null,
  contract_signed_name  text not null,
  contract_signed_at    timestamptz not null,
  sign_date             date not null,
  cancel_deadline       date not null,
  earliest_session      date not null,
  session_price         numeric not null,
  sessions              int not null,
  total                 numeric not null,
  agreement_version     text not null,
  doc_sha256            text,
  doc_html              text not null,
  utm                   jsonb not null default '{}'::jsonb,
  user_agent            text,
  page                  text,
  source                text,
  canceled_at           timestamptz
);

alter table public.mcs_agreements enable row level security;

drop policy if exists "website can insert agreements" on public.mcs_agreements;
create policy "website can insert agreements"
  on public.mcs_agreements for insert
  to anon
  with check (
    char_length(full_name) between 3 and 120
    and contract_signed_at >= federal_ack_at
    and federal_ack_at >= esign_consent_at
    and char_length(doc_html) > 1000
  );

grant insert on public.mcs_agreements to anon;
revoke select, update, delete on public.mcs_agreements from anon;
create index if not exists mcs_agreements_created_at_idx on public.mcs_agreements (created_at desc);
