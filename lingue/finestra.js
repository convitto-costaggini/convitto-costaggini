/* ════════════════════════════════════════════════════════
   FINESTRA — le finestre di conferma e di avviso di Lingue e Sala studio,
   al posto di quelle grigie del browser (confirm / alert).
   FINESTRA.chiedi({titolo, testo, si, no, pericolo}) → Promise<boolean>
   FINESTRA.avvisa(testo | {titolo, testo, ok})       → Promise
   Esc o un tocco fuori = annulla; il pulsante di conferma prende il fuoco.
   Resta valida anche dopo document.write (le pagine riservate di /lingue): lo stile si rimette da solo.
   ════════════════════════════════════════════════════════ */
window.FINESTRA = (function () {
  'use strict';
  var CSS = '.fn-velo{position:fixed;inset:0;z-index:100000;background:rgba(12,20,13,.55);display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;transition:opacity .18s ease}' +
    '.fn-velo.su{opacity:1}' +
    '.fn-box{background:#FDFAF5;color:#1A1A18;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.35);max-width:420px;width:100%;overflow:hidden;transform:translateY(12px) scale(.98);transition:transform .18s ease;font-family:"Atkinson Hyperlegible","Source Sans 3",system-ui,sans-serif}' +
    '.fn-velo.su .fn-box{transform:none}' +
    '.fn-testa{display:flex;align-items:center;gap:.6rem;padding:1rem 1.2rem .2rem}' +
    '.fn-ic{font-size:1.6rem;line-height:1}' +
    '.fn-tit{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.45rem;font-weight:500;color:#2C3E2D;margin:0;line-height:1.2}' +
    '.fn-testo{padding:.4rem 1.2rem 1rem;font-size:1rem;line-height:1.6;white-space:pre-line}' +
    '.fn-az{display:flex;gap:.5rem;justify-content:flex-end;flex-wrap:wrap;padding:.8rem 1.2rem 1.1rem;border-top:1px solid #E8E0CF}' +
    '.fn-b{font:800 .95rem "Source Sans 3",system-ui,sans-serif;border-radius:99px;padding:.6rem 1.2rem;min-height:44px;cursor:pointer;border:2px solid #2C3E2D;background:#fff;color:#2C3E2D}' +
    '.fn-b.si{background:#2C3E2D;color:#fff}' +
    '.fn-b.si.pericolo{background:#b4442f;border-color:#b4442f}' +
    '.fn-b:focus-visible{outline:3px solid #B8922A;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.fn-velo,.fn-box{transition:none}}';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stile() {
    if (document.getElementById('fn-stile')) return;
    var st = document.createElement('style'); st.id = 'fn-stile'; st.textContent = CSS; document.head.appendChild(st);
  }
  function apri(o, conAnnulla) {
    stile();
    return new Promise(function (fatto) {
      var prima = document.activeElement;
      var v = document.createElement('div'); v.className = 'fn-velo';
      v.innerHTML = '<div class="fn-box" role="' + (conAnnulla ? 'alertdialog' : 'dialog') + '" aria-modal="true" aria-labelledby="fn-t" aria-describedby="fn-d">' +
        '<div class="fn-testa"><span class="fn-ic" aria-hidden="true">' + (o.icona || (o.pericolo ? '🗑️' : conAnnulla ? '❓' : 'ℹ️')) + '</span><h2 class="fn-tit" id="fn-t">' + esc(o.titolo || (conAnnulla ? 'Sei sicuro?' : 'Attenzione')) + '</h2></div>' +
        '<div class="fn-testo" id="fn-d">' + esc(o.testo || '') + '</div>' +
        '<div class="fn-az">' + (conAnnulla ? '<button type="button" class="fn-b" data-no>' + esc(o.no || 'Annulla') + '</button>' : '') +
        '<button type="button" class="fn-b si' + (o.pericolo ? ' pericolo' : '') + '" data-si>' + esc(o.si || o.ok || (conAnnulla ? 'Sì' : 'Ho capito')) + '</button></div></div>';
      document.body.appendChild(v);
      requestAnimationFrame(function () { v.classList.add('su'); });
      var si = v.querySelector('[data-si]'), no = v.querySelector('[data-no]');
      si.focus();
      function chiudi(r) {
        document.removeEventListener('keydown', tasti, true);
        v.remove();
        if (prima && prima.focus) try { prima.focus(); } catch (e) {}
        fatto(r);
      }
      function tasti(e) {
        if (e.key === 'Escape') { e.preventDefault(); chiudi(false); }
        else if (e.key === 'Tab' && no) { e.preventDefault(); (document.activeElement === si ? no : si).focus(); } /* il fuoco resta nella finestra */
        else if (e.key === 'Tab') e.preventDefault();
      }
      document.addEventListener('keydown', tasti, true);
      si.onclick = function () { chiudi(true); };
      if (no) no.onclick = function () { chiudi(false); };
      v.addEventListener('click', function (e) { if (e.target === v) chiudi(false); });
    });
  }
  /* anche un eventuale alert() rimasto (per esempio nelle pagine riservate) usa questa finestra */
  window.alert = function (t) { apri({ testo: t }, false); };
  return {
    chiedi: function (o) { return apri(typeof o === 'string' ? { testo: o } : o, true); },
    avvisa: function (o) { return apri(typeof o === 'string' ? { testo: o } : o, false); }
  };
})();
