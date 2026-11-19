/* Aula · Matematica · il percorso del primo anno.
   Elenco unico delle tappe (usato dalla home e dal fondo di ogni tappa) e il segno
   «tappa fatta», tenuto SOLO in questo dispositivo (localStorage), senza nomi né invii.
   PERCORSO.TAPPE, PERCORSO.fatta(id), PERCORSO.segna(id), PERCORSO.mappa(el), PERCORSO.vicine(el, id) */
window.PERCORSO = (function () {
  'use strict';
  var CH = 'mate-tappe';
  var BLOCCHI = [
    { id: 'numeri', titolo: 'I numeri', sot: 'Le basi che servono a tutto il resto.' },
    { id: 'espressioni', titolo: 'Le espressioni', sot: 'Mettere insieme le operazioni, nell\'ordine giusto.' },
    { id: 'lettere', titolo: 'Il calcolo letterale', sot: 'Quando al posto dei numeri compaiono le lettere.' }
  ];
  var TAPPE = [
    { id: 'mcd-mcm', b: 'numeri', ico: '⏲️', t: 'Numeri primi, MCD e mcm', d: 'I timer del forno, le mattonelle della dispensa e l\'albero dei fattori.', url: 'aula/matematica/mcd-mcm.html' },
    { id: 'frazioni-cosa', b: 'numeri', ico: '🍕', t: 'Che cos\'è una frazione', d: 'Tagliare la teglia: frazioni equivalenti, semplificare, confrontare.', url: 'aula/matematica/frazioni-cosa.html' },
    { id: 'frazioni-operazioni', b: 'numeri', ico: '➗', t: 'Operazioni e potenze con le frazioni', d: 'Somma, differenza, prodotto, divisione e potenze, passo passo.', url: 'aula/matematica/frazioni.html' },
    { id: 'decimali', b: 'numeri', ico: '⚖️', t: 'I numeri decimali', d: 'Dalla bilancia allo scontrino: leggere, confrontare, arrotondare.', url: 'aula/matematica/decimali.html' },
    { id: 'periodici', b: 'numeri', ico: '🔁', t: 'Dal decimale alla frazione', d: 'Decimali finiti e periodici: perché le cifre si ripetono e la frazione generatrice.', url: 'aula/matematica/periodici.html' },
    { id: 'ordine', b: 'espressioni', ico: '🧭', t: 'L\'ordine delle operazioni', d: 'Scegli tu che cosa fare prima: le parentesi e le precedenze.', url: 'aula/matematica/ordine.html' },
    { id: 'espressioni-frazioni', b: 'espressioni', ico: '🧮', t: 'Espressioni con le frazioni', d: 'L\'ultima fetta, la frazione di una frazione, le parentesi e le frazioni a più piani.', url: 'aula/matematica/espressioni-frazioni.html' },
    { id: 'monomi', b: 'lettere', ico: '🟩', t: 'Dalle lettere ai monomi', d: 'Le tessere colorate: grado, monomi simili.', url: 'aula/matematica/monomi.html' },
    { id: 'monomi-operazioni', b: 'lettere', ico: '✖️', t: 'Operazioni con i monomi', d: 'Somma dei simili, prodotto, quoziente e potenza.', url: 'aula/matematica/monomi-operazioni.html' },
    { id: 'polinomi', b: 'lettere', ico: '🧱', t: 'I polinomi', d: 'Sommare e moltiplicare: il prodotto come area di un rettangolo.', url: 'aula/matematica/polinomi.html' },
    { id: 'prodotti-notevoli', b: 'lettere', ico: '✨', t: 'I prodotti notevoli', d: 'Quadrato di un binomio e somma per differenza, da vedere e da toccare.', url: 'aula/matematica/prodotti-notevoli.html' }
  ];
  function leggi() { try { return JSON.parse(localStorage.getItem(CH) || '{}') || {}; } catch (e) { return {}; } }
  function fatta(id) { return !!leggi()[id]; }
  function segna(id) { var s = leggi(); if (s[id]) return; s[id] = 1; try { localStorage.setItem(CH, JSON.stringify(s)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function scheda(t, n) {
    var pronta = !!t.url, ok = pronta && fatta(t.id);
    var testa = '<span class="mt-num" aria-hidden="true">' + (ok ? '✓' : n) + '</span><span class="mt-ico" aria-hidden="true">' + t.ico + '</span>';
    var corpo = '<h4>' + esc(t.t) + '</h4><p>' + esc(t.d) + '</p>';
    if (!pronta) return '<li class="mt-tappa prep"><div class="mt-int">' + testa + '<div>' + corpo + '<span class="mt-stato">In preparazione</span></div></div></li>';
    return '<li class="mt-tappa' + (ok ? ' ok' : '') + '"><a class="mt-int" href="' + t.url + '">' + testa + '<div>' + corpo + '<span class="mt-stato">' + (ok ? 'Fatta · rifalla quando vuoi' : 'Pronta · inizia') + '</span></div></a></li>';
  }
  function mappa(el) {
    if (!el) return;
    var n = 0, h = '';
    BLOCCHI.forEach(function (b) {
      h += '<section class="mt-blocco" aria-labelledby="mb-' + b.id + '"><h3 id="mb-' + b.id + '">' + esc(b.titolo) + '</h3><p class="mt-bsot">' + esc(b.sot) + '</p><ol class="mt-tappe">';
      TAPPE.forEach(function (t) { if (t.b === b.id) { n++; h += scheda(t, n); } });
      h += '</ol></section>';
    });
    var pronte = TAPPE.filter(function (t) { return t.url; }), fatte = pronte.filter(function (t) { return fatta(t.id); });
    el.innerHTML = '<p class="mt-conto">Tappe pronte: <strong>' + pronte.length + '</strong> su ' + TAPPE.length + (fatte.length ? ' · fatte da te su questo dispositivo: <strong>' + fatte.length + '</strong>' : '') + '</p>' + h;
  }
  function vicine(el, id) {
    if (!el) return;
    var i = -1;
    TAPPE.forEach(function (t, k) { if (t.id === id) i = k; });
    var prossima = null;
    for (var k = i + 1; k < TAPPE.length; k++) if (TAPPE[k].url) { prossima = TAPPE[k]; break; }
    var h = '<div class="w"><div class="mt-vicine"><a class="fz-btn sec" href="aula/matematica/">← Tutte le tappe</a>';
    if (prossima) h += '<a class="fz-btn" href="' + prossima.url + '">Tappa successiva: ' + esc(prossima.t) + ' →</a>';
    el.innerHTML = h + '</div></div>';
  }
  /* il fondo di ogni tappa si riempie da solo */
  function avvio() {
    var el = document.getElementById('mt-tappe-nav'); if (!el) return;
    var pag = location.pathname.split('/').pop();
    TAPPE.forEach(function (t) { if (t.url && t.url.split('/').pop() === pag) vicine(el, t.id); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio); else avvio();
  return { TAPPE: TAPPE, BLOCCHI: BLOCCHI, fatta: fatta, segna: segna, mappa: mappa, vicine: vicine };
})();
