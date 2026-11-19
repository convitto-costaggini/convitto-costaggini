/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Tappa «Dal decimale alla frazione» (decimali finiti e periodici)
   Un decimale periodico è {i, a, p}: parte intera i, antiperiodo a (stringa), periodo p (stringa); 0,1(6) → i=0, a='1', p='6'.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ID = 'periodici', URL = 'aula/matematica/periodici.html';
  var T = window.TB, $ = T.$, rnd = T.rnd, pesca = T.pesca, gcd = T.gcd, M = T.M, Q = T.Q;
  var mfr = T.mfr;

  /* ── motore ── */
  function expand(n, d) {
    var i = Math.floor(n / d), r = n % d, dig = [], visto = {};
    while (r !== 0 && visto[r] === undefined) { visto[r] = dig.length; r *= 10; dig.push(Math.floor(r / d)); r %= d; }
    if (r === 0) return { i: i, a: dig.join(''), p: '' };
    return { i: i, a: dig.slice(0, visto[r]).join(''), p: dig.slice(visto[r]).join('') };
  }
  function resti(n, d) { var r = n % d, v = [], s = {}; while (r !== 0 && s[r] === undefined) { s[r] = v.length; v.push(r); r = (r * 10) % d; } return { lista: v, ripete: r !== 0 ? r : null }; }
  function testo(x) { return x.i + (x.a || x.p ? ',' + x.a + (x.p ? '(' + x.p + ')' : '') : ''); }
  function parse(s) {
    s = String(s == null ? '' : s).replace(/\s+/g, '').replace(/\./g, ',').replace(/[\[{]/g, '(').replace(/[\]}]/g, ')');
    var m = /^(\d+)(?:,(\d*)(?:\((\d+)\))?)?$/.exec(s); if (!m) return null;
    return { i: +m[1], a: m[2] || '', p: m[3] || '' };
  }
  /* valore come frazione {n, d} non ridotta: (Ap − A) / (10^|a| · (10^|p| − 1)) */
  function genera(x) {
    var A = x.i + x.a, Ap = x.i + x.a + x.p;
    if (!x.p) return { n: +Ap, d: Math.pow(10, x.a.length) };
    return { n: +Ap - +A, d: Math.pow(10, x.a.length) * (Math.pow(10, x.p.length) - 1) };
  }
  function ridotta(f) { var g = gcd(f.n, f.d); return { n: f.n / g, d: f.d / g }; }
  function fattori(n) { var f = [], p = 2; while (n > 1 && p * p <= n) { while (n % p === 0) { f.push(p); n /= p; } p++; } if (n > 1) f.push(n); return f; }
  function fattoriTesto(n) { var f = fattori(n), o = {}; f.forEach(function (x) { o[x] = (o[x] || 0) + 1; }); var k = Object.keys(o); return k.length ? k.map(function (p) { return o[p] > 1 ? p + '<sup>' + o[p] + '</sup>' : p; }).join(' · ') : '1'; }
  function finito(d) { return fattori(d).every(function (p) { return p === 2 || p === 5; }); }
  function fr(n, d) { return M(mfr(n, d)); }
  function giusta(x) { return x.i + ' ' + testo(x); }

  T.lim('mt-lim', 'main');

  /* ════════ IL CASO ════════ */
  (function () {
    var A = $('pc-caso');
    var D = [
      { t: 'Dividi <strong>1 torta in 3 parti uguali</strong>. Con la calcolatrice fai 1 : 3. Che cosa scrive?', o: [['a', '0,3'], ['b', '0,33'], ['c', '0,3333… (il 3 non finisce mai)']], g: 'c', s: 'Il 3 si ripete all\'infinito: 0,333… Non si può scrivere tutto, quindi si scrive <strong>0,(3)</strong>: il 3 tra parentesi è il <strong>periodo</strong>.' },
      { t: 'Ora prendi le tre fette e le rimetti insieme: <strong>0,333… × 3</strong>. Quanto fa, secondo la logica?', o: [['a', '0,999… (non si arriva mai a 1)'], ['b', '1, una torta intera'], ['c', 'Non si può dire']], g: 'b', s: 'Tre fette da un terzo fanno <strong>una torta intera</strong>. Quindi 3 × 0,(3) = 1.' },
      { t: 'Ma 3 × 0,(3) si scrive anche <strong>0,(9)</strong>. Perciò 0,999… e 1 sono…', o: [['a', 'Due numeri vicinissimi ma diversi'], ['b', 'Lo stesso numero'], ['c', 'Diversi di un nulla, che però conta']], g: 'b', s: '<strong>0,(9) = 1</strong>. Non esiste nessun numero tra 0,999… e 1: sono due scritture dello stesso numero, come 1/2 e 0,5. (Più sotto lo dimostriamo con un trucco da due righe.)' }
    ];
    var i = 0, ok = 0;
    function disegna(ris) {
      if (i >= D.length) { A.innerHTML = '<div class="tt-fine"><p class="tt-et">Caso chiuso</p><p class="tt-q">Un numero può avere due scritture, e alcune non finiscono mai.</p><p class="tt-stat">Hai risposto giusto a ' + ok + ' su ' + D.length + '. Sotto: perché alcune divisioni non finiscono e come si torna alla frazione.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="pc-rifai">Rifai il caso</button></div></div>'; return; }
      var d = D[i], h = '<div class="tt-prog"><span>Domanda ' + (i + 1) + ' di ' + D.length + '</span></div><p class="tt-q">' + d.t + '</p>';
      if (!ris) h += '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + d.o.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      else h += '<p class="fz-fb ' + (ris.ok ? 'si' : 'mezzo') + '" role="status">' + (ris.ok ? 'Esatto! ' : 'Quasi: ') + d.s + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="pc-avanti">' + (i + 1 >= D.length ? 'Chiudi il caso' : 'Avanti') + '</button></div>';
      A.innerHTML = h; if (ris) A.querySelector('#pc-avanti').focus();
    }
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined) { var g = b.dataset.v === D[i].g; if (g) ok++; disegna({ ok: g }); return; }
      if (b.id === 'pc-avanti') { i++; disegna(); var x = A.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'pc-rifai') { i = 0; ok = 0; disegna(); }
    });
    disegna();
  })();

  /* ════════ LA DIVISIONE CHE NON FINISCE ════════ */
  (function () {
    var SD = $('dv-d'), SN = $('dv-n'), OUT = $('dv-out'), BT = $('dv-btn');
    var S = { n: 1, d: 7, k: 0, dig: [], r: 1, seen: {}, fine: false, rip: null };
    var h = ''; for (var d = 2; d <= 20; d++) h += '<option value="' + d + '">' + d + '</option>'; SD.innerHTML = h; SD.value = '7';
    function nOpz() { var d = +SD.value, s = ''; for (var n = 1; n < d; n++) s += '<option value="' + n + '">' + n + '</option>'; SN.innerHTML = s; SN.value = String(Math.min(S.n, d - 1)); }
    function ricomincia() { var n = +SN.value, d = +SD.value; S = { n: n, d: d, dig: [], r: n % d, seen: {}, fine: false, rip: null, righe: [] }; disegna(); }
    function passo() {
      if (S.fine) return;
      var r = S.r;
      if (r === 0) { S.fine = true; return; }
      if (S.seen[r] !== undefined) { S.fine = true; S.rip = S.seen[r]; return; }
      S.seen[r] = S.dig.length; var x = r * 10, c = Math.floor(x / S.d), nr = x % S.d;
      S.righe.push({ x: x, c: c, r: nr, da: r }); S.dig.push(c); S.r = nr;
      if (nr === 0) S.fine = true; else if (S.seen[nr] !== undefined) { S.fine = true; S.rip = S.seen[nr]; }
    }
    function disegna() {
      var dd = S.dig.join(''), vista = '0,' + (S.rip !== null ? dd.slice(0, S.rip) + '(' + dd.slice(S.rip) + ')' : dd + (S.fine ? '' : '…'));
      var tab = S.righe.map(function (r, k) { var evid = S.rip !== null && k >= S.rip; return '<tr' + (evid ? ' class="dv-rip"' : '') + '><td>' + r.x + ' : ' + S.d + '</td><td>' + r.c + '</td><td>' + r.r + '</td></tr>'; }).join('');
      OUT.innerHTML = '<p class="dv-ris" aria-live="polite">' + S.n + ' : ' + S.d + ' = <strong>' + vista + '</strong></p>' + (S.righe.length ? '<table class="dv-tab"><caption class="vh">Passaggi della divisione</caption><thead><tr><th scope="col">Dividendo : divisore</th><th scope="col">Cifra</th><th scope="col">Resto</th></tr></thead><tbody>' + tab + '</tbody></table>' : '<p class="mm-p">Premi «Prossima cifra»: si porta uno zero e si divide, come in colonna.</p>') + (S.fine ? (S.rip !== null ? '<p class="fz-fb si" role="status">Il resto <strong>' + S.r + '</strong> era già comparso: da qui le cifre <strong>si ripetono per sempre</strong>. Il periodo è <strong>' + dd.slice(S.rip) + '</strong> (' + (dd.length - S.rip) + ' cifr' + (dd.length - S.rip === 1 ? 'a' : 'e') + '). Con divisore ' + S.d + ' i resti possibili sono al massimo ' + (S.d - 1) + ' (1, 2, … ' + (S.d - 1) + '): prima o poi uno si ripete.</p>' : '<p class="fz-fb si" role="status">Il resto è 0: la divisione <strong>finisce</strong>. Il decimale è finito.</p>') : '');
      BT.innerHTML = S.fine ? '<button type="button" class="fz-btn sec" data-a="r">Ricomincia</button>' : '<button type="button" class="fz-btn" data-a="p">Prossima cifra</button><button type="button" class="fz-btn sec" data-a="t">Fino in fondo</button>';
    }
    BT.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'p') passo(); else if (b.dataset.a === 't') { var g = 0; while (!S.fine && g++ < 60) passo(); } else { ricomincia(); BT.querySelector('button').focus(); return; }
      disegna(); var x = BT.querySelector('button'); if (x) x.focus();
    });
    SD.addEventListener('change', function () { nOpz(); ricomincia(); });
    SN.addEventListener('change', ricomincia);
    nOpz(); ricomincia();
  })();

  /* ════════ CHI FINISCE E CHI NO ════════ */
  (function () {
    var A = $('fn-area'), S = { n: 0, d: 0, serie: 0, best: 0, ris: false, ok: 0, tot: 0 };
    function nuovo() {
      var pool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 30, 40, 45, 50], d = pesca(pool), n = rnd(1, d * 2 - 1);
      if (Math.random() < 0.3) { var g = pesca([2, 3, 4]); d *= g; n = rnd(1, 5) * g; }
      S.n = n; S.d = d; S.ris = false; disegna();
    }
    function disegna() {
      var h = '<p class="tt-q">La frazione ' + fr(S.n, S.d) + ' ha un decimale <strong>finito</strong> o <strong>periodico</strong>?</p><div class="tt-sc"><button type="button" class="fz-btn sec" data-v="f"' + (S.ris ? ' disabled' : '') + '>Finito</button><button type="button" class="fz-btn sec" data-v="p"' + (S.ris ? ' disabled' : '') + '>Periodico</button></div>';
      if (S.ris) {
        var rd = ridotta({ n: S.n, d: S.d }), f = finito(rd.d), x = expand(S.n, S.d);
        h += '<p class="fz-fb ' + (S.ultimoOk ? 'si' : 'no') + '" role="status">' + (S.ultimoOk ? 'Esatto! ' : 'Non proprio. ') + (rd.d !== S.d ? 'Prima riduci: ' + S.n + '/' + S.d + ' = ' + rd.n + '/' + rd.d + '. ' : '') + 'Il denominatore ' + rd.d + ' = ' + fattoriTesto(rd.d) + (f ? ': ci sono solo i fattori 2 e 5 (quelli di 10), quindi il decimale <strong>finisce</strong>: ' + S.n + ' : ' + S.d + ' = ' + testo(x) + '.' : ': c\'è un fattore diverso da 2 e 5, quindi il decimale è <strong>periodico</strong>: ' + testo(x) + '.') + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="fn-altra">Un\'altra frazione</button></div>';
      }
      h += '<p class="fz-conta">Giuste in fila: ' + S.serie + ' · record in questa visita: ' + S.best + '</p>';
      A.innerHTML = h;
    }
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'fn-altra') { nuovo(); A.querySelector('[data-v]').focus(); return; }
      if (b.dataset.v && !S.ris) { var rd = ridotta({ n: S.n, d: S.d }), f = finito(rd.d); S.ultimoOk = (b.dataset.v === 'f') === f; S.serie = S.ultimoOk ? S.serie + 1 : 0; S.best = Math.max(S.best, S.serie); S.ris = true; disegna(); A.querySelector('#fn-altra').focus(); }
    });
    nuovo();
  })();

  /* ════════ LA MACCHINA DELLA GENERATRICE ════════ */
  (function () {
    var IA = $('gn-a'), IP = $('gn-p'), II = $('gn-i'), OUT = $('gn-out');
    function agg() {
      var i = II.value.replace(/\D/g, ''), a = IA.value.replace(/\D/g, ''), p = IP.value.replace(/\D/g, '');
      if (i === '') i = '0';
      if (!p) { OUT.innerHTML = '<p class="mm-p">Scrivi almeno una cifra di <strong>periodo</strong> (la parte che si ripete).</p>'; return; }
      if (i.length > 3 || a.length > 3 || p.length > 4) { OUT.innerHTML = '<p class="mm-p">Per questo gioco bastano fino a 3 cifre per la parte intera e l\'antiperiodo, 4 per il periodo.</p>'; return; }
      var x = { i: +i, a: a, p: p }, f = genera(x), r = ridotta(f), Ap = x.i + a + p, A = x.i + a, den = '9'.repeat(p.length) + '0'.repeat(a.length);
      var tutti9 = /^9+$/.test(p);
      OUT.innerHTML = '<p class="mm-p">Il numero è <strong>' + testo(x) + '</strong>.</p><ol class="gn-passi"><li>Numero fino alla fine del primo periodo, senza virgola: <strong>' + (+Ap) + '</strong>.</li><li>Numero fino all\'antiperiodo, senza virgola: <strong>' + (+A) + '</strong>.</li><li>Differenza: ' + (+Ap) + ' − ' + (+A) + ' = <strong>' + f.n + '</strong>.</li><li>Denominatore: tanti <strong>9</strong> quante le cifre del periodo (' + p.length + '), seguiti da tanti <strong>0</strong> quante le cifre dell\'antiperiodo (' + a.length + '): <strong>' + den + '</strong>.</li><li>La frazione è ' + fr(f.n, f.d) + (r.d !== f.d ? ' e, ridotta, ' + fr(r.n, r.d) : '') + (r.d === 1 ? ' = <strong>' + r.n + '</strong>' : '') + '.</li></ol>' + (tutti9 ? '<p class="fz-fb si" role="status">Con il periodo tutto di 9 la frazione è un numero intero: <strong>' + testo(x) + ' = ' + r.n + '</strong>. Il tuo 0,(9) è proprio 1!</p>' : '');
    }
    [IA, IP, II].forEach(function (e) { e.addEventListener('input', agg); });
    agg();
  })();

  /* ════════ DOMANDE E TUTOR ════════ */
  var POOL = { 1: [3, 6, 9, 11, 12, 15], 2: [3, 6, 7, 9, 11, 12, 13, 14, 15, 18, 22, 24, 30], 3: [7, 13, 14, 18, 21, 24, 28, 33, 36, 44, 45, 55, 60, 11, 12] };
  function sceltaFr(liv, vuoi) { /* vuoi: 'sem' | 'mis' | 'fin' | 'per' */
    for (var k = 0; k < 400; k++) {
      var pool = vuoi === 'fin' ? [2, 4, 5, 8, 10, 16, 20, 25, 40, 50] : POOL[liv], d = pesca(pool), n = rnd(1, d - 1);
      var g = gcd(n, d); n /= g; var dd = d / g; if (dd === 1) continue;
      var x = expand(n, dd), i = rnd(0, liv === 1 ? 0 : liv === 2 ? 2 : 9); x.i += i;
      if (vuoi === 'fin') { if (x.p) continue; return { n: n, d: dd, x: x, i: i, nn: n, dd: dd }; }
      if (!x.p || x.a.length + x.p.length > 7) continue;
      if (vuoi === 'sem' && x.a) continue; if (vuoi === 'mis' && !x.a) continue;
      return { n: n, d: dd, x: x, i: i, nn: n + i * dd, dd: dd };
    }
    return { n: 1, d: 3, x: expand(1, 3), i: 0, nn: 1, dd: 3 };
  }
  function numI(att, aiuti, spiega, tit, testoP, lav) { return { tipo: 'num', atteso: att, titolo: tit, testo: testoP, lav: lav, verifica: function (v) { var x = T.intero(v); if (x === null) return { ok: false, msg: 'Scrivi un numero intero.' }; return { ok: x === att }; }, aiuti: aiuti, rivela: function () { return String(att); }, spiega: spiega }; }
  function fracPasso(n, d, aiuti, spiega, tit, testoP) {
    var r = ridotta({ n: n, d: d });
    return { tipo: 'frac', titolo: tit, testo: testoP, verifica: function (v) { var y = T.leggiFr(v.n, v.d); if (!y) return { ok: false, msg: 'Scrivi numeri interi (se è intero lascia vuoto il denominatore).' }; if (y.n === r.n && y.d === r.d) return { ok: true }; if (y.n * r.d === r.n * y.d) return { ok: false, msg: 'Il valore è giusto, ma riducila ai minimi termini.' }; return { ok: false }; }, aiuti: aiuti, rivela: function () { return fr(r.n, r.d); }, spiega: spiega };
  }
  function perText(att, aiuti, spiega, tit, testoP, lav) {
    return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, lav: lav, verifica: function (v) {
      var x = parse(v); if (!x) return { ok: false, msg: 'Scrivi il numero con la virgola e il periodo tra parentesi, per esempio 0,1(6).' };
      if (testo(x) === testo(att)) return { ok: true };
      var a = genera(x), b = genera(att); if (a.n * b.d === b.n * a.d) return { ok: false, msg: 'È lo stesso numero, ma scrivi il periodo più corto e l\'antiperiodo più breve possibile.' };
      return { ok: false };
    }, aiuti: aiuti, rivela: function () { return testo(att); }, spiega: spiega };
  }
  var Gen = {};
  Gen.fin = function (liv) {
    var s = Math.random() < 0.5 ? sceltaFr(liv, 'fin') : sceltaFr(liv, 'per'), n = s.n, d = s.d, mult = pesca([1, 1, 2, 3]); n *= mult; d *= mult;
    var rd = ridotta({ n: n, d: d }), f = finito(rd.d), x = expand(n, d);
    var q = Q.scelta(f ? 'f' : 'p', [['f', 'Finito'], ['p', 'Periodico']], { html: '<p class="tt-q">Il decimale di ' + fr(n, d) + ' è finito o periodico?</p>', aiuti: ['Riduci prima la frazione ai minimi termini.', 'Scomponi il denominatore: se ci sono solo 2 e 5, è finito.'] });
    q.verifica = function (v) { return { ok: v === (f ? 'f' : 'p'), msg: 'Riduci la frazione (' + rd.n + '/' + rd.d + ') e scomponi ' + rd.d + ' = ' + fattoriTesto(rd.d) + '.' }; };
    q.rivela = function () { return f ? 'finito: ' + testo(x) : 'periodico: ' + testo(x); };
    return q;
  };
  Gen.periodo = function (liv) {
    var s = sceltaFr(liv, 'per'), x = s.x;
    var q = Q.num(x.p.length, { html: '<p class="tt-q">Scrivi come numero decimale ' + fr(s.nn, s.dd) + ' (dividendo). Quante cifre ha il <strong>periodo</strong>?</p>', aiuti: ['Fai la divisione e guarda quando un resto torna uguale a uno già comparso.', 'I resti, nell\'ordine: ' + resti(s.nn % s.dd, s.dd).lista.join(', ') + '…'], formato: 'Scrivi quante cifre ha il periodo.' });
    q.rivela = function () { return x.p.length + ' (il periodo è ' + x.p + ')'; };
    return q;
  };
  function defDec(nn, dd) {
    var x = expand(nn, dd), per = !!x.p, a = x.a, p = x.p;
    return { testata: '<p class="tt-q">Scrivi come numero decimale la frazione ' + fr(nn, dd) + '.</p>', passi: [
      Object.assign(Q.scelta(per ? 'p' : 'f', [['f', 'Finito'], ['p', 'Periodico']], { aiuti: ['Riduci la frazione e scomponi il denominatore: solo 2 e 5 → finito.'] }), { titolo: 'Finito o periodico?', testo: 'Il decimale di ' + nn + '/' + dd + ' finisce oppure ha un periodo?', verifica: function (v) { return { ok: v === (per ? 'p' : 'f') }; }, spiega: per ? 'Il denominatore ridotto ' + dd + ' = ' + fattoriTesto(dd) + ' ha un fattore diverso da 2 e 5.' : 'Il denominatore ' + dd + ' = ' + fattoriTesto(dd) + ' ha solo fattori 2 e 5.', rivela: function () { return per ? 'periodico' : 'finito'; } }),
      per ? numI(p.length, ['I resti sono: ' + resti(nn % dd, dd).lista.join(', ') + '… e poi si ripete.', 'Conta quanti resti diversi compaiono prima di tornare a uno già visto.'], 'Il periodo è <strong>' + p + '</strong>: ' + p.length + ' cifr' + (p.length === 1 ? 'a' : 'e') + '.', 'Il periodo', 'Quante cifre ha il periodo?') : numI(a.length, ['Quante cifre ha il decimale dopo la virgola?'], 'Dopo la virgola ci sono ' + a.length + ' cifre.', 'Le cifre', 'Quante cifre ci sono dopo la virgola?'),
      perText(x, ['Dividi ' + nn + ' : ' + dd + ' e riporta le cifre; se è periodico, metti il periodo tra parentesi.'], 'Risultato: <strong>' + testo(x) + '</strong>.', 'Scrivi il decimale', 'Scrivi ' + nn + '/' + dd + ' come numero decimale' + (per ? ' (periodo tra parentesi)' : '') + '.')
    ], fine: '<p class="tt-q">' + nn + '/' + dd + ' = ' + testo(x) + '</p><p class="mm-p">' + (per ? 'Il periodo nasce perché i resti possibili sono pochi: prima o poi uno si ripete.' : 'Decimale finito: il denominatore ha solo 2 e 5.') + '</p>' };
  }
  function defGen(x, nn, dd) { /* periodico → frazione */
    var semplice = !x.a, A = x.i + x.a, Ap = x.i + x.a + x.p, f = genera(x), r = ridotta(f), den = '9'.repeat(x.p.length) + '0'.repeat(x.a.length);
    var passi = [];
    if (semplice) {
      passi.push(numI(+Ap, ['Togli virgola e parentesi: scrivi di seguito parte intera e periodo.'], 'Con ' + testo(x) + ' si ottiene <strong>' + (+Ap) + '</strong>.', 'Il periodo scritto in fila', 'Togli virgola e parentesi: quale numero ottieni?', M('<mn>' + testo(x) + '</mn>')));
      if (x.i) passi.push(numI(x.i, ['La parte intera è quella prima della virgola.'], 'Si sottrae la parte intera: ' + x.i + '.', 'La parte intera', 'Quale numero sottrai (la parte intera)?'));
      passi.push(numI(f.n, ['Fai ' + (+Ap) + ' − ' + (+A) + '.'], (+Ap) + ' − ' + (+A) + ' = <strong>' + f.n + '</strong>.', 'La differenza', 'Quanto fa ' + (+Ap) + ' − ' + (+A) + '? (si sottrae la parte che non si ripete: qui solo la parte intera)'));
    } else {
      passi.push(numI(+Ap, ['Togli virgola e parentesi: scrivi di seguito parte intera, antiperiodo e periodo.'], 'Si ottiene <strong>' + (+Ap) + '</strong>.', 'Tutto in fila', 'Togli virgola e parentesi: quale numero ottieni?', M('<mn>' + testo(x) + '</mn>')));
      passi.push(numI(+A, ['Parte intera e antiperiodo, senza il periodo.'], 'Senza il periodo: <strong>' + (+A) + '</strong>.', 'Senza il periodo', 'Ora scrivi solo parte intera e antiperiodo, senza il periodo: quale numero?'));
      passi.push(numI(f.n, ['Sottrai: ' + (+Ap) + ' − ' + (+A) + '.'], (+Ap) + ' − ' + (+A) + ' = <strong>' + f.n + '</strong>: sarà il numeratore.', 'La differenza', 'Quanto fa ' + (+Ap) + ' − ' + (+A) + '?'));
    }
    passi.push(numI(f.d, ['Tanti <strong>9</strong> quante le cifre del periodo (' + x.p.length + ')' + (x.a ? ', poi tanti <strong>0</strong> quante le cifre dell\'antiperiodo (' + x.a.length + ')' : '') + '.'], 'Il denominatore è <strong>' + den + '</strong>.', 'Il denominatore', 'Quale denominatore ottieni? (' + x.p.length + ' nove' + (x.a ? ' e ' + x.a.length + ' zero' + (x.a.length > 1 ? 'i' : '') : '') + ')'));
    passi.push(fracPasso(f.n, f.d, ['Dividi numeratore e denominatore per il loro MCD (' + gcd(f.n, f.d) + ').'], 'La frazione generatrice è ' + fr(r.n, r.d) + '.', 'Riduci la frazione', 'Scrivi ' + f.n + '/' + f.d + ' ridotta ai minimi termini.'));
    return { testata: '<p class="tt-q">Trova la <strong>frazione generatrice</strong> di <strong>' + testo(x) + '</strong>.</p>', passi: passi, fine: '<p class="tt-q">' + testo(x) + ' = ' + (r.d === 1 ? r.n : r.n + '/' + r.d) + '</p><p class="mm-p">Regola: (numero fino al periodo − numero fino all\'antiperiodo) / (tanti 9 quante le cifre del periodo, tanti 0 quante le cifre dell\'antiperiodo).</p>' };
  }
  function gGen(vuoi, liv) {
    var s = sceltaFr(liv, vuoi), x = s.x, r = ridotta(genera(x)), q = Q.frac(r.n, r.d, { html: '<p class="tt-q">Trova la frazione generatrice di <strong>' + testo(x) + '</strong>' + (vuoi === 'sem' ? ' (periodo semplice)' : ' (periodo misto)') + '. Scrivila ridotta.</p>', aiuti: ['Numero fino alla fine del periodo − numero fino all\'antiperiodo.', 'Denominatore: tanti 9 quante le cifre del periodo, poi tanti 0 quante le cifre dell\'antiperiodo.'] });
    q.rivela = function () { return r.d === 1 ? String(r.n) : r.n + '/' + r.d; };
    var def = function () { return defGen(x); }; q.def = def; q.guida = function () { TU.avvia(def, $('metodo')); }; q.x = x; return q;
  }
  Gen.sem = function (liv) { return gGen('sem', liv); };
  Gen.mis = function (liv) { return gGen('mis', liv); };
  /* per decimale serve nn/dd nel def: rigenero con closure */
  Gen.decimale = (function () {
    return function (liv) {
      var s = Math.random() < 0.25 ? sceltaFr(liv, 'fin') : sceltaFr(liv, 'per'), x = s.x, nn = s.nn, dd = s.dd;
      var rs = resti(nn % dd, dd);
      var q = Q.dec('0', { html: '<p class="tt-q">Scrivi come numero decimale la frazione ' + fr(nn, dd) + '.</p>', aiuti: ['Dividi ' + nn + ' per ' + dd + ' fino a quando il resto diventa 0 o si ripete.', 'Resti: ' + rs.lista.join(', ') + (rs.ripete !== null ? '… (poi torna ' + rs.ripete + ')' : ' poi 0') + '.'], formato: 'Se è periodico, metti il periodo tra parentesi: 0,1(6).' });
      q.verifica = function (v) { var y = parse(v); if (!y) return { ok: false, msg: 'Scrivi il numero con la virgola e, se serve, il periodo tra parentesi: 0,1(6).' }; if (testo(y) === testo(x)) return { ok: true }; var a = genera(y), b = genera(x); if (a.n * b.d === b.n * a.d) return { ok: false, quasi: true, msg: 'È lo stesso numero, ma scrivi il periodo più corto e l\'antiperiodo più breve possibile.' }; return { ok: false }; };
      q.rivela = function () { return testo(x); };
      var def = function () { return defDec(nn, dd); }; q.def = def; q.guida = function () { TU.avvia(def, $('metodo')); }; return q;
    };
  })();
  Gen.dec = Gen.decimale;
  var NOMI_TIPI = ['fin', 'periodo', 'decimale', 'sem', 'mis'];

  /* tutor: due tipi di percorso */
  var TU = TUTOR.crea($('tt-area'), { altro: function () { nuovoTutor(); }, allenati: URL + '#allenati' });
  function nuovoTutor() {
    var t = $('tu-tipo').value, liv = +$('tu-liv').value, q;
    if (t === 'dec') q = Gen.decimale(liv); else q = Gen[t](liv);
    TU.avvia(q.def);
  }
  $('tu-nuovo').addEventListener('click', nuovoTutor);
  ['tu-tipo', 'tu-liv'].forEach(function (id) { $(id).addEventListener('change', nuovoTutor); });
  nuovoTutor();

  /* ════════ ALLENATI ════════ */
  T.allenati({ area: 'ex-area', conta: 'ex-conta', cambia: ['ex-tipo', 'ex-liv'],
    genera: function () { var t = $('ex-tipo').value; if (t === 'tutto') t = pesca(NOMI_TIPI); var q = Gen[t](+$('ex-liv').value); q.et = 'Esercizio'; if (!q.guida && q.def) q.guida = function () { TU.avvia(q.def, $('metodo')); }; return q; },
    guida: function (q) { if (q.guida) q.guida(); } });

  /* ════════ IL SERVIZIO ════════ */
  var COM = [['fin', 1], ['periodo', 1], ['decimale', 2], ['sem', 2], ['mis', 3], ['mis', 3]];
  var CTX = ['Il tavolo 3 ordina:', 'Dalla cucina chiedono:', 'Il cassiere deve controllare:', 'Il magazziniere segnala:', 'Il pasticciere chiede:', 'L\'ordine speciale dello chef:'];
  T.servizio({ area: 'sv-area', chiave: ID, livelli: [0, 1, 2, 3, 4, 5], tempoMax: 90,
    genera: function (l, i) { var q = Gen[COM[i][0]](COM[i][1]); q.intro = CTX[i]; q.soluzione = function () { return '<p class="mm-p">Risposta: <strong>' + q.rivela() + '</strong>. Il metodo passo passo lo trovi nella sezione «Il metodo».</p>'; }; return q; } });

  /* ════════ MISSIONE ════════ */
  function mf(intro, n, d, hint, dopo) { var q = Q.frac(n, d, { hint: hint, dopo: dopo }); q.intro = intro; return q; }
  function mt(intro, att, hint, dopo) { var q = Q.dec('0', { hint: hint, dopo: dopo, formato: 'Periodo tra parentesi, per esempio 0,1(6).' }); q.verifica = function (v) { var y = parse(v); if (!y) return { ok: false, msg: 'Scrivi il numero con la virgola e il periodo tra parentesi, per esempio 0,1(6).' }; return { ok: testo(y) === att }; }; q.intro = intro; return q; }
  var MI = [
    mt('Dividi <strong>1 torta in 6 fette uguali</strong> e ne prendi una. Scrivi 1/6 come numero decimale (periodo tra parentesi).', '0,1(6)', 'Dividi 1 : 6: dopo il primo 1 il resto 4 porta sempre al 6.', '1/6 = 0,1(6): il 6 si ripete.'),
    mf('Il pasticciere misura <strong>0,(36)</strong> kg di cioccolato. Scrivilo come frazione ridotta.', 4, 11, '36/99, poi riduci con il MCD (9).', '0,(36) = 36/99 = 4/11.'),
    mf('Un tempo di cottura è <strong>0,5(3)</strong> d\'ora. Scrivilo come frazione ridotta.', 8, 15, 'Misto: (53 − 5)/90 = 48/90, poi riduci.', '0,5(3) = 48/90 = 8/15.'),
    mf('Il rapporto di una ricetta è <strong>1,(6)</strong>. Scrivilo come frazione ridotta (anche impropria).', 5, 3, '(16 − 1)/9 = 15/9, poi riduci.', '1,(6) = 15/9 = 5/3.'),
    mf('La calcolatrice dice <strong>0,(9)</strong>. Scrivilo come frazione ridotta: che numero è?', 1, 1, '9/9: quanto fa? Scrivi 1 al numeratore, vuoto il denominatore, oppure 1/1.', '0,(9) = 9/9 = 1: lo stesso numero, scritto in un altro modo.')
  ];
  T.missione({ area: 'mi-area', id: ID, titolo: 'Dal decimale alla frazione', icona: '🔁', items: MI, rip: [
    { d: 'Scrivi 1/3 come numero decimale.', r: '0,(3)', s: '1 : 3 dà sempre resto 1: il 3 si ripete.' },
    { d: 'Il decimale di 3/8 è finito o periodico?', r: 'Finito', s: '8 = 2 · 2 · 2: solo fattori 2, quindi finito (0,375).' },
    { d: 'Frazione generatrice di 0,(6).', r: '2/3', s: '6/9 = 2/3.' }
  ], url: URL });

  if (window.RIPASSO) RIPASSO.invito($('mt-ripasso'), 'mate-' + ID);
  if (window.PERCORSO) PERCORSO.vicine($('mt-tappe-nav'), ID);
  window.PERIODICI = { Gen: Gen, expand: expand, genera: genera, testo: testo, parse: parse, NOMI_TIPI: NOMI_TIPI, finito: finito, ridotta: ridotta };
})();
