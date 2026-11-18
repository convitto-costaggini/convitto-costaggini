/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Frazioni passo passo
   Motore di calcolo esatto (BigInt): nessun numero decimale approssimato,
   nessun dato inviato o salvato. Le formule sono scritte in MathML.
   Uso:
     FRAZIONI.calcola({ n1, d1, k1, op, n2, d2, k2 })
       op: '+', '-', '*', ':'   k = esponente intero (anche negativo o 0)
       restituisce { passi:[{g,t,p,m[]}], risultato:{n,d}, testo, misto, decimale }
       oppure lancia un ErroreFz con un messaggio per l'utente.
   ════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  function ErroreFz(msg) { this.message = msg; this.name = 'ErroreFz'; }
  ErroreFz.prototype = Object.create(Error.prototype);

  /* ── aritmetica esatta ── */
  var abs = function (x) { return x < 0n ? -x : x; };
  function gcd(a, b) { a = abs(a); b = abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function mcm(a, b) { return a / gcd(a, b) * b; }
  function ridotta(f) {
    if (f.n === 0n) return { n: 0n, d: 1n };
    var g = gcd(f.n, f.d);
    return g > 1n ? { n: f.n / g, d: f.d / g } : f;
  }
  function reciproca(f) { return f.n < 0n ? { n: -f.d, d: -f.n } : { n: f.d, d: f.n }; }
  function uguali(a, b) { return a.n * b.d === b.n * a.d; }
  function fattori(x) { /* x: Number ≤ 1e12 → [[primo, esponente], …] */
    var out = [];
    for (var p = 2; p * p <= x; p++) {
      var e = 0;
      while (x % p === 0) { x /= p; e++; }
      if (e) out.push([p, e]);
    }
    if (x > 1) out.push([x, 1]);
    return out;
  }

  /* ── MathML ── */
  var mn = function (x) { return '<mn>' + x + '</mn>'; };
  var mo = function (x) { return '<mo>' + x + '</mo>'; };
  var mt = function (x) { return '<mtext>' + x + '</mtext>'; };
  var row = function () { return '<mrow>' + Array.prototype.join.call(arguments, '') + '</mrow>'; };
  var par = function (x) { return row(mo('('), x, mo(')')); };
  var eq = function () { return row(Array.prototype.join.call(arguments, mo('='))); };
  function num(b) { b = BigInt(b); return b < 0n ? row(mo('−'), mn(-b)) : mn(b); }
  function parNum(b) { b = BigInt(b); return b < 0n ? par(num(b)) : num(b); }
  function fr(f) { /* frazione con segno davanti; se d=1 è un intero */
    if (f.d === 1n) return num(f.n);
    return row(f.n < 0n ? mo('−') : '', '<mfrac>' + mn(abs(f.n)) + mn(f.d) + '</mfrac>');
  }
  function parFr(f) { return f.n < 0n ? par(fr(f)) : fr(f); }
  function mf(a, b) { return '<mfrac>' + row(a) + row(b) + '</mfrac>'; }
  function pot(baseMath, e) { return '<msup>' + baseMath + row(num(e)) + '</msup>'; }
  function potFr(f, e) { /* (frazione)^e; senza parentesi per un intero positivo */
    var b = (f.d === 1n && f.n >= 0n) ? fr(f) : par(fr(f));
    return pot(b, e);
  }
  function potNum(x, e) { return pot(x < 0n ? par(num(x)) : mn(x), e); }
  function math(x, blocco) { return '<math' + (blocco ? ' display="block"' : '') + '>' + x + '</math>'; }
  var SIMB = { '+': '+', '-': '−', '*': '·', ':': ':' };

  /* ── espressione scritta come l'ha data l'utente ── */
  function operandoMath(n, d, k, secondo) {
    var f = { n: BigInt(n), d: BigInt(d) };
    if (BigInt(k) !== 1n) return potFr(f, BigInt(k));
    return (secondo && f.n < 0n) ? par(fr(f)) : fr(f);
  }
  function espressione(q) {
    return row(operandoMath(q.n1, q.d1, q.k1, false), mo(SIMB[q.op]), operandoMath(q.n2, q.d2, q.k2, true));
  }

  /* ── decimale esatto o periodico ── */
  function decimale(f) {
    var neg = f.n < 0n, n = abs(f.n), d = f.d, ip = n / d, r = n % d;
    var segno = neg ? '−' : '';
    if (r === 0n) return { s: segno + ip, tipo: 'intero' };
    var visti = {}, cifre = [];
    while (r !== 0n && visti[r] === undefined && cifre.length < 60) {
      visti[r] = cifre.length; r *= 10n; cifre.push((r / d).toString()); r %= d;
    }
    if (r === 0n) return { s: segno + ip + ',' + cifre.join(''), tipo: 'finito' };
    if (visti[r] !== undefined) {
      var i = visti[r];
      return { s: segno + ip + ',' + cifre.slice(0, i).join('') + '(' + cifre.slice(i).join('') + ')', tipo: 'periodico', periodo: cifre.slice(i).join('') };
    }
    return { s: segno + ip + ',' + cifre.join('') + '…', tipo: 'troncato' };
  }
  function testoFr(f) { return f.d === 1n ? String(f.n).replace('-', '−') : String(f.n).replace('-', '−') + '/' + f.d; }

  /* ── la costruzione dei passaggi ── */
  function calcola(q) {
    var passi = [];
    function P(g, t, p, m) { passi.push({ g: g, t: t, p: p, m: m || [] }); }
    function intero(v, nome) {
      var s = String(v).trim().replace('−', '-');
      if (!/^-?\d+$/.test(s)) throw new ErroreFz('Il campo «' + nome + '» deve contenere un numero intero.');
      return BigInt(s);
    }
    var n1 = intero(q.n1, 'numeratore della prima frazione'), d1 = intero(q.d1, 'denominatore della prima frazione'), k1 = intero(q.k1, 'esponente della prima frazione');
    var n2 = intero(q.n2, 'numeratore della seconda frazione'), d2 = intero(q.d2, 'denominatore della seconda frazione'), k2 = intero(q.k2, 'esponente della seconda frazione');
    if (!SIMB[q.op]) throw new ErroreFz('Scegli un\'operazione.');
    if (d1 <= 0n || d2 <= 0n) throw new ErroreFz('Il denominatore deve essere un intero positivo: se la frazione è negativa, il segno meno va scritto al numeratore. Il denominatore 0 non è ammesso.');
    var LIM = 10000n;
    if (abs(n1) > LIM || abs(n2) > LIM || d1 > LIM || d2 > LIM) throw new ErroreFz('Per tenere i calcoli leggibili, numeratori e denominatori arrivano fino a 10000.');
    if (abs(k1) > 9n || abs(k2) > 9n) throw new ErroreFz('Gli esponenti vanno da −9 a 9.');

    P('Il calcolo', 'Che cosa calcoliamo', 'Ecco l\'espressione, scritta come l\'hai data.', [math(espressione({ n1: n1, d1: d1, k1: k1, op: q.op, n2: n2, d2: d2, k2: k2 }), true)]);

    /* una frazione con il suo esponente → una frazione */
    function operando(nome, g, n, d, k) {
      var f = { n: n, d: d };
      var conPot = k !== 1n;
      var r = ridotta(f);
      if (f.n === 0n && f.d !== 1n) {
        P(g, 'La frazione vale 0', 'Una frazione con numeratore 0 (e denominatore diverso da 0) vale 0.', [math(eq(fr(f), mn(0)), true)]);
        f = { n: 0n, d: 1n };
      } else if (r.d !== f.d) {
        var gg = gcd(f.n, f.d);
        P(g, 'Semplifica la frazione' + (conPot ? ' (conviene farlo prima della potenza)' : ''),
          'Numeratore e denominatore hanno il fattore comune ' + gg + ' (è il M.C.D.): si dividono entrambi per ' + gg + '.',
          [math(eq(fr(f), mf(num(f.n) + mo(':') + mn(gg), num(f.d) + mo(':') + mn(gg)), fr(r)), true)]);
        f = r;
      }
      if (!conPot) return f;

      if (k === 0n) {
        if (f.n === 0n) throw new ErroreFz('0 elevato a 0 è una forma indeterminata: non ha un valore, quindi non si può calcolare.');
        P(g, 'Esponente 0', 'Ogni numero diverso da 0 elevato a 0 vale 1.', [math(eq(potFr(f, 0n), mn(1)), true)]);
        return { n: 1n, d: 1n };
      }
      var b = f, e = k;
      if (k < 0n) {
        if (f.n === 0n) throw new ErroreFz('0 elevato a un esponente negativo non si può calcolare: servirebbe il reciproco di 0, che non esiste.');
        var rec = reciproca(f);
        P(g, 'Esponente negativo: si capovolge la frazione',
          'Un esponente negativo si elimina scambiando numeratore e denominatore (frazione reciproca) e cambiando segno all\'esponente' + (f.n < 0n ? '. Il segno meno resta al numeratore.' : '.'),
          [math(eq(potFr(f, k), potFr(rec, -k)), true)]);
        b = rec; e = -k;
        if (e === 1n) return b;
      }
      var N = b.n ** e, D = b.d ** e, R = { n: N, d: D };
      var nota = '';
      if (b.n < 0n) nota = e % 2n === 0n ? ' L\'esponente è pari: un numero negativo elevato a esponente pari dà un risultato positivo.' : ' L\'esponente è dispari: un numero negativo elevato a esponente dispari dà un risultato negativo.';
      if (b.n === 0n) {
        P(g, 'Potenza di zero', '0 elevato a un esponente positivo vale 0.', [math(eq(potFr(b, e), mn(0)), true)]);
        return { n: 0n, d: 1n };
      }
      if (b.d === 1n) {
        P(g, 'Calcola la potenza', 'Si moltiplica la base per sé stessa ' + e + ' volte.' + nota, [math(eq(potFr(b, e), fr(R)), true)]);
      } else {
        P(g, 'Eleva numeratore e denominatore', 'La potenza di una frazione è la frazione delle potenze: si eleva all\'esponente ' + e + ' sia il numeratore sia il denominatore.' + nota,
          [math(eq(potFr(b, e), mf(potNum(b.n, e), potNum(b.d, e)), fr(R)), true)]);
      }
      return R;
    }

    var X = operando('prima', 'La prima frazione', n1, d1, k1);
    var Y = operando('seconda', 'La seconda frazione', n2, d2, k2);
    var G = 'L\'operazione';
    var ris;

    /* chiude con la semplificazione del risultato */
    function chiudi(f, introIfDiff) {
      if (f.n === 0n) {
        if (f.d !== 1n) P(G, 'Il risultato è 0', 'Il numeratore è 0: la frazione vale 0.', [math(eq(fr(f), mn(0)), true)]);
        return { n: 0n, d: 1n };
      }
      var g = gcd(f.n, f.d);
      if (g > 1n) {
        var r = { n: f.n / g, d: f.d / g };
        P(G, 'Semplifica il risultato', 'Numeratore e denominatore hanno il fattore comune ' + g + ' (M.C.D.): si dividono entrambi per ' + g + '.',
          [math(eq(fr(f), mf(num(f.n) + mo(':') + mn(g), num(f.d) + mo(':') + mn(g)), fr(r)), true)]);
        return r;
      }
      if (f.d !== 1n) P(G, 'Controlla se si può semplificare', 'Numeratore e denominatore non hanno fattori in comune: la frazione è già ridotta ai minimi termini.');
      return f;
    }

    function prodotto(A, B) {
      if (A.n === 0n || B.n === 0n) {
        P(G, 'Un fattore è 0', 'Se uno dei fattori è 0, il prodotto è 0.', [math(eq(row(fr(A), mo('·'), parFr(B)), mn(0)), true)]);
        return { n: 0n, d: 1n };
      }
      var a = A.n, b = A.d, c = B.n, d = B.d;
      P(G, 'Il prodotto di frazioni', 'Il prodotto di due frazioni è la frazione che ha per numeratore il prodotto dei numeratori e per denominatore il prodotto dei denominatori. Prima conviene semplificare «in croce»: un numeratore con il denominatore dell\'altra frazione.',
        [math(row(mf(mt('a'), mt('b')), mo('·'), mf(mt('c'), mt('d')), mo('='), mf(row(mt('a'), mo('·'), mt('c')), row(mt('b'), mo('·'), mt('d')))), true)]);
      var g1 = gcd(a, d), g2 = gcd(c, b);
      if (g1 > 1n || g2 > 1n) {
        var parti = [];
        if (g1 > 1n) parti.push('il numeratore ' + String(a).replace('-', '−') + ' e il denominatore ' + d + ' si dividono per ' + g1);
        if (g2 > 1n) parti.push('il numeratore ' + String(c).replace('-', '−') + ' e il denominatore ' + b + ' si dividono per ' + g2);
        var a2 = a / g1, d2x = d / g1, c2 = c / g2, b2 = b / g2;
        P(G, 'Semplifica in croce', 'Si può semplificare: ' + parti.join('; ') + '.',
          [math(eq(row(fr({ n: a, d: b }), mo('·'), parFr({ n: c, d: d })), row(fr({ n: a2, d: b2 }), mo('·'), parFr({ n: c2, d: d2x }))), true)]);
        a = a2; b = b2; c = c2; d = d2x;
      } else {
        P(G, 'Semplifica in croce', 'Nessuna semplificazione possibile: i numeratori non hanno fattori in comune con i denominatori «opposti».');
      }
      var segno = '';
      if (a < 0n || c < 0n) segno = (a < 0n) !== (c < 0n) ? ' I segni sono discordi: il prodotto è negativo.' : ' I segni sono concordi (due meno): il prodotto è positivo.';
      var R = { n: a * c, d: b * d };
      P(G, 'Moltiplica numeratori e denominatori', 'Si moltiplicano i numeratori tra loro e i denominatori tra loro.' + segno,
        [math(eq(row(fr({ n: a, d: b }), mo('·'), parFr({ n: c, d: d })), mf(num(a) + mo('·') + parNum(c), num(b) + mo('·') + mn(d)), fr(R)), true)]);
      return R;
    }

    function sommaDiff(A, B, segno) {
      var s = segno > 0 ? '+' : '−';
      var verbo = segno > 0 ? 'si sommano' : 'si sottraggono';
      P(G, segno > 0 ? 'La somma' : 'La differenza', 'Per ' + (segno > 0 ? 'sommare' : 'sottrarre') + ' due frazioni servono frazioni con lo stesso denominatore.',
        [math(row(fr(A), mo(s), parFr(B)), true)]);
      var N1 = A.n, N2 = B.n, m = A.d;
      if (A.d === B.d) {
        P(G, 'Stesso denominatore', 'Le due frazioni hanno già lo stesso denominatore (' + m + '): ' + verbo + ' i numeratori e il denominatore resta invariato.', []);
      } else {
        m = mcm(A.d, B.d);
        var k1x = m / A.d, k2x = m / B.d;
        var righe = [];
        var testo = 'I denominatori sono diversi: si cerca il più piccolo denominatore comune, cioè il m.c.m. di ' + A.d + ' e ' + B.d + '.';
        if (m <= 1000000000n) {
          [A.d, B.d].forEach(function (dx) {
            if (dx === 1n) return;
            var ff = fattori(Number(dx));
            if (ff.length === 1 && ff[0][1] === 1) righe.push(math(row(mn(dx), mt('&#160;è un numero primo')), true));
            else righe.push(math(eq(mn(dx), ff.map(function (p) { return p[1] > 1 ? '<msup>' + mn(p[0]) + mn(p[1]) + '</msup>' : mn(p[0]); }).join(mo('·'))), true));
          });
          var mp = {};
          [A.d, B.d].forEach(function (dx) { fattori(Number(dx)).forEach(function (p) { if (!mp[p[0]] || mp[p[0]] < p[1]) mp[p[0]] = p[1]; }); });
          var ks = Object.keys(mp).map(Number).sort(function (x, y) { return x - y; });
          var pm = ks.map(function (p) { return mp[p] > 1 ? '<msup>' + mn(p) + mn(mp[p]) + '</msup>' : mn(p); }).join(mo('·'));
          testo += ' Si scompongono in fattori primi e si prendono tutti i fattori, comuni e non comuni, col maggiore esponente.';
          righe.push(math(eq(row(mt('m.c.m.'), par(mn(A.d) + mo(',') + mn(B.d))), pm, mn(m)), true));
        } else {
          righe.push(math(eq(row(mt('m.c.m.'), par(mn(A.d) + mo(',') + mn(B.d))), mn(m)), true));
        }
        P(G, 'Il denominatore comune (m.c.m.)', testo, righe);
        var tr = [];
        var tt = 'Ogni frazione si trasforma in una equivalente con denominatore ' + m + ': si divide il m.c.m. per il suo denominatore e si moltiplica il numeratore per il risultato.';
        tr.push(math(row(mn(m), mo(':'), mn(A.d), mo('='), mn(k1x), mt('&#160;&#160;&#160;&#160;'), mn(m), mo(':'), mn(B.d), mo('='), mn(k2x)), true));
        function trasf(F, kx) {
          return math(eq(fr(F), mf(num(F.n) + mo('·') + mn(kx), mn(F.d) + mo('·') + mn(kx)), fr({ n: F.n * kx, d: m })), true);
        }
        if (k1x > 1n) tr.push(trasf(A, k1x));
        if (k2x > 1n) tr.push(trasf(B, k2x));
        if (k1x === 1n) tt += ' La prima ha già denominatore ' + m + '.';
        if (k2x === 1n) tt += ' La seconda ha già denominatore ' + m + '.';
        P(G, 'Trasforma le frazioni', tt, tr);
        N1 = A.n * k1x; N2 = B.n * k2x;
      }
      var S = segno > 0 ? N1 + N2 : N1 - N2;
      P(G, segno > 0 ? 'Somma i numeratori' : 'Sottrai i numeratori', 'Il denominatore ' + m + ' resta; ' + verbo + ' i numeratori.',
        [math(eq(row(fr({ n: N1, d: m }), mo(s), parFr({ n: N2, d: m })), mf(num(N1) + mo(s) + parNum(N2), mn(m)), fr({ n: S, d: m })), true)]);
      return { n: S, d: m };
    }

    if (q.op === '+') ris = chiudi(sommaDiff(X, Y, 1));
    else if (q.op === '-') ris = chiudi(sommaDiff(X, Y, -1));
    else if (q.op === '*') ris = chiudi(prodotto(X, Y));
    else {
      if (Y.n === 0n) throw new ErroreFz('Non si può dividere per 0: la seconda frazione vale 0, e la divisione per 0 non è definita.');
      var Yr = reciproca(Y);
      P(G, 'La divisione', 'Dividere per una frazione equivale a moltiplicare per la sua frazione reciproca: si scambiano numeratore e denominatore (il segno resta al numeratore).',
        [math(eq(row(fr(X), mo(':'), parFr(Y)), row(fr(X), mo('·'), parFr(Yr))), true)]);
      ris = chiudi(prodotto(X, Yr));
    }
    ris = ridotta(ris);

    var misto = null;
    if (ris.d !== 1n && abs(ris.n) > ris.d) {
      var qq = abs(ris.n) / ris.d, rr = abs(ris.n) % ris.d;
      misto = { math: math(row(ris.n < 0n ? mo('−') : '', mn(qq), '<mfrac>' + mn(rr) + mn(ris.d) + '</mfrac>')), testo: (ris.n < 0n ? '−' : '') + qq + ' ' + rr + '/' + ris.d };
    }
    return { passi: passi, risultato: ris, testo: testoFr(ris), mathRis: math(fr(ris)), misto: misto, decimale: decimale(ris), espressione: math(espressione(q)) };
  }

  /* ── esercizi casuali ── */
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function scegli(arr) { return arr[rnd(0, arr.length - 1)]; }
  function copr(a, b) { return gcd(BigInt(a), BigInt(b)) === 1n; }
  function baseRidotta(nmin, nmax, dmin, dmax) {
    for (var i = 0; i < 200; i++) { var n = rnd(nmin, nmax), d = rnd(dmin, dmax); if (copr(n, d)) return [n, d]; }
    return [1, 2];
  }
  var LIVELLI = {
    1: { nome: 'Primi passi', desc: 'Denominatori uguali o uno multiplo dell\'altro, frazioni semplici.' },
    2: { nome: 'Denominatori diversi', desc: 'Tutte le operazioni, denominatori fino a 12, qualche frazione da semplificare.' },
    3: { nome: 'Con le potenze', desc: 'Potenze di frazioni con esponente 2 o 3.' },
    4: { nome: 'Potenze e numeri relativi', desc: 'Basi negative, esponente negativo o zero.' }
  };
  function genera(livello, ops) {
    ops = (ops && ops.length) ? ops : ['+', '-', '*', ':'];
    for (var tent = 0; tent < 200; tent++) {
      var op = scegli(ops), q;
      if (livello === 1) {
        var da = scegli([2, 3, 4, 5, 6, 8, 10]), db = da * scegli([1, 1, 2, 3]);
        if (op === '*' || op === ':') { da = scegli([2, 3, 4, 5, 6, 8]); db = scegli([2, 3, 4, 5, 6, 8]); }
        var na = rnd(1, da - 1), nb = rnd(1, db - 1);
        if ((op === '-') && na * db < nb * da) { var t1 = na; na = nb; nb = t1; var t2 = da; da = db; db = t2; }
        q = { n1: na, d1: da, k1: 1, op: op, n2: nb, d2: db, k2: 1 };
      } else if (livello === 2) {
        var A = [rnd(1, 12), rnd(2, 12)], B = [rnd(1, 12), rnd(2, 12)];
        if (Math.random() > 0.25) { A = baseRidotta(1, 12, 2, 12); B = baseRidotta(1, 12, 2, 12); }
        if (op === '-' && A[0] * B[1] < B[0] * A[1]) { var tt = A; A = B; B = tt; }
        q = { n1: A[0], d1: A[1], k1: 1, op: op, n2: B[0], d2: B[1], k2: 1 };
      } else if (livello === 3) {
        var A3 = baseRidotta(1, 5, 2, 6), B3 = baseRidotta(1, 5, 2, 6);
        var k1 = scegli([1, 2, 2, 3]), k2 = scegli([1, 2, 2, 3]);
        if (k1 === 1 && k2 === 1) k1 = 2;
        if (op === '-') { /* il minuendo non deve restare troppo piccolo: nessun vincolo, ma risultato positivo */
          var v1 = Math.pow(A3[0] / A3[1], k1), v2 = Math.pow(B3[0] / B3[1], k2);
          if (v1 < v2) { var tb = A3; A3 = B3; B3 = tb; var tk = k1; k1 = k2; k2 = tk; }
        }
        q = { n1: A3[0], d1: A3[1], k1: k1, op: op, n2: B3[0], d2: B3[1], k2: k2 };
      } else {
        var A4 = baseRidotta(1, 4, 2, 5), B4 = baseRidotta(1, 4, 2, 5);
        if (Math.random() < 0.5) A4[0] = -A4[0];
        if (Math.random() < 0.5) B4[0] = -B4[0];
        q = { n1: A4[0], d1: A4[1], k1: scegli([-3, -2, -1, 0, 2, 3, -2, 2]), op: op, n2: B4[0], d2: B4[1], k2: scegli([-2, -1, 1, 2, 3, -1]) };
      }
      try {
        var r = calcola(q).risultato;
        if (abs(r.n) <= 100000n && r.d <= 100000n) return q;
      } catch (e) { /* esercizio non valido: se ne prova un altro */ }
    }
    return { n1: 1, d1: 2, k1: 1, op: '+', n2: 1, d2: 3, k2: 1 };
  }

  /* ── la risposta scritta dallo studente ── */
  function leggiRisposta(s) {
    s = String(s || '').trim().replace(/[−–]/g, '-');
    var m;
    if ((m = /^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s))) {
      var dd = BigInt(m[4]); if (dd === 0n) return null;
      var nn = BigInt(m[2]) * dd + BigInt(m[3]);
      return { f: { n: m[1] ? -nn : nn, d: dd }, forma: 'misto', canonico: BigInt(m[3]) < dd && gcd(BigInt(m[3]), dd) === 1n && BigInt(m[2]) > 0n };
    }
    s = s.replace(/\s+/g, '');
    if ((m = /^(-?\d+)\/(-?\d+)$/.exec(s))) {
      var d = BigInt(m[2]); if (d === 0n) return null;
      return { f: { n: BigInt(m[1]), d: d }, forma: 'frazione' };
    }
    if (/^-?\d+$/.test(s)) return { f: { n: BigInt(s), d: 1n }, forma: 'intero' };
    if ((m = /^(-?)(\d+)[,.](\d+)$/.exec(s))) {
      var den = 10n ** BigInt(m[3].length), nu = BigInt(m[2] + m[3]);
      return { f: ridotta({ n: m[1] ? -nu : nu, d: den }), forma: 'decimale' };
    }
    return null;
  }

  /* giudizio: 'giusta' | 'da-semplificare' | 'sbagliata' | 'illeggibile' */
  function controlla(testoRisposta, attesa) {
    var L = leggiRisposta(testoRisposta);
    if (!L) return { esito: 'illeggibile' };
    if (!uguali(L.f, attesa)) return { esito: 'sbagliata' };
    if (L.forma === 'frazione') {
      if (L.f.d < 0n) return { esito: 'da-semplificare', motivo: 'segno' };
      if (gcd(L.f.n, L.f.d) > 1n || (L.f.d === 1n)) return { esito: 'da-semplificare', motivo: L.f.d === 1n ? 'intero' : 'ridurre' };
    }
    if (L.forma === 'misto' && !L.canonico) return { esito: 'da-semplificare', motivo: 'ridurre' };
    return { esito: 'giusta', forma: L.forma };
  }

  var M = { mn: mn, mo: mo, mt: mt, row: row, par: par, eq: eq, num: num, parNum: parNum, fr: fr, parFr: parFr, mf: mf, pot: pot, potFr: potFr, potNum: potNum, math: math, gcd: gcd, mcm: mcm, ridotta: ridotta, reciproca: reciproca, uguali: uguali, abs: abs, testoFr: testoFr, SIMB: SIMB };
  var API = { M: M, calcola: calcola, genera: genera, controlla: controlla, leggiRisposta: leggiRisposta, LIVELLI: LIVELLI, ErroreFz: ErroreFz, espressione: espressione, math: math, decimale: decimale, ridotta: ridotta };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.FRAZIONI = API;
})(typeof window !== 'undefined' ? window : globalThis);
