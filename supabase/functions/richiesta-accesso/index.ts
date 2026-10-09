// =====================================================================
// Edge Function: richiesta-accesso
// Convitto "Costaggini" — Supabase project sawclsysqnjsvbobioqo
// =====================================================================
// Cosa fa: riceve la richiesta di accesso all'area riservata famiglie,
// verifica il token reCAPTCHA Enterprise lato server (Google Cloud) e
// solo se la verifica passa inserisce il record in richieste_accesso.
//
// Dal 06/10/2026 registra anche il consenso prestato con la casella del
// modulo nel registro consensi_privacy (servizio "area_famiglie"), con
// data e versione dell'informativa accettata. Se la registrazione del
// consenso non riesce, l'errore viene scritto nei log ma la richiesta
// non viene interrotta.
//
// Dal 09/10/2026 (informativa versione 1.3) la casella attesta la lettura
// dell'informativa e la richiesta di attivazione; il consenso è il modulo
// firmato, la cui ricezione l'amministratore registra all'approvazione
// (richieste_accesso.modulo_consenso_ricevuto / _rif).
//
// La chiave API di Google Cloud NON è scritta qui: va impostata come
// secret del progetto Supabase con il nome RECAPTCHA_API_KEY
// (Edge Functions → Secrets).
// =====================================================================

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

const SOGLIA_PUNTEGGIO = 0.5;
const AZIONE_ATTESA = "richiesta_accesso";
const RECAPTCHA_PROJECT_ID = "convitto-costagg-1786033824350";
const RECAPTCHA_SITE_KEY = "6LersXgtAAAAAA5GJi_R_MQUeJqI0pWmu1-ww-WO";
const INFORMATIVA_AREA = "area-famiglie-2026-10-09";

async function verificaRecaptcha(token: string): Promise<boolean> {
  const apiKey = Deno.env.get("RECAPTCHA_API_KEY");
  if (!apiKey || !token) return false;
  try {
    const resp = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: {
            token,
            expectedAction: AZIONE_ATTESA,
            siteKey: RECAPTCHA_SITE_KEY,
          },
        }),
      },
    );
    const esito = await resp.json();
    const tp = esito?.tokenProperties;
    const score = esito?.riskAnalysis?.score;
    if (!resp.ok || !tp) {
      console.error("Assessment reCAPTCHA fallita:", JSON.stringify(esito));
      return false;
    }
    return (
      tp.valid === true &&
      tp.action === AZIONE_ATTESA &&
      typeof score === "number" &&
      score >= SOGLIA_PUNTEGGIO
    );
  } catch (e) {
    console.error("Errore verifica reCAPTCHA:", e);
    return false;
  }
}

function headersRest(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "apikey": Deno.env.get("SUPABASE_ANON_KEY")!,
    "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")!}`,
    "Prefer": "return=minimal",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot: se il campo trappola è compilato, è quasi certamente un
    // bot. Rispondiamo "successo" senza fare nulla.
    if (String(body.botField || "").trim() !== "") {
      return json({ success: true });
    }

    const nomeStudente = String(body.nomeStudente || "").trim();
    const relazione = String(body.relazione || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const privacy = body.privacy === true;

    if (!nomeStudente) return json({ success: false, message: "Inserire il nome e cognome dello studente." }, 400);
    if (!relazione) return json({ success: false, message: "Selezionare la relazione con lo studente." }, 400);
    if (!email || !email.includes("@")) return json({ success: false, message: "Inserire un indirizzo email valido." }, 400);
    if (!privacy) return json({ success: false, message: "È necessario accettare l'informativa sulla privacy." }, 400);

    const recaptchaOk = await verificaRecaptcha(String(body.recaptchaToken || ""));
    if (!recaptchaOk) {
      return json({ success: false, message: "Verifica anti-spam non superata. Ricarichi la pagina e riprovi." }, 400);
    }

    const idRichiesta = crypto.randomUUID();
    const resp = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/richieste_accesso`,
      {
        method: "POST",
        headers: headersRest(),
        body: JSON.stringify({
          id: idRichiesta,
          nome_studente: nomeStudente,
          email_genitore: email,
          relazione,
          stato: "in_attesa",
        }),
      },
    );

    if (!resp.ok) {
      const errTxt = await resp.text();
      console.error("Insert richieste_accesso:", resp.status, errTxt);
      return json({ success: false, message: "Errore durante il salvataggio. Riprovi più tardi." }, 500);
    }

    const rc = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/consensi_privacy`, {
      method: "POST",
      headers: headersRest(),
      body: JSON.stringify({
        servizio: "area_famiglie",
        riferimento_id: idRichiesta,
        email,
        versione_informativa: INFORMATIVA_AREA,
      }),
    });
    if (!rc.ok) console.error("Insert consensi_privacy (area_famiglie):", rc.status, await rc.text());

    return json({ success: true });
  } catch (e) {
    console.error(e);
    return json({ success: false, message: String(e) }, 500);
  }
});
