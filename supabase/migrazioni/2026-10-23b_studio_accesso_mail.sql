-- =====================================================================
-- Sala studio: accesso di docenti ed educatori con la mail istituzionale
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Come per l'area docenti di /lingue: chi ha un indirizzo
-- @alberghierorieti.it o @alberghierorieti.edu.it riceve per posta un
-- codice di sei cifre (10 minuti, 5 tentativi, 5 invii all'ora).
-- Del codice si conserva solo l'impronta. La tabella si legge e si
-- scrive solo dalla funzione studio-genera (chiave di servizio).
-- Tutte le modifiche sono additive.
-- =====================================================================

begin;

create table if not exists public.studio_otp (
  email           text primary key check (char_length(email) <= 254),
  hash            text not null,
  scade           timestamptz not null,
  tentativi       integer not null default 0,
  ultimo_invio    timestamptz not null default now(),
  finestra        timestamptz not null default now(),
  invii_finestra  integer not null default 1
);

alter table public.studio_otp enable row level security;
revoke all on public.studio_otp from anon, authenticated;

commit;
