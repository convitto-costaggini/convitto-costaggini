/* ════════════════════════════════════════════════════════
   SALA STUDIO — parti comuni alle pagine degli educatori
   (docente.html, modifica.html, archivio.html)
   EDUCATORI.area({pagina, dentro, alCambio, alControllo})  la barra dell'area riservata e, finché non si è entrati, il percorso guidato
                                per entrare con la mail istituzionale (o il codice di scorta); "dentro" si vede solo dopo
   EDUCATORI.entrato() → {email, nome} oppure {scorta:true} oppure null
   EDUCATORI.chiama({...})      → Promise della risposta della funzione studio-genera (con l'accesso di chi è entrato)
   EDUCATORI.AREE, .ANNI, .riempiMaterie(select), .riempiAnni(select), .annoDaClasse(classe)
   EDUCATORI.istruzioni({...}) / .correzione(lezione, richiesta)  testi da dare all'IA
   EDUCATORI.leggi(testo)       → la lezione contenuta in una risposta dell'IA, o null; .perche(testo) spiega perché non lo è
   EDUCATORI.qr(testo, canvas, cella), .cartello(url, lezione, codice, stampa), .data(iso)
   Materie e anni seguono i quadri orari dell'istituto professionale
   "Enogastronomia e ospitalità alberghiera" (D.Lgs. 61/2017): biennio (1°-2°) e triennio (3°-5°).
   ════════════════════════════════════════════════════════ */
