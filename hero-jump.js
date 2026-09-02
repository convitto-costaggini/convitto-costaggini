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

    var COLLAPSE_MARGIN = 24;
    var COLLAPSE_MIN_INTERVAL = 220;
    var lastCollapseChange = 0;

    function updateCollapse() {
      if (!mq.matches) {
        setCollapsed(false);
        return;
      }
      var now = Date.now();
      if (now - lastCollapseChange < COLLAPSE_MIN_INTERVAL) return;
      var top = sentinel.getBoundingClientRect().top;
      if (!collapsed && top < -COLLAPSE_MARGIN) {
        setCollapsed(true);
        lastCollapseChange = now;
      } else if (collapsed && top > COLLAPSE_MARGIN) {
        setCollapsed(false);
        lastCollapseChange = now;
      }
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
    try { document.documentElement.style.overflowAnchor = 'none'; } catch (err) { /* ignorato */ }

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
