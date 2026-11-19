/* ════════════════════════════════════════════════════════════
   AULA · Matematica · operazioni con i polinomi negli esercizi della docente
   Serve a raccolta.js per la forma «polinomio …». Non risolve niente "a mano":
   risultato, correzione e passo passo li calcola il motore ALG (alg-motore.js).
   Il passo passo è lo stesso della tappa «I polinomi» (polinomi.js): stessa logica,
   senza la parte della pagina, così si può usare anche in esercizi.html.
   POLI_ES.leggi(testo) → { t, p, q, m } oppure lancia { msg }
   ════════════════════════════════════════════════════════════ */
window.POLI_ES = (function () {
  'use strict';
  var A = window.ALG;
  function intero(s) { s = String(s == null ? '' : s).replace(/[−–—]/g, '-').replace(/[\s.']/g, ''); return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; }
  function pm(p) { return '<mo>(</mo>' + A.mmlPoly(p) + '<mo>)</mo>'; }
  function mathExpr(o) {
    if (o.t === 'expr') return '<math>' + rendi(o.ast, 'L', MML) + '</math>';
    if (o.t === 'somma') return '<math>' + pm(o.p) + '<mo>+</mo>' + pm(o.q) + '</math>';
    if (o.t === 'diff') return '<math>' + pm(o.p) + '<mo>−</mo>' + pm(o.q) + '</math>';
    if (o.t === 'monopoly') return '<math>' + A.mmlMono(o.m) + pm(o.p) + '</math>';
    if (o.t === 'poly') return '<math>' + pm(o.p) + pm(o.q) + '</math>';
    return '<math>' + A.mmlPoly(o.p) + '</math>';
  }
  function testoExpr(o) {
    if (o.t === 'expr') return rendi(o.ast, 'L', TXT);
    var P = function (p) { return '(' + A.testoPoly(p) + ')'; };
    if (o.t === 'somma') return P(o.p) + ' + ' + P(o.q);
    if (o.t === 'diff') return P(o.p) + ' − ' + P(o.q);
    if (o.t === 'monopoly') return A.testoMono(o.m) + P(o.p);
    if (o.t === 'poly') return P(o.p) + P(o.q);
    return A.testoPoly(o.p);
  }
  function risultato(o) {
    if (o.t === 'expr') return valuta(o.ast);
    if (o.t === 'somma') return A.add(o.p, o.q);
    if (o.t === 'diff') return A.sub(o.p, o.q);
    if (o.t === 'monopoly') return A.mulP([o.m], o.p);
    if (o.t === 'poly') return A.mulP(o.p, o.q);
    return A.riduci(o.p);
  }
  /* risposte */
  function polyQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaPoly(v, att); }, aiuti: aiuti, rivela: function () { return A.testoPoly(att); }, spiega: spiega }; }
  function monoQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', testo_libero: true, titolo: tit, testo: testoP, verifica: function (v) { return A.giudicaMono(v, att); }, aiuti: aiuti, rivela: function () { return A.testoMono(att); }, spiega: spiega }; }
  function numQ(att, aiuti, spiega, tit, testoP) { return { tipo: 'num', atteso: att, titolo: tit, testo: testoP, verifica: function (v) { var x = intero(v); if (x === null) return { ok: false, msg: 'Scrivi un numero intero (con il segno − se è negativo).' }; return { ok: x === att }; }, aiuti: aiuti, rivela: function () { return String(att); }, spiega: spiega }; }
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
    if (o.t === 'expr') return defExpr(o);
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


  /* ── lettura di una riga: «(3x^2+2x-1) + (x^2-4x+5)», «2x(3x-1)», «(x+3)(x+2)», «3x+2-x+5» ── */
  function Err(m) { this.msg = m; }
  var SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function pulisci(s) {
    s = String(s || '').replace(/\s+/g, '').replace(/[−–—]/g, '-').replace(/[·×]/g, '*');
    return s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUPD.indexOf(c); }).join(''); });
  }
  function operando(s, cosa) {
    var p = A.parsePoly(s);
    if (!p) throw new Err(cosa + ' va scritto con i segni + e −, per esempio 3x^2-5x+2');
    return p;
  }
  function limiti(lista) {
    lista.forEach(function (m) {
      if (Math.abs(m.c) > 99) throw new Err('coefficienti troppo grandi: al massimo 99');
      Object.keys(m.e).forEach(function (k) { if (m.e[k] > 6) throw new Err('esponenti troppo grandi: al massimo 6'); });
    });
    if (lista.length > 6) throw new Err('al massimo 6 termini per polinomio');
  }
  function leggiBase(testo) {
    var s = pulisci(testo);
    if (!s) throw new Err('scrivi l\'operazione, per esempio (3x^2+2x-1)+(x^2-4x+5)');
    if (s.length > 90) throw new Err('espressione troppo lunga');
    if (/\//.test(s)) throw new Err('le frazioni e le divisioni non sono previste nei polinomi');
    if (/[^0-9a-z+\-*^()]/.test(s)) throw new Err('caratteri non ammessi: usa cifre, lettere minuscole, + − · ^ e parentesi');
    var voci = [], depth = 0, cur = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === '(') { if (depth) throw new Err('le parentesi dentro le parentesi non sono previste'); if (cur) voci.push({ g: false, s: cur }); cur = ''; depth = 1; }
      else if (c === ')') { if (!depth) throw new Err('parentesi chiusa senza apertura'); voci.push({ g: true, s: cur }); cur = ''; depth = 0; }
      else cur += c;
    }
    if (depth) throw new Err('manca una parentesi chiusa');
    if (cur) voci.push({ g: false, s: cur });
    var n = voci.length, g = voci.map(function (v) { return v.g ? 'G' : 'T'; }).join(''), o;
    if (g === 'T') {
      var p0 = operando(voci[0].s, 'il polinomio');
      if (!p0.nonRidotto) throw new Err('non ci sono termini simili da sommare: scrivi un polinomio con almeno due termini simili');
      o = { t: 'riduci', p: p0.termini };
    } else if (g === 'GTG' && /^[+-]$/.test(voci[1].s)) {
      o = { t: voci[1].s === '+' ? 'somma' : 'diff', p: operando(voci[0].s, 'il primo polinomio').termini, q: operando(voci[2].s, 'il secondo polinomio').termini };
    } else if (g === 'GG' || (g === 'GTG' && voci[1].s === '*')) {
      o = { t: 'poly', p: operando(voci[0].s, 'il primo polinomio').termini, q: operando(voci[n - 1].s, 'il secondo polinomio').termini };
    } else if (g === 'TG') {
      var mt = voci[0].s.replace(/\*$/, ''), m = A.parseMono(mt);
      if (!m) throw new Err('prima della parentesi scrivi un monomio, per esempio 2x(3x-1) oppure -3a^2(a+b)');
      o = { t: 'monopoly', m: m, p: operando(voci[1].s, 'il polinomio').termini };
    } else throw new Err('scrivi una di queste forme: (3x^2+2x-1)+(x^2-4x+5), (3x-2)-(x+4), 2x(3x-1), (x+3)(x+2), 3x+2-x+5');
    [o.p, o.q].forEach(function (lst) { if (lst) limiti(lst); });
    if (o.m) limiti([o.m]);
    if (o.t !== 'riduci') [o.p, o.q].forEach(function (lst) { if (lst && lst.length < 2) throw new Err('ogni polinomio deve avere almeno due termini'); if (lst && A.riduci(lst).length !== lst.length) throw new Err('dentro le parentesi ci sono termini simili da ridurre: scrivi i polinomi già ridotti'); });
    if (!risultato(o).length) throw new Err('il risultato sarebbe 0: scegli altri polinomi');
    return o;
  }

  /* ── espressioni generali: parentesi tonde, quadre e graffe annidate (coefficienti interi) ── */
  var APRI = { '(': ')', '[': ']', '{': '}' }, NOMEBR = { '(': 'tonda', '[': 'quadra', '{': 'graffa' };
  var MML = {
    mono: function (m) { return A.mmlPoly([m]); }, poly: function (p) { return A.mmlPoly(p); },
    op: function (c) { return '<mo>' + c + '</mo>'; }, br: function (c) { return '<mo>' + c + '</mo>'; },
    pow: function (b, n) { return '<msup><mrow>' + b + '</mrow><mn>' + n + '</mn></msup>'; }, per: '<mo>·</mo>'
  };
  var TXT = {
    mono: function (m) { return A.testoPoly([m]); }, poly: function (p) { return A.testoPoly(p); },
    op: function (c) { return c; }, br: function (c) { return c; },
    pow: function (b, n) { return b + '^' + n; }, per: '·'
  };
  function valuta(n) {
    switch (n.k) {
      case 'mono': return [n.m];
      case 'val': return n.p;
      case 'neg': return A.neg(valuta(n.a));
      case 'add': return A.add(valuta(n.a), valuta(n.b));
      case 'sub': return A.sub(valuta(n.a), valuta(n.b));
      case 'mul': return A.mulP(valuta(n.a), valuta(n.b));
      case 'pow': { var b = valuta(n.a), r = b; for (var i = 1; i < n.n; i++) r = A.mulP(r, b); return r; }
      default: return valuta(n.a); /* grp */
    }
  }
  function iniziaConCifra(n) { return n.k === 'mono' ? !Object.keys(n.m.e).length || n.m.c !== 1 : n.k === 'val'; }
  function rendi(n, ctx, M) {
    switch (n.k) {
      case 'mono': return M.mono(n.m);
      case 'val': {
        var p = n.p, txt = p.length ? M.poly(p) : M.poly([A.M(0, {})]);
        var avvolgi = (p.length > 1 && (ctx === 'R-' || ctx === 'mul' || ctx === 'pow' || ctx === 'neg')) || (p.length === 1 && p[0].c < 0 && ctx !== 'L');
        return avvolgi ? M.br('(') + txt + M.br(')') : txt;
      }
      case 'grp': { var r = M.br(n.br) + rendi(n.a, 'L', M) + M.br(APRI[n.br]); return r; }
      case 'neg': return M.op('−') + rendi(n.a, 'L', M);
      case 'add': return rendi(n.a, 'L', M) + M.op('+') + rendi(n.b, 'R+', M);
      case 'sub': return rendi(n.a, 'L', M) + M.op('−') + rendi(n.b, 'R-', M);
      case 'mul': return rendi(n.a, 'mul', M) + (iniziaConCifra(n.b) ? M.per : '') + rendi(n.b, 'mul', M);
      case 'pow': return M.pow(rendi(n.a, 'pow', M), n.n);
    }
  }
  function haGruppi(n) { return n.k === 'grp' || (n.a && haGruppi(n.a)) || (n.b && haGruppi(n.b)); }
  function parseGen(s) {
    var i = 0;
    function peek() { return s.charAt(i); }
    function potenza(n) {
      i++; var d = /^\d+/.exec(s.slice(i)); if (!d) throw new Err('dopo ^ serve un numero, per esempio (x+1)^2');
      var e = +d[0]; if (e < 2 || e > 3) throw new Err('le potenze vanno da 2 a 3'); i += d[0].length; return { k: 'pow', a: n, n: e };
    }
    function fattore(depth) {
      var c = peek();
      if (APRI[c]) {
        if (depth >= 4) throw new Err('troppe parentesi una dentro l\'altra: al massimo 4 livelli');
        i++; var inner = espr(depth + 1);
        if (peek() !== APRI[c]) throw new Err('a ogni parentesi ' + NOMEBR[c] + ' aperta «' + c + '» deve corrispondere la chiusa «' + APRI[c] + '»');
        i++; var n = { k: 'grp', br: c, a: inner };
        return peek() === '^' ? potenza(n) : n;
      }
      var m = /^(\d*)((?:[a-z](?:\^\d+)?)*)/.exec(s.slice(i));
      if (!m || !m[0]) throw new Err('non capisco «' + s.slice(i, i + 6) + '»: scrivi monomi come 3x^2, parentesi e le operazioni + − ·');
      i += m[0].length;
      var mono = A.parseMono(m[0]); if (!mono) throw new Err('monomio non valido: «' + m[0] + '»');
      var nn = { k: 'mono', m: mono };
      if (peek() === '^') { if (m[2]) throw new Err('l\'esponente va scritto subito dopo la lettera, per esempio x^2'); return potenza(nn); }
      return nn;
    }
    function termine(depth) {
      var n = fattore(depth);
      for (;;) {
        var c = peek();
        if (c === '*') { i++; n = { k: 'mul', a: n, b: fattore(depth) }; }
        else if (APRI[c] || /[a-z]/.test(c)) n = { k: 'mul', a: n, b: fattore(depth) };
        else if (/\d/.test(c)) throw new Err('tra un numero e una parentesi, o tra due numeri, scrivi il segno · (per esempio (x+1)·2)');
        else return n;
      }
    }
    function espr(depth) {
      var neg = false; if (peek() === '-') { neg = true; i++; }
      var n = termine(depth); if (neg) n = { k: 'neg', a: n };
      while (peek() === '+' || peek() === '-') {
        var op = peek(); i++;
        if (peek() === '+' || peek() === '-') throw new Err('due segni di seguito: usa le parentesi, per esempio 3-(-2x)');
        n = { k: op === '+' ? 'add' : 'sub', a: n, b: termine(depth) };
      }
      return n;
    }
    var ast = espr(0);
    if (i < s.length) throw new Err(')]}'.indexOf(peek()) >= 0 ? 'parentesi chiusa senza apertura' : 'non capisco «' + s.slice(i, i + 6) + '»');
    return ast;
  }
  function leggiGen(testo) {
    var s = pulisci(testo);
    if (!s) throw new Err('scrivi l\'espressione, per esempio 2[3(x+1)-(x-4)]-5x');
    if (s.length > 120) throw new Err('espressione troppo lunga');
    if (/\//.test(s)) throw new Err('le frazioni e le divisioni non sono ancora previste');
    if (/[^0-9a-z+\-*^()\[\]{}]/.test(s)) throw new Err('caratteri non ammessi: usa cifre, lettere minuscole, + − · ^ e le parentesi ( ) [ ] { }');
    var ast = parseGen(s);
    if (!haGruppi(ast)) throw new Err('scrivi almeno una parentesi');
    var r = valuta(ast);
    if (!r.length) throw new Err('il risultato sarebbe 0: scegli un\'altra espressione');
    limiti(r);
    var o = { t: 'expr', ast: ast };
    if (defExpr(o).passi.length > 14) throw new Err('espressione troppo lunga da guidare passo passo: dividila in due esercizi');
    return o;
  }
  function leggi(testo) {
    try { return leggiBase(testo); }
    catch (e1) {
      if (!(e1 instanceof Err)) throw e1;
      try { return leggiGen(testo); }
      catch (e2) { if (!(e2 instanceof Err)) throw e2; throw (/[()\[\]{}^]/.test(pulisci(testo)) ? e2 : e1); }
    }
  }
  /* passo passo di un'espressione: da dentro a fuori */
  function letterale(n) { return n.k === 'mono' || n.k === 'val' || ((n.k === 'add' || n.k === 'sub') && letterale(n.a) && letterale(n.b)) || (n.k === 'neg' && letterale(n.a)); }
  function conta(n) { return n.k === 'val' ? n.p.length : n.k === 'mono' ? 1 : (conta(n.a) + (n.b ? conta(n.b) : 0)); }
  function defExpr(o) {
    var passi = [], r = valuta(o.ast);
    function passo(nodo, tipo, valore) {
      var disp = rendi(nodo, 'L', MML), tit = { grp: 'Semplifica dentro la parentesi', mul: 'Calcola il prodotto', pow: 'Calcola la potenza', fin: 'Togli le parentesi e riduci' }[tipo];
      var aiuti = { grp: ['Dentro la parentesi fai prima i prodotti, poi somma i termini simili.', 'Se davanti a una parentesi interna c\'è un −, cambia il segno a ogni termine che c\'è dentro.'],
        mul: ['Moltiplica ogni termine del primo fattore per ogni termine del secondo: coefficienti per coefficienti, esponenti sommati.'],
        pow: ['Una potenza è una moltiplicazione ripetuta: (a)² = (a)·(a).'],
        fin: ['Con il + davanti la parentesi si toglie senza cambiare niente; con il − si cambiano tutti i segni. Poi somma i termini simili.'] }[tipo];
      passi.push({ tipo: 'num', testo_libero: true, titolo: tit, testo: 'Scrivi il polinomio ridotto: <math>' + disp + '</math>',
        verifica: function (v) { return A.giudicaPoly(v, valore); }, aiuti: aiuti, rivela: function () { return A.testoPoly(valore); },
        spiega: '<math>' + disp + '</math> = <strong>' + A.testoPoly(valore) + '</strong>.' });
    }
    function cammina(n) {
      switch (n.k) {
        case 'mono': case 'val': return n;
        case 'neg': return { k: 'neg', a: cammina(n.a) };
        case 'add': case 'sub': return { k: n.k, a: cammina(n.a), b: cammina(n.b) };
        case 'grp': {
          var dentro = cammina(n.a), d = { k: 'grp', br: n.br, a: dentro };
          if (letterale(dentro) && conta(dentro) === valuta(dentro).length) return d;
          var v = valuta(dentro); passo(d, 'grp', v); return { k: 'grp', br: n.br, a: { k: 'val', p: v } };
        }
        case 'mul': { var m = { k: 'mul', a: cammina(n.a), b: cammina(n.b) }, vm = valuta(m); passo(m, 'mul', vm); return { k: 'val', p: vm }; }
        case 'pow': { var q = { k: 'pow', a: cammina(n.a), n: n.n }, vq = valuta(q); passo(q, 'pow', vq); return { k: 'val', p: vq }; }
      }
    }
    var fin = cammina(o.ast);
    if (fin.k !== 'val') passo(fin, 'fin', r);
    return { testata: '<p class="tt-q">Calcola: <math>' + rendi(o.ast, 'L', MML) + '</math></p>', passi: passi,
      fine: '<p class="tt-q">' + rendi(o.ast, 'L', TXT) + ' = ' + A.testoPoly(r) + '</p><p class="mm-p">Si calcola da dentro a fuori: prima le parentesi più interne, poi prodotti e potenze, infine si sommano i termini simili.</p>' };
  }

  /* ── quello che serve a raccolta.js ── */
  function domanda(o) {
    var istr = { somma: 'Calcola la somma e scrivi il polinomio ridotto:', diff: 'Calcola la differenza e scrivi il polinomio ridotto:', monopoly: 'Calcola il prodotto e scrivi il polinomio ridotto:', poly: 'Calcola il prodotto e scrivi il polinomio ridotto:', riduci: 'Riduci il polinomio (somma i termini simili):', expr: 'Calcola l\'espressione e scrivi il polinomio ridotto:' }[o.t];
    return '<p class="mm-dom">' + istr + '</p><div class="fz-dom">' + mathExpr(o) + '</div>';
  }
  function giudica(o, v) {
    var r = A.giudicaPoly(v, risultato(o));
    if (r.ok) return { ok: true, msg: '' };
    if (r.quasi) return { ok: false, cls: 'mezzo', msg: r.msg };
    return { ok: false, cls: 'no', msg: r.msg || 'Non ancora. Ricontrolla i passaggi, oppure fatti guidare passo passo.' };
  }
  function soluzione(o) {
    var r = risultato(o), d = defOp(o);
    return '<p>Risultato: ' + A.mathPoly(r) + '</p>' + d.fine.replace(/^<p class="tt-q">.*?<\/p>/, '');
  }
  function stampa(o) {
    var inner = mathExpr(o).replace(/^<math>|<\/math>$/g, '');
    return (o.t === 'riduci' ? 'Riduci il polinomio: ' : o.t === 'expr' ? 'Calcola: ' : o.t === 'somma' ? 'Calcola la somma: ' : o.t === 'diff' ? 'Calcola la differenza: ' : 'Calcola il prodotto: ') + '<math>' + inner + '<mo>=</mo><mo>…</mo></math>';
  }
  function solStampa(o) {
    var inner = mathExpr(o).replace(/^<math>|<\/math>$/g, ''), r = A.mathPoly(risultato(o)).replace(/^<math>|<\/math>$/g, '');
    return '<math>' + inner + '<mo>=</mo>' + r + '</math>';
  }
  function suggerimento(o) {
    return { somma: 'Con il + davanti la parentesi si toglie senza cambiare i segni; poi somma i coefficienti dei termini simili.',
      diff: 'Con il − davanti la parentesi si toglie cambiando il segno a tutti i termini che ci sono dentro; poi somma i termini simili.',
      monopoly: 'Moltiplica il monomio per ogni termine del polinomio: coefficienti per coefficienti, esponenti delle stesse lettere sommati.',
      poly: 'Moltiplica ogni termine del primo polinomio per ogni termine del secondo, poi somma i termini simili.',
      riduci: 'Somma i coefficienti dei termini con la stessa parte letterale e scrivi il risultato dal grado più alto al più basso.',
      expr: 'Parti dalle parentesi più interne e vai verso l\'esterno: dentro ogni parentesi fai prima i prodotti, poi somma i termini simili. Con il − davanti a una parentesi cambia il segno a tutto ciò che c\'è dentro. Se serve, usa «Aiutami passo passo».' }[o.t];
  }
  function costruisci(o) { return defOp(o); }

  return { leggi: leggi, Err: Err, domanda: domanda, giudica: giudica, soluzione: soluzione, stampa: stampa, solStampa: solStampa, suggerimento: suggerimento, costruisci: costruisci, risultato: risultato };
})();
