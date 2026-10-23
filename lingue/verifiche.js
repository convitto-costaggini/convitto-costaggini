/* ════════════════════════════════════════════════════════
   VERIFICHE IN UN CLIC — strumento per i docenti
   - genera domande dal Vocabolario (traduzione, scelta multipla,
     abbinamento, completamento) e accetta domande proprie
     (anche vero/falso e domande aperte);
   - ogni domanda è modificabile, spostabile, eliminabile;
   - stampa le file A, B, C (ordine e opzioni mescolati in modo
     riproducibile) e il foglio delle soluzioni;
   - bozza salvata solo in questo browser; esporta/importa in file .json.
   Nessun dato esce dal dispositivo.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LINGUE_SITO, V = window.VOCABOLARIO, esc = L.esc;
  var CH = 'verifica-bozza';
  var TIPI = {
    traduci: { nome: 'Traduzione', ic: '🔤' },
    scelta: { nome: 'Scelta multipla', ic: '🎯' },
    abbina: { nome: 'Abbinamento', ic: '🔗' },
    completa: { nome: 'Completamento', ic: '✏️' },
    vf: { nome: 'Vero o falso', ic: '✅' },
    aperta: { nome: 'Domanda aperta', ic: '💬' }
  };
  var ISTITUTO = 'IPSSEOA «R. A. Costaggini», Rieti';

  /* ── numeri casuali riproducibili (stessa fila = stesso ordine, anche per le soluzioni) */
  function rng(seme) { var a = 0; for (var i = 0; i < seme.length; i++) a = (a * 31 + seme.charCodeAt(i)) | 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mescolaCon(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nid() { return Math.random().toString(36).slice(2, 9); }

  /* ── stato */
  var ver = L.leggi(CH, null);
  function nuova() {
    return { id: nid(), lingua: 'en', intest: { titolo: '', classe: '', data: '', durata: '50 minuti', istruzioni: 'Leggi con attenzione ogni consegna. Scrivi in modo chiaro e leggibile.', griglia: true, nomi: true }, domande: [] };
  }
  function salva() { L.salva(CH, ver); var s = document.getElementById('vf-salvato'); if (s) { s.textContent = '✓ Bozza salvata in questo browser'; clearTimeout(salva.t); salva.t = setTimeout(function () { s.textContent = ''; }, 2000); } }
  function nomeLingua() { return L.lingua(ver.lingua).nome; }
  /* titolo automatico: si aggiorna con lingua e ambito, finché il docente non lo riscrive a mano */
  var AUTO = /^Verifica di (inglese|francese|spagnolo)(( — |: ).*)?$/;
  function titoloAuto(ambito) {
    var I = ver.intest; if (I.titolo && !AUTO.test(I.titolo)) return;
    var am = V.AMBITI.filter(function (a) { return a.id === ambito; })[0];
    var coda = ambito === undefined ? (I.titolo && /( — |: )/.test(I.titolo) ? ': ' + I.titolo.split(/ — |: /).slice(1).join(': ') : '') : (am ? ': ' + am.nome : '');
    I.titolo = 'Verifica di ' + nomeLingua().toLowerCase() + coda;
    var el = document.getElementById('vf-titolo'); if (el) el.value = I.titolo;
  }

  /* ── generazione dal vocabolario */
  function voci(ambito, sezione) {
    var out = [];
    V.SEZIONI.forEach(function (s) {
      if (ambito !== 'tutti' && s.ambito !== ambito) return;
      if (sezione !== 'tutte' && s.id !== sezione) return;
      (V.PAROLE[s.id] || []).forEach(function (p) { out.push({ it: p[0], tr: p[1][ver.lingua][0], s: s.id }); });
    });
    return out;
  }
  var VUOTE = ['the', 'and', 'you', 'your', 'les', 'des', 'une', 'vous', 'est', 'los', 'las', 'una', 'por', 'der', 'die', 'das', 'und', 'sie', 'ist', 'ein', 'eine', 'with', 'avec', 'con', 'mit', 'for', 'pour', 'para', 'für'];
  function buco(frase) {
    var parole = frase.match(/[\p{L}][\p{L}'’-]*/gu) || [];
    if (parole.length < 2) return null;   /* una parola sola: diventerebbe una traduzione, non un completamento */
    var cand = parole.filter(function (w) { return w.length >= 4 && VUOTE.indexOf(w.toLowerCase()) < 0; });
    if (!cand.length) cand = parole.filter(function (w) { return w.length >= 3; });
    if (!cand.length) return null;
    var w = cand.sort(function (a, b) { return b.length - a.length; })[0];
    return frase.replace(w, '[' + w + ']');
  }
  function genera(opz) {
    var pool = L.mescola(voci(opz.ambito, opz.sezione)), usate = 0, nuove = [];
    function prendi(n, filtro) { var out = []; while (out.length < n && usate < pool.length) { var v = pool[usate++]; if (!filtro || filtro(v)) out.push(v); } return out; }
    var dir = opz.direzione, lin = nomeLingua().toLowerCase();
    prendi(opz.traduci).forEach(function (v) {
      nuove.push(dir === 'it' ? { id: nid(), tipo: 'traduci', consegna: 'Traduci in ' + lin + ':', frase: v.it, risposta: v.tr, punti: opz.pt.traduci }
                              : { id: nid(), tipo: 'traduci', consegna: 'Traduci in italiano:', frase: v.tr, risposta: v.it, punti: opz.pt.traduci });
    });
    prendi(opz.scelta).forEach(function (v) {
      var altre = pool.filter(function (x) { return x.tr !== v.tr; });
      var stesse = L.mescola(altre.filter(function (x) { return x.s === v.s; })).concat(L.mescola(altre.filter(function (x) { return x.s !== v.s; })));
      var alt = stesse.map(function (x) { return x.tr; }).filter(function (t, i, a) { return a.indexOf(t) === i; }).slice(0, 3);
      nuove.push({ id: nid(), tipo: 'scelta', consegna: 'Come si dice «' + v.it + '» in ' + lin + '?', opzioni: [v.tr].concat(alt), giusta: 0, punti: opz.pt.scelta });
    });
    if (opz.abbina >= 2) {
      var c = prendi(opz.abbina);
      if (c.length >= 2) nuove.push({ id: nid(), tipo: 'abbina', consegna: 'Collega ogni frase italiana alla sua traduzione, scrivendo la lettera giusta.', coppie: c.map(function (v) { return [v.it, v.tr]; }), punti: opz.pt.abbina * c.length });
    }
    prendi(opz.completa, function (v) { return !!buco(v.tr); }).forEach(function (v) {
      nuove.push({ id: nid(), tipo: 'completa', consegna: 'Completa la frase (' + v.it + '):', testo: buco(v.tr), banca: false, punti: opz.pt.completa });
    });
    return nuove;
  }

  /* ── foglio stampabile (anche anteprima) */
  function totale() { return ver.domande.reduce(function (t, d) { return t + (+d.punti || 0); }, 0); }
  function pt(n) { n = +n || 0; return (Math.round(n * 10) / 10).toString().replace('.', ',') + (n === 1 ? ' punto' : ' punti'); }
  function righeVuote(n) { var h = ''; for (var i = 0; i < n; i++) h += '<div class="rg"></div>'; return h; }
  function blocchi(testo) { return esc(testo).replace(/\[([^\]]+)\]/g, function (m, w) { return '<span class="bk">' + '&nbsp;'.repeat(Math.max(10, w.length * 2)) + '</span>'; }); }
  function preparaFila(fila) {
    var r = rng(ver.id + '-' + fila);
    var ordine = fila === 'A' ? ver.domande.slice() : mescolaCon(ver.domande, r);
    return ordine.map(function (d) {
      var x = JSON.parse(JSON.stringify(d));
      if (d.tipo === 'scelta') { var o = d.opzioni.map(function (t, i) { return { t: t, ok: i === +d.giusta }; }).filter(function (o) { return o.t && o.t.trim(); }); x.opz = mescolaCon(o, r); }   /* sempre mescolate: la giusta non deve stare sempre in «a)» */
      if (d.tipo === 'abbina') { var dx = (d.coppie || []).map(function (c, i) { return { t: c[1], i: i }; }); x.dx = mescolaCon(dx, r); }
      if (d.tipo === 'completa') { x.parole = mescolaCon((d.testo.match(/\[([^\]]+)\]/g) || []).map(function (w) { return w.slice(1, -1); }), r); }
      return x;
    });
  }
  var LET = 'abcdefghijklmnopqrstuvwxyz';
  function foglio(fila, perAnteprima) {
    var I = ver.intest, dom = preparaFila(fila), tot = totale();
    var h = '<div class="pg">' +
      '<div class="ist"><span>' + esc(ISTITUTO) + '</span><span>' + esc(nomeLingua()) + (fila ? ' · Fila ' + fila : '') + '</span></div>' +
      (I.nomi ? '<div class="nm"><div>Cognome e nome <i></i></div><div class="cl">Classe <i>' + esc(I.classe) + '</i></div><div class="dt">Data <i>' + esc(I.data) + '</i></div></div>' : '') +
      '<h1>' + esc(I.titolo || ('Verifica di ' + nomeLingua().toLowerCase())) + '</h1>' +
      '<p class="ins">' + esc(I.istruzioni) + (I.durata ? ' <b>Tempo: ' + esc(I.durata) + '.</b>' : '') + ' <b>Totale: ' + pt(tot) + '.</b></p>';
    dom.forEach(function (d, n) {
      h += '<div class="q"><div class="qt"><b>' + (n + 1) + '.</b> ' + esc(d.consegna || '') + ' <span class="pt">(' + pt(d.punti) + ')</span></div>';
      if (d.tipo === 'traduci') h += '<div class="fr">' + esc(d.frase) + '</div>' + righeVuote(1);
      else if (d.tipo === 'scelta') h += '<div class="op">' + d.opz.map(function (o, i) { return '<div><span class="bx"></span>' + LET[i] + ') ' + esc(o.t) + '</div>'; }).join('') + '</div>';
      else if (d.tipo === 'abbina') h += '<table class="ab"><tr><td>' + (d.coppie || []).map(function (c, i) { return '<div>' + (i + 1) + '. ' + esc(c[0]) + ' <span class="lt">____</span></div>'; }).join('') + '</td><td>' + d.dx.map(function (o, i) { return '<div>' + LET[i] + ') ' + esc(o.t) + '</div>'; }).join('') + '</td></tr></table>';
      else if (d.tipo === 'completa') h += '<div class="fr">' + blocchi(d.testo) + '</div>' + (d.banca && d.parole.length ? '<div class="bc">Parole: ' + d.parole.map(esc).join(' · ') + '</div>' : '');
      else if (d.tipo === 'vf') h += '<div class="vfq"><span>' + esc(d.affermazione) + '</span><span class="vfb"><span class="bx"></span>V <span class="bx"></span>F</span></div>';
      else if (d.tipo === 'aperta') h += righeVuote(+d.righe || 3);
      h += '</div>';
    });
    if (I.griglia && tot > 0) h += tabellaVoti(tot);
    return h + '</div>';
  }
  function tabellaVoti(tot) {
    var fasce = {}, passo = tot > 40 ? 1 : .5;
    for (var p = 0; p <= tot + 1e-9; p += passo) { var v = Math.max(3, Math.round(20 * p / tot) / 2); (fasce[v] = fasce[v] || []).push(p); }
    var voti = Object.keys(fasce).map(Number).sort(function (a, b) { return b - a; });
    var f = function (n) { return (Math.round(n * 10) / 10).toString().replace('.', ','); };
    return '<table class="gv"><tr><th>Punti</th>' + voti.map(function (v) { var a = fasce[v]; return '<td>' + (a.length > 1 ? f(a[0]) + '–' + f(a[a.length - 1]) : f(a[0])) + '</td>'; }).join('') + '</tr><tr><th>Voto</th>' +
      voti.map(function (v) { return '<td><b>' + f(v) + '</b></td>'; }).join('') + '</tr></table><p class="gvn">Conversione proporzionale (punteggio ÷ totale × 10, arrotondato al mezzo voto; minimo 3). Punteggio ottenuto: ______ / ' + f(tot) + '</p>';
  }
  function soluzioni(file) {
    var h = '<div class="pg sol"><div class="ist"><span>' + esc(ISTITUTO) + '</span><span>Soluzioni (riservato al docente)</span></div><h1>' + esc(ver.intest.titolo || 'Verifica') + ' — soluzioni</h1>';
    file.forEach(function (fila) {
      h += '<h2>Fila ' + fila + '</h2><ol>';
      preparaFila(fila).forEach(function (d) {
        var r = '';
        if (d.tipo === 'traduci') r = esc(d.risposta);
        else if (d.tipo === 'scelta') d.opz.forEach(function (o, i) { if (o.ok) r = LET[i] + ') ' + esc(o.t); });
        else if (d.tipo === 'abbina') r = (d.coppie || []).map(function (c, i) { var j = -1; d.dx.forEach(function (o, k) { if (o.i === i) j = k; }); return (i + 1) + '-' + LET[j]; }).join(', ');
        else if (d.tipo === 'completa') r = (d.testo.match(/\[([^\]]+)\]/g) || []).map(function (w) { return esc(w.slice(1, -1)); }).join(' · ');
        else if (d.tipo === 'vf') r = d.vero ? 'Vero' : 'Falso';
        else if (d.tipo === 'aperta') r = d.traccia ? esc(d.traccia) : '<i>risposta libera</i>';
        h += '<li>' + r + ' <span class="pt">(' + pt(d.punti) + ')</span></li>';
      });
      h += '</ol>';
    });
    return h + '</div>';
  }
  var CSS_FOGLIO = '@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;font-size:10.5pt;line-height:1.45;margin:0;background:#fff}' +
    '.pg{max-width:182mm;margin:0 auto;padding:4mm 0}.pg+.pg{page-break-before:always;break-before:page}' +
    '.ist{display:flex;justify-content:space-between;border-bottom:1.5px solid #2C3E2D;padding-bottom:4px;font-size:8.5pt;color:#2C3E2D;font-weight:bold;letter-spacing:.02em}' +
    '.nm{display:flex;gap:12px;margin:10px 0 4px;font-size:9.5pt}.nm div{display:flex;gap:6px;align-items:flex-end;flex:3}.nm .cl,.nm .dt{flex:1}.nm i{flex:1;border-bottom:1px solid #555;font-style:normal;min-height:16px;padding-left:4px}' +
    'h1{font-family:Georgia,serif;font-weight:normal;font-size:17pt;margin:12px 0 4px;color:#2C3E2D}h2{font-family:Georgia,serif;font-weight:normal;font-size:13pt;margin:14px 0 4px;color:#2C3E2D}' +
    '.ins{font-size:9.5pt;color:#333;margin:0 0 10px}.q{margin:0 0 11px;page-break-inside:avoid;break-inside:avoid}.qt b{color:#2C3E2D}.pt{color:#666;font-size:8.5pt;white-space:nowrap}' +
    '.fr{margin:4px 0 2px 16px;font-style:italic}.rg{border-bottom:1px solid #999;height:20px;margin-left:16px}' +
    '.op{margin:4px 0 0 16px;display:grid;grid-template-columns:1fr 1fr;gap:3px 16px}.bx{display:inline-block;width:10px;height:10px;border:1px solid #333;margin-right:6px;vertical-align:-1px}' +
    '.ab{margin:4px 0 0 16px;width:calc(100% - 16px);border-collapse:collapse}.ab td{vertical-align:top;width:50%;padding-right:10px}.ab div{margin:2px 0}.lt{color:#999}' +
    '.bk{display:inline-block;border-bottom:1px solid #333;font-style:normal}.bc{margin:4px 0 0 16px;font-size:9pt;border:1px dashed #aaa;padding:3px 6px;display:inline-block}' +
    '.vfq{display:flex;justify-content:space-between;gap:12px;margin:3px 0 0 16px}.vfb{white-space:nowrap}' +
    '.gv{border-collapse:collapse;margin-top:14px;font-size:8.5pt;page-break-inside:avoid}.gv th,.gv td{border:1px solid #999;padding:2px 5px;text-align:center}.gv th{background:#eef2ee}.gvn{font-size:8pt;color:#555;margin:3px 0 0}' +
    '.sol ol{margin:4px 0 0;padding-left:22px}.sol li{margin:2px 0}';
  function stampa(file, conSoluzioni) {
    var corpo = file.map(function (f) { return foglio(f); }).join('') + (conSoluzioni ? soluzioni(file) : '');
    var w = window.open('', '_blank'); if (!w) { FINESTRA.avvisa({ titolo: 'Stampa bloccata', testo: 'Il browser ha bloccato la finestra di stampa. Consentite le finestre a comparsa per questo sito e riprovate.' }); return; }
    w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/><title>' + esc(ver.intest.titolo || 'Verifica') + '</title><style>' + CSS_FOGLIO + '</style></head><body>' + corpo + '<script>window.onload=function(){window.print()}<\/script></body></html>');
    w.document.close();
  }

  /* ── editor */
  var lista, anteprima;
  function campo(d, k, etichetta, tipo, extra) {
    var v = d[k] == null ? '' : d[k];
    if (tipo === 'area') return '<label class="vf-l">' + etichetta + '<textarea data-k="' + k + '" rows="' + (extra || 3) + '">' + esc(v) + '</textarea></label>';
    return '<label class="vf-l">' + etichetta + '<input type="' + (tipo || 'text') + '" data-k="' + k + '" value="' + esc(v) + '"' + (tipo === 'number' ? ' min="0" step="0.5"' : '') + '/></label>';
  }
  function corpoDomanda(d) {
    if (d.tipo === 'traduci') return campo(d, 'consegna', 'Consegna') + campo(d, 'frase', 'Frase da tradurre') + campo(d, 'risposta', 'Risposta attesa (solo nelle soluzioni)');
    if (d.tipo === 'scelta') return campo(d, 'consegna', 'Domanda') + '<div class="vf-l">Opzioni <small>(il pallino indica quella giusta)</small>' + d.opzioni.map(function (o, i) {
      return '<div class="vf-op"><input type="radio" name="g-' + d.id + '" data-giusta="' + i + '"' + (+d.giusta === i ? ' checked' : '') + ' aria-label="Opzione giusta"/><input type="text" data-op="' + i + '" value="' + esc(o) + '"/>' + (d.opzioni.length > 2 ? '<button type="button" class="vf-x" data-togliop="' + i + '" aria-label="Togli opzione">✕</button>' : '') + '</div>';
    }).join('') + (d.opzioni.length < 6 ? '<button type="button" class="vf-mini" data-aggop>+ opzione</button>' : '') + '</div>';
    if (d.tipo === 'abbina') return campo(d, 'consegna', 'Consegna') + '<label class="vf-l">Coppie, una per riga: <i>sinistra = destra</i><textarea data-coppie rows="6">' + esc((d.coppie || []).map(function (c) { return c[0] + ' = ' + c[1]; }).join('\n')) + '</textarea></label>';
    if (d.tipo === 'completa') return campo(d, 'consegna', 'Consegna') + campo(d, 'testo', 'Testo: metti tra parentesi quadre le parole da far completare, es. «Do you have a [reservation]?»', 'area', 2) +
      '<label class="vf-c"><input type="checkbox" data-banca' + (d.banca ? ' checked' : '') + '/> Mostra le parole da inserire (in ordine sparso)</label>';
    if (d.tipo === 'vf') return campo(d, 'affermazione', 'Affermazione') + '<label class="vf-l">La risposta giusta è<select data-vero><option value="1"' + (d.vero ? ' selected' : '') + '>Vero</option><option value="0"' + (!d.vero ? ' selected' : '') + '>Falso</option></select></label>';
    if (d.tipo === 'aperta') return campo(d, 'consegna', 'Domanda', 'area', 2) + campo(d, 'righe', 'Righe per la risposta', 'number') + campo(d, 'traccia', 'Traccia di risposta (solo nelle soluzioni, facoltativa)', 'area', 2);
    return '';
  }
  function disegnaLista() {
    if (!ver.domande.length) { lista.innerHTML = '<p class="vf-vuoto">Nessuna domanda: generatele dal vocabolario qui sopra oppure aggiungetene di vostre.</p>'; return; }
    lista.innerHTML = ver.domande.map(function (d, i) {
      return '<article class="vf-q" data-id="' + d.id + '"><div class="vf-qh"><span class="vf-n">' + (i + 1) + '</span><span class="vf-tipo">' + TIPI[d.tipo].ic + ' ' + TIPI[d.tipo].nome + '</span>' +
        '<label class="vf-pt"><input type="number" data-k="punti" value="' + esc(d.punti) + '" min="0" step="0.5" aria-label="Punti"/> pt</label>' +
        '<button type="button" class="vf-ico" data-su aria-label="Sposta su"' + (i === 0 ? ' disabled' : '') + '>↑</button><button type="button" class="vf-ico" data-giu aria-label="Sposta giù"' + (i === ver.domande.length - 1 ? ' disabled' : '') + '>↓</button><button type="button" class="vf-ico rosso" data-elimina aria-label="Elimina">✕</button></div>' +
        '<div class="vf-qb">' + corpoDomanda(d) + '</div></article>';
    }).join('');
  }
  function aggiornaTot() {
    document.getElementById('vf-tot').textContent = ver.domande.length + (ver.domande.length === 1 ? ' domanda' : ' domande') + ' · ' + pt(totale());
  }
  var tAnt;
  function aggiornaAnteprima() {
    clearTimeout(tAnt);
    tAnt = setTimeout(function () {
      var fila = document.querySelector('[data-ant][aria-pressed=true]'); fila = fila ? fila.dataset.ant : 'A';
      var html = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/><style>' + CSS_FOGLIO + 'body{padding:12mm 14mm}.pg+.pg{margin-top:20mm;border-top:2px dashed #ccc;padding-top:10mm}</style></head><body>' + (fila === 'S' ? soluzioni(['A', 'B', 'C']) : foglio(fila)) + '</body></html>';
      anteprima.srcdoc = html;
    }, 250);
  }
  function cambiato(ridisegna) { if (ridisegna) disegnaLista(); aggiornaTot(); aggiornaAnteprima(); salva(); }
  function domanda(el) { var a = el.closest('.vf-q'); if (!a) return null; var id = a.dataset.id; return ver.domande.filter(function (d) { return d.id === id; })[0]; }
  function nuovaDomanda(tipo) {
    var lin = nomeLingua().toLowerCase();
    var base = { id: nid(), tipo: tipo, punti: 1 };
    if (tipo === 'traduci') Object.assign(base, { consegna: 'Traduci in ' + lin + ':', frase: '', risposta: '' });
    if (tipo === 'scelta') Object.assign(base, { consegna: '', opzioni: ['', '', '', ''], giusta: 0 });
    if (tipo === 'abbina') Object.assign(base, { consegna: 'Collega ogni elemento di sinistra a quello di destra, scrivendo la lettera giusta.', coppie: [], punti: 4 });
    if (tipo === 'completa') Object.assign(base, { consegna: 'Completa la frase:', testo: '', banca: false });
    if (tipo === 'vf') Object.assign(base, { affermazione: '', vero: true });
    if (tipo === 'aperta') Object.assign(base, { consegna: '', righe: 4, traccia: '', punti: 3 });
    return base;
  }

  function avvia() {
    lista = document.getElementById('vf-lista'); anteprima = document.getElementById('vf-ant');
    var primaVolta = !ver;
    if (!ver) ver = nuova();
    var I = ver.intest;
    /* lingua, ambito, sezione per il generatore */
    var selL = document.getElementById('vf-lingua'), selA = document.getElementById('vf-ambito'), selS = document.getElementById('vf-sezione');
    selL.innerHTML = L.LINGUE.map(function (l) { return '<option value="' + l.cod + '">' + l.nome + '</option>'; }).join(''); selL.value = ver.lingua;
    selA.innerHTML = '<option value="tutti">Tutti gli ambiti</option>' + V.AMBITI.map(function (a) { return '<option value="' + a.id + '">' + a.icona + ' ' + esc(a.nome) + '</option>'; }).join('');
    function sezioni() { selS.innerHTML = '<option value="tutte">Tutte le sezioni</option>' + V.SEZIONI.filter(function (s) { return selA.value === 'tutti' || s.ambito === selA.value; }).map(function (s) { return '<option value="' + s.id + '">' + esc(s.nome) + '</option>'; }).join(''); }
    selA.value = 'sala'; sezioni();
    selA.addEventListener('change', sezioni);
    selL.addEventListener('change', function () { ver.lingua = selL.value; titoloAuto(); cambiato(); });
    /* intestazione */
    ['titolo', 'classe', 'data', 'durata', 'istruzioni'].forEach(function (k) {
      var el = document.getElementById('vf-' + k); el.value = I[k] || '';
      el.addEventListener('input', function () { I[k] = el.value; cambiato(); });
    });
    ['griglia', 'nomi'].forEach(function (k) { var el = document.getElementById('vf-' + k); el.checked = !!I[k]; el.addEventListener('change', function () { I[k] = el.checked; cambiato(); }); });
    /* genera */
    document.getElementById('vf-genera').addEventListener('click', function () {
      var n = function (id) { return Math.max(0, Math.min(30, parseInt(document.getElementById(id).value, 10) || 0)); };
      var p = function (id) { return Math.max(0, parseFloat(String(document.getElementById(id).value).replace(',', '.')) || 0); };
      var opz = { ambito: selA.value, sezione: selS.value, direzione: document.getElementById('vf-dir').value,
        traduci: n('vf-n-traduci'), scelta: n('vf-n-scelta'), abbina: n('vf-n-abbina'), completa: n('vf-n-completa'),
        pt: { traduci: p('vf-p-traduci'), scelta: p('vf-p-scelta'), abbina: p('vf-p-abbina'), completa: p('vf-p-completa') } };
      var nuove = genera(opz);
      if (!nuove.length) { FINESTRA.avvisa({ titolo: 'Nessuna domanda', testo: 'Nessuna domanda generata: controllate le quantità.' }); return; }
      if (document.getElementById('vf-sostituisci').checked) ver.domande = nuove; else ver.domande = ver.domande.concat(nuove);
      if (document.getElementById('vf-sostituisci').checked) titoloAuto(selA.value); else titoloAuto();
      cambiato(true);
      document.getElementById('vf-domande').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    /* grammatica: argomenti a scelta, domande che verificano la regola */
    var G = window.GRAMMATICA, gSel = (L.leggi('gram-argomenti', []) || []).slice();
    function gDisegna() {
      var ar = G ? G.argomenti(ver.lingua) : [];
      if (G && G.editorMiei) G.editorMiei(document.getElementById('vf-g-miei'), ver.lingua, function (id) { if (id && gSel.indexOf(id) < 0) gSel.push(id); gDisegna(); });
      gSel = gSel.filter(function (id) { return ar.some(function (a) { return a.id === id; }); });
      document.getElementById('vf-g-chips').innerHTML = ar.map(function (a) {
        return '<button type="button" class="lg-chip" data-g="' + a.id + '" aria-pressed="' + (gSel.indexOf(a.id) >= 0) + '" title="' + esc(a.liv) + '">' + (a.mio ? '✏️ ' : '') + esc(a.nome) + '</button>';
      }).join('') || '<span class="sot">Nessun argomento disponibile per questa lingua.</span>';
    }
    gDisegna();
    selL.addEventListener('change', gDisegna);
    document.getElementById('vf-g-chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-g]'); if (!b) return;
      var i = gSel.indexOf(b.dataset.g); if (i >= 0) gSel.splice(i, 1); else gSel.push(b.dataset.g);
      b.setAttribute('aria-pressed', String(i < 0)); L.salva('gram-argomenti', gSel);
    });
    document.getElementById('vf-g-genera').addEventListener('click', function () {
      var m = document.getElementById('vf-g-msg');
      if (!gSel.length) { m.textContent = 'Scegliete almeno un argomento qui sopra.'; return; }
      var n = function (id) { return Math.max(0, Math.min(30, parseInt(document.getElementById(id).value, 10) || 0)); };
      var p = function (id) { return Math.max(0, parseFloat(String(document.getElementById(id).value).replace(',', '.')) || 0); };
      var nuove = G.domandeVerifica(ver.lingua, gSel, document.getElementById('vf-g-liv').value,
        { scelta: n('vf-g-n-scelta'), completa: n('vf-g-n-completa'), ordine: n('vf-g-n-ordine'), traduci: n('vf-g-n-traduci') },
        { scelta: p('vf-g-p-scelta'), completa: p('vf-g-p-completa'), ordine: p('vf-g-p-ordine'), traduci: p('vf-g-p-traduci') }, nid, document.getElementById('vf-g-trad').checked);
      if (!nuove.length) { m.textContent = 'Nessuna domanda: controllate quantità e livello.'; return; }
      ver.domande = ver.domande.concat(nuove); cambiato(true);
      m.textContent = nuove.length + ' domande di grammatica aggiunte in coda.';
      document.getElementById('vf-domande').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    /* aggiungi domanda propria */
    document.getElementById('vf-aggiungi').innerHTML = Object.keys(TIPI).map(function (k) { return '<button type="button" class="lg-chip" data-nuova="' + k + '">' + TIPI[k].ic + ' ' + TIPI[k].nome + '</button>'; }).join('');
    document.getElementById('vf-aggiungi').addEventListener('click', function (e) {
      var b = e.target.closest('[data-nuova]'); if (!b) return;
      ver.domande.push(nuovaDomanda(b.dataset.nuova)); cambiato(true);
      var ultima = lista.lastElementChild; if (ultima) { ultima.scrollIntoView({ behavior: 'smooth', block: 'center' }); var f = ultima.querySelector('.vf-qb input, .vf-qb textarea'); if (f) setTimeout(function () { f.focus(); }, 400); }
    });
    /* modifiche nelle domande */
    lista.addEventListener('input', function (e) {
      var t = e.target, d = domanda(t); if (!d) return;
      if (t.dataset.k) d[t.dataset.k] = t.type === 'number' ? (parseFloat(t.value) || 0) : t.value;
      else if (t.dataset.op != null) d.opzioni[+t.dataset.op] = t.value;
      else if (t.hasAttribute('data-coppie')) d.coppie = t.value.split('\n').map(function (r) { var c = r.split('='); return c.length >= 2 ? [c[0].trim(), c.slice(1).join('=').trim()] : null; }).filter(function (c) { return c && c[0] && c[1]; });
      cambiato();
    });
    lista.addEventListener('change', function (e) {
      var t = e.target, d = domanda(t); if (!d) return;
      if (t.dataset.giusta != null) d.giusta = +t.dataset.giusta;
      else if (t.hasAttribute('data-banca')) d.banca = t.checked;
      else if (t.hasAttribute('data-vero')) d.vero = t.value === '1';
      else return;
      cambiato();
    });
    lista.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var d = domanda(b); if (!d) return;
      var i = ver.domande.indexOf(d);
      if (b.hasAttribute('data-elimina')) {
        FINESTRA.chiedi({ titolo: 'Eliminare la domanda ' + (i + 1) + '?', si: 'Elimina', pericolo: true }).then(function (ok) { if (ok) { ver.domande.splice(ver.domande.indexOf(d), 1); cambiato(true); } });
        return;
      }
      else if (b.hasAttribute('data-su') && i > 0) { ver.domande.splice(i - 1, 0, ver.domande.splice(i, 1)[0]); }
      else if (b.hasAttribute('data-giu') && i < ver.domande.length - 1) { ver.domande.splice(i + 1, 0, ver.domande.splice(i, 1)[0]); }
      else if (b.hasAttribute('data-aggop')) { d.opzioni.push(''); }
      else if (b.dataset.togliop != null) { var k = +b.dataset.togliop; d.opzioni.splice(k, 1); if (+d.giusta === k) d.giusta = 0; else if (+d.giusta > k) d.giusta--; }
      else return;
      cambiato(true);
    });
    /* anteprima: quale fila */
    document.getElementById('vf-file-ant').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ant]'); if (!b) return;
      this.querySelectorAll('[data-ant]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); aggiornaAnteprima();
    });
    /* stampa */
    document.getElementById('vf-stampa').addEventListener('click', function () {
      var file = [].filter.call(document.querySelectorAll('[data-fila]'), function (c) { return c.checked; }).map(function (c) { return c.dataset.fila; });
      var sol = document.getElementById('vf-sol').checked;
      if (!ver.domande.length) { FINESTRA.avvisa({ titolo: 'Verifica vuota', testo: 'La verifica non ha ancora domande.' }); return; }
      if (!file.length && !sol) { FINESTRA.avvisa({ titolo: 'Nessuna fila', testo: 'Scegliete almeno una fila da stampare.' }); return; }
      stampa(file.length ? file : ['A'], sol);
    });
    document.getElementById('vf-stampa-sol').addEventListener('click', function () {
      if (!ver.domande.length) return;
      var file = [].filter.call(document.querySelectorAll('[data-fila]'), function (c) { return c.checked; }).map(function (c) { return c.dataset.fila; });
      var w = window.open('', '_blank'); if (!w) { FINESTRA.avvisa({ titolo: 'Stampa bloccata', testo: 'Il browser ha bloccato la finestra di stampa. Consentite le finestre a comparsa per questo sito e riprovate.' }); return; }
      w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/><title>Soluzioni</title><style>' + CSS_FOGLIO + '</style></head><body>' + soluzioni(file.length ? file : ['A']) + '<script>window.onload=function(){window.print()}<\/script></body></html>');
      w.document.close();
    });
    /* file: esporta, importa, nuova */
    document.getElementById('vf-esporta').addEventListener('click', function () {
      var nome = (ver.intest.titolo || 'verifica').toLowerCase().replace(/[^\p{L}\d]+/gu, '-').replace(/^-|-$/g, '') || 'verifica';
      var blob = new Blob([JSON.stringify({ formato: 'verifica-costaggini', versione: 1, verifica: ver }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome + '.json'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    document.getElementById('vf-importa').addEventListener('change', function () {
      var f = this.files[0]; if (!f) return; var lettore = new FileReader();
      lettore.onload = function () {
        try {
          var j = JSON.parse(lettore.result), v = j.verifica || j;
          if (!v || !Array.isArray(v.domande) || !v.intest) throw new Error('formato');
          v.domande = v.domande.filter(function (d) { return d && TIPI[d.tipo]; }).map(function (d) { d.id = d.id || nid(); return d; });
        } catch (e) { FINESTRA.avvisa({ titolo: 'File non valido', testo: 'Il file non è una verifica valida.' }); return; }
        (ver.domande.length ? FINESTRA.chiedi({ titolo: 'Aprire la verifica dal file?', testo: 'Quella attuale verrà sostituita (esportatela prima, se vi serve).', si: 'Apri' }) : Promise.resolve(true))
          .then(function (ok) { if (!ok) return; ver = v; ver.id = ver.id || nid(); L.salva(CH, ver); location.reload(); });
      };
      lettore.readAsText(f); this.value = '';
    });
    document.getElementById('vf-nuova').addEventListener('click', function () {
      (ver.domande.length ? FINESTRA.chiedi({ titolo: 'Iniziare una verifica nuova?', testo: 'Quella attuale verrà cancellata da questo browser (esportatela prima, se vi serve).', si: 'Inizia da capo', pericolo: true }) : Promise.resolve(true))
        .then(function (ok) { if (ok) { L.salva(CH, null); location.reload(); } });
    });
    /* esempio alla prima apertura: si vede subito cosa fa */
    if (primaVolta) {
      ver.domande = genera({ ambito: 'sala', sezione: 'tutte', direzione: 'it', traduci: 4, scelta: 3, abbina: 5, completa: 3, pt: { traduci: 2, scelta: 1, abbina: 1, completa: 1 } });
      ver.domande.push({ id: nid(), tipo: 'aperta', consegna: 'Un cliente inglese ti chiede di consigliargli un piatto della cucina reatina. Scrivi la tua risposta (3-4 frasi).', righe: 4, traccia: '', punti: 4 });
      I.titolo = 'Verifica di inglese: Sala e vendita'; document.getElementById('vf-titolo').value = I.titolo;
    }
    disegnaLista(); aggiornaTot(); aggiornaAnteprima(); if (primaVolta) salva();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
