/* ════════════════════════════════════════════════════════
   REVISIONE — le spunte dei docenti sulle frasi, mentre usano il sito
   Niente da completare: chi è docente, quando una frase gli passa sotto gli occhi,
   può toccare ✔ (va bene) o ✏️ (la scriverei così). Gli studenti non vedono niente.
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

  /* ───── le spunte già date, per frase e lingua ───── */
  function prendi() {
    if (!carica) carica = chiama({ revisioni: true }).then(function (r) { if (r.ok) { dati = r.revisioni; } else carica = null; return r; });
    return carica;
  }
  function di(k, l) { return (dati || []).filter(function (x) { return x.chiave === k && x.lingua === l; }); }

  /* soloNuove: aggiunge le spunte solo dove mancano (lo usa l'osservatore, che le mette da sé quando la pagina cambia) */
  function decora(radice, soloNuove) {
    radice = radice || document.body; ultima = document.body;
    if (!attiva()) return;
    if (!dati) { prendi().then(function () { decora(document.body); }); return; }
    radice.querySelectorAll('[data-rv-k]').forEach(function (el) {
      var vecchio = el.querySelector(':scope > .rv-spunte'); if (vecchio) { if (soloNuove) return; vecchio.remove(); }
      var k = el.getAttribute('data-rv-k'), l = el.getAttribute('data-rv-l'), tutte = di(k, l);
      var mia = tutte.filter(function (x) { return x.mia; })[0], ok = tutte.filter(function (x) { return x.stato === 'ok'; }), prop = tutte.filter(function (x) { return x.stato === 'proposta'; });
      var box = document.createElement('div'); box.className = 'rv-spunte';
      box.innerHTML = '<button type="button" class="rv-b' + (mia && mia.stato === 'ok' ? ' si' : '') + '" data-rv="ok" aria-pressed="' + !!(mia && mia.stato === 'ok') + '" title="Va bene così">✔</button>' +
        '<button type="button" class="rv-b' + (mia && mia.stato === 'proposta' ? ' si' : '') + '" data-rv="mod" title="La scriverei diversamente">✏️</button>' +
        (ok.length ? '<span class="rv-i" title="Hanno detto che va bene">✔ ' + ok.map(function (x) { return esc(x.mia ? 'tu' : x.nome); }).join(', ') + '</span>' : '') +
        (prop.length ? '<button type="button" class="rv-i rv-link" data-rv="vedi">✏️ ' + prop.length + (prop.length === 1 ? ' suggerimento' : ' suggerimenti') + '</button>' : '');
      el.appendChild(box);
      box.addEventListener('click', function (e) {
        var b = e.target.closest('[data-rv]'); if (!b) return;
        var cosa = b.getAttribute('data-rv');
        if (cosa === 'ok') return salva(el, { stato: mia && mia.stato === 'ok' ? 'via' : 'ok' });
        if (cosa === 'mod') return modulo(el, mia);
        if (cosa === 'vedi') return suggerimenti(el, prop);
      });
    });
  }
  function salva(el, r) {
    r.chiave = el.getAttribute('data-rv-k'); r.lingua = el.getAttribute('data-rv-l'); r.testo = el.getAttribute('data-rv-t');
    return chiama({ revisione: r }).then(function (x) {
      if (!x.ok) return avviso(x.errore === 'sessione' || x.errore === 'mail' ? 'L\'accesso è scaduto: rientra con la tua mail della scuola (in fondo alla pagina).' : 'Non sono riuscito a salvare: controlla la connessione e riprova.');
      dati = x.revisioni; decora(ultima);
      toast(r.stato === 'ok' ? 'Grazie! ✔' : r.stato === 'via' ? 'Spunta tolta' : 'Suggerimento salvato ✏️');
    });
  }
  function modulo(el, mia) {
    var vecchio = el.querySelector('.rv-form'); if (vecchio) return vecchio.remove();
    var f = document.createElement('div'); f.className = 'rv-form';
    f.innerHTML = '<label>Come la scriveresti?<input type="text" maxlength="300" data-rv-p value="' + esc(mia && mia.proposta || el.getAttribute('data-rv-t')) + '"/></label>' +
      '<label>Una nota (facoltativa)<input type="text" maxlength="300" data-rv-n placeholder="es. più formale; in Spagna si dice…" value="' + esc(mia && mia.nota || '') + '"/></label>' +
      '<div class="rv-az"><button type="button" class="rv-b" data-rv-a>Annulla</button><button type="button" class="rv-b pieno" data-rv-s>Salva il suggerimento</button></div>' +
      (mia && mia.stato === 'proposta' ? '<button type="button" class="rv-link" data-rv-via>Togli il mio suggerimento</button>' : '');
    el.appendChild(f); f.querySelector('[data-rv-p]').focus();
    f.querySelector('[data-rv-a]').onclick = function () { f.remove(); };
    f.querySelector('[data-rv-s]').onclick = function () {
      var p = f.querySelector('[data-rv-p]').value.trim(); if (!p) return f.querySelector('[data-rv-p]').focus();
      salva(el, { stato: 'proposta', proposta: p, nota: f.querySelector('[data-rv-n]').value.trim() });
    };
    var via = f.querySelector('[data-rv-via]'); if (via) via.onclick = function () { salva(el, { stato: 'via' }); };
  }
  function suggerimenti(el, prop) {
    var vecchio = el.querySelector('.rv-sugg'); if (vecchio) return vecchio.remove();
    var d = document.createElement('div'); d.className = 'rv-sugg';
    d.innerHTML = prop.map(function (x) { return '<p><b>' + esc(x.mia ? 'Tu' : x.nome) + ':</b> «' + esc(x.proposta) + '»' + (x.nota ? ' <i>— ' + esc(x.nota) + '</i>' : '') + '</p>'; }).join('');
    el.appendChild(d);
  }

  /* ───── in fondo alla pagina: il link per i docenti, oppure la barra della modalità docente ───── */
  function porta(el) {
    barra = el;
    var s = sessione();
    if (s && attiva()) {
      el.innerHTML = '<div class="rv-barra"><p><b>👩‍🏫 Modalità docente</b> · ' + esc(s.nome || s.email) + '</p>' +
        '<p>Se mentre usi il vocabolario una frase ti convince, tocca <b>✔</b>; se la scriveresti diversamente, tocca <b>✏️</b>. Si fa quando capita: non c\'è niente da completare. I ragazzi non vedono le spunte.</p>' +
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
