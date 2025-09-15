-- =====================================================================
-- 0002_webhook_alignment.sql
-- Brengt schema in lijn met webhook handler & lifecycle
-- =====================================================================

-- ============ 1) ENUM uitbreidingen ===================================
do $$
begin
  -- org_status: voeg 'trialing' toe als die nog niet bestaat
  if not exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'org_status' and e.enumlabel = 'trialing'
  ) then
    alter type public.org_status add value 'trialing';
  end if;

  -- subscription_status: voeg 'trial_will_end' toe als die nog niet bestaat
  if not exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'trial_will_end'
  ) then
    alter type public.subscription_status add value 'trial_will_end';
  end if;
end $$;

-- ============ 2) organizations: subdomain optioneel + checks ============

-- Drop bestaande checks als ze bestaan (we voegen conditionele varianten terug)
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'organizations_subdomain_format'
  ) then
    alter table public.organizations drop constraint organizations_subdomain_format;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'organizations_subdomain_reserved'
  ) then
    alter table public.organizations drop constraint organizations_subdomain_reserved;
  end if;
end $$;

-- Maak subdomain optioneel (NULL toegestaan)
alter table public.organizations
  alter column subdomain drop not null;

-- Conditionele checks: alleen valideren als subdomain NIET NULL is
alter table public.organizations
  add constraint organizations_subdomain_format
  check (subdomain is null or public.is_valid_subdomain(subdomain));

alter table public.organizations
  add constraint organizations_subdomain_reserved
  check (subdomain is null or not public.is_reserved_subdomain(subdomain));

-- ============ 3) registrations: vul Stripe kolommen aan =================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name='registrations' and column_name='stripe_customer_id'
  ) then
    alter table public.registrations add column stripe_customer_id text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name='registrations' and column_name='stripe_subscription_id'
  ) then
    alter table public.registrations add column stripe_subscription_id text;
  end if;
end $$;

-- ============ 4) profiles: UUID default voor id ========================
do $$
begin
  perform 1
  from information_schema.columns
  where table_schema = 'public' and table_name = 'profiles' and column_name = 'id' and column_default is null;

  if found then
    alter table public.profiles
      alter column id set default uuid_generate_v4();
  end if;
end $$;

-- ============ 5) memberships: hernoem kolommen =========================
-- We willen kolomnamen laten aansluiten op het webhook-script:
--  - org_id        -> organization_id
--  - user_id       -> profile_id

do $$
begin
  -- RENAME org_id -> organization_id
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='memberships' and column_name='org_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='memberships' and column_name='organization_id'
  ) then
    alter table public.memberships rename column org_id to organization_id;
  end if;

  -- RENAME user_id -> profile_id
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='memberships' and column_name='user_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='memberships' and column_name='profile_id'
  ) then
    alter table public.memberships rename column user_id to profile_id;
  end if;
end $$;

-- Unique constraint (org_id,user_id) is bij rename meegegaan met interne oid,
-- maar voor de zekerheid maken we onze eigen expliciete (en droppen oude indexes als ze bestaan).
do $$
begin
  -- drop oude indexen als ze bestaan
  if exists (select 1 from pg_class where relname = 'idx_memberships_org') then
    drop index if exists public.idx_memberships_org;
  end if;
  if exists (select 1 from pg_class where relname = 'idx_memberships_user') then
    drop index if exists public.idx_memberships_user;
  end if;

  -- maak nieuwe indexen op de nieuwe kolomnamen
  create index if not exists idx_memberships_organization on public.memberships(organization_id);
  create index if not exists idx_memberships_profile on public.memberships(profile_id);
end $$;

-- Zorg dat unique(organization_id, profile_id) bestaat
do $$
begin
  -- check of er al een unieke constraint is op (organization_id, profile_id)
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.memberships'::regclass
      and contype = 'u'
      and conkey = (select array_agg(attnum order by attnum)
                    from pg_attribute
                    where attrelid = 'public.memberships'::regclass
                      and attname in ('organization_id','profile_id'))
  ) then
    alter table public.memberships
      add constraint memberships_org_profile_unique unique (organization_id, profile_id);
  end if;
end $$;

-- ============ 6) subscriptions: unieke index op stripe_subscription_id ===
create unique index if not exists uq_subscriptions_stripe_sub
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- ============ 7) RLS policies bijwerken (memberships/organizations) =====

-- Drop bestaande policies die nog naar oude kolomnamen verwijzen
do $$
begin
  -- organizations
  if exists (select 1 from pg_policies where schemaname='public' and tablename='organizations' and policyname='orgs select by membership') then
    drop policy "orgs select by membership" on public.organizations;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='organizations' and policyname='orgs update by admin') then
    drop policy "orgs update by admin" on public.organizations;
  end if;

  -- memberships
  if exists (select 1 from pg_policies where schemaname='public' and tablename='memberships' and policyname='memberships select same org') then
    drop policy "memberships select same org" on public.memberships;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='memberships' and policyname='memberships insert by admin') then
    drop policy "memberships insert by admin" on public.memberships;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='memberships' and policyname='memberships update by admin_manager') then
    drop policy "memberships update by admin_manager" on public.memberships;
  end if;
end $$;

-- Nieuwe policies met juiste kolomnamen
create policy "orgs select by membership"
on public.organizations
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = organizations.id and m.profile_id = auth.uid()
  )
);

create policy "orgs update by admin"
on public.organizations
for update
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = organizations.id and m.profile_id = auth.uid() and m.role = 'admin'
  )
);

create policy "memberships select same org"
on public.memberships
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m2
    where m2.organization_id = memberships.organization_id and m2.profile_id = auth.uid()
  )
);

create policy "memberships insert by admin"
on public.memberships
for insert
to authenticated
with check (
  exists (
    select 1 from public.memberships m2
    where m2.organization_id = memberships.organization_id and m2.profile_id = auth.uid() and m2.role = 'admin'
  )
);

create policy "memberships update by admin_manager"
on public.memberships
for update
to authenticated
using (
  exists (
    select 1 from public.memberships m2
    where m2.organization_id = memberships.organization_id and m2.profile_id = auth.uid() and (m2.role = 'admin' or m2.role = 'manager')
  )
);

-- ============ 8) Optioneel: comments ====================================
comment on column public.registrations.stripe_customer_id is 'Stripe customer id (via checkout.session.completed)';
comment on column public.registrations.stripe_subscription_id is 'Stripe subscription id (via checkout.session.completed)';
comment on index uq_subscriptions_stripe_sub is 'Maakt upsert() op subscriptions mogelijk met stripe_subscription_id.';
