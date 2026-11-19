/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Espressioni con le frazioni
   L'ultima fetta, la frazione di una frazione (modello ad area), tre strade per lo stesso
   problema, le parentesi, il metodo passo passo (tutor.js + espressioni-motore.js),
   allenamento e missione. Tutto nel dispositivo: in localStorage solo il segno «tappa fatta» e il ripasso.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var E = window.ESPR, ID = 'espressioni-frazioni', URL = 'aula/matematica/espressioni-frazioni.html';
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mfr(n, d) { return '<mfrac><mn>' + n + '</mn><mn>' + d + '</mn></mfrac>'; }
  function M(x, blocco) { return '<math' + (blocco ? ' display="block"' : '') + '>' + x + '</math>'; }
  function F(n, d) { return M(d === 1 ? '<mn>' + n + '</mn>' : mfr(n, d)); }
  function fr(f) { return F(f.n, f.d); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  function intero(s) { s = String(s == null ? '' : s).replace(/[\s.']/g, ''); return /^\d+$/.test(s) ? parseInt(s, 10) : null; }
  function leggiFr(n, d) {
    var a = intero(n), b = String(d).trim() === '' ? 1 : intero(d);
    return a === null || b === null || b === 0 ? null : { n: a, d: b };
  }
  window.ESPR_PAGINA = { M: M, F: F };

  /* ════════ LIM ════════ */
  $('mt-lim').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('main').classList.toggle('fz-grande', on);
  });

  /* ════════ 1 · L'ULTIMA FETTA ════════ */
  var UL = { k: 0 };
  var ULMAX = 8;
  function ulDisegna() {
    var W = 160, H = 70, svg = '<svg viewBox="-2 -2 ' + (W + 4) + ' ' + (H + 4) + '" class="fc-svg ef-svg" role="img" aria-label="Teglia: mangiato ' + (Math.pow(2, UL.k) - 1) + ' su ' + Math.pow(2, UL.k) + '">';
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="ef-resta"/>';
    for (var i = 0; i < UL.k; i++) {
      var x0 = W * (1 - 1 / Math.pow(2, i)), x1 = W * (1 - 1 / Math.pow(2, i + 1));
      svg += '<rect x="' + x0.toFixed(3) + '" y="0" width="' + (x1 - x0).toFixed(3) + '" height="' + H + '" class="ef-morso ef-m' + (i % 3) + '"/>';
    }
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="fc-bordo"/></svg>';
    $('ul-fig').innerHTML = svg;
    var h = '<table class="ef-tb"><caption class="vh">Che cosa mangi a ogni morso</caption><thead><tr><th scope="col">Morso</th><th scope="col">Mangiato ora</th><th scope="col">Mangiato in tutto</th><th scope="col">Resta</th></tr></thead><tbody>';
    for (var j = 1; j <= UL.k; j++) {
      var p = Math.pow(2, j);
      h += '<tr><th scope="row">' + j + '</th><td>' + F(1, p) + '</td><td>' + F(p - 1, p) + '</td><td>' + F(1, p) + '</td></tr>';
    }
    $('ul-tab').innerHTML = UL.k ? h + '</tbody></table>' : '';
    $('ul-mangia').disabled = UL.k >= ULMAX;
    var fb = $('ul-fb'), q = $('ul-quiz');
    if (UL.k === 0) { fb.className = 'fz-fb'; fb.textContent = ''; }
    else if (UL.k < 4) { fb.className = 'fz-fb'; fb.innerHTML = 'Hai mangiato ' + (Math.pow(2, UL.k) - 1) + '/' + Math.pow(2, UL.k) + ' della teglia. Continua e guarda che cosa succede a ciò che resta.'; }
    else if (UL.k < ULMAX) { fb.className = 'fz-fb mezzo'; fb.innerHTML = 'Hai notato? Ogni volta resta una fetta <strong>uguale all\'ultima che hai mangiato</strong>. Resta sempre qualcosa: la teglia non finisce mai!'; }
    else { fb.className = 'fz-fb si'; fb.innerHTML = 'Otto morsi: hai mangiato ' + F(255, 256) + ' e resta ' + F(1, 256) + '. Più continui, più ti avvicini a una teglia intera, ma non ci arrivi mai. Anche l\'infinito si può ragionare con le frazioni!'; }
    q.hidden = UL.k < 5;
  }
  $('ul-mangia').addEventListener('click', function () {
    if (UL.k >= ULMAX) return;
    UL.k++; ulDisegna();
  });
  $('ul-da-capo').addEventListener('click', function () { UL.k = 0; $('ul-fb2').textContent = ''; ulDisegna(); $('ul-mangia').focus(); });
  $('ul-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = leggiFr($('ul-n').value, $('ul-d').value), fb = $('ul-fb2');
    if (!v) { fb.className = 'fz-fb no'; fb.textContent = 'Scrivi numeratore e denominatore con numeri interi.'; return; }
    if (v.n === 1023 && v.d === 1024) { fb.className = 'fz-fb si'; fb.innerHTML = 'Esatto: ' + F(1023, 1024) + '. Ne resta ' + F(1, 1024) + ', proprio l\'ultimo morso. Lo schema: dopo n morsi hai mangiato (2<sup>n</sup> − 1) / 2<sup>n</sup>.'; }
    else if (v.d === 1024) { fb.className = 'fz-fb no'; fb.textContent = 'Il denominatore è giusto (2 moltiplicato per sé stesso 10 volte). Il numeratore è sempre uno in meno del denominatore: guarda 3/4, 7/8, 15/16...'; }
    else { fb.className = 'fz-fb no'; fb.innerHTML = 'Non ancora. I denominatori raddoppiano a ogni morso: 2, 4, 8, 16, 32... Dopo 10 morsi quanto vale? E il numeratore è sempre uno in meno.'; }
  });
  ulDisegna();

  /* ════════ 2 · LA FRAZIONE DI UNA FRAZIONE (modello ad area) ════════ */
  var FD = { a: 1, b: 2, c: 1, d: 3 };
  function riempi(sel, da, a, val) { var h = ''; for (var i = da; i <= a; i++) h += '<option value="' + i + '"' + (i === val ? ' selected' : '') + '>' + i + '</option>'; sel.innerHTML = h; }
  function fdControlli() {
    riempi($('fd-b'), 2, 6, FD.b); riempi($('fd-d'), 2, 6, FD.d);
    riempi($('fd-a'), 1, FD.b, Math.min(FD.a, FD.b)); riempi($('fd-c'), 1, FD.d, Math.min(FD.c, FD.d));
  }
  function fdDisegna() {
    var a = FD.a, b = FD.b, c = FD.c, d = FD.d, W = 180, H = 120, cw = W / b, ch = H / d;
    var svg = '<svg viewBox="-2 -2 ' + (W + 4) + ' ' + (H + 4) + '" class="fc-svg ef-svg" role="img" aria-label="Teglia divisa in ' + b + ' colonne e ' + d + ' righe: i quadretti scuri sono ' + a * c + ' su ' + b * d + '">';
    for (var r = 0; r < d; r++) for (var q = 0; q < b; q++) {
      var cl = q < a && r < c ? 's' : q < a ? 'v' : r < c ? 'g' : 'n';
      svg += '<rect x="' + (q * cw).toFixed(2) + '" y="' + (r * ch).toFixed(2) + '" width="' + cw.toFixed(2) + '" height="' + ch.toFixed(2) + '" class="ef-c ef-' + cl + '"/>';
    }
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="fc-bordo"/></svg>';
    $('fd-fig').innerHTML = svg;
    var p = E.red(a * c, b * d), ridotta = p.n !== a * c;
    $('fd-lettura').innerHTML = '<p>I quadretti scuri sono <strong>' + a * c + '</strong> su <strong>' + b * d + '</strong>.</p>' +
      M('<mrow>' + mfr(a, b) + '<mo>×</mo>' + mfr(c, d) + '<mo>=</mo>' + mfr(a + '·' + c, b + '·' + d) + '<mo>=</mo>' + mfr(a * c, b * d) + (ridotta ? '<mo>=</mo>' + (p.d === 1 ? '<mn>' + p.n + '</mn>' : mfr(p.n, p.d)) : '') + '</mrow>', true) +
      '<p>Numeratore per numeratore, denominatore per denominatore: ecco perché la «frazione di una frazione» si calcola <strong>moltiplicando</strong>.' + (ridotta ? ' Poi si riduce ai minimi termini.' : '') + '</p>';
  }
  ['fd-a', 'fd-b', 'fd-c', 'fd-d'].forEach(function (id) {
    $(id).addEventListener('change', function () {
      FD.a = +$('fd-a').value; FD.b = +$('fd-b').value; FD.c = +$('fd-c').value; FD.d = +$('fd-d').value;
      if (id === 'fd-b' || id === 'fd-d') { FD.a = Math.min(FD.a, FD.b); FD.c = Math.min(FD.c, FD.d); fdControlli(); $(id).focus(); }
      fdDisegna();
    });
  });
  fdControlli(); fdDisegna();

  /* ════════ 3 · TRE STRADE ════════ */
  var PIATTI = [
    { cosa: 'una teglia di lasagne', un: 'porzioni', mang: 'la mensa ne mangia', avanza: 'Dopo il pranzo avanzano' },
    { cosa: 'una crostata', un: 'fette', mang: 'a merenda se ne mangiano', avanza: 'Dopo cena avanzano' },
    { cosa: 'una vaschetta di tiramisù', un: 'bicchierini', mang: 'in sala ne servono', avanza: 'Dopo il servizio avanzano' },
    { cosa: 'una teglia di pizza', un: 'tranci', mang: 'i ragazzi ne mangiano', avanza: 'A fine serata avanzano' }
  ];
  var ST = null;
  function stNuovo() {
    var b = rnd(2, 5), d = rnd(2, 5), a = rnd(1, b - 1), c = rnd(1, d - 1);
    ST = { p: pesca(PIATTI), a: a, b: b, c: c, d: d, N: b * d };
    ST.r = E.red(a * c, b * d);
    $('st-testo').innerHTML = ST.p.avanza + ' i ' + F(a, b) + ' di ' + ST.p.cosa + '. ' + ST.p.mang[0].toUpperCase() + ST.p.mang.slice(1) + ' i ' + F(c, d) + ' di quello che avanza. <strong>Che frazione dell\'intera ' + ST.p.cosa.replace(/^(una|un)\s/, '') + ' viene mangiata?</strong>';
    var N = ST.N, avanzo = ST.d * a;
    $('st-p1').innerHTML = '<p class="mm-p">Dividi la teglia in <strong>' + b + ' colonne</strong> e <strong>' + d + ' righe</strong>: ' + N + ' quadretti tutti uguali. I ' + F(a, b) + ' che avanzano corrispondono a <strong>' + a + (a === 1 ? ' colonna' : ' colonne') + '</strong> (in verde). Di quelle, ne mangi i ' + F(c, d) + ': <strong>' + c + (c === 1 ? ' riga' : ' righe') + '</strong> su ' + d + ' (in giallo). I quadretti scuri, dove le due cose si sovrappongono, sono quelli mangiati: <strong>' + a * c + ' su ' + N + '</strong>.</p><div class="ef-teglia">' + areaSvg(a, b, c, d) + '</div>';
    $('st-p2').innerHTML = '<p class="mm-p">Facciamo finta che ci siano <strong>' + N + ' ' + ST.p.un + '</strong> in tutto.</p><ol class="ef-ol"><li>Avanzano i ' + F(a, b) + ' di ' + N + ': ' + N + ' : ' + b + ' = ' + N / b + ', poi ' + N / b + ' · ' + a + ' = <strong>' + avanzo + ' ' + ST.p.un + '</strong>.</li><li>Ne mangiano i ' + F(c, d) + ' di ' + avanzo + ': ' + avanzo + ' : ' + d + ' = ' + avanzo / d + ', poi ' + avanzo / d + ' · ' + c + ' = <strong>' + avanzo / d * c + ' ' + ST.p.un + '</strong>.</li><li>Su ' + N + ' ' + ST.p.un + ' ne sono mangiati ' + avanzo / d * c + ': ' + M(mfr(a * c, N) + (ST.r.n !== a * c ? '<mo>=</mo>' + mfr(ST.r.n, ST.r.d) : '')) + '.</li></ol>';
    $('st-p3').innerHTML = '<p class="mm-p">«Di» tra due frazioni significa <strong>per</strong>. Si moltiplicano i numeratori tra loro e i denominatori tra loro, poi si riduce.</p>' + M('<mrow>' + mfr(a, b) + '<mo>×</mo>' + mfr(c, d) + '<mo>=</mo>' + mfr(a * c, b * d) + (ST.r.n !== a * c ? '<mo>=</mo>' + mfr(ST.r.n, ST.r.d) : '') + '</mrow>', true) + '<p class="mm-p">È la stessa cosa dei quadretti scuri e dei ' + avanzo / d * c + ' su ' + N + ' di prima, senza dover disegnare né scegliere un numero di porzioni.</p>';
    stTab(1, false);
    $('st-n').value = ''; $('st-d').value = ''; $('st-fb').textContent = ''; $('st-fb').className = 'fz-fb';
  }
  function areaSvg(a, b, c, d) {
    var W = 180, H = 120, cw = W / b, ch = H / d, s = '<svg viewBox="-2 -2 ' + (W + 4) + ' ' + (H + 4) + '" class="fc-svg ef-svg" role="img" aria-label="Teglia di ' + b + ' colonne e ' + d + ' righe: quadretti mangiati ' + a * c + ' su ' + b * d + '">';
    for (var r = 0; r < d; r++) for (var q = 0; q < b; q++) s += '<rect x="' + (q * cw).toFixed(2) + '" y="' + (r * ch).toFixed(2) + '" width="' + cw.toFixed(2) + '" height="' + ch.toFixed(2) + '" class="ef-c ef-' + (q < a && r < c ? 's' : q < a ? 'v' : r < c ? 'g' : 'n') + '"/>';
    return s + '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="fc-bordo"/></svg>';
  }
  function stTab(k, focus) {
    for (var i = 1; i <= 3; i++) {
      var t = $('st-t' + i), on = i === k;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      $('st-p' + i).hidden = !on;
    }
    if (focus) $('st-t' + k).focus();
  }
  $('st-tabs').addEventListener('click', function (ev) { var b = ev.target.closest('[role=tab]'); if (b) stTab(+b.id.slice(-1), false); });
  $('st-tabs').addEventListener('keydown', function (ev) {
    var cur = +document.activeElement.id.slice(-1) || 1, k = cur;
    if (ev.key === 'ArrowRight') k = cur % 3 + 1; else if (ev.key === 'ArrowLeft') k = (cur + 1) % 3 + 1; else if (ev.key === 'Home') k = 1; else if (ev.key === 'End') k = 3; else return;
    ev.preventDefault(); stTab(k, true);
  });
  $('st-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = leggiFr($('st-n').value, $('st-d').value), fb = $('st-fb');
    if (!v) { fb.className = 'fz-fb no'; fb.textContent = 'Scrivi numeratore e denominatore con numeri interi.'; return; }
    if (v.n === ST.r.n && v.d === ST.r.d) { fb.className = 'fz-fb si'; fb.innerHTML = 'Esatto! ' + fr(ST.r) + ' dell\'intera teglia. Tre strade, un solo risultato.'; }
    else if (v.n * ST.r.d === ST.r.n * v.d) { fb.className = 'fz-fb mezzo'; fb.textContent = 'Il valore è giusto, ma si può ridurre ancora ai minimi termini.'; }
    else { fb.className = 'fz-fb no'; fb.textContent = 'Non ancora. Prova una delle tre strade: la più sicura all\'inizio è la seconda, con i numeri veri.'; }
  });
  $('st-altro').addEventListener('click', function () { stNuovo(); $('st-t1').focus(); });
  stNuovo();

  /* ════════ 4 · LE PARENTESI COMANDANO ════════ */
  var PA = null;
  function paNuovo() {
    for (var i = 0; i < 2000; i++) {
      var f = function () { return pesca([E.N(1, 2), E.N(1, 3), E.N(1, 4), E.N(2, 3), E.N(3, 4), E.N(2, 1), E.N(3, 1), E.N(1, 5)]); };
      var a = f(), b = f(), c = f(), d = f(), N = E.N, O = E.O;
      var V = [
        O('+', O('+', a, O('×', b, c)), d),
        O('+', O('×', O('+', a, b), c), d),
        O('+', a, O('×', b, O('+', c, d))),
        O('×', O('+', a, b), O('+', c, d))
      ];
      var val = V.map(E.valore), ok = val.every(function (v) { return v.n > 0 && v.d <= 30 && v.n <= 60; });
      if (!ok) continue;
      var seen = {}, dup = false;
      val.forEach(function (v) { var k = v.n + '/' + v.d; if (seen[k]) dup = true; seen[k] = 1; });
      if (dup) continue;
      PA = { V: V, val: val, giusto: rnd(0, 3), ordine: [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; }) };
      break;
    }
    if (!PA) return;
    $('pa-obiettivo').innerHTML = fr(PA.val[PA.giusto]);
    $('pa-opz').innerHTML = PA.ordine.map(function (k) { return '<button type="button" class="fz-btn sec ef-opz" data-k="' + k + '" aria-label="' + esc(E.testo(PA.V[k])) + '">' + E.math(PA.V[k]) + '</button>'; }).join('');
    $('pa-fb').textContent = ''; $('pa-fb').className = 'fz-fb'; $('pa-risv').innerHTML = '';
  }
  $('pa-opz').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b || !PA) return;
    var k = +b.dataset.k, fb = $('pa-fb');
    if (k === PA.giusto) { fb.className = 'fz-fb si'; fb.innerHTML = 'Esatto! Con queste parentesi viene ' + fr(PA.val[k]) + '.'; }
    else { fb.className = 'fz-fb no'; fb.innerHTML = 'Con queste parentesi viene ' + fr(PA.val[k]) + ', non ' + fr(PA.val[PA.giusto]) + '. Riprova.'; }
    if (k === PA.giusto) {
      $('pa-risv').innerHTML = '<p class="mm-p">Ecco che cosa darebbero tutte le versioni: le parentesi cambiano davvero il risultato.</p><ul class="ef-lista">' + PA.ordine.map(function (j) { return '<li>' + E.math(PA.V[j]) + ' <span class="fz-m">=</span> ' + fr(PA.val[j]) + '</li>'; }).join('') + '</ul>';
    }
  });
  $('pa-altro').addEventListener('click', function () { paNuovo(); });
  paNuovo();

  /* ════════ 5 · IL METODO (tutor) ════════ */
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function defTutor(t) {
    var c = E.costruisci(t);
    return { testata: c.testata, passi: c.passi, fine: '<p class="tt-q">Il risultato è:</p><div class="tt-ris">' + E.mathFr(c.risultato) + '</div>' };
  }
  function avviaTutor(t, scorri) { TU.avvia(function () { return defTutor(t); }, scorri ? $('metodo') : null); }
  function nuovoTutor() { avviaTutor(E.genera(+$('tu-liv').value), false); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  $('tu-liv').addEventListener('change', nuovoTutor);
  nuovoTutor();

  /* ════════ 6 · ALLENATI ════════ */
  var EX = { t: null, ok: false, n: 0 }, exA = $('ex-area');
  function exDisegna(msg, cls) {
    var h = '<div class="tt-testata"><p class="tt-et">Calcola</p>' + E.math(EX.t, null, true) + '</div>';
    if (!EX.ok) {
      h += '<form class="mm-tf ef-exf" novalidate><div class="tt-fi"><label for="ex-n">Numeratore</label><input id="ex-n" type="text" inputmode="numeric" autocomplete="off"/><span class="fz-barra" aria-hidden="true"></span><label for="ex-d">Denominatore</label><input id="ex-d" type="text" inputmode="numeric" autocomplete="off"/></div><button type="submit" class="fz-btn">Controlla</button></form>';
    }
    h += '<p class="fz-fb ' + (cls || '') + '" id="ex-fb" role="status">' + (msg || '') + '</p><div class="fz-azioni">';
    if (!EX.ok) h += '<button type="button" class="fz-btn sec" id="ex-guida">Guidami passo passo</button><button type="button" class="fz-btn sec" id="ex-sol">Mostra il risultato</button>';
    h += '<button type="button" class="fz-btn' + (EX.ok ? '' : ' sec') + '" id="ex-nuovo">Un altro esercizio</button></div>';
    exA.innerHTML = h;
  }
  function exNuovo() { EX.t = E.genera(+$('ex-liv').value); EX.ok = false; exDisegna(); }
  exA.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var r = E.valore(EX.t), v = leggiFr($('ex-n').value, $('ex-d').value);
    if (!v) { exDisegna('Scrivi numeratore e denominatore con numeri interi (se il risultato è intero, lascia vuoto il denominatore).', 'no'); return; }
    var g = E.giudicaFr({ n: String(v.n), d: String(v.d) }, r, null);
    if (g.ok) { EX.ok = true; EX.n++; $('ex-conta').textContent = 'Esercizi risolti in questa visita: ' + EX.n; exDisegna('Esatto! ' + fr(r) + '. Bravo!', 'si'); exA.querySelector('#ex-nuovo').focus(); }
    else { var nn = $('ex-n').value, dd = $('ex-d').value; exDisegna(g.msg === 'Non ancora: ricontrolla il calcolo.' ? 'Non ancora. Se non sai da dove cominciare, premi «Guidami passo passo»: ti faccio fare una cosa alla volta.' : g.msg, 'no'); $('ex-n').value = nn; $('ex-d').value = dd; $('ex-n').focus(); }
  });
  exA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'ex-nuovo') { exNuovo(); exA.querySelector('input').focus(); }
    if (b.id === 'ex-sol') { exDisegna('Il risultato è ' + fr(E.valore(EX.t)) + '. Vuoi vedere come si arriva? Premi «Guidami passo passo».', 'mezzo'); }
    if (b.id === 'ex-guida') { $('tu-liv').value = $('ex-liv').value; avviaTutor(EX.t, true); }
  });
  $('ex-liv').addEventListener('change', exNuovo);
  exNuovo();

  /* ════════ 7 · MISSIONE ════════ */
  var RIP = [
    { d: 'Qual è l\'ordine giusto delle operazioni?', o: ['Da sinistra a destra, sempre', 'Parentesi, poi × e :, poi + e −', 'Prima somme e differenze, poi il resto'], g: 1, s: 'Prima le parentesi, poi moltiplicazioni e divisioni, infine somme e differenze.' },
    { d: 'Quanto fa la metà di 1/3?', o: ['1/6', '2/3', '1/5'], g: 0, s: '1/2 × 1/3 = 1/6.' },
    { d: '1/2 + 1/4 × 2 fa…', o: ['3/2', '1', '1/4'], g: 1, s: 'Prima 1/4 × 2 = 1/2, poi 1/2 + 1/2 = 1.' },
    { d: '(1/2 + 1/4) × 2 fa…', o: ['3/2', '1', '3/8'], g: 0, s: 'Prima la parentesi: 3/4, poi × 2 = 3/2.' },
    { d: 'Per dividere per una frazione si…', o: ['capovolge la prima e si moltiplica', 'capovolge la seconda e si moltiplica', 'sottraggono i numeratori'], g: 1, s: 'a/b : c/d = a/b × d/c.' },
    { d: 'La linea di frazione grande è…', o: ['una moltiplicazione', 'una divisione', 'una somma'], g: 1, s: 'Una linea di frazione è una divisione.' }
  ];
  var MISS = [
    { att: [1, 2], testo: 'In frigo avanzano i 3/4 di una torta. A merenda ne mangi i 2/3 di quel che avanza. Che frazione della torta intera hai mangiato?', hint: 'La frazione «di» una frazione si calcola con il prodotto: 3/4 × 2/3.', dopo: '3/4 × 2/3 = 6/12 = 1/2: hai mangiato metà della torta intera.' },
    { att: [1, 6], testo: 'Un barista usa 1/3 di un barattolo di sciroppo per un cocktail. Per decorare ne serve la metà di questa quantità. Che frazione del barattolo serve per decorare?', hint: 'La metà di 1/3 è 1/2 × 1/3.', dopo: '1/2 × 1/3 = 1/6 del barattolo.' },
    { att: [3, 2], testo: 'Per il pane servono 1/2 kg di farina e 1/4 kg di semola. Per fare due teglie si raddoppia tutto: (1/2 + 1/4) × 2. Quanti kg di farine in tutto?', hint: 'Prima la parentesi: 1/2 + 1/4 con denominatore comune 4.', dopo: '1/2 + 1/4 = 3/4 e 3/4 × 2 = 3/2 kg, cioè un chilo e mezzo.' },
    { att: [1, 1], testo: 'Tiramisù: 1/2 l di panna per la base e poi 2 strati da 1/4 l ciascuno. Quanti litri in tutto? L\'espressione è 1/2 + 2 × 1/4.', hint: 'La moltiplicazione viene prima della somma: calcola 2 × 1/4.', dopo: '2 × 1/4 = 1/2 e 1/2 + 1/2 = 1: un litro, non 3/2.' },
    { att: [4, 1], testo: 'Hai 1/2 l di olio e riempi bottigliette da 1/8 l. Quante bottigliette riempi? Scrivi l\'espressione come frazione a più piani: (1/2) diviso (1/8).', hint: 'La linea di frazione grande è una divisione: 1/2 : 1/8 = 1/2 × 8/1.', dopo: '1/2 : 1/8 = 1/2 × 8 = 4 bottigliette.' }
  ];
  var MI = { i: 0, fatto: false, errori: 0 }, miA = $('mi-area');
  function miDisegna(msg, cls) {
    var n = MISS.length;
    if (MI.i >= n) {
      if (window.PERCORSO) PERCORSO.segna(ID);
      if (window.RIPASSO) RIPASSO.registra({ titolo: 'Espressioni con le frazioni', icona: '🧮', materia: 'Matematica' }, 'mate-' + ID, location.pathname, RIP);
      miA.innerHTML = '<div class="tt-fine"><p class="tt-et">Missione compiuta</p><p class="tt-q">🎉 Servizio riuscito, e la tappa è fatta!</p><p class="tt-stat">' + (MI.errori === 0 ? 'Nessun errore: complimenti.' : 'Tentativi da rifare: ' + MI.errori + '. Va benissimo: si impara così.') + ' Domani, tra 3 giorni e tra una settimana trovi un ripasso lampo nella pagina del percorso.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-ricomincia">Rifai la missione</button><a class="fz-btn" href="aula/matematica/" style="text-decoration:none;display:inline-flex;align-items:center">Torna alle tappe</a></div></div>';
      return;
    }
    var m = MISS[MI.i], h = '<div class="tt-prog"><span>Problema ' + (MI.i + 1) + ' di ' + n + '</span><div class="tt-bar" role="img" aria-label="Fatti ' + MI.i + ' problemi su ' + n + '"><i style="width:' + Math.round(100 * MI.i / n) + '%"></i></div></div><p class="mm-pr">' + esc(m.testo) + '</p>';
    if (!MI.fatto) h += '<form class="mm-tf" id="mi-f" novalidate><div class="tt-fi"><label for="mi-n">Numeratore</label><input id="mi-n" type="text" inputmode="numeric" autocomplete="off"/><span class="fz-barra" aria-hidden="true"></span><label for="mi-d">Denominatore</label><input id="mi-d" type="text" inputmode="numeric" autocomplete="off"/></div><button type="submit" class="fz-btn">Controlla</button></form><p class="mm-p" style="margin-top:.6rem">Se il risultato è un numero intero, lascia vuoto il denominatore.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-aiuto">Suggerimento</button></div>';
    h += '<p class="fz-fb ' + (cls || '') + '" id="mi-fb" role="status" aria-live="polite">' + (msg || '') + '</p>';
    if (MI.fatto) h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="mi-avanti">' + (MI.i + 1 >= n ? 'Concludi' : 'Avanti') + '</button></div>';
    miA.innerHTML = h;
  }
  miA.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var m = MISS[MI.i], v = leggiFr($('mi-n').value, $('mi-d').value), f = $('mi-fb');
    if (!v) { f.className = 'fz-fb no'; f.textContent = 'Scrivi numeratore e denominatore con numeri interi.'; return; }
    if (v.n * m.att[1] === m.att[0] * v.d) {
      if (v.n === m.att[0] && v.d === m.att[1]) { MI.fatto = true; miDisegna('Esatto! ' + m.dopo, 'si'); miA.querySelector('#mi-avanti').focus(); return; }
      f.className = 'fz-fb mezzo'; f.textContent = 'Il valore è giusto, ma va ridotto ai minimi termini.'; return;
    }
    MI.errori++; f.className = 'fz-fb no'; f.textContent = 'Non ancora: rileggi il problema con calma e prova a ricavare l\'espressione.';
  });
  miA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'mi-ricomincia') { MI = { i: 0, fatto: false, errori: 0 }; miDisegna(); return; }
    if (b.id === 'mi-avanti') { MI.i++; MI.fatto = false; miDisegna(); var x = miA.querySelector('input,button'); if (x) x.focus(); return; }
    if (b.id === 'mi-aiuto') { var f = $('mi-fb'); f.className = 'fz-fb mezzo'; f.textContent = MISS[MI.i].hint; }
  });
  miDisegna();

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  window.ESPR_PAGINA.stato = { MISS: MISS, UL: UL, strada: function () { return ST.r; } };
})();
