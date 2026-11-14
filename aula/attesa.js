/* Attesa: indicatore di caricamento per le pagine dell'Aula.
   Chi aspetta deve capire che la pagina sta lavorando e non è bloccata.
   La percentuale è una stima di avvicinamento: sale veloce all'inizio, poi rallenta,
   non arriva mai a 100 prima che la pagina sia davvero pronta.

   Due usi, entrambi con un ritardo di mezzo secondo (se la pagina è veloce non si vede nulla):
   1) pagina intera: basta includere questo file nell'<head>. Si chiude da sola a caricamento finito.
      Se la pagina scarica dati anche dopo, usare AulaAttesa.pagina({ attendi: true, titolo: '...' })
      e chiamare AulaAttesa.fine() quando i dati sono arrivati.
   2) riquadro (iframe): var a = AulaAttesa.riquadro(elementoContenitore, { ricarica: fn });
      a.avvia() quando si cambia indirizzo, a.fine() all'evento load dell'iframe. */
(function () {
  if (window.AulaAttesa) return;

  var CSS =
    '.aa-bar{position:fixed;left:0;top:0;height:4px;width:0;background:#B8922A;z-index:99998;box-shadow:0 0 8px rgba(184,146,42,.6);transition:width .25s ease-out,opacity .3s}' +
    '.aa-bar.fine{opacity:0}' +
    '.aa{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:20px;background:#F5F0E8;transition:opacity .3s}' +
    '.aa.fine{opacity:0;pointer-events:none}' +
    '.aa.pag{position:fixed;inset:auto;left:50%;top:42%;transform:translate(-50%,-50%);z-index:99999;background:none;padding:0;width:min(92vw,420px);pointer-events:none}' +
    '.aa.pag .aa-c{pointer-events:auto}' +
    '.aa-c{width:100%;max-width:420px;background:#fff;border:1px solid #e4dccb;border-top:4px solid #B8922A;border-radius:14px;padding:18px 20px 16px;box-shadow:0 8px 28px rgba(44,62,45,.16);text-align:center;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#2C3E2D}' +
    '.aa-t{font-weight:700;font-size:1.05rem;margin:0 0 12px}' +
    '.aa-b{height:10px;border-radius:99px;background:#efe8d8;overflow:hidden}' +
    '.aa-b i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#2C3E2D,#3D5C3E);transition:width .25s ease-out}' +
    '.aa-p{margin:8px 0 0;font-weight:800;font-size:.95rem;font-variant-numeric:tabular-nums}' +
    '.aa-m{margin:8px 0 0;font-size:.9rem;line-height:1.5;color:#555;min-height:1.4em}' +
    '.aa-r{display:none;margin-top:10px;min-height:44px;padding:0 18px;border-radius:10px;border:2px solid #2C3E2D;background:#fff;color:#2C3E2D;font-weight:700;font-size:.95rem;cursor:pointer}' +
    '.aa-r.on{display:inline-block}' +
    '@media (prefers-reduced-motion:reduce){.aa-bar,.aa,.aa-b i{transition:none}}';

  var st = document.createElement('style');
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  /* percentuale stimata: 0 -> 96 con rallentamento progressivo */
  function stima(ms) { return Math.min(96, Math.round(96 * (1 - Math.exp(-ms / 5000)))); }

  function messaggio(ms) {
    if (ms > 20000) return 'La connessione sembra lenta. Se non cambia nulla, provate a ricaricare.';
    if (ms > 6000) return 'Ci vuole un po\' più del solito: la pagina sta arrivando, non serve fare altro.';
    return 'Un attimo: sto preparando tutto.';
  }

  /* crea un indicatore: host = contenitore (riquadro) oppure null (pagina intera) */
  function crea(host, opz) {
    opz = opz || {};
    var pagina = !host;
    var el = null, barra = null, t0 = 0, tick = null, ritardo = null, attivo = false;
    var titolo = opz.titolo || 'Sto caricando';

    function monta() {
      el = document.createElement('div');
      el.className = 'aa' + (pagina ? ' pag' : '');
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = '<div class="aa-c"><p class="aa-t"></p><div class="aa-b"><i></i></div>' +
        '<p class="aa-p"><span class="aa-n">0</span>%</p><p class="aa-m"></p>' +
        '<button type="button" class="aa-r">↻ Ricarica</button></div>';
      el.querySelector('.aa-t').textContent = titolo;
      el.querySelector('.aa-r').onclick = function () {
        if (typeof opz.ricarica === 'function') opz.ricarica(); else location.reload();
      };
      /* nel riquadro, la barra dei pulsanti (Esci, Ricarica...) resta libera e utilizzabile */
      var sb = !pagina && host.querySelector('.strumenti');
      if (sb) el.style.top = sb.offsetHeight + 'px';
      (pagina ? document.body : host).appendChild(el);
      if (pagina) {
        barra = document.createElement('div');
        barra.className = 'aa-bar';
        document.body.appendChild(barra);
      }
    }

    function aggiorna() {
      if (!el) return;
      var ms = Date.now() - t0, p = stima(ms);
      el.querySelector('.aa-b i').style.width = p + '%';
      el.querySelector('.aa-n').textContent = p;
      el.querySelector('.aa-m').textContent = messaggio(ms);
      el.querySelector('.aa-r').classList.toggle('on', ms > 20000);
      if (barra) barra.style.width = p + '%';
      /* rete di sicurezza: dopo un minuto un riquadro non deve restare a coprire la pagina */
      if (!pagina && ms > 60000) fine();
    }

    function pulisci() {
      if (tick) { clearInterval(tick); tick = null; }
      if (ritardo) { clearTimeout(ritardo); ritardo = null; }
    }

    function avvia() {
      if (attivo) fine(true);
      attivo = true; t0 = Date.now();
      pulisci();
      /* se la pagina è veloce l'indicatore non compare nemmeno */
      ritardo = setTimeout(function mostra() {
        ritardo = null;
        if (!attivo) return;
        /* se il corpo della pagina non esiste ancora (script nell'head), riprova tra poco */
        if (!el && pagina && !document.body) { ritardo = setTimeout(mostra, 100); return; }
        if (!el) monta();
        el.classList.remove('fine');
        if (barra) barra.classList.remove('fine');
        aggiorna();
        tick = setInterval(aggiorna, 150);
      }, opz.ritardo == null ? 500 : opz.ritardo);
    }

    function fine(subito) {
      if (!attivo) return;
      attivo = false;
      pulisci();
      if (!el) return;
      var e = el, b = barra;
      el = null; barra = null;
      e.querySelector('.aa-b i').style.width = '100%';
      e.querySelector('.aa-n').textContent = '100';
      if (b) b.style.width = '100%';
      setTimeout(function () {
        e.classList.add('fine');
        if (b) b.classList.add('fine');
        setTimeout(function () {
          if (e.parentNode) e.parentNode.removeChild(e);
          if (b && b.parentNode) b.parentNode.removeChild(b);
        }, 350);
      }, subito ? 0 : 200);
    }

    return { avvia: avvia, fine: fine };
  }

  var corrente = null;
  window.AulaAttesa = {
    riquadro: function (host, opz) { return crea(host, opz); },
    pagina: function (opz) {
      opz = opz || {};
      if (corrente) corrente.fine(true);
      corrente = crea(null, opz);
      /* parte subito: il tempo di attesa conta anche prima che il corpo della pagina esista */
      corrente.avvia();
      if (!opz.attendi) {
        if (document.readyState === 'complete') corrente.fine(); else window.addEventListener('load', function () { corrente.fine(); });
      }
      return corrente;
    },
    fine: function () { if (corrente) corrente.fine(); }
  };

  /* uso più semplice: includere il file e basta; le pagine che aspettano dati chiamano pagina({attendi:true}) prima */
  if (!window.AULA_ATTESA_MANUALE && !window.__aaAvviato) {
    window.__aaAvviato = true;
    if (document.readyState === 'complete') return;
    window.AulaAttesa.pagina({ titolo: 'Sto caricando la pagina' });
  }
})();
