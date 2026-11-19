/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «I polinomi»
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'polinomi', URL = 'aula/matematica/polinomi.html';
  var T = window.TB, A = window.ALG, $ = T.$, rnd = T.rnd, pesca = T.pesca, M = T.M, Q = T.Q;
  var FORMP = 'Per esempio 3x^2 − 5x + 2 (senza parentesi, potenze con ^).';
  T.lim('mt-lim', 'main');
  function pm(p) { return '<mo>(</mo>' + A.mmlPoly(p) + '<mo>)</mo>'; }
  function mathExpr(o) {
    if (o.t === 'somma') return '<math>' + pm(o.p) + '<mo>+</mo>' + pm(o.q) + '</math>';
    if (o.t === 'diff') return '<math>' + pm(o.p) + '<mo>−</mo>' + pm(o.q) + '</math>';
    if (o.t === 'monopoly') return '<math>' + A.mmlMono(o.m) + pm(o.p) + '</math>';
    if (o.t === 'poly') return '<math>' + pm(o.p) + pm(o.q) + '</math>';
    return '<math>' + A.mmlPoly(o.p) + '</math>';
  }
  function testoExpr(o) {
    var P = function (p) { return '(' + A.testoPoly(p) + ')'; };
    if (o.t === 'somma') return P(o.p) + ' + ' + P(o.q);
    if (o.t === 'diff') return P(o.p) + ' − ' + P(o.q);
    if (o.t === 'monopoly') return A.testoMono(o.m) + P(o.p);
    if (o.t === 'poly') return P(o.p) + P(o.q);
    return A.testoPoly(o.p);
  }
  function risultato(o) {
    if (o.t === 'somma') return A.add(o.p, o.q);
    if (o.t === 'diff') return A.sub(o.p, o.q);
    if (o.t === 'monopoly') return A.mulP([o.m], o.p);
    if (o.t === 'poly') return A.mulP(o.p, o.q);
    return A.riduci(o.p);
  }
  /* generatori */
  function polyCasuale(nt, liv, lett, maxD) {
    lett = lett || ['x']; maxD = maxD || (liv === 1 ? 2 : 3); var lista = [], usati = {}, tent = 0;
    while (lista.length < nt && tent++ < 80) {
      var e = {}; if (lett.length === 1) { var d = rnd(0, maxD); if (d) e[lett[0]] = d; } else { var dx = rnd(0, maxD), dy = rnd(0, 2); if (dx) e[lett[0]] = dx; if (dy) e[lett[1]] = dy; }
      var m = A.M(rnd(1, liv === 3 ? 9 : 7) * (Math.random() < 0.4 ? -1 : 1), e), k = A.chiave(m);
      if (usati[k]) continue; usati[k] = 1; lista.push(m);
    }
    return A.riduci(lista);
  }
  var Q2 = function (liv) { return liv === 3 ? ['x', 'y'] : ['x']; };
  function genOp(t, liv) {
    for (var k = 0; k < 200; k++) {
      var L = Q2(liv), o;
      if (t === 'somma' || t === 'diff') { o = { t: t, p: polyCasuale(liv === 1 ? 2 : 3, liv, L), q: polyCasuale(liv === 1 ? 2 : 3, liv, L) }; if (o.p.length < 2 || o.q.length < 2) continue; var r = risultato(o); if (!r.length) continue; }
      else if (t === 'monopoly') { var m = A.casualeMono({ lettere: L, nl: 1, maxE: liv === 1 ? 1 : 2, maxC: 5 }); o = { t: t, m: m, p: polyCasuale(liv === 1 ? 2 : 3, liv, L, 2) }; if (o.p.length < 2) continue; }
      else if (t === 'poly') { var a = rnd(1, 5) * (Math.random() < 0.4 ? -1 : 1), b = rnd(1, 5) * (Math.random() < 0.4 ? -1 : 1); var cx = rnd(1, liv === 1 ? 1 : 3); var p1 = A.riduci([A.M(cx, { x: 1 }), A.M(a, {})]), q1 = liv === 3 ? A.riduci([A.M(1, { x: 2 }), A.M(rnd(-4, 4) || 1, { x: 1 }), A.M(rnd(1, 5), {})]) : A.riduci([A.M(rnd(1, liv === 1 ? 1 : 3), { x: 1 }), A.M(b, {})]); o = { t: t, p: p1, q: q1 }; }
      else { /* riduci */
        var base = polyCasuale(3, liv, L), mess = [];
        base.forEach(function (m) { if (Math.abs(m.c) > 1 && Math.random() < 0.7) { var c1 = rnd(1, Math.abs(m.c) + 3) * (m.c < 0 ? -1 : 1), c2 = m.c - c1; if (c2 !== 0) { mess.push(A.M(c1, m.e)); mess.push(A.M(c2, m.e)); return; } } mess.push(m); });
        if (mess.length === base.length) { var extra = base[0]; mess.push(A.M(2, extra.e)); mess.push(A.M(-2, extra.e)); }
        mess.sort(function () { return Math.random() - 0.5; }); o = { t: 'riduci', p: mess };
      }
      return o;
    }
    return { t: 'somma', p: [A.M(2, { x: 1 }), A.M(1, {})], q: [A.M(1, { x: 1 }), A.M(3, {})] };
  }
  /* risposte */
  function polyQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaPoly(v, att); }, aiuti: aiuti, rivela: function () { return A.testoPoly(att); }, spiega: spiega }; }
  function monoQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaMono(v, att); }, aiuti: aiuti, rivela: function () { return A.testoMono(att); }, spiega: spiega }; }
  function numQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', atteso: att, titolo: tit, testo: testoP, verifica: function (v) { var x = T.intero(String(v).replace('−', '-')); if (x === null) return { ok: false, msg: 'Scrivi un numero intero (con il segno − se è negativo).' }; return { ok: x === att }; }, aiuti: aiuti, rivela: function () { return String(att); }, spiega: spiega }; }
  function senzaPar(att, aiuti, spiega, tit, testoP) {
    var atteso = att.map(A.testoMono).sort().join('|');
    return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) {
      var p = A.parsePoly(v); if (!p) return { ok: false, msg: 'Scrivi i termini con i segni + e −, senza parentesi, per esempio 3x^2 − x + 4.' };
      var mio = p.termini.map(A.testoMono).sort().join('|'); if (mio === atteso) return { ok: true };
      if (A.eq(p.termini, att)) return { ok: false, msg: 'Il valore è giusto, ma qui devi solo togliere le parentesi, senza sommare i termini simili.' };
      return { ok: false };
    }, aiuti: aiuti, rivela: function () { return att.map(function (m, i) { return A.testoMono(m, i === 0); }).join(''); }, spiega: spiega };
  }
  function defOp(o) {
    var r = risultato(o), passi = [], nome = { somma: 'La somma', diff: 'La differenza', monopoly: 'Il prodotto', poly: 'Il prodotto', riduci: 'Riduci' }[o.t];
    if (o.t === 'somma' || o.t === 'diff') {
      var flat = o.p.concat(o.t === 'diff' ? A.neg(o.q) : o.q);
      passi.push(senzaPar(flat, o.t === 'diff' ? ['Davanti alla seconda parentesi c\'è un − : <strong>cambia il segno</strong> a ogni termine che c\'è dentro.', 'I termini del secondo polinomio diventano: ' + A.testoPoly(A.neg(o.q)) + '.'] : ['Davanti alla parentesi c\'è un +: i termini restano con il loro segno.'], o.t === 'diff' ? 'Con il − davanti alla parentesi tutti i segni dentro si invertono: ' + A.testoPoly(flat) + '.' : 'Con il + davanti alla parentesi i segni restano: ' + A.testoPoly(flat) + '.', 'Togli le parentesi', 'Scrivi il polinomio senza parentesi, <strong>senza ancora sommare</strong> i termini simili.' + (o.t === 'diff' ? ' (Attenzione al segno − davanti alla seconda parentesi!)' : '')));
      var chiavi = {}; flat.forEach(function (m) { chiavi[A.chiave(m)] = m; });
      Object.keys(chiavi).sort(function (a, b) { return A.grado(chiavi[b]) - A.grado(chiavi[a]) || (a < b ? -1 : 1); }).forEach(function (k) {
        var base = chiavi[k], parti = flat.filter(function (m) { return A.chiave(m) === k; }), tot = parti.reduce(function (s, m) { return s + m.c; }, 0), pl = A.parteLetterale(base);
        passi.push(numQ(tot, ['Somma i coefficienti dei termini con parte letterale ' + pl + (A.chiave(base) ? '' : ' (i numeri senza lettera)') + '.', 'Sono: ' + parti.map(function (m) { return m.c; }).join(', ') + '.'], 'Coefficienti: ' + parti.map(function (m, i) { return (i && m.c >= 0 ? '+ ' : '') + (m.c < 0 ? '− ' + (-m.c) : m.c); }).join(' ') + ' = <strong>' + tot + '</strong>' + (tot === 0 ? ' (i termini si annullano)' : '') + '.', 'Il termine ' + (A.chiave(base) ? pl : 'noto'), 'Quanto fa la somma dei coefficienti dei termini simili ' + (A.chiave(base) ? 'in ' + pl : '(i numeri senza lettere)') + '?'));
      });
    } else if (o.t === 'monopoly') {
      o.p.forEach(function (t) { var pr = A.mulM(o.m, t); passi.push(monoQ(pr, ['Moltiplica ' + A.testoMono(o.m) + ' per ' + A.testoMono(t) + ': coefficienti per coefficienti, esponenti sommati.'], A.testoMono(o.m) + ' · (' + A.testoMono(t) + ') = <strong>' + A.testoMono(pr) + '</strong>.', 'Moltiplica per ' + A.testoMono(t), 'Quanto fa ' + A.testoMono(o.m) + ' · (' + A.testoMono(t) + ')?')); });
    } else if (o.t === 'poly') {
      A.prodottiParziali(o.p, o.q).forEach(function (pp) { passi.push(monoQ(pp.p, ['Moltiplica ' + A.testoMono(pp.a) + ' per ' + A.testoMono(pp.b) + '.'], A.testoMono(pp.a) + ' · (' + A.testoMono(pp.b) + ') = <strong>' + A.testoMono(pp.p) + '</strong>.', 'Un prodotto parziale', 'Moltiplica ogni termine del primo per ogni termine del secondo: quanto fa (' + A.testoMono(pp.a) + ') · (' + A.testoMono(pp.b) + ')?')); });
    } else {
      var ch = {}; o.p.forEach(function (m) { ch[A.chiave(m)] = m; });
      Object.keys(ch).sort(function (a, b) { return A.grado(ch[b]) - A.grado(ch[a]) || (a < b ? -1 : 1); }).forEach(function (k) {
        var parti = o.p.filter(function (m) { return A.chiave(m) === k; }); if (parti.length < 2) return;
        var tot = parti.reduce(function (s, m) { return s + m.c; }, 0), pl = A.parteLetterale(parti[0]);
        passi.push(numQ(tot, ['Somma i coefficienti dei termini con ' + (A.chiave(parti[0]) ? 'parte letterale ' + pl : 'solo numeri') + ': ' + parti.map(function (m) { return m.c; }).join(', ') + '.'], 'Il termine ' + (A.chiave(parti[0]) ? pl : 'noto') + ': ' + parti.map(function (m, i) { return (i && m.c >= 0 ? '+ ' : '') + (m.c < 0 ? '− ' + (-m.c) : m.c); }).join(' ') + ' = <strong>' + tot + '</strong>.', 'Somma i simili', 'Quanto fa la somma dei coefficienti dei termini simili ' + (A.chiave(parti[0]) ? 'in ' + pl : '(solo numeri)') + '?'));
      });
    }
    passi.push(polyQ(r, ['Scrivi i termini dal grado più alto al più basso, con i segni giusti.'], 'Il polinomio finale è <strong>' + A.testoPoly(r) + '</strong>.', 'Scrivi il risultato', 'Scrivi il polinomio finale, ridotto e ordinato (potenze con ^).'));
    var inizio = o.t === 'riduci' ? 'Riduci il polinomio: ' : nome + ': ';
    return { testata: '<p class="tt-q">' + inizio + mathExpr(o) + '</p>', passi: passi, fine: '<p class="tt-q">' + testoExpr(o) + ' = ' + A.testoPoly(r) + '</p><p class="mm-p">' + ({ somma: 'Con il + davanti si tolgono le parentesi senza cambiare niente; poi si sommano i simili.', diff: 'Con il − davanti si tolgono le parentesi cambiando tutti i segni; poi si sommano i simili.', monopoly: 'Il monomio si moltiplica per ogni termine del polinomio (proprietà distributiva).', poly: 'Ogni termine del primo polinomio si moltiplica per ogni termine del secondo; poi si sommano i simili.', riduci: 'Si sommano i coefficienti dei termini simili e si ordina dal grado più alto.' })[o.t] + '</p>' };
  }

  /* ════════ IL CASO ════════ */
  (function () {
    var C = $('pl-caso'), S = { i: 0, ok: 0 };
    var D = [
      { t: 'Il tavolo A paga <strong>3x + 5</strong> euro, il tavolo B paga <strong>2x + 1</strong> (x è il prezzo di un piatto). Quanto pagano <strong>insieme</strong>?', o: [['a', '5x + 6'], ['b', '5x² + 6'], ['c', '6x + 5']], g: 'a', s: 'I piatti con i piatti (3x + 2x = 5x) e i numeri con i numeri (5 + 1 = 6): <strong>5x + 6</strong>. Un polinomio è una somma di monomi; si sommano solo i simili.' },
      { t: 'Al tavolo A fanno uno sconto: tolgono <strong>(x + 2)</strong> euro dal conto di <strong>3x + 5</strong>. Quanto pagano? Il conto è <strong>3x + 5 − (x + 2)</strong>.', o: [['a', '2x + 7'], ['b', '2x + 3'], ['c', '4x + 7']], g: 'b', s: 'Il segno − davanti alla parentesi cambia il segno di <strong>tutto</strong> quello che c\'è dentro: 3x + 5 − x − 2 = <strong>2x + 3</strong>. Chi dimentica di cambiare il 2 trova 2x + 7: sbagliato!' },
      { t: 'La sala è un rettangolo con lati <strong>(x + 3)</strong> e <strong>(x + 2)</strong> metri. Quale è l\'area?', o: [['a', 'x² + 6'], ['b', 'x² + 5x + 6'], ['c', '2x + 5']], g: 'b', s: 'Ogni parte del primo lato si moltiplica per ogni parte del secondo: x·x + x·2 + 3·x + 3·2 = <strong>x² + 5x + 6</strong>. Sotto lo vedi disegnato a rettangoli.' }
    ];
    function disegna(ris) {
      if (S.i >= D.length) { C.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">Un polinomio è una somma di monomi: si somma tra simili e si moltiplica «tutto per tutto».</p><p class="tt-stat">Hai risposto giusto a ' + S.ok + ' su ' + D.length + '. Sotto: la sala disegnata, il segno meno e il gioco dei simili.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="pl-rifai">Rifai il caso</button></div></div>'; return; }
      var d = D[S.i], h = '<div class="tt-prog"><span>Domanda ' + (S.i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="pl-avanti">' + (S.i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      C.innerHTML = h; if (ris) C.querySelector('#pl-avanti').focus();
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var g = b.dataset.v === D[S.i].g; if (g) S.ok++; disegna({ ok: g }); return; }
      if (b.id === 'pl-avanti') { S.i++; disegna(); var x = C.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'pl-rifai') { S = { i: 0, ok: 0 }; disegna(); }
    });
    disegna();
  })();

  /* ════════ LA SALA A RETTANGOLI ════════ */
  (function () {
    var SP = $('ar-p'), SQ = $('ar-q'), OUT = $('ar-out'), SV = $('ar-svg');
    function disegna() {
      var p = +SP.value, q = +SQ.value, U = 22, X = 130, W = X + q * U, H = X + p * U, ox = 20, oy = 20;
      var s = '<svg viewBox="0 0 ' + (W + 60) + ' ' + (H + 60) + '" role="img" aria-label="Rettangolo di lati x + ' + q + ' e x + ' + p + ' diviso in quattro parti: x per x, ' + q + ' per x, x per ' + p + ', ' + q + ' per ' + p + '">';
      var cel = [[ox, oy, X, X, '#cfe3c8', 'x²'], [ox + X, oy, q * U, X, '#f6dcb0', q + 'x'], [ox, oy + X, X, p * U, '#f6dcb0', p + 'x'], [ox + X, oy + X, q * U, p * U, '#e7c7c0', String(p * q)]];
      cel.forEach(function (c) { s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="' + c[2] + '" height="' + c[3] + '" fill="' + c[4] + '" stroke="#2C3E2D" stroke-width="2"/><text x="' + (c[0] + c[2] / 2) + '" y="' + (c[1] + c[3] / 2 + 6) + '" text-anchor="middle" font-size="18" font-weight="700" fill="#1f2d20">' + c[5] + '</text>'; });
      s += '<text x="' + (ox + X / 2) + '" y="14" text-anchor="middle" font-size="15">x</text><text x="' + (ox + X + q * U / 2) + '" y="14" text-anchor="middle" font-size="15">' + q + '</text><text x="8" y="' + (oy + X / 2) + '" text-anchor="middle" font-size="15">x</text><text x="8" y="' + (oy + X + p * U / 2) + '" text-anchor="middle" font-size="15">' + p + '</text></svg>';
      SV.innerHTML = s;
      OUT.innerHTML = '<p class="mm-p"><math><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>' + q + '</mn><mo>)</mo><mo>(</mo><mi>x</mi><mo>+</mo><mn>' + p + '</mn><mo>)</mo></mrow><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>' + p + '</mn><mi>x</mi><mo>+</mo><mn>' + q + '</mn><mi>x</mi><mo>+</mo><mn>' + (p * q) + '</mn><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>' + (p + q) + '</mn><mi>x</mi><mo>+</mo><mn>' + (p * q) + '</mn></math></p><p class="mm-p">Le due parti rosa-arancio, ' + p + 'x e ' + q + 'x, sono <strong>simili</strong>: insieme fanno ' + (p + q) + 'x. Il termine di mezzo non è mai «saltato»: c\'è sempre.</p>';
    }
    [SP, SQ].forEach(function (e) { e.addEventListener('change', disegna); });
    disegna();
  })();

  /* ════════ IL SEGNO MENO DAVANTI ════════ */
  (function () {
    var C = $('sg-area'), S = { p: null, q: null, fatto: false };
    function nuovo() { S.p = polyCasuale(2, 2, ['x'], 2); S.q = polyCasuale(rnd(2, 3), 2, ['x'], 2); S.fatto = false; disegna(); }
    function disegna() {
      var neg = A.neg(S.q);
      var h = '<p class="mm-p">Togli le parentesi: <math>' + A.mmlPoly(S.p) + '<mo>−</mo>' + pm(S.q) + '</math></p>';
      if (!S.fatto) h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="sg-via">Togli la parentesi, cambiando i segni</button><button type="button" class="fz-btn sec" id="sg-via2">Prova a toglierla senza cambiare</button></div>';
      else h += '<p class="sg-ris">' + S.q.map(function (m, i) { return '<span class="sg-t">' + A.testoMono(m, true) + '</span> → <span class="sg-t sg-n">' + A.testoMono(neg[i], true) + '</span>'; }).join(' &nbsp; ') + '</p><p class="mm-p">Dentro la parentesi <strong>ogni segno si capovolge</strong>: + diventa −, − diventa +. Risultato: <math>' + A.mmlPoly(S.p.concat(neg)) + '</math>, che si riduce a <math>' + A.mmlPoly(A.sub(S.p, S.q)) + '</math>.</p><div class="fz-azioni"><button type="button" class="fz-btn" id="sg-altro">Un altro esempio</button></div>';
      h += '<p class="fz-fb" id="sg-fb" role="status" aria-live="polite"></p>';
      C.innerHTML = h;
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'sg-via') { S.fatto = true; disegna(); C.querySelector('#sg-altro').focus(); }
      if (b.id === 'sg-via2') { var f = $('sg-fb'); f.className = 'fz-fb no'; var sbagliato = A.riduci(S.p.concat(S.q)), giusto = A.sub(S.p, S.q); f.innerHTML = 'Se lasci i segni com\'erano ottieni <strong>' + A.testoPoly(sbagliato) + '</strong>, ma il risultato giusto è <strong>' + A.testoPoly(giusto) + '</strong>' + (A.eq(sbagliato, giusto) ? '' : ': sono diversi!') + ' Il − davanti alla parentesi comanda su tutti i termini.'; }
      if (b.id === 'sg-altro') { nuovo(); C.querySelector('#sg-via').focus(); }
    });
    nuovo();
  })();

  /* ════════ IL LAMPO DEI SIMILI ════════ */
  (function () {
    var C = $('ls-area'), S = { t: [], sel: {}, msg: '', mosse: 0 };
    function nuovo() { var o = genOp('riduci', 2); S.t = o.p.slice(); S.sel = {}; S.msg = ''; S.mosse = 0; disegna(); }
    function ridotto() { return A.riduci(S.t).length === S.t.length; }
    function disegna() {
      var h = '<p class="mm-p">Tocca i termini <strong>simili</strong> e premi «Somma». Continua finché il polinomio è ridotto.</p><div class="sm-tiles" role="group" aria-label="Termini del polinomio">';
      S.t.forEach(function (m, i) { h += '<button type="button" class="sm-t' + (S.sel[i] ? ' on' : '') + '" data-i="' + i + '" aria-pressed="' + (!!S.sel[i]) + '"><span class="vh">' + A.testoMono(m, true) + '</span><span aria-hidden="true"><math>' + A.mmlMono(m, true) + '</math></span></button>'; });
      h += '</div>';
      if (ridotto()) { var r = A.riduci(S.t); h += '<p class="fz-fb si" role="status">Ridotto in ' + S.mosse + ' mosse! Ordinato: <strong>' + A.testoPoly(r) + '</strong> (grado ' + A.gradoPoly(r) + ').</p><div class="fz-azioni"><button type="button" class="fz-btn" id="ls-altro">Un altro polinomio</button></div>'; }
      else h += '<p class="fz-fb ' + (S.msg ? 'no' : '') + '" role="status">' + S.msg + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="ls-somma">Somma i termini scelti</button></div>';
      C.innerHTML = h;
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.i !== undefined) { var i = +b.dataset.i; S.sel[i] = !S.sel[i]; S.msg = ''; disegna(); C.querySelector('[data-i="' + i + '"]').focus(); return; }
      if (b.id === 'ls-altro') { nuovo(); C.querySelector('.sm-t').focus(); return; }
      if (b.id === 'ls-somma') {
        var idx = Object.keys(S.sel).filter(function (k) { return S.sel[k]; }).map(Number);
        if (idx.length < 2) { S.msg = 'Scegli almeno due termini simili.'; disegna(); return; }
        var base = S.t[idx[0]];
        if (!idx.every(function (k) { return A.simili(S.t[k], base); })) { S.msg = 'Non sono tutti simili: devono avere la stessa parte letterale.'; disegna(); return; }
        var tot = idx.reduce(function (s, k) { return s + S.t[k].c; }, 0), nuovoT = S.t.filter(function (m, k) { return idx.indexOf(k) < 0; });
        if (tot !== 0) nuovoT.push(A.M(tot, base.e)); S.t = nuovoT; S.sel = {}; S.mosse++; S.msg = ''; disegna(); var x = C.querySelector('button'); if (x) x.focus();
      }
    });
    nuovo();
  })();

  /* ════════ DOMANDE E TUTOR ════════ */
  var Gen = {};
  ['somma', 'diff', 'monopoly', 'poly', 'riduci'].forEach(function (t) {
    Gen[t] = function (liv) {
      var o = genOp(t, liv), r = risultato(o), tt = { somma: 'la somma', diff: 'la differenza', monopoly: 'il prodotto', poly: 'il prodotto', riduci: 'il polinomio ridotto' }[t];
      var q = { tipo: 'testo', html: '<p class="tt-q">' + (t === 'riduci' ? 'Riduci il polinomio: ' : 'Calcola ' + tt + ': ') + mathExpr(o) + '</p>', formato: FORMP, aiuti: ({ somma: ['Togli le parentesi (il + davanti non cambia nulla) e somma i termini simili.'], diff: ['Il − davanti alla parentesi cambia il segno di tutti i termini al suo interno.', 'Poi somma i termini simili.'], monopoly: ['Moltiplica il monomio per ogni termine del polinomio.'], poly: ['Moltiplica ogni termine del primo per ogni termine del secondo, poi somma i simili.'], riduci: ['Somma i coefficienti dei termini con la stessa parte letterale e ordina.'] })[t].concat(['Il risultato ha ' + r.length + ' termin' + (r.length === 1 ? 'e' : 'i') + '.']), verifica: function (v) { return A.giudicaPoly(v, r); }, rivela: function () { return A.testoPoly(r); } };
      q.guida = function () { TU.avvia(defOp(o), $('metodo')); }; q.o = o; return q;
    };
  });
  Gen.grado = function (liv) {
    var p = polyCasuale(liv === 1 ? 3 : 4, liv, Q2(liv), liv === 1 ? 3 : 5); if (p.length < 2) p = polyCasuale(3, 2, ['x'], 3);
    var g = A.gradoPoly(p), q = Q.num(g, { html: '<p class="tt-q">Quale è il <strong>grado</strong> del polinomio ' + A.mathPoly(p) + '?</p>', aiuti: ['Il grado di un polinomio è il grado del suo termine di grado più alto.', 'Gradi dei termini: ' + p.map(A.grado).join(', ') + '.'], formato: 'Scrivi un numero.' });
    q.rivela = function () { return String(g); }; return q;
  };
  Gen.errore = function (liv) {
    var kind = pesca(['segno', 'distr', 'mezzo', 'ok']), a = rnd(2, 6), b = rnd(2, 6), c = rnd(2, 5), riga, causa;
    var opz = [['ok', 'È tutto giusto'], ['segno', 'Non ha cambiato il segno dei termini dentro la parentesi'], ['distr', 'Ha moltiplicato solo il primo termine della parentesi'], ['mezzo', 'Ha dimenticato i prodotti «incrociati» (il termine di mezzo)']];
    if (kind === 'segno') { riga = (a + c) + 'x + ' + b + ' − (' + c + 'x + ' + a + ') = ' + a + 'x + ' + (b + a); causa = 'segno'; }
    else if (kind === 'distr') { riga = c + 'x(x + ' + a + ') = ' + c + 'x² + ' + a; causa = 'distr'; }
    else if (kind === 'mezzo') { riga = '(x + ' + a + ')(x + ' + b + ') = x² + ' + (a * b); causa = 'mezzo'; }
    else { riga = c + 'x(x + ' + a + ') = ' + c + 'x² + ' + (c * a) + 'x'; causa = 'ok'; }
    var q = Q.scelta(causa, opz.sort(function () { return Math.random() - 0.5; }), { html: '<p class="tt-q">Un compagno ha scritto: <strong>' + riga + '</strong><br>Dov\'è l\'errore?</p>', aiuti: ['Rifai il calcolo tu e confronta il risultato.', 'Segno meno: cambia tutti i segni. Distributiva: ogni termine moltiplicato. Prodotto di due polinomi: tutti con tutti.'] });
    q.rivela = function () { return opz.filter(function (o) { return o[0] === causa; })[0][1].toLowerCase(); };
    return q;
  };
  var NOMI_TIPI = ['somma', 'diff', 'monopoly', 'poly', 'riduci', 'grado', 'errore'];
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() { var t = $('tu-tipo').value, liv = +$('tu-liv').value; TU.avvia(defOp(genOp(t, liv))); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  T.allenati({ area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var q = Gen[t](+$('ex-liv').value); q.et = 'Esercizio'; return q; },
    guida: function (q) { if (q.guida) q.guida(); } });

  var COM = [['riduci', 1], ['somma', 1], ['diff', 2], ['monopoly', 2], ['poly', 2], ['poly', 3]];
  var CTX = ['Il tavolo 1 ordina:', 'Dalla cucina chiedono:', 'Il cassiere deve calcolare:', 'Il magazziniere calcola:', 'Il pasticciere chiede:', 'L\'ordine speciale dello chef:'];
  T.servizio({ area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 120,
    genera: function (l, i) { var q = Gen[COM[i][0]](COM[i][1]); q.intro = CTX[i]; q.soluzione = function () { return '<p class="mm-p">Risposta: <strong>' + q.rivela() + '</strong>. Il metodo è nella sezione «Il metodo».</p>'; }; return q; } });

  function mq(intro, q, hint, dopo) { q.intro = intro; q.hint = hint; q.dopo = dopo; return q; }
  function tp(att) { return { tipo: 'testo', formato: FORMP, verifica: function (v) { return A.giudicaPoly(v, att); }, rivela: function () { return A.testoPoly(att); } }; }
  var P = function (s) { return A.parsePoly(s).ridotto; };
  var MI = [
    mq('Calcola <strong>(3x² + 2x) + (x² − 5x + 1)</strong>.', tp(P('4x^2-3x+1')), 'Togli le parentesi e somma i termini simili.', '3x² + x² = 4x²; 2x − 5x = −3x; resta +1.'),
    mq('Calcola <strong>(5x + 3) − (2x − 4)</strong>.', tp(P('3x+7')), 'Il − davanti cambia i segni della seconda parentesi.', '5x + 3 − 2x + 4 = 3x + 7.'),
    mq('Calcola <strong>3x(x + 2)</strong>.', tp(P('3x^2+6x')), 'Moltiplica 3x per x e poi per 2.', '3x · x = 3x²; 3x · 2 = 6x.'),
    mq('Calcola l\'area della sala <strong>(x + 4)(x + 1)</strong>.', tp(P('x^2+5x+4')), 'Quattro prodotti: x·x, x·1, 4·x, 4·1; poi somma i simili.', 'x² + x + 4x + 4 = x² + 5x + 4.'),
    mq('Quale è il <strong>grado</strong> del polinomio <strong>2x³ − x + 7</strong>?', Q.num(3, { formato: 'Scrivi un numero.' }), 'È il grado del termine di grado più alto.', 'Il termine più alto è 2x³: grado 3.')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'i conti della sala', icona: '🧱', items: MI, rip: [
    { d: '(2x + 1) + (3x + 4) = ?', r: '5x + 5', s: 'Si sommano i simili: 2x + 3x e 1 + 4.' },
    { d: 'x − (x − 3) = ?', r: '3', s: 'Il − cambia i segni: x − x + 3 = 3.' },
    { d: '(x + 1)(x + 2) = ?', r: 'x² + 3x + 2', s: 'x² + 2x + x + 2 = x² + 3x + 2.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.POLINOMI = { Gen: Gen, NOMI_TIPI: NOMI_TIPI, defOp: defOp, genOp: genOp, risultato: risultato, testoExpr: testoExpr };
})();
