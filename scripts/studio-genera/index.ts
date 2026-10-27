// Edge Function "studio-genera": dalle foto delle pagine del libro a una lezione interattiva (minisito /studio).
// Deploy con verify_jwt=false (i controlli sono qui dentro).
// Accesso di docenti ed educatori: con la mail istituzionale e un codice monouso spedito per posta (come /lingue),
// poi con la "sessione" firmata che la funzione restituisce; oppure con un codice di scorta di STUDIO_CODICI.
// Segreti: GAS_URL e GAS_TOKEN (lo script di posta, gli stessi di lingue-accesso), STUDIO_CODICI (codici di scorta, facoltativi),
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono forniti da Supabase; dalla seconda deriva la chiave che firma le sessioni.
//   {azione:"richiedi", email}                     -> spedisce il codice alla mail istituzionale
//   {azione:"verifica", email, codice}             -> se il codice e' giusto, {ok, sessione, email, nome}
// Tutte le altre richieste hanno sessione (o codice_docente); l'autore di una lezione e' la persona che l'ha pubblicata:
//   {prova:true}                                   -> verifica l'accesso
//   {mie:true}                                     -> le lezioni dell'autore (e quelle senza autore, pubblicate prima)
//   {archivio:true}                                -> le lezioni condivise da tutti gli educatori
//   {leggi:codice}                                 -> una lezione intera (propria, senza autore o condivisa)
//   {lezione, classe?, autore?, anno?, materia?, condivisa?}            -> pubblica una lezione gia' pronta: nessun costo
//   {modifica:codice, lezione, classe?, autore?, anno?, materia?, condivisa?} -> la corregge (solo l'autore)
//   {elimina:codice}                               -> la cancella (solo l'autore)
//   {revisioni:true} / {revisione:{chiave, lingua, stato:"ok"|"proposta"|"via", testo, proposta?, nota?}}
//                                                  -> Lingue: le spunte dei docenti sulle frasi (solo con la mail)
//   {correggi:{chiave, lingua, originale, testo, nota?}} / {annulla:{chiave, lingua}} -> Lingue: correzione subito valida per tutti
//   {correzioni:true} (senza accesso)              -> Lingue: le correzioni in vigore, per tutte le pagine
// Risposta: {ok:true, ...} oppure {ok:false, errore, messaggio?}
// Nessun servizio di IA a pagamento: l'educatore prepara la lezione con un assistente esterno e la incolla qui.

import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_ORA = 30; // lezioni create in un'ora, in tutto: freno contro gli abusi
const MAX_LEZIONE = 120_000; // caratteri del JSON di una lezione incollata
const MAX_ELENCO = 300; // lezioni mostrate nell'elenco degli educatori
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // niente 0/O, 1/I
const DOMINI = ["@alberghierorieti.it", "@alberghierorieti.edu.it"];
const OTP_SCADENZA_MS = 10 * 60 * 1000, OTP_PAUSA_MS = 30 * 1000, OTP_FINESTRA_MS = 60 * 60 * 1000, OTP_INVII = 5, OTP_TENTATIVI = 5;
const SESSIONE_MS = 60 * 24 * 3600 * 1000; // un dispositivo resta riconosciuto per 60 giorni

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
  intervista: oggetto({ personaggio: S, chi: S, emoji: S, domande: lista(oggetto({ domanda: S, risposta: S, sbagliate: lista(S) })) }),
  da_ricordare: lista(S),
});

// ───── la funzione ─────
type Db = any;

