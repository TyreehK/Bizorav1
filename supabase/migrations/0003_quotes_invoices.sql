-- =====================================================================
-- 0003_quotes_invoices.sql
-- Offertes & Facturen kernschema + nummering + RLS
-- =====================================================================

-- Veiligheidsnet: extensies
create extension if not exists "uuid-ossp";

-- ===================== ENUMS =========================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'quote_status') then
    create type public.quote_status as enum ('concept','verzonden','bekeken','geaccepteerd','geweigerd','verlopen');
  end if;

  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('concept','verzonden','bekeken','gedeeltelijk_betaald','betaald','over_tijd','gecrediteerd');
  end if;

  if not exists (select 1 from pg_type where typname = 'invoice_type') then
    create type public.invoice_type as enum ('invoice','credit');
  end if;
end $$;

-- ===================== NUMMERING =====================================
-- Per organisatie onafhankelijke tellers met vrij format (prefix/jaar)
create table if not exists public.doc_numbering (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  doc_kind text not null check (doc_kind in ('INV','QTE','CN')),
  prefix text not null default '',              -- bv. 'INV-'
  pattern text not null default 'YYYY-####',    -- placeholders: YYYY, YY, #### (4 cijfers), ###, ##
  current_counter int not null default 0,
  updated_at timestamptz not null default now(),
  unique (org_id, doc_kind)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_doc_numbering_updated
before update on public.doc_numbering
for each row execute function public.set_updated_at();

-- Helper: formatteer nummer volgens pattern
create or replace function public.format_doc_number(prefix text, pattern text, counter int)
returns text
language plpgsql
as $$
declare
  y4 text := to_char(now(), 'YYYY');
  y2 text := to_char(now(), 'YY');
  num text := pattern;
  hashes int;
  padded text;
begin
  num := replace(num, 'YYYY', y4);
  num := replace(num, 'YY', y2);

  -- Vind langste #### blok (max 6 ondersteund)
  if position('######' in num) > 0 then
    hashes := 6;
  elsif position('#####' in num) > 0 then
    hashes := 5;
  elsif position('####' in num) > 0 then
    hashes := 4;
  elsif position('###' in num) > 0 then
    hashes := 3;
  elsif position('##' in num) > 0 then
    hashes := 2;
  else
    hashes := 0;
  end if;

  if hashes > 0 then
    padded := lpad(counter::text, hashes, '0');
    if hashes = 6 then
      num := replace(num, '######', padded);
    elsif hashes = 5 then
      num := replace(num, '#####', padded);
    elsif hashes = 4 then
      num := replace(num, '####', padded);
    elsif hashes = 3 then
      num := replace(num, '###', padded);
    elsif hashes = 2 then
      num := replace(num, '##', padded);
    end if;
  end if;

  return prefix || num;
end
$$;

-- Concurrency-safe nummergenerator met advisory lock
create or replace function public.next_doc_number(p_org uuid, p_kind text)
returns text
language plpgsql
as $$
declare
  key bigint := ('1'::bigint << 32) + (case when p_kind='INV' then 1 when p_kind='QTE' then 2 else 3 end)::bigint;
  rec public.doc_numbering%rowtype;
  newcounter int;
  num text;
begin
  -- lock op org + doc_kind
  perform pg_advisory_xact_lock( hashtextextended(p_org::text || ':' || p_kind, 42) );

  select * into rec from public.doc_numbering
   where org_id = p_org and doc_kind = p_kind
   for update;

  if not found then
    insert into public.doc_numbering (org_id, doc_kind, prefix, pattern, current_counter)
    values (p_org, p_kind, case when p_kind='INV' then 'INV-' when p_kind='QTE' then 'QTE-' else 'CN-' end, 'YYYY-####', 0)
    returning * into rec;
  end if;

  newcounter := rec.current_counter + 1;

  update public.doc_numbering
    set current_counter = newcounter
  where id = rec.id;

  num := public.format_doc_number(rec.prefix, rec.pattern, newcounter);
  return num;
end
$$;

-- ===================== QUOTES ==========================================
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid,               -- optionele FK naar klantenmodule (aan te maken)
  project_id uuid,                -- optioneel
  number text unique,             -- globale uniqueness; tevens unique per org hieronder
  number_per_org text not null,   -- uniek binnen org
  status public.quote_status not null default 'concept',
  language text not null default 'nl',
  currency text not null default 'EUR',
  reference text,                 -- klantreferentie/PO
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  issued_at date default (current_date),
  valid_until date,               -- geldigheidsdatum
  subtotal_excl numeric(12,2) not null default 0,
  total_tax numeric(12,2) not null default 0,
  total_incl numeric(12,2) not null default 0,
  notes_public text,
  notes_internal text,
  pdf_url text,
  pdf_version int not null default 0,
  -- e-mail / verzending
  sent_at timestamptz,
  sent_to text[],                 -- lijst van e-mails
  last_email_status text,         -- bv. 'sent'/'failed'
  last_email_error text,
  -- viewing & e-sign
  viewed_at timestamptz,
  accept_token text,              -- single-use token voor acceptatie link
  accepted_at timestamptz,
  accepted_by_name text,
  accepted_by_ip inet,
  accepted_by_user_agent text,
  rejected_at timestamptz,
  -- linking
  converted_invoice_id uuid,      -- naar factuur
  -- auteur / eigenaarschap
  created_by uuid,                -- profiles.id
  constraint quotes_amounts_nonneg check (subtotal_excl >= 0 and total_tax >= 0 and total_incl >= 0),
  constraint quotes_dates check (valid_until is null or issued_at is null or valid_until >= issued_at)
);

