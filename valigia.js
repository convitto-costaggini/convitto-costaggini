/* ════════════════════════════════════════════════════════
   "FAI LA VALIGIA" — lista interattiva per l'ingresso in Convitto
   Unica fonte delle voci: la usano Per i Genitori e Ammissione.
   Voci dal Regolamento di Convitto (art. 20, versione 30/01/2025)
   e dalla guida al Regolamento. Per modificarle, cambiare solo
   l'elenco VALIGIA qui sotto.
   Le spunte restano solo nel browser di chi le mette (localStorage):
   il sito non riceve nulla.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VALIGIA = [
    { id: 'doc', titolo: '📋 Documenti da consegnare', voci: [
      ['doc-cert', 'Certificato medico di idoneità alla vita convittuale'],
      ['doc-ts', 'Tessera sanitaria'],
      ['doc-id', 'Documento d\'identità in corso di validità'],
      ['doc-all', 'Eventuale certificazione di allergie o intolleranze del medico curante'],
      ['doc-farm', 'Eventuale prescrizione medica per farmaci da assumere durante la permanenza'],
      ['doc-mod', 'Moduli dell\'accoglienza compilati e firmati (scheda informativa, scheda sanitaria, autorizzazioni, patto di corresponsabilità)', 'accoglienza.html'],
      ['doc-dom', 'Domanda di ammissione firmata, se non già consegnata']
    ]},
    { id: 'letto', titolo: '🛏️ Biancheria e letto', voci: [
      ['l-cop', 'Coperte e/o piumino'],
      ['l-comp', 'N. 1 completo da letto per una piazza (lenzuola, federa, copertina)'],
      ['l-asc', 'N. 2 asciugamani']
    ]},
    { id: 'abiti', titolo: '👔 Abbigliamento e igiene', voci: [
      ['a-pig', 'N. 1 pigiama'],
      ['a-cia', 'N. 1 paio di ciabatte o pantofole'],
      ['a-ind', 'Indumenti personali adeguati in numero sufficiente'],
      ['a-ig', 'Necessario per la cura e l\'igiene personale']
    ]},
    { id: 'acc', titolo: '🗂️ Accessori', voci: [
      ['x-sac', 'N. 1 sacchetto per la biancheria sporca'],
      ['x-app', 'Numero adeguato di appendiabiti'],
      ['x-scu', 'Materiale scolastico necessario']
    ]}
  ];
  var NON_PORTARE = [
    'Alcol, sigarette e qualunque sostanza: sono vietati, anche negli spazi esterni.',
    'TV, consolle e videogiochi: non sono consentiti.',
    'Cibo da farsi consegnare dall\'esterno: non è consentito con nessun servizio di consegna.',
    'Sconsigliati indumenti di pregio, oggetti preziosi, smartphone di valore e altri apparecchi elettronici: il Convitto non ne garantisce la custodia (art. 20, comma 14).'
  ];
  var CHIAVE = 'convitto-valigia-v1';

  function leggi() { try { return JSON.parse(localStorage.getItem(CHIAVE) || '{}') || {}; } catch (e) { return {}; } }
  function salva(st) { try { localStorage.setItem(CHIAVE, JSON.stringify(st)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var CSS = '' +
    '.vlg{font-family:var(--fu,sans-serif)}' +
    '.vlg-top{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.25rem;margin:0 0 1.5rem}' +
    '.vlg-prog{flex:1 1 220px}' +
    '.vlg-prog-txt{font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--bosco2,#3D5C3E);margin-bottom:.4rem}' +
    '.vlg-bar{height:8px;border-radius:8px;background:var(--av3,#D9CEB5);overflow:hidden}' +
    '.vlg-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--oro,#B8922A),var(--oro2,#D4AA4A));transition:width .35s ease}' +
    '.vlg-btn{font-family:inherit;font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:.65rem 1.1rem;border-radius:8px;cursor:pointer;border:1.5px solid var(--bosco,#2C3E2D);background:transparent;color:var(--bosco,#2C3E2D)}' +
    '.vlg-btn.pieno{background:var(--bosco,#2C3E2D);color:#fff}' +
    '.vlg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem 2rem}' +
    '.vlg-sez h3{font-family:var(--fd,Georgia,serif);font-size:1.15rem;font-weight:400;color:var(--bosco,#2C3E2D);margin:0 0 .65rem}' +
    '.vlg-sez ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.35rem}' +
    '.vlg-voce label{display:flex;align-items:flex-start;gap:.65rem;font-size:.86rem;line-height:1.55;color:var(--txt2,#4A4840);cursor:pointer;padding:.3rem .4rem;border-radius:6px}' +
    '.vlg-voce label:hover{background:rgba(44,62,45,.05)}' +
    '.vlg-voce input{width:18px;height:18px;margin-top:.15rem;flex-shrink:0;accent-color:var(--bosco,#2C3E2D);cursor:pointer}' +
    '.vlg-voce input:checked+span{color:#9ca3af;text-decoration:line-through}' +
    '.vlg-voce a{color:var(--bosco2,#3D5C3E);font-weight:700;white-space:nowrap}' +
    '.vlg-no{margin-top:1.75rem;background:#fff;border:1px solid var(--av3,#D9CEB5);border-left:4px solid #b91c1c;border-radius:0 10px 10px 0;padding:1rem 1.25rem}' +
    '.vlg-no h3{font-family:var(--fd,Georgia,serif);font-size:1.15rem;font-weight:400;color:#7f1d1d;margin:0 0 .5rem}' +
    '.vlg-no li{font-size:.84rem;line-height:1.6;color:var(--txt2,#4A4840);margin:.25rem 0}' +
    '.vlg-fatto{display:none;margin:0 0 1.25rem;padding:.75rem 1rem;border-radius:8px;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;font-size:.85rem}' +
    '.vlg.completa .vlg-fatto{display:block}' +
    '.vlg-nota{font-size:.7rem;color:#6b7280;margin-top:1rem}';

  function disegna(box) {
    var st = leggi();
    var html = '<div class="vlg-top"><div class="vlg-prog"><div class="vlg-prog-txt" aria-live="polite"></div><div class="vlg-bar"><i></i></div></div>' +
      '<button type="button" class="vlg-btn pieno" data-vlg="stampa">🖨️ Stampa la lista</button>' +
      '<button type="button" class="vlg-btn" data-vlg="azzera">↺ Ricomincia</button></div>' +
      '<div class="vlg-fatto" role="status">🎒 Tutto pronto per la partenza. Buon arrivo al Convitto!</div><div class="vlg-grid">';
    VALIGIA.forEach(function (sez) {
      html += '<div class="vlg-sez"><h3>' + esc(sez.titolo) + '</h3><ul>';
      sez.voci.forEach(function (v) {
        var link = v[2] ? ' <a href="' + v[2] + '">Vai ai moduli →</a>' : '';
        html += '<li class="vlg-voce"><label><input type="checkbox" data-id="' + v[0] + '"' + (st[v[0]] ? ' checked' : '') + '/><span>' + esc(v[1]) + link + '</span></label></li>';
      });
      html += '</ul></div>';
    });
    html += '</div><div class="vlg-no"><h3>🚫 Cosa non portare</h3><ul>' +
      NON_PORTARE.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
      '</ul></div><p class="vlg-nota">Le spunte restano solo su questo dispositivo: il sito non riceve nulla. Fonte: Regolamento di Convitto, art. 20 (versione 30/01/2025).</p>';
    box.innerHTML = html;
    box.classList.add('vlg');
    aggiorna(box);
  }

  function aggiorna(box) {
    var tutte = box.querySelectorAll('input[type=checkbox]');
    var fatte = box.querySelectorAll('input[type=checkbox]:checked').length;
    box.querySelector('.vlg-prog-txt').textContent = fatte + ' su ' + tutte.length + ' pronti';
    box.querySelector('.vlg-bar i').style.width = (tutte.length ? Math.round(fatte / tutte.length * 100) : 0) + '%';
    box.classList.toggle('completa', fatte === tutte.length && tutte.length > 0);
  }

  function stampa() {
    var oggi = new Date().toLocaleDateString('it-IT');
    var corpo = VALIGIA.map(function (sez) {
      return '<h2>' + esc(sez.titolo) + '</h2><ul>' + sez.voci.map(function (v) { return '<li>☐&nbsp; ' + esc(v[1]) + '</li>'; }).join('') + '</ul>';
    }).join('') + '<h2>🚫 Cosa non portare</h2><ul class="no">' + NON_PORTARE.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    var w = window.open('', '_blank');
    if (!w) { window.print(); return; }
    w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/><title>Fai la valigia — Convitto Costaggini</title>' +
      '<style>body{font-family:Arial,sans-serif;font-size:11.5pt;max-width:680px;margin:32px auto;color:#1a1a1a;line-height:1.55}h1{font-size:17pt;margin:0}' +
      '.ente{font-size:9.5pt;color:#555;margin-bottom:18px}h2{font-size:12pt;margin:18px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}ul{list-style:none;padding:0;margin:0}li{margin:4px 0}ul.no li{list-style:disc;margin-left:18px}' +
      '.piede{font-size:9pt;color:#666;margin-top:22px}</style></head><body>' +
      '<div class="ente">IPSSEOA "R. A. Costaggini" — Rieti · Convitto annesso</div><h1>Fai la valigia</h1>' +
      '<p style="font-size:9.5pt;color:#555">Cosa portare all\'ingresso in Convitto — Regolamento di Convitto, art. 20 (versione 30/01/2025)</p>' +
      corpo + '<p class="piede">Stampato il ' + oggi + ' — convittore/convittrice: ______________________________</p>' +
      '<script>window.onload=function(){window.print()}<\/script></body></html>');
    w.document.close();
  }

  function avvia() {
    var boxes = document.querySelectorAll('[data-valigia]');
    if (!boxes.length) return;
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    boxes.forEach(function (box) {
      disegna(box);
      box.addEventListener('change', function (e) {
        var c = e.target;
        if (!c.matches('input[type=checkbox][data-id]')) return;
        var st = leggi(); if (c.checked) st[c.dataset.id] = 1; else delete st[c.dataset.id]; salva(st);
        aggiorna(box);
      });
      box.addEventListener('click', function (e) {
        var b = e.target.closest('[data-vlg]'); if (!b) return;
        if (b.dataset.vlg === 'stampa') stampa();
        if (b.dataset.vlg === 'azzera') { salva({}); box.querySelectorAll('input[type=checkbox]').forEach(function (c) { c.checked = false; }); aggiorna(box); }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
