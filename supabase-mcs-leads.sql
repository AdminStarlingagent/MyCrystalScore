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
