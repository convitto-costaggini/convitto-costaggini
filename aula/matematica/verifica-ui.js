/* Aula · Matematica · Crea · collegamento della sezione «Verifica in classe» (passo 5).
   Legge le righe del passo 2 e le opzioni, usa VERIFICA per costruire le file e stampa. Non salva niente. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); }, V = window.VERIFICA;
  if (!V || !$('vf-prepara')) return;
  var variazione = 0;
  function opz() { return { file: +$('vf-file').value, dsa: $('vf-dsa').checked, da: $('vf-da').checked, soluzioni: $('vf-sol').checked, doppio: $('vf-doppio').checked, variazione: variazione }; }
  function costruisci() { return V.costruisci($('cr-righe').value, opz()); }
  function prepara() {
    var C = costruisci();
    $('vf-anteprima').innerHTML = V.htmlAnteprima(C);
    $('vf-fb').className = C.vuoto ? 'fz-fb mezzo' : 'fz-fb si';
    $('vf-fb').textContent = C.vuoto ? C.avvisi[0] : 'Controlla i fogli qui sotto, poi premi «Stampa i fogli».';
    return C;
  }
  $('vf-prepara').addEventListener('click', prepara);
  $('vf-cambia').addEventListener('click', function () { variazione++; prepara(); });
  ['vf-file', 'vf-dsa', 'vf-da', 'vf-doppio'].forEach(function (id) { $(id).addEventListener('change', function () { if ($('vf-anteprima').innerHTML) prepara(); }); });
  $('vf-stampa').addEventListener('click', function () {
    var C = prepara(); if (C.vuoto) return;
    $('cr-foglio').innerHTML = V.htmlFogli(C, $('cr-tit').value.trim(), opz());
    $('cr-foglio-sez').hidden = false;
    setTimeout(function () { window.print(); }, 50);
  });
})();
