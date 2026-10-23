/* ════════════════════════════════════════════════════════
   SALA STUDIO — il motore della lezione interattiva
   STUDIO.avvia(lezione, elemento, {id}) disegna il percorso:
   gancio → idee chiave → memorizza → allenati → flashcard → sfida → da ricordare.
   STUDIO.esc(testo) per scrivere testo sicuro nell'HTML.
   I progressi (tappe fatte, punti) restano solo nel browser del ragazzo.
   ════════════════════════════════════════════════════════ */
window.STUDIO = (function () {
  'use strict';

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mescola(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function pesca(a) { return a[Math.floor(Math.random() * a.length)]; }
  var BRAVO = ['Esatto! 🎯', 'Grande! 💪', 'Perfetto! ✨', 'Sì! 🔥', 'Bravissimo/a! 🌟', 'Centro! 🏹', 'Ci sei! 🚀'];
  var DAI = ['Quasi! Riprova 🙂', 'Non ancora, dai! 💡', 'Riprova, ce la fai 👊'];

  /* ───── voce: legge ad alta voce in italiano ───── */
  var voce = null;
  function scegliVoce() {
    if (!window.speechSynthesis) return;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^it/i.test(x.lang); });
    voce = v.filter(function (x) { return /google|natural|neural|alice|federica|elsa/i.test(x.name); })[0] || v[0] || null;
  }
  if (window.speechSynthesis) { scegliVoce(); speechSynthesis.onvoiceschanged = scegliVoce; }
  var bottoneVoce = null;
  function zitto() { if (window.speechSynthesis) speechSynthesis.cancel(); if (bottoneVoce) bottoneVoce.classList.remove('va'); bottoneVoce = null; }
  function leggi(testo, bottone) {
    if (!window.speechSynthesis) return toast('Il telefono non sa leggere ad alta voce 😕');
    var stessa = bottone && bottone === bottoneVoce;
    zitto(); if (stessa) return;
    var u = new SpeechSynthesisUtterance(testo); u.lang = 'it-IT'; u.rate = 0.92; if (voce) u.voice = voce;
    u.onend = u.onerror = function () { if (bottone) bottone.classList.remove('va'); if (bottoneVoce === bottone) bottoneVoce = null; };
    if (bottone) { bottone.classList.add('va'); bottoneVoce = bottone; }
    speechSynthesis.speak(u);
  }
  function tastoVoce(testo) { return '<button type="button" class="st-leggi" data-leggi="' + esc(testo) + '" aria-label="Leggi ad alta voce" title="Leggi ad alta voce">🔊</button>'; }

  /* ───── messaggi e festa ───── */
  var tt;
  function toast(t) {
    var el = document.querySelector('.st-toast');
    if (!el) { el = document.createElement('div'); el.className = 'st-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = t; el.classList.add('su'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('su'); }, 1600);
  }
  function coriandoli() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas'); c.className = 'st-coriandoli'; document.body.appendChild(c);
    var x = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight, colori = ['#B8922A', '#D4AA4A', '#2C3E2D', '#4A6E4B', '#EDD98A', '#b4442f'];
    var p = []; for (var i = 0; i < 140; i++) p.push({ x: W / 2, y: H * 0.35, vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 4, c: pesca(colori), a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4 });
    var t0 = performance.now();
    (function giro(t) {
      x.clearRect(0, 0, W, H);
      p.forEach(function (q) { q.vy += 0.38; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.a += q.va; x.save(); x.translate(q.x, q.y); x.rotate(q.a); x.fillStyle = q.c; x.fillRect(-q.r / 2, -q.r / 4, q.r, q.r / 2); x.restore(); });
      if (t - t0 < 3200) requestAnimationFrame(giro); else c.remove();
    })(t0);
  }

  /* ───── avvio ───── */
  function avvia(L, radice, opz) {
    opz = opz || {};
    var chiave = 'studio-' + (opz.id || L.titolo || 'lezione');
    var stato = { fatte: {}, punti: 0, vista: 0 };
    try { var s = JSON.parse(localStorage.getItem(chiave) || 'null'); if (s && s.fatte) stato = s; } catch (e) {}
    function salva() { try { localStorage.setItem(chiave, JSON.stringify(stato)); } catch (e) {} }

    var M = L.mnemonica || {};
    var haSeq = L.sequenza && arr(L.sequenza.passi).length >= 3;
    var TAPPE = [
      { id: 'gancio', ic: '🎣', nome: 'Il gancio', fn: tappaGancio },
      { id: 'idee', ic: '💡', nome: 'Le idee', fn: tappaIdee },
      { id: 'memo', ic: '🧠', nome: 'Memorizza', fn: tappaMemo },
      { id: 'allena', ic: '🎯', nome: 'Allenati', fn: tappaAllena },
      { id: 'flash', ic: '🃏', nome: 'Flashcard', fn: tappaFlash },
      { id: 'sfida', ic: '🏆', nome: 'Sfida finale', fn: tappaSfida },
      { id: 'ricorda', ic: '📌', nome: 'Da ricordare', fn: tappaRicorda }
    ];
    var corrente = Math.min(stato.vista || 0, TAPPE.length - 1);

    radice.classList.add('st');
    radice.innerHTML =
      '<div class="st-barra"><div class="w">' +
        '<button type="button" data-z="-1" aria-label="Testo più piccolo">A−</button>' +
        '<button type="button" data-z="1" aria-label="Testo più grande">A+</button>' +
        '<button type="button" data-largo aria-pressed="false" title="Lettere e righe più distanziate">↔ Spazi</button>' +
        '<button type="button" data-zitto aria-label="Ferma la voce">🔇</button>' +
        '<span class="st-punti" aria-live="polite">⭐ <b>' + stato.punti + '</b></span>' +
      '</div></div>' +
      '<nav class="st-mappa" aria-label="Le tappe della lezione">' + TAPPE.map(function (t, i) {
        return '<button type="button" class="st-tappa" data-tappa="' + i + '"><span class="tondo" aria-hidden="true">' + t.ic + '</span><small>' + (i + 1) + '. ' + t.nome + '</small></button>';
      }).join('') + '</nav>' +
      '<div class="st-palco" id="st-palco" tabindex="-1"></div>';
    var palco = radice.querySelector('#st-palco');
    var zoom = 1; try { zoom = +localStorage.getItem('studio-zoom') || 1; if (localStorage.getItem('studio-largo') === '1') { radice.classList.add('st-largo'); radice.querySelector('[data-largo]').setAttribute('aria-pressed', 'true'); } } catch (e) {}
    radice.style.setProperty('--st-z', zoom);

    function punti(n) {
      stato.punti += n; salva();
      var el = radice.querySelector('.st-punti'); el.querySelector('b').textContent = stato.punti;
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    }
    function fatta(id) { if (!stato.fatte[id]) { stato.fatte[id] = true; salva(); aggiornaMappa(); } }
    function aggiornaMappa() {
      radice.querySelectorAll('.st-tappa').forEach(function (b, i) {
        b.classList.toggle('fatta', !!stato.fatte[TAPPE[i].id]);
        if (i === corrente) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    }
    function vai(i, scorri) {
      zitto(); corrente = i; stato.vista = i; salva(); aggiornaMappa();
      palco.innerHTML = ''; TAPPE[i].fn(palco);
      var b = radice.querySelectorAll('.st-tappa')[i]; if (b && b.scrollIntoView) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      if (scorri) { palco.focus({ preventScroll: true }); radice.querySelector('.st-mappa').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    function avanti(id, testo) {
      return '<div class="st-azioni"><button type="button" class="st-btn pieno" data-avanti="' + id + '">' + (testo || 'Prossima tappa →') + '</button></div>';
    }

    radice.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t || !radice.contains(t)) return;
      if (t.hasAttribute('data-leggi')) return leggi(t.getAttribute('data-leggi'), t);
      if (t.hasAttribute('data-tappa')) return vai(+t.getAttribute('data-tappa'), true);
      if (t.hasAttribute('data-avanti')) { if (t.getAttribute('data-avanti')) fatta(t.getAttribute('data-avanti')); return vai(Math.min(corrente + 1, TAPPE.length - 1), true); }
      if (t.hasAttribute('data-zitto')) return zitto();
      if (t.hasAttribute('data-z')) { zoom = Math.max(0.85, Math.min(1.6, zoom + 0.1 * t.getAttribute('data-z'))); radice.style.setProperty('--st-z', zoom); try { localStorage.setItem('studio-zoom', zoom); } catch (e2) {} return; }
      if (t.hasAttribute('data-largo')) { var on = radice.classList.toggle('st-largo'); t.setAttribute('aria-pressed', on); try { localStorage.setItem('studio-largo', on ? '1' : '0'); } catch (e3) {} }
    });

    /* ═══ 1. IL GANCIO ═══ */
    function tappaGancio(el) {
      var g = L.gancio || {};
      el.innerHTML = '<h2>Prima di tutto, una domanda…</h2><p class="st-sot">Non devi saperlo. Prova a indovinare: il cervello ricorda meglio quello che ha provato a indovinare.</p>' +
        '<div class="st-card st-gancio st-entra">' + tastoVoce(g.domanda) + '<div style="font-size:3rem">🤔</div><p class="q">' + esc(g.domanda) + '</p>' +
        '<div id="st-g"><button type="button" class="st-btn oro" id="st-pensa">Ci penso 5 secondi…</button></div></div>';
      el.querySelector('#st-pensa').onclick = function () {
        var box = el.querySelector('#st-g'), n = 5;
        box.innerHTML = '<div class="st-conto" aria-live="polite">5</div>';
        var iv = setInterval(function () {
          n--; if (n > 0) { box.firstChild.textContent = n; return; }
          clearInterval(iv);
          box.innerHTML = '<div class="r st-entra">💡 ' + esc(g.risposta) + '</div>' + avanti('gancio', 'Scopriamo perché →');
          punti(5);
        }, 1000);
      };
    }

    /* ═══ 2. LE IDEE CHIAVE ═══ */
    function evidenzia(testo, parola) {
      var t = esc(testo); if (!parola) return t;
      var p = esc(parola).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return t.replace(new RegExp('(' + p + ')', 'i'), '<mark class="st-k">$1</mark>');
    }
    function tappaIdee(el) {
      var C = arr(L.concetti), i = 0;
      function disegna() {
        if (i >= C.length) return glossario();
        var c = C[i];
        el.innerHTML = '<h2>Le idee chiave</h2><p class="st-sot">Una alla volta. Leggi, ascolta, poi vai avanti.</p>' +
          '<div class="st-card st-concetto st-entra">' + tastoVoce(c.titolo + '. ' + c.spiegazione + (c.esempio ? ' Esempio: ' + c.esempio : '')) +
          '<span class="em" aria-hidden="true">' + esc(c.emoji || '💡') + '</span><h4>' + esc(c.titolo) + '</h4><p style="margin:0">' + evidenzia(c.spiegazione, c.parola_chiave) + '</p>' +
          (c.esempio ? '<div class="st-esempio">👉 <b>Per esempio:</b> ' + esc(c.esempio) + '</div>' : '') + '</div>' +
          '<div class="st-puntini" aria-hidden="true">' + C.map(function (_, k) { return '<i' + (k === i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
          '<div class="st-azioni" style="justify-content:space-between"><button type="button" class="st-btn" id="st-ind"' + (i ? '' : ' disabled') + '>← Indietro</button>' +
          '<span class="st-nota">' + (i + 1) + ' di ' + C.length + '</span><button type="button" class="st-btn pieno" id="st-av">Capito →</button></div>';
        el.querySelector('#st-ind').onclick = function () { zitto(); i--; disegna(); };
        el.querySelector('#st-av').onclick = function () { zitto(); i++; punti(1); disegna(); };
      }
      function glossario() {
        var P = arr(L.parole);
        el.innerHTML = '<h2>Le parole importanti</h2><p class="st-sot">Tocca una carta per girarla. Prova a dire la definizione <b>prima</b> di girarla.</p>' +
          '<div class="st-glossario st-entra">' + P.map(function (p) {
            return '<button type="button" class="st-giro"><span class="in"><span class="f">' + esc(p.termine) + '</span><span class="b">' + esc(p.definizione) + '</span></span></button>';
          }).join('') + '</div>' + avanti('idee', 'Ora fissiamole in testa →');
        el.querySelectorAll('.st-giro').forEach(function (b) { b.onclick = function () { b.classList.toggle('girata'); }; });
      }
      disegna();
    }

    /* ═══ 3. MEMORIZZA: le mnemotecniche ═══ */
    function tappaMemo(el) {
      var A = M.acronimo || {}, LT = arr(A.lettere), S = M.storia || {}, TP = arr(S.tappe), IM = arr(M.immagini), TR = arr(M.trucchi);
      var h = '<h2>Memorizza con i trucchi</h2><p class="st-sot">Le mnemotecniche sono scorciatoie per il cervello: si ricorda meglio ciò che è <b>strano, buffo, colorato</b>.</p>';
      if (LT.length) {
        h += '<h3>🔤 La parola magica</h3><div class="st-card st-entra">' + tastoVoce(A.parola + '. ' + LT.map(function (l) { return l.lettera + ' come ' + l.significato; }).join('. ') + '. ' + (A.frase || '')) +
          '<p style="margin:0 0 .3rem;text-align:center" class="st-nota">Tocca ogni lettera per scoprire cosa nasconde.</p>' +
          '<div class="st-acro">' + LT.map(function (l, k) { return '<button type="button" class="st-lett" style="animation-delay:' + (k * 0.12) + 's" data-l="' + k + '" aria-label="Lettera ' + esc(l.lettera) + '">' + esc(l.lettera) + '</button>'; }).join('') + '</div>' +
          '<div class="st-acro-sig">' + LT.map(function (l) { return '<div><b>' + esc(l.lettera) + '</b><span>' + esc(l.significato) + '</span></div>'; }).join('') + '</div>' +
          (A.frase ? '<p class="st-frase">“' + fraseIniziali(A.frase) + '”</p>' : '') +
          '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn" id="st-acro-prova">🎲 Mettimi alla prova</button></div><div id="st-acro-q"></div></div>';
      }
      if (TP.length) {
        h += '<h3>🏰 Il palazzo della memoria</h3><p class="st-sot">Chiudi gli occhi e cammina per il Convitto: in ogni stanza c\'è una scena assurda. Ripercorri il giro e ritrovi i concetti.</p>' +
          '<div class="st-card st-entra">' + tastoVoce((S.titolo ? S.titolo + '. ' : '') + TP.map(function (t) { return t.luogo + ': ' + t.immagine; }).join('. ')) +
          (S.titolo ? '<p style="font-weight:700;color:var(--bosco);margin:0 2.6rem .8rem 0">' + esc(S.titolo) + '</p>' : '') +
          '<div class="st-palazzo">' + TP.map(function (t, k) { return '<div class="st-luogo"><span class="n">' + (k + 1) + '</span><span class="l">' + esc(t.luogo) + '</span><span class="i">' + esc(t.immagine) + '</span><span class="c">' + esc(t.concetto) + '</span></div>'; }).join('') + '</div>' +
          '<div class="st-azioni"><button type="button" class="st-btn" id="st-pal-prova">🚶 Rifai il giro a memoria</button></div><div id="st-pal-q"></div></div>';
      }
      if (M.filastrocca) {
        h += '<h3>🎵 La filastrocca</h3><p class="st-sot">Leggila ad alta voce 3 volte. Poi premi “Nascondi parole”: ogni volta ne sparisce qualcuna e tu la dici lo stesso. È la tecnica della <b>scomparsa progressiva</b>.</p>' +
          '<div class="st-card st-entra">' + tastoVoce(M.filastrocca) + '<div class="st-filastrocca" id="st-fil"></div>' +
          '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn" id="st-fil-meno">🙈 Nascondi parole</button><button type="button" class="st-btn" id="st-fil-tutto">↺ Ricomincia</button></div></div>';
      }
      if (IM.length) {
        h += '<h3>🖼️ Le immagini mentali</h3><p class="st-sot">Immagina ogni scena per 5 secondi, il più grande e colorata possibile.</p><div class="st-imm st-entra">' +
          IM.map(function (m) { return '<div><span class="e" aria-hidden="true">' + esc(m.emoji || '✨') + '</span><span><b>' + esc(m.concetto) + '</b><span>' + esc(m.immagine) + '</span></span></div>'; }).join('') + '</div>';
      }
      if (TR.length) h += '<h3>🪄 Altri trucchi</h3><ul class="st-trucchi st-entra">' + TR.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      el.innerHTML = h + avanti('memo', 'Ora alleniamoci →');

      el.querySelectorAll('.st-lett').forEach(function (b) {
        b.onclick = function () { var k = +b.getAttribute('data-l'); b.classList.add('on'); el.querySelectorAll('.st-acro-sig div')[k].classList.add('on'); leggi(LT[k].lettera + ': ' + LT[k].significato); };
      });
      var bp = el.querySelector('#st-acro-prova');
      if (bp) bp.onclick = function () {
        el.querySelectorAll('.st-acro-sig div').forEach(function (d) { d.classList.remove('on'); });
        el.querySelectorAll('.st-lett').forEach(function (d) { d.classList.remove('on'); });
        miniQuiz(el.querySelector('#st-acro-q'), mescola(LT).map(function (l) {
          return { dom: 'Cosa vuol dire la lettera «' + l.lettera + '»?', giusta: l.significato, altre: LT.filter(function (x) { return x !== l; }).map(function (x) { return x.significato; }) };
        }), function () { toast('Parola magica imparata! 🔤'); });
      };
      var pp = el.querySelector('#st-pal-prova');
      if (pp) pp.onclick = function () {
        miniQuiz(el.querySelector('#st-pal-q'), TP.map(function (t) {
          return { dom: 'Sei qui: ' + t.luogo + '. Che cosa ti ricorda?', giusta: t.concetto, altre: TP.filter(function (x) { return x !== t; }).map(function (x) { return x.concetto; }) };
        }), function () { toast('Giro completato! 🏰'); });
      };
      var fil = el.querySelector('#st-fil');
      if (fil) {
        var parole = [], nascoste = 0;
        fil.innerHTML = String(M.filastrocca).split(/\n+/).map(function (v) {
          return '<span class="v">' + v.split(/(\s+)/).map(function (w) {
            if (!/[A-Za-zÀ-ÿ0-9]{3,}/.test(w)) return esc(w);
            parole.push(0); return '<span class="w">' + esc(w) + '</span>';
          }).join('') + '</span>';
        }).join('');
        var ws = fil.querySelectorAll('.w'), ordine = mescola(Array.prototype.map.call(ws, function (_, k) { return k; }));
        el.querySelector('#st-fil-meno').onclick = function () {
          var quante = Math.max(1, Math.ceil(ws.length / 4));
          for (var k = 0; k < quante && nascoste < ws.length; k++, nascoste++) { var w = ws[ordine[nascoste]]; w.classList.add('buco'); w.title = 'Tocca per sbirciare'; }
          if (nascoste >= ws.length) { toast('Tutta a memoria! 🎤'); punti(5); }
        };
        el.querySelector('#st-fil-tutto').onclick = function () { nascoste = 0; ws.forEach(function (w) { w.classList.remove('buco', 'vista'); }); };
        fil.addEventListener('click', function (e) { var w = e.target.closest('.buco'); if (w) w.classList.toggle('vista'); });
      }
    }
    function fraseIniziali(f) {
      return String(f).split(/(\s+)/).map(function (w) { var m = w.match(/^([^A-Za-zÀ-ÿ]*)([A-Za-zÀ-ÿ])(.*)$/); return m ? esc(m[1]) + '<b>' + esc(m[2]) + '</b>' + esc(m[3]) : esc(w); }).join('');
    }
    /* domande a scelta in fila, usate dalle mnemotecniche */
    function miniQuiz(box, domande, fine) {
      var k = 0;
      function una() {
        if (k >= domande.length) { box.innerHTML = '<div class="st-spiega ok st-entra">🎉 Tutte giuste!</div>'; punti(5); if (fine) fine(); return; }
        var d = domande[k], opz = mescola([d.giusta].concat(mescola(d.altre).slice(0, 2)));
        box.innerHTML = '<div class="st-entra" style="margin-top:1rem"><p class="st-cont">' + (k + 1) + ' / ' + domande.length + '</p><p class="st-dom" style="padding:0">' + esc(d.dom) + '</p><div class="st-scelte">' +
          opz.map(function (o) { return '<button type="button" class="st-scelta">' + esc(o) + '</button>'; }).join('') + '</div></div>';
        box.querySelectorAll('.st-scelta').forEach(function (b, i) {
          b.onclick = function () {
            if (opz[i] === d.giusta) { b.classList.add('ok'); punti(2); k++; setTimeout(una, 650); }
            else { b.classList.add('no'); b.disabled = true; }
          };
        });
      }
      una();
    }

    /* ═══ 4. ALLENATI ═══ */
    function tappaAllena(el) {
      var schede = [];
      if (arr(L.quiz).length) schede.push(['quiz', '❓ Quiz', esQuiz]);
      if (arr(L.vero_falso).length) schede.push(['vf', '✔️ Vero o falso', esVF]);
      if (arr(L.completa).length) schede.push(['completa', '✏️ Completa', esCompleta]);
      if (arr(L.abbina).length >= 3) schede.push(['abbina', '🔗 Abbina', esAbbina]);
      if (haSeq) schede.push(['ordina', '🔢 In ordine', esOrdina]);
      var fatteEs = stato.esercizi || (stato.esercizi = {});
      el.innerHTML = '<h2>Allenati</h2><p class="st-sot">Scegli tu da dove partire. Se sbagli non perdi niente: leggi la spiegazione e riprova.</p>' +
        '<div class="st-schede" role="tablist">' + schede.map(function (s, i) { return '<button type="button" role="tab" data-s="' + i + '" class="' + (fatteEs[s[0]] ? 'fatta' : '') + '">' + s[1] + '</button>'; }).join('') + '</div><div id="st-es"></div>';
      var box = el.querySelector('#st-es');
      function apri(i) {
        zitto();
        el.querySelectorAll('.st-schede button').forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        schede[i][2](box, function () {
          fatteEs[schede[i][0]] = true; salva();
          el.querySelectorAll('.st-schede button')[i].classList.add('fatta');
          var dopo = schede.filter(function (s) { return !fatteEs[s[0]]; })[0];
          if (!dopo) { fatta('allena'); coriandoli(); }
          box.insertAdjacentHTML('beforeend', '<div class="st-azioni">' + (dopo ? '<button type="button" class="st-btn pieno" data-s2="' + schede.indexOf(dopo) + '">Prossimo: ' + dopo[1] + ' →</button>' : '') +
            '<button type="button" class="st-btn' + (dopo ? '' : ' pieno') + '" data-avanti="' + (dopo ? '' : 'allena') + '">' + (dopo ? 'Salta alle flashcard' : 'Tutto fatto! Flashcard →') + '</button></div>');
          var s2 = box.querySelector('[data-s2]'); if (s2) s2.onclick = function () { apri(+s2.getAttribute('data-s2')); };
        });
      }
      el.querySelectorAll('.st-schede button').forEach(function (b) { b.onclick = function () { apri(+b.getAttribute('data-s')); }; });
      if (schede.length) apri(Math.max(0, schede.findIndex(function (s) { return !fatteEs[s[0]]; })));
    }
    /* una sequenza di domande a scelta con spiegazione */
    function serie(box, domande, fine, opz) {
      opz = opz || {};
      var k = 0, giuste = 0;
      function una() {
        if (k >= domande.length) {
          box.innerHTML = '<div class="st-card st-finale st-entra"><div class="st-medaglia">' + (giuste === domande.length ? '🏅' : '👍') + '</div><h2>' + giuste + ' su ' + domande.length + ' al primo colpo</h2><p class="st-sot">' + (giuste === domande.length ? 'Perfetto, niente da aggiungere!' : 'Ottimo lavoro: gli errori di oggi sono le risposte giuste di domani.') + '</p></div>';
          return fine && fine(giuste);
        }
        var d = domande[k], primo = true;
        box.innerHTML = '<div class="st-card st-entra">' + tastoVoce(d.voce || d.dom) + '<p class="st-cont">' + (k + 1) + ' / ' + domande.length + '</p>' +
          '<div class="st-barra-p"><i style="width:' + (k / domande.length * 100) + '%"></i></div><p class="st-dom">' + d.html + '</p>' +
          '<div class="' + (d.vf ? 'st-vf' : d.chips ? 'st-chips' : 'st-scelte') + '">' + d.opz.map(function (o, i) { return '<button type="button" class="st-scelta" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="st-esito" aria-live="polite"></div></div>';
        box.querySelectorAll('.st-scelta').forEach(function (b) {
          b.onclick = function () {
            var i = +b.getAttribute('data-i'), esito = box.querySelector('.st-esito');
            if (i === d.giusta) {
              box.querySelectorAll('.st-scelta').forEach(function (x) { x.disabled = true; });
              b.classList.add('ok'); if (primo) { giuste++; punti(10); } else punti(4);
              if (d.buco) { var bu = box.querySelector('.st-buco'); bu.textContent = d.opz[i]; bu.classList.add('ok'); }
              toast(pesca(BRAVO));
              esito.innerHTML = (d.spiega ? '<div class="st-spiega ok">✅ ' + esc(d.spiega) + '</div>' : '') + '<div class="st-azioni"><button type="button" class="st-btn pieno">Avanti →</button></div>';
              esito.querySelector('button').onclick = function () { k++; una(); };
              esito.querySelector('button').focus();
            } else {
              b.classList.add('no'); b.disabled = true;
              if (primo && d.spiega && opz.aiuto !== false) esito.innerHTML = '<div class="st-spiega no">🤔 ' + pesca(DAI) + '</div>';
              primo = false;
            }
          };
        });
      }
      una();
    }
    function esQuiz(box, fine) {
      serie(box, mescola(arr(L.quiz)).map(function (q) {
        var ord = mescola(q.opzioni.map(function (_, i) { return i; }));
        return { dom: q.domanda + '. ' + ord.map(function (i, n) { return 'Risposta ' + (n + 1) + ': ' + q.opzioni[i]; }).join('. '), html: esc(q.domanda), opz: ord.map(function (i) { return q.opzioni[i]; }), giusta: ord.indexOf(q.corretta), spiega: q.spiegazione };
      }), fine);
    }
    function esVF(box, fine) {
      serie(box, mescola(arr(L.vero_falso)).map(function (q) {
        return { dom: 'Vero o falso? ' + q.affermazione, html: esc(q.affermazione), opz: ['👍 Vero', '👎 Falso'], giusta: q.vero ? 0 : 1, spiega: (q.vero ? 'Vero. ' : 'Falso. ') + (q.spiegazione || ''), vf: true };
      }), fine);
    }
    function esCompleta(box, fine) {
      serie(box, mescola(arr(L.completa)).map(function (q) {
        var opz = mescola([q.risposta].concat(arr(q.distrattori).slice(0, 3)));
        var parti = String(q.frase).split(/_{2,}/);
        return { dom: String(q.frase).replace(/_{2,}/, ' … '), html: esc(parti[0]) + '<span class="st-buco">?</span>' + esc(parti.slice(1).join(' ')), opz: opz, giusta: opz.indexOf(q.risposta), chips: true, buco: true };
      }), fine);
    }
    function esAbbina(box, fine) {
      var C = mescola(arr(L.abbina)).slice(0, 6), sx = mescola(C), dx = mescola(C), sel = null, fatti = 0, errori = 0;
      box.innerHTML = '<div class="st-card st-entra"><p class="st-dom" style="padding:0">Tocca un elemento a sinistra, poi quello che gli corrisponde a destra.</p><div class="st-abbina"><div class="col">' +
        sx.map(function (c) { return '<button type="button" class="st-scelta" data-sx="' + C.indexOf(c) + '">' + esc(c.sinistra) + '</button>'; }).join('') + '</div><div class="col">' +
        dx.map(function (c) { return '<button type="button" class="st-scelta" data-dx="' + C.indexOf(c) + '">' + esc(c.destra) + '</button>'; }).join('') + '</div></div><div class="st-esito"></div></div>';
      box.querySelectorAll('[data-sx]').forEach(function (b) {
        b.onclick = function () { box.querySelectorAll('[data-sx]').forEach(function (x) { x.classList.remove('sel'); }); sel = b; b.classList.add('sel'); };
      });
      box.querySelectorAll('[data-dx]').forEach(function (b) {
        b.onclick = function () {
          if (!sel) return toast('Prima scegli a sinistra 👈');
          if (sel.getAttribute('data-sx') === b.getAttribute('data-dx')) {
            [sel, b].forEach(function (x) { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
            sel = null; fatti++; punti(6); toast(pesca(BRAVO));
            if (fatti === C.length) { box.querySelector('.st-esito').innerHTML = '<div class="st-spiega ok">🎉 Tutte le coppie trovate' + (errori ? ' (' + errori + ' tentativi a vuoto)' : ' senza errori!') + '</div>'; fine(); }
          } else { errori++; b.classList.add('no'); setTimeout(function () { b.classList.remove('no'); }, 450); }
        };
      });
    }
    function esOrdina(box, fine) {
      var P = arr(L.sequenza.passi), ord = mescola(P.map(function (_, i) { return i; }));
      if (ord.every(function (v, i) { return v === i; })) ord.reverse();
      function disegna(controllato) {
        box.innerHTML = '<div class="st-card st-entra"><p class="st-dom" style="padding:0">' + esc(L.sequenza.titolo || 'Metti in ordine') + '</p><p class="st-nota">Usa le frecce per spostare i passaggi.</p><ol class="st-ordina">' +
          ord.map(function (v, i) {
            return '<li class="' + (controllato ? (v === i ? 'ok' : 'no') : '') + '"><span>' + esc(P[v]) + '</span><button type="button" data-su="' + i + '" aria-label="Sposta su"' + (i ? '' : ' disabled') + '>↑</button><button type="button" data-giu="' + i + '" aria-label="Sposta giù"' + (i < ord.length - 1 ? '' : ' disabled') + '>↓</button></li>';
          }).join('') + '</ol><div class="st-azioni"><button type="button" class="st-btn pieno" id="st-ctrl">Controlla</button></div><div class="st-esito"></div></div>';
        box.querySelectorAll('[data-su],[data-giu]').forEach(function (b) {
          b.onclick = function () {
            var i = +(b.getAttribute('data-su') || b.getAttribute('data-giu')), j = b.hasAttribute('data-su') ? i - 1 : i + 1, t = ord[i]; ord[i] = ord[j]; ord[j] = t; disegna();
            box.querySelector('[data-' + (j < i ? 'su' : 'giu') + '="' + j + '"]') && box.querySelector('[data-' + (j < i ? 'su' : 'giu') + '="' + j + '"]').focus();
          };
        });
        box.querySelector('#st-ctrl').onclick = function () {
          var giusti = ord.filter(function (v, i) { return v === i; }).length;
          disegna(true);
          if (giusti === ord.length) { punti(15); toast('Sequenza perfetta! 🔢'); box.querySelector('#st-ctrl').remove(); box.querySelector('.st-esito').innerHTML = '<div class="st-spiega ok">🎉 Tutto nell\'ordine giusto!</div>'; fine(); }
          else box.querySelector('.st-esito').innerHTML = '<div class="st-spiega no">' + giusti + ' su ' + ord.length + ' al posto giusto (in verde). Sposta quelli rossi e ricontrolla.</div>';
        };
      }
      disegna();
    }

    /* ═══ 5. FLASHCARD (ripetizione: le carte sbagliate tornano) ═══ */
    function tappaFlash(el) {
      var F = arr(L.flashcard), mazzo = mescola(F.map(function (_, i) { return i; })), sapute = 0, giri = 0;
      function disegna() {
        if (!mazzo.length) {
          el.innerHTML = '<h2>Flashcard</h2><div class="st-card st-finale st-entra"><div class="st-medaglia">🃏</div><h2>Mazzo finito!</h2><p class="st-sot">' + F.length + ' carte imparate in ' + giri + ' giri.</p></div>' + avanti('flash', 'Alla sfida finale →');
          coriandoli(); return;
        }
        var c = F[mazzo[0]];
        el.innerHTML = '<h2>Flashcard</h2><p class="st-sot">Leggi la domanda, rispondi <b>ad alta voce</b>, poi gira la carta. Sii onesto/a: le carte che non sai tornano in fondo al mazzo.</p>' +
          '<div class="st-mazzo"><span>🃏 Nel mazzo: ' + mazzo.length + '</span><span>✅ Sapute: ' + sapute + '/' + F.length + '</span></div>' +
          '<button type="button" class="st-giro st-flash st-entra" id="st-carta"><span class="in"><span class="f">' + esc(c.fronte) + '</span><span class="b">' + esc(c.retro) + '</span></span></button>' +
          '<div class="st-azioni" style="justify-content:center" id="st-fa"><button type="button" class="st-btn" data-leggi="' + esc(c.fronte) + '">🔊 Ascolta</button><button type="button" class="st-btn oro" id="st-gira">Gira la carta</button></div>';
        var carta = el.querySelector('#st-carta');
        function gira() {
          carta.classList.add('girata');
          el.querySelector('#st-fa').innerHTML = '<button type="button" class="st-btn" id="st-no">↻ Ripassala</button><button type="button" class="st-btn pieno" id="st-si">✓ La sapevo</button>';
          el.querySelector('#st-no').onclick = function () { mazzo.push(mazzo.shift()); giri++; disegna(); };
          el.querySelector('#st-si').onclick = function () { mazzo.shift(); sapute++; giri++; punti(3); disegna(); };
        }
        carta.onclick = gira; el.querySelector('#st-gira').onclick = gira;
      }
      if (!F.length) { el.innerHTML = '<h2>Flashcard</h2><p class="st-sot">Questa lezione non ha flashcard.</p>' + avanti('flash'); return; }
      disegna();
    }

    /* ═══ 6. SFIDA FINALE: un po' di tutto, in ordine sparso ═══ */
    function tappaSfida(el) {
      var pool = [];
      arr(L.quiz).forEach(function (q) { pool.push({ q: q, t: 'quiz' }); });
      arr(L.vero_falso).forEach(function (q) { pool.push({ q: q, t: 'vf' }); });
      arr(L.completa).forEach(function (q) { pool.push({ q: q, t: 'completa' }); });
      var scelte = mescola(pool).slice(0, 10);
      el.innerHTML = '<h2>La sfida finale</h2><p class="st-sot">10 domande miste. Niente fretta, niente timer: conta solo azzeccarle al primo colpo.</p><div id="st-sf"></div>';
      var box = el.querySelector('#st-sf');
      serie(box, scelte.map(function (x) {
        var q = x.q;
        if (x.t === 'vf') return { dom: 'Vero o falso? ' + q.affermazione, html: '<small class="st-cont">Vero o falso?</small><br>' + esc(q.affermazione), opz: ['👍 Vero', '👎 Falso'], giusta: q.vero ? 0 : 1, spiega: q.spiegazione, vf: true };
        if (x.t === 'completa') {
          var o = mescola([q.risposta].concat(arr(q.distrattori).slice(0, 3))), p = String(q.frase).split(/_{2,}/);
          return { dom: String(q.frase).replace(/_{2,}/, ' … '), html: esc(p[0]) + '<span class="st-buco">?</span>' + esc(p.slice(1).join(' ')), opz: o, giusta: o.indexOf(q.risposta), chips: true, buco: true };
        }
        var ord = mescola(q.opzioni.map(function (_, i) { return i; }));
        return { dom: q.domanda, html: esc(q.domanda), opz: ord.map(function (i) { return q.opzioni[i]; }), giusta: ord.indexOf(q.corretta), spiega: q.spiegazione };
      }), function (giuste) {
        var n = scelte.length, stelle = giuste >= n ? 3 : giuste >= n * 0.7 ? 2 : 1;
        stato.sfida = Math.max(stato.sfida || 0, giuste); fatta('sfida'); punti(stelle * 10); coriandoli();
        box.innerHTML = '<div class="st-card st-finale st-entra"><div class="st-medaglia">' + ['', '🥉', '🥈', '🥇'][stelle] + '</div>' +
          '<div class="st-stelle">' + [0, 1, 2].map(function (k) { return '<span style="animation-delay:' + (0.3 + k * 0.25) + 's">' + (k < stelle ? '⭐' : '☆') + '</span>'; }).join('') + '</div>' +
          '<h2>' + giuste + ' su ' + n + ' al primo colpo!</h2><p class="st-sot">' + (stelle === 3 ? 'Sei pronto/a per l\'interrogazione. 💪' : stelle === 2 ? 'Ci sei quasi: ripassa le flashcard e riprova.' : 'Rifai il giro delle idee e dei trucchi, poi ritenta: andrà meglio.') + '</p>' +
          '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn" data-tappa="5">↺ Riprova</button><button type="button" class="st-btn pieno" data-avanti="sfida">Le cose da ricordare →</button></div></div>';
      }, { aiuto: false });
    }

    /* ═══ 7. DA RICORDARE ═══ */
    function tappaRicorda(el) {
      var R = arr(L.da_ricordare);
      var tot = TAPPE.length - 1, fatte = TAPPE.filter(function (t) { return stato.fatte[t.id]; }).length;
      el.innerHTML = '<h2>Le cose da ricordare</h2><p class="st-sot">Se ti resta in testa solo questo, sei a posto. Ascoltale prima di dormire: il sonno fissa i ricordi.</p>' +
        '<div class="st-card st-entra">' + tastoVoce(R.join('. ')) + '<ol class="st-ricorda">' + R.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="st-card st-finale st-entra"><div class="st-medaglia">' + (L.icona || '🎓') + '</div><h2>' + esc(L.titolo) + '</h2><p class="st-sot">Tappe completate: ' + Math.min(fatte, tot) + ' di ' + tot + ' · ⭐ ' + stato.punti + ' punti' + (stato.sfida ? ' · sfida ' + stato.sfida + '/10' : '') + '</p>' +
        '<p class="st-nota">🔁 <b>Il trucco del ripasso</b>: torna su questa lezione <b>domani</b>, poi <b>tra 3 giorni</b> e <b>tra una settimana</b>. Bastano 5 minuti di flashcard: è così che si ricorda per sempre.</p>' +
        '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn" data-tappa="4">🃏 Ripassa con le flashcard</button><button type="button" class="st-btn" id="st-azzera">↺ Ricomincia da zero</button></div></div>';
      fatta('ricorda');
      el.querySelector('#st-azzera').onclick = function () { FINESTRA.chiedi({ titolo: 'Ricominciare da zero?', testo: 'Tappe fatte e punti di questa lezione si cancellano.', si: 'Ricomincia', pericolo: true }).then(function (ok) { if (ok) { stato = { fatte: {}, punti: 0, vista: 0 }; salva(); radice.querySelector('.st-punti b').textContent = 0; vai(0, true); } }); };
    }

    vai(corrente);
  }

  /* anche per i formati (studio/formati.js): escape room, mappa, sfida a squadre */
  return { avvia: avvia, esc: esc, toast: toast, mescola: mescola, pesca: pesca, coriandoli: coriandoli, leggi: leggi, zitto: zitto, tastoVoce: tastoVoce, BRAVO: BRAVO };
})();
