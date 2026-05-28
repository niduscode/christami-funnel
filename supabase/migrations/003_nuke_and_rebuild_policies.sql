-- =========================================================================
-- NUKE & REBUILD: limpia TODAS las policies de leads y las re-crea desde
-- cero con la sintaxis más simple y permisiva posible.
--
-- Por qué: la migración 002 parece no haber dejado las policies activas
-- (anon sigue bloqueado por RLS). Este script:
--   1) Lista TODAS las policies actuales de leads y las dropea dinámicamente
--   2) Re-toggle RLS (off → on) para limpiar cualquier estado raro
--   3) Otorga GRANTs explícitos
--   4) Crea 2 policies mínimas (anon INSERT, auth ALL)
-- =========================================================================

-- 1) Toggle RLS off/on (no destructivo, solo "resetea" cualquier estado)
alter table public.leads disable row level security;

-- 2) Borrar TODAS las policies actuales de leads dinámicamente
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'leads'
  loop
    execute format('drop policy %I on public.leads', pol.policyname);
  end loop;
end$$;

-- 3) GRANTs a nivel de tabla
revoke all on public.leads from anon, authenticated;
grant insert on public.leads to anon;
grant select, insert, update, delete on public.leads to authenticated;

-- 4) Re-habilitar RLS
alter table public.leads enable row level security;

-- 5) Crear policies mínimas y explícitas
create policy p_anon_insert
  on public.leads
  for insert
  to anon
  with check (true);

create policy p_auth_all
  on public.leads
  for all
  to authenticated
  using (true)
  with check (true);

-- 6) Verificar (debería devolver exactamente 2 filas)
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'leads';
