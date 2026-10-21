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
  lingue: {
  /* ───────────────────────── INGLESE ───────────────────────── */
  en: {
    luogo: "un ristorante di Londra",
    schede: [
      { titolo: "Il primo giorno in brigata", testo: "In cucina il tempo è poco e il rumore è tanto: gli ordini sono **brevissimi**. Ascolta lo chef e la risposta del commis.",
        esempi: [["Chop the onions, please!", "Trita le cipolle, per favore!"], ["Yes, chef!", "Sì, chef!"]],
        domanda: { testo: "In cucina gli ordini sono…", o: ["brevi e diretti", "lunghi e complicati", "sempre scritti"], spiega: "Poche parole, subito chiare: in servizio non c'è tempo per le frasi lunghe." } },
      { titolo: "L'ordine: il verbo e basta", testo: "Per dare un ordine in inglese usi il **verbo così com'è**, senza soggetto: **chop** (trita), **add** (aggiungi), **stir** (mescola). È uguale per una persona o per tutta la brigata.",
        esempi: [["Chop the onions.", "Trita le cipolle."], ["Add the salt.", "Aggiungi il sale."], ["Stir the sauce.", "Mescola il sugo."]],
        domanda: { testo: "Qual è l'ordine giusto?", o: ["Peel the potatoes.", "You peels the potatoes.", "Peeling the potatoes."], spiega: "Solo il verbo, all'inizio: Peel the potatoes." } },
      { titolo: "«Non farlo!»: don't + verbo", testo: "Per vietare metti **don't** davanti al verbo. Per essere gentile aggiungi **please**, all'inizio o alla fine.",
        esempi: [["Don't touch the oven!", "Non toccare il forno!"], ["Don't run in the kitchen.", "Non correre in cucina."], ["Wash your hands, please.", "Lavati le mani, per favore."]],
        domanda: { testo: "Come dici «Non aggiungere zucchero»?", o: ["Don't add sugar.", "No add sugar.", "Not add sugar."], spiega: "Il divieto si fa sempre con don't + verbo." } },
      { titolo: "Dieci verbi da cucina", testo: "Tocca 🔊 e ripeti ad alta voce. Sono gli ordini che sentirai più spesso.",
        esempi: [["chop", "trita"], ["slice", "affetta"], ["peel", "sbuccia"], ["wash", "lava"], ["stir", "mescola"], ["add", "aggiungi"], ["boil", "fai bollire"], ["fry", "friggi"], ["bake", "cuoci in forno"], ["pour", "versa"]],
        domanda: { testo: "«Peel» vuol dire…", o: ["sbuccia", "friggi", "versa"], spiega: "Peel = sbuccia: Peel the potatoes, peel the apples." } },
      { titolo: "Quanto ne metto?", testo: "Le quantità della ricetta. Per chiedere: **How much?** per ciò che non si conta (salt, flour, milk), **How many?** per ciò che si conta (eggs, onions).",
        esempi: [["a pinch of salt", "un pizzico di sale"], ["a spoonful of sugar", "un cucchiaio di zucchero"], ["200 grams of flour", "200 grammi di farina"], ["half a litre of milk", "mezzo litro di latte"], ["a clove of garlic", "uno spicchio d'aglio"], ["How many eggs do we need?", "Quante uova ci servono?"]],
        domanda: { testo: "«_____ eggs do we need?»", o: ["How many", "How much"], spiega: "Le uova si contano (one egg, two eggs): How many." } },
      { titolo: "Le parole della brigata", testo: "Brevi grida che evitano incidenti e tengono il ritmo. Si usano in tutte le cucine professionali.",
        esempi: [["Yes, chef!", "Sì, chef! (la risposta più tipica)"], ["Heard!", "Ricevuto!"], ["Behind!", "Dietro! (passo alle tue spalle)"], ["Hot pan!", "Padella calda, attenzione!"], ["Corner!", "Angolo! (sto girando l'angolo)"], ["Service, please!", "Si serve! (il piatto è pronto al pass)"]],
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
          o: [["Yes, chef!", 1, "La risposta di ogni buon commis."], ["Yes, mate!", 0, "«Mate» si dice tra amici: alla chef si risponde «Yes, chef!»."], ["What?", 0, "Suona brusco. Se non hai capito: «Sorry, chef, could you repeat that?»."]] },
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
  },
  /* ───────────────────────── FRANCESE ───────────────────────── */
  fr: {
    luogo: "un ristorante di Lione",
    schede: [
      { titolo: "Il primo giorno in brigata", testo: "In cucina il tempo è poco e il rumore è tanto: gli ordini sono **brevissimi**. Ascolta lo chef e la risposta del commis.",
        esempi: [["Hache l'oignon, s'il te plaît !", "Trita la cipolla, per favore!"], ["Oui, chef !", "Sì, chef!"]],
        domanda: { testo: "In cucina gli ordini sono…", o: ["brevi e diretti", "lunghi e complicati", "sempre scritti"], spiega: "Poche parole, subito chiare: in servizio non c'è tempo per le frasi lunghe." } },
      { titolo: "L'ordine con il «tu»", testo: "Tra colleghi in cucina ci si dà del tu. L'imperativo si ricava dal **tu** del presente; per i verbi in **-er** si toglie la **-s**: tu coupes → **coupe**, tu ajoutes → **ajoute**. Per gli altri verbi la forma resta uguale: tu bats → **bats**, tu fais → **fais**, tu mets → **mets**.\nNelle ricette scritte trovi spesso l'infinito: *Éplucher les pommes de terre.*",
        esempi: [["Coupe le pain.", "Taglia il pane."], ["Bats les œufs.", "Sbatti le uova."], ["Ajoute le sel.", "Aggiungi il sale."]],
        domanda: { testo: "Come si dice «lava» (da laver)?", o: ["Lave", "Laves", "Laver"], spiega: "Laver finisce in -er, quindi si toglie la -s: Lave !" } },
      { titolo: "Attenzione a questi", testo: "Alcuni verbi sono irregolari: **mets** (metti, da mettre), **fais** (fai, da faire), **prends** (prendi, da prendre).\nPer vietare: **ne… pas** attorno al verbo, da imparare come formula. Per essere gentile: **s'il te plaît**.",
        esempi: [["Mets de l'eau à bouillir.", "Metti l'acqua a bollire."], ["Remue la sauce.", "Mescola il sugo."], ["Ne touche pas le four !", "Non toccare il forno!"], ["Ne cours pas en cuisine !", "Non correre in cucina!"]],
        domanda: { testo: "Come dici «Non toccare il forno!»?", o: ["Ne touche pas le four !", "Ne pas touche le four !", "Touche ne pas le four !"], spiega: "Il divieto si forma con ne… pas attorno al verbo: ne touche pas, ne cours pas, n'ajoute pas." } },
      { titolo: "Dieci verbi da cucina", testo: "Tocca 🔊 e ripeti ad alta voce. Sono gli ordini che sentirai più spesso.",
        esempi: [["hache", "trita"], ["coupe", "taglia"], ["épluche", "sbuccia"], ["lave", "lava"], ["remue", "mescola"], ["ajoute", "aggiungi"], ["verse", "versa"], ["fais frire", "friggi"], ["enfourne", "cuoci in forno"], ["bats", "sbatti"]],
        domanda: { testo: "«Épluche» vuol dire…", o: ["sbuccia", "friggi", "versa"], spiega: "Épluche = sbuccia: Épluche les pommes de terre." } },
      { titolo: "Combien de… ?", testo: "Le quantità della ricetta. Per chiedere si usa **combien de** (non cambia mai) sia per ciò che non si conta (combien de sel, combien de farine) sia per ciò che si conta (combien d'œufs, combien d'oignons). Dopo la quantità c'è sempre **de** (o **d'** davanti a vocale): une pincée **de** sel, une gousse **d'**ail.",
        esempi: [["une pincée de sel", "un pizzico di sale"], ["une cuillère à soupe de sucre", "un cucchiaio di zucchero"], ["deux cents grammes de farine", "200 grammi di farina"], ["un demi-litre de lait", "mezzo litro di latte"], ["une gousse d'ail", "uno spicchio d'aglio"], ["Combien d'œufs faut-il ?", "Quante uova servono?"]],
        domanda: { testo: "«_____ œufs faut-il ?»", o: ["Combien d'", "Combien de", "Combien des"], spiega: "Davanti a vocale de diventa d': Combien d'œufs faut-il ?" } },
      { titolo: "Le parole della brigata", testo: "Brevi grida che evitano incidenti e tengono il ritmo. Si sentono in tutte le cucine professionali francesi.",
        esempi: [["Oui, chef !", "Ricevuto, chef! (la risposta più tipica)"], ["Derrière !", "Dietro! (passo alle tue spalle)"], ["Je passe !", "Passo! (fatemi passare)"], ["Attention, ça brûle !", "Attenzione, scotta!"], ["Table cinq, on envoie !", "Tavolo cinque, si parte! (si inizia a cucinare)"]],
        domanda: { testo: "Passi alle spalle di un collega con una pentola calda. Cosa dici?", o: ["Derrière ! Attention, ça brûle !", "Table cinq, on envoie !", "Oui, chef !"], spiega: "Derrière ! avvisa che sei dietro, «ça brûle» che porti qualcosa che scotta." } },
      { titolo: "In tasca", testo: "**Ordine** con il tu: verbi in -er → senza **-s** (coupe, ajoute).\nDa ricordare: **mets**, **fais**, **prends**.\n**Divieto**: *Ne touche pas ! Ne cours pas !*\n**Gentilezza**: s'il te plaît.\n**Combien de…** (sel, farine, œufs).\nAlla fine di ogni ordine: **Oui, chef !**",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "I verbi della cucina", consegna: "Tocca un verbo e poi il suo significato.",
        coppie: [["hache", "trita"], ["épluche", "sbuccia"], ["remue", "mescola"], ["verse", "versa"], ["enfourne", "cuoci in forno"], ["fais frire", "friggi"]] },
      { tipo: "scelta", titolo: "Dai l'ordine giusto", consegna: "Scegli la forma corretta.",
        voci: [
          { d: "_____ les carottes. (sbuccia)", o: ["Épluche", "Épluches", "Éplucher"] },
          { d: "_____ le four ! (non toccare)", o: ["Ne touche pas", "Ne touches pas", "Touche ne pas"] },
          { d: "_____ de l'eau à bouillir. (metti)", o: ["Mets", "Mettes", "Mettre"] },
          { d: "_____ les mains, s'il te plaît. (lavati)", o: ["Lave-toi", "Tu laves", "Je lave"] },
          { d: "_____ en cuisine ! (non correre)", o: ["Ne cours pas", "Ne courir pas", "Cours ne pas"] },
          { d: "_____ la sauce doucement. (mescola)", o: ["Remue", "Remues", "Remuer"] }
        ] },
      { tipo: "completa", titolo: "La vinaigrette", consegna: "Completa la ricetta: per ogni spazio scegli il verbo giusto.",
        testo: "[Mets] une cuillère à café de moutarde dans un bol. [Ajoute] une pincée de sel et du poivre. [Verse] un peu de vinaigre. [Fouette] bien le mélange. [Incorpore] l'huile d'olive petit à petit. [Goûte] la sauce, et c'est prêt !",
        intrusi: ["épluche", "enfourne"] },
      { tipo: "ordina", titolo: "L'omelette", consegna: "Tocca i passaggi nell'ordine giusto.",
        passi: [["Casse les œufs dans un bol.", "Rompi le uova in una ciotola."], ["Bats les œufs avec une pincée de sel.", "Sbatti le uova con un pizzico di sale."], ["Fais fondre le beurre dans la poêle.", "Fai sciogliere il burro nella padella."], ["Verse les œufs dans la poêle chaude.", "Versa le uova nella padella calda."], ["Replie l'omelette avec une spatule.", "Ripiega la frittata con una spatola."], ["Sers tout de suite, avec une salade !", "Servi subito, con un'insalata!"]] },
      { tipo: "scelta", titolo: "Les quantités", consegna: "Scegli la quantità che ha senso.",
        voci: [
          { d: "Ajoute _____ sel.", o: ["une pincée de", "un litre de", "une gousse de"] },
          { d: "Hache _____ ail.", o: ["une gousse d'", "une cuillère à soupe d'", "un demi-litre d'"] },
          { d: "Verse _____ lait.", o: ["un demi-litre de", "une pincée de", "une gousse de"] },
          { d: "Il nous faut deux cents _____ farine.", o: ["grammes de", "gousses de", "pincées de"] },
          { d: "_____ œufs faut-il ?", o: ["Combien d'", "Combien", "Combien des"] },
          { d: "_____ sel faut-il ?", o: ["Combien de", "Combien", "Combien du"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta lo chef", consegna: "Ascolta l'ordine e scegli che cosa vuol dire.",
        voci: [
          { t: "Épluche les pommes de terre.", o: ["Sbuccia le patate.", "Friggi le patate.", "Lava le patate."] },
          { t: "Ne touche pas le couteau !", o: ["Non toccare il coltello!", "Prendi il coltello!", "Lava il coltello!"] },
          { t: "Ajoute une cuillère à soupe de sucre.", o: ["Aggiungi un cucchiaio di zucchero.", "Aggiungi un pizzico di sale.", "Togli lo zucchero."] },
          { t: "Derrière ! Attention, ça brûle !", o: ["Dietro di te, attenzione: scotta!", "Il piatto è pronto!", "Accendi il forno!"] },
          { t: "Enfourne la tarte pendant trente minutes.", o: ["Cuoci la torta in forno per trenta minuti.", "Taglia la torta in trenta pezzi.", "Servi la torta tra trenta minuti."] }
        ] }
    ],
    missione: {
      titolo: "Il primo giorno in brigata", chef: "Chef Camille",
      intro: "Sei in stage in un ristorante di Lione. È il tuo primo giorno e la chef Camille ti dà gli ordini. Capisci che cosa vuole e reagisci nel modo giusto.",
      passi: [
        { dice: "Bonjour ! Mets ton tablier et lave-toi les mains, s'il te plaît.", it: "Buongiorno! Mettiti il grembiule e lavati le mani, per favore.",
          o: [["🧼 Ti metti il grembiule e ti lavi le mani.", 1, "Perfetto: igiene prima di tutto."], ["🔥 Accendi subito i fornelli.", 0, "Prima il grembiule e le mani: tablier = grembiule, lave-toi les mains = lavati le mani."], ["☕ Vai a prenderti un caffè.", 0, "Non è proprio il momento! La chef ti ha chiesto grembiule e mani pulite."]] },
        { dice: "Épluche cinq pommes de terre et coupe l'oignon.", it: "Sbuccia cinque patate e taglia la cipolla.",
          o: [["🥔 Sbucci cinque patate e tagli la cipolla.", 1, "Esatto: épluche = sbuccia, coupe = taglia."], ["🥔 Sbucci due patate e friggi la cipolla.", 0, "Cinq = cinque, coupe = taglia (friggere è faire frire)."], ["🧅 Tagli le patate e sbucci la cipolla.", 0, "Hai scambiato i verbi: épluche le patate, coupe la cipolla."]] },
        { dice: "C'est clair ?", it: "È chiaro?", domanda: "Che cosa rispondi?",
          o: [["Oui, chef !", 1, "La risposta di ogni buon commis."], ["Ouais, ça va.", 0, "«Ouais» è troppo familiare: alla chef si risponde «Oui, chef !»."], ["Quoi ?", 0, "Suona brusco. Se non hai capito: «Pardon, chef, vous pouvez répéter ?»."]] },
        { dice: "Ajoute une pincée de sel dans l'eau.", it: "Aggiungi un pizzico di sale nell'acqua.",
          o: [["🧂 Aggiungi un pizzico di sale.", 1, "Une pincée de sel = un pizzico di sale."], ["🥄 Aggiungi un cucchiaio di zucchero.", 0, "Sel è il sale, e une pincée è un pizzico."], ["🧂 Versi tutto il pacco di sale.", 0, "Une pincée è solo un pizzico!"]] },
        { situazione: "Devi passare alle spalle di un collega portando una pentola di acqua bollente.", domanda: "Che cosa dici?",
          o: [["Derrière ! Attention, ça brûle !", 1, "Così il collega non si gira all'improvviso: niente incidenti."], ["Table cinq, on envoie !", 0, "Quello lo dice chi coordina il servizio, per far partire un tavolo."], ["Ne touche pas !", 0, "Non basta: devi avvisare che sei dietro e che porti qualcosa che scotta."]] },
        { dice: "Combien d'œufs faut-il pour l'omelette ?", it: "Quante uova servono per l'omelette?", situazione: "Sulla ricetta leggi: 6 œufs · 1 kg de pommes de terre · 1 oignon.", domanda: "Che cosa rispondi?",
          o: [["Six œufs, chef.", 1, "Esatto: sei uova."], ["Six kilos, chef.", 0, "Le uova si contano: six œufs, non kilos."], ["Beaucoup œufs, chef.", 0, "Serve il numero: six œufs."]] },
        { dice: "Table cinq, on envoie ! Ne brûle pas l'oignon !", it: "Tavolo cinque, si parte! Non bruciare la cipolla!",
          o: [["🔥 Abbassi il fuoco sotto la cipolla.", 1, "Ne brûle pas = non bruciare: hai salvato la cipolla!"], ["🔥 Alzi il fuoco al massimo.", 0, "Così la bruci! Ne brûle pas = non bruciare."], ["🗑️ Butti via la cipolla.", 0, "Non serve buttarla: basta non bruciarla."]] }
      ],
      esiti: ["La chef ti stringe la mano: « Très bien ! À demain. »", "« Bon travail. » Domani torni, e andrà ancora meglio.", "« Bon… on s'entraîne demain. » Ripassa gli ordini e riprova.", "La chef soupire : « On recommence. » Rifai la lezione e riprova!"]
    },
  },
  /* ───────────────────────── SPAGNOLO ───────────────────────── */
  es: {
    luogo: "un ristorante di Madrid",
    schede: [
      { titolo: "Il primo giorno in brigata", testo: "In cucina il tempo è poco e il rumore è tanto: gli ordini sono **brevissimi**. Ascolta lo chef e la risposta del pinche (il commis).",
        esempi: [["¡Pica la cebolla, por favor!", "Trita la cipolla, per favore!"], ["¡Oído, chef!", "Ricevuto, chef!"]],
        domanda: { testo: "In cucina gli ordini sono…", o: ["brevi e diretti", "lunghi e complicati", "sempre scritti"], spiega: "Poche parole, subito chiare: in servizio non c'è tempo per le frasi lunghe." } },
      { titolo: "L'ordine con il «tú»", testo: "Tra colleghi in cucina ci si dà del tu. Verbi in **-ar** → finiscono in **-a**: cortar → **corta**. Verbi in **-er** e **-ir** → finiscono in **-e**: batir → **bate**, añadir → **añade**.\nNelle ricette scritte trovi spesso l'infinito: *Pelar las patatas.*",
        esempi: [["Corta el pan.", "Taglia il pane."], ["Bate los huevos.", "Sbatti le uova."], ["Añade la sal.", "Aggiungi il sale."]],
        domanda: { testo: "Come si dice «lava» (da lavar)?", o: ["Lava", "Lave", "Lavas"], spiega: "Lavar finisce in -ar, quindi: ¡Lava!" } },
      { titolo: "Attenzione a questi", testo: "Alcuni verbi cambiano: **pon** (metti, da poner), **haz** (fai, da hacer), **remueve** (mescola, da remover).\nPer vietare: **no** + una forma speciale, da imparare come formula. Per essere gentile: **por favor**.",
        esempi: [["Pon el agua a hervir.", "Metti l'acqua a bollire."], ["Remueve la salsa.", "Mescola il sugo."], ["¡No toques el horno!", "Non toccare il forno!"], ["¡No corras en la cocina!", "Non correre in cucina!"]],
        domanda: { testo: "Come dici «Non toccare il forno!»?", o: ["¡No toques el horno!", "¡No toca el horno!", "¡Toca no el horno!"], spiega: "Il divieto ha una forma tutta sua: no toques, no corras, no añadas." } },
      { titolo: "Dieci verbi da cucina", testo: "Tocca 🔊 e ripeti ad alta voce. Sono gli ordini che sentirai più spesso.",
        esempi: [["pica", "trita"], ["corta", "taglia"], ["pela", "sbuccia"], ["lava", "lava"], ["remueve", "mescola"], ["añade", "aggiungi"], ["fríe", "friggi"], ["hornea", "cuoci in forno"], ["echa", "versa, metti"], ["bate", "sbatti"]],
        domanda: { testo: "«Pela» vuol dire…", o: ["sbuccia", "friggi", "versa"], spiega: "Pela = sbuccia: Pela las patatas." } },
      { titolo: "¿Cuánto pongo?", testo: "Le quantità della ricetta. Per chiedere: **¿Cuánto? / ¿Cuánta?** per ciò che non si conta (cuánto azúcar, cuánta sal, cuánta harina), **¿Cuántos? / ¿Cuántas?** per ciò che si conta (cuántos huevos, cuántas cebollas). La parola si accorda con il nome.",
        esempi: [["una pizca de sal", "un pizzico di sale"], ["una cucharada de azúcar", "un cucchiaio di zucchero"], ["doscientos gramos de harina", "200 grammi di farina"], ["medio litro de leche", "mezzo litro di latte"], ["un diente de ajo", "uno spicchio d'aglio"], ["¿Cuántos huevos necesitamos?", "Quante uova ci servono?"]],
        domanda: { testo: "«¿_____ huevos necesitamos?»", o: ["Cuántos", "Cuánto"], spiega: "Le uova si contano: ¿Cuántos huevos?" } },
      { titolo: "Le parole della brigata", testo: "Brevi grida che evitano incidenti e tengono il ritmo. Si sentono in molte cucine professionali spagnole.",
        esempi: [["¡Oído, chef!", "Ricevuto, chef! (la risposta più tipica)"], ["¡Detrás!", "Dietro! (passo alle tue spalle)"], ["¡Paso!", "Passo! (fatemi passare)"], ["¡Cuidado, que quema!", "Attenzione, scotta!"], ["¡Marcha la mesa cinco!", "Via il tavolo cinque! (si inizia a cucinare)"]],
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
  }
  }
},
{
  id: "consigliare", icona: "🍷", ambito: "Sala", titolo: "Consigliare", sottotitolo: "Comparativi e superlativi",
  livello: "A2–B1", classi: "Biennio e triennio", durata: "1 ora",
  descrizione: "«Che cosa mi consiglia?»: confrontare piatti e vini, presentare il migliore della carta e convincere il cliente con garbo.",
  lingue: {
  /* ───────────────────────── INGLESE ───────────────────────── */
  en: {
    schede: [
      { titolo: "«What do you recommend?»", testo: "È la domanda che ogni cameriere sente ogni sera. Rispondere «è tutto buono» non basta: chi consiglia bene **confronta** e **spiega**.",
        esempi: [["What do you recommend?", "Che cosa mi consiglia?"], ["The sea bass is lighter than the steak, and our tiramisù is the best in town.", "Il branzino è più leggero della bistecca, e il nostro tiramisù è il migliore della città."]],
        domanda: { testo: "Consigliare bene vuol dire…", o: ["confrontare e spiegare", "dire «è tutto buono»", "indicare il piatto più caro"], spiega: "Il cliente si fida di chi gli spiega le differenze." } },
      { titolo: "Più… di: gli aggettivi corti", testo: "Con gli aggettivi corti aggiungi **-er** e poi **than**: light → **lighter than**, fresh → **fresher than**, cheap → **cheaper than**.\nSe finisce in -y diventa **-ier**: spicy → **spicier**. Alcuni raddoppiano: hot → **hotter**.",
        esempi: [["The fish is lighter than the meat.", "Il pesce è più leggero della carne."], ["This wine is cheaper than that one.", "Questo vino costa meno di quello."], ["The arrabbiata is spicier than the amatriciana.", "L'arrabbiata è più piccante dell'amatriciana."]],
        domanda: { testo: "«Il pesce è più fresco della carne»", o: ["The fish is fresher than the meat.", "The fish is more fresh than the meat.", "The fish is fresher of the meat."], spiega: "Fresh è corto: fresher, e il paragone si fa con than." } },
      { titolo: "Più… di: gli aggettivi lunghi", testo: "Con gli aggettivi lunghi usi **more … than**: more delicate, more expensive. Per «meno» usi **less**: less spicy. Per «tanto quanto» usi **as … as**: as good as.",
        esempi: [["The risotto is more delicate than the pasta.", "Il risotto è più delicato della pasta."], ["This red is less expensive than the champagne.", "Questo rosso è meno costoso dello champagne."], ["Our pizza is as good as the one in Naples!", "La nostra pizza è buona come a Napoli!"]],
        domanda: { testo: "«Più costoso»", o: ["more expensive", "expensiver", "most expensive"], spiega: "Expensive è lungo: more expensive (than)." } },
      { titolo: "Il migliore: i superlativi", testo: "Per dire «il più…»: **the -est** con gli aggettivi corti (the freshest), **the most** con quelli lunghi (the most popular).\nAttenzione agli irregolari: good → **better** → **the best**; bad → **worse** → **the worst**.",
        esempi: [["The tiramisù is our most popular dessert.", "Il tiramisù è il nostro dolce più richiesto."], ["This is the best wine on the list.", "Questo è il vino migliore della carta."], ["The sea bass is the freshest fish today.", "Il branzino è il pesce più fresco di oggi."]],
        domanda: { testo: "«Il migliore»", o: ["the best", "the goodest", "the most good"], spiega: "Good è irregolare: better, the best." } },
      { titolo: "Le parole del gusto", testo: "Tocca 🔊 e ripeti: servono per descrivere un piatto o un vino.",
        esempi: [["light", "leggero"], ["rich", "sostanzioso, ricco"], ["spicy", "piccante"], ["sweet", "dolce"], ["dry", "secco (vino)"], ["full-bodied", "corposo"], ["delicate", "delicato"], ["crispy", "croccante"], ["tender", "tenero"], ["homemade", "fatto in casa"]],
        domanda: { testo: "Un vino «full-bodied» è…", o: ["corposo", "dolce", "frizzante"], spiega: "Full-bodied = corposo, di struttura." } },
      { titolo: "Le frasi per consigliare", testo: "Formule cortesi, pronte da usare al tavolo.",
        esempi: [["I recommend the sea bass.", "Le consiglio il branzino."], ["If you like fish, try the risotto with prawns.", "Se le piace il pesce, provi il risotto ai gamberi."], ["It goes very well with a dry white wine.", "Si abbina molto bene a un bianco secco."], ["It's our chef's speciality.", "È la specialità del nostro chef."], ["Would you like to taste the wine first?", "Desidera assaggiare prima il vino?"]],
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
          o: [["No, it's less expensive than the Chardonnay.", 1, "Less … than: meno costoso."], ["No, it's cheapest.", 0, "Serve the cheapest (con l'articolo), oppure il confronto (cheaper than…)."], ["Yes, but it's the better.", 0, "Per «il migliore» tra molti serve the best: the better si usa solo tra due cose."]] },
        { dice: "We'd love a dessert. What's your best one?", it: "Ci piacerebbe un dolce. Qual è il vostro migliore?",
          o: [["Our tiramisù: it's the most popular dessert, and it's homemade.", 1, "Superlativo e un buon motivo in più: homemade."], ["The tiramisù is more popular dessert.", 0, "Superlativo: the most popular."], ["All the desserts are the same.", 0, "Il cliente vuole sentirsi consigliato."]] },
        { dice: "That was the best dinner of our holiday!", it: "È stata la cena migliore della nostra vacanza!",
          o: [["Thank you very much! I'm so glad you enjoyed it.", 1, "Ringrazia con calore: il cliente tornerà."], ["Yes, I know.", 0, "Suona presuntuoso: ringrazia."], ["It was better than you think.", 0, "Non serve: ringrazia e basta."]] }
      ],
      esiti: ["La coppia lascia una recensione a cinque stelle: «The best waiter in Dublin!»", "«Thank you, a lovely evening.» Ottimo lavoro.", "«It was OK.» Ripassa comparativi e superlativi e riprova.", "La coppia esce poco convinta. Rifai la lezione e riprova!"]
    },
  },
  /* ───────────────────────── FRANCESE ───────────────────────── */
  fr: {
    schede: [
      { titolo: "« Que me conseillez-vous ? »", testo: "È la domanda che ogni cameriere sente ogni sera. Con i clienti si usa il **lei** (vous). Rispondere «è tutto buono» non basta: chi consiglia bene **confronta** e **spiega**.",
        esempi: [["Que me conseillez-vous ?", "Che cosa mi consiglia?"], ["Le bar est plus léger que l'entrecôte, et notre tiramisu est le meilleur de la ville.", "Il branzino è più leggero della bistecca, e il nostro tiramisù è il migliore della città."]],
        domanda: { testo: "Consigliare bene vuol dire…", o: ["confrontare e spiegare", "dire «è tutto buono»", "indicare il piatto più caro"], spiega: "Il cliente si fida di chi gli spiega le differenze." } },
      { titolo: "Più, meno, tanto quanto", testo: "**plus** + aggettivo + **que** (più… di) · **moins** + aggettivo + **que** (meno… di) · **aussi** + aggettivo + **que** (… quanto).\nL'aggettivo si accorda: un poisson plus léger, une tarte plus légère.",
        esempi: [["Le poisson est plus léger que la viande.", "Il pesce è più leggero della carne."], ["Ce vin est moins cher que l'autre.", "Questo vino è meno caro dell'altro."], ["Les pâtes sont aussi bonnes qu'en Italie.", "La pasta è buona come in Italia."]],
        domanda: { testo: "«Il pesce è più fresco della carne»", o: ["Le poisson est plus frais que la viande.", "Le poisson est plus frais de la viande.", "Le poisson est plus frais comme la viande."], spiega: "Il paragone si fa con que: plus frais que." } },
      { titolo: "Migliore e peggiore", testo: "Alcuni comparativi sono irregolari: bon → **meilleur**, mauvais → **pire**. Non si dice «plus bon»! (Con i verbi e gli avverbi: bien → **mieux**.)\nPer il migliore: **le meilleur / la meilleure**, e il resto si accorda: le plat le plus demandé, la tarte la plus savoureuse.",
        esempi: [["Ce vin est meilleur que le vin de la maison.", "Questo vino è migliore di quello della casa."], ["C'est le meilleur vin de la carte.", "È il vino migliore della carta."], ["C'est notre plat le plus demandé.", "È il nostro piatto più richiesto."]],
        domanda: { testo: "«Il vino migliore»", o: ["le meilleur vin", "le plus meilleur vin", "le plus bon vin"], spiega: "Meilleur è già «più buono»: le meilleur vin." } },
      { titolo: "Il più… e il «buonissimo»", testo: "Per dire «il più… di»: **le / la** + nome + **le / la plus** + aggettivo + **de**: le bar est le poisson le plus frais **du** jour (de + le = **du**). Con meilleur basta un articolo: le meilleur plat du jour.\nPer dire «molto, moltissimo» si usa **très** o **vraiment**: très bon, vraiment bon. Alcuni aggettivi sono già forti: **délicieux**, **excellent**, **exquis**: *C'est délicieux !*",
        esempi: [["C'est le plat le plus typique de la maison.", "È il piatto più tipico della casa."], ["Ce jambon est délicieux.", "Questo prosciutto è buonissimo."], ["Le bar est le poisson le plus frais du jour.", "Il branzino è il pesce più fresco di oggi."]],
        domanda: { testo: "«È buonissimo!»", o: ["C'est délicieux !", "C'est plus bon !", "C'est très meilleur !"], spiega: "Délicieux è già «molto buono»; plus bon e très meilleur sono errori." } },
      { titolo: "Le parole del gusto", testo: "Tocca 🔊 e ripeti: servono per descrivere un piatto o un vino.",
        esempi: [["léger", "leggero"], ["copieux", "sostanzioso"], ["épicé", "piccante"], ["sucré", "dolce"], ["sec", "secco (vino)"], ["corsé", "corposo"], ["délicat", "delicato"], ["croustillant", "croccante"], ["tendre", "tenero"], ["fait maison", "fatto in casa"]],
        domanda: { testo: "Un vino «corsé» è…", o: ["corposo", "dolce", "frizzante"], spiega: "Corsé = corposo, di struttura." } },
      { titolo: "Le frasi per consigliare", testo: "Formule cortesi, con il lei, pronte da usare al tavolo.",
        esempi: [["Je vous recommande le bar.", "Le consiglio il branzino."], ["Si vous aimez le poisson, goûtez le risotto aux gambas.", "Se le piace il pesce, provi il risotto ai gamberi."], ["Il s'accorde très bien avec un vin blanc sec.", "Si abbina molto bene a un bianco secco."], ["C'est la spécialité du chef.", "È la specialità dello chef."], ["Voulez-vous goûter le vin d'abord ?", "Desidera assaggiare prima il vino?"]],
        domanda: { testo: "Il cliente vuole qualcosa di leggero. Che cosa dici?", o: ["Je vous recommande le bar grillé : il est plus léger que les lasagnes.", "Prenez les lasagnes, c'est le plus copieux.", "Je ne sais pas."], spiega: "Consigli, confronti e spieghi il perché." } },
      { titolo: "In tasca", testo: "**plus … que** · **moins … que** · **aussi … que**.\n**Irregolari**: meilleur, pire (mai «plus bon»).\n**Il più**: le plat le plus frais **du** jour (de + le = du).\n**Moltissimo**: très, vraiment; délicieux, excellent.\nCon il cliente il **vous**: *Je vous recommande… · Voulez-vous goûter… ?*",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "Le parole del gusto", consegna: "Tocca un aggettivo e poi il suo significato.",
        coppie: [["léger", "leggero"], ["épicé", "piccante"], ["sec", "secco"], ["corsé", "corposo"], ["croustillant", "croccante"], ["fait maison", "fatto in casa"]] },
      { tipo: "scelta", titolo: "Più, meno, tanto quanto", consegna: "Scegli la forma giusta.",
        voci: [
          { d: "Le poisson est plus léger _____ la viande.", o: ["que", "de", "comme"] },
          { d: "Ce vin est _____ que le vin de la maison. (migliore)", o: ["meilleur", "plus bon", "bon"] },
          { d: "La tarte est _____ sucrée que la glace. (altrettanto)", o: ["aussi", "plus", "très"] },
          { d: "Le homard est _____ cher que le saumon. (meno)", o: ["moins", "plus peu", "peu"] },
          { d: "Ce plat est _____ . (buonissimo)", o: ["délicieux", "très meilleur", "plus bon"] },
          { d: "Ces piments sont _____ que les poivrons. (più piccanti)", o: ["plus épicés", "plus épicé", "épicés plus"] }
        ] },
      { tipo: "completa", titolo: "Les suggestions du jour", consegna: "Il cameriere presenta i piatti del giorno: completa con la parola giusta.",
        testo: "Aujourd'hui, nous avons deux suggestions. Le bar est [plus] léger que l'entrecôte et il est [délicieux] : il est arrivé ce matin ! L'entrecôte est [aussi] tendre que d'habitude. En dessert, la tarte au citron est la plus demandée, mais pour moi la crème brûlée est la [meilleure]. Les deux vont très bien [avec] un verre de vin doux.",
        intrusi: ["très", "pire"] },
      { tipo: "ordina", titolo: "Le dialogue à table", consegna: "Tocca le battute nell'ordine giusto.",
        passi: [["Bonsoir. Vous avez déjà choisi ?", "Buonasera. Avete già scelto?"], ["Pas encore. Que nous conseillez-vous ?", "Non ancora. Che cosa ci consiglia?"], ["Si vous aimez le poisson, le bar est ce qu'il y a de plus frais aujourd'hui.", "Se vi piace il pesce, il branzino è la cosa più fresca di oggi."], ["Est-il plus léger que les lasagnes ?", "È più leggero delle lasagne?"], ["Oui, beaucoup plus léger. Il s'accorde bien avec un vin blanc sec.", "Sì, molto più leggero. Si abbina bene a un bianco secco."], ["Parfait, alors nous prenons le bar.", "Perfetto, allora prendiamo il branzino."]] },
      { tipo: "scelta", titolo: "Le meilleur de la carte", consegna: "Scegli la forma giusta.",
        voci: [
          { d: "C'est _____ vin de la carte. (il migliore)", o: ["le meilleur", "le plus meilleur", "le plus bon"] },
          { d: "Le tiramisu est le dessert _____ demandé. (più)", o: ["le plus", "le meilleur", "le très"] },
          { d: "Le bar est le poisson le plus frais _____ jour.", o: ["du", "que", "comme"] },
          { d: "C'était la _____ pizza de ma vie ! (peggiore)", o: ["pire", "plus pire", "plus mal"] },
          { d: "Les pâtes à la truffe sont le plat le plus _____ de la carte. (caro)", o: ["cher", "chère", "chers"] },
          { d: "Cette tarte est _____ . (buonissima)", o: ["délicieuse", "délicieux", "très meilleure"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta il cliente", consegna: "Ascolta la domanda del cliente e scegli che cosa vuol dire.",
        voci: [
          { t: "Qu'est-ce qui est plus léger, le poisson ou la viande ?", o: ["Che cosa è più leggero, il pesce o la carne?", "Il pesce è più caro della carne?", "Preferisco la carne al pesce."] },
          { t: "Je voudrais quelque chose de moins épicé.", o: ["Vorrei qualcosa di meno piccante.", "Vorrei qualcosa di più piccante.", "Vorrei qualcosa di più dolce."] },
          { t: "Ce vin est-il plus sec que l'autre ?", o: ["Questo vino è più secco dell'altro?", "Questo vino è più dolce dell'altro?", "Questo vino costa più dell'altro?"] },
          { t: "Quel est votre plat le plus demandé ?", o: ["Qual è il vostro piatto più richiesto?", "Qual è il vostro piatto più caro?", "Qual è il piatto del giorno?"] },
          { t: "C'est le meilleur tiramisu de ma vie !", o: ["È il tiramisù più buono della mia vita!", "Il tiramisù è troppo dolce!", "Vorrei un altro tiramisù."] }
        ] }
    ],
    missione: {
      titolo: "La table 7", chef: "Table 7", avatar: "🧑‍🤝‍🧑", domanda: "Che cosa rispondi?",
      intro: "Sei in stage in un ristorante italiano di Parigi. Al tavolo 7 una coppia non sa che cosa scegliere e chiede consiglio a te. Con i clienti si usa il lei (vous).",
      passi: [
        { dice: "Bonsoir. Nous voudrions quelque chose de léger. Que nous conseillez-vous ?", it: "Buonasera. Vorremmo qualcosa di leggero. Che cosa ci consiglia?",
          o: [["Je vous recommande le bar grillé : il est plus léger que les lasagnes.", 1, "Consigli, confronti e spieghi: perfetto."], ["Les lasagnes : c'est le plat le plus copieux.", 0, "Hanno chiesto qualcosa di leggero!"], ["Tout est bon.", 0, "Non è un consiglio: confronta due piatti."]] },
        { dice: "Le bar est-il frais ?", it: "Il branzino è fresco?",
          o: [["Oui, c'est le poisson le plus frais du jour : il est arrivé ce matin.", 1, "Superlativo giusto e una prova concreta."], ["Oui, il est plus frais.", 0, "Più fresco di che cosa? Qui serve il superlativo: le poisson le plus frais du jour."], ["Oui, il est très plus frais.", 0, "Très e plus non si mettono insieme: «il est très frais» oppure «le plus frais»."]] },
        { dice: "Ma femme ne mange pas de poisson. Que lui conseillez-vous ?", it: "Mia moglie non mangia pesce. Che cosa le consiglia?",
          o: [["Le poulet au citron : il est aussi léger que le bar.", 1, "aussi … que = leggero quanto il branzino."], ["Qu'elle mange du poisson quand même.", 0, "Scortese: il cliente ha sempre l'ultima parola."], ["L'entrecôte : elle est plus légère que le poisson.", 0, "Una bistecca più leggera del pesce? Consiglio poco credibile."]] },
        { dice: "Quel vin va bien avec le bar ?", it: "Quale vino si abbina al branzino?",
          o: [["Un blanc sec : notre muscadet est plus frais que le chardonnay.", 1, "Abbinamento classico e confronto chiaro."], ["Un rouge corsé : c'est le plus fort.", 0, "Con un pesce delicato si consiglia di solito un bianco secco."], ["L'eau est meilleure que le vin.", 0, "Non tocca a te decidere per il cliente!"]] },
        { dice: "Le muscadet est-il cher ?", it: "Il muscadet è caro?",
          o: [["Non, il est moins cher que le chardonnay.", 1, "moins … que: meno caro."], ["Non, c'est le moins cher que.", 0, "Frase incompleta: «il est moins cher que le chardonnay» o «c'est le moins cher de la carte»."], ["Oui, mais c'est le plus meilleur.", 0, "Meilleur è già comparativo: le meilleur."]] },
        { dice: "Nous voudrions un dessert. Lequel est le meilleur ?", it: "Vorremmo un dolce. Qual è il migliore?",
          o: [["La tarte au citron : c'est la plus demandée et elle est faite maison.", 1, "Superlativo e un buon motivo in più: faite maison."], ["La tarte au citron est plus demandée dessert.", 0, "Superlativo: le dessert le plus demandé / la plus demandée."], ["Tous les desserts sont pareils.", 0, "Il cliente vuole sentirsi consigliato."]] },
        { dice: "C'était le meilleur dîner de nos vacances !", it: "È stata la cena migliore delle nostre vacanze!",
          o: [["Merci mille fois ! Cela me fait vraiment plaisir.", 1, "Ringrazia con calore: il cliente tornerà."], ["Oui, je sais.", 0, "Suona presuntuoso: ringrazia."], ["C'était meilleur que vous ne croyez.", 0, "Non serve: ringrazia e basta."]] }
      ],
      esiti: ["La coppia lascia una recensione a cinque stelle: « Le meilleur serveur de Paris ! »", "« Merci, un dîner très agréable. » Ottimo lavoro.", "« C'était bien. » Ripassa i comparativi e riprova.", "La coppia esce poco convinta. Rifai la lezione e riprova!"]
    },
  },
  /* ───────────────────────── SPAGNOLO ───────────────────────── */
  es: {
    schede: [
      { titolo: "«¿Qué me recomienda?»", testo: "È la domanda che ogni cameriere sente ogni sera. Con i clienti si usa il **lei** (usted). Rispondere «è tutto buono» non basta: chi consiglia bene **confronta** e **spiega**.",
        esempi: [["¿Qué me recomienda?", "Che cosa mi consiglia?"], ["La lubina es más ligera que el chuletón, y nuestro tiramisú es el mejor de la ciudad.", "Il branzino è più leggero della bistecca, e il nostro tiramisù è il migliore della città."]],
        domanda: { testo: "Consigliare bene vuol dire…", o: ["confrontare e spiegare", "dire «è tutto buono»", "indicare il piatto più caro"], spiega: "Il cliente si fida di chi gli spiega le differenze." } },
      { titolo: "Più, meno, tanto quanto", testo: "**más** + aggettivo + **que** (più… di) · **menos** + aggettivo + **que** (meno… di) · **tan** + aggettivo + **como** (… quanto).\nL'aggettivo si accorda: el pescado más ligero, la tarta más ligera.",
        esempi: [["El pescado es más ligero que la carne.", "Il pesce è più leggero della carne."], ["Este vino es menos caro que el otro.", "Questo vino è meno caro dell'altro."], ["La pasta es tan buena como en Italia.", "La pasta è buona come in Italia."]],
        domanda: { testo: "«Il pesce è più fresco della carne»", o: ["El pescado es más fresco que la carne.", "El pescado es más fresco de la carne.", "El pescado es más fresco como la carne."], spiega: "Il paragone si fa con que: más fresco que." } },
      { titolo: "Migliore e peggiore", testo: "Alcuni comparativi sono irregolari: bueno → **mejor**, malo → **peor**. Non si dice «más mejor»!\nPer il migliore: **el mejor / la mejor**, e il resto si accorda: el plato más pedido, la tarta más rica.",
        esempi: [["Este vino es mejor que el de la casa.", "Questo vino è migliore di quello della casa."], ["Es el mejor vino de la carta.", "È il vino migliore della carta."], ["Es nuestro plato más pedido.", "È il nostro piatto più richiesto."]],
        domanda: { testo: "«Il vino migliore»", o: ["el mejor vino", "el más mejor vino", "el bueno vino"], spiega: "Mejor è già «più buono»: el mejor vino." } },
      { titolo: "Il più… e il «buonissimo»", testo: "Per dire «il più… di»: **el / la** + nome + **más** + aggettivo + **de**: la lubina es el pescado más fresco de hoy.\nPer dire «molto, moltissimo» si aggiunge **-ísimo**: rico → **riquísimo**, bueno → **buenísimo**. Senza articolo: *¡Está riquísimo!*",
        esempi: [["Es el plato más típico de la casa.", "È il piatto più tipico della casa."], ["Este jamón está riquísimo.", "Questo prosciutto è buonissimo."], ["La lubina es el pescado más fresco de hoy.", "Il branzino è il pesce più fresco di oggi."]],
        domanda: { testo: "«È buonissimo!»", o: ["¡Está buenísimo!", "¡Está más bueno!", "¡Está muy buenísimo!"], spiega: "-ísimo vuol già dire «molto»: niente muy." } },
      { titolo: "Le parole del gusto", testo: "Tocca 🔊 e ripeti: servono per descrivere un piatto o un vino.",
        esempi: [["ligero", "leggero"], ["contundente", "sostanzioso"], ["picante", "piccante"], ["dulce", "dolce"], ["seco", "secco (vino)"], ["con cuerpo", "corposo"], ["suave", "delicato"], ["crujiente", "croccante"], ["tierno", "tenero"], ["casero", "fatto in casa"]],
        domanda: { testo: "Un vino «con cuerpo» è…", o: ["corposo", "dolce", "frizzante"], spiega: "Con cuerpo = corposo, di struttura." } },
      { titolo: "Le frasi per consigliare", testo: "Formule cortesi, con il lei, pronte da usare al tavolo.",
        esempi: [["Le recomiendo la lubina.", "Le consiglio il branzino."], ["Si le gusta el pescado, pruebe el arroz con gambas.", "Se le piace il pesce, provi il riso con i gamberi."], ["Va muy bien con un vino blanco seco.", "Si abbina molto bene a un bianco secco."], ["Es la especialidad del chef.", "È la specialità dello chef."], ["¿Quiere probar el vino primero?", "Desidera assaggiare prima il vino?"]],
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
        { dice: "¿Está fresca la lubina?", it: "Il branzino è fresco?",
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
          o: [["¡Muchísimas gracias! Me alegro mucho de que les haya gustado.", 1, "Ringrazia con calore: il cliente tornerà."], ["Sí, ya lo sé.", 0, "Suona presuntuoso: ringrazia."], ["Fue mejor de lo que creen.", 0, "Non serve: ringrazia e basta."]] }
      ],
      esiti: ["La coppia lascia una recensione a cinque stelle: «¡El mejor camarero de Barcelona!»", "«Gracias, una cena muy agradable.» Ottimo lavoro.", "«Estuvo bien.» Ripassa i comparativi e riprova.", "La coppia esce poco convinta. Rifai la lezione e riprova!"]
    },
  }
  }
},
{
  id: "reclamo", icona: "🛎️", ambito: "Accoglienza", titolo: "Il reclamo in hotel", sottotitolo: "I tempi del passato e le scuse formali",
  livello: "B1–B2", classi: "Triennio", durata: "1 ora",
  descrizione: "Un ospite arrabbiato alla reception: ascoltare, scusarsi, raccontare che cosa è successo, proporre una soluzione e scrivere l'e-mail di scuse.",
  lingue: {
  /* ───────────────────────── INGLESE ───────────────────────── */
  en: {
    schede: [
      { titolo: "Un ospite arrabbiato", testo: "Alla reception arriva un ospite furioso. Non serve avere ragione: serve **ascoltare**, **scusarsi** e **trovare una soluzione**.",
        esempi: [["I booked a sea-view room and I've got a room facing the car park!", "Ho prenotato una camera vista mare e mi avete dato una camera sul parcheggio!"], ["I'm terribly sorry, sir. Let me see what I can do.", "Mi dispiace moltissimo, signore. Vediamo che cosa posso fare."]],
        domanda: { testo: "Davanti a un reclamo la prima cosa da fare è…", o: ["ascoltare e scusarsi", "spiegare che non è colpa tua", "chiamare subito il direttore"], spiega: "Prima si ascolta e ci si scusa; le spiegazioni vengono dopo, e brevi." } },
      { titolo: "Che cosa è successo: il past simple", testo: "Per i fatti conclusi in un momento preciso (**last night**, **this morning**, **when I arrived**) usi il past simple: regolari in **-ed** (booked, waited), irregolari da imparare (got, found, was, had).\nNegativa: **didn't** + verbo.",
        esempi: [["I booked a double room.", "Ho prenotato una camera doppia."], ["The shower didn't work last night.", "Ieri sera la doccia non funzionava."], ["We waited for forty minutes.", "Abbiamo aspettato quaranta minuti."]],
        domanda: { testo: "«Ieri sera il riscaldamento non funzionava»", o: ["The heating didn't work last night.", "The heating hasn't worked last night.", "The heating didn't worked last night."], spiega: "Last night = past simple; dopo didn't il verbo resta base: didn't work." } },
      { titolo: "Che cosa ho fatto: il present perfect", testo: "Per un'azione appena fatta, che conta **adesso**, usi **have / has** + participio: I've called, we've changed. Con **just** (appena) e **already** (già).\nAttenzione: con yesterday, last night, two days ago **mai** il present perfect.",
        esempi: [["I've just called maintenance.", "Ho appena chiamato la manutenzione."], ["We've already changed your room.", "Le abbiamo già cambiato la camera."], ["Has anyone helped you?", "Qualcuno l'ha già aiutata?"]],
        domanda: { testo: "«Ho appena parlato con il direttore»", o: ["I've just spoken to the manager.", "I've just spoke to the manager.", "I have spoken to the manager last night."], spiega: "Have + participio (spoken); e niente last night con il present perfect." } },
      { titolo: "Scusarsi da professionista", testo: "Le formule della reception: cortesi, calme, mai sulla difensiva.",
        esempi: [["I'm terribly sorry.", "Mi dispiace moltissimo."], ["I do apologise for the inconvenience.", "Mi scuso davvero per il disagio."], ["I'm afraid there's been a mistake.", "Temo che ci sia stato un errore."], ["I completely understand.", "La capisco perfettamente."], ["Thank you for letting us know.", "Grazie per avercelo segnalato."]],
        domanda: { testo: "Qual è la scusa più professionale?", o: ["I do apologise for the inconvenience.", "Sorry, it's not my fault.", "Oops, sorry!"], spiega: "Formale e senza cercare colpevoli." } },
      { titolo: "Proporre una soluzione", testo: "Dopo le scuse, sempre una **proposta concreta**.",
        esempi: [["Would you like me to change your room?", "Vuole che le cambi la camera?"], ["Let me upgrade you to a superior room.", "Le assegno una camera superiore."], ["I'll send someone up straight away.", "Mando subito qualcuno in camera."], ["We'd be happy to offer you a free dinner.", "Saremmo lieti di offrirle una cena."], ["I'll make sure it doesn't happen again.", "Mi assicurerò che non succeda più."]],
        domanda: { testo: "L'aria condizionata è rotta. Che cosa dici?", o: ["I'm so sorry. I'll send a technician straight away, or would you like a different room?", "The technician comes tomorrow.", "All the rooms are the same."], spiega: "Scuse, soluzione subito e un'alternativa." } },
      { titolo: "Le parole del reclamo", testo: "Tocca 🔊 e ripeti.",
        esempi: [["complaint", "reclamo"], ["booking", "prenotazione"], ["refund", "rimborso"], ["discount", "sconto"], ["upgrade", "camera superiore"], ["inconvenience", "disagio"], ["noisy", "rumoroso"], ["dirty", "sporco"], ["broken", "rotto"], ["maintenance", "manutenzione"]],
        domanda: { testo: "«Refund» vuol dire…", o: ["rimborso", "sconto", "reclamo"], spiega: "Refund = rimborso, discount = sconto." } },
      { titolo: "In tasca: il metodo LAST", testo: "**L**isten · ascolta senza interrompere.\n**A**pologise · *I'm terribly sorry / I do apologise.*\n**S**olve · *Would you like me to…? / I'll send someone…*\n**T**hank · *Thank you for letting us know.*\nChe cosa è successo → **past simple** (didn't work). Che cosa ho appena fatto → **present perfect** (I've just called).",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "Le parole del reclamo", consegna: "Tocca una parola e poi il suo significato.",
        coppie: [["complaint", "reclamo"], ["refund", "rimborso"], ["upgrade", "camera superiore"], ["noisy", "rumoroso"], ["broken", "rotto"], ["discount", "sconto"]] },
      { tipo: "scelta", titolo: "Past simple o present perfect?", consegna: "Scegli il tempo giusto.",
        voci: [
          { d: "The air conditioning _____ last night. (non funzionava)", o: ["didn't work", "hasn't worked", "doesn't worked"] },
          { d: "_____ maintenance: they're on their way. (ho appena chiamato)", o: ["I've just called", "I just have called", "I called just"] },
          { d: "When we _____ , the room wasn't ready. (siamo arrivati)", o: ["arrived", "have arrived", "arrive"] },
          { d: "We _____ your room. It's ready now. (abbiamo già cambiato)", o: ["have already changed", "already change", "had changing"] },
          { d: "I _____ a sea-view room two weeks ago. (ho prenotato)", o: ["booked", "have booked", "book"] },
          { d: "The guest in room 12 _____ about the noise three times today. (si è lamentato)", o: ["has complained", "complain", "is complain"] }
        ] },
      { tipo: "completa", titolo: "L'e-mail di scuse", consegna: "Completa l'e-mail della responsabile del ricevimento.",
        testo: "Dear Mr Wilson, Thank you for [letting] us know about the problems during your stay. I am terribly [sorry] that the shower [didn't] work during your first night. Our maintenance team [has] already repaired it, and we would be happy to [offer] you a free dinner in our restaurant. I will personally make [sure] that this does not happen again. Kind regards, Giulia Rossi, Front Office Manager",
        intrusi: ["apologise", "hasn't"] },
      { tipo: "ordina", titolo: "Il reclamo, passo per passo", consegna: "Tocca le battute nell'ordine giusto.",
        passi: [["Excuse me, my room is very noisy. I couldn't sleep last night.", "Scusi, la mia camera è molto rumorosa. Stanotte non ho dormito."], ["I'm terribly sorry to hear that. What exactly happened?", "Mi dispiace moltissimo. Che cosa è successo esattamente?"], ["There was loud music from the bar until two in the morning.", "C'era musica alta dal bar fino alle due di notte."], ["I completely understand. Would you like me to move you to a quieter room?", "La capisco perfettamente. Vuole che la sposti in una camera più tranquilla?"], ["Yes, please. On a higher floor, if possible.", "Sì, grazie. A un piano più alto, se possibile."], ["Of course. I've just found a room on the fifth floor. Thank you for letting us know.", "Certo. Ho appena trovato una camera al quinto piano. Grazie per avercelo segnalato."]] },
      { tipo: "scelta", titolo: "La risposta giusta", consegna: "L'ospite si lamenta: scegli la risposta più professionale.",
        voci: [
          { d: "«The room is dirty!»", o: ["I do apologise. I'll send housekeeping straight away.", "That's impossible, we cleaned it.", "OK, clean it yourself."] },
          { d: "«There's no hot water!»", o: ["I'm so sorry. I'll call maintenance right now.", "Hot water is extra.", "Wait until tomorrow."] },
          { d: "«I booked a sea view!»", o: ["I'm afraid there's been a mistake. Let me upgrade you.", "You're wrong, you didn't.", "The sea isn't important."] },
          { d: "«We waited forty minutes for breakfast!»", o: ["I'm terribly sorry. Breakfast is on us today.", "The kitchen is busy, sorry.", "Next time come earlier."] },
          { d: "«Can I have a refund?»", o: ["I'll speak to the manager and get back to you within the hour.", "No refunds, ever.", "Ask someone else."] },
          { d: "«Thank you, you've been very helpful.»", o: ["You're welcome. Thank you for your patience.", "Yes, I know.", "Finally!"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta l'ospite", consegna: "Ascolta il reclamo e scegli che cosa vuol dire.",
        voci: [
          { t: "The air conditioning in my room isn't working.", o: ["L'aria condizionata in camera non funziona.", "L'aria condizionata è troppo forte.", "Vorrei l'aria condizionata in camera."] },
          { t: "I've been waiting for my room for over an hour.", o: ["Aspetto la mia camera da più di un'ora.", "Ho aspettato un'ora per il taxi.", "La mia camera è pronta da un'ora."] },
          { t: "The people next door were very noisy last night.", o: ["I vicini di camera hanno fatto molto rumore ieri sera.", "Ieri sera i vicini sono partiti.", "Ieri sera il bar era chiuso."] },
          { t: "I'd like to speak to the manager, please.", o: ["Vorrei parlare con il direttore, per favore.", "Vorrei cambiare camera, per favore.", "Vorrei pagare il conto, per favore."] },
          { t: "We were charged twice for the minibar.", o: ["Ci avete addebitato due volte il minibar.", "Il minibar era vuoto.", "Abbiamo usato due volte il minibar."] }
        ] }
    ],
    missione: {
      titolo: "Il turno di sera", chef: "Mrs Taylor", avatar: "👩", domanda: "Che cosa rispondi?",
      intro: "Sei in stage alla reception di un hotel di Edimburgo. È sera e arriva la signora Taylor, molto arrabbiata. Applica il metodo LAST: ascolta, scusati, risolvi, ringrazia.",
      passi: [
        { dice: "Excuse me! I booked a room with a view of the castle, and I've got a room facing the car park!", it: "Scusi! Ho prenotato una camera con vista sul castello e mi avete dato una camera sul parcheggio!",
          o: [["I'm terribly sorry, madam. Let me check your booking straight away.", 1, "Ti scusi e ti attivi subito."], ["That's not possible. You booked a standard room.", 0, "Anche se fosse vero, prima ci si scusa e si verifica."], ["The car park view is very nice too.", 0, "Suona ironico: l'ospite si sente presa in giro."]] },
        { dice: "Here's my confirmation email. It clearly says 'castle view'.", it: "Ecco l'e-mail di conferma. C'è scritto chiaramente «vista castello».",
          o: [["You're absolutely right. I'm afraid there's been a mistake on our side.", 1, "Ammetti l'errore con una formula professionale."], ["The computer made the mistake, not me.", 0, "All'ospite non interessa di chi sia la colpa."], ["Emails are often wrong.", 0, "Metti in dubbio l'ospite: peggio di prima."]] },
        { dice: "So what are you going to do about it?", it: "Allora, che cosa pensate di fare?",
          o: [["I've just checked: we have a superior room with a castle view. I'd be happy to upgrade you at no extra cost.", 1, "Present perfect (I've just checked) e una soluzione generosa."], ["Nothing, the hotel is full.", 0, "Mai lasciare l'ospite senza una soluzione."], ["You can change hotel if you want.", 0, "Così perdi la cliente."]] },
        { dice: "That's better. But I waited twenty minutes at reception!", it: "Così va meglio. Ma ho aspettato venti minuti alla reception!",
          o: [["I do apologise for the wait. A large group arrived at the same time.", 1, "Scusa e breve spiegazione al past simple (arrived)."], ["Twenty minutes isn't a long time.", 0, "Minimizzare irrita."], ["I have waited too, every day.", 0, "Fuori luogo: stai parlando di te."]] },
        { dice: "And the Wi-Fi didn't work in the other room.", it: "E nell'altra camera il Wi-Fi non funzionava.",
          o: [["I'm sorry about that. I'll ask our technician to check it, and here's the password for your new room.", 1, "Scusa, soluzione e un aiuto concreto."], ["The Wi-Fi works, you're doing it wrong.", 0, "Mai dare la colpa all'ospite."], ["Wi-Fi isn't included.", 0, "Falso e scortese."]] },
        { dice: "Well… thank you. You've been very kind.", it: "Be'… grazie. Molto gentile da parte sua.",
          o: [["Thank you for your patience, madam. Please enjoy your stay.", 1, "Thank: chiudi ringraziando."], ["Finally you're happy!", 0, "Inopportuno."], ["You're welcome. Next time read your booking more carefully.", 0, "Una frecciata che rovina tutto."]] },
        { situazione: "Il giorno dopo il direttore ti chiede di scrivere una riga nel registro dei reclami.", domanda: "Che cosa scrivi?",
          o: [["The guest in room 214 complained about the view. We upgraded her to a superior room.", 1, "Past simple: fatti conclusi, chiari e oggettivi."], ["The guest has complained yesterday and we have upgraded her.", 0, "Con yesterday si usa il past simple: complained, upgraded."], ["Angry woman, problem solved.", 0, "Troppo vago e poco professionale."]] }
      ],
      esiti: ["La signora Taylor scrive una recensione: «A fantastic receptionist turned a problem into a great stay!»", "«Thank you, everything is fine now.» Ottimo lavoro.", "«Well, it's OK…» Ripassa le scuse e il present perfect, poi riprova.", "La signora chiede di parlare con il direttore. Rifai la lezione e riprova!"]
    },
  },
  /* ───────────────────────── FRANCESE ───────────────────────── */
  fr: {
    schede: [
      { titolo: "Un ospite arrabbiato", testo: "Alla reception arriva un ospite furioso. Non serve avere ragione: serve **ascoltare**, **scusarsi** e **trovare una soluzione**. Sempre con il **lei** (vous).",
        esempi: [["J'ai réservé une chambre avec vue sur la mer et on m'a donné une chambre sur le parking !", "Ho prenotato una camera vista mare e me ne avete data una sul parcheggio!"], ["Je vous présente mes excuses, monsieur. Laissez-moi voir ce que je peux faire.", "Le porgo le mie scuse, signore. Vediamo che cosa posso fare."]],
        domanda: { testo: "Davanti a un reclamo la prima cosa da fare è…", o: ["ascoltare e scusarsi", "spiegare che non è colpa tua", "chiamare subito il direttore"], spiega: "Prima si ascolta e ci si scusa; le spiegazioni vengono dopo, e brevi." } },
      { titolo: "Che cosa è successo: il passé composé", testo: "Per i fatti conclusi (**hier**, **hier soir**, **la semaine dernière**, **quand je suis arrivé**) si usa il **passé composé**: **avoir** al presente + participio passato: j'ai réservé, nous avons attendu, la douche n'a pas fonctionné.\nCon alcuni verbi di movimento (arriver, partir, rester, aller…) si usa **être**: nous sommes arrivés, elle est partie.\nParticipi irregolari frequenti: être → **été**, avoir → **eu**, faire → **fait**, prendre → **pris**.",
        esempi: [["J'ai réservé une chambre double.", "Ho prenotato una camera doppia."], ["Hier soir, la douche n'a pas fonctionné.", "Ieri sera la doccia non ha funzionato."], ["Nous avons attendu quarante minutes.", "Abbiamo aspettato quaranta minuti."]],
        domanda: { testo: "«Ieri sera il riscaldamento non ha funzionato»", o: ["Hier soir, le chauffage n'a pas fonctionné.", "Hier soir, le chauffage ne fonctionne pas.", "Hier soir, le chauffage n'avoir pas fonctionné."], spiega: "Con hier soir si usa il passé composé: n'a pas fonctionné." } },
      { titolo: "Che cosa ho appena fatto: venir de", testo: "Per ciò che si è **appena** fatto: **venir de** al presente + infinito: **je viens de** appeler, **nous venons de** changer.\nPer ciò che è già fatto si usa il passé composé con **déjà**: nous avons déjà changé votre chambre.",
        esempi: [["J'ai appelé l'entretien.", "Ho chiamato la manutenzione."], ["Nous avons déjà changé votre chambre.", "Le abbiamo già cambiato la camera."], ["Je viens de parler avec le directeur.", "Ho appena parlato con il direttore."]],
        domanda: { testo: "«Ho appena parlato con il direttore»", o: ["Je viens de parler avec le directeur.", "Je viens parler avec le directeur.", "J'ai venu de parler avec le directeur."], spiega: "Je viens de + infinito: je viens de parler." } },
      { titolo: "Com'era la situazione: l'imparfait", testo: "Per descrivere lo **sfondo** (com'era la camera, che cosa c'era) si usa l'**imparfait**: il y avait, c'était, la chambre était sale.\nIn una stessa frase si mescolano: *La chambre était sale quand nous sommes arrivés.* (sfondo + fatto)",
        esempi: [["Il y avait beaucoup de bruit.", "C'era molto rumore."], ["La musique était trop forte.", "La musica era troppo alta."], ["La chambre était sale quand nous sommes arrivés.", "La camera era sporca quando siamo arrivati."]],
        domanda: { testo: "«C'era molto rumore»", o: ["Il y avait beaucoup de bruit.", "Il y a beaucoup de bruit.", "Il y aura beaucoup de bruit."], spiega: "Per descrivere la situazione di ieri si usa l'imparfait: il y avait." } },
      { titolo: "Scusarsi da professionista", testo: "Le formule della reception: cortesi, calme, mai sulla difensiva.",
        esempi: [["Nous sommes vraiment désolés.", "Siamo davvero spiacenti."], ["Je vous prie de m'excuser pour le dérangement.", "Le chiedo scusa per il disagio."], ["Je crains qu'il y ait eu une erreur.", "Temo che ci sia stato un errore."], ["Vous avez tout à fait raison.", "Ha perfettamente ragione."], ["Merci de nous l'avoir signalé.", "Grazie per avercelo segnalato."]],
        domanda: { testo: "Qual è la scusa più professionale?", o: ["Je vous prie de m'excuser pour le dérangement.", "Désolé, ce n'est pas ma faute.", "Oups, pardon !"], spiega: "Formale e senza cercare colpevoli." } },
      { titolo: "Proporre una soluzione", testo: "Dopo le scuse, sempre una **proposta concreta**. «Voulez-vous que je vous… ?» è una formula fissa (dopo **que** il verbo cambia forma), da imparare così.",
        esempi: [["Voulez-vous que je vous change de chambre ?", "Vuole che le cambi la camera?"], ["Nous vous offrons une chambre supérieure sans supplément.", "Le offriamo una camera superiore senza costi aggiuntivi."], ["J'envoie un technicien tout de suite.", "Le mando subito un tecnico."], ["Le dîner de ce soir est offert par la maison.", "La cena di stasera la offriamo noi."], ["Je veillerai à ce que cela ne se reproduise pas.", "Mi assicurerò che non succeda più."]],
        domanda: { testo: "L'aria condizionata è rotta. Che cosa dici?", o: ["Nous sommes vraiment désolés. J'envoie un technicien tout de suite ou, si vous préférez, je vous change de chambre.", "Le technicien vient demain.", "Toutes les chambres sont pareilles."], spiega: "Scuse, soluzione subito e un'alternativa." } },
      { titolo: "Le parole del reclamo", testo: "Tocca 🔊 e ripeti.",
        esempi: [["la plainte", "il reclamo"], ["la réservation", "la prenotazione"], ["le remboursement", "il rimborso"], ["la réduction", "lo sconto"], ["le dérangement", "il disagio"], ["bruyant", "rumoroso"], ["sale", "sporco"], ["cassé", "rotto"], ["l'entretien", "la manutenzione"], ["la chambre supérieure", "la camera superiore"]],
        domanda: { testo: "«Le remboursement» è…", o: ["il rimborso", "lo sconto", "il reclamo"], spiega: "Remboursement = rimborso, réduction = sconto." } },
      { titolo: "In tasca: il metodo in quattro passi", testo: "**Ascolta** senza interrompere.\n**Scusati**: *Nous sommes vraiment désolés · Je vous prie de m'excuser.*\n**Risolvi**: *Voulez-vous que je vous change de chambre ? · J'envoie… tout de suite.*\n**Ringrazia**: *Merci de nous l'avoir signalé.*\nChe cosa è successo (hier) → **passé composé**: n'a pas fonctionné. Com'era la situazione → **imparfait**: il y avait. Che cosa ho appena fatto → **je viens de**: je viens d'appeler.",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "Le parole del reclamo", consegna: "Tocca una parola e poi il suo significato.",
        coppie: [["la plainte", "reclamo"], ["le remboursement", "rimborso"], ["la réduction", "sconto"], ["bruyant", "rumoroso"], ["cassé", "rotto"], ["sale", "sporco"]] },
      { tipo: "scelta", titolo: "Passé composé, imparfait o venir de?", consegna: "Scegli il tempo giusto.",
        voci: [
          { d: "Hier soir, la climatisation _____ . (non ha funzionato)", o: ["n'a pas fonctionné", "n'est pas fonctionné", "ne fonctionnera pas"] },
          { d: "Je _____ appeler le technicien : il arrive. (ho appena)", o: ["viens d'", "vais d'", "ai venu d'"] },
          { d: "Quand nous _____ , la chambre n'était pas prête. (siamo arrivati)", o: ["sommes arrivés", "avons arrivé", "arriverons"] },
          { d: "Nous _____ déjà changé votre chambre. Elle est prête.", o: ["avons", "sommes", "aurons"] },
          { d: "_____ une chambre avec vue sur la mer il y a deux semaines. (ho prenotato)", o: ["J'ai réservé", "Je réserve", "Je vais réserver"] },
          { d: "Aujourd'hui, le client de la 12 _____ trois fois à cause du bruit. (si è lamentato)", o: ["s'est plaint", "se plaindra", "se plaignent"] }
        ] },
      { tipo: "completa", titolo: "Le courriel d'excuses", consegna: "Completa l'e-mail della responsabile del ricevimento.",
        testo: "Cher Monsieur Martin, Merci de nous avoir [signalé] ce qui s'est passé pendant votre séjour. Je vous prie de nous [excuser] car la douche n'a pas [fonctionné] la première nuit. Notre équipe d'entretien l'[a] déjà réparée et nous souhaiterions vous [offrir] un dîner gratuit dans notre restaurant. Je veillerai personnellement à ce que cela ne se [reproduise] pas. Cordialement, Giulia Rossi, Responsable de la réception",
        intrusi: ["fonctionner", "désolé"] },
      { tipo: "ordina", titolo: "La plainte, étape par étape", consegna: "Tocca le battute nell'ordine giusto.",
        passi: [["Excusez-moi, ma chambre est très bruyante. Hier soir, je n'ai pas pu dormir.", "Scusi, la mia camera è molto rumorosa. Ieri sera non sono riuscito a dormire."], ["Nous sommes vraiment désolés. Que s'est-il passé exactement ?", "Siamo davvero spiacenti. Che cosa è successo esattamente?"], ["Il y avait de la musique très forte au bar jusqu'à deux heures du matin.", "C'era musica altissima al bar fino alle due di notte."], ["Je vous comprends parfaitement. Voulez-vous que je vous installe dans une chambre plus calme ?", "La capisco perfettamente. Vuole che la sposti in una camera più tranquilla?"], ["Oui, s'il vous plaît. À un étage plus élevé, si possible.", "Sì, grazie. A un piano più alto, se possibile."], ["Bien sûr. Je viens d'en trouver une au cinquième étage. Merci de nous l'avoir signalé.", "Certo. Ne ho appena trovata una al quinto piano. Grazie per avercelo segnalato."]] },
      { tipo: "scelta", titolo: "La réponse juste", consegna: "L'ospite si lamenta: scegli la risposta più professionale.",
        voci: [
          { d: "« La chambre est sale ! »", o: ["Je vous prie de m'excuser. J'envoie tout de suite l'équipe de ménage.", "Impossible, nous l'avons nettoyée ce matin.", "Eh bien, nettoyez-la vous-même."] },
          { d: "« Il n'y a pas d'eau chaude ! »", o: ["Nous sommes vraiment désolés. J'appelle l'entretien tout de suite.", "L'eau chaude est en supplément.", "Attendez jusqu'à demain."] },
          { d: "« J'ai réservé une chambre avec vue sur la mer ! »", o: ["Je crains qu'il y ait eu une erreur. Permettez-moi de vous proposer une chambre supérieure.", "Vous vous trompez, ce n'est pas vrai.", "La mer n'est pas importante."] },
          { d: "« Nous avons attendu quarante minutes le petit-déjeuner ! »", o: ["Nous sommes vraiment désolés. Le petit-déjeuner est offert par la maison.", "La cuisine est pleine, désolé.", "La prochaine fois, venez plus tôt."] },
          { d: "« Pouvez-vous me rembourser ? »", o: ["Je parle au directeur et je vous réponds dans moins d'une heure.", "Nous ne remboursons jamais.", "Demandez à quelqu'un d'autre."] },
          { d: "« Merci, vous avez été très aimable. »", o: ["Merci à vous pour votre patience.", "Oui, je sais.", "Enfin !"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta l'ospite", consegna: "Ascolta il reclamo e scegli che cosa vuol dire.",
        voci: [
          { t: "La climatisation de ma chambre ne fonctionne pas.", o: ["L'aria condizionata in camera non funziona.", "L'aria condizionata è troppo forte.", "Vorrei l'aria condizionata in camera."] },
          { t: "J'attends ma chambre depuis plus d'une heure.", o: ["Aspetto la mia camera da più di un'ora.", "Ho aspettato un'ora per il taxi.", "La mia camera è pronta da un'ora."] },
          { t: "Les voisins de la chambre d'à côté ont fait beaucoup de bruit hier soir.", o: ["I vicini di camera hanno fatto molto rumore ieri sera.", "Ieri sera i vicini sono partiti.", "Ieri sera il bar era chiuso."] },
          { t: "Je voudrais parler au directeur, s'il vous plaît.", o: ["Vorrei parlare con il direttore, per favore.", "Vorrei cambiare camera, per favore.", "Vorrei pagare il conto, per favore."] },
          { t: "On nous a facturé deux fois le minibar.", o: ["Ci avete addebitato due volte il minibar.", "Il minibar era vuoto.", "Abbiamo usato due volte il minibar."] }
        ] }
    ],
    missione: {
      titolo: "Il turno di sera", chef: "Madame Lefèvre", avatar: "👩", domanda: "Che cosa rispondi?",
      intro: "Sei in stage alla reception di un hotel di Nizza. È sera e arriva la signora Lefèvre, molto arrabbiata. Ascolta, scusati, risolvi, ringrazia: sempre con il lei (vous).",
      passi: [
        { dice: "Excusez-moi ! J'ai réservé une chambre avec vue sur la mer et on m'a donné une chambre sur le parking.", it: "Scusi! Ho prenotato una camera con vista sul mare e me ne avete data una sul parcheggio.",
          o: [["Nous sommes vraiment désolés, madame. Je vérifie votre réservation tout de suite.", 1, "Ti scusi e ti attivi subito."], ["Ce n'est pas possible. Vous avez réservé une chambre standard.", 0, "Anche se fosse vero, prima ci si scusa e si verifica."], ["La vue sur le parking est jolie aussi.", 0, "Suona ironico: l'ospite si sente presa in giro."]] },
        { dice: "Voici l'e-mail de confirmation. Il est écrit clairement « vue sur la mer ».", it: "Ecco l'e-mail di conferma. C'è scritto chiaramente «vista sul mare».",
          o: [["Vous avez tout à fait raison. Je crains qu'il y ait eu une erreur de notre part.", 1, "Ammetti l'errore con una formula professionale."], ["L'ordinateur s'est trompé, pas moi.", 0, "All'ospite non interessa di chi sia la colpa."], ["Les e-mails se trompent souvent.", 0, "Metti in dubbio l'ospite: peggio di prima."]] },
        { dice: "Et qu'allez-vous faire ?", it: "E che cosa pensate di fare?",
          o: [["Je viens de vérifier : nous avons une chambre supérieure avec vue sur la mer. Je peux vous y installer sans supplément.", 1, "Je viens de + una soluzione generosa."], ["Rien, l'hôtel est complet.", 0, "Mai lasciare l'ospite senza una soluzione."], ["Si vous voulez, vous pouvez changer d'hôtel.", 0, "Così perdi la cliente."]] },
        { dice: "C'est mieux. Mais j'ai attendu vingt minutes à la réception !", it: "Così va meglio. Ma ho aspettato venti minuti alla reception!",
          o: [["Je vous prie de m'excuser pour l'attente. Un grand groupe est arrivé en même temps.", 1, "Scusa e breve spiegazione al passé composé (est arrivé)."], ["Vingt minutes, ce n'est pas beaucoup.", 0, "Minimizzare irrita."], ["Moi aussi, j'attends tous les jours.", 0, "Fuori luogo: stai parlando di te."]] },
        { dice: "Et dans l'autre chambre, le wifi ne fonctionnait pas.", it: "E nell'altra camera il Wi-Fi non funzionava.",
          o: [["Nous sommes désolés. Je demande au technicien de le vérifier, et voici le mot de passe de votre nouvelle chambre.", 1, "Scusa, soluzione e un aiuto concreto."], ["Le wifi fonctionne, vous l'utilisez mal.", 0, "Mai dare la colpa all'ospite."], ["Le wifi n'est pas inclus.", 0, "Falso e scortese."]] },
        { dice: "Bon… merci. Vous avez été très aimable.", it: "Be'… grazie. Molto gentile da parte sua.",
          o: [["Merci à vous pour votre patience, madame. Bon séjour !", 1, "Chiudi ringraziando."], ["Enfin, vous êtes contente !", 0, "Inopportuno."], ["De rien. La prochaine fois, lisez mieux votre réservation.", 0, "Una frecciata che rovina tutto."]] },
        { situazione: "Il giorno dopo il direttore ti chiede di scrivere una riga nel registro dei reclami.", domanda: "Che cosa scrivi?",
          o: [["La cliente de la 214 s'est plainte de la vue. Nous l'avons installée dans une chambre supérieure.", 1, "Passé composé: fatti conclusi, chiari e oggettivi."], ["La cliente se plaint hier et nous l'installons ailleurs.", 0, "Per i fatti di ieri si usa il passé composé: s'est plainte, nous l'avons installée."], ["Dame énervée, problème réglé.", 0, "Troppo vago e poco professionale."]] }
      ],
      esiti: ["Madame Lefèvre écrit un avis : « Une réceptionniste fantastique a transformé un problème en un séjour formidable ! »", "« Merci, tout va bien maintenant. » Ottimo lavoro.", "« Bon, ça va… » Ripassa le scuse e i tempi del passato, poi riprova.", "La signora chiede di parlare con il direttore. Rifai la lezione e riprova!"]
    },
  },
  /* ───────────────────────── SPAGNOLO ───────────────────────── */
  es: {
    schede: [
      { titolo: "Un ospite arrabbiato", testo: "Alla reception arriva un ospite furioso. Non serve avere ragione: serve **ascoltare**, **scusarsi** e **trovare una soluzione**. Sempre con il **lei** (usted).",
        esempi: [["¡Reservé una habitación con vistas al mar y me han dado una con vistas al aparcamiento!", "Ho prenotato una camera vista mare e me ne avete data una sul parcheggio!"], ["Lo siento muchísimo, señor. Déjeme ver qué puedo hacer.", "Mi dispiace moltissimo, signore. Vediamo che cosa posso fare."]],
        domanda: { testo: "Davanti a un reclamo la prima cosa da fare è…", o: ["ascoltare e scusarsi", "spiegare che non è colpa tua", "chiamare subito il direttore"], spiega: "Prima si ascolta e ci si scusa; le spiegazioni vengono dopo, e brevi." } },
      { titolo: "Che cosa è successo: l'indefinido", testo: "Per i fatti conclusi in un tempo finito (**ayer**, **anoche**, **la semana pasada**, **cuando llegué**) si usa il pretérito indefinido: reservar → **reservé**, llegar → **llegamos**, funcionar → **funcionó**.\nIrregolari frequenti: estar → **estuvo**, tener → **tuvo**, ser/ir → **fue**, hacer → **hizo**.",
        esempi: [["Reservé una habitación doble.", "Ho prenotato una camera doppia."], ["Anoche la ducha no funcionó.", "Ieri sera la doccia non ha funzionato."], ["Esperamos cuarenta minutos.", "Abbiamo aspettato quaranta minuti."]],
        domanda: { testo: "«Ieri sera il riscaldamento non ha funzionato»", o: ["Anoche la calefacción no funcionó.", "Anoche la calefacción no ha funcionado.", "Anoche la calefacción no funcionaste."], spiega: "Con anoche si usa l'indefinido: no funcionó." } },
      { titolo: "Che cosa ho fatto: il pretérito perfecto", testo: "Per ciò che è successo **oggi** o si è **appena / già** fatto: **he, ha, hemos** + participio (-ado, -ido): he llamado, hemos cambiado.\nPer «ho appena»: **acabo de** + infinito.",
        esempi: [["He llamado a mantenimiento.", "Ho chiamato la manutenzione."], ["Ya hemos cambiado su habitación.", "Le abbiamo già cambiato la camera."], ["Acabo de hablar con el director.", "Ho appena parlato con il direttore."]],
        domanda: { testo: "«Ho appena parlato con il direttore»", o: ["Acabo de hablar con el director.", "Acabo hablar con el director.", "He acabado hablar con el director."], spiega: "Acabo de + infinito: acabo de hablar." } },
      { titolo: "Scusarsi da professionista", testo: "Le formule della reception: cortesi, calme, mai sulla difensiva.",
        esempi: [["Lo siento muchísimo.", "Mi dispiace moltissimo."], ["Le pido disculpas por las molestias.", "Le chiedo scusa per il disagio."], ["Me temo que ha habido un error.", "Temo che ci sia stato un errore."], ["Tiene usted toda la razón.", "Ha perfettamente ragione."], ["Gracias por avisarnos.", "Grazie per avercelo segnalato."]],
        domanda: { testo: "Qual è la scusa più professionale?", o: ["Le pido disculpas por las molestias.", "Lo siento, no es culpa mía.", "¡Uy, perdón!"], spiega: "Formale e senza cercare colpevoli." } },
      { titolo: "Proporre una soluzione", testo: "Dopo le scuse, sempre una **proposta concreta**. «¿Quiere que le…?» è una formula fissa, da imparare così.",
        esempi: [["¿Quiere que le cambie de habitación?", "Vuole che le cambi la camera?"], ["Le ofrecemos una habitación superior sin coste adicional.", "Le offriamo una camera superiore senza costi aggiuntivi."], ["Ahora mismo le envío a un técnico.", "Le mando subito un tecnico."], ["La cena de esta noche corre de nuestra cuenta.", "La cena di stasera la offriamo noi."], ["Me aseguraré de que no vuelva a pasar.", "Mi assicurerò che non succeda più."]],
        domanda: { testo: "L'aria condizionata è rotta. Che cosa dici?", o: ["Lo siento mucho. Ahora mismo le envío a un técnico o, si prefiere, le cambio de habitación.", "El técnico viene mañana.", "Todas las habitaciones son iguales."], spiega: "Scuse, soluzione subito e un'alternativa." } },
      { titolo: "Le parole del reclamo", testo: "Tocca 🔊 e ripeti.",
        esempi: [["la queja", "il reclamo"], ["la reserva", "la prenotazione"], ["el reembolso", "il rimborso"], ["el descuento", "lo sconto"], ["la molestia", "il disagio"], ["ruidoso", "rumoroso"], ["sucio", "sporco"], ["roto", "rotto"], ["el mantenimiento", "la manutenzione"], ["la habitación superior", "la camera superiore"]],
        domanda: { testo: "«El reembolso» è…", o: ["il rimborso", "lo sconto", "il reclamo"], spiega: "Reembolso = rimborso, descuento = sconto." } },
      { titolo: "In tasca: il metodo in quattro passi", testo: "**Ascolta** senza interrompere.\n**Scusati**: *Lo siento muchísimo · Le pido disculpas.*\n**Risolvi**: *¿Quiere que le cambie…? · Ahora mismo le envío…*\n**Ringrazia**: *Gracias por avisarnos.*\nChe cosa è successo (anoche, ayer) → **indefinido**: no funcionó. Che cosa ho appena fatto → **perfecto** o **acabo de**: he llamado, acabo de llamar.",
        esempi: [], domanda: null }
    ],
    esercizi: [
      { tipo: "abbina", titolo: "Le parole del reclamo", consegna: "Tocca una parola e poi il suo significato.",
        coppie: [["la queja", "reclamo"], ["el reembolso", "rimborso"], ["el descuento", "sconto"], ["ruidoso", "rumoroso"], ["roto", "rotto"], ["sucio", "sporco"]] },
      { tipo: "scelta", titolo: "Indefinido o perfecto?", consegna: "Scegli il tempo giusto.",
        voci: [
          { d: "Anoche el aire acondicionado no _____ . (ha funzionato)", o: ["funcionó", "ha funcionado", "funciona"] },
          { d: "_____ llamar al técnico: ya viene. (ho appena)", o: ["Acabo de", "Acabo", "He acabado"] },
          { d: "Cuando _____ , la habitación no estaba lista. (siamo arrivati)", o: ["llegamos", "hemos llegado", "llegáis"] },
          { d: "Ya _____ su habitación. Está lista. (abbiamo cambiato)", o: ["hemos cambiado", "cambiaremos", "cambiábamos"] },
          { d: "_____ una habitación con vistas al mar hace dos semanas. (ho prenotato)", o: ["Reservé", "He reservado", "Reservo"] },
          { d: "Hoy el cliente de la 12 _____ tres veces por el ruido. (si è lamentato)", o: ["se ha quejado", "se queja ayer", "se quejará ayer"] }
        ] },
      { tipo: "completa", titolo: "El correo de disculpa", consegna: "Completa l'e-mail della responsabile del ricevimento.",
        testo: "Estimado señor Martín: Gracias por [avisarnos] de lo ocurrido durante su estancia. Le pido [disculpas] porque la ducha no [funcionó] la primera noche. Nuestro equipo de mantenimiento ya la [ha] reparado y nos gustaría [ofrecerle] una cena gratuita en nuestro restaurante. Me [aseguraré] personalmente de que no vuelva a pasar. Un cordial saludo, Giulia Rossi, Jefa de Recepción",
        intrusi: ["funcionado", "perdón"] },
      { tipo: "ordina", titolo: "La queja, paso a paso", consegna: "Tocca le battute nell'ordine giusto.",
        passi: [["Perdone, mi habitación es muy ruidosa. Anoche no pude dormir.", "Scusi, la mia camera è molto rumorosa. Stanotte non ho dormito."], ["Lo siento muchísimo. ¿Qué pasó exactamente?", "Mi dispiace moltissimo. Che cosa è successo esattamente?"], ["Hubo música muy alta en el bar hasta las dos de la mañana.", "C'era musica altissima al bar fino alle due di notte."], ["Le entiendo perfectamente. ¿Quiere que le pase a una habitación más tranquila?", "La capisco perfettamente. Vuole che la sposti in una camera più tranquilla?"], ["Sí, por favor. En un piso más alto, si es posible.", "Sì, grazie. A un piano più alto, se possibile."], ["Por supuesto. Acabo de encontrar una en el quinto piso. Gracias por avisarnos.", "Certo. Ne ho appena trovata una al quinto piano. Grazie per avercelo segnalato."]] },
      { tipo: "scelta", titolo: "La risposta giusta", consegna: "L'ospite si lamenta: scegli la risposta più professionale.",
        voci: [
          { d: "«¡La habitación está sucia!»", o: ["Le pido disculpas. Ahora mismo envío al servicio de limpieza.", "Imposible, la limpiamos esta mañana.", "Pues límpiela usted."] },
          { d: "«¡No hay agua caliente!»", o: ["Lo siento mucho. Llamo ahora mismo a mantenimiento.", "El agua caliente se paga aparte.", "Espere hasta mañana."] },
          { d: "«¡Reservé con vistas al mar!»", o: ["Me temo que ha habido un error. Permítame pasarle a una habitación superior.", "Se equivoca, no es verdad.", "El mar no es importante."] },
          { d: "«¡Esperamos cuarenta minutos el desayuno!»", o: ["Lo siento muchísimo. Hoy el desayuno corre de nuestra cuenta.", "La cocina está llena, lo siento.", "La próxima vez vengan antes."] },
          { d: "«¿Me pueden devolver el dinero?»", o: ["Hablo con el director y le respondo en menos de una hora.", "Nunca devolvemos el dinero.", "Pregunte a otra persona."] },
          { d: "«Gracias, ha sido usted muy amable.»", o: ["A usted, gracias por su paciencia.", "Sí, ya lo sé.", "¡Por fin!"] }
        ] },
      { tipo: "ascolta", titolo: "Ascolta l'ospite", consegna: "Ascolta il reclamo e scegli che cosa vuol dire.",
        voci: [
          { t: "El aire acondicionado de mi habitación no funciona.", o: ["L'aria condizionata in camera non funziona.", "L'aria condizionata è troppo forte.", "Vorrei l'aria condizionata in camera."] },
          { t: "Llevo más de una hora esperando mi habitación.", o: ["Aspetto la mia camera da più di un'ora.", "Ho aspettato un'ora per il taxi.", "La mia camera è pronta da un'ora."] },
          { t: "Los vecinos de la habitación de al lado hicieron mucho ruido anoche.", o: ["I vicini di camera hanno fatto molto rumore ieri sera.", "Ieri sera i vicini sono partiti.", "Ieri sera il bar era chiuso."] },
          { t: "Quisiera hablar con el director, por favor.", o: ["Vorrei parlare con il direttore, per favore.", "Vorrei cambiare camera, per favore.", "Vorrei pagare il conto, per favore."] },
          { t: "Nos han cobrado dos veces el minibar.", o: ["Ci avete addebitato due volte il minibar.", "Il minibar era vuoto.", "Abbiamo usato due volte il minibar."] }
        ] }
    ],
    missione: {
      titolo: "Il turno di sera", chef: "Señora Ortega", avatar: "👩", domanda: "Che cosa rispondi?",
      intro: "Sei in stage alla reception di un hotel di Siviglia. È sera e arriva la signora Ortega, molto arrabbiata. Ascolta, scusati, risolvi, ringrazia: sempre con il lei.",
      passi: [
        { dice: "¡Perdone! Reservé una habitación con vistas a la catedral y me han dado una con vistas al aparcamiento.", it: "Scusi! Ho prenotato una camera con vista sulla cattedrale e me ne avete data una sul parcheggio.",
          o: [["Lo siento muchísimo, señora. Ahora mismo compruebo su reserva.", 1, "Ti scusi e ti attivi subito."], ["No es posible. Usted reservó una habitación estándar.", 0, "Anche se fosse vero, prima ci si scusa e si verifica."], ["Las vistas al aparcamiento también son bonitas.", 0, "Suona ironico: l'ospite si sente presa in giro."]] },
        { dice: "Aquí tiene el correo de confirmación. Dice claramente «vistas a la catedral».", it: "Ecco l'e-mail di conferma. C'è scritto chiaramente «vista sulla cattedrale».",
          o: [["Tiene usted toda la razón. Me temo que ha habido un error por nuestra parte.", 1, "Ammetti l'errore con una formula professionale."], ["El ordenador se equivocó, no yo.", 0, "All'ospite non interessa di chi sia la colpa."], ["Los correos se equivocan a menudo.", 0, "Metti in dubbio l'ospite: peggio di prima."]] },
        { dice: "¿Y qué van a hacer?", it: "E che cosa pensate di fare?",
          o: [["Acabo de comprobarlo: tenemos una habitación superior con vistas a la catedral. Puedo pasarla a esa habitación sin coste adicional.", 1, "Acabo de + una soluzione generosa."], ["Nada, el hotel está lleno.", 0, "Mai lasciare l'ospite senza una soluzione."], ["Si quiere, puede cambiar de hotel.", 0, "Così perdi la cliente."]] },
        { dice: "Mejor así. ¡Pero esperé veinte minutos en recepción!", it: "Così va meglio. Ma ho aspettato venti minuti alla reception!",
          o: [["Le pido disculpas por la espera. Llegó un grupo grande al mismo tiempo.", 1, "Scusa e breve spiegazione all'indefinido (llegó)."], ["Veinte minutos no es mucho.", 0, "Minimizzare irrita."], ["Yo también espero todos los días.", 0, "Fuori luogo: stai parlando di te."]] },
        { dice: "Y en la otra habitación el wifi no funcionó.", it: "E nell'altra camera il Wi-Fi non ha funzionato.",
          o: [["Lo siento. Le pido al técnico que lo revise, y aquí tiene la contraseña de su nueva habitación.", 1, "Scusa, soluzione e un aiuto concreto."], ["El wifi funciona, lo usa usted mal.", 0, "Mai dare la colpa all'ospite."], ["El wifi no está incluido.", 0, "Falso e scortese."]] },
        { dice: "Bueno… gracias. Ha sido usted muy amable.", it: "Be'… grazie. Molto gentile da parte sua.",
          o: [["Gracias a usted por su paciencia, señora. Que disfrute de su estancia.", 1, "Chiudi ringraziando."], ["¡Por fin está contenta!", 0, "Inopportuno."], ["De nada. La próxima vez lea mejor su reserva.", 0, "Una frecciata che rovina tutto."]] },
        { situazione: "Il giorno dopo il direttore ti chiede di scrivere una riga nel registro dei reclami.", domanda: "Che cosa scrivi?",
          o: [["La clienta de la 214 se quejó de las vistas. La pasamos a una habitación superior.", 1, "Indefinido: fatti conclusi, chiari e oggettivi."], ["La clienta se ha quejado ayer y la hemos pasado a otra habitación.", 0, "Con ayer si usa l'indefinido: se quejó, la pasamos."], ["Señora enfadada, problema resuelto.", 0, "Troppo vago e poco professionale."]] }
      ],
      esiti: ["La signora Ortega scrive una recensione: «¡Una recepcionista fantástica convirtió un problema en una estancia estupenda!»", "«Gracias, ahora todo está bien.» Ottimo lavoro.", "«Bueno, está bien…» Ripassa le scuse e i tempi del passato, poi riprova.", "La signora chiede di parlare con il direttore. Rifai la lezione e riprova!"]
    },
  }
  }
}
];

/* le prossime lezioni, già annunciate nel catalogo */
window.LEZIONI_IN_ARRIVO = [
];
