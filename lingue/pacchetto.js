/* ════════════════════════════════════════════════════════
   PACCHETTO — l'esercizio viaggia dentro il link
   PACCHETTO.codifica(oggetto) → Promise<testo per l'indirizzo>
   PACCHETTO.decodifica(testo) → Promise<oggetto>
   Il contenuto sta dopo il "#": il browser non lo manda al server,
   quindi nessuno lo riceve né lo salva. Se il browser sa comprimere
   (CompressionStream) il testo è più corto ("z…"), altrimenti "j…".
   PACCHETTO.voci(testo): righe "italiano = traduzione (= pronuncia)",
   oppure due o tre colonne incollate da Excel o Word (tabulazione).
   ════════════════════════════════════════════════════════ */
window.PACCHETTO = (function () {
  'use strict';
  function b64(bytes) {
    var s = ''; for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function deb64(t) {
    t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '=';
    var s = atob(t), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  }
  function passa(bytes, flusso) {
    return new Response(new Blob([bytes]).stream().pipeThrough(flusso)).arrayBuffer().then(function (a) { return new Uint8Array(a); });
  }
  var comprime = typeof CompressionStream !== 'undefined';
  function codifica(o) {
    var bytes = new TextEncoder().encode(JSON.stringify(o));
    if (!comprime) return Promise.resolve('j' + b64(bytes));
    return passa(bytes, new CompressionStream('deflate-raw')).then(function (z) { return 'z' + b64(z); }).catch(function () { return 'j' + b64(bytes); });
  }
  function decodifica(t) {
    try {
      var tipo = t.charAt(0), bytes = deb64(t.slice(1));
      var p = tipo === 'z' ? passa(bytes, new DecompressionStream('deflate-raw')) : Promise.resolve(bytes);
      return p.then(function (b) { return JSON.parse(new TextDecoder().decode(b)); });
    } catch (e) { return Promise.reject(e); }
  }
  function voci(testo) {
    var out = [], err = [];
    String(testo || '').split(/\r?\n/).forEach(function (r, i) {
      if (!r.trim()) return;
      var c = (r.indexOf('\t') >= 0 ? r.split('\t') : r.split('=')).map(function (x) { return x.trim(); });
      if (c.length < 2 || !c[0] || !c[1]) err.push(i + 1); else out.push({ it: c[0], tr: c[1], pr: c[2] || '' });
    });
    return { voci: out, err: err };
  }
  return { codifica: codifica, decodifica: decodifica, voci: voci };
})();
