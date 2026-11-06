// =====================================================================
// Edge Function: richiesta-accesso
// Convitto "Costaggini" — Supabase project sawclsysqnjsvbobioqo
// =====================================================================
// Cosa fa: riceve la richiesta di accesso all'area riservata famiglie,
// applica i controlli antispam interni e
// solo se li supera inserisce il record in richieste_accesso.
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
// Dal 06/11/2026 il reCAPTCHA è tolto: lo sostituiscono il campo trappola,
// il tempo di compilazione e il limite di invii (vedi ANTISPAM INTERNO).
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

const INFORMATIVA_AREA = "area-famiglie-2026-10-25";

// ===== ANTISPAM INTERNO (dal 6/11/2026, al posto del reCAPTCHA) =====
// Nessun servizio esterno e nessun dato sul visitatore: campo trappola
// (botField), tempo di compilazione (tMs, aggiunto da app.js) e limite al
// numero di invii, contato sulle righe gia' presenti nella tabella.
const TEMPO_MINIMO_MS = 3000;     // sotto i 3 secondi: invio automatico
const LIMITE_ORA = 20;            // invii complessivi in un'ora
const LIMITE_EMAIL_10_MIN = 2;    // invii con la stessa email in 10 minuti

async function contaRecenti(tabella: string, minuti: number, colonnaEmail?: string, email?: string): Promise<number | null> {
  const chiave = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!chiave) return null;
  const da = new Date(Date.now() - minuti * 60000).toISOString();
  let url = `${Deno.env.get("SUPABASE_URL")}/rest/v1/${tabella}?select=id&created_at=gte.${encodeURIComponent(da)}`;
  if (colonnaEmail && email) url += `&${colonnaEmail}=eq.${encodeURIComponent(email)}`;
  try {
    const r = await fetch(url, { method: "HEAD", headers: { apikey: chiave, Authorization: `Bearer ${chiave}`, Prefer: "count=exact" } });
    const n = Number((r.headers.get("content-range") || "").split("/")[1]);
    return Number.isFinite(n) ? n : null;
  } catch (e) {
    console.error("Conteggio antispam non riuscito:", e);
    return null;   // in caso di errore non si blocca l'invio: restano trappola e tempo
  }
}

async function antispam(body: Record<string, unknown>, tabella: string, colonnaEmail: string, email: string): Promise<string | null> {
  const t = Number(body.tMs);
  if (!Number.isFinite(t) || t < TEMPO_MINIMO_MS) return "Invio troppo rapido: attenda qualche secondo e riprovi.";
  const ora = await contaRecenti(tabella, 60);
  if (ora !== null && ora >= LIMITE_ORA) return "Troppe richieste in questo momento: riprovi fra un'ora.";
  const stessa = await contaRecenti(tabella, 10, colonnaEmail, email);
  if (stessa !== null && stessa >= LIMITE_EMAIL_10_MIN) return "Abbiamo già ricevuto la Sua richiesta: attenda qualche minuto prima di inviarne un'altra.";
  return null;
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

    const bloccato = await antispam(body, "richieste_accesso", "email_genitore", email);
    if (bloccato) return json({ success: false, message: bloccato }, 429);

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
