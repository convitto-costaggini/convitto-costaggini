# Istruzioni per Claude — sito del Convitto «Costaggini»

## Registro delle migliorie (obbligatorio, ma privato)

Il registro dei lavori fatti vive solo nel repository **privato** `convitto-gestionale`
(file `REGISTRO-MIGLIORIE.md`). **Non va mai creato né copiato in questo repository**, che
è pubblico: ogni file qui è leggibile da chiunque, anche dal sito. Dopo ogni modifica che va
online, sul sito o sul gestionale, la voce si aggiunge lì, nel mese giusto, con la data e una
frase chiara per chi non è tecnico: niente gergo, niente nomi di file se non servono.

## Cosa non va mai in questo repository

Bozze di mail o lettere, decisioni interne, misure di sicurezza non ancora attive, note di
lavoro, chiavi o valori segreti (nemmeno vecchi: restano nella cronologia). Queste cose vanno
nel repository privato `convitto-gestionale` o fuori da GitHub. Nel dubbio, chiedere prima.

## Coerenza

- I fatti che cambiano ogni anno (retta, quota, scadenza, anno scolastico) hanno
  come fonte `ammissione.html`; `node scripts/check-consistency.js` deve passare.
- Le domande frequenti stanno solo in `faq.js`: le pagine le leggono da lì. La copia statica
  dentro le pagine (tra `<!--faq-statiche-->` e `<!--/faq-statiche-->`, per chi è senza JavaScript)
  si rigenera da sola con `scripts/build-faq-static.js`: non si modifica a mano.
- Il sito carica `nav.min.js`, `nav-header.min.js` e `style.min.css`: ogni
  modifica ai sorgenti va riportata anche nei file `.min`.

## Scelte da rispettare

- **Nessuna IA a pagamento** (decisione del 14/11/2026): il sito non manda nulla a servizi
  di IA a consumo; le lezioni si preparano con un assistente esterno scelto dal docente e si
  incollano.
- **Documenti ufficiali** (avvisi, circolari, regolamenti, moduli allegati agli avvisi): le
  date e i testi che riportano non si modificano. Se una data è passata, al massimo si
  propone una nota a parte, chiedendo prima.
- **Indirizzi di studio:** sono tre. Enogastronomia (approfondimento Cucina oppure Prodotti
  dolciari / Pasticceria), Servizi di sala e vendita (bar, ristorazione, sala e banqueting),
  Accoglienza turistica (servizi di ospitalità, agenzie di viaggio, promozione del territorio).
- **Movimento e audio (accessibilità, WCAG 2.1 AA, 2.2.2 e 1.4.2):** il sito deve restare a
  norma. Nessun movimento che parte da solo e dura più di 5 secondi (animazioni CSS, scorrimenti
  automatici, slideshow, zoom) senza un pulsante per fermarlo: le animazioni decorative si
  limitano a pochi cicli (non `infinite`) oppure hanno il pulsante «Ferma le animazioni»;
  gli slideshow automatici hanno «Metti in pausa» e non partono con «riduci movimento».
  Nessun video o audio che parte da solo. Elementi decorativi mai dietro al testo. Le
  didascalie che cambiano da sole non vanno in `aria-live`. Prima di pubblicare una pagina
  nuova, controllare con `document.getAnimations()` che non restino animazioni infinite.
- **Accessibilità, controllo prima di pubblicare:** il testo oro su fondo chiaro usa `var(--oro-txt)` (non `--oro`, che resta per bordi e sfondi); sui fondi scuri `--oro2` o `--oro3`. Testi secondari: mai opacità o trasparenze che portino il contrasto sotto 4,5:1. Ogni campo di modulo ha `<label for>` collegata a un `id`; pulsanti e pallini almeno 24x24 px di area di tocco; `aria-label` che contenga il testo visibile. Eseguire axe-core (npm i axe-core, Playwright) sulla pagina nuova o modificata.
