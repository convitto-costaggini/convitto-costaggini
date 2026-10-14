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
},
{
  id: "consigliare", icona: "🍷", ambito: "Sala", titolo: "Consigliare", sottotitolo: "Comparativi e superlativi",
  livello: "A2–B1", classi: "Biennio e triennio", durata: "1 ora",
  descrizione: "«Che cosa mi consiglia?»: confrontare piatti e vini, presentare il migliore della carta e convincere il cliente con garbo.",
  docente: {
    obiettivi: [
      "Confrontare piatti e vini: comparativi di maggioranza, minoranza e uguaglianza.",
      "Usare i superlativi e le forme irregolari (better / the best · mejor / el mejor).",
      "Descrivere sapori e consistenze con dieci aggettivi della sala.",
      "Consigliare in modo cortese (I recommend… / Le recomiendo…) e rispondere alle domande del cliente."
    ],
    scaletta: [
      ["10'", "Mini-lezione alla LIM: le schede insieme, la classe risponde alle domande lampo."],
      ["25'", "Esercizi sul telefono (link o QR qui sotto), da soli o a coppie."],
      ["15'", "Missione «Il tavolo 7»: alla LIM la classe vota ogni risposta; poi, a coppie, role play cliente-cameriere con il menu vero del laboratorio di sala."],
      ["10'", "Verifica breve (file A e B) o un dialogo scritto come compito."]
    ],
    spunti: [
      "Cultura: nel Regno Unito e in Irlanda la mancia si aggira sul 10–12,5% (spesso è già in conto come «service charge»), negli Stati Uniti sul 15–20%; in Spagna è facoltativa e piccola. Consigliare bene fa la differenza.",
      "Estero: in un ristorante italiano all'estero il cliente si aspetta che sia proprio il cameriere italiano a spiegargli la differenza tra due piatti o due vini.",
      "Con i docenti di sala ed enogastronomia: presentare in lingua i vini e l'olio del territorio (Sabina DOP) e confrontarli."
    ]
  },
  lingue: {
  /* ───────────────────────── INGLESE ───────────────────────── */
  en: {
    schede: [
      { titolo: "«What do you recommend?»", testo: "È la domanda che ogni cameriere sente ogni sera. Rispondere «è tutto buono» non basta: chi consiglia bene **confronta** e **spiega**.",
        esempi: [["What do you recommend?", "Che cosa mi consiglia?", "uòt du iu recomènd"], ["The sea bass is lighter than the steak, and our tiramisù is the best in town.", "Il branzino è più leggero della bistecca, e il nostro tiramisù è il migliore della città.", ""]],
        domanda: { testo: "Consigliare bene vuol dire…", o: ["confrontare e spiegare", "dire «è tutto buono»", "indicare il piatto più caro"], spiega: "Il cliente si fida di chi gli spiega le differenze." } },
      { titolo: "Più… di: gli aggettivi corti", testo: "Con gli aggettivi corti aggiungi **-er** e poi **than**: light → **lighter than**, fresh → **fresher than**, cheap → **cheaper than**.\nSe finisce in -y diventa **-ier**: spicy → **spicier**. Alcuni raddoppiano: hot → **hotter**.",
        esempi: [["The fish is lighter than the meat.", "Il pesce è più leggero della carne.", "də fìsc is làiter dhen də mìit"], ["This wine is cheaper than that one.", "Questo vino costa meno di quello.", ""], ["The arrabbiata is spicier than the amatriciana.", "L'arrabbiata è più piccante dell'amatriciana.", ""]],
        domanda: { testo: "«Il pesce è più fresco della carne»", o: ["The fish is fresher than the meat.", "The fish is more fresh than the meat.", "The fish is fresher of the meat."], spiega: "Fresh è corto: fresher, e il paragone si fa con than." } },
      { titolo: "Più… di: gli aggettivi lunghi", testo: "Con gli aggettivi lunghi usi **more … than**: more delicate, more expensive. Per «meno» usi **less**: less spicy. Per «tanto quanto» usi **as … as**: as good as.",
        esempi: [["The risotto is more delicate than the pasta.", "Il risotto è più delicato della pasta.", ""], ["This red is less expensive than the champagne.", "Questo rosso è meno costoso dello champagne.", ""], ["Our pizza is as good as in Naples!", "La nostra pizza è buona come a Napoli!", ""]],
        domanda: { testo: "«Più costoso»", o: ["more expensive", "expensiver", "most expensive"], spiega: "Expensive è lungo: more expensive (than)." } },
      { titolo: "Il migliore: i superlativi", testo: "Per dire «il più…»: **the -est** con gli aggettivi corti (the freshest), **the most** con quelli lunghi (the most popular).\nAttenzione agli irregolari: good → **better** → **the best**; bad → **worse** → **the worst**.",
        esempi: [["The tiramisù is our most popular dessert.", "Il tiramisù è il nostro dolce più richiesto.", ""], ["This is the best wine on the list.", "Questo è il vino migliore della carta.", "dhis is də bèst uàin on də list"], ["The sea bass is the freshest fish today.", "Il branzino è il pesce più fresco di oggi.", ""]],
        domanda: { testo: "«Il migliore»", o: ["the best", "the goodest", "the most good"], spiega: "Good è irregolare: better, the best." } },
      { titolo: "Le parole del gusto", testo: "Tocca 🔊 e ripeti: servono per descrivere un piatto o un vino.",
        esempi: [["light", "leggero", "làit"], ["rich", "sostanzioso, ricco", "rìc"], ["spicy", "piccante", "spàisi"], ["sweet", "dolce", "suìit"], ["dry", "secco (vino)", "dràai"], ["full-bodied", "corposo", "fùl bòdid"], ["delicate", "delicato", "dèlicat"], ["crispy", "croccante", "crìspi"], ["tender", "tenero", "tènder"], ["homemade", "fatto in casa", "hòum mèid"]],
        domanda: { testo: "Un vino «full-bodied» è…", o: ["corposo", "dolce", "frizzante"], spiega: "Full-bodied = corposo, di struttura." } },
      { titolo: "Le frasi per consigliare", testo: "Formule cortesi, pronte da usare al tavolo.",
        esempi: [["I recommend the sea bass.", "Le consiglio il branzino.", "ài recomènd də sìi bès"], ["If you like fish, try the risotto with prawns.", "Se le piace il pesce, provi il risotto ai gamberi.", ""], ["It goes very well with a dry white wine.", "Si abbina molto bene a un bianco secco.", ""], ["It's our chef's speciality.", "È la specialità del nostro chef.", ""], ["Would you like to taste the wine first?", "Desidera assaggiare prima il vino?", ""]],
        domanda: { testo: "Il cliente vuole qualcosa di leggero. Che cosa dici?", o: ["I recommend the grilled sea bass: it's lighter than the lasagne.", "Take the lasagne, it's the heaviest dish.", "I don't know."], spiega: "Consigli, confronti e spieghi il perché." } },
      { titolo: "In tasca", testo: "**Corti**: -er than · the -est (lighter than, the freshest).\n**Lunghi**: more … than · the most (more delicate, the most popular).\n**Meno**: less … than · **Uguale**: as … as.\n**Irregolari**: good → better → the best · bad → worse → the worst.\nPer consigliare: **I recommend…** · **It goes well with…**",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "Le parole del gusto", consegna: "Tocca un aggettivo e poi il suo significato.",
        coppie: [["light", "leggero"], ["spicy", "piccante"], ["dry", "secco"], ["full-bodied", "corposo"], ["crispy", "croccante"], ["homemade", "fatto in casa"]] },
      { tipo: "scelta", titolo: "Più o meno?", consegna: "Scegli il comparativo giusto.",
        voci: [
          { d: "The fish is _____ than the meat. (leggero)", o: ["lighter", "more light", "lightest"] },
          { d: "This wine is _____ than the house wine. (costoso)", o: ["more expensive", "expensiver", "most expensive"] },
          { d: "The arrabbiata is _____ than the carbonara. (piccante)", o: ["spicier", "spicyer", "more spicier"] },
          { d: "Our tiramisù is _____ than the panna cotta. (buono)", o: ["better", "gooder", "more good"] },
          { d: "The soup is _____ than the salad. (caldo)", o: ["hotter", "hoter", "more hot"] },
          { d: "The risotto is _____ than the pizza. (delicato)", o: ["more delicate", "delicater", "most delicate"] }
        ] },
      { tipo: "completa", titolo: "I piatti del giorno", consegna: "Il cameriere presenta i piatti del giorno: completa con la parola giusta.",
        testo: "Today we have two specials. The sea bass is [lighter] than the steak and it's very fresh: it arrived this morning! The steak is [more] tender than last week's. For dessert, the tiramisù is the [most] popular, but in my opinion the panna cotta is the [best]. Both go very well [with] a glass of sweet wine.",
        intrusi: ["gooder", "than"] },
      { tipo: "ordina", titolo: "Il dialogo al tavolo", consegna: "Tocca le battute nell'ordine giusto.",
        passi: [["Good evening. Are you ready to order?", "Buonasera. Siete pronti per ordinare?"], ["Not yet. What do you recommend?", "Non ancora. Che cosa ci consiglia?"], ["If you like fish, the sea bass is the freshest dish today.", "Se vi piace il pesce, il branzino è il piatto più fresco di oggi."], ["Is it lighter than the lasagne?", "È più leggero delle lasagne?"], ["Yes, much lighter. It goes well with a dry white wine.", "Sì, molto più leggero. Si abbina bene a un bianco secco."], ["Perfect, I'll have the sea bass, then.", "Perfetto, allora prendo il branzino."]] },
      { tipo: "scelta", titolo: "Il migliore della carta", consegna: "Scegli il superlativo giusto.",
        voci: [
          { d: "This is _____ wine on our list. (il migliore)", o: ["the best", "the better", "the goodest"] },
          { d: "The tiramisù is our _____ dessert. (più richiesto)", o: ["most popular", "popularest", "more popular"] },
          { d: "The sea bass is _____ fish today. (il più fresco)", o: ["the freshest", "the most fresh", "the fresher"] },
          { d: "That was _____ pizza of my life! (la peggiore)", o: ["the worst", "the baddest", "the worse"] },
          { d: "The truffle pasta is _____ dish on the menu. (il più caro)", o: ["the most expensive", "the expensivest", "the more expensive"] },
          { d: "Our lemon sorbet is _____ dessert. (il più leggero)", o: ["the lightest", "the most light", "the lighter"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta il cliente", consegna: "Ascolta la domanda del cliente e scegli che cosa vuol dire.",
        voci: [
          { t: "Which is lighter, the fish or the meat?", o: ["Che cosa è più leggero, il pesce o la carne?", "Il pesce è più caro della carne?", "Preferisco la carne al pesce."] },
          { t: "I'd like something less spicy.", o: ["Vorrei qualcosa di meno piccante.", "Vorrei qualcosa di più piccante.", "Vorrei qualcosa di più dolce."] },
          { t: "Is this wine drier than the other one?", o: ["Questo vino è più secco dell'altro?", "Questo vino è più dolce dell'altro?", "Questo vino costa più dell'altro?"] },
          { t: "What's your most popular dish?", o: ["Qual è il vostro piatto più richiesto?", "Qual è il vostro piatto più caro?", "Qual è il piatto del giorno?"] },
          { t: "This is the best tiramisù I've ever had!", o: ["È il tiramisù più buono che abbia mai mangiato!", "Il tiramisù è troppo dolce!", "Vorrei un altro tiramisù."] }
        ] }
    ],
    missione: {
      titolo: "Il tavolo 7", chef: "Tavolo 7", avatar: "🧑‍🤝‍🧑", domanda: "Che cosa rispondi?",
      intro: "Sei in stage in un ristorante italiano di Dublino. Al tavolo 7 una coppia irlandese non sa che cosa scegliere e chiede consiglio a te. Rispondi nel modo più professionale.",
      passi: [
        { dice: "Good evening! We'd like something light. What do you recommend?", it: "Buonasera! Vorremmo qualcosa di leggero. Che cosa ci consiglia?",
          o: [["I recommend the grilled sea bass: it's lighter than the lasagne.", 1, "Consigli, confronti e spieghi: perfetto."], ["The lasagne: it's the heaviest dish.", 0, "Hanno chiesto qualcosa di leggero!"], ["Everything is good.", 0, "Non è un consiglio: confronta due piatti."]] },
        { dice: "Is the sea bass fresh?", it: "Il branzino è fresco?",
          o: [["Yes, it's the freshest fish today: it arrived this morning.", 1, "Superlativo giusto e una prova concreta."], ["Yes, it's fresher fish.", 0, "Più fresco di che cosa? Qui serve il superlativo: the freshest."], ["Yes, it's more fresh.", 0, "Fresh è corto: fresher, the freshest."]] },
        { dice: "My wife doesn't eat fish. Any suggestions?", it: "Mia moglie non mangia pesce. Qualche suggerimento?",
          o: [["Try the lemon chicken: it's as light as the sea bass.", 1, "as … as = leggero quanto il branzino."], ["She can eat the fish anyway.", 0, "Scortese: il cliente ha sempre l'ultima parola."], ["The steak: it's lighter than the fish.", 0, "Una bistecca più leggera del pesce? Consiglio poco credibile."]] },
        { dice: "Which wine goes with the sea bass?", it: "Quale vino si abbina al branzino?",
          o: [["A dry white: our Vermentino is fresher than the Chardonnay.", 1, "Abbinamento classico e confronto chiaro."], ["A full-bodied red: it's the strongest.", 0, "Con un pesce delicato si consiglia di solito un bianco secco."], ["Water is better than wine.", 0, "Non tocca a te decidere per il cliente!"]] },
        { dice: "Is the Vermentino expensive?", it: "Il Vermentino è caro?",
          o: [["No, it's less expensive than the Chardonnay.", 1, "Less … than: meno costoso."], ["No, it's cheapest.", 0, "Serve the (the cheapest) oppure il confronto (cheaper than…)."], ["Yes, but it's the better.", 0, "Si dice the best, non the better."]] },
        { dice: "We'd love a dessert. What's your best one?", it: "Ci piacerebbe un dolce. Qual è il vostro migliore?",
          o: [["Our tiramisù: it's the most popular dessert, and it's homemade.", 1, "Superlativo e un buon motivo in più: homemade."], ["The tiramisù is more popular dessert.", 0, "Superlativo: the most popular."], ["All the desserts are the same.", 0, "Il cliente vuole sentirsi consigliato."]] },
        { dice: "That was the best dinner of our holiday!", it: "È stata la cena migliore della nostra vacanza!",
          o: [["Thank you very much! I'm so glad you enjoyed it.", 1, "Ringrazi con calore: il cliente tornerà."], ["Yes, I know.", 0, "Suona presuntuoso: ringrazia."], ["It was better than you think.", 0, "Non serve: ringrazia e basta."]] }
      ],
      esiti: ["La coppia lascia una recensione a cinque stelle: «The best waiter in Dublin!»", "«Thank you, a lovely evening.» Ottimo lavoro.", "«It was OK.» Ripassa comparativi e superlativi e riprova.", "La coppia esce poco convinta. Rifai la lezione e riprova!"]
    },
    verifica: [
      { tipo: "traduci", titolo: "Scrivi l'aggettivo in inglese", punti: 1,
        voci: [["leggero", "light"], ["piccante", "spicy"], ["secco (vino)", "dry"], ["corposo", "full-bodied"], ["croccante", "crispy"], ["fatto in casa", "homemade"], ["dolce", "sweet"], ["tenero", "tender"], ["delicato", "delicate"], ["sostanzioso", "rich"]] },
      { tipo: "scelta", titolo: "Scegli la forma corretta", punti: 1,
        voci: [
          { d: "The fish is _____ than the meat. (leggero)", o: ["lighter", "more light", "lightest"] },
          { d: "This is _____ wine on the list. (il migliore)", o: ["the best", "the better", "the most good"] },
          { d: "The red wine is _____ than the white. (costoso)", o: ["more expensive", "expensiver", "most expensive"] },
          { d: "The tiramisù is our _____ dessert. (più richiesto)", o: ["most popular", "more popular", "popularest"] },
          { d: "The chilli pasta is _____ than the carbonara. (piccante)", o: ["spicier", "spicyer", "spiciest"] },
          { d: "This bread is _____ than yesterday's. (fresco)", o: ["fresher", "more fresher", "freshest"] },
          { d: "That was _____ steak of my life! (la peggiore)", o: ["the worst", "the worse", "the baddest"] },
          { d: "The chicken is as light _____ the fish.", o: ["as", "than", "of"] }
        ] },
      { tipo: "traduci", titolo: "Traduci in inglese", punti: 2,
        voci: [["Il pesce è più leggero della carne.", "The fish is lighter than the meat."], ["Le consiglio il risotto.", "I recommend the risotto."], ["È il nostro dolce più richiesto.", "It's our most popular dessert."], ["Questo vino è meno costoso.", "This wine is less expensive."], ["Il tiramisù è fatto in casa.", "The tiramisù is homemade."], ["Questo è il vino migliore della carta.", "This is the best wine on the list."]] },
      { tipo: "aperta", titolo: "Al tavolo", punti: 5,
        testo: "Un cliente ti chiede un consiglio. Scrivi in inglese un breve dialogo (almeno sei battute) in cui confronti due piatti e due vini, con almeno due comparativi e un superlativo.",
        facile: "Scrivi in inglese tre frasi per consigliare un piatto. Usa: lighter than, more … than, the best." }
    ]
  },
  /* ───────────────────────── SPAGNOLO ───────────────────────── */
  es: {
    schede: [
      { titolo: "«¿Qué me recomienda?»", testo: "È la domanda che ogni cameriere sente ogni sera. Con i clienti si usa il **lei** (usted). Rispondere «è tutto buono» non basta: chi consiglia bene **confronta** e **spiega**.",
        esempi: [["¿Qué me recomienda?", "Che cosa mi consiglia?", "che me recomiènda"], ["La lubina es más ligera que el chuletón, y nuestro tiramisú es el mejor de la ciudad.", "Il branzino è più leggero della bistecca, e il nostro tiramisù è il migliore della città.", ""]],
        domanda: { testo: "Consigliare bene vuol dire…", o: ["confrontare e spiegare", "dire «è tutto buono»", "indicare il piatto più caro"], spiega: "Il cliente si fida di chi gli spiega le differenze." } },
      { titolo: "Più, meno, tanto quanto", testo: "**más** + aggettivo + **que** (più… di) · **menos** + aggettivo + **que** (meno… di) · **tan** + aggettivo + **como** (… quanto).\nL'aggettivo si accorda: el pescado más ligero, la tarta más ligera.",
        esempi: [["El pescado es más ligero que la carne.", "Il pesce è più leggero della carne.", "el pescàdo es màs lihèro che la càrne"], ["Este vino es menos caro que el otro.", "Questo vino è meno caro dell'altro.", ""], ["La pasta es tan buena como en Italia.", "La pasta è buona come in Italia.", ""]],
        domanda: { testo: "«Il pesce è più fresco della carne»", o: ["El pescado es más fresco que la carne.", "El pescado es más fresco de la carne.", "El pescado es más fresco como la carne."], spiega: "Il paragone si fa con que: más fresco que." } },
      { titolo: "Migliore e peggiore", testo: "Alcuni comparativi sono irregolari: bueno → **mejor**, malo → **peor**. Non si dice «más mejor»!\nPer il migliore: **el mejor / la mejor**, e il resto si accorda: el plato más pedido, la tarta más rica.",
        esempi: [["Este vino es mejor que el de la casa.", "Questo vino è migliore di quello della casa.", ""], ["Es el mejor vino de la carta.", "È il vino migliore della carta.", "es el mehòr vìno de la càrta"], ["Es nuestro plato más pedido.", "È il nostro piatto più richiesto.", ""]],
        domanda: { testo: "«Il vino migliore»", o: ["el mejor vino", "el más mejor vino", "el bueno vino"], spiega: "Mejor è già «più buono»: el mejor vino." } },
      { titolo: "Il più… e i «buonissimo»", testo: "Per dire «il più… di»: **el / la** + nome + **más** + aggettivo + **de**: la lubina es el pescado más fresco de hoy.\nPer dire «molto, moltissimo» si aggiunge **-ísimo**: rico → **riquísimo**, bueno → **buenísimo**. Senza articolo: *¡Está riquísimo!*",
        esempi: [["Es el plato más típico de la casa.", "È il piatto più tipico della casa.", ""], ["Este jamón está riquísimo.", "Questo prosciutto è buonissimo.", "èste hamòn està rrichìsimo"], ["La lubina es el pescado más fresco de hoy.", "Il branzino è il pesce più fresco di oggi.", ""]],
        domanda: { testo: "«È buonissimo!»", o: ["¡Está buenísimo!", "¡Está más bueno!", "¡Está muy buenísimo!"], spiega: "-ísimo vuol già dire «molto»: niente muy." } },
      { titolo: "Le parole del gusto", testo: "Tocca 🔊 e ripeti: servono per descrivere un piatto o un vino.",
        esempi: [["ligero", "leggero", "lihèro"], ["contundente", "sostanzioso", "contundènte"], ["picante", "piccante", "picànte"], ["dulce", "dolce", "dùlthe"], ["seco", "secco (vino)", "sèco"], ["con cuerpo", "corposo", "con cuèrpo"], ["suave", "delicato", "suàve"], ["crujiente", "croccante", "cruhiènte"], ["tierno", "tenero", "tièrno"], ["casero", "fatto in casa", "casèro"]],
        domanda: { testo: "Un vino «con cuerpo» è…", o: ["corposo", "dolce", "frizzante"], spiega: "Con cuerpo = corposo, di struttura." } },
      { titolo: "Le frasi per consigliare", testo: "Formule cortesi, con il lei, pronte da usare al tavolo.",
        esempi: [["Le recomiendo la lubina.", "Le consiglio il branzino.", "le recomièndo la lubìna"], ["Si le gusta el pescado, pruebe el arroz con gambas.", "Se le piace il pesce, provi il riso con i gamberi.", ""], ["Va muy bien con un vino blanco seco.", "Si abbina molto bene a un bianco secco.", ""], ["Es la especialidad del chef.", "È la specialità dello chef.", ""], ["¿Quiere probar el vino primero?", "Desidera assaggiare prima il vino?", ""]],
        domanda: { testo: "Il cliente vuole qualcosa di leggero. Che cosa dici?", o: ["Le recomiendo la lubina a la plancha: es más ligera que la lasaña.", "Tome la lasaña, es la más contundente.", "No sé."], spiega: "Consigli, confronti e spieghi il perché." } },
      { titolo: "In tasca", testo: "**más … que** · **menos … que** · **tan … como**.\n**Irregolari**: mejor, peor (mai «más mejor»).\n**Il più**: el plato más fresco **de** hoy.\n**Moltissimo**: riquísimo, buenísimo (senza muy).\nCon il cliente il **lei**: *Le recomiendo… · ¿Quiere probar…?*",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "Le parole del gusto", consegna: "Tocca un aggettivo e poi il suo significato.",
        coppie: [["ligero", "leggero"], ["picante", "piccante"], ["seco", "secco"], ["con cuerpo", "corposo"], ["crujiente", "croccante"], ["casero", "fatto in casa"]] },
      { tipo: "scelta", titolo: "Più, meno, tanto quanto", consegna: "Scegli la forma giusta.",
        voci: [
          { d: "El pescado es más ligero _____ la carne.", o: ["que", "de", "como"] },
          { d: "Este vino es _____ que el vino de la casa. (migliore)", o: ["mejor", "más mejor", "bueno"] },
          { d: "La tarta es _____ dulce como el helado. (altrettanto)", o: ["tan", "más", "muy"] },
          { d: "La paella es _____ cara que el marisco. (meno)", o: ["menos", "más poco", "poco"] },
          { d: "Este plato está _____ . (buonissimo)", o: ["buenísimo", "muy buenísimo", "más bueno"] },
          { d: "Las patatas bravas son _____ que las fritas. (più piccanti)", o: ["más picantes", "más picante", "picantes más"] }
        ] },
      { tipo: "completa", titolo: "Las sugerencias del día", consegna: "Il cameriere presenta i piatti del giorno: completa con la parola giusta.",
        testo: "Hoy tenemos dos sugerencias. La lubina es [más] ligera que el chuletón y está [riquísima]: ¡ha llegado esta mañana! El chuletón es [tan] tierno como siempre. De postre, la tarta de queso es la más pedida, pero para mí el flan es el [mejor]. Los dos van muy bien [con] una copa de vino dulce.",
        intrusi: ["muy", "peor"] },
      { tipo: "ordina", titolo: "El diálogo en la mesa", consegna: "Tocca le battute nell'ordine giusto.",
        passi: [["Buenas noches. ¿Ya han decidido?", "Buonasera. Avete già deciso?"], ["Todavía no. ¿Qué nos recomienda?", "Non ancora. Che cosa ci consiglia?"], ["Si les gusta el pescado, la lubina es lo más fresco de hoy.", "Se vi piace il pesce, il branzino è la cosa più fresca di oggi."], ["¿Es más ligera que la lasaña?", "È più leggero delle lasagne?"], ["Sí, mucho más ligera. Va muy bien con un blanco seco.", "Sì, molto più leggero. Si abbina bene a un bianco secco."], ["Perfecto, entonces tomamos la lubina.", "Perfetto, allora prendiamo il branzino."]] },
      { tipo: "scelta", titolo: "El mejor de la carta", consegna: "Scegli la forma giusta.",
        voci: [
          { d: "Es _____ vino de la carta. (il migliore)", o: ["el mejor", "el más mejor", "lo mejor"] },
          { d: "El tiramisú es el postre _____ pedido. (più)", o: ["más", "mejor", "muy"] },
          { d: "La lubina es el pescado más fresco _____ hoy.", o: ["de", "que", "como"] },
          { d: "¡Fue la _____ pizza de mi vida! (peggiore)", o: ["peor", "más mala", "peora"] },
          { d: "La pasta con trufa es el plato más _____ de la carta. (caro)", o: ["caro", "cara", "caros"] },
          { d: "Esta tarta está _____ . (buonissima)", o: ["riquísima", "riquísimo", "muy riquísima"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta il cliente", consegna: "Ascolta la domanda del cliente e scegli che cosa vuol dire.",
        voci: [
          { t: "¿Qué es más ligero, el pescado o la carne?", o: ["Che cosa è più leggero, il pesce o la carne?", "Il pesce è più caro della carne?", "Preferisco la carne al pesce."] },
          { t: "Quisiera algo menos picante.", o: ["Vorrei qualcosa di meno piccante.", "Vorrei qualcosa di più piccante.", "Vorrei qualcosa di più dolce."] },
          { t: "¿Este vino es más seco que el otro?", o: ["Questo vino è più secco dell'altro?", "Questo vino è più dolce dell'altro?", "Questo vino costa più dell'altro?"] },
          { t: "¿Cuál es su plato más pedido?", o: ["Qual è il vostro piatto più richiesto?", "Qual è il vostro piatto più caro?", "Qual è il piatto del giorno?"] },
          { t: "¡Es el mejor tiramisú que he probado nunca!", o: ["È il tiramisù più buono che abbia mai mangiato!", "Il tiramisù è troppo dolce!", "Vorrei un altro tiramisù."] }
        ] }
    ],
    missione: {
      titolo: "La mesa 7", chef: "Mesa 7", avatar: "🧑‍🤝‍🧑", domanda: "Che cosa rispondi?",
      intro: "Sei in stage in un ristorante italiano di Barcellona. Al tavolo 7 una coppia non sa che cosa scegliere e chiede consiglio a te. Con i clienti si usa il lei (usted, ustedes).",
      passi: [
        { dice: "Buenas noches. Queremos algo ligero. ¿Qué nos recomienda?", it: "Buonasera. Vorremmo qualcosa di leggero. Che cosa ci consiglia?",
          o: [["Les recomiendo la lubina a la plancha: es más ligera que la lasaña.", 1, "Consigli, confronti e spieghi: perfetto."], ["La lasaña: es el plato más contundente.", 0, "Hanno chiesto qualcosa di leggero!"], ["Todo está bueno.", 0, "Non è un consiglio: confronta due piatti."]] },
        { dice: "¿La lubina es fresca?", it: "Il branzino è fresco?",
          o: [["Sí, es el pescado más fresco de hoy: ha llegado esta mañana.", 1, "Superlativo giusto e una prova concreta."], ["Sí, es más fresca.", 0, "Più fresca di che cosa? Qui serve il superlativo: el pescado más fresco de hoy."], ["Sí, es la fresquísima.", 0, "Con -ísimo niente articolo: «Está fresquísima»."]] },
        { dice: "Mi mujer no come pescado. ¿Qué le recomienda?", it: "Mia moglie non mangia pesce. Che cosa le consiglia?",
          o: [["El pollo al limón: es tan ligero como la lubina.", 1, "tan … como = leggero quanto il branzino."], ["Que coma pescado igualmente.", 0, "Scortese: il cliente ha sempre l'ultima parola."], ["El chuletón: es más ligero que el pescado.", 0, "Una bistecca più leggera del pesce? Consiglio poco credibile."]] },
        { dice: "¿Qué vino va bien con la lubina?", it: "Quale vino si abbina al branzino?",
          o: [["Un blanco seco: nuestro albariño es más fresco que el chardonnay.", 1, "Abbinamento classico e confronto chiaro."], ["Un tinto con cuerpo: es el más fuerte.", 0, "Con un pesce delicato si consiglia di solito un bianco secco."], ["El agua es mejor que el vino.", 0, "Non tocca a te decidere per il cliente!"]] },
        { dice: "¿El albariño es caro?", it: "L'albariño è caro?",
          o: [["No, es menos caro que el chardonnay.", 1, "menos … que: meno caro."], ["No, es el más barato que.", 0, "Frase incompleta: «es más barato que el chardonnay» o «es el más barato de la carta»."], ["Sí, pero es el más mejor.", 0, "Mejor è già comparativo: el mejor."]] },
        { dice: "Queremos un postre. ¿Cuál es el mejor?", it: "Vorremmo un dolce. Qual è il migliore?",
          o: [["La tarta de queso: es la más pedida y es casera.", 1, "Superlativo e un buon motivo in più: casera."], ["La tarta de queso es más pedida postre.", 0, "Superlativo: el postre más pedido / la más pedida."], ["Todos los postres son iguales.", 0, "Il cliente vuole sentirsi consigliato."]] },
        { dice: "¡Ha sido la mejor cena de nuestras vacaciones!", it: "È stata la cena migliore delle nostre vacanze!",
          o: [["¡Muchísimas gracias! Me alegro mucho de que les haya gustado.", 1, "Ringrazi con calore: il cliente tornerà."], ["Sí, ya lo sé.", 0, "Suona presuntuoso: ringrazia."], ["Fue mejor de lo que creen.", 0, "Non serve: ringrazia e basta."]] }
      ],
      esiti: ["La coppia lascia una recensione a cinque stelle: «¡El mejor camarero de Barcelona!»", "«Gracias, una cena muy agradable.» Ottimo lavoro.", "«Estuvo bien.» Ripassa i comparativi e riprova.", "La coppia esce poco convinta. Rifai la lezione e riprova!"]
    },
    verifica: [
      { tipo: "traduci", titolo: "Scrivi l'aggettivo in spagnolo", punti: 1,
        voci: [["leggero", "ligero"], ["piccante", "picante"], ["secco (vino)", "seco"], ["corposo", "con cuerpo"], ["croccante", "crujiente"], ["fatto in casa", "casero"], ["dolce", "dulce"], ["tenero", "tierno"], ["delicato", "suave"], ["sostanzioso", "contundente"]] },
      { tipo: "scelta", titolo: "Scegli la forma corretta", punti: 1,
        voci: [
          { d: "El pescado es más ligero _____ la carne.", o: ["que", "de", "como"] },
          { d: "Es _____ vino de la carta. (il migliore)", o: ["el mejor", "el más mejor", "lo mejor"] },
          { d: "El tinto es _____ caro que el blanco. (più)", o: ["más", "mejor", "muy"] },
          { d: "La tarta de queso es el postre más _____ . (richiesto)", o: ["pedido", "pedida", "pedidos"] },
          { d: "Las patatas bravas son _____ que las fritas. (più piccanti)", o: ["más picantes", "más picante", "picantes más"] },
          { d: "El pollo es _____ ligero como el pescado. (altrettanto)", o: ["tan", "tanto", "más"] },
          { d: "¡Fue la _____ cena de mi vida! (peggiore)", o: ["peor", "más mala", "peora"] },
          { d: "Este jamón está _____ . (buonissimo)", o: ["riquísimo", "muy riquísimo", "el riquísimo"] }
        ] },
      { tipo: "traduci", titolo: "Traduci in spagnolo", punti: 2,
        voci: [["Il pesce è più leggero della carne.", "El pescado es más ligero que la carne."], ["Le consiglio il risotto.", "Le recomiendo el risotto."], ["È il nostro dolce più richiesto.", "Es nuestro postre más pedido."], ["Questo vino è meno caro.", "Este vino es menos caro."], ["La torta è fatta in casa.", "La tarta es casera."], ["Questo è il vino migliore della carta.", "Este es el mejor vino de la carta."]] },
      { tipo: "aperta", titolo: "En la mesa", punti: 5,
        testo: "Un cliente ti chiede un consiglio. Scrivi in spagnolo un breve dialogo (almeno sei battute, con il lei) in cui confronti due piatti e due vini, con almeno due comparativi e un superlativo.",
        facile: "Scrivi in spagnolo tre frasi per consigliare un piatto. Usa: más … que, tan … como, el mejor." }
    ]
  }
  }
}
];

/* le prossime lezioni, già annunciate nel catalogo */
window.LEZIONI_IN_ARRIVO = [
  { icona: "🛎️", ambito: "Accoglienza", titolo: "Il reclamo in hotel", sottotitolo: "I tempi del passato e le scuse formali", livello: "B1–B2", classi: "Triennio" }
];
