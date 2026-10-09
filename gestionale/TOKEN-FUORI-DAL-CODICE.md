# Token fuori dalle pagine pubbliche

Il repository e le pagine del sito sono pubblici: qualunque valore scritto nel
codice è leggibile da chiunque. Due chiavi del gestionale erano scritte in chiaro.

| Chiave | Dove era | Rischio | Soluzione |
|---|---|---|---|
| `MAIL_TOKEN` (in `admin.html` come `GAS_TOKEN`) | pannello admin | basso: le azioni che la usano (creazione account famiglie) richiedono anche una sessione admin Supabase valida, verificata dal gestionale con `_verificaAdminSupabase_` | il controllo della chiave viene tolto: resta quello, più solido, sulla sessione admin |
| `TOTEM_TOKEN` | `totem.html` | concreto: con la chiave e un nome (il QR contiene il nome dello studente) un utente del dominio può registrare entrate, uscite e pasti di qualunque convittore | la chiave si inserisce una volta sul dispositivo del totem e non sta più nella pagina; il valore attuale va sostituito |

## Passaggi (in quest'ordine)

### 1. Gestionale: togliere il controllo di `MAIL_TOKEN` (Michele)

In `Codice.gs`, nella funzione `doPost`, blocco
`if (data.action === 'inviaEmailAccesso' || data.action === 'creaAccountEInvia') {`,
eliminare queste righe (le prime del blocco):

```js
      const atteso = PropertiesService.getScriptProperties().getProperty('MAIL_TOKEN');
      if (!atteso || data.token !== atteso) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, message: 'Non autorizzato' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
```

lasciando il controllo `if (!_verificaAdminSupabase_(data.adminToken)) { … }`
che segue. Poi **Gestisci deployment → modifica → Nuova versione** (stesso URL).
Infine, in Proprietà script, eliminare `MAIL_TOKEN`.

Fatto questo, il pannello admin attuale continua a funzionare (invia ancora il
token, che viene semplicemente ignorato).

### 2. Sito: unire il ramo `token-fuori-dal-codice` (Claude, su conferma)

`admin.html` non contiene più la chiave; `totem.html` la chiede al primo avvio.

### 3. Totem: nuova chiave (Michele, al dispositivo)

1. Generare una chiave nuova (Claude la prepara: 64 caratteri casuali).
2. Gestionale → Proprietà script → `TOTEM_TOKEN` = la nuova chiave.
3. Sul dispositivo del totem aprire la pagina: compare "Configurazione del
   totem"; incollare la nuova chiave e Salva. Se la pagina era già aperta,
   ricaricarla oppure aprire `totem.html?nuova-chiave`.
4. Prova: una scansione in Mensa e una in Entrata/Uscita.

Tra il punto 2 e il punto 3 il totem rifiuta le scansioni ("Chiave del totem non
valida"): conviene farli uno dopo l'altro, fuori dagli orari dei pasti.

## Nota

Le vecchie chiavi restano visibili nella cronologia del repository: per questo
`MAIL_TOKEN` viene eliminata e `TOTEM_TOKEN` sostituita, non solo tolte dalle pagine.
