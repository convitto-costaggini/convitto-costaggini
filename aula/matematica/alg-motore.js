/* ════════════════════════════════════════════════════════════
   AULA · Matematica · il motore del calcolo letterale (ALG)
   Monomio: { c: intero (coefficiente), e: { x: 2, y: 1 } }   (esponenti positivi; costante: e = {})
   Polinomio: array di monomi (forma normale: simili sommati, senza zeri, ordinato per grado decrescente)
   Tutto con numeri interi, senza server né salvataggi.
   ════════════════════════════════════════════════════════════ */
window.ALG = (function () {
  'use strict';
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function sup(n) { return String(n).split('').map(function (d) { return SUP[d]; }).join(''); }
  function M(c, e) { var o = {}; Object.keys(e || {}).sort().forEach(function (k) { if (e[k] > 0) o[k] = e[k]; }); return { c: c, e: o }; }
  function lettere(m) { return Object.keys(m.e).sort(); }
  function grado(m) { return lettere(m).reduce(function (s, k) { return s + m.e[k]; }, 0); }
  function chiave(m) { return lettere(m).map(function (k) { return k + m.e[k]; }).join(''); }   // parte letterale come stringa
  function simili(a, b) { return chiave(a) === chiave(b); }
  function parteLetterale(m) { var l = lettere(m); return l.length ? l.map(function (k) { return k + (m.e[k] > 1 ? sup(m.e[k]) : ''); }).join('') : '1'; }
  function testoMono(m, primo) {
    var l = lettere(m), cs = l.length ? (Math.abs(m.c) === 1 ? '' : String(Math.abs(m.c))) : String(Math.abs(m.c));
    var corpo = cs + l.map(function (k) { return k + (m.e[k] > 1 ? sup(m.e[k]) : ''); }).join('');
    var neg = m.c < 0;
    if (primo === undefined) return (neg ? '−' : '') + corpo;
    return (primo ? (neg ? '−' : '') : (neg ? ' − ' : ' + ')) + corpo;
  }
  function mmlMono(m, primo) {
    var l = lettere(m), s = '';
    if (primo !== undefined) s += primo ? (m.c < 0 ? '<mo>−</mo>' : '') : '<mo>' + (m.c < 0 ? '−' : '+') + '</mo>';
    else if (m.c < 0) s += '<mo>−</mo>';
    var a = Math.abs(m.c);
    if (!l.length || a !== 1) s += '<mn>' + a + '</mn>';
    l.forEach(function (k) { s += m.e[k] > 1 ? '<msup><mi>' + k + '</mi><mn>' + m.e[k] + '</mn></msup>' : '<mi>' + k + '</mi>'; });
    return s;
  }
  function cmp(a, b) { var d = grado(b) - grado(a); if (d) return d; var ka = chiave(a), kb = chiave(b); return ka < kb ? -1 : ka > kb ? 1 : 0; }
  function riduci(p) {
    var mp = {}; p.forEach(function (m) { var k = chiave(m); if (mp[k]) mp[k].c += m.c; else mp[k] = M(m.c, m.e); });
    return Object.keys(mp).map(function (k) { return mp[k]; }).filter(function (m) { return m.c !== 0; }).sort(cmp);
  }
  function testoPoly(p) { if (!p.length) return '0'; return p.map(function (m, i) { return testoMono(m, i === 0); }).join(''); }
  function mmlPoly(p) { if (!p.length) return '<mn>0</mn>'; return p.map(function (m, i) { return mmlMono(m, i === 0); }).join(''); }
  function math(x, poly) { return '<math>' + (poly ? mmlPoly(x) : mmlMono(x)) + '</math>'; }
  function mathPoly(p) { return '<math>' + mmlPoly(p) + '</math>'; }
  /* operazioni */
  function mulM(a, b) { var e = {}; Object.keys(a.e).forEach(function (k) { e[k] = (e[k] || 0) + a.e[k]; }); Object.keys(b.e).forEach(function (k) { e[k] = (e[k] || 0) + b.e[k]; }); return M(a.c * b.c, e); }
  function divM(a, b) { /* esatta o null */
    if (b.c === 0 || a.c % b.c !== 0) return null; var e = {};
    var ok = true; Object.keys(b.e).forEach(function (k) { if ((a.e[k] || 0) < b.e[k]) ok = false; });
    if (!ok) return null;
    Object.keys(a.e).forEach(function (k) { var d = a.e[k] - (b.e[k] || 0); if (d > 0) e[k] = d; });
    return M(a.c / b.c, e);
  }
  function potM(a, n) { var e = {}; Object.keys(a.e).forEach(function (k) { e[k] = a.e[k] * n; }); return M(Math.pow(a.c, n), e); }
  function add(p, q) { return riduci(p.concat(q)); }
  function neg(p) { return p.map(function (m) { return M(-m.c, m.e); }); }
  function sub(p, q) { return riduci(p.concat(neg(q))); }
  function mulP(p, q) { var r = []; p.forEach(function (a) { q.forEach(function (b) { r.push(mulM(a, b)); }); }); return riduci(r); }
  function prodottiParziali(p, q) { var r = []; p.forEach(function (a) { q.forEach(function (b) { r.push({ a: a, b: b, p: mulM(a, b) }); }); }); return r; }
  function eq(p, q) { var a = riduci(p), b = riduci(q); return testoPoly(a) === testoPoly(b); }
  function gradoPoly(p) { return p.reduce(function (s, m) { return Math.max(s, grado(m)); }, 0); }
  function valuta(m, v) { var r = m.c; Object.keys(m.e).forEach(function (k) { r *= Math.pow(v[k], m.e[k]); }); return r; }
  function valutaP(p, v) { return p.reduce(function (s, m) { return s + valuta(m, v); }, 0); }
  /* lettura da testo */
  function norm(s) {
    s = String(s == null ? '' : s).replace(/\s+/g, '').replace(/[−–—]/g, '-').replace(/[·×]/g, '*');
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c); }).join(''); });
    return s;
  }
  function parseMono(s) {
    s = norm(s); if (s === '' || /[()]/.test(s) || /[+-]/.test(s.replace(/^[+-]/, ''))) return null;
    if (/\d\*\d/.test(s)) return null;
    s = s.replace(/\*/g, '');
    var m = /^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/.exec(s); if (!m) return null;
    if (m[2] === '' && m[3] === '') return null;
    var c = m[2] === '' ? 1 : parseInt(m[2], 10); if (m[1] === '-') c = -c;
    var e = {}, re = /([a-z])(?:\^(\d+))?/g, t;
    while ((t = re.exec(m[3]))) e[t[1]] = (e[t[1]] || 0) + (t[2] ? parseInt(t[2], 10) : 1);
    return M(c, e);
  }
  function parsePoly(s) {
    s = norm(s); if (s === '' || /[()]/.test(s)) return null;
    var termini = s.match(/[+-]?[^+-]+/g); if (!termini || termini.join('') !== s) return null;
    var lista = []; for (var i = 0; i < termini.length; i++) { var m = parseMono(termini[i]); if (!m) return null; lista.push(m); }
    return { termini: lista, ridotto: riduci(lista), nonRidotto: riduci(lista).length !== lista.length };
  }
  /* controllo di una risposta-monomio: {ok, msg} */
  function giudicaMono(raw, att) {
    var m = parseMono(raw);
    if (!m) return { ok: false, msg: 'Scrivi il monomio con il coefficiente e le lettere, per esempio 6x^3y oppure −2a^2b.' };
    if (testoMono(m) === testoMono(att)) return { ok: true };
    return { ok: false };
  }
  function giudicaPoly(raw, att) {
    var p = parsePoly(raw);
    if (!p) return { ok: false, msg: 'Scrivi il polinomio con i segni + e −, senza parentesi, per esempio 3x^2 − 5x + 2.' };
    if (testoPoly(p.ridotto) === testoPoly(riduci(att))) return p.nonRidotto ? { ok: false, quasi: true, msg: 'Il valore è giusto, ma ci sono ancora termini simili da sommare: riduci il polinomio.' } : { ok: true };
    return { ok: false };
  }
  /* generatori */
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  function casualeMono(o) {
    o = o || {}; var lett = o.lettere || ['x', 'y'], maxE = o.maxE || 3, maxC = o.maxC || 9, e = {}, nl = o.nl || rnd(1, Math.min(2, lett.length));
    var scelte = lett.slice().sort(function () { return Math.random() - 0.5; }).slice(0, nl);
    scelte.forEach(function (k) { e[k] = rnd(1, maxE); });
    var c = rnd(1, maxC); if (o.negativi !== false && Math.random() < (o.pNeg == null ? 0.35 : o.pNeg)) c = -c;
    return M(c, e);
  }
  return { sup: sup, M: M, lettere: lettere, grado: grado, chiave: chiave, simili: simili, parteLetterale: parteLetterale, testoMono: testoMono, mmlMono: mmlMono, riduci: riduci, testoPoly: testoPoly, mmlPoly: mmlPoly, math: math, mathPoly: mathPoly, mulM: mulM, divM: divM, potM: potM, add: add, sub: sub, neg: neg, mulP: mulP, prodottiParziali: prodottiParziali, eq: eq, gradoPoly: gradoPoly, valuta: valuta, valutaP: valutaP, parseMono: parseMono, parsePoly: parsePoly, giudicaMono: giudicaMono, giudicaPoly: giudicaPoly, casualeMono: casualeMono, rnd: rnd, pesca: pesca };
})();
