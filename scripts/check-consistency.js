#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

function leggi(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function fail(msg) {
  console.error(`[check-consistency] ERRORE: ${msg}`);
  process.exit(1);
}

// ── 1. Estrae i valori canonici dalla fonte primaria: ammissione.html ──
const primaria = leggi('ammissione.html');
if (!primaria) fail('ammissione.html non trovato — impossibile determinare i valori di riferimento');

function estrai(nomeCampo, regex) {
  const m = primaria.match(regex);
  if (!m) fail(
    `impossibile trovare "${nomeCampo}" in ammissione.html con il pattern atteso. ` +
    `Probabilmente il testo della pagina è cambiato: aggiorna il pattern in questo script ` +
    `(scripts/check-consistency.js) invece di ignorare l'errore.`
  );
  return m[1];
}

const SCADENZA = estrai('scadenza domanda', /Entro il (\d{1,2}\s+\w+)/);           // es. "30 luglio"
const QUOTA    = estrai('quota di iscrizione', /quota di iscrizione di € ([\d.,]+)/); // es. "450,00"
const RETTA    = estrai('retta annua', /Totale annuo<\/span><strong[^>]*>€\s*([\d.,]+)/); // es. "1.600"
const ANNO     = estrai('anno scolastico', /A\.S\.\s*(\d{4}\/\d{2,4})/);           // es. "2026/27"

const QUOTA_NUM = QUOTA.replace(/[.,]00$/, '').replace(/[.,]/g, '');
const RETTA_NUM = RETTA; // "1.600"
const ANNO_INIZIO = ANNO.split('/')[0];                                // "2026/27" -> "2026"

console.log('[check-consistency] Valori di riferimento letti da ammissione.html:');
console.log(`  scadenza domanda   = "${SCADENZA}"`);
console.log(`  quota iscrizione   = € ${QUOTA} (cercata anche come "${QUOTA_NUM}")`);
console.log(`  retta annua        = € ${RETTA}`);
console.log(`  anno scolastico    = A.S. ${ANNO} (cercato anche come "${ANNO_INIZIO}")`);
console.log('');

const TARGET = [
  { file: 'chatbot.js', fatti: [
      { nome: 'scadenza', contains: SCADENZA },
      { nome: 'quota iscrizione', contains: QUOTA_NUM },
      { nome: 'retta annua', contains: RETTA_NUM },
      { nome: 'anno scolastico', contains: ANNO },
  ]},
  { file: 'openday.html', fatti: [
      { nome: 'scadenza', contains: SCADENZA },
      { nome: 'quota iscrizione', contains: QUOTA_NUM },
      { nome: 'retta annua', contains: RETTA_NUM },
      { nome: 'anno scolastico', contains: ANNO },
  ]},
  { file: 'genitori.html', fatti: [
      { nome: 'retta annua', contains: RETTA_NUM },
      { nome: 'anno scolastico', contains: ANNO },
  ]},
  { file: 'domanda-ammissione.html', fatti: [
      { nome: 'scadenza', contains: SCADENZA },
      { nome: 'quota iscrizione', contains: QUOTA_NUM },
      { nome: 'retta annua', contains: RETTA_NUM },
  ]},
  { file: 'index.html', fatti: [
      { nome: 'scadenza', contains: SCADENZA },
  ]},
  { file: 'regolamento-guida.html', fatti: [
      { nome: 'scadenza', contains: SCADENZA },
  ]},
];

let mismatches = 0;
for (const t of TARGET) {
  const testo = leggi(t.file);
  if (testo === null) {
    console.log(`SALTATO — ${t.file} non trovato (forse rinominato/rimosso: aggiorna questo script)`);
    continue;
  }
  for (const f of t.fatti) {
    const varianti = Array.isArray(f.contains) ? f.contains : [f.contains];
    const ok = varianti.some(v => testo.includes(v));
    if (ok) {
      console.log(`OK   — ${t.file}: ${f.nome} coincide con ammissione.html`);
    } else {
      mismatches++;
      console.log(`MISMATCH — ${t.file}: ${f.nome} NON coincide con ammissione.html (atteso: "${varianti.join('" oppure "')}")`);
    }
  }
}

console.log('');
if (mismatches > 0) {
  console.error(`[check-consistency] Trovate ${mismatches} discrepanze — vedi sopra. Uno di questi file ha un valore vecchio che va allineato ad ammissione.html (fonte primaria), oppure ammissione.html è cambiato ed è lui il valore ora corretto: in tal caso allinea le copie.`);
  process.exit(1);
}
console.log('[check-consistency] Tutti i fatti volatili controllati coincidono con ammissione.html. Nessuna discrepanza trovata.');
