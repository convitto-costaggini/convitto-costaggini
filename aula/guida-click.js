/* GuidaClick: animazione che mostra, nel riquadro del sito a destra, dove toccare.
   Funziona da sola sulle pagine di formazione e di visita: legge i pulsanti indicati nel passo
   a sinistra (i testi evidenziati: <b class="bt">«Entra →»</b> oppure <span class="btn">Entra →</span>),
   li cerca nella pagina a destra e disegna sopra un cerchio pulsante con un cursore che si muove e tocca.
   Non modifica la pagina a destra: l'animazione è uno strato trasparente sopra il riquadro.
   Prima azione non ancora spuntata del passo corrente; si sposta alla successiva dopo il tocco.
   Il testo evidenziato a sinistra si può anche toccare per rivedere il punto.
   Uso: GuidaClick.avvia({ vista: elemento del riquadro, sito: iframe, elenco: elenco dei passi }); */
(function () {
  if (window.GuidaClick) return;

  var CSS =
    '.gc{position:absolute;z-index:15;overflow:hidden;pointer-events:none}' +
    '.gc-r{position:absolute;display:none;border:3px solid #D4AA4A;border-radius:12px;box-shadow:0 0 0 4px rgba(212,170,74,.35),0 0 18px rgba(212,170,74,.55);animation:gc-polso 1.4s ease-in-out infinite}' +
    '.gc-p{position:absolute;display:none;width:0;height:0}' +
    '.gc-o{position:absolute;left:-26px;top:-26px;width:52px;height:52px;border-radius:50%;border:3px solid #D4AA4A;background:rgba(212,170,74,.25);opacity:0;animation:gc-onda 2.8s ease-out infinite}' +
    '.gc-c{position:absolute;left:-6px;top:-4px;width:30px;height:30px;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35));animation:gc-muovi 2.8s ease-in-out infinite}' +
    '.gc-t{position:absolute;display:none;transform:translateX(-50%);background:#2C3E2D;color:#fff;font:700 14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;padding:7px 12px;border-radius:99px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.28)}' +
    '.gc-m{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:none;max-width:88%;background:#fff;color:#2C3E2D;border:1px solid #e4dccb;border-left:4px solid #B8922A;border-radius:10px;padding:10px 14px;font:600 14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 22px rgba(44,62,45,.22)}' +
    '.gc.on .gc-r,.gc.on .gc-p,.gc.on .gc-t{display:block}' +
    '.gc.msg .gc-m{display:block}' +
    '@keyframes gc-polso{0%,100%{box-shadow:0 0 0 3px rgba(212,170,74,.30),0 0 12px rgba(212,170,74,.40)}50%{box-shadow:0 0 0 9px rgba(212,170,74,.18),0 0 24px rgba(212,170,74,.65)}}' +
    '@keyframes gc-muovi{0%{transform:translate(150px,120px);opacity:0}14%{opacity:1}46%{transform:translate(0,0) scale(1)}54%{transform:translate(0,0) scale(.82)}62%{transform:translate(0,0) scale(1)}86%{transform:translate(0,0);opacity:1}100%{transform:translate(0,0);opacity:0}}' +
    '@keyframes gc-onda{0%,50%{transform:scale(.2);opacity:0}54%{transform:scale(.4);opacity:.9}82%{transform:scale(1.25);opacity:0}100%{opacity:0}}' +
    '.viste button.gc-evid{box-shadow:0 0 0 3px #D4AA4A,0 0 14px rgba(212,170,74,.7);animation:gc-polso 1.4s ease-in-out infinite}' +
    '.corpo .bt,.corpo li .btn{cursor:pointer;text-decoration:underline dotted;text-underline-offset:3px}' +
    '.strumenti #guidaClick[aria-pressed="true"]{background:#2C3E2D;color:#fff;border-color:#2C3E2D}' +
    '@media (prefers-reduced-motion:reduce){.gc-r{animation:none}.gc-c,.gc-o{display:none}}';

  var SEL = 'a,button,[role="button"],input,select,textarea,summary,label,[tabindex]:not([tabindex="-1"]),h1,h2,h3,.au-card,.au-vai,.fm-modi-t,.st-btn';
  var CLICCABILE = 'a,button,[role="button"],summary,input,select,textarea';
  var CHIAVE = 'aula-guida-click';

  function norm(s) { return String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim(); }
  function crea(tag, cl, html) { var e = document.createElement(tag); if (cl) e.className = cl; if (html) e.innerHTML = html; return e; }

  function avvia(o) {
    var vista = o.vista, sito = o.sito, elenco = o.elenco;
    if (!vista || !sito || !elenco) return null;
    var barra = o.strumenti || vista.querySelector('.strumenti');
    var attiva = true;
    try { attiva = localStorage.getItem(CHIAVE) !== '0'; } catch (e) {}

    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

    /* strato di disegno sopra il riquadro del sito */
    var ov = crea('div', 'gc',
      '<div class="gc-r"></div><div class="gc-p"><div class="gc-o"></div><div class="gc-c"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M5 3l14 8-6.2 1.6L16 20l-3 1.2-3.2-7.6L5 17z" fill="#fff" stroke="#2C3E2D" stroke-width="1.6" stroke-linejoin="round"/></svg></div></div><div class="gc-t"></div><div class="gc-m" role="status"></div>');
    ov.setAttribute('aria-hidden', 'true');
    vista.appendChild(ov);
    var ring = ov.querySelector('.gc-r'), punto = ov.querySelector('.gc-p'), tip = ov.querySelector('.gc-t'), msg = ov.querySelector('.gc-m');

    /* pulsante nella barra degli strumenti */
    var btn = crea('button'); btn.type = 'button'; btn.id = 'guidaClick'; btn.textContent = '👆 Dove toccare';
    btn.title = 'Mostra a destra il punto in cui toccare';
    function aggiornaBottone() { btn.setAttribute('aria-pressed', attiva ? 'true' : 'false'); }
    aggiornaBottone();
    if (barra) { var ric = barra.querySelector('#ricarica'); if (ric) barra.insertBefore(btn, ric); else barra.appendChild(btn); }

    var bersaglio = null, raf = 0, poll = null, fatti = {}, suggerito = {}, liCorrente = null, firma = '', tMsg = null, scorsoPer = null;

    function doc() {
      try { var d = sito.contentDocument; if (!d || !d.body || d.location.href === 'about:blank') return null; return d; } catch (e) { return null; }
    }

    /* ───── trovare il punto nella pagina a destra ───── */
    function trova(d, etichetta) {
      var L = norm(etichetta), grezza = String(etichetta || '').trim();
      var icona = L.length < 2; /* pulsante con la sola icona, per esempio 🔊: si cerca il simbolo esatto */
      if (icona && !grezza) return null;
      var w = d.defaultView, els = d.querySelectorAll(SEL), best = null, bs = 0, ba = 1e12;
      for (var i = 0; i < els.length; i++) {
        var e = els[i], r = e.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        var cs = w.getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
        var cand = [e.innerText, e.value, e.getAttribute('aria-label'), e.getAttribute('placeholder'), e.getAttribute('title')], sc = 0;
        for (var k = 0; k < cand.length; k++) {
          if (icona) { if (cand[k] && String(cand[k]).trim() === grezza) sc = 3; continue; }
          var t = norm(cand[k]); if (!t) continue;
          var s = 0;
          if (t === L) s = 3;
          else if (t.indexOf(L) === 0 || (t.length >= 3 && L.indexOf(t) === 0)) s = 2;
          else if (L.length >= 4 && t.indexOf(L) > -1) s = 1;
          if (s && t.length > L.length * 4 + 30) s = 0; /* un contenitore enorme non è il pulsante */
          if (s > sc) sc = s;
        }
        if (!sc) continue;
        var area = r.width * r.height;
        if (sc > bs || (sc === bs && area < ba)) { best = e; bs = sc; ba = area; }
      }
      if (!best) return null;
      if (best.tagName === 'LABEL' && best.control) { var c = best.control, rc = c.getBoundingClientRect(); if (rc.width > 4 && rc.height > 4) return c; }
      return best.closest(CLICCABILE) || best;
    }

    /* ───── il passo corrente a sinistra ───── */
    function lisPasso() { var c = elenco.querySelector('li.attiva .corpo'); return c ? Array.prototype.slice.call(c.querySelectorAll('ul > li')) : []; }
    function chiave(li) { var cb = li.querySelector('input[type=checkbox]'); return (cb && cb.getAttribute('data-k')) || norm(li.textContent).slice(0, 60); }
    function daFare(li) { var cb = li.querySelector('input[type=checkbox]'); return !(cb && cb.checked) && !fatti[chiave(li)]; }
    function etichetteDi(li) {
      return Array.prototype.map.call(li.querySelectorAll('.bt,.btn'), function (x) { return x.textContent; }).filter(function (t) { return norm(t).length >= 2 || t.trim().length; });
    }
    function firmaPasso() {
      var a = elenco.querySelector('li.attiva');
      if (!a) return '';
      return a.id + '|' + Array.prototype.map.call(a.querySelectorAll('input[type=checkbox]'), function (c) { return c.checked ? 1 : 0; }).join('');
    }

    /* ───── disegno ───── */
    function nascondi() {
      bersaglio = null; scorsoPer = null;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      ov.classList.remove('on');
    }
    function posiziona() {
      var d = doc(), el = bersaglio;
      if (!d || !el || !el.isConnected) return false;
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return false;
      var iw = d.defaultView, ih = iw.innerHeight, W = sito.offsetWidth, H = sito.offsetHeight;
      ov.style.left = sito.offsetLeft + 'px'; ov.style.top = sito.offsetTop + 'px'; ov.style.width = W + 'px'; ov.style.height = H + 'px';
      var fuori = r.bottom < 0 || r.top > ih || r.right < 0 || r.left > iw.innerWidth;
      ov.classList.toggle('on', !fuori);
      var pad = 6, x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
      ring.style.left = x + 'px'; ring.style.top = y + 'px'; ring.style.width = w + 'px'; ring.style.height = h + 'px';
      punto.style.left = Math.round(r.left + r.width / 2) + 'px';
      punto.style.top = Math.round(r.top + Math.min(r.height / 2, 36)) + 'px';
      var cx = Math.max(80, Math.min(W - 80, r.left + r.width / 2));
      var sopra = y - 40;
      tip.style.left = cx + 'px';
      tip.style.top = (sopra > 4 ? sopra : y + h + 8) + 'px';
      return true;
    }
    function ciclo() {
      raf = 0;
      if (!bersaglio) return;
      if (!posiziona()) { nascondi(); avviaRicerca(); return; }
      raf = requestAnimationFrame(ciclo);
    }
    function mostra(el, etichetta, li) {
      bersaglio = el; scorsoPer = li ? chiave(li) + '|' + norm(etichetta) : null;
      var clic = !!el.closest(CLICCABILE);
      tip.textContent = (clic ? 'Tocca qui' : 'Guarda qui');
      /* se il punto è fuori dalla parte visibile, lo si porta al centro */
      try {
        var r = el.getBoundingClientRect(), ih = el.ownerDocument.defaultView.innerHeight;
        if (r.top < 70 || r.bottom > ih - 30) el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      } catch (e) {}
      if (!raf) raf = requestAnimationFrame(ciclo);
    }
    function avviso(t) {
      msg.textContent = t; ov.classList.add('msg');
      /* lo strato esiste anche senza bersaglio: gli serve la misura del riquadro */
      ov.style.left = sito.offsetLeft + 'px'; ov.style.top = sito.offsetTop + 'px'; ov.style.width = sito.offsetWidth + 'px'; ov.style.height = sito.offsetHeight + 'px';
      clearTimeout(tMsg); tMsg = setTimeout(function () { ov.classList.remove('msg'); }, 4500);
    }

    /* ───── ricerca ───── */
    function cerca() {
      var d = doc(); if (!d || !attiva) return false;
      var lis = lisPasso();
      liCorrente = null;
      for (var i = 0; i < lis.length; i++) {
        if (!daFare(lis[i])) continue;
        var et = etichetteDi(lis[i]);
        if (!et.length) continue; /* le azioni senza pulsanti (per esempio «Leggere il testo») non bloccano la guida */
        /* questa è l'azione corrente: si guida solo lei, mai una successiva, altrimenti i passi non corrispondono a ciò che si vede */
        var k = chiave(lis[i]), toccatoQualcosa = false, forte = null, debole = null;
        for (var j = 0; j < et.length; j++) {
          if (fatti[k + '|' + norm(et[j])]) { toccatoQualcosa = true; continue; }
          var el = trova(d, et[j]); if (!el) continue;
          /* si preferisce ciò che si può toccare; un titolo o un testo vale solo se non c'è altro */
          if (el.closest(CLICCABILE)) { if (!forte) forte = { el: el, et: et[j] }; }
          else if (!debole) debole = { el: el, et: et[j] };
        }
        if (forte) { mostra(forte.el, forte.et, lis[i]); return true; }
        if (debole && !toccatoQualcosa) { mostra(debole.el, debole.et, lis[i]); return true; }
        /* se si è già toccato qualcosa e non resta altro da toccare, l'azione è finita: si passa alla successiva */
        if (toccatoQualcosa) { fatti[k] = 1; continue; }
        liCorrente = lis[i];
        return false;
      }
      return false;
    }
    /* se l'azione corrente non si fa in questa pagina, lo si dice e si evidenziano i pulsanti delle pagine del passo */
    function suggerisci() {
      if (!attiva || bersaglio || !liCorrente) return;
      var k = chiave(liCorrente); if (suggerito[k]) return; suggerito[k] = 1;
      var viste = elenco.querySelectorAll('li.attiva .viste button');
      if (viste.length) {
        avviso('Questa azione si fa in un\'altra pagina: usa i pulsanti sotto il titolo del passo (in evidenza a sinistra).');
        for (var i = 0; i < viste.length; i++) viste[i].classList.add('gc-evid');
        setTimeout(function () { for (var j = 0; j < viste.length; j++) viste[j].classList.remove('gc-evid'); }, 6000);
      } else {
        avviso('Non vedo ancora questo punto nella pagina. Se l\'hai già fatto, spunta la casella e si passa alla prossima azione.');
      }
    }
    function avviaRicerca() {
      if (poll) { clearInterval(poll); poll = null; }
      if (!attiva) return;
      var n = 0;
      poll = setInterval(function () {
        if (!attiva || bersaglio) { clearInterval(poll); poll = null; return; }
        /* la pagina a destra può comparire a pezzi: si riprova per circa 20 secondi */
        if (cerca()) { clearInterval(poll); poll = null; return; }
        n++;
        if (n === 10) suggerisci(); /* dopo circa 5 secondi senza trovarlo */
        if (n > 40) { clearInterval(poll); poll = null; }
      }, 500);
    }
    function mostraEtichetta(testo, li) {
      var d = doc(); if (!d) { avviso('La pagina a destra si sta ancora aprendo: riprova tra un attimo.'); return; }
      var el = trova(d, testo);
      if (el) { nascondi(); mostra(el, testo, li); }
      else avviso('Non lo vedo in questa pagina: aprila con i pulsanti sopra il passo, oppure vai avanti con le schermate.');
    }

    /* ───── eventi ───── */
    function toccato(e) {
      if (!bersaglio) return;
      var t = e.target;
      if (t === bersaglio || (bersaglio.contains && bersaglio.contains(t))) {
        if (scorsoPer) fatti[scorsoPer] = 1;
        nascondi();
        setTimeout(avviaRicerca, 700);
      }
    }
    function aggancia() {
      var d = doc(); if (!d) return;
      d.addEventListener('click', toccato, true);
      d.addEventListener('focusin', toccato, true);
      /* dopo un tocco la schermata a destra cambia: si ricomincia a cercare */
      d.addEventListener('click', function () { setTimeout(function () { if (!bersaglio) avviaRicerca(); }, 600); }, true);
    }
    sito.addEventListener('load', function () { nascondi(); aggancia(); avviaRicerca(); });

    btn.onclick = function () {
      attiva = !attiva; aggiornaBottone();
      try { localStorage.setItem(CHIAVE, attiva ? '1' : '0'); } catch (e) {}
      if (attiva) avviaRicerca(); else { nascondi(); ov.classList.remove('msg'); if (poll) { clearInterval(poll); poll = null; } }
    };

    /* il testo evidenziato a sinistra: toccandolo si rivede il punto, senza spuntare la casella */
    elenco.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('.bt,.btn');
      if (!c) return;
      var li = c.closest('.corpo ul > li'); if (!li) return;
      e.preventDefault();
      if (!attiva) { attiva = true; aggiornaBottone(); try { localStorage.setItem(CHIAVE, '1'); } catch (x) {} }
      mostraEtichetta(c.textContent, li);
    }, true);

    /* cambio di passo o di casella spuntata: l'animazione passa all'azione successiva */
    function controlla() {
      var f = firmaPasso();
      if (f === firma) return;
      firma = f; nascondi(); avviaRicerca();
    }
    var tObs = null;
    new MutationObserver(function () { clearTimeout(tObs); tObs = setTimeout(controlla, 150); })
      .observe(elenco, { subtree: true, attributes: true, attributeFilter: ['class'] });
    elenco.addEventListener('change', function () { setTimeout(controlla, 50); });
    window.addEventListener('resize', function () { if (bersaglio) posiziona(); });

    return { mostra: mostraEtichetta, nascondi: nascondi };
  }

  window.GuidaClick = { avvia: avvia };
})();
