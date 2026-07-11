/* ═══════════════════════════════════════════════════════════════════
   FAQ — SORGENTE UNICA  ·  Convitto "Costaggini" — Rieti
   ───────────────────────────────────────────────────────────────────
   Un solo file con TUTTE le domande/risposte del sito.
   Le pagine non scrivono più FAQ a mano: inseriscono un contenitore e
   includono questo file. Esempi d'uso:

     <div data-faq="*" data-faq-search></div>      → tutte le voci + ricerca (hub)
     <div data-faq="iscrizione"></div>             → tutte le voci con quel tag
     <div data-faq-ids="costo,giornata,uscite"></div> → voci scelte, in quest'ordine

   Tag disponibili: iscrizione · vita · genitori · sicurezza · mensa ·
                    salute · semiconvitto · attivita · emotivo
   Rendering: <details>/<summary> nativi (accessibili, funzionano anche
   senza JS di toggle). window.FAQ_DATA è esposto per usi futuri
   (es. alimentare la base di conoscenza dell'assistente).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── DATI ────────────────────────────────────────────────────────── */
  var FAQ = [
    { id:'chi', tags:['iscrizione'],
      q:`Chi può iscriversi al Convitto?`,
      a:`Possono fare domanda tutti gli studenti iscritti all'IPSSEOA "R. A. Costaggini" di Rieti. Il Consiglio d'Istituto può ammettere, su richiesta e in base ai posti disponibili, anche studenti di altri istituti della città; la precedenza resta sempre agli alunni del Costaggini.` },

    { id:'come', tags:['iscrizione'], pill:'⏱ 30 secondi',
      q:`Come si fa a iscrivere un figlio al Convitto?`,
      a:`La procedura è in <strong>4 passi</strong>: ① iscrizione online all'IPSSEOA Costaggini sul portale del Ministero (entro fine gennaio) ② compilazione del <a href="domanda-ammissione.html">modulo di richiesta per il Convitto</a> ③ consegna della documentazione in segreteria e versamento della quota ④ colloquio con il Dirigente e gli educatori. Il posto non è automatico: viene assegnato in base alla disponibilità, quindi prima ci si muove, meglio è. <a href="ammissione.html">Guida completa all'ammissione &rarr;</a>` },

    { id:'quando-domanda', tags:['iscrizione'],
      q:`Entro quando va presentata la domanda?`,
      a:`La domanda si presenta insieme all'iscrizione scolastica, nei termini previsti per le scuole secondarie di secondo grado. Entro il <strong>7 luglio</strong> devono pervenire la documentazione richiesta e il pagamento della quota deliberata dal Consiglio d'Istituto. Le domande tardive vengono considerate solo se restano posti disponibili.` },

    { id:'costo', tags:['iscrizione','genitori'], pill:'⏱ 20 secondi',
      q:`Quanto costa stare in Convitto?`,
      a:`La retta è deliberata ogni anno dal Consiglio d'Istituto ed è calibrata sull'ISEE familiare: chi ha un ISEE basso paga meno — in alcuni casi anche zero — e sono previste riduzioni certificate e borse di studio regionali. Comprende vitto completo (quattro pasti al giorno), alloggio, studio guidato, attività e trasporto Convitto–scuola. Essendo una struttura pubblica statale, e non un collegio privato, i costi sono accessibili. Per il preventivo aggiornato: <a href="mailto:rirh010007@istruzione.it">rirh010007@istruzione.it</a>.` },

    { id:'apertura', tags:['iscrizione','vita'],
      q:`Quando è aperto il Convitto durante l'anno?`,
      a:`Il Convitto è aperto dal primo giorno di lezione fino al termine, esami compresi, da <strong>domenica sera (arrivo dalle 20:00) al venerdì mattina</strong>. Resta chiuso nei festivi del calendario scolastico regionale (1 novembre, 4 e 8 dicembre, 6 gennaio, 25 aprile, 1 maggio, 2 giugno) e in caso di ordinanze del Sindaco. Per il rientro domenicale sono previste corse con i mezzi del Convitto dai punti di ritrovo indicati a inizio anno.` },

    { id:'giornata', tags:['vita'], pill:'⏱ 20 secondi',
      q:`Com'è organizzata la giornata?`,
      a:`🌅 6:30 sveglia · 7:00 colazione · 8:00–14:00 scuola · 14:00 pranzo · 15:00–15:30 tempo libero · 15:30–17:15 studio guidato · 17:15 merenda · 17:30–19:15 libera uscita / sport / Laboratorio Musicale · 19:15 cena · 20:30–22:00 attività serali · 22:30 riposo. Gli orari si adattano all'orario scolastico. <a href="giornata-tipo.html">Il racconto completo della giornata &rarr;</a>` },

    { id:'camere', tags:['vita','iscrizione'],
      q:`Come sono organizzate le camere?`,
      a:`Le camere — prevalentemente triple — sono assegnate dall'educatore responsabile tenendo conto, per quanto possibile, di classe, età e rapporti tra gli studenti. La struttura è su cinque piani: tre per i convittori e due per le convittrici, rigorosamente separati. Il Convitto fornisce letto, materasso, cuscino (salvo allergie), armadietto e poggia-oggetti; al momento dell'assegnazione si firma un verbale di consegna.` },

    { id:'corredo', tags:['iscrizione','vita'],
      q:`Cosa deve portare lo studente all'ingresso?`,
      a:`Coperte o piumino, un completo da letto (lenzuola, federa, copertina), due asciugamani, un pigiama, ciabatte, un sacchetto per la biancheria sporca, appendiabiti e l'occorrente per la cura personale. Servono inoltre il certificato medico di idoneità alla vita convittuale e la tessera sanitaria. È sconsigliato portare oggetti di pregio o apparecchi elettronici di valore, di cui il Convitto non garantisce la custodia.` },

    { id:'uscite', tags:['vita','genitori'], pill:'⏱ 25 secondi',
      q:`Quando può uscire o tornare a casa?`,
      a:`I convittori rientrano a casa <strong>ogni fine settimana</strong> (venerdì pomeriggio, ritorno domenica sera o lunedì mattina). Durante la settimana è prevista una libera uscita quotidiana (17:30–19:15) previa autorizzazione scritta dei genitori, con rientro entro le 22:00. Le uscite straordinarie infrasettimanali richiedono richiesta scritta o via email con copia del documento; si possono delegare persone di fiducia per il ritiro. <a href="regolamento-guida.html#art-uscite">Regolamento uscite &rarr;</a>` },

    { id:'telefono', tags:['genitori'],
      q:`Mio figlio può chiamarmi quando vuole?`,
      a:`Sì, in qualunque momento: i ragazzi tengono con sé il cellulare. L'unico vincolo è spegnerlo in mensa, durante lo studio e nel riposo notturno. Non ci sono orari fissi per le telefonate ai genitori; i momenti più comodi sono il tempo libero (17:15–19:15) e la sera (20:00–22:30).` },

    { id:'studio', tags:['vita','genitori'], pill:'⏱ 20 secondi',
      q:`Riuscirà a studiare? Lo studio è seguito?`,
      a:`Ogni pomeriggio, dalle 15:30 alle 17:15, c'è lo <strong>studio guidato e obbligatorio</strong> con gli educatori: non solo "fare i compiti", ma costruire metodo, autonomia e abitudine allo studio. Gli educatori sono presenti su tutti i piani, aiutano e verificano il lavoro. Per difficoltà persistenti si attivano supporti aggiuntivi con la famiglia e il Consiglio di Classe; DSA e BES sono seguiti con piani personalizzati. <a href="servizi.html#studio">Lo studio guidato &rarr;</a>` },

    { id:'mensa', tags:['vita','mensa','genitori'], pill:'⏱ 15 secondi',
      q:`Cosa si mangia? Come sono gestite le allergie?`,
      a:`Quattro pasti al giorno con prodotti locali del territorio reatino e menù concordati con la <strong>ASL di Rieti</strong>, a rotazione settimanale; si mangia tutti insieme in sala mensa. Per i ragazzi più selettivi gli educatori vigilano con discrezione che mangino a sufficienza, senza forzature. Allergie, intolleranze e diete speciali — anche religiose o etiche — sono gestite con menù dedicati: basta segnalarle all'iscrizione con il certificato del medico curante. <a href="ammissione.html#acc-allergie-wrap">Modulo allergie e intolleranze &rarr;</a>` },

    { id:'notte', tags:['vita','sicurezza','genitori'], pill:'⏱ 15 secondi',
      q:`Chi c'è di notte? È al sicuro?`,
      a:`Gli educatori sono presenti <strong>24 ore su 24</strong>, notte compresa: non sorveglianti, ma educatori di ruolo selezionati per concorso pubblico, con formazione psicopedagogica. In ogni turno c'è almeno un educatore sveglio e operativo, più i custodi agli accessi; il cancello si chiude alle 22:30 e riapre alle 6:00. Per qualsiasi malessere notturno l'assistenza è immediata.` },

    { id:'bullismo', tags:['sicurezza'], pill:'⏱ 20 secondi',
      q:`E se viene bullizzato? Come lo gestite?`,
      a:`Politica di <strong>tolleranza zero</strong>. Il Convitto applica il Codice Interno per la prevenzione e il contrasto del bullismo e del cyberbullismo (Legge 71/2017): gli educatori, presenti H24, intervengono subito con ascolto, documentazione, comunicazione alle famiglie e percorso educativo. La presenza continua degli educatori è la prevenzione più efficace che esista. <a href="bullismo.html">Guida completa &rarr;</a>` },

    { id:'salute', tags:['vita','salute','genitori'],
      q:`Cosa succede se si ammala?`,
      a:`Per malattie lievi l'assistenza è garantita in Convitto dall'infermiera e dal medico convenzionato, con avviso alla famiglia; negli altri casi si dispone il rientro a casa in giornata. Di notte l'educatore di turno valuta la situazione: primo soccorso e avviso il mattino per i malesseri lievi, contatto immediato della famiglia e attivazione del 118 se necessario. In emergenza l'infermiera accompagna al pronto soccorso. Tutti i farmaci si custodiscono in infermeria, mai negli armadietti.` },

    { id:'dsa', tags:['genitori'],
      q:`Mio figlio ha un DSA: come viene supportato?`,
      a:`Il Convitto ha educatori con competenze specifiche su DSA e BES, formati su didattica inclusiva e apprendimento cooperativo. Durante lo studio guidato è garantito un supporto individualizzato. È importante comunicare la diagnosi al momento dell'iscrizione, allegando la documentazione clinica.` },

    { id:'settimana-report', tags:['genitori'],
      q:`Come faccio a sapere com'è andata la settimana?`,
      a:`Il modo più diretto è chiamare vostro figlio nel tempo libero (17:15–19:15) o la sera (20:00–22:30). Per parlare con gli educatori potete telefonare al Convitto (0746 296862) o scrivere a <a href="mailto:convitto@alberghierorieti.it">convitto@alberghierorieti.it</a>. Con l'<a href="area-riservata.html">Area Riservata Famiglie</a> potete inoltre consultare online presenze, valutazioni e comunicazioni degli educatori.` },

    { id:'visite', tags:['genitori'],
      q:`Posso venire a trovarlo durante la settimana?`,
      a:`Sì: le visite infrasettimanali sono sempre possibili, preferibilmente concordate con gli educatori in servizio — ma anche all'improvviso non c'è alcun problema, il Convitto è lieto di accogliere i genitori. L'unica cortesia è non interferire con gli orari di scuola e con lo studio guidato.` },

    { id:'ambientamento', tags:['genitori','emotivo'], pill:'⏱ 25 secondi',
      q:`E se non si ambienta? Se è nostalgico e vuole tornare a casa?`,
      a:`È la preoccupazione più comune, ed è del tutto normale. Nei primi giorni gli educatori dedicano un'attenzione particolare ai nuovi: li affiancano, li presentano ai compagni, li aiutano a costruire le prime amicizie. La maggior parte dei ragazzi, dopo due o tre settimane, dice di sentirsi "a casa": il gruppo dei pari e la routine sono gli alleati più potenti. Chi fatica viene supportato — anche dal C.I.C., il Centro di Informazione e Consulenza — e si trova sempre una soluzione insieme alla famiglia. Nessuno viene lasciato solo.` },

    { id:'compagno', tags:['emotivo'],
      q:`Cosa succede se litiga con il compagno di camera?`,
      a:`L'educatore di riferimento interviene subito per mediare. Se il problema persiste, si valuta uno spostamento di camera, tenendo conto di età, classe e rapporti tra gli studenti. La convivenza è parte del percorso educativo: imparare a gestire i conflitti è uno degli obiettivi espliciti del Convitto.` },

    { id:'solo-sera', tags:['emotivo'],
      q:`Si sentirà solo la sera? Chi c'è quando ha bisogno di parlare?`,
      a:`Le sere in Convitto non sono mai vuote: dopo cena ci sono socialità, attività e tempo libero condiviso. E c'è sempre un educatore presente, non come sorvegliante ma come figura adulta di riferimento a cui i ragazzi possono rivolgersi. Molti convittori, anni dopo, ricordano proprio quelle conversazioni serali come uno dei legami più preziosi.` },

    { id:'autonomia', tags:['emotivo','genitori'],
      q:`Diventerà più autonomo o si abituerà a farsi servire?`,
      a:`L'autonomia è l'obiettivo educativo numero uno: i ragazzi imparano a gestire spazi, tempi, impegni, il riordino della camera, la cura delle proprie cose. È una delle ragioni per cui molte famiglie scelgono il Convitto — i figli tornano a casa più responsabili e organizzati. Non è un albergo: è una palestra di vita.` },

    { id:'attivita', tags:['vita','attivita'],
      q:`Ci sono attività oltre allo studio?`,
      a:`Sì: <strong>Laboratorio Musicale</strong> (chitarra, voce, batteria, sax — attivo da oltre vent'anni), sport (calcetto, basket, pallavolo, nuoto), uscite culturali, cineforum e tornei interni. Le attività serali sono proposte dagli educatori e non sono obbligatorie. <a href="laboratorio-musicale.html">Il Laboratorio Musicale &rarr;</a>` },

    { id:'cosa-guadagna', tags:['vita','emotivo'], pill:'⏱ 30 secondi',
      q:`Cosa ci guadagna mio figlio, oltre alla scuola?`,
      a:`È la domanda giusta. Oltre alla scuola, al Convitto un ragazzo impara a esprimersi (Laboratorio Musicale, teatro, concerto-saggio annuale), a stare con gli altri (sport, sala ricreativa, amicizie che durano una vita), a essere autonomo (gestione del tempo e degli spazi, regole condivise) e a guardare lontano (stage, orientamento, una rete di alumni in tutto il mondo). Molti ex convittori dicono che il Convitto è stata l'esperienza formativa più importante della loro vita. <a href="comunita.html#alumni">Alumni e community &rarr;</a>` },

    { id:'sanzioni', tags:['iscrizione'],
      q:`Esistono sanzioni disciplinari? Quali?`,
      a:`Il Regolamento prevede quattro livelli: <strong>avvertimento verbale</strong> per mancanze lievi (ritardo alla sveglia, disordine in camera); <strong>avvertimento scritto</strong> con avviso alla famiglia, fino alla limitazione della libera uscita, per mancanze lievi reiterate; <strong>sospensione</strong> dal Convitto (fino a 5 giorni, su proposta del Consiglio di Disciplina) per mancanze gravi; <strong>esclusione</strong>, deliberata dal Consiglio d'Istituto, per mancanze gravissime. I provvedimenti possono essere convertiti in attività utili alla comunità. <a href="regolamento-guida.html#sezione-6">Disciplina e sanzioni &rarr;</a>` },

    { id:'semiconvitto', tags:['iscrizione','semiconvitto'],
      q:`Cos'è il Semiconvitto? A chi è rivolto?`,
      a:`È il servizio per gli studenti del Costaggini che <strong>non alloggiano</strong> in Convitto: il semiconvittore pranza in mensa e partecipa allo studio pomeridiano guidato. La retta, fissata annualmente dal Consiglio d'Istituto, dà diritto al pranzo e all'assistenza educativa per il tempo di permanenza; vale lo stesso regolamento dei convittori. <a href="semiconvitto.html#sc-form">Richiesta di Semiconvitto &rarr;</a>` }
  ];

  window.FAQ_DATA = FAQ; // esposto per usi futuri (es. base di conoscenza dell'assistente)

  /* ── CSS (stile della casa) ──────────────────────────────────────── */
  var CSS = [
    '.faqx{display:flex;flex-direction:column;gap:.6rem;}',
    '.faqx-search{display:flex;align-items:center;gap:.5rem;background:#fff;border:1.5px solid rgba(44,62,45,.15);border-radius:12px;padding:.55rem .85rem;margin-bottom:.4rem;}',
    '.faqx-search svg{width:16px;height:16px;fill:var(--bosco,#2C3E2D);opacity:.55;flex-shrink:0;}',
    '.faqx-search input{flex:1;border:none;outline:none;background:transparent;font-family:var(--fu,"Source Sans 3"),sans-serif;font-size:.9rem;color:var(--bosco,#2C3E2D);}',
    '.faqx-empty{font-family:var(--fu,"Source Sans 3"),sans-serif;font-size:.85rem;color:#6b7280;padding:.6rem .2rem;display:none;}',
    '.faqx-cats{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.5rem;}',
    '.faqx-cat{font-family:var(--fu,"Source Sans 3"),sans-serif;font-size:.6rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:.32rem .7rem;border-radius:20px;border:1.5px solid rgba(44,62,45,.18);background:none;cursor:pointer;color:var(--bosco,#2C3E2D);transition:all .18s;}',
    '.faqx-cat.active,.faqx-cat:hover{background:var(--bosco,#2C3E2D);color:#fff;border-color:var(--bosco,#2C3E2D);}',
    '.faqx-item{background:#fff;border:1.5px solid rgba(44,62,45,.12);border-radius:12px;overflow:hidden;transition:border-color .18s,box-shadow .18s;}',
    '.faqx-item[open]{border-color:rgba(184,146,42,.45);box-shadow:0 4px 18px rgba(44,62,45,.07);}',
    '.faqx-q{list-style:none;cursor:pointer;display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem;font-family:var(--fu,"Source Sans 3"),sans-serif;font-size:.92rem;font-weight:700;color:var(--bosco,#2C3E2D);}',
    '.faqx-q::-webkit-details-marker{display:none;}',
    '.faqx-q:focus-visible{outline:3px solid var(--oro,#B8922A);outline-offset:2px;}',
    '.faqx-arr{margin-left:auto;width:18px;height:18px;flex-shrink:0;fill:var(--oro,#B8922A);transition:transform .2s;}',
    '.faqx-item[open] .faqx-arr{transform:rotate(180deg);}',
    '.faqx-a{padding:0 1rem 1rem;font-family:var(--fu,"Source Sans 3"),sans-serif;font-size:.9rem;line-height:1.7;color:#33403a;}',
    '.faqx-a p{margin:0 0 .6rem;}.faqx-a p:last-child{margin-bottom:0;}',
    '.faqx-a a{color:var(--oro2,#B8922A);font-weight:600;text-decoration:none;border-bottom:1px solid rgba(184,146,42,.35);}',
    '.faqx-a a:hover{border-bottom-color:var(--oro2,#B8922A);}',
    '.faqx-pill{display:inline-block;background:rgba(184,146,42,.12);color:var(--oro2,#9a7a1f);font-size:.66rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:.18rem .5rem;border-radius:30px;margin-bottom:.55rem;}',
    'html.lettura-facilitata .faqx-q,html.lettura-facilitata .faqx-a{font-family:"Atkinson Hyperlegible",sans-serif !important;}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('faqx-style')) return;
    var s = document.createElement('style');
    s.id = 'faqx-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── SELEZIONE VOCI ──────────────────────────────────────────────── */
  function pick(container) {
    var ids = container.getAttribute('data-faq-ids');
    if (ids) {
      var map = {};
      FAQ.forEach(function (e) { map[e.id] = e; });
      return ids.split(',').map(function (s) { return map[s.trim()]; }).filter(Boolean);
    }
    var tagAttr = (container.getAttribute('data-faq') || '*').trim();
    if (tagAttr === '*' || tagAttr === '') return FAQ.slice();
    var wanted = tagAttr.split(',').map(function (s) { return s.trim(); });
    return FAQ.filter(function (e) {
      return e.tags.some(function (t) { return wanted.indexOf(t) !== -1; });
    });
  }

  /* Categorie standard per la barra a pillole (data-faq-cats) */
  var CATS = [
    ['*', 'Tutte'],
    ['vita', 'Vita quotidiana'],
    ['iscrizione', 'Costi & iscrizione'],
    ['genitori', 'Famiglia & contatti'],
    ['salute', 'Salute'],
    ['sicurezza', 'Sicurezza']
  ];

  /* ── RENDER ──────────────────────────────────────────────────────── */
  function itemHTML(e) {
    var pill = e.pill ? '<span class="faqx-pill">' + e.pill + '</span>' : '';
    return '<details class="faqx-item" id="faq-' + e.id + '" data-tags="' + e.tags.join(' ') + '">' +
      '<summary class="faqx-q">' + e.q +
        '<svg class="faqx-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>' +
      '</summary>' +
      '<div class="faqx-a">' + pill + '<p>' + e.a + '</p></div>' +
    '</details>';
  }

  function render(container) {
    var items = pick(container);
    if (!items.length) return;
    var hasSearch = container.hasAttribute('data-faq-search');
    var hasCats = container.hasAttribute('data-faq-cats');

    var html = '<div class="faqx">';
    if (hasSearch) {
      html += '<div class="faqx-search">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.5 4.5 0 019.5 14z"/></svg>' +
        '<input type="search" placeholder="Cerca una domanda…" aria-label="Cerca tra le domande frequenti">' +
      '</div>';
    }
    if (hasCats) {
      html += '<div class="faqx-cats">' + CATS.map(function (c, i) {
        return '<button type="button" class="faqx-cat' + (i === 0 ? ' active' : '') + '" data-cat="' + c[0] + '">' + c[1] + '</button>';
      }).join('') + '</div>';
    }
    html += items.map(itemHTML).join('');
    html += '<p class="faqx-empty">Nessuna domanda corrisponde.</p>';
    html += '</div>';
    container.innerHTML = html;

    if (!hasSearch && !hasCats) return;

    var input = container.querySelector('.faqx-search input');
    var empty = container.querySelector('.faqx-empty');
    var details = Array.prototype.slice.call(container.querySelectorAll('.faqx-item'));
    var curCat = '*';

    function applyFilter() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var shown = 0;
      details.forEach(function (d) {
        var inCat = curCat === '*' || (' ' + d.getAttribute('data-tags') + ' ').indexOf(' ' + curCat + ' ') !== -1;
        var inText = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        var show = inCat && inText;
        d.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      empty.style.display = shown ? 'none' : 'block';
    }

    if (input) input.addEventListener('input', applyFilter);
    if (hasCats) {
      container.querySelectorAll('.faqx-cat').forEach(function (btn) {
        btn.addEventListener('click', function () {
          curCat = btn.getAttribute('data-cat');
          container.querySelectorAll('.faqx-cat').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          applyFilter();
        });
      });
    }
  }

  function init() {
    var containers = document.querySelectorAll('[data-faq],[data-faq-ids]');
    if (!containers.length) return;
    injectCSS();
    Array.prototype.forEach.call(containers, render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
