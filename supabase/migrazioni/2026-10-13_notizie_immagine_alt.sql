-- Notizie: descrizione della foto di copertina (testo alternativo per chi usa
-- un lettore di schermo). La scrive l'Admin nel campo "Descrizione immagine";
-- se e' vuota, la pagina usa il titolo della notizia come prima.
-- Da eseguire PRIMA di unire il ramo notizie-descrizione-immagine.

alter table public.notizie
  add column if not exists immagine_alt text not null default '';

-- Copertina della notizia "prima e dopo" (13/10/2026)
update public.notizie
   set immagine_alt = 'A sinistra le mani degli allievi della 1B accanto ai primi piatti, a destra i bignè craquelin della 4A'
 where immagine = 'img/notizie/prima-e-dopo-ottobre-2026/01.jpg'
   and immagine_alt = '';

-- Verifica: deve comparire la colonna immagine_alt e la riga aggiornata
select titolo, immagine_alt from public.notizie
 where immagine_alt <> '';
