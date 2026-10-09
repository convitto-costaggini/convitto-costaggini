// =====================================================================
// Edge Function: otp-famiglie
// Convitto "Costaggini" — Supabase project sawclsysqnjsvbobioqo
// =====================================================================
// Secondo fattore di autenticazione dell'Area riservata famiglie.
// Il genitore entra con email e password; questa funzione gli invia per
// email un codice di 6 cifre, valido 10 minuti, e lo verifica. Solo dopo
// la verifica le regole del database (famiglie_otp_ok) gli mostrano i
// dati del figlio o della figlia. Il codice vale per la sola sessione in
// cui è stato richiesto.
//
// Azioni (POST, con il token di sessione del genitore in Authorization):
//   { "azione": "invia" }                    → invia un nuovo codice
//   { "azione": "verifica", "codice": "…" }  → verifica il codice
//
// Misure di sicurezza:
//  - il codice non è mai salvato in chiaro: si conserva solo l'impronta
//    SHA-256 di (segreto OTP_PEPPER, sessione, codice);
//  - al massimo 5 tentativi per codice, poi il codice è annullato;
//  - al massimo 5 codici l'ora per account e uno al minuto;
//  - ogni nuovo codice annulla i precedenti della stessa sessione;
//  - i codici più vecchi di 30 giorni vengono cancellati.
//
// L'email parte dall'ambiente Google Workspace for Education dell'Istituto,
// tramite il piccolo progetto Apps Script in supabase/gas-otp/Codice.gs.
//
// Secret da impostare (Edge Functions → Secrets):
//   OTP_PEPPER      stringa casuale lunga (almeno 32 caratteri)
//   OTP_MAIL_URL    URL /exec della web app Apps Script
//   OTP_MAIL_TOKEN  lo stesso valore della proprietà OTP_MAIL_TOKEN
//                   impostata nel progetto Apps Script
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono forniti da Supabase.
//
// Deploy con "Verify JWT" ATTIVO: la funzione risponde solo a chi ha
// una sessione valida.
// =====================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DURATA_MINUTI = 10;
const MAX_TENTATIVI = 5;
const MAX_INVII_ORA = 5;
const ATTESA_TRA_INVII_MS = 60_000;
const CONSERVAZIONE_GIORNI = 30;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function errore(message: string, status: number): Response {
  return json({ success: false, message }, status);
}

// Legge il payload del JWT (già verificato da Supabase e da getUser).
function payloadJwt(jwt: string): Record<string, unknown> {
  try {
    const b64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(pad));
  } catch {
    return {};
  }
}

// 6 cifre uniformemente distribuite (scarta i valori che darebbero distorsione).
function codiceCasuale(): string {
  const limite = Math.floor(0x1_0000_0000 / 1_000_000) * 1_000_000;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= limite);
  return String(buf[0] % 1_000_000).padStart(6, "0");
}

