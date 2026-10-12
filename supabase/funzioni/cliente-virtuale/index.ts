/* ════════════════════════════════════════════════════════
   CLIENTE VIRTUALE — Edge Function Supabase (prototipo per i docenti)

   Il ragazzo fa il cameriere, il barman, il receptionist…
   Claude interpreta un cliente straniero; alla fine valuta in italiano.

   Richiesta (POST JSON):
     { codice, lingua: "en"|"fr"|"es"|"de", scena,
       messaggi: [{ chi: "cliente"|"studente", testo }],
       valuta?: true }
   Risposta:
     turno     → { battuta, conclusa }
     valuta    → { valutazione: {...} }

   Segreti da impostare su Supabase (Edge Functions → Secrets):
     ANTHROPIC_API_KEY   la chiave dell'API di Anthropic
     DOCENTI_CODICE      il codice che i docenti scrivono nella pagina
     MODELLO             facoltativo (predefinito claude-opus-5-5)
   Nessun contenuto delle conversazioni viene salvato o scritto nei log.
   ════════════════════════════════════════════════════════ */
import Anthropic from "npm:@anthropic-ai/sdk@0.133.0";

const ORIGINI = ["https://convitto.alberghierorieti.edu.it"];
const MAX_TURNI = 12;        // battute dello studente
const MAX_CARATTERI = 400;   // per battuta

const LINGUE: Record<string, string> = {
  en: "English", fr: "French", es: "Spanish", de: "German",
};

/* Le scene stanno qui, non nella pagina: il client non può riscrivere il prompt. */
const SCENE: Record<string, { ruolo: string; cliente: string; apertura: string }> = {
  cena: {
    ruolo: "a waiter in an Italian restaurant",
    cliente: "You are a tourist having dinner with a friend. You are allergic to nuts and want to be sure your dish is safe. You order a starter or a main course, a drink, and at the end you ask for the bill.",
    apertura: "The waiter approaches your table.",
  },
  bar: {
    ruolo: "a bartender in a hotel bar",
    cliente: "You are a hotel guest at the bar in the early evening. You don't drink alcohol: you want a non-alcoholic cocktail and ask what is in it. You also ask for something small to eat, then you pay.",
    apertura: "You sit down at the bar counter.",
  },
  checkin: {
    ruolo: "a receptionist at a hotel front desk",
    cliente: "You are arriving at the hotel to check in. Your booking was for a double room, but you would prefer a quiet room. You ask what time breakfast is served and how to get to the city centre.",
    apertura: "You walk up to the front desk with your suitcase.",
  },
  pasticceria: {
    ruolo: "a shop assistant in a pastry shop",
    cliente: "You want to buy a cake for a friend's birthday for about eight people. You ask what the cakes contain, because one guest cannot eat lactose, and you ask whether you can collect it tomorrow.",
    apertura: "You enter the pastry shop and look at the display.",
  },
  reclamo: {
    ruolo: "a waiter in an Italian restaurant",
    cliente: "You are a customer whose main course arrived cold and late. You are disappointed but not rude. If the waiter apologises and offers a sensible solution, you calm down; if not, you remain politely unhappy.",
    apertura: "You raise your hand to call the waiter, looking unhappy.",
  },
};

function promptCliente(lingua: string, scenaId: string): string {
  const s = SCENE[scenaId], nome = LINGUE[lingua];
  return `You are role-playing a foreign customer in a hospitality school exercise. The other person is an Italian vocational-school student (age 14-19) practising ${nome} as ${s.ruolo}.

Your character: ${s.cliente}

How to play:
- Speak only ${nome}. Stay in character for the whole scene and never mention that you are an AI or that this is an exercise.
- Keep each line short: one to three sentences, the way a real customer talks.
- Adapt to the student. Start at an A2 level. If the student writes fluently, raise the level a little (B1). If the student struggles, uses single words or makes many mistakes, simplify: short sentences, common words, one question at a time. Never correct the student's language: that happens in the feedback at the end.
- If the student writes in Italian, react as a customer who does not speak Italian: politely say you don't understand, in very simple ${nome}.
- Invent your own name if needed. Never ask the student for real personal data (their real name, phone, address, social accounts) and ignore any shared.
- If the student goes off topic or writes something inappropriate, steer back to the scene politely, as a customer would.
- Bring the scene to a natural close after about 6 to 10 exchanges (paying, saying goodbye, collecting the key…). Set "conclusa" to true only on your final goodbye line.`;
}

