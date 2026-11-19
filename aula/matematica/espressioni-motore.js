/* ════════════════════════════════════════════════════════════
   AULA · Matematica · il motore delle espressioni con le frazioni
   Alberi di espressioni con parentesi e frazioni «a più piani», generatore di esercizi
   e costruzione dei passi per il tutor (una domanda alla volta).
   Nodi: {k:'n', n, d} numero; {k:'o', o:'+'|'−'|'×'|':', l, r} operazione; {k:'f', t, b} linea di frazione grande.
   Aritmetica esatta con interi piccoli (numeri di scuola media). Nessun invio, nessun salvataggio.
   ════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  function red(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
  function N(n, d) { var r = red(n, d == null ? 1 : d); return { k: 'n', n: r.n, d: r.d }; }
  function O(o, l, r) { return { k: 'o', o: o, l: l, r: r }; }
  function Fb(t, b) { return { k: 'f', t: t, b: b }; }
  function ErroreEspr(m) { this.name = 'ErroreEspr'; this.message = m; }

  /* ── valore ── */
  function applica(o, x, y) {
    if (o === '+') return red(x.n * y.d + y.n * x.d, x.d * y.d);
    if (o === '−') return red(x.n * y.d - y.n * x.d, x.d * y.d);
    if (o === '×') return red(x.n * y.n, x.d * y.d);
    if (y.n === 0) throw new ErroreEspr('divisione per zero');
    return red(x.n * y.d, x.d * y.n);
  }
  function valore(t) {
    if (t.k === 'n') return { n: t.n, d: t.d };
    if (t.k === 'o') return applica(t.o, valore(t.l), valore(t.r));
    return applica(':', valore(t.t), valore(t.b));
  }

  /* ── scrittura in MathML, con le parentesi che servono ── */
  function prec(o) { return o === '×' || o === ':' ? 2 : 1; }
  function serveParentesi(padre, figlio, lato) {
    if (figlio.k !== 'o') return false;
    var p = prec(padre.o), c = prec(figlio.o);
    if (c < p) return true;
    if (c === p && lato === 'r' && !((padre.o === '+' && figlio.o === '+') || (padre.o === '×' && figlio.o === '×'))) return true;
    return false;
  }
  var PAR = [['(', ')'], ['[', ']'], ['{', '}']];
  function mfr(n, d) { return '<mfrac><mn>' + n + '</mn><mn>' + d + '</mn></mfrac>'; }
  function mnum(n) { return n.d === 1 ? '<mn>' + n.n + '</mn>' : mfr(n.n, n.d); }
  function mo(o) { return '<mo>' + (o === '−' ? '−' : o === '×' ? '×' : o === ':' ? ':' : '+') + '</mo>'; }
  /* evid: nodo da evidenziare (sfondo) */
  function mml(t, evid, prof) {
    prof = prof || 0;
    var h;
    if (t.k === 'n') h = mnum(t);
    else if (t.k === 'f') h = '<mfrac><mrow>' + mml(t.t, evid, 0) + '</mrow><mrow>' + mml(t.b, evid, 0) + '</mrow></mfrac>';
    else {
      var lato = function (fig, l) {
        if (serveParentesi(t, fig, l)) { var p = PAR[Math.min(prof, 2)]; return '<mo>' + p[0] + '</mo>' + mml(fig, evid, prof + 1) + '<mo>' + p[1] + '</mo>'; }
        return mml(fig, evid, prof);
      };
      h = lato(t.l, 'l') + mo(t.o) + lato(t.r, 'r');
    }
    return t === evid ? '<mrow class="ef-ev" style="background:#fff0b8;border-radius:4px;padding:0 .12em">' + h + '</mrow>' : (t.k === 'o' ? '<mrow>' + h + '</mrow>' : h);
  }
  function math(t, evid, blocco) { return '<math' + (blocco ? ' display="block"' : '') + '>' + mml(t, evid) + '</math>'; }
  function testo(t) {
    if (t.k === 'n') return t.d === 1 ? String(t.n) : t.n + '/' + t.d;
    if (t.k === 'f') return '[' + testo(t.t) + ']/[' + testo(t.b) + ']';
    var lato = function (f, l) { return serveParentesi(t, f, l) ? '(' + testo(f) + ')' : testo(f); };
    return lato(t.l, 'l') + ' ' + t.o + ' ' + lato(t.r, 'r');
  }
  function paroleFr(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
  function mathFr(f) { return '<math>' + mnum(f) + '</math>'; }

  /* ── quali operazioni si possono fare adesso ── */
  /* candidati: coppie di numeri adiacenti dentro lo stesso «gruppo» (la linea di frazione grande separa i gruppi) */
  function candidati(t) {
    var out = [];
    function visita(x) {
      if (x.k === 'n') return [x];
      if (x.k === 'f') {
        var a = visita(x.t), b = visita(x.b);
        if (x.t.k === 'n' && x.b.k === 'n') out.push({ nodo: x, pronto: true, barra: true });
        return [];
      }
      var L = visita(x.l), R = visita(x.r);
      if (L.length && R.length) out.push({ nodo: x, pronto: x.l.k === 'n' && x.r.k === 'n', barra: false });
      return L.concat(R);
    }
    /* un nodo f dentro un'operazione conta come un «numero» per i candidati: lo trattiamo come ostacolo */
    visita(t);
    return out;
  }
  function sostituisci(t, nodo, val) {
    if (t === nodo) return N(val.n, val.d);
    if (t.k === 'n') return t;
    if (t.k === 'f') return Fb(sostituisci(t.t, nodo, val), sostituisci(t.b, nodo, val));
    return O(t.o, sostituisci(t.l, nodo, val), sostituisci(t.r, nodo, val));
  }

  /* ── generatore ── */
  function foglia(liv, opz) {
    opz = opz || {};
    if (opz.intero && Math.random() < 0.2) return N(rnd(2, 4), 1);
    var d = pesca(liv >= 3 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6]), n;
    do { n = rnd(1, d + (liv >= 2 ? 3 : 1)); } while (gcd(n, d) !== 1 || n === d);
    return N(n, d);
  }
  function misura(t) {
    var mx = 0, ok = true;
    (function giro(x) {
      if (x.k === 'n') return { n: x.n, d: x.d };
      var a, b, v;
      if (x.k === 'o') { a = giro(x.l); b = giro(x.r); if (x.o === ':' && b.n === 0) { ok = false; return a; } v = applica(x.o, a, b); }
      else { a = giro(x.t); b = giro(x.b); if (b.n === 0) { ok = false; return a; } v = applica(':', a, b); }
      if (v.n < 0) ok = false;
      mx = Math.max(mx, v.n, v.d);
      return v;
    })(t);
    return { ok: ok, max: mx };
  }
  function bello(t) {
    var m = misura(t); if (!m.ok || m.max > 90) return false;
    var v = valore(t); return v.n > 0 && v.d <= 36 && v.n <= 120;
  }
  var OP12 = ['+', '−'], OP34 = ['×', ':'], OPALL = ['+', '−', '×', ':'];
  function conta(t, f) { return t.k === 'n' ? 0 : (t.k === 'f' ? conta(t.t, f) + conta(t.b, f) : conta(t.l, f) + conta(t.r, f) + f(t)); }
  function parentesi(t) { return t.k === 'n' ? 0 : t.k === 'f' ? parentesi(t.t) + parentesi(t.b) : parentesi(t.l) + parentesi(t.r) + (serveParentesi(t, t.l, 'l') ? 1 : 0) + (serveParentesi(t, t.r, 'r') ? 1 : 0); }
  function alberoCasuale(foglie, liv) {
    if (foglie === 1) return foglia(liv, { intero: true });
    var k = rnd(1, foglie - 1);
    return O(pesca(OPALL), alberoCasuale(k, liv), alberoCasuale(foglie - k, liv));
  }
  /* liv 1: parentesi da fare per prime; 2: precedenze senza parentesi; 3: quattro numeri; 4: frazioni a più piani */
  function genera(liv, ottimo) {
    liv = Math.max(1, Math.min(4, liv | 0 || 1));
    for (var i = 0; i < 4000; i++) {
      var L = function (o) { return foglia(liv, o); }, t, o1 = pesca(OP12), o2 = pesca(OP34);
      if (liv === 1) {
        t = Math.random() < 0.6 ? O(o2, O(o1, L(), L()), L({ intero: true })) : O(o2, L({ intero: true }), O(o1, L(), L()));
      } else if (liv === 2) {
        var s = rnd(1, 3);
        t = s === 1 ? O(o1, L(), O(o2, L(), L({ intero: true }))) : s === 2 ? O(o1, O(o2, L(), L()), L()) : O(o1, L({ intero: true }), O(o2, L(), L()));
      } else if (liv === 3) {
        t = alberoCasuale(4, 3);
        if (parentesi(t) < 1 || (t.k === 'o' && t.l.k === 'n' && t.r.k === 'n')) continue;
      } else {
        var f = rnd(1, 4);
        t = f === 1 ? Fb(L(), L()) :
          f === 2 ? Fb(O(pesca(OP12), L(), L()), L({ intero: true })) :
          f === 3 ? Fb(O(o1, L(), L()), O(pesca(OP12), L(), L())) :
          O(pesca(OP12), L(), Fb(L(), L()));
        if (t.k === 'f' && f === 1 && t.t.k === 'n' && t.b.k === 'n' && t.b.d === 1) continue;
      }
      if (bello(t)) return t;
    }
    return O('+', N(1, 2), N(1, 3));
  }

  /* ── i passi del tutor ── */
  var NOMEOP = { '+': 'somma', '−': 'sottrazione', '×': 'moltiplicazione', ':': 'divisione' };
  function aiutiCalcolo(o, x, y) {
    if (o === '+' || o === '−') {
      var m = lcm(x.d, y.d), a = x.n * m / x.d, b = y.n * m / y.d;
      return ['Servono denominatori uguali: prendi il mcm dei denominatori (' + x.d + ' e ' + y.d + ').',
        'Il mcm è ' + m + ': ' + paroleFr(x) + ' = ' + a + '/' + m + ' e ' + paroleFr(y) + ' = ' + b + '/' + m + '. Ora ' + (o === '+' ? 'somma' : 'sottrai') + ' i numeratori e riduci.'];
    }
    if (o === '×') {
      return ['Si moltiplicano i numeratori tra loro e i denominatori tra loro. Conviene semplificare prima, in croce.',
        'Numeratore: ' + x.n + ' · ' + y.n + ' = ' + x.n * y.n + '. Denominatore: ' + x.d + ' · ' + y.d + ' = ' + x.d * y.d + '. Poi riduci ai minimi termini.'];
    }
    return ['Dividere per una frazione è come moltiplicare per la sua inversa (si capovolge la seconda).',
      paroleFr(x) + ' : ' + paroleFr(y) + ' diventa ' + paroleFr(x) + ' × ' + paroleFr({ n: y.d, d: y.n }) + '. Poi moltiplica e riduci.'];
  }
  function spiegaCalcolo(o, x, y, r) {
    if (o === '+' || o === '−') {
      var m = lcm(x.d, y.d), a = x.n * m / x.d, b = y.n * m / y.d;
      return 'Denominatore comune ' + m + ': ' + a + '/' + m + (o === '+' ? ' + ' : ' − ') + b + '/' + m + ' = ' + (o === '+' ? a + b : a - b) + '/' + m + (red(o === '+' ? a + b : a - b, m).d === m ? '' : ', ridotta: ' + paroleFr(r)) + '.';
    }
    if (o === '×') return 'Numeratori e denominatori tra loro: ' + x.n * y.n + '/' + x.d * y.d + (red(x.n * y.n, x.d * y.d).d === x.d * y.d ? '' : ', ridotta: ' + paroleFr(r)) + '.';
    return paroleFr(x) + ' × ' + paroleFr({ n: y.d, d: y.n }) + ' = ' + x.n * y.d + '/' + x.d * y.n + (red(x.n * y.d, x.d * y.n).d === x.d * y.n ? '' : ', ridotta: ' + paroleFr(r)) + '.';
  }
  function leggiIntero(s) { s = String(s == null ? '' : s).replace(/[\s.']/g, ''); return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; }
  /* verifica di una frazione scritta in due campi (denominatore vuoto = 1) */
  function giudicaFr(v, r, diag) {
    var n = leggiIntero(v && v.n), d = (v && String(v.d).trim() === '') ? 1 : leggiIntero(v && v.d);
    if (n === null || d === null || d === 0) return { ok: false, msg: 'Scrivi numeratore e denominatore con numeri interi (se il risultato è un numero intero, lascia vuoto il denominatore).' };
    if (n * r.d === r.n * d) {
      if (n === r.n && d === r.d) return { ok: true };
      return { ok: false, msg: 'Il valore è giusto, ma la frazione si può ancora semplificare: riducila ai minimi termini.' };
    }
    return { ok: false, msg: diag ? diag(n, d) : 'Non ancora: ricontrolla il calcolo.' };
  }
  function diagnosi(o, x, y) {
    return function (n, d) {
      if ((o === '+' || o === '−') && d === x.d + y.d) return 'Non si sommano i denominatori: prima servono denominatori uguali (il mcm), poi si opera solo sui numeratori.';
      if ((o === '+' || o === '−') && n === (o === '+' ? x.n + y.n : x.n - y.n) && d === x.d * y.d) return 'Hai calcolato con il denominatore comune ' + x.d * y.d + ' ma hai sommato i numeratori senza adattarli: ogni numeratore va prima moltiplicato.';
      if (o === ':' ) { var senza = applica('×', x, y); if (n * senza.d === senza.n * d) return 'Hai moltiplicato senza capovolgere: dividere per una frazione vuol dire moltiplicare per la sua inversa.'; }
      if (o === '×' && (n === x.n * y.d && d === x.d * y.n)) return 'Questo è il risultato di una divisione: qui si moltiplica dritto, numeratore per numeratore e denominatore per denominatore.';
      return 'Non ancora: ricontrolla il calcolo.';
    };
  }
  function parte(t, nodo) { return t === nodo; }
  function etichettaPaio(c, t) {
    /* mostra la coppia di numeri adiacenti: l'ultimo numero di sinistra e il primo di destra */
    var x = c.nodo;
    function ultimo(y) { return y.k === 'n' ? y : y.k === 'o' ? ultimo(y.r) : y; }
    function primo(y) { return y.k === 'n' ? y : y.k === 'o' ? primo(y.l) : y; }
    var e = c.barra ? x : O(x.o, ultimo(x.l), primo(x.r));
    return '<span class="vh">' + (c.barra ? 'la frazione grande ' : '') + testo(e) + '</span><math aria-hidden="true">' + mml(e) + '</math>';
  }
  function costruisci(t0) {
    var corrente = t0, passi = [], guardia = 0, ultimaLav = '';
    while (corrente.k !== 'n' && guardia++ < 12) {
      var cand = candidati(corrente), pronti = cand.filter(function (c) { return c.pronto; });
      if (!pronti.length) throw new ErroreEspr('espressione senza operazioni pronte');
      var canon = pronti[0], albero = corrente;
      if (cand.length > 1) {
        (function (cand, pronti, albero) {
          passi.push({
            titolo: 'Che cosa fare per prima',
            testo: 'Quale operazione devi svolgere <strong>per prima</strong>? Scegli la coppia di numeri.',
            ctx: math(albero),
            tipo: 'scelta',
            opzioni: cand.map(function (c, i) { return [String(i), etichettaPaio(c, albero)]; }),
            verifica: function (v) {
              var c = cand[+v];
              if (!c) return { ok: false, msg: 'Scegli una delle coppie.' };
              if (c.pronto) return { ok: true };
              var x = c.nodo, figliP = [x.l, x.r].some(function (f, i) { return f.k === 'o' && serveParentesi(x, f, i ? 'r' : 'l'); });
              if (figliP) return { ok: false, msg: 'Quella coppia sta a cavallo di una parentesi: <strong>prima si svolge ciò che sta dentro le parentesi</strong>.' };
              if (x.o === '+' || x.o === '−') return { ok: false, msg: 'Aspetta: <strong>moltiplicazioni e divisioni vengono prima di somme e differenze</strong>. C\'è un\'operazione più forte da fare.' };
              return { ok: false, msg: 'A parità di forza si procede da <strong>sinistra a destra</strong>: ce n\'è una più a sinistra.' };
            },
            aiuti: ['Prima le parentesi (le tonde, poi le quadre), poi moltiplicazioni e divisioni, infine somme e differenze.', 'Cerca le parentesi: ciò che è dentro va fatto per primo. Se non ce ne sono, cerca × e : (da sinistra a destra).'],
            rivela: function () { return 'la coppia ' + etichettaPaio(canon, albero); },
            spiega: pronti.length > 1 ? 'Giusto. Ce n\'erano due da poter fare per prime, indipendenti tra loro: cominciamo dalla prima da sinistra.' : (canon.barra ? 'Giusto: la linea di frazione grande è una divisione, e numeratore e denominatore sono già numeri.' : (albero.k === 'o' && prec(canon.nodo.o) === 2 && albero !== canon.nodo ? 'Giusto: moltiplicazioni e divisioni hanno la precedenza.' : 'Giusto.')),
            lav: ''
          });
        })(cand, pronti, albero);
      }
      var nodo = canon.nodo, x, y, o, r;
      if (canon.barra) { x = nodo.t; y = nodo.b; o = ':'; } else { x = nodo.l; y = nodo.r; o = nodo.o; }
      r = applica(o, x, y);
      var dopo = sostituisci(corrente, nodo, r);
      (function (corrente, nodo, x, y, o, r, dopo, barra) {
        var nome = barra ? 'la linea di frazione grande, cioè una divisione' : 'la ' + NOMEOP[o];
        passi.push({
          titolo: 'Calcola' + (barra ? ': la frazione a più piani' : ''),
          testo: barra ? 'La linea di frazione grande significa <strong>divisione</strong>: numeratore diviso denominatore. Calcola il valore evidenziato e scrivilo ridotto ai minimi termini.' : 'Svolgi ' + nome + ' evidenziata. Scrivi il risultato <strong>ridotto ai minimi termini</strong> (se è un numero intero, lascia vuoto il denominatore).',
          ctx: math(corrente, nodo),
          tipo: 'frac',
          verifica: function (v) { return giudicaFr(v, r, diagnosi(o, x, y)); },
          aiuti: aiutiCalcolo(o, x, y),
          rivela: function () { return mathFr(r); },
          spiega: spiegaCalcolo(o, x, y, r),
          lav: math(dopo)
        });
      })(corrente, nodo, x, y, o, r, dopo, canon.barra);
      corrente = dopo;
    }
    return { passi: passi, risultato: valore(t0), testata: math(t0, null, true), testo: testo(t0) };
  }

  var API = { N: N, O: O, Fb: Fb, red: red, gcd: gcd, lcm: lcm, applica: applica, valore: valore, mml: mml, math: math, mathFr: mathFr, testo: testo, genera: genera, costruisci: costruisci, candidati: candidati, giudicaFr: giudicaFr, ErroreEspr: ErroreEspr, paroleFr: paroleFr, rnd: rnd, pesca: pesca, bello: bello };
  root.ESPR = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
