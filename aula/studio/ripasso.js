/* ════════════════════════════════════════════════════════
   SALA STUDIO — ripasso a intervalli e riscaldamento
   Quando una lezione finisce, il dispositivo si annota titolo, data e qualche domanda
   della lezione stessa (così il ripasso funziona anche senza rete). Niente esce dal
   dispositivo: nessun nome, nessun invio, nessun server.
   RIPASSO.registra(L, id, url[, domande])  a fine percorso (domande già pronte: {d, o, g, s})
   RIPASSO.scaduti()                le lezioni da ripassare oggi (1, 3 e 7 giorni dopo)
   RIPASSO.di(id) / .ultima(id)     la voce di una lezione / l'ultima finita, diversa da id
   RIPASSO.gioca(voce, el, {n, titolo, sot, conta, fine})   le domande, una alla volta
   RIPASSO.invito(el, id)           nella pagina della lezione: ripasso se è il giorno, se no riscaldamento
   RIPASSO.elenco(el)               nella home della Sala studio: «Oggi ripassa…»
   ════════════════════════════════════════════════════════ */
window.RIPASSO = (function () {
  'use strict';
  var CH = 'studio-ripassi', GIORNI = [1, 3, 7], MAX = 30, GIORNO = 864e5;
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function mescola(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var STILE = '.rp-card{background:#fff;border:1px solid var(--av3,#e5dccb);border-radius:18px;padding:1.1rem;box-shadow:0 2px 10px rgba(44,62,45,.08);margin:0 0 1rem;position:relative}.rp-entra{animation:rp-su .35s ease}@keyframes rp-su{from{opacity:0;transform:translateY(8px)}}@media (prefers-reduced-motion:reduce){.rp-entra{animation:none}}.rp-cont{font:800 .72rem var(--fu,sans-serif);letter-spacing:.1em;text-transform:uppercase;color:var(--txt2,#666);margin-bottom:.4rem}.rp-dom{font-weight:700;font-size:1.08em;color:var(--bosco,#2C3E2D);margin:.2rem 0 .8rem;line-height:1.45}.rp-scelte{display:grid;gap:.5rem}.rp-scelta{text-align:left;font:inherit;border:2px solid var(--av3,#e5dccb);background:#fff;color:var(--txt,#222);border-radius:14px;padding:.75rem 1rem;cursor:pointer;min-height:50px}.rp-scelta:hover:not(:disabled){border-color:var(--oro,#B8922A)}.rp-scelta:disabled{cursor:default}.rp-scelta.ok{border-color:#2e7d4f;background:#e3f3e8}.rp-scelta.no{border-color:#b4442f;background:#fbe9e4}.rp-spiega{margin:.8rem 0 0;padding:.6rem .8rem;border-radius:10px;line-height:1.5}.rp-spiega.ok{background:#e3f3e8;color:#1d5236}.rp-spiega.no{background:#fdf6e3;color:#6b5418}.rp-azioni{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.9rem;align-items:center}.rp-btn{display:inline-flex;align-items:center;gap:.35rem;font:800 .84rem var(--fu,sans-serif);border-radius:12px;padding:.65rem 1rem;border:2px solid var(--bosco,#2C3E2D);background:#fff;color:var(--bosco,#2C3E2D);cursor:pointer;min-height:44px}.rp-btn.pieno{background:var(--bosco,#2C3E2D);color:#fff}.rp-nota{display:block;font-size:.85em;color:var(--txt2,#666);line-height:1.5}.rp-sot{color:var(--txt2,#666);font-size:.95em;line-height:1.5}.rp-invito{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap;border-color:var(--oro,#B8922A);background:#fdf8ea}.rp-invito .e,.rp-riga .e{font-size:1.8rem;line-height:1}.rp-invito b,.rp-riga b{display:block;color:var(--bosco,#2C3E2D)}.rp-oggi{border-color:var(--oro,#B8922A)}.rp-riga{display:flex;gap:.7rem;align-items:center;padding:.55rem 0;border-top:1px dashed var(--av3,#e5dccb)}.rp-riga small{display:block;color:var(--txt2,#666);font-size:.8em}';
  function stile() { if (document.getElementById('rp-stile')) return; var e = document.createElement('style'); e.id = 'rp-stile'; e.textContent = STILE; document.head.appendChild(e); }
  function tutte() { try { return JSON.parse(localStorage.getItem(CH) || '[]') || []; } catch (e) { return []; } }
  function salva(a) { try { localStorage.setItem(CH, JSON.stringify(a.slice(0, MAX))); } catch (e) {} }
  function oggi() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function giorno(iso) { var d = new Date(iso); d.setHours(0, 0, 0, 0); return d.getTime(); }

  /* dalla lezione, le domande che servono al ripasso: scelta multipla e vero/falso */
  function domande(L) {
    var q = arr(L.quiz).filter(function (x) { return x && x.domanda && arr(x.opzioni).length >= 2; }).map(function (x) {
      return { d: x.domanda, o: x.opzioni.slice(0, 4), g: Math.min(+x.corretta || 0, x.opzioni.length - 1), s: x.spiegazione || '' };
    });
    var v = arr(L.vero_falso).filter(function (x) { return x && x.affermazione; }).map(function (x) {
      return { d: x.affermazione, o: ['Vero', 'Falso'], g: x.vero ? 0 : 1, s: x.spiegazione || '', vf: 1 };
    });
    return mescola(q).slice(0, 8).concat(mescola(v).slice(0, 4));
  }
  function registra(L, id, url, pronte) {
    var D = Array.isArray(pronte) ? pronte : domande(L); if (D.length < 3) return;
    var a = tutte(), v = a.filter(function (x) { return x.id === id; })[0];
    if (v) { v.domande = D; v.titolo = L.titolo; return salva(a); }   /* rifatta: il calendario del ripasso non riparte */
    a.unshift({ id: id, titolo: L.titolo, icona: L.icona || '📚', materia: L.materia || '', url: url, finita: new Date().toISOString(), giri: 0, domande: D });
    salva(a);
  }
  function quando(v) { return v.giri >= GIORNI.length ? Infinity : giorno(v.finita) + GIORNI[v.giri] * GIORNO; }
  function scaduti() { var t = oggi(); return tutte().filter(function (v) { return quando(v) <= t; }); }
  function di(id) { return tutte().filter(function (v) { return v.id === id; })[0] || null; }
  function ultima(id) { return tutte().filter(function (v) { return v.id !== id; })[0] || null; }
  function fattoGiro(id) {
    var a = tutte(), v = a.filter(function (x) { return x.id === id; })[0]; if (!v) return;
    v.giri = Math.min(GIORNI.length, v.giri + 1); salva(a);
  }
  function prossimo(v) {
    if (v.giri >= GIORNI.length) return 'Ripasso completato: questa lezione ora è tua. 🏅';
    var g = Math.round((quando(v) - oggi()) / GIORNO);
    return 'Prossimo ripasso ' + (g <= 1 ? 'domani' : 'tra ' + g + ' giorni') + '.';
  }

  /* ───── le domande, una alla volta ───── */
  function gioca(v, el, o) {
    stile();
    o = o || {};
    var D = mescola(v.domande).slice(0, o.n || 5), i = 0, giuste = 0;
    function una() {
      if (i >= D.length) return finito();
      var q = D[i], ordine = q.vf ? [0, 1] : mescola(q.o.map(function (_, k) { return k; }));
      el.innerHTML = '<div class="rp-card rp-gioco rp-entra"><div class="rp-cont">' + esc(o.titolo || 'Ripasso') + ' · ' + (i + 1) + ' di ' + D.length + '</div>' +
        '<p class="rp-dom">' + esc(q.d) + '</p><div class="rp-scelte">' + ordine.map(function (k) { return '<button type="button" class="rp-scelta" data-k="' + k + '">' + esc(q.o[k]) + '</button>'; }).join('') + '</div><div class="rp-fb"></div></div>';
      el.querySelectorAll('[data-k]').forEach(function (b) {
        b.onclick = function () {
          var k = +b.getAttribute('data-k'), ok = k === q.g;
          if (ok) giuste++;
          el.querySelectorAll('[data-k]').forEach(function (x) { x.disabled = true; if (+x.getAttribute('data-k') === q.g) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
          el.querySelector('.rp-fb').innerHTML = '<p class="rp-spiega ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓ Giusto! ' : 'Quasi: la risposta è «' + esc(q.o[q.g]) + '». ') + esc(q.s) + '</p>' +
            '<div class="rp-azioni"><button type="button" class="rp-btn pieno rp-avanti">' + (i + 1 < D.length ? 'Avanti →' : 'Fatto') + '</button></div>';
          el.querySelector('.rp-avanti').onclick = function () { i++; una(); };
        };
      });
    }
    function finito() {
      if (o.conta) fattoGiro(v.id);
      var nuova = di(v.id) || v, tutto = giuste === D.length;
      el.innerHTML = '<div class="rp-card rp-gioco rp-entra" style="text-align:center"><div style="font-size:2.4rem">' + (tutto ? '🏆' : giuste >= D.length / 2 ? '👍' : '💪') + '</div>' +
        '<p class="rp-dom" style="margin:.3rem 0">' + giuste + ' su ' + D.length + '</p><p class="rp-sot" style="margin:0">' +
        (tutto ? 'Te la ricordi benissimo.' : giuste >= D.length / 2 ? 'Bene: ancora un giro e sarà tua.' : 'È normale dimenticare: proprio per questo si ripassa.') + '</p>' +
        (o.conta ? '<p class="rp-nota" style="margin-top:.6rem">' + esc(prossimo(nuova)) + '</p>' : '') +
        '<div class="rp-azioni" style="justify-content:center"><button type="button" class="rp-btn pieno rp-chiudi">' + esc(o.chiudi || 'Continua') + '</button></div></div>';
      el.querySelector('.rp-chiudi').onclick = function () { if (o.fine) o.fine(giuste, D.length); };
    }
    una();
  }

  /* ───── nella pagina della lezione: ripasso se è il giorno, se no riscaldamento ───── */
  function invito(el, id) {
    stile();
    if (!el) return;
    var mia = di(id), ora = oggi();
    var sessione = 'studio-invito-' + id;
    try { if (sessionStorage.getItem(sessione)) return; } catch (e) {}
    function chiudi() { try { sessionStorage.setItem(sessione, '1'); } catch (e) {} el.innerHTML = ''; }
    if (mia && quando(mia) <= ora) {
      el.innerHTML = '<div class="rp-card rp-invito rp-entra"><span class="e" aria-hidden="true">🔁</span><div style="flex:1"><b>Oggi è il giorno del ripasso di questa lezione</b><span class="rp-nota">5 domande, circa 3 minuti: è così che si ricorda a lungo.</span></div>' +
        '<div class="rp-azioni" style="margin:0"><button type="button" class="rp-btn pieno" data-rp="si">Ripasso ora</button><button type="button" class="rp-btn" data-rp="no">Dopo</button></div></div>';
    } else {
      var u = ultima(id); if (!u) return;
      el.innerHTML = '<div class="rp-card rp-invito rp-entra"><span class="e" aria-hidden="true">☀️</span><div style="flex:1"><b>Riscaldamento: 3 domande sull\'ultima lezione</b><span class="rp-nota">«' + esc(u.titolo) + '» · un minuto per rimettere in moto la memoria.</span></div>' +
        '<div class="rp-azioni" style="margin:0"><button type="button" class="rp-btn pieno" data-rp="si">Comincio</button><button type="button" class="rp-btn" data-rp="no">Salta</button></div></div>';
      mia = u;
    }
    var giro = mia.id === id;
    el.querySelector('[data-rp="no"]').onclick = chiudi;
    el.querySelector('[data-rp="si"]').onclick = function () {
      gioca(mia, el, { n: giro ? 5 : 3, conta: giro, titolo: giro ? 'Ripasso' : 'Riscaldamento', chiudi: giro ? 'Torna alla lezione' : 'Ora la lezione nuova →', fine: chiudi });
    };
  }

  /* ───── nella home della Sala studio ───── */
  function elenco(el) {
    stile();
    if (!el) return;
    var S = scaduti();
    if (!S.length) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="rp-card rp-oggi rp-entra"><div class="rp-cont">🔁 Oggi ripassa</div><p class="rp-sot" style="margin:0 0 .6rem">Pochi minuti adesso valgono un\'ora prima della verifica.</p>' +
      S.map(function (v) {
        return '<div class="rp-riga"><span class="e" aria-hidden="true">' + esc(v.icona) + '</span><span style="flex:1"><b>' + esc(v.titolo) + '</b><small>' + esc(v.materia) + (v.materia ? ' · ' : '') + 'ripasso ' + (v.giri + 1) + ' di ' + GIORNI.length + '</small></span><button type="button" class="rp-btn pieno" data-rp-id="' + esc(v.id) + '">Ripassa</button></div>';
      }).join('') + '</div>';
    el.querySelectorAll('[data-rp-id]').forEach(function (b) {
      b.onclick = function () {
        var v = di(b.getAttribute('data-rp-id')); if (!v) return;
        gioca(v, el, { n: 5, conta: true, titolo: v.titolo, chiudi: 'Fatto', fine: function () { elenco(el); } });
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    });
  }

  return { registra: registra, scaduti: scaduti, di: di, ultima: ultima, gioca: gioca, invito: invito, elenco: elenco, GIORNI: GIORNI };
})();
