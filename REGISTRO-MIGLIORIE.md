# Registro delle migliorie — Sito e Gestionale del Convitto

Registro unico di tutto ciò che migliora il **sito** (questo repository) e il
**gestionale** (repository `convitto-gestionale`, Apps Script, Supabase, pannello
admin, totem, Area famiglie). Serve per il **resoconto mensile**.

**Come si aggiorna:** ogni modifica pubblicata si aggiunge qui, nel mese giusto,
con data, area e una frase chiara per chi non è tecnico. Le modifiche fatte
direttamente nell'editor di Apps Script (che non passano da GitHub) vanno
aggiunte a mano nella sezione «Gestionale» del mese.

Riferimenti tecnici: tra parentesi i numeri delle pull request (PR) o i codici
dei commit, per ritrovare il dettaglio su GitHub.

---

## Novembre 2026

### In sintesi

- **Il sito è più chiaro per le famiglie.** È stato rivisto tre volte con gli occhi di due genitori, uno poco pratico del web e uno esperto. Ne sono usciti:
  - l'iscrizione spiegata in due passaggi;
  - le pagine doppie unificate;
  - un'unica raccolta di domande frequenti;
  - nomi uguali in tutto il sito;
  - l'anno scolastico sempre esplicito.
- **Il sito è più leggero e veloce.** Il caricamento della home è passato da circa 1,7 MB a circa 0,7 MB.
- **Meno servizi esterni, più privacy.** Mappe, ricerca delle città e consensi sono ora ospitati sul sito.
- **L'Aula digitale è aperta al pubblico**, con le pagine per le famiglie e il percorso di formazione per i docenti.

### Sito — chiarezza per le famiglie (14 novembre)

