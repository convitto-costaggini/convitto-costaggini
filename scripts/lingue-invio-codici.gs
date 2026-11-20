/**
 * Invio dei codici di accesso per l'area docenti di /lingue e della Sala studio (/studio).
 * Va pubblicato come "Applicazione web" (Esegui come: me; Chi ha accesso: Chiunque).
 * Proprietà dello script richiesta: TOKEN (una stringa lunga e casuale, la stessa di GAS_TOKEN su Supabase).
 * Riceve dalle funzioni Supabase "aula-accesso" (e "studio-genera") un POST {token, to, codice, servizio?} e spedisce la mail.
 * servizio "aula" = accesso unico dell'Aula; "studio" = Sala studio; senza servizio = Le lingue dell'Alberghiero.
 * servizio "richiesta-lingue" = avviso di una nuova richiesta di abilitazione all'area docenti di Lingue:
 *   va SOLO all'amministratore (AVVISI_A, fisso qui), mai a un indirizzo preso dalla richiesta.
 */
var AVVISI_A = ['michele.gaggiano', 'alberghierorieti.it'].join('@');
var DOMINI = ['@alberghierorieti.it', '@alberghierorieti.edu.it'];
var SERVIZI = {
  lingue: { nome: 'Le lingue dell\'Alberghiero', area: 'all\'area docenti di <b>Le lingue dell\'Alberghiero</b>' },
  studio: { nome: 'Sala Studio della Scuola', area: 'alla <b>Sala Studio della Scuola</b> (area docenti ed educatori)' },
  aula: { nome: 'L\'Aula del Convitto Costaggini', area: 'all\'<b>Aula del Convitto Costaggini</b> (lingue e sala studio, area docenti ed educatori)' }
};

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var token = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (!token || d.token !== token) return risposta_(false, 'non autorizzato');
    if (d.servizio === 'richiesta-lingue') return avvisoRichiesta_(d);
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

function avvisoRichiesta_(d) {
  var chi = String(d.richiedente || '').trim().toLowerCase();
  var nome = String(d.nome || '').slice(0, 80);
  var dominioOk = DOMINI.some(function (dom) { return chi.slice(-dom.length) === dom; });
  if (!dominioOk || !/^[^\s@<>"]+@[^\s@<>"]+$/.test(chi)) return risposta_(false, 'richiedente');
  nome = nome.replace(/[<>&"]/g, '');
  MailApp.sendEmail({
    to: AVVISI_A,
    subject: 'Aula, Lingue: richiesta di abilitazione da ' + chi,
    name: SERVIZI.aula.nome,
    body: nome + ' (' + chi + ') chiede di entrare nell\'area docenti di Lingue.\n\n' +
      'Per decidere: pannello admin del sito, scheda «Lingue», riquadro «Richieste di abilitazione».\n' +
      'Approvate solo se è un docente che conoscete: l\'area contiene i materiali riservati ai docenti.\n' +
      'In questa mail non ci sono link: si approva solo dal pannello, con la verifica in due passaggi.'
  });
  return risposta_(true);
}

function doGet() { return risposta_(false, 'usare POST'); }

function risposta_(ok, motivo) {
  return ContentService.createTextOutput(JSON.stringify(ok ? { ok: true } : { ok: false, errore: motivo })).setMimeType(ContentService.MimeType.JSON);
}
