// Copia della funzione pubblicata su Supabase (versione 22, ultima modifica 20/10/2026),
// salvata nel repository il 14/11/2026 per tenerne traccia: prima esisteva solo sul server.
// È il "ponte" fra il gestionale (Apps Script) e il database dell'Area famiglie.
// Nessun segreto è scritto qui: BRIDGE_SHARED_SECRET e le chiavi stanno nell'ambiente della funzione.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_UPSERT_TABLES = new Set<string>([
  "famiglie_presenze",
  "famiglie_semafori",
  "famiglie_note",
  "famiglie_relazioni",
  "famiglie_colloqui",
]);

// Chiave di conflitto per tabella (deve combaciare col vincolo UNIQUE reale).
// presenze: UNIQUE(nome_studente,data) · semafori/note: UNIQUE(nome_studente,data,tipo)
// colloqui/relazioni: UNIQUE(id_origine) — id stabile generato una volta sola in
// Apps Script alla creazione della riga, per distinguere ripubblicazioni dello
// stesso evento (idempotenza) da eventi realmente diversi anche se identici
// in tutti gli altri campi (stesso studente/giorno/direzione/operatore).
const ON_CONFLICT: Record<string, string> = {
  famiglie_presenze: "nome_studente,data",
  famiglie_semafori: "nome_studente,data,tipo",
  famiglie_note: "nome_studente,data,tipo",
  famiglie_colloqui: "id_origine",
  famiglie_relazioni: "id_origine",
};

function pickSecretKey(): string {
  try {
    const dict = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const vals = Object.values(dict) as string[];
    const nuova = vals.find((v) => typeof v === "string" && v.startsWith("sb_secret_"));
    if (nuova) return nuova;
  } catch (_) { /* ignora e prova il fallback */ }

  const manuale = Deno.env.get("WORKER_SECRET_KEY");
  if (manuale && manuale.startsWith("sb_secret_")) return manuale;

  throw new Error("Nessuna secret key nuova (sb_secret_) trovata nell'ambiente della funzione");
}

const SECRET_KEY = pickSecretKey();
const SB_URL = Deno.env.get("SUPABASE_URL")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const provided = req.headers.get("x-bridge-secret");
  const expected = Deno.env.get("BRIDGE_SHARED_SECRET");
  if (!expected || provided !== expected) return json({ error: "Unauthorized" }, 401);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const action = body?.action;

  // --- DIAGNOSTICA ---
  if (action === "whoami") {
    const k = SECRET_KEY || "";
    let kind = "sconosciuta";
    if (k.startsWith("sb_secret_")) kind = "NUOVA (sb_secret_)";
    else if (k.startsWith("eyJ")) kind = "LEGACY (eyJ)";
    else kind = "altro";
    return json({ ok: true, versione: "v7-delete-semafori", chiave: kind, usata_prefix: k.slice(0, 11) });
  }
  // --- fine diagnostica ---

  // header comuni per le chiamate dirette a PostgREST
  const REST_HEADERS = {
    "apikey": SECRET_KEY,
    "Authorization": "Bearer " + SECRET_KEY,
    "Content-Type": "application/json",
  };

  try {
    if (action === "listPendingApprovals") {
      const url = SB_URL + "/rest/v1/richieste_accesso?select=*&stato=eq.approvata&email_inviata=eq.false";
      const resp = await fetch(url, { headers: REST_HEADERS });
      if (!resp.ok) return json({ error: "PostgREST " + resp.status + ": " + (await resp.text()).slice(0, 300) }, 500);
      const data = await resp.json();
      return json({ data });
    }

    if (action === "markEmailSent") {
      const id = body?.id;
      if (!id) return json({ error: "Missing id" }, 400);
      const url = SB_URL + "/rest/v1/richieste_accesso?id=eq." + encodeURIComponent(id);
      const resp = await fetch(url, {
        method: "PATCH",
        headers: { ...REST_HEADERS, "Prefer": "return=minimal" },
        body: JSON.stringify({ email_inviata: true }),
      });
      if (!resp.ok) return json({ error: "PostgREST " + resp.status + ": " + (await resp.text()).slice(0, 300) }, 500);
      return json({ ok: true });
    }

    // Cancella dall'Area famiglie i pallini indicati (usato una volta sola da
    // mmArchiviaVecchiPallini, dopo il backup). Solo famiglie_semafori.
    if (action === "deleteSemafori") {
      const rows = body?.rows;
      if (!Array.isArray(rows) || rows.length === 0) return json({ ok: true, deleted: 0 });
      let deleted = 0;
      const errors: string[] = [];
      for (let i = 0; i < rows.length; i += 20) {
        const chunk = rows.slice(i, i + 20);
        await Promise.all(chunk.map(async (r: any) => {
          const nome = String(r?.nome_studente ?? "").trim();
          const data = String(r?.data ?? "").trim();
          const tipo = String(r?.tipo ?? "").trim();
          if (!nome || !/^\d{4}-\d{2}-\d{2}$/.test(data) || !tipo) { errors.push("riga non valida"); return; }
          const url = SB_URL + "/rest/v1/famiglie_semafori?nome_studente=eq." + encodeURIComponent(nome) +
            "&data=eq." + data + "&tipo=eq." + encodeURIComponent(tipo);
          const resp = await fetch(url, { method: "DELETE", headers: { ...REST_HEADERS, "Prefer": "return=representation" } });
          if (!resp.ok) { errors.push(resp.status + ": " + (await resp.text()).slice(0, 120)); return; }
          const out = await resp.json();
          deleted += Array.isArray(out) ? out.length : 0;
        }));
      }
      return json({ ok: errors.length === 0, deleted, errors: errors.slice(0, 10) });
    }

    if (action === "upsert") {
      const table = body?.table;
      const rows = body?.rows;
      if (!table || !ALLOWED_UPSERT_TABLES.has(table)) return json({ error: "Table not allowed" }, 403);
      if (!Array.isArray(rows) || rows.length === 0) return json({ ok: true, skipped: true });

      const oc = ON_CONFLICT[table];
      const url = SB_URL + "/rest/v1/" + table + (oc ? "?on_conflict=" + oc : "");
      const resp = await fetch(url, {
        method: "POST",
        headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(rows),
      });
      if (!resp.ok) return json({ error: "PostgREST " + resp.status + ": " + (await resp.text()).slice(0, 300) }, 500);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: String((e as any)?.message ?? e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { "Content-Type": "application/json" },
  });
}
