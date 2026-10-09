-- =====================================================================
-- Pannello admin: verifica in due passaggi obbligatoria (password + app)
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- is_admin() è il controllo usato da tutte le regole riservate agli
-- amministratori (19 regole RLS e la funzione admin_email_alumni). Da ora
-- risponde "sì" solo se la sessione ha superato anche il codice dell'app
-- di autenticazione (claim aal = 'aal2' nel token). Con la sola password,
-- anche se rubata, il database non concede nulla.
--
-- DA ESEGUIRE SOLO DOPO che l'amministratore ha attivato l'app di
-- autenticazione dal nuovo pannello admin (altrimenti resta escluso fino
-- all'attivazione, che comunque il pannello consente).
-- Per tornare indietro: rieseguire la definizione precedente, in fondo.
-- =====================================================================

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
     and exists (select 1 from public.admins where id = auth.uid());
$$;

-- Definizione precedente (solo per ripristino):
-- create or replace function public.is_admin()
-- returns boolean language sql stable security definer set search_path = public as $$
--   select exists (select 1 from public.admins where id = auth.uid());
-- $$;
