/* Guida «Una lezione in 3 mosse» per la pagina Crea una lezione (aula/studio/docente.html).
   1) Una dimostrazione animata, in tre scene, di ciò che si fa: copiare le istruzioni, usare l'assistente IA, incollare e pubblicare.
      Parte una volta sola (un solo giro), ha sempre «Metti in pausa», e con «riduci movimento» non parte da sola.
   2) Un indicatore «Dove sei» che segue davvero quello che l'insegnante sta facendo nella pagina e propone un solo pulsante: il passo successivo.
   Non cambia la logica della pagina: legge soltanto lo stato dei suoi elementi. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var host = $('regole-privacy') || $('dc-modulo');
  if (!host || !host.parentNode || $('gcr')) return;

  var ridotto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TITOLO = 'La Rivoluzione francese';

  /* ───── le tre scene (finte finestre, solo da guardare) ───── */
  var SCENE = [
    {
      nome: 'Copia le istruzioni',
      testo: 'Scrivi l\'argomento (se non hai foto) e tocca «Copia le istruzioni». Basta questo.',
      html:
        '<div class="gcr-win"><div class="gcr-h">1 · Le istruzioni per l\'IA</div>' +
        '<div class="gcr-l">Argomento</div><div class="gcr-in"><span data-s="argt"></span></div>' +
        '<div class="gcr-l">Materia, anno, classe: facoltativi</div><div class="gcr-in gcr-vuoto">Puoi lasciarli vuoti</div>' +
        '<div class="gcr-az"><span class="gcr-btn oro" data-s="copia">📋 Copia le istruzioni</span></div>' +
        '<div class="gcr-toast gcr-el" data-s="t1">✓ Istruzioni copiate</div></div>',
      finale: function (r) { r.argt.textContent = TITOLO; on(r.t1); },
      azzera: function (r) { r.argt.textContent = ''; off(r.t1); },
      corsa: function (r, c, p) {
        return [
          [500, function () { c.vai(r.argt.parentNode); }],
          [900, function () { scrivi(r.argt, TITOLO, 38); }],
          [1500, function () { c.vai(r.copia); }],
          [900, function () { c.tocca(r.copia); on(r.t1); }]
        ];
      }
    },
    {
      nome: 'Nell\'assistente IA',
      testo: 'Apri Claude, ChatGPT o Gemini: allega le foto (se le hai), incolla le istruzioni e invia. Quando ha finito, tocca «Copia» sotto la risposta.',
      html:
        '<div class="gcr-win"><div class="gcr-h">2 · Assistente IA (Claude, ChatGPT, Gemini)</div>' +
        '<div class="gcr-chat"><div class="gcr-bol gcr-el" data-s="risp"><code>{ "titolo": "' + TITOLO + '", "tappe": [ … ] }</code><span class="gcr-mini" data-s="cp">📋 Copia</span></div></div>' +
        '<div class="gcr-foto gcr-el" data-s="foto"><span>🖼️ foto 1</span><span>🖼️ foto 2</span></div>' +
        '<div class="gcr-comp"><span class="gcr-clip" data-s="clip">📎</span><span class="gcr-ti" data-s="ti">Scrivi un messaggio…</span><span class="gcr-send" data-s="send">➤</span></div>' +
        '<div class="gcr-toast gcr-el" data-s="t2">✓ Risposta copiata</div></div>',
      finale: function (r) { on(r.foto); on(r.risp); on(r.t2); r.ti.textContent = 'Istruzioni incollate ✓'; r.ti.classList.add('gcr-pieno'); },
      azzera: function (r) { off(r.foto); off(r.risp); off(r.t2); r.ti.textContent = 'Scrivi un messaggio…'; r.ti.classList.remove('gcr-pieno'); },
      corsa: function (r, c) {
        return [
          [500, function () { c.vai(r.clip); }],
          [900, function () { c.tocca(r.clip); on(r.foto); }],
          [900, function () { c.vai(r.ti); }],
          [900, function () { c.tocca(r.ti); r.ti.textContent = 'Istruzioni incollate ✓'; r.ti.classList.add('gcr-pieno'); }],
          [900, function () { c.vai(r.send); }],
          [900, function () { c.tocca(r.send); }],
          [800, function () { on(r.risp); }],
          [700, function () { c.vai(r.cp); }],
          [900, function () { c.tocca(r.cp); on(r.t2); }]
        ];
      }
    },
    {
      nome: 'Incolla e pubblica',
      testo: 'Torna qui: tocca «Incolla», poi «Pubblica la lezione». Compaiono il QR e il link per i ragazzi.',
      html:
        '<div class="gcr-win"><div class="gcr-h">3 · Incolla e pubblica</div>' +
        '<div class="gcr-l">La risposta dell\'IA</div><div class="gcr-ta"><code data-s="tac"></code></div>' +
        '<div class="gcr-riga"><span class="gcr-btn" data-s="inc">📋 Incolla</span><span class="gcr-ok gcr-el" data-s="ok">✅ Lezione letta: «' + TITOLO + '»</span></div>' +
        '<div class="gcr-az"><span class="gcr-btn oro" data-s="pub">✨ Pubblica la lezione</span></div>' +
        '<div class="gcr-fin gcr-el" data-s="fin"><div class="gcr-qr" data-s="qr"></div><div><b>Fatto!</b><br>Ecco il QR per i ragazzi</div></div></div>',
      finale: function (r) { r.tac.textContent = '{ "titolo": "' + TITOLO + '", … }'; on(r.ok); on(r.fin); },
      azzera: function (r) { r.tac.textContent = ''; off(r.ok); off(r.fin); },
      corsa: function (r, c) {
        return [
          [500, function () { c.vai(r.inc); }],
          [900, function () { c.tocca(r.inc); r.tac.textContent = '{ "titolo": "' + TITOLO + '", … }'; on(r.ok); }],
          [1400, function () { c.vai(r.pub); }],
          [900, function () { c.tocca(r.pub); on(r.fin); }]
        ];
      }
    }
  ];

  function on(e) { if (e) e.classList.add('on'); }
  function off(e) { if (e) e.classList.remove('on'); }

  /* ───── struttura ───── */
  var sec = document.createElement('section');
  sec.className = 'st-card gcr'; sec.id = 'gcr'; sec.setAttribute('aria-labelledby', 'gcr-t');
  sec.innerHTML =
    '<p class="fm-etic">Prima volta? Guarda come si fa</p>' +
    '<h2 id="gcr-t">Una lezione in 3 mosse</h2>' +
    '<p class="st-sot">Copiare, incollare, pubblicare: tre gesti, circa tre minuti. Non serve alcuna competenza informatica.</p>' +
    '<div class="gcr-stage" aria-hidden="true"><div class="gcr-scene" id="gcr-scena"></div>' +
      '<svg class="gcr-cur" id="gcr-cur" viewBox="0 0 24 24" width="34" height="34" focusable="false"><path d="M5 3l14 8-6 1.8L10.5 19z" fill="#2C3E2D" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
      '<span class="gcr-onda" id="gcr-onda"></span></div>' +
    '<p class="gcr-cap" id="gcr-cap"></p>' +
    '<div class="gcr-ctl" role="group" aria-label="Comandi della dimostrazione">' +
      '<button type="button" class="st-btn" id="gcr-pl"></button>' +
      '<span class="gcr-sc" id="gcr-sc"></span>' +
    '</div>' +
    '<h3 class="gcr-dh">Dove sei adesso</h3>' +
    '<ol class="gcr-dove" id="gcr-dove"></ol>' +
    '<div class="st-azioni"><button type="button" class="st-btn oro" id="gcr-vai"></button></div>';
  host.parentNode.insertBefore(sec, host);

  var scena = $('gcr-scena'), cur = $('gcr-cur'), onda = $('gcr-onda'), cap = $('gcr-cap'), pl = $('gcr-pl'), sc = $('gcr-sc');
  var stage = scena.parentNode;
  var refs = [], pannelli = [];

  SCENE.forEach(function (s, i) {
    var d = document.createElement('div'); d.className = 'gcr-pan'; d.innerHTML = s.html; d.hidden = true;
    scena.appendChild(d); pannelli.push(d);
    var r = {}; [].forEach.call(d.querySelectorAll('[data-s]'), function (e) { r[e.getAttribute('data-s')] = e; });
    refs.push(r);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'gcr-pill';
    b.setAttribute('aria-label', 'Mostra la mossa ' + (i + 1) + ': ' + s.nome);
    b.innerHTML = '<b>' + (i + 1) + '</b><span>' + s.nome + '</span>';
    b.onclick = function () { mostra(i, true); };
    sc.appendChild(b);
  });
  /* il finto QR: un reticolo fisso, solo decorativo */
  (function () {
    var m = '111111101011111110000010100100000101110101111101011101110100100100101110111010111101011100000110010100000111111101010101111111';
    var q = refs[2].qr, h = ''; for (var k = 0; k < 49; k++) h += '<i' + (m.charAt(k * 2 % m.length) === '1' ? ' class="p"' : '') + '></i>';
    q.innerHTML = h;
  })();

  /* ───── motore: un solo cursore, una sequenza di passi, tutto annullabile ───── */
  var timers = [], cor = -1, auto = false;
  function ferma() { timers.forEach(clearTimeout); timers = []; }
  function pianifica(lista, fine) {
    var t = 0;
    lista.forEach(function (p) { t += p[0]; timers.push(setTimeout(p[1], t)); });
    timers.push(setTimeout(fine, t + 1400));
  }
  function scrivi(el, testo, ms) {
    var n = 0;
    (function passo() { n++; el.textContent = testo.slice(0, n); if (n < testo.length) timers.push(setTimeout(passo, ms)); })();
  }
  function centro(el) {
    var a = stage.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
  }
  var C = {
    vai: function (el) { var p = centro(el); cur.style.opacity = '1'; cur.style.transform = 'translate(' + Math.round(p.x - 8) + 'px,' + Math.round(p.y - 6) + 'px)'; },
    tocca: function (el) {
      var p = centro(el);
      onda.style.left = p.x + 'px'; onda.style.top = p.y + 'px';
      onda.classList.remove('vai'); void onda.offsetWidth; onda.classList.add('vai');
      el.classList.add('prem'); timers.push(setTimeout(function () { el.classList.remove('prem'); }, 260));
    }
  };

  function mostra(i, riproduci) {
    ferma(); cor = i;
    pannelli.forEach(function (d, k) { d.hidden = k !== i; });
    [].forEach.call(sc.children, function (b, k) { b.setAttribute('aria-current', k === i ? 'step' : 'false'); });
    cap.textContent = (i + 1) + '. ' + SCENE[i].testo;
    SCENE[i].azzera(refs[i]);
    cur.style.opacity = '0'; cur.style.transform = 'translate(86%,92%)';
    if (riproduci && !(ridotto && false)) {
      /* un solo passaggio: poi, se è la visione automatica, si passa alla scena dopo */
      stato('gioca');
      pianifica(SCENE[i].corsa(refs[i], C), function () {
        cur.style.opacity = '0';
        if (auto && i < SCENE.length - 1) mostra(i + 1, true); else { auto = false; stato('fine'); }
      });
    } else {
      SCENE[i].finale(refs[i]); stato('fine');
    }
  }
  function stato(s) {
    sec.setAttribute('data-gioco', s);
    pl.textContent = s === 'gioca' ? 'Metti in pausa' : 'Guarda la dimostrazione';
    pl.setAttribute('aria-label', s === 'gioca' ? 'Metti in pausa la dimostrazione' : 'Guarda la dimostrazione dall\'inizio');
  }
  pl.onclick = function () {
    if (sec.getAttribute('data-gioco') === 'gioca') {
      ferma(); auto = false; cur.style.opacity = '0'; SCENE[cor].finale(refs[cor]); stato('fine');
    } else { auto = true; mostra(0, true); }
  };

  /* ───── «Dove sei adesso»: legge lo stato reale della pagina ───── */
  var PASSI = [
    { t: 'Copia le istruzioni', vai: '👉 Comincia: scrivi l\'argomento' },
    { t: 'Usa l\'assistente IA', vai: '👉 Ora apri l\'assistente IA' },
    { t: 'Incolla la risposta e pubblica', vai: '👉 Incolla qui la risposta' }
  ];
  var ol = $('gcr-dove'), vai = $('gcr-vai');
  PASSI.forEach(function (p, i) {
    var li = document.createElement('li'); li.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="tx">' + p.t + '</span><small></small>'; ol.appendChild(li);
  });
  function scheda(el) { return el ? el.closest('.st-card') : null; }
  var SCH = [scheda($('dc-arg')), scheda(document.querySelector('.dc-guida')), scheda($('dc-json'))];
  var copiato = false;
  try { copiato = sessionStorage.getItem('gcr-copiato') === '1'; } catch (e) {}
  var corrente = 0;
  function calcola() {
    var esito = $('dc-esito'), letto = $('dc-letto');
    if (esito && !esito.hidden) return 4;
    if (letto && /^✅/.test(letto.textContent)) return 3;
    return copiato ? 2 : 1;
  }
  function aggiorna() {
    corrente = calcola();
    if (corrente === 4) { copiato = false; try { sessionStorage.removeItem('gcr-copiato'); } catch (e) {} }
    [].forEach.call(ol.children, function (li, i) {
      var n = i + 1, s = n < corrente ? 'fatto' : n === corrente ? 'qui' : 'poi';
      li.className = 'gcr-' + s;
      li.querySelector('small').textContent = s === 'fatto' ? 'Fatto ✓' : s === 'qui' ? 'Sei qui' : 'Poi';
      if (s === 'qui') li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    SCH.forEach(function (c, i) { if (c) c.classList.toggle('gcr-qui', i + 1 === corrente); });
    vai.textContent = corrente === 4 ? '🎉 Fatto! Vai al QR della lezione' : PASSI[corrente - 1].vai;
  }
  vai.onclick = function () {
    var dove = corrente === 4 ? $('dc-esito') : SCH[corrente - 1], campo = corrente === 1 ? $('dc-arg') : corrente === 3 ? $('dc-json') : null;
    if (dove) dove.scrollIntoView({ behavior: ridotto ? 'auto' : 'smooth', block: 'start' });
    if (campo) setTimeout(function () { try { campo.focus({ preventScroll: true }); } catch (e) { campo.focus(); } }, ridotto ? 0 : 350);
  };
  var bC = $('dc-copia-prompt');
  if (bC) bC.addEventListener('click', function () { copiato = true; try { sessionStorage.setItem('gcr-copiato', '1'); } catch (e) {} aggiorna(); });
  var mo = window.MutationObserver ? new MutationObserver(aggiorna) : null;
  if (mo) {
    if ($('dc-letto')) mo.observe($('dc-letto'), { childList: true, characterData: true, subtree: true });
    if ($('dc-esito')) mo.observe($('dc-esito'), { attributes: true, attributeFilter: ['hidden'] });
  }
  aggiorna();

  /* ───── avvio: un solo giro, solo se il movimento è consentito; altrimenti la prima scena resta ferma, completa ───── */
  auto = !ridotto;
  mostra(0, !ridotto);
  window.addEventListener('resize', function () { if (sec.getAttribute('data-gioco') !== 'gioca') { cur.style.opacity = '0'; } });
})();
