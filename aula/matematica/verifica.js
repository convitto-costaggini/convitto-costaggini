/* Aula · Matematica · Crea · Verifica in classe.
   Dalle righe della raccolta (la fila A, scritta da chi insegna) costruisce:
   - le file B (e C): stessi tipi di esercizio, stessa difficoltà, numeri diversi;
   - la versione con più aiuti (per studenti con DSA): stessi esercizi della fila, carattere grande,
     più spazio e un promemoria del metodo in cima al foglio;
   - la versione semplificata (per studenti con disabilità, base da rivedere con il PEI):
     circa metà degli esercizi, numeri più piccoli, promemoria e più spazio.
   Sul foglio stampato NON compare nessuna scritta che distingua le versioni: dice solo «Fila A», «Fila B»…
   Soluzioni e griglia di valutazione stanno in pagine a parte, per chi insegna.
   Le varianti sono ripetibili: stesso testo e stesso numero di «variazione» danno sempre le stesse file.
   Non salva niente e non invia niente.
   VERIFICA.costruisci(righe, opz) → { fogli: [...], avvisi: [...] }
   VERIFICA.htmlFogli(costruito, titolo, opz) → html da stampare
   VERIFICA.htmlAnteprima(costruito) → html per il controllo a schermo */
window.VERIFICA = (function () {
  'use strict';
  var R = window.RACCOLTA;
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h >>> 0; }
  function rng(seed) {
    var f = mulberry(seed);
    return { int: function (a, b) { if (b < a) b = a; return a + Math.floor(f() * (b - a + 1)); }, pick: function (l) { return l[Math.floor(f() * l.length)]; } };
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function gcdL(l) { return l.reduce(function (a, b) { return gcd(a, b); }); }
  function primo(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function omega(n) { var c = 0; for (var p = 2; p * p <= n; p++) while (n % p === 0) { n /= p; c++; } if (n > 1) c++; return c; }
  function spf(n) { for (var p = 2; p * p <= n; p++) if (n % p === 0) return p; return n; }
  function maxL(l) { return Math.max.apply(null, l); }
  function ordina(l) { return l.slice().sort(function (a, b) { return a - b; }); }

  /* ── una variante per volta: restituisce la RIGA nuova (testo) oppure null ── */
  function coppiaPrimi(r, massimo, orient) { /* p/q senza fattori comuni, con p<q, p>q oppure qualunque (orient 0) */
    for (var t = 0; t < 60; t++) {
      var p = r.int(1, massimo), q = r.int(2, massimo);
      if (p === q || gcd(p, q) !== 1) continue;
      if (orient < 0 && p > q) { var x = p; p = q; q = x; }
      if (orient > 0 && p < q) { var y = p; p = q; q = y; }
      return [p, q];
    }
    return orient > 0 ? [3, 2] : [1, 2];
  }
  function numeriMC(nums, r, facile) {
    var g = gcdL(nums), cof = nums.map(function (n) { return n / g; }), m = maxL(cof), n = nums.length, minC = (facile || Math.min.apply(null, cof) > 1) ? 2 : 1;
    for (var t = 0; t < 80; t++) {
      var g2 = g === 1 ? 1 : (facile ? r.int(2, 5) : r.int(Math.max(2, g - 3), g + 3));
      if (g !== 1 && g2 === g && t < 40) continue;
      var tetto = facile ? (n > 2 ? 3 : 4) : m + 2, c = [];
      for (var i = 0; i < n; i++) c.push(r.int(minC, Math.max(tetto, minC + 1)));
      if (gcdL(c) !== 1) continue;
      var v = c.map(function (x) { return x * g2; });
      if (v.some(function (x) { return x < 2; })) continue;
      if (new Set(v).size !== v.length) continue;
      return ordina(v);
    }
    return null;
  }
  function sostituisciNumeri(testo, da, a) { /* per valore, in un solo passaggio */
    var mappa = {}; da.forEach(function (x, i) { mappa[x] = a[i]; });
    var chiavi = Object.keys(mappa).sort(function (x, y) { return y.length - x.length; });
    if (!chiavi.length) return testo;
    var re = new RegExp('(^|[^\\d.,/])(' + chiavi.join('|') + ')(?![\\d])', 'g');
    return testo.replace(re, function (m, pre, num) { return pre + mappa[num]; });
  }
  function frazTesto(n, d) { return n + '/' + d; }
  function candidata(e, r, facile) {
    var q = e.q, k = e.k, t, i;
    if (e.motore === 'pl') { /* i coefficienti cambiano, gli esponenti no */
      var corpo = e.src.replace(/^\s*polinomio\s*/i, '');
      var nuovo = corpo.replace(/(^|[^\^\d])(\d+)/g, function (m, pre, num, off, str) {
        var n = +num, dopo = str.charAt(off + m.length), v = facile ? r.int(1, Math.min(5, n + 1)) : r.int(Math.max(1, n - 2), n + 2);
        if (v === 1 && /[(\[{]/.test(dopo)) v = 2; /* un fattore 1 davanti a una parentesi non ha senso */
        if (v === 1 && /[a-z]/.test(dopo)) return pre; /* 1x si scrive x */
        return pre + v;
      });
      return 'polinomio ' + nuovo;
    }
    if (k === 'mcd' || k === 'mcm') { var nn = numeriMC(q.nums, r, facile); return nn ? k.toUpperCase().replace('MCM', 'mcm') + ' ' + nn.join(' ') : null; }
    if (k === 'problema') {
      var nv = numeriMC(q.nums, r, facile); if (!nv) return null;
      return 'problema ' + (q.serve === 'mcd' ? 'MCD' : 'mcm') + ' ' + nv.join(' ') + ' | ' + sostituisciNumeri(q.testo, q.nums.map(String), nv.map(String));
    }
    if (k === 'scomponi') {
      var o = omega(q.n), lo = facile ? 6 : Math.max(4, Math.round(q.n * 0.5)), hi = facile ? 60 : Math.round(q.n * 1.6) + 4;
      for (t = 0; t < 400; t++) { var c = r.int(lo, hi); if (c !== q.n && !primo(c) && (omega(c) === (facile ? Math.min(o, 3) : o) || t > 250)) return 'scomponi ' + c; }
      return null;
    }
    if (k === 'primo') {
      var era = primo(q.n), p0 = spf(q.n), lo2 = facile ? 11 : Math.max(11, Math.round(q.n * 0.6)), hi2 = facile ? 41 : Math.round(q.n * 1.5) + 6;
      for (t = 0; t < 400; t++) {
        var c2 = r.int(lo2, hi2);
        if (c2 === q.n || primo(c2) !== era) continue;
        if (!era && (spf(c2) <= 5) !== (p0 <= 5) && t < 300) continue; /* i composti «difficili» restano difficili */
        return 'primo ' + c2;
      }
      return null;
    }
    if (k === 'semplifica') {
      var g = gcd(q.n, q.d), pr = coppiaPrimi(r, facile ? 5 : Math.max(q.n / g, q.d / g, 4) + 2, q.n < q.d ? -1 : 1), g2 = facile ? r.int(2, 4) : r.int(2, Math.max(g, 3) + 2);
      return 'semplifica ' + frazTesto(pr[0] * g2, pr[1] * g2);
    }
    if (k === 'confronta') {
      var rel = q.a * q.d === q.c * q.b ? 0 : (q.a * q.d > q.c * q.b ? 1 : -1), M = facile ? 6 : Math.max(q.b, q.d, 6) + 2;
      for (t = 0; t < 300; t++) {
        var b = r.int(2, M), a = r.int(1, b - 1 + (q.a > q.b ? b : 0)), d, cc;
        if (rel === 0) { if (gcd(a, b) !== 1) continue; var kk = r.int(2, 4); return 'confronta ' + frazTesto(a, b) + ' ' + frazTesto(a * kk, b * kk); }
        d = r.int(2, M); cc = r.int(1, d - 1 + (q.c > q.d ? d : 0));
        var rr = a * d === cc * b ? 0 : (a * d > cc * b ? 1 : -1), ridotte = gcd(q.a, q.b) === 1 && gcd(q.c, q.d) === 1;
        if (ridotte && (gcd(a, b) !== 1 || gcd(cc, d) !== 1)) continue;
        if (rr === rel && (a !== cc || b !== d)) return 'confronta ' + frazTesto(a, b) + ' ' + frazTesto(cc, d);
      }
      return null;
    }
    if (k === 'completa') {
      var pr2 = coppiaPrimi(r, facile ? 6 : Math.max(q.b, 6) + 2, q.a < q.b ? -1 : 0), k2 = facile ? r.int(2, 4) : r.int(2, Math.max(q.k, 4) + 1);
      return 'completa ' + frazTesto(pr2[0], pr2[1]) + ' = ' + (q.manca === 'n' ? '?/' + (pr2[1] * k2) : (pr2[0] * k2) + '/?');
    }
    if (k === 'frazione' || k === 'problema-frazione') {
      var d3 = facile ? r.int(2, 5) : r.int(Math.min(q.d, 3), Math.max(q.d + 2, 6)), n3 = r.int(1, d3 - 1);
      if (gcd(n3, d3) !== 1 && gcd(q.n, q.d) === 1) n3 = 1;
      var passo = d3 * (q.Q % 10 === 0 ? 10 : (q.Q % 5 === 0 ? 5 : 1)) / gcd(d3, q.Q % 10 === 0 ? 10 : (q.Q % 5 === 0 ? 5 : 1));
      var bassa = Math.max(passo, Math.round(q.Q * 0.6)), alta = facile ? Math.max(passo * 2, 100) : Math.round(q.Q * 1.5) + passo;
      var Q3 = passo * r.int(Math.ceil(bassa / passo), Math.max(Math.floor(alta / passo), Math.ceil(bassa / passo)));
      if (Q3 === q.Q && n3 === q.n && d3 === q.d) return null;
      if (k === 'frazione') return 'frazione ' + frazTesto(n3, d3) + ' di ' + Q3 + (q.u ? ' ' + q.u : '');
      var tx = (e.testo || '').split(frazTesto(q.n, q.d)).join('\u0001').replace(new RegExp('(^|[^\\d.,/])' + q.Q + '(?![\\d])', 'g'), function (m, p) { return p + Q3; }).split('\u0001').join(frazTesto(n3, d3));
      return 'problema frazione ' + frazTesto(n3, d3) + ' ' + Q3 + (q.u ? ' ' + q.u : '') + ' | ' + tx;
    }
    if (k === 'misto') {
      var d4 = facile ? r.int(2, 5) : r.int(Math.max(2, q.d - 1), q.d + 2), qq0 = Math.floor(q.n / q.d), qq = facile ? r.int(1, 3) : r.int(1, Math.max(qq0 + 1, 3)), r4 = r.int(1, d4 - 1);
      return 'misto ' + frazTesto(qq * d4 + r4, d4);
    }
    if (k === 'calcola') {
      var op = { '+': '+', '-': '−', '*': '·', ':': ':' }[q.op];
      function operando(n, d, kx) {
        var neg = +n < 0, an = Math.abs(+n), ad = +d, nn, dd;
        if (ad === 1) { nn = facile ? r.int(1, 6) : r.int(Math.max(1, an - 2), an + 3); dd = 1; }
        else {
          for (var u = 0; u < 40; u++) {
            dd = facile ? r.int(2, 6) : r.int(Math.max(2, ad - 2), ad + 3); nn = facile ? r.int(1, 6) : r.int(Math.max(1, an - 2), an + 3);
            if (gcd(nn, dd) === 1 && nn !== dd) break;
          }
        }
        return { n: nn, d: dd, neg: neg, k: kx };
      }
      function testoOp(o) { var s = (o.neg ? '-' : '') + (o.d === 1 ? o.n : o.n + '/' + o.d); return +o.k === 1 ? s : '(' + s + ')^' + o.k; }
      var A, B;
      for (t = 0; t < 40; t++) {
        A = operando(q.n1, q.d1, q.k1); B = operando(q.n2, q.d2, q.k2);
        if (testoOp(A) === testoOp(B)) continue;
        if ((q.op === '+' || q.op === '-') && +q.d1 !== +q.d2 && A.d === B.d) continue;
        break;
      }
      return 'calcola ' + testoOp(A) + ' ' + op + ' ' + testoOp(B);
    }
    return null;
  }
  function chiave(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }
  function variante(e, r, facile, vietate) {
    for (var t = 0; t < 120; t++) {
      var c = candidata(e, r, facile);
      if (!c || vietate[chiave(c)]) continue;
      var L = R.leggi(c);
      if (L.es.length === 1 && !L.err.length) return L.es[0];
    }
    return null;
  }

  /* ── quali esercizi finiscono nella versione semplificata: circa metà, sparsi lungo la verifica ── */
  function difficile(e) { return e.motore === 'pl' && /[\[{]/.test(e.src); }
  function scelti(n, es) {
    var m = n <= 3 ? n : Math.ceil(n / 2), v = [], i, j;
    if (m >= n) { for (i = 0; i < n; i++) v.push(i); return v; }
    for (j = 0; j < m; j++) v.push(m === 1 ? 0 : Math.round(j * (n - 1) / (m - 1)));
    v = v.filter(function (x, k) { return v.indexOf(x) === k; });
    if (es) v = v.map(function (x) { /* un esercizio troppo difficile cede il posto a uno vicino, se c'è */
      if (!difficile(es[x])) return x;
      for (var d = 1; d < n; d++) for (var sgn = -1; sgn <= 1; sgn += 2) { var y = x + sgn * d; if (y >= 0 && y < n && v.indexOf(y) < 0 && !difficile(es[y])) return y; }
      return x;
    }).sort(function (a, b) { return a - b; });
    return v;
  }

  /* ── il promemoria del metodo, in cima ai fogli con più aiuti ── */
  var PRIMI = 'Numeri primi fino a 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47.';
  var MEMO = {
    mcd: ['MCD', 'Scomponi i numeri in fattori primi. Prendi solo i fattori comuni, ciascuno con l\'esponente più piccolo, e moltiplica.'],
    mcm: ['mcm', 'Scomponi i numeri in fattori primi. Prendi tutti i fattori, comuni e non comuni, ciascuno con l\'esponente più grande, e moltiplica.'],
    scomponi: ['Scomporre', 'Dividi per il primo più piccolo possibile, poi continua con il risultato fino ad arrivare a 1.'],
    primo: ['Numero primo', 'È primo se ha solo due divisori: 1 e se stesso. Prova a dividerlo per 2, 3, 5, 7…'],
    semplifica: ['Semplificare', 'Dividi numeratore e denominatore per lo stesso numero, finché non si può più (o per il loro MCD).'],
    confronta: ['Confrontare', 'Porta le frazioni allo stesso denominatore (il mcm) e confronta i numeratori.'],
    completa: ['Frazioni equivalenti', 'Per passare da una frazione all\'altra moltiplica (o dividi) sopra e sotto per lo stesso numero.'],
    frazione: ['Frazione di una quantità', 'Dividi la quantità per il denominatore, poi moltiplica per il numeratore.'],
    misto: ['Numero misto', 'Dividi il numeratore per il denominatore: il quoziente è la parte intera, il resto è il nuovo numeratore.'],
    calcola: ['Operazioni con le frazioni', 'Somma e differenza: stesso denominatore (il mcm). Prodotto: sopra per sopra, sotto per sotto. Divisione: moltiplica per la frazione capovolta.'],
    polinomio: ['Polinomi', 'Togli le parentesi (con il segno − davanti cambiano tutti i segni), poi somma i termini simili. Nel prodotto, ogni termine per ogni termine.'],
    problema: ['Problemi', 'Leggi il testo: se devi dividere in parti uguali serve il MCD; se cerchi quando due cose coincidono di nuovo serve il mcm.']
  };
  function chiaveMemo(e) { return e.motore === 'pl' ? 'polinomio' : (e.k === 'problema' ? 'problema' : (e.k === 'problema-frazione' ? 'frazione' : e.k)); }
  function promemoria(es) {
    var viste = {}, righe = [], primi = false;
    es.forEach(function (e) {
      var c = chiaveMemo(e); if (viste[c] || !MEMO[c]) return; viste[c] = 1; righe.push(MEMO[c]);
      if (c === 'mcd' || c === 'mcm' || c === 'scomponi' || c === 'primo' || c === 'problema') primi = true;
    });
    if (!righe.length) return '';
    return '<div class="mm-promemoria vf-memo">' + (primi ? '<p><strong>' + PRIMI + '</strong></p>' : '') + righe.map(function (m) { return '<p><strong>' + esc(m[0]) + ':</strong> ' + esc(m[1]) + '</p>'; }).join('') + '</div>';
  }

  /* ── i punti: il foglio vale sempre 10; i problemi possono valere il doppio ── */
  function punti(es, doppio) {
    var w = es.map(function (e) { return doppio && /problema/.test(e.k) ? 2 : 1; }), W = w.reduce(function (a, b) { return a + b; }, 0), p = [], somma = 0;
    w.forEach(function (x, i) {
      var v = i === w.length - 1 ? Math.round((10 - somma) * 10) / 10 : Math.round(10 * x / W * 10) / 10;
      somma += v; p.push(v);
    });
    return p;
  }
  function num(x) { return String(x).replace('.', ','); }

  /* ── costruzione ── */
  function costruisci(righe, opz) {
    var L = R.leggi(righe), avvisi = [], fogli = [];
    if (!L.es.length) return { fogli: [], avvisi: ['Non c\'è ancora nessun esercizio valido: scrivili al passo 2.'], vuoto: true };
    var seme0 = hash(L.es.map(function (e) { return e.src; }).join('\n')) + 7919 * (opz.variazione || 0);
    var nomi = ['A', 'B', 'C'].slice(0, Math.max(1, Math.min(3, opz.file || 2)));
    var base = {}; /* per ogni esercizio, le righe già usate (le file non devono ripetersi) */
    L.es.forEach(function (e, i) { base[i] = {}; base[i][chiave(e.src)] = 1; });
    nomi.forEach(function (nome, fi) {
      var es = L.es.map(function (e, i) {
        if (fi === 0) return e;
        var v = variante(e, rng(seme0 + 104729 * (fi + 1) + 31 * i), false, base[i]);
        if (!v) { avvisi.push('Fila ' + nome + ', esercizio ' + (i + 1) + ': non sono riuscito a cambiare i numeri, ho lasciato quello della fila A. Riscrivilo a mano se serve.'); return e; }
        base[i][chiave(v.src)] = 1; return v;
      });
      fogli.push({ fila: nome, versione: 'ordinaria', es: es });
      if (opz.dsa) fogli.push({ fila: nome, versione: 'aiuti', es: es });
      if (opz.da) {
        var pos = scelti(es.length, L.es), facili = pos.map(function (i) {
          var v = variante(L.es[i], rng(seme0 + 15485863 * (fi + 1) + 17 * i), true, {});
          if (!v) { avvisi.push('Versione semplificata della fila ' + nome + ', esercizio ' + (i + 1) + ': ho tenuto l\'esercizio com\'era.'); return es[i]; }
          return v;
        });
        fogli.push({ fila: nome, versione: 'semplificata', es: facili });
      }
    });
    if (L.err.length) avvisi.push(L.err.length + (L.err.length === 1 ? ' riga non valida è stata ignorata' : ' righe non valide sono state ignorate') + ' (le vedi al passo 3).');
    if (L.es.some(function (e) { return /^problema/.test(e.k) || e.k === 'problema-frazione'; })) avvisi.push('Nei problemi cambiano i numeri scritti nel testo: leggi comunque le file B e C, soprattutto se il testo dice i numeri a parole.');
    return { fogli: fogli, avvisi: avvisi, doppio: !!opz.doppio };
  }

  var ETICHETTA = { ordinaria: 'versione ordinaria', aiuti: 'con più aiuti', semplificata: 'semplificata' };

  /* ── il controllo a schermo, per chi insegna ── */
  function htmlAnteprima(C) {
    if (C.vuoto) return '<p class="cr-conto">' + esc(C.avvisi[0]) + '</p>';
    var h = '<p class="cr-conto">Fogli pronti: <strong>' + C.fogli.length + '</strong> (nell\'ordine di stampa)</p>';
    C.avvisi.forEach(function (a) { h += '<div class="cr-err">' + esc(a) + '</div>'; });
    C.fogli.forEach(function (f, i) {
      h += '<details class="fz-det vf-prev"' + (i === 0 ? ' open' : '') + '><summary>' + (i + 1) + ' · Fila ' + f.fila + ' · ' + ETICHETTA[f.versione] + ' · ' + f.es.length + ' esercizi</summary><ol class="vf-es">' +
        f.es.map(function (e) { return '<li>' + R.stampa(e) + '</li>'; }).join('') + '</ol></details>';
    });
    return h;
  }

  /* ── i fogli da stampare ── */
  var INT = '<p class="fz-foglio-i">Nome ______________________ Classe ________ Data ____________</p>';
  function foglio(f, titolo, doppio, primo) {
    var P = punti(f.es, doppio), grande = f.versione !== 'ordinaria', aiuti = grande;
    var h = '<div class="fz-pag' + (primo ? '' : ' fz-sol-pag') + (grande ? ' vf-grande' : '') + '"><div class="vf-testa"><h2 class="fz-foglio-t">' + esc(titolo || 'Verifica di matematica') + ' · Fila ' + f.fila + '</h2><p class="vf-voto">Punti ______ / 10</p></div>' + INT;
    if (aiuti) h += promemoria(f.es);
    h += '<ol class="fz-es" style="--h:' + (grande ? '3.6cm' : '2.8cm') + '">';
    f.es.forEach(function (e, i) { h += '<li class="fz-es-i' + (/problema/.test(e.k) ? ' mm-es-pr' : '') + '">' + R.stampa(e) + ' <span class="vf-pt">(' + num(P[i]) + (P[i] === 1 ? ' punto' : ' punti') + ')</span></li>'; });
    return h + '</ol></div>';
  }
  function soluzioni(f, titolo, doppio) {
    var P = punti(f.es, doppio), h = '<div class="fz-pag fz-sol-pag"><h2 class="fz-foglio-t">Soluzioni · Fila ' + f.fila + ' · ' + ETICHETTA[f.versione] + '</h2><p class="fz-foglio-c">Pagina per chi corregge. ' + esc(titolo || '') + '</p><ol class="fz-es fz-es-sol">';
    f.es.forEach(function (e, i) { var s; try { s = R.solStampa(e); } catch (x) { s = '—'; } h += '<li>' + s + ' <span class="vf-pt">(' + num(P[i]) + ' pt)</span></li>'; });
    h += '</ol><table class="vf-griglia"><caption>Griglia di valutazione (totale 10 punti, sufficienza a 6)</caption><thead><tr>' + f.es.map(function (e, i) { return '<th scope="col">' + (i + 1) + '</th>'; }).join('') + '<th scope="col">Totale</th><th scope="col">Voto</th></tr></thead><tbody><tr>' +
      f.es.map(function (e, i) { return '<td>/ ' + num(P[i]) + '</td>'; }).join('') + '<td>/ 10</td><td>&nbsp;</td></tr></tbody></table></div>';
    return h;
  }
  function htmlFogli(C, titolo, opz) {
    var h = '';
    C.fogli.forEach(function (f) { h += foglio(f, titolo, C.doppio, !h); });
    if (opz && opz.soluzioni) C.fogli.forEach(function (f) { h += soluzioni(f, titolo, C.doppio); });
    return h;
  }
  return { costruisci: costruisci, htmlFogli: htmlFogli, htmlAnteprima: htmlAnteprima, _punti: punti, _scelti: scelti };
})();
