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
    '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:520px">' +
    '<p>Gentile genitore o tutore,</p>' +
    '<p>il codice per completare l\'accesso all\'<strong>Area riservata famiglie</strong> è:</p>' +
    '<p style="font-size:30px;font-weight:bold;letter-spacing:8px;color:#2C3E2D;margin:18px 0">' + codice + '</p>' +
    '<p>Il codice vale <strong>' + minuti + ' minuti</strong> e può essere usato una sola volta. ' +
    'Non lo comunichi a nessuno: il personale del Convitto non Le chiederà mai questo codice.</p>' +
    '<p style="font-size:13px;color:#555">Se non ha appena tentato di accedere, ignori questo messaggio e, per sicurezza, ' +
    'cambi la password con la funzione "Password dimenticata?" della pagina di accesso e ne dia notizia al Convitto ' +
    '(rirh010007@istruzione.it).</p>' +
    '<p style="font-size:12px;color:#777;border-top:1px solid #ddd;padding-top:10px">Convitto annesso all\'IPSSEOA "R. A. Costaggini" · Rieti<br>' +
    'Messaggio automatico: non rispondere a questa email.</p></div>';
  MailApp.sendEmail({
    to: email,
    subject: oggetto,
    body: testo,
    htmlBody: html,
    name: 'Convitto "Costaggini" - Rieti',
    noReply: true
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
