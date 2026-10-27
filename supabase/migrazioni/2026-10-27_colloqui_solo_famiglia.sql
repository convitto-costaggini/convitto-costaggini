-- Area riservata famiglie: i colloqui con i docenti restano riservati (27/10/2026)
-- Il gestionale pubblica in famiglie_colloqui ogni colloquio registrato, con la
-- famiglia o con i docenti. Decisione del 27/10/2026: i genitori vedono solo i
-- colloqui con la famiglia. Quelli con i docenti restano agli atti e visibili
-- agli amministratori (regola "lettura colloqui", is_admin, invariata).

drop policy if exists "Genitore vede colloqui figlio (codice+nome)" on public.famiglie_colloqui;
create policy "Genitore vede colloqui figlio (codice+nome)" on public.famiglie_colloqui
  for select to authenticated
  using (public.famiglia_vede(codice_studente, nome_studente)
         and lower(btrim(coalesce(controparte, ''))) = 'famiglia');
