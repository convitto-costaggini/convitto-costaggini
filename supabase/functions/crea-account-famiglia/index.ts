// Copia della funzione pubblicata su Supabase (versione 15, ultima modifica 31/08/2026),
// salvata nel repository il 14/11/2026 per tenerne traccia: prima esisteva solo sul server.
// Nessun segreto è scritto qui: EDU_ACCESS_TOKEN e le chiavi stanno nell'ambiente della funzione.
// =====================================================================
// Edge Function: crea-account-famiglia
// Convitto "Costaggini" — Supabase project sawclsysqnjsvbobioqo
// =====================================================================
// Cosa fa: crea l'account-famiglia in Supabase Auth e inserisce il
// record in genitori_studenti. Sostituisce le due chiamate privilegiate
// che prima il gestionale faceva con la chiave service_role.
//
// La chiave service_role NON è scritta qui: viene letta dall'ambiente
// (SUPABASE_SERVICE_ROLE_KEY), che Supabase fornisce in automatico e
// che non esce mai dai server Supabase.
//
// L'accesso è protetto da un segreto condiviso (EDU_ACCESS_TOKEN), da
// impostare come "secret" della funzione nel pannello Supabase e da
// inviare nell'header x-edu-token a ogni chiamata.
//
// IMPORTANTE in fase di deploy: disattivare "Verify JWT" per questa
// funzione (la protezione è il nostro EDU_ACCESS_TOKEN).
//
// FIX 31/8/26 (audit): prima l'inserimento in genitori_studenti veniva
// SALTATO ogni volta che l'account Auth esisteva già — quindi un genitore
// con due figli al Convitto restava collegato SOLO al primo approvato:
// la seconda approvazione rispondeva "successo" ed inviava comunque
// l'email, ma il secondo figlio non veniva mai davvero agganciato
// all'account. L'inserimento va tentato SEMPRE; il vincolo UNIQUE su
// (email_genitore, nome_studente) e la gestione already-tollerante
// dell'errore duplicate/unique restano a proteggere dalla sola vera
// ripetizione (stesso genitore, stesso figlio, riapprovato per errore).
// =====================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-edu-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

// Password temporanea robusta (12 caratteri, niente lettere ambigue)
function generaPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint32Array(12);
  crypto.getRandomValues(arr);
  let out = "";
  for (const n of arr) out += chars[n % chars.length];
  return out;
}

Deno.serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    // 1. Lasciapassare: solo chi conosce il segreto può procedere
    const token = req.headers.get("x-edu-token");
    const secret = Deno.env.get("EDU_ACCESS_TOKEN");

    if (!token || token !== secret) {
      return json({ success: false, message: "Non autorizzato" }, 401);
    }

    // 2. Lettura e validazione dei dati in ingresso
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim();
    const nome_studente = String(body.nome_studente || "").trim();
    const relazione = String(body.relazione || "Genitore").trim() || "Genitore";

    if (!email || !nome_studente) {
      return json(
        { success: false, message: "Dati mancanti (email, nome_studente)" },
        400,
      );
    }

    // 3. Client con privilegi: la service_role è letta dall'ambiente
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const pwd = generaPassword();

    // 4. Crea l'utente in Supabase Auth
    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      password: pwd,
      email_confirm: true,
      user_metadata: { nome_studente },
    });

    let alreadyExists = false;
    if (createErr) {
      const m = (createErr.message || "").toLowerCase();
      if (
        m.includes("already") || m.includes("registered") || m.includes("exist")
      ) {
        alreadyExists = true; // utente già presente: non è un errore bloccante
      } else {
        return json(
          { success: false, message: "Errore creazione account: " + createErr.message },
          400,
        );
      }
    }

    // 5. Inserisce il record in genitori_studenti — SEMPRE, anche se
    //    l'account Auth esisteva già: è l'unico modo per collegare un
    //    secondo figlio allo stesso genitore. Il vincolo UNIQUE(email,
    //    nome_studente) impedisce comunque i veri duplicati (stesso
    //    figlio riapprovato per errore), gestiti sotto senza bloccare.
    const { error: insErr } = await admin
      .from("genitori_studenti")
      .insert({
        email_genitore: email,
        nome_studente,
        relazione,
      });
    if (insErr) {
      const m = (insErr.message || "").toLowerCase();
      // un duplicato non blocca: il collegamento genitore-figlio esiste già
      if (!m.includes("duplicate") && !m.includes("unique")) {
        console.error("Insert genitori_studenti:", insErr.message);
      }
    }

    // 6. Restituisce l'esito al gestionale (che invierà l'email)
    return json({
      success: true,
      alreadyExists,
      password: alreadyExists ? null : pwd,
    });
  } catch (e) {
    return json({ success: false, message: String(e) }, 500);
  }
});
