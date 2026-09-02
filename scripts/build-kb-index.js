#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const OUT_PATH = path.join(ROOT, 'kb-index.json');

const MAX_BODY_CHARS = 2000;

function log(msg) {
  console.log(`[build-kb-index] ${msg}`);
}
function fail(msg) {
  console.error(`[build-kb-index] ERRORE: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(SITEMAP_PATH)) fail(`sitemap.xml non trovato in ${SITEMAP_PATH}`);

function locToFile(loc) {
  try {
    const u = new URL(loc.trim());
    let p = decodeURIComponent(u.pathname).replace(/^\/+/, '');
    if (p === '' || p.endsWith('/')) p += 'index.html';
    return p;
  } catch (e) {
    return null;
  }
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)));
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function pulisci(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

function estraiTitolo(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return '';
  return stripTags(m[1]).replace(/\s*\|\s*Convitto.*$/i, '').trim();
}

function estraiDescrizione(html) {
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  return m ? decodeEntities(m[1]).replace(/\s+/g, ' ').trim() : '';
}

function estraiHeadings(html) {
  const out = [];
  const re = /<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi;
  let m;
  while ((m = re.exec(html))) {
    const t = stripTags(m[1]);
    if (t) out.push(t);
  }
  return out;
}

function estraiCorpo(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const sorgente = mainMatch ? mainMatch[1] : (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [, html])[1];
  return stripTags(sorgente).slice(0, MAX_BODY_CHARS);
}

// --- Elenco pagine pubbliche da sitemap.xml ---
const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
const locs = [...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map(m => m[1]);
const files = [...new Set(locs.map(locToFile).filter(Boolean))].sort();

if (!files.length) fail('nessuna pagina trovata in sitemap.xml');

const pagine = [];
for (const file of files) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    log(`  attenzione: "${file}" in sitemap.xml ma non trovato su disco — saltato`);
    continue;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const html = pulisci(raw);

  const titolo = estraiTitolo(raw) || file;
  const descrizione = estraiDescrizione(raw);
  const headings = estraiHeadings(html);
  const corpo = estraiCorpo(html);

  const testo = [titolo, descrizione, headings.join(' '), corpo]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  pagine.push({ url: file, titolo, testo });
}

const nuovoContenuto = {
  generato: new Date().toISOString(),
  pagine
};

let daScrivere = true;
if (fs.existsSync(OUT_PATH)) {
  try {
    const attuale = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    const attualeSenzaData = JSON.stringify({ ...attuale, generato: null });
    const nuovoSenzaData = JSON.stringify({ ...nuovoContenuto, generato: null });
    daScrivere = attualeSenzaData !== nuovoSenzaData;
  } catch (e) {
    daScrivere = true; // file esistente non leggibile/valido: lo rigeneriamo
  }
}

if (!daScrivere) {
  log(`Nessuna modifica di contenuto: ${pagine.length} pagine indicizzate, kb-index.json invariato.`);
  process.exit(0);
}

fs.writeFileSync(OUT_PATH, JSON.stringify(nuovoContenuto, null, 0), 'utf8');
log(`kb-index.json rigenerato: ${pagine.length} pagine indicizzate.`);
