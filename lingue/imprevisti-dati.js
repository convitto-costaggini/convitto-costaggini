/* ════════════════════════════════════════════════════════
   IMPREVISTI — storie interattive a scelta.
   Ogni passo: situazione (italiano), battuta del cliente (4 lingue),
   tre risposte (4 lingue) con voto (3 ottima, 1 così così, 0 da evitare),
   traduzione italiana, spiegazione e conseguenza.
   esiti (facoltativo): i quattro titoli finali, dal migliore al peggiore.
   BOZZA da far verificare ai docenti di lingue e di indirizzo.
   ════════════════════════════════════════════════════════ */
window.IMPREVISTI = [
{
  id: 'tappo', ambito: 'sala', icona: '🍷', titolo: 'Il vino sa di tappo',
  intro: 'È sabato sera. Al tavolo 5 una coppia di turisti ha ordinato un rosso del territorio. Hai appena versato l\'assaggio.',
  passi: [
    { situazione: 'Il cliente annusa il vino e fa una smorfia.',
      clienteIt: "Mi scusi, credo che questo vino sappia di tappo. Ha odore di cartone bagnato.",
      cliente: { en: 'Excuse me, I think this wine is corked. It smells like wet cardboard.', fr: 'Excusez-moi, je crois que ce vin est bouchonné. Il sent le carton mouillé.', es: 'Perdone, creo que este vino sabe a corcho. Huele a cartón mojado.', de: 'Entschuldigung, ich glaube, der Wein korkt. Er riecht nach nassem Karton.' },
      opzioni: [
        { voto: 3, testo: { en: 'I\'m so sorry. Let me take it away and bring you a new bottle right away.', fr: 'Je suis vraiment désolé. Je la reprends et je vous apporte tout de suite une nouvelle bouteille.', es: 'Lo siento mucho. Me la llevo y le traigo enseguida una botella nueva.', de: 'Das tut mir sehr leid. Ich nehme sie mit und bringe Ihnen sofort eine neue Flasche.' }, it: 'Mi dispiace molto. La porto via e le porto subito una bottiglia nuova.', perche: 'Ti scusi, non discuti e risolvi subito: è la regola d\'oro. Il sentore di tappo è un difetto del prodotto, non un capriccio del cliente.', reazione: 'Il cliente sorride: «Thank you, that\'s very kind.»' },
        { voto: 1, testo: { en: 'Are you sure? It\'s a very good wine.', fr: 'Vous êtes sûr ? C\'est un très bon vin.', es: '¿Está seguro? Es un vino muy bueno.', de: 'Sind Sie sicher? Das ist ein sehr guter Wein.' }, it: 'È sicuro? È un vino molto buono.', perche: 'Mettere in dubbio il giudizio del cliente lo mette a disagio. Se hai un dubbio puoi chiedere al sommelier o al responsabile, ma intanto ti scusi.', reazione: 'Il cliente si irrigidisce: «Yes, I\'m sure.» Il clima al tavolo si è raffreddato.' },
        { voto: 0, testo: { en: 'That\'s normal, it\'s a natural wine.', fr: 'C\'est normal, c\'est un vin nature.', es: 'Es normal, es un vino natural.', de: 'Das ist normal, das ist ein Naturwein.' }, it: 'È normale, è un vino naturale.', perche: 'Il sentore di tappo (cartone bagnato, muffa) è un difetto, non una caratteristica. Negarlo fa perdere credibilità a te e al locale.', reazione: 'Il cliente scuote la testa e chiede di parlare con il responsabile.' }
      ] },
    { situazione: 'Torni con una bottiglia nuova della stessa etichetta. Prima di versare, il cliente chiede:',
      clienteIt: "È lo stesso vino?",
      cliente: { en: 'Is it the same wine?', fr: 'C\'est le même vin ?', es: '¿Es el mismo vino?', de: 'Ist es derselbe Wein?' },
      opzioni: [
        { voto: 3, testo: { en: 'Yes, the same wine from a new bottle. Would you like to taste it first?', fr: 'Oui, le même vin, d\'une nouvelle bouteille. Voulez-vous le goûter d\'abord ?', es: 'Sí, el mismo vino de una botella nueva. ¿Desea probarlo primero?', de: 'Ja, derselbe Wein aus einer neuen Flasche. Möchten Sie ihn zuerst probieren?' }, it: 'Sì, lo stesso vino da una bottiglia nuova. Desidera assaggiarlo prima?', perche: 'Rispondi con chiarezza e rinnovi il rito dell\'assaggio: il cliente torna a sentirsi al centro.', reazione: '«Yes, please.» Il cliente assaggia e annuisce soddisfatto.' },
        { voto: 1, testo: { en: 'Yes.', fr: 'Oui.', es: 'Sí.', de: 'Ja.' }, it: 'Sì.', perche: 'Corretto ma freddo. In sala anche il tono conta: una frase completa e l\'offerta dell\'assaggio fanno la differenza.', reazione: 'Il cliente annuisce, ma senza entusiasmo.' },
        { voto: 0, testo: { en: 'No, we don\'t have it any more, so I brought this one.', fr: 'Non, nous n\'en avons plus, alors j\'ai pris celle-ci.', es: 'No, ya no nos queda, así que he traído este.', de: 'Nein, den haben wir nicht mehr, also habe ich diesen gebracht.' }, it: 'No, non l\'abbiamo più, quindi ho portato questo.', perche: 'Se un vino è finito lo si dice prima e si propone un\'alternativa chiedendo il consenso. Decidere al posto del cliente è un errore.', reazione: 'Il cliente è sorpreso: «I didn\'t ask for a different wine.»' }
      ] },
    { situazione: 'Al momento del conto, il cliente ricorda l\'episodio.',
      clienteIt: "La prima bottiglia sarà nel conto?",
      cliente: { en: 'Will the first bottle be on the bill?', fr: 'La première bouteille sera sur l\'addition ?', es: '¿La primera botella estará en la cuenta?', de: 'Steht die erste Flasche auf der Rechnung?' },
      opzioni: [
        { voto: 3, testo: { en: 'Of course not. You only pay for the bottle you enjoyed.', fr: 'Bien sûr que non. Vous ne payez que la bouteille que vous avez appréciée.', es: 'Por supuesto que no. Solo paga la botella que ha disfrutado.', de: 'Natürlich nicht. Sie zahlen nur die Flasche, die Sie genossen haben.' }, it: 'Certo che no. Paga solo la bottiglia che ha gustato.', perche: 'Una bottiglia difettosa non si fa pagare. Lo dici con naturalezza e chiudi l\'episodio con eleganza.', reazione: '«Perfect, thank you!» La coppia lascia una recensione entusiasta.' },
        { voto: 1, testo: { en: 'I need to ask the manager.', fr: 'Je dois demander au responsable.', es: 'Tengo que preguntar al responsable.', de: 'Ich muss den Manager fragen.' }, it: 'Devo chiedere al responsabile.', perche: 'Chiedere è giusto se non conosci la regola, ma è meglio conoscere prima le procedure del locale per rispondere subito.', reazione: 'Il cliente aspetta qualche minuto. Alla fine la bottiglia viene tolta dal conto.' },
        { voto: 0, testo: { en: 'Yes, it was opened, so we have to charge it.', fr: 'Oui, elle a été ouverte, donc nous devons la facturer.', es: 'Sí, se abrió, así que tenemos que cobrarla.', de: 'Ja, sie wurde geöffnet, also müssen wir sie berechnen.' }, it: 'Sì, è stata aperta, quindi dobbiamo farla pagare.', perche: 'Far pagare un prodotto difettoso è scorretto e rovina tutta l\'esperienza.', reazione: 'Il cliente protesta e se ne va scontento.' }
      ] }
  ]
},
{
  id: 'capello', ambito: 'sala', icona: '💇', titolo: 'Un capello nel piatto',
  intro: 'Pranzo affollato. Una cliente ti chiama con un cenno: ha trovato un capello nel risotto.',
  passi: [
    { situazione: 'La cliente ti indica il piatto, visibilmente infastidita.',
      clienteIt: "Mi scusi, c'è un capello nel mio risotto.",
      cliente: { en: 'Excuse me, there\'s a hair in my risotto.', fr: 'Excusez-moi, il y a un cheveu dans mon risotto.', es: 'Perdone, hay un pelo en mi risotto.', de: 'Entschuldigung, in meinem Risotto ist ein Haar.' },
      opzioni: [
        { voto: 3, testo: { en: 'I\'m terribly sorry. I\'ll take it away immediately and have a new one prepared.', fr: 'Je suis vraiment navré. Je le reprends immédiatement et j\'en fais préparer un autre.', es: 'Lo siento muchísimo. Me lo llevo ahora mismo y pido que le preparen otro.', de: 'Das tut mir schrecklich leid. Ich nehme es sofort mit und lasse ein neues zubereiten.' }, it: 'Mi dispiace tantissimo. Lo porto via subito e ne faccio preparare un altro.', perche: 'Scuse sincere, piatto via subito, soluzione concreta. Niente giustificazioni.', reazione: 'La cliente si calma: «Thank you.»' },
        { voto: 1, testo: { en: 'Oh! Would you like something else?', fr: 'Oh ! Vous voulez autre chose ?', es: '¡Oh! ¿Quiere otra cosa?', de: 'Oh! Möchten Sie etwas anderes?' }, it: 'Oh! Vuole qualcos\'altro?', perche: 'Offrire un\'alternativa va bene, ma prima servono le scuse, e il piatto va tolto subito dal tavolo.', reazione: 'La cliente resta perplessa: nessuno si è scusato.' },
        { voto: 0, testo: { en: 'Are you sure it isn\'t yours?', fr: 'Vous êtes sûre que ce n\'est pas le vôtre ?', es: '¿Está segura de que no es suyo?', de: 'Sind Sie sicher, dass es nicht Ihres ist?' }, it: 'È sicura che non sia suo?', perche: 'Insinuare che la colpa sia della cliente è offensivo, anche se fosse vero.', reazione: 'La cliente si alza indignata.' }
      ] },
    { situazione: 'Il nuovo risotto richiede circa quindici minuti. La cliente guarda l\'orologio.',
      clienteIt: "Quanto ci vorrà? Ho fretta.",
      cliente: { en: 'How long will it take? I\'m in a hurry.', fr: 'Ça va prendre combien de temps ? Je suis pressée.', es: '¿Cuánto tardará? Tengo prisa.', de: 'Wie lange dauert das? Ich habe es eilig.' },
      opzioni: [
        { voto: 3, testo: { en: 'About fifteen minutes. In the meantime, may I offer you a small starter?', fr: 'Environ quinze minutes. En attendant, puis-je vous offrir une petite entrée ?', es: 'Unos quince minutos. Mientras tanto, ¿puedo ofrecerle un pequeño entrante?', de: 'Etwa fünfzehn Minuten. Darf ich Ihnen in der Zwischenzeit eine kleine Vorspeise anbieten?' }, it: 'Circa quindici minuti. Nel frattempo, posso offrirle un piccolo antipasto?', perche: 'Dai un tempo preciso e trasformi l\'attesa in un gesto di attenzione.', reazione: '«That\'s very kind, yes please.»' },
        { voto: 1, testo: { en: 'Not long.', fr: 'Pas longtemps.', es: 'No mucho.', de: 'Nicht lange.' }, it: 'Non molto.', perche: 'Una risposta vaga crea ansia: meglio un tempo realistico.', reazione: 'Dopo venti minuti la cliente è spazientita.' },
        { voto: 0, testo: { en: 'Risotto takes time, madam.', fr: 'Le risotto, ça prend du temps, madame.', es: 'El risotto tarda, señora.', de: 'Risotto braucht Zeit, meine Dame.' }, it: 'Il risotto richiede tempo, signora.', perche: 'Vero, ma detto così suona come un rimprovero. Il disagio l\'ha causato il locale, non la cliente.', reazione: 'La cliente sospira e chiede il conto.' }
      ] },
    { situazione: 'A fine pasto la cliente ti saluta.',
      clienteIt: "Grazie. Il nuovo risotto era delizioso.",
      cliente: { en: 'Thank you. The new risotto was delicious.', fr: 'Merci. Le nouveau risotto était délicieux.', es: 'Gracias. El nuevo risotto estaba delicioso.', de: 'Danke. Das neue Risotto war köstlich.' },
      opzioni: [
        { voto: 3, testo: { en: 'I\'m glad to hear that. Once again, we apologise: the dessert is on us.', fr: 'J\'en suis ravi. Encore toutes nos excuses : le dessert est offert.', es: 'Me alegro mucho. Le pedimos disculpas de nuevo: el postre corre de nuestra cuenta.', de: 'Das freut mich sehr. Nochmals Entschuldigung: Das Dessert geht aufs Haus.' }, it: 'Mi fa piacere. Ci scusiamo ancora: il dolce lo offriamo noi.', perche: 'Chiudere con un gesto, se il responsabile lo consente, trasforma un incidente in un ricordo positivo.', reazione: 'La cliente promette di tornare.' },
        { voto: 1, testo: { en: 'You\'re welcome.', fr: 'Je vous en prie.', es: 'De nada.', de: 'Bitte schön.' }, it: 'Prego.', perche: 'Cortese ma minimo: non sfrutti l\'occasione per recuperare del tutto la cliente.', reazione: 'La cliente saluta con cortesia.' },
        { voto: 0, testo: { en: 'Good. So everything is fine now.', fr: 'Bien. Donc tout va bien maintenant.', es: 'Bien. Entonces ya está todo bien.', de: 'Gut. Dann ist ja jetzt alles in Ordnung.' }, it: 'Bene. Quindi adesso è tutto a posto.', perche: 'Chiudere sbrigativamente dà l\'impressione che l\'accaduto non ti importi.', reazione: 'La cliente lascia il locale senza salutare.' }
      ] }
  ]
},
{
  id: 'allergia', ambito: 'sala', icona: '🚑', titolo: 'Una reazione allergica',
  intro: 'Un cliente, dopo aver assaggiato il dolce, si porta le mani alla gola. Il suo amico ti chiama agitato. In Italia il numero unico di emergenza è il 112.',
  passi: [
    { situazione: 'L\'amico del cliente ti chiama ad alta voce.',
      clienteIt: "Aiuto! Il mio amico è allergico alla frutta a guscio e respira male!",
      cliente: { en: 'Help! My friend is allergic to nuts and he can\'t breathe well!', fr: 'Au secours ! Mon ami est allergique aux fruits à coque et il respire mal !', es: '¡Ayuda! ¡Mi amigo es alérgico a los frutos secos y le cuesta respirar!', de: 'Hilfe! Mein Freund ist allergisch gegen Nüsse und bekommt schlecht Luft!' },
      opzioni: [
        { voto: 3, testo: { en: 'I\'m calling an ambulance right now. Does he have his adrenaline pen?', fr: 'J\'appelle une ambulance tout de suite. A-t-il son stylo d\'adrénaline ?', es: 'Llamo a una ambulancia ahora mismo. ¿Tiene su autoinyector de adrenalina?', de: 'Ich rufe sofort einen Krankenwagen. Hat er seinen Adrenalin-Pen dabei?' }, it: 'Chiamo subito un\'ambulanza. Ha con sé la sua penna di adrenalina?', perche: 'In un\'emergenza conta il tempo: si chiama subito il 112 e si chiede se la persona ha con sé il proprio farmaco salvavita, che usa lei stessa o chi l\'accompagna.', reazione: 'L\'amico tira fuori l\'autoiniettore dallo zaino. Un collega chiama il 112.' },
        { voto: 1, testo: { en: 'Wait, I\'ll get the manager.', fr: 'Attendez, je vais chercher le responsable.', es: 'Espere, voy a buscar al responsable.', de: 'Warten Sie, ich hole den Manager.' }, it: 'Aspetti, vado a chiamare il responsabile.', perche: 'Avvisare il responsabile è giusto, ma il primo passo è chiamare, o far chiamare, subito il 112.', reazione: 'Passano minuti preziosi prima che qualcuno chiami i soccorsi.' },
        { voto: 0, testo: { en: 'Give him a glass of water, it will pass.', fr: 'Donnez-lui un verre d\'eau, ça va passer.', es: 'Dele un vaso de agua, ya se le pasará.', de: 'Geben Sie ihm ein Glas Wasser, das geht vorbei.' }, it: 'Gli dia un bicchiere d\'acqua, passerà.', perche: 'Una reazione allergica grave non passa da sola: sottovalutarla è pericolosissimo.', reazione: 'La situazione peggiora. Per fortuna un altro cliente chiama il 112.' }
      ] },
    { situazione: 'Mentre aspettate i soccorsi, il cliente è seduto e spaventato.',
      clienteIt: "Ho paura…",
      cliente: { en: 'I\'m scared…', fr: 'J\'ai peur…', es: 'Tengo miedo…', de: 'Ich habe Angst…' },
      opzioni: [
        { voto: 3, testo: { en: 'Help is on the way. I\'ll stay here with you.', fr: 'Les secours arrivent. Je reste ici avec vous.', es: 'La ayuda está en camino. Me quedo aquí con usted.', de: 'Die Hilfe ist unterwegs. Ich bleibe hier bei Ihnen.' }, it: 'I soccorsi stanno arrivando. Resto qui con lei.', perche: 'Non si lascia mai sola la persona: le si parla con calma e la si rassicura finché arrivano i soccorsi.', reazione: 'Il cliente si tranquillizza un poco.' },
        { voto: 1, testo: { en: 'Don\'t worry, it\'s nothing.', fr: 'Ne vous inquiétez pas, ce n\'est rien.', es: 'No se preocupe, no es nada.', de: 'Keine Sorge, das ist nichts.' }, it: 'Non si preoccupi, non è niente.', perche: 'Rassicurare va bene, minimizzare no: la situazione è seria. Meglio dire che i soccorsi stanno arrivando.', reazione: 'Il cliente non sembra convinto.' },
        { voto: 0, testo: { en: 'Sorry, I have to go back to my tables.', fr: 'Désolé, je dois retourner à mes tables.', es: 'Lo siento, tengo que volver a mis mesas.', de: 'Entschuldigung, ich muss zurück zu meinen Tischen.' }, it: 'Mi scusi, devo tornare ai miei tavoli.', perche: 'In un\'emergenza il servizio passa in secondo piano: la persona non va lasciata sola.', reazione: 'Il cliente resta solo con l\'amico, sempre più agitato.' }
      ] },
    { situazione: 'Arrivano i soccorritori. L\'amico ti chiede:',
      clienteIt: "Quali ingredienti c'erano nel dolce?",
      cliente: { en: 'Which ingredients were in the dessert?', fr: 'Quels ingrédients y avait-il dans le dessert ?', es: '¿Qué ingredientes llevaba el postre?', de: 'Welche Zutaten waren im Dessert?' },
      opzioni: [
        { voto: 3, testo: { en: 'I\'ll check the allergen list with the kitchen and give it to the paramedics.', fr: 'Je vérifie la liste des allergènes avec la cuisine et je la donne aux secouristes.', es: 'Compruebo la lista de alérgenos con la cocina y se la doy a los sanitarios.', de: 'Ich prüfe die Allergenliste mit der Küche und gebe sie den Sanitätern.' }, it: 'Controllo con la cucina l\'elenco degli allergeni e lo do ai soccorritori.', perche: 'Un\'informazione precisa aiuta i soccorritori. Ogni locale deve conoscere gli allergeni di ogni piatto (Regolamento UE 1169/2011).', reazione: 'I soccorritori ringraziano: ora sanno che cosa ha scatenato la reazione.' },
        { voto: 1, testo: { en: 'I think there were almonds, but I\'m not sure.', fr: 'Je crois qu\'il y avait des amandes, mais je ne suis pas sûr.', es: 'Creo que llevaba almendras, pero no estoy seguro.', de: 'Ich glaube, es waren Mandeln drin, aber ich bin nicht sicher.' }, it: 'Credo che ci fossero mandorle, ma non sono sicuro.', perche: 'Meglio verificare che tirare a indovinare: in questi casi serve un\'informazione certa.', reazione: 'Bisogna chiedere comunque in cucina: si perde altro tempo.' },
        { voto: 0, testo: { en: 'I don\'t know, I just serve the food.', fr: 'Je ne sais pas, moi je sers seulement les plats.', es: 'No lo sé, yo solo sirvo los platos.', de: 'Keine Ahnung, ich serviere nur das Essen.' }, it: 'Non lo so, io servo soltanto i piatti.', perche: 'Conoscere gli allergeni, o saperli trovare subito, fa parte del lavoro di sala.', reazione: 'I soccorritori devono cercare da soli l\'informazione.' }
      ] }
  ],
  esiti: ['Emergenza gestita in modo esemplare', 'Emergenza gestita, con qualche esitazione', 'Troppe esitazioni: ripassa la procedura', 'Comportamento pericoloso: ripassa la procedura'],
  nota: 'Prima di servire chiedi sempre: «Ha allergie o intolleranze?». Non somministrare mai farmaci di tua iniziativa: chiama il 112 e segui le loro indicazioni.'
},
{
  id: 'prenotazione', ambito: 'accoglienza', icona: '🛎️', titolo: 'La prenotazione che non c\'è',
  intro: 'Sono le dieci di sera. Arriva una coppia stanca dopo un lungo viaggio, ma al computer la loro prenotazione non risulta.',
  passi: [
    { situazione: 'La coppia si avvicina al bancone con le valigie.',
      clienteIt: "Buonasera. Abbiamo una prenotazione a nome Weber.",
      cliente: { en: 'Good evening. We have a booking under the name Weber.', fr: 'Bonsoir. Nous avons une réservation au nom de Weber.', es: 'Buenas noches. Tenemos una reserva a nombre de Weber.', de: 'Guten Abend. Wir haben eine Reservierung auf den Namen Weber.' },
      opzioni: [
        { voto: 3, testo: { en: 'Welcome! I\'m sorry, I can\'t find it at the moment. Do you have a confirmation email?', fr: 'Bienvenue ! Je suis désolé, je ne la trouve pas pour l\'instant. Avez-vous un e-mail de confirmation ?', es: '¡Bienvenidos! Lo siento, de momento no la encuentro. ¿Tienen un correo de confirmación?', de: 'Herzlich willkommen! Es tut mir leid, ich finde sie im Moment nicht. Haben Sie eine Bestätigungs-E-Mail?' }, it: 'Benvenuti! Mi dispiace, al momento non la trovo. Avete un\'email di conferma?', perche: 'Accogli, spieghi il problema senza allarmare e chiedi un documento utile per risolverlo.', reazione: 'La signora mostra la conferma sul telefono: la prenotazione è per il mese prossimo!' },
        { voto: 1, testo: { en: 'There\'s no booking.', fr: 'Il n\'y a pas de réservation.', es: 'No hay ninguna reserva.', de: 'Es gibt keine Reservierung.' }, it: 'Non c\'è nessuna prenotazione.', perche: 'Corretto ma brusco: un ospite stanco va accolto con calma e con una proposta.', reazione: 'Gli ospiti si preoccupano: «What? But we booked!»' },
        { voto: 0, testo: { en: 'You must have made a mistake.', fr: 'Vous avez dû vous tromper.', es: 'Se habrán equivocado.', de: 'Sie haben sich bestimmt geirrt.' }, it: 'Avrete sicuramente sbagliato voi.', perche: 'Mai attribuire la colpa all\'ospite prima di aver verificato.', reazione: 'Il signore alza la voce: «We didn\'t make a mistake!»' }
      ] },
    { situazione: 'La prenotazione è per il mese prossimo: un errore di data. Stasera l\'hotel ha ancora una camera doppia libera.',
      clienteIt: "Oh no! Abbiamo prenotato il mese sbagliato. Cosa possiamo fare?",
      cliente: { en: 'Oh no! We booked the wrong month. What can we do?', fr: 'Oh non ! Nous nous sommes trompés de mois. Que pouvons-nous faire ?', es: '¡Oh, no! Nos hemos equivocado de mes. ¿Qué podemos hacer?', de: 'Oh nein! Wir haben den falschen Monat gebucht. Was können wir tun?' },
      opzioni: [
        { voto: 3, testo: { en: 'Don\'t worry: we have a double room available tonight. I can move your booking.', fr: 'Ne vous inquiétez pas : nous avons une chambre double libre ce soir. Je peux déplacer votre réservation.', es: 'No se preocupen: tenemos una habitación doble libre esta noche. Puedo cambiar su reserva.', de: 'Keine Sorge: Wir haben heute Nacht ein Doppelzimmer frei. Ich kann Ihre Reservierung umbuchen.' }, it: 'Non vi preoccupate: abbiamo una camera doppia libera stasera. Posso spostare la vostra prenotazione.', perche: 'L\'errore è degli ospiti, ma non lo sottolinei: offri subito la soluzione.', reazione: 'Gli ospiti tirano un sospiro di sollievo.' },
        { voto: 1, testo: { en: 'That\'s your mistake, but we have a room.', fr: 'C\'est votre erreur, mais nous avons une chambre.', es: 'El error es suyo, pero tenemos una habitación.', de: 'Das ist Ihr Fehler, aber wir haben ein Zimmer.' }, it: 'L\'errore è vostro, ma abbiamo una camera.', perche: 'La soluzione c\'è, ma rimarcare l\'errore mette in imbarazzo gli ospiti.', reazione: 'Accettano la camera, un po\' imbarazzati.' },
        { voto: 0, testo: { en: 'Sorry, you have to come back next month.', fr: 'Désolé, vous devez revenir le mois prochain.', es: 'Lo siento, tienen que volver el mes que viene.', de: 'Tut mir leid, Sie müssen nächsten Monat wiederkommen.' }, it: 'Mi dispiace, dovete tornare il mese prossimo.', perche: 'C\'è una camera libera: mandare via gli ospiti fa perdere un cliente e un incasso.', reazione: 'Gli ospiti escono a cercare un altro albergo alle dieci di sera.' }
      ] },
    { situazione: 'Mentre completi la registrazione, la signora chiede:',
      clienteIt: "Il ristorante è ancora aperto? Non abbiamo cenato.",
      cliente: { en: 'Is the restaurant still open? We haven\'t had dinner.', fr: 'Le restaurant est-il encore ouvert ? Nous n\'avons pas dîné.', es: '¿El restaurante sigue abierto? No hemos cenado.', de: 'Ist das Restaurant noch geöffnet? Wir haben noch nicht zu Abend gegessen.' },
      opzioni: [
        { voto: 3, testo: { en: 'The kitchen is closed, but I can have some sandwiches sent to your room.', fr: 'La cuisine est fermée, mais je peux faire monter des sandwichs dans votre chambre.', es: 'La cocina está cerrada, pero puedo pedir que les suban unos bocadillos a la habitación.', de: 'Die Küche ist geschlossen, aber ich kann Ihnen ein paar Sandwiches aufs Zimmer bringen lassen.' }, it: 'La cucina è chiusa, ma posso farvi portare dei panini in camera.', perche: 'Anche quando la risposta è no, si cerca un\'alternativa: è il cuore dell\'ospitalità.', reazione: '«You\'re an angel!» Gli ospiti salgono in camera felici.' },
        { voto: 1, testo: { en: 'No, it\'s closed. There\'s a pizzeria nearby.', fr: 'Non, il est fermé. Il y a une pizzeria pas loin.', es: 'No, está cerrado. Hay una pizzería cerca.', de: 'Nein, es ist geschlossen. In der Nähe gibt es eine Pizzeria.' }, it: 'No, è chiuso. C\'è una pizzeria qui vicino.', perche: 'Utile indicare un\'alternativa, ma dopo una serata difficile un piccolo servizio in camera farebbe la differenza.', reazione: 'Gli ospiti escono di nuovo, stanchi, a cercare la pizzeria.' },
        { voto: 0, testo: { en: 'No.', fr: 'Non.', es: 'No.', de: 'Nein.' }, it: 'No.', perche: 'Un «no» secco, senza alternative, chiude la conversazione e lascia l\'ospite insoddisfatto.', reazione: 'Gli ospiti vanno a dormire senza cena.' }
      ] }
  ]
},
{
  id: 'birra', ambito: 'bar', icona: '🍺', titolo: 'Una birra per un ragazzo',
  intro: 'Pomeriggio al bar. Un ragazzo straniero che sembra molto giovane si avvicina al banco. In Italia è vietato vendere e servire alcolici ai minori di 18 anni.',
  passi: [
    { situazione: 'Il ragazzo appoggia le mani sul banco.',
      clienteIt: "Ciao! Una birra, per favore.",
      cliente: { en: 'Hi! A beer, please.', fr: 'Salut ! Une bière, s\'il vous plaît.', es: '¡Hola! Una cerveza, por favor.', de: 'Hallo! Ein Bier, bitte.' },
      opzioni: [
        { voto: 3, testo: { en: 'Of course. May I see some ID, please?', fr: 'Bien sûr. Puis-je voir une pièce d\'identité, s\'il vous plaît ?', es: 'Claro. ¿Me enseña un documento, por favor?', de: 'Gern. Darf ich bitte Ihren Ausweis sehen?' }, it: 'Certo. Posso vedere un documento, per favore?', perche: 'Nel dubbio si chiede sempre un documento, con cortesia e senza imbarazzo: lo prevede la legge.', reazione: 'Il ragazzo si fruga nelle tasche: «Uh… I don\'t have it with me.»' },
        { voto: 1, testo: { en: 'How old are you?', fr: 'Quel âge avez-vous ?', es: '¿Cuántos años tiene?', de: 'Wie alt sind Sie?' }, it: 'Quanti anni ha?', perche: 'Chiedere l\'età a voce non basta: serve un documento.', reazione: '«Eighteen!» risponde il ragazzo, un po\' troppo in fretta.' },
        { voto: 0, testo: { en: 'Sure, here you are!', fr: 'Bien sûr, voilà !', es: '¡Claro, aquí tiene!', de: 'Klar, bitte schön!' }, it: 'Certo, ecco qua!', perche: 'Servire alcolici a un minorenne è vietato e comporta sanzioni, anche per il locale.', reazione: 'Il responsabile ti richiama subito: «Hai controllato il documento?»' }
      ] },
    { situazione: 'Il ragazzo non ha documenti con sé.',
      clienteIt: "Dai, ho diciotto anni, lo giuro!",
      cliente: { en: 'Come on, I\'m eighteen, I promise!', fr: 'Allez, j\'ai dix-huit ans, promis !', es: '¡Venga, tengo dieciocho años, lo prometo!', de: 'Ach komm, ich bin achtzehn, versprochen!' },
      opzioni: [
        { voto: 3, testo: { en: 'I\'m sorry, without ID I can\'t serve alcohol. Can I offer you something else?', fr: 'Je suis désolé, sans pièce d\'identité je ne peux pas servir d\'alcool. Je peux vous proposer autre chose ?', es: 'Lo siento, sin documento no puedo servir alcohol. ¿Le puedo ofrecer otra cosa?', de: 'Tut mir leid, ohne Ausweis darf ich keinen Alkohol ausschenken. Kann ich Ihnen etwas anderes anbieten?' }, it: 'Mi dispiace, senza documento non posso servire alcolici. Posso offrirle qualcos\'altro?', perche: 'Fermo sulla regola, gentile nei modi e con un\'alternativa: il cliente resta un cliente.', reazione: 'Il ragazzo alza le spalle: «OK… what do you have?»' },
        { voto: 1, testo: { en: 'No ID, no beer.', fr: 'Pas de papiers, pas de bière.', es: 'Sin documento, no hay cerveza.', de: 'Kein Ausweis, kein Bier.' }, it: 'Niente documento, niente birra.', perche: 'La regola è giusta, ma il tono è sbrigativo: si può dire di no con più garbo.', reazione: 'Il ragazzo se ne va senza ordinare niente.' },
        { voto: 0, testo: { en: 'OK, just this once.', fr: 'D\'accord, juste pour cette fois.', es: 'Vale, solo por esta vez.', de: 'Na gut, nur dieses eine Mal.' }, it: 'Va bene, solo per questa volta.', perche: 'Non esistono eccezioni: la legge vale sempre.', reazione: 'Il responsabile interviene e ritira la birra.' }
      ] },
    { situazione: 'Il ragazzo ti chiede un consiglio.',
      clienteIt: "Che bevande analcoliche avete?",
      cliente: { en: 'What non-alcoholic drinks do you have?', fr: 'Qu\'est-ce que vous avez sans alcool ?', es: '¿Qué bebidas sin alcohol tiene?', de: 'Was haben Sie ohne Alkohol?' },
      opzioni: [
        { voto: 3, testo: { en: 'We have a great non-alcoholic aperitif, fresh orange juice or a lemon soda.', fr: 'Nous avons un excellent apéritif sans alcool, un jus d\'orange pressé ou une limonade.', es: 'Tenemos un aperitivo sin alcohol buenísimo, zumo de naranja natural o un refresco de limón.', de: 'Wir haben einen tollen alkoholfreien Aperitif, frisch gepressten Orangensaft oder eine Zitronenlimonade.' }, it: 'Abbiamo un ottimo aperitivo analcolico, una spremuta d\'arancia fresca o una limonata.', perche: 'Proponi alternative concrete e invitanti: anche un no può finire con una vendita.', reazione: '«The aperitif sounds good!» Il ragazzo ordina e ringrazia.' },
        { voto: 1, testo: { en: 'Water or juice.', fr: 'De l\'eau ou du jus.', es: 'Agua o zumo.', de: 'Wasser oder Saft.' }, it: 'Acqua o succo.', perche: 'Corretto ma poco invitante: un buon barista sa valorizzare anche le bevande analcoliche.', reazione: 'Il ragazzo prende un\'acqua, senza entusiasmo.' },
        { voto: 0, testo: { en: 'Nothing interesting, sorry.', fr: 'Rien d\'intéressant, désolé.', es: 'Nada interesante, lo siento.', de: 'Nichts Interessantes, tut mir leid.' }, it: 'Niente di interessante, mi dispiace.', perche: 'Svalutare i propri prodotti non è mai una buona idea.', reazione: 'Il ragazzo esce dal bar.' }
      ] }
  ]
}
];
