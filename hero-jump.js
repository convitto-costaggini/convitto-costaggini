/* hero-jump.js — comportamento mobile per la barra di navigazione interna
   "salta alla sezione" (.hero-jump-bar), usata da organizzazione.html,
   contatti.html, il-convitto.html e le altre pagine con sommario interno.

   Su desktop la barra resta semplicemente "sticky" sotto l'header, invariata.

   Su mobile risolve due problemi:
   1) Quando la barra è "agganciata" in alto, gli elenchi con più voci
      diventano una colonna alta e occupano molto spazio verticale utile.
      Qui, appena la barra si stacca dalla sezione soprastante, il menu
      viene spostato in un pannello fisso sul bordo destro, richiamabile
      con una piccola linguetta, così non occupa più spazio in verticale.
   2) Cliccando una voce, il punto di atterraggio veniva calcolato con un
      margine fisso troppo piccolo per l'altezza reale della barra su
      mobile, "mozzando" la prima riga della sezione. Qui l'offset di
      scroll viene calcolato al volo in base all'altezza reale di header
      e barra al momento del click.

   In più, su tutti i viewport, evidenzia la voce corrispondente alla
   sezione attualmente a schermo mentre si scorre la pagina — lo stesso
   effetto già presente in ptof-guida.html, esteso qui a tutti i menu
   "salta alla sezione" del sito.

   Nota tecnica: la linguetta e il pannello vengono spostati come figli
   diretti di <body> (invece di restare dentro <main>) perché <main> ha
   una transform (usata per le animazioni di comparsa dei contenuti) e
   qualunque transform su un antenato ridefinisce il "containing block"
   degli elementi position:fixed, spostandoli fuori posto. */
