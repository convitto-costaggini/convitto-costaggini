/* ════════════════════════════════════════════════════════
   LINGUE — lezioni guidate (pacchetti completi per un'ora di lezione)
   Ogni lezione, per ogni lingua: schede della mini-lezione, esercizi,
   missione finale, verifica A/B (stampabile) e note per il docente.
   La versione facilitata (DSA/BES) si ricava in automatico dagli stessi dati.
   Formato pensato anche per i pacchetti preparati con l'IA dai docenti.
   Nei testi italiani **parola** = grassetto.
   ════════════════════════════════════════════════════════ */
window.LEZIONI = [
{
  id: "brigata", icona: "👨‍🍳", ambito: "Cucina", titolo: "In brigata", sottotitolo: "L'imperativo e le quantità",
  livello: "A1–A2", classi: "Biennio", durata: "1 ora",
  descrizione: "Il primo giorno in una cucina all'estero: capire gli ordini dello chef, dare istruzioni, leggere le quantità di una ricetta.",
  docente: {
    obiettivi: [
      "Capire e dare ordini brevi in cucina (imperativo affermativo e negativo).",
      "Conoscere dieci verbi della preparazione e le parole della brigata.",
      "Leggere e chiedere quantità (How much / How many · ¿Cuánto/a? / ¿Cuántos/as?).",
      "Seguire una ricetta semplice e metterne in ordine i passaggi."
    ],
    scaletta: [
      ["10'", "Mini-lezione alla LIM: le schede si scorrono insieme, la classe risponde alle domande lampo per alzata di mano."],
      ["25'", "Esercizi sul telefono (link o QR qui sotto), da soli o a coppie. Chi finisce prima rifà la missione."],
      ["15'", "Missione «Il primo giorno in brigata»: alla LIM, la classe vota ogni scelta; oppure sul telefono."],
      ["10'", "Verifica breve (file A e B) o, in alternativa, la ricetta scritta come compito."]
    ],
    spunti: [
      "Cultura: la «brigade de cuisine» nasce con Auguste Escoffier; ancora oggi in molte cucine del mondo si risponde «Yes, chef!» / «¡Oído, chef!».",
      "Estero: chi va in stage a Londra, Dublino, Madrid o Barcellona sente questi ordini dal primo giorno, spesso detti in fretta e con il rumore della cucina.",
      "Con i docenti di cucina: la ricetta della missione si può preparare davvero in laboratorio, dando gli ordini in lingua."
    ]
  },
  lingue: {
  /* ───────────────────────── INGLESE ───────────────────────── */
  en: {
    luogo: "un ristorante di Londra",
    schede: [
      { titolo: "Il primo giorno in brigata", testo: "In cucina il tempo è poco e il rumore è tanto: gli ordini sono **brevissimi**. Ascolta lo chef e la risposta del commis.",
        esempi: [["Chop the onions, please!", "Trita le cipolle, per favore!", "ciòp di ònions, plìiz"], ["Yes, chef!", "Sì, chef!", "iès, scèf"]],
        domanda: { testo: "In cucina gli ordini sono…", o: ["brevi e diretti", "lunghi e complicati", "sempre scritti"], spiega: "Poche parole, subito chiare: in servizio non c'è tempo per le frasi lunghe." } },
      { titolo: "L'ordine: il verbo e basta", testo: "Per dare un ordine in inglese usi il **verbo così com'è**, senza soggetto: **chop** (trita), **add** (aggiungi), **stir** (mescola). È uguale per una persona o per tutta la brigata.",
        esempi: [["Chop the onions.", "Trita le cipolle.", "ciòp di ònions"], ["Add the salt.", "Aggiungi il sale.", "èd də sòlt"], ["Stir the sauce.", "Mescola il sugo.", "stöör də sòos"]],
        domanda: { testo: "Qual è l'ordine giusto?", o: ["Peel the potatoes.", "You peels the potatoes.", "Peeling the potatoes."], spiega: "Solo il verbo, all'inizio: Peel the potatoes." } },
      { titolo: "«Non farlo!»: don't + verbo", testo: "Per vietare metti **don't** davanti al verbo. Per essere gentile aggiungi **please**, all'inizio o alla fine.",
        esempi: [["Don't touch the oven!", "Non toccare il forno!", "dòont tàc di àven"], ["Don't run in the kitchen.", "Non correre in cucina.", "dòont ràn in də kìcen"], ["Wash your hands, please.", "Lavati le mani, per favore.", "uòsc iòr hènds, plìiz"]],
        domanda: { testo: "Come dici «Non aggiungere zucchero»?", o: ["Don't add sugar.", "No add sugar.", "Not add sugar."], spiega: "Il divieto si fa sempre con don't + verbo." } },
      { titolo: "Dieci verbi da cucina", testo: "Tocca 🔊 e ripeti ad alta voce. Sono gli ordini che sentirai più spesso.",
        esempi: [["chop", "trita", "ciòp"], ["slice", "affetta", "slàis"], ["peel", "sbuccia", "pìil"], ["wash", "lava", "uòsc"], ["stir", "mescola", "stöör"], ["add", "aggiungi", "èd"], ["boil", "fai bollire", "bòil"], ["fry", "friggi", "fràai"], ["bake", "cuoci in forno", "bèik"], ["pour", "versa", "pòor"]],
        domanda: { testo: "«Peel» vuol dire…", o: ["sbuccia", "friggi", "versa"], spiega: "Peel = sbuccia: Peel the potatoes, peel the apples." } },
      { titolo: "Quanto ne metto?", testo: "Le quantità della ricetta. Per chiedere: **How much?** per ciò che non si conta (salt, flour, milk), **How many?** per ciò che si conta (eggs, onions).",
        esempi: [["a pinch of salt", "un pizzico di sale", "a pinc əv sòlt"], ["a spoonful of sugar", "un cucchiaio di zucchero", "a spùunful əv sciùgar"], ["200 grams of flour", "200 grammi di farina", "tu hàndred grèms əv flàua"], ["half a litre of milk", "mezzo litro di latte", "hàaf a lìitə əv mìlk"], ["a clove of garlic", "uno spicchio d'aglio", "a clòov əv gàalic"], ["How many eggs do we need?", "Quante uova ci servono?", "hàu mèni ègs du uì nìid"]],
        domanda: { testo: "«_____ eggs do we need?»", o: ["How many", "How much"], spiega: "Le uova si contano (one egg, two eggs): How many." } },
      { titolo: "Le parole della brigata", testo: "Brevi grida che evitano incidenti e tengono il ritmo. Si usano in tutte le cucine professionali.",
        esempi: [["Yes, chef!", "Sì, chef! (si risponde sempre così)", "iès, scèf"], ["Heard!", "Ricevuto!", "höörd"], ["Behind!", "Dietro! (passo alle tue spalle)", "bihàind"], ["Hot pan!", "Padella calda, attenzione!", "hòt pèn"], ["Corner!", "Angolo! (sto girando l'angolo)", "còorner"], ["Service, please!", "Si serve! (il piatto è pronto al pass)", "söörvis, plìiz"]],
        domanda: { testo: "Passi alle spalle di un collega con una pentola calda. Cosa dici?", o: ["Behind! Hot!", "Service, please!", "Heard!"], spiega: "Behind! avvisa che sei dietro, Hot! che porti qualcosa di caldo." } },
      { titolo: "In tasca", testo: "**Ordine** = verbo all'inizio: *Peel the potatoes.*\n**Divieto** = don't + verbo: *Don't touch the oven!*\n**Gentilezza** = please.\n**How much?** (sale, farina, latte) · **How many?** (uova, cipolle).\nAlla fine di ogni ordine: **Yes, chef!**",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "I verbi della cucina", consegna: "Tocca un verbo e poi il suo significato.",
        coppie: [["chop", "trita"], ["peel", "sbuccia"], ["stir", "mescola"], ["pour", "versa"], ["bake", "cuoci in forno"], ["fry", "friggi"]] },
      { tipo: "scelta", titolo: "Dai l'ordine giusto", consegna: "Scegli la forma corretta.",
        voci: [
          { d: "_____ the carrots. (sbuccia)", o: ["Peel", "Peels", "Peeling"] },
          { d: "_____ the oven! (non toccare)", o: ["Don't touch", "No touch", "Not touching"] },
          { d: "_____ the water. (fai bollire)", o: ["Boil", "Boils", "To boiling"] },
          { d: "_____ your hands, please. (lavati)", o: ["Wash", "Washing", "Washes"] },
          { d: "_____ in the kitchen! (non correre)", o: ["Don't run", "Not run", "Doesn't run"] },
          { d: "_____ the sauce slowly. (mescola)", o: ["Stir", "Stirs", "Stirring"] }
        ] },
      { tipo: "completa", titolo: "La bruschetta, in inglese", consegna: "Completa la ricetta: per ogni spazio scegli il verbo giusto.",
        testo: "[Wash] the tomatoes and [cut] them into small pieces. [Slice] the bread and [toast] it. [Rub] a clove of garlic on the bread. [Add] the tomatoes, a pinch of salt and some olive oil. [Serve] it immediately!",
        intrusi: ["fry", "boil"] },
      { tipo: "ordina", titolo: "Spaghetti al pomodoro", consegna: "Tocca i passaggi nell'ordine giusto.",
        passi: [["Boil the water in a big pot.", "Fai bollire l'acqua in una pentola grande."], ["Add a pinch of salt.", "Aggiungi un pizzico di sale."], ["Put the spaghetti in the water.", "Metti gli spaghetti nell'acqua."], ["Cook them for ten minutes.", "Cuocili per dieci minuti."], ["Drain the pasta.", "Scola la pasta."], ["Add the tomato sauce and serve.", "Aggiungi il sugo e servi."]] },
      { tipo: "scelta", titolo: "Le quantità", consegna: "Scegli la quantità che ha senso.",
        voci: [
          { d: "Add _____ salt.", o: ["a pinch of", "a litre of", "a clove of"] },
          { d: "Crush _____ garlic.", o: ["a clove of", "a spoonful of", "half a litre of"] },
          { d: "Pour _____ milk.", o: ["half a litre of", "a pinch of", "a clove of"] },
          { d: "We need 200 _____ flour.", o: ["grams of", "cloves of", "pinches of"] },
          { d: "_____ eggs do we need?", o: ["How many", "How much", "How"] },
          { d: "_____ sugar do we need?", o: ["How much", "How many", "How"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta lo chef", consegna: "Ascolta l'ordine e scegli che cosa vuol dire.",
        voci: [
          { t: "Peel the potatoes.", o: ["Sbuccia le patate.", "Friggi le patate.", "Lava le patate."] },
          { t: "Don't touch the knife!", o: ["Non toccare il coltello!", "Prendi il coltello!", "Lava il coltello!"] },
          { t: "Add a spoonful of sugar.", o: ["Aggiungi un cucchiaio di zucchero.", "Aggiungi un pizzico di sale.", "Togli lo zucchero."] },
          { t: "Behind! Hot pan!", o: ["Dietro di te, padella calda!", "Il piatto è pronto!", "Accendi il forno!"] },
          { t: "Bake the cake for thirty minutes.", o: ["Cuoci la torta in forno per trenta minuti.", "Taglia la torta in trenta pezzi.", "Servi la torta tra trenta minuti."] }
        ] }
    ],
    missione: {
      titolo: "Il primo giorno in brigata", chef: "Chef Sarah",
      intro: "Sei in stage in un ristorante di Londra. È il tuo primo giorno e la chef Sarah ti dà gli ordini. Capisci che cosa vuole e reagisci nel modo giusto.",
      passi: [
        { dice: "Good morning! Put on your apron and wash your hands, please.", it: "Buongiorno! Mettiti il grembiule e lavati le mani, per favore.",
          o: [["🧼 Ti metti il grembiule e ti lavi le mani.", 1, "Perfetto: igiene prima di tutto."], ["🔥 Accendi subito i fornelli.", 0, "Prima il grembiule e le mani: apron = grembiule, wash your hands = lavati le mani."], ["☕ Vai a prenderti un caffè.", 0, "Non è proprio il momento! La chef ti ha chiesto grembiule e mani pulite."]] },
        { dice: "Peel five potatoes and slice the onions.", it: "Sbuccia cinque patate e affetta le cipolle.",
          o: [["🥔 Sbucci cinque patate e affetti le cipolle.", 1, "Esatto: peel = sbuccia, slice = affetta."], ["🥔 Sbucci due patate e friggi le cipolle.", 0, "Five = cinque, slice = affetta (non friggi: quello è fry)."], ["🧅 Tagli le patate e sbucci le cipolle.", 0, "Hai scambiato i verbi: peel le patate, slice le cipolle."]] },
        { dice: "Is that clear?", it: "È chiaro?", domanda: "Che cosa rispondi?",
          o: [["Yes, chef!", 1, "La risposta di ogni buon commis."], ["Yes, mate!", 0, "«Mate» si dice tra amici: alla chef si risponde «Yes, chef!»."], ["What?", 0, "Suona brusco. Se non hai capito: «Sorry, chef, can you repeat?»."]] },
        { dice: "Add a pinch of salt to the water.", it: "Aggiungi un pizzico di sale all'acqua.",
          o: [["🧂 Aggiungi un pizzico di sale.", 1, "A pinch of salt = un pizzico di sale."], ["🥄 Aggiungi un cucchiaio di zucchero.", 0, "Salt è il sale, e a pinch è un pizzico."], ["🧂 Versi tutto il pacco di sale.", 0, "A pinch è solo un pizzico!"]] },
        { situazione: "Devi passare alle spalle di un collega portando una pentola di acqua bollente.", domanda: "Che cosa dici?",
          o: [["Behind! Hot!", 1, "Così il collega non si gira all'improvviso: niente incidenti."], ["Service, please!", 0, "Quello si dice quando un piatto è pronto al pass."], ["Don't touch!", 0, "Non basta: devi avvisare che sei dietro e che porti qualcosa di caldo."]] },
        { dice: "How many eggs do we need for the cake?", it: "Quante uova ci servono per la torta?", situazione: "Sulla ricetta leggi: 4 eggs · 200 g of sugar · 250 g of flour.", domanda: "Che cosa rispondi?",
          o: [["Four eggs, chef.", 1, "Esatto: quattro uova."], ["Four grams, chef.", 0, "Le uova si contano: four eggs, non grams."], ["Much eggs, chef.", 0, "Serve il numero: four eggs."]] },
        { dice: "Table five, two minutes! Don't burn the onions!", it: "Tavolo cinque, due minuti! Non bruciare le cipolle!",
          o: [["🔥 Abbassi il fuoco sotto le cipolle.", 1, "Don't burn = non bruciare: hai salvato le cipolle!"], ["🔥 Alzi il fuoco al massimo.", 0, "Così le bruci! Don't burn = non bruciare."], ["🗑️ Butti via le cipolle.", 0, "Non serve buttarle: basta non bruciarle."]] }
      ],
      esiti: ["La chef ti stringe la mano: «Well done! See you tomorrow.»", "«Good job.» Domani torni, e andrà ancora meglio.", "«OK… we'll practise tomorrow.» Ripassa gli ordini e riprova.", "La chef sospira: «Let's start again.» Rifai la lezione e riprova!"]
    },
    verifica: [
      { tipo: "traduci", titolo: "Scrivi il verbo in inglese", punti: 1,
        voci: [["trita", "chop"], ["sbuccia", "peel"], ["affetta", "slice"], ["mescola", "stir"], ["aggiungi", "add"], ["versa", "pour"], ["friggi", "fry"], ["cuoci in forno", "bake"], ["lava", "wash"], ["fai bollire", "boil"]] },
      { tipo: "scelta", titolo: "Scegli la forma corretta", punti: 1,
        voci: [
          { d: "_____ the onions. (affetta)", o: ["Slice", "Slices", "Slicing"] },
          { d: "_____ the hot pan! (non toccare)", o: ["Don't touch", "No touch", "Not touch"] },
          { d: "_____ the milk. (versa)", o: ["Pour", "Pours", "Pouring"] },
          { d: "_____ the cake for an hour. (cuoci in forno)", o: ["Bake", "Bakes", "To baking"] },
          { d: "_____ salt do we need?", o: ["How much", "How many", "How"] },
          { d: "_____ onions do we need?", o: ["How many", "How much", "How"] },
          { d: "Add _____ salt.", o: ["a pinch of", "a clove of", "a litre of"] },
          { d: "Use _____ garlic.", o: ["a clove of", "a pinch of", "half a litre of"] }
        ] },
      { tipo: "traduci", titolo: "Traduci gli ordini in inglese", punti: 2,
        voci: [["Sbuccia le patate.", "Peel the potatoes."], ["Non toccare il forno!", "Don't touch the oven!"], ["Aggiungi un pizzico di sale.", "Add a pinch of salt."], ["Mescola il sugo, per favore.", "Stir the sauce, please."], ["Non correre in cucina!", "Don't run in the kitchen!"], ["Fai bollire l'acqua.", "Boil the water."]] },
      { tipo: "aperta", titolo: "La tua ricetta", punti: 5,
        testo: "Scrivi in inglese la ricetta di un piatto che conosci, con almeno cinque ordini (usa anche una quantità e un don't).",
        facile: "Scrivi in inglese tre ordini per preparare un piatto che conosci. Puoi usare i verbi: wash, peel, cut, add, boil, stir." }
    ]
  },
  /* ───────────────────────── SPAGNOLO ───────────────────────── */
  es: {
    luogo: "un ristorante di Madrid",
    schede: [
      { titolo: "Il primo giorno in brigata", testo: "In cucina il tempo è poco e il rumore è tanto: gli ordini sono **brevissimi**. Ascolta lo chef e la risposta del pinche (il commis).",
        esempi: [["¡Pica la cebolla, por favor!", "Trita la cipolla, per favore!", "pìca la thebòia, por favòr"], ["¡Oído, chef!", "Ricevuto, chef!", "oìdo, cef"]],
        domanda: { testo: "In cucina gli ordini sono…", o: ["brevi e diretti", "lunghi e complicati", "sempre scritti"], spiega: "Poche parole, subito chiare: in servizio non c'è tempo per le frasi lunghe." } },
      { titolo: "L'ordine con il «tú»", testo: "Tra colleghi in cucina ci si dà del tu. Verbi in **-ar** → finiscono in **-a**: cortar → **corta**. Verbi in **-er** e **-ir** → finiscono in **-e**: batir → **bate**, añadir → **añade**.\nNelle ricette scritte trovi spesso l'infinito: *Pelar las patatas.*",
        esempi: [["Corta el pan.", "Taglia il pane.", "còrta el pan"], ["Bate los huevos.", "Sbatti le uova.", "bàte los uèvos"], ["Añade la sal.", "Aggiungi il sale.", "agnàde la sal"]],
        domanda: { testo: "Come si dice «lava» (da lavar)?", o: ["Lava", "Lave", "Lavas"], spiega: "Lavar finisce in -ar, quindi: ¡Lava!" } },
      { titolo: "Attenzione a questi", testo: "Alcuni verbi cambiano: **pon** (metti, da poner), **haz** (fai, da hacer), **remueve** (mescola, da remover).\nPer vietare: **no** + una forma speciale, da imparare come formula. Per essere gentile: **por favor**.",
        esempi: [["Pon el agua a hervir.", "Metti l'acqua a bollire.", "pon el àgua a ervìr"], ["Remueve la salsa.", "Mescola il sugo.", "remuève la sàlsa"], ["¡No toques el horno!", "Non toccare il forno!", "no tòches el òrno"], ["¡No corras en la cocina!", "Non correre in cucina!", "no còrras en la cothìna"]],
        domanda: { testo: "Come dici «Non toccare il forno!»?", o: ["¡No toques el horno!", "¡No toca el horno!", "¡Toca no el horno!"], spiega: "Il divieto ha una forma tutta sua: no toques, no corras, no añadas." } },
      { titolo: "Dieci verbi da cucina", testo: "Tocca 🔊 e ripeti ad alta voce. Sono gli ordini che sentirai più spesso.",
        esempi: [["pica", "trita", "pìca"], ["corta", "taglia", "còrta"], ["pela", "sbuccia", "pèla"], ["lava", "lava", "làva"], ["remueve", "mescola", "remuève"], ["añade", "aggiungi", "agnàde"], ["fríe", "friggi", "frìe"], ["hornea", "cuoci in forno", "ornèa"], ["echa", "versa, metti", "ècia"], ["bate", "sbatti", "bàte"]],
        domanda: { testo: "«Pela» vuol dire…", o: ["sbuccia", "friggi", "versa"], spiega: "Pela = sbuccia: Pela las patatas." } },
      { titolo: "¿Cuánto pongo?", testo: "Le quantità della ricetta. Per chiedere: **¿Cuánto? / ¿Cuánta?** per ciò che non si conta (cuánto azúcar, cuánta sal, cuánta harina), **¿Cuántos? / ¿Cuántas?** per ciò che si conta (cuántos huevos, cuántas cebollas). La parola si accorda con il nome.",
        esempi: [["una pizca de sal", "un pizzico di sale", "ùna pìthca de sal"], ["una cucharada de azúcar", "un cucchiaio di zucchero", "ùna cuciaràda de athùcar"], ["doscientos gramos de harina", "200 grammi di farina", "dosthièntos gràmos de arìna"], ["medio litro de leche", "mezzo litro di latte", "mèdio lìtro de lèce"], ["un diente de ajo", "uno spicchio d'aglio", "un diènte de àho"], ["¿Cuántos huevos necesitamos?", "Quante uova ci servono?", "cuàntos uèvos nethesitàmos"]],
        domanda: { testo: "«¿_____ huevos necesitamos?»", o: ["Cuántos", "Cuánto"], spiega: "Le uova si contano: ¿Cuántos huevos?" } },
      { titolo: "Le parole della brigata", testo: "Brevi grida che evitano incidenti e tengono il ritmo. Si sentono in tutte le cucine professionali spagnole.",
        esempi: [["¡Oído, chef!", "Ricevuto, chef! (si risponde sempre così)", "oìdo, cef"], ["¡Detrás!", "Dietro! (passo alle tue spalle)", "detràs"], ["¡Paso!", "Passo! (fatemi passare)", "pàso"], ["¡Cuidado, que quema!", "Attenzione, scotta!", "cuidàdo, che chèma"], ["¡Marcha la mesa cinco!", "Via il tavolo cinque! (si inizia a cucinare)", "màrcia la mèsa thìnco"]],
        domanda: { testo: "Passi alle spalle di un collega con una pentola calda. Cosa dici?", o: ["¡Detrás! ¡Cuidado, que quema!", "¡Marcha la mesa cinco!", "¡Oído!"], spiega: "¡Detrás! avvisa che sei dietro, «que quema» che porti qualcosa che scotta." } },
      { titolo: "In tasca", testo: "**Ordine** con il tú: -ar → **-a** (corta), -er/-ir → **-e** (bate, añade).\nDa ricordare: **pon**, **haz**, **remueve**.\n**Divieto**: *¡No toques! ¡No corras!*\n**Gentilezza**: por favor.\n**¿Cuánto/a?** (azúcar, sal) · **¿Cuántos/as?** (huevos, cebollas).\nAlla fine di ogni ordine: **¡Oído, chef!**",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "I verbi della cucina", consegna: "Tocca un verbo e poi il suo significato.",
        coppie: [["pica", "trita"], ["pela", "sbuccia"], ["remueve", "mescola"], ["echa", "versa"], ["hornea", "cuoci in forno"], ["fríe", "friggi"]] },
      { tipo: "scelta", titolo: "Dai l'ordine giusto", consegna: "Scegli la forma corretta.",
        voci: [
          { d: "_____ las zanahorias. (sbuccia)", o: ["Pela", "Pelas", "Pelo"] },
          { d: "¡_____ el horno! (non toccare)", o: ["No toques", "No tocas", "No toco"] },
          { d: "_____ el agua a hervir. (metti)", o: ["Pon", "Pones", "Pongo"] },
          { d: "_____ las manos, por favor. (lavati)", o: ["Lávate", "Lavas", "Lavo"] },
          { d: "¡_____ en la cocina! (non correre)", o: ["No corras", "No corres", "No corro"] },
          { d: "_____ la salsa despacio. (mescola)", o: ["Remueve", "Remueves", "Remuevo"] }
        ] },
      { tipo: "completa", titolo: "El pan con tomate", consegna: "Completa la ricetta catalana: per ogni spazio scegli il verbo giusto.",
        testo: "[Corta] el pan en rebanadas y [tuesta] el pan. [Frota] un diente de ajo sobre el pan. [Ralla] los tomates y [pon] el tomate sobre el pan. [Añade] una pizca de sal y un chorrito de aceite de oliva. ¡Y a la mesa!",
        intrusi: ["fríe", "bate"] },
      { tipo: "ordina", titolo: "La tortilla de patatas", consegna: "Tocca i passaggi nell'ordine giusto.",
        passi: [["Pela las patatas y córtalas en rodajas finas.", "Sbuccia le patate e tagliale a fettine sottili."], ["Fríe las patatas y la cebolla en aceite de oliva.", "Friggi le patate e la cipolla nell'olio d'oliva."], ["Bate los huevos con una pizca de sal.", "Sbatti le uova con un pizzico di sale."], ["Mezcla las patatas con los huevos.", "Mescola le patate con le uova."], ["Echa todo en la sartén.", "Versa tutto nella padella."], ["Dale la vuelta con un plato y ¡a la mesa!", "Girala con un piatto e in tavola!"]] },
      { tipo: "scelta", titolo: "Le quantità", consegna: "Scegli la quantità che ha senso.",
        voci: [
          { d: "Añade _____ sal.", o: ["una pizca de", "un litro de", "un diente de"] },
          { d: "Pica _____ ajo.", o: ["un diente de", "una cucharada de", "medio litro de"] },
          { d: "Echa _____ leche.", o: ["medio litro de", "una pizca de", "un diente de"] },
          { d: "Necesitamos doscientos _____ harina.", o: ["gramos de", "dientes de", "pizcas de"] },
          { d: "¿_____ huevos necesitamos?", o: ["Cuántos", "Cuánto", "Cuántas"] },
          { d: "¿_____ azúcar necesitamos?", o: ["Cuánto", "Cuántos", "Cuántas"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta lo chef", consegna: "Ascolta l'ordine e scegli che cosa vuol dire.",
        voci: [
          { t: "Pela las patatas.", o: ["Sbuccia le patate.", "Friggi le patate.", "Lava le patate."] },
          { t: "¡No toques el cuchillo!", o: ["Non toccare il coltello!", "Prendi il coltello!", "Lava il coltello!"] },
          { t: "Añade una cucharada de azúcar.", o: ["Aggiungi un cucchiaio di zucchero.", "Aggiungi un pizzico di sale.", "Togli lo zucchero."] },
          { t: "¡Detrás! ¡Cuidado, que quema!", o: ["Dietro di te, attenzione: scotta!", "Il piatto è pronto!", "Accendi il forno!"] },
          { t: "Hornea la tarta treinta minutos.", o: ["Cuoci la torta in forno per trenta minuti.", "Taglia la torta in trenta pezzi.", "Servi la torta tra trenta minuti."] }
        ] }
    ],
    missione: {
      titolo: "Il primo giorno in brigata", chef: "Chef Lucía",
      intro: "Sei in stage in un ristorante di Madrid. È il tuo primo giorno e la chef Lucía ti dà gli ordini. Capisci che cosa vuole e reagisci nel modo giusto.",
      passi: [
        { dice: "¡Buenos días! Ponte el delantal y lávate las manos, por favor.", it: "Buongiorno! Mettiti il grembiule e lavati le mani, per favore.",
          o: [["🧼 Ti metti il grembiule e ti lavi le mani.", 1, "Perfetto: igiene prima di tutto."], ["🔥 Accendi subito i fornelli.", 0, "Prima il grembiule e le mani: delantal = grembiule, lávate las manos = lavati le mani."], ["☕ Vai a prenderti un caffè.", 0, "Non è proprio il momento! La chef ti ha chiesto grembiule e mani pulite."]] },
        { dice: "Pela cinco patatas y corta la cebolla.", it: "Sbuccia cinque patate e taglia la cipolla.",
          o: [["🥔 Sbucci cinque patate e tagli la cipolla.", 1, "Esatto: pela = sbuccia, corta = taglia."], ["🥔 Sbucci due patate e friggi la cipolla.", 0, "Cinco = cinque, corta = taglia (friggere è freír)."], ["🧅 Tagli le patate e sbucci la cipolla.", 0, "Hai scambiato i verbi: pela le patate, corta la cipolla."]] },
        { dice: "¿Está claro?", it: "È chiaro?", domanda: "Che cosa rispondi?",
          o: [["¡Oído, chef!", 1, "La risposta di ogni buon pinche."], ["¡Vale, tío!", 0, "«Tío» si dice tra amici: alla chef si risponde «¡Oído, chef!»."], ["¿Qué?", 0, "Suona brusco. Se non hai capito: «Perdón, chef, ¿puedes repetir?»."]] },
        { dice: "Echa una pizca de sal en el agua.", it: "Metti un pizzico di sale nell'acqua.",
          o: [["🧂 Aggiungi un pizzico di sale.", 1, "Una pizca de sal = un pizzico di sale."], ["🥄 Aggiungi un cucchiaio di zucchero.", 0, "Sal è il sale, e una pizca è un pizzico."], ["🧂 Versi tutto il pacco di sale.", 0, "Una pizca è solo un pizzico!"]] },
        { situazione: "Devi passare alle spalle di un collega portando una pentola di acqua bollente.", domanda: "Che cosa dici?",
          o: [["¡Detrás! ¡Cuidado, que quema!", 1, "Così il collega non si gira all'improvviso: niente incidenti."], ["¡Marcha la mesa cinco!", 0, "Quello lo dice chi coordina il servizio, per far partire un tavolo."], ["¡No toques!", 0, "Non basta: devi avvisare che sei dietro e che porti qualcosa che scotta."]] },
        { dice: "¿Cuántos huevos necesitamos para la tortilla?", it: "Quante uova ci servono per la tortilla?", situazione: "Sulla ricetta leggi: 6 huevos · 1 kg de patatas · 1 cebolla.", domanda: "Che cosa rispondi?",
          o: [["Seis huevos, chef.", 1, "Esatto: sei uova."], ["Seis kilos, chef.", 0, "Le uova si contano: seis huevos, non kilos."], ["Mucho huevos, chef.", 0, "Serve il numero: seis huevos."]] },
        { dice: "¡Marcha la mesa cinco! ¡No quemes la cebolla!", it: "Via il tavolo cinque! Non bruciare la cipolla!",
          o: [["🔥 Abbassi il fuoco sotto la cipolla.", 1, "No quemes = non bruciare: hai salvato la cipolla!"], ["🔥 Alzi il fuoco al massimo.", 0, "Così la bruci! No quemes = non bruciare."], ["🗑️ Butti via la cipolla.", 0, "Non serve buttarla: basta non bruciarla."]] }
      ],
      esiti: ["La chef ti stringe la mano: «¡Muy bien! Hasta mañana.»", "«Buen trabajo.» Domani torni, e andrà ancora meglio.", "«Bueno… mañana practicamos.» Ripassa gli ordini e riprova.", "La chef sospira: «Empezamos otra vez.» Rifai la lezione e riprova!"]
    },
    verifica: [
      { tipo: "traduci", titolo: "Scrivi il verbo in spagnolo (con il tú)", punti: 1,
        voci: [["trita", "pica"], ["sbuccia", "pela"], ["taglia", "corta"], ["mescola", "remueve"], ["aggiungi", "añade"], ["versa", "echa"], ["friggi", "fríe"], ["cuoci in forno", "hornea"], ["lava", "lava"], ["sbatti", "bate"]] },
      { tipo: "scelta", titolo: "Scegli la forma corretta", punti: 1,
        voci: [
          { d: "_____ la cebolla. (taglia)", o: ["Corta", "Cortas", "Corto"] },
          { d: "¡_____ la sartén! (non toccare)", o: ["No toques", "No toca", "No toco"] },
          { d: "_____ la leche. (versa)", o: ["Echa", "Echas", "Echo"] },
          { d: "_____ la tarta una hora. (cuoci in forno)", o: ["Hornea", "Horneas", "Horneo"] },
          { d: "¿_____ sal necesitamos?", o: ["Cuánta", "Cuántos", "Cuántas"] },
          { d: "¿_____ cebollas necesitamos?", o: ["Cuántas", "Cuánto", "Cuántos"] },
          { d: "Añade _____ sal.", o: ["una pizca de", "un diente de", "un litro de"] },
          { d: "Usa _____ ajo.", o: ["un diente de", "una pizca de", "medio litro de"] }
        ] },
      { tipo: "traduci", titolo: "Traduci gli ordini in spagnolo", punti: 2,
        voci: [["Sbuccia le patate.", "Pela las patatas."], ["Non toccare il forno!", "¡No toques el horno!"], ["Aggiungi un pizzico di sale.", "Añade una pizca de sal."], ["Mescola il sugo, per favore.", "Remueve la salsa, por favor."], ["Non correre in cucina!", "¡No corras en la cocina!"], ["Metti l'acqua a bollire.", "Pon el agua a hervir."]] },
      { tipo: "aperta", titolo: "La tua ricetta", punti: 5,
        testo: "Scrivi in spagnolo la ricetta di un piatto che conosci, con almeno cinque ordini (usa anche una quantità e un divieto con «no»).",
        facile: "Scrivi in spagnolo tre ordini per preparare un piatto che conosci. Puoi usare i verbi: lava, pela, corta, añade, pon, remueve." }
    ]
  }
  }
}
];

/* le prossime lezioni, già annunciate nel catalogo */
window.LEZIONI_IN_ARRIVO = [
  { icona: "🍷", ambito: "Sala", titolo: "Consigliare", sottotitolo: "Comparativi e superlativi", livello: "A2–B1", classi: "Biennio e triennio" },
  { icona: "🛎️", ambito: "Accoglienza", titolo: "Il reclamo in hotel", sottotitolo: "I tempi del passato e le scuse formali", livello: "B1–B2", classi: "Triennio" }
];
