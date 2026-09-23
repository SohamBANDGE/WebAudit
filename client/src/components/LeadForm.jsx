import { useState } from "react";
import { submitLead } from "../lib/api.js";

export default function LeadForm({ scannedUrl }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await submitLead({ ...form, scannedUrl });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-brand-50 border border-brand-100 p-6 text-center text-brand-700 font-medium">
        Thanks! We'll be in touch shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-lg mx-auto">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={update("name")}
          className="rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          required
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={update("email")}
          className="rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <textarea
        placeholder="What would you like help with?"
        value={form.message}
        onChange={update("message")}
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-colors"
      >
        {status === "sending" ? "Sending..." : "Request Help"}
      </button>
    </form>
  );
}
