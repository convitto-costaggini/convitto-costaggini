// Edge Function "aula-accesso": un solo accesso (codice monouso per e-mail) per tutta l'Aula.
// Deploy con verify_jwt=false (i controlli sono qui dentro). Segreti richiesti: GAS_URL, GAS_TOKEN.
// Sostituisce lingue-accesso. Il codice monouso e la "sessione" sono quelli di studio-genera (stessa tabella studio_otp,
// stessa firma), quindi la sessione rilasciata qui vale anche per la Sala studio e viceversa.
//   {azione:"richiedi", email}            -> spedisce il codice solo se l'indirizzo e' abilitato in lingue_docenti (risposta ok:true identica negli altri casi)
//   {azione:"verifica", email, codice}    -> {ok, sessione, email, nome, chiave}  (solo docenti abilitati; gli altri: 403 non-abilitato, nessuna sessione)
//   {azione:"chiave", sessione}           -> {ok, chiave}  (sessione valida + docente abilitato: niente secondo codice)
// La chiave dei materiali riservati non esce mai senza una sessione valida e senza l'abilitazione in lingue_docenti.
import { createClient } from "npm:@supabase/supabase-js@2";

const OTP_SCADENZA_MS = 10 * 60 * 1000, OTP_PAUSA_MS = 30 * 1000, OTP_FINESTRA_MS = 60 * 60 * 1000, OTP_INVII = 5, OTP_TENTATIVI = 5;
const SESSIONE_MS = 60 * 24 * 3600 * 1000;
const MAX_NUOVE_ORA = 30;
const DOMINI = ["@alberghierorieti.it", "@alberghierorieti.edu.it"];
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const risposta = (corpo: unknown, stato = 200) =>
  new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });

