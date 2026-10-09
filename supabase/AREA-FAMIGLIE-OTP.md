# Area riservata famiglie: accesso con codice OTP

Questo documento descrive l'accesso in due passaggi (password + codice via email)
e l'ordine in cui attivarlo. **Finché non si completa l'ultimo passaggio, l'Area
resta sospesa** (avviso a tutta pagina in `area-riservata.html`).

## Come funziona

**Adesione (genitore)**
1. `richiesta-accesso.html` presenta il percorso in tre passaggi. Il modulo online
   resta nascosto finché il genitore non arriva dall'informativa.
2. `informativa-area-famiglie.html` (v1.3) contiene l'informativa, la sezione
   "Come aderire" e il modulo di consenso, che si compila a schermo, si stampa e
   si firma. Il modulo firmato va inviato all'indirizzo impostato in
   `area-famiglie.js` (`EMAIL_MODULI`) o consegnato in Convitto.
3. Il genitore invia la richiesta online con la stessa email del modulo.

**Abilitazione (amministratore)**
4. In `admin.html` → Famiglie → In attesa → **Approva**: la finestra chiede la
   data di ricezione del modulo firmato, un riferimento (email, protocollo…) e la
   conferma della verifica. I dati restano nella richiesta
   (`modulo_consenso_ricevuto`, `modulo_consenso_rif`). Chiede anche il
   **codice studente** del gestionale (con suggerimenti dai dati recenti): è
   l'unico elemento che collega il genitore ai dati del figlio. Poi, come
   prima, il gestionale crea l'account e invia le credenziali.

