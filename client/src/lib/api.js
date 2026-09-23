const BASE = "/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export async function scanUrl(url) {
  const res = await fetch(`${BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handle(res);
}

export async function submitLead(payload) {
  const res = await fetch(`${BASE}/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function getReport(id) {
  const res = await fetch(`${BASE}/report/${id}`);
  return handle(res);
}
