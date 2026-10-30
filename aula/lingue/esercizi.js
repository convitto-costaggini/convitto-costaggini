/* ════════════════════════════════════════════════════════
   ESERCIZI — motore comune (pagina Esercizi e Area docenti)
   ESERCIZI.avvia(box, { tipo, lingua, voci: [{ it, tr }], titolo, chiave })
   tipi: 'scelta' (scelta multipla), 'abbina' (abbinamento),
         'riordina' (riordina la frase), 'ascolta' (ascolta e scrivi)
   Nessun dato esce dal telefono: il miglior risultato resta in locale.
   daParole(lingua, sezione, ambito): voci dal Vocabolario (sezione 'tutte' = tutto l'ambito).
   ════════════════════════════════════════════════════════ */
window.ESERCIZI = (function () {
  'use strict';
  var L = window.LINGUE_SITO, esc = L.esc;
  var TIPI = {
    scelta: { nome: 'Scelta multipla', icona: '🎯', desc: 'Leggi la frase in italiano e scegli la traduzione giusta.' },
    abbina: { nome: 'Abbinamento', icona: '🔗', desc: 'Collega ogni frase italiana alla sua traduzione.' },
    riordina: { nome: 'Riordina la frase', icona: '🧩', desc: 'Tocca le parole nell\'ordine giusto.' },
    ascolta: { nome: 'Ascolta e scrivi', icona: '🎧', desc: 'Ascolta la frase e scrivila.' }
  };
  var MAX = 8;

  function norm(t, accenti) {
    t = String(t).toLowerCase().replace(/[’`]/g, "'").replace(/[¿¡?!.,;:«»"…()]/g, ' ').replace(/\s+/g, ' ').trim();
    return accenti ? t : t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss');
  }
  function pezzi(frase) { return frase.replace(/[¿¡]/g, '').replace(/\s*…\s*/g, ' … ').trim().split(/\s+/).filter(Boolean); }

  function avvia(box, cfg) {
    var tipo = cfg.tipo, cod = cfg.lingua, lin = L.lingua(cod);
    var pool = cfg.voci.filter(function (v) { return v.it && v.tr; });
    if (tipo === 'riordina') pool = pool.filter(function (v) { return pezzi(v.tr).length >= 3; });
    if (pool.length < (tipo === 'scelta' || tipo === 'abbina' ? 2 : 1)) {
      box.innerHTML = '<div class="ex"><div class="ex-card"><p class="ex-it" style="font-size:1.1rem">Servono almeno ' + (tipo === 'scelta' || tipo === 'abbina' ? 'due frasi' : (tipo === 'riordina' ? 'una frase di almeno tre parole' : 'una frase')) + ' per questo esercizio.</p></div></div>';
      return;
    }
    var giro, pos, punti, errori, totale;

    function nuovoGiro(lista) {
      giro = L.mescola(lista || pool).slice(0, tipo === 'abbina' ? 15 : MAX);
      pos = 0; punti = 0; errori = [];
      totale = tipo === 'abbina' ? Math.ceil(giro.length / 5) : giro.length;
      mostra();
    }
    function testa() {
      var fatti = tipo === 'abbina' ? pos : pos;
      return '<div class="ex-top"><div class="ex-bar"><i style="width:' + Math.round(fatti / totale * 100) + '%"></i></div><span class="ex-num">' + Math.min(pos + 1, totale) + ' / ' + totale + '</span></div>';
    }
    function feedback(ok, voce, testo) {
      return '<div class="ex-fb ' + (ok ? 'si' : 'no') + '"><div style="flex:1">' + (ok ? '✓ ' : '✗ ') + testo + '</div>' + L.play(voce.tr, cod, 'Ascolta') + '</div>' +
        '<button type="button" class="lg-btn pieno ex-avanti" data-ex="avanti">' + (pos + 1 < totale ? 'Avanti →' : 'Vedi il risultato') + '</button>';
    }
    function mostra() {
      if (pos >= totale) return fine();
      var v = giro[pos], h = '<div class="ex">' + testa() + '<div class="ex-card">';
      if (tipo === 'scelta') {
        /* risposte sbagliate: prima dalla stessa sezione (piatti con piatti), poi dalle altre */
        var altre = pool.filter(function (x) { return x.tr !== v.tr; });
        var alt = L.mescola(altre.filter(function (x) { return x.s && x.s === v.s; })).concat(L.mescola(altre.filter(function (x) { return !x.s || x.s !== v.s; })))
          .map(function (x) { return x.tr; }).filter(function (t, i, a) { return a.indexOf(t) === i; }).slice(0, 3);
        var opz = L.mescola(alt.concat([v.tr]));
        h += '<p class="ex-dom">Come si dice in ' + lin.nome.toLowerCase() + '?</p><p class="ex-it">' + esc(v.it) + '</p><div class="ex-opz">' +
          opz.map(function (o) { return '<button type="button" data-ex="opz" data-v="' + esc(o) + '" lang="' + cod + '">' + esc(o) + '</button>'; }).join('') + '</div><div data-ex="fb"></div>';
      } else if (tipo === 'abbina') {
        var gruppo = giro.slice(pos * 5, pos * 5 + 5);
        var sx = L.mescola(gruppo), dx = L.mescola(gruppo);
        h += '<p class="ex-dom">Collega le coppie · ' + lin.nome + '</p><div class="ex-abb">' +
          sx.map(function (x, i) { return '<button type="button" data-ex="sx" data-k="' + esc(x.it) + '" style="grid-column:1;grid-row:' + (i + 1) + '">' + esc(x.it) + '</button>'; }).join('') +
          dx.map(function (x, i) { return '<button type="button" data-ex="dx" data-k="' + esc(x.it) + '" lang="' + cod + '" style="grid-column:2;grid-row:' + (i + 1) + '">' + esc(x.tr) + '</button>'; }).join('') +
          '</div><div data-ex="fb"></div>';
        box._abb = { gruppo: gruppo, sel: null, fatte: 0, sbagli: 0 };
      } else if (tipo === 'riordina') {
        h += '<p class="ex-dom">Riordina in ' + lin.nome.toLowerCase() + '</p><p class="ex-it">' + esc(v.it) + '</p><div class="ex-frase" data-ex="frase" aria-live="polite"></div><div class="ex-pezzi">' +
          L.mescola(pezzi(v.tr).map(function (p, i) { return { p: p, i: i }; })).map(function (x) { return '<button type="button" class="ex-pezzo" data-ex="pezzo" lang="' + cod + '">' + esc(x.p) + '</button>'; }).join('') +
          '</div><div style="display:flex;gap:.5rem;margin-top:1rem"><button type="button" class="lg-btn" data-ex="annulla" style="flex:1">↺ Ricomincia</button><button type="button" class="lg-btn pieno" data-ex="verifica" style="flex:2">Verifica</button></div><div data-ex="fb"></div>';
      } else if (tipo === 'ascolta') {
        h += '<p class="ex-dom">Ascolta e scrivi in ' + lin.nome.toLowerCase() + '</p><div class="ex-grande">' + (L.parla ? L.play(v.tr, cod, 'Ascolta la frase', false) : '<p class="ex-it">' + esc(v.tr) + '</p>') + '</div>' +
          (L.parla ? '<p style="text-align:center;margin:-.4rem 0 1rem"><button type="button" class="lg-btn" data-ex="lento" style="min-height:36px;padding:.45rem .8rem">🐢 Più lento</button></p>' : '') +
          '<input type="text" class="ex-input" data-ex="scrivi" lang="' + cod + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Scrivi qui quello che senti"/>' +
          '<button type="button" class="lg-btn pieno ex-avanti" data-ex="verifica">Verifica</button><div data-ex="fb"></div>';
      }
      box.innerHTML = h + '</div></div>';
      if (tipo === 'ascolta' && L.parla) setTimeout(function () { L.ascolta(v.tr, cod, { btn: box.querySelector('.lg-play') }); }, 350);
    }
    function fine() {
      var perc = Math.round(punti / totale * 100);
      var tit = perc === 100 ? '🏆 Perfetto!' : perc >= 70 ? '👏 Molto bene!' : perc >= 40 ? '💪 Buon inizio' : '📚 Da ripassare';
      var k = cfg.chiave, best = k ? L.leggi('ex-' + k, null) : null;
      if (k && (best == null || perc > best)) { L.salva('ex-' + k, perc); }
      box.innerHTML = '<div class="ex"><div class="ex-card ex-fine"><p class="ex-dom">' + esc(TIPI[tipo].nome) + ' · ' + lin.nome + '</p><p class="tit">' + tit + '</p>' +
        '<p>Risultato: <b>' + punti + ' su ' + totale + '</b> (' + perc + '%)' + (best != null && k ? '<br/>Il tuo record su questo esercizio: ' + Math.max(best, perc) + '%' : '') + '</p>' +
        (errori.length ? '<div style="text-align:left;margin-top:1rem"><p class="ex-dom" style="text-align:left">Da ripassare</p>' + errori.map(function (v) {
          return '<div class="ex-fb no" style="margin-top:.4rem"><div style="flex:1"><b>' + esc(v.it) + '</b><br/>' + esc(v.tr) + '</div>' + L.play(v.tr, cod) + '</div>';
        }).join('') + '</div>' : '') +
        '<div class="bott">' + (errori.length && tipo !== 'abbina' ? '<button type="button" class="lg-btn oro" data-ex="errori">Ripeti solo gli errori</button>' : '') +
        '<button type="button" class="lg-btn pieno" data-ex="ancora">↺ Ricomincia</button></div></div></div>';
    }

    box.onclick = function (e) {
      var b = e.target.closest('[data-ex]'); if (!b || b.disabled) return;
      var a = b.dataset.ex, v = giro[pos];
      if (a === 'avanti') { pos++; mostra(); }
      else if (a === 'ancora') nuovoGiro();
      else if (a === 'errori') nuovoGiro(errori.slice());
      else if (a === 'lento') L.ascolta(v.tr, cod, { rate: .6, btn: box.querySelector('.ex-grande .lg-play') });
      else if (a === 'opz') {
        var ok = b.dataset.v === v.tr;
        box.querySelectorAll('[data-ex="opz"]').forEach(function (x) { x.disabled = true; if (x.dataset.v === v.tr) x.classList.add('giusta'); });
        if (!ok) { b.classList.add('sbagliata'); errori.push(v); } else punti++;
        box.querySelector('[data-ex="fb"]').innerHTML = feedback(ok, v, ok ? 'Esatto!' : 'La risposta giusta è: <b>' + esc(v.tr) + '</b>');
        if (L.parla) L.ascolta(v.tr, cod, { btn: box.querySelector('[data-ex="fb"] .lg-play') });
      } else if (a === 'sx' || a === 'dx') {
        var st = box._abb; if (b.classList.contains('fatto')) return;
        if (a === 'dx' && L.parla) { var vv = st.gruppo.filter(function (x) { return x.it === b.dataset.k; })[0]; L.ascolta(vv.tr, cod); }
        if (!st.sel || st.sel.dataset.ex === a) { if (st.sel) st.sel.classList.remove('sel'); st.sel = b; b.classList.add('sel'); return; }
        if (st.sel.dataset.k === b.dataset.k) {
          [st.sel, b].forEach(function (x) { x.classList.remove('sel'); x.classList.add('fatto'); x.disabled = true; });
          st.fatte++;
        } else {
          st.sbagli++; var s = st.sel; [s, b].forEach(function (x) { x.classList.add('err'); setTimeout(function () { x.classList.remove('err'); }, 400); });
          var sbagliata = st.gruppo.filter(function (x) { return x.it === s.dataset.k || x.it === b.dataset.k; });
          sbagliata.forEach(function (x) { if (errori.indexOf(x) < 0) errori.push(x); });
          s.classList.remove('sel');
        }
        st.sel = null;
        if (st.fatte === st.gruppo.length) {
          var ok2 = st.sbagli === 0; if (ok2) punti++;
          box.querySelector('[data-ex="fb"]').innerHTML = '<div class="ex-fb ' + (ok2 ? 'si' : 'no') + '">' + (ok2 ? '✓ Tutte giuste al primo colpo!' : '✓ Completato, con ' + st.sbagli + (st.sbagli === 1 ? ' errore' : ' errori')) + '</div><button type="button" class="lg-btn pieno ex-avanti" data-ex="avanti">' + (pos + 1 < totale ? 'Avanti →' : 'Vedi il risultato') + '</button>';
        }
      } else if (a === 'pezzo') {
        box.querySelector('[data-ex="frase"]').appendChild(b); b.dataset.ex = 'togli';
      } else if (a === 'togli') {
        box.querySelector('.ex-pezzi').appendChild(b); b.dataset.ex = 'pezzo';
      } else if (a === 'annulla') {
        box.querySelectorAll('[data-ex="frase"] .ex-pezzo').forEach(function (x) { box.querySelector('.ex-pezzi').appendChild(x); x.dataset.ex = 'pezzo'; });
      } else if (a === 'verifica') {
        var ok3, risposta;
        if (tipo === 'riordina') {
          if (box.querySelectorAll('.ex-pezzi .ex-pezzo').length) { box.querySelector('[data-ex="fb"]').innerHTML = '<div class="ex-fb no">Usa tutte le parole prima di verificare.</div>'; return; }
          risposta = [].map.call(box.querySelectorAll('[data-ex="frase"] .ex-pezzo'), function (x) { return x.textContent; }).join(' ');
          ok3 = norm(risposta, true) === norm(pezzi(v.tr).join(' '), true);
          box.querySelector('[data-ex="frase"]').classList.add(ok3 ? 'giusta' : 'sbagliata');
          box.querySelectorAll('.ex-pezzo').forEach(function (x) { x.disabled = true; });
          b.parentNode.style.display = 'none';
          box.querySelector('[data-ex="fb"]').innerHTML = feedback(ok3, v, ok3 ? 'Esatto!' : 'L\'ordine giusto è: <b>' + esc(v.tr) + '</b>');
        } else {
          var inp = box.querySelector('[data-ex="scrivi"]'); risposta = inp.value;
          if (!risposta.trim()) { inp.focus(); return; }
          var esatto = norm(risposta, true) === norm(v.tr, true), quasi = norm(risposta) === norm(v.tr);
          ok3 = esatto || quasi; inp.disabled = true; b.style.display = 'none';
          box.querySelector('[data-ex="fb"]').innerHTML = feedback(ok3, v, esatto ? 'Esatto!' : quasi ? 'Giusto, ma attenzione agli accenti: <b>' + esc(v.tr) + '</b>' : 'La frase era: <b>' + esc(v.tr) + '</b><br/><small>(' + esc(v.it) + ')</small>');
        }
        if (ok3) punti++; else errori.push(v);
        if (L.parla && tipo === 'riordina') L.ascolta(v.tr, cod, { btn: box.querySelector('[data-ex="fb"] .lg-play') });
      }
    };
    box.onkeydown = function (e) { if (e.key === 'Enter' && e.target.matches('[data-ex="scrivi"]')) { var b = box.querySelector('[data-ex="verifica"]'); if (b) b.click(); } };
    nuovoGiro();
  }

  /* frasi del Vocabolario → voci per il motore */
  function daParole(cod, sezione, ambito) {
    var P = window.VOCABOLARIO, out = [];
    P.SEZIONI.forEach(function (s) {
      if (ambito && s.ambito !== ambito) return;
      if (sezione && sezione !== 'tutte' && s.id !== sezione) return;
      (P.PAROLE[s.id] || []).forEach(function (p) { var t = p[1][cod]; out.push({ it: p[0], tr: t[0], s: s.id }); });
    });
    return out;
  }
  return { TIPI: TIPI, avvia: avvia, daParole: daParole, norm: norm };
})();