**Accesso (genitore)**
5. Email e password → la Edge Function `otp-famiglie` invia un codice di 6 cifre
   (valido 10 minuti, 5 tentativi, max 5 codici l'ora, uno al minuto).
6. Codice corretto → la sessione è verificata per 12 ore.

**Dove sta la protezione.** Non nella pagina, ma nel database: le regole RLS dei
genitori su `genitori_studenti` e sulle cinque tabelle `famiglie_*` richiedono
`famiglie_otp_ok()`, cioè un codice verificato **per la stessa sessione**. Con la
sola password non si legge nulla. Il codice è salvato solo come impronta SHA-256
(con il segreto `OTP_PEPPER`); le righe più vecchie di 30 giorni sono cancellate.

Prova eseguita il 9/10/2026 sul database reale, in una transazione annullata
(nessuna modifica rimasta): con un account genitore collegato a uno studente con
23 presenze, risultano 0 righe senza codice, 23 con codice verificato, 0 da
un'altra sessione dello stesso account e 0 a verifica più vecchia di 12 ore.

## File

| File | Cosa |
|---|---|
| `supabase/migrazioni/2026-10-09_area_famiglie_otp.sql` | tabella `famiglie_otp`, funzioni, regole RLS, colonne del modulo firmato |
| `supabase/migrazioni/2026-10-09b_abbinamento_per_codice.sql` | abbinamento genitore-studente solo per codice, riallineamento dei codici riassegnati |
| `supabase/functions/otp-famiglie/index.ts` | invio e verifica del codice |
| `supabase/functions/richiesta-accesso/index.ts` | versione informativa aggiornata a `area-famiglie-2026-10-09` |
| `supabase/gas-otp/Codice.gs` | progetto Apps Script che recapita l'email del codice |
| `area-riservata.html` | passaggio del codice dopo la password |
| `richiesta-accesso.html`, `area-famiglie.js` | percorso di adesione in tre passaggi |
| `informativa-area-famiglie.html`, `privacy.html` | informativa v1.3 |
| `admin.html` | approvazione con registrazione del modulo firmato |

## Stato al 9 ottobre 2026

| Tema | Stato |
|---|---|
| Parere RTD sull'OTP (8/10) | Favorevole; già inoltrato alla DPO |
| Benestare DPO all'Area con OTP | **In attesa** |
| Indirizzo per i moduli firmati | `rirh010007@istruzione.it` (casella istituzionale) |
| Codice | Ramo `area-famiglie-otp` su GitHub, non unito a `main` |
| Database e funzioni Supabase | Non ancora modificati |

## Ordine di attivazione

Rispettare l'ordine: `admin.html` scrive le nuove colonne, quindi **la migrazione
va applicata prima di pubblicare il sito**. Nella colonna "Chi": **Michele** =
operazione da fare di persona (account o pannelli personali); **Claude** =
eseguibile da Claude Code su conferma.

| # | Passaggio | Chi |
|---|---|---|
| 0 | Benestare della DPO sull'accesso con OTP (impegno ex art. 38 GDPR, nota del 28/09/2026) | Michele |
| 1 | **Apps Script**: nuovo progetto con l'account istituzionale, seguendo le istruzioni in testa a `supabase/gas-otp/Codice.gs` (proprietà `OTP_MAIL_TOKEN`, `provaInvio`, deployment come applicazione web); annotare l'URL `/exec` | Michele |
| 2 | **Secret Supabase** (Edge Functions → Secrets): `OTP_PEPPER` (stringa casuale di almeno 32 caratteri), `OTP_MAIL_URL`, `OTP_MAIL_TOKEN` | Michele (Claude prepara i valori casuali) |
| 3 | **Edge Function** `otp-famiglie`: deploy con **Verify JWT attivo** | Claude |
| 4 | **Edge Function** `richiesta-accesso`: ridistribuire (cambia solo la versione dell'informativa registrata) | Claude |
| 5 | **Migrazioni**, in quest'ordine: `2026-10-09_area_famiglie_otp.sql`, poi `2026-10-09b_abbinamento_per_codice.sql` | Claude |
| 6 | **Sito**: unire la richiesta di unione del ramo `area-famiglie-otp` su `main`. L'Area resta sospesa | Michele (o Claude su conferma) |
| 7 | **Gestionale**: nell'email con le credenziali (`creaAccountEInvia`) aggiungere: "A ogni accesso, dopo la password, riceverà via email un codice di verifica di 6 cifre" | Michele |
| 8 | **Prova completa** con un account di prova: richiesta → approvazione → email credenziali → accesso → codice → dati visibili; codice errato 5 volte; nuovo codice prima di un minuto (rifiutato) | Michele + Claude |
| 9 | **Attivazione**: in `area-riservata.html` rimuovere il blocco `<!-- ══ AVVISO SOSPENSIONE ACCESSO ══ -->` e, nell'informativa, il riquadro "Servizio attualmente sospeso" | Claude, su via libera della Dirigenza |

## Abbinamento per codice (migrazione 2026-10-09b)

Finora le regole riconoscevano lo studente anche per nome: con due omonimi un
genitore avrebbe visto i dati dell'altro. Analizzando i dati è emerso anche che
a settembre alcuni codici sono stati **riassegnati** (es. un codice usato ad
agosto per uno studente appartiene ora a un altro). La migrazione:

- riallinea 17 righe al codice attuale dello stesso studente;
- toglie il codice a 13 righe ambigue (nessun genitore le vede; restano nel
  gestionale e nel registro `correzioni_codici`);
- non completa i collegamenti dei genitori già esistenti: ogni famiglia rientra
  con il modulo firmato e l'approvazione con codice;
- da quel momento l'abbinamento avviene solo per codice.

Prova del 9/10/2026 in transazione annullata: dopo la migrazione nessun codice
corrisponde a più nomi e nessun nome a più codici; i trigger assegnano il codice
sia ai collegamenti nuovi sia a quelli già esistenti.

**Righe ambigue: decisione (9/10/2026).** Le 13 righe senza codice sono 4 + 4
presenze di fine agosto (STU-0005, STU-0070) e 5 presenze dal 18 al 23/09
(STU-0128, altra grafia del nome). I tre codici restano validi per i loro
titolari attuali; non si creano codici nuovi e il gestionale non va toccato.
Effetto per le famiglie: nullo in pratica (agosto è precedente all'anno
scolastico; le presenze nell'Area si vedono solo per 30 giorni). La tabella
`stessa_persona` resta vuota.

**Perché non ricapiti:** nel gestionale `GENERA_CodiciStudenti` riparte dal
numero più alto *presente nel foglio*: se si eliminano le righe con i numeri più
alti (diplomati) o si svuota la colonna Codice, i numeri vengono riassegnati.
La versione corretta è in `gestionale/GENERA_CodiciStudenti.gs` (contatore che
non torna mai indietro). Conviene anche proteggere la colonna Codice del foglio
STUDENTI (Dati → Proteggi intervalli).

## Punti collegati, da chiudere

- **Token in chiaro nelle pagine pubbliche** (`admin.html`, `totem.html`): in
  lavorazione sul ramo `token-fuori-dal-codice`.
