/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa 1: numeri primi, MCD e mcm
   Domanda lampo, i due timer (mcm), le mattonelle (MCD), la colonna delle
   divisioni, il metodo passo passo, l'allenamento, la missione e la scheda.
   Tutto avviene nel dispositivo: nessun invio. In localStorage restano solo
   il segno «tappa fatta» (percorso.js) e le domande del ripasso (ripasso.js).
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var ID = 'mcd-mcm';

  /* ── aritmetica ── */
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function gcdL(l) { return l.reduce(gcd); }
  function lcmL(l) { return l.reduce(lcm); }
  function primo(n) { if (n < 2) return false; for (var p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; }
  function minDiv(n) { for (var p = 2; p * p <= n; p++) if (n % p === 0) return p; return n; }
  function fattori(n) { /* → {2:2, 3:1, 5:1} */
    var f = {};
    for (var p = 2; p * p <= n; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; }
    if (n > 1) f[n] = (f[n] || 0) + 1;
    return f;
  }
  function primiDi(f) { return Object.keys(f).map(Number).sort(function (a, b) { return a - b; }); }
  function fattHtml(f) {
    var k = primiDi(f);
    if (!k.length) return '1';
    return k.map(function (p) { return f[p] > 1 ? p + '<sup>' + f[p] + '</sup>' : String(p); }).join('·');
  }
  function fH(n) { return fattHtml(fattori(n)); }
  function prodotto(f) { return primiDi(f).reduce(function (s, p) { return s * Math.pow(p, f[p]); }, 1); }
  function fattMcd(l) {
    var F = l.map(fattori), out = {};
    primiDi(F[0]).forEach(function (p) {
      var e = Math.min.apply(null, F.map(function (f) { return f[p] || 0; }));
      if (e) out[p] = e;
    });
    return out;
  }
  function fattMcm(l) {
    var out = {};
    l.map(fattori).forEach(function (f) { primiDi(f).forEach(function (p) { out[p] = Math.max(out[p] || 0, f[p]); }); });
    return out;
  }
  function elenco(l) { return l.length === 2 ? l[0] + ' e ' + l[1] : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1]; }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function intero(s) { s = String(s == null ? '' : s).replace(/[\s.']/g, ''); return /^\d+$/.test(s) ? parseInt(s, 10) : null; }

  /* lettura di una scomposizione scritta dallo studente: 2^2*3*5, 2²·3·5, 2x2x3x5, 2 2 3 5 */
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  function leggiFatt(s) {
    s = String(s || '').trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUP[c]; }).join(''); });
    s = s.replace(/\*\*/g, '^').replace(/\s*\^\s*/g, '^').replace(/[·*x×X•.,;\s]+/g, '*').replace(/^\*+|\*+$/g, '');
    if (!s) return null;
    var out = [], ok = true;
    s.split('*').forEach(function (t) {
      var m = /^(\d+)(?:\^(\d+))?$/.exec(t);
      if (!m) { ok = false; return; }
      out.push([parseInt(m[1], 10), m[2] ? parseInt(m[2], 10) : 1]);
    });
    return ok && out.length ? out : null;
  }
  function controllaFatt(s, n) {
    var l = leggiFatt(s);
    if (!l) return { ok: false, msg: 'Non riesco a leggerla. Scrivi per esempio 2^2*3*5 oppure 2·2·3·5.' };
    var p = l.reduce(function (x, t) { return x * Math.pow(t[0], t[1]); }, 1);
    if (l.some(function (t) { return t[0] === 1; })) return { ok: false, msg: 'L\'1 non è primo e nella scomposizione non si scrive.' };
    if (p !== n) return { ok: false, msg: 'Il prodotto di quello che hai scritto fa ' + p + ', non ' + n + '.' };
    var np = l.filter(function (t) { return !primo(t[0]); })[0];
    if (np) return { ok: false, msg: 'Il prodotto è giusto, ma ' + np[0] + ' non è primo: scomponilo ancora (' + np[0] + ' = ' + fH(np[0]) + ').', html: true };
    return { ok: true };
  }

  /* ── generatori ── */
  var LIM = { 1: [8, 60, 7], 2: [12, 200, 13], 3: [24, 1000, 17] };
  function composto(liv) {
    var L = LIM[liv];
    for (var i = 0; i < 500; i++) {
      var n = rnd(L[0], L[1]);
      if (primo(n)) continue;
      var f = fattori(n);
      if (primiDi(f).pop() > L[2]) continue;
      if (liv > 1 && primiDi(f).length < 2) continue;
      return n;
    }
    return 60;
  }
  function gruppo(liv, quanti, perMcd) {
    var maxM = { 1: 150, 2: 1500, 3: 4000 }[liv];
    for (var i = 0; i < 800; i++) {
      var l = [];
      for (var k = 0; k < quanti; k++) l.push(composto(liv === 3 && quanti === 3 ? 2 : liv));
      if (l.some(function (x, j) { return l.indexOf(x) !== j; })) continue;
      if (l.some(function (x) { return l.some(function (y) { return y !== x && y % x === 0; }); }) && Math.random() < .8) continue;
      var g = gcdL(l), m = lcmL(l);
      if (perMcd && g < 2) continue;
      if (m > maxM) continue;
      return l.sort(function (a, b) { return a - b; });
    }
    return [12, 18];
  }
  function quanti(liv) { return liv === 3 && Math.random() < .4 ? 3 : 2; }

  var PROB = {
    mcd: [
      function (a, b) { return { t: 'In sala hai ' + a + ' grissini e ' + b + ' crostini. Vuoi preparare dei cestini tutti uguali (stesso numero di grissini e stesso numero di crostini in ognuno), usando tutto e facendone il più possibile. Quanti cestini prepari?', u: 'cestini' }; },
      function (a, b) { return { t: 'Due strisce di pasta sfoglia sono lunghe ' + a + ' cm e ' + b + ' cm. Vanno tagliate in pezzi tutti uguali, i più lunghi possibile, senza scarti. Quanto è lungo ogni pezzo?', u: 'cm' }; },
      function (a, b) { return { t: 'Per il buffet ci sono ' + a + ' bignè al cioccolato e ' + b + ' alla crema. Vuoi vassoi tutti uguali, il maggior numero possibile, senza che avanzi nessun bignè. Quanti vassoi?', u: 'vassoi' }; },
      function (a, b) { return { t: 'Il pavimento del magazzino misura ' + a + ' dm per ' + b + ' dm. Vuoi coprirlo con mattonelle quadrate tutte uguali, le più grandi possibile, senza tagliarne nessuna. Quanto misura il lato di ogni mattonella?', u: 'dm' }; }
    ],
    mcm: [
      function (a, b) { return { t: 'In cucina un timer suona ogni ' + a + ' minuti e un altro ogni ' + b + ' minuti. Partono insieme. Dopo quanti minuti suonano di nuovo insieme?', u: 'minuti' }; },
      function (a, b) { return { t: 'Il fornaio passa ogni ' + a + ' giorni, il fruttivendolo ogni ' + b + ' giorni. Oggi sono passati tutti e due. Fra quanti giorni li vedrai di nuovo lo stesso giorno?', u: 'giorni' }; },
      function (a, b) { return { t: 'I tovaglioli si comprano in pacchi da ' + a + ', i sottopiatti in confezioni da ' + b + '. Vuoi lo stesso numero di tovaglioli e di sottopiatti, senza avanzi, comprando il meno possibile. Quanti pezzi per tipo?', u: 'pezzi' }; },
      function (a, b, c) { return c ? { t: 'Tre camerieri fanno il giro dei tavoli: Luca ogni ' + a + ' minuti, Sara ogni ' + b + ', Ahmed ogni ' + c + '. Partono insieme dal bancone. Dopo quanti minuti si ritrovano tutti e tre al bancone?', u: 'minuti' } : { t: 'Luca fa il giro dei tavoli ogni ' + a + ' minuti, Sara ogni ' + b + '. Partono insieme dal bancone. Dopo quanti minuti si ritrovano al bancone?', u: 'minuti' }; }
    ]
  };
  function problema(liv) {
    var serve = Math.random() < .5 ? 'mcd' : 'mcm', nums;
    if (serve === 'mcd') {
      var g = rnd(2, liv === 1 ? 6 : 12), m, n;
      do { m = rnd(2, liv === 1 ? 5 : liv === 2 ? 8 : 12); n = rnd(2, liv === 1 ? 5 : liv === 2 ? 8 : 12); } while (m === n || gcd(m, n) !== 1);
      nums = [g * Math.min(m, n), g * Math.max(m, n)];
      var T = pesca(PROB.mcd)(nums[0], nums[1]);
      return { tipo: 'problema', serve: 'mcd', nums: nums, testo: T.t, u: T.u, ris: gcdL(nums) };
    }
    var tre = liv === 3 && Math.random() < .4, r = { 1: [2, 10], 2: [4, 20], 3: [6, 30] }[liv];
    for (var i = 0; i < 300; i++) {
      nums = [rnd(r[0], r[1]), rnd(r[0], r[1])];
      if (tre) nums.push(rnd(r[0], r[1]));
      if (nums.some(function (x, j) { return nums.indexOf(x) !== j; })) continue;
      if (gcdL(nums) === 1 && Math.random() < .7) continue;
      if (lcmL(nums) > 360) continue;
      break;
    }
    nums.sort(function (a, b) { return a - b; });
    var fn = tre ? PROB.mcm[3] : pesca(PROB.mcm), T2 = fn(nums[0], nums[1], nums[2]);
    return { tipo: 'problema', serve: 'mcm', nums: nums, testo: T2.t, u: T2.u, ris: lcmL(nums) };
  }
  function esercizio(tipo, liv) {
    if (tipo === 'misto') tipo = pesca(['primo', 'scomponi', 'mcd', 'mcm', 'problema', 'mcd', 'mcm', 'problema']);
    if (tipo === 'primo') {
      var top = { 1: 50, 2: 150, 3: 400 }[liv], vuole = Math.random() < .5, n;
      /* i non primi sono «insidiosi»: dispari e non multipli di 5 (21, 51, 91…) */
      do { n = rnd(11, top); } while (vuole ? !primo(n) : (primo(n) || n % 2 === 0 || n % 5 === 0));
      return { tipo: 'primo', n: n };
    }
    if (tipo === 'scomponi') return { tipo: 'scomponi', n: composto(liv) };
    if (tipo === 'mcd') return { tipo: 'mcd', nums: gruppo(liv, quanti(liv), true) };
    if (tipo === 'mcm') return { tipo: 'mcm', nums: gruppo(liv, quanti(liv), false) };
    return problema(liv);
  }

  /* la soluzione scritta, per qualunque esercizio */
  function soluzione(q) {
    if (q.tipo === 'primo') {
      if (primo(q.n)) return '<p><strong>' + q.n + ' è primo.</strong> Basta provare i primi fino a ' + Math.floor(Math.sqrt(q.n)) + ' (perché ' + Math.floor(Math.sqrt(q.n)) + '·' + Math.floor(Math.sqrt(q.n)) + ' arriva quasi a ' + q.n + '): nessuno lo divide.</p>';
      var d = minDiv(q.n);
      return '<p><strong>' + q.n + ' non è primo:</strong> ' + q.n + ' = ' + d + ' · ' + (q.n / d) + '. Scomposto: ' + q.n + ' = ' + fH(q.n) + '.</p>';
    }
    if (q.tipo === 'scomponi') return '<p>' + q.n + ' = <strong>' + fH(q.n) + '</strong></p>' + colonna(q.n);
    var l = q.nums, g = fattMcd(l), m = fattMcm(l);
    var h = '<ul class="mm-sol">' + l.map(function (x) { return '<li>' + x + ' = ' + fH(x) + '</li>'; }).join('') + '</ul>';
    var hg = '<p>MCD: solo i fattori comuni, con l\'esponente più piccolo → ' + (primiDi(g).length ? fattHtml(g) + ' = ' : 'nessun fattore comune, quindi ') + '<strong>' + gcdL(l) + '</strong></p>';
    var hm = '<p>mcm: tutti i fattori, con l\'esponente più grande → ' + fattHtml(m) + ' = <strong>' + lcmL(l) + '</strong></p>';
    if (q.tipo === 'mcd') return h + hg;
    if (q.tipo === 'mcm') return h + hm;
    return '<p>Qui serve il <strong>' + (q.serve === 'mcd' ? 'MCD' : 'mcm') + '</strong>: ' + (q.serve === 'mcd' ? 'si divide in parti uguali, le più grandi possibile, senza avanzi.' : 'qualcosa si ripete e si cerca la prima volta in cui coincide.') + '</p>' + h + (q.serve === 'mcd' ? hg : hm) + '<p>Risposta: <strong>' + q.ris + ' ' + esc(q.u) + '</strong>.</p>';
  }
  function colonna(n) {
    var h = '<table class="mm-col mm-col-s" aria-label="Colonna delle divisioni di ' + n + '">';
    while (n > 1) { var p = minDiv(n); h += '<tr><td>' + n + '</td><td>' + p + '</td></tr>'; n /= p; }
    return h + '<tr><td>1</td><td></td></tr></table>';
  }

  /* il giudizio su una risposta, senza toccare la pagina: {ok, msg, cls}
     primo: 'si'/'no' · scomponi: testo · mcd, mcm, problema: numero (testo) */
  function giudica(q, v) {
    if (q.tipo === 'primo') {
      var p = primo(q.n), si = v === 'si';
      if (si === p) return { ok: true, msg: p ? q.n + ' si divide solo per 1 e per sé stesso.' : q.n + ' = ' + minDiv(q.n) + ' · ' + q.n / minDiv(q.n) + '.' };
      return { ok: false, cls: 'no', msg: p ? 'Invece sì: prova a dividerlo per 2, 3, 5, 7… nessuno lo divide.' : 'Invece no: ' + q.n + ' si divide per ' + minDiv(q.n) + '.' };
    }
    if (q.tipo === 'scomponi') {
      var r = controllaFatt(v, q.n);
      return r.ok ? { ok: true, msg: q.n + ' = ' + fH(q.n) + '.' } : { ok: false, cls: 'no', msg: r.msg };
    }
    var x = intero(v), G = gcdL(q.nums), Mm = lcmL(q.nums), vuoleMcd = q.tipo === 'mcd' || q.serve === 'mcd', att = vuoleMcd ? G : Mm;
    if (x === null) return { ok: false, cls: 'no', msg: 'Scrivi un numero intero.' };
    if (x === att) return { ok: true, msg: q.tipo === 'problema' && q.u ? att + ' ' + esc(q.u) + '.' : '' };
    if (vuoleMcd && x === Mm) return { ok: false, cls: 'no', msg: 'Hai calcolato il mcm: qui serve il MCD (solo fattori comuni, esponente più piccolo).' };
    if (!vuoleMcd && x === G) return { ok: false, cls: 'no', msg: 'Hai calcolato il MCD: qui serve il mcm (tutti i fattori, esponente più grande).' };
    if (!vuoleMcd && x === q.nums.reduce(function (a, b) { return a * b; }, 1)) return { ok: false, cls: 'mezzo', msg: x + ' è un multiplo comune (è il prodotto), ma non il minimo.' };
    if (vuoleMcd && x && q.nums.every(function (n) { return n % x === 0; })) return { ok: false, cls: 'mezzo', msg: x + ' divide tutti i numeri, ma non è il più grande divisore comune.' };
    if (!vuoleMcd && x && q.nums.every(function (n) { return x % n === 0; })) return { ok: false, cls: 'mezzo', msg: x + ' è un multiplo comune, ma non il minimo.' };
    return { ok: false, cls: 'no', msg: '' };
  }
  function giudicaServe(q, scelta) {
    if (scelta === q.serve) return { ok: true };
    return { ok: false, cls: 'no', msg: q.serve === 'mcd' ? 'Pensa: qui si divide qualcosa in parti uguali, le più grandi possibile, senza avanzi. Il risultato sarà più piccolo dei numeri dati.' : 'Pensa: qui qualcosa si ripete e cerchi la prima volta che coincide. Il risultato sarà più grande dei numeri dati.' };
  }
  var API = { gcdL: gcdL, lcmL: lcmL, primo: primo, fattori: fattori, fH: fH, leggiFatt: leggiFatt, controllaFatt: controllaFatt, esercizio: esercizio, costruisci: costruisci, soluzione: soluzione, giudica: giudica, giudicaServe: giudicaServe, elenco: elenco, domanda: domandaHtml };
  window.MCD_MCM = API;
  /* fuori dalla pagina della tappa (per esempio negli esercizi della docente) serve solo il motore */
  if (!$('tm-griglia')) return;

  /* ════════ LIM ════════ */
  $('mt-lim').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('main').classList.toggle('fz-grande', on);
  });

  /* ════════ DOMANDA LAMPO ════════ */
  var LAMPO = [
    { d: 'Due timer partono insieme: uno suona ogni 6 minuti, l\'altro ogni 8. Dopo quanti minuti suonano di nuovo insieme?', o: ['14 minuti', '24 minuti', '48 minuti'], g: 1, s: 'Il primo suona a 6, 12, 18, <strong>24</strong>…; il secondo a 8, 16, <strong>24</strong>… Il 48 è un momento in cui suonano insieme, ma non il primo. 14 è solo la somma. Il 24 è il <strong>minimo comune multiplo</strong> di 6 e 8.' },
    { d: 'Hai 12 cornetti e 18 bomboloni. Vuoi vassoi tutti uguali, il maggior numero possibile, senza avanzi. Quanti vassoi?', o: ['3', '6', '36'], g: 1, s: 'Con 6 vassoi metti 2 cornetti e 3 bomboloni in ognuno. Con 3 vassoi va bene, ma se ne possono fare di più; 36 vassoi non si possono riempire. Il 6 è il <strong>massimo comune divisore</strong> di 12 e 18.' },
    { d: 'Qual è l\'unico numero primo pari?', o: ['1', '2', '4'], g: 1, s: 'Il <strong>2</strong>: si divide solo per 1 e per sé stesso. Ogni altro numero pari si divide anche per 2, quindi non è primo. L\'1 non è primo: ha un solo divisore.' }
  ];
  var lampoI = 0;
  function lampo() {
    var q = LAMPO[lampoI];
    $('mm-lampo').innerHTML = '<p class="tt-q">' + q.d + '</p><div class="tt-sc" role="group" aria-label="Risposte">' + q.o.map(function (o, i) { return '<button type="button" class="fz-btn sec" data-l="' + i + '">' + o + '</button>'; }).join('') + '</div><div id="lp-esito"></div>';
  }
  $('mm-lampo').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'lp-altra') { lampoI = (lampoI + 1) % LAMPO.length; lampo(); return; }
    if (b.dataset.l === undefined) return;
    var q = LAMPO[lampoI], ok = +b.dataset.l === q.g;
    Array.prototype.forEach.call($('mm-lampo').querySelectorAll('[data-l]'), function (x) { x.disabled = true; if (+x.dataset.l === q.g) x.classList.add('giusta'); });
    if (!ok) b.classList.add('sbagliata');
    $('lp-esito').innerHTML = '<p class="fz-fb ' + (ok ? 'si' : 'mezzo') + '">' + (ok ? 'Esatto!' : 'Non è questa, ma è un buon inizio.') + '</p><p class="tt-aiuto">' + q.s + '</p><div class="fz-azioni"><a class="fz-btn" href="aula/matematica/mcd-mcm.html#scopri" style="text-decoration:none;display:inline-flex;align-items:center">Scopri perché ↓</a><button type="button" class="fz-btn sec" id="lp-altra">Un\'altra domanda</button></div>';
  });
  lampo();

  /* ════════ I DUE TIMER (mcm) ════════ */
  var TM = { a: 6, b: 8, fatto: false };
  ['tm-a', 'tm-b'].forEach(function (id) {
    var h = '';
    for (var i = 2; i <= 12; i++) h += '<option value="' + i + '">' + i + ' minuti</option>';
    $(id).innerHTML = h;
  });
  $('tm-a').value = '6'; $('tm-b').value = '8';
  function timer() {
    TM.a = +$('tm-a').value; TM.b = +$('tm-b').value; TM.fatto = false;
    var m = lcm(TM.a, TM.b), N = Math.min(160, Math.max(40, Math.ceil(m * 2.1 / 10) * 10)), h = '';
    for (var i = 1; i <= N; i++) {
      var A = i % TM.a === 0, B = i % TM.b === 0;
      h += '<button type="button" class="mm-cella' + (A ? ' a' : '') + (B ? ' b' : '') + '" data-m="' + i + '" aria-label="Minuto ' + i + (A ? ', suona il primo' : '') + (B ? ', suona il secondo' : '') + '">' + i + '<span aria-hidden="true">' + (A ? '<i class="mm-pa"></i>' : '') + (B ? '<i class="mm-pb"></i>' : '') + '</span></button>';
    }
    $('tm-griglia').innerHTML = h;
    $('tm-fb').textContent = ''; $('tm-fb').className = 'fz-fb';
  }
  $('tm-griglia').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-m]'); if (!b) return;
    var i = +b.dataset.m, A = i % TM.a === 0, B = i % TM.b === 0, m = lcm(TM.a, TM.b), fb = $('tm-fb');
    if (A && B && i === m) {
      Array.prototype.forEach.call($('tm-griglia').querySelectorAll('[data-m]'), function (c) { if (+c.dataset.m % m === 0) c.classList.add('com'); });
      fb.className = 'fz-fb si';
      fb.innerHTML = 'Esatto! Il primo incontro è al minuto ' + m + ': è il <strong>minimo comune multiplo</strong>, mcm(' + TM.a + ', ' + TM.b + ') = ' + m + '. Guarda le caselle evidenziate: dopo suonano insieme ogni ' + m + ' minuti (' + m + ', ' + 2 * m + (3 * m <= 160 ? ', ' + 3 * m : '') + '…), cioè sui multipli di ' + m + '.' + (gcd(TM.a, TM.b) === 1 ? ' Qui ' + TM.a + ' e ' + TM.b + ' non hanno divisori in comune, e il mcm è proprio il loro prodotto.' : ' Nota: non è ' + TM.a + ' · ' + TM.b + ' = ' + TM.a * TM.b + '.') + ' Cambia i timer e riprova.';
    } else if (A && B) { fb.className = 'fz-fb mezzo'; fb.textContent = 'Qui suonano tutti e due, ma c\'è un momento prima in cui succede. Cercalo.'; }
    else if (A || B) { fb.className = 'fz-fb no'; fb.textContent = 'Al minuto ' + i + ' suona solo il ' + (A ? 'primo' : 'secondo') + ' timer: ' + i + ' è multiplo di ' + (A ? TM.a : TM.b) + ' ma non di ' + (A ? TM.b : TM.a) + '.'; }
    else { fb.className = 'fz-fb no'; fb.textContent = 'Al minuto ' + i + ' non suona nessuno dei due.'; }
  });
  ['tm-a', 'tm-b'].forEach(function (id) { $(id).addEventListener('change', timer); });
  timer();

  /* ════════ LE MATTONELLE (MCD) ════════ */
  var PAV = [[12, 18], [8, 12], [15, 20], [16, 24], [14, 21], [18, 30], [9, 15]], PV = { a: 12, b: 18, s: 0, buoni: {} };
  $('pv-dim').innerHTML = PAV.map(function (p, i) { return '<option value="' + i + '">' + p[0] + ' dm × ' + p[1] + ' dm</option>'; }).join('');
  function pavimento() {
    var p = PAV[+$('pv-dim').value]; PV = { a: p[0], b: p[1], s: 0, buoni: {} };
    $('pv-testo').innerHTML = 'Il pavimento della dispensa misura <strong>' + PV.a + ' dm × ' + PV.b + ' dm</strong>. Si vogliono mattonelle quadrate tutte uguali, <strong>le più grandi possibile</strong>, senza tagliarne nessuna.';
    var h = '';
    for (var s = 1; s <= PV.a; s++) h += '<button type="button" class="fz-chip" data-s="' + s + '" aria-pressed="false">' + s + '</button>';
    $('pv-lati').innerHTML = h;
    disegnaPav();
    $('pv-fb').textContent = ''; $('pv-fb').className = 'fz-fb'; $('pv-ok').textContent = '';
  }
  function disegnaPav() {
    var a = PV.a, b = PV.b, s = PV.s, h = '<svg viewBox="-0.3 -0.3 ' + (b + 0.6) + ' ' + (a + 0.6) + '" role="img" aria-label="Pavimento ' + a + ' per ' + b + (s ? ' con mattonelle di lato ' + s : '') + '"><rect x="0" y="0" width="' + b + '" height="' + a + '" class="pv-fondo"/>';
    if (s) {
      var nx = Math.floor(b / s), ny = Math.floor(a / s);
      for (var y = 0; y < ny; y++) for (var x = 0; x < nx; x++) h += '<rect x="' + x * s + '" y="' + y * s + '" width="' + s + '" height="' + s + '" class="pv-m' + ((x + y) % 2 ? ' alt' : '') + '"/>';
      if (nx * s < b) h += '<rect x="' + nx * s + '" y="0" width="' + (b - nx * s) + '" height="' + a + '" class="pv-resto"/>';
      if (ny * s < a) h += '<rect x="0" y="' + ny * s + '" width="' + nx * s + '" height="' + (a - ny * s) + '" class="pv-resto"/>';
    }
    h += '<rect x="0" y="0" width="' + b + '" height="' + a + '" class="pv-bordo"/></svg>';
    $('pv-disegno').innerHTML = h;
  }
  $('pv-lati').addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-s]'); if (!c) return;
    PV.s = +c.dataset.s;
    Array.prototype.forEach.call($('pv-lati').children, function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
    disegnaPav();
    var a = PV.a, b = PV.b, s = PV.s, g = gcd(a, b), fb = $('pv-fb');
    if (a % s === 0 && b % s === 0) {
      PV.buoni[s] = 1; c.classList.add('va');
      fb.className = 'fz-fb si';
      fb.innerHTML = 'Copre tutto: ' + b / s + ' file da ' + a / s + ' = ' + (a / s) * (b / s) + ' mattonelle. ' + (s === g ? '<strong>È la più grande possibile: MCD(' + a + ', ' + b + ') = ' + g + '.</strong>' : 'Funziona, ma si può trovare una mattonella più grande?');
    } else {
      fb.className = 'fz-fb no';
      var r = [];
      if (b % s) r.push(b + ' : ' + s + ' = ' + Math.floor(b / s) + ' con resto ' + b % s);
      if (a % s) r.push(a + ' : ' + s + ' = ' + Math.floor(a / s) + ' con resto ' + a % s);
      fb.textContent = 'Così bisogna tagliare (in rosso): ' + r.join('; ') + '. Il lato deve dividere esattamente sia ' + a + ' sia ' + b + '.';
    }
    var k = Object.keys(PV.buoni).map(Number).sort(function (x, y) { return x - y; });
    if (PV.buoni[g]) {
      var div = []; for (var d = 1; d <= g; d++) if (g % d === 0) div.push(d);
      $('pv-ok').innerHTML = 'I lati che funzionano sono <strong>' + div.join(', ') + '</strong>: i <em>divisori comuni</em> di ' + a + ' e ' + b + '. Il più grande, ' + g + ', è il <strong>massimo comune divisore</strong>. E sono anche tutti divisori di ' + g + '.';
    } else if (k.length) $('pv-ok').textContent = 'Lati che funzionano finora: ' + k.join(', ') + '.';
  });
  $('pv-dim').addEventListener('change', pavimento);
  pavimento();

  /* ════════ LA COLONNA DELLE DIVISIONI ════════ */
  var AL = { n: 60, cur: 60, righe: [] };
  var CRIT = {
    2: function (n) { return n + ' finisce per ' + n % 10 + ', che è dispari: non si divide per 2.'; },
    3: function (n) { var s = String(n).split('').reduce(function (x, c) { return x + +c; }, 0); return 'La somma delle cifre di ' + n + ' è ' + s + ', che non è multiplo di 3: non si divide per 3.'; },
    5: function (n) { return n + ' non finisce per 0 o per 5: non si divide per 5.'; }
  };
  function albero(n) {
    AL = { n: n, cur: n, righe: [] };
    disegnaAlbero('');
  }
  function disegnaAlbero(msg, cls) {
    var h = '';
    AL.righe.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; });
    h += '<tr class="cur"><td>' + AL.cur + '</td><td>' + (AL.cur === 1 ? '' : '?') + '</td></tr>';
    $('al-col').innerHTML = h;
    if (AL.cur === 1) {
      $('al-dom').innerHTML = 'Finito! <strong>' + AL.n + ' = ' + fH(AL.n) + '</strong>. I fattori sono i numeri della colonna di destra.';
      $('al-primi').innerHTML = '';
    } else {
      $('al-dom').innerHTML = 'Per quale numero primo si divide <strong>' + AL.cur + '</strong>? Parti dal più piccolo.';
      $('al-primi').innerHTML = [2, 3, 5, 7, 11, 13].map(function (p) { return '<button type="button" class="fz-chip" data-p="' + p + '">: ' + p + '</button>'; }).join('') + '<button type="button" class="fz-chip" data-p="primo">' + AL.cur + ' è primo</button>';
    }
    $('al-fb').className = 'fz-fb' + (cls ? ' ' + cls : '');
    $('al-fb').textContent = msg;
  }
  $('al-primi').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-p]'); if (!b) return;
    var c = AL.cur;
    if (b.dataset.p === 'primo') {
      if (primo(c)) { AL.righe.push([c, c]); AL.cur = 1; disegnaAlbero('Giusto: ' + c + ' è primo, si divide per sé stesso e si arriva a 1.', 'si'); }
      else disegnaAlbero('No: ' + c + ' si divide ancora per un primo più piccolo. Prova 2, 3, 5, 7…', 'no');
      return;
    }
    var p = +b.dataset.p;
    if (c % p === 0) {
      var piu = minDiv(c) < p;
      AL.righe.push([c, p]); AL.cur = c / p;
      disegnaAlbero(c + ' : ' + p + ' = ' + c / p + '.' + (piu ? ' Va bene lo stesso; di solito si parte dal primo più piccolo.' : ''), 'si');
    } else disegnaAlbero(CRIT[p] ? CRIT[p](c) : c + ' : ' + p + ' fa ' + Math.floor(c / p) + ' con resto ' + c % p + ': non si divide.', 'no');
  });
  function alDaCampo() {
    var n = intero($('al-n').value);
    if (!n || n < 2 || n > 99999) { $('al-fb').className = 'fz-fb no'; $('al-fb').textContent = 'Scrivi un numero intero tra 2 e 99999.'; return; }
    albero(n);
  }
  $('al-via').addEventListener('click', alDaCampo);
  $('al-n').addEventListener('change', alDaCampo);
  $('al-caso').addEventListener('click', function () { var n = composto(pesca([1, 2, 2, 3])); $('al-n').value = n; albero(n); });
  albero(60);

  /* ════════ IL METODO PASSO PASSO ════════ */
  var area = $('tt-area');
  function costruisci(nums) {
    var F = nums.map(fattori), P = [];
    F.forEach(function (f) { primiDi(f).forEach(function (p) { if (P.indexOf(p) < 0) P.push(p); }); });
    P.sort(function (a, b) { return a - b; });
    var com = P.filter(function (p) { return F.every(function (f) { return f[p]; }); });
    var G = gcdL(nums), M = lcmL(nums), gF = fattMcd(nums), mF = fattMcm(nums), passi = [];
    nums.forEach(function (n, k) {
      var cat = [], x = n;
      while (x > 1) { var p = minDiv(x); cat.push(x + ' : ' + p + ' = ' + x / p); x /= p; }
      passi.push({
        titolo: 'Scomponi ' + n, tipo: 'esp', primi: P,
        testo: 'Scrivi ' + n + ' come prodotto di primi: metti l\'esponente di ogni primo (0 se non c\'è).',
        verifica: function (v) {
          var p = prodotto(v);
          if (P.every(function (q) { return (v[q] || 0) === (F[k][q] || 0); })) return { ok: true };
          return { ok: false, msg: 'Con questi esponenti il prodotto fa ' + p + ', non ' + n + '.' };
        },
        aiuti: ['Dividi ' + n + ' per il primo più piccolo che lo divide, poi continua con il risultato fino ad arrivare a 1. Conta quante volte hai diviso per ogni primo.', 'Le divisioni: ' + cat.join(', ') + '.'],
        rivela: function () { return n + ' = ' + fattHtml(F[k]); },
        spiega: '',
        lav: n + ' = ' + fattHtml(F[k])
      });
    });
    passi.push({
      titolo: 'I fattori comuni', tipo: 'multi', primi: P,
      testo: 'Quali primi compaiono in tutte le scomposizioni? Tocca quelli giusti (oppure «nessuno»), poi Controlla.',
      verifica: function (v) {
        var ok = v.length === com.length && com.every(function (p) { return v.indexOf(p) >= 0; });
        if (ok) return { ok: true };
        var manca = com.filter(function (p) { return v.indexOf(p) < 0; }), troppo = v.filter(function (p) { return com.indexOf(p) < 0; });
        return { ok: false, msg: troppo.length ? troppo.join(', ') + ' non compare in tutte le scomposizioni.' : 'Ne manca qualcuno: ' + (manca.length === 1 ? 'uno' : manca.length) + '.' };
      },
      aiuti: ['Guarda la lavagna: un primo è comune se c\'è in ogni riga, con qualunque esponente.'],
      rivela: function () { return com.length ? com.join(', ') : 'nessuno'; },
      spiega: com.length ? '' : 'Non ci sono fattori comuni: i numeri sono primi tra loro.',
      lav: 'Fattori comuni: ' + (com.length ? com.join(', ') : 'nessuno')
    });
    passi.push({
      titolo: 'Il MCD', tipo: 'num',
      testo: com.length ? 'MCD: prendi solo i fattori comuni, ognuno con l\'esponente più piccolo. Quanto vale?' : 'Senza fattori comuni, quanto vale il MCD?',
      verifica: function (v) {
        var x = intero(v);
        if (x === G) return { ok: true };
        if (x === null) return { ok: false, msg: 'Scrivi un numero intero.' };
        if (x === M) return { ok: false, msg: 'Questo è il mcm! Per il MCD servono solo i fattori comuni, con l\'esponente più piccolo.' };
        if (x > nums[0]) return { ok: false, msg: 'Troppo grande: il MCD non può superare il numero più piccolo, ' + nums[0] + '.' };
        if (nums.every(function (n) { return n % x === 0; })) return { ok: false, msg: x + ' è un divisore comune, ma non il più grande. Hai preso l\'esponente più piccolo di ogni fattore comune?' };
        return { ok: false, msg: x + ' non divide tutti i numeri.' };
      },
      aiuti: com.length ? ['Per ogni fattore comune guarda gli esponenti nelle righe della lavagna e prendi il più piccolo.', 'MCD = ' + fattHtml(gF) + '. Quanto fa?'] : ['Quando non ci sono fattori primi comuni, l\'unico divisore comune è 1.'],
      rivela: function () { return String(G); },
      spiega: 'MCD(' + nums.join(', ') + ') = ' + (com.length ? fattHtml(gF) + ' = ' : '') + G + '.',
      lav: 'MCD = ' + (com.length ? fattHtml(gF) + ' = ' : '') + '<strong>' + G + '</strong>'
    });
    passi.push({
      titolo: 'Il mcm', tipo: 'num',
      testo: 'mcm: prendi tutti i fattori, comuni e non comuni, ognuno con l\'esponente più grande. Quanto vale?',
      verifica: function (v) {
        var x = intero(v);
        if (x === M) return { ok: true };
        if (x === null) return { ok: false, msg: 'Scrivi un numero intero.' };
        if (x === G) return { ok: false, msg: 'Questo è il MCD! Per il mcm servono tutti i fattori, con l\'esponente più grande.' };
        if (x < nums[nums.length - 1]) return { ok: false, msg: 'Troppo piccolo: il mcm non può essere minore del numero più grande, ' + nums[nums.length - 1] + '.' };
        if (nums.every(function (n) { return x % n === 0; })) return { ok: false, msg: x + ' è un multiplo comune, ma non il minimo. Hai preso ogni fattore una sola volta, con l\'esponente più grande?' };
        return { ok: false, msg: x + ' non è multiplo di tutti i numeri. Hai preso anche i fattori non comuni?' };
      },
      aiuti: ['Scrivi ogni primo che compare nella lavagna, una sola volta, con l\'esponente più grande che vedi.', 'mcm = ' + fattHtml(mF) + '. Quanto fa?'],
      rivela: function () { return String(M); },
      spiega: 'mcm(' + nums.join(', ') + ') = ' + fattHtml(mF) + ' = ' + M + '.' + (nums.length === 2 ? ' Controllo: MCD · mcm = ' + G + ' · ' + M + ' = ' + G * M + ', proprio come ' + nums[0] + ' · ' + nums[1] + '.' : ''),
      lav: 'mcm = ' + fattHtml(mF) + ' = <strong>' + M + '</strong>'
    });
    return { nums: nums, passi: passi, G: G, M: M, testata: '<p class="mm-testa">MCD e mcm di ' + elenco(nums) + '</p>', fine: '<p class="tt-q">MCD = ' + G + ' · mcm = ' + M + '</p>' };
  }
  var TU = TUTOR.crea(area, { altro: function () { nuovoTutor(); }, allenati: 'aula/matematica/mcd-mcm.html#allenati' });
  function avvia(nums, scorri) { TU.avvia(function () { return costruisci(nums); }, scorri ? $('metodo') : null); }
  function nuovoTutor() { avvia(gruppo(+$('tu-liv').value, +$('tu-tipo').value, false), false); }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  $('tu-miei').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var l = $('tu-n').value.split(/[,;\s]+/).filter(Boolean).map(intero);
    if (l.length < 2 || l.length > 4 || l.some(function (x) { return !x || x < 2 || x > 99999; })) {
      TU.errore('Scrivi da 2 a 4 numeri interi tra 2 e 99999, separati da virgola.'); return;
    }
    avvia(l.sort(function (a, b) { return a - b; }), false);
  });
  nuovoTutor();

  /* ════════ ALLENATI ════════ */
  var EX = { q: null, fase: 0, risolto: false, conta: 0, tent: 0 };
  var exA = $('ex-area');
  function domandaHtml(q) {
    if (q.tipo === 'primo') return '<p class="mm-dom"><strong>' + q.n + '</strong> è un numero primo?</p>';
    if (q.tipo === 'scomponi') return '<p class="mm-dom">Scomponi in fattori primi: <strong>' + q.n + '</strong></p>';
    if (q.tipo === 'mcd') return '<p class="mm-dom">Calcola il <strong>MCD</strong> di ' + elenco(q.nums) + '</p>';
    if (q.tipo === 'mcm') return '<p class="mm-dom">Calcola il <strong>mcm</strong> di ' + elenco(q.nums) + '</p>';
    return '<p class="mm-pr">' + esc(q.testo) + '</p>';
  }
  function rispostaHtml(q) {
    if (q.tipo === 'primo') return '<div class="tt-sc" role="group" aria-label="Risposta"><button type="button" class="fz-btn sec" data-r="si">Sì, è primo</button><button type="button" class="fz-btn sec" data-r="no">No, non è primo</button></div>';
    if (q.tipo === 'problema' && EX.fase === 0) return '<p class="mm-p"><strong>Prima di tutto: che cosa serve?</strong></p><div class="tt-sc" role="group" aria-label="Che cosa serve"><button type="button" class="fz-btn sec" data-r="mcd">Serve il MCD</button><button type="button" class="fz-btn sec" data-r="mcm">Serve il mcm</button></div>';
    var ph = q.tipo === 'scomponi' ? 'per esempio 2^2*3*5' : 'un numero';
    return (q.tipo === 'problema' ? '<p class="mm-p">Giusto, serve il <strong>' + (q.serve === 'mcd' ? 'MCD' : 'mcm') + '</strong> di ' + elenco(q.nums) + '. Ora calcolalo.</p>' : '') + '<form class="fz-risp" id="ex-f" novalidate><label for="ex-in">La tua risposta' + (q.u ? ' (' + esc(q.u) + ')' : '') + '</label><div class="fz-risp-r"><input id="ex-in" type="text" inputmode="' + (q.tipo === 'scomponi' ? 'text' : 'numeric') + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + ph + '"/><button type="submit" class="fz-btn">Controlla</button></div></form>';
  }
  function exDisegna(focus) {
    var q = EX.q;
    exA.innerHTML = domandaHtml(q) + '<div id="ex-r">' + rispostaHtml(q) + '</div><p class="fz-fb" id="ex-fb" role="status" aria-live="polite"></p><p class="tt-aiuto" id="ex-aiuto"></p>' +
      '<div class="fz-azioni"><button type="button" class="fz-btn sec" id="ex-sugg">Suggerimento</button><button type="button" class="fz-btn sec" id="ex-sol">Mostra la soluzione</button>' + (q.nums ? '<button type="button" class="fz-btn sec" id="ex-guida">Aiutami passo passo</button>' : '') + '<button type="button" class="fz-btn" id="ex-nuovo">Nuovo esercizio</button></div><div id="ex-solbox" class="fz-esito" hidden></div>';
    if (focus) { var i = exA.querySelector('#ex-in') || exA.querySelector('[data-r]'); if (i) i.focus(); }
  }
  function exNuovo(focus) { EX.q = esercizio($('ex-tipo').value, +$('ex-liv').value); EX.fase = 0; EX.risolto = false; EX.tent = 0; exDisegna(focus); }
  function fb(msg, cls, html) { var f = $('ex-fb'); f.className = 'fz-fb ' + (cls || ''); if (html) f.innerHTML = msg; else f.textContent = msg; }
  function bravo(msg) {
    fb('Esatto! ' + (msg || ''), 'si', true);
    if (!EX.risolto) { EX.risolto = true; EX.conta++; $('ex-conta').textContent = 'Esercizi risolti in questa visita: ' + EX.conta; }
  }
  function verificaNum(q, x) {
    var r = giudica(q, x === null ? '' : String(x));
    if (r.ok) return bravo(r.msg);
    EX.tent++;
    fb(r.msg || ('Non ancora. ' + (EX.tent >= 2 ? 'Prova con il suggerimento o con «Aiutami passo passo».' : 'Ricontrolla le scomposizioni.')), r.cls);
  }
  exA.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var q = EX.q, v = $('ex-in').value;
    if (q.tipo === 'scomponi') {
      var r = controllaFatt(v, q.n);
      if (r.ok) return bravo(q.n + ' = ' + fH(q.n) + '.');
      EX.tent++; return fb(r.msg, 'no', r.html);
    }
    verificaNum(q, intero(v));
  });
  exA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var q = EX.q;
    if (b.dataset.r) {
      if (q.tipo === 'primo') {
        var p = primo(q.n), si = b.dataset.r === 'si';
        if (si === p) bravo(p ? q.n + ' si divide solo per 1 e per sé stesso.' : q.n + ' = ' + minDiv(q.n) + ' · ' + q.n / minDiv(q.n) + '.');
        else { EX.tent++; fb(p ? 'Invece sì: prova a dividerlo per 2, 3, 5, 7… nessuno lo divide.' : 'Invece no: ' + q.n + ' si divide per ' + minDiv(q.n) + '.', 'no'); }
        return;
      }
      if (b.dataset.r === q.serve) { EX.fase = 1; $('ex-r').innerHTML = rispostaHtml(q); fb('', ''); var i = $('ex-in'); if (i) i.focus(); }
      else { EX.tent++; fb(q.serve === 'mcd' ? 'Pensa: qui si divide qualcosa in parti uguali, le più grandi possibile, senza avanzi. Il risultato sarà più piccolo dei numeri dati.' : 'Pensa: qui qualcosa si ripete e cerchi la prima volta che coincide. Il risultato sarà più grande dei numeri dati.', 'no'); }
      return;
    }
    if (b.id === 'ex-nuovo') return exNuovo(true);
    if (b.id === 'ex-sol') { var s = $('ex-solbox'); s.innerHTML = '<div class="tt-fine">' + soluzione(q) + '</div>'; s.hidden = false; return; }
    if (b.id === 'ex-guida') return avvia(q.nums.slice(), true);
    if (b.id === 'ex-sugg') {
      var t;
      if (q.tipo === 'primo') t = 'Prova a dividere ' + q.n + ' per i primi 2, 3, 5, 7, 11, 13…: basta arrivare al primo il cui quadrato supera ' + q.n + '.';
      else if (q.tipo === 'scomponi') t = 'Comincia così: ' + q.n + ' : ' + minDiv(q.n) + ' = ' + q.n / minDiv(q.n) + '. Poi continua con ' + q.n / minDiv(q.n) + '.';
      else if (q.tipo === 'problema' && EX.fase === 0) t = 'Chiediti: sto dividendo in parti uguali (MCD) o aspetto che qualcosa si ripeta e coincida (mcm)?';
      else t = 'Le scomposizioni: ' + q.nums.map(function (n) { return n + ' = ' + fH(n); }).join(' · ') + '.';
      $('ex-aiuto').innerHTML = t; return;
    }
  });
  ['ex-tipo', 'ex-liv'].forEach(function (id) { $(id).addEventListener('change', function () { exNuovo(false); }); });
  exNuovo(false);

  /* ════════ MISSIONE ════════ */
  var MISS = [
    { serve: 'mcd', nums: [36, 48], u: 'vassoi', testo: 'Lo chef ha preparato 36 tartine al salmone e 48 al formaggio. Vuole vassoi tutti uguali, il maggior numero possibile, e nessuna tartina deve avanzare. Quanti vassoi?', dopo: 'In ogni vassoio: 3 tartine al salmone e 4 al formaggio.' },
    { serve: 'mcm', nums: [12, 18], u: 'minuti', testo: 'Il forno A sforna una teglia ogni 12 minuti, il forno B ogni 18. Sono partiti insieme alle 18:00. Dopo quanti minuti sfornano di nuovo insieme?', dopo: 'Alle 18:36 i due forni sfornano insieme.' },
    { serve: 'mcd', nums: [90, 120], u: 'cm', testo: 'In magazzino ci sono due rotoli di stoffa, lunghi 90 cm e 120 cm. Vanno tagliati in runner da tavola tutti uguali, i più lunghi possibile, senza scarti. Quanto è lungo ogni runner?', dopo: 'Escono 3 runner dal primo rotolo e 4 dal secondo.' },
    { serve: 'mcm', nums: [4, 6, 10], u: 'minuti', testo: 'Durante il buffet tre camerieri fanno il giro dei tavoli: Luca ogni 4 minuti, Sara ogni 6, Ahmed ogni 10. Partono insieme dal bancone. Dopo quanti minuti si ritrovano tutti e tre al bancone?', dopo: 'Un\'ora esatta: è il momento giusto per il cambio dei vassoi.' }
  ];
  var MI = { i: 0, fase: 0, errori: 0 }, miA = $('mi-area');
  var RIP = [
    { d: 'Quanto vale il MCD di 12 e 18?', o: ['6', '36', '3'], g: 0, s: '12 = 2²·3 e 18 = 2·3²: fattori comuni con l\'esponente più piccolo, 2·3 = 6.' },
    { d: 'Quanto vale il mcm di 4 e 6?', o: ['24', '12', '2'], g: 1, s: '4 = 2², 6 = 2·3: tutti i fattori con l\'esponente più grande, 2²·3 = 12.' },
    { d: 'Quale di questi numeri è primo?', o: ['21', '27', '29', '33'], g: 2, s: '21 = 3·7, 27 = 3³, 33 = 3·11. Il 29 si divide solo per 1 e per sé stesso.' },
    { d: 'Due turni si ripetono ogni 10 e ogni 15 giorni. Per sapere quando coincidono di nuovo serve…', o: ['il MCD', 'il mcm'], g: 1, s: 'Qualcosa si ripete e si cerca la prima volta che coincide: mcm(10, 15) = 30 giorni.' },
    { d: 'Qual è la scomposizione in fattori primi di 18?', o: ['2·9', '2·3²', '3·6'], g: 1, s: '9 e 6 non sono primi: 18 = 2·3·3 = 2·3².' },
    { d: 'Nel mcm si prendono…', o: ['solo i fattori comuni, con l\'esponente più piccolo', 'tutti i fattori, comuni e non comuni, con l\'esponente più grande'], g: 1, s: 'La prima è la regola del MCD.' },
    { d: 'L\'1 è un numero primo?', o: ['Sì', 'No'], g: 1, s: 'No: un numero primo ha esattamente due divisori, e l\'1 ne ha uno solo.' },
    { d: 'Se il MCD di due numeri è 1, il loro mcm è…', o: ['1', 'il prodotto dei due numeri', 'il numero più grande'], g: 1, s: 'I numeri sono primi tra loro: per esempio mcm(4, 9) = 36 = 4·9.' }
  ];
  function miDisegna() {
    var n = MISS.length;
    if (MI.i >= n) {
      if (window.PERCORSO) PERCORSO.segna(ID);
      if (window.RIPASSO) RIPASSO.registra({ titolo: 'Numeri primi, MCD e mcm', icona: '⏲️', materia: 'Matematica' }, 'mate-' + ID, location.pathname, RIP);
      miA.innerHTML = '<div class="tt-fine"><p class="tt-et">Missione compiuta</p><p class="tt-q">🎉 Il buffet è pronto, e la tappa è fatta!</p><p class="tt-stat">' + (MI.errori === 0 ? 'Nessun errore: complimenti.' : 'Tentativi da rifare: ' + MI.errori + '. Va benissimo: si impara così.') + ' Domani, tra 3 giorni e tra una settimana trovi un ripasso lampo nella pagina del percorso.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-ricomincia">Rifai la missione</button><a class="fz-btn" href="aula/matematica/" style="text-decoration:none;display:inline-flex;align-items:center">Torna alle tappe</a></div></div>';
      return;
    }
    var m = MISS[MI.i];
    var h = '<div class="tt-prog"><span>Problema ' + (MI.i + 1) + ' di ' + n + '</span><div class="tt-bar" role="img" aria-label="Fatti ' + MI.i + ' problemi su ' + n + '"><i style="width:' + Math.round(100 * MI.i / n) + '%"></i></div></div><p class="mm-pr">' + esc(m.testo) + '</p>';
    if (MI.fase === 0) h += '<div class="tt-sc" role="group" aria-label="Che cosa serve"><button type="button" class="fz-btn sec" data-mi="mcd">Serve il MCD</button><button type="button" class="fz-btn sec" data-mi="mcm">Serve il mcm</button></div>';
    else if (MI.fase === 1) h += '<p class="mm-p">Serve il <strong>' + (m.serve === 'mcd' ? 'MCD' : 'mcm') + '</strong> di ' + elenco(m.nums) + '.</p><form class="fz-risp" id="mi-f" novalidate><label for="mi-in">La tua risposta (' + m.u + ')</label><div class="fz-risp-r"><input id="mi-in" type="text" inputmode="numeric" autocomplete="off"/><button type="submit" class="fz-btn">Controlla</button></div></form><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-aiuto">Mostrami le scomposizioni</button></div>';
    else h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="mi-avanti">' + (MI.i + 1 >= n ? 'Concludi la missione' : 'Prossimo problema') + '</button></div>';
    h += '<p class="fz-fb" id="mi-fb" role="status" aria-live="polite"></p><p class="tt-aiuto" id="mi-aiuto-t"></p>';
    miA.innerHTML = h;
  }
  function miFb(t, c) { var f = $('mi-fb'); f.className = 'fz-fb ' + c; f.innerHTML = t; }
  miA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var m = MISS[MI.i];
    if (b.id === 'mi-ricomincia') { MI = { i: 0, fase: 0, errori: 0 }; miDisegna(); return; }
    if (b.id === 'mi-avanti') { MI.i++; MI.fase = 0; miDisegna(); var x = miA.querySelector('button'); if (x) x.focus(); return; }
    if (b.id === 'mi-aiuto') { $('mi-aiuto-t').innerHTML = m.nums.map(function (n) { return n + ' = ' + fH(n); }).join(' · '); return; }
    if (b.dataset.mi) {
      if (b.dataset.mi === m.serve) { MI.fase = 1; miDisegna(); $('mi-in').focus(); }
      else { MI.errori++; miFb(m.serve === 'mcd' ? 'Rileggi: qui si divide in parti uguali, le più grandi possibile, senza avanzi.' : 'Rileggi: qui qualcosa si ripete e si cerca la prima volta che coincide.', 'no'); }
    }
  });
  miA.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var m = MISS[MI.i], x = intero($('mi-in').value), att = m.serve === 'mcd' ? gcdL(m.nums) : lcmL(m.nums);
    if (x === att) { MI.fase = 2; miDisegna(); miFb('Esatto: ' + att + ' ' + m.u + '. ' + esc(m.dopo), 'si'); miA.querySelector('#mi-avanti').focus(); return; }
    MI.errori++;
    miFb(x === null ? 'Scrivi un numero intero.' : 'Non ancora. Puoi guardare le scomposizioni con il pulsante qui sotto.', 'no');
  });
  miDisegna();

  /* ════════ SCHEDA STAMPABILE ════════ */
  function testoStampa(q) {
    if (q.tipo === 'scomponi') return 'Scomponi in fattori primi: <strong>' + q.n + '</strong>';
    if (q.tipo === 'mcd') return 'MCD(' + q.nums.join(', ') + ') = …';
    if (q.tipo === 'mcm') return 'mcm(' + q.nums.join(', ') + ') = …';
    return esc(q.testo);
  }
  function solStampa(q) {
    if (q.tipo === 'scomponi') return q.n + ' = ' + fH(q.n);
    var f = q.nums.map(function (n) { return n + ' = ' + fH(n); }).join('; ');
    if (q.tipo === 'mcd') return 'MCD = ' + gcdL(q.nums) + ' <span class="fz-m">(' + f + ')</span>';
    if (q.tipo === 'mcm') return 'mcm = ' + lcmL(q.nums) + ' <span class="fz-m">(' + f + ')</span>';
    return (q.serve === 'mcd' ? 'MCD' : 'mcm') + '(' + q.nums.join(', ') + ') = ' + q.ris + ' → ' + q.ris + ' ' + esc(q.u) + ' <span class="fz-m">(' + f + ')</span>';
  }
  function serie(tipi, lv, n) {
    var out = [], visti = {};
    for (var i = 0; out.length < n && i < n * 40; i++) {
      var q = esercizio(tipi[out.length % tipi.length], lv), k = JSON.stringify([q.n, q.nums, q.testo]);
      if (visti[k]) continue;
      visti[k] = 1; out.push(q);
    }
    return out;
  }
  var AIUTI_FOGLIO = '<div class="mm-promemoria"><p><strong>Numeri primi fino a 50:</strong> 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47.</p><p><strong>Scomporre:</strong> dividi per il primo più piccolo possibile e continua fino a 1. Si divide per 2 se l\'ultima cifra è pari, per 3 se la somma delle cifre è multiplo di 3, per 5 se finisce per 0 o 5.</p><p><strong>MCD:</strong> solo i fattori comuni, con l\'esponente più piccolo. <strong>mcm:</strong> tutti i fattori, con l\'esponente più grande.</p><p><strong>Problemi:</strong> dividere in parti uguali → MCD; qualcosa che si ripete e coincide → mcm.</p></div>';
  $('sc-crea').addEventListener('click', function () {
    var tipi = Array.prototype.map.call(document.querySelectorAll('input[name="sc-t"]:checked'), function (x) { return x.value; });
    var out = $('sc-out');
    if (!tipi.length) { out.hidden = false; out.innerHTML = '<p class="fz-err" role="alert">Scegli almeno un tipo di esercizio.</p>'; return; }
    var lv = +$('sc-liv').value, n = +$('sc-n').value, file = $('sc-ab').checked ? ['A', 'B'] : [''], h = '', sol = '';
    file.forEach(function (F) {
      var S = serie(tipi, lv, n), tit = 'Numeri primi, MCD e mcm' + (F ? ' · file ' + F : '');
      h += '<div class="fz-pag' + (h ? ' fz-sol-pag' : '') + '"><h2 class="fz-foglio-t">' + tit + '</h2><p class="fz-foglio-i">Nome ______________________ Classe ________ Data ____________</p>' + ($('sc-aiuti').checked ? AIUTI_FOGLIO : '') + '<p class="fz-foglio-c">Svolgi gli esercizi scrivendo le scomposizioni. Nei problemi indica se usi il MCD o il mcm.</p><ol class="fz-es" style="--h:' + (n <= 8 ? '2.9cm' : n === 10 ? '2.4cm' : '2cm') + '">';
      S.forEach(function (q) { h += '<li class="fz-es-i' + (q.tipo === 'problema' ? ' mm-es-pr' : '') + '">' + testoStampa(q) + '</li>'; });
      h += '</ol></div>';
      sol += '<h3 class="fz-sottit">' + (F ? 'File ' + F : 'Soluzioni') + '</h3><ol class="fz-es fz-es-sol">' + S.map(function (q) { return '<li>' + solStampa(q) + '</li>'; }).join('') + '</ol>';
    });
    if ($('sc-sol').checked) h += '<div class="fz-pag fz-sol-pag"><h2 class="fz-foglio-t">Soluzioni</h2>' + sol + '</div>';
    out.innerHTML = h; out.hidden = false;
    $('sc-stampa').hidden = false;
  });
  $('sc-stampa').addEventListener('click', function () { window.print(); });

  /* ripasso: se è il giorno, l'invito in cima; altrimenti un riscaldamento sull'ultima lezione fatta */
  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);

})();
