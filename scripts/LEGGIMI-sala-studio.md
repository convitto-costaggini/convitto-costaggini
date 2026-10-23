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
3. Copia tutta la risposta dell'IA, la incolla nel passo 3 (dopo essere entrato con la mail), sceglie se **condividerla nell'Archivio**
   e preme **Pubblica la lezione**: compaiono il codice e il QR.

Se il servizio non risponde, lo stesso passo 3 offre **Crea solo il link**: la lezione viaggia dentro il link (troppo lungo per un QR).

## Sette modi di studiare la stessa lezione
Nessun lavoro in più: tutti i modi nascono dal JSON che ogni lezione ha già (`studio/formati.js`).
Nella pagina della lezione i ragazzi scelgono «Come vuoi studiare?»; il link può già indicarlo con `&m=...`.
- **🧭 Percorso guidato** (`m` assente): le 7 tappe di sempre.
- **🔐 Escape room** (`m=escape`): fino a 5 lucchetti (vero/falso, frasi da completare, abbinamenti, sequenza,
  «di quale idea parla?», quiz); ogni lucchetto dà una o più lettere della parola magica dell'acronimo; con le
  lettere in ordine si apre la porta. Niente timer; dopo un errore compare l'aiuto.
- **🗺️ Costruisci la mappa** (`m=mappa`): l'argomento al centro, le idee chiave intorno senza nome; si tocca
  un'etichetta e poi la casella. Livello 2 a memoria: solo emoji e prima lettera.
- **🔍 Caccia all'errore** (`m=caccia`): il riassunto di un compagno distratto (7 frasi, fino a 3 errori presi dai
  vero/falso falsi e dalle frasi da completare con la parola sbagliata); si tocca la frase sbagliata e la si corregge.
- **🎭 Intervista impossibile** (`m=intervista`): l'ospite risponde in chat e si sceglie la risposta vera. Usa il campo
  `intervista` della lezione (personaggio, chi, emoji, domande con risposta e 2 sbagliate), che le istruzioni chiedono
  all'IA; nelle lezioni che non l'hanno, l'ospite è l'argomento stesso e le domande sono le flashcard.
- **⚡ Il minuto** (`m=minuto`): quante risposte giuste in 60 o 90 secondi; record nel telefono; alla fine gli errori
  da ripassare con la risposta giusta.
- **🏆 Sfida a squadre** (`m=squadre`): alla LIM, da 2 a 4 squadre a turno, rubapalla dopo un errore,
  tempo facoltativo (30 s o 1 minuto), classifica finale; tasti A B C D sulla tastiera; schermo intero.

## Accesso di docenti ed educatori
- A prova di malinteso: basta scrivere `nome.cognome` (il dominio si aggiunge da solo); se la chiave scade mentre si lavora
  ricompare subito il riquadro per entrare, e quanto scritto resta lì; «Crea una lezione» ricorda i campi anche se il
  telefono ricarica la pagina tornando dall'app dell'IA (`localStorage` `studio-bozza`, cancellata alla pubblicazione).
- Se si incollano per sbaglio le istruzioni (o lo schema con i segnaposto `...`) al posto della risposta dell'IA, la pagina
  lo dice e la funzione rifiuta la lezione. La creazione automatica si vede solo se è attiva (`ANTHROPIC_API_KEY`).
