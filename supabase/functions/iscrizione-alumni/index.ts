// =====================================================================
// Edge Function: iscrizione-alumni
// Convitto "Costaggini" — Supabase project sawclsysqnjsvbobioqo
// =====================================================================
// Cosa fa: riceve la scheda di iscrizione alla pagina Alumni, applica i controlli anti-spam interni (campo trappola, tempo minimo di compilazione, limite di invio) e solo se passano inserisce la scheda alumni, il ricordo associato e, se l'utente ha acconsentito, il pin sulla Mappa Alumni.
//
// Dal 04/11/2026 la posizione del pin arriva dalla pagina, che la ricava
// dall'elenco di città ospitato sul sito (citta.js): nessuna richiesta a
// Nominatim/OpenStreetMap.
//
// Dal 06/10/2026 registra anche i consensi nel registro
// consensi_privacy (servizio "alumni" per scheda e ricordo, servizio
// "mappa" per il pin), con data e versione dell'informativa accettata.
// Se la registrazione del consenso non riesce, l'errore viene scritto
// nei log ma l'iscrizione non viene interrotta.
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

const INFORMATIVA_ALUMNI = "ricordi-2026-10-06";
const INFORMATIVA_MAPPA = "mappa-2026-10-06";

const TEMPO_MINIMO_MS = 3000;       // un invio più rapido non è di una persona
const FINESTRA_MS = 10 * 60 * 1000; // finestra del limite di invio
const MAX_INVII = 5;                // invii consentiti per origine in quella finestra
const recenti = new Map<string, number[]>(); // solo in memoria, non viene salvato nulla

function origineRichiesta(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "sconosciuta";
}

function troppiInvii(origine: string): boolean {
  const ora = Date.now();
  const lista = (recenti.get(origine) || []).filter((t) => ora - t < FINESTRA_MS);
  if (lista.length >= MAX_INVII) {
    recenti.set(origine, lista);
    return true;
  }
  lista.push(ora);
  recenti.set(origine, lista);
  if (recenti.size > 5000) recenti.clear();
  return false;
}

function inviaTroppoVeloce(body: Record<string, unknown>): boolean {
  const t = Number(body.tMs);
  return !Number.isFinite(t) || t < TEMPO_MINIMO_MS;
}

async function inserisci(tabella: string, riga: Record<string, unknown>): Promise<{ ok: boolean; status: number; body: string }> {
  const resp = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/${tabella}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": Deno.env.get("SUPABASE_ANON_KEY")!,
      "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")!}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(riga),
  });
  return { ok: resp.ok, status: resp.status, body: resp.ok ? "" : await resp.text() };
}

async function registraConsenso(servizio: string, riferimentoId: string, email: string, versione: string): Promise<void> {
  const r = await inserisci("consensi_privacy", {
    servizio,
    riferimento_id: riferimentoId,
    email: email.toLowerCase(),
    versione_informativa: versione,
  });
  if (!r.ok) console.error("Insert consensi_privacy (" + servizio + "):", r.status, r.body);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot: stessa logica di richiesta-accesso.
    if (String(body.botField || "").trim() !== "") {
      return json({ success: true });
    }

    // Tempo minimo di compilazione (campo tMs aggiunto da app.js): i bot inviano subito.
    if (inviaTroppoVeloce(body)) return json({ success: true });

    // Limite di invio per origine, tenuto solo in memoria.
    if (troppiInvii(origineRichiesta(req))) {
      return json({ success: false, message: "Troppi invii ravvicinati. Riprovi tra qualche minuto." }, 429);
    }

    const nome = String(body.nome || "").trim();
    const firma = String(body.firma || "").trim() || nome.split(" ")[0];
    const anni = String(body.anni || "").trim();
    const citta = String(body.citta || "").trim();
    const lavoro = String(body.lavoro || "").trim();
    const settore = String(body.settore || "").trim();
    const ricordo = String(body.ricordo || "").trim();
    const email = String(body.email || "").trim();
    const fb = String(body.fb || "").trim();
    const ig = String(body.ig || "").trim();
    const li = String(body.li || "").trim();
    const web = String(body.web || "").trim();
    const contattabile = body.contattabile === true;
    const mappa = body.mappa === true;

    if (!nome || !anni || !lavoro || !ricordo || !email) {
      return json({ success: false, message: "Compilare tutti i campi obbligatori." }, 400);
    }

    const colore = Math.floor(Math.random() * 5);
    // Identificativi generati qui, così il consenso si collega con certezza alla riga inserita.
    const idAlumni = crypto.randomUUID();

    const rAlumni = await inserisci("alumni", {
      id: idAlumni,
      nome, firma, anni, citta, lavoro, settore, ricordo, email,
      social_fb: fb, social_ig: ig, social_li: li, social_web: web,
      contattabile, colore, approvato: false,
    });
    if (!rAlumni.ok) {
      console.error("Insert alumni:", rAlumni.status, rAlumni.body);
      return json({ success: false, message: "Errore durante il salvataggio della scheda." }, 500);
    }
    await registraConsenso("alumni", idAlumni, email, INFORMATIVA_ALUMNI);

    const rRicordi = await inserisci("ricordi", {
      testo: ricordo,
      nome: firma,
      anni,
      dove: [citta, lavoro].filter(Boolean).join(" · "),
      colore,
      approvato: false,
    });
    if (!rRicordi.ok) console.error("Insert ricordi:", rRicordi.status, rRicordi.body);

    // Pin sulla mappa: coordinate inviate dalla pagina (elenco città del sito).
    const lat = Number(body.lat), lng = Number(body.lng);
    const coordOk = body.lat != null && body.lng != null &&
      Number.isFinite(lat) && Number.isFinite(lng) &&
      Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    if (mappa && citta && coordOk) {
      const idPin = crypto.randomUUID();
      const rPin = await inserisci("pin_mappa", {
        id: idPin,
        nome: firma, citta, tipo: "alumni",
        anni, ruolo: lavoro,
        lat, lng,
        from_alumni: true,
        approvato: false,
      });
      if (!rPin.ok) console.error("Insert pin_mappa:", rPin.status, rPin.body);
      else await registraConsenso("mappa", idPin, email, INFORMATIVA_MAPPA);
    }

    return json({ success: true });
  } catch (e) {
    console.error(e);
    return json({ success: false, message: String(e) }, 500);
  }
});
