/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «I prodotti notevoli»
   Binomio: { A: monomio positivo, B: monomio positivo, s: +1 | −1 }  →  (A + sB)
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'prodotti-notevoli', URL = 'aula/matematica/prodotti-notevoli.html';
  var T = window.TB, A = window.ALG, $ = T.$, rnd = T.rnd, pesca = T.pesca, M = T.M, Q = T.Q;
  var FORMP = 'Per esempio 4x^2 − 12x + 9 (senza parentesi, potenze con ^).';
  T.lim('mt-lim', 'main');
  function pol(b) { return [b.A, A.M(b.s * b.B.c, b.B.e)]; }
  function pm(p) { return '<mo>(</mo>' + A.mmlPoly(p) + '<mo>)</mo>'; }
  function mmlBin(b) { return pm(pol(b)); }
  function mathQ(b) { return '<math><msup><mrow>' + mmlBin(b) + '</mrow><mn>2</mn></msup></math>'; }
  function mathSD(b) { return '<math>' + pm([b.A, b.B]) + pm([b.A, A.M(-b.B.c, b.B.e)]) + '</math>'; }
  function testoBin(b) { return '(' + A.testoPoly(pol(b)) + ')'; }
  function genBin(liv) {
    var a, B;
    if (liv === 1) { a = A.M(1, { x: 1 }); B = A.M(rnd(1, 9), {}); }
    else if (liv === 2) { a = A.M(rnd(2, 4), { x: 1 }); B = A.M(rnd(1, 7), {}); }
    else { var two = Math.random() < 0.6; a = A.M(rnd(1, 4), { a: 1 }); B = two ? A.M(rnd(1, 5), { b: 1 }) : A.M(rnd(1, 7), {}); if (Math.random() < 0.3) a = A.M(a.c, { x: 2 }); }
    return { A: a, B: B, s: Math.random() < 0.5 ? 1 : -1 };
  }
  function quadrato(b) { return A.mulP(pol(b), pol(b)); }
  function sdiff(b) { return A.mulP([b.A, b.B], [b.A, A.M(-b.B.c, b.B.e)]); }

  /* ════════ IL CASO ════════ */
  (function () {
    var C = $('pn-caso'), S = { i: 0, ok: 0 };
    var D = [
      { t: 'Una teglia quadrata ha il lato lungo <strong>x + 3</strong> centimetri. Quale è la sua area, cioè <strong>(x + 3)²</strong>?', o: [['a', 'x² + 9'], ['b', 'x² + 6x + 9'], ['c', '2x + 6']], g: 'b', s: 'Il quadrato ha 4 pezzi: un quadrato x², due rettangoli 3x e un quadratino 3² = 9: <strong>x² + 6x + 9</strong>. Chi scrive x² + 9 «perde» i due rettangoli (6x)!' },
      { t: 'Senza calcolatrice: <strong>52²</strong>. Scomponi 52 = 50 + 2 e usa quello che hai appena visto: (50 + 2)² = 2500 + 2·50·2 + 4. Quanto fa?', o: [['a', '2504'], ['b', '2704'], ['c', '2604']], g: 'b', s: '2500 + <strong>200</strong> + 4 = <strong>2704</strong>. Questo trucco, il <strong>quadrato di un binomio</strong>, ti fa calcolare a mente i quadrati vicini a un numero tondo.' },
      { t: 'E <strong>48 × 52</strong>? Sono 50 − 2 e 50 + 2: la differenza dei quadrati. Quanto fa?', o: [['a', '2496'], ['b', '2500'], ['c', '2404']], g: 'a', s: '(50 − 2)(50 + 2) = 50² − 2² = 2500 − 4 = <strong>2496</strong>. Questo è il prodotto <strong>somma per differenza</strong>: a² − b². I termini di mezzo si cancellano!' }
    ];
    function disegna(ris) {
      if (S.i >= D.length) { C.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">Due formule da sapere a memoria ti fanno battere la calcolatrice.</p><p class="tt-stat">Hai risposto giusto a ' + S.ok + ' su ' + D.length + '. Sotto: il quadrato a pezzi, il gioco del calcolo mentale e le regole.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="pn-rifai">Rifai il caso</button></div></div>'; return; }
      var d = D[S.i], h = '<div class="tt-prog"><span>Domanda ' + (S.i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="pn-avanti">' + (S.i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      C.innerHTML = h; if (ris) C.querySelector('#pn-avanti').focus();
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var g = b.dataset.v === D[S.i].g; if (g) S.ok++; disegna({ ok: g }); return; }
      if (b.id === 'pn-avanti') { S.i++; disegna(); var x = C.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'pn-rifai') { S = { i: 0, ok: 0 }; disegna(); }
    });
    disegna();
  })();

  /* ════════ IL QUADRATO A PEZZI ════════ */
  (function () {
    var SA = $('qp-a'), SB = $('qp-b'), SV = $('qp-svg'), OUT = $('qp-out');
    function disegna() {
      var a = +SA.value, b = +SB.value, U = 22, ox = 24, oy = 24, W = (a + b) * U;
      var s = '<svg viewBox="0 0 ' + (W + 60) + ' ' + (W + 50) + '" role="img" aria-label="Quadrato di lato ' + a + ' più ' + b + ' diviso in un quadrato ' + a + ' per ' + a + ', due rettangoli ' + a + ' per ' + b + ' e un quadrato ' + b + ' per ' + b + '">';
      var cel = [[ox, oy, a * U, a * U, '#cfe3c8', 'a² = ' + a * a], [ox + a * U, oy, b * U, a * U, '#f6dcb0', 'ab = ' + a * b], [ox, oy + a * U, a * U, b * U, '#f6dcb0', 'ab = ' + a * b], [ox + a * U, oy + a * U, b * U, b * U, '#e7c7c0', 'b² = ' + b * b]];
      cel.forEach(function (c) { s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="' + c[2] + '" height="' + c[3] + '" fill="' + c[4] + '" stroke="#2C3E2D" stroke-width="2"/><text x="' + (c[0] + c[2] / 2) + '" y="' + (c[1] + c[3] / 2 + 5) + '" text-anchor="middle" font-size="' + (c[2] < 60 ? 12 : 15) + '" font-weight="700" fill="#1f2d20">' + c[5] + '</text>'; });
      s += '<text x="' + (ox + a * U / 2) + '" y="16" text-anchor="middle" font-size="14">a = ' + a + '</text><text x="' + (ox + a * U + b * U / 2) + '" y="16" text-anchor="middle" font-size="14">b = ' + b + '</text></svg>';
      SV.innerHTML = s;
      var tot = (a + b) * (a + b), sol = a * a + b * b;
      OUT.innerHTML = '<p class="mm-p"><math><msup><mrow><mo>(</mo><mn>' + a + '</mn><mo>+</mo><mn>' + b + '</mn><mo>)</mo></mrow><mn>2</mn></msup><mo>=</mo><mn>' + tot + '</mn></math>, e i pezzi sono: <strong>' + (a * a) + ' + ' + (a * b) + ' + ' + (a * b) + ' + ' + (b * b) + ' = ' + tot + '</strong>. Cioè a² + 2ab + b².</p><p class="fz-fb mezzo">Attenzione: se scrivi solo a² + b² trovi ' + sol + ', non ' + tot + '. Mancano i due rettangoli: <strong>2ab = ' + (2 * a * b) + '</strong>.</p>';
    }
    [SA, SB].forEach(function (e) { e.addEventListener('change', disegna); });
    disegna();
  })();

  /* ════════ IL CALCOLO MENTALE ════════ */
  function mentale(liv) {
    var base = liv === 1 ? pesca([10, 20, 30]) : liv === 2 ? pesca([50, 100, 40, 60]) : pesca([100, 200, 300, 500]), d = rnd(1, liv === 1 ? 3 : liv === 2 ? 4 : 6), tipo = Math.random() < 0.5 ? 'q' : 'sd', s = Math.random() < 0.5 ? 1 : -1;
    if (tipo === 'q') { var n = base + s * d, ris = n * n; return { html: 'Calcola a mente <strong>' + n + '²</strong>.', ris: ris, hint: 'Scomponi ' + n + ' = ' + base + (s > 0 ? ' + ' : ' − ') + d + ' e usa (a ' + (s > 0 ? '+' : '−') + ' b)² = a² ' + (s > 0 ? '+' : '−') + ' 2ab + b².', spiega: n + '² = (' + base + (s > 0 ? ' + ' : ' − ') + d + ')² = ' + base * base + (s > 0 ? ' + ' : ' − ') + 2 * base * d + ' + ' + d * d + ' = <strong>' + ris + '</strong>', tipo: tipo }; }
    var x = base - d, y = base + d; return { html: 'Calcola a mente <strong>' + x + ' × ' + y + '</strong>.', ris: x * y, hint: x + ' = ' + base + ' − ' + d + ' e ' + y + ' = ' + base + ' + ' + d + ': usa (a − b)(a + b) = a² − b².', spiega: x + ' × ' + y + ' = (' + base + ' − ' + d + ')(' + base + ' + ' + d + ') = ' + base * base + ' − ' + d * d + ' = <strong>' + (x * y) + '</strong>', tipo: tipo };
  }
  (function () {
    var C = $('cm-area'), S = { m: null, ris: null, serie: 0, best: 0, liv: 1 };
    function nuovo() { S.m = mentale(S.liv); S.ris = null; disegna(); }
    function disegna() {
      var h = '<div class="fz-scelte mm-due"><div><label for="cm-liv">Difficoltà</label><select id="cm-liv"><option value="1"' + (S.liv === 1 ? ' selected' : '') + '>1 · vicino a 10, 20, 30</option><option value="2"' + (S.liv === 2 ? ' selected' : '') + '>2 · vicino a 50 o 100</option><option value="3"' + (S.liv === 3 ? ' selected' : '') + '>3 · numeri grandi</option></select></div></div><p class="tt-q">' + S.m.html + '</p>';
      if (!S.ris) h += '<form class="mm-tf" novalidate><div class="tt-num tb-num"><label for="cm-r">Il risultato</label><input id="cm-r" type="text" inputmode="numeric" autocomplete="off"/></div><button type="submit" class="fz-btn">Controlla</button></form><div class="fz-azioni"><button type="button" class="fz-btn sec" id="cm-aiuto">Suggerimento</button></div><p class="fz-fb" id="cm-fb" role="status" aria-live="polite"></p>';
      else h += '<p class="fz-fb ' + (S.ris.ok ? 'si' : 'no') + '" role="status">' + (S.ris.ok ? 'Esatto! ' : 'Non proprio. ') + S.m.spiega + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="cm-altro">Un altro calcolo</button></div>';
      h += '<p class="fz-conta">Giusti in fila: ' + S.serie + ' · record in questa visita: ' + S.best + '</p>';
      C.innerHTML = h;
    }
    C.addEventListener('submit', function (ev) {
      ev.preventDefault(); var v = T.intero($('cm-r').value);
      if (v === null) { $('cm-fb').className = 'fz-fb no'; $('cm-fb').textContent = 'Scrivi un numero intero.'; return; }
      var ok = v === S.m.ris; S.serie = ok ? S.serie + 1 : 0; S.best = Math.max(S.best, S.serie); S.ris = { ok: ok }; disegna(); C.querySelector('#cm-altro').focus();
    });
    C.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (!b) return; if (b.id === 'cm-altro') { nuovo(); $('cm-r').focus(); } if (b.id === 'cm-aiuto') { var f = $('cm-fb'); f.className = 'fz-fb mezzo'; f.textContent = S.m.hint; } });
    C.addEventListener('change', function (ev) { if (ev.target.id === 'cm-liv') { S.liv = +ev.target.value; nuovo(); $('cm-liv').focus(); } });
    nuovo();
  })();

  /* ════════ GENERATORI ════════ */
  function monoQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaMono(v, att); }, aiuti: aiuti, rivela: function () { return A.testoMono(att); }, spiega: spiega }; }
  function polyQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaPoly(v, att); }, aiuti: aiuti, rivela: function () { return A.testoPoly(att); }, spiega: spiega }; }
  function defQ(b) {
    var a2 = A.mulM(b.A, b.A), dp = A.mulM(A.M(2 * b.s, {}), A.mulM(b.A, b.B)), b2 = A.mulM(b.B, b.B), r = quadrato(b);
    return { testata: '<p class="tt-q">Sviluppa ' + mathQ(b) + '</p>', passi: [
      monoQ(a2, ['Il quadrato del primo termine: eleva al quadrato coefficiente ed esponenti di ' + A.testoMono(b.A) + '.'], 'Il quadrato del primo: ' + A.testoMono(b.A) + '² = <strong>' + A.testoMono(a2) + '</strong>.', 'Il quadrato del primo', 'Quanto fa il quadrato del primo termine, (' + A.testoMono(b.A) + ')²?'),
      monoQ(dp, ['Il doppio prodotto: 2 · ' + A.testoMono(b.A) + ' · ' + A.testoMono(b.B) + ', con il segno ' + (b.s > 0 ? '+ (somma)' : '− (differenza)') + '.', 'Se nel binomio c\'è un −, il doppio prodotto è negativo.'], 'Doppio prodotto: 2 · ' + A.testoMono(b.A) + ' · ' + (b.s > 0 ? '' : '(−') + A.testoMono(b.B) + (b.s > 0 ? '' : ')') + ' = <strong>' + A.testoMono(dp) + '</strong>.', 'Il doppio prodotto', 'Quanto fa il doppio prodotto dei due termini (con il suo segno)?'),
      monoQ(b2, ['Il quadrato del secondo termine ' + A.testoMono(b.B) + ': sempre positivo.'], 'Il quadrato del secondo: <strong>' + A.testoMono(b2) + '</strong> (positivo, anche se nel binomio c\'è un −).', 'Il quadrato del secondo', 'Quanto fa il quadrato del secondo termine, (' + A.testoMono(b.B) + ')²?'),
      polyQ(r, ['Metti insieme i tre pezzi: quadrato del primo, doppio prodotto, quadrato del secondo.'], 'Il risultato è <strong>' + A.testoPoly(r) + '</strong>.', 'Scrivi il risultato', 'Scrivi lo sviluppo completo (potenze con ^).')
    ], fine: '<p class="tt-q">' + testoBin(b) + '² = ' + A.testoPoly(r) + '</p><p class="mm-p">(A ± B)² = A² ± 2AB + B²: quadrato del primo, doppio prodotto (con il segno del binomio), quadrato del secondo.</p>' };
  }
  function defSD(b) {
    var a2 = A.mulM(b.A, b.A), b2 = A.mulM(b.B, b.B), r = sdiff(b);
    return { testata: '<p class="tt-q">Sviluppa ' + mathSD(b) + '</p>', passi: [
      monoQ(a2, ['Il quadrato del termine uguale nei due binomi: ' + A.testoMono(b.A) + '.'], 'Il quadrato del primo: <strong>' + A.testoMono(a2) + '</strong>.', 'Il quadrato del primo', 'Quanto fa (' + A.testoMono(b.A) + ')²?'),
      monoQ(b2, ['Il quadrato del termine che cambia solo segno: ' + A.testoMono(b.B) + '.'], 'Il quadrato del secondo: <strong>' + A.testoMono(b2) + '</strong>.', 'Il quadrato del secondo', 'Quanto fa (' + A.testoMono(b.B) + ')²?'),
      polyQ(r, ['Il risultato è «il quadrato del primo MENO il quadrato del secondo»: i termini di mezzo si annullano.'], 'Il risultato è <strong>' + A.testoPoly(r) + '</strong>.', 'Scrivi il risultato', 'Scrivi: quadrato del primo meno quadrato del secondo.')
    ], fine: '<p class="tt-q">' + testoBin({ A: b.A, B: b.B, s: 1 }) + testoBin({ A: b.A, B: b.B, s: -1 }) + ' = ' + A.testoPoly(r) + '</p><p class="mm-p">(A + B)(A − B) = A² − B²: i due prodotti incrociati +AB e −AB si cancellano.</p>' };
  }
  var Gen = {};
  Gen.quadrato = function (liv) {
    var b = genBin(liv), r = quadrato(b), q = { tipo: 'testo', html: '<p class="tt-q">Sviluppa ' + mathQ(b) + '</p>', formato: FORMP, aiuti: ['(A ± B)² = A² ± 2AB + B²: quadrato del primo, doppio prodotto, quadrato del secondo.', 'Il quadrato del secondo è sempre positivo; il doppio prodotto ha il segno del binomio.'], verifica: function (v) { return A.giudicaPoly(v, r); }, rivela: function () { return A.testoPoly(r); } };
    q.guida = function () { TU.avvia(defQ(b), $('metodo')); }; return q;
  };
  Gen.sd = function (liv) {
    var b = genBin(liv), r = sdiff(b), q = { tipo: 'testo', html: '<p class="tt-q">Sviluppa ' + mathSD(b) + '</p>', formato: FORMP, aiuti: ['(A + B)(A − B) = A² − B²: quadrato del primo meno quadrato del secondo.'], verifica: function (v) { return A.giudicaPoly(v, r); }, rivela: function () { return A.testoPoly(r); } };
    q.guida = function () { TU.avvia(defSD(b), $('metodo')); }; return q;
  };
  Gen.riconosci = function (liv) {
    var k = pesca(['q', 'sd', 'nn']), b = genBin(Math.max(2, liv)), html, att;
    if (k === 'q') { html = mathQ(b); att = 'q'; }
    else if (k === 'sd') { html = mathSD(b); att = 'sd'; }
    else { var p = pol(b), q2 = A.riduci([A.M(b.A.c + 1, b.A.e), A.M(b.B.c + 2, b.B.e)]); html = '<math>' + pm(p) + pm(q2) + '</math>'; att = 'nn'; if (A.eq(A.mulP(p, q2), quadrato(b))) att = 'q'; }
    var q = Q.scelta(att, [['q', 'Quadrato di un binomio'], ['sd', 'Somma per differenza'], ['nn', 'Nessuno dei due: si moltiplica «tutto per tutto»']], { html: '<p class="tt-q">Che cosa è? ' + html + '</p>', aiuti: ['Se i due binomi sono identici è un quadrato di binomio. Se differiscono solo per il segno in mezzo è somma per differenza.'] });
    q.rivela = function () { return { q: 'un quadrato di binomio', sd: 'una somma per differenza', nn: 'nessuno dei due' }[att]; }; return q;
  };
  Gen.completa = function (liv) {
    var b = genBin(liv), a2 = A.mulM(b.A, b.A), dp = A.mulM(A.M(2 * b.s, {}), A.mulM(b.A, b.B)), b2 = A.mulM(b.B, b.B), h = pesca([0, 1, 1, 2]), tutti = [a2, dp, b2];
    var parti = tutti.map(function (m, i) { return (i ? '<mo>+</mo>' : '') + (i === h ? '<mi>?</mi>' : '<mrow>' + A.mmlMono(i && m.c < 0 ? A.M(-m.c, m.e) : m, true) + '</mrow>'); });
    // il segno dei termini visibili: gestione esplicita
    var mm = tutti.map(function (m, i) { return i === h ? (i ? '<mo>+</mo>' : '') + '<mi>?</mi>' : (i ? '<mo>' + (m.c < 0 ? '−' : '+') + '</mo>' + A.mmlMono(A.M(Math.abs(m.c), m.e), true) : A.mmlMono(m, true)); }).join('');
    var att = tutti[h], q = { tipo: 'testo', html: '<p class="tt-q">Completa lo sviluppo: <math><msup><mrow>' + mmlBin(b) + '</mrow><mn>2</mn></msup><mo>=</mo>' + mm + '</math><br>Quale termine manca? (scrivilo con il suo segno)</p>', formato: 'Per esempio −12x oppure 9.', aiuti: ['Gli altri due pezzi ti dicono quali sono A e B: (A ± B)² = A² ± 2AB + B².', 'Il quadrato del secondo è sempre positivo.'], verifica: function (v) { var x = A.parseMono(v); if (!x) return { ok: false, msg: 'Scrivi un monomio, con il segno se serve.' }; return A.giudicaMono(v, att); }, rivela: function () { return A.testoMono(att); } };
    q.guida = function () { TU.avvia(defQ(b), $('metodo')); }; return q;
  };
  Gen.mentale = function (liv) { var m = mentale(liv), q = Q.num(m.ris, { html: '<p class="tt-q">' + m.html + '</p>', aiuti: [m.hint], formato: 'Scrivi il numero.' }); q.rivela = function () { return String(m.ris); }; q.spiega = m.spiega; return q; };
  Gen.errore = function (liv) {
    var kind = pesca(['sq1', 'sq2', 'sd', 'seg', 'ok']), a = pesca(['a', 'x']), b = pesca(['b', 'y']), riga, causa;
    var opz = [['ok', 'È tutto giusto'], ['mezzo', 'Ha dimenticato il doppio prodotto'], ['sdsegno', 'Ha messo + invece di − tra i quadrati'], ['segnoDP', 'Ha sbagliato il segno del doppio prodotto']];
    var A2 = a + '²', B2 = b + '²';
    if (kind === 'sq1') { riga = '(' + a + ' + ' + b + ')² = ' + A2 + ' + ' + B2; causa = 'mezzo'; }
    else if (kind === 'sq2') { riga = '(' + a + ' − ' + b + ')² = ' + A2 + ' − ' + B2; causa = 'mezzo'; }
    else if (kind === 'sd') { riga = '(' + a + ' + ' + b + ')(' + a + ' − ' + b + ') = ' + A2 + ' + ' + B2; causa = 'sdsegno'; }
    else if (kind === 'seg') { riga = '(' + a + ' − ' + b + ')² = ' + A2 + ' + 2' + a + b + ' + ' + B2; causa = 'segnoDP'; }
    else { riga = '(' + a + ' − ' + b + ')² = ' + A2 + ' − 2' + a + b + ' + ' + B2; causa = 'ok'; }
    var q = Q.scelta(causa, opz.sort(function () { return Math.random() - 0.5; }), { html: '<p class="tt-q">Un compagno ha scritto: <strong>' + riga + '</strong><br>Dov\'è l\'errore?</p>', aiuti: ['Prova con dei numeri: a = 5, b = 2. Calcola la parte sinistra e la destra e confronta.', '(a ± b)² = a² ± 2ab + b²   ·   (a + b)(a − b) = a² − b²'] });
    q.rivela = function () { return opz.filter(function (o) { return o[0] === causa; })[0][1].toLowerCase(); }; return q;
  };
  var NOMI_TIPI = ['quadrato', 'sd', 'riconosci', 'completa', 'mentale', 'errore'];
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() { var t = $('tu-tipo').value, liv = +$('tu-liv').value, b = genBin(liv); if (t === 'qsomma') b.s = 1; if (t === 'qdiff') b.s = -1; TU.avvia(t === 'sd' ? defSD(b) : defQ(b)); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  T.allenati({ area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var q = Gen[t](+$('ex-liv').value); q.et = 'Esercizio'; return q; },
    guida: function (q) { if (q.guida) q.guida(); } });

  var COM = [['mentale', 1], ['quadrato', 1], ['sd', 2], ['riconosci', 2], ['quadrato', 3], ['sd', 3]];
  var CTX = ['Il tavolo 1 chiede:', 'Dalla cucina arriva:', 'Il cassiere deve calcolare:', 'Il magazziniere riconosce:', 'Il pasticciere detta:', 'L\'ordine speciale dello chef:'];
  T.servizio({ area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 120,
    genera: function (l, i) { var q = Gen[COM[i][0]](COM[i][1]); q.intro = CTX[i]; q.soluzione = function () { return q.spiega ? '<p class="mm-p">' + q.spiega + '</p>' : '<p class="mm-p">Risposta: <strong>' + q.rivela() + '</strong>. Il metodo è nella sezione «Il metodo».</p>'; }; return q; } });

  function mq(intro, q, hint, dopo) { q.intro = intro; q.hint = hint; q.dopo = dopo; return q; }
  var P = function (s) { return A.parsePoly(s).ridotto; };
  function tp(att) { return { tipo: 'testo', formato: FORMP, verifica: function (v) { return A.giudicaPoly(v, att); }, rivela: function () { return A.testoPoly(att); } }; }
  var MI = [
    mq('Sviluppa <strong>(x + 5)²</strong>.', tp(P('x^2+10x+25')), 'Quadrato del primo, doppio prodotto (2 · x · 5), quadrato del secondo.', 'x² + 10x + 25.'),
    mq('Sviluppa <strong>(2a − 3)²</strong>.', tp(P('4a^2-12a+9')), '(2a)² = 4a²; doppio prodotto: −2 · 2a · 3 = −12a; 3² = 9.', '4a² − 12a + 9.'),
    mq('Sviluppa <strong>(x + 4)(x − 4)</strong>.', tp(P('x^2-16')), 'Quadrato del primo meno quadrato del secondo.', 'x² − 16.'),
    mq('Calcola a mente <strong>99 × 101</strong>.', Q.num(9999, { formato: 'Scrivi il numero.' }), '(100 − 1)(100 + 1) = 100² − 1².', '10000 − 1 = 9999.'),
    mq('Calcola a mente <strong>31²</strong>.', Q.num(961, { formato: 'Scrivi il numero.' }), '(30 + 1)² = 900 + 60 + 1.', '900 + 60 + 1 = 961.')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'più veloci della calcolatrice', icona: '✨', items: MI, rip: [
    { d: '(a + b)² = ?', r: 'a² + 2ab + b²', s: 'Quadrato del primo, doppio prodotto, quadrato del secondo.' },
    { d: '(a + b)(a − b) = ?', r: 'a² − b²', s: 'I prodotti incrociati si cancellano.' },
    { d: '(x − 3)² = ?', r: 'x² − 6x + 9', s: 'Il doppio prodotto è −6x, il quadrato del secondo è +9.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.NOTEVOLI = { Gen: Gen, NOMI_TIPI: NOMI_TIPI, genBin: genBin, quadrato: quadrato, sdiff: sdiff, testoBin: testoBin, mentale: mentale, defQ: defQ, defSD: defSD };
})();
