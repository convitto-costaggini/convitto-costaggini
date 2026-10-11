/* ════════════════════════════════════════════════════════
   DIALOGHI — una scena per ambito, in 4 lingue.
   staff = il ruolo che lo studente interpreta ("Fai tu…"),
   righe: ["S" (staff) | "A" (altro), italiano, {en, fr, es, de}]
   BOZZA da far verificare ai docenti.
   ════════════════════════════════════════════════════════ */
window.DIALOGHI = [
  {
    id: "cena", ambito: "sala", titolo: "Una cena al ristorante", sot: "Dall'arrivo al conto, con una richiesta su un'allergia.",
    staff: {"nome":"Cameriere","icona":"🤵"}, altro: {"nome":"Cliente","icona":"🧑"},
    righe: [
      ["S","Buonasera, benvenuti! Avete prenotato?",{"en":"Good evening, welcome! Do you have a reservation?","fr":"Bonsoir, bienvenue ! Vous avez réservé ?","es":"Buenas noches, ¡bienvenidos! ¿Tienen reserva?","de":"Guten Abend, herzlich willkommen! Haben Sie reserviert?"}],
      ["A","Sì, a nome Rossi, per due persone.",{"en":"Yes, under the name Rossi, for two people.","fr":"Oui, au nom de Rossi, pour deux personnes.","es":"Sí, a nombre de Rossi, para dos personas.","de":"Ja, auf den Namen Rossi, für zwei Personen."}],
      ["S","Prego, da questa parte. Ecco il menù.",{"en":"This way, please. Here is the menu.","fr":"Par ici, s'il vous plaît. Voici la carte.","es":"Por aquí, por favor. Aquí tienen la carta.","de":"Hier entlang, bitte. Hier ist die Speisekarte."}],
      ["A","Grazie.",{"en":"Thank you.","fr":"Merci.","es":"Gracias.","de":"Danke."}],
      ["S","Desiderate qualcosa da bere?",{"en":"Would you like something to drink?","fr":"Désirez-vous quelque chose à boire ?","es":"¿Desean algo de beber?","de":"Möchten Sie etwas trinken?"}],
      ["A","Una bottiglia di acqua naturale e due calici di vino rosso, per favore.",{"en":"A bottle of still water and two glasses of red wine, please.","fr":"Une bouteille d'eau plate et deux verres de vin rouge, s'il vous plaît.","es":"Una botella de agua sin gas y dos copas de vino tinto, por favor.","de":"Eine Flasche stilles Wasser und zwei Gläser Rotwein, bitte."}],
      ["S","Siete pronti per ordinare?",{"en":"Are you ready to order?","fr":"Vous avez choisi ?","es":"¿Están listos para pedir?","de":"Möchten Sie bestellen?"}],
      ["A","Sì. Sono allergico alla frutta a guscio: cosa mi consiglia?",{"en":"Yes. I'm allergic to nuts: what would you recommend?","fr":"Oui. Je suis allergique aux fruits à coque : que me conseillez-vous ?","es":"Sí. Soy alérgico a los frutos secos: ¿qué me recomienda?","de":"Ja. Ich bin allergisch gegen Nüsse: Was empfehlen Sie mir?"}],
      ["S","Verifico subito con la cucina. Le consiglio il pollo al forno con patate: non contiene frutta a guscio.",{"en":"I'll check with the kitchen right away. I recommend the roast chicken with potatoes: it doesn't contain nuts.","fr":"Je vérifie tout de suite avec la cuisine. Je vous conseille le poulet rôti avec des pommes de terre : il ne contient pas de fruits à coque.","es":"Lo consulto ahora mismo con la cocina. Le recomiendo el pollo asado con patatas: no lleva frutos secos.","de":"Ich frage sofort in der Küche nach. Ich empfehle Ihnen das Brathähnchen mit Kartoffeln: Es enthält keine Nüsse."}],
      ["A","Perfetto, grazie.",{"en":"Perfect, thank you.","fr":"Parfait, merci.","es":"Perfecto, gracias.","de":"Perfekt, danke."}],
      ["S","È stato tutto di vostro gradimento?",{"en":"Did you enjoy your meal?","fr":"Le repas vous a plu ?","es":"¿Les ha gustado la comida?","de":"Hat es Ihnen geschmeckt?"}],
      ["A","Sì, tutto ottimo. Il conto, per favore.",{"en":"Yes, everything was excellent. The bill, please.","fr":"Oui, tout était excellent. L'addition, s'il vous plaît.","es":"Sí, todo estaba buenísimo. La cuenta, por favor.","de":"Ja, alles war ausgezeichnet. Die Rechnung, bitte."}],
      ["S","Ecco il conto. In contanti o con carta?",{"en":"Here is your bill. Cash or card?","fr":"Voici l'addition. En espèces ou par carte ?","es":"Aquí tiene la cuenta. ¿En efectivo o con tarjeta?","de":"Hier ist Ihre Rechnung. Bar oder mit Karte?"}],
      ["A","Con carta.",{"en":"By card, please.","fr":"Par carte.","es":"Con tarjeta.","de":"Mit Karte."}],
      ["S","Grazie mille, buona serata! Tornate a trovarci!",{"en":"Thank you very much, have a nice evening! Come back soon!","fr":"Merci beaucoup, bonne soirée ! Revenez nous voir !","es":"Muchas gracias, ¡que pasen una buena noche! ¡Vuelvan pronto!","de":"Vielen Dank, einen schönen Abend noch! Kommen Sie bald wieder!"}]
    ]
  },
  {
    id: "brigata", ambito: "cucina", titolo: "In brigata", sot: "Prima del servizio: lo chef dà gli ordini, il commis esegue.",
    staff: {"nome":"Commis","icona":"🧑‍🍳"}, altro: {"nome":"Chef","icona":"👨‍🍳"},
    righe: [
      ["A","Buongiorno a tutti! Stasera abbiamo sessanta coperti.",{"en":"Good morning, everyone! We have sixty covers tonight.","fr":"Bonjour à tous ! Ce soir, nous avons soixante couverts.","es":"¡Buenos días a todos! Esta noche tenemos sesenta cubiertos.","de":"Guten Morgen zusammen! Heute Abend haben wir sechzig Gedecke."}],
      ["S","Sì, chef! Da dove comincio?",{"en":"Yes, chef! Where shall I start?","fr":"Oui, chef ! Je commence par quoi ?","es":"¡Sí, chef! ¿Por dónde empiezo?","de":"Ja, Chef! Womit soll ich anfangen?"}],
      ["A","Pela le patate e taglia le cipolle a cubetti.",{"en":"Peel the potatoes and dice the onions.","fr":"Épluche les pommes de terre et coupe les oignons en dés.","es":"Pela las patatas y corta las cebollas en dados.","de":"Schäl die Kartoffeln und schneide die Zwiebeln in Würfel."}],
      ["S","Subito. Dove trovo il pelapatate?",{"en":"Right away. Where can I find the peeler?","fr":"Tout de suite. Où est l'éplucheur ?","es":"Enseguida. ¿Dónde está el pelador?","de":"Sofort. Wo finde ich den Sparschäler?"}],
      ["A","Nel secondo cassetto, vicino al tagliere.",{"en":"In the second drawer, next to the chopping board.","fr":"Dans le deuxième tiroir, à côté de la planche à découper.","es":"En el segundo cajón, al lado de la tabla de cortar.","de":"In der zweiten Schublade, neben dem Schneidebrett."}],
      ["S","Chef, ho finito. Cosa faccio adesso?",{"en":"Chef, I've finished. What shall I do now?","fr":"Chef, j'ai fini. Qu'est-ce que je fais maintenant ?","es":"Chef, he terminado. ¿Qué hago ahora?","de":"Chef, ich bin fertig. Was soll ich jetzt machen?"}],
      ["A","Rosola le cipolle nell'olio, a fuoco basso.",{"en":"Brown the onions in oil over a low heat.","fr":"Fais revenir les oignons dans l'huile, à feu doux.","es":"Dora las cebollas en aceite, a fuego lento.","de":"Brat die Zwiebeln in Öl bei schwacher Hitze an."}],
      ["S","Attenzione, dietro di lei! Pentola calda!",{"en":"Behind you! Hot pot coming through!","fr":"Attention, derrière vous ! Casserole chaude !","es":"¡Cuidado, detrás de usted! ¡Olla caliente!","de":"Achtung, hinter Ihnen! Heißer Topf!"}],
      ["A","Bravo. E ricordati di lavarti le mani prima di toccare il pesce.",{"en":"Well done. And remember to wash your hands before handling the fish.","fr":"Bravo. Et n'oublie pas de te laver les mains avant de toucher le poisson.","es":"Muy bien. Y recuerda lavarte las manos antes de tocar el pescado.","de":"Gut gemacht. Und denk daran, dir die Hände zu waschen, bevor du den Fisch anfasst."}],
      ["S","Sì, chef!",{"en":"Yes, chef!","fr":"Oui, chef !","es":"¡Sí, chef!","de":"Ja, Chef!"}]
    ]
  },
  {
    id: "torta", ambito: "pasticceria", titolo: "Una torta su ordinazione", sot: "Al banco della pasticceria: una torta di compleanno senza glutine.",
    staff: {"nome":"Pasticciere","icona":"🧑‍🍳"}, altro: {"nome":"Cliente","icona":"🧑"},
    righe: [
      ["S","Buongiorno! Desidera?",{"en":"Good morning! What can I get you?","fr":"Bonjour ! Vous désirez ?","es":"¡Buenos días! ¿Qué desea?","de":"Guten Morgen! Was darf es sein?"}],
      ["A","Vorrei ordinare una torta di compleanno.",{"en":"I'd like to order a birthday cake.","fr":"Je voudrais commander un gâteau d'anniversaire.","es":"Quería encargar una tarta de cumpleaños.","de":"Ich möchte eine Geburtstagstorte bestellen."}],
      ["S","Certo. Per quante persone?",{"en":"Of course. How many people is it for?","fr":"Bien sûr. Pour combien de personnes ?","es":"Claro. ¿Para cuántas personas?","de":"Gern. Für wie viele Personen?"}],
      ["A","Per dodici persone. Mia figlia non può mangiare il glutine.",{"en":"For twelve people. My daughter can't eat gluten.","fr":"Pour douze personnes. Ma fille ne peut pas manger de gluten.","es":"Para doce personas. Mi hija no puede comer gluten.","de":"Für zwölf Personen. Meine Tochter darf kein Gluten essen."}],
      ["S","Nessun problema: la prepariamo senza glutine, con crema e frutti di bosco.",{"en":"No problem: we'll make it gluten-free, with cream and berries.","fr":"Pas de problème : nous le préparons sans gluten, avec de la crème et des fruits rouges.","es":"No hay problema: la preparamos sin gluten, con crema y frutos rojos.","de":"Kein Problem: Wir machen sie glutenfrei, mit Creme und Beeren."}],
      ["A","Perfetto! Si può aggiungere una scritta?",{"en":"Perfect! Can you add a message?","fr":"Parfait ! On peut ajouter une inscription ?","es":"¡Perfecto! ¿Se puede poner un mensaje?","de":"Perfekt! Kann man eine Aufschrift hinzufügen?"}],
      ["S","Certo. Cosa scriviamo?",{"en":"Of course. What shall we write?","fr":"Bien sûr. Qu'est-ce qu'on écrit ?","es":"Claro. ¿Qué escribimos?","de":"Natürlich. Was sollen wir schreiben?"}],
      ["A","«Buon compleanno, Giulia!» Per quando sarà pronta?",{"en":"\"Happy birthday, Giulia!\" When will it be ready?","fr":"« Joyeux anniversaire, Giulia ! » Il sera prêt quand ?","es":"«¡Feliz cumpleaños, Giulia!» ¿Para cuándo estará lista?","de":"„Alles Gute zum Geburtstag, Giulia!“ Wann ist sie fertig?"}],
      ["S","Sabato mattina. Va conservata in frigorifero e consumata entro due giorni.",{"en":"On Saturday morning. Keep it in the fridge and eat it within two days.","fr":"Samedi matin. Il se conserve au réfrigérateur et se consomme dans les deux jours.","es":"El sábado por la mañana. Hay que conservarla en la nevera y consumirla en dos días.","de":"Am Samstagmorgen. Sie muss im Kühlschrank aufbewahrt und innerhalb von zwei Tagen gegessen werden."}],
      ["A","Grazie mille, a sabato!",{"en":"Thank you so much, see you on Saturday!","fr":"Merci beaucoup, à samedi !","es":"¡Muchas gracias, hasta el sábado!","de":"Vielen Dank, bis Samstag!"}]
    ]
  },
  {
    id: "checkin", ambito: "accoglienza", titolo: "Il check-in", sot: "Al ricevimento dell'hotel arriva un'ospite tedesca.",
    staff: {"nome":"Receptionist","icona":"🧑‍💼"}, altro: {"nome":"Ospite","icona":"🧳"},
    righe: [
      ["S","Buonasera e benvenuta! Ha una prenotazione?",{"en":"Good evening and welcome! Do you have a booking?","fr":"Bonsoir et bienvenue ! Vous avez une réservation ?","es":"¡Buenas tardes y bienvenida! ¿Tiene una reserva?","de":"Guten Abend und herzlich willkommen! Haben Sie eine Reservierung?"}],
      ["A","Sì, a nome Müller, per tre notti.",{"en":"Yes, under the name Müller, for three nights.","fr":"Oui, au nom de Müller, pour trois nuits.","es":"Sí, a nombre de Müller, para tres noches.","de":"Ja, auf den Namen Müller, für drei Nächte."}],
      ["S","Perfetto. Posso vedere un documento, per favore?",{"en":"Perfect. May I see your passport or ID, please?","fr":"Parfait. Puis-je voir une pièce d'identité, s'il vous plaît ?","es":"Perfecto. ¿Me permite un documento de identidad, por favor?","de":"Perfekt. Darf ich bitte Ihren Ausweis sehen?"}],
      ["A","Ecco qui.",{"en":"Here you are.","fr":"Voilà.","es":"Aquí tiene.","de":"Bitte schön."}],
      ["S","Grazie. Ha una camera doppia al secondo piano, con vista sulle montagne.",{"en":"Thank you. You have a double room on the second floor, with a mountain view.","fr":"Merci. Vous avez une chambre double au deuxième étage, avec vue sur les montagnes.","es":"Gracias. Tiene una habitación doble en la segunda planta, con vistas a la montaña.","de":"Danke. Sie haben ein Doppelzimmer im zweiten Stock mit Bergblick."}],
      ["A","Che bello! A che ora è la colazione?",{"en":"Lovely! What time is breakfast?","fr":"Super ! Le petit-déjeuner est à quelle heure ?","es":"¡Qué bien! ¿A qué hora es el desayuno?","de":"Wie schön! Wann gibt es Frühstück?"}],
      ["S","Dalle sette alle dieci, al piano terra. Il Wi-Fi è gratuito.",{"en":"From seven to ten, on the ground floor. The Wi-Fi is free.","fr":"De sept heures à dix heures, au rez-de-chaussée. Le wifi est gratuit.","es":"De siete a diez, en la planta baja. El wifi es gratuito.","de":"Von sieben bis zehn Uhr im Erdgeschoss. Das WLAN ist kostenlos."}],
      ["A","Mi può consigliare qualcosa da visitare?",{"en":"Can you recommend something to visit?","fr":"Vous pouvez me conseiller quelque chose à visiter ?","es":"¿Me puede recomendar algo para visitar?","de":"Können Sie mir etwas zum Besichtigen empfehlen?"}],
      ["S","Le consiglio i santuari francescani della Valle Santa. Ecco una cartina.",{"en":"I recommend the Franciscan sanctuaries of the Holy Valley. Here's a map.","fr":"Je vous conseille les sanctuaires franciscains de la Vallée Sainte. Voici un plan.","es":"Le recomiendo los santuarios franciscanos del Valle Santo. Aquí tiene un mapa.","de":"Ich empfehle Ihnen die Franziskaner-Heiligtümer im Heiligen Tal. Hier ist eine Karte."}],
      ["A","Grazie, è molto gentile.",{"en":"Thank you, that's very kind.","fr":"Merci, c'est très gentil.","es":"Gracias, es muy amable.","de":"Danke, sehr freundlich."}],
      ["S","Ecco la sua chiave. L'ascensore è a destra. Buon soggiorno!",{"en":"Here is your key. The lift is on the right. Enjoy your stay!","fr":"Voici votre clé. L'ascenseur est à droite. Bon séjour !","es":"Aquí tiene su llave. El ascensor está a la derecha. ¡Feliz estancia!","de":"Hier ist Ihr Schlüssel. Der Aufzug ist rechts. Einen schönen Aufenthalt!"}]
    ]
  },
  {
    id: "banco", ambito: "bar", titolo: "Colazione al bar", sot: "Al banco: cappuccino, cornetto e un latte vegetale.",
    staff: {"nome":"Barista","icona":"🧑‍🍳"}, altro: {"nome":"Cliente","icona":"🧑"},
    righe: [
      ["S","Buongiorno! Cosa le preparo?",{"en":"Good morning! What can I get you?","fr":"Bonjour ! Qu'est-ce que je vous sers ?","es":"¡Buenos días! ¿Qué le pongo?","de":"Guten Morgen! Was darf ich Ihnen bringen?"}],
      ["A","Un cappuccino e un cornetto, per favore.",{"en":"A cappuccino and a croissant, please.","fr":"Un cappuccino et un croissant, s'il vous plaît.","es":"Un capuchino y un cruasán, por favor.","de":"Einen Cappuccino und ein Croissant, bitte."}],
      ["S","Al banco o al tavolo?",{"en":"At the bar or at a table?","fr":"Au comptoir ou en salle ?","es":"¿En la barra o en mesa?","de":"Am Tresen oder am Tisch?"}],
      ["A","Al banco. Il cornetto è alla crema?",{"en":"At the bar. Is the croissant filled with custard?","fr":"Au comptoir. Le croissant est à la crème ?","es":"En la barra. ¿El cruasán es de crema?","de":"Am Tresen. Ist das Croissant mit Vanillecreme gefüllt?"}],
      ["S","Sì, alla crema. Glielo scaldo?",{"en":"Yes, with custard. Shall I warm it up for you?","fr":"Oui, à la crème. Je vous le réchauffe ?","es":"Sí, de crema. ¿Se lo caliento?","de":"Ja, mit Vanillecreme. Soll ich es aufwärmen?"}],
      ["A","Sì, grazie. Avete il latte di soia?",{"en":"Yes, thanks. Do you have soy milk?","fr":"Oui, merci. Vous avez du lait de soja ?","es":"Sí, gracias. ¿Tienen leche de soja?","de":"Ja, danke. Haben Sie Sojamilch?"}],
      ["S","Certo. Ecco a lei: attenzione, scotta.",{"en":"Of course. Here you are: careful, it's hot.","fr":"Bien sûr. Voilà : attention, c'est chaud.","es":"Claro. Aquí tiene: cuidado, que quema.","de":"Natürlich. Bitte schön: Vorsicht, heiß!"}],
      ["A","Quanto pago?",{"en":"How much is it?","fr":"Je vous dois combien ?","es":"¿Cuánto es?","de":"Was macht das?"}],
      ["S","Sono tre euro e venti. Si paga alla cassa.",{"en":"That's three twenty. Please pay at the till.","fr":"Ça fait trois euros vingt. On paie à la caisse.","es":"Son tres euros con veinte. Se paga en caja.","de":"Das macht drei Euro zwanzig. Bitte an der Kasse zahlen."}],
      ["A","Grazie!",{"en":"Thanks!","fr":"Merci !","es":"¡Gracias!","de":"Danke!"}],
      ["S","Grazie a lei, buona giornata!",{"en":"Thank you, have a nice day!","fr":"Merci à vous, bonne journée !","es":"Gracias a usted, ¡que tenga un buen día!","de":"Danke Ihnen, einen schönen Tag noch!"}]
    ]
  }
];
