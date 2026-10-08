/* Moduli di consenso e revoca compilabili a schermo.
   Le righe si scrivono direttamente nella pagina e le caselle si spuntano con un clic;
   poi si stampa e si firma a mano. Niente viene inviato né salvato: i dati restano
   solo nella pagina aperta e spariscono ricaricandola. */
(function(){
  var CONTENITORI = '.mod-body, .mf-modulo-body';

  var css =
    '.mc-riga{cursor:text;outline:0;padding:0 .2rem;word-break:break-word;white-space:pre-wrap}' +
    '.mc-riga:hover{background:#f5f8f5}' +
    '.mc-riga:focus{background:#f0f6f1;box-shadow:0 2px 0 var(--bosco,#2d4a3e)}' +
    '.mod-body .riga.mc-riga{font-weight:600;color:var(--bosco,#2d4a3e)}' +
    '.mc-box{cursor:pointer;position:relative;background:#fff}' +
    '.mc-box:hover{border-color:var(--bosco,#2d4a3e)!important;background:#f0f6f1}' +
    '.mc-box:focus-visible{outline:2px solid var(--bosco,#2d4a3e);outline-offset:2px}' +
    '.mc-box[aria-checked="true"]::after{content:"\\2713";position:absolute;left:50%;top:50%;transform:translate(-50%,-55%);font:700 15px/1 Arial,sans-serif;color:#111}' +
    '.mc-cliccabile{cursor:pointer}' +
    '.mc-aiuto{display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:space-between;background:#f0f6f1;border:1px solid #cfe0d3;border-radius:8px;padding:.6rem .9rem;margin:0 0 1.1rem;font-size:.8rem;line-height:1.5;color:#1f3b2d}' +
    '.mc-svuota{font:inherit;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:.35rem .75rem;border:1.5px solid #9fbfa8;border-radius:6px;background:#fff;color:#1f3b2d;cursor:pointer}' +
    '.mc-svuota:hover{border-color:var(--bosco,#2d4a3e)}' +
    '@media print{.mc-aiuto{display:none!important}.mc-riga,.mc-riga:focus{background:none!important;box-shadow:none!important;color:#000!important}.mc-box{background:#fff!important}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // Etichetta leggibile per gli screen reader: il testo che precede la riga o la casella.
  function etichetta(el){
    var t = '', n = el.previousSibling;
    while (n && t.replace(/\s+/g, '').length < 3) {
      t = (n.textContent || '') + t;
      n = n.previousSibling;
    }
    t = t.replace(/\s+/g, ' ').replace(/[:,]\s*$/, '').trim();
    if (!t) { var sm = el.parentNode && el.parentNode.querySelector('small'); if (sm) t = sm.textContent; }
    return t.slice(-60) || 'campo da compilare';
  }

  // Le caselle dello stesso gruppo si escludono a vicenda (come i pulsanti di scelta).
  function gruppo(box){
    var p = box.parentElement;
    if (p.classList.contains('scelta')) {
      var body = box.closest(CONTENITORI);
      return Array.prototype.filter.call(body.querySelectorAll('.scelta > .box'), function(b){ return b.parentElement.parentElement === p.parentElement; });
    }
    var c = box.closest('.scelta, p');
    return c ? Array.prototype.slice.call(c.querySelectorAll('.box')) : [box];
  }

  function testoCasella(box){
    var n = box.nextSibling;
    while (n && !(n.textContent || '').trim()) n = n.nextSibling;
    return n ? n.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) : etichetta(box);
  }

  function principale(b){ return b.parentElement.classList.contains('scelta'); }

  // Per una sotto-opzione (es. "con didascalia"), la voce principale che la precede.
  function voceDi(box){
    var tutte = Array.prototype.slice.call(box.closest(CONTENITORI).querySelectorAll('.box'));
    for (var i = tutte.indexOf(box) - 1; i >= 0; i--) if (principale(tutte[i])) return tutte[i];
    return null;
  }

  function imposta(box, val){
    gruppo(box).forEach(function(b){ b.setAttribute('aria-checked', 'false'); });
    box.setAttribute('aria-checked', val ? 'true' : 'false');
  }

  function spunta(box){
    var nuovo = box.getAttribute('aria-checked') !== 'true';
    imposta(box, nuovo);
    var body = box.closest(CONTENITORI);
    if (principale(box)) {
      // Cambiando voce principale si svuotano le sotto-opzioni delle altre voci.
      body.querySelectorAll('.box').forEach(function(b){
        if (!principale(b) && (!nuovo || voceDi(b) !== box)) b.setAttribute('aria-checked', 'false');
      });
    } else if (nuovo) {
      // Scegliere una sotto-opzione spunta anche la voce a cui appartiene.
      var v = voceDi(box);
      if (v && v.getAttribute('aria-checked') !== 'true') {
        imposta(v, true);
        body.querySelectorAll('.box').forEach(function(b){
          if (!principale(b) && voceDi(b) !== v) b.setAttribute('aria-checked', 'false');
        });
      }
    }
  }

  document.querySelectorAll(CONTENITORI).forEach(function(body){
    var righe = body.querySelectorAll('.riga');
    var caselle = body.querySelectorAll('.box');
    if (!righe.length && !caselle.length) return;

    righe.forEach(function(r){
      if (r.closest('.mod-firme')) return; // le firme restano a mano
      r.classList.add('mc-riga');
      r.setAttribute('contenteditable', 'true');
      r.setAttribute('spellcheck', 'false');
      r.setAttribute('role', 'textbox');
      r.setAttribute('aria-label', etichetta(r));
    });
    // Incolla solo testo semplice, senza formattazione.
    body.addEventListener('paste', function(e){
      var r = e.target.closest && e.target.closest('.mc-riga');
      if (!r) return;
      e.preventDefault();
      var t = (e.clipboardData || window.clipboardData).getData('text');
      document.execCommand('insertText', false, t);
    });

    caselle.forEach(function(b){
      b.classList.add('mc-box');
      b.setAttribute('role', 'checkbox');
      b.setAttribute('aria-checked', 'false');
      b.setAttribute('tabindex', '0');
      b.setAttribute('aria-label', testoCasella(b));
      b.addEventListener('keydown', function(e){
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); spunta(b); }
      });
      // Anche un clic sulla scritta accanto spunta la casella.
      var zona = b.closest('.opz') || (b.parentElement.classList.contains('scelta') ? b.parentElement : null) ||
                 (b.parentElement.style && b.parentElement.style.whiteSpace === 'nowrap' ? b.parentElement : null);
      if (zona) zona.classList.add('mc-cliccabile');
      (zona || b).addEventListener('click', function(e){
        if (e.target.closest('.mc-riga, a')) return;
        if (zona && e.target !== b && e.target.closest('.box') && e.target.closest('.box') !== b) return;
        spunta(b);
      });
    });

    // In Autorizzazioni nome e classe si compilano già dal box in alto: lì basta rendere cliccabili le caselle.
    if (body.classList.contains('mf-modulo-body')) return;

    var aiuto = document.createElement('div');
    aiuto.className = 'mc-aiuto';
    aiuto.innerHTML = '<span>Puoi compilare il modulo qui: scrivi sulle righe e spunta le caselle, poi stampalo e firmalo. <strong>I dati non vengono inviati né salvati.</strong></span>';
    var svuota = document.createElement('button');
    svuota.type = 'button';
    svuota.className = 'mc-svuota';
    svuota.textContent = 'Svuota il modulo';
    svuota.addEventListener('click', function(){
      body.querySelectorAll('.mc-riga').forEach(function(r){ r.textContent = ''; });
      body.querySelectorAll('.mc-box').forEach(function(b){ b.setAttribute('aria-checked', 'false'); });
    });
    aiuto.appendChild(svuota);
    var primo = body.querySelector(':scope > :not(.print-only)');
    body.insertBefore(aiuto, primo);
  });
})();
