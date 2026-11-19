/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «Operazioni con i monomi»
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'monomi-operazioni', URL = 'aula/matematica/monomi-operazioni.html';
  var T = window.TB, A = window.ALG, $ = T.$, rnd = T.rnd, pesca = T.pesca, M = T.M, Q = T.Q;
  var FORM = 'Per esempio 6x^3y oppure −2a^2b (per l\'elevamento a potenza usa ^).';
  T.lim('mt-lim', 'main');
  function par(m) { return '<mo>(</mo>' + A.mmlMono(m) + '<mo>)</mo>'; }
  function exprMath(o) {
    if (o.t === 'somma') return '<math>' + A.mmlPoly(o.p) + '</math>';
    if (o.t === 'prodotto') return '<math>' + par(o.a) + '<mo>·</mo>' + par(o.b) + '</math>';
    if (o.t === 'quoziente') return '<math>' + par(o.a) + '<mo>:</mo>' + par(o.b) + '</math>';
    return '<math><msup><mrow>' + par(o.a) + '</mrow><mn>' + o.n + '</mn></msup></math>';
  }
  function exprTesto(o) {
    if (o.t === 'somma') return A.testoPoly(o.p);
    if (o.t === 'prodotto') return '(' + A.testoMono(o.a) + ') · (' + A.testoMono(o.b) + ')';
    if (o.t === 'quoziente') return '(' + A.testoMono(o.a) + ') : (' + A.testoMono(o.b) + ')';
    return '(' + A.testoMono(o.a) + ')' + A.sup(o.n);
  }
  function risultato(o) {
    if (o.t === 'somma') return A.riduci(o.p)[0];
    if (o.t === 'prodotto') return A.mulM(o.a, o.b);
    if (o.t === 'quoziente') return A.divM(o.a, o.b);
    return A.potM(o.a, o.n);
  }

  /* ════════ IL CASO ════════ */
  (function () {
    var C = $('mp-caso'), S = { i: 0, ok: 0 };
    var D = [
      { t: 'Hai <strong>3 vassoi</strong> di pasticcini (3v) e ne arrivano altri <strong>2 vassoi</strong> (2v). Quanti vassoi hai?', o: [['a', '5v'], ['b', '5v²'], ['c', '6v']], g: 'a', s: '3 vassoi + 2 vassoi = <strong>5 vassoi</strong>: si sommano i numeri e la parola «vassoi» resta com\'è. Nei monomi simili si sommano i coefficienti e <strong>la parte letterale non cambia</strong>.' },
      { t: 'Ora hai <strong>3 vassoi</strong> e <strong>2 teglie</strong> (3v + 2t). Si può scrivere come un unico monomio?', o: [['a', 'Sì: 5vt'], ['b', 'No: sono cose diverse, resta 3v + 2t'], ['c', 'Sì: 5v²']], g: 'b', s: 'Vassoi e teglie sono <strong>cose diverse</strong>: non si fondono in un solo monomio. Si possono sommare solo i monomi <em>simili</em>.' },
      { t: 'Ogni vassoio ha 4 file e ogni fila ha x pasticcini. E i vassoi sono 5. Quanti pasticcini? Il prodotto è <strong>5 · 4x</strong>.', o: [['a', '9x'], ['b', '20x'], ['c', '20x²']], g: 'b', s: 'Nel prodotto si <strong>moltiplicano i coefficienti</strong> (5 · 4 = 20) e le lettere restano: <strong>20x</strong>. Non si somma: 5 + 4x non è la stessa cosa.' }
    ];
    function disegna(ris) {
      if (S.i >= D.length) { C.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">Somma: solo tra simili. Prodotto: i numeri si moltiplicano, le lettere si ricombinano.</p><p class="tt-stat">Hai risposto giusto a ' + S.ok + ' su ' + D.length + '. Sotto trovi le regole degli esponenti, da vedere una cifra alla volta.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mp-rifai">Rifai il caso</button></div></div>'; return; }
      var d = D[S.i], h = '<div class="tt-prog"><span>Domanda ' + (S.i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="mp-avanti">' + (S.i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      C.innerHTML = h; if (ris) C.querySelector('#mp-avanti').focus();
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var g = b.dataset.v === D[S.i].g; if (g) S.ok++; disegna({ ok: g }); return; }
      if (b.id === 'mp-avanti') { S.i++; disegna(); var x = C.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'mp-rifai') { S = { i: 0, ok: 0 }; disegna(); }
    });
    disegna();
  })();

  /* ════════ SI PUÒ SOMMARE? ════════ */
  (function () {
    var C = $('sp-area'), S = { a: null, b: null, ris: null, serie: 0, best: 0 };
    function nuovo() {
      var a = A.casualeMono({ lettere: ['x', 'y'], nl: rnd(1, 2), maxE: 2, maxC: 9 }), b;
      if (Math.random() < 0.55) b = A.M(rnd(1, 9) * (Math.random() < 0.4 ? -1 : 1), a.e);
      else { var e = JSON.parse(JSON.stringify(a.e)), k = pesca(Object.keys(e)); if (Math.random() < 0.5) e[k] += 1; else { delete e[k]; e[pesca(['a', 'z'])] = rnd(1, 2); } b = A.M(rnd(1, 9), e); if (!Object.keys(b.e).length) b = A.M(b.c, { z: 1 }); }
      if (A.testoMono(a) === A.testoMono(b)) b = A.M(b.c + 1 || 2, b.e);
      S.a = a; S.b = b; S.ris = null; disegna();
    }
    function disegna() {
      var h = '<p class="tt-q">Si possono sommare in un unico monomio? ' + A.math([S.a, S.b], true) + '</p><div class="tt-sc"><button type="button" class="fz-btn sec" data-v="s"' + (S.ris ? ' disabled' : '') + '>Sì, sono simili</button><button type="button" class="fz-btn sec" data-v="n"' + (S.ris ? ' disabled' : '') + '>No, non sono simili</button></div>';
      if (S.ris) h += '<p class="fz-fb ' + (S.ris.ok ? 'si' : 'no') + '" role="status">' + S.ris.t + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="sp-altro">Un\'altra coppia</button></div>';
      h += '<p class="fz-conta">Giuste in fila: ' + S.serie + ' · record in questa visita: ' + S.best + '</p>';
      C.innerHTML = h;
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'sp-altro') { nuovo(); C.querySelector('[data-v]').focus(); return; }
      if (b.dataset.v && !S.ris) {
        var sim = A.simili(S.a, S.b), ok = (b.dataset.v === 's') === sim; S.serie = ok ? S.serie + 1 : 0; S.best = Math.max(S.best, S.serie);
        var r = A.riduci([S.a, S.b]);
        S.ris = { ok: ok, t: (ok ? 'Esatto! ' : 'Non proprio. ') + (sim ? 'Parte letterale uguale (' + A.parteLetterale(S.a) + '): si sommano i coefficienti, ' + S.a.c + ' + (' + S.b.c + ') = ' + (S.a.c + S.b.c) + (S.a.c + S.b.c === 0 ? ', quindi il risultato è 0.' : ', e il risultato è <strong>' + A.testoMono(r[0]) + '</strong>.') : 'Parti letterali diverse (' + A.parteLetterale(S.a) + ' e ' + A.parteLetterale(S.b) + '): la somma resta <strong>' + A.testoPoly(A.riduci([S.a, S.b])) + '</strong>, non si può ridurre.') };
        disegna(); C.querySelector('#sp-altro').focus();
      }
    });
    nuovo();
  })();

  /* ════════ LE LEGGI DEGLI ESPONENTI ════════ */
  (function () {
    var OUT = $('es-out'), SO = $('es-op'), SA = $('es-a'), SB = $('es-b');
    function fatt(n) { var a = []; for (var i = 0; i < n; i++) a.push('x'); return a.join('·'); }
    function disegna() {
      var op = SO.value, a = +SA.value, b = +SB.value, h = '';
      if (op === 'prodotto') h = '<p class="es-r">x<sup>' + a + '</sup> · x<sup>' + b + '</sup> = (' + fatt(a) + ') · (' + fatt(b) + ') = ' + fatt(a + b) + ' = <strong>x<sup>' + (a + b) + '</sup></strong></p><p class="mm-p">Quanti «x» ci sono in tutto? <strong>' + a + ' + ' + b + ' = ' + (a + b) + '</strong>. Nel prodotto di potenze con la stessa base gli esponenti si <strong>sommano</strong>.</p>';
      if (op === 'quoziente') { if (a < b) { var t = a; a = b; b = t; SA.value = a; SB.value = b; } h = '<p class="es-r">x<sup>' + a + '</sup> : x<sup>' + b + '</sup> = <span class="es-fr"><span>' + fatt(a).replace(new RegExp('(x·?){' + b + '}'), function (m) { return '<s>' + m + '</s>'; }) + '</span><span>' + '<s>' + fatt(b) + '</s></span></span> = <strong>x<sup>' + (a - b) + '</sup></strong>' + (a === b ? ' = 1' : '') + '</p><p class="mm-p">Si «cancellano» ' + b + ' degli ' + a + ' fattori: restano <strong>' + a + ' − ' + b + ' = ' + (a - b) + '</strong>. Nel quoziente gli esponenti si <strong>sottraggono</strong> (e il divisore deve avere esponente non più grande).</p>'; }
      if (op === 'potenza') h = '<p class="es-r">(x<sup>' + a + '</sup>)<sup>' + b + '</sup> = ' + Array(b).fill('(' + fatt(a) + ')').join(' · ') + ' = <strong>x<sup>' + (a * b) + '</sup></strong></p><p class="mm-p">' + b + ' gruppi da ' + a + ' fattori: <strong>' + a + ' × ' + b + ' = ' + (a * b) + '</strong>. Nella potenza di potenza gli esponenti si <strong>moltiplicano</strong>.</p>';
      OUT.innerHTML = h;
    }
    [SO, SA, SB].forEach(function (e) { e.addEventListener('change', disegna); });
    disegna();
  })();

  /* ════════ GENERATORI ════════ */
  function testoQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaMono(v, att); }, aiuti: aiuti, rivela: function () { return A.testoMono(att); }, spiega: spiega }; }
  function numQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', atteso: att, titolo: tit, testo: testoP, verifica: function (v) { var x = T.intero(String(v).replace('−', '-')); if (x === null) return { ok: false, msg: 'Scrivi un numero intero (con il segno − se è negativo).' }; return { ok: x === att }; }, aiuti: aiuti, rivela: function () { return String(att); }, spiega: spiega }; }
  function defOp(o) {
    var r = risultato(o), passi = [], tit = { somma: 'La somma', prodotto: 'Il prodotto', quoziente: 'Il quoziente', potenza: 'La potenza' }[o.t];
    var lettere = {};
    if (o.t === 'somma') {
      var cs = o.p.map(function (m) { return m.c; }), tot = cs.reduce(function (s, x) { return s + x; }, 0);
      passi.push(numQ(tot, ['I monomi sono simili: somma algebricamente i coefficienti (attenzione ai segni).', 'Coefficienti: ' + cs.join(', ') + '.'], 'Coefficienti: ' + cs.map(function (c, i) { return i && c >= 0 ? '+ ' + c : (c < 0 ? '− ' + (-c) : c); }).join(' ') + ' = <strong>' + tot + '</strong>.', 'Somma i coefficienti', 'I monomi sono simili. Quanto fa la somma dei coefficienti ' + cs.map(function (c, i) { return i && c >= 0 ? '+ ' + c : (c < 0 ? '− ' + (-c) : c); }).join(' ') + '?'));
    } else if (o.t === 'prodotto') {
      passi.push(numQ(o.a.c * o.b.c, ['Moltiplica i coefficienti: ' + o.a.c + ' · (' + o.b.c + ').', 'Segni: + per + = +, − per − = +, + per − = −.'], o.a.c + ' · (' + o.b.c + ') = <strong>' + (o.a.c * o.b.c) + '</strong>.', 'Il coefficiente', 'Quanto fa il prodotto dei coefficienti ' + o.a.c + ' e ' + o.b.c + '?'));
      Object.keys(r.e).forEach(function (k) { passi.push(numQ(r.e[k], ['Somma gli esponenti di ' + k + ' nei due fattori (se manca, vale 0).'], 'Esponente di ' + k + ': ' + (o.a.e[k] || 0) + ' + ' + (o.b.e[k] || 0) + ' = <strong>' + r.e[k] + '</strong>.', 'L\'esponente di ' + k, 'Quale esponente avrà ' + k + ' nel prodotto? (' + k + ' ha esponente ' + (o.a.e[k] || 0) + ' nel primo e ' + (o.b.e[k] || 0) + ' nel secondo)')); });
    } else if (o.t === 'quoziente') {
      passi.push(numQ(r.c, ['Dividi i coefficienti: ' + o.a.c + ' : (' + o.b.c + ').'], o.a.c + ' : (' + o.b.c + ') = <strong>' + r.c + '</strong>.', 'Il coefficiente', 'Quanto fa ' + o.a.c + ' : (' + o.b.c + ')?'));
      Object.keys(o.a.e).forEach(function (k) { var d = o.a.e[k] - (o.b.e[k] || 0); passi.push(numQ(d, ['Sottrai: esponente nel dividendo meno esponente nel divisore.'], 'Esponente di ' + k + ': ' + o.a.e[k] + ' − ' + (o.b.e[k] || 0) + ' = <strong>' + d + '</strong>' + (d === 0 ? ' (esponente 0: la lettera sparisce)' : '') + '.', 'L\'esponente di ' + k, 'Quale esponente avrà ' + k + ' nel quoziente? (' + o.a.e[k] + ' nel dividendo, ' + (o.b.e[k] || 0) + ' nel divisore)')); });
    } else {
      passi.push(numQ(r.c, ['Eleva il coefficiente: ' + o.a.c + ' per se stesso ' + o.n + ' volte.', 'Attenzione al segno: se il coefficiente è negativo e l\'esponente è pari, il risultato è positivo.'], '(' + o.a.c + ')' + A.sup(o.n) + ' = <strong>' + r.c + '</strong>.', 'Il coefficiente', 'Quanto fa (' + o.a.c + ')' + A.sup(o.n) + '? (anche il coefficiente va elevato!)'));
      Object.keys(r.e).forEach(function (k) { passi.push(numQ(r.e[k], ['Moltiplica l\'esponente di ' + k + ' (' + o.a.e[k] + ') per ' + o.n + '.'], 'Esponente di ' + k + ': ' + o.a.e[k] + ' · ' + o.n + ' = <strong>' + r.e[k] + '</strong>.', 'L\'esponente di ' + k, 'Quale esponente avrà ' + k + '? (' + o.a.e[k] + ' · ' + o.n + ')')); });
    }
    passi.push(testoQ(r, ['Metti insieme coefficiente e parte letterale. Se un esponente vale 1 non si scrive; se vale 0 la lettera sparisce.'], 'Il risultato è <strong>' + A.testoMono(r) + '</strong>.', 'Scrivi il risultato', 'Scrivi il monomio risultato (potenze con ^, per esempio 6x^3y).'));
    return { testata: '<p class="tt-q">' + tit + ': ' + exprMath(o) + '</p>', passi: passi, fine: '<p class="tt-q">' + exprTesto(o) + ' = ' + A.testoMono(r) + '</p><p class="mm-p">' + ({ somma: 'Somma: si sommano i coefficienti, la parte letterale resta.', prodotto: 'Prodotto: si moltiplicano i coefficienti e si sommano gli esponenti delle lettere uguali.', quoziente: 'Quoziente: si dividono i coefficienti e si sottraggono gli esponenti.', potenza: 'Potenza: si eleva il coefficiente e si moltiplicano gli esponenti.' })[o.t] + '</p>' };
  }
  var LETT = { 1: ['x'], 2: ['x', 'y'], 3: ['a', 'b', 'x'] };
  function genOp(t, liv) {
    for (var k = 0; k < 200; k++) {
      var L = LETT[liv] || LETT[2], mx = liv === 3 ? 4 : 3, o;
      if (t === 'somma') { var base = A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: mx, maxC: 9 }), n = liv === 3 ? 3 : 2, p = [base]; for (var i = 1; i < n; i++) p.push(A.M(rnd(1, 9) * (Math.random() < 0.4 ? -1 : 1), base.e)); if (A.riduci(p).length !== 1) continue; o = { t: 'somma', p: p }; }
      else if (t === 'prodotto') { o = { t: 'prodotto', a: A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: mx - 1, maxC: liv === 3 ? 9 : 6 }), b: A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: mx - 1, maxC: liv === 3 ? 9 : 6 }) }; if (liv === 1) { var kk = Object.keys(o.a.e)[0]; o.b = A.M(o.b.c, (function () { var e = {}; e[kk] = rnd(1, 3); return e; })()); } }
      else if (t === 'quoziente') { var d = A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: 2, maxC: 5, pNeg: 0.3 }), q = A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: 3, maxC: 6, pNeg: 0.3 }); if (liv === 1) { var kd = Object.keys(d.e)[0]; q = A.M(q.c, (function () { var e = {}; e[kd] = rnd(1, 3); return e; })()); } var prodM = A.mulM(q, d); o = { t: 'quoziente', a: prodM, b: d }; if (!A.divM(prodM, d)) continue; }
      else { o = { t: 'potenza', a: A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: 2, maxC: liv === 3 ? 4 : 3, pNeg: liv === 1 ? 0.1 : 0.4 }), n: liv === 3 ? pesca([2, 3, 4]) : pesca([2, 3]) }; }
      var r = risultato(o); if (!r) continue; if (Object.keys(r.e).length === 0 && t !== 'somma' && Math.random() < 0.5) continue;
      return o;
    }
    return { t: 'prodotto', a: A.M(2, { x: 1 }), b: A.M(3, { x: 2 }) };
  }
  var Gen = {};
  ['somma', 'prodotto', 'quoziente', 'potenza'].forEach(function (t) {
    Gen[t] = function (liv) {
      var o = genOp(t, liv), r = risultato(o), nome = { somma: 'la somma', prodotto: 'il prodotto', quoziente: 'il quoziente', potenza: 'la potenza' }[t];
      var q = { tipo: 'testo', html: '<p class="tt-q">Calcola ' + nome + ': ' + exprMath(o) + '</p>', formato: FORM, aiuti: ({ somma: ['Somma i coefficienti: la parte letterale resta uguale.'], prodotto: ['Moltiplica i coefficienti e somma gli esponenti delle lettere uguali.'], quoziente: ['Dividi i coefficienti e sottrai gli esponenti delle lettere uguali.'], potenza: ['Eleva il coefficiente alla potenza e moltiplica gli esponenti.', 'Il coefficiente va elevato anche lui!'] })[t].concat(['Il risultato è un monomio con coefficiente ' + r.c + '.']), verifica: function (v) { return A.giudicaMono(v, r); }, rivela: function () { return A.testoMono(r); } };
      q.guida = function () { TU.avvia(defOp(o), $('metodo')); }; q.o = o; return q;
    };
  });
  Gen.completa = function (liv) {
    var L = LETT[liv] || LETT[2], f = A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: 2, maxC: 5 }), g = A.casualeMono({ lettere: L, nl: liv === 1 ? 1 : 2, maxE: 3, maxC: 6 }), p = A.mulM(f, g);
    var q = { tipo: 'testo', html: '<p class="tt-q">Quale monomio devi mettere al posto del punto interrogativo? ' + '<math><mi>?</mi><mo>·</mo>' + par(f) + '<mo>=</mo>' + A.mmlMono(p) + '</math></p>', formato: FORM, aiuti: ['Il monomio che manca si trova dividendo il prodotto per il fattore che conosci.', 'Dividi: ' + A.testoMono(p) + ' : (' + A.testoMono(f) + ').'], verifica: function (v) { return A.giudicaMono(v, g); }, rivela: function () { return A.testoMono(g); } };
    q.guida = function () { TU.avvia(defOp({ t: 'quoziente', a: p, b: f }), $('metodo')); }; return q;
  };
  Gen.errore = function (liv) {
    for (var k = 0; k < 200; k++) {
      var kind = pesca(['pe', 'pc', 'sp', 'dv', 'pt', 'ok']), x = pesca(['x', 'y', 'a']), a = rnd(2, 4), b = rnd(2, 4), c = rnd(2, 6), d = rnd(2, 6), riga, causa;
      var X = function (e) { return x + (e > 1 ? A.sup(e) : ''); };
      if (kind === 'pe') { if (a * b === a + b) continue; riga = X(a) + ' · ' + X(b) + ' = ' + X(a * b); causa = 'moltiplicare'; }
      else if (kind === 'pc') { riga = c + X(a) + ' · ' + d + X(b) + ' = ' + (c + d) + X(a + b); causa = 'coeffprod'; }
      else if (kind === 'sp') { riga = c + x + ' + ' + d + x + ' = ' + (c + d) + x + '²'; causa = 'sommaexp'; }
      else if (kind === 'dv') { var kq = rnd(2, 3), bb = rnd(1, 2); riga = X(kq * bb) + ' : ' + X(bb) + ' = ' + X(kq) + ''; if (kq * bb - bb === kq) continue; causa = 'dividi'; }
      else if (kind === 'pt') { var n = rnd(2, 3); riga = '(' + c + X(a) + ')' + A.sup(n) + ' = ' + c + X(a * n); causa = 'coeffpot'; }
      else { var rr = A.mulM(A.M(c, { x: a }), A.M(d, { x: b })); riga = c + X(a) + ' · ' + d + X(b) + ' = ' + A.testoMono(rr); causa = 'ok'; }
      var opz = [['ok', 'È tutto giusto'], ['moltiplicare', 'Ha moltiplicato gli esponenti invece di sommarli'], ['coeffprod', 'Ha sommato i coefficienti invece di moltiplicarli'], ['sommaexp', 'Ha sommato anche gli esponenti: nella somma la parte letterale non cambia'], ['dividi', 'Ha diviso gli esponenti invece di sottrarli'], ['coeffpot', 'Non ha elevato anche il coefficiente']];
      var sel = [opz[0], opz.filter(function (o) { return o[0] === causa; })[0]].filter(Boolean);
      opz.filter(function (o) { return o[0] !== 'ok' && o[0] !== causa; }).sort(function () { return Math.random() - 0.5; }).slice(0, 2).forEach(function (o) { sel.push(o); });
      var uniq = []; sel.forEach(function (o) { if (!uniq.some(function (u) { return u[0] === o[0]; })) uniq.push(o); });
      uniq.sort(function () { return Math.random() - 0.5; });
      var q = Q.scelta(causa === 'ok' ? 'ok' : causa, uniq, { html: '<p class="tt-q">Un compagno ha scritto: <strong>' + riga + '</strong><br>Dov\'è l\'errore?</p>', aiuti: ['Rifai il calcolo tu, con la regola giusta, e confronta.', 'Somma: coefficienti sommati, lettere uguali. Prodotto: coefficienti moltiplicati, esponenti sommati. Quoziente: esponenti sottratti. Potenza: coefficiente elevato, esponenti moltiplicati.'] });
      q.rivela = function () { var t = uniq.filter(function (o) { return o[0] === (causa === 'ok' ? 'ok' : causa); })[0]; return t[1].toLowerCase(); };
      return q;
    }
    return Gen.prodotto(liv);
  };
  var NOMI_TIPI = ['somma', 'prodotto', 'quoziente', 'potenza', 'completa', 'errore'];

  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() { var t = $('tu-tipo').value, liv = +$('tu-liv').value; TU.avvia(defOp(genOp(t, liv))); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  T.allenati({ area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var q = Gen[t](+$('ex-liv').value); q.et = 'Esercizio'; return q; },
    guida: function (q) { if (q.guida) q.guida(); } });

  var COM = [['somma', 1], ['prodotto', 1], ['quoziente', 2], ['potenza', 2], ['completa', 3], ['potenza', 3]];
  var CTX = ['Il tavolo 1 ordina:', 'Dalla cucina chiedono:', 'Il cassiere deve semplificare:', 'Il magazziniere calcola:', 'Il pasticciere chiede:', 'L\'ordine speciale dello chef:'];
  T.servizio({ area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 90,
    genera: function (l, i) { var q = Gen[COM[i][0]](COM[i][1]); q.intro = CTX[i]; q.soluzione = function () { return '<p class="mm-p">Risposta: <strong>' + q.rivela() + '</strong>. Il metodo è nella sezione «Il metodo».</p>'; }; return q; } });

  function mq(intro, q, hint, dopo) { q.intro = intro; q.hint = hint; q.dopo = dopo; return q; }
  function tm(att) { return { tipo: 'testo', formato: FORM, verifica: function (v) { return A.giudicaMono(v, att); }, rivela: function () { return A.testoMono(att); } }; }
  var MI = [
    mq('Un rettangolo ha i lati <strong>3x</strong> e <strong>2y</strong>. Scrivi la sua area, il prodotto dei lati.', tm(A.M(6, { x: 1, y: 1 })), 'Moltiplica i coefficienti: 3 · 2; le lettere restano.', 'L\'area è 6xy.'),
    mq('Un cubo ha lo spigolo <strong>2a</strong>. Il volume è <strong>(2a)³</strong>. Scrivilo come monomio.', tm(A.M(8, { a: 3 })), 'Eleva il coefficiente: 2³ = 8; moltiplica l\'esponente: 1 · 3.', '(2a)³ = 8a³.'),
    mq('Dividi <strong>12x³y : (4xy)</strong>.', tm(A.M(3, { x: 2 })), 'Dividi i coefficienti: 12 : 4. Sottrai gli esponenti: x³ : x = x², y : y = 1.', '12x³y : 4xy = 3x².'),
    mq('Riduci <strong>3a + 5a − 2a</strong>.', tm(A.M(6, { a: 1 })), 'Sono monomi simili: somma i coefficienti 3 + 5 − 2.', '3a + 5a − 2a = 6a.'),
    mq('Quale monomio manca? <strong>? · 2a = 6a²b</strong>', tm(A.M(3, { a: 1, b: 1 })), 'Dividi 6a²b per 2a.', '6a²b : 2a = 3ab.')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'la cucina in formula', icona: '✖️', items: MI, rip: [
    { d: 'x² · x³ = ?', r: 'x⁵', s: 'Nel prodotto gli esponenti si sommano.' },
    { d: '3x + 2x = ?', r: '5x', s: 'Nella somma si sommano i coefficienti, la parte letterale resta.' },
    { d: '(2x²)³ = ?', r: '8x⁶', s: 'Si eleva anche il coefficiente: 2³ = 8; esponenti 2 · 3 = 6.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.MONOMI_OP = { Gen: Gen, NOMI_TIPI: NOMI_TIPI, defOp: defOp, risultato: risultato, genOp: genOp, exprTesto: exprTesto };
})();