create unique index if not exists uq_quotes_org_number on public.quotes(organization_id, number_per_org);
create index if not exists idx_quotes_org_status on public.quotes(organization_id, status);
create index if not exists idx_quotes_org_created on public.quotes(organization_id, created_at desc);

create trigger trg_quotes_updated
before update on public.quotes
for each row execute function public.set_updated_at();

-- Quote items
create table if not exists public.quote_items (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  position int not null default 1,
  item_type text not null default 'line',     -- 'line'|'text'|'section'
  article_id uuid,                            -- optioneel (koppeling artikelen)
  name text,                                  -- regelomschrijving
  description text,
  quantity numeric(12,3) not null default 1,
  unit text default 'st',
  unit_price numeric(12,2) not null default 0,
  discount_pct numeric(5,2) not null default 0,    -- 0..100
  vat_rate numeric(5,2) not null default 21,       -- 21/9/0/...
  vat_code text default 'NL',
  total_excl numeric(12,2) not null default 0,
  total_tax numeric(12,2) not null default 0,
  total_incl numeric(12,2) not null default 0,
  constraint qi_discount_range check (discount_pct between 0 and 100),
  constraint qi_amounts_nonneg check (quantity >= 0 and unit_price >= 0 and total_excl >= 0 and total_tax >= 0 and total_incl >= 0)
);

create index if not exists idx_quote_items_quote on public.quote_items(quote_id);
create index if not exists idx_quote_items_position on public.quote_items(quote_id, position);

-- ===================== INVOICES =========================================
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid,
  project_id uuid,
  type public.invoice_type not null default 'invoice',
  number text unique,
  number_per_org text not null,
  status public.invoice_status not null default 'concept',
  language text not null default 'nl',
  currency text not null default 'EUR',
  reference text,
  issued_at date default (current_date),
  due_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  subtotal_excl numeric(12,2) not null default 0,
  total_tax numeric(12,2) not null default 0,
  total_incl numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  notes_public text,
  notes_internal text,
  pdf_url text,
  pdf_version int not null default 0,
  -- e-mail / hosting / betalingen
  sent_at timestamptz,
  sent_to text[],
  last_email_status text,
  last_email_error text,
  stripe_invoice_id text,               -- hosted invoice page
  stripe_payment_intent_id text,
  payment_methods text[],               -- ['card','ideal','sepa_debit',...]
  -- dunning
  last_reminder_at timestamptz,
  next_reminder_at timestamptz,
  -- creditnota koppeling
  credit_for_invoice_id uuid references public.invoices(id) on delete set null,
  -- auteur
  created_by uuid,
  constraint invoices_amounts_nonneg check (subtotal_excl >= 0 and total_tax >= 0 and total_incl >= 0 and paid_amount >= 0),
  constraint invoices_due_after_issue check (due_at is null or issued_at is null or due_at >= issued_at)
);

create unique index if not exists uq_invoices_org_number on public.invoices(organization_id, number_per_org);
create index if not exists idx_invoices_org_status on public.invoices(organization_id, status);
create index if not exists idx_invoices_org_dates on public.invoices(organization_id, issued_at desc);
create index if not exists idx_invoices_credit_for on public.invoices(credit_for_invoice_id);

create trigger trg_invoices_updated
before update on public.invoices
for each row execute function public.set_updated_at();

