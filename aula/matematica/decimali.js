/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «I numeri decimali»
   Il caso del burro, la bilancia delle cifre, lo scontrino che si arrotonda, lo zero che (non) conta,
   il microscopio che non finisce mai; poi tutor, allenamento, servizio e missione.
   Un decimale è {n, s}: n intero, s cifre dopo la virgola (3,25 → n=325, s=2).
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'decimali', URL = 'aula/matematica/decimali.html';
  var T = window.TB, $ = T.$, esc = T.esc, rnd = T.rnd, pesca = T.pesca, gcd = T.gcd, M = T.M, Q = T.Q;
  var P10 = [1, 10, 100, 1000, 10000, 100000, 1000000];
  var POS = ['unità', 'decimi', 'centesimi', 'millesimi', 'decimillesimi'];

  /* ── aritmetica sui decimali ── */
  function fmt(n, s) {
    var neg = n < 0, t = String(Math.abs(n));
    while (t.length <= s) t = '0' + t;
    var i = t.slice(0, t.length - s), d = t.slice(t.length - s);
    return (neg ? '−' : '') + i + (s ? ',' + d : '');
  }
  function F(x) { return fmt(x.n, x.s); }                       // x → testo con la virgola
  function scala(x, s) { return x.n * P10[s - x.s]; }
  function somma(a, b) { var s = Math.max(a.s, b.s); return { n: scala(a, s) + scala(b, s), s: s }; }
  function diff(a, b) { var s = Math.max(a.s, b.s); return { n: scala(a, s) - scala(b, s), s: s }; }
  function prod(a, b) { return { n: a.n * b.n, s: a.s + b.s }; }
  function tondo(x, to) { if (to >= x.s) return { n: x.n, s: x.s }; var f = P10[x.s - to]; return { n: Math.floor((x.n + f / 2) / f), s: to }; }
  function senzaZeri(x) { var n = x.n, s = x.s; while (s > 0 && n % 10 === 0) { n /= 10; s--; } return { n: n, s: s }; }
  function dec(s) { return T.leggiDec(s); }
  function str(x) { return fmt(x.n, x.s); }                    // stringa risposta
  function casuale(maxInt, s) { var n = rnd(P10[s] + 1, maxInt * P10[s]); if (s > 0 && n % 10 === 0) n++; return { n: n, s: s }; }
  function cifra(x, k) { /* cifra alla posizione k dopo la virgola (k>=1) */ var t = String(Math.abs(x.n)); while (t.length <= x.s) t = '0' + t; return +t.charAt(t.length - x.s + k - 1); }
  function leggi(x) { /* «3 unità e 25 centesimi» */
    var neg = x.n < 0, a = Math.abs(x.n), i = Math.floor(a / P10[x.s]), d = a % P10[x.s];
    if (!x.s || d === 0) return i + (i === 1 ? ' unità' : ' unità');
    return (i ? i + (i === 1 ? ' unità e ' : ' unità e ') : '') + d + ' ' + (d === 1 ? POS[x.s].replace(/i$/, 'o') : POS[x.s]);
  }
  var ROBE = [['farina', 'kg'], ['burro', 'kg'], ['zucchero', 'kg'], ['olio', 'L'], ['latte', 'L'], ['parmigiano', 'kg'], ['pomodori', 'kg'], ['panna', 'L']];
  var UM = function (u) { return u; };

  /* ════════ LIM ════════ */
  T.lim('mt-lim', 'main');

  /* ════════ IL CASO: il burro ════════ */
  (function () {
    var A = $('dc-caso');
    var D = [
      { a: { n: 5, s: 1 }, b: { n: 25, s: 2 }, t: 'Il cuoco chiede <strong>0,5 kg</strong> di burro. Il garzone ne porta <strong>0,25 kg</strong>, perché «25 è più di 5». Chi ha ragione: il garzone porta più burro o meno burro di quello chiesto?',
        o: [['meno', 'Meno burro del richiesto'], ['piu', 'Più burro del richiesto'], ['uguale', 'Lo stesso']], g: 'meno',
        s: '0,5 kg sono 5 decimi, cioè 500 g. 0,25 kg sono 25 centesimi, cioè 250 g. Il garzone ha portato <strong>metà</strong> del burro: i numeri dopo la virgola non si leggono come numeri interi.' },
      { a: { n: 3, s: 1 }, b: { n: 30, s: 2 }, t: 'Sul bancone leggi <strong>3,5</strong> e sul display della bilancia <strong>3,50</strong>. Quel «0» in più cambia il peso?',
        o: [['cambia', 'Sì, pesa di più'], ['uguale', 'No, è lo stesso peso'], ['meno', 'Sì, pesa di meno']], g: 'uguale',
        s: 'Uno zero <strong>in fondo</strong>, dopo la virgola, non cambia niente: 3,5 = 3,50 = 3,500. È come dire «3 euro e 50» o «3 euro e 5 decimi di euro». Lo zero che conta è quello nel <em>mezzo</em>: 3,05 è un altro numero.' },
      { a: { n: 19, s: 1 }, b: { n: 11, s: 1 }, t: 'Due vaschette di panna: una da <strong>1,9 L</strong> e una da <strong>1,10 L</strong>. Quale contiene più panna?',
        o: [['a', '1,9 L'], ['b', '1,10 L'], ['uguale', 'Hanno la stessa quantità']], g: 'a',
        s: '1,10 L = 1,1 L: un litro e un decimo. 1,9 L è un litro e nove decimi. Per non sbagliare, porta i due numeri allo stesso numero di cifre: 1,90 contro 1,10.' }
    ];
    var i = 0, fatto = 0;
    function barra(x, et) { var v = x.n / P10[x.s]; return '<div class="db-riga"><span class="db-et">' + et + '</span><div class="db-barra" role="img" aria-label="' + et + ': ' + F(x) + '"><i style="width:' + Math.min(100, v / (v > 2 ? 2.5 : 1) * 100) + '%"></i></div></div>'; }
    function disegna(ris) {
      if (i >= D.length) {
        A.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">Il numero dopo la virgola ha un «peso» che dipende dal posto.</p><p class="tt-stat">Hai indovinato ' + fatto + ' su ' + D.length + '. Qui sotto c\'è la bilancia che mostra perché: ogni cifra vale dieci volte meno di quella alla sua sinistra.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="dc-rifai">Rifai il caso</button></div></div>';
        return;
      }
      var d = D[i], h = '<div class="tt-prog"><span>Domanda ' + (i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<div class="db-barre">' + (i === 1 ? barra(d.a, '3,5') + barra(d.b.n === 30 ? { n: 350, s: 2 } : d.b, '3,50') : i === 0 ? barra(d.a, '0,5 kg') + barra(d.b, '0,25 kg') : barra(d.a, '1,9 L') + barra(d.b, '1,10 L')) + '</div><p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="dc-avanti">' + (i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      A.innerHTML = h;
      if (ris) A.querySelector('#dc-avanti').focus();
    }
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var ok = b.dataset.v === D[i].g; if (ok) fatto++; disegna({ ok: ok }); return; }
      if (b.id === 'dc-avanti') { i++; disegna(); var x = A.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'dc-rifai') { i = 0; fatto = 0; disegna(); }
    });
    disegna();
  })();

  /* ════════ LA BILANCIA DELLE CIFRE ════════ */
  (function () {
    var C = $('bl-cifre'), L = $('bl-lettura'), SF = $('bl-sfida');
    var NOMI = ['decine', 'unità', 'decimi', 'centesimi', 'millesimi'], V = [0, 3, 2, 5, 0], TG = null, fb = '';
    function valore() { var n = 0; V.forEach(function (c) { n = n * 10 + c; }); return { n: n, s: 3 }; }
    function disegna() {
      C.innerHTML = NOMI.map(function (nm, k) {
        return (k === 2 ? '<span class="bl-virg" aria-hidden="true">,</span>' : '') + '<div class="bl-c"><button type="button" class="bl-su" data-k="' + k + '" data-d="1" aria-label="Aumenta le ' + nm + '">▲</button><output class="bl-d" aria-label="' + nm + '">' + V[k] + '</output><button type="button" class="bl-giu" data-k="' + k + '" data-d="-1" aria-label="Diminuisci le ' + nm + '">▼</button><span class="bl-n" aria-hidden="true">' + nm + '</span></div>';
      }).join('');
      var x = senzaZeri(valore()), pezzi = [];
      [[0, 10], [1, 1], [2, 0.1], [3, 0.01], [4, 0.001]].forEach(function (p) { if (V[p[0]]) pezzi.push(V[p[0]] + ' ' + NOMI[p[0]]); });
      var tot = valore();
      var mm = '<mrow>' + [[0, '10'], [1, '1'], [2, '10'], [3, '100'], [4, '1000']].filter(function (p) { return V[p[0]]; }).map(function (p, j) { return (j ? '<mo>+</mo>' : '') + (p[0] < 2 ? '<mn>' + V[p[0]] * (p[0] === 0 ? 10 : 1) + '</mn>' : '<mfrac><mn>' + V[p[0]] + '</mn><mn>' + p[1] + '</mn></mfrac>'); }).join('') + '</mrow>';
      L.innerHTML = '<p class="bl-num" aria-live="polite">Il numero è <strong>' + F(x) + '</strong></p><p class="mm-p">' + (pezzi.length ? pezzi.join(' + ') : 'zero') + '</p>' + (pezzi.length ? M(mm + '<mo>=</mo><mn>' + F(x) + '</mn>') : '') + '<p class="mm-p">Si legge: <em>' + leggi(x) + '</em>.' + (tot.n && x.s < 3 ? ' (Gli zeri in fondo non servono: ' + fmt(tot.n, 3) + ' vale come ' + F(x) + '.)' : '') + '</p>';
      SF.innerHTML = (TG ? '<p class="mm-p"><strong>Sfida:</strong> componi <strong>' + F(TG) + '</strong> ' + (TG.disp || '') + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="bl-ver">Verifica</button><button type="button" class="fz-btn sec" id="bl-azz">Smetti la sfida</button></div>' : '<div class="fz-azioni"><button type="button" class="fz-btn sec" id="bl-sf">Mettimi alla prova: componi un numero</button></div>') + '<p class="fz-fb ' + (fb && fb.ok ? 'si' : 'no') + '" id="bl-fb" role="status">' + (fb ? fb.t : '') + '</p>';
    }
    C.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      var k = +b.dataset.k; V[k] = (V[k] + +b.dataset.d + 10) % 10; fb = ''; disegna();
      var n = C.querySelector('[data-k="' + k + '"][data-d="' + b.dataset.d + '"]'); if (n) n.focus();
    });
    SF.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'bl-sf') { var t = pesca([{ n: 407, s: 2 }, { n: 1205, s: 3 }, { n: 63, s: 2 }, { n: 5, s: 3 }, { n: 2090, s: 3 }, { n: 1008, s: 3 }, { n: 350, s: 2 }]); TG = t; TG.disp = '(' + leggi(t) + ')'; V = [0, 0, 0, 0, 0]; fb = ''; disegna(); return; }
      if (b.id === 'bl-azz') { TG = null; fb = ''; disegna(); return; }
      if (b.id === 'bl-ver') { var v = valore(); fb = T.ugualiDec(v, TG) ? { ok: true, t: 'Esatto! Hai composto ' + F(senzaZeri(v)) + '. Fai attenzione agli zeri nel mezzo: sono quelli che contano.' } : { ok: false, t: 'Non ancora: ora hai ' + F(senzaZeri(v)) + '. Controlla quali posti sono occupati e quali restano a zero.' }; if (fb.ok) TG = null; disegna(); }
    });
    disegna();
  })();

  /* ════════ LO SCONTRINO CHE SI ARROTONDA ════════ */
  (function () {
    var DOM = $('sc-dom'), SVG = $('sc-svg'), BTN = $('sc-btn'), FB = $('sc-fb');
    var S = { x: null, to: 2, ris: false };
    function nuovo() {
      var to = S.to; S.x = casuale(30, to + 1); S.x.n = S.x.n - (S.x.n % 10) + pesca([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]); S.ris = false; FB.textContent = ''; FB.className = 'fz-fb'; disegna();
    }
    function disegna() {
      var x = S.x, to = S.to, f = P10[x.s - to], lo = Math.floor(x.n / f) * f, hi = lo + f, mid = lo + f / 2, nomi = ['all\'euro', 'ai decimi', 'ai centesimi'];
      var X = function (v) { return 40 + (v - lo) / f * 520; };
      DOM.innerHTML = 'Il totale dello scontrino viene <strong>' + F(x) + ' €</strong>, ma si paga arrotondando <strong>' + nomi[to] + '</strong>. Quale dei due numeri vicini è più vicino al totale?';
      var s = '<svg viewBox="0 0 600 150" role="img" aria-label="Retta dei numeri tra ' + fmt(lo, x.s) + ' e ' + fmt(hi, x.s) + ', con il totale ' + F(x) + ' e il punto di mezzo ' + fmt(mid, x.s) + '"><line x1="30" y1="80" x2="570" y2="80" stroke="currentColor" stroke-width="3"/>';
      [[lo, 'A'], [hi, 'B']].forEach(function (p) { s += '<line x1="' + X(p[0]) + '" y1="66" x2="' + X(p[0]) + '" y2="94" stroke="currentColor" stroke-width="3"/><text x="' + X(p[0]) + '" y="120" text-anchor="middle" font-size="19" font-weight="700" fill="currentColor">' + fmt(tondoVal(p[0], x.s, to), to) + '</text>'; });
      s += '<line x1="' + X(mid) + '" y1="70" x2="' + X(mid) + '" y2="90" stroke="#999" stroke-width="2" stroke-dasharray="3 3"/><text x="' + X(mid) + '" y="58" text-anchor="middle" font-size="14" fill="#666">metà</text>';
      s += '<circle cx="' + X(x.n) + '" cy="80" r="9" fill="#B5472B"/><text x="' + Math.min(540, Math.max(70, X(x.n))) + '" y="38" text-anchor="middle" font-size="20" font-weight="700" fill="#B5472B">' + F(x) + '</text></svg>';
      SVG.innerHTML = s;
      var A = fmt(tondoVal(lo, x.s, to), to), B = fmt(tondoVal(hi, x.s, to), to);
      BTN.innerHTML = S.ris ? '<button type="button" class="fz-btn" id="sc-altro">Un altro scontrino</button>' : '<button type="button" class="fz-btn sec" data-r="A">Più vicino a ' + A + '</button><button type="button" class="fz-btn sec" data-r="B">Più vicino a ' + B + '</button>';
    }
    function tondoVal(v, s, to) { return v / P10[s - to]; }
    BTN.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'sc-altro') { nuovo(); BTN.querySelector('button').focus(); return; }
      var x = S.x, to = S.to, r = tondo(x, to), vero = r.n * P10[x.s - to] >= Math.floor(x.n / P10[x.s - to]) * P10[x.s - to] + P10[x.s - to] ? 'B' : 'A';
      var f = P10[x.s - to], lo = Math.floor(x.n / f) * f, ultima = x.n - lo, giusto = ultima * 2 >= f ? 'B' : 'A';
      var ok = b.dataset.r === giusto; S.ris = true; disegna();
      FB.className = 'fz-fb ' + (ok ? 'si' : 'no');
      FB.innerHTML = (ok ? 'Esatto! ' : 'Non proprio. ') + 'La cifra da guardare è la prima dopo quella a cui arrotondi: <strong>' + (to === 0 ? cifra(x, 1) : cifra(x, to + 1)) + '</strong>. Se è <strong>5 o più</strong> si sale, se è meno di 5 si resta. Si paga: <strong>' + fmt(r.n, to) + ' €</strong>.';
      BTN.querySelector('button').focus();
    });
    $('sc-pos').addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      S.to = +b.dataset.p; Array.prototype.forEach.call(this.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); }); nuovo();
    });
    nuovo();
  })();

  /* ════════ LO ZERO CHE NON CONTA ════════ */
  (function () {
    var FG = $('zr-fig'), FB = $('zr-fb'), S = { t: '3,5', k: 0 };
    var BASE = { n: 35, s: 1 };
    function barra(txt, x) { var v = x.n / P10[x.s]; return '<div class="db-riga"><span class="db-et">' + txt + '</span><div class="db-barra" role="img" aria-label="' + txt + ' vale ' + F(x) + '"><i style="width:' + (v / 5 * 100) + '%"></i></div></div>'; }
    function mostra(x, nota) { FG.innerHTML = barra(F(BASE), BASE) + barra(fmt(x.n, x.s), x); FB.className = 'fz-fb ' + (T.ugualiDec(x, BASE) ? 'si' : 'no'); FB.innerHTML = nota; }
    $('zr-btn').addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      var k = b.dataset.z;
      if (k === 'fine') { S.k++; var x = { n: BASE.n * P10[S.k], s: 1 + S.k }; mostra(x, 'Uno zero in fondo: 3,5 diventa <strong>' + fmt(x.n, x.s) + '</strong>. Le due barre sono uguali: il valore non è cambiato. (Si aggiunge uno zero a ogni «taglio» più fine: decimi → centesimi → millesimi.)'); }
      if (k === 'mezzo') { var y = { n: 305, s: 2 }; S.k = 0; mostra(y, 'Uno zero <strong>subito dopo la virgola</strong>: 3,5 diventa <strong>3,05</strong>. Le barre ora sono diverse: 3,05 è molto più piccolo (3 unità e 5 <em>centesimi</em>, non 5 decimi).'); }
      if (k === 'sx') { S.k = 0; mostra({ n: 35, s: 1 }, 'Uno zero all\'inizio, <strong>03,5</strong>, non cambia nulla: gli zeri a sinistra dell\'intero, come in fondo a destra della virgola, sono «muti».'); }
      if (k === 'azz') { S.k = 0; FG.innerHTML = barra('3,5', BASE); FB.className = 'fz-fb'; FB.textContent = ''; }
    });
    FG.innerHTML = barra('3,5', BASE);
  })();

  /* ════════ IL MICROSCOPIO ════════ */
  (function () {
    var OUT = $('mc-out'), BT = $('mc-btn');
    var S = { lo: { n: 1, s: 1 }, hi: { n: 2, s: 1 }, giri: 0, trovati: [] };
    function ripristina() { S = { lo: { n: 1, s: 1 }, hi: { n: 2, s: 1 }, giri: 0, trovati: [] }; disegna(); }
    function disegna() {
      var fine = S.lo.s >= 9;
      OUT.innerHTML = '<p class="mm-p">Siamo tra <strong>' + F(S.lo) + '</strong> e <strong>' + F(S.hi) + '</strong>. Ingrandimenti fatti: <strong>' + S.giri + '</strong>.</p>' + (S.trovati.length ? '<p class="mm-p">Numeri trovati in mezzo: ' + S.trovati.map(function (x) { return '<span class="db-pill">' + F(x) + '</span>'; }).join(' ') + '</p>' : '') + (fine ? '<p class="fz-fb si" role="status">Lo schermo non ha più spazio, ma i numeri in mezzo non sono finiti: <strong>tra due decimali ce n\'è sempre un altro</strong>. Per questo non esiste «il decimale successivo» di 0,1.</p>' : '');
      BT.innerHTML = fine ? '<button type="button" class="fz-btn" data-m="r">Ricomincia</button>' : '<button type="button" class="fz-btn sec" data-m="s">Tieni la parte a sinistra</button><button type="button" class="fz-btn sec" data-m="d">Tieni la parte a destra</button>';
    }
    BT.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.m === 'r') { ripristina(); BT.querySelector('button').focus(); return; }
      var lo = { n: S.lo.n * 10, s: S.lo.s + 1 }, hi = { n: S.hi.n * 10, s: S.hi.s + 1 }, mid = { n: (lo.n + hi.n) / 2, s: lo.s };
      S.trovati.push(mid); if (S.trovati.length > 8) S.trovati.shift();
      if (b.dataset.m === 's') { S.lo = lo; S.hi = mid; } else { S.lo = mid; S.hi = hi; }
      S.giri++; disegna(); var x = BT.querySelector('button'); if (x) x.focus();
    });
    disegna();
  })();

  /* ════════ DOMANDE E TUTOR (stessa logica) ════════ */
  function grandezze(liv) { return liv === 1 ? { max: 20, s: [1, 2] } : liv === 2 ? { max: 60, s: [1, 2] } : { max: 200, s: [2, 3] }; }
  function sinistra(o) { return '<span class="vh">' + o + '</span>'; }
  var AIUTI = {
    confronta: ['Porta i due numeri allo <strong>stesso numero di cifre decimali</strong>, aggiungendo zeri in fondo.', 'Poi confronta come se fossero numeri interi senza virgola.'],
    arrotonda: ['Individua la cifra a cui arrotondi, poi guarda la cifra <strong>subito dopo</strong>.', 'Se è 0, 1, 2, 3, 4 la cifra resta; se è 5, 6, 7, 8, 9 sale di uno.'],
    somma: ['Scrivi in colonna: <strong>virgola sotto virgola</strong>, e aggiungi gli zeri che mancano.', 'Somma come se la virgola non ci fosse, poi rimettila nello stesso posto.'],
    per10: ['Moltiplicare per 10, 100, 1000: la virgola si sposta a <strong>destra</strong> di 1, 2, 3 posti. Dividere: a sinistra.', 'Se mancano le cifre, aggiungi gli zeri.'],
    prodotto: ['Togli la virgola e moltiplica i due numeri come interi.', 'Poi rimetti la virgola: tante cifre decimali quante ne hanno i due fattori <strong>insieme</strong>.'],
    frdec: ['Cerca il numero per cui moltiplicare il denominatore per ottenere 10, 100 o 1000.', 'Moltiplica anche il numeratore per lo stesso numero.'],
    decfr: ['Ogni cifra decimale è un «dieci» al denominatore: 1 cifra → 10, 2 cifre → 100.', 'Poi riduci la frazione ai minimi termini.']
  };
  function numIntero(att, msgErr, aiuti, rivela, spiega) {
    return { tipo: 'num', atteso: att, verifica: function (v) { var x = T.intero(v); if (x === null) return { ok: false, msg: msgErr || 'Scrivi un numero intero.' }; return { ok: x === att }; }, aiuti: aiuti, rivela: function () { return rivela || String(att); }, spiega: spiega || '' };
  }
  function numDec(att, aiuti, spiega, rivela) {
    return { tipo: 'num', testo_libero: true, verifica: function (v) {
      var x = dec(v); if (!x) return { ok: false, msg: 'Scrivi un numero con la virgola, per esempio 6,25.' };
      if (T.ugualiDec(x, att)) return { ok: true };
      return { ok: false };
    }, aiuti: aiuti, rivela: function () { return F(senzaZeri(att)); }, spiega: spiega || '' };
  }
  function vInt(att, aiuti, rivela, spiega) { return numIntero(att, null, aiuti, rivela, spiega); }

  var Gen = {};
  /* confronto */
  Gen.confronta = function (liv) {
    var a, b, esc2 = Math.random();
    if (esc2 < 0.35) { var u = rnd(0, liv === 1 ? 3 : 9); a = { n: rnd(1, 9), s: 1 }; b = { n: a.n * 10 + rnd(1, 9) * (Math.random() < 0.5 ? 1 : -1) * 0 + rnd(1, 9), s: 2 }; if (b.n % 10 === 0) b.n++; a.n += u * 10; b.n += u * 100; }
    else if (esc2 < 0.55) { a = { n: rnd(1, 9), s: 1 }; b = { n: a.n * 10, s: 2 }; }
    else { var s1 = rnd(1, liv + 1), s2 = rnd(1, liv + 1); a = casuale(liv === 1 ? 10 : 50, s1); b = casuale(liv === 1 ? 10 : 50, s2); if (T.ugualiDec(a, b)) b.n += 1; }
    var cmp = scala(a, Math.max(a.s, b.s)) - scala(b, Math.max(a.s, b.s)), g = cmp > 0 ? 'a' : cmp < 0 ? 'b' : 'uguali', s = Math.max(a.s, b.s);
    var A = fmt(scala(a, s), s), B = fmt(scala(b, s), s);
    var q = Q.scelta(g, [['a', F(a)], ['b', F(b)], ['uguali', 'Sono uguali']], { html: '<p class="tt-q">Quale numero è più grande: <strong>' + F(a) + '</strong> o <strong>' + F(b) + '</strong>?</p>', aiuti: AIUTI.confronta, intro: '' });
    q.verifica = function (v) { return { ok: v === g, msg: v === g ? '' : 'Porta i due numeri allo stesso numero di decimali: ' + A + ' e ' + B + '.' }; };
    q.rivela = function () { return g === 'uguali' ? 'sono uguali' : '<strong>' + F(g === 'a' ? a : b) + '</strong>'; };
    var def = function () { return { testata: '<p class="tt-q">Quale numero è più grande: <strong>' + F(a) + '</strong> o <strong>' + F(b) + '</strong>?</p>', passi: [
      Object.assign(numIntero(s, null, ['Guarda quale dei due numeri ha più cifre dopo la virgola: pareggia l\'altro.'], String(s), ''), { titolo: 'Pareggia le cifre', testo: 'Quante cifre decimali servono perché i due numeri ne abbiano lo stesso numero?', spiega: 'Scriviamo <strong>' + A + '</strong> e <strong>' + B + '</strong>: aggiungere zeri in fondo non cambia il valore.', lav: M('<mn>' + F(a) + '</mn><mo>=</mo><mn>' + A + '</mn>') + ' &nbsp; ' + M('<mn>' + F(b) + '</mn><mo>=</mo><mn>' + B + '</mn>') }),
      Object.assign(Q.scelta(g, [['a', A], ['b', B], ['uguali', 'Sono uguali']], { aiuti: ['Ora togli la virgola con la mente: confronta i due numeri interi ' + (scala(a, s)) + ' e ' + (scala(b, s)) + '.'] }), { titolo: 'Confronta', testo: 'Ora che hanno le stesse cifre, quale numero è più grande?', verifica: function (v) { return { ok: v === g }; }, spiega: g === 'uguali' ? 'Sono lo stesso numero scritto in due modi.' : 'Perciò è più grande <strong>' + F(g === 'a' ? a : b) + '</strong>.', rivela: function () { return g === 'uguali' ? 'sono uguali' : (g === 'a' ? A : B); } })
    ], fine: '<p class="tt-q">' + (g === 'uguali' ? F(a) + ' = ' + F(b) : F(g === 'a' ? a : b) + ' è il più grande') + '</p><p class="mm-p">Il trucco: stesse cifre decimali, poi si confronta come con i numeri interi.</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  };
  /* arrotondamento */
  Gen.arrotonda = function (liv) {
    var to = liv === 1 ? pesca([0, 1]) : liv === 2 ? pesca([1, 2]) : pesca([0, 1, 2]);
    var x = casuale(liv === 1 ? 20 : 90, to + 1); x.n = x.n - (x.n % 10) + pesca([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
    var r = tondo(x, to), c = cifra(x, to + 1), nomi = ['all\'unità', 'ai decimi', 'ai centesimi'], sale = c >= 5;
    var R = str(senzaZeri(r)), Rfull = fmt(r.n, to);
    var testo = '<p class="tt-q">Arrotonda <strong>' + F(x) + '</strong> ' + nomi[to] + '.</p>';
    var q = Q.dec(Rfull, { html: testo, aiuti: AIUTI.arrotonda, formato: 'Scrivi il numero con la virgola.' });
    q.rivela = function () { return Rfull; };
    var def = function () { return { testata: testo, passi: [
      Object.assign(vInt(c, ['La cifra da guardare è quella <strong>subito dopo</strong> ' + (to === 0 ? 'la virgola' : 'quella a cui arrotondi') + '.'], null, 'La cifra che decide è <strong>' + c + '</strong>.'), { titolo: 'La cifra che decide', testo: 'Quale è la cifra subito dopo la posizione a cui devi arrotondare (' + nomi[to].replace('all\'', 'le ').replace('ai ', 'i ') + ')?', lav: M('<mn>' + F(x) + '</mn>') }),
      Object.assign(Q.scelta(sale ? 's' : 'r', [['s', 'Sale di uno'], ['r', 'Resta com\'è']], { aiuti: ['Con 0, 1, 2, 3, 4 resta. Con 5, 6, 7, 8, 9 sale.'] }), { titolo: 'Sale o resta?', testo: 'La cifra è ' + c + '. L\'ultima cifra che tieni sale o resta?', verifica: function (v) { return { ok: v === (sale ? 's' : 'r') }; }, spiega: c + (sale ? ' è almeno 5: si sale.' : ' è meno di 5: si resta.'), rivela: function () { return sale ? 'sale' : 'resta'; } }),
      Object.assign(numDec(r, ['Taglia tutte le cifre dopo la posizione scelta e, se sale, aggiungi 1 all\'ultima cifra rimasta.'], 'Il numero arrotondato è <strong>' + Rfull + '</strong>.'), { titolo: 'Scrivi il risultato', testo: 'Scrivi ' + F(x) + ' arrotondato ' + nomi[to] + '.', lav: M('<mn>' + F(x) + '</mn><mo>≈</mo><mn>' + Rfull + '</mn>') })
    ], fine: '<p class="tt-q">' + F(x) + ' ≈ ' + Rfull + '</p><p class="mm-p">Si guarda <strong>una sola cifra</strong>, la prima che si butta via: 5 o più, sale.</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  };
  /* somma e differenza in colonna, con problemino */
  function problemaSD(op, liv) {
    var g = grandezze(liv), r = pesca(ROBE), s1 = pesca(g.s), s2 = pesca(g.s);
    var a = casuale(g.max, s1), b = casuale(Math.max(2, Math.floor(g.max / 2)), s2);
    if (op === '-') { if (scala(a, Math.max(a.s, b.s)) <= scala(b, Math.max(a.s, b.s))) { var t = a; a = b; b = t; } if (T.ugualiDec(a, b)) a.n += P10[a.s]; }
    var ris = op === '+' ? somma(a, b) : diff(a, b), s = Math.max(a.s, b.s);
    var testo = op === '+' ? 'Hai in dispensa <strong>' + F(a) + ' ' + r[1] + '</strong> di ' + r[0] + ' e ne compri altri <strong>' + F(b) + ' ' + r[1] + '</strong>. Quanti ' + r[1] + ' hai in tutto?' : 'Avevi <strong>' + F(a) + ' ' + r[1] + '</strong> di ' + r[0] + ' e ne usi <strong>' + F(b) + ' ' + r[1] + '</strong> per il servizio. Quanti ' + r[1] + ' ne restano?';
    var A = fmt(scala(a, s), s), B = fmt(scala(b, s), s), R = str(senzaZeri(ris));
    var html = '<p class="tt-q">' + testo + '</p>';
    var q = Q.dec(fmt(ris.n, ris.s), { html: html, aiuti: AIUTI.somma, formato: 'Scrivi il risultato con la virgola, senza l\'unità.' });
    q.rivela = function () { return R + ' ' + r[1]; };
    var sa = scala(a, s), sb = scala(b, s);
    var def = function () { return { testata: html, passi: [
      Object.assign(vInt(s, ['Guarda il numero con più cifre decimali: pareggia l\'altro con gli zeri.'], null, 'Scriviamo <strong>' + A + '</strong> e <strong>' + B + '</strong>, in colonna con la virgola sotto la virgola.'), { titolo: 'Allinea le virgole', testo: 'Quante cifre decimali devi avere in colonna perché i due numeri ne abbiano lo stesso numero?', lav: M('<mtable columnalign="right"><mtr><mtd><mn>' + A + '</mn></mtd></mtr><mtr><mtd><mo>' + (op === '+' ? '+' : '−') + '</mo><mn>' + B + '</mn></mtd></mtr></mtable>') }),
      Object.assign(vInt(op === '+' ? sa + sb : sa - sb, ['Togli la virgola: calcola ' + sa + (op === '+' ? ' + ' : ' − ') + sb + '.'], null, 'Senza la virgola: ' + sa + (op === '+' ? ' + ' : ' − ') + sb + ' = <strong>' + (op === '+' ? sa + sb : sa - sb) + '</strong>.'), { titolo: 'Calcola senza la virgola', testo: 'Per ora dimentica la virgola: quanto fa ' + sa + (op === '+' ? ' + ' : ' − ') + sb + '?' }),
      Object.assign(numDec(ris, ['Rimetti la virgola con ' + s + ' cifre decimali.'], 'Con ' + s + ' cifre decimali: <strong>' + fmt(ris.n, ris.s) + '</strong>.'), { titolo: 'Rimetti la virgola', testo: 'Il risultato ha ' + s + ' cifre decimali. Scrivilo con la virgola.' })
    ], fine: '<p class="tt-q">' + R + ' ' + r[1] + '</p><p class="mm-p">Virgola sotto virgola, zeri per pareggiare, e la virgola resta al suo posto.</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  }
  Gen.somma = function (liv) { return problemaSD('+', liv); };
  Gen.diff = function (liv) { return problemaSD('-', liv); };
  /* per 10, 100, 1000 */
  Gen.per10 = function (liv) {
    var k = pesca(liv === 1 ? [1, 2] : [1, 2, 3]), molt = Math.random() < 0.6, x = casuale(liv === 1 ? 9 : 90, pesca(liv === 3 ? [1, 2, 3] : [1, 2]));
    var ris = molt ? { n: x.n * 1, s: x.s - k } : { n: x.n, s: x.s + k };
    if (ris.s < 0) { ris = { n: x.n * P10[-ris.s], s: 0 }; }
    var P = P10[k], R = fmt(ris.n, ris.s);
    var ctx = molt ? 'Una porzione di sale pesa <strong>' + F(x) + ' g</strong>. Quanti grammi servono per <strong>' + P + '</strong> porzioni?' : 'Una confezione da <strong>' + F(x) + ' kg</strong> viene divisa in <strong>' + P + '</strong> parti uguali. Quanto pesa ogni parte (in kg)?';
    var html = '<p class="tt-q">' + ctx + '</p>';
    var q = Q.dec(R, { html: html, aiuti: AIUTI.per10, formato: 'Scrivi il risultato con la virgola.' });
    q.rivela = function () { return str(senzaZeri(ris)); };
    var def = function () { return { testata: html, passi: [
      Object.assign(Q.scelta(molt ? 'd' : 's', [['d', 'A destra'], ['s', 'A sinistra']], { aiuti: ['Moltiplicare rende il numero più grande: la virgola va verso destra. Dividere lo rimpicciolisce: verso sinistra.'] }), { titolo: 'In che verso?', testo: 'Devi ' + (molt ? 'moltiplicare' : 'dividere') + ' per ' + P + '. La virgola si sposta a destra o a sinistra?', verifica: function (v) { return { ok: v === (molt ? 'd' : 's') }; }, spiega: molt ? 'Moltiplicare: il numero cresce, la virgola va a destra.' : 'Dividere: il numero diminuisce, la virgola va a sinistra.', rivela: function () { return molt ? 'a destra' : 'a sinistra'; } }),
      Object.assign(vInt(k, ['Conta gli zeri di ' + P + '.'], null, P + ' ha ' + k + ' ' + (k === 1 ? 'zero' : 'zeri') + ': la virgola si sposta di <strong>' + k + '</strong> post' + (k === 1 ? 'o' : 'i') + '.'), { titolo: 'Di quanti posti?', testo: 'Di quanti posti si sposta la virgola?' }),
      Object.assign(numDec(ris, ['Se mancano cifre, aggiungi gli zeri necessari.'], 'Risultato: <strong>' + R + '</strong>.'), { titolo: 'Scrivi il risultato', testo: 'Scrivi il numero con la virgola nella nuova posizione.' })
    ], fine: '<p class="tt-q">' + F(x) + (molt ? ' × ' : ' : ') + P + ' = ' + R + '</p><p class="mm-p">Per 10, 100, 1000 non si calcola: si <strong>sposta la virgola</strong>.</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  };
  /* moltiplicazione tra decimali */
  Gen.prodotto = function (liv) {
    var a = casuale(liv === 1 ? 9 : 30, 1), b = Math.random() < 0.5 ? { n: rnd(2, 9), s: 1 } : { n: rnd(2, liv === 3 ? 25 : 12), s: 0 };
    if (liv === 3 && Math.random() < 0.4) b = { n: rnd(11, 29), s: 1 };
    var ris = prod(a, b), r = pesca(ROBE);
    var ctx = 'Il ' + r[0] + ' costa <strong>' + F(a) + ' €</strong> al ' + r[1] + '. Quanto costano <strong>' + F(b) + ' ' + r[1] + '</strong>?';
    var html = '<p class="tt-q">' + ctx + '</p>', R = fmt(ris.n, ris.s);
    var q = Q.dec(R, { html: html, aiuti: AIUTI.prodotto, formato: 'Scrivi il risultato con la virgola.' });
    q.rivela = function () { return str(senzaZeri(ris)) + ' €'; };
    var def = function () { return { testata: html, passi: [
      Object.assign(vInt(a.n * b.n, ['Togli la virgola: ' + a.n + ' × ' + b.n + '.'], null, a.n + ' × ' + b.n + ' = <strong>' + (a.n * b.n) + '</strong>.'), { titolo: 'Senza la virgola', testo: 'Dimentica la virgola: quanto fa ' + a.n + ' × ' + b.n + '?' }),
      Object.assign(vInt(a.s + b.s, ['Conta le cifre decimali di ' + F(a) + ' e di ' + F(b) + ' e sommale.'], null, F(a) + ' ha ' + a.s + ', ' + F(b) + ' ha ' + b.s + ': in tutto <strong>' + (a.s + b.s) + '</strong>.'), { titolo: 'Quante cifre decimali?', testo: 'Quante cifre decimali hanno i due fattori in tutto?' }),
      Object.assign(numDec(ris, ['Parti da ' + (a.n * b.n) + ' e metti la virgola in modo che ci siano ' + (a.s + b.s) + ' cifre decimali.'], 'Risultato: <strong>' + R + '</strong>.'), { titolo: 'Rimetti la virgola', testo: 'Scrivi il prodotto con ' + (a.s + b.s) + ' cifre decimali.' })
    ], fine: '<p class="tt-q">' + F(a) + ' × ' + F(b) + ' = ' + R + '</p><p class="mm-p">Si moltiplica come tra interi; la virgola si rimette contando le cifre decimali dei due fattori.</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  };
  /* frazione → decimale */
  Gen.frdec = function (liv) {
    var den = pesca(liv === 1 ? [2, 4, 5, 10] : liv === 2 ? [4, 5, 8, 20, 25] : [8, 16, 20, 25, 40, 50]), num = rnd(1, den - 1), g = gcd(num, den); num = num; var d = den;
    var k = 1; while (P10[k] % d !== 0 && k < 6) k++;
    var fatt = P10[k] / d, ris = { n: num * fatt, s: k };
    var html = '<p class="tt-q">Scrivi come numero decimale la frazione ' + M('<mfrac><mn>' + num + '</mn><mn>' + d + '</mn></mfrac>') + '.</p>';
    var q = Q.dec(fmt(ris.n, ris.s), { html: html, aiuti: AIUTI.frdec, formato: 'Scrivi il numero con la virgola.' });
    q.rivela = function () { return str(senzaZeri(ris)); };
    var def = function () { return { testata: html, passi: [
      Object.assign(vInt(fatt, ['Per che numero devi moltiplicare ' + d + ' per arrivare a ' + P10[k] + '?'], null, d + ' × ' + fatt + ' = ' + P10[k] + '.'), { titolo: 'Denominatore 10, 100, 1000', testo: 'Per quale numero moltiplichi ' + d + ' per ottenere ' + P10[k] + '?', lav: M('<mfrac><mn>' + num + '</mn><mn>' + d + '</mn></mfrac>') }),
      Object.assign(vInt(num * fatt, ['Moltiplica anche il numeratore ' + num + ' per ' + fatt + '.'], null, num + ' × ' + fatt + ' = <strong>' + (num * fatt) + '</strong>.'), { titolo: 'Il nuovo numeratore', testo: 'Moltiplica per ' + fatt + ' anche il numeratore. Quanto viene?', lav: M('<mfrac><mn>' + num + '</mn><mn>' + d + '</mn></mfrac><mo>=</mo><mfrac><mn>' + (num * fatt) + '</mn><mn>' + P10[k] + '</mn></mfrac>') }),
      Object.assign(numDec(ris, ['Una frazione con denominatore ' + P10[k] + ' si scrive con ' + k + ' cifre decimali.'], 'Risultato: <strong>' + fmt(ris.n, ris.s) + '</strong>.'), { titolo: 'Scrivi il decimale', testo: (num * fatt) + '/' + P10[k] + ' scritto con la virgola?' })
    ], fine: '<p class="tt-q">' + num + '/' + d + ' = ' + fmt(ris.n, ris.s) + '</p><p class="mm-p">Quando il denominatore si può portare a 10, 100 o 1000 la frazione diventa un decimale <strong>finito</strong>. Con 3, 6, 7… non ci si riesce: lo vedrai nella tappa dei decimali periodici.</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  };
  /* decimale → frazione */
  Gen.decfr = function (liv) {
    var x = casuale(liv === 1 ? 2 : 3, liv === 3 ? 2 : 1); if (x.n % 10 === 0) x.n++;
    var den = P10[x.s], g = gcd(x.n, den), nn = x.n / g, dd = den / g;
    var html = '<p class="tt-q">Scrivi <strong>' + F(x) + '</strong> come frazione ridotta ai minimi termini.</p>';
    var q = Q.frac(x.n, den, { html: html, aiuti: AIUTI.decfr });
    q.rivela = function () { return F2(nn, dd); };
    var def = function () { return { testata: html, passi: [
      Object.assign(vInt(x.s, ['Conta le cifre dopo la virgola in ' + F(x) + '.'], null, F(x) + ' ha <strong>' + x.s + '</strong> cifr' + (x.s === 1 ? 'a' : 'e') + ' decimal' + (x.s === 1 ? 'e' : 'i') + '.'), { titolo: 'Conta i decimali', testo: 'Quante cifre ci sono dopo la virgola?' }),
      Object.assign(vInt(den, ['1 cifra → 10, 2 cifre → 100, 3 cifre → 1000.'], null, 'Il denominatore è <strong>' + den + '</strong>.'), { titolo: 'Il denominatore', testo: 'Con ' + x.s + ' cifr' + (x.s === 1 ? 'a' : 'e') + ' decimal' + (x.s === 1 ? 'e' : 'i') + ', quale denominatore usi (10, 100, 1000)?', lav: M('<mn>' + F(x) + '</mn><mo>=</mo><mfrac><mn>' + x.n + '</mn><mn>' + den + '</mn></mfrac>') }),
      Object.assign({ tipo: 'frac', verifica: function (v) { var y = T.leggiFr(v.n, v.d); if (!y) return { ok: false, msg: 'Scrivi numeri interi.' }; if (y.n === nn && y.d === dd) return { ok: true }; if (y.n * dd === nn * y.d) return { ok: false, msg: 'Il valore è giusto, ma riducila ai minimi termini.' }; return { ok: false }; }, aiuti: ['Dividi numeratore e denominatore per il loro MCD (' + g + ').'], rivela: function () { return F2(nn, dd); }, spiega: 'Dividendo per ' + g + ' si ottiene <strong>' + nn + '/' + dd + '</strong>.' }, { titolo: 'Riduci', testo: x.n + '/' + den + ' ridotta ai minimi termini?' })
    ], fine: '<p class="tt-q">' + F(x) + ' = ' + nn + '/' + dd + '</p><p class="mm-p">Un decimale finito è sempre una frazione con 10, 100, 1000… al denominatore (poi si riduce).</p>' }; };
    q.guida = function () { TU.avvia(def, $('metodo')); }; q.def = def; return q;
  };
  function F2(n, d) { return d === 1 ? String(n) : n + '/' + d; }
  /* lettura */
  Gen.leggi = function (liv) {
    var g = liv === 1 ? 2 : liv === 2 ? 3 : 4, u = rnd(0, liv === 1 ? 9 : 60), x = { n: 0, s: Math.min(g - 1, 3) }; x.n = u * P10[x.s] + rnd(1, P10[x.s] - 1);
    if (Math.random() < 0.5) { x.s = Math.min(g - 1, 3); x.n = u * P10[x.s] + rnd(1, 9); } // zeri nel mezzo
    var q = Q.dec(fmt(x.n, x.s), { html: '<p class="tt-q">Scrivi con le cifre: <strong>' + leggi(x) + '</strong>.</p>', aiuti: ['I <strong>decimi</strong> sono 1 cifra dopo la virgola, i <strong>centesimi</strong> 2, i <strong>millesimi</strong> 3.', 'Se mancano cifre, riempi con zeri subito dopo la virgola: 7 centesimi → 0,07.'], formato: 'Scrivi il numero con la virgola.' });
    return q;
  };
  /* ordinare */
  Gen.ordina = function (liv) {
    var lista = [], g = grandezze(liv);
    while (lista.length < 3) { var x = Math.random() < 0.3 && lista.length ? { n: lista[0].n * 10 + rnd(1, 9), s: lista[0].s + 1 } : casuale(liv === 1 ? 5 : 9, pesca(g.s)); if (!lista.some(function (y) { return T.ugualiDec(x, y); })) lista.push(x); }
    var s = Math.max.apply(null, lista.map(function (x) { return x.s; })), min = lista.slice().sort(function (a, b) { return scala(a, s) - scala(b, s); })[0];
    var q = Q.scelta(String(lista.indexOf(min)), lista.map(function (x, i) { return [String(i), F(x)]; }), { html: '<p class="tt-q">Quale di questi tre numeri è il <strong>più piccolo</strong>?</p>', aiuti: AIUTI.confronta });
    q.verifica = function (v) { return { ok: v === String(lista.indexOf(min)), msg: 'Porta tutti allo stesso numero di decimali: ' + lista.map(function (x) { return fmt(scala(x, s), s); }).join(' · ') }; };
    q.rivela = function () { return F(min); };
    return q;
  };
  var NOMI_TIPI = ['leggi', 'confronta', 'ordina', 'arrotonda', 'somma', 'diff', 'per10', 'prodotto', 'frdec', 'decfr'];

  /* ════════ TUTOR ════════ */
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() {
    var t = $('tu-tipo').value, q = Gen[t]($('tu-liv').value | 0 || 2);
    if (!q.def) { t = 'confronta'; q = Gen[t](2); }
    TU.avvia(q.def);
  }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  /* ════════ ALLENATI ════════ */
  T.allenati({
    area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var q = Gen[t](+$('ex-liv').value); q.et = 'Esercizio'; return q; },
    guida: function (q) { q.guida(); }
  });

  /* ════════ IL SERVIZIO ════════ */
  var COM = [
    { t: 'leggi', l: 1 }, { t: 'confronta', l: 2 }, { t: 'somma', l: 2 }, { t: 'arrotonda', l: 2 }, { t: 'per10', l: 3 }, { t: 'prodotto', l: 3 }
  ];
  var CTX = ['Il tavolo 3 ordina:', 'Dalla cucina chiedono:', 'Il cassiere deve controllare:', 'Lo scontrino del tavolo 7:', 'Il magazziniere segnala:', 'L\'ordine speciale dello chef:'];
  T.servizio({
    area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 75,
    genera: function (liv, i) { var c = COM[i], q = Gen[c.t](c.l); q.intro = CTX[i]; q.soluzione = function () { return q.def ? '<div id="sv-guida"></div><p class="mm-p">Il metodo, passo passo: premi <em>Guidami</em> nella sezione «Il metodo»;</p>' + '<p class="mm-p">risposta: <strong>' + q.rivela() + '</strong></p>' : '<p class="mm-p">Risposta: <strong>' + q.rivela() + '</strong></p>'; }; return q; }
  });

  /* ════════ MISSIONE ════════ */
  function m(intro, att, hint, dopo, tipo, opz) { var q = tipo === 'frac' ? Q.frac(att[0], att[1], { hint: hint, dopo: dopo }) : Q.dec(att, { hint: hint, dopo: dopo, formato: 'Scrivi il risultato con la virgola.' }); q.intro = intro; return q; }
  var MI = [
    m('Il cassiere batte lo scontrino: <strong>2,50 € + 3,75 € + 1,20 €</strong>. Quanto devi pagare?', '7,45', 'Somma in colonna, virgola sotto virgola.', 'Il totale è 7,45 €.'),
    m('Hai 10 € e paghi <strong>6,85 €</strong>. Quanto ti danno di resto?', '3,15', 'Calcola 10,00 − 6,85: pareggia gli zeri.', 'Il resto è 3,15 €.'),
    m('Una ricetta per 1 persona usa <strong>0,15 kg</strong> di farina. Per <strong>10 persone</strong> quanta farina in kg?', '1,5', 'Per 10 la virgola si sposta di un posto a destra.', 'Servono 1,5 kg di farina.'),
    m('Il prosciutto costa <strong>18,5 €</strong> al kg e ne prendi <strong>0,4 kg</strong>. Quanto costa? (Arrotonda ai centesimi se serve.)', '7,4', 'Fai 185 × 4 e rimetti la virgola: 2 cifre decimali in tutto.', 'Costa 7,40 €.'),
    m('Scrivi come frazione ridotta il peso <strong>0,75 kg</strong> di burro (frazione di kg).', [3, 4], 'Con 2 cifre decimali il denominatore è 100: 75/100, poi riduci.', '0,75 = 3/4: i tre quarti di un chilo.', 'frac')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'I numeri decimali', icona: '⚖️', items: MI, rip: [
    { d: 'Scrivi 3 unità e 7 centesimi con le cifre.', r: '3,07', s: 'I centesimi occupano 2 posti: 7 centesimi è 0,07, quindi lo zero tiene il posto.' },
    { d: 'Quale è più grande: 0,5 o 0,25?', r: '0,5', s: '0,5 = 0,50 = 50 centesimi, più di 25 centesimi.' },
    { d: 'Arrotonda 4,678 ai centesimi.', r: '4,68', s: 'La cifra da guardare è 8: sale, il 7 diventa 8.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.DECIMALI = { Gen: Gen, fmt: fmt, tondo: tondo, somma: somma, diff: diff, prod: prod, NOMI_TIPI: NOMI_TIPI };
})();
