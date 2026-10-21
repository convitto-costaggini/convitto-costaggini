// Edge Function "studio-genera": dalle foto delle pagine del libro a una lezione interattiva (minisito /studio).
// Deploy con verify_jwt=false (i controlli sono qui dentro).
// Segreti richiesti: ANTHROPIC_API_KEY, STUDIO_CODICI (uno o piu' codici educatore separati da virgola).
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono forniti da Supabase.
// Richiesta (POST JSON): {codice_docente, immagini:[{tipo:"image/jpeg", dati:<base64>}], materia?, classe?, note?, autore?}
// Risposta: {ok:true, codice, lezione} oppure {ok:false, errore, messaggio?}
// Le foto non vengono salvate: vanno a Claude e poi si buttano. Resta solo la lezione.

import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const MODELLO = "claude-opus-5-5";
const MAX_FOTO = 8;
const MAX_BYTES_FOTO = 4_500_000; // base64 di una foto gia' ridotta dal browser
const MAX_ORA = 30; // lezioni create in un'ora, in tutto: freno contro gli abusi
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // niente 0/O, 1/I

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function risposta(corpo: unknown, stato = 200) {
  return new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

function codiceCasuale() {
  const v = new Uint32Array(6);
  crypto.getRandomValues(v);
  return Array.from(v, (x) => ALFABETO[x % ALFABETO.length]).join("");
}

function testo(x: unknown, max: number) {
  return String(x ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}

// ───── forma della lezione (structured output: Claude risponde sempre con questo JSON) ─────
const S = { type: "string" };
const lista = (items: unknown) => ({ type: "array", items });
const oggetto = (properties: Record<string, unknown>) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });

export const SCHEMA = oggetto({
  problema: { type: "string", description: "Vuoto se le foto sono leggibili. Altrimenti spiega in una frase cosa non va (foto sfocata, non e' un libro...)." },
  titolo: S,
  sottotitolo: S,
  materia: S,
  icona: { type: "string", description: "Una sola emoji" },
  gancio: oggetto({ domanda: S, risposta: S }),
  concetti: lista(oggetto({ emoji: S, titolo: S, spiegazione: S, parola_chiave: S, esempio: S })),
  parole: lista(oggetto({ termine: S, definizione: S })),
  mnemonica: oggetto({
    acronimo: oggetto({ parola: S, frase: S, lettere: lista(oggetto({ lettera: S, significato: S })) }),
    storia: oggetto({ titolo: S, tappe: lista(oggetto({ luogo: S, immagine: S, concetto: S })) }),
    filastrocca: S,
    immagini: lista(oggetto({ concetto: S, immagine: S, emoji: S })),
    trucchi: lista(S),
  }),
  sequenza: oggetto({ titolo: S, passi: lista(S) }),
  quiz: lista(oggetto({ domanda: S, opzioni: lista(S), corretta: { type: "integer" }, spiegazione: S })),
  vero_falso: lista(oggetto({ affermazione: S, vero: { type: "boolean" }, spiegazione: S })),
  completa: lista(oggetto({ frase: { type: "string", description: "Frase con ___ al posto della parola mancante" }, risposta: S, distrattori: lista(S) })),
  abbina: lista(oggetto({ sinistra: S, destra: S })),
  flashcard: lista(oggetto({ fronte: S, retro: S })),
  da_ricordare: lista(S),
});

