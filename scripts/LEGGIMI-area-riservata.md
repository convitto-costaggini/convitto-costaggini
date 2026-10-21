# Area riservata docenti di /lingue

Le pagine dell'area docenti (hub, Lunedì, Misuratelo voi, presentazione, Lezione in 5 minuti, Verifiche, Crea) e la scheda Docente
con le verifiche delle lezioni non sono nel repository in chiaro: stanno in `lingue/docenti/*.enc`, cifrate con AES-256-GCM.
Le pagine pubbliche `lingue/<nome>.html` sono solo un guscio che chiede l'accesso (`lingue/accesso.js`).

## Chi entra
- **Account personale**: e-mail confermata, presente nella tabella `lingue_docenti` (Supabase) e secondo fattore (app di autenticazione).
  Il database rilascia la chiave di decifratura solo a chi ha tutte e tre le cose (funzione `lingue_accesso`).
- **Codice del Dipartimento**: una chiave di scorta (`lingue/docenti/accesso-dipartimento.json`) apribile con il codice.

## Aggiungere un docente (SQL Editor di Supabase)
    insert into public.lingue_docenti(email, nome) values ('nome.cognome@alberghierorieti.it', 'Nome Cognome');
Per togliere l'accesso: `update public.lingue_docenti set attivo = false where email = '...';`

## Modificare una pagina riservata
La chiave è in `select chiave from public.lingue_chiave;` (solo da chi amministra il database).
    export LINGUE_CHIAVE=<chiave>
    node scripts/lingue-riservato.js decifra presentazione /percorso/presentazione.html   # porta in chiaro
    # ...modifica il file...
    node scripts/lingue-riservato.js cifra /percorso/presentazione.html presentazione    # cifra di nuovo
Il file in chiaro non va mai committato.

## Cambiare il codice del Dipartimento
    node scripts/lingue-riservato.js scorta XXXX-XXXX-XXXX-XXXX     # con LINGUE_CHIAVE impostata
Cambiare il codice non toglie l'accesso a chi lo conosceva già e ha salvato la chiave: per questo serve ruotare anche la chiave
(nuova riga in `lingue_chiave`, poi `decifra` e `cifra` di ogni pagina con la nuova chiave).
