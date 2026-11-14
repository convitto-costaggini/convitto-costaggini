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