-- Invoice items
create table if not exists public.invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  position int not null default 1,
  item_type text not null default 'line',
  article_id uuid,
  name text,
  description text,
  quantity numeric(12,3) not null default 1,
  unit text default 'st',
  unit_price numeric(12,2) not null default 0,
  discount_pct numeric(5,2) not null default 0,
  vat_rate numeric(5,2) not null default 21,
  vat_code text default 'NL',
  total_excl numeric(12,2) not null default 0,
  total_tax numeric(12,2) not null default 0,
  total_incl numeric(12,2) not null default 0,
  constraint ii_discount_range check (discount_pct between 0 and 100),
  constraint ii_amounts_nonneg check (quantity >= 0 and unit_price >= 0 and total_excl >= 0 and total_tax >= 0 and total_incl >= 0)
);

create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);
create index if not exists idx_invoice_items_position on public.invoice_items(invoice_id, position);

-- Handmatige & deelbetalingen
create table if not exists public.invoice_payments (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  paid_at timestamptz not null default now(),
  method text not null,                 -- 'manual','bank_transfer','card','ideal','sepa',...
  amount numeric(12,2) not null check (amount > 0),
  reference text,
  notes text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_invoice_payments_invoice on public.invoice_payments(invoice_id);
create index if not exists idx_invoice_payments_paid_at on public.invoice_payments(paid_at desc);

-- ===================== NUMMERING TRIGGERS ===============================
-- Genereer nummer bij eerste overgang uit 'concept' of bij insert zonder nummer

create or replace function public.ensure_quote_number()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'INSERT') then
    if new.number_per_org is null or new.number_per_org = '' then
      new.number_per_org := public.next_doc_number(new.organization_id, 'QTE');
      new.number := new.number_per_org; -- ook als globaal nummer
    end if;
  elsif (TG_OP = 'UPDATE') then
    if (old.status = 'concept' and new.status in ('verzonden','bekeken','geaccepteerd','geweigerd','verlopen'))
       and (new.number_per_org is null or new.number_per_org = '') then
      new.number_per_org := public.next_doc_number(new.organization_id, 'QTE');
      new.number := new.number_per_org;
    end if;
  end if;
  return new;
end
$$;

create trigger trg_quotes_number
before insert or update on public.quotes
for each row execute function public.ensure_quote_number();

create or replace function public.ensure_invoice_number()
returns trigger
language plpgsql
as $$
declare
  kind text := case when new.type = 'credit' then 'CN' else 'INV' end;
begin
  if (TG_OP = 'INSERT') then
    if new.number_per_org is null or new.number_per_org = '' then
      new.number_per_org := public.next_doc_number(new.organization_id, kind);
      new.number := new.number_per_org;
    end if;
  elsif (TG_OP = 'UPDATE') then
    if (old.status = 'concept' and new.status in ('verzonden','bekeken','gedeeltelijk_betaald','betaald','over_tijd','gecrediteerd'))
       and (new.number_per_org is null or new.number_per_org = '') then
      new.number_per_org := public.next_doc_number(new.organization_id, kind);
      new.number := new.number_per_org;
    end if;
  end if;
  return new;
end
$$;

create trigger trg_invoices_number
before insert or update on public.invoices
for each row execute function public.ensure_invoice_number();

-- ===================== RLS & POLICIES ====================================
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.invoice_payments enable row level security;

-- Quotes: select voor leden
create policy "quotes select by membership"
on public.quotes
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = quotes.organization_id
      and m.profile_id = auth.uid()
  )
);

-- Quotes: insert/update/delete door admin/manager; medewerker alleen eigen
create policy "quotes insert admin_manager_or_owner"
on public.quotes
for insert
to authenticated
with check (
  exists (
    select 1 from public.memberships m
    where m.organization_id = quotes.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
  or (quotes.created_by = auth.uid())
);

create policy "quotes update admin_manager_or_owner"
on public.quotes
for update
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = quotes.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
  or (quotes.created_by = auth.uid())
)
with check (
  exists (
    select 1 from public.memberships m
    where m.organization_id = quotes.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
  or (quotes.created_by = auth.uid())
);

create policy "quotes delete admin_manager"
on public.quotes
for delete
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = quotes.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
);

-- Quote items: zelfde tenant + rechten afgeleid van quote
create policy "quote_items select same org"
on public.quote_items
for select
to authenticated
using (
  exists (
    select 1 from public.quotes q
    join public.memberships m on m.organization_id = q.organization_id
    where q.id = quote_items.quote_id and m.profile_id = auth.uid()
  )
);