window.EDUCATORI = (function () {
  'use strict';
  var esc = window.STUDIO.esc;
  var FUNZIONE = SUPABASE_URL + '/functions/v1/studio-genera';

  /* [nome, anni in cui si studia] */
  var AREE = [
    { nome: 'Area generale', materie: [
      ['Italiano', '12345'], ['Storia', '12345'], ['Inglese', '12345'], ['Matematica', '12345'],
      ['Geografia', '12'], ['Diritto ed economia', '12'], ['Scienze motorie e sportive', '12345'],
      ['Religione cattolica', '12345'], ['Educazione civica', '12345']
    ] },
    { nome: 'Area di indirizzo', materie: [
      ['Seconda lingua straniera', '12345'], ['Scienze integrate', '12'],
      ['Tecnologie dell\'informazione e della comunicazione', '12'], ['Scienza degli alimenti', '12'],
      ['Scienza e cultura dell\'alimentazione', '345'], ['Diritto e tecniche amministrative della struttura ricettiva', '345'],
      ['Laboratorio di servizi enogastronomici – cucina', '12345'], ['Laboratorio di servizi enogastronomici – sala e vendita', '12345'],
      ['Laboratorio di servizi di accoglienza turistica', '12345'], ['Laboratorio di pasticceria', '345'],
      ['Arte e territorio', '345'], ['Tecniche di comunicazione', '345'], ['Analisi e controlli chimici dei prodotti alimentari', '345']
    ] }
  ];
  var ANNI = [
    { n: 1, nome: '1° anno', periodo: 'Biennio' }, { n: 2, nome: '2° anno', periodo: 'Biennio' },
    { n: 3, nome: '3° anno', periodo: 'Triennio' }, { n: 4, nome: '4° anno', periodo: 'Triennio' }, { n: 5, nome: '5° anno', periodo: 'Triennio' }
  ];
  var ALTRA = 'Altra materia';

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  /* il codice di scorta: chiave nuova, cosi' il vecchio "codice educatori" salvato non fa piu' entrare da solo */
  function codice(v) { if (v === undefined) return ls('studio-scorta') || ''; ls('studio-scorta', String(v).trim()); }
  try { localStorage.removeItem('studio-codice'); } catch (e) {}
  /* l'accesso con la mail resta valido sul dispositivo per 60 giorni (la funzione ne controlla la firma) */
  function sessione(v) {
    if (v === null) { try { localStorage.removeItem('studio-sessione'); } catch (e) {} return null; }
    if (v) return ls('studio-sessione', JSON.stringify(v));
    try { var o = JSON.parse(ls('studio-sessione') || 'null'); return o && o.t && o.scade > Date.now() ? o : null; } catch (e) { return null; }
  }
  function entrato() { var s = sessione(); return s ? { email: s.email, nome: s.nome } : codice() ? { scorta: true } : null; }
  function autore(v) { if (v === undefined) return ls('studio-autore') || ''; ls('studio-autore', String(v).trim()); }

  var ERRORI = {
    codice: 'Il codice di scorta non è giusto.', configurazione: 'Il servizio non è ancora configurato su Supabase.',
    accesso: 'Prima entra con la tua mail della scuola.', sessione: 'L\'accesso è scaduto: entra di nuovo con la tua mail.',
    email: 'Serve una mail della scuola: @alberghierorieti.it o @alberghierorieti.edu.it.', otp: 'Codice sbagliato o scaduto: controlla la mail o richiedine un altro.',
    'troppo-presto': 'Aspetta mezzo minuto prima di chiedere un altro codice.', troppi: 'Hai chiesto troppi codici: riprova tra un\'ora.',
    posta: 'In questo momento non riesco a spedire la mail. Se hai il codice di scorta, usa quello.',
    automatica: 'La creazione automatica non è attivata (serve la chiave API, a consumo). Usate i passi 1-2-3 con Claude, ChatGPT o Gemini.',
    lezione: 'La lezione non è completa: servono almeno il titolo e un\'idea chiave.',
    foto: 'Aggiungete almeno una foto oppure scrivete l\'argomento (passo 1). Se le foto ci sono, riprovate con foto più piccole o in JPEG.',
    troppe: 'Sono state create molte lezioni nell\'ultima ora: riprova tra un po\'.',
    'non-trovata': 'Lezione non trovata: forse è stata cancellata, oppure è di un altro educatore e non è condivisa.',
    ia: 'L\'intelligenza artificiale non ha risposto bene. Riprova tra un minuto.', server: 'Errore del server: riprova tra un minuto.',
    rete: 'Connessione assente o servizio non raggiungibile: riprova.'
  };
  var ridisegna = null; /* l'area riservata, da ridisegnare se l'accesso scade mentre si lavora */
  function chiama(dati) {
    var s = sessione(), prima = !!entrato();
    if (!dati.azione) { if (s) dati.sessione = s.t; else if (codice()) dati.codice_docente = codice(); }
    return fetch(FUNZIONE, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_PUB }, body: JSON.stringify(dati) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, errore: r.status === 404 ? 'configurazione' : 'server' }; }); })
      .catch(function () { return { ok: false, errore: 'rete' }; })
      .then(function (r) {
        if (r && !r.ok) {
          r.messaggioErrore = ERRORI[r.errore] || ERRORI.server; if (r.errore === 'sessione') sessione(null); if (r.errore === 'codice') codice('');
          /* chi era dentro e non lo è più rivede subito il riquadro per entrare; quello che stava scrivendo resta lì */
          if (prima && !entrato() && ridisegna) { ridisegna(r.messaggioErrore); scrollTo({ top: 0, behavior: 'smooth' }); }
        }
        return r;
      });
  }

  /* ───── l'area riservata: barra di navigazione + percorso guidato per entrare ───── */
  var PAGINE = [['crea', '➕', 'Crea una lezione', 'studio/docente.html'], ['mie', '📚', 'Le mie lezioni', 'studio/docente.html#mie'], ['archivio', '🗂️', 'Archivio', 'studio/archivio.html']];
  function area(o) {
    var box = document.getElementById('ed-area'), mail = '', attesa = null;
    function q(sel) { return box.querySelector(sel); }
    function fatto() { disegna(); if (o.alCambio) o.alCambio(entrato()); }
    function disegna(messaggio) {
      var chi = entrato(), s = sessione();
      if (o.dentro) o.dentro.hidden = !chi;
      var barra = '<nav class="ed-barra" aria-label="Area docenti ed educatori">' + PAGINE.map(function (p) {
        return '<a href="' + p[3] + '"' + (o.pagina === p[0] ? ' aria-current="page"' : '') + '><span aria-hidden="true">' + p[1] + '</span> ' + p[2] + '</a>';
      }).join('') + (chi ? '<span class="ed-chi"><span>👤 <b>' + esc(chi.scorta ? 'Codice di scorta' : chi.nome) + '</b>' +
        (s ? '<small>chiave valida fino al ' + new Date(s.scade).toLocaleDateString('it-IT') + '</small>' : '') + '</span><button type="button" class="st-btn" data-esci>Esci</button></span>' : '') + '</nav>';
      if (chi) {
        box.innerHTML = barra;
        q('[data-esci]').onclick = function () { sessione(null); codice(''); window.STUDIO.toast('Sei uscito 👋'); fatto(); };
        return;
      }
      box.innerHTML = barra + '<div class="st-card ed-login st-entra">' +
        '<h2>🔑 Entra nell\'area docenti ed educatori</h2>' +
        '<p class="st-sot">Basta la <b>mail della scuola</b>: niente password da ricordare. Tre passi, meno di un minuto.</p>' +
        '<ol class="ed-passi" aria-label="I passi per entrare"><li data-p="1" class="on"><b>1</b><span>Scrivi la tua mail</span></li><li data-p="2"><b>2</b><span>Copia il codice dalla posta</span></li><li data-p="3"><b>3</b><span>Sei dentro</span></li></ol>' +
        '<div data-fase="1"><label for="ac-mail">La tua mail della scuola</label>' +
          '<input type="email" id="ac-mail" class="ed-grande" autocomplete="email" inputmode="email" placeholder="nome.cognome@alberghierorieti.it" value="' + esc(mail) + '"/>' +
          '<div class="st-azioni"><button type="button" class="st-btn oro ed-vai" data-manda>Mandami il codice →</button></div>' +
          '<p class="st-nota">Basta anche solo <b>nome.cognome</b>: il resto lo aggiungo io. Va bene anche @alberghierorieti.edu.it.</p></div>' +
        '<div data-fase="2" hidden><div class="ed-posta">📬 Ti abbiamo scritto a <b data-a></b>.<br>Apri la posta e cerca il messaggio <b>«Il tuo codice di accesso»</b>. Non c\'è? Guarda anche in <b>Spam / Posta indesiderata</b>.</div>' +
          '<label for="ac-otp">Il codice di 6 cifre</label><input type="text" id="ac-otp" class="ed-grande ed-otp" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="● ● ● ● ● ●"/>' +
          '<div class="st-azioni"><button type="button" class="st-btn oro ed-vai" data-entra>Entra →</button><button type="button" class="st-btn" data-rimanda>Rimanda il codice</button><button type="button" class="st-btn" data-cambia>Cambia mail</button></div></div>' +
        '<div data-fase="3" hidden><div class="ed-fatto">✅ <b>Fatto, sei dentro!</b></div></div>' +
        '<p class="dc-err" data-err role="alert"></p>' +
        '<div class="ed-info"><p><b>🔑 Entri una volta sola:</b> poi questo telefono o computer si ricorda di te per <b>60 giorni</b>.</p>' +
        '<p><b>🏫 Computer della scuola?</b> Alla fine premi <b>Esci</b>.</p>' +
        '<details><summary>Perché 60 giorni? Si può allungare?</summary><p>È una misura di <b>sicurezza</b>: se un telefono si perde o un computer resta acceso, dopo 60 giorni la porta si richiude da sola e nessuno può toccare le tue lezioni. Alla scadenza rimetti la mail e il codice, e sei di nuovo dentro.</p><p>Se usi un altro telefono o computer, la prima volta ti chiederà la mail: è normale. Le tue lezioni le ritrovi ovunque.</p><p>Se docenti ed educatori lo ritengono utile, la durata si può <b>prolungare fino alla fine dell\'anno scolastico</b>.</p></details></div>' +
        '<details class="ed-scorta"><summary>La mail non arriva? Usa il codice di scorta</summary><p class="st-nota">Il codice di scorta lo conosce chi gestisce la Sala studio.</p><label for="ac-scorta">Codice di scorta</label><input type="password" id="ac-scorta" autocomplete="off"/>' +
          '<div class="st-azioni"><button type="button" class="st-btn" data-scorta>Entra con il codice di scorta</button></div></details></div>';
      var err = q('[data-err]');
      if (messaggio) err.textContent = messaggio;
      function passo(n) {
        box.querySelectorAll('[data-fase]').forEach(function (f) { f.hidden = f.getAttribute('data-fase') !== String(n); });
        box.querySelectorAll('.ed-passi li').forEach(function (li) { var k = +li.getAttribute('data-p'); li.className = k < n ? 'ok' : k === n ? 'on' : ''; });
      }
      function errore(r) { err.textContent = r.messaggioErrore || ERRORI.server; }
      function manda() {
        mail = q('#ac-mail').value.replace(/\s+/g, '').toLowerCase(); err.textContent = '';
        if (mail && mail.indexOf('@') < 0) { mail += '@alberghierorieti.it'; q('#ac-mail').value = mail; } /* basta nome.cognome */
        if (!/^[^\s@]+@alberghierorieti\.(edu\.)?it$/.test(mail)) { err.textContent = ERRORI.email; q('#ac-mail').focus(); return; }
        var b = q('[data-manda]'); b.disabled = true; b.textContent = '⏳ Spedisco…';
        chiama({ azione: 'richiedi', email: mail }).then(function (r) {
          b.disabled = false; b.textContent = 'Mandami il codice →';
          if (!r.ok) return errore(r);
          q('[data-a]').textContent = mail; passo(2); q('#ac-otp').focus();
          var t = 30, rb = q('[data-rimanda]'); rb.disabled = true; clearInterval(attesa);
          attesa = setInterval(function () { t--; rb.textContent = t > 0 ? 'Rimanda il codice (' + t + ' s)' : 'Rimanda il codice'; if (t <= 0) { clearInterval(attesa); rb.disabled = false; } }, 1000);
        });
      }
      function entra() {
        err.textContent = '';
        var b = q('[data-entra]'); b.disabled = true;
        chiama({ azione: 'verifica', email: mail, codice: q('#ac-otp').value }).then(function (r) {
          b.disabled = false;
          if (!r.ok) return errore(r);
          clearInterval(attesa);
          sessione({ t: r.sessione, email: r.email, nome: r.nome, scade: Date.now() + 59 * 24 * 3600 * 1000 }); codice('');
          if (!autore()) autore(r.nome);
          passo(3); window.STUDIO.toast('Benvenuto/a, ' + r.nome + ' 👋');
          setTimeout(fatto, 900);
        });
      }
      q('[data-manda]').onclick = manda;
      q('#ac-mail').addEventListener('keydown', function (e) { if (e.key === 'Enter') manda(); });
      q('[data-entra]').onclick = entra;
      q('#ac-otp').addEventListener('input', function () { if (this.value.replace(/\D/g, '').length === 6) entra(); });
      q('#ac-otp').addEventListener('keydown', function (e) { if (e.key === 'Enter') entra(); });
      q('[data-rimanda]').onclick = manda;
      q('[data-cambia]').onclick = function () { clearInterval(attesa); err.textContent = ''; passo(1); q('#ac-mail').focus(); };
      q('[data-scorta]').onclick = function () {
        var c = q('#ac-scorta').value.trim(); if (!c) return q('#ac-scorta').focus();
        err.textContent = '';
        chiama({ codice_docente: c, prova: true }).then(function (r) { if (!r.ok) return errore(r); codice(c); fatto(); });
      };
    }
    ridisegna = disegna;
    disegna();
    /* una volta per pagina: la chiave è ancora buona? (se no, si rivede subito il riquadro per entrare) */
    if (entrato()) chiama({ prova: true }).then(function (r) { if (r.ok && o.alControllo) o.alControllo(r); });
    return disegna;
  }

  function riempiMaterie(sel, valore) {
    var trovata = false;
    sel.innerHTML = '<option value="">— scegli —</option>' + AREE.map(function (a) {
      return '<optgroup label="' + esc(a.nome) + '">' + a.materie.map(function (m) {
        if (m[0] === valore) trovata = true;
        return '<option value="' + esc(m[0]) + '">' + esc(m[0]) + (m[1] === '12345' ? '' : m[1] === '12' ? ' (biennio)' : ' (triennio)') + '</option>';
      }).join('') + '</optgroup>';
    }).join('') + '<option value="' + ALTRA + '">' + ALTRA + '…</option>';
    if (valore && !trovata) sel.insertAdjacentHTML('beforeend', '<option value="' + esc(valore) + '">' + esc(valore) + '</option>');
    sel.value = valore || '';
  }
  /* il select delle materie con, accanto, il campo per una materia non in elenco */
  function materiaScelta(sel, altra) {
    altra.hidden = sel.value !== ALTRA;
    return sel.value === ALTRA ? altra.value.trim() : sel.value;
  }
  function riempiAnni(sel, valore) {
    sel.innerHTML = '<option value="">— scegli —</option>' + ANNI.map(function (a) { return '<option value="' + a.n + '">' + a.nome + ' (' + a.periodo.toLowerCase() + ')</option>'; }).join('');
    sel.value = valore ? String(valore) : '';
  }
  function annoDaClasse(classe) { var m = String(classe || '').match(/[1-5]/); return m ? +m[0] : ''; }
  function ordineMateria(nome) {
    var i = 0, k = -1;
    AREE.forEach(function (a) { a.materie.forEach(function (m) { if (m[0] === nome) k = i; i++; }); });
    return k < 0 ? 999 : k;
  }

  /* ───── i testi per l'IA ───── */
  function scheletro(o) {
    if (Array.isArray(o)) return o.length ? [scheletro(o[0])] : [];
    if (o && typeof o === 'object') { var r = {}; Object.keys(o).forEach(function (k) { r[k] = scheletro(o[k]); }); return r; }
    return typeof o === 'string' ? '...' : typeof o === 'number' ? 0 : o; /* segnaposto: nessun contenuto della lezione d'esempio */
  }
  var FORMA = JSON.stringify(scheletro(window.STUDIO_DEMO));
  var REGOLE =
    'Sei un educatore esperto di didattica per ragazzi con DSA (dislessia, disortografia, discalculia) in un convitto di un istituto professionale alberghiero italiano (14-19 anni).\n' +
    'Prepari una lezione interattiva in italiano che i ragazzi faranno dal telefono in sala studio.\n\n' +
    'LA FONTE:\n' +
    '- Se ti allego delle foto (pagine di un libro, appunti, schede, oppure una MAPPA CONCETTUALE), usa SOLO i concetti, i fatti, le date, i nomi e le definizioni che contengono. Non aggiungere argomenti che non ci sono. Se una pagina è tagliata, lavora su quello che si legge.\n' +
    '- Se la foto è una mappa concettuale: ogni nodo è un concetto e ogni freccia un collegamento. Spiega con frasi semplici i nodi e i legami fra loro, seguendo la struttura della mappa, senza aggiungere concetti assenti.\n' +
    '- Se NON ti allego nessuna foto, costruisci la lezione sull\'argomento indicato qui sotto, con contenuti corretti e verificati, adatti a un istituto professionale alberghiero e all\'anno di corso indicato; resta sui punti essenziali dell\'argomento.\n' +
    '- Ogni esercizio deve poter essere risolto da chi ha studiato la lezione.\n\n' +
    'STILE (pensato per DSA): frasi brevi, una idea per frase, parole semplici; spiega i termini tecnici la prima volta. Niente doppie negazioni, niente domande trabocchetto, niente "tutte le precedenti". Tono caldo, diretto ("tu"), un po\' di ironia; mai infantile.\n\n' +
    'CONTENUTI:\n' +
    '- gancio: una domanda curiosa o sorprendente legata all\'argomento, con la risposta.\n' +
    '- concetti: da 4 a 8 idee chiave, nell\'ordine della fonte. spiegazione max 3 frasi; parola_chiave = la parola da evidenziare, che deve comparire nella spiegazione; esempio concreto, se possibile dalla cucina, dalla sala o dall\'albergo.\n' +
    '- parole: 4-10 termini del glossario con definizione semplice.\n' +
    '- mnemonica: mnemotecniche vere ed efficaci, costruite sui concetti della lezione.\n' +
    '  - acronimo: una parola o sigla facile da ricordare formata dalle iniziali di elementi da memorizzare; "frase" è una frase buffa le cui parole iniziano con quelle lettere; lettere: una voce per lettera.\n' +
    '  - storia: un "palazzo della memoria" ambientato nel convitto (ingresso, refettorio, cucina, sala studio, camerata, cortile...): 4-7 tappe, in ogni luogo un\'immagine assurda, esagerata, colorata o divertente che richiama un concetto.\n' +
    '  - filastrocca: 4-8 versi in rima con i fatti principali; ogni verso separato da \\n.\n' +
    '  - immagini: 3-6 associazioni visive concetto-immagine mentale, con emoji.\n' +
    '  - trucchi: 2-4 altri trucchi (associazioni numeriche, parole simili, collegamenti con cose note).\n' +
    '- sequenza: se l\'argomento ha un ordine (fasi, cronologia, procedimento) da 4 a 7 passi nell\'ordine giusto; altrimenti titolo vuoto e passi vuoti.\n' +
    '- quiz: 8-10 domande, 3 opzioni ciascuna (una sola corretta), "corretta" è l\'indice della risposta giusta contando da 0; spiegazione in una frase.\n' +
    '- vero_falso: 6-8 affermazioni, circa metà vere.\n' +
    '- completa: 5-7 frasi con una sola parola chiave sostituita da ___; 2 distrattori plausibili.\n' +
    '- abbina: 5-6 coppie (termine-definizione, personaggio-fatto, causa-effetto, data-evento...).\n' +
    '- flashcard: 8-12 carte domanda/risposta brevi.\n' +
    '- da_ricordare: le 5 frasi essenziali da sapere a memoria.\n\n';
  var FORMATO = 'FORMATO DELLA RISPOSTA: rispondi con UN SOLO blocco di codice json, senza testo prima o dopo e senza creare artefatti, canvas o documenti a parte. Il JSON deve avere esattamente questa struttura (gli elenchi qui hanno un solo elemento di esempio: tu mettine quanti indicato sopra):\n' + FORMA;
  function istruzioni(d) {
    var extra = [
      d.argomento && 'Argomento / titolo della lezione: ' + d.argomento + '.',
      d.materia && 'Materia: ' + d.materia + '.',
      d.anno && 'Anno di corso: ' + d.anno + '° (istituto professionale alberghiero).',
      d.classe && 'Classe: ' + d.classe + '.',
      d.note && 'Indicazioni dell\'educatore: ' + d.note
    ].filter(Boolean).join('\n');
    return REGOLE + FORMATO + (extra ? '\n\n' + extra : '') +
      '\n\nOra crea la lezione: sulle foto allegate se ci sono, altrimenti ' + (d.argomento ? 'sull\'argomento indicato.' : 'sull\'argomento che ti scrivo qui sotto.');
  }
  function correzione(L, richiesta) {
    return 'Qui sotto c\'è una lezione interattiva per ragazzi con DSA di un istituto professionale alberghiero, in formato JSON.\n' +
      'Correggila così: ' + (richiesta || '(scrivi qui cosa cambiare)') + '\n\n' +
      'Regole: cambia solo quello che serve per la correzione; mantieni esattamente la stessa struttura JSON e gli stessi nomi dei campi; ' +
      'nei quiz "corretta" è l\'indice della risposta giusta contando da 0; frasi brevi e semplici.\n' +
      'Rispondi con UN SOLO blocco di codice json con la lezione intera corretta, senza testo prima o dopo e senza artefatti, canvas o documenti a parte.\n\n' +
      '```json\n' + JSON.stringify(L, null, 1) + '\n```';
  }
  function leggi(t) {
    t = String(t || ''); var a = t.indexOf('{'), b = t.lastIndexOf('}'), L;
    if (a < 0 || b < a) return null;
    t = t.slice(a, b + 1);
    try { L = JSON.parse(t); } catch (e) {
      /* qualche assistente lascia una virgola prima di } o ] */
      try { L = JSON.parse(t.replace(/,(\s*[}\]])/g, '$1')); } catch (e2) { return null; }
    }
    return L && pieno(L.titolo) && Array.isArray(L.concetti) && L.concetti.some(function (c) { return c && pieno(c.spiegazione); }) ? L : null;
  }
  function pieno(v) { return typeof v === 'string' && /[A-Za-zÀ-ÿ0-9]/.test(v); } /* "..." è il segnaposto delle istruzioni */
  /* perché un testo incollato non è una lezione: il messaggio da mostrare */
  function perche(t) {
    t = String(t || '');
    if (!t.trim()) return 'Incolla prima la risposta dell\'IA.';
    if (t.indexOf('Correggila così:') >= 0) return 'Questa è la richiesta per l\'IA, non la sua risposta. Incollala in Claude, ChatGPT o Gemini; poi copia qui quello che l\'IA ti risponde.';
    if (t.indexOf('Sei un educatore esperto') >= 0 || t.indexOf('"titolo":"..."') >= 0 || /"titolo":\s*"\.\.\."/.test(t))
      return 'Questo è il testo delle istruzioni, non la risposta dell\'IA. Incollalo in Claude, ChatGPT o Gemini (passo 2); poi copia qui quello che l\'IA ti risponde.';
    return 'Il testo incollato non è una lezione completa: copia tutta la risposta dell\'IA, dall\'inizio alla fine. Se la risposta si è interrotta, scrivi all\'IA «continua» oppure rifai la richiesta.';
  }

  /* copia negli appunti; se il telefono non lo permette, mostra il testo già selezionato sotto il pulsante (mai nel riquadro della risposta) */
  function copia(testo, pulsante, fatto) {
    var vecchio = pulsante.parentNode.parentNode.querySelector('.dc-copia-a-mano'); if (vecchio) vecchio.remove();
    (navigator.clipboard ? navigator.clipboard.writeText(testo) : Promise.reject()).then(function () { window.STUDIO.toast(fatto); })
      .catch(function () {
        var d = document.createElement('div'); d.className = 'dc-copia-a-mano';
        d.innerHTML = '<p class="st-nota"><b>Il telefono non mi lascia copiare da solo.</b> Il testo qui sotto è già selezionato: tieni premuto e scegli <b>Copia</b>.</p><textarea readonly></textarea>';
        pulsante.parentNode.insertAdjacentElement('afterend', d);
        var ta = d.querySelector('textarea'); ta.value = testo; ta.focus(); ta.select();
      });
  }

  /* ───── QR e cartello ───── */
  function qr(testo, canvas, cella) {
    var c = qrcode(0, 'M'); c.addData(testo); c.make();
    var n = c.getModuleCount(), m = 4, s = (n + m * 2) * cella, x = canvas.getContext('2d');
    canvas.width = canvas.height = s; x.fillStyle = '#fff'; x.fillRect(0, 0, s, s); x.fillStyle = '#000';
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (c.isDark(r, k)) x.fillRect((k + m) * cella, (r + m) * cella, cella, cella);
  }
  function cartello(url, L, cod, stampa) {
    var cv = document.createElement('canvas'); qr(url, cv, 14);
    var w = window.open('', '_blank'); if (!w) return window.STUDIO.toast('Consenti le finestre a comparsa');
    w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/><title>' + esc(L.titolo) + ' — QR</title><style>' +
      'body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif;background:#fff;color:#2C3E2D;text-align:center;padding:2vh}' +
      '.m{font-size:2.2vh;letter-spacing:.2em;text-transform:uppercase;color:#B8922A;font-weight:bold}h1{font-size:5vh;margin:1vh 0 2vh}img{width:min(58vh,80vw);height:auto}' +
      '.c{font-size:4vh;letter-spacing:.3em;font-weight:bold;margin:1vh 0}p{font-size:2.3vh;color:#555;margin:.5vh}@media print{body{min-height:auto}}</style></head><body>' +
      '<div class="m">Sala studio · ' + esc(L.materia || '') + '</div><h1>' + esc((L.icona || '📚') + ' ' + L.titolo) + '</h1><img src="' + cv.toDataURL() + '" alt="Codice QR"/>' +
      (cod ? '<div class="c">' + esc(cod) + '</div>' : '') + '<p>Inquadra il codice con la fotocamera del telefono.</p><p>Idee chiave · trucchi per ricordare · esercizi · flashcard · sfida finale</p>' +
      (stampa ? '<script>onload=function(){print()}<\/script>' : '') + '</body></html>');
    w.document.close();
  }
  function data(d) { var m = String(d || '').match(/^(\d{4})-(\d\d)-(\d\d)/); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; }

  return {
    AREE: AREE, ANNI: ANNI, ALTRA: ALTRA, ERRORI: ERRORI, chiama: chiama, area: area, entrato: entrato, autore: autore,
    riempiMaterie: riempiMaterie, materiaScelta: materiaScelta, riempiAnni: riempiAnni, annoDaClasse: annoDaClasse, ordineMateria: ordineMateria,
    istruzioni: istruzioni, correzione: correzione, leggi: leggi, perche: perche, copia: copia, qr: qr, cartello: cartello, data: data
  };
})();
