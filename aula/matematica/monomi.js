/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «Dalle lettere ai monomi»
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'monomi', URL = 'aula/matematica/monomi.html';
  var T = window.TB, A = window.ALG, $ = T.$, rnd = T.rnd, pesca = T.pesca, M = T.M, Q = T.Q;
  var mm = function (m) { return A.math(m); };
  T.lim('mt-lim', 'main');

  /* ════════ IL CASO ════════ */
  (function () {
    var C = $('mo-caso'), S = { i: 0, ok: 0 };
    var D = [
      { t: 'In pizzeria un piatto costa <strong>p euro</strong> (la lettera <em>p</em> sta per «un prezzo che può cambiare»). Quanto costano <strong>4 piatti</strong>?', o: [['a', '4 + p'], ['b', '4p (4 volte p)'], ['c', 'p⁴']], g: 'b', s: '<strong>4p</strong> si legge «4 volte p»: tra un numero e una lettera il segno × non si scrive. Se p = 8 €, 4p = 32 €.' },
      { t: 'Se <strong>p = 8</strong>, quanto vale <strong>4p</strong>?', o: [['a', '12'], ['b', '32'], ['c', '84']], g: 'b', s: '4p significa 4 × p = 4 × 8 = <strong>32</strong>. Non «84»: i numeri non si attaccano, si moltiplicano.' },
      { t: 'Una teglia quadrata ha il lato di <strong>x centimetri</strong>. Quale espressione dà la sua <strong>area</strong>?', o: [['a', '2x'], ['b', 'x · x, cioè x²'], ['c', '4x']], g: 'b', s: 'L\'area del quadrato è lato × lato = x · x = <strong>x²</strong> (4x sarebbe il perimetro). Con x = 5: x² = 25 e 2x = 10: <strong>non sono la stessa cosa</strong>.' }
    ];
    function disegna(ris) {
      if (S.i >= D.length) { C.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">Le lettere sono numeri che possono cambiare: così una sola formula vale per tutti i casi.</p><p class="tt-stat">Hai risposto giusto a ' + S.ok + ' su ' + D.length + '. Un termine come 4p o x² si chiama <strong>monomio</strong>: sotto vedi come è fatto.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mo-rifai">Rifai il caso</button></div></div>'; return; }
      var d = D[S.i], h = '<div class="tt-prog"><span>Domanda ' + (S.i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="mo-avanti">' + (S.i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      C.innerHTML = h; if (ris) C.querySelector('#mo-avanti').focus();
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var g = b.dataset.v === D[S.i].g; if (g) S.ok++; disegna({ ok: g }); return; }
      if (b.id === 'mo-avanti') { S.i++; disegna(); var x = C.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'mo-rifai') { S = { i: 0, ok: 0 }; disegna(); }
    });
    disegna();
  })();

  /* ════════ LA FABBRICA DI MONOMI ════════ */
  (function () {
    var OUT = $('fb-out'), CTL = $('fb-ctl'), S = { c: 3, x: 2, y: 1, vx: 2, vy: 3 };
    function disegna() {
      var m = A.M(S.c, { x: S.x, y: S.y }), g = A.grado(m), val = A.valuta(m, { x: S.vx, y: S.vy });
      var l = A.lettere(m);
      CTL.innerHTML = [['c', 'Coefficiente', -9, 9], ['x', 'Esponente di x', 0, 5], ['y', 'Esponente di y', 0, 5]].map(function (r) {
        return '<div class="fb-r"><span class="fb-n" id="fb-l-' + r[0] + '">' + r[1] + '</span><div class="fc-step" role="group" aria-labelledby="fb-l-' + r[0] + '"><button type="button" class="fz-btn sec" data-k="' + r[0] + '" data-d="-1" aria-label="Diminuisci: ' + r[1] + '">−</button><output aria-live="polite">' + S[r[0]] + '</output><button type="button" class="fz-btn sec" data-k="' + r[0] + '" data-d="1" aria-label="Aumenta: ' + r[1] + '">+</button></div></div>';
      }).join('');
      var vsel = function (k) { var o = ''; for (var v = -3; v <= 5; v++) o += '<option value="' + v + '"' + (S['v' + k] === v ? ' selected' : '') + '>' + v + '</option>'; return '<label class="fb-sel">' + k + ' = <select data-v="' + k + '">' + o + '</select></label>'; };
      var cal = (l.length ? l.map(function (k) { return m.e[k] > 1 ? '(' + S['v' + k] + ')<sup>' + m.e[k] + '</sup>' : '(' + S['v' + k] + ')'; }).join(' · ') : '') ;
      OUT.innerHTML = '<div class="fb-mono" aria-live="polite">' + A.math(m).replace('<math>', '<math display="block">') + '</div><ul class="fb-lista"><li><strong>Coefficiente</strong>: ' + m.c + (m.c === 1 ? ' (non si scrive)' : m.c === -1 ? ' (si scrive solo il segno −)' : '') + '</li><li><strong>Parte letterale</strong>: ' + A.parteLetterale(m) + '</li><li><strong>Grado</strong>: ' + g + (l.length ? ' (somma degli esponenti: ' + l.map(function (k) { return m.e[k]; }).join(' + ') + ')' : ' (un numero da solo ha grado 0)') + '</li></ul><p class="mm-p"><strong>Dai un valore alle lettere:</strong> ' + vsel('x') + ' ' + vsel('y') + '</p><p class="mm-p">' + (l.length ? m.c + ' · ' + cal + ' = <strong>' + val + '</strong>' : '') + '</p>' + (l.length ? '<p class="mm-p">Con le lettere che valgono ' + l.map(function (k) { return k + ' = ' + S['v' + k]; }).join(' e ') + ' il monomio vale <strong>' + val + '</strong>.</p>' : '<p class="mm-p">Senza lettere il valore non cambia mai: <strong>' + m.c + '</strong>.</p>');
    }
    CTL.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return; var k = b.dataset.k, d = +b.dataset.d;
      var lim = { c: [-9, 9], x: [0, 5], y: [0, 5] }[k]; S[k] = Math.max(lim[0], Math.min(lim[1], S[k] + d));
      if (k === 'c' && S.c === 0) S.c = d;
      disegna(); var n = CTL.querySelector('[data-k="' + k + '"][data-d="' + d + '"]'); if (n) n.focus();
    });
    OUT.addEventListener('change', function (ev) { var s = ev.target; if (s.dataset.v) { S['v' + s.dataset.v] = +s.value; disegna(); var x = OUT.querySelector('select[data-v="' + s.dataset.v + '"]'); if (x) x.focus(); } });
    disegna();
  })();

  /* ════════ CHI È SIMILE A CHI? ════════ */
  (function () {
    var C = $('sm-area'), S = { rif: null, tiles: [], sel: {}, ris: null, serie: 0, best: 0 };
    function nuovo() {
      var rif = A.casualeMono({ lettere: ['x', 'y'], maxE: 3, nl: 2, pNeg: 0.3 }), key = A.chiave(rif), tiles = [];
      var ls = A.lettere(rif);
      var nSim = rnd(1, 3);
      for (var i = 0; i < nSim; i++) { var t = A.M(rnd(1, 9) * (Math.random() < 0.4 ? -1 : 1), rif.e); if (!tiles.some(function (x) { return A.testoMono(x) === A.testoMono(t); }) && A.testoMono(t) !== A.testoMono(rif)) tiles.push(t); }
      while (tiles.length < 6) {
        var e = JSON.parse(JSON.stringify(rif.e)), k = ls[rnd(0, ls.length - 1)], v = rnd(0, 3);
        if (v === 0) { e = {}; ls.forEach(function (z) { e[z] = rnd(1, 3); }); e[pesca(['x', 'y', 'z'])] = rnd(1, 2); }
        else e[k] = Math.max(1, e[k] + pesca([-1, 1, 2]));
        if (Math.random() < 0.3) { delete e[k]; e['a'] = rnd(1, 2); }
        var t2 = A.M(rnd(1, 9) * (Math.random() < 0.4 ? -1 : 1), e);
        if (A.chiave(t2) === key || !Object.keys(t2.e).length) continue;
        if (!tiles.some(function (x) { return A.testoMono(x) === A.testoMono(t2); })) tiles.push(t2);
      }
      tiles.sort(function () { return Math.random() - 0.5; });
      S.rif = rif; S.tiles = tiles; S.sel = {}; S.ris = null; disegna();
    }
    function disegna() {
      var h = '<p class="mm-p">Il monomio di riferimento è: ' + A.math(S.rif).replace('<math>', '<math display="block">') + '<span class="vh">' + A.testoMono(S.rif) + '</span> Tocca <strong>tutti</strong> i monomi simili a lui (stessa parte letterale; il coefficiente può essere diverso).</p><div class="sm-tiles" role="group" aria-label="Monomi tra cui scegliere">';
      S.tiles.forEach(function (t, i) {
        var s = S.sel[i], g = S.ris ? (A.simili(t, S.rif) ? 'g' : 'n') : '';
        h += '<button type="button" class="sm-t ' + (s ? 'on ' : '') + g + '" data-i="' + i + '" aria-pressed="' + (!!s) + '"' + (S.ris ? ' disabled' : '') + '><span class="vh">' + A.testoMono(t) + '</span><span aria-hidden="true">' + A.math(t) + '</span></button>';
      });
      h += '</div>';
      if (S.ris) h += '<p class="fz-fb ' + (S.ris.ok ? 'si' : 'no') + '" role="status">' + S.ris.t + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="sm-altro">Un altro gruppo</button></div>';
      else h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="sm-ver">Controlla</button></div>';
      h += '<p class="fz-conta">Giusti in fila: ' + S.serie + ' · record in questa visita: ' + S.best + '</p>';
      C.innerHTML = h;
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.i !== undefined && !S.ris) { var i = +b.dataset.i; S.sel[i] = !S.sel[i]; disegna(); C.querySelector('[data-i="' + i + '"]').focus(); return; }
      if (b.id === 'sm-ver') {
        var ok = S.tiles.every(function (t, i) { return !!S.sel[i] === A.simili(t, S.rif); });
        S.serie = ok ? S.serie + 1 : 0; S.best = Math.max(S.best, S.serie);
        var sim = S.tiles.filter(function (t) { return A.simili(t, S.rif); }).map(A.testoMono).join(', ');
        S.ris = { ok: ok, t: (ok ? 'Perfetto! ' : 'Non proprio. ') + 'I simili a ' + A.testoMono(S.rif) + ' erano: <strong>' + sim + '</strong>. Hanno tutti la stessa parte letterale <strong>' + A.parteLetterale(S.rif) + '</strong>.' };
        disegna(); C.querySelector('#sm-altro').focus(); return;
      }
      if (b.id === 'sm-altro') { nuovo(); C.querySelector('.sm-t').focus(); }
    });
    nuovo();
  })();

  /* ════════ DOMANDE E TUTOR ════════ */
  var NOTA = 'Scrivi le potenze con ^ (x^2) oppure con l\'apice (x²).';
  var FORM = 'Per esempio 6x^3y oppure −2a^2b (per l\'elevamento a potenza usa ^).';
  function testoQ(att, aiuti, spiega, tit, testoP, lav) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, lav: lav, verifica: function (v) { return A.giudicaMono(v, att); }, aiuti: aiuti, rivela: function () { return A.testoMono(att); }, spiega: spiega }; }
  function numQ(att, aiuti, spiega, tit, testoP, lav) { return { tipo: 'num', atteso: att, titolo: tit, testo: testoP, lav: lav, verifica: function (v) { var x = T.intero(String(v).replace('−', '-')); if (x === null) return { ok: false, msg: 'Scrivi un numero intero (con il segno − se è negativo).' }; return { ok: x === att }; }, aiuti: aiuti, rivela: function () { return String(att); }, spiega: spiega }; }
  function letteraleQ(m, aiuti) { var key = A.chiave(m); return { tipo: 'num', testo_libero: true, titolo: 'La parte letterale', testo: 'Scrivi la parte letterale (le lettere con i loro esponenti, senza il coefficiente).', verifica: function (v) { var x = A.parseMono(v); if (!x) return { ok: false, msg: 'Scrivi solo le lettere con gli esponenti, per esempio x^2y.' }; if (A.chiave(x) !== key) return { ok: false }; if (Math.abs(x.c) !== 1) return { ok: false, quasi: true, msg: 'Le lettere sono giuste, ma la parte letterale non comprende il coefficiente.' }; return { ok: true }; }, aiuti: aiuti, rivela: function () { return A.parteLetterale(m); }, spiega: 'La parte letterale è <strong>' + A.parteLetterale(m) + '</strong>.' }; }
  function defAnalisi(m) {
    var g = A.grado(m);
    return { testata: '<p class="tt-q">Studia il monomio ' + mm(m) + '.</p>', passi: [
      Object.assign(numQ(m.c, ['Il coefficiente è il numero davanti alle lettere, con il suo segno.', m.c === 1 || m.c === -1 ? 'Se non si vede nessun numero, il coefficiente è 1 (o −1 se c\'è solo il segno meno).' : 'Guarda il numero che moltiplica le lettere.'], 'Il coefficiente è <strong>' + m.c + '</strong>.', 'Il coefficiente', 'Quale è il coefficiente (con il segno)?', mm(m)), {}),
      letteraleQ(m, ['La parte letterale sono tutte le lettere con i loro esponenti.', 'Se una lettera non ha esponente, vale 1: x = x¹.']),
      numQ(g, ['Somma gli esponenti di tutte le lettere.', 'Una lettera senza esponente conta 1.'], 'Grado = ' + A.lettere(m).map(function (k) { return m.e[k]; }).join(' + ') + ' = <strong>' + g + '</strong>.', 'Il grado', 'Quale è il grado del monomio?')
    ], fine: '<p class="tt-q">' + mm(m) + ': coefficiente ' + m.c + ', parte letterale ' + A.parteLetterale(m) + ', grado ' + g + '</p><p class="mm-p">Il grado di un monomio è la somma degli esponenti delle sue lettere.</p>' };
  }
  function defValore(m, v) {
    var l = A.lettere(m), passi = [], val = A.valuta(m, v);
    l.forEach(function (k) { var e = m.e[k], pv = Math.pow(v[k], e); passi.push(numQ(pv, ['Calcola ' + v[k] + (e > 1 ? ' elevato a ' + e : '') + ': ' + (e > 1 ? 'moltiplica ' + v[k] + ' per se stesso ' + e + ' volte.' : 'è già ' + v[k] + '.'), 'Attenzione ai segni: un numero negativo elevato a esponente pari dà un risultato positivo.'], k + (e > 1 ? '<sup>' + e + '</sup>' : '') + ' con ' + k + ' = ' + v[k] + ' vale <strong>' + pv + '</strong>.', 'Il valore di ' + k + (e > 1 ? A.sup(e) : ''), 'Quanto vale ' + k + (e > 1 ? A.sup(e) : '') + ' se ' + k + ' = ' + v[k] + '?', null)); });
    passi.push(numQ(val, ['Moltiplica il coefficiente ' + m.c + ' per i valori che hai trovato.'], 'Il valore del monomio è <strong>' + val + '</strong>.', 'Moltiplica tutto', 'Moltiplica il coefficiente ' + m.c + ' per i valori trovati: quanto vale il monomio?'));
    return { testata: '<p class="tt-q">Calcola il valore di ' + mm(m) + ' per ' + l.map(function (k) { return k + ' = ' + v[k]; }).join(' e ') + '.</p>', passi: passi, fine: '<p class="tt-q">' + A.testoMono(m) + ' = ' + val + '</p><p class="mm-p">Si sostituisce ogni lettera con il suo valore e si calcola: prima le potenze, poi il prodotto.</p>' };
  }
  function opzSimili(base) {
    var key = A.chiave(base), ls = A.lettere(base), opz = [A.M(rnd(1, 9) * (Math.random() < 0.4 ? -1 : 1), base.e)];
    while (opz.length < 4) { var e = JSON.parse(JSON.stringify(base.e)), k = pesca(ls); var r = rnd(0, 2); if (r === 0) e[k] = e[k] + pesca([1, 2]); else if (r === 1) { delete e[k]; e[pesca(['a', 'b', 'z'])] = rnd(1, 3); } else e['z'] = rnd(1, 2); var t = A.M(rnd(1, 9), e); if (A.chiave(t) === key || !Object.keys(t.e).length || opz.some(function (x) { return A.testoMono(x) === A.testoMono(t); })) continue; opz.push(t); }
    return opz;
  }
  var Gen = {};
  Gen.coeff = function (liv) { var m = A.casualeMono({ nl: liv === 1 ? 1 : 2, maxE: 3, maxC: liv === 3 ? 25 : 9, pNeg: liv === 1 ? 0.2 : 0.4 }); if (Math.random() < 0.15) m.c = Math.random() < 0.5 ? 1 : -1; var q = Q.num(m.c, { html: '<p class="tt-q">Quale è il <strong>coefficiente</strong> del monomio ' + mm(m) + '?</p>', aiuti: ['È il numero che moltiplica le lettere, con il suo segno.', 'Se non si vede nessun numero, il coefficiente è 1 (o −1).'], formato: 'Scrivi il numero con il segno, se serve.' }); q.verifica = function (v) { var x = T.intero(String(v).replace('−', '-')); if (x === null) return { ok: false, msg: 'Scrivi un numero intero.' }; return { ok: x === m.c }; }; q.rivela = function () { return String(m.c); }; q.guida = function () { TU.avvia(defAnalisi(m), $('metodo')); }; return q; };
  Gen.grado = function (liv) { var m = A.casualeMono({ nl: liv === 1 ? 1 : 2, maxE: liv === 3 ? 5 : 3, pNeg: 0.3 }); var g = A.grado(m), q = Q.num(g, { html: '<p class="tt-q">Quale è il <strong>grado</strong> del monomio ' + mm(m) + '?</p>', aiuti: ['Il grado è la somma di tutti gli esponenti delle lettere.', 'Una lettera senza esponente vale 1. Il coefficiente non conta.'], formato: 'Scrivi un numero.' }); q.rivela = function () { return String(g); }; q.guida = function () { TU.avvia(defAnalisi(m), $('metodo')); }; return q; };
  Gen.letterale = function (liv) { var m = A.casualeMono({ nl: 2, maxE: 3 }), key = A.chiave(m), q = { tipo: 'testo', html: '<p class="tt-q">Scrivi la <strong>parte letterale</strong> del monomio ' + mm(m) + '.</p>', formato: NOTA, aiuti: ['La parte letterale sono le lettere con i loro esponenti, senza il coefficiente.'], verifica: function (v) { var x = A.parseMono(v); if (!x) return { ok: false, msg: 'Scrivi solo le lettere con gli esponenti, per esempio x^2y.' }; if (A.chiave(x) !== key) return { ok: false }; if (Math.abs(x.c) !== 1) return { ok: false, msg: 'Le lettere sono giuste, ma non scrivere il coefficiente.' }; return { ok: true }; }, rivela: function () { return A.parteLetterale(m); }, guida: function () { TU.avvia(defAnalisi(m), $('metodo')); } }; return q; };
  Gen.simili = function (liv) {
    var base = A.casualeMono({ nl: liv === 1 ? 1 : 2, maxE: 3 }), opz = opzSimili(base).sort(function () { return Math.random() - 0.5; });
    var giusto = opz.filter(function (o) { return A.simili(o, base); })[0];
    var q = Q.scelta(A.testoMono(giusto), opz.map(function (o) { return [A.testoMono(o), '<span class="vh">' + A.testoMono(o) + '</span><span aria-hidden="true">' + mm(o) + '</span>']; }), { html: '<p class="tt-q">Quale di questi monomi è <strong>simile</strong> a ' + mm(base) + '?</p>', aiuti: ['Due monomi sono simili se hanno la stessa parte letterale (lettere ed esponenti uguali).', 'La parte letterale di ' + A.testoMono(base) + ' è ' + A.parteLetterale(base) + '.'] });
    q.rivela = function () { return A.testoMono(giusto); }; return q;
  };
  Gen.valore = function (liv) {
    var m = A.casualeMono({ nl: liv === 1 ? 1 : 2, maxE: liv === 3 ? 3 : 2, maxC: 6, pNeg: 0.3 }), v = { x: rnd(liv === 1 ? 1 : -3, 4), y: rnd(liv === 1 ? 1 : -3, 4), a: 1, b: 1 };
    if (v.x === 0) v.x = 2; if (v.y === 0) v.y = 1; var l = A.lettere(m), val = A.valuta(m, v), vals = l.map(function (k) { return k + ' = ' + v[k]; }).join(' e ');
    var q = Q.num(val, { html: '<p class="tt-q">Calcola il valore di ' + mm(m) + ' per ' + vals + '.</p>', aiuti: ['Sostituisci le lettere con i numeri: prima le potenze, poi moltiplica per il coefficiente.', 'Attenzione ai segni: (−2)² = +4 ma (−2)³ = −8.'], formato: 'Scrivi un numero, con il segno − se è negativo.' });
    q.verifica = function (x) { var n = T.intero(String(x).replace('−', '-')); if (n === null) return { ok: false, msg: 'Scrivi un numero intero.' }; return { ok: n === val }; }; q.rivela = function () { return String(val); }; q.guida = function () { TU.avvia(defValore(m, v), $('metodo')); }; return q;
  };
  /* dalle parole al monomio */
  var ESPW = { 2: 'al quadrato', 3: 'al cubo', 4: 'alla quarta' };
  Gen.scrivi = function (liv) {
    var c = rnd(2, 9) * (Math.random() < 0.3 ? -1 : 1), ls = pesca([['x'], ['a', 'b'], ['x', 'y'], ['m', 'n']]), e = {};
    var parti = []; ls.forEach(function (k, i) { var ex = i === 0 ? (liv === 1 ? 1 : rnd(1, 3)) : rnd(1, 3); e[k] = ex; parti.push(k + (ex > 1 ? ' ' + ESPW[ex] : '')); });
    var m = A.M(c, e);
    var frase = 'Il prodotto di <strong>' + (c < 0 ? 'meno ' + (-c) : c) + '</strong>, ' + parti.map(function (p) { return '<strong>' + p + '</strong>'; }).join(' e ') + '.';
    if (liv === 1 && ls.length === 1) { var nomi = { 2: 'il doppio', 3: 'il triplo', 4: 'il quadruplo', 5: 'il quintuplo' }; if (nomi[Math.abs(c)] && c > 0) frase = 'Scrivi <strong>' + nomi[c] + ' di ' + ls[0] + '</strong>.'; }
    var q = { tipo: 'testo', html: '<p class="tt-q">Scrivi come monomio: ' + frase + '</p>', formato: FORM, aiuti: ['Il coefficiente va prima, poi le lettere con i loro esponenti.', '«Al quadrato» è esponente 2, «al cubo» esponente 3.'], verifica: function (v) { return A.giudicaMono(v, m); }, rivela: function () { return A.testoMono(m); } };
    return q;
  };
  var NOMI_TIPI = ['coeff', 'grado', 'letterale', 'simili', 'valore', 'scrivi'];
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() {
    var t = $('tu-tipo').value, liv = +$('tu-liv').value, m;
    if (t === 'valore') { m = A.casualeMono({ nl: 2, maxE: liv === 3 ? 3 : 2, maxC: 6, pNeg: 0.3 }); var v = { x: rnd(-3, 4) || 2, y: rnd(-3, 4) || 1 }; TU.avvia(defValore(m, v)); return; }
    if (t === 'simili') { var base = A.casualeMono({ nl: liv === 1 ? 1 : 2, maxE: 3 }), opz = opzSimili(base).sort(function () { return Math.random() - 0.5; }), g = opz.filter(function (o) { return A.simili(o, base); })[0];
      TU.avvia({ testata: '<p class="tt-q">Quale di questi monomi è simile a ' + mm(base) + '?</p>', passi: [
        letteraleQ(base, ['Sono le lettere con i loro esponenti: ignora il coefficiente.']),
        Object.assign(Q.scelta(A.testoMono(g), opz.map(function (o) { return [A.testoMono(o), '<span class="vh">' + A.testoMono(o) + '</span><span aria-hidden="true">' + mm(o) + '</span>']; }), {}), { titolo: 'Scegli il simile', testo: 'Quale monomio ha la stessa parte letterale ' + A.parteLetterale(base) + '?', aiuti: ['Confronta lettere ed esponenti, uno per uno.'], verifica: function (x) { return { ok: x === A.testoMono(g), msg: 'Non ha la stessa parte letterale: controlla lettere ed esponenti.' }; }, rivela: function () { return A.testoMono(g); }, spiega: A.testoMono(g) + ' ha parte letterale ' + A.parteLetterale(g) + ', uguale a quella di ' + A.testoMono(base) + '.' })
      ], fine: '<p class="tt-q">' + A.testoMono(g) + ' è simile a ' + A.testoMono(base) + '</p><p class="mm-p">Monomi simili: stessa parte letterale. Possono avere coefficienti diversi.</p>' }); return; }
    m = A.casualeMono({ nl: liv === 1 ? 1 : 2, maxE: liv === 3 ? 4 : 3, maxC: liv === 3 ? 20 : 9, pNeg: 0.4 }); TU.avvia(defAnalisi(m));
  }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  T.allenati({ area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var q = Gen[t](+$('ex-liv').value); q.et = 'Esercizio'; return q; },
    guida: function (q) { if (q.guida) q.guida(); } });

  var COM = [['coeff', 1], ['grado', 1], ['simili', 2], ['valore', 2], ['scrivi', 2], ['scrivi', 3]];
  var CTX = ['Il tavolo 1 chiede:', 'Dalla cucina arriva:', 'Il cassiere deve riconoscere:', 'Il magazziniere calcola:', 'Il pasticciere detta:', 'L\'ordine speciale dello chef:'];
  T.servizio({ area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 75,
    genera: function (l, i) { var q = Gen[COM[i][0]](COM[i][1]); q.intro = CTX[i]; q.soluzione = function () { return '<p class="mm-p">Risposta: <strong>' + q.rivela() + '</strong>. Il metodo è nella sezione «Il metodo».</p>'; }; return q; } });

  function mq(intro, q, hint, dopo) { q.intro = intro; q.hint = hint; q.dopo = dopo; return q; }
  var MI = [
    mq('Una teglia costa <strong>t euro</strong>. Per 5 teglie la spesa è 5t. Se <strong>t = 12</strong>, quanti euro spendi?', Q.num(60, { formato: 'Scrivi un numero.' }), '5t significa 5 × t.', '5 · 12 = 60 euro.'),
    mq('Quale è il <strong>grado</strong> del monomio <strong>−4a²b³</strong>?', Q.num(5, { formato: 'Scrivi un numero.' }), 'Somma gli esponenti: 2 + 3.', 'Il grado è 2 + 3 = 5.'),
    mq('Scrivi come monomio: il prodotto di <strong>6</strong>, <strong>x al quadrato</strong> e <strong>y</strong>.', { tipo: 'testo', formato: FORM, verifica: function (v) { return A.giudicaMono(v, A.M(6, { x: 2, y: 1 })); }, rivela: function () { return '6x²y'; } }, 'Il coefficiente per primo, poi le lettere in ordine.', 'Si scrive 6x²y.'),
    mq('Quanto vale <strong>3x²y</strong> per <strong>x = 2</strong> e <strong>y = −1</strong>?', Q.num(-12, { formato: 'Scrivi il numero, con il segno − se è negativo.' }), 'Prima x² = 4, poi 3 · 4 · (−1).', '3 · 4 · (−1) = −12.'),
    mq('Tra <strong>5x²y</strong>, <strong>5xy²</strong>, <strong>−2yx²</strong> e <strong>3x²</strong>, quanti sono simili a <strong>7x²y</strong>?', Q.num(2, { formato: 'Scrivi un numero.' }), 'Stessa parte letterale: l\'ordine delle lettere non conta (yx² = x²y).', 'Sono simili 5x²y e −2yx²: due.')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'il menù in formula', icona: '🟩', items: MI, rip: [
    { d: 'Quale è il coefficiente di −5x²y?', r: '−5', s: 'È il numero con il segno davanti alle lettere.' },
    { d: 'Quale è il grado di 3x²y³?', r: '5', s: '2 + 3 = 5.' },
    { d: '2x e 5x sono monomi simili?', r: 'Sì', s: 'Hanno la stessa parte letterale x.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.MONOMI = { Gen: Gen, NOMI_TIPI: NOMI_TIPI, defAnalisi: defAnalisi, defValore: defValore };
})();
