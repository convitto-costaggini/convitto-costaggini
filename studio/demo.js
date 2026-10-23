/* ════════════════════════════════════════════════════════
   SALA STUDIO — lezione di esempio (studio/lezione.html?c=DEMO)
   Stessa forma delle lezioni create dalle foto del libro.
   ════════════════════════════════════════════════════════ */
window.STUDIO_DEMO = {
  titolo: 'I principi nutritivi',
  sottotitolo: 'Che cosa c\'è davvero dentro quello che mangiamo, e a che cosa serve',
  materia: 'Scienza e cultura dell\'alimentazione',
  icona: '🥗',
  gancio: {
    domanda: 'Il tuo corpo è fatto per più della metà di una sostanza che non ha nemmeno una caloria. Quale?',
    risposta: 'L\'acqua! È circa il 60% del peso di un adulto. Non dà energia, eppure senza acqua si resiste solo pochi giorni.'
  },
  concetti: [
    { emoji: '🍽️', titolo: 'Che cosa sono i principi nutritivi', spiegazione: 'I principi nutritivi sono le sostanze contenute negli alimenti che servono al nostro corpo. Sono sei: carboidrati, proteine, lipidi, vitamine, sali minerali e acqua.', parola_chiave: 'principi nutritivi', esempio: 'Un piatto di pasta al pomodoro contiene carboidrati (la pasta), un po\' di proteine, lipidi (l\'olio), vitamine e sali (il pomodoro) e acqua.' },
    { emoji: '⚡', titolo: 'Funzione energetica', spiegazione: 'Alcuni nutrienti ci danno l\'energia per muoverci, pensare e tenere caldo il corpo. Sono soprattutto i carboidrati e i lipidi.', parola_chiave: 'energia', esempio: 'Prima di una partita gli atleti mangiano pasta o riso: sono ricchi di carboidrati, il carburante più rapido.' },
    { emoji: '🧱', titolo: 'Funzione plastica (costruttiva)', spiegazione: 'Altri nutrienti servono a costruire e riparare il corpo: muscoli, pelle, ossa. Sono soprattutto le proteine e alcuni sali minerali, come il calcio.', parola_chiave: 'costruire', esempio: 'Quando ti fai un taglio, le proteine servono a ricostruire la pelle. Il calcio del latte rinforza ossa e denti.' },
    { emoji: '🛡️', titolo: 'Funzione regolatrice e protettiva', spiegazione: 'Vitamine, sali minerali e acqua non danno energia ma fanno funzionare bene tutto il corpo. Regolano le reazioni chimiche e ci difendono dalle malattie.', parola_chiave: 'regolano', esempio: 'La vitamina C della frutta aiuta le difese dell\'organismo.' },
    { emoji: '🔥', titolo: 'Quanta energia danno', spiegazione: 'L\'energia degli alimenti si misura in chilocalorie (kcal). Un grammo di carboidrati dà circa 4 kcal, un grammo di proteine circa 4 kcal, un grammo di lipidi circa 9 kcal.', parola_chiave: 'chilocalorie', esempio: 'Un cucchiaio di olio (10 g) dà circa 90 kcal: più di due volte un cucchiaio di zucchero (10 g, circa 40 kcal).' },
    { emoji: '💊', titolo: 'Vitamine idrosolubili e liposolubili', spiegazione: 'Le vitamine si dividono in due gruppi. Le idrosolubili (C e gruppo B) si sciolgono in acqua. Le liposolubili (A, D, E, K) si sciolgono nei grassi.', parola_chiave: 'liposolubili', esempio: 'Bollendo a lungo le verdure, parte della vitamina C finisce nell\'acqua di cottura.' },
    { emoji: '💧', titolo: 'L\'acqua', spiegazione: 'L\'acqua è circa il 60% del peso del corpo. Trasporta le sostanze, regola la temperatura con il sudore e aiuta a eliminare le scorie. Non dà energia.', parola_chiave: 'acqua', esempio: 'In una giornata calda in cucina si suda molto: bisogna bere spesso, anche senza sete.' }
  ],
  parole: [
    { termine: 'Nutriente', definizione: 'Sostanza contenuta negli alimenti che serve al corpo.' },
    { termine: 'Chilocaloria (kcal)', definizione: 'Unità di misura dell\'energia fornita dagli alimenti.' },
    { termine: 'Funzione plastica', definizione: 'Costruire e riparare i tessuti del corpo.' },
    { termine: 'Idrosolubile', definizione: 'Che si scioglie in acqua.' },
    { termine: 'Liposolubile', definizione: 'Che si scioglie nei grassi.' },
    { termine: 'Lipidi', definizione: 'I grassi: olio, burro, strutto. Danno molta energia.' }
  ],
  mnemonica: {
    acronimo: {
      parola: 'CPL-VSA',
      frase: 'Con Pane, Latte, Verdure, Sale e Acqua',
      lettere: [
        { lettera: 'C', significato: 'Carboidrati' },
        { lettera: 'P', significato: 'Proteine' },
        { lettera: 'L', significato: 'Lipidi' },
        { lettera: 'V', significato: 'Vitamine' },
        { lettera: 'S', significato: 'Sali minerali' },
        { lettera: 'A', significato: 'Acqua' }
      ]
    },
    storia: {
      titolo: 'Un giro nel Convitto, dall\'ingresso alla camerata',
      tappe: [
        { luogo: 'Ingresso', immagine: 'Al posto del portone c\'è una gigantesca fetta di pane che si apre come una porta scorrevole.', concetto: 'Carboidrati: energia rapida' },
        { luogo: 'Corridoio', immagine: 'Un culturista fatto di uova e bistecche sta riparando con i mattoni un muro crepato.', concetto: 'Proteine: costruiscono e riparano' },
        { luogo: 'Cucina', immagine: 'Una bottiglia d\'olio con nove braccia solleva nove pesi: è la più forte di tutti.', concetto: 'Lipidi: 9 kcal per grammo' },
        { luogo: 'Refettorio', immagine: 'Arance e kiwi vestiti da vigili urbani dirigono il traffico tra i tavoli.', concetto: 'Vitamine: regolano e proteggono' },
        { luogo: 'Cortile', immagine: 'Un enorme scheletro beve un bicchiere di latte e diventa d\'acciaio.', concetto: 'Sali minerali: il calcio per le ossa' },
        { luogo: 'Camerata', immagine: 'Il letto è un materasso ad acqua che riempie per più di metà la stanza.', concetto: 'Acqua: circa il 60% del corpo' }
      ]
    },
    filastrocca: 'Carboidrati e grassi: la benzina per i passi,\nle proteine fan muratore, riparano a tutte le ore.\nVitamine e sali, vigili speciali,\ne l\'acqua, che non ingrassa, è più di metà della massa.\nQuattro, quattro e poi nove: i grassi battono ogni prova!',
    immagini: [
      { concetto: 'Lipidi = 9 kcal', immagine: 'Un 9 gigante fatto d\'olio che scivola giù da uno scivolo.', emoji: '🫒' },
      { concetto: 'Vitamine A, D, E, K', immagine: 'ADE, il re degli inferi, sguazza in una piscina di burro: le vitamine «ADEK» stanno nei grassi.', emoji: '🧈' },
      { concetto: 'Vitamina C e gruppo B', immagine: 'Una C e una B fanno il bagno in piscina: si sciolgono in acqua.', emoji: '🏊' },
      { concetto: 'Proteine', immagine: 'Un muratore con il casco a forma di uovo.', emoji: '🥚' }
    ],
    trucchi: [
      '4 – 4 – 9: carboidrati 4, proteine 4, lipidi 9. Si dice come un numero di telefono: «quattro-quattro-nove».',
      'LIPOsolubile = si scioglie nei LIPIdi (grassi). IDROsolubile = si scioglie nell\'IDRO, l\'acqua (come idrante, idraulico).',
      'Le vitamine liposolubili sono A, D, E, K: «ADE-K», come Ade, il dio degli inferi, che scende nel grasso.'
    ]
  },
  sequenza: { titolo: 'Ordina i nutrienti dal più energetico al meno energetico (per grammo)', passi: ['Lipidi (circa 9 kcal)', 'Carboidrati e proteine (circa 4 kcal)', 'Vitamine, sali minerali e acqua (0 kcal)'] },
  quiz: [
    { domanda: 'Quanti sono i principi nutritivi?', opzioni: ['Sei', 'Tre', 'Dieci'], corretta: 0, spiegazione: 'Carboidrati, proteine, lipidi, vitamine, sali minerali e acqua: sei.' },
    { domanda: 'Quale nutriente dà più energia per grammo?', opzioni: ['I lipidi', 'Le proteine', 'Le vitamine'], corretta: 0, spiegazione: 'I lipidi danno circa 9 kcal per grammo, più del doppio degli altri.' },
    { domanda: 'A che cosa servono soprattutto le proteine?', opzioni: ['A costruire e riparare il corpo', 'A sciogliere le vitamine', 'A raffreddare il corpo'], corretta: 0, spiegazione: 'Hanno funzione plastica: costruiscono muscoli, pelle e tessuti.' },
    { domanda: 'Quale di questi gruppi NON dà energia?', opzioni: ['Vitamine, sali minerali e acqua', 'Carboidrati e lipidi', 'Proteine e carboidrati'], corretta: 0, spiegazione: 'Hanno funzione regolatrice e protettiva, ma 0 kcal.' },
    { domanda: 'Quali vitamine sono liposolubili?', opzioni: ['A, D, E, K', 'C e gruppo B', 'Solo la C'], corretta: 0, spiegazione: 'A, D, E, K si sciolgono nei grassi: «ADEK».' },
    { domanda: 'Quanta parte del corpo è fatta di acqua?', opzioni: ['Circa il 60%', 'Circa il 10%', 'Circa il 95%'], corretta: 0, spiegazione: 'In un adulto l\'acqua è circa il 60% del peso.' },
    { domanda: 'In che unità si misura l\'energia degli alimenti?', opzioni: ['Chilocalorie (kcal)', 'Chilogrammi (kg)', 'Litri (l)'], corretta: 0, spiegazione: 'L\'energia si misura in chilocalorie.' },
    { domanda: 'Quale sale minerale rinforza ossa e denti?', opzioni: ['Il calcio', 'La vitamina C', 'Lo zucchero'], corretta: 0, spiegazione: 'Il calcio ha funzione plastica: costruisce ossa e denti.' }
  ],
  vero_falso: [
    { affermazione: 'L\'acqua fornisce molta energia.', vero: false, spiegazione: 'L\'acqua non dà energia: 0 kcal. Però è indispensabile.' },
    { affermazione: 'I carboidrati hanno soprattutto funzione energetica.', vero: true, spiegazione: 'Sono il carburante più rapido del corpo.' },
    { affermazione: 'Un grammo di proteine dà circa 4 kcal.', vero: true, spiegazione: 'Come i carboidrati: circa 4 kcal per grammo.' },
    { affermazione: 'La vitamina C si scioglie nei grassi.', vero: false, spiegazione: 'La vitamina C è idrosolubile: si scioglie in acqua.' },
    { affermazione: 'Le vitamine aiutano a regolare il funzionamento del corpo.', vero: true, spiegazione: 'Hanno funzione regolatrice e protettiva.' },
    { affermazione: 'Con il sudore l\'acqua aiuta a regolare la temperatura del corpo.', vero: true, spiegazione: 'Il sudore che evapora raffredda la pelle.' }
  ],
  completa: [
    { frase: 'Un grammo di lipidi fornisce circa ___ kcal.', risposta: '9', distrattori: ['4', '0'] },
    { frase: 'Le proteine hanno soprattutto funzione ___.', risposta: 'plastica', distrattori: ['energetica', 'liquida'] },
    { frase: 'Le vitamine che si sciolgono in acqua si chiamano ___.', risposta: 'idrosolubili', distrattori: ['liposolubili', 'proteiche'] },
    { frase: 'L\'acqua è circa il ___ del peso del corpo.', risposta: '60%', distrattori: ['10%', '90%'] },
    { frase: 'I carboidrati e i lipidi hanno soprattutto funzione ___.', risposta: 'energetica', distrattori: ['plastica', 'protettiva'] }
  ],
  abbina: [
    { sinistra: 'Carboidrati', destra: 'Energia rapida' },
    { sinistra: 'Proteine', destra: 'Costruiscono e riparano' },
    { sinistra: 'Lipidi', destra: '9 kcal per grammo' },
    { sinistra: 'Vitamina C', destra: 'Idrosolubile' },
    { sinistra: 'Calcio', destra: 'Ossa e denti' },
    { sinistra: 'Acqua', destra: 'Circa il 60% del corpo' }
  ],
  flashcard: [
    { fronte: 'Quali sono i 6 principi nutritivi?', retro: 'Carboidrati, proteine, lipidi, vitamine, sali minerali, acqua. «Con Pane, Latte, Verdure, Sale e Acqua»' },
    { fronte: 'Kcal per grammo di carboidrati?', retro: 'Circa 4' },
    { fronte: 'Kcal per grammo di proteine?', retro: 'Circa 4' },
    { fronte: 'Kcal per grammo di lipidi?', retro: 'Circa 9' },
    { fronte: 'Che cos\'è la funzione plastica?', retro: 'Costruire e riparare i tessuti del corpo' },
    { fronte: 'Vitamine liposolubili?', retro: 'A, D, E, K (ADEK)' },
    { fronte: 'Vitamine idrosolubili?', retro: 'C e gruppo B' },
    { fronte: 'Quanta acqua c\'è nel corpo?', retro: 'Circa il 60% del peso' },
    { fronte: 'Quali nutrienti non danno energia?', retro: 'Vitamine, sali minerali e acqua' }
  ],
  intervista: {
    personaggio: 'La signora Proteina',
    chi: 'Una proteina dell\'uovo: muscolosa, instancabile, sempre in cantiere dentro di te.',
    emoji: '💪',
    domande: [
      { domanda: 'Signora Proteina, lei che lavoro fa?', risposta: 'Faccio la muratrice: costruisco e riparo il corpo, dai muscoli alla pelle. Si chiama funzione plastica.', sbagliate: ['Faccio la centrale elettrica: do quasi tutta l\'energia del corpo.', 'Faccio la guardia: proteggo il corpo dalle vitamine.'] },
      { domanda: 'Quanta energia ci regala, per ogni grammo?', risposta: 'Circa 4 chilocalorie, come i carboidrati. Ma io preferisco costruire, non bruciare.', sbagliate: ['Circa 9 chilocalorie, più di tutti.', 'Nessuna: io non do energia, come l\'acqua.'] },
      { domanda: 'Chi è la sua collega più energetica?', risposta: 'I lipidi, cioè i grassi: circa 9 chilocalorie per grammo. Più del doppio di me!', sbagliate: ['L\'acqua: è lei che dà più energia.', 'La vitamina C: un vero carburante.'] },
      { domanda: 'E chi invece non dà energia per niente?', risposta: 'Vitamine, sali minerali e acqua: non danno energia, ma fanno funzionare bene tutto il corpo.', sbagliate: ['I carboidrati: sono solo decorazione.', 'Nessuno: tutti i nutrienti danno la stessa energia.'] },
      { domanda: 'Dove la troviamo, a tavola?', risposta: 'Nella carne, nel pesce, nelle uova, nel latte e nei legumi. In cucina mi vedete tutti i giorni!', sbagliate: ['Solo nello zucchero e nei dolci.', 'Solo nell\'acqua del rubinetto.'] }
    ]
  },
  da_ricordare: [
    'I principi nutritivi sono sei: carboidrati, proteine, lipidi, vitamine, sali minerali e acqua.',
    'Carboidrati e lipidi danno energia; proteine e alcuni sali minerali costruiscono il corpo; vitamine, sali e acqua lo regolano e lo proteggono.',
    'Energia per grammo: carboidrati 4 kcal, proteine 4 kcal, lipidi 9 kcal.',
    'Vitamine liposolubili: A, D, E, K. Idrosolubili: C e gruppo B.',
    'L\'acqua è circa il 60% del corpo e non dà energia.'
  ]
};
