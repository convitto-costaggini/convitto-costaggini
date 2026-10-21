# Area riservata docenti di /lingue

Le pagine dell'area docenti (hub, Lunedì, Misuratelo voi, presentazione, Lezione in 5 minuti, Verifiche, Crea) e la scheda Docente
con le verifiche delle lezioni non sono nel repository in chiaro: stanno in `lingue/docenti/*.enc`, cifrate con AES-256-GCM.
Le pagine pubbliche `lingue/<nome>.html` sono solo un guscio che chiede l'accesso (`lingue/accesso.js`).

## Come si entra
- **E-mail istituzionale e codice monouso**: il docente scrive la sua e-mail, riceve un codice di sei cifre per posta, lo inserisce e entra.
  Non c'è nessun account da creare e nessuna password. Il codice parte solo per gli indirizzi presenti nella tabella `lingue_docenti`
  (Supabase), vale 10 minuti, si usa una volta sola, ha al massimo 5 tentativi e 5 invii all'ora. Del codice il database conserva solo
  l'impronta (hash). La chiave di decifratura viene consegnata dalla funzione `lingue-accesso` solo dopo il codice giusto.
- **Codice del Dipartimento**: una chiave di scorta (`lingue/docenti/accesso-dipartimento.json`) apribile con un codice condiviso.

La mail parte da uno script Google Apps Script (`scripts/lingue-invio-codici.gs`), come le mail dei moduli del Convitto: nessuna casella
nuova, nessun SMTP, nessun intervento dell'amministratore del Workspace.

## Da fare per completare il setup (in quest'ordine, circa 10 minuti)
- [ ] **Pubblicare lo script di invio**: vai su script.google.com con l'account `@alberghierorieti.it`, Nuovo progetto, incolla il contenuto di
      `scripts/lingue-invio-codici.gs`. Impostazioni progetto (icona ingranaggio), Proprietà script, Aggiungi proprietà: nome `TOKEN`,
      valore una stringa lunga e casuale (almeno 32 caratteri; tienila, ti serve al passo dopo). Poi Esegui il deployment, Nuova distribuzione,
      tipo Applicazione web, "Esegui come: me", "Chi ha accesso: Chiunque", Distribuisci. Autorizza i permessi richiesti (invio e-mail)
      e copia l'URL che termina con `/exec`.
- [ ] **Inserire i due segreti in Supabase**: Dashboard, Edge Functions, Secrets. Aggiungi `GAS_URL` (l'URL `/exec`) e `GAS_TOKEN`
      (la stessa stringa messa in `TOKEN`). Non vanno scritti in chat né nel repository.
- [ ] **Abilitare i docenti** nella tabella `lingue_docenti` (vedi sotto).
- [ ] **Prova**: aprire `lingue/docenti.html`, scrivere un indirizzo abilitato, verificare che la mail arrivi e che il codice faccia entrare.
- [ ] Unire il ramo su GitHub (finché non è unito, le pagine pubbliche sono ancora quelle vecchie).
- [ ] Facoltativo, a prova riuscita: eliminare le funzioni SQL non più usate
      `drop function public.lingue_codice_ok(text), public.lingue_stato(), public.lingue_accesso();`

Nel frattempo il **codice del Dipartimento** funziona senza nulla di tutto questo.

## Se qualcosa non va
- *Il codice non arriva*: controllare la posta indesiderata; poi Dashboard, Edge Functions, `lingue-accesso`, Logs. Se lo script risponde
  "non autorizzato", `TOKEN` e `GAS_TOKEN` non coincidono. Dopo ogni modifica al codice dello script serve una nuova distribuzione.
- *Limiti*: Gmail consente circa 1500 invii al giorno con un account Workspace, ampiamente sufficienti.
- Il codice funziona solo per indirizzi che finiscono con `@alberghierorieti.it` o `@alberghierorieti.edu.it` (controllo anche nello script).

## Aggiungere un docente (SQL Editor di Supabase)
    insert into public.lingue_docenti(email, nome) values ('nome.cognome@alberghierorieti.it', 'Nome Cognome');
Per togliere l'accesso: `update public.lingue_docenti set attivo = false where email = '...';`
(chi era già dentro mantiene la chiave finché non si ruota, vedi sotto).

## Modificare una pagina riservata
La chiave si legge con `select chiave from public.lingue_chiave;` (solo da chi amministra il database).
    export LINGUE_CHIAVE=<chiave>
    node scripts/lingue-riservato.js decifra presentazione /percorso/presentazione.html   # porta in chiaro
    # ...modifica il file...
    node scripts/lingue-riservato.js cifra /percorso/presentazione.html presentazione    # cifra di nuovo
Il file in chiaro non va mai committato.

## Cambiare il codice del Dipartimento
    node scripts/lingue-riservato.js scorta XXXX-XXXX-XXXX-XXXX     # con LINGUE_CHIAVE impostata
Cambiare il codice non toglie l'accesso a chi lo conosceva già e ha salvato la chiave: per questo serve ruotare anche la chiave
(nuova riga in `lingue_chiave`, poi `decifra` e `cifra` di ogni pagina con la nuova chiave).
