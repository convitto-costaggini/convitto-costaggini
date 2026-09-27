// Elenco delle pagine HTML pubbliche che Google può indicizzare: tutte le
// pagine .html nella radice del sito, tranne quelle marcate "noindex" e i
// file di verifica di Google Search Console (google*.html).
// Usato da update-sitemap-lastmod.js (per aggiungere alla sitemap le pagine
// nuove) e da build-kb-index.js (per non dimenticarle nella ricerca interna).

const fs = require('fs');
const path = require('path');

function isNoindex(html) {
  const m = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  return !!(m && /noindex/i.test(m[1]));
}

function pagineIndicizzabili(root) {
  return fs.readdirSync(root)
    .filter(f => f.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(f))
    .filter(f => !isNoindex(fs.readFileSync(path.join(root, f), 'utf8')))
    .sort();
}

module.exports = { pagineIndicizzabili };