- Si entra con la **mail istituzionale** (`@alberghierorieti.it` o `@alberghierorieti.edu.it`): chi la scrive riceve per posta
  un codice di 6 cifre (vale 10 minuti, si usa una volta, 5 tentativi, 5 invii all'ora). Nessun elenco da tenere aggiornato:
  entra chiunque abbia una mail della scuola. Del codice il database conserva solo l'impronta (tabella `studio_otp`).
- Dopo l'accesso il dispositivo resta riconosciuto per **60 giorni** con un lasciapassare firmato dalla funzione
  (la chiave deriva da `SUPABASE_SERVICE_ROLE_KEY`). Sui computer condivisi, a fine lavoro: **Esci**.
  La scadenza è una misura di sicurezza (telefono perso, computer lasciato acceso): 60 giorni significano mail e codice
  4 o 5 volte in un anno scolastico. Se docenti ed educatori lo chiedono, si può prolungare fino alla fine dell'anno
  scolastico: si cambia `SESSIONE_MS` in `scripts/studio-genera/index.ts` (e la data mostrata in `studio/educatori.js`,
  dove si calcola `scade`), poi si ripubblica la funzione. Le pagine di accesso spiegano tutto questo in «Perché scade?».
- La mail parte dallo stesso script di Lingue (`scripts/lingue-invio-codici.gs`, segreti `GAS_URL` e `GAS_TOKEN`).
  Lo script riconosce il campo `servizio: "studio"` e firma la mail "Sala Studio della Scuola": dopo averlo aggiornato
  va pubblicata una **nuova versione** della stessa distribuzione (l'URL non cambia). Finché non lo si aggiorna, le mail
  arrivano lo stesso ma con l'intestazione di Lingue.
- **Codice di scorta**: `STUDIO_CODICI` resta valido, come il codice del Dipartimento di Lingue, per quando la posta non arriva.
  Le lezioni pubblicate con il codice di scorta non sono di nessuno in particolare: le può modificare chiunque sia entrato,
  e diventano di chi le modifica per primo.

- Le pagine riservate (`docente.html`, `modifica.html`, `archivio.html`) hanno in cima la stessa barra:
  Crea una lezione · Le mie lezioni · Archivio, con il nome di chi è entrato, la data fino a cui resta dentro ed **Esci**.
  Finché non si è entrati, la pagina mostra solo il percorso guidato in 3 passi (mail → codice dalla posta → dentro).

## Autori, modifica, condivisione
- L'**autore** di una lezione è la persona che l'ha pubblicata (il database conserva solo l'impronta della sua mail);
  il nome dell'autore si compila da solo dalla mail (mario.rossi@… → Mario Rossi) e si può cambiare.
- **Modifica** (`studio/modifica.html?c=CODICE`): editor a schede di ogni parte della lezione, oppure correzione con l'IA
  (si scrive cosa cambiare, si copia, si incolla la risposta). Codice e QR non cambiano.
- **Cancella**: dalla pagina Modifica; il QR smette di funzionare.
- **Condividi**: la lezione compare nell'Archivio di tutti i docenti ed educatori (servono materia e anno). Si può togliere quando si vuole.
- Le lezioni pubblicate prima di queste funzioni non hanno autore: diventano di chi le modifica per primo.
- Materie e anni seguono i quadri orari dell'istituto professionale "Enogastronomia e ospitalità alberghiera"
  (D.Lgs. 61/2017): biennio (1°-2°) e triennio (3°-5°), area generale e area di indirizzo (elenco in `studio/educatori.js`).

## Da fare
- [x] Database e funzione `studio-genera` attivati su Supabase; autori, condivisione, anno e accesso con la mail (23/10/2026).
- [ ] **Aggiornare lo script di posta**: script.google.com, progetto dello script di Lingue, incollare il nuovo
      `scripts/lingue-invio-codici.gs`, poi Esegui il deployment → Gestisci deployment → modifica (matita) →
      Versione: Nuova versione → Esegui il deployment. L'URL resta lo stesso.

## Facoltativo: creazione automatica (a consumo)
Nella pagina c'è anche "Creazione automatica": il sito manda le foto, o il solo argomento, direttamente all'IA, senza passare da
Claude, ChatGPT o Gemini. Funziona solo aggiungendo il segreto `ANTHROPIC_API_KEY` (chiave API da console.anthropic.com,
a consumo: stima 10-30 centesimi a lezione). Senza chiave quel riquadro avvisa che non è attivo; tutto il resto funziona.

## Limiti e controlli
- Solo chi è entrato (mail della scuola o codice di scorta) può pubblicare, vedere l'Archivio, modificare; al massimo 30 lezioni nuove all'ora in tutto.
- I ragazzi aprono una lezione solo dal codice: non possono elencarle. I progressi restano sul telefono del ragazzo.
- Se si modifica `scripts/studio-genera/index.ts` la funzione va ripubblicata su Supabase.
- Per togliere una lezione da SQL: `delete from public.studio_lezioni where codice = 'ABCDEF';`
