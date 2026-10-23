/**
 * Invio dei codici di accesso per l'area docenti di /lingue e della Sala studio (/studio).
 * Va pubblicato come "Applicazione web" (Esegui come: me; Chi ha accesso: Chiunque).
 * Proprietà dello script richiesta: TOKEN (una stringa lunga e casuale, la stessa di GAS_TOKEN su Supabase).
 * Riceve dalle funzioni Supabase "lingue-accesso" e "studio-genera" un POST {token, to, codice, servizio?} e spedisce la mail.
 * servizio "studio" = Sala studio; senza servizio = Le lingue dell'Alberghiero.
 */
var DOMINI = ['@alberghierorieti.it', '@alberghierorieti.edu.it'];
var SERVIZI = {
  lingue: { nome: 'Le lingue dell\'Alberghiero', area: 'all\'area docenti di <b>Le lingue dell\'Alberghiero</b>' },
  studio: { nome: 'Sala studio del Convitto', area: 'alla <b>Sala studio del Convitto</b> (area docenti ed educatori)' }
};

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var token = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (!token || d.token !== token) return risposta_(false, 'non autorizzato');
    var to = String(d.to || '').trim().toLowerCase();
    var codice = String(d.codice || '');
    var dominioOk = DOMINI.some(function (dom) { return to.slice(-dom.length) === dom; });
    if (!dominioOk || !/^[^\s@]+@[^\s@]+$/.test(to)) return risposta_(false, 'destinatario');
    if (!/^\d{6}$/.test(codice)) return risposta_(false, 'codice');
    var sv = SERVIZI[d.servizio] || SERVIZI.lingue;
    MailApp.sendEmail({
      to: to,
      subject: 'Il tuo codice di accesso: ' + codice,
      name: sv.nome,
      body: 'Il tuo codice di accesso (' + sv.nome + ') è: ' + codice + '\n\n' +
        'Vale 10 minuti e si può usare una sola volta.\n' +
        'Se non hai chiesto tu l\'accesso, ignora questo messaggio.',
      htmlBody: '<div style="font-family:Arial,sans-serif;font-size:16px;color:#2C3E2D;max-width:420px">' +
        '<p>Il tuo codice di accesso ' + sv.area + ':</p>' +
        '<p style="font-size:32px;letter-spacing:6px;font-weight:bold;margin:12px 0">' + codice + '</p>' +
        '<p style="font-size:14px;color:#555">Vale 10 minuti e si può usare una sola volta.<br>Se non hai chiesto tu l\'accesso, ignora questo messaggio.</p></div>'
    });
    return risposta_(true);
  } catch (err) {
    return risposta_(false, 'errore');
  }
}

function doGet() { return risposta_(false, 'usare POST'); }

function risposta_(ok, motivo) {
  return ContentService.createTextOutput(JSON.stringify(ok ? { ok: true } : { ok: false, errore: motivo })).setMimeType(ContentService.MimeType.JSON);
}
