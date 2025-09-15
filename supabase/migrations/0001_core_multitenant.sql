-- =========================================================
-- Bizora — Core Multitenant Foundation
-- Supabase / Postgres SQL migration
-- =========================================================

-- 0) SAFE EXTENSIONS ---------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1) ENUMS -------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin','manager','medewerker','externe','lezen');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('trialing','active','past_due','canceled','read_only');
  end if;

  if not exists (select 1 from pg_type where typname = 'invite_status') then
    create type public.invite_status as enum ('pending','accepted','revoked','expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'org_status') then
    create type public.org_status as enum ('setup_required','active','suspended','deleted');
  end if;
end $$;

-- 2) UTIL FUNCTIONS ----------------------------------------------------------
-- 2.1 Reserved subdomains
create or replace function public.is_reserved_subdomain(sub text)
returns boolean
language sql
stable
as $$
  select lower(sub) = any (array[
    'www','api','admin','mail','support','help','status','app','billing','stripe',
    'bizora','static','assets','cdn','img','images','files','vercel'
  ]);
$$;

-- 2.2 Subdomain validatie (regex: 3-32, a-z0-9-, geen begin/eind -)
create or replace function public.is_valid_subdomain(sub text)
returns boolean
language sql
stable
as $$
  select sub ~ '^[a-z0-9](?:[a-z0-9-]{1,30})[a-z0-9]$';
$$;

-- 2.3 Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3) CORE TABLES -------------------------------------------------------------

-- 3.1 Organizations (workspaces)
create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null check (char_length(name) between 2 and 120),
  subdomain text unique not null,
  plan text not null default 'start', -- start|flow|pro|enterprise (string om flexibel te blijven)
  status org_status not null default 'setup_required',
  trial_end date,
  stripe_customer_id text,
  stripe_subscription_id text,
  seat_limit int not null default 1, -- 1/3/10/NULL=unlimited (enterprise)
  timezone text not null default 'Europe/Amsterdam',
  currency text not null default 'EUR',
  locale text not null default 'nl-NL',
  bookyear_start int not null default 1, -- maand 1..12
  accounting_basis text not null default 'accrual', -- 'cash' | 'accrual'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_subdomain_format check (public.is_valid_subdomain(subdomain)),
  constraint organizations_subdomain_reserved check (not public.is_reserved_subdomain(subdomain))
);

create index if not exists idx_organizations_subdomain on public.organizations(subdomain);
create index if not exists idx_organizations_plan on public.organizations(plan);

create trigger trg_organizations_updated
before update on public.organizations
for each row execute function public.set_updated_at();

-- 3.2 Profiles (1:1 met auth.users)
-- Bewaar aanvullende velden die we nodig hebben buiten Supabase auth.
create table if not exists public.profiles (
  id uuid primary key,             -- gelijk aan auth.users.id
  email text not null,
  first_name text,
  last_name text,
  phone text,
  locale text default 'nl-NL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_profiles_email on public.profiles(lower(email));

create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

-- 3.3 Memberships (user ↔ organization met rol)
create table if not exists public.memberships (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role user_role not null default 'medewerker',
  status text not null default 'active', -- active|invited|blocked
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create index if not exists idx_memberships_org on public.memberships(org_id);
create index if not exists idx_memberships_user on public.memberships(user_id);

create trigger trg_memberships_updated
before update on public.memberships
for each row execute function public.set_updated_at();

-- 3.4 Invitations
create table if not exists public.invitations (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role user_role not null default 'medewerker',
  token text not null, -- signed token (single-use)
  expires_at timestamptz not null,
  status invite_status not null default 'pending',
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, lower(email))
);

create index if not exists idx_invitations_org on public.invitations(org_id);
create index if not exists idx_invitations_email on public.invitations(lower(email));

create trigger trg_invitations_updated
before update on public.invitations
for each row execute function public.set_updated_at();

-- 3.5 Subscriptions (Stripe mirror)
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'start',
  status subscription_status not null default 'trialing',
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id)
);

