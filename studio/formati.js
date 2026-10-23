/* ════════════════════════════════════════════════════════
   SALA STUDIO — altri modi di studiare la stessa lezione
   Nessun lavoro in più per il docente: tutto nasce dal JSON che la lezione ha già
   (quiz, vero_falso, completa, abbina, sequenza, concetti, mnemonica).
   FORMATI.escape(lezione, el)   🔐 Escape room: lucchetti da aprire, una lettera per lucchetto, la porta finale
   FORMATI.mappa(lezione, el)    🗺️ Costruisci la mappa: ogni idea al suo posto (con aiuti, poi a memoria)
   FORMATI.squadre(lezione, el)  🏆 Sfida a squadre alla LIM: turni, rubapalla, classifica
   Usa gli aiutanti di STUDIO (studio/studio.js).
   ════════════════════════════════════════════════════════ */
window.FORMATI = (function () {
  'use strict';
  var S = window.STUDIO, esc = S.esc, mescola = S.mescola, toast = S.toast;
  function arr(x) { return Array.isArray(x) ? x : []; }

  /* il riquadro «Come funziona», uguale per tutti i formati: niente è dato per scontato */
  function comeFunziona(ic, titolo, frase, passi, pulsante) {
    return '<div class="st-card fm-intro st-entra"><div class="fm-ic" aria-hidden="true">' + ic + '</div><h2>' + esc(titolo) + '</h2>' +
      (frase ? '<p class="st-sot">' + frase + '</p>' : '') +
      '<h3 class="fm-come">Come funziona</h3><ol class="fm-passi">' + passi.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>' +
      '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn oro fm-via">' + pulsante + '</button></div></div>';
  }

  /* ───── le domande, prese dalla lezione ───── */
  function daQuiz(q) {
    var ord = mescola(arr(q.opzioni).map(function (_, i) { return i; }));
    return { testo: q.domanda, opz: ord.map(function (i) { return q.opzioni[i]; }), giusta: ord.indexOf(q.corretta), spiega: q.spiegazione };
  }
  function daVF(q) { return { testo: q.affermazione, opz: ['👍 Vero', '👎 Falso'], giusta: q.vero ? 0 : 1, spiega: (q.vero ? 'Vero. ' : 'Falso. ') + (q.spiegazione || ''), vf: true }; }
  function daCompleta(q) {
    var opz = mescola([q.risposta].concat(arr(q.distrattori).slice(0, 3))), p = String(q.frase || '').split(/_{2,}/);
    return { testo: String(q.frase || '').replace(/_{2,}/, ' … '), html: esc(p[0]) + '<span class="st-buco">?</span>' + esc(p.slice(1).join(' ')), opz: opz, giusta: opz.indexOf(q.risposta), chips: true, buco: true };
  }
  /* «di quale idea parla?»: funziona con qualsiasi lezione, perché le idee chiave ci sono sempre */
  function daConcetti(C) {
    return mescola(C).map(function (c) {
      var altri = mescola(C.filter(function (x) { return x !== c; })).slice(0, 2), opz = mescola([c].concat(altri));
      return { testo: 'Di quale idea parla questa frase? «' + c.spiegazione + '»', html: '<small class="st-cont">Di quale idea parla?</small><br>«' + esc(c.spiegazione) + '»', opz: opz.map(function (x) { return x.titolo; }), giusta: opz.indexOf(c) };
    });
  }

  /* una serie di domande: si va avanti solo con la risposta giusta; dopo un errore arriva l'aiuto */
  function serie(box, domande, fatto, conto) {
    var k = 0;
    function una() {
      if (k >= domande.length) return fatto();
      var d = domande[k], sbagliate = 0;
      box.innerHTML = '<div class="fm-dom st-entra">' + S.tastoVoce(d.testo + '. ' + d.opz.join('. ')) +
        '<p class="st-cont">' + (k + 1) + ' di ' + domande.length + '</p><p class="st-dom">' + (d.html || esc(d.testo)) + '</p>' +
        '<div class="' + (d.vf ? 'st-vf' : d.chips ? 'st-chips' : 'st-scelte') + '">' + d.opz.map(function (o, i) { return '<button type="button" class="st-scelta" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>' +
        '<div class="st-esito" aria-live="polite"></div></div>';
      box.querySelectorAll('.st-scelta').forEach(function (b) {
        b.onclick = function () {
          var i = +b.getAttribute('data-i'), esito = box.querySelector('.st-esito');
          if (i === d.giusta) {
            box.querySelectorAll('.st-scelta').forEach(function (x) { x.disabled = true; });
            b.classList.add('ok'); toast(S.pesca(S.BRAVO));
            if (d.buco) { var bu = box.querySelector('.st-buco'); bu.textContent = d.opz[i]; bu.classList.add('ok'); }
            setTimeout(function () { k++; una(); }, d.spiega && sbagliate ? 1600 : 900);
          } else {
            b.classList.add('no'); b.disabled = true; sbagliate++; if (conto) conto();
            esito.innerHTML = '<div class="st-spiega no">🤔 Non è questa. ' + (d.spiega ? '<br>💡 Aiuto: ' + esc(d.spiega) : 'Rileggi con calma e riprova.') + '</div>';
          }
        };
      });
    }
    una();
  }
  function abbina(box, coppie, fatto, conto) {
    var C = mescola(coppie), sx = mescola(C), dx = mescola(C), sel = null, n = 0;
    box.innerHTML = '<div class="fm-dom st-entra"><p class="st-dom" style="padding:0">Tocca un elemento a sinistra, poi quello che gli corrisponde a destra.</p><div class="st-abbina"><div class="col">' +
      sx.map(function (c) { return '<button type="button" class="st-scelta" data-sx="' + C.indexOf(c) + '">' + esc(c.sinistra) + '</button>'; }).join('') + '</div><div class="col">' +
      dx.map(function (c) { return '<button type="button" class="st-scelta" data-dx="' + C.indexOf(c) + '">' + esc(c.destra) + '</button>'; }).join('') + '</div></div></div>';
    box.querySelectorAll('[data-sx]').forEach(function (b) { b.onclick = function () { box.querySelectorAll('[data-sx]').forEach(function (x) { x.classList.remove('sel'); }); sel = b; b.classList.add('sel'); }; });
    box.querySelectorAll('[data-dx]').forEach(function (b) {
      b.onclick = function () {
        if (!sel) return toast('Prima scegli a sinistra 👈');
        if (sel.getAttribute('data-sx') === b.getAttribute('data-dx')) {
          [sel, b].forEach(function (x) { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
          sel = null; n++; if (n === C.length) setTimeout(fatto, 700);
        } else { b.classList.add('no'); if (conto) conto(); setTimeout(function () { b.classList.remove('no'); }, 450); }
      };
    });
  }
  function ordina(box, titolo, passi, fatto, conto) {
    var ord = mescola(passi.map(function (_, i) { return i; }));
    if (ord.every(function (v, i) { return v === i; })) ord.reverse();
    function disegna(controllato) {
      box.innerHTML = '<div class="fm-dom st-entra"><p class="st-dom" style="padding:0">' + esc(titolo || 'Metti in ordine') + '</p><p class="st-nota">Usa le frecce ↑ ↓ per spostare i passaggi, poi premi «Prova la combinazione».</p><ol class="st-ordina">' +
        ord.map(function (v, i) {
          return '<li class="' + (controllato ? (v === i ? 'ok' : 'no') : '') + '"><span>' + esc(passi[v]) + '</span><button type="button" data-su="' + i + '" aria-label="Sposta su"' + (i ? '' : ' disabled') + '>↑</button><button type="button" data-giu="' + i + '" aria-label="Sposta giù"' + (i < ord.length - 1 ? '' : ' disabled') + '>↓</button></li>';
        }).join('') + '</ol><div class="st-azioni"><button type="button" class="st-btn pieno" data-prova>🔢 Prova la combinazione</button></div><div class="st-esito"></div></div>';
      box.querySelectorAll('[data-su],[data-giu]').forEach(function (b) {
        b.onclick = function () { var i = +(b.getAttribute('data-su') || b.getAttribute('data-giu')), j = b.hasAttribute('data-su') ? i - 1 : i + 1, t = ord[i]; ord[i] = ord[j]; ord[j] = t; disegna(); };
      });
      box.querySelector('[data-prova]').onclick = function () {
        var giusti = ord.filter(function (v, i) { return v === i; }).length;
        disegna(true);
        if (giusti === ord.length) { box.querySelector('[data-prova]').remove(); setTimeout(fatto, 700); }
        else { if (conto) conto(); box.querySelector('.st-esito').innerHTML = '<div class="st-spiega no">' + giusti + ' su ' + ord.length + ' al posto giusto (in verde). Sposta quelli rossi e riprova.</div>'; }
      };
    }
    disegna();
  }

  /* ═══════════════ 🔐 ESCAPE ROOM ═══════════════ */
  function lettere(L) {
    function pulisci(t) { return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, ''); }
    var A = (L.mnemonica || {}).acronimo || {}, p = pulisci(A.parola);
    if (p.length >= 3 && p.length <= 10) return { parola: p, aiuto: A.frase ? 'È la parola magica della lezione. Ricordi la frase? «' + A.frase + '»' : 'È la parola magica della lezione.' };
    var k = arr(L.concetti).map(function (c) { return pulisci(c.parola_chiave); }).filter(function (x) { return x.length >= 4 && x.length <= 9; })[0];
    if (k) return { parola: k, aiuto: 'È una delle parole chiave della lezione.' };
    return { parola: 'STUDIO', aiuto: 'È quello che stai facendo adesso!' };
  }
  function escape(L, R) {
    var C = arr(L.concetti), seg = lettere(L), prove = [], errori = 0, t0 = 0;
    var haSeq = L.sequenza && arr(L.sequenza.passi).length >= 3;
    function conto() { errori++; }
    if (arr(L.vero_falso).length >= 2) prove.push({ ic: '🖍️', nome: 'La lavagna dello chef', scena: 'Sulla lavagna lo chef ha scritto alcune frasi, ma qualcuna è falsa. Di\' tu quali sono vere e quali false.', gioca: function (b, f) { serie(b, mescola(arr(L.vero_falso)).slice(0, 3).map(daVF), f, conto); } });
    if (arr(L.completa).length >= 2) prove.push({ ic: '📜', nome: 'Il ricettario strappato', scena: 'Nel ricettario mancano delle parole. Rimetti ogni parola al suo posto.', gioca: function (b, f) { serie(b, mescola(arr(L.completa)).slice(0, 3).map(daCompleta), f, conto); } });
    if (arr(L.abbina).length >= 3) prove.push({ ic: '🗄️', nome: 'I cassetti delle spezie', scena: 'Le etichette sono cadute dai cassetti. Rimetti ogni etichetta sul cassetto giusto.', gioca: function (b, f) { abbina(b, mescola(arr(L.abbina)).slice(0, 4), f, conto); } });
    if (haSeq) prove.push({ ic: '🔢', nome: 'Il lucchetto a combinazione', scena: 'La combinazione è l\'ordine giusto. Metti i passaggi in fila.', gioca: function (b, f) { ordina(b, L.sequenza.titolo, arr(L.sequenza.passi), f, conto); } });
    if (C.length >= 3) prove.push({ ic: '📦', nome: 'Le scatole senza etichetta', scena: 'In dispensa ci sono scatole con una descrizione ma senza nome. Riconosci l\'idea giusta.', gioca: function (b, f) { serie(b, daConcetti(C).slice(0, 3), f, conto); } });
    if (arr(L.quiz).length >= 2) prove.push({ ic: '🧑‍🍳', nome: 'Lo chef guardiano', scena: 'Davanti alla porta c\'è lo chef. Prima di farti passare ti fa qualche domanda.', gioca: function (b, f) { serie(b, mescola(arr(L.quiz)).slice(0, 3).map(daQuiz), f, conto); } });
    prove = prove.slice(0, 5);
    /* le lettere della parola segreta, distribuite fra i lucchetti */
    var P = seg.parola.split(''), m = Math.min(prove.length, P.length), base = Math.floor(P.length / m), resto = P.length % m, da = 0;
    prove = prove.slice(0, m);
    prove.forEach(function (p, i) { var quante = base + (i < resto ? 1 : 0); p.lettere = P.slice(da, da + quante); da += quante; });
    var aperti = 0;

    R.innerHTML = '<div class="st-palco">' + comeFunziona('🔐', 'Chiusi in dispensa!', 'Lo chef ha chiuso la porta della dispensa e ha nascosto la chiave dietro <b>' + prove.length + ' lucchetti</b>. Per uscire devi dimostrare di sapere: <b>' + esc(L.titolo) + '</b>.', [
      'Apri i lucchetti <b>uno alla volta</b>, nell\'ordine. Ognuno è una piccola prova sulla lezione.',
      'Se sbagli non succede niente: compare un <b>aiuto</b> e riprovi. Nessun timer ti mette fretta.',
      'Ogni lucchetto aperto ti regala <b>una lettera</b>. Alla fine metti in ordine le lettere e la porta si apre.'
    ], 'Entra nella dispensa →') + '</div>';
    R.querySelector('.fm-via').onclick = function () { t0 = Date.now(); stanza(); };

    function stanza() {
      S.zitto();
      var trovate = [].concat.apply([], prove.slice(0, aperti).map(function (p) { return p.lettere; }));
      R.innerHTML = '<div class="st-palco"><h2>🔐 La dispensa</h2><p class="st-sot">' + (aperti < prove.length ? 'Tocca il lucchetto acceso per aprirlo.' : 'Tutti i lucchetti sono aperti: ora la porta!') + '</p>' +
        '<div class="fm-lettere" aria-label="Lettere trovate">' + P.map(function (_, i) { return '<span class="' + (i < trovate.length ? 'si' : '') + '">' + (i < trovate.length ? esc(trovate[i]) : '?') + '</span>'; }).join('') + '</div>' +
        '<div class="fm-lucchetti">' + prove.map(function (p, i) {
          var stato = i < aperti ? 'aperto' : i === aperti ? 'pronto' : 'chiuso';
          return '<button type="button" class="fm-lucchetto ' + stato + '" data-l="' + i + '"' + (stato === 'pronto' ? '' : ' disabled') + '>' +
            '<span class="ic" aria-hidden="true">' + (stato === 'aperto' ? '🔓' : '🔒') + '</span><span class="n">' + (i + 1) + '. ' + esc(p.nome) + '</span>' +
            '<small>' + (stato === 'aperto' ? 'Aperto: lettera ' + esc(p.lettere.join(' ')) : stato === 'pronto' ? 'Tocca per aprirlo' : 'Prima apri quello prima') + '</small></button>';
        }).join('') +
        '<button type="button" class="fm-lucchetto porta ' + (aperti >= prove.length ? 'pronto' : 'chiuso') + '" data-porta' + (aperti >= prove.length ? '' : ' disabled') + '><span class="ic" aria-hidden="true">🚪</span><span class="n">La porta</span><small>' + (aperti >= prove.length ? 'Tocca per uscire' : 'Si apre con tutte le lettere') + '</small></button>' +
        '</div></div>';
      var b = R.querySelector('.fm-lucchetto.pronto'); if (b) b.focus();
      R.querySelectorAll('[data-l]').forEach(function (x) { x.onclick = function () { prova(+x.getAttribute('data-l')); }; });
      var porta = R.querySelector('[data-porta]'); if (porta) porta.onclick = finale;
    }
    function prova(i) {
      var p = prove[i];
      R.innerHTML = '<div class="st-palco"><div class="st-card st-entra fm-prova"><p class="st-cont">Lucchetto ' + (i + 1) + ' di ' + prove.length + '</p><h2><span aria-hidden="true">' + p.ic + '</span> ' + esc(p.nome) + '</h2><p class="st-sot">' + esc(p.scena) + '</p><div id="fm-gioco"></div>' +
        '<div class="st-azioni"><button type="button" class="st-btn" data-torna>← Torna alla dispensa</button></div></div></div>';
      R.querySelector('[data-torna]').onclick = stanza;
      p.gioca(R.querySelector('#fm-gioco'), function () {
        aperti = Math.max(aperti, i + 1);
        R.querySelector('#fm-gioco').innerHTML = '<div class="fm-premio st-entra"><div class="ic" aria-hidden="true">🔓</div><p>Lucchetto aperto! Hai trovato ' + (p.lettere.length > 1 ? 'le lettere' : 'la lettera') + '</p><div class="fm-lettere">' + p.lettere.map(function (l) { return '<span class="si">' + esc(l) + '</span>'; }).join('') + '</div>' +
          '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn pieno" data-avanti>' + (aperti < prove.length ? 'Al prossimo lucchetto →' : 'Alla porta! 🚪') + '</button></div></div>';
        R.querySelector('[data-torna]').hidden = true;
        R.querySelector('[data-avanti]').onclick = stanza; R.querySelector('[data-avanti]').focus();
      });
    }
    function finale() {
      var scelte = [], mazzo = mescola(P.map(function (l, i) { return { l: l, i: i }; }));
      if (mazzo.every(function (x, k) { return x.i === k; })) mazzo.reverse();
      function disegna() {
        R.innerHTML = '<div class="st-palco"><div class="st-card st-entra fm-prova"><h2><span aria-hidden="true">🚪</span> La porta</h2>' +
          '<p class="st-sot">Tocca le lettere nell\'ordine giusto per formare la parola segreta.</p>' +
          '<div class="fm-lettere grandi">' + P.map(function (_, i) { return '<span class="' + (scelte[i] ? 'si' : '') + '">' + (scelte[i] ? esc(scelte[i].l) : '_') + '</span>'; }).join('') + '</div>' +
          '<div class="fm-tessere">' + mazzo.map(function (x, k) { return '<button type="button" class="st-scelta" data-k="' + k + '"' + (scelte.indexOf(x) >= 0 ? ' disabled' : '') + '>' + esc(x.l) + '</button>'; }).join('') + '</div>' +
          '<div class="st-esito" aria-live="polite"></div>' +
          '<div class="st-azioni"><button type="button" class="st-btn" data-canc>↺ Ricomincia la parola</button><button type="button" class="st-btn" data-aiuto>💡 Un aiuto</button></div></div></div>';
        R.querySelectorAll('[data-k]').forEach(function (b) {
          b.onclick = function () {
            scelte.push(mazzo[+b.getAttribute('data-k')]); disegna();
            if (scelte.length === P.length) {
              if (scelte.map(function (x) { return x.l; }).join('') === seg.parola) return fuori();
              conto(); R.querySelector('.st-esito').innerHTML = '<div class="st-spiega no">🔒 La porta non si apre: l\'ordine non è giusto. Premi «Ricomincia la parola» e riprova.</div>';
            }
          };
        });
        R.querySelector('[data-canc]').onclick = function () { scelte = []; disegna(); };
        R.querySelector('[data-aiuto]').onclick = function () { R.querySelector('.st-esito').innerHTML = '<div class="st-spiega">💡 ' + esc(seg.aiuto) + '</div>'; };
      }
      disegna();
    }
    function fuori() {
      var min = Math.max(1, Math.round((Date.now() - t0) / 60000)), chiavi = errori <= 2 ? 3 : errori <= 6 ? 2 : 1;
      S.coriandoli();
      R.innerHTML = '<div class="st-palco"><div class="st-card st-finale st-entra"><div class="st-medaglia">🗝️</div><h2>Sei fuori dalla dispensa!</h2>' +
        '<p class="st-sot">La parola segreta era <b>' + esc(seg.parola) + '</b>.</p>' +
        '<div class="st-stelle">' + [0, 1, 2].map(function (k) { return '<span style="animation-delay:' + (0.3 + k * 0.25) + 's">' + (k < chiavi ? '🔑' : '▫️') + '</span>'; }).join('') + '</div>' +
        '<p class="st-nota">Circa ' + min + (min === 1 ? ' minuto' : ' minuti') + ' · ' + (errori ? errori + (errori === 1 ? ' tentativo a vuoto' : ' tentativi a vuoto') : 'nessun errore!') + '</p>' +
        '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn pieno" data-ancora>🔁 Rigioca (domande diverse)</button></div></div></div>';
      R.querySelector('[data-ancora]').onclick = function () { escape(L, R); };
    }
  }

  /* ═══════════════ 🗺️ COSTRUISCI LA MAPPA ═══════════════ */
  /* le 8 caselle intorno al centro di una griglia 3×3, in senso orario partendo dall'alto */
  var GIRO = [[1, 2], [1, 3], [2, 3], [3, 3], [3, 2], [3, 1], [2, 1], [1, 1]];
  function primaFrase(t) { var m = String(t || '').match(/^.*?[.!?](\s|$)/); return (m ? m[0] : String(t || '')).trim(); }
  function mappa(L, R, livello) {
    var C = arr(L.concetti).slice(0, 8), n = C.length, posti = {}, sel = null, errori = 0;
    if (n < 2) { R.innerHTML = '<div class="st-palco"><div class="st-card">Questa lezione ha troppe poche idee chiave per una mappa.</div></div>'; return; }
    var pos = C.map(function (_, i) { return GIRO[Math.round(i * 8 / n) % 8]; });
    function aiuto(c) {
      if (livello === 2) { var t = String(c.titolo || ''); return esc(c.emoji || '💡') + ' <b>' + esc(t.charAt(0)) + '</b>' + ' _'.repeat(Math.max(0, Math.min(12, t.replace(/\s/g, '').length - 1))); }
      return esc(c.emoji || '💡') + ' ' + esc(primaFrase(c.spiegazione));
    }
    function inizio() {
      R.innerHTML = '<div class="st-palco">' + comeFunziona('🗺️', livello === 2 ? 'La mappa a memoria' : 'Costruisci la mappa', livello === 2 ? 'Stessa mappa, ma senza le frasi di aiuto: solo l\'emoji e la prima lettera.' : 'Al centro c\'è l\'argomento. Intorno ci sono le caselle delle idee chiave, ma i nomi sono spariti.', [
        'Sotto la mappa trovi le <b>etichette</b> con i nomi delle idee.',
        'Tocca un\'<b>etichetta</b>, poi tocca la <b>casella</b> dove secondo te va messa.',
        'Se è giusta resta lì, verde. Se è sbagliata la casella trema e puoi riprovare.'
      ], 'Inizia la mappa →') + '</div>';
      R.querySelector('.fm-via').onclick = disegna;
    }
    function disegna() {
      var mancano = C.filter(function (c, i) { return !posti[i]; }).length;
      R.innerHTML = '<div class="st-palco"><h2>🗺️ ' + (livello === 2 ? 'La mappa a memoria' : 'Costruisci la mappa') + '</h2>' +
        '<p class="st-sot">' + (mancano ? 'Tocca un\'etichetta qui sotto, poi la casella giusta. Mancano <b>' + mancano + '</b>.' : 'Mappa completa! 🎉') + '</p>' +
        '<div class="fm-mappa">' +
          '<div class="fm-centro"><span aria-hidden="true">' + esc(L.icona || '📚') + '</span>' + esc(L.titolo) + '</div>' +
          C.map(function (c, i) {
            return '<button type="button" class="fm-nodo' + (posti[i] ? ' ok' : '') + '" data-n="' + i + '" style="--r:' + pos[i][0] + ';--c:' + pos[i][1] + '"' + (posti[i] ? ' disabled' : '') + '>' +
              (posti[i] ? '<b class="tit">' + esc(c.titolo) + '</b>' : '<span class="vuoto">?</span>') + '<span class="aiuto">' + aiuto(c) + '</span></button>';
          }).join('') +
        '</div>' +
        (mancano ? '<div class="fm-etichette" role="group" aria-label="Le etichette da mettere">' + mescola(C.map(function (c, i) { return i; }).filter(function (i) { return !posti[i]; })).map(function (i) {
          return '<button type="button" class="st-scelta' + (sel === i ? ' sel' : '') + '" data-e="' + i + '" aria-pressed="' + (sel === i) + '">' + esc(C[i].titolo) + '</button>';
        }).join('') + '</div>' : '') +
        '<div id="fm-fine"></div></div>';
      R.querySelectorAll('[data-e]').forEach(function (b) {
        b.onclick = function () {
          sel = +b.getAttribute('data-e');
          R.querySelectorAll('[data-e]').forEach(function (x) { var on = x === b; x.classList.toggle('sel', on); x.setAttribute('aria-pressed', on); });
          toast('Ora tocca la casella giusta 👆');
        };
      });
      R.querySelectorAll('[data-n]').forEach(function (b) {
        b.onclick = function () {
          if (sel === null) return toast('Prima tocca un\'etichetta qui sotto 👇');
          var i = +b.getAttribute('data-n');
          if (i === sel) { posti[i] = true; sel = null; toast(S.pesca(S.BRAVO)); disegna(); }
          else { errori++; b.classList.add('no'); setTimeout(function () { b.classList.remove('no'); }, 450); }
        };
      });
      if (!mancano) fine();
    }
    function fine() {
      S.coriandoli();
      var voce = L.titolo + '. ' + C.map(function (c) { return c.titolo + ': ' + c.spiegazione; }).join(' ');
      R.querySelector('#fm-fine').innerHTML = '<div class="st-card st-finale st-entra"><div class="st-medaglia">🗺️</div><h2>Mappa completata!</h2><p class="st-sot">' + (errori ? errori + (errori === 1 ? ' tentativo a vuoto' : ' tentativi a vuoto') : 'Nessun errore!') + '</p>' +
        '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn" data-leggi="' + esc(voce) + '">🔊 Ascolta la mappa</button>' +
        (livello === 2 ? '<button type="button" class="st-btn pieno" data-ancora>🔁 Rifai a memoria</button>' : '<button type="button" class="st-btn pieno" data-due>🧠 Livello 2: a memoria →</button>') + '</div></div>';
      var l = R.querySelector('[data-leggi]'); l.onclick = function () { S.leggi(l.getAttribute('data-leggi'), l); };
      var d = R.querySelector('[data-due]'); if (d) d.onclick = function () { mappa(L, R, 2); };
      var a = R.querySelector('[data-ancora]'); if (a) a.onclick = function () { mappa(L, R, 2); };
    }
    inizio();
  }

  /* ═══════════════ 🏆 SFIDA A SQUADRE (LIM) ═══════════════ */
  var SQUADRE = [['🔴', 'Rossi'], ['🔵', 'Blu'], ['🟢', 'Verdi'], ['🟡', 'Gialli']];
  function squadre(L, R) {
    var pool = arr(L.quiz).map(daQuiz).concat(arr(L.vero_falso).map(daVF));
    if (pool.length < 3) pool = pool.concat(daConcetti(arr(L.concetti)));
    var conf = { n: 2, domande: Math.min(10, pool.length), tempo: 0 }, gioco = null, timer = null;
    R.classList.add('fm-lim-radice');

    function impostazioni() {
      clearInterval(timer);
      var tagli = [6, 10, 15].filter(function (x) { return x < pool.length; }).concat(Math.min(pool.length, 20)); /* l'ultima scelta: tutte */
      if (tagli.indexOf(conf.domande) < 0) conf.domande = tagli.indexOf(10) >= 0 ? 10 : tagli[tagli.length - 1];
      R.innerHTML = '<div class="st-palco">' + comeFunziona('🏆', 'Sfida a squadre', 'Da fare <b>alla LIM</b> (o al proiettore) con tutta la classe, su: <b>' + esc(L.titolo) + '</b>.', [
        'Dividete la classe in squadre. A ogni domanda <b>tocca a una squadra</b>, a turno.',
        'La squadra risponde a voce; il docente <b>tocca sulla LIM</b> la risposta detta. Giusta: 1 punto.',
        'Se sbaglia, scatta il <b>rubapalla</b>: la squadra successiva può rispondere e prendersi il punto.'
      ], 'Prepara la sfida ↓') +
        '<div class="st-card fm-imp" id="fm-imp" hidden>' +
          '<h3>1. Quante squadre?</h3><div class="fm-scelte" data-g="n">' + [2, 3, 4].map(function (x) { return '<button type="button" aria-pressed="' + (conf.n === x) + '" data-v="' + x + '">' + x + '</button>'; }).join('') + '</div>' +
          '<div class="fm-nomi">' + SQUADRE.map(function (s, i) { return '<label' + (i < conf.n ? '' : ' hidden') + '><span aria-hidden="true">' + s[0] + '</span><input type="text" maxlength="20" value="' + esc(s[1]) + '" data-nome="' + i + '" aria-label="Nome della squadra ' + (i + 1) + '"/></label>'; }).join('') + '</div>' +
          '<h3>2. Quante domande?</h3><div class="fm-scelte" data-g="domande">' + tagli.map(function (x) { return '<button type="button" aria-pressed="' + (conf.domande === x) + '" data-v="' + x + '">' + x + '</button>'; }).join('') + '</div>' +
          '<h3>3. Tempo per rispondere</h3><div class="fm-scelte" data-g="tempo">' + [[0, 'Senza tempo'], [30, '30 secondi'], [60, '1 minuto']].map(function (x) { return '<button type="button" aria-pressed="' + (conf.tempo === x[0]) + '" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>' +
          '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn oro" data-parti>🏁 Si comincia!</button></div>' +
          '<p class="st-nota" style="text-align:center">Consiglio: premi <b>⛶ Schermo intero</b> durante la sfida, così si legge anche dal fondo dell\'aula.</p>' +
        '</div></div>';
      R.querySelector('.fm-via').onclick = function () { var b = R.querySelector('#fm-imp'); b.hidden = false; this.parentNode.remove(); b.scrollIntoView({ behavior: 'smooth' }); };
      R.querySelectorAll('.fm-scelte').forEach(function (g) {
        g.onclick = function (e) {
          var b = e.target.closest('[data-v]'); if (!b) return;
          conf[g.getAttribute('data-g')] = +b.getAttribute('data-v');
          g.querySelectorAll('[data-v]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
          R.querySelectorAll('.fm-nomi label').forEach(function (l, i) { l.hidden = i >= conf.n; });
        };
      });
      R.querySelector('[data-parti]').onclick = function () {
        var nomi = [].map.call(R.querySelectorAll('[data-nome]'), function (x, i) { return x.value.trim() || SQUADRE[i][1]; });
        gioco = { sq: SQUADRE.slice(0, conf.n).map(function (s, i) { return { ic: s[0], nome: nomi[i], punti: 0 }; }), dom: mescola(pool).slice(0, conf.domande), k: 0 };
        domanda();
      };
    }
    function tabellone(turno) {
      return '<div class="fm-tab">' + gioco.sq.map(function (s, i) { return '<div class="' + (i === turno ? 'turno' : '') + '"><span>' + s.ic + ' ' + esc(s.nome) + '</span><b>' + s.punti + '</b></div>'; }).join('') + '</div>';
    }
    function domanda() {
      clearInterval(timer);
      if (gioco.k >= gioco.dom.length) return podio();
      var d = gioco.dom[gioco.k], turno = gioco.k % gioco.sq.length, chi = turno, finita = false, LET = ['A', 'B', 'C', 'D'];
      R.innerHTML = '<div class="fm-lim">' +
        '<div class="fm-lim-su"><span>Domanda ' + (gioco.k + 1) + ' di ' + gioco.dom.length + '</span><button type="button" class="st-btn" data-schermo>⛶ Schermo intero</button></div>' +
        tabellone(turno) +
        '<p class="fm-turno" aria-live="polite">Risponde: <b>' + gioco.sq[turno].ic + ' ' + esc(gioco.sq[turno].nome) + '</b></p>' +
        (conf.tempo ? '<div class="fm-tempo"><i></i></div>' : '') +
        '<p class="fm-domanda">' + (d.vf ? '<small>Vero o falso?</small><br>' : '') + (d.html || esc(d.testo)) + '</p>' +
        '<div class="fm-opz' + (d.vf ? ' due' : '') + '">' + d.opz.map(function (o, i) { return '<button type="button" data-o="' + i + '"><span class="l">' + (d.vf ? '' : LET[i]) + '</span>' + esc(o) + '</button>'; }).join('') + '</div>' +
        '<div class="fm-esito" aria-live="polite"></div></div>';
      R.querySelector('[data-schermo]').onclick = schermo;
      if (conf.tempo) {
        var fine = Date.now() + conf.tempo * 1000, barra = R.querySelector('.fm-tempo i');
        timer = setInterval(function () {
          var resto = fine - Date.now(); barra.style.width = Math.max(0, resto / (conf.tempo * 10)) + '%';
          if (resto <= 0) { clearInterval(timer); if (!finita) svela('⏰ Tempo scaduto!'); }
        }, 200);
      }
      function svela(msg, chiPrende) {
        finita = true; clearInterval(timer);
        R.querySelectorAll('[data-o]').forEach(function (b) { b.disabled = true; if (+b.getAttribute('data-o') === d.giusta) b.classList.add('ok'); });
        if (chiPrende != null) { gioco.sq[chiPrende].punti++; S.coriandoli(); }
        R.querySelector('.fm-tab').outerHTML = tabellone(-1);
        R.querySelector('.fm-esito').innerHTML = '<p class="fm-msg">' + msg + '</p>' + (d.spiega ? '<p class="fm-spiega">💡 ' + esc(d.spiega) + '</p>' : '') +
          '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn oro" data-prossima>' + (gioco.k + 1 < gioco.dom.length ? 'Prossima domanda →' : 'Vediamo la classifica 🏆') + '</button></div>';
        var p = R.querySelector('[data-prossima]'); p.onclick = function () { gioco.k++; domanda(); }; p.focus();
      }
      R.querySelectorAll('[data-o]').forEach(function (b) {
        b.onclick = function () {
          if (finita) return;
          var i = +b.getAttribute('data-o');
          if (i === d.giusta) return svela('✅ Giusto! Un punto a ' + gioco.sq[chi].ic + ' ' + esc(gioco.sq[chi].nome), chi);
          b.classList.add('no'); b.disabled = true;
          var restano = R.querySelectorAll('[data-o]:not(:disabled)').length;
          if (chi === turno && gioco.sq.length > 1 && restano > 1) {
            chi = (turno + 1) % gioco.sq.length;
            R.querySelector('.fm-turno').innerHTML = '🔄 <b>Rubapalla!</b> Ora può rispondere: <b>' + gioco.sq[chi].ic + ' ' + esc(gioco.sq[chi].nome) + '</b>';
            R.querySelector('.fm-tab').outerHTML = tabellone(chi);
          } else svela('❌ Risposta sbagliata. Ecco quella giusta, in verde.');
        };
      });
    }
    function podio() {
      var ord = gioco.sq.slice().sort(function (a, b) { return b.punti - a.punti; }), top = ord[0].punti, vincitori = ord.filter(function (s) { return s.punti === top; });
      S.coriandoli();
      R.innerHTML = '<div class="fm-lim"><div class="st-medaglia" style="text-align:center">🏆</div><h2 class="fm-domanda" style="margin-top:0">' +
        (vincitori.length > 1 ? 'Pareggio!' : 'Vince la squadra ' + vincitori[0].ic + ' ' + esc(vincitori[0].nome) + '!') + '</h2>' +
        '<ol class="fm-podio">' + ord.map(function (s) { var pos = ord.filter(function (x) { return x.punti > s.punti; }).length; /* a pari punti, stessa medaglia */ return '<li><span>' + ['🥇', '🥈', '🥉', '4°'][pos] + '</span><span>' + s.ic + ' ' + esc(s.nome) + '</span><b>' + s.punti + '</b></li>'; }).join('') + '</ol>' +
        '<div class="st-azioni" style="justify-content:center"><button type="button" class="st-btn oro" data-ancora>🔁 Un\'altra partita</button></div></div>';
      R.querySelector('[data-ancora]').onclick = impostazioni;
    }
    function schermo() {
      var el = R.closest('main') || R;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen().catch(function () { toast('Questo browser non permette lo schermo intero'); });
      else toast('Questo browser non permette lo schermo intero');
    }
    /* tastiera della LIM: A B C D per le risposte, Invio per andare avanti */
    document.addEventListener('keydown', function tasti(e) {
      if (!document.body.contains(R)) return document.removeEventListener('keydown', tasti);
      if (!R.querySelector('.fm-lim') || /input|textarea|select/i.test((e.target.tagName || ''))) return;
      var k = 'ABCD'.indexOf(e.key.toUpperCase()), b = k >= 0 ? R.querySelector('[data-o="' + k + '"]') : null;
      if (b && !b.disabled) { e.preventDefault(); b.click(); }
    });
    impostazioni();
  }

  return { escape: escape, mappa: function (L, R) { mappa(L, R, 1); }, squadre: squadre };
})();
