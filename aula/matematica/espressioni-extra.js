/* ════════════════════════════════════════════════════════════
   AULA · Matematica · Espressioni con le frazioni: il caso del dolce, due trucchi, il servizio.
   Il taccuino (indizi sbloccati dalle sfide della pagina), il casaro e le 17 forme, le frazioni
   degli egizi, il servizio a sei comande con punteggio e sfida tra compagni (stessi ordini dallo stesso
   «seme», nessun nome e nessun invio). In localStorage solo gli indizi e il record, su questo dispositivo.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var E = window.ESPR;
  var P = window.ESPR_PAGINA = window.ESPR_PAGINA || {};
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mfr(n, d) { return '<mfrac><mn>' + n + '</mn><mn>' + d + '</mn></mfrac>'; }
  function M(x, blocco) { return '<math' + (blocco ? ' display="block"' : '') + '>' + x + '</math>'; }
  function F(n, d) { return M(d === 1 ? '<mn>' + n + '</mn>' : mfr(n, d)); }
  function fr(f) { return F(f.n, f.d); }
  function intero(s) { s = String(s == null ? '' : s).replace(/[\s.']/g, ''); return /^\d+$/.test(s) ? parseInt(s, 10) : null; }
  function leggiFr(n, d) {
    var a = intero(n), b = String(d).trim() === '' ? 1 : intero(d);
    return a === null || b === null || b === 0 ? null : { n: a, d: b };
  }
  function lsLeggi(k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }
  function lsScrivi(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ════════ IL CASO DEL DOLCE (taccuino) ════════ */
  var CH = 'mate-ef-indizi';
  var INDIZI = [
    { n: 1, sfida: 'L\'ultima fetta', ancora: '#ultima', cosa: 'Farina: 1/2 kg', nota: '«Si parte sempre dalla metà.»' },
    { n: 2, sfida: 'La frazione di una frazione', ancora: '#fettina', cosa: 'Burro: 1/3 kg', nota: '«Il burro è una frazione di una frazione: poco, ma al posto giusto.»' },
    { n: 3, sfida: 'Un problema, tre strade', ancora: '#strade', cosa: 'Zucchero: 1/4 kg', nota: '«Tre strade portano a Roma, ma qui ne basta una: la tua.»' },
    { n: 4, sfida: 'Le parentesi comandano', ancora: '#parentesi', cosa: 'Si prepara i 3/4 della dose', nota: '«Si legge prima dentro le parentesi, poi fuori.»' },
    { n: 5, sfida: 'Il metodo, una domanda alla volta', ancora: '#metodo', cosa: 'La dose si divide in 2 stampi', nota: '«Due stampi, stessa quantità: fai attenzione ai conti.»' }
  ];
  var sbloccati = lsLeggi(CH, []);
  function caDisegna() {
    var h = '';
    INDIZI.forEach(function (i) {
      var ok = sbloccati.indexOf(i.n) >= 0;
      h += '<li class="ef-slot' + (ok ? ' ok' : '') + '"><span class="ef-slot-n" aria-hidden="true">' + (ok ? '🔓' : '🔒') + '</span><div>' +
        (ok ? '<strong>' + esc(i.cosa) + '</strong><span class="ef-nota">' + esc(i.nota) + '</span>' : '<strong>Pezzo di biglietto ' + i.n + '</strong><span class="ef-nota">Si ritrova con la sfida <a href="aula/matematica/espressioni-frazioni.html' + i.ancora + '">«' + esc(i.sfida) + '»</a>.</span>') + '</div></li>';
    });
    $('ca-slots').innerHTML = h;
    var fin = $('ca-finale');
    if (sbloccati.length >= INDIZI.length) {
      fin.hidden = false;
      if (!fin.dataset.pronto) { fin.dataset.pronto = '1'; caFinale(fin); }
    } else fin.hidden = true;
  }
  var CA_T = E.O(':', E.O('×', E.O('+', E.O('+', E.N(1, 2), E.N(1, 4)), E.N(1, 3)), E.N(3, 4)), E.N(2, 1));
  function caFinale(fin) {
    var r = E.valore(CA_T);
    fin.innerHTML = '<div class="tt-fine"><p class="tt-et">Il biglietto è completo</p><p class="tt-q">Ricetta del dolce: farina 1/2 kg, burro 1/3 kg, zucchero 1/4 kg. Si prepara i 3/4 della dose e si divide in 2 stampi. <strong>Quanti kg di impasto vanno in ogni stampo?</strong></p><div class="tt-ctx">' + E.math(CA_T, null, true) + '</div>' +
      '<form class="mm-tf" id="cf-form" novalidate><div class="tt-fi"><label for="cf-n">Numeratore</label><input id="cf-n" type="text" inputmode="numeric" autocomplete="off"/><span class="fz-barra" aria-hidden="true"></span><label for="cf-d">Denominatore</label><input id="cf-d" type="text" inputmode="numeric" autocomplete="off"/></div><button type="submit" class="fz-btn">Controlla</button></form>' +
      '<p class="fz-fb" id="cf-fb" role="status"></p><div class="fz-azioni"><button type="button" class="fz-btn sec" id="cf-guida">Guidami passo passo</button></div></div>';
    $('cf-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = leggiFr($('cf-n').value, $('cf-d').value), f = $('cf-fb');
      if (!v) { f.className = 'fz-fb no'; f.textContent = 'Scrivi numeratore e denominatore con numeri interi.'; return; }
      if (v.n === r.n && v.d === r.d) { f.className = 'fz-fb si'; f.innerHTML = 'Esatto: ' + fr(r) + ' kg in ogni stampo. Il dolce del banchetto è salvo, e il pasticcere torna in cucina: «Chi sa dividere le fette sa dividere anche il lavoro». Bravo!'; }
      else if (v.n * r.d === r.n * v.d) { f.className = 'fz-fb mezzo'; f.textContent = 'Il valore è giusto, ma va ridotto ai minimi termini.'; }
      else { f.className = 'fz-fb no'; f.textContent = 'Non ancora. Parti dalla parentesi più interna: 1/2 + 1/4 + 1/3.'; }
    });
    $('cf-guida').addEventListener('click', function () { if (P.avviaTutor) P.avviaTutor(CA_T, true); });
  }
  P.indizio = function (k) {
    if (sbloccati.indexOf(k) >= 0) return '';
    sbloccati.push(k); lsScrivi(CH, sbloccati); caDisegna();
    var i = INDIZI[k - 1];
    $('ca-live').className = 'fz-fb si'; $('ca-live').textContent = 'Nuovo pezzo del biglietto ritrovato: ' + i.cosa + '.';
    return ' <span class="ef-sblocco">🔓 Pezzo di biglietto ritrovato: ' + esc(i.cosa) + ' (lo trovi nel caso, in alto).</span>';
  };
  caDisegna();

  /* ════════ IL CASARO E LE 17 FORME ════════ */
  $('ca-prova').addEventListener('click', function () {
    $('cz-out').innerHTML = '<ul class="ef-lista"><li>Metà di 17: ' + F(17, 2) + ' = 8,5 forme</li><li>Un terzo di 17: ' + F(17, 3) + ' = 5,666… forme</li><li>Un nono di 17: ' + F(17, 9) + ' = 1,888… forme</li></ul><p class="mm-p">Nessuna è un numero intero: bisognerebbe fare a pezzi le forme. I figli litigano.</p>';
    $('ca-presta').disabled = false;
  });
  $('ca-presta').addEventListener('click', function () {
    $('cz-out').innerHTML = '<p class="mm-p">Ora le forme sono <strong>18</strong>. Il vicino ha prestato la sua.</p><ul class="ef-lista"><li>Metà di 18: ' + F(9, 1) + ' forme al primo</li><li>Un terzo di 18: ' + F(6, 1) + ' forme al secondo</li><li>Un nono di 18: ' + F(2, 1) + ' forme al terzo</li></ul><p class="mm-p">In tutto 9 + 6 + 2 = <strong>17</strong>. Ne avanza una: è quella del vicino, che torna a casa sua. Tutti contenti, nessuna forma tagliata. Ma come è possibile?</p>';
    $('cz-somma').innerHTML = M('<mrow>' + mfr(1, 2) + '<mo>+</mo>' + mfr(1, 3) + '<mo>+</mo>' + mfr(1, 9) + '</mrow>');
    $('cz-form').hidden = false;
  });
  $('cz-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = leggiFr($('cz-n').value, $('cz-d').value), f = $('cz-fb');
    if (!v) { f.className = 'fz-fb no'; f.textContent = 'Scrivi numeratore e denominatore con numeri interi.'; return; }
    if (v.n === 17 && v.d === 18) f.className = 'fz-fb si', f.innerHTML = 'Esatto: ' + F(17, 18) + '. Le tre parti non fanno una forma intera: ne <strong>mancano</strong> ' + F(1, 18) + '. E ' + F(1, 18) + ' di 18 forme è proprio 1 forma: quella del vicino. Le frazioni nascondono un conto che ai figli sfuggiva.';
    else if (v.n * 18 === 17 * v.d) f.className = 'fz-fb mezzo', f.textContent = 'Il valore è giusto, ma va ridotto ai minimi termini.';
    else f.className = 'fz-fb no', f.innerHTML = 'Non ancora. Denominatore comune 18: ' + F(9, 18) + ' + ' + F(6, 18) + ' + ' + F(2, 18) + '.';
  });

  /* ════════ LE FRAZIONI DEGLI EGIZI ════════ */
  var EGF = [[2, 3], [3, 4], [5, 6], [3, 7], [7, 15], [4, 13]], EG = { passi: [], i: 0 };
  $('eg-fr').innerHTML = EGF.map(function (f, i) { return '<option value="' + i + '">' + f[0] + '/' + f[1] + '</option>'; }).join('');
  function egCalcola(n, d) {
    var r = E.red(n, d), passi = [];
    while (r.n !== 1 && passi.length < 8) {
      var k = Math.ceil(r.d / r.n), dopo = E.applica('−', r, { n: 1, d: k });
      passi.push({ prima: r, k: k, dopo: dopo }); r = dopo;
    }
    passi.push({ prima: r, k: r.d, dopo: null, ultimo: true });
    return passi;
  }
  function egDisegna() {
    var h = '', f = EGF[+$('eg-fr').value], n = EG.passi.length;
    for (var i = 0; i < EG.i; i++) {
      var p = EG.passi[i];
      h += '<p class="mm-p">' + (i + 1) + '. Resta ' + fr(p.prima) + '. ' + (p.ultimo ? 'È già una fetta «uno su qualcosa»: ' + F(1, p.k) + '. Fine!' : 'La fetta più grande che ci sta è ' + F(1, p.k) + ' (perché ' + F(1, p.k) + ' ≤ ' + fr(p.prima) + ' ma ' + F(1, p.k - 1) + ' è troppo grande). Togliendola resta ' + M('<mrow>' + mfr(p.prima.n, p.prima.d) + '<mo>−</mo>' + mfr(1, p.k) + '<mo>=</mo>' + (p.dopo.d === 1 ? '<mn>' + p.dopo.n + '</mn>' : mfr(p.dopo.n, p.dopo.d)) + '</mrow>') + '.') + '</p>';
    }
    if (EG.i >= n) {
      h += '<p class="mm-p"><strong>Risultato:</strong> ' + M('<mrow>' + mfr(f[0], f[1]) + '<mo>=</mo>' + EG.passi.map(function (p) { return mfr(1, p.k); }).join('<mo>+</mo>') + '</mrow>') + (n >= 3 ? ' Tre fette diverse per una frazione sola: gli scribi egizi facevano questi conti a mano.' : '') + '</p>';
    }
    $('eg-out').innerHTML = h;
    $('eg-passo').disabled = EG.i >= n;
  }
  function egNuovo() { var f = EGF[+$('eg-fr').value]; EG = { passi: egCalcola(f[0], f[1]), i: 0 }; egDisegna(); }
  $('eg-passo').addEventListener('click', function () { if (EG.i < EG.passi.length) { EG.i++; egDisegna(); } });
  $('eg-da-capo').addEventListener('click', egNuovo);
  $('eg-fr').addEventListener('change', egNuovo);
  egNuovo();
  var SF = [[3, 4, [2, 4]], [2, 3, [2, 6]], [5, 6, [2, 3]], [3, 10, [5, 10]]], SFI = 0;
  (function () { SFI = Math.floor(Math.random() * SF.length); $('eg-sf').innerHTML = F(SF[SFI][0], SF[SFI][1]); })();
  $('eg-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var a = intero($('eg-k1').value), b = intero($('eg-k2').value), f = $('eg-fb'), t = SF[SFI];
    if (!a || !b) { f.className = 'fz-fb no'; f.textContent = 'Scrivi due numeri interi, maggiori di zero.'; return; }
    if (a === b) { f.className = 'fz-fb no'; f.textContent = 'Le due fette devono essere diverse tra loro.'; return; }
    var s = E.applica('+', { n: 1, d: a }, { n: 1, d: b });
    if (s.n === t[0] && s.d === t[1]) { f.className = 'fz-fb si'; f.innerHTML = 'Esatto! ' + M('<mrow>' + mfr(t[0], t[1]) + '<mo>=</mo>' + mfr(1, a) + '<mo>+</mo>' + mfr(1, b) + '</mrow>') + ' Con il metodo di prima trovi la stessa scomposizione.'; }
    else { f.className = 'fz-fb no'; f.innerHTML = 'Con ' + M('<mrow>' + mfr(1, a) + '<mo>+</mo>' + mfr(1, b) + '</mrow>') + ' fai ' + fr(s) + ', non ' + F(t[0], t[1]) + '. Prova il metodo: prima la fetta più grande che ci sta.'; }
  });

  /* ════════ IL SERVIZIO ════════ */
  var PIATTI = [
    ['il risotto ai funghi', 'riso', 'kg'], ['la torta della nonna', 'farina', 'kg'], ['la crema pasticcera', 'latte', 'l'], ['le tagliatelle al ragù', 'passata di pomodoro', 'l'],
    ['la panna cotta', 'panna', 'l'], ['la pizza margherita', 'farina', 'kg'], ['il tiramisù', 'mascarpone', 'kg'], ['la zuppa di ceci', 'olio', 'l'], ['la carbonara', 'guanciale', 'kg'], ['il gelato al limone', 'zucchero', 'kg']
  ];
  var LIVELLI_SV = [1, 1, 2, 2, 3, 4], PUNTI = 100, TEMPO_MAX = 60;
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function conSeme(seed, fn) { var orig = Math.random; Math.random = mulberry(seed); try { return fn(); } finally { Math.random = orig; } }
  function costruisciServizio(seed) {
    return conSeme(seed, function () {
      var piatti = PIATTI.slice().sort(function () { return Math.random() - 0.5; }), tavoli = [], out = [];
      while (tavoli.length < 6) { var t = 1 + Math.floor(Math.random() * 20); if (tavoli.indexOf(t) < 0) tavoli.push(t); }
      LIVELLI_SV.forEach(function (liv, i) { out.push({ t: E.genera(liv), piatto: piatti[i], tavolo: tavoli[i], speciale: i === 5 }); });
      return out;
    });
  }
  var SV = null, svA = $('sv-area');
  var SEME_SFIDA = null;
  function nuovoSeme() { return 1000 + Math.floor(Math.random() * 8999000); }
  function svInizio(msg) {
    var rec = lsLeggi('mate-ef-record', {});
    svA.innerHTML = (SEME_SFIDA ? '<p class="fz-fb si">🤝 Sfida ricevuta: giochi gli stessi ordini del tuo compagno. Alla fine confrontate i punti.</p>' : '') + '<p class="mm-p">Sei comande, tutte diverse. <strong>Punti:</strong> 100 per ogni risposta giusta al primo colpo, 50 se serve un secondo tentativo, più un bonus per le comande di fila. Con il cronometro (facoltativo) c\'è anche un bonus velocità: lo vedi solo a fine comanda, nessun conto alla rovescia sullo schermo.</p><label class="fz-un"><input type="checkbox" id="sv-timer"/> Con il cronometro (bonus velocità)</label>' + (rec.n || rec.t ? '<p class="mm-p">Il tuo record su questo dispositivo: ' + (rec.n ? '<strong>' + rec.n + '</strong> punti' : '') + (rec.n && rec.t ? ' (senza cronometro), ' : '') + (rec.t ? '<strong>' + rec.t + '</strong> punti (con cronometro)' : '') + '.</p>' : '') + '<div class="fz-azioni"><button type="button" class="fz-btn" id="sv-via">Inizia il servizio</button></div>';
  }
  function svAvvia() {
    var seme = SEME_SFIDA || nuovoSeme();
    SV = { seme: seme, ordini: costruisciServizio(seme), i: 0, punti: 0, serie: 0, tent: 0, timer: $('sv-timer').checked, t0: Date.now(), risultati: [], fatto: false };
    svDisegna();
  }
  function svDisegna(msg, cls) {
    var n = SV.ordini.length;
    if (SV.i >= n) { svFine(); return; }
    var o = SV.ordini[SV.i];
    var h = '<div class="tt-prog"><span>Comanda ' + (SV.i + 1) + ' di ' + n + ' · punti: ' + SV.punti + (SV.serie > 1 ? ' · serie ' + SV.serie : '') + '</span><div class="tt-bar" role="img" aria-label="Fatte ' + SV.i + ' comande su ' + n + '"><i style="width:' + Math.round(100 * SV.i / n) + '%"></i></div></div>';
    h += '<div class="ef-ordine' + (o.speciale ? ' sp' : '') + '"><p class="tt-et">' + (o.speciale ? 'Ordine speciale dello chef' : 'Tavolo ' + o.tavolo) + '</p><p class="tt-q">' + (o.speciale ? 'Tavolo ' + o.tavolo + ': ' : '') + 'Per ' + esc(o.piatto[0]) + ' serve la quantità di ' + esc(o.piatto[1]) + ' (in ' + (o.piatto[2] === 'kg' ? 'kg' : 'litri') + ') data da:</p><div class="tt-ctx">' + E.math(o.t, null, true) + '</div>';
    if (!SV.fatto) h += '<form class="mm-tf" id="sv-f" novalidate><div class="tt-fi"><label for="sv-n">Numeratore</label><input id="sv-n" type="text" inputmode="numeric" autocomplete="off"/><span class="fz-barra" aria-hidden="true"></span><label for="sv-d">Denominatore</label><input id="sv-d" type="text" inputmode="numeric" autocomplete="off"/></div><button type="submit" class="fz-btn">Consegna</button></form><p class="mm-p" style="margin-top:.5rem">Intero? Lascia vuoto il denominatore.</p>';
    h += '<p class="fz-fb ' + (cls || '') + '" id="sv-fb" role="status">' + (msg || '') + '</p>';
    if (SV.fatto) h += '<div class="fz-azioni"><button type="button" class="fz-btn" id="sv-avanti">' + (SV.i + 1 >= n ? 'Vedi il voto' : 'Prossima comanda') + '</button>' + (SV.mostra ? '<button type="button" class="fz-btn sec" id="sv-come">Come si risolve</button>' : '') + '</div><div id="sv-sol"></div>';
    svA.innerHTML = h + '</div>';
    if (SV.fatto) svA.querySelector('#sv-avanti').focus();
  }
  function svSoluzione(t) {
    var c = E.costruisci(t), h = '<ol class="ef-ol">';
    c.passi.forEach(function (p) { if (p.tipo === 'frac') h += '<li>' + p.lav + ' <span class="ef-nota">' + p.spiega + '</span></li>'; });
    return h + '</ol>';
  }
  function svConsegna(v) {
    var o = SV.ordini[SV.i], r = E.valore(o.t), secondi = Math.round((Date.now() - SV.t0) / 1000);
    var ok = v.n === r.n && v.d === r.d, uguale = v.n * r.d === r.n * v.d;
    var f = $('sv-fb');
    if (ok) {
      var base = SV.tent === 0 ? PUNTI : 50, serie = SV.tent === 0 ? SV.serie : 0, bonus = SV.tent === 0 ? Math.min(serie, 5) * 10 : 0, tempo = 0;
      if (SV.timer && SV.tent === 0) tempo = Math.max(0, Math.round((TEMPO_MAX - secondi) / TEMPO_MAX * 50));
      var tot = base + bonus + tempo; SV.punti += tot; SV.serie = SV.tent === 0 ? SV.serie + 1 : 0; SV.risultati.push(tot);
      SV.fatto = true; SV.mostra = false;
      svDisegna('Comanda servita! ' + fr(r) + ' ' + (o.piatto[2] === 'kg' ? 'kg' : 'l') + '. +' + base + (bonus ? ' +' + bonus + ' serie' : '') + (SV.timer && SV.tent === 0 ? ' +' + tempo + ' velocità (' + secondi + ' s)' : '') + ' = ' + tot + ' punti.', 'si');
      return;
    }
    if (uguale) { f.className = 'fz-fb mezzo'; f.textContent = 'Il valore è giusto, ma la frazione va ridotta ai minimi termini. Riprova senza perdere altro.'; return; }
    SV.tent++;
    if (SV.tent >= 2) { SV.fatto = true; SV.mostra = true; SV.risultati.push(0); SV.serie = 0; svDisegna('Comanda sbagliata: la risposta era ' + fr(r) + '. Nessun punto, ma guarda come si risolve: la prossima ti viene meglio.', 'no'); return; }
    f.className = 'fz-fb no'; f.textContent = 'Non ancora. Hai un secondo tentativo (per metà dei punti).';
  }
  function svFine() {
    var max = LIVELLI_SV.length * PUNTI + (0 + 10 + 20 + 30 + 40 + 50) + (SV.timer ? LIVELLI_SV.length * 50 : 0), pct = SV.punti / max;
    var stelle = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    var voti = ['Il servizio è stato duro: rifallo e vedrai che va meglio.', 'Servizio sufficiente: qualche comanda da rivedere.', 'Ottimo servizio: la sala applaude.', 'Servizio perfetto: una brigata da stella!'];
    var rec = lsLeggi('mate-ef-record', {}), chiave = SV.timer ? 't' : 'n', nuovo = !rec[chiave] || SV.punti > rec[chiave];
    if (nuovo) { rec[chiave] = SV.punti; lsScrivi('mate-ef-record', rec); }
    var link = location.origin + location.pathname + '#sfida=' + SV.seme;
    var tempoTot = Math.round((Date.now() - SV.t0) / 1000);
    svA.innerHTML = '<div class="tt-fine"><p class="tt-et">Fine del servizio</p><p class="ef-stelle" role="img" aria-label="' + stelle + ' stelle su 3">' + '★'.repeat(stelle) + '☆'.repeat(3 - stelle) + '</p><p class="tt-q">' + SV.punti + ' punti su ' + max + (nuovo ? ' · nuovo record su questo dispositivo!' : '') + '</p><p class="tt-stat">' + voti[stelle] + (SV.timer ? ' Tempo totale: ' + tempoTot + ' secondi.' : '') + '</p>' +
      '<p class="mm-p"><strong>Sfida un compagno:</strong> manda questo link, avrà le stesse sei comande. Chi fa più punti vince la serata.</p><div class="ef-link"><label for="sv-link" class="vh">Link della sfida</label><input id="sv-link" type="text" readonly value="' + esc(link) + '"/><button type="button" class="fz-btn sec" id="sv-copia">Copia il link</button></div><p class="fz-fb" id="sv-cp" role="status"></p>' +
      '<div class="fz-azioni"><button type="button" class="fz-btn" id="sv-altro">Un altro servizio</button></div></div>';
  }
  svA.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = leggiFr($('sv-n').value, $('sv-d').value);
    if (!v) { var f = $('sv-fb'); f.className = 'fz-fb no'; f.textContent = 'Scrivi numeratore e denominatore con numeri interi.'; return; }
    svConsegna(v);
  });
  svA.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'sv-via') { svAvvia(); var i = $('sv-n'); if (i) i.focus(); return; }
    if (b.id === 'sv-avanti') { SV.i++; SV.fatto = false; SV.mostra = false; SV.tent = 0; SV.t0 = Date.now(); svDisegna(); var x = svA.querySelector('input,#sv-altro,button'); if (x) x.focus(); return; }
    if (b.id === 'sv-come') { $('sv-sol').innerHTML = '<div class="ef-pan">' + svSoluzione(SV.ordini[SV.i].t) + '</div>'; b.disabled = true; return; }
    if (b.id === 'sv-copia') {
      var el = $('sv-link'), msg = $('sv-cp');
      var ok = function () { msg.className = 'fz-fb si'; msg.textContent = 'Link copiato. Mandalo al tuo compagno.'; };
      var no = function () { el.focus(); el.select(); msg.className = 'fz-fb mezzo'; msg.textContent = 'Seleziona il link e copialo (tieni premuto o Ctrl+C).'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.value).then(ok, no); else no();
      return;
    }
    if (b.id === 'sv-altro') { SEME_SFIDA = null; history.replaceState(null, '', location.pathname); svInizio(); var v = svA.querySelector('#sv-via'); if (v) v.focus(); }
  });
  /* una sfida ricevuta con #sfida=numero */
  var m = /[#&]sfida=(\d{4,9})/.exec(location.hash || '');
  if (m) { SEME_SFIDA = +m[1]; }
  svInizio();
  if (SEME_SFIDA) { var sec = $('servizio'); if (sec) setTimeout(function () { sec.scrollIntoView(); }, 300); }
  P.servizio = { costruisci: costruisciServizio, conSeme: conSeme };
  window.__sv_ris = function () { return SV ? E.valore(SV.ordini[SV.i].t) : null; };
})();
