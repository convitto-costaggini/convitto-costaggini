/* Elenco di città ospitato sul sito (al posto della ricerca OpenStreetMap/Nominatim).
   Dati: /dati/citta-italia.json (comuni ISTAT) e /dati/citta-mondo.json
   (città con almeno 15.000 abitanti, GeoNames CC BY 4.0). Nessuna richiesta a servizi esterni.

   CittaSito.collega(input, { mondo: true|false })  suggerimenti mentre si scrive
   CittaSito.cerca(testo, { mondo: true|false })     -> Promise<{ nome, lat, lng } | null>  */
(function () {
  var cache = {};
  // Nomi italiani delle città straniere più comuni (l'elenco mondiale usa i nomi internazionali)
  var ALIAS = {"londra": "london", "parigi": "paris", "berlino": "berlin", "monaco di baviera": "munich", "mosca": "moscow", "lisbona": "lisbon", "ginevra": "geneva", "zurigo": "zurich", "lione": "lyon", "marsiglia": "marseille", "nizza": "nice", "barcellona": "barcelona", "siviglia": "sevilla", "atene": "athens", "varsavia": "warsaw", "praga": "prague", "edimburgo": "edinburgh", "copenaghen": "copenhagen", "stoccolma": "stockholm", "pechino": "beijing", "tokio": "tokyo", "il cairo": "cairo", "citta del messico": "mexico city", "san paolo": "sao paulo", "new york": "new york city", "nuova york": "new york city", "filadelfia": "philadelphia", "cracovia": "krakow", "belgrado": "belgrade", "bucarest": "bucharest", "colonia": "koln", "francoforte": "frankfurt am main", "amburgo": "hamburg", "dublino": "dublin", "anversa": "antwerpen", "l'aia": "the hague", "salisburgo": "salzburg", "losanna": "lausanne", "lubiana": "ljubljana", "gerusalemme": "jerusalem", "citta del capo": "cape town", "montecarlo": "monte-carlo", "nuova delhi": "new delhi", "strasburgo": "strasbourg", "tolosa": "toulouse", "oporto": "porto", "basilea": "basel", "berna": "bern", "spalato": "split", "zagabria": "zagreb", "fiume": "rijeka", "capodistria": "koper", "algeri": "algiers", "tunisi": "tunis", "rio": "rio de janeiro"};
  var paesi = null;
  try { paesi = new Intl.DisplayNames(['it'], { type: 'region' }); } catch (e) {}

  function norm(t) {
    return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
  }
  function nomePaese(cc) {
    try { return (paesi && paesi.of(cc)) || cc; } catch (e) { return cc; }
  }
  function carica(file) {
    if (!cache[file]) {
      cache[file] = fetch('/dati/' + file).then(function (r) { return r.json(); })
        .catch(function () { delete cache[file]; return []; });
    }
    return cache[file];
  }
  // Ogni voce: { nome (etichetta mostrata), base (nome normalizzato), extra (provincia/paese normalizzati), lat, lng }
  function elenco(mondo) {
    var p = [carica('citta-italia.json')];
    if (mondo) p.push(carica('citta-mondo.json'));
    return Promise.all(p).then(function (r) {
      var key = mondo ? '_m' : '_i';
      if (cache[key]) return cache[key];
      var out = r[0].map(function (c) {
        return { nome: c[0] + ' (' + c[1] + ')' + (mondo ? ', Italia' : ''), base: norm(c[0]),
                 extra: norm(c[1] + ' italia italy'), lat: c[2], lng: c[3] };
      });
      if (mondo) r[1].forEach(function (c) {
        var paese = nomePaese(c[1]);
        out.push({ nome: c[0] + ', ' + paese, base: norm(c[0]), extra: norm(paese + ' ' + c[1]), lat: c[2], lng: c[3] });
      });
      cache[key] = out;
      return out;
    });
  }
  // Cerca: "Rieti", "Rieti (RI)", "Dubai, Emirati Arabi Uniti", "Londra"... (prima l'Italia, poi le città più grandi)
  function trova(lista, testo, max) {
    var t = norm(testo);
    if (!t) return [];
    var esatta = lista.filter(function (c) { return norm(c.nome) === t; });
    if (esatta.length) return esatta.slice(0, max);
    var parti = t.split(/\s*[,(]\s*/);
    var nome = ALIAS[parti[0]] || parti[0], resto = parti.slice(1).join(' ').replace(/[)]/g, '').trim();
    function ok(c) { return !resto || c.extra.indexOf(resto) !== -1 || resto.indexOf(c.extra.split(' ')[0]) !== -1; }
    var uguali = [], inizio = [];
    for (var i = 0; i < lista.length && uguali.length < max; i++) {
      var c = lista[i];
      if (c.base === nome && ok(c)) uguali.push(c);
      else if (inizio.length < max && c.base.indexOf(nome) === 0 && ok(c)) inizio.push(c);
    }
    return uguali.concat(inizio).slice(0, max);
  }

  var n = 0;
  window.CittaSito = {
    cerca: function (testo, opz) {
      var mondo = !!(opz && opz.mondo);
      return elenco(mondo).then(function (l) { var r = trova(l, testo, 1)[0]; return r ? { nome: r.nome, lat: r.lat, lng: r.lng } : null; });
    },
    collega: function (input, opz) {
      var mondo = !!(opz && opz.mondo);
      var dl = document.createElement('datalist');
      dl.id = 'citta-sito-' + (++n);
      input.setAttribute('list', dl.id);
      input.setAttribute('autocomplete', 'off');
      input.parentNode.insertBefore(dl, input.nextSibling);
      var ultimo = '';
      input.addEventListener('input', function () {
        var v = input.value;
        if (norm(v).length < 2 || v === ultimo) return;
        ultimo = v;
        elenco(mondo).then(function (l) {
          if (input.value !== v) return;
          dl.innerHTML = '';
          trova(l, v, 8).forEach(function (c) {
            var o = document.createElement('option'); o.value = c.nome; dl.appendChild(o);
          });
        });
      });
      input.addEventListener('focus', function () { elenco(mondo); }, { once: true });
    }
  };
})();
