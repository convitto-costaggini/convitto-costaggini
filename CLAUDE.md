# Istruzioni per Claude — sito del Convitto «Costaggini»

## Registro delle migliorie (obbligatorio)

Ogni modifica che va online, sul sito o sul gestionale, va aggiunta a
`REGISTRO-MIGLIORIE.md` **nello stesso commit o nella stessa pull request**,
nel mese giusto:

- per il sito, nella sezione del tema (iscrizione, Aula digitale, privacy, velocità…);
- per il gestionale (Apps Script, Supabase, pannello admin, totem, Area famiglie,
  repository `convitto-gestionale`), nella sezione «Gestionale» del mese.

Ogni voce ha la data e una frase chiara per chi non è tecnico; tra parentesi il
numero della pull request. Il registro serve per il resoconto mensile: niente
gergo, niente nomi di file se non servono.

## Coerenza

- I fatti che cambiano ogni anno (retta, quota, scadenza, anno scolastico) hanno
  come fonte `ammissione.html`; `node scripts/check-consistency.js` deve passare.
- Le domande frequenti stanno solo in `faq.js`: le pagine le leggono da lì.
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
