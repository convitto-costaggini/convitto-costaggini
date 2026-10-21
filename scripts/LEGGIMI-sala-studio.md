# Sala studio (/studio): dalle foto del libro alla lezione interattiva

- `studio/` è il minisito: `index.html` (ingresso e codice), `lezione.html` (la lezione dei ragazzi), `docente.html` (pagina degli educatori).
- `studio/studio.js` disegna la lezione: gancio, idee chiave, mnemotecniche (parola magica, palazzo della memoria,
  filastrocca a scomparsa progressiva, immagini mentali), esercizi (quiz, vero/falso, completa, abbina, in ordine),
  flashcard con ripetizione, sfida finale, cose da ricordare. Lettura ad alta voce, testo regolabile, carattere ad alta leggibilità.
- `studio/lezione.html?c=DEMO` è una lezione di esempio completa (`studio/demo.js`).
- La funzione `scripts/studio-genera/index.ts` (già pubblicata su Supabase) salva la lezione nella tabella `studio_lezioni`
  con un codice di 6 lettere per il QR.

## Come si crea una lezione (nessun costo a consumo)
1. In `studio/docente.html` l'educatore scrive (se vuole) materia, classe e indicazioni e preme **Copia le istruzioni**.
2. Apre Claude, ChatGPT o Gemini (versione gratuita o in abbonamento), allega le foto delle pagine, incolla le istruzioni e invia.
3. Copia tutta la risposta dell'IA, la incolla nel passo 3, scrive il codice educatori e preme **Pubblica la lezione**:
   la lezione viene salvata e compaiono il codice e il QR.

Se il servizio non risponde, lo stesso passo 3 offre **Crea solo il link**: la lezione viaggia dentro il link (troppo lungo per un QR).

## Da fare per attivarla
- [x] Database e funzione `studio-genera` attivati su Supabase (21/10/2026).
- [ ] **Codice educatori**: Dashboard Supabase, Edge Functions, Secrets, aggiungere `STUDIO_CODICI` con il codice o i codici
      degli educatori, separati da virgola (es. `aquila-ventitre,orso-blu`). Non va scritto in chat né nel repository.
- [ ] **Prova**: aprire `studio/docente.html` e seguire i passi 1-2-3.

## Facoltativo: creazione automatica dalle foto (a consumo)
Nella pagina c'è anche "Creazione automatica dalle foto": il sito manda le foto direttamente all'IA, senza passare da Claude, ChatGPT o Gemini.
Funziona solo aggiungendo il segreto `ANTHROPIC_API_KEY` (chiave API da console.anthropic.com, a consumo: stima 10-30 centesimi
a lezione). Senza chiave quel riquadro avvisa che non è attivo; tutto il resto funziona.

## Limiti e controlli
- Solo chi conosce un codice di `STUDIO_CODICI` può pubblicare lezioni; al massimo 30 lezioni all'ora in tutto.
- I ragazzi aprono una lezione solo dal codice: non possono elencarle. L'elenco di tutte le lezioni è in fondo a `studio/docente.html`
  e si vede solo con il codice educatori, da qualsiasi dispositivo. I progressi restano sul telefono del ragazzo.
- Se si modifica `scripts/studio-genera/index.ts` la funzione va ripubblicata su Supabase.
- Per togliere una lezione: `delete from public.studio_lezioni where codice = 'ABCDEF';`
