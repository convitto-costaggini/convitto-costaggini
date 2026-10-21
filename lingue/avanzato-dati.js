/* ════════════════════════════════════════════════════════
   LIVELLO AVANZATO (B1–B2) — frasi complete, registro,
   testi da ascoltare ed e-mail, in 3 lingue.
   SITUAZIONI: { id, ambito, nome, icona, frasi: [italiano, {en, fr, es, de}] }
   REGISTRO:   [italiano semplice, italiano professionale, {lingua: [semplice, professionale]}]
   ASCOLTI:    { id, ambito, titolo, icona, testi: {it, en, fr, es, de}, domande: [domanda, [opzioni], indice giusta] }
   EMAIL:      { id, titolo, icona, par: {lingua: [paragrafi]} } — il primo e l'ultimo restano fissi nell'esercizio
   Lo usano la pagina Livello avanzato e i Giochi alla LIM.
   BOZZA da far verificare ai docenti di lingue e di indirizzo.
   ════════════════════════════════════════════════════════ */
window.AVANZATO = {
  SITUAZIONI: [
    { id: "piatto", ambito: "sala", nome: "Descrivere un piatto", icona: "🍝", frasi: [
      ["Le consiglio le fettuccine all'amatriciana: è un piatto tipico della nostra provincia, preparato con guanciale, pomodoro e pecorino.", {
        en: "I recommend the fettuccine all'amatriciana: it's a typical dish from our province, made with cured pork cheek, tomato and pecorino cheese.",
        fr: "Je vous conseille les fettuccine all'amatriciana : c'est un plat typique de notre province, préparé avec de la joue de porc, de la tomate et du pecorino.",
        es: "Le recomiendo las fettuccine all'amatriciana: es un plato típico de nuestra provincia, preparado con carrillera de cerdo curada, tomate y queso pecorino." }],
      ["Il manzo viene cotto a bassa temperatura per otto ore, quindi risulta molto tenero e succoso.", {
        en: "The beef is slow-cooked at a low temperature for eight hours, so it is very tender and juicy.",
        fr: "Le bœuf est cuit à basse température pendant huit heures, il est donc très tendre et juteux.",
        es: "La ternera se cocina a baja temperatura durante ocho horas, así que queda muy tierna y jugosa." }],
      ["Il piatto è accompagnato da verdure di stagione e da una salsa leggera allo yogurt e menta.", {
        en: "The dish is served with seasonal vegetables and a light yoghurt and mint sauce.",
        fr: "Le plat est accompagné de légumes de saison et d'une sauce légère au yaourt et à la menthe.",
        es: "El plato se acompaña con verduras de temporada y una salsa ligera de yogur y menta." }],
      ["Se preferisce qualcosa di più leggero, il pesce del giorno è cotto al vapore e condito solo con olio extravergine e limone.", {
        en: "If you prefer something lighter, the fish of the day is steamed and dressed only with extra virgin olive oil and lemon.",
        fr: "Si vous préférez quelque chose de plus léger, le poisson du jour est cuit à la vapeur et assaisonné seulement d'huile d'olive vierge extra et de citron.",
        es: "Si prefiere algo más ligero, el pescado del día está hecho al vapor y aliñado solo con aceite de oliva virgen extra y limón." }],
      ["È un piatto abbastanza piccante: se vuole, posso chiedere allo chef di prepararlo più delicato.", {
        en: "It's quite a spicy dish: if you like, I can ask the chef to make it milder.",
        fr: "C'est un plat assez épicé : si vous voulez, je peux demander au chef de le préparer moins relevé.",
        es: "Es un plato bastante picante: si quiere, puedo pedirle al chef que lo prepare más suave." }]
    ]},
    { id: "allergie", ambito: "sala", nome: "Allergie e intolleranze", icona: "⚠️", frasi: [
      ["Prima di ordinare, potrebbe dirmi se ha allergie o intolleranze alimentari?", {
        en: "Before you order, could you tell me if you have any food allergies or intolerances?",
        fr: "Avant de commander, pourriez-vous me dire si vous avez des allergies ou des intolérances alimentaires ?",
        es: "Antes de pedir, ¿podría decirme si tiene alguna alergia o intolerancia alimentaria?" }],
      ["Questo dolce contiene frutta a guscio, quindi purtroppo non è adatto a lei.", {
        en: "This dessert contains nuts, so unfortunately it isn't suitable for you.",
        fr: "Ce dessert contient des fruits à coque, il ne vous convient donc malheureusement pas.",
        es: "Este postre contiene frutos secos, así que lamentablemente no es adecuado para usted." }],
      ["Abbiamo anche una pasta senza glutine, che cuciniamo separatamente per evitare contaminazioni.", {
        en: "We also have gluten-free pasta, which we cook separately to avoid cross-contamination.",
        fr: "Nous avons aussi des pâtes sans gluten, que nous cuisons à part pour éviter toute contamination.",
        es: "También tenemos pasta sin gluten, que cocinamos por separado para evitar la contaminación cruzada." }],
      ["Verifico subito con la cucina e le confermo se il piatto può essere preparato senza latticini.", {
        en: "I'll check with the kitchen right away and let you know whether the dish can be prepared without dairy products.",
        fr: "Je vérifie tout de suite avec la cuisine et je vous confirme si le plat peut être préparé sans produits laitiers.",
        es: "Lo compruebo enseguida con la cocina y le confirmo si el plato se puede preparar sin lácteos." }],
      ["Nel menù trova gli allergeni indicati con un numero accanto a ogni piatto.", {
        en: "In the menu you'll find the allergens indicated by a number next to each dish.",
        fr: "Sur la carte, vous trouverez les allergènes indiqués par un numéro à côté de chaque plat.",
        es: "En la carta encontrará los alérgenos indicados con un número al lado de cada plato." }]
    ]},
    { id: "vino", ambito: "sala", nome: "Consigliare un vino", icona: "🍷", frasi: [
      ["Con la carne rossa le suggerirei un vino rosso corposo, per esempio un Montepulciano d'Abruzzo.", {
        en: "With red meat I would suggest a full-bodied red wine, for example a Montepulciano d'Abruzzo.",
        fr: "Avec la viande rouge, je vous suggérerais un vin rouge corsé, par exemple un Montepulciano d'Abruzzo.",
        es: "Con la carne roja le sugeriría un vino tinto con cuerpo, por ejemplo un Montepulciano d'Abruzzo." }],
      ["Se preferisce un vino bianco, questo è fresco e profumato, ideale con il pesce.", {
        en: "If you prefer a white wine, this one is fresh and fragrant, ideal with fish.",
        fr: "Si vous préférez un vin blanc, celui-ci est frais et parfumé, idéal avec le poisson.",
        es: "Si prefiere un vino blanco, este es fresco y aromático, ideal con el pescado." }],
      ["Possiamo servirlo anche al calice, così può assaggiarlo senza ordinare la bottiglia intera.", {
        en: "We can also serve it by the glass, so you can taste it without ordering the whole bottle.",
        fr: "Nous pouvons aussi le servir au verre, ainsi vous pouvez le goûter sans commander la bouteille entière.",
        es: "También podemos servirlo por copas, así puede probarlo sin pedir la botella entera." }],
      ["È un vino della nostra regione, prodotto da una piccola cantina a pochi chilometri da qui.", {
        en: "It's a wine from our region, produced by a small winery a few kilometres from here.",
        fr: "C'est un vin de notre région, produit par une petite cave à quelques kilomètres d'ici.",
        es: "Es un vino de nuestra región, elaborado por una pequeña bodega a pocos kilómetros de aquí." }],
      ["Desidera assaggiarlo prima che lo serva a tutti?", {
        en: "Would you like to taste it before I serve everyone?",
        fr: "Souhaitez-vous le goûter avant que je serve tout le monde ?",
        es: "¿Desea probarlo antes de que lo sirva a todos?" }]
    ]},
    { id: "reclamo", ambito: "sala", nome: "Gestire un reclamo", icona: "🙏", frasi: [
      ["Mi dispiace molto per l'attesa: oggi la sala è piena, ma il suo piatto arriverà tra pochi minuti.", {
        en: "I'm very sorry for the wait: the restaurant is full today, but your dish will arrive in a few minutes.",
        fr: "Je suis vraiment désolé pour l'attente : la salle est pleine aujourd'hui, mais votre plat arrivera dans quelques minutes.",
        es: "Siento mucho la espera: hoy el comedor está lleno, pero su plato llegará en pocos minutos." }],
      ["Ha ragione, la carne è troppo cotta: gliela faccio preparare di nuovo subito.", {
        en: "You're right, the meat is overcooked: I'll have it prepared again for you straight away.",
        fr: "Vous avez raison, la viande est trop cuite : je la fais préparer à nouveau tout de suite.",
        es: "Tiene razón, la carne está demasiado hecha: se la hago preparar de nuevo enseguida." }],
      ["Per scusarci, il dessert è offerto dalla casa.", {
        en: "To apologise, the dessert is on the house.",
        fr: "Pour nous excuser, le dessert est offert par la maison.",
        es: "Para disculparnos, el postre corre por cuenta de la casa." }],
      ["Grazie per avercelo detto: riferirò subito allo chef, così non succederà più.", {
        en: "Thank you for telling us: I'll inform the chef right away, so it won't happen again.",
        fr: "Merci de nous l'avoir signalé : je vais le dire tout de suite au chef, pour que cela ne se reproduise plus.",
        es: "Gracias por decírnoslo: se lo comunicaré enseguida al chef para que no vuelva a pasar." }],
      ["Capisco perfettamente il problema; mi permetta di proporle un'altra soluzione.", {
        en: "I completely understand the problem; allow me to offer you another solution.",
        fr: "Je comprends parfaitement le problème ; permettez-moi de vous proposer une autre solution.",
        es: "Entiendo perfectamente el problema; permítame proponerle otra solución." }]
    ]},
    { id: "ricetta", ambito: "cucina", nome: "Spiegare una ricetta", icona: "📖", frasi: [
      ["Prima si rosola la cipolla nell'olio, poi si aggiunge il riso e si tosta per un paio di minuti.", {
        en: "First you fry the onion gently in oil, then you add the rice and toast it for a couple of minutes.",
        fr: "D'abord, on fait revenir l'oignon dans l'huile, puis on ajoute le riz et on le fait nacrer pendant deux minutes.",
        es: "Primero se sofríe la cebolla en aceite, luego se añade el arroz y se tuesta un par de minutos." }],
      ["Si sfuma con il vino bianco e si aggiunge il brodo caldo un mestolo alla volta.", {
        en: "You deglaze with white wine and add the hot stock one ladle at a time.",
        fr: "On déglace au vin blanc et on ajoute le bouillon chaud louche par louche.",
        es: "Se desglasa con vino blanco y se añade el caldo caliente cucharón a cucharón." }],
      ["A fine cottura si manteca con burro e parmigiano, lontano dal fuoco.", {
        en: "At the end of cooking, you stir in butter and Parmesan, off the heat.",
        fr: "En fin de cuisson, on lie avec du beurre et du parmesan, hors du feu.",
        es: "Al final de la cocción se liga con mantequilla y parmesano, fuera del fuego." }],
      ["La pasta fresca va lasciata riposare almeno trenta minuti, coperta con la pellicola.", {
        en: "Fresh pasta dough should be left to rest for at least thirty minutes, covered with cling film.",
        fr: "La pâte fraîche doit reposer au moins trente minutes, recouverte de film alimentaire.",
        es: "La masa de pasta fresca debe reposar al menos treinta minutos, cubierta con film transparente." }],
      ["Per questa salsa servono pochi ingredienti, ma devono essere di ottima qualità.", {
        en: "This sauce needs only a few ingredients, but they must be of excellent quality.",
        fr: "Pour cette sauce, il faut peu d'ingrédients, mais ils doivent être d'excellente qualité.",
        es: "Para esta salsa hacen falta pocos ingredientes, pero tienen que ser de excelente calidad." }]
    ]},
    { id: "igiene", ambito: "cucina", nome: "Igiene e sicurezza", icona: "🧼", frasi: [
      ["Ci laviamo le mani ogni volta che passiamo dalla carne cruda alle verdure.", {
        en: "We wash our hands every time we move from raw meat to vegetables.",
        fr: "Nous nous lavons les mains chaque fois que nous passons de la viande crue aux légumes.",
        es: "Nos lavamos las manos cada vez que pasamos de la carne cruda a las verduras." }],
      ["I taglieri sono di colori diversi: il rosso per la carne, il blu per il pesce, il verde per le verdure.", {
        en: "The chopping boards are different colours: red for meat, blue for fish, green for vegetables.",
        fr: "Les planches à découper sont de couleurs différentes : rouge pour la viande, bleu pour le poisson, vert pour les légumes.",
        es: "Las tablas de cortar son de colores distintos: la roja para la carne, la azul para el pescado, la verde para las verduras." }],
      ["Ogni mattina controlliamo e registriamo la temperatura dei frigoriferi.", {
        en: "Every morning we check and record the temperature of the fridges.",
        fr: "Chaque matin, nous contrôlons et notons la température des réfrigérateurs.",
        es: "Cada mañana comprobamos y registramos la temperatura de las neveras." }],
      ["Gli alimenti aperti vanno coperti ed etichettati con la data di preparazione.", {
        en: "Opened food must be covered and labelled with the preparation date.",
        fr: "Les aliments entamés doivent être couverts et étiquetés avec la date de préparation.",
        es: "Los alimentos abiertos se deben tapar y etiquetar con la fecha de preparación." }],
      ["Se ti tagli, fermati subito, disinfetta la ferita e avvisa lo chef.", {
        en: "If you cut yourself, stop immediately, disinfect the wound and tell the chef.",
        fr: "Si tu te coupes, arrête-toi tout de suite, désinfecte la plaie et préviens le chef.",
        es: "Si te cortas, para enseguida, desinfecta la herida y avisa al chef." }]
    ]},
    { id: "dolce", ambito: "pasticceria", nome: "Presentare un dolce", icona: "🍰", frasi: [
      ["È una crostata di pasta frolla con crema pasticcera e frutti di bosco freschi.", {
        en: "It's a shortcrust pastry tart with custard and fresh berries.",
        fr: "C'est une tarte en pâte sablée avec de la crème pâtissière et des fruits rouges frais.",
        es: "Es una tarta de masa quebrada con crema pastelera y frutos rojos frescos." }],
      ["Il tiramisù è preparato ogni mattina con mascarpone fresco e caffè espresso.", {
        en: "The tiramisu is made every morning with fresh mascarpone and espresso coffee.",
        fr: "Le tiramisu est préparé chaque matin avec du mascarpone frais et du café expresso.",
        es: "El tiramisú se prepara cada mañana con mascarpone fresco y café exprés." }],
      ["Questo dolce è meno zuccherato del solito: lo abbiamo addolcito con il miele.", {
        en: "This dessert is less sweet than usual: we sweetened it with honey.",
        fr: "Ce dessert est moins sucré que d'habitude : nous l'avons adouci avec du miel.",
        es: "Este postre es menos dulce de lo habitual: lo hemos endulzado con miel." }],
      ["Le consiglio di gustarlo con un bicchierino di vino da dessert.", {
        en: "I recommend enjoying it with a small glass of dessert wine.",
        fr: "Je vous conseille de le déguster avec un petit verre de vin doux.",
        es: "Le recomiendo tomarlo con una copita de vino dulce." }],
      ["Le praline sono fatte a mano nel nostro laboratorio, con cioccolato fondente al settanta per cento.", {
        en: "The chocolates are handmade in our workshop, with seventy per cent dark chocolate.",
        fr: "Les bonbons de chocolat sont faits à la main dans notre atelier, avec du chocolat noir à soixante-dix pour cent.",
        es: "Los bombones están hechos a mano en nuestro obrador, con chocolate negro al setenta por ciento." }]
    ]},
    { id: "ordini", ambito: "pasticceria", nome: "Torte su ordinazione", icona: "🎂", frasi: [
      ["Per quante persone desidera la torta, e per quale giorno le serve?", {
        en: "How many people would you like the cake for, and what day do you need it?",
        fr: "Pour combien de personnes souhaitez-vous le gâteau, et pour quel jour en avez-vous besoin ?",
        es: "¿Para cuántas personas desea la tarta y para qué día la necesita?" }],
      ["Possiamo scrivere un messaggio sulla torta: mi dica pure il testo.", {
        en: "We can write a message on the cake: just tell me the text.",
        fr: "Nous pouvons écrire un message sur le gâteau : dites-moi le texte.",
        es: "Podemos escribir un mensaje en la tarta: dígame el texto." }],
      ["Per le torte personalizzate chiediamo un preavviso di almeno tre giorni.", {
        en: "For personalised cakes we ask for at least three days' notice.",
        fr: "Pour les gâteaux personnalisés, nous demandons un délai d'au moins trois jours.",
        es: "Para las tartas personalizadas pedimos un aviso de al menos tres días." }],
      ["Se uno degli invitati è intollerante al lattosio, possiamo preparare una versione senza lattosio.", {
        en: "If one of the guests is lactose intolerant, we can make a lactose-free version.",
        fr: "Si l'un des invités est intolérant au lactose, nous pouvons préparer une version sans lactose.",
        es: "Si uno de los invitados es intolerante a la lactosa, podemos preparar una versión sin lactosa." }],
      ["La torta va conservata in frigorifero e tolta mezz'ora prima di servirla.", {
        en: "The cake should be kept in the fridge and taken out half an hour before serving.",
        fr: "Le gâteau doit être conservé au réfrigérateur et sorti une demi-heure avant de le servir.",
        es: "La tarta debe conservarse en la nevera y sacarse media hora antes de servirla." }]
    ]},
    { id: "telefono", ambito: "accoglienza", nome: "Prenotazione al telefono", icona: "📞", frasi: [
      ["Hotel Belvedere, buongiorno, sono Marco: come posso aiutarla?", {
        en: "Good morning, Hotel Belvedere, Marco speaking: how can I help you?",
        fr: "Hôtel Belvedere, bonjour, Marco à l'appareil : comment puis-je vous aider ?",
        es: "Hotel Belvedere, buenos días, le atiende Marco: ¿en qué puedo ayudarle?" }],
      ["Per quali date desidera prenotare, e quante persone sarete?", {
        en: "Which dates would you like to book, and how many people will there be?",
        fr: "Pour quelles dates souhaitez-vous réserver, et combien serez-vous ?",
        es: "¿Para qué fechas desea reservar y cuántas personas serán?" }],
      ["Abbiamo ancora disponibile una camera doppia con vista sul giardino, a centoventi euro a notte, colazione inclusa.", {
        en: "We still have a double room with a garden view available, at one hundred and twenty euros per night, breakfast included.",
        fr: "Nous avons encore une chambre double avec vue sur le jardin, à cent vingt euros la nuit, petit-déjeuner compris.",
        es: "Todavía tenemos disponible una habitación doble con vistas al jardín, a ciento veinte euros por noche, desayuno incluido." }],
      ["Potrebbe lasciarmi un recapito? Le invieremo la conferma della prenotazione per e-mail.", {
        en: "Could you leave me a contact? We'll send you the booking confirmation by email.",
        fr: "Pourriez-vous me laisser vos coordonnées ? Nous vous enverrons la confirmation de réservation par e-mail.",
        es: "¿Podría dejarme un dato de contacto? Le enviaremos la confirmación de la reserva por correo electrónico." }],
      ["La cancellazione è gratuita fino a quarantotto ore prima dell'arrivo.", {
        en: "Cancellation is free of charge up to forty-eight hours before arrival.",
        fr: "L'annulation est gratuite jusqu'à quarante-huit heures avant l'arrivée.",
        es: "La cancelación es gratuita hasta cuarenta y ocho horas antes de la llegada." }]
    ]},
    { id: "territorio", ambito: "accoglienza", nome: "L'hotel e il territorio", icona: "🗺️", frasi: [
      ["La colazione viene servita nella sala al piano terra dalle sette alle dieci.", {
        en: "Breakfast is served in the breakfast room on the ground floor from seven to ten.",
        fr: "Le petit-déjeuner est servi dans la salle du rez-de-chaussée de sept heures à dix heures.",
        es: "El desayuno se sirve en el salón de la planta baja de siete a diez." }],
      ["Rieti è considerata il centro geografico d'Italia: in piazza San Rufo un monumento lo ricorda.", {
        en: "Rieti is considered the geographical centre of Italy: a monument in Piazza San Rufo marks the spot.",
        fr: "Rieti est considérée comme le centre géographique de l'Italie : un monument sur la place San Rufo le rappelle.",
        es: "Rieti se considera el centro geográfico de Italia: un monumento en la plaza de San Rufo lo recuerda." }],
      ["Nella Valle Santa ci sono quattro santuari legati a San Francesco, facilmente raggiungibili in auto.", {
        en: "In the Holy Valley there are four sanctuaries linked to Saint Francis, easy to reach by car.",
        fr: "Dans la Vallée Sainte, il y a quatre sanctuaires liés à saint François, faciles d'accès en voiture.",
        es: "En el Valle Santo hay cuatro santuarios vinculados a San Francisco, a los que se llega fácilmente en coche." }],
      ["Se le interessa, alla reception trova le mappe dei sentieri e gli orari degli autobus.", {
        en: "If you're interested, you'll find trail maps and bus timetables at reception.",
        fr: "Si cela vous intéresse, vous trouverez à la réception les cartes des sentiers et les horaires des bus.",
        es: "Si le interesa, en recepción encontrará los mapas de los senderos y los horarios de los autobuses." }],
      ["Il Terminillo, la montagna di Roma, è a mezz'ora da qui: d'inverno si può sciare.", {
        en: "Mount Terminillo, Rome's mountain, is half an hour from here: in winter you can go skiing.",
        fr: "Le Terminillo, la montagne de Rome, est à une demi-heure d'ici : en hiver, on peut y skier.",
        es: "El Terminillo, la montaña de Roma, está a media hora de aquí: en invierno se puede esquiar." }]
    ]},
    { id: "partenza", ambito: "accoglienza", nome: "Check-out e imprevisti", icona: "🧳", frasi: [
      ["Il check-out è entro le undici; se desidera, possiamo custodire i bagagli fino alla partenza.", {
        en: "Check-out is by eleven; if you wish, we can store your luggage until you leave.",
        fr: "La chambre doit être libérée avant onze heures ; si vous le souhaitez, nous pouvons garder vos bagages jusqu'à votre départ.",
        es: "El check-out es antes de las once; si lo desea, podemos guardarle el equipaje hasta su salida." }],
      ["Mi scuso per il rumore di stanotte: le posso offrire una camera più tranquilla al piano superiore.", {
        en: "I apologise for the noise last night: I can offer you a quieter room on the floor above.",
        fr: "Je m'excuse pour le bruit de cette nuit : je peux vous proposer une chambre plus calme à l'étage supérieur.",
        es: "Disculpe el ruido de anoche: le puedo ofrecer una habitación más tranquila en el piso de arriba." }],
      ["Mando subito qualcuno a controllare l'aria condizionata.", {
        en: "I'll send someone to check the air conditioning right away.",
        fr: "J'envoie tout de suite quelqu'un vérifier la climatisation.",
        es: "Mando enseguida a alguien a revisar el aire acondicionado." }],
      ["Ecco il conto: due notti, la cena di ieri e il minibar. Paga con carta o in contanti?", {
        en: "Here is your bill: two nights, yesterday's dinner and the minibar. Will you pay by card or in cash?",
        fr: "Voici votre note : deux nuits, le dîner d'hier et le minibar. Vous payez par carte ou en espèces ?",
        es: "Aquí tiene la factura: dos noches, la cena de ayer y el minibar. ¿Paga con tarjeta o en efectivo?" }],
      ["Speriamo che il soggiorno le sia piaciuto: se vuole, può lasciarci una recensione.", {
        en: "We hope you enjoyed your stay: if you like, you can leave us a review.",
        fr: "Nous espérons que votre séjour vous a plu : si vous le souhaitez, vous pouvez nous laisser un avis.",
        es: "Esperamos que haya disfrutado de su estancia: si quiere, puede dejarnos una reseña." }]
    ]},
    { id: "banco", ambito: "bar", nome: "Consigliare al bar", icona: "🍹", frasi: [
      ["Il nostro cocktail della casa è a base di gin, succo di pompelmo rosa e un po' di rosmarino.", {
        en: "Our house cocktail is made with gin, pink grapefruit juice and a little rosemary.",
        fr: "Notre cocktail maison est à base de gin, de jus de pamplemousse rose et d'un peu de romarin.",
        es: "Nuestro cóctel de la casa lleva ginebra, zumo de pomelo rosa y un poco de romero." }],
      ["Se non beve alcolici, posso prepararle un analcolico alla frutta altrettanto fresco.", {
        en: "If you don't drink alcohol, I can make you an equally refreshing fruit mocktail.",
        fr: "Si vous ne buvez pas d'alcool, je peux vous préparer un cocktail sans alcool aux fruits tout aussi rafraîchissant.",
        es: "Si no toma alcohol, puedo prepararle un cóctel sin alcohol de frutas igual de refrescante." }],
      ["In Italia il cappuccino si beve soprattutto a colazione, non dopo pranzo.", {
        en: "In Italy cappuccino is mostly drunk at breakfast, not after lunch.",
        fr: "En Italie, on boit le cappuccino surtout au petit-déjeuner, pas après le déjeuner.",
        es: "En Italia el capuchino se toma sobre todo en el desayuno, no después de comer." }],
      ["L'aperitivo è servito con qualche stuzzichino: olive, patatine e piccole bruschette.", {
        en: "The aperitif is served with a few snacks: olives, crisps and small bruschettas.",
        fr: "L'apéritif est servi avec quelques amuse-bouches : olives, chips et petites bruschettas.",
        es: "El aperitivo se sirve con algo para picar: aceitunas, patatas fritas y pequeñas bruschettas." }],
      ["Mi dispiace, non posso servire alcolici ai minori di diciotto anni: posso proporti qualcos'altro?", {
        en: "I'm sorry, I can't serve alcohol to anyone under eighteen: can I offer you something else?",
        fr: "Je suis désolé, je ne peux pas servir d'alcool aux moins de dix-huit ans : je peux te proposer autre chose ?",
        es: "Lo siento, no puedo servir alcohol a menores de dieciocho años: ¿te puedo ofrecer otra cosa?" }]
    ]}
  ],

  REGISTRO: [
    ["Cosa vuole?", "Che cosa desidera ordinare?", {
      en: ["What do you want?", "What would you like to order?"], fr: ["Vous voulez quoi ?", "Que désirez-vous commander ?"],
      es: ["¿Qué quiere?", "¿Qué desea pedir?"] }],
    ["Aspetti.", "Un attimo, per cortesia: arrivo subito.", {
      en: ["Wait.", "Just a moment, please: I'll be right with you."], fr: ["Attendez.", "Un instant, s'il vous plaît : j'arrive tout de suite."],
      es: ["Espere.", "Un momento, por favor: enseguida estoy con usted."] }],
    ["Non c'è più.", "Purtroppo è terminato, ma posso consigliarle un'alternativa.", {
      en: ["There's none left.", "I'm afraid it's sold out, but I can recommend an alternative."], fr: ["Il n'y en a plus.", "Malheureusement, il n'y en a plus, mais je peux vous conseiller autre chose."],
      es: ["No queda.", "Lamentablemente se ha terminado, pero puedo recomendarle una alternativa."] }],
    ["Vuole altro?", "Posso portarle qualcos'altro?", {
      en: ["Anything else?", "May I bring you anything else?"], fr: ["Autre chose ?", "Puis-je vous apporter autre chose ?"],
      es: ["¿Algo más?", "¿Le puedo traer algo más?"] }],
    ["Ecco il conto.", "Ecco il conto, con calma.", {
      en: ["Here's the bill.", "Here is your bill, whenever you're ready."], fr: ["Voilà l'addition.", "Voici l'addition, prenez votre temps."],
      es: ["Aquí está la cuenta.", "Aquí tiene la cuenta, sin prisa."] }],
    ["Non lo so.", "Mi informo subito e torno da lei.", {
      en: ["I don't know.", "Let me find out for you and I'll be right back."], fr: ["Je ne sais pas.", "Je me renseigne tout de suite et je reviens vers vous."],
      es: ["No lo sé.", "Me informo enseguida y vuelvo con usted."] }],
    ["È pieno.", "Purtroppo al momento siamo al completo: posso metterla in lista d'attesa?", {
      en: ["We're full.", "Unfortunately we're fully booked at the moment: may I put you on the waiting list?"], fr: ["C'est complet.", "Malheureusement, nous sommes complets pour le moment : puis-je vous inscrire sur la liste d'attente ?"],
      es: ["Está lleno.", "Lamentablemente en este momento estamos completos: ¿puedo apuntarle en la lista de espera?"] }],
    ["Ha sbagliato tavolo.", "Mi permetta di accompagnarla al suo tavolo.", {
      en: ["That's the wrong table.", "Allow me to show you to your table."], fr: ["Ce n'est pas votre table.", "Permettez-moi de vous accompagner à votre table."],
      es: ["Esa no es su mesa.", "Permítame acompañarle a su mesa."] }],
    ["Ripeta.", "Mi scusi, potrebbe ripetere, per favore?", {
      en: ["Say that again.", "I'm sorry, could you repeat that, please?"], fr: ["Répétez.", "Excusez-moi, pourriez-vous répéter, s'il vous plaît ?"],
      es: ["Repita.", "Perdone, ¿podría repetirlo, por favor?"] }],
    ["La camera non è pronta.", "La sua camera sarà pronta tra poco: nel frattempo può accomodarsi al bar.", {
      en: ["The room isn't ready.", "Your room will be ready shortly: in the meantime, please make yourself comfortable at the bar."], fr: ["La chambre n'est pas prête.", "Votre chambre sera prête dans quelques instants : en attendant, vous pouvez vous installer au bar."],
      es: ["La habitación no está lista.", "Su habitación estará lista en breve: mientras tanto, puede ponerse cómodo en el bar."] }],
    ["Non si può.", "Mi dispiace, non è possibile, ma posso proporle un'altra soluzione.", {
      en: ["You can't.", "I'm sorry, that isn't possible, but I can suggest another solution."], fr: ["On ne peut pas.", "Je suis désolé, ce n'est pas possible, mais je peux vous proposer une autre solution."],
      es: ["No se puede.", "Lo siento, no es posible, pero puedo proponerle otra solución."] }],
    ["Ciao, arrivederci.", "Grazie per la visita, è stato un piacere: arrivederci!", {
      en: ["Bye.", "Thank you for coming, it was a pleasure: goodbye!"], fr: ["Salut.", "Merci de votre visite, ce fut un plaisir : au revoir !"],
      es: ["Adiós.", "Gracias por su visita, ha sido un placer: ¡hasta pronto!"] }]
  ],

  ASCOLTI: [
    { id: "menu", ambito: "sala", titolo: "Il menu del giorno", icona: "🍽️", testi: {
      it: "Buonasera e benvenuti. Stasera lo chef propone un menu degustazione in quattro portate. Si comincia con una vellutata di zucca, poi ravioli ripieni di ricotta e spinaci. Come secondo c'è l'agnello al forno con patate al rosmarino, e per finire una panna cotta ai frutti di bosco. Il menu costa trentacinque euro, bevande escluse. Se avete allergie, ditemelo pure.",
      en: "Good evening and welcome. Tonight the chef is offering a four-course tasting menu. We start with a cream of pumpkin soup, then ravioli filled with ricotta and spinach. For the main course there is roast lamb with rosemary potatoes, and to finish, a panna cotta with berries. The menu costs thirty-five euros, drinks not included. If you have any allergies, please let me know.",
      fr: "Bonsoir et bienvenue. Ce soir, le chef propose un menu dégustation en quatre plats. On commence par un velouté de potiron, puis des raviolis farcis à la ricotta et aux épinards. Comme plat principal, il y a de l'agneau au four avec des pommes de terre au romarin, et pour finir une panna cotta aux fruits rouges. Le menu coûte trente-cinq euros, boissons non comprises. Si vous avez des allergies, n'hésitez pas à me le dire.",
      es: "Buenas noches y bienvenidos. Esta noche el chef propone un menú degustación de cuatro platos. Empezamos con una crema de calabaza, luego raviolis rellenos de ricota y espinacas. De segundo hay cordero al horno con patatas al romero, y para terminar una panna cotta con frutos rojos. El menú cuesta treinta y cinco euros, bebidas aparte. Si tienen alguna alergia, díganmelo, por favor." },
      domande: [
        ["Quante portate ha il menu?", ["Tre", "Quattro", "Cinque"], 1],
        ["Con che cosa sono ripieni i ravioli?", ["Ricotta e spinaci", "Carne e funghi", "Zucca e formaggio"], 0],
        ["Quanto costa il menu?", ["25 euro, bevande incluse", "35 euro, bevande incluse", "35 euro, bevande escluse"], 2],
        ["Che dolce si serve alla fine?", ["Tiramisù", "Panna cotta ai frutti di bosco", "Crostata di frutta"], 1]
      ]},
    { id: "chiamata", ambito: "accoglienza", titolo: "Una telefonata in hotel", icona: "📞", testi: {
      it: "Pronto, buongiorno. Vorrei prenotare una camera per il prossimo fine settimana, da venerdì a domenica. Siamo due adulti e un bambino di sei anni. Avete una camera tripla? Ah, perfetto. Mi può dire se c'è il parcheggio? E a che ora si può fare il check-in? Arriveremo in macchina verso le nove di sera. Grazie, allora confermo: mi chiamo Laura Bianchi.",
      en: "Hello, good morning. I'd like to book a room for next weekend, from Friday to Sunday. We are two adults and a six-year-old child. Do you have a triple room? Oh, perfect. Can you tell me if there is parking? And what time can we check in? We'll arrive by car at around nine in the evening. Thank you, so I'll confirm: my name is Laura Bianchi.",
      fr: "Allô, bonjour. Je voudrais réserver une chambre pour le week-end prochain, du vendredi au dimanche. Nous sommes deux adultes et un enfant de six ans. Vous avez une chambre triple ? Ah, parfait. Pouvez-vous me dire s'il y a un parking ? Et à partir de quelle heure peut-on arriver ? Nous arriverons en voiture vers neuf heures du soir. Merci, alors je confirme : je m'appelle Laura Bianchi.",
      es: "Hola, buenos días. Quería reservar una habitación para el próximo fin de semana, de viernes a domingo. Somos dos adultos y un niño de seis años. ¿Tienen una habitación triple? Ah, perfecto. ¿Me puede decir si hay aparcamiento? ¿Y a qué hora se puede hacer el check-in? Llegaremos en coche hacia las nueve de la noche. Gracias, entonces confirmo: me llamo Laura Bianchi." },
      domande: [
        ["Per quante notti vuole prenotare la signora?", ["Una", "Due", "Tre"], 1],
        ["Quante persone sono?", ["Due adulti e un bambino", "Due adulti", "Tre adulti"], 0],
        ["Come arriveranno?", ["In treno", "In aereo", "In macchina"], 2],
        ["Che cosa chiede la signora?", ["Se c'è la piscina", "Se c'è il parcheggio", "Se gli animali sono ammessi"], 1]
      ]},
    { id: "torta", ambito: "pasticceria", titolo: "La torta della casa", icona: "🎂", testi: {
      it: "Questa è la nostra torta più richiesta. La base è un pan di Spagna al cacao, bagnato con uno sciroppo leggero all'arancia. All'interno c'è una crema al mascarpone e, in superficie, una glassa di cioccolato fondente. La prepariamo con farina di riso invece che di frumento, quindi è adatta anche a chi è celiaco. Si conserva in frigorifero per tre giorni.",
      en: "This is our most popular cake. The base is a cocoa sponge, soaked in a light orange syrup. Inside there is a mascarpone cream and, on top, a dark chocolate glaze. We make it with rice flour instead of wheat flour, so it is also suitable for people with coeliac disease. It keeps in the fridge for three days.",
      fr: "Voici notre gâteau le plus demandé. La base est une génoise au cacao, imbibée d'un sirop léger à l'orange. À l'intérieur, il y a une crème au mascarpone et, sur le dessus, un glaçage au chocolat noir. Nous le préparons avec de la farine de riz au lieu de la farine de blé, il convient donc aussi aux personnes cœliaques. Il se conserve trois jours au réfrigérateur.",
      es: "Esta es nuestra tarta más pedida. La base es un bizcocho de cacao, empapado en un almíbar ligero de naranja. Dentro lleva una crema de mascarpone y, por encima, un glaseado de chocolate negro. La preparamos con harina de arroz en lugar de harina de trigo, así que también es apta para celíacos. Se conserva en la nevera tres días." },
      domande: [
        ["Con che cosa è bagnato il pan di Spagna?", ["Sciroppo all'arancia", "Caffè", "Liquore al limone"], 0],
        ["Perché è adatta ai celiaci?", ["Non contiene zucchero", "È fatta con farina di riso", "Non contiene latte"], 1],
        ["Che cosa c'è in superficie?", ["Panna montata", "Zucchero a velo", "Una glassa di cioccolato fondente"], 2],
        ["Quanto si conserva in frigorifero?", ["Un giorno", "Tre giorni", "Una settimana"], 1]
      ]},
    { id: "brigata", ambito: "cucina", titolo: "Prima del servizio", icona: "👨‍🍳", testi: {
      it: "Ragazzi, ascoltate. Stasera abbiamo sessanta coperti e un gruppo di venti persone alle otto e mezza. Giulia, tu prepari le verdure e i fondi. Luca, controlla le temperature dei frigoriferi e scrivile sulla scheda. Il pesce è arrivato stamattina: va pulito e messo subito in cella. Alle sette facciamo l'assaggio di tutte le salse. Domande?",
      en: "Listen up, everyone. Tonight we have sixty covers and a group of twenty people at half past eight. Giulia, you prepare the vegetables and the stocks. Luca, check the fridge temperatures and write them on the sheet. The fish arrived this morning: it has to be cleaned and put in the cold room straight away. At seven we'll taste all the sauces. Any questions?",
      fr: "Écoutez, tout le monde. Ce soir, nous avons soixante couverts et un groupe de vingt personnes à huit heures et demie. Giulia, tu prépares les légumes et les fonds. Luca, contrôle les températures des réfrigérateurs et note-les sur la fiche. Le poisson est arrivé ce matin : il faut le nettoyer et le mettre tout de suite en chambre froide. À sept heures, on goûte toutes les sauces. Des questions ?",
      es: "Chicos, escuchad. Esta noche tenemos sesenta cubiertos y un grupo de veinte personas a las ocho y media. Giulia, tú preparas las verduras y los fondos. Luca, controla las temperaturas de las neveras y apúntalas en la hoja. El pescado ha llegado esta mañana: hay que limpiarlo y meterlo enseguida en la cámara. A las siete probamos todas las salsas. ¿Preguntas?" },
      domande: [
        ["Quanti coperti ci sono stasera?", ["Venti", "Sessanta", "Ottanta"], 1],
        ["Che cosa deve fare Luca?", ["Pulire il pesce", "Preparare le verdure", "Controllare e scrivere le temperature"], 2],
        ["A che ora arriva il gruppo?", ["Alle otto e mezza", "Alle sette", "Alle nove"], 0],
        ["A che ora si assaggiano le salse?", ["Alle sei", "Alle sette", "Alle otto e mezza"], 1]
      ]},
    { id: "aperitivo", ambito: "bar", titolo: "L'aperitivo", icona: "🍹", testi: {
      it: "Benvenuti! Dalle sei alle otto c'è l'aperitivo: con ogni bevanda vi portiamo un tagliere di salumi e formaggi locali. Vi consiglio lo spritz della casa oppure, se non bevete alcolici, il nostro analcolico al melograno e zenzero. Il tavolo in terrazza è libero, se preferite stare all'aperto. Volete anche dell'acqua?",
      en: "Welcome! From six to eight it's aperitivo time: with every drink we bring you a board of local cured meats and cheeses. I recommend the house spritz or, if you don't drink alcohol, our pomegranate and ginger mocktail. The table on the terrace is free, if you'd rather sit outside. Would you like some water as well?",
      fr: "Bienvenue ! De six à huit heures, c'est l'heure de l'apéritif : avec chaque boisson, nous vous apportons une planche de charcuterie et de fromages locaux. Je vous conseille le spritz maison ou, si vous ne buvez pas d'alcool, notre cocktail sans alcool à la grenade et au gingembre. La table en terrasse est libre, si vous préférez être dehors. Vous voulez aussi de l'eau ?",
      es: "¡Bienvenidos! De seis a ocho es la hora del aperitivo: con cada bebida les traemos una tabla de embutidos y quesos locales. Les recomiendo el spritz de la casa o, si no toman alcohol, nuestro cóctel sin alcohol de granada y jengibre. La mesa de la terraza está libre, si prefieren estar al aire libre. ¿Quieren también agua?" },
      domande: [
        ["Fino a che ora c'è l'aperitivo?", ["Alle sette", "Alle otto", "Alle nove"], 1],
        ["Che cosa portano con ogni bevanda?", ["Patatine e olive", "Piccole pizze", "Un tagliere di salumi e formaggi"], 2],
        ["Com'è l'analcolico consigliato?", ["Melograno e zenzero", "Arancia e menta", "Limone e basilico"], 0],
        ["Dove si trova il tavolo libero?", ["Vicino al bancone", "In terrazza", "In sala"], 1]
      ]}
  ],

  EMAIL: [
    { id: "conferma", titolo: "Rispondere a una richiesta di prenotazione", icona: "📩", par: {
      it: ["Gentile signora Weber,", "La ringraziamo per averci contattato e per l'interesse verso il nostro hotel.", "Siamo lieti di confermarle la disponibilità di una camera doppia dal 12 al 15 maggio, al prezzo di 110 euro a notte, colazione inclusa.", "Per confermare la prenotazione, la invitiamo a completarla entro tre giorni tramite il link qui sotto.", "Restiamo a disposizione per qualsiasi informazione.", "Cordiali saluti,\nMarco Rossi – Reception"],
      en: ["Dear Mrs Weber,", "Thank you for contacting us and for your interest in our hotel.", "We are pleased to confirm that a double room is available from 12 to 15 May, at a price of 110 euros per night, breakfast included.", "To confirm your booking, please complete it within three days using the link below.", "Please do not hesitate to contact us if you need any further information.", "Kind regards,\nMarco Rossi – Reception"],
      fr: ["Chère Madame Weber,", "Nous vous remercions de nous avoir contactés et de l'intérêt que vous portez à notre hôtel.", "Nous avons le plaisir de vous confirmer la disponibilité d'une chambre double du 12 au 15 mai, au prix de 110 euros la nuit, petit-déjeuner compris.", "Pour confirmer votre réservation, nous vous invitons à la finaliser dans un délai de trois jours grâce au lien ci-dessous.", "Nous restons à votre disposition pour tout renseignement complémentaire.", "Cordialement,\nMarco Rossi – Réception"],
      es: ["Estimada señora Weber:", "Le agradecemos que se haya puesto en contacto con nosotros y su interés por nuestro hotel.", "Nos complace confirmarle la disponibilidad de una habitación doble del 12 al 15 de mayo, al precio de 110 euros por noche, desayuno incluido.", "Para confirmar la reserva, le rogamos que la complete en un plazo de tres días a través del enlace que encontrará más abajo.", "Quedamos a su disposición para cualquier información.", "Atentamente,\nMarco Rossi – Recepción"] }},
    { id: "scuse", titolo: "Rispondere a un reclamo", icona: "✉️", par: {
      it: ["Gentile signor Martin,", "La ringraziamo per averci segnalato i problemi riscontrati durante il suo soggiorno.", "Ci scusiamo sinceramente per il guasto al riscaldamento e per il disagio che le abbiamo causato.", "Abbiamo già fatto controllare l'impianto e preso provvedimenti perché non accada più.", "Come segno di scuse, saremmo lieti di offrirle una cena per due persone nel nostro ristorante durante il suo prossimo soggiorno.", "Con i più cordiali saluti,\nAnna Verdi – Direzione"],
      en: ["Dear Mr Martin,", "Thank you for letting us know about the problems you experienced during your stay.", "We sincerely apologise for the faulty heating and for the inconvenience this caused you.", "We have already had the system checked and have taken steps to make sure it does not happen again.", "As a token of our apology, we would be delighted to offer you dinner for two in our restaurant during your next stay.", "With our warmest regards,\nAnna Verdi – Management"],
      fr: ["Cher Monsieur Martin,", "Nous vous remercions de nous avoir signalé les problèmes rencontrés pendant votre séjour.", "Nous vous présentons nos sincères excuses pour la panne de chauffage et pour la gêne occasionnée.", "Nous avons déjà fait contrôler l'installation et pris les mesures nécessaires pour que cela ne se reproduise plus.", "Pour nous faire pardonner, nous serions heureux de vous offrir un dîner pour deux personnes dans notre restaurant lors de votre prochain séjour.", "Bien cordialement,\nAnna Verdi – Direction"],
      es: ["Estimado señor Martin:", "Le agradecemos que nos haya comunicado los problemas que tuvo durante su estancia.", "Le pedimos sinceras disculpas por la avería de la calefacción y por las molestias que le hemos causado.", "Ya hemos hecho revisar la instalación y hemos tomado medidas para que no vuelva a ocurrir.", "Como muestra de disculpa, nos complacería invitarle a una cena para dos personas en nuestro restaurante durante su próxima estancia.", "Reciba un cordial saludo,\nAnna Verdi – Dirección"] }}
  ]
};
