/* ════════════════════════════════════════════════════════
   GRAMMATICA — motore comune per Verifiche e Lezioni.
   Dati: grammatica-dati.js (window.GRAMMATICA_DATI[lingua][argomento] =
   [livello, frase con _____, giusta, sbagliata1, sbagliata2, traduzione]).
   Livello: "a" = A1-A2, "b" = B1-B2.
   Da una sola frase si ricavano: scelta multipla, riordino delle parole,
   completamento e traduzione guidata. Gli argomenti propri dei docenti
   (regola o procedura + frasi) stanno in 'gram-miei', solo su questo
   dispositivo, e funzionano ovunque come quelli già pronti.
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
  /* ── argomenti propri: { id, lin, nome, regola, righe } */
  var temp = null; /* argomenti arrivati con un link: solo in memoria, non si salvano */
  function miei() {
    var a = L.leggi('gram-miei', []); a = Array.isArray(a) ? a : [];
    return temp ? a.filter(function (m) { return !temp.some(function (t) { return t.id === m.id; }); }).concat(temp) : a;
  }
  function salvaMiei(a) { if (temp) a = a.filter(function (m) { return !temp.some(function (t) { return t.id === m.id; }); }); L.salva('gram-miei', a); }
  function isMio(id) { return String(id).charAt(0) === 'm' && id.length > 2; }
  /* una riga: «frase con [parola giusta] | sbagliata | sbagliata = traduzione italiana» */
  function leggiRiga(r) {
    r = String(r || '').trim(); if (!r) return null;
    var it = '', k = r.lastIndexOf(' = ');
    if (k > 0) { it = r.slice(k + 3).trim(); r = r.slice(0, k).trim(); }
    var p = r.split('|').map(function (x) { return x.trim(); }), fr = p[0], m = fr.match(/\[([^\]]+)\]/g);
    if (!m || m.length !== 1) return { err: true, testo: r };
    var giusta = m[0].slice(1, -1).trim(); if (!giusta) return { err: true, testo: r };
    var sb = p.slice(1).filter(function (x) { return x && x.toLowerCase() !== giusta.toLowerCase(); }).slice(0, 2);
    return { d: fr.replace(m[0], '_____'), o: [giusta].concat(sb), it: it, full: fr.replace(m[0], giusta) };
  }
  function leggiRighe(testo) {
    var ok = [], err = [];
    String(testo || '').split(/\n/).forEach(function (r) { var x = leggiRiga(r); if (!x) return; if (x.err) err.push(x.testo); else ok.push(x); });
    return { ok: ok, err: err };
  }
  function argomenti(lin) {
    var d = dati()[lin] || {};
    var base = ARG.filter(function (a) { return d[a.id] && d[a.id].length; }).map(function (a) {
      return { id: a.id, nome: (a.per && a.per[lin]) || a.nome, liv: a.liv, n: d[a.id].length };
    });
    var propri = miei().filter(function (m) { return m.lin === lin; }).map(function (m) { return { id: m.id, nome: m.nome, liv: 'vostro', n: leggiRighe(m.righe).ok.length, mio: true }; });
    return base.concat(propri);
  }
  function nomeArg(lin, id) { var x = argomenti(lin).filter(function (a) { return a.id === id; })[0]; return x ? x.nome : id; }
  /* livello: 'tutti' | 'a' | 'b' */
  function pool(lin, ids, liv) {
    var d = dati()[lin] || {}, out = [];
    (ids || []).forEach(function (id) {
      if (isMio(id)) {
        var m = miei().filter(function (x) { return x.id === id && x.lin === lin; })[0];
        if (m) leggiRighe(m.righe).ok.forEach(function (x) { out.push({ t: id, lv: 'm', d: x.d, o: x.o, it: x.it, full: x.full }); });
        return;
      }
      (d[id] || []).forEach(function (r) {
        if (liv && liv !== 'tutti' && r[0] !== liv) return;
        out.push({ t: id, lv: r[0], d: r[1], o: [r[2], r[3], r[4]], it: r[5], full: r[1].replace('_____', r[2]) });
      });
    });
    return out;
  }
  /* n frasi, a turno tra gli argomenti scelti, senza ripetizioni */
  function scegli(lin, ids, liv, n, filtro, escludi) {
    var code = (ids || []).map(function (id) { return L.mescola(pool(lin, [id], liv)).filter(function (x) { return (!filtro || filtro(x)) && !(escludi && escludi.indexOf(x) >= 0); }); }).filter(function (c) { return c.length; }), out = [], k = 0;
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
  var haScelta = function (x) { return x.o.length >= 2; };
  var haTrad = function (x) { return !!x.it; };
  /* esercizi per le lezioni: uno per argomento (scelta multipla; completamento per le frasi senza risposte sbagliate) */
  function esercizi(lin, ids, liv) {
    var per = Math.max(3, Math.min(6, Math.floor(12 / Math.max(1, ids.length)))), out = [];
    ids.forEach(function (id) {
      var v = scegli(lin, [id], liv, per, haScelta);
      if (v.length) out.push({ tipo: 'scelta', grammatica: true, titolo: 'Grammatica: ' + nomeArg(lin, id), consegna: 'Scegli la forma corretta.',
        voci: v.map(function (x) { return { d: x.d + (x.it ? ' (' + x.it + ')' : ''), o: x.o.slice() }; }) });
      var c = scegli(lin, [id], liv, per, function (x) { return !haScelta(x); });
      if (c.length >= 2) out.push({ tipo: 'completa', grammatica: true, titolo: 'Grammatica: ' + nomeArg(lin, id) + ' (completa)', consegna: 'Completa ogni frase con la parola giusta.',
        testo: c.map(function (x) { return x.d.replace('_____', '[' + x.o[0] + ']'); }).join(' ') });
    });
    return out;
  }
  /* una scheda per ogni argomento proprio che ha una regola o delle frasi */
  function schede(lin, ids) {
    var out = [];
    ids.forEach(function (id) {
      if (!isMio(id)) return;
      var m = miei().filter(function (x) { return x.id === id && x.lin === lin; })[0]; if (!m) return;
      var ok = leggiRighe(m.righe).ok;
      if (!m.regola && !ok.length) return;
      out.push({ titolo: '📌 ' + m.nome, testo: m.regola || 'Guarda gli esempi: poi mettiti alla prova negli esercizi.', esempi: ok.slice(0, 5).map(function (x) { return [x.full, x.it || '']; }) });
    });
    return out;
  }
  /* sezioni di verifica per le lezioni: scelta multipla + riordino delle parole */
  function sezioniVerifica(lin, ids, liv) {
    var out = [], v = scegli(lin, ids, liv, 8, haScelta);
    if (v.length >= 2) out.push({ tipo: 'scelta', grammatica: true, titolo: 'Grammatica: scegli la forma corretta', punti: 1, voci: v.map(function (x) { return { d: x.d, o: x.o.slice() }; }) });
    var r = scegli(lin, ids, liv, 6).map(function (x) { var s = riordina(x.full); return s ? [s, x.full] : null; }).filter(Boolean);
    if (r.length >= 2) out.push({ tipo: 'traduci', grammatica: true, titolo: 'Sintassi: rimetti in ordine le parole', punti: 1, voci: r });
    return out;
  }
  /* domande per lo strumento Verifiche: n = {scelta, ordine, completa, traduci}, pt = punti */
  function domandeVerifica(lin, ids, liv, n, pt, nid, conTrad) {
    var out = [], usate = [], nome = ((L.lingua(lin) || {}).nome || lin).toLowerCase();
    function prendi(k, f) { var v = scegli(lin, ids, liv, k || 0, f, usate); usate = usate.concat(v); return v; }
    prendi(n.scelta, haScelta).forEach(function (x) {
      out.push({ id: nid(), tipo: 'scelta', consegna: 'Scegli la forma corretta: ' + x.d + (conTrad && x.it ? ' (' + x.it + ')' : ''), opzioni: x.o.slice(), giusta: 0, punti: pt.scelta });
    });
    prendi(n.completa).forEach(function (x) {
      out.push({ id: nid(), tipo: 'completa', consegna: 'Completa la frase' + (x.it ? ' (' + x.it + ')' : '') + ':', testo: x.d.replace('_____', '[' + x.o[0] + ']'), banca: false, punti: pt.completa });
    });
    prendi(n.ordine).forEach(function (x) {
      var s = riordina(x.full); if (s) out.push({ id: nid(), tipo: 'traduci', consegna: 'Rimetti in ordine le parole e scrivi la frase:', frase: s, risposta: x.full, punti: pt.ordine });
    });
    prendi(n.traduci, haTrad).forEach(function (x) {
      out.push({ id: nid(), tipo: 'traduci', consegna: 'Traduci in ' + nome + ':', frase: x.it, risposta: x.full, punti: pt.traduci });
    });
    return out;
  }
  window.GRAMMATICA = { ARG: ARG, argomenti: argomenti, nomeArg: nomeArg, pool: pool, scegli: scegli, esercizi: esercizi, schede: schede, sezioniVerifica: sezioniVerifica, domandeVerifica: domandeVerifica, riordina: riordina,
    miei: miei, salvaMiei: salvaMiei, temporanei: function (a) { temp = Array.isArray(a) ? a : null; }, isMio: isMio, leggiRighe: leggiRighe };
})();
