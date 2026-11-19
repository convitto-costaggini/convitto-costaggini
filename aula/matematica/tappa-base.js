/* ════════════════════════════════════════════════════════════
   AULA · Matematica · la base comune delle tappe (TB)
   Allenamento, missione e «servizio a sei comande» con punteggio e sfida tra compagni,
   costruiti sullo stesso schema: ogni domanda è un oggetto q
     { html, intro?, tipo: 'num'|'dec'|'frac'|'scelta'|'testo', opzioni?, formato?,
       verifica(raw) → {ok, msg?, quasi?}, rivela() → html, aiuti?: [html], guida?: fn, soluzione?: fn → html }
   Tutto nel dispositivo: in localStorage solo il segno «tappa fatta», il ripasso e il record, senza nomi né invii.
   ════════════════════════════════════════════════════════════ */
window.TB = (function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mescola(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function lsLeggi(k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }
  function lsScrivi(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function mfr(n, d) { return '<mfrac><mn>' + n + '</mn><mn>' + d + '</mn></mfrac>'; }
  function M(x, blocco) { return '<math' + (blocco ? ' display="block"' : '') + '>' + x + '</math>'; }
  function F(n, d) { return M(d === 1 ? '<mn>' + n + '</mn>' : mfr(n, d)); }

  /* ── lettura delle risposte ── */
  function intero(s) { s = String(s == null ? '' : s).replace(/[\s.']/g, ''); return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; }
  function leggiFr(n, d) {
    var a = intero(n), b = String(d).trim() === '' ? 1 : intero(d);
    return a === null || b === null || b === 0 ? null : { n: a, d: b };
  }
  /* decimale scritto all'italiana: 3,25 oppure 3.25 → {n, s} (n intero, s cifre decimali) */
  function leggiDec(s) {
    s = String(s == null ? '' : s).trim().replace(/\s+/g, '').replace(',', '.');
    var m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s);
    if (!m) return null;
    var dec = m[3] || '';
    return { n: parseInt(m[1] + m[2] + dec, 10), s: dec.length };
  }
  function ugualiDec(a, b) { return a.n * Math.pow(10, b.s) === b.n * Math.pow(10, a.s); }
  function scriviDec(x, cifre) { /* numero → stringa all'italiana */
    var t = cifre == null ? String(x) : x.toFixed(cifre);
    return t.replace('.', ',');
  }

  /* ── costruttori di domande ── */
  var Q = {
    num: function (att, o) {
      o = o || {};
      return Object.assign({ tipo: 'num', att: att, verifica: function (v) {
        var x = intero(v);
        if (x === null) return { ok: false, msg: 'Scrivi un numero intero.' };
        return { ok: x === att };
      }, rivela: function () { return String(att); } }, o);
    },
    dec: function (att, o) { /* att: stringa decimale, es. '3,25' */
      o = o || {}; var A = leggiDec(att);
      return Object.assign({ tipo: 'dec', att: att, verifica: function (v) {
        var x = leggiDec(v);
        if (!x) return { ok: false, msg: 'Scrivi un numero decimale, con la virgola (per esempio 3,25).' };
        return { ok: ugualiDec(x, A) };
      }, rivela: function () { return esc(att); } }, o);
    },
    frac: function (n, d, o) {
      o = o || {}; var g = gcd(n, d); n /= g; d /= g;
      return Object.assign({ tipo: 'frac', verifica: function (v) {
        var x = v && leggiFr(v.n, v.d);
        if (!x) return { ok: false, msg: 'Scrivi numeratore e denominatore con numeri interi (se il risultato è intero, lascia vuoto il denominatore).' };
        if (x.n === n && x.d === d) return { ok: true };
        if (x.n * d === n * x.d) return { ok: false, quasi: true, msg: 'Il valore è giusto, ma la frazione va ridotta ai minimi termini.' };
        return { ok: false };
      }, rivela: function () { return F(n, d); } }, o);
    },
    scelta: function (att, opzioni, o) {
      return Object.assign({ tipo: 'scelta', opzioni: opzioni, verifica: function (v) { return { ok: v === att }; }, rivela: function () { var t = opzioni.filter(function (x) { return x[0] === att; })[0]; return t ? t[1] : att; } }, o || {});
    }
  };

  /* ── campi di risposta, uguali ovunque ── */
  function campo(q, p) {
    var b = '<button type="submit" class="fz-btn">' + (q.bottone || 'Controlla') + '</button>';
    if (q.tipo === 'scelta') return '<div class="tt-sc" role="group" aria-label="Scegli la risposta">' + q.opzioni.map(function (o) { return '<button type="button" class="fz-btn sec" data-v="' + esc(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    if (q.tipo === 'frac') return '<div class="tt-fi"><label for="' + p + '-n">Numeratore</label><input id="' + p + '-n" data-r="n" type="text" inputmode="numeric" autocomplete="off"/><span class="fz-barra" aria-hidden="true"></span><label for="' + p + '-d">Denominatore</label><input id="' + p + '-d" data-r="d" type="text" inputmode="numeric" autocomplete="off"/></div>' + b;
    var im = q.tipo === 'dec' ? 'decimal' : q.tipo === 'testo' ? 'text' : 'numeric';
    return '<div class="tt-num tb-num"><label for="' + p + '-r">' + (q.etichetta || 'La tua risposta') + '</label><input id="' + p + '-r" data-r="r" type="text" inputmode="' + im + '" autocomplete="off" autocapitalize="off" spellcheck="false"' + (q.formato ? ' aria-describedby="' + p + '-fmt"' : '') + '/>' + (q.formato ? '<span class="tb-fmt" id="' + p + '-fmt">' + esc(q.formato) + '</span>' : '') + '</div>' + b;
  }
  function leggi(area, q) {
    if (q.tipo === 'frac') return { n: area.querySelector('[data-r=n]').value, d: area.querySelector('[data-r=d]').value };
    var i = area.querySelector('[data-r=r]'); return i ? i.value : '';
  }
  function primoCampo(area) { return area.querySelector('input') || area.querySelector('[data-v]'); }

  function lim(btnId, mainId) {
    var b = $(btnId); if (!b) return;
    b.addEventListener('click', function () {
      var on = this.getAttribute('aria-pressed') !== 'true';
      this.setAttribute('aria-pressed', on ? 'true' : 'false');
      $(mainId || 'main').classList.toggle('fz-grande', on);
    });
  }

  /* ════════ ALLENATI ════════
     cfg: { area, conta, genera(): q, cambia: [id di select che rigenerano], guida?: fn(q) } */
  function allenati(cfg) {
    var A = $(cfg.area), C = $(cfg.conta), S = { q: null, ok: false, n: 0, tent: 0 };
    function disegna(msg, cls) {
      var q = S.q, h = (q.intro ? '<p class="mm-p">' + q.intro + '</p>' : '') + '<div class="tt-testata"><p class="tt-et">' + (q.et || 'Esercizio') + '</p>' + q.html + '</div>';
      if (!S.ok) h += '<form class="mm-tf tb-f" novalidate>' + campo(q, 'al') + '</form>';
      h += '<p class="fz-fb ' + (cls || '') + '" id="al-fb" role="status">' + (msg || '') + '</p><p class="tt-aiuto" id="al-aiuto"></p><div class="fz-azioni">';
      if (!S.ok) {
        if (q.aiuti && q.aiuti.length) h += '<button type="button" class="fz-btn sec" id="al-aiuto-b">Suggerimento</button>';
        if (q.guida) h += '<button type="button" class="fz-btn sec" id="al-guida">Guidami passo passo</button>';
        h += '<button type="button" class="fz-btn sec" id="al-sol">Mostra il risultato</button>';
      }
      h += '<button type="button" class="fz-btn' + (S.ok ? '' : ' sec') + '" id="al-nuovo">Un altro esercizio</button></div>';
      A.innerHTML = h;
    }
    function nuovo(focus) {
      S.q = cfg.genera(); S.ok = false; S.tent = 0; S.k = 0; disegna();
      if (focus) { var f = primoCampo(A); if (f) f.focus(); }
    }
    function controlla(raw) {
      var q = S.q, r = q.verifica(raw);
      if (r.ok) { S.ok = true; S.n++; C.textContent = 'Esercizi risolti in questa visita: ' + S.n; disegna('Esatto! ' + (q.dopo || '') + ' ' + (q.rivela ? '' : ''), 'si'); var nb = A.querySelector('#al-nuovo'); if (nb) nb.focus(); return; }
      S.tent++;
      var msg = r.msg || (S.tent >= 2 && q.aiuti ? 'Non ancora. Prova con il suggerimento.' : 'Non ancora: ricontrolla.');
      var keep = null; if (q.tipo !== 'scelta') { keep = leggi(A, q); }
      disegna(msg, r.quasi ? 'mezzo' : 'no');
      if (keep != null && q.tipo !== 'scelta') {
        if (q.tipo === 'frac') { A.querySelector('[data-r=n]').value = keep.n; A.querySelector('[data-r=d]').value = keep.d; } else A.querySelector('[data-r=r]').value = keep;
        var f = primoCampo(A); if (f) f.focus();
      }
    }
    A.addEventListener('submit', function (ev) { ev.preventDefault(); if (!S.ok) controlla(leggi(A, S.q)); });
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined && !S.ok) { controlla(b.dataset.v); return; }
      if (b.id === 'al-nuovo') { nuovo(true); return; }
      if (b.id === 'al-aiuto-b') { var q = S.q, k = Math.min(S.k, q.aiuti.length - 1); $('al-aiuto').innerHTML = 'Suggerimento ' + (k + 1) + ': ' + q.aiuti[k]; S.k++; if (S.k >= q.aiuti.length) { b.disabled = true; b.textContent = 'Hai visto tutti i suggerimenti'; } else b.textContent = 'Un altro suggerimento'; return; }
      if (b.id === 'al-sol') { var qq = S.q; var keep = qq.tipo === 'scelta' ? null : leggi(A, qq); disegna('La risposta è ' + qq.rivela() + '.' + (qq.guida ? ' Vuoi vedere come si arriva? Premi «Guidami passo passo».' : ''), 'mezzo'); return; }
      if (b.id === 'al-guida') { cfg.guida(S.q); return; }
    });
    (cfg.cambia || []).forEach(function (id) { var e = $(id); if (e) e.addEventListener('change', function () { nuovo(false); }); });
    nuovo(false);
    return { nuovo: nuovo, stato: function () { return S; } };
  }

  /* ════════ MISSIONE ════════
     cfg: { area, id, titolo, icona, items: [q con .intro/.html/.hint/.dopo], rip, url } */
  function missione(cfg) {
    var A = $(cfg.area), I = cfg.items, S = { i: 0, fatto: false, err: 0 };
    function disegna(msg, cls) {
      var n = I.length;
      if (S.i >= n) {
        if (window.PERCORSO) PERCORSO.segna(cfg.id);
        if (window.RIPASSO) RIPASSO.registra({ titolo: cfg.titolo, icona: cfg.icona, materia: 'Matematica' }, 'mate-' + cfg.id, location.pathname, cfg.rip);
        A.innerHTML = '<div class="tt-fine"><p class="tt-et">Missione compiuta</p><p class="tt-q">🎉 Missione riuscita, e la tappa è fatta!</p><p class="tt-stat">' + (S.err === 0 ? 'Nessun errore: complimenti.' : 'Tentativi da rifare: ' + S.err + '. Va benissimo: si impara così.') + ' Domani, tra 3 giorni e tra una settimana trovi un ripasso lampo nella pagina del percorso.</p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-ricomincia">Rifai la missione</button><a class="fz-btn" href="aula/matematica/" style="text-decoration:none;display:inline-flex;align-items:center">Torna alle tappe</a></div></div>';
        return;
      }
      var q = I[S.i], h = '<div class="tt-prog"><span>Problema ' + (S.i + 1) + ' di ' + n + '</span><div class="tt-bar" role="img" aria-label="Fatti ' + S.i + ' problemi su ' + n + '"><i style="width:' + Math.round(100 * S.i / n) + '%"></i></div></div>';
      h += '<p class="mm-pr">' + (q.intro || '') + '</p>' + (q.html ? '<div class="tt-ctx">' + q.html + '</div>' : '');
      if (!S.fatto) h += '<form class="mm-tf tb-f" novalidate>' + campo(q, 'mi') + '</form><div class="fz-azioni"><button type="button" class="fz-btn sec" id="mi-aiuto">Suggerimento</button></div>';
      h += '<p class="fz-fb ' + (cls || '') + '" id="mi-fb" role="status" aria-live="polite">' + (msg || '') + '</p>';
      if (S.fatto) h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="mi-avanti">' + (S.i + 1 >= n ? 'Concludi' : 'Avanti') + '</button></div>';
      A.innerHTML = h;
      if (S.fatto) A.querySelector('#mi-avanti').focus();
    }
    function controlla(raw) {
      var q = I[S.i], r = q.verifica(raw), f = $('mi-fb');
      if (r.ok) { S.fatto = true; disegna('Esatto! ' + (q.dopo || ''), 'si'); return; }
      S.err += r.quasi ? 0 : 1; f.className = 'fz-fb ' + (r.quasi ? 'mezzo' : 'no'); f.textContent = r.msg || 'Non ancora: rileggi il problema con calma.';
    }
    A.addEventListener('submit', function (ev) { ev.preventDefault(); if (!S.fatto) controlla(leggi(A, I[S.i])); });
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined && !S.fatto) { controlla(b.dataset.v); return; }
      if (b.id === 'mi-ricomincia') { S = { i: 0, fatto: false, err: 0 }; disegna(); return; }
      if (b.id === 'mi-avanti') { S.i++; S.fatto = false; disegna(); var x = primoCampo(A) || A.querySelector('button'); if (x) x.focus(); return; }
      if (b.id === 'mi-aiuto') { var f = $('mi-fb'); f.className = 'fz-fb mezzo'; f.textContent = I[S.i].hint || 'Rileggi il problema e scrivi che cosa ti serve.'; }
    });
    disegna();
    return { stato: function () { return S; }, items: I };
  }

  /* ════════ IL SERVIZIO (sei comande, punteggio, sfida) ════════
     cfg: { area, chiave, livelli: [..6], genera(liv, i) → q con .intro e .html, tempoMax?, nome? } */
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function conSeme(seed, fn) { var o = Math.random; Math.random = mulberry(seed); try { return fn(); } finally { Math.random = o; } }
  function servizio(cfg) {
    var A = $(cfg.area), LIV = cfg.livelli, PUNTI = 100, TMAX = cfg.tempoMax || 60, SV = null, SEME = null;
    function seme() { return 1000 + Math.floor(Math.random() * 8999000); }
    function costruisci(s) { return conSeme(s, function () { return LIV.map(function (liv, i) { var q = cfg.genera(liv, i); q.speciale = i === LIV.length - 1; return q; }); }); }
    function inizio() {
      var rec = lsLeggi('mate-record-' + cfg.chiave, {});
      A.innerHTML = (SEME ? '<p class="fz-fb si">🤝 Sfida ricevuta: giochi gli stessi ordini del tuo compagno. Alla fine confrontate i punti.</p>' : '') + '<p class="mm-p">Sei comande, dalla più facile a quella speciale. <strong>Punti:</strong> 100 per ogni risposta giusta al primo colpo, 50 se serve un secondo tentativo, più un bonus per le comande di fila. Con il cronometro (facoltativo) c\'è anche un bonus velocità, che vedi solo a fine comanda: nessun conto alla rovescia sullo schermo.</p><label class="fz-un"><input type="checkbox" id="sv-timer"/> Con il cronometro (bonus velocità)</label>' + (rec.n || rec.t ? '<p class="mm-p">Il tuo record su questo dispositivo: ' + (rec.n ? '<strong>' + rec.n + '</strong> punti' : '') + (rec.n && rec.t ? ' (senza cronometro), ' : '') + (rec.t ? '<strong>' + rec.t + '</strong> punti (con cronometro)' : '') + '.</p>' : '') + '<div class="fz-azioni"><button type="button" class="fz-btn" id="sv-via">Inizia il servizio</button></div>';
    }
    function avvia() { var s = SEME || seme(); SV = { seme: s, ordini: costruisci(s), i: 0, punti: 0, serie: 0, tent: 0, timer: $('sv-timer').checked, t0: Date.now(), fatto: false, mostra: false }; disegna(); }
    function disegna(msg, cls) {
      var n = SV.ordini.length;
      if (SV.i >= n) { fine(); return; }
      var q = SV.ordini[SV.i];
      var h = '<div class="tt-prog"><span>Comanda ' + (SV.i + 1) + ' di ' + n + ' · punti: ' + SV.punti + (SV.serie > 1 ? ' · serie ' + SV.serie : '') + '</span><div class="tt-bar" role="img" aria-label="Fatte ' + SV.i + ' comande su ' + n + '"><i style="width:' + Math.round(100 * SV.i / n) + '%"></i></div></div>';
      h += '<div class="ef-ordine' + (q.speciale ? ' sp' : '') + '"><p class="tt-et">' + (q.speciale ? 'Ordine speciale dello chef' : 'Comanda ' + (SV.i + 1)) + '</p>' + (q.intro ? '<p class="tt-q">' + q.intro + '</p>' : '') + (q.html ? '<div class="tt-ctx">' + q.html + '</div>' : '');
      if (!SV.fatto) h += '<form class="mm-tf tb-f" novalidate>' + campo(Object.assign({}, q, { bottone: 'Consegna' }), 'sv') + '</form>';
      h += '<p class="fz-fb ' + (cls || '') + '" id="sv-fb" role="status">' + (msg || '') + '</p>';
      if (SV.fatto) h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="sv-avanti">' + (SV.i + 1 >= n ? 'Vedi il voto' : 'Prossima comanda') + '</button>' + (SV.mostra && q.soluzione ? '<button type="button" class="fz-btn sec" id="sv-come">Come si risolve</button>' : '') + '</div><div id="sv-sol"></div>';
      A.innerHTML = h + '</div>';
      if (SV.fatto) A.querySelector('#sv-avanti').focus();
    }
    function consegna(raw) {
      var q = SV.ordini[SV.i], r = q.verifica(raw), sec = Math.round((Date.now() - SV.t0) / 1000), f = $('sv-fb');
      if (r.ok) {
        var base = SV.tent === 0 ? PUNTI : 50, bonus = SV.tent === 0 ? Math.min(SV.serie, 5) * 10 : 0, tempo = SV.timer && SV.tent === 0 ? Math.max(0, Math.round((TMAX - sec) / TMAX * 50)) : 0, tot = base + bonus + tempo;
        SV.punti += tot; SV.serie = SV.tent === 0 ? SV.serie + 1 : 0; SV.fatto = true; SV.mostra = false;
        disegna('Comanda servita! +' + base + (bonus ? ' +' + bonus + ' serie' : '') + (SV.timer && SV.tent === 0 ? ' +' + tempo + ' velocità (' + sec + ' s)' : '') + ' = ' + tot + ' punti.', 'si'); return;
      }
      if (r.quasi) { f.className = 'fz-fb mezzo'; f.textContent = r.msg; return; }
      SV.tent++;
      if (SV.tent >= 2) { SV.fatto = true; SV.mostra = true; SV.serie = 0; disegna('Comanda sbagliata: la risposta era ' + q.rivela() + '. Nessun punto, ma guarda come si risolve.', 'no'); return; }
      f.className = 'fz-fb no'; f.textContent = (r.msg || 'Non ancora.') + ' Hai un secondo tentativo (per metà dei punti).';
    }
    function fine() {
      var n = LIV.length, max = n * PUNTI + 150 + (SV.timer ? n * 50 : 0), pct = SV.punti / max;
      var stelle = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
      var voti = ['Il servizio è stato duro: rifallo e vedrai che va meglio.', 'Servizio sufficiente: qualche comanda da rivedere.', 'Ottimo servizio: la sala applaude.', 'Servizio perfetto: una brigata da stella!'];
      var rec = lsLeggi('mate-record-' + cfg.chiave, {}), k = SV.timer ? 't' : 'n', nuovoRec = !rec[k] || SV.punti > rec[k];
      if (nuovoRec) { rec[k] = SV.punti; lsScrivi('mate-record-' + cfg.chiave, rec); }
      var link = location.origin + location.pathname + '#sfida=' + SV.seme;
      A.innerHTML = '<div class="tt-fine"><p class="tt-et">Fine del servizio</p><p class="ef-stelle" role="img" aria-label="' + stelle + ' stelle su 3">' + '★'.repeat(stelle) + '☆'.repeat(3 - stelle) + '</p><p class="tt-q">' + SV.punti + ' punti su ' + max + (nuovoRec ? ' · nuovo record su questo dispositivo!' : '') + '</p><p class="tt-stat">' + voti[stelle] + (SV.timer ? ' Tempo totale: ' + Math.round((Date.now() - SV.t0) / 1000) + ' secondi.' : '') + '</p><p class="mm-p"><strong>Sfida un compagno:</strong> manda questo link, avrà le stesse sei comande. Chi fa più punti vince la serata.</p><div class="ef-link"><label for="sv-link" class="vh">Link della sfida</label><input id="sv-link" type="text" readonly value="' + esc(link) + '"/><button type="button" class="fz-btn sec" id="sv-copia">Copia il link</button></div><p class="fz-fb" id="sv-cp" role="status"></p><div class="fz-azioni"><button type="button" class="fz-btn" id="sv-altro">Un altro servizio</button></div></div>';
    }
    A.addEventListener('submit', function (ev) { ev.preventDefault(); if (SV && !SV.fatto) consegna(leggi(A, SV.ordini[SV.i])); });
    A.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.v !== undefined && SV && !SV.fatto) { consegna(b.dataset.v); return; }
      if (b.id === 'sv-via') { avvia(); var i = primoCampo(A); if (i) i.focus(); return; }
      if (b.id === 'sv-avanti') { SV.i++; SV.fatto = false; SV.mostra = false; SV.tent = 0; SV.t0 = Date.now(); disegna(); var x = primoCampo(A) || A.querySelector('#sv-altro'); if (x) x.focus(); return; }
      if (b.id === 'sv-come') { $('sv-sol').innerHTML = '<div class="ef-pan">' + SV.ordini[SV.i].soluzione() + '</div>'; b.disabled = true; return; }
      if (b.id === 'sv-copia') {
        var el = $('sv-link'), msg = $('sv-cp');
        var ok = function () { msg.className = 'fz-fb si'; msg.textContent = 'Link copiato. Mandalo al tuo compagno.'; };
        var no = function () { el.focus(); el.select(); msg.className = 'fz-fb mezzo'; msg.textContent = 'Seleziona il link e copialo (tieni premuto o Ctrl+C).'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.value).then(ok, no); else no();
        return;
      }
      if (b.id === 'sv-altro') { SEME = null; history.replaceState(null, '', location.pathname); inizio(); var v = A.querySelector('#sv-via'); if (v) v.focus(); }
    });
    var m = /[#&]sfida=(\d{4,9})/.exec(location.hash || '');
    if (m) SEME = +m[1];
    inizio();
    if (SEME) { var sec = A.closest('section'); if (sec) setTimeout(function () { sec.scrollIntoView(); }, 300); }
    return { costruisci: costruisci, stato: function () { return SV; } };
  }

  return { $: $, esc: esc, rnd: rnd, pesca: pesca, mescola: mescola, gcd: gcd, M: M, F: F, mfr: mfr, intero: intero, leggiFr: leggiFr, leggiDec: leggiDec, ugualiDec: ugualiDec, scriviDec: scriviDec, Q: Q, lim: lim, allenati: allenati, missione: missione, servizio: servizio, conSeme: conSeme, lsLeggi: lsLeggi, lsScrivi: lsScrivi };
})();