async function impronta(t: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}
function b64u(b: Uint8Array) { let s = ""; b.forEach((x) => s += String.fromCharCode(x)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function deb64u(t: string) { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return Uint8Array.from(atob(t), (c) => c.charCodeAt(0)); }
async function hmac(chiave: string, testo: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(chiave), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(testo))));
}
async function firmaSessione(chiave: string, email: string, scade: number) {
  const dati = b64u(new TextEncoder().encode(JSON.stringify({ e: email, s: scade })));
  return dati + "." + await hmac(chiave, dati);
}
async function leggiSessione(chiave: string, t: unknown, adesso: number) {
  const [dati, firma] = String(t || "").split(".");
  if (!dati || !firma || !chiave || firma !== await hmac(chiave, dati)) return null;
  try { const o = JSON.parse(new TextDecoder().decode(deb64u(dati))); return o.s > adesso && typeof o.e === "string" ? o.e : null; } catch { return null; }
}
const mailValida = (e: string) => /^[^\s@]{1,64}@[^\s@]{1,190}$/.test(e) && DOMINI.some((d) => e.endsWith(d));
const varianti = (e: string) => { const u = e.split("@")[0]; return DOMINI.map((d) => u + d); };
const nomeDaMail = (e: string) => e.split("@")[0].split(/[._-]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(" ").slice(0, 80);
function codiceSeiCifre() { const v = new Uint32Array(1); crypto.getRandomValues(v); return String(v[0] % 1000000).padStart(6, "0"); }

export function crea(db: any, env: Record<string, string | undefined>, invia: (url: string, corpo: unknown) => Promise<boolean>, ora = () => Date.now()) {
  const firma = env.FIRMA || "";
  // @alberghierorieti.it e @alberghierorieti.edu.it sono la stessa casella: l'elenco vale per entrambe le forme.
  // Se una delle due forme e' revocata (attivo = false), l'accesso resta chiuso.
  async function abilitato(email: string) {
    const { data: righe } = await db.from("lingue_docenti").select("email,attivo").in("email", varianti(email));
    return !!righe && righe.length > 0 && !righe.some((r: any) => !r.attivo);
  }
  async function chiaveSeAbilitato(email: string) {
    if (!await abilitato(email)) return null;
    const { data: k } = await db.from("lingue_chiave").select("chiave").order("id", { ascending: false }).limit(1).maybeSingle();
    return k ? k.chiave as string : null;
  }
  // Registra la richiesta di abilitazione di chi non e' in elenco. Una riga per indirizzo; chi e' stato rifiutato non rientra in coda.
  // Freno: non piu' di MAX_NUOVE_ORA richieste nuove all'ora, in tutto (contro chi prova indirizzi a caso).
  async function registra(email: string, adesso: number) {
    if (!/^[a-z0-9._-]{1,64}@/.test(email)) return; // solo indirizzi "normali": il pannello admin mostra questi testi
    try {
      const { data: riga } = await db.from("aula_richieste").select("email,stato,tentativi").eq("email", email).maybeSingle();
      if (riga) { await db.from("aula_richieste").update({ tentativi: (riga.tentativi || 1) + 1, ultima: new Date(adesso).toISOString() }).eq("email", email); return; }
      const { count } = await db.from("aula_richieste").select("email", { count: "exact", head: true }).gt("creata", new Date(adesso - 3600_000).toISOString());
      if ((count || 0) >= MAX_NUOVE_ORA) return;
      await db.from("aula_richieste").insert({ email, nome: nomeDaMail(email), ultima: new Date(adesso).toISOString(), creata: new Date(adesso).toISOString() });
    } catch (e) { console.error("richieste", e); }
  }
  return async function gestisci(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return risposta({ ok: false, errore: "metodo" }, 405);
    let c: any;
    try { c = await req.json(); } catch { return risposta({ ok: false, errore: "richiesta" }, 400); }
    if (!firma) return risposta({ ok: false, errore: "configurazione" }, 503);
    const adesso = ora();

    if (c.azione === "chiave") {
      const email = await leggiSessione(firma, c.sessione, adesso);
      if (!email) return risposta({ ok: false, errore: "sessione" }, 401);
      const k = await chiaveSeAbilitato(email);
      return k ? risposta({ ok: true, chiave: k }) : risposta({ ok: false, errore: "non-abilitato" }, 403);
    }

    const email = String(c.email || "").trim().toLowerCase();
    if (!mailValida(email)) return risposta({ ok: false, errore: "email" }, 400);

    if (c.azione === "richiedi") {
      if (!env.GAS_URL || !env.GAS_TOKEN) return risposta({ ok: false, errore: "posta" }, 503);
      // Il codice parte solo per gli indirizzi abilitati in lingue_docenti. A chi non e' in elenco si risponde allo stesso modo
      // (ok:true), senza spedire nulla e senza scrivere in studio_otp: da fuori non si distingue un indirizzo abilitato da uno no.
      // La richiesta resta in aula_richieste e l'amministratore la approva dal pannello.
      if (!await abilitato(email)) { await registra(email, adesso); return risposta({ ok: true }); }
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
      if (!await invia(env.GAS_URL, { token: env.GAS_TOKEN, to: email, codice, servizio: "aula" })) return risposta({ ok: false, errore: "posta" }, 502);
      return risposta({ ok: true });
    }

    if (c.azione === "verifica") {
      const codice = String(c.codice || "").replace(/\D/g, "");
      const { data: riga } = await db.from("studio_otp").select("*").eq("email", email).maybeSingle();
      if (codice.length !== 6 || !riga || new Date(riga.scade).getTime() < adesso || riga.tentativi >= OTP_TENTATIVI) return risposta({ ok: false, errore: "codice" }, 401);
      if (await impronta(`${email}:${codice}:${firma}`) !== riga.hash) {
        await db.from("studio_otp").update({ tentativi: riga.tentativi + 1 }).eq("email", email);
        return risposta({ ok: false, errore: "codice" }, 401);
      }
      await db.from("studio_otp").delete().eq("email", email); // monouso
      const chiave = await chiaveSeAbilitato(email);
      if (!chiave) return risposta({ ok: false, errore: "non-abilitato" }, 403); // niente sessione a chi non e' in elenco
      return risposta({ ok: true, sessione: await firmaSessione(firma, email, adesso + SESSIONE_MS), email, nome: nomeDaMail(email), ...(chiave ? { chiave } : {}) });
    }
    return risposta({ ok: false, errore: "azione" }, 400);
  };
}

const D: any = (globalThis as any).Deno;
if (D && D.serve && D.env) {
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  // stessa firma di studio-genera: le sessioni sono intercambiabili
  const env = { GAS_URL: D.env.get("GAS_URL"), GAS_TOKEN: D.env.get("GAS_TOKEN"), FIRMA: "studio-sessione:" + D.env.get("SUPABASE_SERVICE_ROLE_KEY") };
  const invia = async (url: string, corpo: unknown) => {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo), redirect: "follow" });
      const t = await r.json().catch(() => null);
      return !!(t && t.ok);
    } catch { return false; }
  };
  D.serve(crea(db, env, invia));
}