async function impronta(pepper: string, sessionId: string, codice: string): Promise<string> {
  const dati = new TextEncoder().encode(`${pepper}:${sessionId}:${codice}`);
  const hash = await crypto.subtle.digest("SHA-256", dati);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

function ugualeTempoCostante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function inviaEmail(email: string, codice: string): Promise<boolean> {
  const url = Deno.env.get("OTP_MAIL_URL");
  const token = Deno.env.get("OTP_MAIL_TOKEN");
  if (!url || !token) return false;
  try {
    // Apps Script risponde con un redirect: fetch lo segue e legge l'esito.
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token, email, codice, minuti: DURATA_MINUTI }),
    });
    const esito = await resp.json().catch(() => null);
    if (esito?.success !== true) console.error("Invio email OTP non riuscito:", esito?.message ?? resp.status);
    return esito?.success === true;
  } catch (e) {
    console.error("Invio email OTP:", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return errore("Metodo non consentito", 405);

  try {
    const pepper = Deno.env.get("OTP_PEPPER");
    if (!pepper || pepper.length < 32) {
      console.error("OTP_PEPPER mancante o troppo corto");
      return errore("Servizio non configurato. Riprovi più tardi.", 500);
    }

    // 1. Chi sta chiedendo: utente e sessione dal token
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { data: { user } } = await admin.auth.getUser(jwt);
    const sessionId = String(payloadJwt(jwt).session_id || "");
    if (!user || !user.email || !/^[0-9a-f-]{36}$/i.test(sessionId)) {
      return errore("Sessione non valida. Acceda di nuovo.", 401);
    }

    // 2. Solo gli account collegati a uno studente (abilitati dall'amministratore)
    const { data: assoc, error: errAssoc } = await admin
      .from("genitori_studenti").select("id")
      .eq("email_genitore", user.email).limit(1);
    if (errAssoc) throw errAssoc;
    if (!assoc?.length) return errore("Account non ancora abilitato dall'amministratore.", 403);

    const body = await req.json().catch(() => ({}));
    const ora = Date.now();
    const adessoIso = new Date(ora).toISOString();

    // ── INVIO DI UN NUOVO CODICE ──
    if (body.azione === "invia") {
      await admin.from("famiglie_otp").delete()
        .lt("creato_at", new Date(ora - CONSERVAZIONE_GIORNI * 86_400_000).toISOString());

      const { data: recenti, error: errRec } = await admin
        .from("famiglie_otp").select("creato_at")
        .eq("user_id", user.id)
        .gte("creato_at", new Date(ora - 3_600_000).toISOString())
        .order("creato_at", { ascending: false });
      if (errRec) throw errRec;
      if ((recenti?.length ?? 0) >= MAX_INVII_ORA) {
        return errore("Sono stati richiesti troppi codici. Riprovi tra un'ora.", 429);
      }
      if (recenti?.length && ora - Date.parse(recenti[0].creato_at) < ATTESA_TRA_INVII_MS) {
        return errore("Attenda un minuto prima di richiedere un nuovo codice.", 429);
      }

      // I codici precedenti di questa sessione non valgono più
      await admin.from("famiglie_otp").update({ annullato_at: adessoIso })
        .eq("user_id", user.id).eq("session_id", sessionId)
        .is("verificato_at", null).is("annullato_at", null);

      const codice = codiceCasuale();
      const { data: riga, error: errIns } = await admin.from("famiglie_otp").insert({
        user_id: user.id,
        session_id: sessionId,
        codice_hash: await impronta(pepper, sessionId, codice),
        creato_at: adessoIso,
        scade_at: new Date(ora + DURATA_MINUTI * 60_000).toISOString(),
      }).select("id").single();
      if (errIns) throw errIns;

      if (!(await inviaEmail(user.email, codice))) {
        await admin.from("famiglie_otp").update({ annullato_at: new Date().toISOString() }).eq("id", riga.id);
        return errore("Non è stato possibile inviare l'email con il codice. Riprovi tra qualche minuto.", 502);
      }
      return json({ success: true, minuti: DURATA_MINUTI });
    }

    // ── VERIFICA DEL CODICE ──
    if (body.azione === "verifica") {
      const codice = String(body.codice || "").replace(/\D/g, "");
      if (codice.length !== 6) return errore("Il codice è formato da 6 cifre.", 400);

      const { data: righe, error: errSel } = await admin
        .from("famiglie_otp").select("id, codice_hash, scade_at, tentativi")
        .eq("user_id", user.id).eq("session_id", sessionId)
        .is("verificato_at", null).is("annullato_at", null)
        .order("creato_at", { ascending: false }).limit(1);
      if (errSel) throw errSel;
      const riga = righe?.[0];
      if (!riga || Date.parse(riga.scade_at) <= ora) {
        return errore("Il codice è scaduto o non è stato richiesto. Richieda un nuovo codice.", 400);
      }

      // Conta il tentativo prima di confrontare (aggiornamento condizionato:
      // due verifiche simultanee non possono usare lo stesso tentativo).
      const tentativo = riga.tentativi + 1;
      const { data: agg, error: errAgg } = await admin.from("famiglie_otp")
        .update({
          tentativi: tentativo,
          ...(tentativo >= MAX_TENTATIVI ? { annullato_at: adessoIso } : {}),
        })
        .eq("id", riga.id).eq("tentativi", riga.tentativi).is("annullato_at", null)
        .select("id");
      if (errAgg) throw errAgg;
      if (!agg?.length) return errore("Verifica non riuscita. Riprovi.", 409);

      const atteso = await impronta(pepper, sessionId, codice);
      if (!ugualeTempoCostante(atteso, riga.codice_hash)) {
        const rimasti = MAX_TENTATIVI - tentativo;
        return errore(
          rimasti > 0
            ? `Codice non corretto. Tentativi rimasti: ${rimasti}.`
            : "Codice non corretto. Il codice è stato annullato: ne richieda uno nuovo.",
          400,
        );
      }

      const { error: errOk } = await admin.from("famiglie_otp")
        .update({ verificato_at: adessoIso, annullato_at: null }).eq("id", riga.id);
      if (errOk) throw errOk;
      return json({ success: true });
    }

    return errore("Azione non riconosciuta.", 400);
  } catch (e) {
    console.error("otp-famiglie:", e);
    return errore("Errore del servizio. Riprovi più tardi.", 500);
  }
});
