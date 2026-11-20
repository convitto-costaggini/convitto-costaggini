// Edge Function "aula-admin": l'amministratore abilita o rifiuta i colleghi che chiedono l'accesso all'Aula (pannello admin, tab "Aula").
// Deploy con verify_jwt=false (il controllo e' qui dentro). Segreti: GAS_URL, GAS_TOKEN (gia' presenti); SUPABASE_URL, SUPABASE_ANON_KEY e
// SUPABASE_SERVICE_ROLE_KEY sono forniti da Supabase.
// Chi chiama manda il proprio token di sessione (Authorization: Bearer ...): si accetta solo se is_admin() e' vero per quel token,
// cioe' amministratore con il secondo passaggio (aal2), come per le regole del database.
//   {azione:"elenco"}                  -> {ok, richieste:[...], docenti:[...]}
//   {azione:"abilita", email}          -> inserisce/riattiva in lingue_docenti, chiude la richiesta, avvisa il collega per mail
//   {azione:"rifiuta", email}          -> chiude la richiesta senza abilitare
//   {azione:"revoca", email}           -> attivo = false in lingue_docenti
import { createClient } from "npm:@supabase/supabase-js@2";

const DOMINI = ["@alberghierorieti.it", "@alberghierorieti.edu.it"];
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const risposta = (corpo: unknown, stato = 200) =>
  new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });
const mailValida = (e: string) => /^[^\s@]{1,64}@[^\s@]{1,190}$/.test(e) && DOMINI.some((d) => e.endsWith(d));
const nomeDaMail = (e: string) => e.split("@")[0].split(/[._-]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(" ").slice(0, 80);

export function crea(db: any, eAdmin: (token: string) => Promise<boolean>, env: Record<string, string | undefined>, invia: (url: string, corpo: unknown) => Promise<boolean>, ora = () => Date.now()) {
  return async function gestisci(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return risposta({ ok: false, errore: "metodo" }, 405);
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token || !await eAdmin(token)) return risposta({ ok: false, errore: "non-autorizzato" }, 403);
    let c: any;
    try { c = await req.json(); } catch { return risposta({ ok: false, errore: "richiesta" }, 400); }
    const adesso = new Date(ora()).toISOString();

    if (c.azione === "elenco") {
      const { data: richieste } = await db.from("aula_richieste").select("*").in("stato", ["in_attesa", "rifiutata"]).order("ultima", { ascending: false }).limit(200);
      const { data: docenti } = await db.from("lingue_docenti").select("email,nome,attivo,creato").order("nome", { ascending: true }).limit(500);
      return risposta({ ok: true, richieste: richieste || [], docenti: docenti || [] });
    }

    const email = String(c.email || "").trim().toLowerCase();
    if (!mailValida(email)) return risposta({ ok: false, errore: "email" }, 400);

    if (c.azione === "abilita") {
      const { error } = await db.from("lingue_docenti").upsert({ email, nome: String(c.nome || "").trim().slice(0, 80) || nomeDaMail(email), attivo: true }, { onConflict: "email" });
      if (error) { console.error("db", error); return risposta({ ok: false, errore: "server" }, 500); }
      await db.from("aula_richieste").upsert({ email, nome: nomeDaMail(email), stato: "abilitata", decisa: adesso, ultima: adesso }, { onConflict: "email" });
      // avviso al collega: se la posta non risponde l'abilitazione resta valida e il pannello lo segnala
      const avvisato = !!env.GAS_URL && !!env.GAS_TOKEN && await invia(env.GAS_URL, { token: env.GAS_TOKEN, to: email, servizio: "abilitato" });
      return risposta({ ok: true, avvisato });
    }
    if (c.azione === "rifiuta") {
      await db.from("aula_richieste").upsert({ email, nome: nomeDaMail(email), stato: "rifiutata", decisa: adesso, ultima: adesso }, { onConflict: "email" });
      return risposta({ ok: true });
    }
    if (c.azione === "revoca") {
      const u = email.split("@")[0];
      const { error } = await db.from("lingue_docenti").update({ attivo: false }).in("email", DOMINI.map((d) => u + d));
      if (error) return risposta({ ok: false, errore: "server" }, 500);
      return risposta({ ok: true });
    }
    return risposta({ ok: false, errore: "azione" }, 400);
  };
}

const D: any = (globalThis as any).Deno;
if (D && D.serve && D.env) {
  const url = D.env.get("SUPABASE_URL")!;
  const db = createClient(url, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  // is_admin() lavora sul token di chi chiama: lo si interroga con quel token
  const eAdmin = async (token: string) => {
    try {
      const c = createClient(url, D.env.get("SUPABASE_ANON_KEY")!, { auth: { persistSession: false }, global: { headers: { Authorization: "Bearer " + token } } });
      const { data, error } = await c.rpc("is_admin");
      return !error && data === true;
    } catch { return false; }
  };
  const invia = async (u: string, corpo: unknown) => {
    try {
      const r = await fetch(u, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo), redirect: "follow" });
      const t = await r.json().catch(() => null);
      return !!(t && t.ok);
    } catch { return false; }
  };
  D.serve(crea(db, eAdmin, { GAS_URL: D.env.get("GAS_URL"), GAS_TOKEN: D.env.get("GAS_TOKEN") }, invia));
}
