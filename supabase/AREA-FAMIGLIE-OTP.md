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
   (`modulo_consenso_ricevuto`, `modulo_consenso_rif`). Poi, come prima, il
   gestionale crea l'account e invia le credenziali.

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
| `supabase/functions/otp-famiglie/index.ts` | invio e verifica del codice |
| `supabase/functions/richiesta-accesso/index.ts` | versione informativa aggiornata a `area-famiglie-2026-10-09` |
| `supabase/gas-otp/Codice.gs` | progetto Apps Script che recapita l'email del codice |
| `area-riservata.html` | passaggio del codice dopo la password |
| `richiesta-accesso.html`, `area-famiglie.js` | percorso di adesione in tre passaggi |
| `informativa-area-famiglie.html`, `privacy.html` | informativa v1.3 |
| `admin.html` | approvazione con registrazione del modulo firmato |

## Ordine di attivazione

Rispettare l'ordine: `admin.html` scrive le nuove colonne, quindi **la migrazione
va applicata prima di pubblicare il sito**.

1. **Apps Script**: seguire le istruzioni in testa a `supabase/gas-otp/Codice.gs`
   (nuovo progetto con l'account istituzionale, proprietà `OTP_MAIL_TOKEN`,
   `provaInvio`, deployment come applicazione web). Annotare l'URL `/exec`.
2. **Secret Supabase** (Edge Functions → Secrets): `OTP_PEPPER` (stringa casuale
   di almeno 32 caratteri), `OTP_MAIL_URL`, `OTP_MAIL_TOKEN`.
3. **Edge Function** `otp-famiglie`: deploy con **Verify JWT attivo**.
4. **Edge Function** `richiesta-accesso`: ridistribuire (cambia solo la versione
   dell'informativa registrata).
5. **Migrazione**: eseguire `2026-10-09_area_famiglie_otp.sql`.
6. **Sito**: unire il ramo `area-famiglie-otp` su `main`. L'Area resta sospesa.
7. **Gestionale**: nell'email con le credenziali (`creaAccountEInvia`) aggiungere
   una riga: "A ogni accesso, dopo la password, riceverà via email un codice di
   verifica di 6 cifre".
8. **Prova completa** con un account di prova: richiesta → approvazione → email
   credenziali → accesso → codice → dati visibili; codice errato 5 volte;
   nuovo codice prima di un minuto (rifiutato).
9. **DPO**: sottoporre la funzionalità prima dell'attivazione, come da impegno ex
   art. 38 GDPR (nota del 28/09/2026).
10. **Attivazione**: in `area-riservata.html` rimuovere il blocco
    `<!-- ══ AVVISO SOSPENSIONE ACCESSO ══ -->` e, nell'informativa, il riquadro
    "Servizio attualmente sospeso".
