/* Aula · Matematica · la pagina degli esercizi della docente (link o QR con #e=…).
   Gli esercizi arrivano dentro il link e non passano da nessun server; le risposte
   restano nella pagina e spariscono quando la si chiude. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var R = window.RACCOLTA, area = $('es-area'), ES = [], S = [], cur = 0;
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var TU = TUTOR.crea($('tt-area'), {});

  $('mt-lim').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('main').classList.toggle('fz-grande', on);
  });

  function pallini() {
    $('es-pallini').innerHTML = ES.map(function (e, i) {
      var s = S[i], cls = s.ok ? (s.tent ? ' mezzo' : ' ok') : '';
      return '<button type="button" class="es-p' + cls + (i === cur ? ' cur' : '') + '" data-i="' + i + '" aria-label="Esercizio ' + (i + 1) + (s.ok ? ', risolto' : '') + '"' + (i === cur ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button>';
    }).join('');
  }
  function disegna(focus) {
    var e = ES[cur], s = S[cur], u = R.ui(e, s.fase), h = '<p class="tt-n">Esercizio ' + (cur + 1) + ' di ' + ES.length + '</p>' + R.domanda(e);
    if (u.prima) h += '<p class="mm-p">' + u.prima + '</p>';
    if (s.ok) h += '<p class="fz-fb si">✓ Risolto. ' + (s.msg || '') + '</p>';
    else if (u.tipo === 'scelta') h += '<div class="tt-sc" role="group" aria-label="Risposta">' + u.opzioni.map(function (o) { return '<button type="button" class="fz-btn sec' + (u.seg ? ' fc-seg' : '') + '" data-r="' + esc(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    else h += '<form class="fz-risp" id="es-f" novalidate><label for="es-in">La tua risposta' + (u.u ? ' (' + esc(u.u) + ')' : '') + '</label><div class="fz-risp-r"><input id="es-in" type="text" inputmode="' + (u.num ? 'numeric' : 'text') + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(u.ph) + '"/><button type="submit" class="fz-btn">Controlla</button></div></form>';
    h += '<p class="fz-fb" id="es-fb" role="status" aria-live="polite"></p><p class="tt-aiuto" id="es-aiuto"></p><div class="fz-azioni">';
    if (!s.ok) h += '<button type="button" class="fz-btn sec" id="es-sugg">Suggerimento</button>';
    h += '<button type="button" class="fz-btn sec" id="es-sol">Mostra la soluzione</button>' + (R.tutor(e) ? '<button type="button" class="fz-btn sec" id="es-guida">Aiutami passo passo</button>' : '');
    h += '</div><div id="es-solbox" class="fz-esito" hidden></div><div class="es-nav">' + (cur > 0 ? '<button type="button" class="fz-btn sec" id="es-prec">← Precedente</button>' : '<span></span>') + (cur + 1 < ES.length ? '<button type="button" class="fz-btn" id="es-succ">Successivo →</button>' : '<button type="button" class="fz-btn" id="es-fine">Come è andata?</button>') + '</div>';
    area.innerHTML = h;
    pallini();
    if (focus) { var i = $('es-in') || area.querySelector('[data-r]') || $('es-succ') || $('es-fine'); if (i) i.focus(); }
  }
  function fb(msg, cls) { var f = $('es-fb'); f.className = 'fz-fb ' + (cls || ''); f.innerHTML = msg; }
  function risposta(v) {
    var e = ES[cur], s = S[cur];
    var r = R.giudica(e, v, s.fase);
    if (e.k === 'problema' && !s.fase) {
      if (r.ok) { s.fase = 1; disegna(true); return; }
      s.tent++; fb(r.msg, 'no'); return;
    }
    if (r.ok) { s.ok = true; s.msg = r.msg; disegna(false); var n = $('es-succ') || $('es-fine'); if (n) n.focus(); return; }
    s.tent++;
    fb((r.msg || 'Non ancora. Ricontrolla i passaggi.') + (s.tent >= 2 ? ' Prova con il suggerimento' + (R.tutor(e) ? ' o con «Aiutami passo passo»' : '') + '.' : ''), r.cls || 'no');
    var i = $('es-in'); if (i) { i.focus(); try { i.select(); } catch (x) {} }
  }
  function fine() {
    var fatti = S.filter(function (s) { return s.ok; }).length, primo = S.filter(function (s) { return s.ok && !s.tent; }).length;
    area.innerHTML = '<div class="tt-fine"><p class="tt-et">Come è andata</p><p class="tt-q">Hai risolto ' + fatti + ' esercizi su ' + ES.length + '.</p><p class="tt-stat">Al primo tentativo: ' + primo + '. ' + (fatti === ES.length ? (primo === ES.length ? 'Perfetto!' : 'Ottimo lavoro: anche gli errori servono a imparare.') : 'Quelli senza ✓ si possono ancora fare: tocca il numero in alto.') + ' Il sito non salva niente: questo riepilogo sparisce quando chiudi la pagina.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="es-torna">Torna agli esercizi</button></div></div>';
    $('tt-area').innerHTML = '';
    pallini();
  }
  area.addEventListener('submit', function (ev) { ev.preventDefault(); risposta($('es-in').value); });
  area.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var e = ES[cur];
    if (b.dataset.r !== undefined) return risposta(b.dataset.r);
    if (b.id === 'es-succ') { cur++; $('tt-area').innerHTML = ''; disegna(true); return; }
    if (b.id === 'es-prec') { cur--; $('tt-area').innerHTML = ''; disegna(true); return; }
    if (b.id === 'es-fine') return fine();
    if (b.id === 'es-torna') { disegna(true); return; }
    if (b.id === 'es-sugg') { $('es-aiuto').textContent = R.suggerimento(e); return; }
    if (b.id === 'es-sol') { var s = $('es-solbox'); s.innerHTML = '<div class="tt-fine">' + R.soluzione(e) + '</div>'; s.hidden = false; return; }
    if (b.id === 'es-guida') { TU.avvia(R.tutor(e), $('tt-area')); return; }
  });
  $('es-pallini').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-i]'); if (!b) return;
    cur = +b.dataset.i; $('tt-area').innerHTML = ''; disegna(true);
  });

  function errore(msg) {
    area.innerHTML = '<p class="fz-err" role="alert">' + msg + '</p><p class="mm-p" style="margin-top:1rem">Intanto puoi allenarti con le tappe del <a href="aula/matematica/">percorso di matematica</a>.</p>';
  }
  var m = /[#&]e=([A-Za-z0-9_-]+)/.exec(location.hash);
  if (!m) { errore('Questo link non contiene esercizi. Chiedi all\'insegnante il link completo, oppure inquadra di nuovo il QR.'); return; }
  PACCHETTO.decodifica(m[1]).then(function (p) {
    if (!p || p.v !== 1 || typeof p.r !== 'string') throw new Error('formato');
    var L = R.leggi(p.r);
    if (!L.es.length) throw new Error('vuoto');
    ES = L.es; S = ES.map(function () { return { ok: false, tent: 0, fase: 0 }; });
    if (p.t) { $('es-titolo').textContent = p.t; document.title = p.t + ' – Matematica | Convitto "Costaggini" - Rieti'; }
    if (p.i) $('es-ist').textContent = p.i;
    disegna(false);
  }).catch(function () { errore('Il link sembra incompleto o rovinato: forse è stato copiato solo in parte. Chiedi all\'insegnante di mandarlo di nuovo.'); });
  window.ESERCIZI_UI = { stato: function () { return { ES: ES, S: S, cur: cur }; } };
})();