**Iscrizione** (PR #196, #200)
- «Come iscriversi» spiega i due momenti: tra gennaio e febbraio l'iscrizione sulla Piattaforma Unica del Ministero, con la spunta su «Convitto»; entro luglio il modulo di domanda e la quota.
- Le date sono allineate ovunque: Open Day tra novembre e gennaio, iscrizione tra gennaio e febbraio.
- Il modulo di domanda avverte di compilarlo solo dopo l'iscrizione sulla Piattaforma Unica. Dice anche che è il modulo del 2026/27, per le richieste in corso d'anno, e che quello del 2027/28 sarà disponibile a luglio 2027.
- Nel modulo, i campi del genitore sono neutri: «genitore/tutore che compila» e «altro genitore», al posto di «padre» e «madre».
- Gli Open Day sono indicati come «per le iscrizioni 2027/28».
- Sopra le tariffe c'è una nota per chi si iscrive ora: le tariffe 2027/28 saranno deliberate e pubblicate lì.

**Area riservata famiglie** (PR #196)
- Prima dell'accesso, la pagina spiega a chi è riservata, cosa contiene e come si richiede l'accesso.
- Il bottone nel menu si chiama «Accesso famiglie».

**Pagine doppie unificate** (PR #197, #198)
- Le domande frequenti stanno in un'unica pagina, «Domande frequenti»: in cima le 10 essenziali, sotto tutte le altre con la ricerca. Home, Open Day, Come iscriversi e Per i Genitori leggono le stesse risposte dalla stessa raccolta.
- Tutti i moduli sono in «Accoglienza & Modulistica», compresi la dichiarazione allergie e la richiesta del certificato di frequenza.
- Sono stati tolti due moduli doppi: le uscite autonome, perché vale la pagina Autorizzazioni, e la lista del corredo, perché vale «Fai la valigia».
- «Open Day e visite» e «Percorso per futuri convittori» sono due pagine con ruoli distinti.

**Nomi e testi coerenti** (PR #196, #197, #199, #200)
- Ogni pagina ha lo stesso nome in menu, footer, mappa del sito e ricerca.
- Le sigle sono sciolte: «Messaggio del nuovo Dirigente», «Il PTOF spiegato», «Amministrazione Trasparente», «Semiconvitto (senza pernottamento)».
- Nel footer ci sono i due indirizzi: il Convitto (Via Salaria, Open Day e accoglienza) e gli uffici (Via dei Salici 62).
- La domanda frequente sull'apertura spiega le 4 notti dal lunedì al giovedì, con il rientro domenicale su richiesta.
- In Accoglienza la data dell'accoglienza 2026/27 (11 settembre) è indicata come già svolta, con la nota che quella del 2027/28 sarà pubblicata lì.

**Errori corretti** (PR #199, #200)
- In home l'anno di apertura (1971) non si anima più: a metà animazione si leggeva «1694».
- Nella pagina di conferma del modulo di contatto, il numero di telefono chiamava un numero con una cifra in più.
- La ricerca interna ora trova «pagamento», «rate», «uscite», «autorizzazione» e «certificato».

**Grafica e telefono** (PR #196, #199, #200)
- Home riordinata: «Chi sei, oggi?» compare subito.
- Su telefono, «Come iscriversi» è nella prima schermata.
- Sul telefono c'è un solo bottone «⋯» al posto di cinque cerchi che coprivano il testo; si apre con le etichette scritte.
- La barra dei bottoni in home sta ferma, senza scorrimento automatico.
- Le schede della home sono in una griglia 2×2 sul telefono.
- Il conto alla rovescia dell'Open Day sta su una riga.
- Il percorso di navigazione in cima alle pagine va a capo in modo ordinato.
- Resta una sola freccia «scendi», non più una tra ogni sezione.

**Velocità** (PR #200)
- L'assistente virtuale e l'indice di ricerca (oltre 200 KB) si scaricano solo quando qualcuno li usa.
- Pesi delle pagine al caricamento:
  - home: da circa 1,7 MB a circa 0,7 MB;
  - Per i Genitori: da circa 590 KB a circa 380 KB.
- La pagina Open Day usa foto in formato leggero (WebP): circa 470 KB in meno.

**Controllo automatico di coerenza** (PR #197, #198, #200)
- Il controllo che verifica retta, quota, scadenza e anno scolastico ora guarda anche la raccolta delle domande frequenti (`faq.js`) e la pagina Domande frequenti.

### Sito — altre migliorie del mese

**Aula digitale**
- *2 nov.* Supporti alla lettura per gli studenti, con pannello, profili e generatore di link; norme verificate sulle fonti.
- *2 nov.* Visita guidata in 11 tappe, con la guida a sinistra e il sito vero a destra.
- *6 nov.* Visita per i docenti, con il calcolo del tempo risparmiato.
- *6–7 nov.* Testi allineati al parere della DPO del 4 novembre. I testi sono neutri: nessuna sigla DSA/BES/PDP, nessuna etichetta che identifichi chi usa i supporti.
- *7 nov.* Sala studio con ripasso a intervalli (1, 3 e 7 giorni), riscaldamento e «Spiegalo a un compagno». I dati restano sul dispositivo.
- *7 nov.* Intervista impossibile ascoltabile, battuta per battuta.
- *13 nov.* Aula digitale aperta al pubblico, con menu, pagina per le famiglie, informativa e avviso di sperimentazione.
- *13 nov.* Testi allineati all'autorizzazione ricevuta: studio pomeridiano, LIM e PC di laboratorio, dispositivo dello studente da casa.
- *13 nov.* I supporti alla lettura non richiedono più una chiave di anteprima.
- *13–14 nov.* Formazione dei docenti di 90 minuti: presentazione di 27 slide con note e PDF, percorso passo passo con missioni guidate, vista relatore in una finestra separata. La pagina è esclusa dai motori di ricerca.
- *14 nov.* Indicatore di attesa con barra di avanzamento nelle pagine dell'Aula.

**Privacy e servizi esterni**
- *4 nov.* Mappe di Rieti, della Valle Santa, del mondo e la ricerca delle città sono ospitate sul sito, al posto di servizi esterni (CARTO, Nominatim). Informativa e Cookie policy aggiornate.
- *4–6 nov.* Consensi online (Voci, immagini, premiazioni) in una pagina del sito (`consensi.html`), con la casella email istituzionale, al posto di un modulo Google.
- *6 nov.* Protezione antispam (tempo di compilazione) anche per Area famiglie e Alumni.
- *6 nov.* La mappa della pagina Contatti si carica solo su richiesta.
- *10 nov.* Le informative riportano la data di aggiornamento del 6 novembre.

**Contenuti**
- *1 nov.* Semiconvitto: modulo, informativa, domande frequenti e assistente allineati all'Avviso n. 58.
- *1 nov.* Presentazione dell'Open Day: scena sul progetto di e-learning.
- *10 nov.* Nuova pagina «Biblioteca e Lettura», con gli slideshow del Progetto Lettura.
- *11 nov.* Laboratorio Musicale: galleria con le foto reali della sala prove.
- *14 nov.* Tour virtuale: foto a 360° del Laboratorio Musicale, barra di caricamento con l'avanzamento reale, immagini non più deformate.
- *14 nov.* Menu «Il Convitto» diviso in tre gruppi; barra del menu adattiva (completa, compatta o a tendina).

**Ricerca su Google**
- *6 nov.* 21 pagine di servizio escluse dai risultati di Google, ma presenti nella ricerca interna. I quiz di «Scopri il tuo talento» sono di nuovo indicizzati.
- *7 nov.* Titoli, descrizioni e costi in evidenza nei risultati.
- *9 nov.* Dati strutturati degli eventi completati.

**Funzionamento**
- *10 nov.* Gli aggiornamenti automatici dell'indice di ricerca e della sitemap non si ostacolano più tra loro.
- *10 nov.* Il sito è stato ripubblicato dopo un blocco temporaneo di GitHub Pages.

### Gestionale

**Dal repository** (Area famiglie, Aula, Alumni, pannello admin)
- *3 nov.* Area riservata: il link di recupero della password, anche se scaduto, porta alla pagina giusta.
- *4 nov.* Iscrizione Alumni: la posizione sulla mappa viene dall'elenco delle città del sito, senza servizi esterni (funzione Supabase `iscrizione-alumni`).
- *6 nov.* Consensi online gestiti dal sito, con la casella istituzionale e la ricevuta via email.
- *13 nov.* Pulizia: tolta la vecchia funzione di accesso alle Lingue, sostituita dall'accesso unico dell'Aula.

**Repository `convitto-gestionale`:** nessuna modifica registrata a novembre (ultima: 1 ottobre, report presenze).

**Modifiche fatte direttamente in Apps Script:** *da completare a mano.*

---

## Ottobre 2026

*Da completare se serve per il resoconto.* Principali interventi registrati su GitHub:
- **Area riservata famiglie:** accesso con codice OTP, adesione con modulo firmato, abbinamento genitore-studente solo per codice, anteprima per l'amministratore, colloqui riservati.
- **Pannello admin:** verifica in due passaggi con app di autenticazione; chiavi tolte dalle pagine pubbliche (admin e totem).
- **Aula digitale:** struttura `/aula/`; accesso di docenti ed educatori con email istituzionale e codice monouso; Sala studio con lezioni dalle foto del libro, archivio per anno e materia.
- **Notizie:** formattazione del testo, descrizione delle immagini come testo alternativo, notizie nuove in cima.
- **Privacy:** meno terze parti (librerie e foto ospitate sul sito); trasferimenti fuori dallo SEE con la formula della DPO.
- **Gestionale (`convitto-gestionale`):** report presenze con il nominativo che va a capo invece di essere troncato (1 ottobre).
