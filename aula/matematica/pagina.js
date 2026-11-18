/* Aula · Matematica · Frazioni passo passo: la pagina (usa frazioni.js).
   Tutto avviene nel dispositivo: nessun invio, nessun salvataggio. */
(function () {
  'use strict';
  var F = window.FRAZIONI;
  if (!F) return;
  var $ = function (id) { return document.getElementById(id); };

  var ESEMPI = [
    { t: 'Somma', q: { n1: 2, d1: 3, k1: 1, op: '+', n2: 3, d2: 4, k2: 1 } },
    { t: 'Differenza', q: { n1: 5, d1: 6, k1: 1, op: '-', n2: 3, d2: 8, k2: 1 } },
    { t: 'Prodotto', q: { n1: 4, d1: 9, k1: 1, op: '*', n2: 3, d2: 8, k2: 1 } },
    { t: 'Divisione', q: { n1: 3, d1: 4, k1: 1, op: ':', n2: 9, d2: 8, k2: 1 } },
    { t: 'Con le potenze', q: { n1: 2, d1: 3, k1: 3, op: '*', n2: 9, d2: 4, k2: 2 } },
    { t: 'Esponente negativo', q: { n1: 2, d1: 3, k1: -2, op: '-', n2: 1, d2: 4, k2: 1 } },
    { t: 'Base negativa', q: { n1: -2, d1: 3, k1: 3, op: '+', n2: 1, d2: 9, k2: 1 } }
  ];

  /* ── blocco dei passaggi e del risultato (condiviso da «Calcola» e «Allenati») ── */
  function htmlRisultato(c) {
    var h = '<div class="fz-ris"><p class="fz-ris-t">Risultato</p><div class="fz-ris-m">' + c.mathRis + '</div><ul class="fz-ris-altre">';
    h += '<li>In riga: <strong>' + c.testo + '</strong></li>';
    if (c.misto) h += '<li>Come numero misto: <strong>' + c.misto.testo + '</strong></li>';
    var d = c.decimale;
    if (d.tipo === 'periodico') h += '<li>In decimale: <strong>' + d.s + '</strong> (numero periodico, periodo ' + d.periodo + ')</li>';
    else if (d.tipo === 'finito') h += '<li>In decimale: <strong>' + d.s + '</strong></li>';
    else if (d.tipo === 'troncato') h += '<li>In decimale (approssimato): <strong>' + d.s + '</strong></li>';
    h += '</ul></div>';
    return h;
  }
  function htmlPassi(c) {
    var out = '', g = null, n = 0;
    c.passi.forEach(function (p) {
      if (p.g !== g) {
        if (g !== null) out += '</ol>';
        g = p.g;
        out += '<h3 class="fz-gr">' + p.g + '</h3><ol class="fz-passi" start="' + (n + 1) + '" style="--ini:' + n + '">';
      }
      n++;
      out += '<li class="fz-passo"><h4>' + p.t + '</h4><p>' + p.p + '</p>' + p.m.join('') + '</li>';
    });
    return out + '</ol>';
  }

  /* ── 1. calcola ── */
  function leggi() {
    var op = document.querySelector('input[name="op"]:checked');
    return { n1: $('n1').value, d1: $('d1').value, k1: $('k1').value, op: op ? op.value : '', n2: $('n2').value, d2: $('d2').value, k2: $('k2').value };
  }
  function scrivi(q) {
    ['n1', 'd1', 'k1', 'n2', 'd2', 'k2'].forEach(function (k) { $(k).value = q[k]; });
    var r = document.querySelector('input[name="op"][value="' + q.op + '"]');
    if (r) r.checked = true;
  }
  function calcola(spostaFocus) {
    var box = $('fz-esito');
    try {
      var c = F.calcola(leggi());
      box.innerHTML = htmlRisultato(c) + '<h3 class="fz-sottit">I passaggi</h3>' + htmlPassi(c);
    } catch (e) {
      if (e.name !== 'ErroreFz') throw e;
      box.innerHTML = '<p class="fz-err" role="alert">' + e.message + '</p>';
    }
    if (spostaFocus) box.focus({ preventScroll: false });
  }
  $('fz-form').addEventListener('submit', function (ev) { ev.preventDefault(); calcola(true); });
  var ex = $('fz-esempi');
  ex.innerHTML = ESEMPI.map(function (e, i) { return '<button type="button" class="fz-chip" data-i="' + i + '">' + e.t + '</button>'; }).join('');
  ex.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-i]');
    if (!b) return;
    scrivi(ESEMPI[+b.dataset.i].q);
    calcola(false);
  });
  $('fz-lim').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    document.getElementById('main').classList.toggle('fz-grande', on);
  });

  /* ── livelli (usati da «Allenati» e dalla scheda) ── */
  ['fz-liv', 'sc-liv'].forEach(function (id) {
    $(id).innerHTML = Object.keys(F.LIVELLI).map(function (k) { return '<option value="' + k + '">' + k + '. ' + F.LIVELLI[k].nome + ': ' + F.LIVELLI[k].desc + '</option>'; }).join('');
  });
  function opsScelte(nome) {
    return Array.prototype.map.call(document.querySelectorAll('input[name="' + nome + '"]:checked'), function (x) { return x.value; });
  }
  function mathQ(q) { return F.math(F.espressione(q), true); }

  /* ── 3. allenati ── */
  var corr = null, risolto = false, conta = 0;
  function nuovo(spostaFocus) {
    var ops = opsScelte('al-op');
    if (!ops.length) { $('fz-fb').textContent = 'Scegli almeno un\'operazione.'; return; }
    corr = F.genera(+$('fz-liv').value, ops);
    risolto = false;
    $('fz-dom').innerHTML = mathQ(corr);
    $('fz-ris-in').value = '';
    $('fz-fb').textContent = ''; $('fz-fb').className = 'fz-fb';
    $('fz-sol').hidden = true; $('fz-sol').innerHTML = '';
    if (spostaFocus) $('fz-ris-in').focus();
  }
  $('fz-nuovo').addEventListener('click', function () { nuovo(true); });
  $('fz-liv').addEventListener('change', function () { nuovo(false); });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="al-op"]'), function (x) { x.addEventListener('change', function () { nuovo(false); }); });
  $('fz-rif').addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!corr) return;
    var att = F.calcola(corr).risultato;
    var r = F.controlla($('fz-ris-in').value, att);
    var fb = $('fz-fb');
    fb.className = 'fz-fb';
    if (r.esito === 'illeggibile') fb.textContent = 'Non riesco a leggere la risposta. Scrivila come frazione (3/4), numero intero (5) o decimale (0,75).';
    else if (r.esito === 'sbagliata') { fb.textContent = 'Non ancora. Ricontrolla i passaggi: puoi anche guardarli con «Mostra i passaggi».'; fb.className = 'fz-fb no'; }
    else if (r.esito === 'da-semplificare') {
      fb.className = 'fz-fb mezzo';
      fb.textContent = r.motivo === 'intero' ? 'Il valore è giusto: se il risultato è un numero intero, scrivilo senza denominatore.'
        : r.motivo === 'segno' ? 'Il valore è giusto: il segno meno si scrive al numeratore, il denominatore è positivo.'
        : 'Il valore è giusto, ma la frazione si può ancora semplificare: scrivila ridotta ai minimi termini.';
    } else {
      fb.className = 'fz-fb si';
      fb.textContent = 'Esatto!' + (r.forma === 'decimale' ? ' Come frazione: ' + (att.d === 1n ? String(att.n) : att.n + '/' + att.d) + '.' : '');
      if (!risolto) { risolto = true; conta++; $('fz-conta').textContent = 'Esercizi risolti in questa visita: ' + conta; }
    }
  });
  $('fz-sol-b').addEventListener('click', function () {
    if (!corr) return;
    var c = F.calcola(corr);
    $('fz-sol').innerHTML = htmlRisultato(c) + '<h3 class="fz-sottit">I passaggi</h3>' + htmlPassi(c);
    $('fz-sol').hidden = false;
  });

  /* ── 4. scheda stampabile ── */
  function scheda() {
    var ops = opsScelte('sc-op');
    var out = $('sc-out');
    if (!ops.length) { out.hidden = false; out.innerHTML = '<p class="fz-err" role="alert">Scegli almeno un\'operazione.</p>'; return; }
    var lv = +$('sc-liv').value, n = +$('sc-n').value, conSol = $('sc-sol').checked;
    var esercizi = [], visti = {};
    for (var i = 0; i < n * 20 && esercizi.length < n; i++) {
      var q = F.genera(lv, ops), chiave = JSON.stringify(q);
      if (visti[chiave]) continue;
      visti[chiave] = 1; esercizi.push(q);
    }
    var h = '<div class="fz-pag"><h2 class="fz-foglio-t">Frazioni · ' + F.LIVELLI[lv].nome + '</h2>'
      + '<p class="fz-foglio-i">Nome ______________________ Classe ________ Data ____________</p>'
      + '<p class="fz-foglio-c">Calcola, semplifica il risultato e scrivilo come frazione ridotta ai minimi termini.</p><ol class="fz-es" style="--h:' + (n <= 8 ? '2.9cm' : n === 10 ? '2.4cm' : '2cm') + '">';
    esercizi.forEach(function (q) { h += '<li class="fz-es-i">' + F.math(F.espressione(q) + '<mo>=</mo><mo>…</mo>') + '</li>'; });
    h += '</ol></div>';
    if (conSol) {
      h += '<div class="fz-pag fz-sol-pag"><h2 class="fz-foglio-t">Soluzioni</h2><ol class="fz-es fz-es-sol">';
      esercizi.forEach(function (q) {
        var c = F.calcola(q);
        h += '<li>' + F.math(F.espressione(q) + '<mo>=</mo>' + c.mathRis.replace(/^<math>|<\/math>$/g, '')) + (c.misto ? ' <span class="fz-m">(' + c.misto.testo + ')</span>' : '') + '</li>';
      });
      h += '</ol></div>';
    }
    out.innerHTML = h; out.hidden = false;
    $('sc-stampa').hidden = false;
  }
  $('sc-crea').addEventListener('click', scheda);
  $('sc-stampa').addEventListener('click', function () { window.print(); });

  /* avvio: un esempio già calcolato e il primo esercizio */
  calcola(false);
  nuovo(false);
})();
