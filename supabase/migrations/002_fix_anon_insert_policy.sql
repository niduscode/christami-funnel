-- =========================================================================
-- Fix: la policy "anon insert" de la migración 001 no permitió inserts
-- desde la anon key. Posibles causas:
--   • Nombre de policy con espacio causó problema al parsear
--   • Falta GRANT INSERT a anon a nivel de tabla (Supabase los aplica
--     auto cuando creas la tabla por dashboard, pero no siempre por SQL)
--
-- Esta migración limpia y re-crea TODAS las policies de leads.
-- Ejecutar en SQL Editor del dashboard de Supabase.
-- =========================================================================

-- 1) Limpieza: borrar policies existentes (idempotente)
drop policy if exists "anon insert"   on public.leads;
drop policy if exists "auth read"     on public.leads;
drop policy if exists "auth update"   on public.leads;
drop policy if exists "auth delete"   on public.leads;
-- Por si quedaron con otros nombres de intentos previos:
drop policy if exists "leads_anon_insert"   on public.leads;
drop policy if exists "leads_auth_select"   on public.leads;
drop policy if exists "leads_auth_update"   on public.leads;
drop policy if exists "leads_auth_delete"   on public.leads;

-- 2) GRANTs explícitos (en algunos setups de Supabase no se aplican auto)
grant insert on public.leads to anon;
grant select, insert, update, delete on public.leads to authenticated;

-- 3) Re-crear policies con nombres sin espacios y separadas por rol
create policy leads_anon_insert on public.leads
  as permissive
  for insert
  to anon
  with check (true);

create policy leads_auth_select on public.leads
  as permissive
  for select
  to authenticated
  using (true);

create policy leads_auth_insert on public.leads
  as permissive
  for insert
  to authenticated
  with check (true);

create policy leads_auth_update on public.leads
  as permissive
  for update
  to authenticated
  using (true)
  with check (true);

create policy leads_auth_delete on public.leads
  as permissive
  for delete
  to authenticated
  using (true);

-- 4) Asegurar que RLS esté on (es idempotente, no hace daño)
alter table public.leads enable row level security;

-- 5) (Sanity check) listar políticas activas en este schema:
-- Ejecutalo aparte después de correr el script para verificar:
--   select policyname, cmd, roles, qual, with_check
--   from pg_policies where tablename = 'leads';
