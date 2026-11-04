// Uso: npm i all-the-cities@3 comuni-province-regioni@0.4.3 in una cartella G, poi: node scripts/build-citta.js G dati
// Costruisce dati/citta-italia.json e dati/citta-mondo.json
// Fonti: comuni-province-regioni (nomi ISTAT, MIT) + all-the-cities (GeoNames, CC BY 4.0)
const G = process.argv[2], OUT = process.argv[3];
const fs = require('fs');
const all = require(G + '/node_modules/all-the-cities');
const Cm = require(G + '/node_modules/comuni-province-regioni/lib/city.js');
const r5 = x => Math.round(x * 1e4) / 1e4;
const byMuni = {};
for (const c of all) if (c.country === 'IT' && c.muni) {
  const p = byMuni[c.muni];
  const score = (c.featureCode.startsWith('PPLA') || c.featureCode === 'PPLC' ? 1e9 : 0) + c.population;
  if (!p || score > p.s) byMuni[c.muni] = { c, s: score };
}
// enum interno: indice -> "NOME_123456"
const src = fs.readFileSync(G + '/node_modules/comuni-province-regioni/lib/city.js', 'utf8');
const keyByIdx = {};
for (const m of src.matchAll(/City\[City\["([A-Z0-9_]+)_(\d{6})"\] = (\d+)\]/g)) keyByIdx[m[3]] = m[2];
const it = []; let manca = [];
for (const [i, a] of Object.entries(Cm.CITIES_ATTRIBUTES)) {
  const istat = keyByIdx[i]; const g = byMuni[istat];
  const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const g2 = g || (() => { const c = all.find(c => c.country === 'IT' && norm(c.name) === norm(a.name)); return c && { c }; })();
  if (!g2) { manca.push(a.name + ' (' + a.province + ')'); continue; }
  const [lng, lat] = g2.c.loc.coordinates;
  it.push([a.name, a.province, r5(lat), r5(lng)]);
}
it.sort((a, b) => a[0].localeCompare(b[0], 'it'));
const mondo = all.filter(c => c.country !== 'IT' && c.population >= 15000)
  .sort((a, b) => b.population - a.population)
  .map(c => [c.name, c.country, r5(c.loc.coordinates[1]), r5(c.loc.coordinates[0])]);
fs.writeFileSync(OUT + '/citta-italia.json', JSON.stringify(it));
fs.writeFileSync(OUT + '/citta-mondo.json', JSON.stringify(mondo));
console.log('italia', it.length, 'senza coordinate', manca.length, manca.slice(0, 15).join(', '));
console.log('mondo', mondo.length);
