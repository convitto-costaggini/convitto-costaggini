/**
 * Gestionale del Convitto — sostituisce la funzione GENERA_CodiciStudenti in Codice.gs.
 *
 * Problema della versione precedente: il numero di partenza era il più alto
 * PRESENTE nel foglio STUDENTI. Eliminando le righe con i numeri più alti
 * (es. i diplomati) o svuotando la colonna Codice, i numeri già usati venivano
 * assegnati di nuovo a studenti diversi. Il codice è ciò che collega un
 * genitore ai dati del proprio figlio nell'Area riservata famiglie: non deve
 * MAI essere riassegnato.
 *
 * Correzione: l'ultimo numero assegnato è conservato nelle Proprietà dello
 * script (ULTIMO_CODICE_STUDENTE) e non torna mai indietro, anche se le righe
 * vengono eliminate. La prima esecuzione parte dal massimo tra la proprietà e
 * il foglio; il valore iniziale da impostare a mano è indicato sotto.
 *
 * Installazione:
 *  1. In Codice.gs sostituire l'intera funzione GENERA_CodiciStudenti con questa.
 *  2. Impostazioni progetto → Proprietà script → aggiungere
 *     ULTIMO_CODICE_STUDENTE = il numero più alto mai usato (da settembre 2026
 *     i dati del sito arrivano fino ad almeno STU-0142: indicare 142 o il valore
 *     più alto noto, anche di studenti non più presenti).
 *  3. Proteggere la colonna Codice del foglio STUDENTI (Dati → Proteggi
 *     intervalli), lasciando la modifica al solo amministratore.
 */
function GENERA_CodiciStudenti() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);   // due inserimenti contemporanei non prendono lo stesso numero
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName("STUDENTI");
    if (!sh) throw new Error('Scheda "STUDENTI" non trovata');
    var lastRow = sh.getLastRow();
    var lastCol = sh.getLastColumn();
    if (lastRow < 2) { Logger.log("Nessuno studente da numerare."); return; }

    // 1) trova la colonna "Codice" se esiste già, altrimenti creala in fondo
    var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
    var codiceCol = 0;
    for (var c = 0; c < header.length; c++) {
      if (String(header[c]).trim().toLowerCase() === "codice") { codiceCol = c + 1; break; }
    }
    if (codiceCol === 0) {
      codiceCol = lastCol + 1;
      sh.getRange(1, codiceCol).setValue("Codice");
    }

    // 2) leggi nominativi (col A) e codici attuali
    var n = lastRow - 1;
    var nomi   = sh.getRange(2, 1, n, 1).getValues();
    var codici = sh.getRange(2, codiceCol, n, 1).getValues();

    // 3) contatore che non torna mai indietro: massimo tra proprietà e foglio
    var props = PropertiesService.getScriptProperties();
    var maxNum = parseInt(props.getProperty('ULTIMO_CODICE_STUDENTE') || '0', 10) || 0;
    for (var i = 0; i < n; i++) {
      var m = String(codici[i][0]).trim().match(/^STU-(\d+)$/i);
      if (m) { var num = parseInt(m[1], 10); if (num > maxNum) maxNum = num; }
    }

    // 4) assegna solo a chi ha nominativo e NON ha ancora un codice
    var assegnati = 0;
    for (var j = 0; j < n; j++) {
      if (String(nomi[j][0]).trim() !== "" && String(codici[j][0]).trim() === "") {
        maxNum++;
        codici[j][0] = "STU-" + ("0000" + maxNum).slice(-4);
        assegnati++;
      }
    }

    // 5) scrivi i codici e salva il contatore
    sh.getRange(2, codiceCol, n, 1).setValues(codici);
    props.setProperty('ULTIMO_CODICE_STUDENTE', String(maxNum));
    Logger.log("Colonna Codice = " + codiceCol + " | codici assegnati ora: " + assegnati + " | ultimo numero: " + maxNum);
  } finally {
    lock.releaseLock();
  }
}
