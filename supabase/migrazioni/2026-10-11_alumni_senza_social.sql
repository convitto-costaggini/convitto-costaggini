-- Alumni: niente piu' profili social (Facebook, Instagram, LinkedIn, sito).
-- 1. svuota i valori gia' salvati
-- 2. la vista pubblica restituisce sempre NULL (stessa forma, nessun dato)
-- 3. un trigger impedisce di salvarne di nuovi anche chiamando l'API a mano

update public.alumni
   set social_fb = null, social_ig = null, social_li = null, social_web = null
 where coalesce(social_fb, social_ig, social_li, social_web) is not null;

create or replace view public.alumni_pubblici
with (security_invoker = true) as
select id, nome, firma, anni, citta, lavoro, settore, ricordo,
       null::text as social_fb, null::text as social_ig,
       null::text as social_li, null::text as social_web,
       contattabile, colore, created_at, video_url
  from public.alumni
 where approvato = true;

create or replace function public.alumni_niente_social()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.social_fb := null; new.social_ig := null;
  new.social_li := null; new.social_web := null;
  return new;
end $$;

drop trigger if exists alumni_niente_social on public.alumni;
create trigger alumni_niente_social
  before insert or update on public.alumni
  for each row execute function public.alumni_niente_social();
