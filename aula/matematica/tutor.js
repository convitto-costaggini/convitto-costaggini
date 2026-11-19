/* ════════════════════════════════════════════════════════════
   AULA · Matematica · il tutor «una domanda alla volta», comune a tutte le tappe.
   var T = TUTOR.crea(area, { altro: fn, allenati: 'url#allenati' });
   T.avvia({ testata: html, passi: [...], fine: html }, scorriA);
   Ogni passo: { titolo, testo, ctx?: html, tipo: 'num'|'frac'|'scelta'|'multi'|'esp',
     opzioni?: [[valore, etichetta]], primi?: [..] (per multi/esp),
     verifica(v) → {ok, msg}, aiuti: [html], rivela() → html, spiega: html, lav?: html }
   Nessun invio, nessun salvataggio.
   ════════════════════════════════════════════════════════════ */
window.TUTOR = (function () {
  'use strict';
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function crea(area, opz) {
    opz = opz || {};
    var TT = null;
    function lavagna() { return TT.lav.length ? '<div class="tt-lav"><p class="tt-et">La tua lavagna</p>' + TT.lav.map(function (x) { return '<p class="mm-lav">' + x + '</p>'; }).join('') + '</div>' : ''; }
    function campo(p) {
      var ok = '<button type="submit" class="fz-btn">Controlla</button>';
      if (p.tipo === 'esp') return '<div class="mm-esp">' + p.primi.map(function (q) { return '<span class="mm-e"><b>' + q + '</b><input type="number" inputmode="numeric" min="0" max="30" data-p="' + q + '" aria-label="Esponente di ' + q + '"/></span>'; }).join('<span class="mm-per" aria-hidden="true">·</span>') + '</div>' + ok;
      if (p.tipo === 'multi') return '<div class="tt-sc" role="group" aria-labelledby="tt-q">' + p.primi.map(function (q) { return '<button type="button" class="fz-chip" data-m="' + q + '" aria-pressed="' + (TT.sel.indexOf(q) >= 0) + '">' + q + '</button>'; }).join('') + '<button type="button" class="fz-chip" data-m="0" aria-pressed="false">nessuno</button></div>' + ok;
      if (p.tipo === 'scelta') return '<div class="tt-sc" role="group" aria-labelledby="tt-q">' + p.opzioni.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + esc(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
      if (p.tipo === 'frac') return '<div class="tt-fi"><label for="tt-n">Numeratore</label><input id="tt-n" type="text" inputmode="numeric" autocomplete="off" aria-describedby="tt-q"/><span class="fz-barra" aria-hidden="true"></span><label for="tt-d">Denominatore</label><input id="tt-d" type="text" inputmode="numeric" autocomplete="off"/></div>' + ok;
      return '<div class="tt-num"><label for="tt-r">La tua risposta</label><input id="tt-r" type="text" inputmode="' + (p.testo_libero ? 'text' : 'numeric') + '" autocomplete="off" aria-describedby="tt-q"/></div>' + ok;
    }
    function valore(p) {
      if (p.tipo === 'esp') { var v = {}; Array.prototype.forEach.call(area.querySelectorAll('[data-p]'), function (x) { v[x.dataset.p] = parseInt(x.value, 10) || 0; }); return v; }
      if (p.tipo === 'multi') return TT.sel.slice();
      if (p.tipo === 'frac') return { n: area.querySelector('#tt-n').value, d: area.querySelector('#tt-d').value };
      return area.querySelector('#tt-r').value;
    }
    function disegna(primo) {
      var t = TT.t, n = t.passi.length, h = '<div class="tt-testata"><p class="tt-et">L\'esercizio</p>' + t.testata + '</div>';
      if (TT.i >= n) {
        var tot = TT.soli + TT.aiutati;
        if (opz.fatto) opz.fatto(TT);
        h += lavagna() + '<div class="tt-fine"><p class="tt-et">Fatto!</p>' + (t.fine || '') + '<p class="tt-stat">Hai risposto da solo a ' + TT.soli + ' passi su ' + tot + (TT.aiutati ? ' (con aiuto: ' + TT.aiutati + ')' : '') + '.' + (TT.aiutati > tot / 2 ? ' Rifallo da capo con calma: la seconda volta sarà più facile.' : (TT.aiutati === 0 ? ' Ottimo lavoro!' : '')) + '</p><div class="fz-azioni">' + (opz.altro ? '<button type="button" class="fz-btn" id="tt-altro">Un altro esercizio</button>' : '') + '<button type="button" class="fz-btn sec" id="tt-rifai">Rifallo da capo</button>' + (opz.allenati ? '<a class="fz-btn sec" href="' + opz.allenati + '" style="text-decoration:none;display:inline-flex;align-items:center">Prova da solo, senza guida</a>' : '') + '</div></div>';
        area.innerHTML = h; var b = area.querySelector('#tt-altro') || area.querySelector('#tt-rifai'); if (!primo) b.focus(); return;
      }
      var p = t.passi[TT.i], fatti = Math.min(TT.i + (TT.ok ? 1 : 0), n);
      h += '<div class="tt-prog"><span>Passo ' + (TT.i + 1) + ' di ' + n + '</span><div class="tt-bar" role="img" aria-label="Fatti ' + fatti + ' passi su ' + n + '"><i style="width:' + Math.round(100 * fatti / n) + '%"></i></div></div>' + lavagna();
      h += '<div class="tt-card"><p class="tt-n">Passo ' + (TT.i + 1) + ' · ' + esc(p.titolo) + '</p><p class="tt-q" id="tt-q">' + p.testo + '</p>' + (p.ctx ? '<div class="tt-ctx">' + p.ctx + '</div>' : '');
      if (!TT.ok) {
        h += '<form class="mm-tf" novalidate>' + campo(p) + '</form><p class="fz-fb" id="tt-fb" role="status"></p><p class="tt-aiuto" id="tt-aiuto-t"></p>';
        h += '<div class="fz-azioni">' + (p.aiuti && p.aiuti.length ? '<button type="button" class="fz-btn sec" id="tt-aiuto">Suggerimento</button>' : '') + '<button type="button" class="fz-btn sec" id="tt-mostra">Mostrami la risposta</button></div>';
      } else {
        h += '<p class="fz-fb ' + TT.classe + '" id="tt-fb" role="status">' + TT.fb + '</p><div class="fz-azioni"><button type="button" class="fz-btn" id="tt-avanti">' + (TT.i + 1 >= n ? 'Vedi il risultato' : 'Avanti') + '</button></div>';
      }
      area.innerHTML = h + '</div>';
      if (TT.ok) area.querySelector('#tt-avanti').focus();
      else if (!primo) { var f = area.querySelector('input') || area.querySelector('[data-v]'); if (f) f.focus(); }
    }
    function chiudi(p, aiutato, msg, cls) {
      if (p.lav) TT.lav.push(p.lav);
      if (aiutato) TT.aiutati++; else TT.soli++;
      TT.ok = true; TT.fb = msg; TT.classe = cls;
      disegna(false);
    }
    function controlla(p, v) {
      var r = p.verifica(v);
      if (r.ok) { chiudi(p, TT.usato, 'Esatto! ' + (p.spiega || ''), 'si'); return; }
      TT.tent++;
      var fb = area.querySelector('#tt-fb'); fb.className = 'fz-fb no';
      fb.innerHTML = (r.msg || 'Non ancora.') + (TT.tent >= 2 && p.aiuti && p.aiuti.length ? ' Prova con il suggerimento.' : '');
    }
    area.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var p = TT && TT.t.passi[TT.i]; if (!p || TT.ok) return;
      controlla(p, valore(p));
    });
    area.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b || !TT) return;
      var p = TT.t.passi[TT.i];
      if (b.dataset.v !== undefined && p && !TT.ok) { controlla(p, b.dataset.v); return; }
      if (b.dataset.m !== undefined && p && !TT.ok) {
        var q = +b.dataset.m;
        if (q === 0) TT.sel = [];
        else { var k = TT.sel.indexOf(q); if (k >= 0) TT.sel.splice(k, 1); else TT.sel.push(q); }
        Array.prototype.forEach.call(area.querySelectorAll('[data-m]'), function (x) { var v = +x.dataset.m; x.setAttribute('aria-pressed', v === 0 ? String(q === 0) : String(TT.sel.indexOf(v) >= 0)); });
        return;
      }
      if (b.id === 'tt-aiuto' && p) {
        TT.usato = true;
        var k2 = Math.min(TT.aiuto, p.aiuti.length - 1);
        area.querySelector('#tt-aiuto-t').innerHTML = 'Suggerimento ' + (k2 + 1) + ': ' + p.aiuti[k2];
        TT.aiuto++;
        if (TT.aiuto >= p.aiuti.length) { b.textContent = 'Hai visto tutti i suggerimenti'; b.disabled = true; } else b.textContent = 'Un altro suggerimento';
        return;
      }
      if (b.id === 'tt-mostra' && p) { chiudi(p, true, 'La risposta è ' + p.rivela() + '. ' + (p.spiega || ''), 'mezzo'); return; }
      if (b.id === 'tt-avanti') { TT.i++; TT.ok = false; TT.tent = 0; TT.aiuto = 0; TT.usato = false; TT.sel = []; disegna(false); return; }
      if (b.id === 'tt-altro' && opz.altro) { opz.altro(); return; }
      if (b.id === 'tt-rifai') { avvia(TT.def, false); return; }
    });
    function avvia(def, scorriA) {
      TT = { def: def, t: typeof def === 'function' ? def() : def, i: 0, ok: false, tent: 0, aiuto: 0, usato: false, soli: 0, aiutati: 0, lav: [], sel: [] };
      disegna(true);
      if (scorriA) scorriA.scrollIntoView();
    }
    function errore(msg) { TT = null; area.innerHTML = '<p class="fz-err" role="alert">' + esc(msg) + '</p>'; }
    return { avvia: avvia, errore: errore, stato: function () { return TT; } };
  }
  return { crea: crea };
})();
