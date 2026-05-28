-- DIAGNÓSTICO (no muta nada, solo lee)
-- Correr en SQL Editor del dashboard y pasarme el output completo.

-- 1) ¿Qué policies existen actualmente en leads?
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'leads';

-- 2) ¿Qué privilegios tiene cada rol sobre la tabla?
select grantee, privilege_type
from information_schema.table_privileges
where table_schema = 'public' and table_name = 'leads'
order by grantee, privilege_type;

-- 3) ¿RLS está habilitado en la tabla?
select relname as table_name,
       relrowsecurity as rls_enabled,
       relforcerowsecurity as rls_forced
from pg_class
where relname = 'leads' and relnamespace = 'public'::regnamespace;