create index if not exists idx_subscriptions_org on public.subscriptions(org_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

create trigger trg_subscriptions_updated
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- 3.6 Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,         -- e.g., 'quote_sent', 'invoice_paid', 'role_changed'
  entity text,                  -- e.g., 'invoice', 'quote', 'membership'
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_org on public.audit_logs(org_id);
create index if not exists idx_audit_action on public.audit_logs(action);
create index if not exists idx_audit_entity on public.audit_logs(entity, entity_id);

-- 3.7 User dashboard settings (widgets, layout)
create table if not exists public.user_dashboard_settings (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create trigger trg_user_dashboard_settings_updated
before update on public.user_dashboard_settings
for each row execute function public.set_updated_at();

-- 3.8 Pre-stripe registrations (voor registratiestap vóór checkout)
create table if not exists public.registrations (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  plan text not null default 'start',
  payload jsonb not null default '{}'::jsonb,  -- volledig formulier (persoonlijk/bedrijf/adres/voorkeuren)
  status text not null default 'pre_stripe',   -- pre_stripe | abandoned | converted
  stripe_checkout_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_registrations_email on public.registrations(lower(email));
create index if not exists idx_registrations_status on public.registrations(status);

create trigger trg_registrations_updated
before update on public.registrations
for each row execute function public.set_updated_at();

-- 4) RLS & SECURITY ----------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.invitations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.user_dashboard_settings enable row level security;
alter table public.registrations enable row level security;

-- Helper policy: alleen eigen profile lees/schrijf
create policy "profiles self read"
on public.profiles
for select
to authenticated
using ( id = auth.uid() );

create policy "profiles self update"
on public.profiles
for update
to authenticated
using ( id = auth.uid() );

-- Organizations: alleen zichtbaar als je lid bent (of via registratie endpoints: done via Edge functions/API)
create policy "orgs select by membership"
on public.organizations
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.org_id = organizations.id and m.user_id = auth.uid()
  )
);

-- Updates op org: alleen admin binnen org
create policy "orgs update by admin"
on public.organizations
for update
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.org_id = organizations.id and m.user_id = auth.uid() and m.role = 'admin'
  )
);

-- Memberships: leden mogen ledenlijst zien; admin/manager mogen beheren
create policy "memberships select same org"
on public.memberships
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m2
    where m2.org_id = memberships.org_id and m2.user_id = auth.uid()
  )
);

create policy "memberships insert by admin"
on public.memberships
for insert
to authenticated
with check (
  exists (
    select 1 from public.memberships m2
    where m2.org_id = memberships.org_id and m2.user_id = auth.uid() and m2.role = 'admin'
  )
);

create policy "memberships update by admin_manager"
on public.memberships
for update
to authenticated
using (
  exists (
    select 1 from public.memberships m2
    where m2.org_id = memberships.org_id and m2.user_id = auth.uid() and (m2.role = 'admin' or m2.role = 'manager')
  )
);

-- Invitations: admin kan beheren; leden kunnen pending invites inzien
create policy "invitations select same org"
on public.invitations
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.org_id = invitations.org_id and m.user_id = auth.uid()
  )
);

create policy "invitations ins/upd/del by admin"
on public.invitations
for all
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.org_id = invitations.org_id and m.user_id = auth.uid() and m.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.memberships m
    where m.org_id = invitations.org_id and m.user_id = auth.uid() and m.role = 'admin'
  )
);

-- Subscriptions: alleen admin/manager select; admin update via webhook service role (buiten RLS)
create policy "subscriptions select admin_manager"
on public.subscriptions
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.org_id = subscriptions.org_id and m.user_id = auth.uid() and (m.role='admin' or m.role='manager')
  )
);

-- Audit logs: select binnen eigen org
create policy "audit select same org"
on public.audit_logs
for select
to authenticated
using (
  org_id in (
    select m.org_id from public.memberships m where m.user_id = auth.uid()
  )
);

-- User dashboard settings: user beperkte toegang
create policy "uds select own"
on public.user_dashboard_settings
for select
to authenticated
using ( user_id = auth.uid() );

create policy "uds upsert own"
on public.user_dashboard_settings
for all
to authenticated
using ( user_id = auth.uid() )
with check ( user_id = auth.uid() );

-- Registrations: normaal alleen via serverless/API
-- Voor veiligheid: niemand leest/schrijft direct (alleen service role).
create policy "registrations deny all"
on public.registrations
for all
to authenticated
using (false)
with check (false);

-- 5) SEAT ENFORCEMENT (prepared constraints) --------------------------------
-- NB: Echte seat-enforcement doen we in app-logic + Stripe webhooks.
-- Eventueel kun je hier later triggers toevoegen.

-- 6) INITIAL DATA ------------------------------------------------------------
-- Geen seed gebruikers; alles loopt via registratieflow.

-- 7) COMMENTS / HINTS --------------------------------------------------------
comment on table public.organizations is 'Workspaces met subdomein en plan. Tenant-isolatie via RLS.';
comment on table public.memberships is 'Relatie user→org met vaste rollen (admin/manager/medewerker/externe/lezen).';
comment on table public.subscriptions is 'Stripe spiegel; status bepaalt read-only gating.';
comment on table public.registrations is 'Pre-Stripe registratie payload; status pre_stripe|abandoned|converted.';
comment on function public.is_reserved_subdomain is 'Checkt of subdomein in gereserveerde lijst staat.';
comment on function public.is_valid_subdomain is 'Regex controle subdomein: 3–32, a-z, 0–9, - (geen begin/eind -).';
