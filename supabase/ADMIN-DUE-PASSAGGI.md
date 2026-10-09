# Pannello admin: verifica in due passaggi

Accesso al pannello con **password + codice di 6 cifre** generato da un'app di
autenticazione sul telefono (Google Authenticator, Microsoft Authenticator o
simili). È la funzione MFA "TOTP" nativa di Supabase: il codice cambia ogni 30
secondi e non dipende dalla posta elettronica.

**Dove sta la protezione.** Nel database: `is_admin()`, usata da tutte le regole
riservate agli amministratori (19 regole RLS e `admin_email_alumni`), risponde
"sì" solo se la sessione ha superato anche il codice dell'app (`aal2`). Con la
sola password, anche rubata, non si legge e non si modifica nulla.

Prova del 9/10/2026 in transazione annullata, account amministratore reale:
sola password → `is_admin` falso, 0 richieste di accesso visibili; con codice
dell'app → vero, 7 richieste visibili; un altro utente con codice → falso.

## Cosa cambia nel pannello

- **Primo accesso dopo l'aggiornamento**: dopo la password compare un codice QR
  da inquadrare con l'app, poi si inserisce il codice per confermare.
- **Accessi successivi**: password, poi codice dell'app.
- **Password dimenticata**: il link via email funziona come prima, ma per
  salvare la nuova password serve anche il codice dell'app.
- **Esci** ora chiude davvero la sessione anche sul server.

## Ordine di attivazione

| # | Passaggio | Chi |
|---|---|---|
| 0 | Verificare in Supabase → Authentication → Multi-Factor (MFA) che "App Authenticator (TOTP)" sia **abilitato** (lo è per impostazione predefinita). Se fosse disabilitato, il pannello non potrebbe attivare il codice | Michele |
| 1 | Unire il ramo `admin-2fa` (Create pull request → Merge) | Michele |
| 2 | Entrare nel pannello e attivare l'app: inquadrare il QR. **Consiglio:** nello stesso momento inserire la stessa chiave (il testo sotto il QR) anche in una seconda app o su un secondo dispositivo, come riserva | Michele |
| 3 | Applicare `supabase/migrazioni/2026-10-09c_admin_due_passaggi.sql`: da qui il database pretende il secondo passaggio | Claude, su conferma |
| 4 | (facoltativo, consigliato) Gestionale: in `_verificaAdminSupabase_`, dopo il controllo di `/auth/v1/user`, pretendere anche `aal2` (codice sotto) | Michele |

Tra il passaggio 1 e il 3 il pannello chiede già il codice, ma il database non
lo pretende ancora: nessun rischio di restare chiusi fuori.

### Codice per il gestionale (passaggio 4)

In `Codice.gs`, funzione `_verificaAdminSupabase_`, subito dopo la riga
`if (!utente || !utente.id) return false;` aggiungere:

```js
    // Solo sessioni verificate in due passaggi (password + app di autenticazione)
    var parte = String(jwt).split('.')[1] || '';
    parte += '===='.slice(0, (4 - parte.length % 4) % 4);
    var payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parte)).getDataAsString());
    if (payload.aal !== 'aal2') return false;
```

poi Salva e **Gestisci deployment → Nuova versione**.

## Se si perde il telefono

Con un solo amministratore, conviene la riserva del passaggio 2. Altrimenti:
Supabase → Authentication → Users → il proprio utente → eliminare il fattore
MFA (oppure chiederlo a Claude). Al login successivo il pannello propone una
nuova attivazione.

## Per tornare indietro

Rieseguire la definizione precedente di `is_admin()`, riportata in fondo alla
migrazione.
