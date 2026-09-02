#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITEMAP_PATH = path.join(process.cwd(), 'sitemap.xml');

const SKIP_FILES = new Set([
  'natale2024.html',
]);

function log(msg) {
  console.log(`[update-sitemap-lastmod] ${msg}`);
}

function fail(msg) {
  console.error(`[update-sitemap-lastmod] ERRORE: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(SITEMAP_PATH)) {
  fail(`sitemap.xml non trovato in ${SITEMAP_PATH}`);
}

const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');

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

function lastCommitDate(file) {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    log(`  attenzione: file "${file}" referenziato in sitemap.xml ma non trovato su disco — lastmod invariato`);
    return null;
  }
  try {
    const out = execSync(
      `git log -1 --format=%cd --date=short -- "${file}"`,
      { encoding: 'utf8' }
    ).trim();
    return out || null;
  } catch (e) {
    return null;
  }
}

let changedCount = 0;
let skippedCount = 0;

// Sostituisce, blocco per blocco <url>...</url>, il lastmod se necessario.
const updatedXml = xml.replace(
  /<url>([\s\S]*?)<\/url>/g,
  (block) => {
    const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/);
    if (!locMatch) return block;

    const loc = locMatch[1];
    const file = locToFile(loc);
    if (!file) return block;

    if (SKIP_FILES.has(path.basename(file))) {
      skippedCount++;
      return block;
    }

    const newDate = lastCommitDate(file);
    if (!newDate) return block;

    const lastmodMatch = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/);
    if (!lastmodMatch) {
      // Nessun tag lastmod presente: lo aggiungiamo subito dopo <loc>.
      changedCount++;
      return block.replace(
        /(<loc>[\s\S]*?<\/loc>)/,
        `$1\n    <lastmod>${newDate}</lastmod>`
      );
    }

    const currentDate = lastmodMatch[1].trim();
    if (currentDate === newDate) return block;

    changedCount++;
    log(`  ${file}: ${currentDate} -> ${newDate}`);
    return block.replace(
      /<lastmod>[\s\S]*?<\/lastmod>/,
      `<lastmod>${newDate}</lastmod>`
    );
  }
);

if (changedCount === 0) {
  log(`Nessuna modifica necessaria (${skippedCount} pagine escluse per policy).`);
  process.exit(0);
}

fs.writeFileSync(SITEMAP_PATH, updatedXml, 'utf8');
log(`Aggiornate ${changedCount} date, ${skippedCount} pagine escluse per policy. sitemap.xml riscritto.`);
