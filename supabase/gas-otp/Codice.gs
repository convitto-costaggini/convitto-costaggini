/**
 * Progetto Apps Script autonomo "OTP Area famiglie" — Convitto "Costaggini"
 *
 * Invia per email il codice di verifica (OTP) dell'Area riservata famiglie.
 * Lo chiama soltanto la Edge Function Supabase "otp-famiglie": il codice è
 * generato lì, qui viene solo recapitato. Nulla viene salvato o registrato
 * (nemmeno nei log) in questo progetto.
 *
 * Installazione (con l'account istituzionale @alberghierorieti.it che deve
 * comparire come mittente):
 *  1. script.google.com → Nuovo progetto → incollare questo file.
 *  2. Impostazioni progetto → Proprietà script → aggiungere
 *     OTP_MAIL_TOKEN = una stringa casuale lunga (la stessa andrà nel
 *     secret OTP_MAIL_TOKEN della Edge Function).
 *  3. Esegui → provaInvio (una volta, per autorizzare l'invio di email e
 *     verificare il recapito alla propria casella).
 *  4. Esegui il deployment → Nuovo deployment → Applicazione web:
 *     Esegui come: Me · Chi ha accesso: Chiunque.
 *     L'URL /exec ottenuto va nel secret OTP_MAIL_URL della Edge Function.
 *     ("Chiunque" serve perché a chiamare è un server, non una persona
 *     collegata: la protezione è il token.)
 *
 * Stile della mail: fondo chiaro, senza fasce scure (le fasce scure escono
 * enormi su alcuni smartphone). Tabella larga 600 con max-width:100%.
 */

function doPost(e) {
  try {
    var dati = JSON.parse(e.postData.contents);
    var atteso = PropertiesService.getScriptProperties().getProperty('OTP_MAIL_TOKEN');
    if (!atteso || atteso.length < 32 || dati.token !== atteso) {
      return risposta_({ success: false, message: 'Non autorizzato' });
    }
    var email = String(dati.email || '').trim();
    var codice = String(dati.codice || '');
    var minuti = Math.min(Math.max(Number(dati.minuti) || 10, 1), 30);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !/^\d{6}$/.test(codice)) {
      return risposta_({ success: false, message: 'Dati non validi' });
    }
    inviaCodice_(email, codice, minuti);
    return risposta_({ success: true });
  } catch (err) {
    return risposta_({ success: false, message: 'Errore invio' });
  }
}

function inviaCodice_(email, codice, minuti) {
  var oggetto = 'Codice di accesso: Area riservata famiglie del Convitto "Costaggini"';
  var testo =
    'Gentile genitore o tutore,\n\n' +
    'il codice per completare l\'accesso all\'Area riservata famiglie è:\n\n' +
    '    ' + codice + '\n\n' +
    'Il codice vale ' + minuti + ' minuti e può essere usato una sola volta.\n' +
    'Non lo comunichi a nessuno: il personale del Convitto non Le chiederà mai questo codice.\n\n' +
    'Se non ha appena tentato di accedere, ignori questo messaggio e, per sicurezza, ' +
    'cambi la password con la funzione "Password dimenticata?" della pagina di accesso ' +
    'e ne dia notizia al Convitto (rirh010007@istruzione.it).\n\n' +
    'Convitto annesso all\'IPSSEOA "R. A. Costaggini" · Rieti\n' +
    'Messaggio automatico: non rispondere a questa email.';
  var html =
    '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="x-apple-disable-message-reformatting">' +
    '<title>Codice di accesso</title>' +
    '<style>body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}' +
    'body{margin:0;padding:0;width:100%!important}' +
    '@media only screen and (max-width:480px){.pad{padding-left:20px!important;padding-right:20px!important}' +
    '.cod{font-size:34px!important;letter-spacing:6px!important}}</style></head>' +
    '<body style="margin:0;padding:0;background:#eeeae2">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eeeae2" style="background:#eeeae2"><tr>' +
    '<td align="center" style="padding:16px 8px">' +
    '<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px">' +
    '<tr><td class="pad" align="center" style="padding:26px 24px 18px 24px;border-bottom:2px solid #D4AA4A">' +
    '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:24px;line-height:30px;color:#2C3E2D">Convitto &ldquo;Costaggini&rdquo;</div>' +
    '<div style="font-family:Arial,sans-serif;font-size:12px;line-height:18px;color:#6b7280;margin-top:6px">IPSSEOA &ldquo;R. A. Costaggini&rdquo; &middot; Rieti</div>' +
    '</td></tr>' +
    '<tr><td class="pad" style="padding:28px 32px;font-family:Arial,\'Helvetica Neue\',sans-serif">' +
    '<p style="font-size:17px;line-height:24px;color:#1a2e1b;margin:0 0 14px 0;font-weight:bold">Gentile genitore o tutore,</p>' +
    '<p style="font-size:16px;line-height:25px;color:#333333;margin:0 0 20px 0">il codice per completare l&rsquo;accesso all&rsquo;<strong>Area riservata famiglie</strong> &egrave;:</p>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8f5ee" style="background:#f8f5ee;border:1px solid #d4aa4a;border-radius:8px"><tr>' +
    '<td align="center" style="padding:18px 10px">' +
    '<div class="cod" style="font-family:\'Courier New\',monospace;font-size:40px;line-height:48px;font-weight:bold;letter-spacing:8px;color:#2C3E2D">' + codice + '</div>' +
    '</td></tr></table>' +
    '<p style="font-size:16px;line-height:25px;color:#333333;margin:20px 0 0 0">Il codice vale <strong>' + minuti + ' minuti</strong> e pu&ograve; essere usato una sola volta. ' +
    'Non lo comunichi a nessuno: il personale del Convitto non Le chieder&agrave; mai questo codice.</p>' +
    '<p style="font-size:14px;line-height:22px;color:#555555;margin:18px 0 0 0">Se non ha appena tentato di accedere, ignori questo messaggio e, per sicurezza, ' +
    'cambi la password con la funzione &ldquo;Password dimenticata?&rdquo; della pagina di accesso e ne dia notizia al Convitto ' +
    '(rirh010007@istruzione.it).</p>' +
    '</td></tr>' +
    '<tr><td class="pad" align="center" style="padding:16px 24px;border-top:1px solid #e2e8f0">' +
    '<p style="font-family:Arial,sans-serif;font-size:12px;line-height:19px;color:#6b7280;margin:0">Convitto annesso all&rsquo;IPSSEOA &ldquo;R. A. Costaggini&rdquo; &middot; Rieti<br>' +
    'Messaggio automatico: non rispondere a questa email.</p>' +
    '</td></tr></table>' +
    '<!--[if mso]></td></tr></table><![endif]-->' +
    '</td></tr></table></body></html>';
  MailApp.sendEmail({
    to: email,
    subject: oggetto,
    body: testo,
    htmlBody: html,
    name: 'Convitto "Costaggini" - Rieti'
  });
}

function risposta_(oggetto) {
  return ContentService.createTextOutput(JSON.stringify(oggetto))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Da eseguire a mano una volta: invia un codice di prova alla propria casella. */
function provaInvio() {
  inviaCodice_(Session.getActiveUser().getEmail(), '123456', 10);
}
