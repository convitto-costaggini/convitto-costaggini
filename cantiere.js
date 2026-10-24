/* Sezioni "in costruzione" (Lingue e Sala studio), in attesa del parere della DPO.
   Chi apre una pagina vede soltanto l'avviso "Pagina in costruzione".
   Anteprima riservata (presentazioni): aprire una volta una pagina con ?anteprima=CHIAVE;
   il dispositivo resta abilitato finché non si apre una pagina con ?anteprima=esci.
   Qui c'è solo l'impronta SHA-256 della chiave, non la chiave. */
(function () {
  var IMPRONTA = '007168a11805412b07c12af105e0faf160b4c45f30b176fbc326210f08539a5e';
  var VOCE = 'cantiere-anteprima';
  var d = document.documentElement;

  function abilitato() { try { return localStorage.getItem(VOCE) === IMPRONTA; } catch (e) { return false; } }
  function senzaParametro() {
    var u = new URL(location.href); u.searchParams.delete('anteprima');
    history.replaceState(null, '', u.pathname + u.search + u.hash);
  }

  var parametro = new URLSearchParams(location.search).get('anteprima');
  if (parametro === 'esci') {
    try { localStorage.removeItem(VOCE); } catch (e) {}
    senzaParametro();
  }
  if (abilitato()) return;

  // Nasconde subito la pagina e ferma il resto del documento: il testo che segue
  // diventa testo semplice, quindi nessun altro script della pagina viene eseguito.
  d.style.visibility = 'hidden';
  document.write('<plaintext hidden style="display:none">');

  function avviso() {
    d.innerHTML = '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="robots" content="noindex,nofollow"><title>Pagina in costruzione | Convitto "Costaggini"</title></head>' +
      '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F5F0E8;' +
      'font-family:Georgia,\'Times New Roman\',serif;color:#2C3E2D;padding:24px;box-sizing:border-box">' +
      '<main style="max-width:460px;width:100%;background:#fff;border-radius:14px;padding:40px 28px;text-align:center;' +
      'box-shadow:0 6px 28px rgba(44,62,45,.12);border-top:4px solid #B8922A">' +
      '<div style="font-size:42px;line-height:1;margin-bottom:14px" aria-hidden="true">🛠️</div>' +
      '<h1 style="font-weight:400;font-size:28px;margin:0 0 10px">Pagina in costruzione</h1>' +
      '<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#555;margin:0 0 24px">' +
      'Questa sezione è in preparazione e sarà disponibile prossimamente.</p>' +
      '<a href="https://convitto.alberghierorieti.edu.it/" style="display:inline-block;background:#2C3E2D;color:#fff;' +
      'text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;' +
      'text-transform:uppercase;padding:12px 22px;border-radius:8px">Torna al sito del Convitto</a>' +
      '</main></body>';
    d.style.visibility = 'visible';
  }

  if (parametro && parametro !== 'esci' && window.crypto && crypto.subtle) {
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(parametro.trim().toUpperCase())).then(function (b) {
      var h = Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      if (h === IMPRONTA) {
        try { localStorage.setItem(VOCE, IMPRONTA); } catch (e) {}
        senzaParametro();
        location.reload();
      } else { quandoPronto(avviso); }
    }, function () { quandoPronto(avviso); });
    return;
  }
  quandoPronto(avviso);

  function quandoPronto(f) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f);
    else f();
  }
})();
