/* ════════════════════════════════════════════════════════
   GRAMMATICA, EDITOR DEGLI ARGOMENTI PROPRI
   Il docente aggiunge in un minuto una regola, una procedura o un
   elemento di grammatica non previsto: nome, regola (facoltativa),
   frasi. L'argomento compare tra quelli pronti, in Verifiche e in ogni
   lezione. Salvato solo su questo dispositivo.
   Uso: GRAMMATICA.editorMiei(elemento, lingua, funzioneDopoModifica)
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var G = window.GRAMMATICA, L = window.LINGUE_SITO, esc = L.esc;
  if (!G) return;
  var ESEMPIO = {
    en: 'She [sets] the table every evening. | set | is setting = Lei apparecchia il tavolo ogni sera.',
    fr: 'Nous [irons] au marché demain. | allons | irai = Domani andremo al mercato.',
    es: 'Mañana [iremos] al mercado. | vamos | iré = Domani andremo al mercato.'
  };
  var stile = document.createElement('style');
  stile.textContent = '.gm{margin:.4rem 0 .8rem}.gm>summary{cursor:pointer;font:800 .68rem var(--fu);letter-spacing:.08em;text-transform:uppercase;color:var(--bosco)}' +
    '.gm-f{display:grid;gap:.6rem;margin-top:.6rem;background:#fff;border:1.5px solid var(--av3);border-radius:12px;padding:.8rem}' +
    '.gm-f label{display:block;font:700 .72rem var(--fu);color:var(--txt2)}.gm-f input,.gm-f textarea{display:block;width:100%;box-sizing:border-box;margin-top:.25rem;font:400 .92rem var(--fu);padding:.5rem .6rem;border:1.5px solid var(--av3);border-radius:8px;background:var(--bco)}' +
    '.gm-f small{display:block;font:400 .76rem var(--fu);color:var(--txt2);line-height:1.5;margin-top:.2rem}.gm-v{font-size:.8rem;color:var(--bosco);min-height:1.3em}.gm-v.no{color:#b91c1c}' +
    '.gm-l{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0;font-size:.82rem;align-items:center}.gm-l button{font:700 .62rem var(--fu);letter-spacing:.06em;text-transform:uppercase;border:1.5px solid var(--av3);background:#fff;border-radius:8px;padding:.35rem .6rem;cursor:pointer}';
  document.head.appendChild(stile);

  G.editorMiei = function (el, lin, dopo) {
    var st = el._gm || (el._gm = { modifica: null }); st.lin = lin; st.dopo = dopo;
    if (st.disegna) { st.modifica = null; st.disegna(); return; }
    var modifica = null;
    function lista() {
      var mie = G.miei().filter(function (m) { return m.lin === st.lin; });
      return mie.length ? '<div class="gm-l"><b>I vostri argomenti:</b>' + mie.map(function (m) { return '<span>' + esc(m.nome) + ' <button type="button" data-gm-mod="' + m.id + '">Modifica</button> <button type="button" data-gm-del="' + m.id + '">Elimina</button></span>'; }).join('') + '</div>' : '';
    }
    function disegna(aperto) {
      var m = modifica ? G.miei().filter(function (x) { return x.id === modifica; })[0] : null;
      el.innerHTML = lista() + '<details class="gm"' + (aperto || m ? ' open' : '') + '><summary>＋ ' + (m ? 'Modifica il vostro argomento' : 'Aggiungete un vostro argomento (regola, procedura, elemento di grammatica)') + '</summary>' +
        '<div class="gm-f"><label>Come si chiama<input type="text" data-gm="nome" maxlength="60" placeholder="es. Il futuro con il presente, Il passaggio dello scontrino" value="' + esc(m ? m.nome : '') + '"/></label>' +
        '<label>La regola o la procedura (facoltativa)<textarea data-gm="regola" rows="3" placeholder="Compare nella lezione come una scheda: scrivetela con parole vostre.">' + esc(m ? m.regola : '') + '</textarea></label>' +
        '<label>Le frasi, una per riga<textarea data-gm="righe" rows="5" placeholder="' + esc(ESEMPIO[st.lin] || ESEMPIO.en) + '">' + esc(m ? m.righe : '') + '</textarea>' +
        '<small>La parola giusta va tra <b>[parentesi quadre]</b>. Facoltativo: dopo il segno <b>|</b> una o due risposte sbagliate (per le domande a scelta), dopo il segno <b>=</b> la traduzione italiana. Senza risposte sbagliate la frase diventa un completamento o un riordino.</small></label>' +
        '<p class="gm-v" data-gm-v aria-live="polite"></p>' +
        '<div><button type="button" class="lg-btn pieno" data-gm-salva style="min-height:40px">Salva e usa</button> ' + (m ? '<button type="button" class="lg-btn" data-gm-ann style="min-height:40px">Annulla</button>' : '') + '</div></div></details>';
      controlla();
    }
    function campo(k) { var e = el.querySelector('[data-gm="' + k + '"]'); return e ? e.value : ''; }
    function controlla() {
      var v = el.querySelector('[data-gm-v]'); if (!v) return;
      var r = G.leggiRighe(campo('righe'));
      v.className = 'gm-v' + (r.err.length ? ' no' : '');
      v.textContent = !campo('righe').trim() ? '' : r.ok.length + (r.ok.length === 1 ? ' frase valida' : ' frasi valide') + (r.err.length ? '. Da correggere (manca una sola parola tra [parentesi quadre]): «' + r.err[0].slice(0, 50) + '»' : '.');
    }
    st.disegna = function () { modifica = null; disegna(); };
    el.addEventListener('input', controlla);
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.gmMod) { modifica = b.dataset.gmMod; disegna(true); }
      else if (b.dataset.gmDel) {
        var via = b.dataset.gmDel;
        FINESTRA.chiedi({ titolo: 'Eliminare questo argomento?', si: 'Elimina', pericolo: true }).then(function (ok) {
          if (ok) { G.salvaMiei(G.miei().filter(function (m) { return m.id !== via; })); modifica = null; disegna(); if (st.dopo) st.dopo(); }
        });
      }
      else if (b.hasAttribute('data-gm-ann')) { modifica = null; disegna(); }
      else if (b.hasAttribute('data-gm-salva')) {
        var nome = campo('nome').trim(), regola = campo('regola').trim(), righe = campo('righe'), r = G.leggiRighe(righe), v = el.querySelector('[data-gm-v]');
        if (!nome) { v.className = 'gm-v no'; v.textContent = 'Scrivete come si chiama l\'argomento.'; return; }
        if (!regola && !r.ok.length) { v.className = 'gm-v no'; v.textContent = 'Scrivete la regola oppure almeno una frase.'; return; }
        var a = G.miei(), o = modifica ? a.filter(function (m) { return m.id === modifica; })[0] : null;
        if (o) { o.nome = nome; o.regola = regola; o.righe = righe; }
        else a.push({ id: 'm' + Date.now().toString(36), lin: st.lin, nome: nome, regola: regola, righe: righe });
        G.salvaMiei(a);
        /* l'argomento appena salvato si seleziona da solo */
        var id = o ? o.id : a[a.length - 1].id, sel = L.leggi('gram-argomenti', []) || [];
        if (sel.indexOf(id) < 0) { sel.push(id); L.salva('gram-argomenti', sel); }
        modifica = null; disegna(); if (st.dopo) st.dopo(id);
      }
    });
    disegna();
  };
})();
