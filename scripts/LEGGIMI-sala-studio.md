# Sala studio (/studio): dalle foto del libro alla lezione interattiva

- `studio/` è il minisito: `index.html` (ingresso e codice), `lezione.html` (la lezione dei ragazzi), `docente.html` (foto → lezione → QR).
- `studio/studio.js` disegna la lezione: gancio, idee chiave, mnemotecniche (parola magica, palazzo della memoria,
  filastrocca a scomparsa progressiva, immagini mentali), esercizi (quiz, vero/falso, completa, abbina, in ordine),
  flashcard con ripetizione, sfida finale, cose da ricordare. Lettura ad alta voce, testo regolabile, carattere ad alta leggibilità.
- `studio/lezione.html?c=DEMO` è una lezione di esempio completa (`studio/demo.js`): funziona già senza configurare nulla.
- La funzione `scripts/studio-genera/index.ts` riceve le foto, le manda a Claude e salva solo la lezione (non le foto)
  nella tabella `studio_lezioni`, con un codice di 6 lettere per il QR.

## Da fare per attivarla (circa 10 minuti)
- [ ] **Database**: SQL Editor di Supabase, eseguire `supabase/migrazioni/2026-10-21_studio_lezioni.sql`.
- [ ] **Chiave dell'IA**: creare una chiave API su console.anthropic.com (con un limite di spesa mensile). Ogni lezione costa
      qualche centesimo.
- [ ] **Segreti**: Dashboard Supabase, Edge Functions, Secrets. Aggiungere `ANTHROPIC_API_KEY` (la chiave) e `STUDIO_CODICI`
      (il codice o i codici degli educatori, separati da virgola, es. `aquila-ventitre,orso-blu`). Non vanno scritti in chat né nel repository.
- [ ] **Funzione**: Edge Functions, nuova funzione `studio-genera` con il contenuto di `scripts/studio-genera/index.ts`,
      con "Verify JWT" disattivato (i controlli sono dentro la funzione).
- [ ] **Prova**: aprire `studio/docente.html`, fotografare due pagine, scrivere il codice, "Crea la lezione".

Finché la funzione non è attiva, la **modalità manuale** in fondo a `studio/docente.html` funziona già: si copiano le istruzioni,
si incollano in claude.ai con le foto, si incolla la risposta e si ottiene il link (la lezione viaggia dentro il link).

## Limiti e controlli
- Solo chi conosce un codice di `STUDIO_CODICI` può creare lezioni; al massimo 30 lezioni all'ora in tutto, 8 foto per lezione.
- I ragazzi aprono una lezione solo dal codice: nessuno può elencarle. I progressi restano sul telefono del ragazzo.
- Per cambiare il codice degli educatori basta cambiare `STUDIO_CODICI`.
- Per togliere una lezione: `delete from public.studio_lezioni where codice = 'ABCDEF';`
