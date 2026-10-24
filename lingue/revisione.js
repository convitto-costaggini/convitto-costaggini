/* ════════════════════════════════════════════════════════
   REVISIONE — le spunte dei docenti sulle frasi, mentre usano il sito
   Niente da completare: chi è docente, quando una frase gli passa sotto gli occhi,
   può toccare ✔ (va bene) o ✏️ (la corregge: vale subito per tutti, con il suo nome; un collega può annullarla).
   Gli studenti non vedono le spunte; vedono le frasi corrette (lingue/correzioni.js).
   L'accesso è lo stesso della Sala studio (mail della scuola + codice): una volta sola, 60 giorni.
   REVISIONE.porta(el)   in fondo alla pagina: il link discreto per i docenti, o la barra «modalità docente»
   REVISIONE.decora(el)  aggiunge le spunte agli elementi [data-rv-k][data-rv-l][data-rv-t]
                         (chiave della frase, lingua en/fr/es, testo mostrato)
   ════════════════════════════════════════════════════════ */
window.REVISIONE = (function () {
  'use strict';
  var API = 'https://sawclsysqnjsvbobioqo.supabase.co/functions/v1/studio-genera';
  var dati = null, carica = null, ultima = null, barra = null;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  /* la stessa «chiave» della Sala studio */
  function sessione() { try { var o = JSON.parse(ls('studio-sessione') || 'null'); return o && o.t && o.scade > Date.now() ? o : null; } catch (e) { return null; } }
  function attiva() { return !!sessione() && ls('lingue-revisione') !== 'off'; }
  function chiama(corpo) {
    var s = sessione(); if (s && !corpo.azione) corpo.sessione = s.t;
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json(); }).catch(function () { return { ok: false, errore: 'rete' }; })
      .then(function (r) { if (r && r.errore === 'sessione') ls('studio-sessione', null); return r; });
  }
  var tt;
  function toast(t) {
    var el = document.querySelector('.rv-toast');
    if (!el) { el = document.createElement('div'); el.className = 'rv-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = t; el.classList.add('su'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('su'); }, 1600);
  }
  function avviso(t) { if (window.FINESTRA) window.FINESTRA.avvisa(t); }

  /* ───── le spunte già date e la cronologia delle correzioni, per frase e lingua ───── */
  var storia = [];
  function prendi() {
    if (!carica) carica = chiama({ revisioni: true }).then(function (r) { if (r.ok) riceve(r); else carica = null; return r; });
    return carica;
  }
  function riceve(r) {
    dati = r.revisioni || []; storia = r.storia || [];
    if (window.CORREZIONI && r.correzioni) window.CORREZIONI.aggiorna(r.correzioni);
  }
  function di(k, l) { return (dati || []).filter(function (x) { return x.chiave === k && x.lingua === l; }); }
  function versioni(k, l) { return storia.filter(function (x) { return x.chiave === k && x.lingua === l; }); }
  function data(d) { var m = String(d || '').match(/^(\d{4})-(\d\d)-(\d\d)/); return m ? m[3] + '/' + m[2] : ''; }

  /* soloNuove: aggiunge le spunte solo dove mancano (lo usa l'osservatore, che le mette da sé quando la pagina cambia) */
  function decora(radice, soloNuove) {
    radice = radice || document.body; ultima = document.body;
    if (!attiva()) return;
    if (!dati) { prendi().then(function () { decora(document.body); }); return; }
    radice.querySelectorAll('[data-rv-k]').forEach(function (el) {
      var vecchio = el.querySelector(':scope > .rv-spunte'); if (vecchio) { if (soloNuove) return; vecchio.remove(); }
      var k = el.getAttribute('data-rv-k'), l = el.getAttribute('data-rv-l');
      var mia = di(k, l).filter(function (x) { return x.mia && x.stato === 'ok'; })[0], ok = di(k, l).filter(function (x) { return x.stato === 'ok'; });
      var V = versioni(k, l), vigore = V.filter(function (x) { return !x.annullata; })[0];
      var box = document.createElement('div'); box.className = 'rv-spunte';
      box.innerHTML = '<button type="button" class="rv-b' + (mia ? ' si' : '') + '" data-rv="ok" aria-pressed="' + !!mia + '" title="Va bene così">✔</button>' +
        '<button type="button" class="rv-b" data-rv="mod" title="Correggi la frase">✏️</button>' +
        (ok.length ? '<span class="rv-i" title="Hanno detto che va bene">✔ ' + ok.map(function (x) { return esc(x.mia ? 'tu' : x.nome); }).join(', ') + '</span>' : '') +
        (vigore ? '<span class="rv-i rv-corr">✏️ corretta da ' + esc(vigore.mia ? 'te' : vigore.nome) + ' il ' + data(vigore.creata) + (vigore.originale ? ' · prima: «' + esc(vigore.originale) + '»' : '') + (vigore.nota ? ' · ' + esc(vigore.nota) : '') + '</span>' +
          '<button type="button" class="rv-i rv-link" data-rv="annulla">↩ Annulla la correzione</button>' : '') +
        (V.length > 1 || (V.length && !vigore) ? '<button type="button" class="rv-i rv-link" data-rv="storia">🕘 Cronologia</button>' : '');
      el.appendChild(box);
      box.addEventListener('click', function (e) {
        var b = e.target.closest('[data-rv]'); if (!b) return;
        var cosa = b.getAttribute('data-rv');
        if (cosa === 'ok') return spunta(el, mia ? 'via' : 'ok');
        if (cosa === 'mod') return modulo(el);
        if (cosa === 'annulla') return annulla(el, vigore);
        if (cosa === 'storia') return cronologia(el, V);
      });
    });
  }
  function errore(x) { avviso(x.errore === 'sessione' || x.errore === 'mail' ? 'L\'accesso è scaduto: rientra con la tua mail della scuola (in fondo alla pagina).' : 'Non sono riuscito a salvare: controlla la connessione e riprova.'); }
  function invia(corpo, msg) {
    return chiama(corpo).then(function (x) {
      if (!x.ok) return errore(x);
      riceve(x); decora(document.body); toast(msg);
    });
  }
  function spunta(el, stato) {
    invia({ revisione: { chiave: el.getAttribute('data-rv-k'), lingua: el.getAttribute('data-rv-l'), testo: el.getAttribute('data-rv-t'), stato: stato } }, stato === 'ok' ? 'Grazie! ✔' : 'Spunta tolta');
  }
  /* ✏️: la correzione vale subito per tutti; i colleghi vedono il nome e possono annullarla */
  function modulo(el) {
    var vecchio = el.querySelector(':scope > .rv-form'); if (vecchio) return vecchio.remove();
    var f = document.createElement('div'), attuale = el.getAttribute('data-rv-t'); f.className = 'rv-form';
    f.innerHTML = '<label>Correggi la frase<textarea rows="' + Math.min(6, 1 + Math.floor(attuale.length / 60)) + '" maxlength="2000" data-rv-p>' + esc(attuale) + '</textarea></label>' +
      '<label>Perché (facoltativo)<input type="text" maxlength="300" data-rv-n placeholder="es. più naturale; in Spagna si dice…"/></label>' +
      '<p class="rv-nota">La correzione vale <b>subito per tutti</b>, ragazzi compresi. I colleghi vedranno il tuo nome e potranno annullarla.</p>' +
      '<div class="rv-az"><button type="button" class="rv-b" data-rv-a>Annulla</button><button type="button" class="rv-b pieno" data-rv-s>✔ Correggi per tutti</button></div>';
    el.appendChild(f); var t = f.querySelector('[data-rv-p]'); t.focus(); t.setSelectionRange(t.value.length, t.value.length);
    f.querySelector('[data-rv-a]').onclick = function () { f.remove(); };
    f.querySelector('[data-rv-s]').onclick = function () {
      var nuovo = t.value.trim();
      if (!nuovo) return t.focus();
      if (nuovo === attuale) return f.remove();
      invia({ correggi: { chiave: el.getAttribute('data-rv-k'), lingua: el.getAttribute('data-rv-l'), originale: attuale, testo: nuovo, nota: f.querySelector('[data-rv-n]').value.trim() } }, 'Corretta per tutti ✏️');
    };
  }
  function annulla(el, v) {
    var testo = '«' + v.testo + '» torna com\'era prima' + (v.originale ? ': «' + v.originale + '»' : '') + '.';
    (window.FINESTRA ? window.FINESTRA.chiedi({ icona: '↩', titolo: 'Annullare la correzione' + (v.mia ? '' : ' di ' + v.nome) + '?', testo: testo, si: 'Annulla la correzione', no: 'Lascia così' }) : Promise.resolve(true))
      .then(function (ok) { if (ok) invia({ annulla: { chiave: el.getAttribute('data-rv-k'), lingua: el.getAttribute('data-rv-l') } }, 'Correzione annullata ↩'); });
  }
  function cronologia(el, V) {
    var vecchio = el.querySelector(':scope > .rv-sugg'); if (vecchio) return vecchio.remove();
    var d = document.createElement('div'); d.className = 'rv-sugg';
    d.innerHTML = '<p><b>🕘 Le versioni di questa frase</b>, dalla più recente:</p>' + V.map(function (x) {
      return '<p' + (x.annullata ? ' class="rv-annullata"' : '') + '>' + data(x.creata) + ' · <b>' + esc(x.mia ? 'Tu' : x.nome) + '</b>: «' + esc(x.testo) + '»' + (x.nota ? ' <i>— ' + esc(x.nota) + '</i>' : '') +
        (x.annullata ? ' <small>(annullata da ' + esc(x.annullata_da || '') + ' il ' + data(x.annullata) + ')</small>' : '') + '</p>';
    }).join('') + (V.length && V[V.length - 1].originale ? '<p>Testo di partenza: «' + esc(V[V.length - 1].originale) + '»</p>' : '');
    el.appendChild(d);
  }

  /* ───── in fondo alla pagina: il link per i docenti, oppure la barra della modalità docente ───── */
  function porta(el) {
    barra = el;
    var s = sessione();
    if (s && attiva()) {
      el.innerHTML = '<div class="rv-barra"><p><b>👩‍🏫 Modalità docente</b> · ' + esc(s.nome || s.email) + '</p>' +
        '<p>Se una frase ti convince, tocca <b>✔</b>. Se va migliorata, tocca <b>✏️</b> e correggila: vale subito per tutti, e i colleghi potranno annullarla. Si fa quando capita: non c\'è niente da completare. I ragazzi non vedono le spunte.</p>' +
        '<button type="button" class="rv-link" data-rv-spegni>Nascondi le spunte</button></div>';
      el.querySelector('[data-rv-spegni]').onclick = function () { ls('lingue-revisione', 'off'); porta(el); if (ultima) ultima.querySelectorAll('.rv-spunte,.rv-form,.rv-sugg').forEach(function (x) { x.remove(); }); };
      return;
    }
    if (s) {
      el.innerHTML = '<p class="rv-porta"><button type="button" class="rv-link" data-rv-accendi>👩‍🏫 Mostra le spunte dei docenti</button></p>';
      el.querySelector('[data-rv-accendi]').onclick = function () { ls('lingue-revisione', null); porta(el); if (ultima) decora(ultima); };
      return;
    }
    el.innerHTML = '<p class="rv-porta"><button type="button" class="rv-link" data-rv-entra>👩‍🏫 Sei un docente? Puoi segnalare le frasi da migliorare</button></p>';
    el.querySelector('[data-rv-entra]').onclick = function () { entra(el); };
  }
  function entra(el) {
    var mail = '';
    el.innerHTML = '<div class="rv-barra"><p><b>👩‍🏫 Per i docenti</b></p><p>Entri con la mail della scuola: ti arriva un codice per posta. È lo stesso accesso della Sala studio e vale 60 giorni su questo dispositivo.</p>' +
      '<div class="rv-riga" data-rv-f="1"><input type="email" placeholder="nome.cognome@alberghierorieti.it" aria-label="La tua mail della scuola" data-rv-m/><button type="button" class="rv-b pieno" data-rv-manda>Mandami il codice</button></div>' +
      '<div class="rv-riga" data-rv-f="2" hidden><input type="text" inputmode="numeric" maxlength="7" placeholder="Il codice di 6 cifre" aria-label="Il codice ricevuto per posta" data-rv-c/><button type="button" class="rv-b pieno" data-rv-entra>Entra</button></div>' +
      '<p class="rv-err" role="alert" data-rv-err></p><button type="button" class="rv-link" data-rv-annulla>Annulla</button></div>';
    var err = el.querySelector('[data-rv-err]');
    el.querySelector('[data-rv-annulla]').onclick = function () { porta(el); };
    function manda() {
      mail = el.querySelector('[data-rv-m]').value.trim().toLowerCase();
      if (mail && mail.indexOf('@') < 0) mail = mail.replace(/\s+/g, '.') + '@alberghierorieti.it';
      if (!/^[^\s@]+@alberghierorieti\.(edu\.)?it$/.test(mail)) { err.textContent = 'Serve la mail della scuola: @alberghierorieti.it o @alberghierorieti.edu.it.'; return; }
      err.textContent = ''; chiama({ azione: 'richiedi', email: mail }).then(function (r) {
        if (!r.ok) { err.textContent = r.errore === 'troppo-presto' ? 'Aspetta mezzo minuto e riprova.' : r.errore === 'troppi' ? 'Troppi codici richiesti: riprova tra un\'ora.' : 'In questo momento non riesco a spedire la mail. Riprova tra poco.'; return; }
        el.querySelector('[data-rv-f="1"]').hidden = true; el.querySelector('[data-rv-f="2"]').hidden = false; el.querySelector('[data-rv-c]').focus();
        err.textContent = '📬 Ti abbiamo scritto a ' + mail + ' (guarda anche nello spam).';
      });
    }
    function verifica() {
      chiama({ azione: 'verifica', email: mail, codice: el.querySelector('[data-rv-c]').value }).then(function (r) {
        if (!r.ok) { err.textContent = 'Codice sbagliato o scaduto: controlla la mail o richiedine un altro.'; return; }
        ls('studio-sessione', JSON.stringify({ t: r.sessione, email: r.email, nome: r.nome, scade: Date.now() + 59 * 24 * 3600 * 1000 }));
        ls('lingue-revisione', null); carica = null; dati = null; porta(el); if (ultima) decora(ultima);
      });
    }
    el.querySelector('[data-rv-manda]').onclick = manda;
    el.querySelector('[data-rv-m]').addEventListener('keydown', function (e) { if (e.key === 'Enter') manda(); });
    el.querySelector('[data-rv-entra]').onclick = verifica;
    el.querySelector('[data-rv-c]').addEventListener('input', function () { if (this.value.replace(/\D/g, '').length === 6) verifica(); });
    el.querySelector('[data-rv-m]').focus();
  }
  /* gli attributi da mettere sull'elemento che contiene una frase: chiave stabile, lingua, testo mostrato */
  function attr(k, l, t) { return ' data-rv-k="' + esc(k) + '" data-rv-l="' + esc(l) + '" data-rv-t="' + esc(t) + '"'; }

  /* da sé: quando la pagina mostra frasi nuove (cambio di scena, di lingua, di passo) arrivano anche le spunte;
     e in fondo alla pagina compare il link per i docenti, se la pagina non l'ha già messo */
  if (window.MutationObserver) new MutationObserver(function (m) {
    if (!attiva()) return;
    for (var i = 0; i < m.length; i++) for (var j = 0; j < m[i].addedNodes.length; j++) {
      var n = m[i].addedNodes[j];
      if (n.nodeType === 1 && (n.hasAttribute('data-rv-k') || n.querySelector('[data-rv-k]'))) return decora(document.body, true);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
  function avvio() {
    if (!barra) { var d = document.getElementById('rv-porta'); if (!d) { d = document.createElement('div'); d.id = 'rv-porta'; d.className = 'w'; (document.querySelector('main') || document.body).appendChild(d); } porta(d); }
    decora(document.body, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio); else setTimeout(avvio, 0);

  return { porta: porta, decora: decora, attr: attr };
})();
