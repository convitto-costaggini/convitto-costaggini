/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «L'ordine delle operazioni» (numeri naturali)
   Espressione: { it: [numero | espressione-gruppo, …], op: ['+','−','×','÷', …] } con op.length = it.length − 1.
   Un elemento oggetto è un gruppo tra parentesi tonde.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'ordine', URL = 'aula/matematica/ordine.html';
  var T = window.TB, $ = T.$, rnd = T.rnd, pesca = T.pesca, M = T.M, Q = T.Q;

  /* ── motore ── */
  function clone(e) { return { it: e.it.map(function (x) { return typeof x === 'object' ? clone(x) : x; }), op: e.op.slice() }; }
  function mml(e, top) {
    var s = '';
    e.it.forEach(function (x, i) {
      if (i) s += '<mo>' + e.op[i - 1] + '</mo>';
      s += typeof x === 'object' ? '<mrow><mo>(</mo>' + mml(x, false) + '<mo>)</mo></mrow>' : '<mn>' + x + '</mn>';
    });
    return s;
  }
  function math(e) { return M('<mrow>' + mml(e, true) + '</mrow>'); }
  function testo(e, top) { var s = e.it.map(function (x, i) { return (i ? ' ' + e.op[i - 1] + ' ' : '') + (typeof x === 'object' ? '(' + testo(x) + ')' : x); }).join(''); return s; }
  function foglia(e) { return e.it.every(function (x) { return typeof x !== 'object'; }); }
  function proxima(e) { /* indice dell'operazione da fare per prima in un'espressione-foglia */
    for (var i = 0; i < e.op.length; i++) if (e.op[i] === '×' || e.op[i] === '÷') return i;
    return 0;
  }
  function tutte(e, acc) { acc = acc || []; acc.push(e); e.it.forEach(function (x) { if (typeof x === 'object') tutte(x, acc); }); return acc; }
  function candidati(root) {
    var out = [];
    tutte(root).forEach(function (e) {
      var f = foglia(e), p = f ? proxima(e) : -1;
      for (var i = 0; i < e.op.length; i++) {
        if (typeof e.it[i] === 'object' || typeof e.it[i + 1] === 'object') continue;
        var motivo = !f ? 'parentesi' : (i === p ? '' : ((e.op[i] === '+' || e.op[i] === '−') ? 'precedenza' : 'sinistra'));
        out.push({ e: e, i: i, valido: i === p && f, motivo: motivo, label: e.it[i] + ' ' + e.op[i] + ' ' + e.it[i + 1] });
      }
    });
    return out;
  }
  function calc(a, op, b) { return op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : (b !== 0 && a % b === 0 ? a / b : NaN); }
  function normalizza(e) {
    for (var k = 0; k < e.it.length; k++) { var x = e.it[k]; if (typeof x === 'object') { normalizza(x); if (x.it.length === 1) e.it[k] = x.it[0]; } }
    return e;
  }
  function applica(root, c) { var r = calc(c.e.it[c.i], c.e.op[c.i], c.e.it[c.i + 1]); c.e.it.splice(c.i, 2, r); c.e.op.splice(c.i, 1); normalizza(root); while (typeof root.it[0] === 'object' && root.it.length === 1) { root.op = root.it[0].op; root.it = root.it[0].it; } return r; }
  function valida(r) { return !isNaN(r) && r >= 0 && r <= 999 && isFinite(r); }
  /* percorso ordinato: lista di {prima, dopo, risultato, cand} oppure null se un passaggio non è valido */
  function percorso(e) {
    var cur = clone(e), passi = [];
    var guard = 0;
    while (cur.op.length && guard++ < 20) {
      var cs = candidati(cur), v = cs.filter(function (c) { return c.valido; })[0];
      if (!v) return null;
      var prima = clone(cur), r = calc(v.e.it[v.i], v.e.op[v.i], v.e.it[v.i + 1]);
      if (!valida(r)) return null;
      var tutti = cs.slice();
      applica(cur, v);
      passi.push({ prima: prima, dopo: clone(cur), r: r, v: v.label, cands: tutti, idx: cs.indexOf(v), ctx: null });
    }
    if (cur.op.length || typeof cur.it[0] === 'object') return null;
    return { passi: passi, valore: cur.it[0] };
  }
  /* valutazione ignorando le parentesi (per capire se servono) */
  function piatta(e) {
    var nums = [], ops = [];
    (function f(x) { x.it.forEach(function (y, i) { if (i) ops.push(x.op[i - 1]); if (typeof y === 'object') f(y); else nums.push(y); }); })(e);
    var flat = { it: nums, op: ops }; var p = percorso(flat); return p ? p.valore : null;
  }
  /* costruzione a partire da numeri, operatori e gruppi (intervalli di indici dei numeri) */
  function costruisci(nums, ops, gruppi) {
    function build(s, e, gr) {
      var it = [], op = [], i = s;
      while (i <= e) {
        var G = gr.filter(function (g) { return g[0] === i && !(g[0] === s && g[1] === e); }).sort(function (a, b) { return b[1] - a[1]; })[0];
        if (G) { it.push({ it: null, op: null, _g: G }); var sub = build(G[0], G[1], gr.filter(function (g) { return g !== G && g[0] >= G[0] && g[1] <= G[1]; })); it[it.length - 1] = sub; i = G[1] + 1; }
        else { it.push(nums[i]); i++; }
        if (i <= e) op.push(ops[i - 1]);
      }
      return { it: it, op: op };
    }
    return build(0, nums.length - 1, gruppi);
  }
  function laminare(gr) { for (var i = 0; i < gr.length; i++) for (var j = i + 1; j < gr.length; j++) { var a = gr[i], b = gr[j]; if (a[1] < b[0] || b[1] < a[0]) continue; if ((a[0] <= b[0] && b[1] <= a[1]) || (b[0] <= a[0] && a[1] <= b[1])) { if (a[0] === b[0] && a[1] === b[1]) return false; continue; } return false; } return true; }
  var PAR = { 1: { n: [3, 3], max: 9, g: 0 }, 2: { n: [3, 4], max: 12, g: 0.5 }, 3: { n: [4, 5], max: 12, g: 1 }, 4: { n: [5, 5], max: 15, g: 1 } };
  function genera(liv, senza, con) {
    var cfg = PAR[liv] || PAR[2];
    for (var tent = 0; tent < 600; tent++) {
      var n = rnd(cfg.n[0], cfg.n[1]), nums = [], ops = [], k;
      for (k = 0; k < n; k++) nums.push(rnd(2, cfg.max));
      for (k = 0; k < n - 1; k++) ops.push(pesca(['+', '+', '−', '×', '×', '÷']));
      if (ops.indexOf('×') < 0 && ops.indexOf('÷') < 0) ops[rnd(0, ops.length - 1)] = '×';
      if (ops.every(function (o) { return o === '+' || o === '−'; })) continue;
      var gr = [];
      var vuole = con === true ? true : con === false ? false : Math.random() < cfg.g;
      if (vuole) {
        var ng = liv >= 3 && n >= 4 && Math.random() < 0.5 ? 2 : 1;
        for (k = 0; k < ng; k++) { var s = rnd(0, n - 2), e = rnd(s + 1, Math.min(n - 1, s + 2)); if (s === 0 && e === n - 1) continue; var cand = gr.concat([[s, e]]); if (laminare(cand)) gr = cand; }
        if (!gr.length) continue;
      }
      var ex = costruisci(nums, ops, gr), p = percorso(ex); if (!p) continue;
      if (gr.length) { var pt = piatta(ex); if (pt !== null && pt === p.valore && tent < 300) continue; }
      if (liv === 1 && p.passi.length !== 2) continue;
      return { e: ex, p: p };
    }
    var ex2 = { it: [3, 4, 2], op: ['+', '×'] }; return { e: ex2, p: percorso(ex2) };
  }

  T.lim('mt-lim', 'main');

  /* ════════ IL CASO ════════ */
  (function () {
    var A = $('od-caso'), S = { i: 0, ok: 0 };
    var D = [
      { t: 'Il tavolo 5 ha un <strong>coperto da 3 €</strong> e ordina <strong>4 piatti da 2 €</strong> l\'uno. Quanto pagano? Il cassiere scrive sullo scontrino: ' + M('<mn>3</mn><mo>+</mo><mn>4</mn><mo>×</mo><mn>2</mn>') + '. Quale totale è giusto?', o: [['14', '14 €'], ['11', '11 €'], ['9', '9 €']], g: '11', s: '3 € di coperto + 4 piatti da 2 € = 3 + 8 = <strong>11 €</strong>. Se si calcolasse da sinistra a destra (3 + 4 = 7, poi 7 × 2) verrebbe 14 € e il ristorante perderebbe 3 € a tavolo!' },
      { t: 'Una calcolatrice «da bambini» fa le operazioni nell\'ordine in cui le scrivi e dà <strong>14</strong>; una «scientifica» dà <strong>11</strong>. Perché si è scelto di far vincere la moltiplicazione?', o: [['a', 'Perché la moltiplicazione è una somma ripetuta: 4 × 2 è un blocco unico (2 + 2 + 2 + 2)'], ['b', 'Per caso, era uguale anche il contrario'], ['c', 'Perché lo ha deciso il maestro']], g: 'a', s: '4 × 2 è «quattro piatti da 2»: un blocco che sta insieme. Per questo × e ÷ <strong>hanno la precedenza</strong> su + e −, e così tutto il mondo legge lo stesso conto nello stesso modo.' },
      { t: 'Ma se il cassiere vuole sommare <em>prima</em> coperto e piatti (3 + 4) e poi moltiplicare per 2 € ciascuno, cosa deve scrivere?', o: [['a', '3 + 4 × 2 (basta scriverlo così)'], ['b', '(3 + 4) × 2, con le parentesi'], ['c', '3 + (4 × 2) è l\'unico modo']], g: 'b', s: 'Le <strong>parentesi</strong> dicono «fai prima questo»: (3 + 4) × 2 = 14. Sono il modo con cui comandi tu l\'ordine. (3 + (4 × 2) darebbe 11, uguale a prima, perché × vinceva comunque.)' }
    ];
    function disegna(ris) {
      if (S.i >= D.length) { A.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">L\'ordine delle operazioni è un accordo che evita i conti diversi.</p><p class="tt-stat">Hai risposto giusto a ' + S.ok + ' su ' + D.length + '. Ordine: <strong>parentesi</strong>, poi <strong>× e ÷</strong>, poi <strong>+ e −</strong>; a parità si va da sinistra a destra.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="od-rifai">Rifai il caso</button></div></div>'; return; }
      var d = D[S.i], h = '<div class="tt-prog"><span>Domanda ' + (S.i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="od-avanti">' + (S.i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      A.innerHTML = h; if (ris) A.querySelector('#od-avanti').focus();
    }
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var g = b.dataset.v === D[S.i].g; if (g) S.ok++; disegna({ ok: g }); return; }
      if (b.id === 'od-avanti') { S.i++; disegna(); var x = A.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'od-rifai') { S = { i: 0, ok: 0 }; disegna(); }
    });
    disegna();
  })();

  /* ════════ IL GIOCO DELLE PARENTESI ════════ */
  var PG = (function () {
    var A = $('pg-area'), S = null, record = 0;
    function nuovo() {
      for (var t = 0; t < 300; t++) {
        var nums = [rnd(2, 9), rnd(2, 9), rnd(2, 9), rnd(2, 9)], ops = [pesca(['+', '−', '×']), pesca(['+', '−', '×', '÷']), pesca(['+', '−', '×'])];
        var rg = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]], op = [], val = {};
        rg.forEach(function (g) { var ex = costruisci(nums, ops, [g]), p = percorso(ex); if (p) { op.push({ g: g, ex: ex, v: p.valore }); val[p.valore] = (val[p.valore] || 0) + 1; } });
        var sen = percorso(costruisci(nums, ops, [])); if (!sen || op.length < 4) continue;
        var uniche = op.filter(function (o) { return val[o.v] === 1 && o.v !== sen.valore; }); if (!uniche.length) continue;
        var tg = pesca(uniche); S = { nums: nums, ops: ops, opz: op, tg: tg, sen: sen.valore, ris: null, tent: 0 }; return;
      }
      S = { nums: [2, 3, 4, 5], ops: ['+', '×', '−'], opz: [], tg: null, sen: 9 };
    }
    function disegna() {
      if (!S || !S.tg) { nuovo(); }
      var base = costruisci(S.nums, S.ops, []);
      var h = '<p class="mm-p">Senza parentesi: ' + math(base) + ' <strong>= ' + S.sen + '</strong>. Metti <strong>una coppia di parentesi</strong> per ottenere <strong>' + S.tg.v + '</strong>.</p><div class="tt-sc" role="group" aria-label="Dove metti le parentesi?">';
      S.opz.forEach(function (o, i) { h += '<button type="button" class="fz-btn sec pg-o" data-i="' + i + '"' + (S.ris ? ' disabled' : '') + '><span class="vh">' + testo(o.ex) + '</span>' + math(o.ex).replace('<math', '<math aria-hidden="true"') + '</button>'; });
      h += '</div>';
      if (S.ris) h += '<p class="fz-fb ' + (S.ris.ok ? 'si' : 'no') + '" role="status">' + S.ris.t + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="pg-altro">Un altro rompicapo</button></div>';
      h += '<p class="fz-conta">Rompicapi risolti al primo colpo in questa visita: ' + record + '</p>';
      A.innerHTML = h;
    }
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'pg-altro') { nuovo(); disegna(); A.querySelector('.pg-o').focus(); return; }
      if (b.dataset.i !== undefined && !S.ris) {
        var o = S.opz[+b.dataset.i];
        if (o === S.tg) { if (!S.tent) record++; S.ris = { ok: true, t: 'Esatto! Con le parentesi in quel punto fai prima ' + testo(S.tg.ex).match(/\(([^()]*)\)/)[1] + ' e il totale diventa ' + S.tg.v + '.' }; }
        else { S.tent++; S.ris = null; var fb = document.createElement('p'); fb.className = 'fz-fb no'; fb.setAttribute('role', 'status'); fb.textContent = 'Così fa ' + o.v + ', non ' + S.tg.v + '. Prova un\'altra posizione.'; var old = A.querySelector('.pg-fb'); if (old) old.remove(); fb.classList.add('pg-fb'); A.insertBefore(fb, A.querySelector('.fz-conta')); return; }
        disegna(); A.querySelector('#pg-altro').focus();
      }
    });
    disegna();
    return { stato: function () { return S; } };
  })();

  /* ════════ I QUATTRO QUATTRO ════════ */
  var QQ = (function () {
    var A = $('qq-area'), fatti = {}, TG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 16, 20, 24];
    var SOL = { 0: '4 + 4 − 4 − 4', 1: '4 ÷ 4 + 4 − 4', 2: '4 ÷ 4 + 4 ÷ 4', 3: '(4 + 4 + 4) ÷ 4', 4: '4 + 4 × (4 − 4)', 5: '(4 × 4 + 4) ÷ 4', 6: '4 + (4 + 4) ÷ 4', 7: '4 + 4 − 4 ÷ 4', 8: '4 + 4 + 4 − 4', 9: '4 + 4 + 4 ÷ 4', 12: '4 × (4 − 4 ÷ 4)', 15: '4 × 4 − 4 ÷ 4', 16: '4 + 4 + 4 + 4', 20: '4 × (4 + 4 ÷ 4)', 24: '4 + 4 + 4 × 4' };
    var tg = 0;
    function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
    function R(n, d) { var g = gcd(n, d) || 1; return { n: n / g, d: d / g }; }
    function valuta(s) { /* → {v:{n,d}, quattro:int} oppure {err} */
      var t = s.replace(/\s+/g, '').replace(/[x*]/gi, '×').replace(/[:\/]/g, '÷').replace(/[−–-]/g, '−'), p = 0, cont = 0;
      if (!t) return { err: 'Scrivi un\'espressione con quattro 4.' };
      if (/[^4+−×÷()]/.test(t)) return { err: 'Usa solo il numero 4, i segni + − × ÷ e le parentesi. (Il 44 non vale: ogni 4 è separato.)' };
      if (/44/.test(t)) return { err: 'Ogni 4 deve stare da solo: 44 non vale.' };
      function fattore() { if (t[p] === '4') { p++; cont++; return R(4, 1); } if (t[p] === '(') { p++; var v = somma(); if (v.err) return v; if (t[p] !== ')') return { err: 'Manca una parentesi chiusa.' }; p++; return v; } return { err: 'Controlla l\'espressione: dopo un segno ci vuole un 4 o una parentesi.' }; }
      function prodotto() { var a = fattore(); if (a.err) return a; while (t[p] === '×' || t[p] === '÷') { var o = t[p++], b = fattore(); if (b.err) return b; if (o === '×') a = R(a.n * b.n, a.d * b.d); else { if (b.n === 0) return { err: 'Non si può dividere per zero.' }; a = R(a.n * b.d, a.d * b.n); } } return a; }
      function somma() { var a = prodotto(); if (a.err) return a; while (t[p] === '+' || t[p] === '−') { var o = t[p++], b = prodotto(); if (b.err) return b; a = o === '+' ? R(a.n * b.d + b.n * a.d, a.d * b.d) : R(a.n * b.d - b.n * a.d, a.d * b.d); } return a; }
      var v = somma(); if (v.err) return v; if (p < t.length) return { err: 'Controlla le parentesi: c\'è qualcosa di troppo.' };
      return { v: v, quattro: cont };
    }
    function disegna(msg, cls) {
      var h = '<p class="mm-p">Hai <strong>quattro 4</strong>, i segni + − × ÷ e le parentesi. Con quelli puoi costruire <strong>molti</strong> numeri. Scegli quello da ottenere e scrivi l\'espressione (per × puoi digitare x o *, per ÷ i due punti o /).</p><div class="qq-tg" role="group" aria-label="Numero da ottenere">' + TG.map(function (n) { return '<button type="button" class="fz-chip" data-t="' + n + '" aria-pressed="' + (n === tg) + '">' + n + (fatti[n] ? ' ✓' : '') + '</button>'; }).join('') + '</div><form class="mm-tf" novalidate><div class="tt-num tb-num" style="max-width:24rem"><label for="qq-r">Espressione con quattro 4 che fa ' + tg + '</label><input id="qq-r" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="es. 4 + 4 − 4 − 4"/></div><button type="submit" class="fz-btn">Controlla</button></form><p class="fz-fb ' + (cls || '') + '" id="qq-fb" role="status" aria-live="polite">' + (msg || '') + '</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="qq-sol">Mostrami un modo</button></div><p class="fz-conta">Numeri trovati: ' + Object.keys(fatti).length + ' su ' + TG.length + '</p>';
      A.innerHTML = h;
    }
    A.addEventListener('submit', function (ev) {
      ev.preventDefault(); var r = valuta($('qq-r').value), val = $('qq-r').value;
      if (r.err) { $('qq-fb').className = 'fz-fb no'; $('qq-fb').textContent = r.err; return; }
      if (r.quattro !== 4) { $('qq-fb').className = 'fz-fb no'; $('qq-fb').textContent = 'Hai usato ' + r.quattro + ' quattro: ne servono esattamente quattro.'; return; }
      if (r.v.d === 1 && r.v.n === tg) { fatti[tg] = 1; disegna('Esatto! ' + val + ' = ' + tg + '. Prova un altro numero.', 'si'); return; }
      $('qq-fb').className = 'fz-fb no'; $('qq-fb').textContent = 'La tua espressione fa ' + (r.v.d === 1 ? r.v.n : r.v.n + '/' + r.v.d) + ', non ' + tg + '. Ricorda: prima parentesi, poi × e ÷.';
    });
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.t !== undefined) { tg = +b.dataset.t; disegna(); $('qq-r').focus(); return; }
      if (b.id === 'qq-sol') { var f = $('qq-fb'); f.className = 'fz-fb mezzo'; f.textContent = 'Un modo: ' + SOL[tg] + ' = ' + tg + '.'; }
    });
    disegna();
    return { valuta: valuta, SOL: SOL, TG: TG };
  })();

  /* ════════ DOMANDE, TUTOR, ALLENATI ════════ */
  function def(g) {
    var passi = [], ex = g.e, nomi = { parentesi: 'Prima si calcola dentro le parentesi.', precedenza: 'Moltiplicazioni e divisioni hanno la precedenza su somme e sottrazioni.', sinistra: 'Con operazioni dello stesso livello si va da sinistra a destra.' };
    g.p.passi.forEach(function (s, k) {
      var cs = s.cands, v = cs[s.idx];
      if (cs.length > 1) {
        var opz = cs.map(function (c, i) { return [String(i), '<span class="od-opz">' + c.label + '</span>']; });
        passi.push({ tipo: 'scelta', titolo: 'Che cosa fai per primo?', testo: 'Guarda l\'espressione: quale operazione devi fare per prima?', ctx: math(s.prima), opzioni: opz,
          verifica: function (x) { var c = cs[+x]; if (c.valido) return { ok: true }; return { ok: false, msg: nomi[c.motivo] || 'Non è la prima.' }; },
          aiuti: ['Prima le parentesi (se ci sono), poi × e ÷, infine + e −.', 'Con operazioni dello stesso livello si va da sinistra a destra.'], rivela: function () { return v.label; }, spiega: 'Si comincia da <strong>' + v.label + '</strong>.' });
      }
      passi.push({ tipo: 'num', titolo: 'Fai il calcolo', testo: 'Quanto fa ' + v.label + '?', ctx: cs.length > 1 ? '' : math(s.prima), atteso: s.r,
        verifica: function (x) { var n = T.intero(x); if (n === null) return { ok: false, msg: 'Scrivi un numero intero.' }; return { ok: n === s.r }; },
        aiuti: ['Calcola solo ' + v.label + ', il resto resta uguale.'], rivela: function () { return String(s.r); }, spiega: v.label + ' = <strong>' + s.r + '</strong>.', lav: s.dopo.op.length ? '= ' + math(s.dopo) : '= <strong>' + s.r + '</strong>' });
    });
    return { testata: '<p class="tt-q">Calcola: ' + math(ex) + '</p>', passi: passi, fine: '<p class="tt-q">' + testo(ex) + ' = ' + g.p.valore + '</p><p class="mm-p">Un passo alla volta: parentesi, poi × e ÷ da sinistra, poi + e − da sinistra.</p>' };
  }
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() { var t = $('tu-tipo').value, liv = +$('tu-liv').value, g = genera(liv, false, t === 'senza' ? false : t === 'con' ? true : undefined); TU.avvia(def(g)); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  var Gen = {};
  Gen.valore = function (liv, con) {
    var g = genera(liv, false, con), q = Q.num(g.p.valore, { html: '<p class="tt-q">Calcola: ' + math(g.e) + '</p>', aiuti: ['Prima le parentesi, poi × e ÷, infine + e − (sempre da sinistra a destra).', 'Primo passo: ' + g.p.passi[0].v + ' = ' + g.p.passi[0].r + '.'], formato: 'Scrivi il risultato finale.' });
    q.rivela = function () { return String(g.p.valore); }; q.guida = function () { TU.avvia(def(g), $('metodo')); }; q.g = g; return q;
  };
  Gen.prima = function (liv) {
    var g, s, cs; for (var tt = 0; tt < 60; tt++) { g = genera(Math.max(2, liv)); s = g.p.passi[0]; cs = s.cands; if (cs.filter(function (c) { return c.valido; }).length === 1) break; } var opz = cs.map(function (c, i) { return [String(i), c.label]; });
    var q = Q.scelta(String(s.idx), opz, { html: '<p class="tt-q">In questa espressione, quale operazione si fa <strong>per prima</strong>?<br>' + math(g.e) + '</p>', aiuti: ['Prima le parentesi, poi × e ÷, infine + e −.', 'Alla pari: da sinistra a destra.'] });
    q.verifica = function (v) { var c = cs[+v]; return { ok: !!c.valido, msg: ({ parentesi: 'Prima si calcola dentro le parentesi.', precedenza: '× e ÷ hanno la precedenza su + e −.', sinistra: 'Alla pari si va da sinistra a destra.' })[c.motivo] }; };
    q.rivela = function () { return cs[s.idx].label; }; q.guida = function () { TU.avvia(def(g), $('metodo')); }; return q;
  };
  Gen.errore = function (liv) {
    for (var t = 0; t < 200; t++) {
      var a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 6), segno = pesca(['+', '−']), mol = pesca(['×', '×', '÷']);
      var forma = Math.random() < 0.5 ? 'a-op-bc' : 'ab-op-c';
      var ex = forma === 'a-op-bc' ? { it: [a, b, c], op: [segno, mol] } : { it: [a, b, c], op: [mol, segno] };
      if (forma === 'ab-op-c' && mol === '÷') { a = b * rnd(2, 5); ex.it[0] = a; }
      if (forma === 'a-op-bc' && mol === '÷') { b = c * rnd(2, 5); ex.it[1] = b; }
      var p = percorso(ex); if (!p) continue;
      var giusto = Math.random() < 0.35, ordine, errv;
      if (forma === 'a-op-bc') { var x = calc(ex.it[0], segno, ex.it[1]); var y = calc(x, mol, ex.it[2]); if (!valida(x) || !valida(y)) continue; ordine = { x: x, y: y, txt: ex.it[0] + ' ' + segno + ' ' + ex.it[1] + ' = ' + x + ' → ' + x + ' ' + mol + ' ' + ex.it[2] + ' = ' + y }; errv = y; }
      else { var x2 = calc(ex.it[1], segno, ex.it[2]); var y2 = calc(ex.it[0], mol, x2); if (!valida(x2) || !valida(y2)) continue; ordine = { txt: ex.it[0] + ' ' + mol + ' ' + ex.it[1] + ' ' + segno + ' ' + ex.it[2] + ': prima ' + ex.it[1] + ' ' + segno + ' ' + ex.it[2] + ' = ' + x2 + ' → ' + ex.it[0] + ' ' + mol + ' ' + x2 + ' = ' + y2 }; errv = y2; }
      if (errv === p.valore && !giusto) continue;
      var rigaGiusta = p.passi.map(function (s) { return s.v + ' = ' + s.r; }).join(' → ');
      var testoRiga = giusto ? testo(ex) + ': ' + rigaGiusta + ' → risultato ' + p.valore : testo(ex) + ': ' + ordine.txt + ' → risultato ' + errv;
      var opz = giusto ? [['ok', 'È tutto giusto'], ['pre', 'Ha fatto prima + o − invece di × o ÷'], ['conto', 'Ha sbagliato un conto']] : [['ok', 'È tutto giusto'], ['pre', 'Ha fatto un\'operazione prima di quella che aveva la precedenza'], ['conto', 'Ha sbagliato un conto']];
      var att = giusto ? 'ok' : 'pre';
      var q = Q.scelta(att, opz, { html: '<p class="tt-q">Un compagno ha svolto così: <strong>' + testoRiga + '</strong>.<br>Dov\'è l\'errore?</p>', aiuti: ['Rifai tu l\'espressione rispettando le precedenze e confronta il risultato.', 'Il risultato giusto è ' + p.valore + '.'] });
      q.rivela = function () { return giusto ? 'è tutto giusto' : 'ha rispettato male le precedenze (il risultato giusto è ' + p.valore + ')'; };
      q.guida = function () { TU.avvia(def({ e: ex, p: p }), $('metodo')); }; return q;
    }
    return Gen.prima(liv);
  };
  Gen.parentesi = function (liv) {
    PG.stato(); for (var t = 0; t < 200; t++) {
      var nums = [rnd(2, 9), rnd(2, 9), rnd(2, 9), rnd(2, 9)], ops = [pesca(['+', '−', '×']), pesca(['+', '−', '×', '÷']), pesca(['+', '−', '×'])];
      var rg = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]], op = [], val = {};
      rg.forEach(function (g) { var ex = costruisci(nums, ops, [g]), p = percorso(ex); if (p) { op.push({ ex: ex, v: p.valore }); val[p.valore] = (val[p.valore] || 0) + 1; } });
      var uniche = op.filter(function (o) { return val[o.v] === 1; }); if (op.length < 4 || !uniche.length) continue;
      var tg = pesca(uniche), base = costruisci(nums, ops, []);
      var q = Q.scelta(String(op.indexOf(tg)), op.map(function (o, i) { return [String(i), testo(o.ex)]; }), { html: '<p class="tt-q">Con quali parentesi l\'espressione ' + math(base) + ' fa <strong>' + tg.v + '</strong>?</p>', aiuti: ['Calcola ogni versione: dentro le parentesi si fa prima.', 'Una sola versione dà ' + tg.v + '.'] });
      q.rivela = function () { return testo(tg.ex); }; return q;
    }
    return Gen.prima(liv);
  };
  var NOMI_TIPI = ['valore', 'prima', 'errore', 'parentesi'];
  T.allenati({ area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var liv = +$('ex-liv').value; var q = t === 'valore-senza' ? Gen.valore(liv, false) : t === 'valore-con' ? Gen.valore(Math.max(2, liv), true) : Gen[t](liv); q.et = 'Esercizio'; return q; },
    guida: function (q) { if (q.guida) q.guida(); } });

  /* ════════ IL SERVIZIO: scontrini ════════ */
  var CONTI = [
    function () { var a = rnd(2, 4), b = rnd(2, 5), c = rnd(3, 6); return { it: [a, b, c], op: ['+', '×'] }; },
    function () { var a = rnd(2, 4) * 2, b = rnd(3, 6); return { it: [a, rnd(2, 5), b], op: ['×', '+'] }; },
    function () { var a = rnd(2, 6), b = rnd(2, 6), c = rnd(2, 5), d = rnd(1, 8); return { it: [a, b, c, d], op: ['×', '+', '×'] }; },
    function () { var c = rnd(2, 5), a = c * rnd(2, 5), b = rnd(3, 9), d = rnd(2, 6); return { it: [a, c, b, d], op: ['÷', '+', '×'] }; },
    function () { return null; }, function () { return null; }
  ];
  var CTX = ['Lo scontrino del tavolo 2:', 'La cucina prepara:', 'Il conto del tavolo 4:', 'Il magazziniere conta:', 'Il cassiere con le parentesi:', 'L\'ordine speciale dello chef:'];
  T.servizio({ area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 90,
    genera: function (l, i) {
      var g = i < 4 ? (function () { for (var t = 0; t < 100; t++) { var e = CONTI[i](), p = percorso(e); if (p) return { e: e, p: p }; } return genera(1); })() : genera(i === 4 ? 3 : 4, false, true);
      var q = Q.num(g.p.valore, { html: '<p class="tt-q">Calcola il totale: ' + math(g.e) + '</p>', formato: 'Scrivi il numero.' });
      q.intro = CTX[i]; q.rivela = function () { return String(g.p.valore); };
      q.soluzione = function () { return '<p class="mm-p">' + g.p.passi.map(function (s) { return s.v + ' = ' + s.r; }).join(' → ') + ' → <strong>' + g.p.valore + '</strong></p>'; }; return q;
    } });

  /* ════════ MISSIONE ════════ */
  function mn(intro, att, hint, dopo) { var q = Q.num(att, { hint: hint, dopo: dopo, formato: 'Scrivi il numero.' }); q.intro = intro; return q; }
  var MI = [
    mn('Una brigata di <strong>4 cuochi</strong> prepara <strong>12 porzioni</strong> ciascuno; ne avanzano <strong>7</strong>. Quante porzioni sono state servite? (Espressione: 4 × 12 − 7)', 41, 'Prima la moltiplicazione: 4 × 12.', '4 × 12 − 7 = 48 − 7 = 41 porzioni.'),
    mn('Coperto <strong>2 €</strong> per ciascuna delle <strong>6 persone</strong>, più <strong>3 antipasti da 4 €</strong>. Quanto è il conto? (2 × 6 + 3 × 4)', 24, 'Prima le due moltiplicazioni, poi la somma.', '2 × 6 + 3 × 4 = 12 + 12 = 24 €.'),
    mn('<strong>(5 + 3) × 4 − 10 ÷ 2</strong>: quanto fa?', 27, 'Parentesi, poi × e ÷, infine la sottrazione.', '(5 + 3) × 4 − 10 ÷ 2 = 8 × 4 − 5 = 32 − 5 = 27.'),
    mn('Hai <strong>60 uova</strong>. Ne usi <strong>3 vaschette da 6</strong> per i dolci e dividi le altre in <strong>6 cartoni uguali</strong>. Quante uova in ogni cartone? (60 − 3 × 6) ÷ 6', 7, 'Prima la moltiplicazione dentro le parentesi, poi la sottrazione, infine la divisione.', '(60 − 18) ÷ 6 = 42 ÷ 6 = 7 uova.'),
    mn('Calcola <strong>48 ÷ 6 ÷ 2</strong>. Attenzione: a parità si va da sinistra a destra.', 4, 'Prima 48 ÷ 6, poi dividi il risultato per 2.', '48 ÷ 6 = 8; 8 ÷ 2 = 4 (non 16!).')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'L\'ordine delle operazioni', icona: '🧭', items: MI, rip: [
    { d: 'Quanto fa 3 + 4 × 2?', r: '11', s: 'Prima la moltiplicazione: 4 × 2 = 8, poi 3 + 8.' },
    { d: 'Quanto fa (3 + 4) × 2?', r: '14', s: 'Le parentesi dicono di fare prima 3 + 4.' },
    { d: 'Quanto fa 20 − 6 + 4?', r: '18', s: 'Alla pari si va da sinistra a destra: 20 − 6 = 14, poi + 4.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.ORDINE = { Gen: Gen, genera: genera, percorso: percorso, testo: testo, candidati: candidati, NOMI_TIPI: NOMI_TIPI, QQ: QQ, def: def, PG: PG };
})();
