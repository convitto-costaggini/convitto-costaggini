# Area riservata docenti di /lingue

Le pagine dell'area docenti (hub, Lunedì, Misuratelo voi, presentazione, Lezione in 5 minuti, Verifiche, Crea) e la scheda Docente
con le verifiche delle lezioni non sono nel repository in chiaro: stanno in `lingue/docenti/*.enc`, cifrate con AES-256-GCM.
Le pagine pubbliche `lingue/<nome>.html` sono solo un guscio che chiede l'accesso (`lingue/accesso.js`).

## Come si entra
- **E-mail istituzionale e codice monouso**: il docente scrive la sua e-mail, riceve un codice per posta, lo inserisce. Il codice parte solo
  per gli indirizzi presenti nella tabella `lingue_docenti` (Supabase). Il database consegna la chiave di decifratura solo a chi ha
  una sessione valida e un indirizzo abilitato (funzione `lingue_accesso`).
- **Codice del Dipartimento**: una chiave di scorta (`lingue/docenti/accesso-dipartimento.json`) apribile con un codice condiviso.

## Da fare una volta sola su Supabase (Dashboard)
1. **Authentication, URL Configuration**: aggiungere `https://convitto.alberghierorieti.edu.it/lingue/*` tra i Redirect URLs.
2. **Authentication, Email Templates**: nei modelli **Magic Link** e **Confirm signup** scrivere il codice, per esempio:
   `Il vostro codice di accesso all'area docenti è: {{ .Token }}` (senza il codice il messaggio contiene solo un collegamento e l'accesso non funziona).
3. **Posta in uscita (SMTP)**: il servizio predefinito di Supabase invia pochissimi messaggi all'ora e solo a indirizzi della propria
   organizzazione, quindi per i colleghi serve un SMTP proprio. In **Authentication, SMTP Settings** si può usare l'account Google Workspace
   della scuola (smtp.gmail.com, porta 465, con una password per le app) o un altro servizio di posta.
4. **Authentication, Providers, Email**: lasciare attiva la conferma dell'e-mail; durata del codice a piacere (predefinita 1 ora).

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