export const ISTRUZIONI = `Sei un educatore esperto di didattica per ragazzi con DSA (dislessia, disortografia, discalculia) in un convitto di un istituto alberghiero italiano (14-19 anni).
Ricevi le foto di alcune pagine di un libro di scuola. Trasformale in una lezione interattiva in italiano che i ragazzi faranno dal telefono in sala studio.

REGOLA FONDAMENTALE: usa SOLO i concetti, i fatti, le date, i nomi e le definizioni presenti nelle pagine fotografate. Non aggiungere argomenti che non ci sono, non anticipare capitoli successivi. Se una pagina e' tagliata, lavora su quello che si legge. Ogni esercizio deve poter essere risolto da chi ha studiato quelle pagine.
Se le foto non sono pagine di studio leggibili, scrivi il motivo in "problema" e lascia brevi o vuoti gli altri campi.

STILE (pensato per DSA):
- Frasi brevi, una idea per frase, parole semplici. Spiega i termini tecnici la prima volta.
- Niente doppie negazioni, niente domande trabocchetto, niente "tutte le precedenti".
- Tono caldo, diretto ("tu"), un po' di ironia; mai infantile.

CONTENUTI:
- gancio: una domanda curiosa o sorprendente legata all'argomento, con la risposta (presa dalle pagine).
- concetti: da 4 a 8 idee chiave, nell'ordine del libro. spiegazione max 3 frasi; parola_chiave = la parola da evidenziare (deve comparire nella spiegazione); esempio concreto, se possibile dalla vita di tutti i giorni, dalla cucina, dalla sala o dall'albergo.
- parole: 4-10 termini del glossario con definizione semplice.
- mnemonica: mnemotecniche vere ed efficaci, costruite sui concetti delle pagine.
  - acronimo: una parola o sigla facile da ricordare formata dalle iniziali di elementi da memorizzare (un elenco, le fasi, le cause...); "frase" e' una frase buffa le cui parole iniziano con quelle lettere. lettere: una voce per lettera.
  - storia: un "palazzo della memoria" ambientato nel convitto o nella scuola (ingresso, refettorio, cucina, sala studio, camerata, cortile...). 4-7 tappe: in ogni luogo un'immagine assurda, esagerata, colorata o divertente che richiama un concetto.
  - filastrocca: 4-8 versi in rima con i fatti principali (date, numeri, nomi).
  - immagini: 3-6 associazioni visive concetto-immagine mentale, con emoji.
  - trucchi: 2-4 altri trucchi (associazioni numeriche, parole simili, collegamenti con cose note).
- sequenza: se l'argomento ha un ordine (fasi, cronologia, procedimento) da 4 a 7 passi nell'ordine giusto; altrimenti titolo vuoto e passi vuoti.
- quiz: 8-10 domande, 3 opzioni ciascuna (una sola corretta, plausibili ma chiaramente distinguibili), "corretta" e' l'indice da 0. spiegazione: perche' e' giusta, in una frase.
- vero_falso: 6-8 affermazioni, circa meta' vere.
- completa: 5-7 frasi prese dai concetti con una parola chiave sostituita da ___ (una sola ___ per frase); 2 distrattori plausibili.
- abbina: 5-6 coppie (termine-definizione, personaggio-fatto, causa-effetto, data-evento...).
- flashcard: 8-12 carte domanda/risposta brevi.
- da_ricordare: le 5 frasi essenziali da sapere a memoria.`;

// ───── la funzione ─────
type Db = any;
type Chiama = (immagini: { tipo: string; dati: string }[], extra: string) => Promise<any>;

