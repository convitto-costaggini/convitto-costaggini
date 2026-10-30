#!/usr/bin/env node
/* Strumenti per i materiali riservati di /lingue (area docenti).
   Le pagine riservate stanno nel repository solo cifrate (aula/lingue/docenti/*.enc, AES-256-GCM).
   La chiave NON è nel repository: sta nel database (tabella lingue_chiave) e in un file locale.
   Uso:
     LINGUE_CHIAVE=<base64> node scripts/lingue-riservato.js cifra <file> <nome>      cifra un file in lingue/docenti/<nome>.enc
     LINGUE_CHIAVE=<base64> node scripts/lingue-riservato.js decifra <nome> <uscita>  riporta in chiaro un file (per modificarlo)
     LINGUE_CHIAVE=<base64> node scripts/lingue-riservato.js scorta <codice>          riscrive la chiave di scorta del Dipartimento
     node scripts/lingue-riservato.js stub <nome>                                     scrive la pagina pubblica lingue/<nome>.html
     LINGUE_CHIAVE=<base64> node scripts/lingue-riservato.js tutto <cartella>         cifra tutte le pagine .html della cartella e scrive i rispettivi stub
*/
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const RADICE = path.join(__dirname, '..', 'aula', 'lingue');
const DEST = path.join(RADICE, 'docenti');
const ITER = 600000;

function chiave() {
  const k = process.env.LINGUE_CHIAVE;
  if (!k) { console.error('Manca LINGUE_CHIAVE (chiave base64, 32 byte).'); process.exit(1); }
  const b = Buffer.from(k, 'base64'); if (b.length !== 32) { console.error('Chiave non valida.'); process.exit(1); }
  return b;
}
function cifra(testo, nome, k) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', k, iv);
  c.setAAD(Buffer.from(nome));
  const ct = Buffer.concat([c.update(testo, 'utf8'), c.final(), c.getAuthTag()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64'), c: ct.toString('base64') });
}
function decifra(json, nome, k) {
  const o = JSON.parse(json), iv = Buffer.from(o.iv, 'base64'), ct = Buffer.from(o.c, 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', k, iv); d.setAAD(Buffer.from(nome)); d.setAuthTag(ct.subarray(ct.length - 16));
  return Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]).toString('utf8');
}
function scrivi(nome, testo) { fs.mkdirSync(DEST, { recursive: true }); fs.writeFileSync(path.join(DEST, nome + '.enc'), cifra(testo, nome, chiave())); console.log('cifrato', nome); }
function stub(nome) {
  const h = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <base href="/"/>
  <meta name="robots" content="noindex,nofollow"/>
  <title>Area docenti riservata | Convitto "Costaggini" - Rieti</title>
  <meta name="theme-color" content="#2C3E2D"/>
  <link rel="stylesheet" href="fonts.css"/>
  <link rel="stylesheet" href="style.min.css"/>
  <link rel="stylesheet" href="aula/lingue/lingue.css"/>
  <link rel="icon" href="favicon.ico" sizes="any"/>
</head>
<body data-page="lingue" data-lingue="${nome}">
<script src="nav-header.min.js"></script>
<main id="main">
  <div data-lingue-nav></div>
  <div id="ac-box"><div class="ac" style="max-width:460px;margin:2rem auto;padding:0 1rem"><p>Caricamento dell'area riservata…</p><noscript><p>Serve JavaScript per accedere all'area riservata.</p></noscript></div></div>
</main>
<script src="aula/lingue/lingue.js"></script>
<script src="aula/lingue/accesso.js"></script>
<script>ACCESSO.avvia('${nome}');</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(RADICE, nome + '.html'), h); console.log('pagina pubblica', nome + '.html');
}
const [, , cmd, a, b] = process.argv;
if (cmd === 'cifra') scrivi(b, fs.readFileSync(a, 'utf8'));
else if (cmd === 'decifra') fs.writeFileSync(b, decifra(fs.readFileSync(path.join(DEST, a + '.enc'), 'utf8'), a, chiave()));
else if (cmd === 'stub') stub(a);
else if (cmd === 'scorta') {
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12), cod = String(a).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cod.length < 16) { console.error('Codice troppo corto (minimo 16 caratteri).'); process.exit(1); }
  const kek = crypto.pbkdf2Sync(cod, salt, ITER, 32, 'sha256'), c = crypto.createCipheriv('aes-256-gcm', kek, iv);
  c.setAAD(Buffer.from('dipartimento'));
  const ct = Buffer.concat([c.update(chiave()), c.final(), c.getAuthTag()]);
  fs.mkdirSync(DEST, { recursive: true });
  fs.writeFileSync(path.join(DEST, 'accesso-dipartimento.json'), JSON.stringify({ v: 1, iter: ITER, salt: salt.toString('base64'), iv: iv.toString('base64'), c: ct.toString('base64') }));
  console.log('chiave di scorta scritta');
} else if (cmd === 'tutto') {
  const cart = a, tempi = fs.existsSync(path.join(cart, 'tempi.js')) ? fs.readFileSync(path.join(cart, 'tempi.js'), 'utf8') : null;
  fs.readdirSync(cart).filter(f => f.endsWith('.html')).forEach(f => {
    const nome = f.replace(/\.html$/, ''); let t = fs.readFileSync(path.join(cart, f), 'utf8');
    if (tempi) t = t.replace('<script src="aula/lingue/tempi.js"></script>', () => '<script>' + tempi.replace(/<\/script/gi, '<\\/script') + '</script>');
    scrivi(nome, t); stub(nome);
  });
  if (fs.existsSync(path.join(cart, 'lezioni-docente.json'))) scrivi('lezioni-docente', fs.readFileSync(path.join(cart, 'lezioni-docente.json'), 'utf8'));
} else { console.error('Comando sconosciuto. Vedi l\'intestazione del file.'); process.exit(1); }
