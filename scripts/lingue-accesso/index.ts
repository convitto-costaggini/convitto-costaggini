// Edge Function "lingue-accesso": codice monouso per e-mail per l'area docenti di /lingue.
// Deploy con verify_jwt=false (i controlli sono qui dentro). Segreti richiesti: GAS_URL, GAS_TOKEN.
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono forniti da Supabase.
// Azioni (POST JSON):
//   {azione:"richiedi", email}            -> invia il codice se l'e-mail e' abilitata; risposta sempre {ok:true}
//   {azione:"verifica", email, codice}    -> se il codice e' giusto, {ok:true, chiave}

import { createClient } from "npm:@supabase/supabase-js@2";

const SCADENZA_MS = 10 * 60 * 1000;
const PAUSA_MS = 30 * 1000;
const FINESTRA_MS = 60 * 60 * 1000;
const MAX_INVII = 5;
const MAX_TENTATIVI = 5;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function risposta(corpo: unknown, stato = 200) {
  return new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

async function sha256(testo: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(testo));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function codiceCasuale() {
  const v = new Uint32Array(1);
  crypto.getRandomValues(v);
  return String(v[0] % 1000000).padStart(6, "0");
}

export function crea(db: any, env: Record<string, string | undefined>, invia: (url: string, corpo: unknown) => Promise<boolean>, ora = () => Date.now()) {
  return async function gestisci(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return risposta({ ok: false, errore: "metodo" }, 405);
    let c: any;
    try { c = await req.json(); } catch { return risposta({ ok: false, errore: "richiesta" }, 400); }
    const email = String(c.email || "").trim().toLowerCase();
    if (!/^[^\s@]{1,64}@[^\s@]{1,190}$/.test(email)) return risposta({ ok: false, errore: "email" }, 400);
    const pepe = env.GAS_TOKEN || "";
    const adesso = ora();

    if (c.azione === "richiedi") {
      const { data: doc } = await db.from("lingue_docenti").select("email,attivo").eq("email", email).maybeSingle();
      if (!doc || !doc.attivo) return risposta({ ok: true }); // stessa risposta: non si rivela chi e' abilitato
      const { data: riga } = await db.from("lingue_otp").select("*").eq("email", email).maybeSingle();
      let finestra = adesso, invii = 1;
      if (riga) {
        if (adesso - new Date(riga.ultimo_invio).getTime() < PAUSA_MS) return risposta({ ok: false, errore: "troppo-presto" }, 429);
        if (adesso - new Date(riga.finestra).getTime() < FINESTRA_MS) {
          if (riga.invii_finestra >= MAX_INVII) return risposta({ ok: false, errore: "troppi" }, 429);
          finestra = new Date(riga.finestra).getTime();
          invii = riga.invii_finestra + 1;
        }
      }
      const codice = codiceCasuale();
      const { error } = await db.from("lingue_otp").upsert({
        email,
        hash: await sha256(`${email}:${codice}:${pepe}`),
        scade: new Date(adesso + SCADENZA_MS).toISOString(),
        tentativi: 0,
        ultimo_invio: new Date(adesso).toISOString(),
        finestra: new Date(finestra).toISOString(),
        invii_finestra: invii,
      });
      if (error) return risposta({ ok: false, errore: "server" }, 500);
      const spedito = await invia(env.GAS_URL || "", { token: pepe, to: email, codice });
      if (!spedito) return risposta({ ok: false, errore: "invio" }, 502);
      return risposta({ ok: true });
    }

    if (c.azione === "verifica") {
      const codice = String(c.codice || "").replace(/\D/g, "");
      if (codice.length !== 6) return risposta({ ok: false, errore: "codice" }, 400);
      const { data: riga } = await db.from("lingue_otp").select("*").eq("email", email).maybeSingle();
      if (!riga || new Date(riga.scade).getTime() < adesso || riga.tentativi >= MAX_TENTATIVI) return risposta({ ok: false, errore: "codice" }, 401);
      if ((await sha256(`${email}:${codice}:${pepe}`)) !== riga.hash) {
        await db.from("lingue_otp").update({ tentativi: riga.tentativi + 1 }).eq("email", email);
        return risposta({ ok: false, errore: "codice" }, 401);
      }
      await db.from("lingue_otp").delete().eq("email", email); // monouso
      const { data: doc } = await db.from("lingue_docenti").select("email,attivo").eq("email", email).maybeSingle();
      if (!doc || !doc.attivo) return risposta({ ok: false, errore: "codice" }, 401);
      const { data: k } = await db.from("lingue_chiave").select("chiave").eq("id", 1).maybeSingle();
      if (!k) return risposta({ ok: false, errore: "server" }, 500);
      return risposta({ ok: true, chiave: k.chiave });
    }
    return risposta({ ok: false, errore: "azione" }, 400);
  };
}

// Avvio su Supabase (non in test)
// deno-lint-ignore no-explicit-any
const D: any = (globalThis as any).Deno;
if (D && D.serve && D.env) {
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const env = { GAS_URL: D.env.get("GAS_URL"), GAS_TOKEN: D.env.get("GAS_TOKEN") };
  const invia = async (url: string, corpo: unknown) => {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo), redirect: "follow" });
      const t = await r.json().catch(() => null);
      return !!(t && t.ok);
    } catch { return false; }
  };
  D.serve(crea(db, env, invia));
}
