/* ════════════════════════════════════════════════════════
   CORREZIONI — le correzioni dei docenti, valide subito per tutti
   Va caricato DOPO i file dei dati della pagina (parole.js, dialoghi-dati.js, ...) e PRIMA del codice della pagina:
   corregge i dati prima che la pagina li mostri, così la correzione vale ovunque (testo, esercizi, giochi, voce).
   1) applica subito le correzioni salvate nel browser dall'ultima visita;
   2) chiede al server quelle in vigore; se sono cambiate, rimette gli originali, applica le nuove
      e fa ridisegnare la pagina (l'evento «lingua», che tutte le pagine di Lingue ascoltano).
   Le chiavi delle frasi sono le stesse delle spunte (aula/lingue/revisione.js):
     sezione|frase italiana (vocabolario) · dl|scena|riga · im|storia|passo|cliente o indice della risposta
     av|frase italiana · av-ascolto|id · av-email|id|paragrafo · lz|frase italiana (esempi delle lezioni)
   Vale anche per i dati caricati dopo (le pagine riservate dell'area docenti, come Verifiche): si correggono all'arrivo.
   CORREZIONI.aggiorna(lista)  per chi corregge: applica la lista nuova senza ricaricare
   ════════════════════════════════════════════════════════ */
window.CORREZIONI = (function () {
  'use strict';
  var API = 'https://sawclsysqnjsvbobioqo.supabase.co/functions/v1/studio-genera', CH = 'lingue-correzioni';
  var originali = {}, attuali = [];
  function arr(x) { return Array.isArray(x) ? x : []; }

  /* il punto dei dati dove sta la frase: [oggetto, proprietà] (oppure null se non c'è) */
  function dove(k, l) {
    var p = k.split('|'), id = p[0], resto = k.slice(id.length + 1), out = [];
    if (id === 'dl') { arr(window.DIALOGHI).forEach(function (s) { var r = s.id === p[1] && s.righe[+p[2]]; if (r && r[2]) out.push([r[2], l]); }); }
    else if (id === 'im') {
      arr(window.IMPREVISTI).forEach(function (s) {
        var ps = s.id === p[1] && s.passi && s.passi[+p[2]]; if (!ps) return;
        if (p[3] === 'cliente') out.push([ps.cliente, l]); else if (ps.opzioni[+p[3]]) out.push([ps.opzioni[+p[3]].testo, l]);
      });
    } else if (id === 'av' && window.AVANZATO) {
      arr(window.AVANZATO.SITUAZIONI).forEach(function (s) { arr(s.frasi).forEach(function (f) { if (f[0] === resto) out.push([f[1], l]); }); });
      arr(window.AVANZATO.REGISTRO).forEach(function (r) { if (r[2] && r[2][l]) { if (r[0] === resto) out.push([r[2][l], 0]); if (r[1] === resto) out.push([r[2][l], 1]); } });
    } else if (id === 'av-ascolto' && window.AVANZATO) { arr(window.AVANZATO.ASCOLTI).forEach(function (a) { if (a.id === resto) out.push([a.testi, l]); }); }
    else if (id === 'av-email' && window.AVANZATO) { arr(window.AVANZATO.EMAIL).forEach(function (e) { if (e.id === p[1] && e.par[l]) out.push([e.par[l], +p[2]]); }); }
    else if (id === 'lz') {
      arr(window.LEZIONI).forEach(function (lez) { var x = lez.lingue && lez.lingue[l]; arr(x && x.schede).forEach(function (s) { arr(s.esempi).forEach(function (e) { if (e[1] === resto) out.push([e, 0]); }); }); });
    } else if (window.VOCABOLARIO && window.VOCABOLARIO.PAROLE && window.VOCABOLARIO.PAROLE[id]) {
      window.VOCABOLARIO.PAROLE[id].forEach(function (v) { if (v[0] === resto && v[1][l]) out.push([v[1][l], 0]); });
    }
    return out;
  }
  function applica(lista) {
    /* prima si rimettono gli originali (così un «annulla» torna davvero indietro), poi le correzioni in vigore */
    Object.keys(originali).forEach(function (id) { originali[id].forEach(function (o) { o[0][o[1]] = o[2]; }); });
    originali = {}; attuali = lista || [];
    attuali.forEach(function (c) {
      var id = c.k + '\u0000' + c.l, punti = dove(c.k, c.l);
      if (!punti.length) return;
      originali[id] = punti.map(function (x) { return [x[0], x[1], x[0][x[1]]]; });
      punti.forEach(function (x) { x[0][x[1]] = c.t; });
    });
  }
  function ridisegna() {
    var S = window.LINGUE_SITO, lin = S && S.linguaScelta ? S.linguaScelta() : undefined;
    try { document.dispatchEvent(new CustomEvent('lingua', { detail: lin })); } catch (e) {}
  }
  function aggiorna(lista, conRidisegno) {
    var prima = JSON.stringify(attuali); lista = lista || [];
    try { localStorage.setItem(CH, JSON.stringify(lista)); } catch (e) {}
    if (JSON.stringify(lista) === prima) return false;
    applica(lista); if (conRidisegno !== false) ridisegna();
    return true;
  }
  /* i dati caricati DOPO questo script (per esempio dalle pagine riservate dell'area docenti, che si aprono
     dentro la stessa scheda) vengono corretti nel momento stesso in cui arrivano */
  ['VOCABOLARIO', 'DIALOGHI', 'IMPREVISTI', 'AVANZATO', 'LEZIONI'].forEach(function (nome) {
    var valore = window[nome], d = Object.getOwnPropertyDescriptor(window, nome);
    if (d && !d.configurable) return;
    try {
      Object.defineProperty(window, nome, {
        configurable: true, enumerable: true,
        get: function () { return valore; },
        set: function (v) { valore = v; if (attuali.length) applica(attuali); }
      });
    } catch (e) {}
  });
  /* 1) subito, dai dati salvati */
  try { applica(JSON.parse(localStorage.getItem(CH) || '[]')); } catch (e) {}
  /* 2) dal server */
  fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correzioni: true }) })
    .then(function (r) { return r.json(); })
    .then(function (r) { if (r && r.ok) { var pronto = document.readyState !== 'loading'; aggiorna(r.correzioni, pronto); } })
    .catch(function () {});
  return { aggiorna: aggiorna, originale: function (k, l) { var o = originali[k + '\u0000' + l]; return o ? o[0][2] : null; } };
})();
