# Aula: accesso unico (lingue + sala studio)

Un solo codice monouso per e-mail dà accesso a tutta l'Aula.

- Funzione `aula-accesso` (nuova): `richiedi` e `verifica` come in `studio-genera`, stessa tabella `studio_otp`, stessa firma delle sessioni.
  La sessione vale quindi anche per la Sala studio (`studio-genera` non cambia).
  `verifica` restituisce anche la chiave dei materiali riservati di Lingue, ma solo se l'indirizzo è attivo in `lingue_docenti`.
  `chiave` restituisce la chiave a chi ha già una sessione valida e l'abilitazione: niente secondo codice.
- Sul sito, la sessione sta in `localStorage` (`studio-sessione`, 60 giorni, come prima per la Sala studio); la chiave solo in `sessionStorage` della scheda.
- Revoca di un docente: `update lingue_docenti set attivo = false where email = '...'` blocca subito il rilascio della chiave.
  Una chiave già scaricata in una scheda resta valida fino alla chiusura della scheda; per invalidarla davvero si ruota la chiave (vedi sotto).

## Ordine di pubblicazione (nessun segreto in questo file)
1. Apps Script posta (`scripts/lingue-invio-codici.gs`): aggiungere il servizio `aula` e ripubblicare la distribuzione.
2. Deploy della funzione `aula-accesso` con `verify_jwt=false` (segreti GAS_URL e GAS_TOKEN già presenti).
3. Prova con la mail di Michele: richiedi, verifica, chiave.
4. Aggiornare `lingue_chiave` con la chiave nuova (file locale riservato `ruota-chiave.sql`) e, subito dopo, fare il merge su `main`.
   I file `.enc` e `accesso-dipartimento.json` nel ramo sono già ricifrati con la chiave nuova e il nuovo codice del Dipartimento.
5. Comunicare ai sette colleghi il nuovo codice del Dipartimento (non è nel repository).
6. Dopo qualche giorno: eliminare la vecchia funzione `lingue-accesso` e la tabella `lingue_otp`.

## Rotazione futura della chiave
`LINGUE_CHIAVE=<vecchia>` + script di ricifratura, poi `update lingue_chiave`, poi nuovo `accesso-dipartimento.json`.
La cronologia pubblica di Git conserva i vecchi `.enc` (decifrabili con la vecchia chiave): la rotazione protegge i contenuti nuovi, non quelli già pubblicati.
