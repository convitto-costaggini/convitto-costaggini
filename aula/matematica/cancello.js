/* Aula · Matematica · la porta di «Crea i tuoi esercizi»: si apre solo a chi è entrato
   nell'area docenti (mail della scuola con codice monouso, oppure codice del Dipartimento).
   La prova è vera: la chiave ottenuta con l'accesso deve aprire una pagina cifrata dei docenti
   (aula/lingue/docenti/docenti-aula.enc). Lo strumento non contiene dati: la porta serve a
   riservarlo a chi insegna, non a custodire segreti. Gli esercizi per i ragazzi restano liberi. */
(function () {
  'use strict';
  var d = document.documentElement;
  d.classList.add('cr-chiuso');
  function b64d(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function prova(k) {
    if (!k) throw new Error('nessuna chiave');
    return fetch('aula/lingue/docenti/docenti-aula.enc', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('file'); return r.json(); }).then(function (o) {
      return crypto.subtle.importKey('raw', b64d(k), { name: 'AES-GCM' }, false, ['decrypt']).then(function (key) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(o.iv), additionalData: new TextEncoder().encode('docenti-aula') }, key, b64d(o.c));
      });
    });
  }
  function porta(html) { var p = document.getElementById('cr-porta-box'); if (p) p.innerHTML = html; }
  function apri() {
    d.classList.remove('cr-chiuso'); d.classList.add('cr-aperto');
    if (window.ACCESSO && ACCESSO.barra) try { ACCESSO.barra(); } catch (e) {}
  }
  function chiudi() {
    porta('<h2>Riservato a chi insegna</h2><p>«Crea i tuoi esercizi» si apre dopo l\'accesso all\'area docenti dell\'Aula: con la mail della scuola (arriva un codice monouso) oppure con il codice del Dipartimento.</p>' +
      '<div class="fz-azioni"><button type="button" class="fz-btn" id="cr-entra">Accedi come docente</button><a class="fz-btn sec cr-a" href="aula/matematica/">Torna al percorso</a></div>' +
      '<p class="au-nota" style="margin-top:1rem">Sei uno studente? Gli esercizi te li dà l\'insegnante con un link o un QR, e le tappe del <a href="aula/matematica/">percorso</a> sono aperte a tutti.</p>');
    var b = document.getElementById('cr-entra');
    if (b) b.addEventListener('click', function () { if (window.ACCESSO) ACCESSO.entra(); });
  }
  function avvio() {
    if (!window.ACCESSO || !window.crypto || !crypto.subtle) { chiudi(); return; }
    ACCESSO.silenzioso().then(prova).then(apri).catch(chiudi);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio); else avvio();
})();