create policy "quote_items cud via quote owner/admin"
on public.quote_items
for all
to authenticated
using (
  exists (
    select 1
    from public.quotes q
    join public.memberships m on m.organization_id = q.organization_id
    where q.id = quote_items.quote_id
      and (m.profile_id = auth.uid() and (m.role in ('admin','manager') or q.created_by = auth.uid()))
  )
)
with check (
  exists (
    select 1
    from public.quotes q
    join public.memberships m on m.organization_id = q.organization_id
    where q.id = quote_items.quote_id
      and (m.profile_id = auth.uid() and (m.role in ('admin','manager') or q.created_by = auth.uid()))
  )
);

-- Invoices: select voor leden
create policy "invoices select by membership"
on public.invoices
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = invoices.organization_id
      and m.profile_id = auth.uid()
  )
);

-- Invoices: insert/update/delete admin/manager; medewerker eigen
create policy "invoices insert admin_manager_or_owner"
on public.invoices
for insert
to authenticated
with check (
  exists (
    select 1 from public.memberships m
    where m.organization_id = invoices.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
  or (invoices.created_by = auth.uid())
);

create policy "invoices update admin_manager_or_owner"
on public.invoices
for update
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = invoices.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
  or (invoices.created_by = auth.uid())
)
with check (
  exists (
    select 1 from public.memberships m
    where m.organization_id = invoices.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
  or (invoices.created_by = auth.uid())
);

create policy "invoices delete admin_manager"
on public.invoices
for delete
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.organization_id = invoices.organization_id
      and m.profile_id = auth.uid()
      and (m.role in ('admin','manager'))
  )
);

-- Invoice items: tenant & rechten via parent
create policy "invoice_items select same org"
on public.invoice_items
for select
to authenticated
using (
  exists (
    select 1
    from public.invoices i
    join public.memberships m on m.organization_id = i.organization_id
    where i.id = invoice_items.invoice_id and m.profile_id = auth.uid()
  )
);

create policy "invoice_items cud via invoice owner/admin"
on public.invoice_items
for all
to authenticated
using (
  exists (
    select 1
    from public.invoices i
    join public.memberships m on m.organization_id = i.organization_id
    where i.id = invoice_items.invoice_id
      and (m.profile_id = auth.uid() and (m.role in ('admin','manager') or i.created_by = auth.uid()))
  )
)
with check (
  exists (
    select 1
    from public.invoices i
    join public.memberships m on m.organization_id = i.organization_id
    where i.id = invoice_items.invoice_id
      and (m.profile_id = auth.uid() and (m.role in ('admin','manager') or i.created_by = auth.uid()))
  )
);

-- Invoice payments: select leden; insert/update admin/manager of eigenaar
alter table public.invoice_payments enable row level security;

create policy "invoice_payments select same org"
on public.invoice_payments
for select
to authenticated
using (
  exists (
    select 1
    from public.invoices i
    join public.memberships m on m.organization_id = i.organization_id
    where i.id = invoice_payments.invoice_id and m.profile_id = auth.uid()
  )
);

create policy "invoice_payments insert admin_manager_or_owner"
on public.invoice_payments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.invoices i
    join public.memberships m on m.organization_id = i.organization_id
    where i.id = invoice_payments.invoice_id
      and (m.profile_id = auth.uid() and (m.role in ('admin','manager') or i.created_by = auth.uid()))
  )
);

create policy "invoice_payments delete admin_manager"
on public.invoice_payments
for delete
to authenticated
using (
  exists (
    select 1
    from public.invoices i
    join public.memberships m on m.organization_id = i.organization_id
    where i.id = invoice_payments.invoice_id
      and (m.profile_id = auth.uid() and (m.role in ('admin','manager')))
  )
);

-- ===================== HULPTRIGGERS (betalingssom) =======================
-- Houd paid_amount in invoices synchroon met invoice_payments
create or replace function public.sync_invoice_paid_amount()
returns trigger
language plpgsql
as $$
begin
  update public.invoices i
    set paid_amount = coalesce((
      select sum(p.amount) from public.invoice_payments p where p.invoice_id = i.id
    ), 0)
  where i.id = coalesce(new.invoice_id, old.invoice_id);

  return null;
end
$$;

create trigger trg_invoice_payments_sync_aiud
after insert or update or delete on public.invoice_payments
for each row execute function public.sync_invoice_paid_amount();

-- ===================== COMMENTAAR =======================================
comment on table public.quotes is 'Offertes met statuslifecycle + e-sign logging.';
comment on table public.invoices is 'Facturen & creditnota’s met betalingen en dunning velden.';
comment on table public.doc_numbering is 'Per-organisatie documentnummering met format en counter.';
comment on function public.next_doc_number is 'Concurrency-safe generator voor QTE/INV/CN nummers.';
