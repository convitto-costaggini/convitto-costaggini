/* Aula · Matematica · Crea i tuoi esercizi (per chi insegna).
   Le righe scritte dalla docente diventano un link (#e=…, PACCHETTO) e un QR.
   In localStorage restano solo la bozza e le raccolte salvate in questo browser. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var R = window.RACCOLTA, BOZZA = 'mate-crea-bozza', MIE = 'mate-crea-mie', BASE = location.origin + '/aula/matematica/esercizi.html';
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} return null; }
  function copia(testo, el, ok) {
    function fatto() { el.className = 'fz-fb si'; el.textContent = ok; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(testo).then(fatto, function () { el.className = 'fz-fb mezzo'; el.textContent = 'Il browser non ha permesso la copia: seleziona il testo e copialo a mano.'; });
    else { el.className = 'fz-fb mezzo'; el.textContent = 'Seleziona il testo e copialo a mano.'; }
  }

  /* ── 1. le istruzioni per l'IA ── */
  function istruzioni() { return R.istruzioni({ argomento: $('ia-arg').value.trim(), quanti: $('ia-n').value, note: $('ia-note').value.trim() }); }
  function aggIst() { $('ia-testo').value = istruzioni(); }
  ['ia-arg', 'ia-n', 'ia-note'].forEach(function (id) { $(id).addEventListener('input', aggIst); $(id).addEventListener('change', aggIst); });
  /* chi copia le istruzioni per l'IA la sta usando: la casella al passo 2 si spunta da sola (si può togliere) */
  $('ia-copia').addEventListener('click', function () { $('cr-ia').checked = true; if (typeof aggiorna === 'function') aggiorna(); aggIst(); copia($('ia-testo').value, $('ia-fb'), 'Istruzioni copiate. Ora incollale nell\'assistente IA insieme alla foto, poi incolla la risposta al passo 2.'); });
  aggIst();

  /* ── 2. esempi e forme ── */
  $('cr-esempi').innerHTML = R.FORME.map(function (f, i) { return '<button type="button" class="fz-chip" data-f="' + i + '">' + esc(f[0].split(' ')[0] === 'problema' ? f[0].split('|')[0].trim() : f[0].split(' ')[0]) + '</button>'; }).join('');
  $('cr-forme').innerHTML = '<thead><tr><th>Scrivi così</th><th>Che cosa diventa</th></tr></thead><tbody>' + R.FORME.map(function (f) { return '<tr><td><code>' + esc(f[0]) + '</code></td><td>' + esc(f[1]) + '</td></tr>'; }).join('') + '</tbody>';
  $('cr-esempi').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-f]'); if (!b) return;
    var ta = $('cr-righe'), t = ta.value.replace(/\s+$/, '');
    ta.value = (t ? t + '\n' : '') + R.FORME[+b.dataset.f][0];
    aggiorna(); ta.focus();
  });

  /* ── 3. anteprima ── */
  var ultimo = null;
  function pacchetto() { var p = { v: 1, r: $('cr-righe').value.trim() }, t = $('cr-tit').value.trim(), i = $('cr-ist').value.trim(); if (t) p.t = t; if (i) p.i = i; if ($('cr-ia').checked) p.a = 1; return p; }
  function anteprima(L) {
    var h = '<p class="cr-conto">Esercizi pronti: <strong>' + L.es.length + '</strong>' + (L.err.length ? ' · righe da sistemare: <strong class="cr-rosso">' + L.err.length + '</strong>' : '') + '</p>';
    L.err.forEach(function (e) { h += '<div class="cr-err"><b>Riga ' + e.riga + ':</b> <code>' + esc(e.testo) + '</code><br>' + esc(e.msg) + '.</div>'; });
    L.es.forEach(function (e, i) {
      var sol;
      try { sol = R.solStampa(e); } catch (x) { sol = '—'; }
      h += '<div class="cr-es"><p class="tt-n">' + (i + 1) + ' · riga ' + e.riga + (R.tutor(e) ? ' · con passo passo' : '') + '</p>' + R.domanda(e) + '<div class="fz-azioni cr-az"><button type="button" class="fz-btn sec" data-cr="sugg" aria-expanded="false">Suggerimento</button><button type="button" class="fz-btn sec" data-cr="sol" aria-expanded="false">Soluzione</button></div><p class="tt-aiuto cr-sug" hidden>' + esc(R.suggerimento(e)) + '</p><p class="cr-sol" hidden><span>Soluzione calcolata dal sito:</span> ' + sol + '</p></div>';
    });
    if (!L.es.length && !L.err.length) h = '<p class="au-nota">Scrivi almeno un esercizio al passo 2.</p>';
    $('cr-anteprima').innerHTML = h;
  }
  $('cr-anteprima').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-cr]'); if (!b) return;
    var box = b.closest('.cr-es'), sugg = b.dataset.cr === 'sugg', el = box.querySelector(sugg ? '.cr-sug' : '.cr-sol'), apri = el.hidden;
    el.hidden = !apri; b.setAttribute('aria-expanded', apri ? 'true' : 'false');
    b.textContent = (apri ? 'Nascondi ' : '') + (sugg ? (apri ? 'suggerimento' : 'Suggerimento') : (apri ? 'soluzione' : 'Soluzione'));
  });
  function condividi(L) {
    var p = pacchetto(), firma = JSON.stringify(p);
    if (firma === ultimo) return; ultimo = firma;
    ls(BOZZA, p);
    if (!L.es.length) { $('cr-link').value = ''; $('cr-qr').innerHTML = ''; $('cr-apri').href = 'aula/matematica/esercizi.html'; return; }
    PACCHETTO.codifica(p).then(function (c) {
      if (JSON.stringify(pacchetto()) !== firma) return;
      var url = BASE + '#e=' + c;
      $('cr-link').value = url; $('cr-apri').href = url;
      if (url.length > 2200) { $('cr-qr').innerHTML = '<p class="au-nota">Il link è lungo (' + url.length + ' caratteri): il QR sarebbe troppo fitto da leggere. Usa il link, oppure dividi gli esercizi in due raccolte.</p>'; return; }
      try {
        var qr = qrcode(0, 'M'); qr.addData(url); qr.make();
        $('cr-qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: 'QR degli esercizi' }) + '<p class="au-nota">Da proiettare alla LIM o stampare: i ragazzi lo inquadrano con la fotocamera.</p>';
      } catch (e) { $('cr-qr').innerHTML = '<p class="au-nota">Il QR non si riesce a creare: usa il link.</p>'; }
    });
  }
  var timer = null;
  function aggiorna() {
    clearTimeout(timer);
    timer = setTimeout(function () { var L = R.leggi($('cr-righe').value); anteprima(L); condividi(L); }, 250);
  }
  ['cr-righe', 'cr-tit', 'cr-ist'].forEach(function (id) { $(id).addEventListener('input', aggiorna); });
  $('cr-ia').addEventListener('change', aggiorna);

  /* ── 4. condividi, stampa, raccolte ── */
  $('cr-copia').addEventListener('click', function () { if ($('cr-link').value) copia($('cr-link').value, $('cr-fb'), 'Link copiato: puoi incollarlo nel registro elettronico, in Classroom o in una mail alla classe.'); });
  $('cr-stampa').addEventListener('click', function () {
    var L = R.leggi($('cr-righe').value); if (!L.es.length) return;
    var p = pacchetto(), h = '<div class="fz-pag"><h2 class="fz-foglio-t">' + esc(p.t || 'Esercizi di matematica') + '</h2><p class="fz-foglio-i">Nome ______________________ Classe ________ Data ____________</p>' + (p.i ? '<p class="fz-foglio-c">' + esc(p.i) + '</p>' : '') + '<ol class="fz-es" style="--h:2.6cm">';
    L.es.forEach(function (e) { h += '<li class="fz-es-i' + (/problema/.test(e.k) ? ' mm-es-pr' : '') + '">' + R.stampa(e) + '</li>'; });
    h += '</ol></div>';
    if ($('cr-sol').checked) h += '<div class="fz-pag fz-sol-pag"><h2 class="fz-foglio-t">Soluzioni</h2><ol class="fz-es fz-es-sol">' + L.es.map(function (e) { return '<li>' + R.solStampa(e) + '</li>'; }).join('') + '</ol></div>';
    $('cr-foglio').innerHTML = h; $('cr-foglio-sez').hidden = false;
    setTimeout(function () { window.print(); }, 50);
  });
  function mie() { return ls(MIE) || []; }
  function disegnaMie() {
    var M = mie();
    $('cr-mie').innerHTML = M.length ? M.map(function (x, i) { return '<li><span><b>' + esc(x.p.t || 'Senza titolo') + '</b><small>' + R.leggi(x.p.r).es.length + ' esercizi · ' + new Date(x.data).toLocaleDateString('it-IT') + '</small></span><button type="button" class="fz-btn sec" data-apri="' + i + '">Apri</button><button type="button" class="fz-btn sec" data-via="' + i + '" aria-label="Elimina ' + esc(x.p.t || 'raccolta senza titolo') + '">Elimina</button></li>'; }).join('') : '<li class="au-nota">Nessuna raccolta salvata.</li>';
  }
  function carica(p) { $('cr-ia').checked = !!p.a; $('cr-tit').value = p.t || ''; $('cr-ist').value = p.i || ''; $('cr-righe').value = p.r || ''; ultimo = null; aggiorna(); }
  $('cr-salva').addEventListener('click', function () {
    var p = pacchetto(); if (!R.leggi(p.r).es.length) { $('cr-fb').className = 'fz-fb no'; $('cr-fb').textContent = 'Non c\'è ancora nessun esercizio da salvare.'; return; }
    var M = mie().filter(function (x) { return (x.p.t || '') !== (p.t || '') || x.p.r !== p.r; });
    M.unshift({ p: p, data: Date.now() }); ls(MIE, M.slice(0, 40)); disegnaMie();
    $('cr-fb').className = 'fz-fb si'; $('cr-fb').textContent = 'Raccolta salvata in questo browser.';
  });
  $('cr-nuova').addEventListener('click', function () { carica({ r: '' }); $('cr-righe').focus(); });
  $('cr-mie').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var M = mie();
    if (b.dataset.apri !== undefined) { carica(M[+b.dataset.apri].p); $('cr-righe').scrollIntoView(); }
    if (b.dataset.via !== undefined && confirm('Eliminare questa raccolta da questo browser?')) { M.splice(+b.dataset.via, 1); ls(MIE, M); disegnaMie(); }
  });
  function daLink(t) {
    var m = /[#&]e=([A-Za-z0-9_-]+)/.exec(t || '');
    if (!m) return Promise.reject(new Error('link'));
    return PACCHETTO.decodifica(m[1]).then(function (p) { if (!p || p.v !== 1) throw new Error('formato'); carica(p); });
  }
  $('cr-importa-b').addEventListener('click', function () {
    daLink($('cr-importa').value).then(function () { $('cr-fb').className = 'fz-fb si'; $('cr-fb').textContent = 'Raccolta aperta: ora puoi modificarla al passo 2.'; $('cr-righe').scrollIntoView(); })
      .catch(function () { $('cr-fb').className = 'fz-fb no'; $('cr-fb').textContent = 'Questo non sembra un link di esercizi completo.'; });
  });
  window.addEventListener('afterprint', function () { $('cr-foglio-sez').hidden = true; });

  /* avvio: un link da modificare, oppure la bozza, oppure un esempio */
  disegnaMie();
  daLink(location.hash).catch(function () {
    var b = ls(BOZZA);
    if (b && b.r) carica(b);
    else carica({ t: 'MCD, mcm e frazioni in cucina', r: '# Un esempio: modificalo o cancellalo\nMCD 24 36\nmcm 6 8\nsemplifica 18/24\nconfronta 3/4 5/8\nfrazione 2/5 di 1000 g di farina\ncalcola 2/3 + 3/4\nproblema MCD 36 48 | Lo chef ha preparato 36 tartine al salmone e 48 al formaggio. Vuole vassoi tutti uguali, il maggior numero possibile, senza avanzi. Quanti vassoi prepara?' });
  });
})();
