/* Percorso di adesione all'Area riservata famiglie.
   Condiviso da informativa-area-famiglie.html e richiesta-accesso.html:
   - l'indirizzo a cui inviare il modulo di consenso firmato (un solo punto da cambiare);
   - il passaggio "informativa letta", che sblocca il modulo di richiesta online.
   Il segno di lettura resta solo in questa scheda del browser (sessionStorage)
   o nell'indirizzo della pagina: nessun dato viene inviato. */
(function () {
  var EMAIL_MODULI = 'rirh010007@istruzione.it';
  var CHIAVE = 'areaFamiglieInformativaLetta';

  function informativaLetta() {
    if (/[?&]informativa=letta(&|$)/.test(location.search)) {
      try { sessionStorage.setItem(CHIAVE, '1'); } catch (e) {}
      return true;
    }
    try { return sessionStorage.getItem(CHIAVE) === '1'; } catch (e) { return false; }
  }

  function compilaEmail() {
    var nodi = document.querySelectorAll('[data-email-moduli]');
    for (var i = 0; i < nodi.length; i++) {
      var a = document.createElement('a');
      a.href = 'mailto:' + EMAIL_MODULI + '?subject=' +
        encodeURIComponent('Modulo di consenso · Area riservata famiglie');
      a.textContent = EMAIL_MODULI;
      a.style.color = 'inherit';
      nodi[i].textContent = '';
      nodi[i].appendChild(a);
    }
  }

  window.AreaFamiglie = { EMAIL_MODULI: EMAIL_MODULI, informativaLetta: informativaLetta };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', compilaEmail);
  else compilaEmail();
})();
