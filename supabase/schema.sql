-- ============================================================================
-- Mueblería Christami · Schema base de datos
-- Postgres / Supabase · región sa-east-1
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tabla: leads
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id                  uuid        primary key default gen_random_uuid(),
  created_at          timestamptz default now(),
  nombre              text        not null,
  email               text,
  telefono            text        not null,
  ciudad              text,
  tipo_proyecto       text        check (tipo_proyecto in ('cocina','dormitorio','living','oficina','otro')),
  presupuesto_rango   text        check (presupuesto_rango in ('menos_1m','1m_3m','3m_5m','mas_5m')),
  plazo               text        check (plazo in ('inmediato','1_3_meses','3_6_meses','solo_cotizando')),
  score               int         default 0,
  estado              text        default 'nuevo' check (estado in ('nuevo','contactado','calificado','ganado','perdido')),
  utm_source          text,
  utm_campaign        text,
  utm_medium          text,
  notas               text
);

create index if not exists idx_leads_estado  on leads(estado);
create index if not exists idx_leads_created on leads(created_at desc);

-- ---------------------------------------------------------------------------
-- Tabla: interacciones
-- ---------------------------------------------------------------------------
create table if not exists interacciones (
  id          uuid        primary key default gen_random_uuid(),
  lead_id     uuid        references leads(id) on delete cascade,
  tipo        text        check (tipo in ('whatsapp','email','llamada','visita')),
  fecha       timestamptz default now(),
  contenido   text
);

create index if not exists idx_interacciones_lead on interacciones(lead_id);
