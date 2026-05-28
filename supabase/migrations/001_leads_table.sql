-- =========================================================================
-- Mueblería Christami — schema inicial
-- Tabla `leads` + enums + índices + RLS (Row Level Security).
--
-- Cómo correrlo: pegar todo este archivo en
--   Dashboard → SQL Editor → New query → Run
-- en el proyecto de Supabase recién creado.
-- =========================================================================

-- 1) ENUMS para campos de selección cerrada -------------------------------
-- (tipo_proyecto NO usa enum porque ahora permite múltiples valores como CSV)

create type presupuesto_t as enum (
  'menos_1m',
  '1m_3m',
  '3m_5m',
  'mas_5m'
);

create type plazo_t as enum (
  'inmediato',
  '1_3_meses',
  '3_6_meses',
  'solo_cotizando'
);

create type estado_lead_t as enum (
  'nuevo',
  'contactado',
  'calificado',
  'ganado',
  'perdido'
);

-- 2) TABLA leads ----------------------------------------------------------
create table public.leads (
  id          uuid          primary key default gen_random_uuid(),
  created_at  timestamptz   not null    default now(),

  -- Datos del lead
  nombre              text  not null,
  email               text,                              -- opcional
  telefono            text  not null,                    -- normalizado: +56 9 XXXX XXXX
  ciudad              text  not null,
  tipo_proyecto       text  not null,                    -- CSV: "cocina,living"
  presupuesto_rango   presupuesto_t  not null,
  plazo               plazo_t        not null,

  -- Tracking
  utm_source     text,
  utm_campaign   text,
  utm_medium     text,

  -- Estado interno (lo manejan los admins)
  score   int             not null default 0,            -- 0–100
  estado  estado_lead_t   not null default 'nuevo',
  notas   text
);

comment on table public.leads is
  'Leads del formulario público de cotización. INSERT abierto a anon, lectura solo admins.';

-- 3) ÍNDICES --------------------------------------------------------------
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_score_idx      on public.leads (score        desc);
create index leads_estado_idx     on public.leads (estado);

-- 4) ROW LEVEL SECURITY ---------------------------------------------------
-- El form público manda inserts con la `anon` key. El admin lee con
-- una sesión autenticada (auth.uid() existe). Sin RLS, cualquiera con
-- la anon key podría LEER todos los leads — eso NO queremos.

alter table public.leads enable row level security;

-- Política 1: anon puede INSERTAR (con check true = sin restricciones extra)
create policy "anon insert" on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Política 2: solo usuarios autenticados pueden LEER / UPDATE / DELETE
create policy "auth read"   on public.leads
  for select to authenticated using (true);

create policy "auth update" on public.leads
  for update to authenticated using (true) with check (true);

create policy "auth delete" on public.leads
  for delete to authenticated using (true);

-- 5) TRIGGER (opcional): updated_at automático en cada UPDATE -------------
alter table public.leads add column updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();
