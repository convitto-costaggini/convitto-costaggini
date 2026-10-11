/* ════════════════════════════════════════════════════════
   PAROLE DI SALA — le frasi del servizio in 4 lingue
   Fonte unica: la usano Parole di sala, Esercizi e Area docenti.
   [italiano, {lingua: [frase, pronuncia all'italiana, nota?]}]
   BOZZA da far verificare ai docenti di lingue.
   ════════════════════════════════════════════════════════ */
window.PAROLE_SALA = (function () {
  var SEZIONI = [
    { id: 'accoglienza', nome: '🤝 Accoglienza', sot: 'Dal saluto all\'accompagnamento al tavolo.' },
    { id: 'mise', nome: '🍽️ La mise en place', sot: 'Gli oggetti della tavola, uno per uno.' },
    { id: 'ordine', nome: '📝 L\'ordinazione', sot: 'Prendere l\'ordine, consigliare, chiedere la cottura.' },
    { id: 'bevande', nome: '🍷 Bevande e vini', sot: 'Acqua, vino e tutto ciò che si serve da bere.' },
    { id: 'allergie', nome: '⚠️ Allergie', sot: 'Le frasi più importanti per la sicurezza del cliente: in caso di dubbio si chiede sempre in cucina.' },
    { id: 'conto', nome: '💶 Il conto e il congedo', sot: 'Chiudere il servizio con garbo.' }
  ];
  /* [italiano, {lingua: [frase, pronuncia, nota?]}] — BOZZA da far verificare ai docenti di lingue */
  var PAROLE = {
  accoglienza: [
    ['Buongiorno', { en: ['Good morning', 'gud mòrning'], fr: ['Bonjour', 'boNjùr'], es: ['Buenos días', 'buénos días'], de: ['Guten Morgen', 'gùten mòrghen'] }],
    ['Buonasera', { en: ['Good evening', 'gud ìvning'], fr: ['Bonsoir', 'boNsuàr'], es: ['Buenas tardes', 'buénas tàrdes', 'a tarda sera: «Buenas noches»'], de: ['Guten Abend', 'gùten àbent'] }],
    ['Benvenuti', { en: ['Welcome', 'uèlcam'], fr: ['Bienvenue', 'biaNvənü'], es: ['Bienvenidos', 'bienvenìdos'], de: ['Willkommen', 'vilkòmmen'] }],
    ['Avete prenotato?', { en: ['Do you have a reservation?', 'du iu hev a resərvéiscion'], fr: ['Vous avez réservé ?', 'vu zavé reservé'], es: ['¿Tienen reserva?', 'tiénen resèrva'], de: ['Haben Sie reserviert?', 'hàben si reservìrt'] }],
    ['A che nome?', { en: ['Under what name?', 'àndər uòt néim'], fr: ['À quel nom ?', 'a chèl noN'], es: ['¿A nombre de quién?', 'a nómbre de chièn'], de: ['Auf welchen Namen?', 'auf vèlhen nàmen'] }],
    ['Per quante persone?', { en: ['For how many people?', 'for hàu mèni pìpol'], fr: ['Pour combien de personnes ?', 'pur coNbiaN də persònn'], es: ['¿Para cuántas personas?', 'para cuàntas persònas'], de: ['Für wie viele Personen?', 'für vi fìle persònen'] }],
    ['Prego, da questa parte', { en: ['This way, please', 'dis uèi, plìis'], fr: ['Par ici, s\'il vous plaît', 'par isì, sil vu plè'], es: ['Por aquí, por favor', 'por achì, por favór'], de: ['Hier entlang, bitte', 'hìr entlàng, bìtte'] }],
    ['Prego, si accomodi', { en: ['Please, have a seat', 'plìis, hev a sìit'], fr: ['Je vous en prie, asseyez-vous', 'jə vu zaN prì, asseié vu'], es: ['Siéntese, por favor', 'siéntese, por favór'], de: ['Bitte, nehmen Sie Platz', 'bìtte, némen si plats'] }],
    ['Posso prendere il suo cappotto?', { en: ['May I take your coat?', 'méi ai téic iòr còut'], fr: ['Puis-je prendre votre manteau ?', 'püìj prandr vòtr mantò'], es: ['¿Me permite su abrigo?', 'me permìte su abrìgo'], de: ['Darf ich Ihren Mantel nehmen?', 'darf ih ìren màntel némen'] }],
    ['Ecco il menù', { en: ['Here is the menu', 'hìar is də mèniu'], fr: ['Voici la carte', 'vuasì la cart'], es: ['Aquí tiene la carta', 'achì tiéne la càrta'], de: ['Hier ist die Speisekarte', 'hìr ist di shpàizekarte'] }],
    ['Desidera un aperitivo?', { en: ['Would you like an aperitif?', 'ud iu làic an apèritif'], fr: ['Désirez-vous un apéritif ?', 'desiré vu aN aperitìf'], es: ['¿Desea un aperitivo?', 'deséa un aperitìvo'], de: ['Möchten Sie einen Aperitif?', 'möhten si àinen aperitìf'] }],
    ['Torno subito', { en: ['I\'ll be right back', 'àil bi ràit bec'], fr: ['Je reviens tout de suite', 'jə rəviaN tud süìt'], es: ['Enseguida vuelvo', 'enseghìda buélvo'], de: ['Ich bin gleich zurück', 'ih bin glàih tsurük'] }],
    ['Mi dispiace, siamo al completo', { en: ['I\'m sorry, we\'re fully booked', 'àim sòri, uìar fùli bukt'], fr: ['Désolé, nous sommes complets', 'dezolé, nu som coNplè'], es: ['Lo siento, estamos completos', 'lo siénto, estàmos complétos'], de: ['Es tut mir leid, wir sind ausgebucht', 'es tut mir làit, vir sint àusghebuht'] }],
    ['Buon appetito', { en: ['Enjoy your meal', 'engiòi iòr mìil'], fr: ['Bon appétit', 'bon apetì'], es: ['¡Buen provecho!', 'buén provécio'], de: ['Guten Appetit', 'gùten apetìt'] }]
  ],
  mise: [
    ['Il tavolo', { en: ['The table', 'də téibol'], fr: ['La table', 'la tàbl'], es: ['La mesa', 'la mésa'], de: ['Der Tisch', 'der tish'] }],
    ['La tovaglia', { en: ['The tablecloth', 'də téibolclos'], fr: ['La nappe', 'la nap'], es: ['El mantel', 'el mantél'], de: ['Die Tischdecke', 'di tìshdeche'] }],
    ['Il tovagliolo', { en: ['The napkin', 'də nèpchin'], fr: ['La serviette', 'la servièt'], es: ['La servilleta', 'la servigliéta'], de: ['Die Serviette', 'di servièt-te'] }],
    ['Il piatto piano', { en: ['The dinner plate', 'də dìnər pléit'], fr: ['L\'assiette plate', 'lassièt plat'], es: ['El plato llano', 'el plàto gliàno'], de: ['Der flache Teller', 'der flàhe tèller'] }],
    ['Il piatto fondo', { en: ['The soup plate', 'də sup pléit'], fr: ['L\'assiette creuse', 'lassièt cröz'], es: ['El plato hondo', 'el plàto òndo'], de: ['Der tiefe Teller', 'der tìfe tèller'] }],
    ['Il piattino del pane', { en: ['The bread plate', 'də bred pléit'], fr: ['L\'assiette à pain', 'lassièt a paN'], es: ['El platillo del pan', 'el platìglio del pan'], de: ['Der Brotteller', 'der bròt-teller'] }],
    ['Il sottopiatto', { en: ['The charger plate', 'də ciàrgiər pléit'], fr: ['L\'assiette de présentation', 'lassièt də presantasiòN'], es: ['El bajoplato', 'el bahoplàto'], de: ['Der Platzteller', 'der plàts-teller'] }],
    ['La forchetta', { en: ['The fork', 'də fòrk'], fr: ['La fourchette', 'la furscèt'], es: ['El tenedor', 'el tenedór'], de: ['Die Gabel', 'di gàbel'] }],
    ['Il coltello', { en: ['The knife', 'də nàif'], fr: ['Le couteau', 'lə cutò'], es: ['El cuchillo', 'el cucìglio'], de: ['Das Messer', 'das mèsser'] }],
    ['Il cucchiaio', { en: ['The spoon', 'də spùun'], fr: ['La cuillère', 'la cüièr'], es: ['La cuchara', 'la cuciàra'], de: ['Der Löffel', 'der löffel'] }],
    ['Il cucchiaino', { en: ['The teaspoon', 'də tìispuun'], fr: ['La petite cuillère', 'la pətìt cüièr'], es: ['La cucharilla', 'la cuciarìglia'], de: ['Der Teelöffel', 'der tée-löffel'] }],
    ['Il bicchiere da acqua', { en: ['The water glass', 'də uòtər glas'], fr: ['Le verre à eau', 'lə vèr a ò'], es: ['El vaso de agua', 'el bàso de àgua'], de: ['Das Wasserglas', 'das vàsserglas'] }],
    ['Il calice da vino', { en: ['The wine glass', 'də uàin glas'], fr: ['Le verre à vin', 'lə vèr a vaN'], es: ['La copa de vino', 'la còpa de bìno'], de: ['Das Weinglas', 'das vàinglas'] }],
    ['La caraffa', { en: ['The carafe', 'də caràf'], fr: ['La carafe', 'la caràf'], es: ['La jarra', 'la hàrra', 'la «j» spagnola è una h forte'], de: ['Die Karaffe', 'di karàffe'] }],
    ['La saliera', { en: ['The salt shaker', 'də sòlt scéiker'], fr: ['La salière', 'la saliér'], es: ['El salero', 'el saléro'], de: ['Der Salzstreuer', 'der zàlts-shtròier'] }],
    ['Il segnaposto', { en: ['The place card', 'də pléis card'], fr: ['Le marque-place', 'lə marc plas'], es: ['La tarjeta de mesa', 'la tarhéta de mésa'], de: ['Die Tischkarte', 'di tìsh-karte'] }]
  ],
  ordine: [
    ['Siete pronti per ordinare?', { en: ['Are you ready to order?', 'ar iu rèdi tu òrdər'], fr: ['Vous avez choisi ?', 'vu zavé sciuasì'], es: ['¿Están listos para pedir?', 'estàn lìstos para pedìr'], de: ['Möchten Sie bestellen?', 'möhten si bəshtèllen'] }],
    ['Cosa desidera?', { en: ['What would you like?', 'uòt ud iu làic'], fr: ['Que désirez-vous ?', 'kə desiré vu'], es: ['¿Qué desea?', 'che deséa'], de: ['Was möchten Sie?', 'vas möhten si'] }],
    ['Le consiglio…', { en: ['I recommend…', 'ai recomènd'], fr: ['Je vous conseille…', 'jə vu coNsèi'], es: ['Le recomiendo…', 'le recomiéndo'], de: ['Ich empfehle Ihnen…', 'ih empféle ìnen'] }],
    ['Il piatto del giorno è…', { en: ['Today\'s special is…', 'tudéis spèscial is'], fr: ['Le plat du jour est…', 'lə pla dü jur è'], es: ['El plato del día es…', 'el plàto del dìa es'], de: ['Das Tagesgericht ist…', 'das tàghes-gheriht ist'] }],
    ['Il piatto è preparato con…', { en: ['This dish is made with…', 'dis disc is méid uìd'], fr: ['Ce plat est préparé avec…', 'sə pla è preparé avèc'], es: ['Este plato lleva…', 'éste plàto gliéva'], de: ['Dieses Gericht wird mit … zubereitet', 'dìzes gheriht virt mit … tsùbəraitet'] }],
    ['L\'antipasto', { en: ['The starter', 'də stàrtər'], fr: ['L\'entrée', 'laNtré'], es: ['El entrante', 'el entrànte'], de: ['Die Vorspeise', 'di fòrshpaize'] }],
    ['Il primo piatto', { en: ['The first course', 'də fërst còrs'], fr: ['Le premier plat', 'lə prəmié pla'], es: ['El primer plato', 'el primér plàto'], de: ['Der erste Gang', 'der èrste gang'] }],
    ['Il secondo piatto', { en: ['The main course', 'də méin còrs'], fr: ['Le plat principal', 'lə pla praNsipàl'], es: ['El segundo plato', 'el segùndo plàto'], de: ['Das Hauptgericht', 'das hàupt-gheriht'] }],
    ['Il contorno', { en: ['The side dish', 'də sàid disc'], fr: ['L\'accompagnement', 'lacoNpagnəmàN'], es: ['La guarnición', 'la guarnithión'], de: ['Die Beilage', 'di bàilaghe'] }],
    ['Il dolce', { en: ['The dessert', 'də disèrt'], fr: ['Le dessert', 'lə desèr'], es: ['El postre', 'el pòstre'], de: ['Die Nachspeise', 'di nàh-shpaize'] }],
    ['Che cottura desidera?', { en: ['How would you like it cooked?', 'hàu ud iu làic it cukt'], fr: ['Quelle cuisson ?', 'chèl cüissòN'], es: ['¿Qué punto de cocción?', 'che pùnto de cocthión'], de: ['Wie möchten Sie es gebraten?', 'vi möhten si es ghebràten'] }],
    ['Al sangue', { en: ['Rare', 'rèər'], fr: ['Saignant', 'segnàN'], es: ['Poco hecho', 'pòco écio'], de: ['Blutig', 'blùtih'] }],
    ['Cottura media', { en: ['Medium', 'mìdiəm'], fr: ['À point', 'a puàN'], es: ['Al punto', 'al pùnto'], de: ['Medium', 'mìdium'] }],
    ['Ben cotta', { en: ['Well done', 'uèl dan'], fr: ['Bien cuit', 'biaN cüì'], es: ['Muy hecho', 'mui écio'], de: ['Durchgebraten', 'dùrh-ghebraten'] }],
    ['Desidera altro?', { en: ['Anything else?', 'ènithing èls'], fr: ['Autre chose ?', 'ótr sciòz'], es: ['¿Algo más?', 'àlgo màs'], de: ['Sonst noch etwas?', 'zonst noh ètvas'] }],
    ['Ottima scelta', { en: ['Excellent choice', 'èxələnt ciòis'], fr: ['Excellent choix', 'exelàN sciuà'], es: ['Muy buena elección', 'mui buéna electhión'], de: ['Gute Wahl', 'gùte vaal'] }]
  ],
  bevande: [
    ['Cosa desiderate da bere?', { en: ['What would you like to drink?', 'uòt ud iu làic tu drink'], fr: ['Que désirez-vous boire ?', 'kə desiré vu buàr'], es: ['¿Qué desean beber?', 'che deséan bebér'], de: ['Was möchten Sie trinken?', 'vas möhten si trìnken'] }],
    ['Acqua naturale', { en: ['Still water', 'stil uòtər'], fr: ['Eau plate', 'o plat'], es: ['Agua sin gas', 'àgua sin gas'], de: ['Stilles Wasser', 'shtìlles vàsser'] }],
    ['Acqua frizzante', { en: ['Sparkling water', 'spàrcling uòtər'], fr: ['Eau gazeuse', 'o gazöz'], es: ['Agua con gas', 'àgua con gas'], de: ['Sprudelwasser', 'shprùdel-vasser'] }],
    ['La carta dei vini', { en: ['The wine list', 'də uàin list'], fr: ['La carte des vins', 'la cart de vaN'], es: ['La carta de vinos', 'la càrta de bìnos'], de: ['Die Weinkarte', 'di vàin-karte'] }],
    ['Vino rosso', { en: ['Red wine', 'red uàin'], fr: ['Vin rouge', 'vaN ruj'], es: ['Vino tinto', 'bìno tìnto'], de: ['Rotwein', 'ròt-vain'] }],
    ['Vino bianco', { en: ['White wine', 'uàit uàin'], fr: ['Vin blanc', 'vaN blaN'], es: ['Vino blanco', 'bìno blànco'], de: ['Weißwein', 'vàis-vain'] }],
    ['Vino rosato', { en: ['Rosé wine', 'rosé uàin'], fr: ['Vin rosé', 'vaN rosé'], es: ['Vino rosado', 'bìno rosàdo'], de: ['Roséwein', 'rosé-vain'] }],
    ['Un calice o una bottiglia?', { en: ['A glass or a bottle?', 'a glas or a bòtol'], fr: ['Un verre ou une bouteille ?', 'aN vèr u ün butèi'], es: ['¿Una copa o una botella?', 'ùna còpa o ùna botéglia'], de: ['Ein Glas oder eine Flasche?', 'ain glas òder àine flàshe'] }],
    ['Le consiglio questo vino del territorio', { en: ['I recommend this local wine', 'ai recomènd dis lòcal uàin'], fr: ['Je vous conseille ce vin local', 'jə vu coNsèi sə vaN locàl'], es: ['Le recomiendo este vino de la zona', 'le recomiéndo éste bìno de la thòna'], de: ['Ich empfehle Ihnen diesen Wein aus der Region', 'ih empféle ìnen dìzen vain aus der reghiòn'] }],
    ['Desidera assaggiarlo?', { en: ['Would you like to taste it?', 'ud iu làic tu téist it'], fr: ['Voulez-vous le goûter ?', 'vulé vu lə gutè'], es: ['¿Desea probarlo?', 'deséa probàrlo'], de: ['Möchten Sie ihn probieren?', 'möhten si in probìren'] }],
    ['Con ghiaccio?', { en: ['With ice?', 'uìd àis'], fr: ['Avec des glaçons ?', 'avèc de glassòN'], es: ['¿Con hielo?', 'con iélo'], de: ['Mit Eis?', 'mit ais'] }],
    ['Una birra', { en: ['A beer', 'a bìər'], fr: ['Une bière', 'ün bièr'], es: ['Una cerveza', 'ùna therbétha'], de: ['Ein Bier', 'ain bìir'] }],
    ['Un succo di frutta', { en: ['A fruit juice', 'a frut giùs'], fr: ['Un jus de fruits', 'aN jü də früì'], es: ['Un zumo de fruta', 'un thùmo de frùta'], de: ['Ein Fruchtsaft', 'ain frùht-saft'] }],
    ['Un caffè', { en: ['A coffee', 'a còfi'], fr: ['Un café', 'aN cafè'], es: ['Un café', 'un cafè'], de: ['Einen Kaffee', 'àinen kàffe'] }],
    ['Un digestivo', { en: ['A digestif', 'a digestìf'], fr: ['Un digestif', 'aN digestìf'], es: ['Un digestivo', 'un dihestìvo'], de: ['Einen Digestif', 'àinen dighestìf'] }]
  ],
  allergie: [
    ['Ha allergie o intolleranze?', { en: ['Do you have any allergies or intolerances?', 'du iu hev èni èlərgis or intòlərənsis'], fr: ['Avez-vous des allergies ou des intolérances ?', 'avé vu de zalergì u de zaNtoleràns'], es: ['¿Tiene alguna alergia o intolerancia?', 'tiéne algùna alèrhia o intoleránthia'], de: ['Haben Sie Allergien oder Unverträglichkeiten?', 'hàben si alerghìen òder ùnfertrèglihkaiten'] }],
    ['Contiene glutine', { en: ['It contains gluten', 'it contéins glùtən'], fr: ['Il contient du gluten', 'il coNtiaN dü glütèn'], es: ['Contiene gluten', 'contiéne glùten'], de: ['Es enthält Gluten', 'es enthèlt glutén'] }],
    ['Senza glutine', { en: ['Gluten-free', 'glùtən frìi'], fr: ['Sans gluten', 'saN glütèn'], es: ['Sin gluten', 'sin glùten'], de: ['Glutenfrei', 'glutén-frai'] }],
    ['Contiene latte', { en: ['It contains milk', 'it contéins milk'], fr: ['Il contient du lait', 'il coNtiaN dü lè'], es: ['Contiene leche', 'contiéne léce'], de: ['Es enthält Milch', 'es enthèlt milh'] }],
    ['Contiene uova', { en: ['It contains eggs', 'it contéins egs'], fr: ['Il contient des œufs', 'il coNtiaN de zö'], es: ['Contiene huevo', 'contiéne uébo'], de: ['Es enthält Eier', 'es enthèlt àier'] }],
    ['Contiene frutta a guscio', { en: ['It contains nuts', 'it contéins nats'], fr: ['Il contient des fruits à coque', 'il coNtiaN de früì a còc'], es: ['Contiene frutos secos', 'contiéne frùtos sécos'], de: ['Es enthält Nüsse', 'es enthèlt nüsse'] }],
    ['Contiene arachidi', { en: ['It contains peanuts', 'it contéins pìinats'], fr: ['Il contient des arachides', 'il coNtiaN de zarascìd'], es: ['Contiene cacahuetes', 'contiéne cacauétes'], de: ['Es enthält Erdnüsse', 'es enthèlt èrt-nüsse'] }],
    ['Contiene pesce', { en: ['It contains fish', 'it contéins fisc'], fr: ['Il contient du poisson', 'il coNtiaN dü puassòN'], es: ['Contiene pescado', 'contiéne pescàdo'], de: ['Es enthält Fisch', 'es enthèlt fish'] }],
    ['Contiene crostacei', { en: ['It contains shellfish', 'it contéins scèlfisc'], fr: ['Il contient des crustacés', 'il coNtiaN de crüstasé'], es: ['Contiene marisco', 'contiéne marìsco'], de: ['Es enthält Krebstiere', 'es enthèlt crèps-tire'] }],
    ['Contiene sedano', { en: ['It contains celery', 'it contéins sèləri'], fr: ['Il contient du céleri', 'il coNtiaN dü selrì'], es: ['Contiene apio', 'contiéne àpio'], de: ['Es enthält Sellerie', 'es enthèlt sèlleri'] }],
    ['Verifico subito con la cucina', { en: ['I\'ll check with the kitchen right away', 'àil cec uìd də chìcen ràit əuéi'], fr: ['Je vérifie tout de suite avec la cuisine', 'jə verifì tud süìt avèc la cüisìn'], es: ['Lo consulto ahora mismo con la cocina', 'lo consùlto aóra mìsmo con la cothìna'], de: ['Ich frage sofort in der Küche nach', 'ih fràghe sofòrt in der kühe nah'] }],
    ['Possiamo prepararle un piatto senza…', { en: ['We can prepare a dish without…', 'uì can pripèər a disc uidàut'], fr: ['Nous pouvons vous préparer un plat sans…', 'nu puvòN vu preparé aN pla saN'], es: ['Podemos prepararle un plato sin…', 'podémos prepararle un plàto sin'], de: ['Wir können Ihnen ein Gericht ohne … zubereiten', 'vir können ìnen ain gheriht òne … tsùbəraiten'] }],
    ['Questo piatto è vegetariano', { en: ['This dish is vegetarian', 'dis disc is vegetèriən'], fr: ['Ce plat est végétarien', 'sə pla è vejetariaN'], es: ['Este plato es vegetariano', 'éste plàto es behetariàno'], de: ['Dieses Gericht ist vegetarisch', 'dìzes gheriht ist veghetàrish'] }],
    ['Questo piatto è vegano', { en: ['This dish is vegan', 'dis disc is vìigən'], fr: ['Ce plat est végan', 'sə pla è vegàn'], es: ['Este plato es vegano', 'éste plàto es begàno'], de: ['Dieses Gericht ist vegan', 'dìzes gheriht ist veghàn'] }]
  ],
  conto: [
    ['Va tutto bene?', { en: ['Is everything all right?', 'is èvrithing ol ràit'], fr: ['Tout se passe bien ?', 'tu sə pas biaN'], es: ['¿Todo bien?', 'tòdo bièn'], de: ['Ist alles in Ordnung?', 'ist àlles in òrdnung'] }],
    ['Gradisce altro?', { en: ['Would you like anything else?', 'ud iu làic ènithing èls'], fr: ['Désirez-vous autre chose ?', 'desiré vu ótr sciòz'], es: ['¿Desea algo más?', 'deséa àlgo màs'], de: ['Darf es noch etwas sein?', 'darf es noh ètvas zain'] }],
    ['È stato tutto di suo gradimento?', { en: ['Did you enjoy your meal?', 'did iu engiòi iòr mìil'], fr: ['Le repas vous a plu ?', 'lə rəpà vu za plü'], es: ['¿Le ha gustado la comida?', 'le a gustàdo la comìda'], de: ['Hat es Ihnen geschmeckt?', 'hat es ìnen ghəshmèct'] }],
    ['Il conto, per favore', { en: ['The bill, please', 'də bil, plìis'], fr: ['L\'addition, s\'il vous plaît', 'ladisiòN, sil vu plè'], es: ['La cuenta, por favor', 'la cuénta, por favór'], de: ['Die Rechnung, bitte', 'di rèhnung, bìtte'] }],
    ['Ecco il conto', { en: ['Here is your bill', 'hìər is iòr bil'], fr: ['Voici l\'addition', 'vuasì ladisiòN'], es: ['Aquí tiene la cuenta', 'achì tiéne la cuénta'], de: ['Hier ist Ihre Rechnung', 'hìr ist ìre rèhnung'] }],
    ['In contanti o con carta?', { en: ['Cash or card?', 'chesc or card'], fr: ['En espèces ou par carte ?', 'aN nespès u par cart'], es: ['¿En efectivo o con tarjeta?', 'en efectìvo o con tarhéta'], de: ['Bar oder mit Karte?', 'bar òder mit kàrte'] }],
    ['Il servizio è incluso', { en: ['Service is included', 'sërvis is inclùdid'], fr: ['Le service est compris', 'lə servìs è coNprì'], es: ['El servicio está incluido', 'el servìthio està incluìdo'], de: ['Die Bedienung ist inbegriffen', 'di bədìnung ist ìnbegriffen'] }],
    ['Ecco la ricevuta', { en: ['Here is your receipt', 'hìər is iòr risìit'], fr: ['Voici votre reçu', 'vuasì vòtr rəsü'], es: ['Aquí tiene el recibo', 'achì tiéne el rethìbo'], de: ['Hier ist Ihre Quittung', 'hìr ist ìre cvìttung'] }],
    ['Grazie mille', { en: ['Thank you very much', 'thenk iu vèri mac'], fr: ['Merci beaucoup', 'mersì bocù'], es: ['Muchas gracias', 'mùcias gràthias'], de: ['Vielen Dank', 'fìlen danc'] }],
    ['Prego, di niente', { en: ['You\'re welcome', 'iòr uèlcam'], fr: ['Je vous en prie', 'jə vu zaN prì'], es: ['De nada', 'de nàda'], de: ['Bitte schön', 'bìtte shön'] }],
    ['Buona serata', { en: ['Have a nice evening', 'hev a nàis ìvning'], fr: ['Bonne soirée', 'bon suaré'], es: ['Que pase una buena noche', 'che pàse ùna buéna nóce'], de: ['Schönen Abend noch', 'shönen àbent noh'] }],
    ['Arrivederci', { en: ['Goodbye', 'gudbài'], fr: ['Au revoir', 'o rəvuàr'], es: ['Adiós', 'adiòs'], de: ['Auf Wiedersehen', 'auf vìder-zéen'] }],
    ['Torni a trovarci!', { en: ['Come back soon!', 'cam bec sùun'], fr: ['Revenez nous voir !', 'rəvəné nu vuàr'], es: ['¡Vuelva pronto!', 'buélva prònto'], de: ['Kommen Sie bald wieder!', 'kòmmen si balt vìder'] }]
  ]
  };
  return { SEZIONI: SEZIONI, PAROLE: PAROLE };
})();
