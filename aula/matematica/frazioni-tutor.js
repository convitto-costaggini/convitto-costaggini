/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Il tutor delle frazioni
   Trasforma un esercizio in una sequenza di piccole domande: lo studente risponde,
   riceve un commento mirato agli errori tipici, può chiedere un suggerimento
   (a due livelli) o farsi mostrare la risposta. Nessun dato inviato o salvato.

   FRAZIONI_TUTOR.costruisci(q) → { passi:[...], risultato:{n,d}, espressione }
   Ogni passo: { id, titolo, testo, ctx (MathML), tipo:'num'|'frac'|'scelta', opzioni?,
                 atteso, aiuti:[a1,a2], spiega, lav (MathML),
                 verifica(risposta) → { ok, msg? }, rivela() → testo }
   Risposta: 'num' = stringa; 'frac' = { n, d } (stringhe); 'scelta' = valore.
   ════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  var F = root.FRAZIONI || (typeof require !== 'undefined' ? require('./frazioni.js') : null);
  var M = F.M, abs = M.abs, gcd = M.gcd, mcm = M.mcm, ridotta = M.ridotta, reciproca = M.reciproca, uguali = M.uguali;
  var fr = M.fr, parFr = M.parFr, mf = M.mf, mo = M.mo, mn = M.mn, mt = M.mt, row = M.row, par = M.par, eq = M.eq, num = M.num, parNum = M.parNum, potFr = M.potFr, potNum = M.potNum, math = M.math;

  function intero(s) {
    s = String(s === undefined || s === null ? '' : s).trim().replace(/[−–]/g, '-');
    return /^-?\d+$/.test(s) ? BigInt(s) : null;
  }
  var tx = function (b) { return String(b).replace('-', '−'); };
  var txf = function (f) { return f.d === 1n ? tx(f.n) : tx(f.n) + '/' + f.d; };

  /* ── i tre tipi di domanda ── */
  function passoNum(o) {
    o.tipo = 'num';
    o.verifica = function (raw) {
      var r = intero(raw);
      if (r === null) return { ok: false, msg: 'Scrivi un numero intero (senza spazi né virgole).' };
      if (r === o.atteso) return { ok: true };
      return { ok: false, msg: (o.diag && o.diag(r)) || null };
    };
    o.rivela = function () { return tx(o.atteso); };
    return o;
  }
  function passoFrac(o) {
    o.tipo = 'frac';
    o.verifica = function (raw) {
      var n = intero(raw && raw.n), d = intero(raw && raw.d);
      if (n === null || d === null) return { ok: false, msg: 'Scrivi sia il numeratore sia il denominatore (numeri interi).' };
      if (d === 0n) return { ok: false, msg: 'Il denominatore non può essere 0.' };
      if (d < 0n) { n = -n; d = -d; }
      var v = { n: n, d: d };
      if (uguali(v, o.atteso)) {
        if (o.ridotta && gcd(n, d) > 1n && n !== 0n) return { ok: false, msg: 'Il valore è giusto, ma la frazione si può ancora semplificare: dividi ancora numeratore e denominatore.' };
        if (o.esatta && !(n === o.atteso.n && d === o.atteso.d)) return { ok: false, msg: 'Il valore è giusto, ma qui serve proprio la frazione con denominatore ' + o.atteso.d + '.' };
        return { ok: true };
      }
      return { ok: false, msg: (o.diag && o.diag(v)) || null };
    };
    o.rivela = function () { return txf(o.atteso); };
    return o;
  }
  function passoScelta(o) {
    o.tipo = 'scelta';
    o.verifica = function (raw) { return raw === o.atteso ? { ok: true } : { ok: false, msg: (o.diag && o.diag(raw)) || null }; };
    o.rivela = function () { return o.opzioni.filter(function (x) { return x[0] === o.atteso; })[0][1]; };
    return o;
  }

  function multipli(d, fino) {
    var out = [], x = d;
    while (x <= fino && out.length < 12) { out.push(String(x)); x += d; }
    return out.join(', ');
  }

  function costruisci(q) {
    var ris = F.calcola(q); /* lancia ErroreFz se l'esercizio non si può svolgere */
    var passi = [];
    var add = function (p) { p.id = passi.length + 1; passi.push(p); return p; };
    var n1 = BigInt(q.n1), d1 = BigInt(q.d1), k1 = BigInt(q.k1), n2 = BigInt(q.n2), d2 = BigInt(q.d2), k2 = BigInt(q.k2);

    /* semplifica una frazione (introduce un passo solo se serve) */
    function passoSempl(f, dove, titolo, parte) {
      var r = ridotta(f);
      if (r.n === 0n && f.d !== 1n) { /* numeratore 0 */ }
      var g = gcd(f.n, f.d);
      add(passoFrac({
        titolo: titolo, ctx: math(fr(f)), ridotta: true, atteso: r,
        testo: 'La frazione ' + txf(f) + ' si può semplificare. Scrivila ridotta ai minimi termini.',
        aiuti: ['Cerca un numero che divida sia il numeratore sia il denominatore.', 'Dividi numeratore e denominatore per ' + g + ' (è il massimo numero che li divide entrambi).'],
        spiega: 'Dividendo sopra e sotto per ' + g + ' la frazione resta equivalente ma più semplice: ' + txf(r) + '.',
        diag: function (v) { return 'Il valore è cambiato: per semplificare si divide numeratore e denominatore per lo stesso numero, senza alterare la frazione.'; },
        lav: math(eq(fr(f), fr(r)))
      }));
      return r;
    }

    /* una frazione con il suo esponente → una frazione */
    function operando(idx, n, d, k) {
      var nome = idx === 1 ? 'prima' : 'seconda', cap = idx === 1 ? 'La prima frazione' : 'La seconda frazione';
      var f = { n: n, d: d };
      if (ridotta(f).d !== f.d || (f.n === 0n && f.d !== 1n)) f = passoSempl(f, nome, cap + ': semplifica' + (k !== 1n ? ' prima della potenza' : ''));
      if (k === 1n) return f;
      if (k === 0n) {
        add(passoNum({
          titolo: cap + ': esponente zero', ctx: math(potFr(f, 0n)), atteso: 1n,
          testo: 'Quanto vale ' + (f.d === 1n ? txf(f) : '(' + txf(f) + ')') + ' elevato a 0?',
          aiuti: ['Ricorda la regola: un numero diverso da 0 elevato alla 0 ha sempre lo stesso valore, qualunque sia il numero.', 'Vale 1.'],
          spiega: 'Ogni numero diverso da 0 elevato a 0 vale 1.',
          diag: function (r) { return r === 0n ? 'No: 0 è un errore frequente. Un numero diverso da 0 elevato a 0 vale 1.' : null; },
          lav: math(eq(potFr(f, 0n), mn(1)))
        }));
        return { n: 1n, d: 1n };
      }
      var b = f, e = k;
      if (k < 0n) {
        var rec = reciproca(f);
        add(passoFrac({
          titolo: cap + ': esponente negativo', ctx: math(potFr(f, k)), atteso: rec, esatta: true,
          testo: 'L\'esponente è negativo: per eliminarlo si capovolge la frazione (si scambiano numeratore e denominatore). Che frazione ottieni?',
          aiuti: ['Il numeratore va al posto del denominatore e viceversa.', 'Scrivi ' + txf(rec) + ': l\'esponente poi diventa ' + (-k) + '.'],
          spiega: 'Un esponente negativo si trasforma in positivo capovolgendo la frazione: ora l\'esponente è ' + (-k) + '.',
          diag: function (v) {
            if (uguali(v, f)) return 'Hai lasciato la frazione com\'era: capovolgere vuol dire scambiare numeratore e denominatore.';
            if (uguali(v, { n: -f.n, d: f.d })) return 'Il segno non cambia: si scambiano solo numeratore e denominatore.';
            return null;
          },
          lav: math(eq(potFr(f, k), e === undefined ? '' : potFr(rec, -k)))
        }));
        b = rec; e = -k;
        if (e === 1n) { passi[passi.length - 1].lav = math(eq(potFr(f, k), fr(rec))); return b; }
      }
      if (b.n === 0n) {
        add(passoNum({ titolo: cap + ': potenza', ctx: math(potFr(b, e)), atteso: 0n, testo: 'Quanto vale 0 elevato a ' + e + '?', aiuti: ['0 per sé stesso quante volte vuoi dà sempre 0.', 'Vale 0.'], spiega: '0 elevato a un esponente positivo vale 0.', lav: math(eq(potFr(b, e), mn(0))) }));
        return { n: 0n, d: 1n };
      }
      var R = { n: b.n ** e, d: b.d ** e };
      if (b.n < 0n) {
        var pari = e % 2n === 0n;
        add(passoScelta({
          titolo: cap + ': il segno', ctx: math(potFr(b, e)), opzioni: [['+', 'positivo'], ['-', 'negativo']], atteso: pari ? '+' : '-',
          testo: 'La base è negativa e l\'esponente è ' + e + '. Il risultato sarà positivo o negativo?',
          aiuti: ['Una potenza è una moltiplicazione ripetuta: quanti fattori negativi ci sono?', 'Con un numero pari di fattori negativi il risultato è positivo; con un numero dispari è negativo. Qui i fattori sono ' + e + '.'],
          spiega: 'L\'esponente ' + e + ' è ' + (pari ? 'pari: un numero pari di segni meno dà un risultato positivo.' : 'dispari: un numero dispari di segni meno dà un risultato negativo.')
        }));
      }
      var mis = function (base) { return function (r) { return r === base * e ? 'Hai moltiplicato la base per l\'esponente. L\'esponente dice quante volte moltiplicare la base per sé stessa: ' + base + ' × ' + base + (e > 2n ? ' × …' : '') + '.' : null; }; };
      if (b.d === 1n) {
        add(passoNum({
          titolo: cap + ': la potenza', ctx: math(potFr(b, e)), atteso: R.n,
          testo: 'Quanto fa ' + (b.n < 0n ? '(' + tx(b.n) + ')' : b.n) + ' elevato a ' + e + '?',
          aiuti: ['Moltiplica la base per sé stessa ' + e + ' volte.', 'Il risultato è ' + tx(R.n) + '.'],
          spiega: 'La potenza è una moltiplicazione ripetuta.', diag: function (r) { return mis(b.n)(r); }, lav: math(eq(potFr(b, e), fr(R)))
        }));
        return R;
      }
      add(passoNum({
        titolo: cap + ': il numeratore', ctx: math(potFr(b, e)), atteso: abs(b.n) ** e,
        testo: 'L\'esponente vale per il numeratore e per il denominatore. Quanto fa ' + abs(b.n) + ' elevato a ' + e + '?' + (b.n < 0n ? ' (Il segno lo abbiamo già deciso: scrivi il numero senza segno.)' : ''),
        aiuti: ['Moltiplica ' + abs(b.n) + ' per sé stesso ' + e + ' volte.', 'Il risultato è ' + abs(b.n) ** e + '.'],
        spiega: 'Il numeratore elevato dà ' + abs(b.n) ** e + '.', diag: mis(abs(b.n))
      }));
      add(passoNum({
        titolo: cap + ': il denominatore', ctx: math(potFr(b, e)), atteso: b.d ** e,
        testo: 'Ora il denominatore: quanto fa ' + b.d + ' elevato a ' + e + '?',
        aiuti: ['Moltiplica ' + b.d + ' per sé stesso ' + e + ' volte.', 'Il risultato è ' + b.d ** e + '.'],
        spiega: 'Quindi la potenza della frazione è ' + txf(R) + '.', diag: mis(b.d),
        lav: math(eq(potFr(b, e), mf(potNum(b.n, e), potNum(b.d, e)), fr(R)))
      }));
      return R;
    }

    var X = operando(1, n1, d1, k1), Y = operando(2, n2, d2, k2);
    var CAP = 'L\'operazione';

    function chiudi(f) {
      if (f.d === 1n || f.n === 0n) return f.n === 0n ? { n: 0n, d: 1n } : f;
      var g = gcd(f.n, f.d);
      if (g > 1n) return passoSempl(f, 'risultato', 'Semplifica il risultato');
      add(passoScelta({
        titolo: 'Controllo finale', ctx: math(fr(f)), opzioni: [['si', 'Sì, si può semplificare'], ['no', 'No, è già ridotta']], atteso: 'no',
        testo: 'La frazione ' + txf(f) + ' si può ancora semplificare?',
        aiuti: ['Cerca un numero maggiore di 1 che divida sia ' + tx(f.n) + ' sia ' + f.d + '.', 'Non ce n\'è nessuno: numeratore e denominatore non hanno fattori in comune.'],
        spiega: 'Numeratore e denominatore non hanno fattori in comune: la frazione è ridotta ai minimi termini.',
        diag: function (r) { return r === 'si' ? 'Prova a cercare un numero che divida entrambi: se non lo trovi, la frazione è già ridotta.' : null; }
      }));
      return f;
    }

    function sommaDiff(A, B, s) {
      var op = s > 0 ? ' + ' : ' − ', verbo = s > 0 ? 'somma' : 'differenza';
      var N1 = A.n, N2 = B.n, m = A.d;
      var intro = math(row(fr(A), mo(s > 0 ? '+' : '−'), parFr(B)));
      if (A.d !== B.d) {
        m = mcm(A.d, B.d);
        var kk1 = m / A.d, kk2 = m / B.d;
        add(passoNum({
          titolo: 'Il denominatore comune', ctx: intro, atteso: m,
          testo: 'I denominatori sono diversi (' + A.d + ' e ' + B.d + '): per calcolare la ' + verbo + ' servono frazioni con lo stesso denominatore. Qual è il più piccolo numero divisibile sia per ' + A.d + ' sia per ' + B.d + ' (il m.c.m.)?',
          aiuti: ['Scrivi i multipli di ' + A.d + ' e cerca il primo che è anche multiplo di ' + B.d + '.', 'Multipli di ' + A.d + ': ' + multipli(A.d, m) + '. Multipli di ' + B.d + ': ' + multipli(B.d, m) + '. Il primo in comune è ' + m + '.'],
          spiega: 'Il m.c.m. di ' + A.d + ' e ' + B.d + ' è ' + m + ': sarà il denominatore comune.',
          diag: function (r) {
            if (r <= 0n) return 'Deve essere un numero positivo.';
            var a = r % A.d === 0n, b = r % B.d === 0n;
            if (a && b) return r === A.d * B.d && r !== m ? 'Va bene come denominatore comune, ma non è il più piccolo: cerca un numero minore, i calcoli saranno più facili.' : 'È un denominatore comune, ma non il più piccolo: ne esiste uno minore.';
            return 'Deve essere divisibile sia per ' + A.d + ' sia per ' + B.d + ' (' + (!a && !b ? 'questo non è divisibile per nessuno dei due' : a ? 'non è divisibile per ' + B.d : 'non è divisibile per ' + A.d) + ').';
          },
          lav: math(eq(row(mt('m.c.m.'), par(mn(A.d) + mo(',') + mn(B.d))), mn(m)))
        }));
        var tr = function (F0, kx, nome) {
          if (kx === 1n) return F0.n;
          add(passoNum({
            titolo: 'Trasforma la ' + nome + ' frazione', ctx: math(fr(F0)), atteso: F0.n * kx,
            testo: 'Trasforma ' + txf(F0) + ' in una frazione con denominatore ' + m + '. Per ottenere ' + m + ' dal denominatore ' + F0.d + ' hai moltiplicato per ' + kx + ': quanto diventa il numeratore?',
            aiuti: ['Quello che fai sotto lo devi fare anche sopra: moltiplica il numeratore per ' + kx + '.', tx(F0.n) + ' × ' + kx + ' = ' + tx(F0.n * kx) + '.'],
            spiega: txf(F0) + ' = ' + tx(F0.n * kx) + '/' + m + ': una frazione equivalente, con il denominatore comune.',
            diag: function (r) { return r === F0.n ? 'Il numeratore è rimasto uguale: va moltiplicato per lo stesso numero del denominatore, altrimenti la frazione cambia valore.' : null; },
            lav: math(eq(fr(F0), mf(num(F0.n) + mo('·') + mn(kx), mn(F0.d) + mo('·') + mn(kx)), fr({ n: F0.n * kx, d: m })))
          }));
          return F0.n * kx;
        };
        N1 = tr(A, kk1, 'prima'); N2 = tr(B, kk2, 'seconda');
      }
      var S = s > 0 ? N1 + N2 : N1 - N2;
      add(passoNum({
        titolo: s > 0 ? 'Somma i numeratori' : 'Sottrai i numeratori', ctx: math(row(fr({ n: N1, d: m }), mo(s > 0 ? '+' : '−'), parFr({ n: N2, d: m }))), atteso: S,
        testo: 'Ora le frazioni hanno lo stesso denominatore (' + m + '): il denominatore resta, si ' + (s > 0 ? 'sommano' : 'sottraggono') + ' i numeratori. Quanto fa ' + tx(N1) + op + (N2 < 0n ? '(' + tx(N2) + ')' : N2) + '?',
        aiuti: ['Calcola solo i numeratori; il denominatore ' + m + ' non cambia.', tx(N1) + op + (N2 < 0n ? '(' + tx(N2) + ')' : N2) + ' = ' + tx(S) + '.'],
        spiega: 'Il nuovo numeratore è ' + tx(S) + ', il denominatore resta ' + m + ': ' + txf({ n: S, d: m }) + '.',
        diag: function (r) {
          if (A.d !== B.d && false) return null;
          if (s > 0 && r === N1 * N2) return 'Hai moltiplicato: qui si sommano i numeratori.';
          return 'Controlla il calcolo e il segno: ' + tx(N1) + op + (N2 < 0n ? '(' + tx(N2) + ')' : N2) + '.';
        },
        lav: math(eq(row(fr({ n: N1, d: m }), mo(s > 0 ? '+' : '−'), parFr({ n: N2, d: m })), mf(num(N1) + mo(s > 0 ? '+' : '−') + parNum(N2), mn(m)), fr({ n: S, d: m })))
      }));
      return chiudi({ n: S, d: m });
    }

    function prodotto(A, B) {
      if (A.n === 0n || B.n === 0n) {
        add(passoNum({ titolo: 'Un fattore è zero', ctx: math(row(fr(A), mo('·'), parFr(B))), atteso: 0n, testo: 'Uno dei due fattori è 0. Quanto fa il prodotto?', aiuti: ['Qualunque numero per 0 dà 0.', 'Il prodotto è 0.'], spiega: 'Se un fattore è 0, il prodotto è 0.', lav: math(eq(row(fr(A), mo('·'), parFr(B)), mn(0))) }));
        return { n: 0n, d: 1n };
      }
      var a = A.n, b = A.d, c = B.n, d = B.d;
      var ctx = math(row(fr(A), mo('·'), parFr(B)));
      var cerca = function (x, y, nx, ny) {
        var g = gcd(x, y);
        if (g <= 1n) return 1n;
        add(passoNum({
          titolo: 'Semplifica in croce', ctx: ctx, atteso: g,
          testo: 'Prima di moltiplicare conviene semplificare «in croce»: il numeratore ' + tx(x) + ' e il denominatore ' + y + ' (' + nx + ' con ' + ny + ') hanno un fattore in comune. Per quale numero li dividi? (scegli il più grande possibile)',
          aiuti: ['Cerca un numero maggiore di 1 che divida sia ' + abs(x) + ' sia ' + y + '.', 'Il numero è ' + g + ': ' + tx(x) + ' : ' + g + ' = ' + tx(x / g) + ' e ' + y + ' : ' + g + ' = ' + y / g + '.'],
          spiega: 'Dividendo ' + abs(x) + ' e ' + y + ' per ' + g + ' le frazioni diventano più semplici e il prodotto non cambia.',
          diag: function (r) {
            if (r === 1n) return 'Dividere per 1 non cambia niente: cerca un numero maggiore di 1.';
            if (r > 0n && x % r === 0n && y % r === 0n) return 'Si può dividere per ' + r + ', ma anche per un numero più grande: cerca il massimo.';
            return 'Quel numero non divide entrambi.';
          }
        }));
        return g;
      };
      var g1 = cerca(a, d, 'primo numeratore', 'secondo denominatore'), g2 = cerca(c, b, 'secondo numeratore', 'primo denominatore');
      var a2 = a / g1, d2x = d / g1, c2 = c / g2, b2 = b / g2;
      var segno = (a < 0n || c < 0n) ? ' Attenzione al segno: due segni uguali danno +, segni diversi danno −.' : '';
      add(passoNum({
        titolo: 'Il numeratore del prodotto', ctx: math(row(fr({ n: a2, d: b2 }), mo('·'), parFr({ n: c2, d: d2x }))), atteso: a2 * c2,
        testo: 'Moltiplica i numeratori: quanto fa ' + tx(a2) + ' × ' + (c2 < 0n ? '(' + tx(c2) + ')' : c2) + '?' + segno,
        aiuti: ['Moltiplica i due numeri sopra la linea di frazione.' + segno, tx(a2) + ' × ' + (c2 < 0n ? '(' + tx(c2) + ')' : c2) + ' = ' + tx(a2 * c2) + '.'],
        spiega: 'Il numeratore del prodotto è ' + tx(a2 * c2) + '.',
        diag: function (r) { return r === -(a2 * c2) ? 'Il valore è giusto ma il segno no: due segni uguali danno +, segni diversi danno −.' : null; }
      }));
      add(passoNum({
        titolo: 'Il denominatore del prodotto', ctx: math(row(fr({ n: a2, d: b2 }), mo('·'), parFr({ n: c2, d: d2x }))), atteso: b2 * d2x,
        testo: 'Ora i denominatori: quanto fa ' + b2 + ' × ' + d2x + '?',
        aiuti: ['Moltiplica i due numeri sotto la linea di frazione.', b2 + ' × ' + d2x + ' = ' + b2 * d2x + '.'],
        spiega: 'Il prodotto è ' + txf({ n: a2 * c2, d: b2 * d2x }) + '.',
        lav: math(eq(row(fr(A), mo('·'), parFr(B)), mf(num(a2) + mo('·') + parNum(c2), mn(b2) + mo('·') + mn(d2x)), fr({ n: a2 * c2, d: b2 * d2x })))
      }));
      return chiudi({ n: a2 * c2, d: b2 * d2x });
    }

    var op = q.op, R;
    if (op === '+') R = sommaDiff(X, Y, 1);
    else if (op === '-') R = sommaDiff(X, Y, -1);
    else if (op === '*') R = prodotto(X, Y);
    else {
      var Yr = reciproca(Y);
      add(passoFrac({
        titolo: 'Il reciproco', ctx: math(row(fr(X), mo(':'), parFr(Y))), atteso: Yr, esatta: true,
        testo: 'Dividere per una frazione equivale a moltiplicare per la sua reciproca. Qual è la reciproca di ' + txf(Y) + '? (si scambiano numeratore e denominatore; il segno resta al numeratore)',
        aiuti: ['Il numeratore diventa denominatore e il denominatore diventa numeratore.', 'La reciproca è ' + txf(Yr) + '.'],
        spiega: 'Ora si moltiplica: ' + txf(X) + ' × ' + txf(Yr) + '.',
        diag: function (v) {
          if (uguali(v, X) || uguali(v, reciproca(X))) return 'Si capovolge la seconda frazione (quella per cui si divide), non la prima.';
          if (uguali(v, Y)) return 'La frazione è rimasta com\'era: vanno scambiati numeratore e denominatore.';
          return null;
        },
        lav: math(eq(row(fr(X), mo(':'), parFr(Y)), row(fr(X), mo('·'), parFr(Yr))))
      }));
      R = prodotto(X, Yr);
    }
    return { passi: passi, risultato: ridotta(R), espressione: F.math(F.espressione(q)), attesoFinale: ris.risultato };
  }

  var API = { costruisci: costruisci };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.FRAZIONI_TUTOR = API;
})(typeof window !== 'undefined' ? window : globalThis);
