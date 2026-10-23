# Sala studio (/studio): dalle foto del libro alla lezione interattiva

- `studio/` è il minisito:
  - `index.html`: ingresso, codice della lezione;
  - `lezione.html`: la lezione dei ragazzi;
  - `docente.html`: crea una lezione e vedi **le mie lezioni**;
  - `modifica.html`: **correggi**, condividi o **cancella** una lezione (solo l'autore);
  - `archivio.html`: **Archivio** protetto delle lezioni condivise, per biennio/triennio, anno di corso e materia.
- `studio/studio.js` disegna la lezione: gancio, idee chiave, mnemotecniche (parola magica, palazzo della memoria,
  filastrocca a scomparsa progressiva, immagini mentali), esercizi (quiz, vero/falso, completa, abbina, in ordine),
  flashcard con ripetizione, sfida finale, cose da ricordare. Lettura ad alta voce, testo regolabile, carattere ad alta leggibilità.
- `studio/educatori.js`: parti comuni alle pagine degli educatori (materie e anni, istruzioni per l'IA, QR, chiamata alla funzione).
- `studio/lezione.html?c=DEMO` è una lezione di esempio completa (`studio/demo.js`).
- La funzione `scripts/studio-genera/index.ts` (pubblicata su Supabase) legge e scrive la tabella `studio_lezioni`.

## Come si crea una lezione (nessun costo a consumo)
1. In `studio/docente.html` l'educatore scrive l'argomento e (se vuole) materia, anno, classe e indicazioni, e preme **Copia le istruzioni**.
2. Apre Claude, ChatGPT o Gemini (versione gratuita o in abbonamento), allega le foto (pagine del libro, appunti o una mappa
   concettuale) oppure nessuna foto, incolla le istruzioni e invia. Senza foto la lezione nasce dall'argomento.
3. Copia tutta la risposta dell'IA, la incolla nel passo 3, scrive il codice educatori, sceglie se **condividerla nell'Archivio**
   e preme **Pubblica la lezione**: compaiono il codice e il QR.

Se il servizio non risponde, lo stesso passo 3 offre **Crea solo il link**: la lezione viaggia dentro il link (troppo lungo per un QR).

## Autori, modifica, condivisione
- L'**autore** di una lezione è chi l'ha pubblicata: il database conserva solo l'impronta (sha256) del suo codice educatori.
  Per questo conviene che **ogni educatore abbia il proprio codice** in `STUDIO_CODICI` (separati da virgola):
  con un codice unico per tutti, tutti sono "autori" di tutto.
- **Modifica** (`studio/modifica.html?c=CODICE`): editor a schede di ogni parte della lezione, oppure correzione con l'IA
  (si scrive cosa cambiare, si copia, si incolla la risposta). Codice e QR non cambiano.
- **Cancella**: dalla pagina Modifica; il QR smette di funzionare.
- **Condividi**: la lezione compare nell'Archivio di tutti gli educatori (servono materia e anno). Si può togliere quando si vuole.
- Le lezioni pubblicate prima di questa funzione non hanno autore: le può modificare chiunque abbia un codice educatori,
  e diventano di chi le modifica per primo.
- Materie e anni seguono i quadri orari dell'istituto professionale "Enogastronomia e ospitalità alberghiera"
  (D.Lgs. 61/2017): biennio (1°-2°) e triennio (3°-5°), area generale e area di indirizzo (elenco in `studio/educatori.js`).

## Da fare per attivarla
- [x] Database e funzione `studio-genera` attivati su Supabase (21/10/2026); autori, condivisione e anno (23/10/2026).
- [x] **Codice educatori**: segreto `STUDIO_CODICI` (Dashboard Supabase, Edge Functions, Secrets). Non va scritto in chat né nel repository.
- [ ] Facoltativo ma consigliato: un codice diverso per ogni educatore.

## Facoltativo: creazione automatica (a consumo)
Nella pagina c'è anche "Creazione automatica": il sito manda le foto, o il solo argomento, direttamente all'IA, senza passare da
Claude, ChatGPT o Gemini. Funziona solo aggiungendo il segreto `ANTHROPIC_API_KEY` (chiave API da console.anthropic.com,
a consumo: stima 10-30 centesimi a lezione). Senza chiave quel riquadro avvisa che non è attivo; tutto il resto funziona.

## Limiti e controlli
- Solo chi conosce un codice di `STUDIO_CODICI` può pubblicare, vedere l'Archivio, modificare; al massimo 30 lezioni nuove all'ora in tutto.
- I ragazzi aprono una lezione solo dal codice: non possono elencarle. I progressi restano sul telefono del ragazzo.
- Se si modifica `scripts/studio-genera/index.ts` la funzione va ripubblicata su Supabase.
- Per togliere una lezione da SQL: `delete from public.studio_lezioni where codice = 'ABCDEF';`
