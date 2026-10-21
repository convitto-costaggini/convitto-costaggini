/* ════════════════════════════════════════════════════════
   TEMPI — stima ragionata del tempo di preparazione, in minuti.
   Fonte unica per la presentazione e per la scheda di rilevazione.
   Sono STIME dell'autore, non misure: per un docente esperto, su
   materiale di livello A2-B1. La scheda di rilevazione serve a
   sostituirle con i tempi veri di chi insegna.
   Per ogni compito, tre modi di lavorare:
     an   = analogico (a mano, con Word e fotocopie)
     ai   = con un'IA generica (ChatGPT, Gemini, Copilot...) senza il sito
     sito = con il minisito
   Ogni voce: [minuti, "che cosa si fa"] dentro la lista passi.
   ════════════════════════════════════════════════════════ */
window.TEMPI = {
  MESI: 9, /* mesi di scuola in un anno scolastico */
  COMPITI: [
    { id: 'verifica', nome: 'Verifica di 15 domande, file A e B, con soluzioni', mese: 2,
      an:   [['Scrivere le 15 domande', 25], ['Rifare il file B con altre domande', 15], ['Impaginare e stampare', 10], ['Preparare il foglio delle soluzioni', 10]],
      ai:   [['Scrivere la richiesta all\'IA', 5], ['Controllare gli errori di lingua, riga per riga', 12], ['Copiare in Word e impaginare', 10], ['Chiedere il file B e le soluzioni, impaginarli', 8]],
      sito: [['Scegliere lingua e argomento', 1], ['Le domande, i file e le soluzioni nascono da soli', 0], ['Anteprima e stampa', 2]] },
    { id: 'pronta', nome: 'Un\'ora di lezione già pronta (supplenza, recupero): scaletta, scheda, esercizi, verifica', mese: 1,
      an:   [['Cercare il materiale', 40], ['Scrivere la scheda per i ragazzi', 40], ['Preparare gli esercizi', 30], ['Preparare la verifica', 30], ['Stampare e fascicolare', 10]],
      ai:   [['Scrivere la richiesta all\'IA', 10], ['Controllare gli errori di lingua', 20], ['Impaginare scheda ed esercizi', 20], ['Verifica', 10]],
      sito: [['Aprire la lezione e stampare la scheda', 2]] },
    { id: 'misura', nome: 'Una lezione completa su un tema scelto da voi', mese: 1,
      an:   [['Cercare il materiale', 40], ['Scrivere la scheda per i ragazzi', 40], ['Preparare gli esercizi', 30], ['Preparare la verifica', 30], ['Stampare e fascicolare', 10]],
      ai:   [['Scrivere la richiesta all\'IA', 10], ['Controllare gli errori di lingua', 20], ['Impaginare scheda ed esercizi', 20], ['Verifica', 10]],
      sito: [['Scegliere tema e livello, copiare la richiesta già scritta', 2], ['L\'IA gratuita risponde', 3], ['Incollare: il sito controlla la struttura e costruisce la lezione', 1], ['Leggere la lezione prima di usarla', 9]] },
    { id: 'dsa', nome: 'Versione per alunni con DSA o BES (scheda e verifica)', mese: 2,
      an:   [['Ridurre il testo e riscrivere', 15], ['Caratteri grandi, più spazio, rimpaginare', 15]],
      ai:   [['Chiedere la semplificazione', 3], ['Controllare il risultato', 7], ['Impaginare con caratteri grandi', 10]],
      sito: [['Un tocco su «Versione facilitata», poi stampa', 1]] },
    { id: 'esercizi', nome: 'Esercizi sulle vostre frasi, da fare sul telefono, con correzione automatica', mese: 1,
      an:   [['Creare le domande', 15], ['Costruire il modulo online', 25]],
      ai:   [['Far generare le domande', 8], ['Controllare gli errori', 7], ['Costruire il modulo online', 10]],
      sito: [['Incollare le frasi', 1], ['Link e codice QR sono pronti', 1]] },
    { id: 'gioco', nome: 'Gioco a squadre per la lavagna interattiva', mese: 1,
      an:   [['Costruire le diapositive', 40]],
      ai:   [['Far generare i contenuti e controllarli', 10], ['Costruire le diapositive', 15]],
      sito: [['Aprire il gioco e scegliere l\'argomento', 1]] }
  ],
  /* che cosa resta a carico del docente nei tre modi (righe di confronto) */
  CONFRONTO: [
    ['Contenuti del settore ristorazione e accoglienza', 'Li cerco io', 'Li chiedo all\'IA, in modo generico', 'Già pronti: oltre 900 frasi in tre lingue, dai cinque ambiti dell\'Alberghiero'],
    ['Errori di lingua', 'Miei: li correggo mentre scrivo', 'Da controllare riga per riga: l\'IA a volte inventa', 'Contenuti già riletti da revisori indipendenti; se ne trovate uno lo segnalate e si corregge'],
    ['File A, B e soluzioni', 'A mano', 'A mano: copio e impagino io', 'Automatici'],
    ['Versione per DSA o BES', 'Rifaccio tutto', 'Rifaccio quasi tutto', 'Un tocco'],
    ['Esercizi sul telefono, con correzione automatica', 'Non li ho', 'Non li ho', 'Link e codice QR, senza registrazione'],
    ['Audio per ascoltare e ripetere', 'Non c\'è', 'Non c\'è', 'Sì, con la voce del dispositivo'],
    ['Gioco per la LIM', 'Costruisco le diapositive', 'Costruisco le diapositive', 'Pronto, a squadre']
  ]
};
/* somma dei minuti di una lista passi */
window.TEMPI.somma = function (passi) { var t = 0; for (var i = 0; i < passi.length; i++) t += passi[i][1]; return t; };