export function crea(db: Db, env: Record<string, string | undefined>, chiama: Chiama, ora = () => Date.now()) {
  const codici = (env.STUDIO_CODICI || "").split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
  return async function gestisci(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return risposta({ ok: false, errore: "metodo" }, 405);
    let c: any;
    try { c = await req.json(); } catch { return risposta({ ok: false, errore: "richiesta" }, 400); }

    if (!codici.length) return risposta({ ok: false, errore: "configurazione" }, 503);
    if (!codici.includes(String(c.codice_docente || "").trim().toLowerCase())) return risposta({ ok: false, errore: "codice" }, 403);
    if (c.prova) return risposta({ ok: true }); // solo verifica del codice

    const immagini = Array.isArray(c.immagini) ? c.immagini : [];
    if (!immagini.length || immagini.length > MAX_FOTO) return risposta({ ok: false, errore: "foto" }, 400);
    for (const im of immagini) {
      if (!im || !/^image\/(jpeg|png|webp)$/.test(im.tipo) || typeof im.dati !== "string" || im.dati.length > MAX_BYTES_FOTO || !/^[A-Za-z0-9+/=]+$/.test(im.dati)) {
        return risposta({ ok: false, errore: "foto" }, 400);
      }
    }

    const { count } = await db.from("studio_lezioni").select("codice", { count: "exact", head: true }).gte("created_at", new Date(ora() - 3600_000).toISOString());
    if ((count ?? 0) >= MAX_ORA) return risposta({ ok: false, errore: "troppe" }, 429);

    const materia = testo(c.materia, 80), classe = testo(c.classe, 40), note = testo(c.note, 600), autore = testo(c.autore, 80);
    const extra = [
      materia && `Materia: ${materia}.`,
      classe && `Classe: ${classe}.`,
      note && `Indicazioni dell'educatore (seguile, ma sempre e solo sui contenuti delle pagine): ${note}`,
    ].filter(Boolean).join("\n");

    let lez: any;
    try { lez = await chiama(immagini, extra); }
    catch (e) { console.error("claude", e); return risposta({ ok: false, errore: "ia" }, 502); }
    if (!lez) return risposta({ ok: false, errore: "ia" }, 502);
    if (lez.problema) return risposta({ ok: false, errore: "illeggibile", messaggio: testo(lez.problema, 300) }, 422);
    if (!lez.titolo || !Array.isArray(lez.concetti) || !lez.concetti.length) return risposta({ ok: false, errore: "ia" }, 502);
    // le risposte del quiz devono puntare a un'opzione che esiste
    lez.quiz = (lez.quiz || []).filter((q: any) => Array.isArray(q.opzioni) && q.corretta >= 0 && q.corretta < q.opzioni.length);
    delete lez.problema;
    if (materia && !lez.materia) lez.materia = materia;
    if (classe) lez.classe = classe;

    for (let tentativo = 0; tentativo < 5; tentativo++) {
      const codice = codiceCasuale();
      const { error } = await db.from("studio_lezioni").insert({
        codice, titolo: testo(lez.titolo, 200), materia: testo(lez.materia, 80) || null, classe: classe || null,
        autore: autore || null, pagine: immagini.length, contenuto: lez,
      });
      if (!error) return risposta({ ok: true, codice, lezione: lez });
      if (error.code !== "23505") { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
    }
    return risposta({ ok: false, errore: "server" }, 500);
  };
}

export function chiamaClaude(client: Anthropic): Chiama {
  return async (immagini, extra) => {
    const contenuto: any[] = immagini.map((im, i) => [
      { type: "text", text: `Pagina ${i + 1}:` },
      { type: "image", source: { type: "base64", media_type: im.tipo, data: im.dati } },
    ]).flat();
    contenuto.push({ type: "text", text: (extra ? extra + "\n\n" : "") + "Crea la lezione interattiva su queste pagine." });
    const stream = client.beta.messages.stream({
      model: MODELLO,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: ISTRUZIONI,
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: contenuto }],
    } as any);
    const msg: any = await stream.finalMessage();
    if (msg.stop_reason === "refusal" || msg.stop_reason === "max_tokens") throw new Error(msg.stop_reason);
    const blocco = msg.content.find((b: any) => b.type === "text");
    return blocco ? JSON.parse(blocco.text) : null;
  };
}

// Avvio su Supabase (non in test)
// deno-lint-ignore no-explicit-any
const D: any = (globalThis as any).Deno;
if (D && D.serve && D.env) {
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const env = { STUDIO_CODICI: D.env.get("STUDIO_CODICI") };
  D.serve(crea(db, env, chiamaClaude(new Anthropic({ apiKey: D.env.get("ANTHROPIC_API_KEY") }))));
}
