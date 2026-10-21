/* Area docenti: accesso protetto.
   Le pagine riservate stanno nel repository solo in forma cifrata (lingue/docenti/*.enc, AES-256-GCM).
   La chiave si ottiene in due modi:
   1) con il proprio account: e-mail confermata, docente abilitato e secondo fattore (codice sul telefono);
      la chiave viene rilasciata dal database (funzione lingue_accesso) solo a chi ha tutti e tre i requisiti;
   2) con il codice del Dipartimento: una chiave di scorta, a sua volta cifrata con il codice.
   Dopo la decifratura la pagina viene aperta in questa stessa scheda. */
(function () {
  'use strict';
  var URL_SB = 'https://sawclsysqnjsvbobioqo.supabase.co';
  var CHIAVE_SB = 'sb_publishable_sUgIVDar21Sf5Dtr3D7nhQ_kpOB57FQ';
  var SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  var MAIL = 'michele.gaggiano@alberghierorieti.it';
  var K_AUTH = 'lingue-docenti-auth', K_DIP = 'lingue-chiave-dip', MIN_PW = 12;
  var sb = null, sdkP = null;

  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function haSessione() { try { return !!localStorage.getItem(K_AUTH); } catch (e) { return false; } }
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

  /* ───── Supabase ───── */
  function caricaSdk() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (sdkP) return sdkP;
    sdkP = new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = SDK; s.onload = function () { ok(); }; s.onerror = function () { no(new Error('sdk')); };
      document.head.appendChild(s);
    });
    return sdkP;
  }
  function cliente() {
    return caricaSdk().then(function () {
      if (!sb) sb = window.supabase.createClient(URL_SB, CHIAVE_SB, { auth: { storageKey: K_AUTH, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
      return sb;
    });
  }
  function chiaveDaAccount() {
    return cliente().then(function (c) {
      return c.auth.getSession().then(function (r) {
        if (!r.data || !r.data.session) throw new Error('no-sessione');
        return c.auth.mfa.getAuthenticatorAssuranceLevel();
      }).then(function (r) {
        if (!r.data || r.data.currentLevel !== 'aal2') throw new Error('no-mfa');
        return c.rpc('lingue_accesso');
      }).then(function (r) {
        if (r.error || !r.data || !r.data.chiave) throw new Error('no-abilitato');
        return r.data.chiave;
      });
    });
  }
  /* prova ad avere la chiave senza mostrare nulla */
  function silenzioso() {
    var d = ss(K_DIP); if (d) return Promise.resolve(d);
    if (!haSessione()) return Promise.reject(new Error('no-sessione'));
    return chiaveDaAccount();
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
    '.ac .qr{text-align:center;margin:.6rem 0}.ac .qr img{width:190px;height:190px;background:#fff;padding:6px;border-radius:10px}.ac code{display:block;word-break:break-all;background:var(--av,#f6f1e6);padding:.45rem .6rem;border-radius:8px;font-size:.8rem;margin:.3rem 0}' +
    '.ac .sep{display:flex;align-items:center;gap:.6rem;margin:1.1rem 0 .1rem;color:#8a8a8a;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em}.ac .sep:before,.ac .sep:after{content:"";flex:1;border-top:1px solid var(--av3,#e4dccb)}' +
    '.ac-bar{position:fixed;left:12px;bottom:12px;z-index:9999;display:flex;gap:.5rem;align-items:center;background:rgba(44,62,45,.92);color:#fff;font:600 .72rem var(--fu,sans-serif);padding:.4rem .4rem .4rem .8rem;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.25)}' +
    '.ac-bar button{border:0;border-radius:999px;background:#D4AA4A;color:#2C3E2D;font:800 .68rem var(--fu,sans-serif);padding:.35rem .75rem;cursor:pointer}@media print{.ac-bar{display:none!important}}' +
    '.ac-vel{position:fixed;inset:0;z-index:9998;background:rgba(20,30,22,.6);overflow:auto;padding:1rem}.ac-vel .x{position:absolute;right:1rem;top:1rem;border:0;background:#fff;border-radius:999px;width:36px;height:36px;font-size:1.1rem;cursor:pointer}';
  function stile() { if (document.getElementById('ac-stile')) return; var s = document.createElement('style'); s.id = 'ac-stile'; s.textContent = CSS; document.head.appendChild(s); }

  function errore(e) {
    var m = String((e && e.message) || e || '');
    if (/Invalid login/i.test(m)) return 'E-mail o password non corretti.';
    if (/not confirmed/i.test(m)) return 'L\'e-mail non è ancora confermata: aprite il messaggio che avete ricevuto.';
    if (/rate|too many|seconds/i.test(m)) return 'Troppi tentativi: attendete un minuto e riprovate.';
    if (/Invalid TOTP|invalid.*code|expired/i.test(m)) return 'Codice non valido o scaduto. Inseritene uno nuovo.';
    if (/sdk|fetch|network|Failed/i.test(m)) return 'Connessione non riuscita. Controllate la rete e riprovate.';
    if (/already registered|already been/i.test(m)) return 'Esiste già un account con questa e-mail: usate «Accedi».';
    if (/weak|password/i.test(m)) return 'Password non accettata: usate almeno ' + MIN_PW + ' caratteri.';
    return 'Operazione non riuscita. Riprovate tra poco.';
  }

  /* disegna la procedura dentro `box`; chiama fine(chiave) quando la chiave è disponibile */
  function interfaccia(box, fine) {
    stile();
    var cl = null;
    function vista(h) { box.innerHTML = '<div class="ac"><div class="ac-c">' + h + '</div></div>'; var i = box.querySelector('input'); if (i) try { i.focus(); } catch (e) {} }
    function msg(t, ok) { var p = box.querySelector('.ac-m'); if (!p) return; p.className = 'ac-m ' + (ok ? 'o' : 'e'); p.textContent = t; }
    function occupato(b, on) { if (b) b.disabled = on; }
    function intesta() { return '<h2>Area riservata ai docenti</h2>'; }

    function accedi() {
      vista(intesta() + '<p class="s">Materiali per i docenti di lingue. Si entra con il proprio account e un codice sul telefono.</p>' +
        '<form id="ac-f"><label for="ac-m1">E-mail istituzionale</label><input id="ac-m1" type="email" autocomplete="username" required placeholder="nome.cognome@alberghierorieti.it"/>' +
        '<label for="ac-p1">Password</label><input id="ac-p1" type="password" autocomplete="current-password" required/>' +
        '<p class="ac-m" role="alert"></p><button class="b" type="submit">Accedi</button></form>' +
        '<button type="button" class="l" id="ac-nuovo">Prima volta? Crea l\'account</button> <button type="button" class="l" id="ac-dim">Password dimenticata</button>' +
        '<div class="sep">oppure</div><form id="ac-fd"><label for="ac-c1">Codice del Dipartimento</label><input id="ac-c1" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX"/>' +
        '<p class="ac-m2" role="alert"></p><button class="b" type="submit" style="background:#8a6d1f">Entra con il codice</button></form>');
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'); occupato(b, true);
        cliente().then(function (c) { return c.auth.signInWithPassword({ email: box.querySelector('#ac-m1').value.trim().toLowerCase(), password: box.querySelector('#ac-p1').value }); })
          .then(function (r) { if (r.error) throw r.error; dopoAccesso(); })
          .catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
      box.querySelector('#ac-fd').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'), m2 = box.querySelector('.ac-m2'); occupato(b, true);
        daCodice(box.querySelector('#ac-c1').value).then(function (k) { ss(K_DIP, k); fine(k); })
          .catch(function () { occupato(b, false); m2.className = 'ac-m2 e'; m2.textContent = 'Codice non valido.'; });
      });
      box.querySelector('#ac-nuovo').addEventListener('click', nuovo);
      box.querySelector('#ac-dim').addEventListener('click', dimenticata);
    }
    function nuovo() {
      vista(intesta() + '<p class="s">Create il vostro account con l\'e-mail istituzionale. Riceverete un messaggio per confermarla. Poi l\'accesso va abilitato: scrivete a ' + MAIL + '.</p>' +
        '<form id="ac-f"><label for="ac-m1">E-mail istituzionale</label><input id="ac-m1" type="email" autocomplete="username" required/>' +
        '<label for="ac-p1">Scegliete una password (almeno ' + MIN_PW + ' caratteri)</label><input id="ac-p1" type="password" autocomplete="new-password" minlength="' + MIN_PW + '" required/>' +
        '<p class="ac-m" role="alert"></p><button class="b" type="submit">Crea l\'account</button></form><button type="button" class="l" id="ac-ind">← Torna all\'accesso</button>');
      box.querySelector('#ac-ind').addEventListener('click', accedi);
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'), pw = box.querySelector('#ac-p1').value;
        if (pw.length < MIN_PW) { msg('La password deve avere almeno ' + MIN_PW + ' caratteri.'); return; }
        occupato(b, true);
        cliente().then(function (c) { return c.auth.signUp({ email: box.querySelector('#ac-m1').value.trim().toLowerCase(), password: pw, options: { emailRedirectTo: location.href.split('#')[0] } }); })
          .then(function (r) { if (r.error) throw r.error; occupato(b, false); msg('Fatto. Aprite il messaggio che vi abbiamo inviato e confermate l\'e-mail; poi tornate qui e accedete.', true); })
          .catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
    }
    function dimenticata() {
      vista(intesta() + '<p class="s">Scrivete l\'e-mail: vi invieremo un collegamento per scegliere una nuova password.</p>' +
        '<form id="ac-f"><label for="ac-m1">E-mail istituzionale</label><input id="ac-m1" type="email" required/><p class="ac-m" role="alert"></p><button class="b" type="submit">Invia il collegamento</button></form><button type="button" class="l" id="ac-ind">← Torna all\'accesso</button>');
      box.querySelector('#ac-ind').addEventListener('click', accedi);
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'); occupato(b, true);
        cliente().then(function (c) { return c.auth.resetPasswordForEmail(box.querySelector('#ac-m1').value.trim().toLowerCase(), { redirectTo: location.href.split('#')[0] }); })
          .then(function () { occupato(b, false); msg('Se l\'indirizzo è registrato, il collegamento è in arrivo.', true); })
          .catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
    }
    function nuovaPassword() {
      vista(intesta() + '<p class="s">Scegliete la nuova password.</p><form id="ac-f"><label for="ac-p1">Nuova password (almeno ' + MIN_PW + ' caratteri)</label><input id="ac-p1" type="password" autocomplete="new-password" minlength="' + MIN_PW + '" required/><p class="ac-m" role="alert"></p><button class="b" type="submit">Salva</button></form>');
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'), pw = box.querySelector('#ac-p1').value;
        if (pw.length < MIN_PW) { msg('La password deve avere almeno ' + MIN_PW + ' caratteri.'); return; }
        occupato(b, true);
        cl.auth.updateUser({ password: pw }).then(function (r) { if (r.error) throw r.error; dopoAccesso(); }).catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
    }
    function esci() { return cliente().then(function (c) { return c.auth.signOut(); }).catch(function () {}).then(function () { ss(K_DIP, null); accedi(); }); }
    function nonAbilitato(email) {
      vista(intesta() + '<p class="s">L\'account <b>' + esc(email || '') + '</b> non è ancora abilitato all\'area docenti.</p><p class="o">Per l\'abilitazione scrivete a <b>' + MAIL + '</b>, indicando questo indirizzo.</p><button type="button" class="b" id="ac-esci">Esci</button>');
      box.querySelector('#ac-esci').addEventListener('click', esci);
    }
    function dopoAccesso() {
      cliente().then(function (c) {
        cl = c;
        return c.rpc('lingue_stato').then(function (r) {
          if (r.error || !r.data || !r.data.abilitato) { nonAbilitato(r.data && r.data.email); return; }
          return c.auth.mfa.getAuthenticatorAssuranceLevel().then(function (a) {
            if (a.data && a.data.currentLevel === 'aal2') return chiaveDaAccount().then(fine);
            return c.auth.mfa.listFactors().then(function (f) {
              var verificati = (f.data && f.data.totp) || [];
              if (verificati.length) return richiediCodice(verificati[0].id);
              var inSospeso = ((f.data && f.data.all) || []).filter(function (x) { return x.factor_type === 'totp' && x.status !== 'verified'; });
              return Promise.all(inSospeso.map(function (x) { return c.auth.mfa.unenroll({ factorId: x.id }); })).then(iscrivi);
            });
          });
        });
      }).catch(function (er) { accedi(); msg(errore(er)); });
    }
    function richiediCodice(fid) {
      vista(intesta() + '<p class="s">Inserite il codice a sei cifre mostrato dall\'app di autenticazione sul vostro telefono.</p>' +
        '<form id="ac-f"><label for="ac-t">Codice</label><input id="ac-t" class="cod" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required/><p class="ac-m" role="alert"></p><button class="b" type="submit">Conferma</button></form><button type="button" class="l" id="ac-esci">Esci</button>');
      box.querySelector('#ac-esci').addEventListener('click', esci);
      box.querySelector('#ac-f').addEventListener('submit', function (e) {
        e.preventDefault(); var b = e.target.querySelector('button'); occupato(b, true);
        cl.auth.mfa.challengeAndVerify({ factorId: fid, code: box.querySelector('#ac-t').value.trim() })
          .then(function (r) { if (r.error) throw r.error; return chiaveDaAccount(); }).then(fine)
          .catch(function (er) { occupato(b, false); msg(errore(er)); });
      });
    }
    function iscrivi() {
      cl.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Area docenti ' + Date.now() }).then(function (r) {
        if (r.error) throw r.error;
        var d = r.data;
        vista(intesta() + '<p class="s"><b>Primo accesso: attivate il codice sul telefono.</b> Aprite un\'app di autenticazione (Google Authenticator, Microsoft Authenticator, Aegis...), inquadrate il codice QR e scrivete qui il numero a sei cifre che compare.</p>' +
          '<div class="qr"><img alt="Codice QR per l\'app di autenticazione" src="' + esc(d.totp.qr_code) + '"/></div><p class="s" style="margin:0">Se non potete inquadrare, inserite questa chiave nell\'app:</p><code>' + esc(d.totp.secret) + '</code>' +
          '<form id="ac-f"><label for="ac-t">Codice a sei cifre</label><input id="ac-t" class="cod" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required/><p class="ac-m" role="alert"></p><button class="b" type="submit">Attiva e entra</button></form>');
        box.querySelector('#ac-f').addEventListener('submit', function (e) {
          e.preventDefault(); var b = e.target.querySelector('button'); occupato(b, true);
          cl.auth.mfa.challengeAndVerify({ factorId: d.id, code: box.querySelector('#ac-t').value.trim() })
            .then(function (r2) { if (r2.error) throw r2.error; return chiaveDaAccount(); }).then(fine)
            .catch(function (er) { occupato(b, false); msg(errore(er)); });
        });
      }).catch(function (er) { accedi(); msg(errore(er)); });
    }

    /* avvio: sessione già presente? richiesta di nuova password? */
    if (haSessione() || /type=(recovery|signup)|access_token|code=/.test(location.hash + location.search)) {
      vista(intesta() + '<p class="s">Controllo dell\'accesso…</p>');
      cliente().then(function (c) {
        cl = c;
        c.auth.onAuthStateChange(function (ev) { if (ev === 'PASSWORD_RECOVERY') nuovaPassword(); });
        return c.auth.getSession();
      }).then(function (r) {
        if (/type=recovery/.test(location.hash)) return;
        if (r.data && r.data.session) dopoAccesso(); else accedi();
      }).catch(function () { accedi(); });
    } else accedi();
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
      var fine = function () { location.href = 'lingue/docenti.html'; };
      if (!haSessione()) return fine();
      cliente().then(function (c) { return c.auth.signOut(); }).then(fine, fine);
    });
    document.body.appendChild(b);
  }

  window.ACCESSO = { avvia: avvia, entra: entra, barra: barra, innesta: innesta, preparaLezioni: preparaLezioni, silenzioso: silenzioso };
})();
