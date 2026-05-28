-- ============================================================================
-- Mueblería Christami · Row Level Security
-- Aplicar después de schema.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
alter table leads enable row level security;

-- INSERT público: cualquiera (anon o autenticado) puede crear un lead.
drop policy if exists "leads_insert_public" on leads;
create policy "leads_insert_public"
  on leads for insert
  to anon, authenticated
  with check (true);

-- SELECT sólo autenticados (admin).
drop policy if exists "leads_select_authenticated" on leads;
create policy "leads_select_authenticated"
  on leads for select
  to authenticated
  using (true);

-- UPDATE sólo autenticados.
drop policy if exists "leads_update_authenticated" on leads;
create policy "leads_update_authenticated"
  on leads for update
  to authenticated
  using (true)
  with check (true);

-- DELETE no permitido (sin policy).

-- ---------------------------------------------------------------------------
-- interacciones
-- ---------------------------------------------------------------------------
alter table interacciones enable row level security;

drop policy if exists "interacciones_all_authenticated" on interacciones;
create policy "interacciones_all_authenticated"
  on interacciones for all
  to authenticated
  using (true)
  with check (true);
