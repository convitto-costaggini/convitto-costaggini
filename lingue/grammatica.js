/* ════════════════════════════════════════════════════════
   GRAMMATICA — motore comune per Verifiche e Lezioni.
   Dati: grammatica-dati.js (window.GRAMMATICA_DATI[lingua][argomento] =
   [livello, frase con _____, giusta, sbagliata1, sbagliata2, traduzione]).
   Livello: "a" = A1-A2, "b" = B1-B2.
   Da una sola frase si ricavano: scelta multipla, riordino delle parole
   e traduzione guidata. Nessun dato esce dal dispositivo.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LINGUE_SITO;
  var ARG = [
    { id: 'pres', nome: 'Presente', liv: 'A1-A2' },
    { id: 'pass', nome: 'Passato', liv: 'A2-B1' },
    { id: 'fut', nome: 'Futuro e intenzioni', liv: 'A2' },
    { id: 'cort', nome: 'Cortesia: modali e condizionale', liv: 'A2-B1' },
    { id: 'quan', nome: 'Articoli e quantità', liv: 'A1-A2' },
    { id: 'prep', nome: 'Preposizioni', liv: 'A1-B1' },
    { id: 'comp', nome: 'Comparativi e superlativi', liv: 'A2' },
    { id: 'impe', nome: 'Imperativo e istruzioni', liv: 'A1-A2' },
    { id: 'pron', nome: 'Pronomi', liv: 'A2-B1' },
    { id: 'dom', nome: 'Domande', liv: 'A1-B1' },
    { id: 'ipot', nome: 'Periodo ipotetico', liv: 'B1-B2' },
    { id: 'spec', nome: 'La particolarità della lingua', liv: 'A2-B2', per: { en: 'Forma passiva', fr: 'Congiuntivo e forme formali', es: 'Ser o estar' } }
  ];
  function dati() { return window.GRAMMATICA_DATI || {}; }
  function argomenti(lin) {
    var d = dati()[lin] || {};
    return ARG.filter(function (a) { return d[a.id] && d[a.id].length; }).map(function (a) {
      return { id: a.id, nome: (a.per && a.per[lin]) || a.nome, liv: a.liv, n: d[a.id].length };
    });
  }
  function nomeArg(lin, id) { var x = argomenti(lin).filter(function (a) { return a.id === id; })[0]; return x ? x.nome : id; }
  /* livello: 'tutti' | 'a' | 'b' */
  function pool(lin, ids, liv) {
    var d = dati()[lin] || {}, out = [];
    (ids || []).forEach(function (id) {
      (d[id] || []).forEach(function (r) {
        if (liv && liv !== 'tutti' && r[0] !== liv) return;
        out.push({ t: id, lv: r[0], d: r[1], o: [r[2], r[3], r[4]], it: r[5], full: r[1].replace('_____', r[2]) });
      });
    });
    return out;
  }
  /* n frasi, a turno tra gli argomenti scelti, senza ripetizioni */
  function scegli(lin, ids, liv, n) {
    var code = (ids || []).map(function (id) { return L.mescola(pool(lin, [id], liv)); }).filter(function (c) { return c.length; }), out = [], k = 0;
    while (out.length < n && code.some(function (c) { return c.length; })) {
      var c = code[k % code.length]; k++;
      if (c.length) out.push(c.shift());
    }
    return out;
  }
  function parole(full) { return full.replace(/\s+/g, ' ').trim().split(' '); }
  function riordina(full) {
    var p = parole(full), s = p.slice(), i = 0;
    if (p.length < 3) return null;
    do { s = L.mescola(p); i++; } while (s.join(' ') === p.join(' ') && i < 12);
    return s.join(' / ');
  }
  /* esercizi per le lezioni: uno per argomento, a scelta multipla */
  function esercizi(lin, ids, liv) {
    var per = Math.max(3, Math.min(6, Math.floor(12 / Math.max(1, ids.length))));
    return ids.map(function (id) {
      var v = scegli(lin, [id], liv, per);
      if (!v.length) return null;
      return { tipo: 'scelta', grammatica: true, titolo: 'Grammatica: ' + nomeArg(lin, id), consegna: 'Scegli la forma corretta.',
        voci: v.map(function (x) { return { d: x.d + ' (' + x.it + ')', o: x.o.slice() }; }) };
    }).filter(Boolean);
  }
  /* sezioni di verifica per le lezioni: scelta multipla + riordino */
  function sezioniVerifica(lin, ids, liv) {
    var out = [], v = scegli(lin, ids, liv, 8);
    if (v.length >= 2) out.push({ tipo: 'scelta', grammatica: true, titolo: 'Grammatica: scegli la forma corretta', punti: 1, voci: v.map(function (x) { return { d: x.d, o: x.o.slice() }; }) });
    var r = scegli(lin, ids, liv, 16).slice(8).concat(v).filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 6).map(function (x) { var s = riordina(x.full); return s ? [s, x.full] : null; }).filter(Boolean);
    if (r.length >= 2) out.push({ tipo: 'traduci', grammatica: true, titolo: 'Sintassi: rimetti in ordine le parole', punti: 1, voci: r });
    return out;
  }
  /* domande per lo strumento Verifiche: n = {scelta, ordine, traduci}, pt = punti */
  function domandeVerifica(lin, ids, liv, n, pt, nid, conTrad) {
    var tot = (n.scelta || 0) + (n.ordine || 0) + (n.traduci || 0), v = scegli(lin, ids, liv, tot), out = [], nome = (L.lingua(lin) || {}).nome || lin;
    v.slice(0, n.scelta || 0).forEach(function (x) {
      out.push({ id: nid(), tipo: 'scelta', consegna: 'Scegli la forma corretta' + (conTrad ? ': ' + x.d + ' (' + x.it + ')' : ': ' + x.d), opzioni: x.o.slice(), giusta: 0, punti: pt.scelta });
    });
    v.slice(n.scelta || 0, (n.scelta || 0) + (n.ordine || 0)).forEach(function (x) {
      var s = riordina(x.full); if (s) out.push({ id: nid(), tipo: 'traduci', consegna: 'Rimetti in ordine le parole e scrivi la frase:', frase: s, risposta: x.full, punti: pt.ordine });
    });
    v.slice((n.scelta || 0) + (n.ordine || 0)).forEach(function (x) {
      out.push({ id: nid(), tipo: 'traduci', consegna: 'Traduci in ' + nome.toLowerCase() + ':', frase: x.it, risposta: x.full, punti: pt.traduci });
    });
    return out;
  }
  window.GRAMMATICA = { ARG: ARG, argomenti: argomenti, nomeArg: nomeArg, pool: pool, scegli: scegli, esercizi: esercizi, sezioniVerifica: sezioniVerifica, domandeVerifica: domandeVerifica, riordina: riordina };
})();
