#!/usr/bin/env node
/*
 * Copia statica delle Domande frequenti dentro le pagine.
 *
 * Le domande stanno SOLO in faq.js. Questo script esegue faq.js con la sua
 * stessa funzione di disegno e scrive il risultato dentro ogni contenitore
 * [data-faq] / [data-faq-ids] delle pagine, tra i commenti
 * <!--faq-statiche--> e <!--/faq-statiche-->.
 *
 * Così le risposte si leggono anche se JavaScript non parte (connessione
 * debole, telefono vecchio, script bloccato) e i motori di ricerca le
 * trovano nella pagina. Quando faq.js parte, sostituisce la copia con la
 * versione interattiva (ricerca, categorie): il testo è identico.
 *
 * Non si modifica a mano: lo rigenera il workflow update-faq-static.yml
 * a ogni modifica su main. Uso locale: node scripts/build-faq-static.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FAQ_SRC = fs.readFileSync(path.join(ROOT, 'faq.js'), 'utf8');
const INIZIO = '<!--faq-statiche-->';
const FINE = '<!--/faq-statiche-->';

// Esegue faq.js su un "documento" finto con un solo contenitore e restituisce l'HTML prodotto.
function disegna(attributi) {
  let html = '';
  const contenitore = {
    getAttribute: (n) => (n in attributi ? attributi[n] : null),
    hasAttribute: (n) => n in attributi,
    set innerHTML(v) { html = v; },
    get innerHTML() { return html; },
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const finto = { appendChild() {}, set textContent(v) {} };
  const document = {
    readyState: 'complete',
    head: finto,
    getElementById: () => null,
    createElement: () => ({ set id(v) {}, set textContent(v) {} }),
    querySelectorAll: () => [contenitore],
    addEventListener() {},
  };
  vm.runInNewContext(FAQ_SRC, { document, window: {}, console });
  return html;
}

// Versione per chi è senza JavaScript: niente ricerca né categorie (non funzionerebbero),
// e senza la freccia disegnata: basta quella del browser.
function semplifica(html) {
  return html
    .replace(/<div class="faqx-search">[\s\S]*?<\/div>/, '')
    .replace(/<div class="faqx-cats">[\s\S]*?<\/div>/, '')
    .replace(/<p class="faqx-empty">[\s\S]*?<\/p>/, '')
    .replace(/<svg class="faqx-arr"[\s\S]*?<\/svg>/g, '');
}

function leggiAttributi(tag) {
  const a = {};
  const re = /(data-faq[\w-]*)(?:="([^"]*)")?/g;
  let m;
  while ((m = re.exec(tag))) a[m[1]] = m[2] === undefined ? '' : m[2];
  return a;
}

const pagine = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let cambiate = 0;
for (const nome of pagine) {
  const file = path.join(ROOT, nome);
  const prima = fs.readFileSync(file, 'utf8');
  // <div ... data-faq...> seguito da contenitore vuoto o da una copia statica precedente
  const re = new RegExp('(<div\\b[^>]*\\bdata-faq(?:-ids)?\\b[^>]*>)(?:\\s*' + INIZIO + '[\\s\\S]*?' + FINE + '\\s*)?(</div>)', 'g');
  const dopo = prima.replace(re, (tutto, apertura, chiusura) => {
    const html = semplifica(disegna(leggiAttributi(apertura)));
    if (!html) return apertura + chiusura;
    return apertura + INIZIO + html + FINE + chiusura;
  });
  if (dopo !== prima) {
    fs.writeFileSync(file, dopo);
    cambiate++;
    console.log('aggiornata:', nome);
  }
}
console.log(cambiate ? `${cambiate} pagine aggiornate.` : 'Copie statiche già allineate a faq.js.');