async function impronta(codice: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codice));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function b64u(b: Uint8Array) { let s = ""; b.forEach((x) => s += String.fromCharCode(x)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function deb64u(t: string) { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return Uint8Array.from(atob(t), (c) => c.charCodeAt(0)); }
async function hmac(chiave: string, testo: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(chiave), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(testo))));
}
// sessione = dati.firma: chi la manda e' la persona della mail, finche' non scade
async function firmaSessione(chiave: string, email: string, scade: number) {
  const dati = b64u(new TextEncoder().encode(JSON.stringify({ e: email, s: scade })));
  return dati + "." + await hmac(chiave, dati);
}
async function leggiSessione(chiave: string, t: unknown, adesso: number) {
  const [dati, firma] = String(t || "").split(".");
  if (!dati || !firma || !chiave || firma !== await hmac(chiave, dati)) return null;
  try { const o = JSON.parse(new TextDecoder().decode(deb64u(dati))); return o.s > adesso && typeof o.e === "string" ? o.e : null; } catch { return null; }
}
function mailValida(email: string) { return /^[^\s@]{1,64}@[^\s@]{1,190}$/.test(email) && DOMINI.some((d) => email.endsWith(d)); }
// "mario.rossi@..." -> "Mario Rossi"
function nomeDaMail(email: string) { return email.split("@")[0].split(/[._-]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(" ").slice(0, 80); }
function codiceSeiCifre() { const v = new Uint32Array(1); crypto.getRandomValues(v); return String(v[0] % 1000000).padStart(6, "0"); }

// una lezione incollata o corretta: solo i campi previsti, e almeno titolo e concetti
function pulisci(l: any) {
  if (!l || typeof l !== "object" || Array.isArray(l) || JSON.stringify(l).length > MAX_LEZIONE) return null;
  // "..." è il segnaposto delle istruzioni: una lezione vera ha un titolo e almeno un'idea spiegata con parole
  const pieno = (v: unknown) => typeof v === "string" && /[\p{L}\p{N}]/u.test(v);
  if (!pieno(l.titolo) || !Array.isArray(l.concetti) || !l.concetti.some((c: any) => c && pieno(c.spiegazione))) return null;
  const p: any = {};
  for (const k of Object.keys(SCHEMA.properties)) if (k !== "problema" && l[k] !== undefined) p[k] = l[k];
  // le risposte del quiz devono puntare a un'opzione che esiste
  p.quiz = (Array.isArray(p.quiz) ? p.quiz : []).filter((q: any) => q && Array.isArray(q.opzioni) && Number.isInteger(q.corretta) && q.corretta >= 0 && q.corretta < q.opzioni.length);
  return p;
}

// la correzione in vigore per ogni frase e lingua: la più recente fra quelle non annullate (le righe arrivano dalla più recente)
function inVigore(righe: any[]) {
  const visti = new Set<string>(), out: { k: string; l: string; t: string }[] = [];
  for (const r of righe) { const id = r.chiave + "\u0000" + r.lingua; if (!visti.has(id)) { visti.add(id); out.push({ k: r.chiave, l: r.lingua, t: r.testo }); } }
  return out;
}

const ELENCO = "codice,titolo,materia,classe,anno,autore,condivisa,aperture,created_at,modificata,proprietario,icona:contenuto->>icona,sottotitolo:contenuto->>sottotitolo";

type Invia = (url: string, corpo: unknown) => Promise<boolean>;

export function crea(db: Db, env: Record<string, string | undefined>, invia: Invia = async () => false, ora = () => Date.now()) {
  const codici = (env.STUDIO_CODICI || "").split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
  const scorte = Promise.all(codici.map(impronta)); // le lezioni pubblicate con un codice di scorta sono di tutti
  const firma = env.FIRMA || "";
  return async function gestisci(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return risposta({ ok: false, errore: "metodo" }, 405);
    let c: any;
    try { c = await req.json(); } catch { return risposta({ ok: false, errore: "richiesta" }, 400); }

    const adesso = ora();

    // ───── accesso con la mail istituzionale ─────
    if (c.azione === "richiedi" || c.azione === "verifica") {
      const email = String(c.email || "").trim().toLowerCase();
      if (!mailValida(email)) return risposta({ ok: false, errore: "email" }, 400);
      if (!firma) return risposta({ ok: false, errore: "configurazione" }, 503);
      if (c.azione === "richiedi") {
        if (!env.GAS_URL || !env.GAS_TOKEN) return risposta({ ok: false, errore: "posta" }, 503);
        const { data: riga } = await db.from("studio_otp").select("*").eq("email", email).maybeSingle();
        let finestra = adesso, invii = 1;
        if (riga) {
          if (adesso - new Date(riga.ultimo_invio).getTime() < OTP_PAUSA_MS) return risposta({ ok: false, errore: "troppo-presto" }, 429);
          if (adesso - new Date(riga.finestra).getTime() < OTP_FINESTRA_MS) {
            if (riga.invii_finestra >= OTP_INVII) return risposta({ ok: false, errore: "troppi" }, 429);
            finestra = new Date(riga.finestra).getTime(); invii = riga.invii_finestra + 1;
          }
        }
        const codice = codiceSeiCifre();
        const { error } = await db.from("studio_otp").upsert({
          email, hash: await impronta(`${email}:${codice}:${firma}`), scade: new Date(adesso + OTP_SCADENZA_MS).toISOString(), tentativi: 0,
          ultimo_invio: new Date(adesso).toISOString(), finestra: new Date(finestra).toISOString(), invii_finestra: invii,
        });
        if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
        if (!await invia(env.GAS_URL, { token: env.GAS_TOKEN, to: email, codice, servizio: "studio" })) return risposta({ ok: false, errore: "posta" }, 502);
        return risposta({ ok: true });
      }
      const codice = String(c.codice || "").replace(/\D/g, "");
      const { data: riga } = await db.from("studio_otp").select("*").eq("email", email).maybeSingle();
      if (codice.length !== 6 || !riga || new Date(riga.scade).getTime() < adesso || riga.tentativi >= OTP_TENTATIVI) return risposta({ ok: false, errore: "otp" }, 401);
      if (await impronta(`${email}:${codice}:${firma}`) !== riga.hash) {
        await db.from("studio_otp").update({ tentativi: riga.tentativi + 1 }).eq("email", email);
        return risposta({ ok: false, errore: "otp" }, 401);
      }
      await db.from("studio_otp").delete().eq("email", email); // monouso
      return risposta({ ok: true, sessione: await firmaSessione(firma, email, adesso + SESSIONE_MS), email, nome: nomeDaMail(email) });
    }

    // ───── Lingue, pubblico: le correzioni dei docenti in vigore (l'ultima non annullata per frase e lingua) ─────
    if (c.correzioni && !c.sessione) {
      const { data, error } = await db.from("lingue_correzioni").select("chiave,lingua,testo,creata").is("annullata", null).order("creata", { ascending: false }).limit(5000);
      if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      return risposta({ ok: true, correzioni: inVigore(data || []) });
    }

    // ───── chi e': la persona della sessione, oppure un codice di scorta ─────
    const email = await leggiSessione(firma, c.sessione, adesso);
    const cod = String(c.codice_docente || "").trim().toLowerCase();
    if (!email && !(cod && codici.includes(cod))) {
      if (c.sessione) return risposta({ ok: false, errore: "sessione" }, 401);
      return risposta({ ok: false, errore: cod ? "codice" : "accesso" }, 403);
    }
    if (c.prova) return risposta({ ok: true, email }); // solo verifica dell'accesso

    // ───── Lingue: le spunte di revisione dei docenti (serve l'accesso con la mail: la spunta porta il nome) ─────
    if (c.revisioni || c.revisione || c.correggi || c.annulla) {
      if (!email) return risposta({ ok: false, errore: "mail" }, 403);
      const nome = nomeDaMail(email);
      if (c.correggi) {
        const r = c.correggi || {}, chiave = testo(r.chiave, 200), lingua = String(r.lingua || ""), nuovo = testo(r.testo, 2000);
        if (!chiave || !["en", "fr", "es"].includes(lingua) || !nuovo) return risposta({ ok: false, errore: "richiesta" }, 400);
        const { error } = await db.from("lingue_correzioni").insert({ chiave, lingua, originale: testo(r.originale, 2000) || null, testo: nuovo, nota: testo(r.nota, 300) || null, nome });
        if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      }
      if (c.annulla) {
        const chiave = testo(c.annulla.chiave, 200), lingua = String(c.annulla.lingua || "");
        const { data: ultima } = await db.from("lingue_correzioni").select("id").eq("chiave", chiave).eq("lingua", lingua).is("annullata", null).order("creata", { ascending: false }).limit(1).maybeSingle();
        if (ultima) {
          const { error } = await db.from("lingue_correzioni").update({ annullata: new Date(adesso).toISOString(), annullata_da: nome }).eq("id", ultima.id);
          if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
        }
      }
      if (c.revisione) {
        const r = c.revisione || {}, chiave = testo(r.chiave, 200), lingua = String(r.lingua || "");
        if (!chiave || !["en", "fr", "es"].includes(lingua) || !["ok", "proposta", "via"].includes(r.stato)) return risposta({ ok: false, errore: "richiesta" }, 400);
        const { error } = r.stato === "via"
          ? await db.from("lingue_revisioni").delete().eq("chiave", chiave).eq("lingua", lingua).eq("nome", nome)
          : await db.from("lingue_revisioni").upsert({
            chiave, lingua, nome, stato: r.stato, testo: testo(r.testo, 300) || null,
            proposta: r.stato === "proposta" ? testo(r.proposta, 300) || null : null, nota: testo(r.nota, 300) || null, aggiornata: new Date(adesso).toISOString(),
          }, { onConflict: "chiave,lingua,nome" });
        if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      }
      const { data, error } = await db.from("lingue_revisioni").select("chiave,lingua,nome,stato,proposta,nota,aggiornata").limit(5000);
      if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      const { data: storia, error: e2 } = await db.from("lingue_correzioni").select("chiave,lingua,originale,testo,nota,nome,creata,annullata,annullata_da").order("creata", { ascending: false }).limit(5000);
      if (e2) { console.error("db", e2); return risposta({ ok: false, errore: "server" }, 500); }
      // delle spunte e delle correzioni si conserva solo il nome (ricavato dalla mail), mai la mail
      return risposta({
        ok: true, revisioni: (data || []).map((x: any) => ({ ...x, mia: x.nome === nome })),
        storia: (storia || []).map((x: any) => ({ ...x, mia: x.nome === nome })), correzioni: inVigore((storia || []).filter((x: any) => !x.annullata)),
      });
    }
    const io = await impronta(email ? "mail:" + email : cod);
    const comuni = await scorte;
    const mia = (r: any) => !r.proprietario || r.proprietario === io || comuni.includes(r.proprietario);
    const elenco = (righe: any[]) => righe.map(({ proprietario, ...r }: any) => ({ ...r, mia: mia({ proprietario }) }));
    const dati = () => ({
      classe: testo(c.classe, 40) || null, autore: testo(c.autore, 80) || (email ? nomeDaMail(email) : null), materia: testo(c.materia, 80) || null,
      anno: [1, 2, 3, 4, 5].includes(Number(c.anno)) ? Number(c.anno) : null, condivisa: c.condivisa === true,
    });

    if (c.mie || c.elenco || c.archivio) { // "elenco" e' il nome usato dalla prima versione della pagina educatori
      let q = db.from("studio_lezioni").select(ELENCO);
      q = c.archivio ? q.eq("condivisa", true) : q.or([`proprietario.is.null`, `proprietario.eq.${io}`, ...comuni.map((h) => `proprietario.eq.${h}`)].join(","));
      const { data, error } = await q.order("created_at", { ascending: false }).limit(MAX_ELENCO);
      if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      return risposta({ ok: true, lezioni: elenco(data || []) });
    }

    const codiceLezione = (x: unknown) => { const k = String(x || "").toUpperCase(); return /^[A-Z2-9]{6}$/.test(k) ? k : ""; };
    if (c.leggi !== undefined || c.modifica !== undefined || c.elimina !== undefined) {
      const k = codiceLezione(c.leggi ?? c.modifica ?? c.elimina);
      if (!k) return risposta({ ok: false, errore: "non-trovata" }, 404);
      const { data: r } = await db.from("studio_lezioni").select("codice,proprietario,condivisa,contenuto,titolo,materia,classe,anno,autore").eq("codice", k).maybeSingle();
      if (!r || (!mia(r) && !(c.leggi !== undefined && r.condivisa))) return risposta({ ok: false, errore: "non-trovata" }, 404);
      if (c.leggi !== undefined) {
        const { proprietario, ...resto } = r;
        return risposta({ ok: true, lezione: { ...resto, mia: mia(r) } });
      }
      if (c.elimina !== undefined) {
        const { error } = await db.from("studio_lezioni").delete().eq("codice", k);
        if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
        return risposta({ ok: true });
      }
      const lez = pulisci(c.lezione);
      if (!lez) return risposta({ ok: false, errore: "lezione" }, 400);
      const d = dati();
      if (d.classe) lez.classe = d.classe; else delete lez.classe;
      if (d.materia) lez.materia = d.materia;
      const { error } = await db.from("studio_lezioni").update({
        ...d, titolo: testo(lez.titolo, 200), materia: testo(lez.materia, 80) || null, contenuto: lez,
        proprietario: io, modificata: new Date(adesso).toISOString(),
      }).eq("codice", k);
      if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      return risposta({ ok: true, codice: k, lezione: lez });
    }

    const { count } = await db.from("studio_lezioni").select("codice", { count: "exact", head: true }).gte("created_at", new Date(adesso - 3600_000).toISOString());
    if ((count ?? 0) >= MAX_ORA) return risposta({ ok: false, errore: "troppe" }, 429);

    // lezione gia' pronta, preparata dall'educatore con Claude, ChatGPT o Gemini
    if (c.lezione !== undefined) {
      const lez = pulisci(c.lezione);
      if (!lez) return risposta({ ok: false, errore: "lezione" }, 400);
      return salva(db, lez, { ...dati(), proprietario: io, pagine: 0 });
    }

    return risposta({ ok: false, errore: "richiesta" }, 400);
  };
}

async function salva(db: Db, lez: any, d: { classe: string | null; autore: string | null; materia: string | null; anno: number | null; condivisa: boolean; proprietario: string; pagine: number }) {
  if (d.classe) lez.classe = d.classe;
  if (d.materia) lez.materia = d.materia;
  for (let tentativo = 0; tentativo < 5; tentativo++) {
    const codice = codiceCasuale();
    const { error } = await db.from("studio_lezioni").insert({
      ...d, codice, titolo: testo(lez.titolo, 200), materia: testo(lez.materia, 80) || null, contenuto: lez,
    });
    if (!error) return risposta({ ok: true, codice, lezione: lez });
    if (error.code !== "23505") { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
  }
  return risposta({ ok: false, errore: "server" }, 500);
}

// Avvio su Supabase (non in test)
// deno-lint-ignore no-explicit-any
const D: any = (globalThis as any).Deno;
if (D && D.serve && D.env) {
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const env = {
    STUDIO_CODICI: D.env.get("STUDIO_CODICI"),
    GAS_URL: D.env.get("GAS_URL"), GAS_TOKEN: D.env.get("GAS_TOKEN"),
    FIRMA: "studio-sessione:" + D.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  };
  const invia = async (url: string, corpo: unknown) => {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo), redirect: "follow" });
      const t = await r.json().catch(() => null);
      return !!(t && t.ok);
    } catch { return false; }
  };
  D.serve(crea(db, env, invia));
}