(function () {
  function setHeaderVar() {
    var header = document.querySelector('header');
    var h = header ? Math.round(header.getBoundingClientRect().height) : 68;
    document.documentElement.style.setProperty('--hdr-h', h + 'px');
    return h;
  }

  function init(bar) {
    var nav = bar.querySelector('.hero-jump');
    if (!nav) return;

    var navParent = nav.parentElement;
    var navNextSibling = nav.nextSibling;

    // Sentinella posizionata subito prima della barra: quando esce dalla
    // parte alta del viewport, la barra sticky si è "agganciata".
    var sentinel = document.createElement('div');
    sentinel.className = 'hjb-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    bar.parentNode.insertBefore(sentinel, bar);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'hjb-toggle';
    toggle.setAttribute('aria-label', 'Apri il menu di navigazione della pagina');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span aria-hidden="true">☰</span>';
    document.body.appendChild(toggle);

    var mq = window.matchMedia('(max-width: 767px)');
    var collapsed = false;
    var open = false;

    function setCollapsed(state) {
      if (collapsed === state) return;
      collapsed = state;
      bar.classList.toggle('hjb-collapsed', collapsed);
      toggle.classList.toggle('hjb-visible', collapsed);
      if (collapsed) {
        nav.classList.add('hjb-fixed');
        document.body.appendChild(nav);
      } else {
        nav.classList.remove('hjb-fixed');
        navParent.insertBefore(nav, navNextSibling);
        setOpen(false);
      }
    }

    function setOpen(state) {
      open = state;
      nav.classList.toggle('hjb-open', open);
      toggle.classList.toggle('hjb-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (open && !nav.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Rileva l'aggancio/sgancio della barra osservando direttamente la
    // posizione della sentinella a ogni scroll, invece che con un singolo
    // IntersectionObserver a soglia 0. Motivo: quando la barra si
    // aggancia, il suo <nav> viene spostato fuori dal flusso (per non
    // occupare spazio verticale), e l'altezza della barra si riduce di
    // colpo; il cambio di altezza appena sopra il punto che l'utente sta
    // guardando può far scattare la "scroll anchoring" del browser (la
    // correzione automatica dello scroll per evitare che il contenuto
    // "salti" a video), che sposta lo scroll quel tanto che basta a far
    // riattraversare alla sentinella la soglia nella direzione opposta:
    // la barra si sgancia di nuovo, l'altezza torna quella di prima, lo
    // scroll viene ricorretto di nuovo, e così via — un ciclo di
    // aggancio/sgancio continuo percepito come uno sfarfallio che
    // blocca lo scorrimento della pagina. Per evitarlo si usa una banda
    // di isteresi: per agganciarsi la sentinella deve superare la soglia
    // di un margine, e per sganciarsi deve tornare indietro di un
    // margine analogo dalla parte opposta, così piccole oscillazioni
    // intorno al punto di aggancio non fanno scattare continuamente il
    // cambio di stato.
    var COLLAPSE_MARGIN = 10;

    function updateCollapse() {
      if (!mq.matches) {
        setCollapsed(false);
        return;
      }
      var top = sentinel.getBoundingClientRect().top;
      if (!collapsed && top < -COLLAPSE_MARGIN) setCollapsed(true);
      else if (collapsed && top > COLLAPSE_MARGIN) setCollapsed(false);
    }

    var collapseTicking = false;
    function onCollapseScroll() {
      if (collapseTicking) return;
      collapseTicking = true;
      requestAnimationFrame(function () {
        collapseTicking = false;
        updateCollapse();
      });
    }
    window.addEventListener('scroll', onCollapseScroll, { passive: true });
    window.addEventListener('resize', onCollapseScroll, { passive: true });
    updateCollapse();

    function onMqChange() {
      updateCollapse();
    }
    if (mq.addEventListener) mq.addEventListener('change', onMqChange);
    else if (mq.addListener) mq.addListener(onMqChange);

    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        var hdrH = setHeaderVar();
        if (mq.matches) setCollapsed(true);
        var barH = mq.matches ? 0 : bar.getBoundingClientRect().height;
        var offset = hdrH + barH + 14;
        var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
        history.pushState(null, '', '#' + id);
      });
    });

    // Se la pagina viene caricata già con un'ancora corrispondente a una
    // delle voci di questa barra (es. arrivando da un risultato di
    // ricerca), collassala subito su mobile. Lo scroll automatico nativo
    // del browser, se già avvenuto (o in corso), ha usato il layout
    // "disteso" (bar alta) di partenza: una volta collassata la barra il
    // contenuto sopra il bersaglio si accorcia e lo scroll nativo resta
    // disallineato, per cui va ricalcolato e riapplicato qui. behavior
    // 'auto' erediterebbe lo scroll-behavior:smooth del sito, animando
    // in competizione con lo scroll nativo del browser: si forza quindi
    // 'instant', e si ripete la correzione anche dopo un breve ritardo
    // per vincere anche su uno scroll nativo ancora in animazione.
    if (mq.matches && location.hash) {
      try {
        var preselected = nav.querySelector('a[href="' + CSS.escape(location.hash) + '"]');
        if (preselected) {
          setCollapsed(true);
          var hashTarget = document.getElementById(location.hash.slice(1));
          if (hashTarget) {
            var correctScroll = function () {
              var hdrH2 = setHeaderVar();
              var y2 = hashTarget.getBoundingClientRect().top + window.pageYOffset - (hdrH2 + 14);
              window.scrollTo({ top: Math.max(y2, 0), behavior: 'instant' });
            };
            correctScroll();
            setTimeout(correctScroll, 100);
            setTimeout(correctScroll, 700);
          }
        }
      } catch (err) { /* CSS.escape non disponibile: si ignora, nessun problema */ }
    }

    initScrollSpy();

    // Evidenzia, tra le voci del menu, quella della sezione attualmente
    // "in lettura" mentre si scorre — stesso effetto già presente in
    // ptof-guida.html. Lì le sezioni sono corte e di altezza simile, per
    // cui basta una soglia di visibilità (IntersectionObserver al 30%).
    // Qui invece le sezioni delle varie pagine hanno altezze molto
    // diverse — alcune superano abbondantemente l'altezza del viewport
    // (es. lo staff in il-convitto.html) e non raggiungerebbero mai il
    // 30% di area visibile. Si usa quindi la tecnica più robusta e
    // indipendente dall'altezza: la voce attiva è quella dell'ultima
    // sezione il cui bordo superiore ha superato una riga di lettura
    // poco sotto header/barra.
    function initScrollSpy() {
      var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
      var sections = links
        .map(function (a) { return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) }; })
        .filter(function (s) { return !!s.el; });
      if (!sections.length) return;

      function setActive(id) {
        links.forEach(function (a) {
          a.classList.toggle('hjb-active-link', a.getAttribute('href') === '#' + id);
        });
      }

      var ticking = false;
      function update() {
        ticking = false;
        var hdrH = parseInt(document.documentElement.style.getPropertyValue('--hdr-h'), 10) || setHeaderVar();
        var barH = collapsed ? 0 : bar.getBoundingClientRect().height;
        var refLine = hdrH + barH + 24;
        var current = null;
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].el.getBoundingClientRect().top <= refLine) current = sections[i];
        }
        setActive(current ? current.el.id : null);
      }
      function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
    }
  }

  function boot() {
    setHeaderVar();
    document.querySelectorAll('.hero-jump-bar').forEach(init);
    window.addEventListener('resize', setHeaderVar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
