// ══════════════════════════════════════════════════════
// SUPABASE CLIENT — Convitto "Costaggini" — Rieti
// ══════════════════════════════════════════════════════

const SUPABASE_URL  = 'https://sawclsysqnjsvbobioqo.supabase.co';
const SUPABASE_PUB = 'sb_publishable_sUgIVDar21Sf5Dtr3D7nhQ_kpOB57FQ';

// Client leggero senza libreria esterna — usa fetch direttamente
const sb = {

  // ── SELECT ────────────────────────────────────────
  async select(table, filter = '') {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${filter}&order=created_at.desc`,
      { headers: {
          'apikey': SUPABASE_PUB,
          'Authorization': `Bearer ${SUPABASE_PUB}`,
          'Content-Type': 'application/json'
      }}
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── INSERT ────────────────────────────────────────
  async insert(table, data) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}`,
      { method: 'POST',
        headers: {
          'apikey': SUPABASE_PUB,
          'Authorization': `Bearer ${SUPABASE_PUB}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── UPDATE (solo per admin con service key) ───────
  async update(table, id, data, serviceKey) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`,
      { method: 'PATCH',
        headers: {
          'apikey': serviceKey || SUPABASE_PUB,
          'Authorization': `Bearer ${serviceKey || SUPABASE_PUB}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── DELETE (solo per admin) ───────────────────────
  async delete(table, id, serviceKey) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`,
      { method: 'DELETE',
        headers: {
          'apikey': serviceKey || SUPABASE_PUB,
          'Authorization': `Bearer ${serviceKey || SUPABASE_PUB}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error(await res.text());
    return true;
  }
};