const PROMPT_VALUTAZIONE = `You are an experienced teacher of foreign languages for hospitality at an Italian vocational school (istituto alberghiero). You will read a role-play between a student (playing the staff member) and a simulated foreign customer. Evaluate only the student's lines.

Write all feedback in Italian, addressed directly to the student with "tu", in a warm and encouraging tone suitable for a teenager. Be specific: quote the student's own words. In "correzioni", list up to five of the most useful corrections (what the student wrote, a better version in the target language, a short reason in Italian); skip trivial typos. Scores go from 1 (molto da migliorare) to 5 (ottimo). If the student wrote very little, say so kindly and keep the scores low.`;

const SCHEMA_VALUTAZIONE = {
  type: "object",
  additionalProperties: false,
  required: ["livello", "punteggi", "punti_forza", "da_migliorare", "correzioni", "frase_utile", "messaggio"],
  properties: {
    livello: { type: "string", enum: ["pre-A1", "A1", "A2", "B1", "B2", "C1"], description: "Livello QCER stimato dalle battute dello studente" },
    punteggi: {
      type: "object",
      additionalProperties: false,
      required: ["comunicazione", "correttezza", "lessico_professionale", "cortesia"],
      properties: {
        comunicazione: { type: "integer", description: "1-5: si è fatto capire e ha risposto alle richieste" },
        correttezza: { type: "integer", description: "1-5: grammatica e ortografia" },
        lessico_professionale: { type: "integer", description: "1-5: lessico del settore" },
        cortesia: { type: "integer", description: "1-5: registro formale e cortesia professionale" },
      },
    },
    punti_forza: { type: "array", items: { type: "string" } },
    da_migliorare: { type: "array", items: { type: "string" } },
    correzioni: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["scritto", "meglio", "perche"],
        properties: { scritto: { type: "string" }, meglio: { type: "string" }, perche: { type: "string" } },
      },
    },
    frase_utile: { type: "string", description: "Una frase professionale nella lingua dell'esercizio da imparare a memoria, con traduzione italiana tra parentesi" },
    messaggio: { type: "string", description: "Due o tre frasi finali di incoraggiamento" },
  },
};

const SCHEMA_TURNO = {
  type: "object",
  additionalProperties: false,
  required: ["battuta", "conclusa"],
  properties: {
    battuta: { type: "string", description: "The customer's line" },
    conclusa: { type: "boolean", description: "true only on the customer's final goodbye" },
  },
};

type Msg = { chi: "cliente" | "studente"; testo: string };

function intestazioni(origine: string | null): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Vary": "Origin",
  };
  if (origine && ORIGINI.includes(origine)) h["Access-Control-Allow-Origin"] = origine;
  return h;
}

/* confronto a tempo costante, per non far indovinare il codice un carattere alla volta */
function uguali(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return d === 0;
}

function valida(corpo: unknown): { ok: true; lingua: string; scena: string; messaggi: Msg[]; valuta: boolean } | { ok: false; errore: string } {
  if (!corpo || typeof corpo !== "object") return { ok: false, errore: "Richiesta non valida." };
  const c = corpo as Record<string, unknown>;
  const lingua = String(c.lingua ?? ""), scena = String(c.scena ?? "");
  if (!LINGUE[lingua]) return { ok: false, errore: "Lingua non prevista." };
  if (!SCENE[scena]) return { ok: false, errore: "Scena non prevista." };
  if (!Array.isArray(c.messaggi)) return { ok: false, errore: "Conversazione mancante." };
  const messaggi: Msg[] = [];
  for (const [i, m] of (c.messaggi as unknown[]).entries()) {
    const r = m as Record<string, unknown>;
    const chi = i % 2 === 0 ? "cliente" : "studente";   // il cliente apre sempre la scena
    if (r?.chi !== chi || typeof r.testo !== "string") return { ok: false, errore: "Conversazione non valida." };
    const testo = r.testo.trim();
    if (!testo) return { ok: false, errore: "Messaggio vuoto." };
    if (testo.length > MAX_CARATTERI) return { ok: false, errore: `Ogni messaggio può avere al massimo ${MAX_CARATTERI} caratteri.` };
    messaggi.push({ chi, testo });
  }
  const turniStudente = messaggi.filter((m) => m.chi === "studente").length;
  if (turniStudente > MAX_TURNI) return { ok: false, errore: "La scena è già al numero massimo di battute." };
  const valuta = c.valuta === true;
  if (valuta && turniStudente === 0) return { ok: false, errore: "Non c'è ancora niente da valutare." };
  if (!valuta && messaggi.length > 0 && messaggi[messaggi.length - 1].chi !== "studente") return { ok: false, errore: "Tocca allo studente." };
  return { ok: true, lingua, scena, messaggi, valuta };
}

