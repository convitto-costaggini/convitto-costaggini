# Sito del Convitto Annesso "Costaggini"

Sito web del **Convitto Annesso** all'IPSSEOA "R. A. Costaggini" di Rieti.

Questo repository contiene il codice sorgente e i contenuti del sito, rilasciati
sotto licenza aperta in attuazione dell'**art. 69 del Codice dell'Amministrazione
Digitale** (D.Lgs. 82/2005), per consentirne il riuso da parte di altre pubbliche
amministrazioni.

## Titolarità

La titolarità del codice sorgente e dei contenuti è dell'**Istituto Professionale
di Stato per i Servizi per l'Enogastronomia e l'Ospitalità Alberghiera
"R. A. Costaggini"** di Rieti.

- Codice meccanografico: **RIRH010007**
- Codice fiscale: **80008130579**
- Sede: Via Salaria s.n.c., 02100 Rieti (RI)
- Titolare del trattamento dei dati personali: l'Istituzione scolastica, nella
  persona del Dirigente Scolastico pro tempore.

## Natura del sito

Questo sito è una **sezione tematica** del sito istituzionale dell'IPSSEOA
"R. A. Costaggini", dedicata al Convitto annesso. **Non costituisce un sito
istituzionale autonomo**: il Convitto è amministrativamente parte dell'Istituto
(stesso codice meccanografico) e gli adempimenti istituzionali generali
(Amministrazione Trasparente, Albo, modello di sito scolastico, pagoPA) restano
in capo al sito istituzionale principale dell'Istituto
(<https://www.alberghierorieti.edu.it>).

Pubblicazione prevista come sottodominio: `convitto.alberghierorieti.edu.it`.

## Tecnologie

- Sito statico in **HTML, CSS e JavaScript vanilla** (nessun framework lato build).
- Architettura condivisa iniettata via `nav.js` (header, footer, drawer, chatbot,
  traduttore).
- Backend dati su **Supabase** (PostgreSQL + Auth + Edge Functions), con Row Level
  Security attiva su tutte le tabelle.
- Deploy su **GitHub Pages**.
- Assistente virtuale ("chatbot") interamente locale, senza chiamate a servizi LLM
  esterni.

## Accessibilità

Il sito è stato sviluppato in conformità ai criteri **WCAG 2.1 livello AA**. La
dichiarazione di accessibilità formale è redatta e pubblicata dal Dirigente
Scolastico / Responsabile della Transizione Digitale tramite l'applicazione AgID
(<https://form.agid.gov.it>) ed è esposta nel footer del sito.

## Privacy e cookie

L'informativa sul trattamento dei dati personali (art. 13 GDPR) e la cookie policy
sono pubblicate rispettivamente in `privacy.html` e `cookie-policy.html` e
linkate nel footer. Il sito utilizza esclusivamente cookie tecnici; l'eventuale
traduzione automatica (Google Translate) è subordinata al consenso dell'utente.

## Licenza

Il codice è rilasciato sotto licenza **GNU Affero General Public License v3.0
(AGPL-3.0)**. Vedi il file [`LICENSE`](./LICENSE).

`SPDX-License-Identifier: AGPL-3.0-only`

## Riuso

Il repository è descritto dal file [`publiccode.yml`](./publiccode.yml), conforme
allo standard di Developers Italia, per l'indicizzazione nel catalogo del software
a riuso delle pubbliche amministrazioni.

## Contatti

Istituzione scolastica: <rirh010007@istruzione.it>
