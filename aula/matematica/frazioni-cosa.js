/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa 2: che cos'è una frazione
   Taglia e prendi (teglia o pizza), frazioni equivalenti, la retta dei numeri,
   il metodo passo passo (tutor.js), allenamento, missione e scheda stampabile.
   Tutto nel dispositivo: in localStorage solo il segno «tappa fatta» e il ripasso.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var ID = 'frazioni-cosa', URL = 'aula/matematica/frazioni-cosa.html';

  /* ── aritmetica e scrittura ── */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function intero(s) { s = String(s == null ? '' : s).replace(/[\s.']/g, ''); return /^\d+$/.test(s) ? parseInt(s, 10) : null; }
  function mfr(n, d) { return '<mfrac><mn>' + n + '</mn><mn>' + d + '</mn></mfrac>'; }
  function M(x, blocco) { return '<math' + (blocco ? ' display="block"' : '') + '>' + x + '</math>'; }
  function F(n, d) { return M(mfr(n, d)); }
  function mMisto(q, r, d) { return M('<mrow><mn>' + q + '</mn>' + mfr(r, d) + '</mrow>'); }
  function leggiFr(s) {
    s = String(s || '').trim().replace(/\s+/g, '');
    var m = /^(\d+)\/(\d+)$/.exec(s);
    if (m) return { n: +m[1], d: +m[2] };
    if (/^\d+$/.test(s)) return { n: +s, d: 1 };
    return null;
  }
  function leggiMisto(s) {
    var m = /^\s*(\d+)\s*(?:e|\+|\s)\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(s || ''));
    return m ? { q: +m[1], r: +m[2], d: +m[3] } : null;
  }
  var NUM = ['zero', 'un', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove', 'venti', 'ventuno', 'ventidue', 'ventitré', 'ventiquattro'];
  var DEN = { 2: ['mezzo', 'mezzi'], 3: ['terzo', 'terzi'], 4: ['quarto', 'quarti'], 5: ['quinto', 'quinti'], 6: ['sesto', 'sesti'], 7: ['settimo', 'settimi'], 8: ['ottavo', 'ottavi'], 9: ['nono', 'noni'], 10: ['decimo', 'decimi'], 11: ['undicesimo', 'undicesimi'], 12: ['dodicesimo', 'dodicesimi'] };
  function parole(n, d) {
    if (d === 1) return n === 1 ? 'un intero' : (NUM[n] || n) + ' interi';
    if (!DEN[d] || n >= NUM.length) return n + ' su ' + d;
    return (NUM[n]) + ' ' + DEN[d][n === 1 ? 0 : 1];
  }
  function classe(n, d) { return n % d === 0 ? 'apparente' : n < d ? 'propria' : 'impropria'; }

  /* ── le figure: teglia (griglia) o pizza (spicchi); sel = fette colorate ── */
  function griglia(d) { var r = 1; for (var k = 1; k * k <= d; k++) if (d % k === 0) r = k; return [r, d / r]; }
  function figura(d, sel, opz) {
    opz = opz || {};
    var interi = Math.max(1, opz.interi || Math.ceil(sel.length / d) || 1), h = '<div class="fc-teglie">';
    for (var w = 0; w < interi; w++) {
      var svg;
      if (opz.forma === 'pizza') {
        svg = '<svg viewBox="-52 -52 104 104" class="fc-svg pizza"><circle r="50" class="fc-bordo-f"/>';
        for (var j = 0; j < d; j++) {
          var k = w * d + j, on = sel[k], a0 = -Math.PI / 2 + 2 * Math.PI * j / d, a1 = a0 + 2 * Math.PI / d;
          var p = d === 1 ? 'M0,-48 A48,48 0 1 1 -0.01,-48 Z' : 'M0,0 L' + (48 * Math.cos(a0)).toFixed(2) + ',' + (48 * Math.sin(a0)).toFixed(2) + ' A48,48 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + (48 * Math.cos(a1)).toFixed(2) + ',' + (48 * Math.sin(a1)).toFixed(2) + ' Z';
          svg += '<path d="' + p + '" class="fc-f' + (on ? ' on' : '') + '"' + (opz.clic ? ' data-k="' + k + '" tabindex="0" role="button" aria-pressed="' + !!on + '" aria-label="Fetta ' + (j + 1) + (interi > 1 ? ' della ' + (w ? 'seconda' : 'prima') + ' pizza' : '') + '"' : '') + '/>';
        }
        svg += '</svg>';
      } else {
        var g = opz.strisce ? [opz.strisce[1], opz.strisce[0]] : griglia(d), R = g[0], C = g[1], W = 160, H = 100;
        svg = '<svg viewBox="-2 -2 ' + (W + 4) + ' ' + (H + 4) + '" class="fc-svg">';
        for (var j2 = 0; j2 < d; j2++) {
          var k2 = w * d + j2, on2 = sel[k2], c = opz.strisce ? Math.floor(j2 / R) : j2 % C, r = opz.strisce ? j2 % R : Math.floor(j2 / C);
          svg += '<rect x="' + (c * W / C).toFixed(2) + '" y="' + (r * H / R).toFixed(2) + '" width="' + (W / C).toFixed(2) + '" height="' + (H / R).toFixed(2) + '" class="fc-f' + (on2 ? ' on' : '') + '"' + (opz.clic ? ' data-k="' + k2 + '" tabindex="0" role="button" aria-pressed="' + !!on2 + '" aria-label="Fetta ' + (j2 + 1) + (interi > 1 ? ' della ' + (w ? 'seconda' : 'prima') + ' teglia' : '') + '"' : '') + '/>';
        }
        if (opz.strisce) for (var s = 1; s < C; s++) svg += '<line x1="' + s * W / C + '" y1="0" x2="' + s * W / C + '" y2="' + H + '" class="fc-forte"/>';
        svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="fc-bordo"/></svg>';
      }
      h += svg;
    }
    return h + '</div>';
  }
  function primeN(n, d, interi) { var s = []; for (var i = 0; i < (interi || Math.max(1, Math.ceil(n / d))) * d; i++) s.push(i < n); return s; }
  function sparse(n, d) { var s = primeN(0, d, 1); var idx = []; for (var i = 0; i < d; i++) idx.push(i); for (var j = idx.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = idx[j]; idx[j] = idx[k]; idx[k] = t; } idx.slice(0, n).forEach(function (i) { s[i] = true; }); return s; }

  var DENS = { 1: [2, 3, 4, 5, 6, 8, 10], 2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 3: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 18, 20] };
  var CTX = [['g di farina', 1], ['g di burro', 1], ['ml di latte', 1], ['cl di vino', 1], ['€ di incasso', 1], ['coperti', 1], ['minuti di cottura', 1], ['uova', 0]];
  function okm(m) { return { ok: true, msg: m || '' }; }
  function nom(m, c) { return { ok: false, msg: m, cls: c || 'no' }; }
  var API = { genera: genera, giudica: giudica, rispostaGiusta: rispostaGiusta, soluzione: soluzione, costruisci: costruisci, leggiFr: leggiFr, leggiMisto: leggiMisto, parole: parole, figura: figura, F: F, M: M, mfr: mfr, domanda: domanda };
  window.FRAZIONI_COSA = API;
  /* fuori dalla pagina della tappa serve solo il motore */
  if (!$('tp-fig')) return;

  /* ════════ LIM ════════ */
  $('mt-lim').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('main').classList.toggle('fz-grande', on);
  });

  /* ════════ DOMANDA LAMPO ════════ */
  var LAMPO = [
    { d: 'Tu mangi 2 fette di una teglia tagliata in 8. Il tuo amico mangia 1 fetta di una teglia uguale, tagliata in 4. Chi ha mangiato di più?', o: ['Tu', 'Il tuo amico', 'Uguale'], g: 2, s: '2/8 e 1/4 sono la stessa porzione: tagliando in due ogni fetta da 1/4 si ottengono 2 fette da 1/8. Sono frazioni <strong>equivalenti</strong>.' },
    { d: 'Quale porzione di torta è più grande: 1/6 o 1/8?', o: ['1/6', '1/8', 'Sono uguali'], g: 0, s: 'Più fette si fanno, più sono piccole: 1/6 è più grande di 1/8 anche se 6 è minore di 8.' },
    { d: 'Quante frazioni ci sono uguali a 1/2?', o: ['Una sola', 'Dieci', 'Infinite'], g: 2, s: '1/2 = 2/4 = 3/6 = 50/100 = …: basta moltiplicare sopra e sotto per lo stesso numero, e i numeri non finiscono mai.' }
  ];
  var lampoI = 0;
  function lampo() {
    var q = LAMPO[lampoI];
    $('fc-lampo').innerHTML = '<p class="tt-q">' + q.d + '</p><div class="tt-sc" role="group" aria-label="Risposte">' + q.o.map(function (o, i) { return '<button type="button" class="fz-btn sec" data-l="' + i + '">' + o + '</button>'; }).join('') + '</div><div id="lp-esito"></div>';
  }
  $('fc-lampo').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'lp-altra') { lampoI = (lampoI + 1) % LAMPO.length; lampo(); return; }
    if (b.dataset.l === undefined) return;
    var q = LAMPO[lampoI], ok = +b.dataset.l === q.g;
    Array.prototype.forEach.call($('fc-lampo').querySelectorAll('[data-l]'), function (x) { x.disabled = true; if (+x.dataset.l === q.g) x.classList.add('giusta'); });
    if (!ok) b.classList.add('sbagliata');
    $('lp-esito').innerHTML = '<p class="fz-fb ' + (ok ? 'si' : 'mezzo') + '">' + (ok ? 'Esatto!' : 'Non è questa, ma è un buon inizio.') + '</p><p class="tt-aiuto">' + q.s + '</p><div class="fz-azioni"><a class="fz-btn" href="' + URL + '#scopri" style="text-decoration:none;display:inline-flex;align-items:center">Scopri perché ↓</a><button type="button" class="fz-btn sec" id="lp-altra">Un\'altra domanda</button></div>';
  });
  lampo();

  /* ════════ TAGLIA E PRENDI ════════ */
  var TP = { d: 4, sel: [], forma: 'teglia', sfida: 0 };
  var SFIDE = [[1, 2], [3, 4], [2, 3], [5, 6], [3, 8], [5, 4], [6, 3], [7, 12]];
  function tpConta() { return TP.sel.filter(Boolean).length; }
  function tpDisegna() {
    var n = tpConta(), d = TP.d, interi = (n >= d || TP.sel.slice(d).some(Boolean)) ? 2 : 1;
    while (TP.sel.length < interi * d) TP.sel.push(false);
    $('tp-d').textContent = d;
    $('tp-fig').innerHTML = figura(d, TP.sel.slice(0, interi * d), { interi: interi, forma: TP.forma, clic: true });
    var c = classe(n, d), testo = n === 0 ? 'Nessuna fetta: 0/' + d + ' vale 0.' :
      c === 'propria' ? 'È una frazione <strong>propria</strong>: meno di una ' + (TP.forma === 'pizza' ? 'pizza' : 'teglia') + ' intera.' :
      c === 'apparente' ? 'È una frazione <strong>apparente</strong>: vale ' + (n / d) + ' ' + (n / d === 1 ? (TP.forma === 'pizza' ? 'pizza intera' : 'teglia intera') : (TP.forma === 'pizza' ? 'pizze intere' : 'teglie intere')) + '.' :
      'È una frazione <strong>impropria</strong>: più di un intero (' + Math.floor(n / d) + ' e ' + (n % d) + '/' + d + ').';
    $('tp-lettura').innerHTML = '<div class="fc-grande">' + F(n, d) + '</div><div><p class="fc-parole">' + parole(n, d) + '</p><p class="mm-p">' + testo + (n && gcd(n, d) > 1 ? ' Si può scrivere anche ' + (n / gcd(n, d)) + '/' + (d / gcd(n, d)) + '.' : '') + '</p></div>';
  }
  function tpSfida(msg, cls) {
    var s = SFIDE[TP.sfida % SFIDE.length];
    $('tp-sfida').innerHTML = '<p class="mm-p"><strong>Sfida ' + (TP.sfida % SFIDE.length + 1) + ' di ' + SFIDE.length + ':</strong> prendi ' + F(s[0], s[1]) + ' ' + (s[0] > s[1] ? 'di teglia (più di una!)' : 'della teglia') + '.</p><div class="fz-azioni" style="margin-top:0"><button type="button" class="fz-btn" id="tp-ok">Controlla</button><button type="button" class="fz-btn sec" id="tp-salta">Un\'altra sfida</button></div><p class="fz-fb ' + (cls || '') + '" id="tp-fb" role="status" aria-live="polite">' + (msg || '') + '</p>';
  }
  function tpTocca(el) {
    var k = +el.dataset.k; TP.sel[k] = !TP.sel[k]; tpDisegna();
    var x = $('tp-fig').querySelector('[data-k="' + k + '"]'); if (x) x.focus();
  }
  $('tp-fig').addEventListener('click', function (ev) { var el = ev.target.closest('[data-k]'); if (el) tpTocca(el); });
  $('tp-fig').addEventListener('keydown', function (ev) { var el = ev.target.closest('[data-k]'); if (el && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); tpTocca(el); } });
  function tpCambiaD(nd) { if (nd < 1 || nd > 12) return; TP.d = nd; TP.sel = []; tpDisegna(); }
  $('tp-meno').addEventListener('click', function () { tpCambiaD(TP.d - 1); });
  $('tp-piu').addEventListener('click', function () { tpCambiaD(TP.d + 1); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-forma]'), function (b) {
    b.addEventListener('click', function () {
      TP.forma = b.dataset.forma;
      Array.prototype.forEach.call(document.querySelectorAll('[data-forma]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      tpDisegna();
    });
  });
  $('tp-sfida').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'tp-salta') { TP.sfida++; tpSfida(); return; }
    if (b.id !== 'tp-ok') return;
    var s = SFIDE[TP.sfida % SFIDE.length], n = tpConta(), d = TP.d;
    if (n * s[1] === s[0] * d) {
      TP.sfida++;
      tpSfida('Esatto! ' + (n === s[0] && d === s[1] ? '' : 'Hai preso ' + n + '/' + d + ', che è equivalente a ' + s[0] + '/' + s[1] + '. ') + 'Ecco la sfida successiva.', 'si');
    } else if ((s[0] * d) % s[1] !== 0) {
      tpSfida('Con fette da 1/' + d + ' non si riesce a fare ' + s[0] + '/' + s[1] + ': cambia il numero di fette. Prova con ' + s[1] + ' o con un suo multiplo.', 'no');
    } else {
      tpSfida('Non ancora: con fette da 1/' + d + ' te ne servono ' + (s[0] * d / s[1]) + '. Ne hai prese ' + n + '.', 'no');
    }
  });
  tpDisegna(); tpSfida();

  /* ════════ TAGLIA ANCORA (equivalenti) ════════ */
  var BASI = [[1, 2], [2, 3], [3, 4], [1, 3], [2, 5], [3, 5], [1, 4]], EQ = null;
  function eqNuova() { var b = pesca(BASI); EQ = { a: b[0], b: b[1], m: 1, catena: [[b[0], b[1]]] }; eqDisegna(''); }
  function eqDisegna(msg, cls) {
    var n = EQ.a * EQ.m, d = EQ.b * EQ.m;
    $('eq-fig').innerHTML = '<div class="fc-con">' + figura(d, primeN(n, d, 1), { strisce: [EQ.b, EQ.m], interi: 1 }) + '<div class="fc-grande">' + F(n, d) + '</div></div>';
    $('eq-catena').innerHTML = M('<mrow>' + EQ.catena.map(function (c) { return mfr(c[0], c[1]); }).join('<mo>=</mo>') + '</mrow>');
    $('eq-fb').className = 'fz-fb' + (cls ? ' ' + cls : ''); $('eq-fb').innerHTML = msg;
  }
  $('eq-btn').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-k]'); if (!b) return;
    var k = +b.dataset.k;
    if (k === 0) return eqNuova();
    if (k > 0) {
      if (EQ.b * EQ.m * k > 36) return eqDisegna('Le fette diventerebbero troppo piccole da vedere: prova a riunirle.', 'mezzo');
      EQ.m *= k; EQ.catena.push([EQ.a * EQ.m, EQ.b * EQ.m]);
      return eqDisegna('Ogni fetta è diventata ' + k + ' fette: numeratore e denominatore sono stati moltiplicati per ' + k + '. La parte colorata è la stessa di prima: le frazioni sono <strong>equivalenti</strong>.', 'si');
    }
    if (EQ.m === 1) return eqDisegna(EQ.a + '/' + EQ.b + ' è <strong>ridotta ai minimi termini</strong>: numeratore e denominatore non hanno divisori comuni (il loro MCD è 1, ricordi la tappa 1?). Non si può riunire di più.', 'mezzo');
    var p = 2; while (EQ.m % p) p++;
    EQ.m /= p; EQ.catena.push([EQ.a * EQ.m, EQ.b * EQ.m]);
    eqDisegna('Hai riunito le fette a gruppi di ' + p + ': numeratore e denominatore sono stati divisi per ' + p + '. È la stessa porzione: hai <strong>semplificato</strong> la frazione.', 'si');
  });
  eqNuova();

  /* ════════ LA RETTA ════════ */
  var RT = null;
  function rtNuova() {
    var d = pesca([2, 3, 4, 5, 6, 8]), n; do { n = rnd(1, 2 * d - 1); } while (n === d);
    RT = { n: n, d: d };
    $('rt-dom').innerHTML = 'Tocca sulla retta il punto che corrisponde a ' + F(n, d) + '. Fra un numero intero e il successivo ci sono ' + d + ' parti uguali.';
    var X0 = 24, L = 592, h = '<svg viewBox="0 0 640 96" class="fc-retta-svg" role="group" aria-label="Retta dei numeri da 0 a 2"><line x1="' + X0 + '" y1="40" x2="' + (X0 + L + 10) + '" y2="40" class="fc-asse"/><path d="M' + (X0 + L + 16) + ',40 l-10,-6 v12 z" class="fc-freccia"/>';
    for (var k = 0; k <= 2 * d; k++) {
      var x = X0 + k * L / (2 * d), maggiore = k % d === 0;
      h += '<line x1="' + x + '" y1="' + (maggiore ? 26 : 32) + '" x2="' + x + '" y2="' + (maggiore ? 54 : 48) + '" class="fc-tacca' + (maggiore ? ' M' : '') + '"/>';
      if (maggiore) h += '<text x="' + x + '" y="80" class="fc-num">' + (k / d) + '</text>';
      h += '<rect x="' + (x - L / (4 * d)) + '" y="6" width="' + L / (2 * d) + '" height="62" class="fc-hit" data-t="' + k + '" tabindex="0" role="button" aria-label="Tacca ' + k + ' su ' + d + '"/><circle cx="' + x + '" cy="40" r="7" class="fc-punto" id="rt-p' + k + '"/>';
    }
    $('rt-svg').innerHTML = h + '</svg>';
    $('rt-fb').textContent = ''; $('rt-fb').className = 'fz-fb';
  }
  function rtTocca(el) {
    var k = +el.dataset.t, fb = $('rt-fb');
    Array.prototype.forEach.call($('rt-svg').querySelectorAll('.fc-punto'), function (c) { c.classList.remove('si', 'no'); });
    var ok = k === RT.n;
    $('rt-p' + k).classList.add(ok ? 'si' : 'no');
    fb.className = 'fz-fb ' + (ok ? 'si' : 'no');
    if (ok) fb.textContent = 'Esatto! ' + RT.n + '/' + RT.d + (RT.n > RT.d ? ' è più di 1: sta dopo l\'1, ' + (RT.n - RT.d) + ' tacche più avanti.' : ' è meno di 1: sta fra 0 e 1.');
    else fb.textContent = 'Hai toccato ' + k + '/' + RT.d + (gcd(k, RT.d) > 1 && k ? ' (cioè ' + k / gcd(k, RT.d) + '/' + RT.d / gcd(k, RT.d) + ')' : '') + '. Parti da 0 e conta ' + RT.n + ' tacche da 1/' + RT.d + '.';
  }
  $('rt-svg').addEventListener('click', function (ev) { var el = ev.target.closest('[data-t]'); if (el) rtTocca(el); });
  $('rt-svg').addEventListener('keydown', function (ev) { var el = ev.target.closest('[data-t]'); if (el && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); rtTocca(el); } });
  $('rt-altra').addEventListener('click', rtNuova);
  rtNuova();

  /* ════════ GENERATORI ════════ */
  function ridotta(liv, impropria) {
    var d, n; do { d = pesca(DENS[liv]); n = rnd(1, impropria ? 3 * d : d - 1); } while (gcd(n, d) !== 1 || n === d || (impropria && n < d));
    return [n, d];
  }
  function genera(tipo, liv) {
    if (tipo === 'misto-tutto') tipo = pesca(['figura', 'classe', 'equivalente', 'semplifica', 'confronta', 'quantita', 'misto']);
    var r, k;
    if (tipo === 'figura') { var d = pesca(liv === 1 ? [2, 3, 4, 6, 8] : [3, 4, 5, 6, 8, 9, 10, 12]), n = rnd(1, d - 1); return { tipo: tipo, n: n, d: d, forma: Math.random() < .4 ? 'pizza' : 'teglia', sel: sparse(n, d) }; }
    if (tipo === 'classe') { var dd = rnd(2, liv === 1 ? 8 : 12), c = pesca(['propria', 'impropria', 'apparente']), nn = c === 'propria' ? rnd(1, dd - 1) : c === 'apparente' ? dd * rnd(1, 4) : dd * rnd(1, 2) + rnd(1, dd - 1); return { tipo: tipo, n: nn, d: dd }; }
    if (tipo === 'equivalente') { r = ridotta(liv); k = rnd(2, liv === 1 ? 5 : liv === 2 ? 9 : 15); return { tipo: tipo, a: r[0], b: r[1], k: k, manca: Math.random() < .6 ? 'n' : 'd' }; }
    if (tipo === 'semplifica') { r = ridotta(liv, liv === 3 && Math.random() < .3); k = pesca(liv === 1 ? [2, 3, 4, 5] : liv === 2 ? [2, 3, 4, 5, 6, 8, 9] : [4, 6, 7, 8, 9, 12, 14, 15]); return { tipo: tipo, n: r[0] * k, d: r[1] * k }; }
    if (tipo === 'confronta') {
      var x, y;
      for (var i = 0; i < 200; i++) {
        x = ridotta(liv); y = ridotta(liv);
        if (Math.random() < .15) { var kk = rnd(2, 4); y = [x[0] * kk, x[1] * kk]; }
        if (x[1] === y[1] && x[0] === y[0]) continue;
        if (liv === 1 && Math.max(x[1], y[1]) % Math.min(x[1], y[1])) continue;
        break;
      }
      return { tipo: tipo, a: x[0], b: x[1], c: y[0], d: y[1] };
    }
    if (tipo === 'quantita') {
      var ctx = pesca(CTX), dq = pesca(liv === 1 ? [2, 3, 4, 5, 10] : [3, 4, 5, 6, 8, 10, 12]), nq; do { nq = rnd(1, dq - 1); } while (gcd(nq, dq) !== 1);
      var Q = dq * rnd(2, liv === 1 ? 20 : liv === 2 ? 60 : 200); if (ctx[0] === 'uova') Q = dq * rnd(1, 6);
      return { tipo: tipo, n: nq, d: dq, Q: Q, u: ctx[0] };
    }
    r = ridotta(liv, true); return { tipo: 'misto', n: r[0], d: r[1] };
  }

  /* ════════ IL METODO (tutor) ════════ */
  function passiSemplifica(n, d) {
    var g = gcd(n, d);
    return {
      testata: '<p class="mm-testa">Riduci ai minimi termini ' + F(n, d) + '</p>', fine: '<p class="tt-q">' + M(mfr(n, d) + '<mo>=</mo>' + mfr(n / g, d / g)) + '</p>',
      passi: [
        { titolo: 'Il MCD', tipo: 'num', testo: 'Qual è il MCD di ' + n + ' e ' + d + '? È il numero più grande che li divide tutti e due.', verifica: function (v) { var x = intero(v); if (x === g) return { ok: true }; if (x && n % x === 0 && d % x === 0) return { ok: false, msg: x + ' divide tutti e due, ma ce n\'è uno più grande.' }; return { ok: false, msg: x ? x + ' non divide tutti e due i numeri.' : 'Scrivi un numero intero.' }; }, aiuti: ['Scomponi in fattori primi ' + n + ' e ' + d + ' e prendi i fattori comuni con l\'esponente più piccolo.', 'Prova a dividere tutti e due per ' + g + '.'], rivela: function () { return String(g); }, spiega: '', lav: 'MCD(' + n + ', ' + d + ') = ' + g },
        { titolo: 'Il nuovo numeratore', tipo: 'num', testo: 'Dividi il numeratore per il MCD: quanto fa ' + n + ' : ' + g + '?', verifica: function (v) { return intero(v) === n / g ? { ok: true } : { ok: false, msg: 'Ricontrolla la divisione.' }; }, aiuti: [g + ' · ? = ' + n], rivela: function () { return String(n / g); }, spiega: '', lav: n + ' : ' + g + ' = ' + n / g },
        { titolo: 'Il nuovo denominatore', tipo: 'num', testo: 'Ora il denominatore: quanto fa ' + d + ' : ' + g + '?', verifica: function (v) { return intero(v) === d / g ? { ok: true } : { ok: false, msg: 'Ricontrolla la divisione.' }; }, aiuti: [g + ' · ? = ' + d], rivela: function () { return String(d / g); }, spiega: '', lav: d + ' : ' + g + ' = ' + d / g },
        { titolo: 'Il controllo', tipo: 'scelta', testo: 'La frazione ' + (n / g) + '/' + (d / g) + ' si può semplificare ancora?', opzioni: [['no', 'No, è ridotta ai minimi termini'], ['si', 'Sì, si può ancora']], verifica: function (v) { return v === 'no' ? { ok: true } : { ok: false, msg: (n / g) + ' e ' + (d / g) + ' non hanno divisori comuni oltre a 1: dividendo per il MCD si arriva subito alla fine.' }; }, aiuti: [], rivela: function () { return 'no'; }, spiega: 'Dividendo per il MCD si arriva in un colpo solo alla frazione ridotta ai minimi termini.', lav: M(mfr(n, d) + '<mo>=</mo>' + mfr(n / g, d / g)) }
      ]
    };
  }
  function passiConfronta(a, b, c, d) {
    var m = lcm(b, d), A = a * m / b, C = c * m / d, s = A > C ? '>' : A < C ? '<' : '=';
    return {
      testata: '<p class="mm-testa">Confronta ' + F(a, b) + ' e ' + F(c, d) + '</p>', fine: '<p class="tt-q">' + M(mfr(a, b) + '<mo>' + (s === '>' ? '&gt;' : s === '<' ? '&lt;' : '=') + '</mo>' + mfr(c, d)) + '</p>',
      passi: [
        { titolo: 'Lo stesso denominatore', tipo: 'num', testo: 'Per confrontarle servono frazioni con lo stesso denominatore: il mcm di ' + b + ' e ' + d + '. Quanto vale?', verifica: function (v) { var x = intero(v); if (x === m) return { ok: true }; if (x && x % b === 0 && x % d === 0) return { ok: false, msg: x + ' va bene come denominatore comune, ma il più piccolo è meglio: numeri più facili.' }; return { ok: false, msg: x ? x + ' non è multiplo di tutti e due.' : 'Scrivi un numero intero.' }; }, aiuti: ['Scrivi i multipli del più grande (' + Math.max(b, d) + ', ' + 2 * Math.max(b, d) + ', …) e fermati al primo che si divide anche per l\'altro.'], rivela: function () { return String(m); }, spiega: '', lav: 'mcm(' + b + ', ' + d + ') = ' + m },
        { titolo: 'La prima frazione', tipo: 'num', ctx: M(mfr(a, b) + '<mo>=</mo><mfrac><mo>?</mo><mn>' + m + '</mn></mfrac>'), testo: 'Il denominatore ' + b + ' è stato moltiplicato per ' + m / b + '. Quanto diventa il numeratore?', verifica: function (v) { var x = intero(v); return x === A ? { ok: true } : { ok: false, msg: x === a ? 'Il numeratore va moltiplicato anch\'esso per ' + m / b + '.' : 'Moltiplica ' + a + ' per ' + m / b + '.' }; }, aiuti: [a + ' · ' + m / b + ' = ?'], rivela: function () { return String(A); }, spiega: '', lav: M(mfr(a, b) + '<mo>=</mo>' + mfr(A, m)) },
        { titolo: 'La seconda frazione', tipo: 'num', ctx: M(mfr(c, d) + '<mo>=</mo><mfrac><mo>?</mo><mn>' + m + '</mn></mfrac>'), testo: 'Ora la seconda: ' + d + ' è stato moltiplicato per ' + m / d + '. Quanto diventa il numeratore?', verifica: function (v) { var x = intero(v); return x === C ? { ok: true } : { ok: false, msg: 'Moltiplica ' + c + ' per ' + m / d + '.' }; }, aiuti: [c + ' · ' + m / d + ' = ?'], rivela: function () { return String(C); }, spiega: '', lav: M(mfr(c, d) + '<mo>=</mo>' + mfr(C, m)) },
        { titolo: 'Il confronto', tipo: 'scelta', testo: 'Ora hanno lo stesso denominatore. Com\'è ' + a + '/' + b + ' rispetto a ' + c + '/' + d + '?', opzioni: [['>', 'è più grande'], ['=', 'è uguale'], ['<', 'è più piccola']], verifica: function (v) { return v === s ? { ok: true } : { ok: false, msg: 'Confronta i numeratori: ' + A + ' e ' + C + '.' }; }, aiuti: [], rivela: function () { return s === '>' ? 'più grande' : s === '<' ? 'più piccola' : 'uguale'; }, spiega: 'Con lo stesso denominatore vince il numeratore più grande: ' + A + ' ' + (s === '=' ? '=' : s) + ' ' + C + '.' }
      ]
    };
  }
  function passiQuantita(n, d, Q, u) {
    var una = Q / d;
    return {
      testata: '<p class="mm-testa">Quanto sono i ' + F(n, d) + ' di ' + Q + ' ' + esc(u) + '?</p>', fine: '<p class="tt-q">' + n + '/' + d + ' di ' + Q + ' = ' + una * n + ' ' + esc(u) + '</p>',
      passi: [
        { titolo: 'Quanto vale una parte', tipo: 'num', testo: 'Il denominatore divide ' + Q + ' in ' + d + ' parti uguali. Quanto vale una parte, cioè 1/' + d + ' di ' + Q + '?', verifica: function (v) { var x = intero(v); return x === una ? { ok: true } : { ok: false, msg: x === Q * d ? 'Hai moltiplicato: qui si divide per il denominatore.' : 'Calcola ' + Q + ' : ' + d + '.' }; }, aiuti: [Q + ' : ' + d + ' = ?'], rivela: function () { return String(una); }, spiega: '', lav: '1/' + d + ' di ' + Q + ' = ' + Q + ' : ' + d + ' = ' + una },
        { titolo: 'Quante parti prendi', tipo: 'num', testo: 'Il numeratore dice che di queste parti ne prendi ' + n + '. Quanto fa in tutto?', verifica: function (v) { var x = intero(v); return x === una * n ? { ok: true } : { ok: false, msg: 'Moltiplica il valore di una parte (' + una + ') per ' + n + '.' }; }, aiuti: [una + ' · ' + n + ' = ?'], rivela: function () { return una * n + ' ' + esc(u); }, spiega: 'Divido per il denominatore, moltiplico per il numeratore.', lav: n + '/' + d + ' di ' + Q + ' = ' + una + ' · ' + n + ' = <strong>' + una * n + '</strong> ' + esc(u) }
      ]
    };
  }
  function passiMisto(n, d) {
    var q = Math.floor(n / d), r = n % d;
    return {
      testata: '<p class="mm-testa">Scrivi ' + F(n, d) + ' come numero misto</p>', fine: '<p class="tt-q">' + M(mfr(n, d) + '<mo>=</mo><mn>' + q + '</mn>' + mfr(r, d)) + '</p>',
      passi: [
        { titolo: 'Gli interi', tipo: 'num', testo: 'Ogni intero è fatto di ' + d + ' fette da 1/' + d + '. Con ' + n + ' fette, quanti interi completi riesci a fare? (Quante volte ' + d + ' sta in ' + n + '?)', verifica: function (v) { var x = intero(v); return x === q ? { ok: true } : { ok: false, msg: 'Calcola ' + n + ' : ' + d + ' e prendi solo la parte intera.' }; }, aiuti: [d + ' · ' + q + ' = ' + d * q + ', ' + d + ' · ' + (q + 1) + ' = ' + d * (q + 1) + ': quale non supera ' + n + '?'], rivela: function () { return String(q); }, spiega: '', lav: n + ' : ' + d + ' = ' + q + ' con resto …' },
        { titolo: 'Le fette che avanzano', tipo: 'num', testo: 'Quante fette avanzano? È il resto della divisione ' + n + ' : ' + d + '.', verifica: function (v) { var x = intero(v); return x === r ? { ok: true } : { ok: false, msg: 'Calcola ' + n + ' − ' + d + ' · ' + q + '.' }; }, aiuti: [n + ' − ' + d * q + ' = ?'], rivela: function () { return String(r); }, spiega: 'Quindi ' + n + '/' + d + ' sono ' + q + ' interi e ' + r + '/' + d + '.', lav: M(mfr(n, d) + '<mo>=</mo><mn>' + q + '</mn>' + mfr(r, d)) }
      ]
    };
  }
  function costruisci(q) {
    if (q.tipo === 'semplifica') return passiSemplifica(q.n, q.d);
    if (q.tipo === 'confronta') return passiConfronta(q.a, q.b, q.c, q.d);
    if (q.tipo === 'quantita') return passiQuantita(q.n, q.d, q.Q, q.u);
    return passiMisto(q.n, q.d);
  }
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() { var q = genera($('tu-tipo').value, +$('tu-liv').value); TU.avvia(function () { return costruisci(q); }); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  /* ════════ ALLENATI ════════ */
  var EX = { q: null, risolto: false, conta: 0, tent: 0 }, exA = $('ex-area');
  function rispostaGiusta(q) {
    if (q.tipo === 'figura') return q.n + '/' + q.d;
    if (q.tipo === 'classe') return classe(q.n, q.d);
    if (q.tipo === 'equivalente') return String(q.manca === 'n' ? q.a * q.k : q.b * q.k);
    if (q.tipo === 'semplifica') { var g = gcd(q.n, q.d); return (q.n / g) + '/' + (q.d / g); }
    if (q.tipo === 'confronta') { var x = q.a * q.d, y = q.c * q.b; return x > y ? '>' : x < y ? '<' : '='; }
    if (q.tipo === 'quantita') return String(q.Q / q.d * q.n);
    return Math.floor(q.n / q.d) + ' ' + (q.n % q.d) + '/' + q.d;
  }
  function domanda(q) {
    if (q.tipo === 'figura') return '<p class="mm-dom">Che frazione della ' + (q.forma === 'pizza' ? 'pizza' : 'teglia') + ' è colorata?</p><div class="fc-figure fc-centro">' + figura(q.d, q.sel, { forma: q.forma, interi: 1 }) + '</div>';
    if (q.tipo === 'classe') return '<p class="mm-dom">' + F(q.n, q.d) + ' è una frazione…</p>';
    if (q.tipo === 'equivalente') return '<p class="mm-dom">Completa: ' + M(mfr(q.a, q.b) + '<mo>=</mo>' + (q.manca === 'n' ? '<mfrac><mo>?</mo><mn>' + q.b * q.k + '</mn></mfrac>' : '<mfrac><mn>' + q.a * q.k + '</mn><mo>?</mo></mfrac>')) + '</p>';
    if (q.tipo === 'semplifica') return '<p class="mm-dom">Riduci ai minimi termini: ' + F(q.n, q.d) + '</p>';
    if (q.tipo === 'confronta') return '<p class="mm-dom">' + F(q.a, q.b) + ' <span class="fc-vs">?</span> ' + F(q.c, q.d) + '</p>';
    if (q.tipo === 'quantita') return '<p class="mm-dom">Quanto sono i ' + F(q.n, q.d) + ' di ' + q.Q + ' ' + esc(q.u) + '?</p>';
    return '<p class="mm-dom">Scrivi come numero misto: ' + F(q.n, q.d) + '</p>';
  }
  function risposta(q) {
    if (q.tipo === 'classe') return '<div class="tt-sc" role="group" aria-label="Risposta"><button type="button" class="fz-btn sec" data-r="propria">propria</button><button type="button" class="fz-btn sec" data-r="impropria">impropria</button><button type="button" class="fz-btn sec" data-r="apparente">apparente</button></div>';
    if (q.tipo === 'confronta') return '<div class="tt-sc" role="group" aria-label="Risposta"><button type="button" class="fz-btn sec fc-seg" data-r="&gt;" aria-label="La prima è più grande">&gt;</button><button type="button" class="fz-btn sec fc-seg" data-r="=" aria-label="Sono uguali">=</button><button type="button" class="fz-btn sec fc-seg" data-r="&lt;" aria-label="La prima è più piccola">&lt;</button></div>';
    var ph = { figura: 'per esempio 3/4', equivalente: 'un numero', semplifica: 'per esempio 3/4', quantita: 'un numero', misto: 'per esempio 2 3/4' }[q.tipo];
    return '<form class="fz-risp" id="ex-f" novalidate><label for="ex-in">La tua risposta' + (q.tipo === 'quantita' ? ' (' + esc(q.u) + ')' : '') + '</label><div class="fz-risp-r"><input id="ex-in" type="text" inputmode="' + (q.tipo === 'equivalente' || q.tipo === 'quantita' ? 'numeric' : 'text') + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + ph + '"/><button type="submit" class="fz-btn">Controlla</button></div></form>';
  }
  function soluzione(q) {
    var g;
    if (q.tipo === 'figura') { g = gcd(q.n, q.d); return '<p>Le fette sono ' + q.d + ' in tutto (denominatore) e quelle colorate ' + q.n + ' (numeratore): <strong>' + q.n + '/' + q.d + '</strong>' + (g > 1 ? ', che ridotta è ' + q.n / g + '/' + q.d / g : '') + '.</p>'; }
    if (q.tipo === 'classe') { var c = classe(q.n, q.d); return '<p><strong>' + c + '</strong>: ' + (c === 'propria' ? q.n + ' è minore di ' + q.d + ', la frazione vale meno di 1.' : c === 'apparente' ? q.n + ' è multiplo di ' + q.d + ': ' + q.n + '/' + q.d + ' = ' + q.n / q.d + '.' : q.n + ' è maggiore di ' + q.d + ' ma non suo multiplo: vale più di 1 (' + Math.floor(q.n / q.d) + ' e ' + q.n % q.d + '/' + q.d + ').') + '</p>'; }
    if (q.tipo === 'equivalente') return '<p>Il ' + (q.manca === 'n' ? 'denominatore ' + q.b + ' è diventato ' + q.b * q.k : 'numeratore ' + q.a + ' è diventato ' + q.a * q.k) + ': è stato moltiplicato per ' + q.k + '. Lo stesso va fatto all\'altro numero: <strong>' + rispostaGiusta(q) + '</strong>.</p>' + M(mfr(q.a, q.b) + '<mo>=</mo>' + mfr(q.a * q.k, q.b * q.k), true);
    if (q.tipo === 'semplifica') { g = gcd(q.n, q.d); return '<p>MCD(' + q.n + ', ' + q.d + ') = ' + g + '. Divido sopra e sotto per ' + g + ':</p>' + M(mfr(q.n, q.d) + '<mo>=</mo><mfrac><mrow><mn>' + q.n + '</mn><mo>:</mo><mn>' + g + '</mn></mrow><mrow><mn>' + q.d + '</mn><mo>:</mo><mn>' + g + '</mn></mrow></mfrac><mo>=</mo>' + mfr(q.n / g, q.d / g), true); }
    if (q.tipo === 'confronta') { var m = lcm(q.b, q.d), s = rispostaGiusta(q); return '<p>Denominatore comune: mcm(' + q.b + ', ' + q.d + ') = ' + m + '.</p>' + M(mfr(q.a, q.b) + '<mo>=</mo>' + mfr(q.a * m / q.b, m) + '<mspace width="1em"/>' + mfr(q.c, q.d) + '<mo>=</mo>' + mfr(q.c * m / q.d, m), true) + '<p>Quindi ' + q.a + '/' + q.b + ' <strong>' + s + '</strong> ' + q.c + '/' + q.d + '.</p>'; }
    if (q.tipo === 'quantita') return '<p>' + q.Q + ' : ' + q.d + ' = ' + q.Q / q.d + ' (una parte); ' + q.Q / q.d + ' · ' + q.n + ' = <strong>' + q.Q / q.d * q.n + ' ' + esc(q.u) + '</strong>.</p>';
    return '<p>' + q.n + ' : ' + q.d + ' = ' + Math.floor(q.n / q.d) + ' con resto ' + q.n % q.d + ', quindi ' + q.n + '/' + q.d + ' = <strong>' + Math.floor(q.n / q.d) + ' e ' + q.n % q.d + '/' + q.d + '</strong>.</p>';
  }
  function exDisegna(focus) {
    var q = EX.q, guida = ['semplifica', 'confronta', 'quantita', 'misto'].indexOf(q.tipo) >= 0;
    exA.innerHTML = domanda(q) + '<div id="ex-r">' + risposta(q) + '</div><p class="fz-fb" id="ex-fb" role="status" aria-live="polite"></p><p class="tt-aiuto" id="ex-aiuto"></p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="ex-sugg">Suggerimento</button><button type="button" class="fz-btn sec" id="ex-sol">Mostra la soluzione</button>' + (guida ? '<button type="button" class="fz-btn sec" id="ex-guida">Aiutami passo passo</button>' : '') + '<button type="button" class="fz-btn" id="ex-nuovo">Nuovo esercizio</button></div><div id="ex-solbox" class="fz-esito" hidden></div>';
    if (focus) { var i = exA.querySelector('#ex-in') || exA.querySelector('[data-r]'); if (i) i.focus(); }
  }
  function exNuovo(focus) { EX.q = genera($('ex-tipo').value, +$('ex-liv').value); EX.risolto = false; EX.tent = 0; exDisegna(focus); }
  function fb(msg, cls) { var f = $('ex-fb'); f.className = 'fz-fb ' + (cls || ''); f.innerHTML = msg; }
  function bravo(msg) { fb('Esatto! ' + (msg || ''), 'si'); if (!EX.risolto) { EX.risolto = true; EX.conta++; $('ex-conta').textContent = 'Esercizi risolti in questa visita: ' + EX.conta; } }
  function sbagliato(msg, cls) { EX.tent++; fb(msg + (EX.tent >= 2 ? ' Prova con il suggerimento.' : ''), cls || 'no'); }
  function giudica(q, v) {
    var g;
    if (q.tipo === 'classe' || q.tipo === 'confronta') return v === rispostaGiusta(q) ? { ok: true } : nom(q.tipo === 'classe' ? 'Confronta il numeratore con il denominatore.' : 'Porta le due frazioni allo stesso denominatore e confronta i numeratori.');
    if (q.tipo === 'equivalente') { var x = intero(v), att = +rispostaGiusta(q); if (x === att) return { ok: true }; return nom(x === null ? 'Scrivi un numero intero.' : (q.manca === 'n' ? x === q.a + (q.b * q.k - q.b) : x === q.b + (q.a * q.k - q.a)) ? 'Hai aggiunto lo stesso numero: invece bisogna moltiplicare per lo stesso numero.' : 'Per quanto è stato moltiplicato l\'altro numero?'); }
    if (q.tipo === 'quantita') { var y = intero(v), a2 = +rispostaGiusta(q); if (y === a2) return { ok: true }; return nom(y === q.Q * q.d || y === q.Q * q.d / q.n ? 'Hai moltiplicato per il denominatore: invece si divide per il denominatore e si moltiplica per il numeratore.' : y === q.Q / q.d ? 'Questo è il valore di una sola parte: ora moltiplica per il numeratore.' : 'Dividi per il denominatore, poi moltiplica per il numeratore.'); }
    if (q.tipo === 'misto') { var m = leggiMisto(v); if (!m) return nom('Scrivi il numero misto così: 2 3/4 (intero, spazio, frazione).'); if (m.q === Math.floor(q.n / q.d) && m.r === q.n % q.d && m.d === q.d) return { ok: true }; if (m.q * m.d + m.r === q.n * m.d / q.d) return okm('(Si può scrivere anche ' + rispostaGiusta(q) + '.)'); return nom('Quante volte ' + q.d + ' sta in ' + q.n + '? Quello è l\'intero; il resto va sopra il ' + q.d + '.'); }
    var f = leggiFr(v);
    if (!f || !f.d) return nom('Scrivi una frazione così: 3/4.');
    if (q.tipo === 'figura') {
      if (f.n === q.n && f.d === q.d) return { ok: true };
      if (f.n * q.d === q.n * f.d) return okm('Hai scritto una frazione equivalente: contando le fette è ' + q.n + '/' + q.d + '.');
      if (f.n === q.d - q.n && f.d === q.d) return nom('Questa è la parte bianca: conta le fette colorate.');
      if (f.n === q.n && f.d === q.d - q.n) return nom('Il denominatore conta TUTTE le fette, anche quelle colorate.');
      return nom('Sotto: quante fette in tutto. Sopra: quante colorate.');
    }
    g = gcd(q.n, q.d);
    if (f.n * q.d !== q.n * f.d) return nom(f.n === q.n - (q.d - f.d) && f.d < q.d ? 'Hai sottratto lo stesso numero sopra e sotto: per semplificare si divide.' : 'Il valore è cambiato: dividi numeratore e denominatore per lo stesso numero.');
    if (gcd(f.n, f.d) > 1) return nom('Il valore è giusto, ma si può ancora semplificare: ' + f.n + ' e ' + f.d + ' hanno ancora un divisore comune.', 'mezzo');
    return { ok: true };
  }
  function controlla(q, v) { var r = giudica(q, v); if (r.ok) bravo(r.msg); else sbagliato(r.msg, r.cls); }
  exA.addEventListener('submit', function (ev) { ev.preventDefault(); controlla(EX.q, $('ex-in').value); });
  exA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var q = EX.q;
    if (b.dataset.r) return controlla(q, b.dataset.r);
    if (b.id === 'ex-nuovo') return exNuovo(true);
    if (b.id === 'ex-sol') { var s = $('ex-solbox'); s.innerHTML = '<div class="tt-fine">' + soluzione(q) + '</div>'; s.hidden = false; return; }
    if (b.id === 'ex-guida') { TU.avvia(function () { return costruisci(q); }, $('metodo')); return; }
    if (b.id === 'ex-sugg') {
      var t = { figura: 'Conta prima tutte le fette (il denominatore), poi solo quelle colorate (il numeratore).', classe: 'Il numeratore è più piccolo, più grande o un multiplo del denominatore?', equivalente: 'Di quanto è stato moltiplicato il numero che conosci? Fai lo stesso con l\'altro.', semplifica: 'Cerca il MCD di ' + q.n + ' e ' + q.d + ' e dividi tutti e due.', confronta: 'Porta tutte e due allo stesso denominatore: il mcm di ' + q.b + ' e ' + q.d + '.', quantita: 'Prima ' + q.Q + ' : ' + q.d + ', poi moltiplica per ' + q.n + '.', misto: 'Quante volte ' + q.d + ' sta in ' + q.n + '? E quanto avanza?' }[q.tipo];
      $('ex-aiuto').textContent = t; return;
    }
  });
  ['ex-tipo', 'ex-liv'].forEach(function (id) { $(id).addEventListener('change', function () { exNuovo(false); }); });
  exNuovo(false);

  /* ════════ MISSIONE ════════ */
  var MISS = [
    { tipo: 'frac', att: [3, 4], testo: 'La teglia di tiramisù è tagliata in 12 porzioni; ne sono state servite 9. Che frazione della teglia è stata servita? Scrivila ridotta ai minimi termini.', dopo: '9/12 = 3/4: tre quarti della teglia.' },
    { tipo: 'num', att: 400, u: 'g', testo: 'Per la pasta frolla servono i 2/5 di un pacco di farina da 1000 g. Quanti grammi di farina servono?', dopo: '1000 : 5 = 200, 200 · 2 = 400 g.' },
    { tipo: 'scelta', att: 'A', opzioni: [['A', 'La sala A'], ['B', 'La sala B'], ['=', 'Sono piene uguali']], testo: 'Nella sala A sono occupati 18 coperti su 24, nella sala B 20 su 32. Quale sala è più piena?', dopo: '18/24 = 3/4 = 6/8, mentre 20/32 = 5/8: la sala A è più piena, anche se nella B ci sono più persone.' },
    { tipo: 'num', att: 45, u: 'cl', testo: 'Da una bottiglia di vino da 75 cl sono stati versati i 3/5. Quanti cl sono stati versati?', dopo: '75 : 5 = 15, 15 · 3 = 45 cl. Nella bottiglia restano 30 cl.' },
    { tipo: 'misto', att: [2, 3, 4], testo: 'Lo chef ha usato 11/4 di panetto di burro. Scrivilo come numero misto: quanti panetti interi e quanto dell\'ultimo?', dopo: '11/4 = 2 e 3/4: due panetti interi e tre quarti del terzo.' }
  ];
  var MI = { i: 0, fatto: false, errori: 0 }, miA = $('mi-area');
  var RIP = [
    { d: 'In 3/4, che cosa indica il 4?', o: ['Le parti che prendo', 'In quante parti uguali divido l\'intero', 'Quanti interi ho'], g: 1, s: 'Il 4 è il denominatore: l\'intero è diviso in 4 parti uguali.' },
    { d: 'Quale frazione è equivalente a 2/3?', o: ['4/5', '6/9', '3/4'], g: 1, s: '2/3 = (2·3)/(3·3) = 6/9.' },
    { d: 'Qual è più grande: 1/5 o 1/7?', o: ['1/5', '1/7', 'Sono uguali'], g: 0, s: 'Più parti, parti più piccole: 1/5 è più grande.' },
    { d: '12/18 ridotta ai minimi termini è…', o: ['6/9', '2/3', '10/16'], g: 1, s: 'MCD(12, 18) = 6: 12/18 = 2/3. 6/9 si può ancora semplificare.' },
    { d: '9/4 è una frazione…', o: ['propria', 'impropria', 'apparente'], g: 1, s: '9 è maggiore di 4 ma non suo multiplo: vale più di 1, è impropria.' },
    { d: 'Quanto sono i 3/4 di 200 g?', o: ['150 g', '800 g', '50 g'], g: 0, s: '200 : 4 = 50, 50 · 3 = 150 g.' },
    { d: '10/5 è…', o: ['una frazione propria', 'una frazione apparente, uguale a 2', 'una frazione impropria che vale 2,5'], g: 1, s: '10 è multiplo di 5: 10/5 = 2.' },
    { d: '7/3 come numero misto è…', o: ['2 e 1/3', '1 e 4/3', '3 e 1/7'], g: 0, s: '7 : 3 = 2 con resto 1: 2 e 1/3.' }
  ];
  function miDisegna(msg, cls) {
    var n = MISS.length;
    if (MI.i >= n) {
      if (window.PERCORSO) PERCORSO.segna(ID);
      if (window.RIPASSO) RIPASSO.registra({ titolo: 'Che cos\'è una frazione', icona: '🍕', materia: 'Matematica' }, 'mate-' + ID, location.pathname, RIP);
      miA.innerHTML = '<div class="tt-fine"><p class="tt-et">Missione compiuta</p><p class="tt-q">🎉 Serata riuscita, e la tappa è fatta!</p><p class="tt-stat">' + (MI.errori === 0 ? 'Nessun errore: complimenti.' : 'Tentativi da rifare: ' + MI.errori + '. Va benissimo: si impara così.') + ' Domani, tra 3 giorni e tra una settimana trovi un ripasso lampo nella pagina del percorso.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-ricomincia">Rifai la missione</button><a class="fz-btn" href="aula/matematica/" style="text-decoration:none;display:inline-flex;align-items:center">Torna alle tappe</a></div></div>';
      return;
    }
    var m = MISS[MI.i], h = '<div class="tt-prog"><span>Problema ' + (MI.i + 1) + ' di ' + n + '</span><div class="tt-bar" role="img" aria-label="Fatti ' + MI.i + ' problemi su ' + n + '"><i style="width:' + Math.round(100 * MI.i / n) + '%"></i></div></div><p class="mm-pr">' + esc(m.testo) + '</p>';
    if (MI.fatto) h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="mi-avanti">' + (MI.i + 1 >= n ? 'Concludi la missione' : 'Prossimo problema') + '</button></div>';
    else if (m.tipo === 'scelta') h += '<div class="tt-sc" role="group" aria-label="Risposta">' + m.opzioni.map(function (o) { return '<button type="button" class="fz-btn sec" data-mi="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
    else h += '<form class="fz-risp" id="mi-f" novalidate><label for="mi-in">La tua risposta' + (m.u ? ' (' + m.u + ')' : '') + '</label><div class="fz-risp-r"><input id="mi-in" type="text" inputmode="' + (m.tipo === 'num' ? 'numeric' : 'text') + '" autocomplete="off" placeholder="' + (m.tipo === 'frac' ? 'per esempio 3/4' : m.tipo === 'misto' ? 'per esempio 2 3/4' : '') + '"/><button type="submit" class="fz-btn">Controlla</button></div></form>';
    h += '<p class="fz-fb ' + (cls || '') + '" id="mi-fb" role="status" aria-live="polite">' + (msg || '') + '</p>';
    miA.innerHTML = h;
  }
  function miVerifica(v) {
    var m = MISS[MI.i], ok = false, msg = 'Non ancora: rileggi il problema con calma.';
    if (m.tipo === 'scelta') ok = v === m.att;
    else if (m.tipo === 'num') ok = intero(v) === m.att;
    else if (m.tipo === 'frac') { var f = leggiFr(v); ok = f && f.n === m.att[0] && f.d === m.att[1]; if (!ok && f && f.d && f.n * m.att[1] === m.att[0] * f.d) msg = 'Il valore è giusto, ma va ridotta ai minimi termini.'; }
    else { var x = leggiMisto(v); ok = x && x.q === m.att[0] && x.r === m.att[1] && x.d === m.att[2]; if (!x) msg = 'Scrivi il numero misto così: 2 3/4.'; }
    if (ok) { MI.fatto = true; miDisegna('Esatto! ' + esc(m.dopo), 'si'); miA.querySelector('#mi-avanti').focus(); }
    else { MI.errori++; var f2 = $('mi-fb'); f2.className = 'fz-fb no'; f2.textContent = msg; }
  }
  miA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'mi-ricomincia') { MI = { i: 0, fatto: false, errori: 0 }; miDisegna(); return; }
    if (b.id === 'mi-avanti') { MI.i++; MI.fatto = false; miDisegna(); var x = miA.querySelector('input,[data-mi],button'); if (x) x.focus(); return; }
    if (b.dataset.mi) miVerifica(b.dataset.mi);
  });
  miA.addEventListener('submit', function (ev) { ev.preventDefault(); miVerifica($('mi-in').value); });
  miDisegna();

  /* ════════ SCHEDA STAMPABILE ════════ */
  function testoStampa(q) {
    if (q.tipo === 'figura') return 'Che frazione è colorata? <span class="fc-st-fig">' + figura(q.d, q.sel, { forma: q.forma, interi: 1 }) + '</span>';
    if (q.tipo === 'equivalente') return 'Completa: ' + M(mfr(q.a, q.b) + '<mo>=</mo>' + (q.manca === 'n' ? '<mfrac><mo>…</mo><mn>' + q.b * q.k + '</mn></mfrac>' : '<mfrac><mn>' + q.a * q.k + '</mn><mo>…</mo></mfrac>'));
    if (q.tipo === 'semplifica') return 'Riduci ai minimi termini: ' + F(q.n, q.d);
    if (q.tipo === 'confronta') return 'Metti &lt;, = oppure &gt;: ' + F(q.a, q.b) + ' … ' + F(q.c, q.d);
    if (q.tipo === 'quantita') return 'Quanto sono i ' + F(q.n, q.d) + ' di ' + q.Q + ' ' + esc(q.u) + '?';
    return 'Scrivi come numero misto: ' + F(q.n, q.d);
  }
  function solStampa(q) {
    var r = rispostaGiusta(q);
    if (q.tipo === 'quantita') return q.Q + ' : ' + q.d + ' · ' + q.n + ' = ' + r + ' ' + esc(q.u);
    if (q.tipo === 'confronta') return q.a + '/' + q.b + ' ' + esc(r) + ' ' + q.c + '/' + q.d + ' <span class="fz-m">(mcm ' + lcm(q.b, q.d) + ': ' + q.a * lcm(q.b, q.d) / q.b + '/' + lcm(q.b, q.d) + ' e ' + q.c * lcm(q.b, q.d) / q.d + '/' + lcm(q.b, q.d) + ')</span>';
    if (q.tipo === 'equivalente') return q.a + '/' + q.b + ' = ' + q.a * q.k + '/' + q.b * q.k;
    if (q.tipo === 'semplifica') return q.n + '/' + q.d + ' = ' + r + ' <span class="fz-m">(MCD ' + gcd(q.n, q.d) + ')</span>';
    if (q.tipo === 'misto') return q.n + '/' + q.d + ' = ' + r.replace(' ', ' e ');
    return r;
  }
  var AIUTI_FOGLIO = '<div class="mm-promemoria"><p><strong>Denominatore</strong> (sotto): in quante parti uguali divido l\'intero. <strong>Numeratore</strong> (sopra): quante parti prendo.</p><p><strong>Equivalenti:</strong> moltiplico o divido sopra e sotto per lo stesso numero. <strong>Minimi termini:</strong> divido sopra e sotto per il MCD.</p><p><strong>Confronto:</strong> stesso denominatore (il mcm), poi vince il numeratore più grande. <strong>Frazione di una quantità:</strong> divido per il denominatore, moltiplico per il numeratore.</p></div>';
  $('sc-crea').addEventListener('click', function () {
    var tipi = Array.prototype.map.call(document.querySelectorAll('input[name="sc-t"]:checked'), function (x) { return x.value; }), out = $('sc-out');
    if (!tipi.length) { out.hidden = false; out.innerHTML = '<p class="fz-err" role="alert">Scegli almeno un tipo di esercizio.</p>'; return; }
    var lv = +$('sc-liv').value, n = +$('sc-n').value, file = $('sc-ab').checked ? ['A', 'B'] : [''], h = '', sol = '';
    file.forEach(function (Fl) {
      var S = [], visti = {};
      for (var i = 0; S.length < n && i < n * 40; i++) { var q = genera(tipi[S.length % tipi.length], lv), k = JSON.stringify([q.tipo, q.n, q.d, q.a, q.b, q.c, q.k, q.Q]); if (!visti[k]) { visti[k] = 1; S.push(q); } }
      h += '<div class="fz-pag' + (h ? ' fz-sol-pag' : '') + '"><h2 class="fz-foglio-t">Che cos\'è una frazione' + (Fl ? ' · file ' + Fl : '') + '</h2><p class="fz-foglio-i">Nome ______________________ Classe ________ Data ____________</p>' + ($('sc-aiuti').checked ? AIUTI_FOGLIO : '') + '<p class="fz-foglio-c">Svolgi gli esercizi scrivendo i passaggi.</p><ol class="fz-es" style="--h:' + (n <= 8 ? '2.9cm' : n === 10 ? '2.4cm' : '2cm') + '">';
      S.forEach(function (q) { h += '<li class="fz-es-i">' + testoStampa(q) + '</li>'; });
      h += '</ol></div>';
      sol += '<h3 class="fz-sottit">' + (Fl ? 'File ' + Fl : 'Soluzioni') + '</h3><ol class="fz-es fz-es-sol">' + S.map(function (q) { return '<li>' + solStampa(q) + '</li>'; }).join('') + '</ol>';
    });
    if ($('sc-sol').checked) h += '<div class="fz-pag fz-sol-pag"><h2 class="fz-foglio-t">Soluzioni</h2>' + sol + '</div>';
    out.innerHTML = h; out.hidden = false; $('sc-stampa').hidden = false;
  });
  $('sc-stampa').addEventListener('click', function () { window.print(); });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  API.controlla = controlla;
})();
