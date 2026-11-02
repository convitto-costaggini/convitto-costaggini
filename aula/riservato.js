/* Anteprima riservata: le novità sul supporto alla lettura (DSA e BES) si vedono
   su un dispositivo abilitato con la chiave di anteprima di sempre oppure con una seconda chiave (?riservato=).
   Vetrina, non sicurezza: nel codice c'è soltanto l'impronta della chiave. */
(function () {
  var IMP = '383446f29ee28d9bb53a37bb18dd9a45ee6be3cef31d0b282fe26ba9c7cf28b3', V = 'aula-riservato', d = document.documentElement;
  var ANT = '2640d251dd7905d0384194808861d58997e11abb112008a838bcab1cf7faed2b'; /* impronta della chiave di anteprima di sempre: apre anche questo */
  function ok() { try { return localStorage.getItem(V) === IMP || localStorage.getItem('cantiere-anteprima') === ANT; } catch (e) { return false; } }
  window.AULA_RISERVATO = ok();
  if (window.AULA_RISERVATO) d.classList.add('rsv-ok');
  var st = document.createElement('style'); st.textContent = '.rsv[hidden]{display:none!important}';
  (document.head || d).appendChild(st);
  function mostra() { if (!window.AULA_RISERVATO) return; var x = document.querySelectorAll('.rsv'); for (var i = 0; i < x.length; i++) x[i].hidden = false; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostra); else mostra();
  var m = /[?&]riservato=([^&#]*)/.exec(location.search);
  if (!m) return;
  var chiave = decodeURIComponent(m[1]);
  try { history.replaceState(null, '', location.pathname + location.search.replace(/([?&])riservato=[^&]*&?/, '$1').replace(/[?&]$/, '') + location.hash); } catch (e) {}
  if (chiave === 'esci') { try { localStorage.removeItem(V); } catch (e) {} location.reload(); return; }
  if (!window.crypto || !crypto.subtle) return;
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(chiave)).then(function (b) {
    var h = Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    if (h === IMP) { try { localStorage.setItem(V, IMP); } catch (e) {} location.reload(); }
  });
})();