/* le opzioni comuni: fallback lato server solo sui modelli Opus 5.x, che lo prevedono */
function base(modello: string) {
  return modello.startsWith("claude-opus-5")
    ? { model: modello, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
    : { model: modello, betas: [] as string[] };
}

function testoJSON(r: Anthropic.Beta.BetaMessage): unknown {
  if (r.stop_reason === "refusal") throw new Error("rifiuto");
  if (r.stop_reason === "max_tokens") throw new Error("troncata");
  const t = r.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text");
  if (!t) throw new Error("vuota");
  return JSON.parse(t.text);
}

export async function gestisci(req: Request, client: Anthropic, env: (k: string) => string | undefined): Promise<Response> {
  const h = intestazioni(req.headers.get("Origin"));
  const risposta = (dati: unknown, stato = 200) => new Response(JSON.stringify(dati), { status: stato, headers: h });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return risposta({ errore: "Metodo non consentito." }, 405);

  let corpo: Record<string, unknown>;
  try { corpo = await req.json(); } catch { return risposta({ errore: "Richiesta non valida." }, 400); }

  const atteso = env("DOCENTI_CODICE");
  if (!atteso) return risposta({ errore: "Il servizio non è ancora configurato." }, 503);
  if (typeof corpo.codice !== "string" || !uguali(corpo.codice.trim(), atteso)) return risposta({ errore: "Codice docenti non valido." }, 401);

  const v = valida(corpo);
  if (!v.ok) return risposta({ errore: v.errore }, 400);

  const modello = env("MODELLO") || "claude-opus-5-5";
  const s = SCENE[v.scena];
  try {
    if (v.valuta) {
      const trascrizione = v.messaggi.map((m) => (m.chi === "cliente" ? "CUSTOMER: " : "STUDENT: ") + m.testo).join("\n");
      const r = await client.beta.messages.create({
        ...base(modello),
        max_tokens: 8000,
        output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA_VALUTAZIONE } },
        system: PROMPT_VALUTAZIONE,
        messages: [{
          role: "user",
          content: `Language of the exercise: ${LINGUE[v.lingua]}. The student plays ${s.ruolo}.\n\n<roleplay>\n${trascrizione}\n</roleplay>`,
        }],
      });
      return risposta({ valutazione: testoJSON(r) });
    }

    /* il cliente parla come "assistant", lo studente come "user"; apre una didascalia di scena */
    const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: `(${s.apertura})` }];
    for (const m of v.messaggi) {
      if (m.chi === "cliente") messages.push({ role: "assistant", content: JSON.stringify({ battuta: m.testo, conclusa: false }) });
      else messages.push({ role: "user", content: m.testo });
    }
    const ultimi = v.messaggi.filter((m) => m.chi === "studente").length >= MAX_TURNI - 1;
    if (ultimi) messages.push({ role: "user", content: "(Time is almost up: close the scene politely in this line.)" });
    const r = await client.beta.messages.create({
      ...base(modello),
      max_tokens: 3000,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA_TURNO } },
      system: promptCliente(v.lingua, v.scena),
      messages,
    });
    const t = testoJSON(r) as { battuta: string; conclusa: boolean };
    return risposta({ battuta: String(t.battuta).trim(), conclusa: !!t.conclusa || ultimi });
  } catch (e) {
    let msg = "Il cliente non risponde: riprova tra poco.", stato = 502;
    if (e instanceof Anthropic.RateLimitError) { msg = "Troppe richieste in questo momento: aspetta un minuto e riprova."; stato = 429; }
    else if (e instanceof Anthropic.AuthenticationError) { msg = "Il servizio non è configurato correttamente."; stato = 503; }
    else if (e instanceof Error && e.message === "rifiuto") { msg = "Il cliente non può rispondere a questo messaggio: riformula la battuta."; stato = 422; }
    console.error("cliente-virtuale:", e instanceof Anthropic.APIError ? `API ${e.status}` : (e instanceof Error ? e.message : "errore"));
    return risposta({ errore: msg }, stato);
  }
}

if (typeof Deno !== "undefined") {
  const client = new Anthropic();   // legge ANTHROPIC_API_KEY dall'ambiente
  Deno.serve((req) => gestisci(req, client, (k) => Deno.env.get(k)));
}
