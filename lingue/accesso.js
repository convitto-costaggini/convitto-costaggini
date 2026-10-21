/* Area docenti: accesso protetto.
   Le pagine riservate stanno nel repository solo in forma cifrata (lingue/docenti/*.enc, AES-256-GCM).
   La chiave si ottiene in due modi:
   1) con il proprio indirizzo istituzionale: un codice monouso arriva per e-mail; la funzione lingue-accesso
      rilascia la chiave solo ai docenti abilitati nell'elenco;
   2) con il codice del Dipartimento: una chiave di scorta, a sua volta cifrata con il codice.
   La chiave resta solo nella memoria della scheda (sessionStorage) e sparisce alla chiusura.
   Dopo la decifratura la pagina viene aperta in questa stessa scheda. */
(function () {
  'use strict';
  var API = 'https://sawclsysqnjsvbobioqo.supabase.co/functions/v1/lingue-accesso';
  var MAIL = 'michele.gaggiano@alberghierorieti.it';
  var K_DIP = 'lingue-chiave-dip';

  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ───── cifratura ───── */
  function b64d(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function enc(s) { return new TextEncoder().encode(s); }
  function chiaveAes(raw) { return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']); }
  function decifra(chiaveB64, nome, o) {
    return chiaveAes(b64d(chiaveB64)).then(function (k) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(o.iv), additionalData: enc(nome) }, k, b64d(o.c));
    }).then(function (b) { return new TextDecoder().decode(b); });
  }
  function leggiEnc(nome, chiave) {
    return fetch('lingue/docenti/' + nome + '.enc', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('file');
      return r.json();
    }).then(function (o) { return decifra(chiave, nome, o); });
  }
  /* chiave di scorta del Dipartimento: PBKDF2 sul codice, poi AES-GCM sulla chiave principale */
  function daCodice(codice) {
    var pulito = String(codice).toUpperCase().replace(/[^A-Z0-9]/g, '');
    return fetch('lingue/docenti/accesso-dipartimento.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('file'); return r.json(); }).then(function (o) {
      return crypto.subtle.importKey('raw', enc(pulito), 'PBKDF2', false, ['deriveKey']).then(function (base) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64d(o.salt), iterations: o.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      }).then(function (kek) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(o.iv), additionalData: enc('dipartimento') }, kek, b64d(o.c));
      }).then(function (b) { return btoa(String.fromCharCode.apply(null, new Uint8Array(b))); });
    });
  }

  /* ───── servizio di accesso ───── */
  function chiama(corpo) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) { var e = new Error(j.errore || 'rete'); e.stato = r.status; throw e; } return j; });
    });
  }
  /* prova ad avere la chiave senza mostrare nulla */
  function silenzioso() {
    var d = ss(K_DIP);
    return d ? Promise.resolve(d) : Promise.reject(new Error('no-chiave'));
  }

  /* ───── dati delle lezioni (scheda Docente e verifiche) ───── */
  function innesta() {
    var D = window.LEZIONI_DOCENTE, L = window.LEZIONI; if (!D || !L) return;
    L.forEach(function (l) {
      var d = D[l.id]; if (!d) return;
      l.docente = d.docente;
      Object.keys(d.verifica || {}).forEach(function (c) { if (l.lingue && l.lingue[c]) l.lingue[c].verifica = d.verifica[c]; });
    });
  }
  /* per le pagine pubbliche (Lezioni): se chi guarda è già dentro, recupera la scheda Docente; altrimenti non cambia nulla */
  function preparaLezioni() {
    return silenzioso().then(function (k) { return leggiEnc('lezioni-docente', k); }).then(function (t) {
      window.LEZIONI_DOCENTE = JSON.parse(t); innesta(); return true;
    }).catch(function () { return false; });
  }

  /* ───── interfaccia ───── */
  var CSS = '.ac{max-width:460px;margin:2rem auto;padding:0 1rem}.ac-c{background:#fff;border:2px solid var(--av3,#e4dccb);border-radius:18px;padding:1.4rem 1.3rem;box-shadow:0 10px 30px rgba(44,62,45,.08)}' +
    '.ac h2{font-family:var(--fd,serif);color:var(--bosco,#2C3E2D);font-size:1.5rem;margin:0 0 .3rem;line-height:1.2}.ac .s{font-size:.88rem;line-height:1.55;color:var(--txt2,#555);margin:0 0 1rem}' +
    '.ac label{display:block;font:700 .68rem var(--fu,sans-serif);letter-spacing:.07em;text-transform:uppercase;color:var(--bosco,#2C3E2D);margin:.85rem 0 .3rem}' +
    '.ac input{width:100%;box-sizing:border-box;font:500 1rem var(--fu,sans-serif);padding:.7rem .85rem;border:1.5px solid var(--av3,#e4dccb);border-radius:10px;background:var(--av,#f6f1e6)}' +
    '.ac input:focus{outline:2px solid var(--oro,#D4AA4A);outline-offset:1px}.ac .cod{letter-spacing:.35em;text-align:center;font-size:1.4rem}' +
    '.ac .b{display:block;width:100%;margin-top:1.1rem;padding:.8rem 1rem;border:0;border-radius:12px;background:var(--bosco,#2C3E2D);color:#fff;font:800 .85rem var(--fu,sans-serif);letter-spacing:.06em;text-transform:uppercase;cursor:pointer}' +
    '.ac .b:disabled{opacity:.55;cursor:wait}.ac .l{background:none;border:0;color:var(--bosco,#2C3E2D);font:600 .82rem var(--fu,sans-serif);text-decoration:underline;cursor:pointer;padding:.35rem 0;margin-top:.5rem}' +
    '.ac .e{margin:.8rem 0 0;padding:.6rem .8rem;border-radius:10px;background:#fdeceb;color:#8a1f17;font-size:.86rem;line-height:1.45}.ac .o{margin:.8rem 0 0;padding:.6rem .8rem;border-radius:10px;background:#eef3ee;color:#2C3E2D;font-size:.86rem;line-height:1.45}' +
    '' +
    '.ac .sep{display:flex;align-items:center;gap:.6rem;margin:1.1rem 0 .1rem;color:#8a8a8a;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em}.ac .sep:before,.ac .sep:after{content:"";flex:1;border-top:1px solid var(--av3,#e4dccb)}' +
    '.ac-bar{position:fixed;left:12px;bottom:12px;z-index:9999;display:flex;gap:.5rem;align-items:center;background:rgba(44,62,45,.92);color:#fff;font:600 .72rem var(--fu,sans-serif);padding:.4rem .4rem .4rem .8rem;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.25)}' +
    '.ac-bar button{border:0;border-radius:999px;background:#D4AA4A;color:#2C3E2D;font:800 .68rem var(--fu,sans-serif);padding:.35rem .75rem;cursor:pointer}@media print{.ac-bar{display:none!important}}' +
    '.ac-vel{position:fixed;inset:0;z-index:9998;background:rgba(20,30,22,.6);overflow:auto;padding:1rem}.ac-vel .x{position:absolute;right:1rem;top:1rem;border:0;background:#fff;border-radius:999px;width:36px;height:36px;font-size:1.1rem;cursor:pointer}';
  function stile() { if (document.getElementById('ac-stile')) return; var s = document.createElement('style'); s.id = 'ac-stile'; s.textContent = CSS; document.head.appendChild(s); }

  function errore(e) {
    var m = String((e && e.message) || e || '');
    if (/troppo-presto/.test(m)) return 'Attendete mezzo minuto prima di chiedere un altro codice.';
    if (/troppi/.test(m)) return 'Troppe richieste: riprovate tra un po\'.';
    if (/codice/.test(m)) return 'Codice non valido o scaduto. Richiedetene uno nuovo.';
    if (/invio/.test(m)) return 'Non è stato possibile spedire la mail. Riprovate tra poco.';
    if (/rete|fetch|network|Failed/i.test(m)) return 'Connessione non riuscita. Controllate la rete e riprovate.';
    return 'Operazione non riuscita. Riprovate tra poco.';
  }

  /* disegna la procedura dentro `box`; chiama fine(chiave) quando la chiave è disponibile */
  function interfaccia(box, fine) {
    stile();
    function vista(h) { box.innerHTML = '<div class="ac"><div class="ac-c">' + h + '</div></div>'; var i = box.querySelector('input'); if (i) try { i.focus(); } catch (e) {} }
    function msg(t, ok) { var p = box.querySelector('.ac-m'); if (!p) return; p.className = 'ac-m ' + (ok ? 'o' : 'e'); p.textContent = t; }
    function occupato(b, on) { if (b) b.disabled = on; }
    function intesta() { return '<h2>Area riservata ai docenti</h2>'; }

    function accedi() {
      vista(intesta() + '<p class="s">Materiali per i docenti di lingue. Scrivete la vostra e-mail istituzionale: vi invieremo un codice di accesso.</p>' +
        '<form id="ac-f"><label for="ac-m1">E-mail istituzionale</label><input id="ac-m1" type="email" autocomplete="username" required placeholder="nome.cognome@alberghierorieti.it"/>' +
        '<p class="ac-m" role="alert"></p><button class="b" type="submit">Invia il codice</button></form>' +
        '<div class="sep">oppure</div><form id="ac-fd"><label for="ac-c1">Codice del Dipartimento</label><input id="ac-c1" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX"/>' +
        '<p class="ac-m2" role="alert"></p><button class="b" type="submit" style="background:#8a6d1f">Entra con il codice</button></form>' +
        '<p class="s" style="margin:1rem 0 0;font-size:.8rem">Non siete ancora abilitati? Scrivete a ' + MAIL + '.</p>');
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'), mail = box.querySelector('#ac-m1').value.trim().toLowerCase(); occupato(b, true);
        invia(mail).then(function () { codice(mail); }).catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
      box.querySelector('#ac-fd').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'), m2 = box.querySelector('.ac-m2'); occupato(b, true);
        daCodice(box.querySelector('#ac-c1').value).then(function (k) { ss(K_DIP, k); fine(k); })
          .catch(function () { occupato(b, false); m2.className = 'ac-m2 e'; m2.textContent = 'Codice non valido.'; });
      });
    }
    /* il codice parte solo per gli indirizzi abilitati; la risposta a video è la stessa in ogni caso */
    function invia(mail) { return chiama({ azione: 'richiedi', email: mail }); }
    function codice(mail) {
      vista(intesta() + '<p class="s">Se l\'indirizzo <b>' + esc(mail) + '</b> è abilitato, tra pochi istanti riceverete un messaggio con un codice. Controllate anche la posta indesiderata.</p>' +
        '<form id="ac-f"><label for="ac-t">Codice ricevuto per e-mail</label><input id="ac-t" class="cod" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required/>' +
        '<p class="ac-m" role="alert"></p><button class="b" type="submit">Entra</button></form>' +
        '<button type="button" class="l" id="ac-ri">Invia di nuovo il codice</button> <button type="button" class="l" id="ac-ind">Cambia indirizzo</button>');
      box.querySelector('#ac-ind').addEventListener('click', accedi);
      var ri = box.querySelector('#ac-ri');
      ri.addEventListener('click', function () {
        ri.disabled = true; invia(mail).then(function () { msg('Codice inviato di nuovo.', true); setTimeout(function () { ri.disabled = false; }, 30000); }).catch(function (er) { ri.disabled = false; msg(errore(er)); });
      });
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'); occupato(b, true);
        chiama({ azione: 'verifica', email: mail, codice: box.querySelector('#ac-t').value.trim() })
          .then(function (r) { ss(K_DIP, r.chiave); fine(r.chiave); })
          .catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
    }
    accedi();
  }

  /* ───── pagina riservata ───── */
  function apri(html, chiave) {
    return leggiEnc('lezioni-docente', chiave).catch(function () { return 'null'; }).then(function (ld) {
      var testa = '<script>window.LEZIONI_DOCENTE=' + ld.replace(/</g, '\\u003c') + ';</script><script src="lingue/accesso.js"></script>';
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, function (m) { return m + testa; }) : testa + html;
      html = html.replace(/<\/body>/i, '<script>ACCESSO.barra();</script></body>');
      document.open(); document.write(html); document.close();
    });
  }
  function avvia(nome) {
    var box = document.getElementById('ac-box'); if (!box) return;
    var ok = function (k) {
      return leggiEnc(nome, k).then(function (html) { return apri(html, k); }).catch(function () {
        ss(K_DIP, null);
        box.innerHTML = '<div class="ac"><div class="ac-c"><h2>Pagina non disponibile</h2><p class="s">Non è stato possibile aprire il materiale. Riprovate tra poco o scrivete a ' + MAIL + '.</p></div></div>';
      });
    };
    silenzioso().then(ok).catch(function () { interfaccia(box, ok); });
  }
  /* finestra di accesso sopra una pagina pubblica (per esempio Lezioni) */
  function entra() {
    stile();
    var v = document.createElement('div'); v.className = 'ac-vel'; v.innerHTML = '<button class="x" type="button" aria-label="Chiudi">✕</button><div id="ac-box-v"></div>';
    document.body.appendChild(v);
    v.querySelector('.x').addEventListener('click', function () { v.remove(); });
    interfaccia(v.querySelector('#ac-box-v'), function () { location.reload(); });
  }
  function barra() {
    stile();
    var b = document.createElement('div'); b.className = 'ac-bar'; b.innerHTML = '<span>🔒 Area riservata</span><button type="button">Esci</button>';
    b.querySelector('button').addEventListener('click', function () {
      ss(K_DIP, null);
      location.href = 'lingue/docenti.html';
    });
    document.body.appendChild(b);
  }

  window.ACCESSO = { avvia: avvia, entra: entra, barra: barra, innesta: innesta, preparaLezioni: preparaLezioni, silenzioso: silenzioso };
})();
