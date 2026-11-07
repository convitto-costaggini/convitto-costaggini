/* ════════════════════════════════════════════════════════
   SALA STUDIO — ripasso a intervalli e riscaldamento
   Quando una lezione finisce, il dispositivo si annota titolo, data e qualche domanda
   della lezione stessa (così il ripasso funziona anche senza rete). Niente esce dal
   dispositivo: nessun nome, nessun invio, nessun server.
   RIPASSO.registra(L, id, url)     a fine percorso
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
  function registra(L, id, url) {
    var D = domande(L); if (D.length < 3) return;
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
    o = o || {};
    var D = mescola(v.domande).slice(0, o.n || 5), i = 0, giuste = 0;
    function una() {
      if (i >= D.length) return finito();
      var q = D[i], ordine = q.vf ? [0, 1] : mescola(q.o.map(function (_, k) { return k; }));
      el.innerHTML = '<div class="st-card rp-gioco st-entra"><div class="st-cont">' + esc(o.titolo || 'Ripasso') + ' · ' + (i + 1) + ' di ' + D.length + '</div>' +
        '<p class="st-dom">' + esc(q.d) + '</p><div class="st-scelte">' + ordine.map(function (k) { return '<button type="button" class="st-scelta" data-k="' + k + '">' + esc(q.o[k]) + '</button>'; }).join('') + '</div><div class="rp-fb"></div></div>';
      el.querySelectorAll('[data-k]').forEach(function (b) {
        b.onclick = function () {
          var k = +b.getAttribute('data-k'), ok = k === q.g;
          if (ok) giuste++;
          el.querySelectorAll('[data-k]').forEach(function (x) { x.disabled = true; if (+x.getAttribute('data-k') === q.g) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
          el.querySelector('.rp-fb').innerHTML = '<p class="st-spiega ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓ Giusto! ' : 'Quasi: la risposta è «' + esc(q.o[q.g]) + '». ') + esc(q.s) + '</p>' +
            '<div class="st-azioni"><button type="button" class="st-btn pieno rp-avanti">' + (i + 1 < D.length ? 'Avanti →' : 'Fatto') + '</button></div>';
          el.querySelector('.rp-avanti').onclick = function () { i++; una(); };
        };
      });
    }
    function finito() {
      if (o.conta) fattoGiro(v.id);
      var nuova = di(v.id) || v, tutto = giuste === D.length;
      el.innerHTML = '<div class="st-card rp-gioco st-entra" style="text-align:center"><div style="font-size:2.4rem">' + (tutto ? '🏆' : giuste >= D.length / 2 ? '👍' : '💪') + '</div>' +
        '<p class="st-dom" style="margin:.3rem 0">' + giuste + ' su ' + D.length + '</p><p class="st-sot" style="margin:0">' +
        (tutto ? 'Te la ricordi benissimo.' : giuste >= D.length / 2 ? 'Bene: ancora un giro e sarà tua.' : 'È normale dimenticare: proprio per questo si ripassa.') + '</p>' +
        (o.conta ? '<p class="st-nota" style="margin-top:.6rem">' + esc(prossimo(nuova)) + '</p>' : '') +
        '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn pieno rp-chiudi">' + esc(o.chiudi || 'Continua') + '</button></div></div>';
      el.querySelector('.rp-chiudi').onclick = function () { if (o.fine) o.fine(giuste, D.length); };
    }
    una();
  }

  /* ───── nella pagina della lezione: ripasso se è il giorno, se no riscaldamento ───── */
  function invito(el, id) {
    if (!el) return;
    var mia = di(id), ora = oggi();
    var sessione = 'studio-invito-' + id;
    try { if (sessionStorage.getItem(sessione)) return; } catch (e) {}
    function chiudi() { try { sessionStorage.setItem(sessione, '1'); } catch (e) {} el.innerHTML = ''; }
    if (mia && quando(mia) <= ora) {
      el.innerHTML = '<div class="st-card rp-invito st-entra"><span class="e" aria-hidden="true">🔁</span><div style="flex:1"><b>Oggi è il giorno del ripasso di questa lezione</b><span class="st-nota">5 domande, circa 3 minuti: è così che si ricorda a lungo.</span></div>' +
        '<div class="st-azioni" style="margin:0"><button type="button" class="st-btn pieno" data-rp="si">Ripasso ora</button><button type="button" class="st-btn" data-rp="no">Dopo</button></div></div>';
    } else {
      var u = ultima(id); if (!u) return;
      el.innerHTML = '<div class="st-card rp-invito st-entra"><span class="e" aria-hidden="true">☀️</span><div style="flex:1"><b>Riscaldamento: 3 domande sull\'ultima lezione</b><span class="st-nota">«' + esc(u.titolo) + '» · un minuto per rimettere in moto la memoria.</span></div>' +
        '<div class="st-azioni" style="margin:0"><button type="button" class="st-btn pieno" data-rp="si">Comincio</button><button type="button" class="st-btn" data-rp="no">Salta</button></div></div>';
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
    if (!el) return;
    var S = scaduti();
    if (!S.length) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="st-card rp-oggi st-entra"><div class="st-cont">🔁 Oggi ripassa</div><p class="st-sot" style="margin:0 0 .6rem">Pochi minuti adesso valgono un\'ora prima della verifica.</p>' +
      S.map(function (v) {
        return '<div class="rp-riga"><span class="e" aria-hidden="true">' + esc(v.icona) + '</span><span style="flex:1"><b>' + esc(v.titolo) + '</b><small>' + esc(v.materia) + (v.materia ? ' · ' : '') + 'ripasso ' + (v.giri + 1) + ' di ' + GIORNI.length + '</small></span><button type="button" class="st-btn pieno" data-rp-id="' + esc(v.id) + '">Ripassa</button></div>';
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
