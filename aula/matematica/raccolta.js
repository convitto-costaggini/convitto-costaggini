/* ════════════════════════════════════════════════════════════
   AULA · Matematica · gli esercizi della docente
   Una riga per esercizio, in una forma semplice che si scrive a mano o si fa
   preparare all'IA da una foto del libro. Il sito NON si fida di nessuna soluzione
   scritta: risultati, correzione, suggerimenti e passo passo li calcolano i motori
   delle tappe (mcd-mcm.js, frazioni-cosa.js, frazioni.js + frazioni-tutor.js).
   RACCOLTA.leggi(testo) → { es: [...], err: [{ riga, testo, msg }] }
   La raccolta viaggia nel link (#e=…, PACCHETTO): nessun server, nessun account.
   ════════════════════════════════════════════════════════════ */
window.RACCOLTA = (function () {
  'use strict';
  var MC = window.MCD_MCM, FC = window.FRAZIONI_COSA, FZ = window.FRAZIONI, FT = window.FRAZIONI_TUTOR;
  var MAXN = 99999, MAXR = 40;
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function Err(m) { this.msg = m; }

  /* ── le forme ammesse (anche per l'IA) ── */
  var FORME = [
    ['MCD 24 36', 'massimo comune divisore (2, 3 o 4 numeri)'],
    ['mcm 12 18 20', 'minimo comune multiplo (2, 3 o 4 numeri)'],
    ['scomponi 360', 'scomposizione in fattori primi'],
    ['primo 91', '«È un numero primo?»'],
    ['semplifica 18/24', 'ridurre ai minimi termini'],
    ['confronta 3/4 2/3', 'mettere <, = oppure >'],
    ['completa 3/4 = ?/20', 'frazione equivalente (il ? può stare sopra o sotto)'],
    ['frazione 3/4 di 200 g di farina', 'frazione di una quantità (la quantità deve dividersi per il denominatore)'],
    ['misto 11/4', 'da frazione impropria a numero misto'],
    ['calcola 2/3 + 3/4', 'operazione tra due frazioni: + − · : e potenze, per esempio (2/3)^2 · 9/4'],
    ['problema MCD 36 48 | Lo chef ha 36 tartine al salmone e 48 al formaggio…', 'problema: il ragazzo sceglie MCD o mcm, poi calcola'],
    ['problema mcm 12 18 | Due forni sfornano ogni 12 e ogni 18 minuti…', 'problema con il mcm'],
    ['problema frazione 2/5 1000 g | Per la frolla servono i 2/5 di un pacco da 1000 g…', 'problema con la frazione di una quantità']
  ];

  /* ── lettura delle righe ── */
  function numeri(s, min, max) {
    var l = s.replace(/[(),;]/g, ' ').trim().split(/\s+/).filter(Boolean);
    if (l.length < min || l.length > max) throw new Err('servono da ' + min + ' a ' + max + ' numeri');
    return l.map(function (x) { if (!/^\d+$/.test(x)) throw new Err('«' + x + '» non è un numero intero positivo'); var n = +x; if (n < 2 || n > MAXN) throw new Err('i numeri vanno da 2 a ' + MAXN); return n; });
  }
  function frazione(s, cosa) {
    var m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
    if (!m) throw new Err((cosa || 'la frazione') + ' va scritta così: 3/4');
    var n = +m[1], d = +m[2];
    if (!d) throw new Err('il denominatore non può essere 0');
    if (n > MAXN || d > MAXN) throw new Err('numeri troppo grandi');
    return [n, d];
  }
  function due(s) { var l = s.trim().split(/\s+|(?:\s*[,;]\s*)/).filter(Boolean); if (l.length !== 2) throw new Err('servono due frazioni, per esempio 3/4 2/3'); return [frazione(l[0]), frazione(l[1])]; }
  function operando(s) {
    var m = /^\s*(\(\s*)?(-?\d+)(?:\s*\/\s*(-?\d+))?\s*(\))?\s*(?:\^\s*(-?\d+))?/.exec(s);
    if (!m || m[2] === undefined) return null;
    return { n: m[2], d: m[3] === undefined ? '1' : m[3], k: m[5] === undefined ? '1' : m[5], resto: s.slice(m[0].length) };
  }
  function calcola(s) {
    var t = s.replace(/[−–]/g, '-').replace(/[×x*·]/g, '·').replace(/÷/g, ':').trim();
    var a = operando(t); if (!a) throw new Err('scrivi due frazioni con un\'operazione, per esempio 2/3 + 3/4');
    var r = a.resto.trim(), op = r.charAt(0), mapa = { '+': '+', '-': '-', '·': '*', ':': ':' };
    if (!mapa[op]) throw new Err('l\'operazione va scritta con + − · oppure :');
    var b = operando(r.slice(1)); if (!b || b.resto.trim()) throw new Err('dopo l\'operazione serve una sola frazione');
    var q = { n1: a.n, d1: a.d, k1: a.k, op: mapa[op], n2: b.n, d2: b.d, k2: b.k };
    try { FZ.calcola(q); } catch (e) { if (e && e.name === 'ErroreFz') throw new Err(e.message.replace(/\.$/, '')); throw e; }
    return q;
  }
  function riga(t) {
    var parti = t.split('|'), testo = parti.slice(1).join('|').trim(), s = parti[0].trim(), m = /^(\S+)\s*(.*)$/.exec(s), k = m ? m[1].toLowerCase() : '', r = m ? m[2] : '';
    if (k === 'mcd' || k === 'mcm') { var l = numeri(r, 2, 4).sort(function (x, y) { return x - y; }); return { k: k, motore: 'mc', q: { tipo: k, nums: l } }; }
    if (k === 'scomponi') { var n = numeri(r, 1, 1)[0]; if (MC.primo(n)) throw new Err(n + ' è primo: la scomposizione è il numero stesso, scegline un altro'); return { k: k, motore: 'mc', q: { tipo: 'scomponi', n: n } }; }
    if (k === 'primo') return { k: k, motore: 'mc', q: { tipo: 'primo', n: numeri(r, 1, 1)[0] } };
    if (k === 'semplifica' || k === 'riduci') { var f = frazione(r); if (gcd(f[0], f[1]) === 1) throw new Err(f[0] + '/' + f[1] + ' è già ridotta ai minimi termini'); return { k: 'semplifica', motore: 'fc', q: { tipo: 'semplifica', n: f[0], d: f[1] } }; }
    if (k === 'confronta') { var c = due(r); return { k: k, motore: 'fc', q: { tipo: 'confronta', a: c[0][0], b: c[0][1], c: c[1][0], d: c[1][1] } }; }
    if (k === 'completa') {
      var e = /^\s*(\d+)\s*\/\s*(\d+)\s*=\s*(\?|\d+)\s*\/\s*(\?|\d+)\s*$/.exec(r);
      if (!e || (e[3] === '?') === (e[4] === '?')) throw new Err('scrivi così: 3/4 = ?/20 oppure 3/4 = 15/?');
      var a = +e[1], b = +e[2], noto = e[3] === '?' ? +e[4] : +e[3], base = e[3] === '?' ? b : a;
      if (!b) throw new Err('il denominatore non può essere 0');
      if (!a || noto % base || noto / base < 2) throw new Err(noto + ' non è un multiplo (almeno doppio) di ' + base + ': l\'equivalenza non ha una soluzione intera');
      return { k: k, motore: 'fc', q: { tipo: 'equivalente', a: a, b: b, k: noto / base, manca: e[3] === '?' ? 'n' : 'd' } };
    }
    if (k === 'frazione' || (k === 'problema' && /^frazione\b/i.test(r))) {
      var rr = k === 'problema' ? r.replace(/^frazione\s*/i, '') : r;
      var x = /^\s*(\d+)\s*\/\s*(\d+)\s*(?:di\s+)?(\d+)\s*(.*)$/i.exec(rr);
      if (!x) throw new Err('scrivi così: frazione 3/4 di 200 g di farina');
      var nq = +x[1], dq = +x[2], Q = +x[3];
      if (!dq || nq >= dq) throw new Err('serve una frazione propria (numeratore minore del denominatore)');
      if (Q % dq) throw new Err(Q + ' non si divide per ' + dq + ': scegli una quantità multipla di ' + dq);
      if (k === 'problema' && !testo) throw new Err('dopo la barra | scrivi il testo del problema');
      return { k: k === 'problema' ? 'problema-frazione' : 'frazione', motore: 'fc', q: { tipo: 'quantita', n: nq, d: dq, Q: Q, u: x[4].trim() }, testo: testo };
    }
    if (k === 'misto') { var mi = frazione(r); if (mi[0] <= mi[1] || mi[0] % mi[1] === 0) throw new Err('serve una frazione impropria che non sia un numero intero, per esempio 11/4'); return { k: k, motore: 'fc', q: { tipo: 'misto', n: mi[0], d: mi[1] } }; }
    if (k === 'calcola') return { k: k, motore: 'fz', q: calcola(r) };
    if (k === 'problema') {
      var pm = /^(mcd|mcm)\s+(.*)$/i.exec(r);
      if (!pm) throw new Err('scrivi «problema MCD …», «problema mcm …» oppure «problema frazione …»');
      if (!testo) throw new Err('dopo la barra | scrivi il testo del problema');
      var serve = pm[1].toLowerCase(), nn = numeri(pm[2], 2, 4).sort(function (x, y) { return x - y; });
      return { k: 'problema', motore: 'mc', q: { tipo: 'problema', serve: serve, nums: nn, testo: testo, u: '', ris: serve === 'mcd' ? MC.gcdL(nn) : MC.lcmL(nn) } };
    }
    throw new Err('non riconosco «' + (k || t) + '»: le parole iniziali ammesse sono MCD, mcm, scomponi, primo, semplifica, confronta, completa, frazione, misto, calcola, problema');
  }
  function leggi(testo) {
    var es = [], err = [];
    String(testo || '').split(/\r?\n/).forEach(function (t, i) {
      t = t.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, '').trim();
      if (!t || t.charAt(0) === '#') return;
      if (es.length >= MAXR) { err.push({ riga: i + 1, testo: t, msg: 'al massimo ' + MAXR + ' esercizi per raccolta' }); return; }
      try { var e = riga(t); e.riga = i + 1; e.src = t; es.push(e); }
      catch (x) { if (x instanceof Err) err.push({ riga: i + 1, testo: t, msg: x.msg }); else throw x; }
    });
    return { es: es, err: err };
  }

  /* ── che cosa vede e scrive il ragazzo ── */
  function domanda(e) {
    if (e.motore === 'fz') return '<p class="mm-dom">Calcola e scrivi il risultato ridotto ai minimi termini:</p><div class="fz-dom">' + FZ.math(FZ.espressione(e.q), true) + '</div>';
    if (e.k === 'problema-frazione') return '<p class="mm-pr">' + esc(e.testo) + '</p>';
    if (e.motore === 'mc') return MC.domanda(e.q);
    return FC.domanda(e.q);
  }
  function ui(e, fase) {
    if (e.k === 'primo') return { tipo: 'scelta', opzioni: [['si', 'Sì, è primo'], ['no', 'No, non è primo']] };
    if (e.k === 'confronta') return { tipo: 'scelta', opzioni: [['>', '&gt;'], ['=', '='], ['<', '&lt;']], seg: true };
    if (e.k === 'problema' && !fase) return { tipo: 'scelta', opzioni: [['mcd', 'Serve il MCD'], ['mcm', 'Serve il mcm']], prima: 'Prima di tutto: che cosa serve?' };
    var ph = { scomponi: 'per esempio 2^2*3*5', semplifica: 'per esempio 3/4', misto: 'per esempio 2 3/4', calcola: 'per esempio 3/4 oppure -5/6' }[e.k] || 'un numero';
    var u = e.motore === 'fc' && e.q.u ? e.q.u : '';
    return { tipo: 'testo', ph: ph, u: u, num: ph === 'un numero', prima: e.k === 'problema' ? 'Giusto, serve il <strong>' + (e.q.serve === 'mcd' ? 'MCD' : 'mcm') + '</strong> di ' + MC.elenco(e.q.nums) + '. Ora calcolalo.' : '' };
  }
  function giudica(e, v, fase) {
    if (e.k === 'problema' && !fase) return MC.giudicaServe(e.q, v);
    if (e.motore === 'mc') return MC.giudica(e.q, v);
    if (e.motore === 'fc') return FC.giudica(e.q, v);
    var att = FZ.calcola(e.q).risultato, r = FZ.controlla(v, att);
    if (r.esito === 'illeggibile') return { ok: false, cls: 'no', msg: 'Non riesco a leggere la risposta. Scrivila come frazione (3/4), numero intero (5) o decimale (0,75).' };
    if (r.esito === 'sbagliata') return { ok: false, cls: 'no', msg: 'Non ancora. Ricontrolla i passaggi, oppure fatti guidare passo passo.' };
    if (r.esito === 'da-semplificare') return { ok: false, cls: 'mezzo', msg: r.motivo === 'intero' ? 'Il valore è giusto: se il risultato è un numero intero, scrivilo senza denominatore.' : r.motivo === 'segno' ? 'Il valore è giusto: il segno meno si scrive al numeratore.' : 'Il valore è giusto, ma va ridotta ai minimi termini.' };
    return { ok: true, msg: r.forma === 'decimale' ? 'Come frazione: ' + (att.d === BigInt(1) ? String(att.n) : att.n + '/' + att.d) + '.' : '' };
  }
  function soluzione(e) {
    if (e.motore === 'mc') return MC.soluzione(e.q);
    if (e.motore === 'fc') return FC.soluzione(e.q);
    var c = FZ.calcola(e.q), h = '<p>Risultato: ' + c.mathRis + '</p><ol class="mm-sol">';
    c.passi.forEach(function (p) { h += '<li><strong>' + p.t + '.</strong> ' + p.p + p.m.join('') + '</li>'; });
    return h + '</ol>';
  }
  function tutor(e) {
    if (e.motore === 'mc') return ['mcd', 'mcm', 'problema'].indexOf(e.k) >= 0 ? function () { return MC.costruisci(e.q.nums); } : null;
    if (e.motore === 'fc') return ['semplifica', 'confronta', 'frazione', 'problema-frazione', 'misto'].indexOf(e.k) >= 0 ? function () { return FC.costruisci(e.q); } : null;
    return function () { var t = FT.costruisci(e.q); return { testata: t.espressione, passi: t.passi, fine: '<p class="tt-q">' + FZ.math(t.risultato.d === BigInt(1) ? FZ.M.num(t.risultato.n) : FZ.M.fr(t.risultato)) + '</p>' }; };
  }
  function suggerimento(e) {
    var q = e.q;
    return {
      mcd: 'Scomponi i numeri in fattori primi e prendi solo i fattori comuni, con l\'esponente più piccolo.',
      mcm: 'Scomponi i numeri in fattori primi e prendi tutti i fattori, con l\'esponente più grande.',
      scomponi: 'Dividi per il primo più piccolo che lo divide (2, 3, 5, 7…) e continua fino ad arrivare a 1.',
      primo: 'Prova a dividerlo per 2, 3, 5, 7, 11, 13…: basta arrivare al primo il cui quadrato supera il numero.',
      semplifica: 'Cerca il MCD di numeratore e denominatore e dividi tutti e due.',
      confronta: 'Porta le due frazioni allo stesso denominatore (il mcm dei denominatori) e confronta i numeratori.',
      completa: 'Di quanto è stato moltiplicato il numero che conosci? Fai lo stesso con l\'altro.',
      frazione: 'Dividi per il denominatore, poi moltiplica per il numeratore.',
      'problema-frazione': 'Dividi per il denominatore, poi moltiplica per il numeratore.',
      misto: 'Quante volte il denominatore sta nel numeratore? E quanto avanza?',
      calcola: 'Fatti guidare con «Aiutami passo passo»: una domanda alla volta.',
      problema: 'Si divide in parti uguali senza avanzi (MCD) o qualcosa si ripete e coincide (mcm)?'
    }[e.k] || '';
  }
  /* ── stampa ── */
  function stampa(e) {
    if (e.motore === 'fz') return 'Calcola: ' + FZ.math(FZ.espressione(e.q) + '<mo>=</mo><mo>…</mo>');
    var q = e.q, F = FC.F;
    switch (e.k) {
      case 'mcd': return 'MCD(' + q.nums.join(', ') + ') = …';
      case 'mcm': return 'mcm(' + q.nums.join(', ') + ') = …';
      case 'scomponi': return 'Scomponi in fattori primi: <strong>' + q.n + '</strong>';
      case 'primo': return '<strong>' + q.n + '</strong> è un numero primo? Perché?';
      case 'semplifica': return 'Riduci ai minimi termini: ' + F(q.n, q.d);
      case 'confronta': return 'Metti &lt;, = oppure &gt;: ' + F(q.a, q.b) + ' … ' + F(q.c, q.d);
      case 'completa': return 'Completa: ' + FC.M(FC.mfr(q.a, q.b) + '<mo>=</mo>' + (q.manca === 'n' ? '<mfrac><mo>…</mo><mn>' + q.b * q.k + '</mn></mfrac>' : '<mfrac><mn>' + q.a * q.k + '</mn><mo>…</mo></mfrac>'));
      case 'frazione': return 'Quanto sono i ' + F(q.n, q.d) + ' di ' + q.Q + ' ' + esc(q.u) + '?';
      case 'misto': return 'Scrivi come numero misto: ' + F(q.n, q.d);
      default: return esc(e.testo || q.testo) + (e.k === 'problema' ? ' <em>(Indica se usi il MCD o il mcm.)</em>' : '');
    }
  }
  function solStampa(e) {
    var q = e.q;
    if (e.motore === 'fz') { var c = FZ.calcola(q); return FZ.math(FZ.espressione(q) + '<mo>=</mo>' + c.mathRis.replace(/^<math[^>]*>|<\/math>$/g, '')); }
    if (e.motore === 'mc') {
      if (q.tipo === 'scomponi') return q.n + ' = ' + MC.fH(q.n);
      if (q.tipo === 'primo') return q.n + (MC.primo(q.n) ? ' è primo' : ' non è primo: ' + q.n + ' = ' + MC.fH(q.n));
      var f = q.nums.map(function (n) { return n + ' = ' + MC.fH(n); }).join('; '), G = MC.gcdL(q.nums), L = MC.lcmL(q.nums);
      if (q.tipo === 'problema') return (q.serve === 'mcd' ? 'MCD = ' + G : 'mcm = ' + L) + ' <span class="fz-m">(' + f + ')</span>';
      return (q.tipo === 'mcd' ? 'MCD = ' + G : 'mcm = ' + L) + ' <span class="fz-m">(' + f + ')</span>';
    }
    var r = FC.rispostaGiusta(q);
    if (q.tipo === 'quantita') return q.Q + ' : ' + q.d + ' · ' + q.n + ' = ' + r + ' ' + esc(q.u);
    if (q.tipo === 'confronta') return q.a + '/' + q.b + ' ' + esc(r) + ' ' + q.c + '/' + q.d;
    if (q.tipo === 'equivalente') return q.a + '/' + q.b + ' = ' + q.a * q.k + '/' + q.b * q.k;
    if (q.tipo === 'misto') return q.n + '/' + q.d + ' = ' + r.replace(' ', ' e ');
    return q.n + '/' + q.d + ' = ' + r;
  }

  /* ── le istruzioni per l'IA (foto del libro o mappa → righe) ── */
  function istruzioni(d) {
    return 'Sei un docente di matematica di un istituto professionale alberghiero italiano (primo anno, 14-15 anni).\n' +
      'Ti allego la foto di una pagina di esercizi del libro, oppure una mappa concettuale, oppure ti indico solo l\'argomento.\n' +
      'Il tuo compito: trasformarli in esercizi scritti in un formato molto preciso, UNO PER RIGA. NON risolverli e NON scrivere le soluzioni: le calcola il sito.\n\n' +
      'Le sole forme ammesse (la prima parola è obbligatoria, i numeri sono interi positivi):\n' +
      FORME.map(function (f) { return f[0] + '   ← ' + f[1]; }).join('\n') + '\n\n' +
      'Regole:\n- Usa solo le forme qui sopra. Un esercizio del libro che non rientra in nessuna forma va saltato, senza commenti.\n' +
      '- Nei problemi, dopo la barra | scrivi il testo del problema in italiano semplice, possibilmente ambientato in cucina, in sala o in albergo; i numeri prima della barra devono essere quelli del testo.\n' +
      '- In «calcola» si usano solo due frazioni con una delle operazioni + − · : (si può aggiungere una potenza, per esempio (2/3)^2).\n' +
      '- Al massimo ' + MAXR + ' righe. Nessun titolo, nessuna numerazione, nessuna spiegazione: solo le righe, dentro un unico blocco di testo.\n' +
      (d.argomento ? '\nArgomento: ' + d.argomento + '.' : '') + (d.quanti ? '\nNumero di esercizi: circa ' + d.quanti + '.' : '') + (d.note ? '\nIndicazioni del docente: ' + d.note : '') +
      '\n\nOra prepara le righe' + (d.argomento ? '.' : ', sulle foto allegate. Se non ci sono foto né argomento, chiedimi solo di allegare la foto.');
  }

  return { leggi: leggi, FORME: FORME, domanda: domanda, ui: ui, giudica: giudica, soluzione: soluzione, tutor: tutor, suggerimento: suggerimento, stampa: stampa, solStampa: solStampa, istruzioni: istruzioni, MAXR: MAXR };
})();
