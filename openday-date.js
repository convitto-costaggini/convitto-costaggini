/* Date Open Day e Lab Experience — a.s. 2026/27.
   Unico punto da aggiornare: l'elenco DATE_OPENDAY qui sotto.
   Le date passate si spengono da sole; la prossima viene evidenziata.
   Uso: <div data-openday-date></div>          → elenco completo (openday.html)
        <div data-openday-prossimo></div>      → riquadro "prossimo appuntamento" (home)
        <a data-openday-chip>                  → richiamo che sparisce dopo l'ultima data
        window.OPENDAY.prossimo()              → { data:Date, tipo, ... } o null */
(function () {
  var DATE_OPENDAY = [
    { giorno: '2026-11-28', tipo: 'openday', inizio: '09:00', fine: '13:00' },
    { giorno: '2026-12-02', tipo: 'lab',     inizio: '14:20', fine: '18:10' },
    { giorno: '2026-12-12', tipo: 'openday', inizio: '09:00', fine: '13:00' },
    { giorno: '2026-12-13', tipo: 'openday', inizio: '09:00', fine: '13:00' },
    { giorno: '2026-12-16', tipo: 'lab',     inizio: '14:20', fine: '18:10' },
    { giorno: '2026-12-19', tipo: 'openday', inizio: '09:00', fine: '13:00' },
    { giorno: '2027-01-10', tipo: 'openday', inizio: '09:00', fine: '13:00' },
    { giorno: '2027-01-16', tipo: 'openday', inizio: '09:00', fine: '13:00' }
  ];
  var NOMI = { openday: 'Open Day', lab: 'Lab Experience' };
  var LUOGO = 'IPSSEOA «R.A. Costaggini» – Rieti';
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  function quando(e, ora) { return new Date(e.giorno + 'T' + ora + ':00'); }
  var eventi = DATE_OPENDAY.map(function (e) {
    return { giorno: e.giorno, tipo: e.tipo, nome: NOMI[e.tipo], inizio: e.inizio, fine: e.fine,
             data: quando(e, e.inizio), termine: quando(e, e.fine) };
  });
  function futuri(tipo) {
    var ora = new Date();
    return eventi.filter(function (e) { return e.termine > ora && (!tipo || e.tipo === tipo); });
  }
  function prossimo(tipo) { return futuri(tipo)[0] || null; }
  function esteso(e) {
    var d = e.data;
    return GIORNI[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear();
  }
  function maiuscola(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function orario(e) { return e.inizio.replace(/^0/, '') + ' – ' + e.fine; }
  function gcal(e) {
    var g = e.giorno.replace(/-/g, '');
    var t = function (h) { return g + 'T' + h.replace(':', '') + '00'; };
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(e.nome + ' – Istituto Alberghiero e Convitto Costaggini')
      + '&dates=' + t(e.inizio) + '/' + t(e.fine) + '&ctz=Europe/Rome'
      + '&location=' + encodeURIComponent(LUOGO)
      + '&details=' + encodeURIComponent('https://convitto.alberghierorieti.edu.it/openday.html');
  }

  function scheda(e, primo) {
    var ora = new Date();
    var passato = e.termine <= ora;
    var cls = 'odd-item' + (passato ? ' odd-passato' : '') + (e === primo ? ' odd-prossimo' : '');
    var d = e.data;
    return '<li class="' + cls + '">'
      + '<div class="odd-data" aria-hidden="true"><span class="odd-gs">' + GIORNI[d.getDay()].slice(0, 3) + '</span>'
      + '<span class="odd-num">' + d.getDate() + '</span><span class="odd-mese">' + MESI[d.getMonth()].slice(0, 3) + '</span></div>'
      + '<div class="odd-testo"><span class="odd-quando">' + maiuscola(esteso(e)) + '</span>'
      + '<span class="odd-ora">🕘 ore ' + orario(e) + '</span>'
      + (e === primo ? '<span class="odd-badge">Prossimo appuntamento</span>' : '')
      + (passato ? '<span class="odd-badge odd-badge-fatto">Già svolto</span>'
                 : '<a class="odd-cal" href="' + gcal(e) + '" target="_blank" rel="noopener">+ Aggiungi al calendario</a>')
      + '</div></li>';
  }

  function elenco(box) {
    var primo = prossimo();
    box.classList.add('odd-griglia');
    box.innerHTML = ['openday', 'lab'].map(function (tipo) {
      var lista = eventi.filter(function (e) { return e.tipo === tipo; });
      return '<div class="odd-col odd-' + tipo + '"><h3 class="odd-titolo">' + NOMI[tipo] + '</h3>'
        + '<p class="odd-sotto">' + (tipo === 'lab' ? 'Il mercoledì pomeriggio, nei laboratori' : 'Mattina, porte aperte') + '</p>'
        + '<ul class="odd-lista">' + lista.map(function (e) { return scheda(e, primo); }).join('') + '</ul></div>';
    }).join('');
  }

  function riquadro(box) {
    var p = prossimo();
    if (!p) { (box.closest('[role=region]') || box).hidden = true; return; }
    var rimasti = futuri().length;
    box.innerHTML = '<span class="odp-lbl">📅 Open Day 2026/27</span>'
      + '<strong class="odp-tit">Prossimo appuntamento: ' + p.nome + '</strong>'
      + '<span class="odp-quando">' + esteso(p) + ' · ore ' + orario(p) + '</span>'
      + (rimasti > 1 ? '<span class="odp-altre">e altre ' + (rimasti - 1) + ' date fino a gennaio</span>' : '')
      + '<a class="odp-btn" href="openday.html#date-openday">Tutte le date →</a>';
  }


  var CSS = ''
    + '.odd-griglia{display:grid;gap:1.25rem;grid-template-columns:1fr;margin-top:1.75rem}'
    + '@media (min-width:760px){.odd-griglia{grid-template-columns:3fr 2fr}}'
    + '.odd-col{background:var(--av2);border:1px solid var(--av3);border-radius:12px;padding:1.4rem 1.25rem 1.25rem;border-top:4px solid var(--oro)}'
    + '.odd-lab{border-top-color:var(--bosco3)}'
    + '.odd-titolo{font-family:var(--fd);font-size:1.6rem;font-weight:400;color:var(--bosco);margin:0}'
    + '.odd-sotto{font-family:var(--fu);font-size:.62rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--oro);margin:.2rem 0 1rem}'
    + '.odd-lista{list-style:none;margin:0;padding:0;display:grid;gap:.6rem}'
    + '.odd-item{display:flex;gap:.9rem;align-items:center;background:var(--av);border:1px solid var(--av3);border-radius:10px;padding:.55rem .8rem .55rem .55rem}'
    + '.odd-data{flex:0 0 62px;height:66px;border-radius:8px;background:var(--bosco);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}'
    + '.odd-gs,.odd-mese{font-family:var(--fu);font-size:.55rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,240,232,.7)}'
    + '.odd-num{font-family:var(--fd);font-size:1.9rem;color:var(--oro3);margin:.1rem 0}'
    + '.odd-testo{display:flex;flex-direction:column;gap:.15rem;min-width:0}'
    + '.odd-quando{font-family:var(--fd);font-size:1.12rem;color:var(--bosco);line-height:1.2}'
    + '.odd-ora{font-family:var(--fu);font-size:.8rem;color:var(--txt2)}'
    + '.odd-cal{font-family:var(--fu);font-size:.7rem;font-weight:700;color:var(--bosco2);text-decoration:underline;align-self:flex-start}'
    + '.odd-badge{font-family:var(--fu);font-size:.55rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;background:var(--oro);color:#fff;border-radius:20px;padding:.18rem .6rem;align-self:flex-start}'
    + '.odd-badge-fatto{background:var(--av3);color:var(--txt2)}'
    + '.odd-prossimo{border:2px solid var(--oro);box-shadow:0 6px 20px rgba(184,146,42,.22)}'
    + '.odd-prossimo .odd-data{background:linear-gradient(135deg,var(--oro),var(--oro2))}'
    + '.odd-prossimo .odd-num{color:#fff}.odd-prossimo .odd-gs,.odd-prossimo .odd-mese{color:rgba(255,255,255,.9)}'
    + '.odd-passato{opacity:.5}'
    + '[data-openday-prossimo]{display:flex;flex-wrap:wrap;align-items:center;gap:.35rem 1.25rem;max-width:1100px;margin:0 auto;padding:1.1rem 1.25rem;color:#fff}'
    + '.odp-lbl{flex-basis:100%;font-family:var(--fu);font-size:.6rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--oro3)}'
    + '.odp-tit{font-family:var(--fd);font-size:clamp(1.3rem,3.6vw,1.8rem);font-weight:400;line-height:1.2}'
    + '.odp-quando{font-family:var(--fu);font-size:.95rem;font-weight:700;color:var(--oro3)}'
    + '.odp-altre{font-family:var(--fu);font-size:.8rem;color:rgba(245,240,232,.75)}'
    + '.odp-btn{margin-left:auto;font-family:var(--fu);font-size:.68rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:.65rem 1.2rem;border-radius:8px;background:linear-gradient(135deg,var(--oro2),var(--oro3));color:var(--bosco);text-decoration:none;white-space:nowrap}'
    + '@media (max-width:600px){.odp-btn{margin-left:0}}';
  function stile() {
    if (document.getElementById('odd-stile')) return;
    var st = document.createElement('style'); st.id = 'odd-stile'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  window.OPENDAY = { eventi: eventi, prossimo: prossimo, esteso: esteso, orario: orario };
  function avvia() {
    stile();
    document.querySelectorAll('[data-openday-date]').forEach(elenco);
    document.querySelectorAll('[data-openday-prossimo]').forEach(riquadro);
    if (!prossimo()) document.querySelectorAll('[data-openday-chip]').forEach(function (el) { el.hidden = true; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
