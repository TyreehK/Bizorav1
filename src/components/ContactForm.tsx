"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setOk(null); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Verzenden mislukt");
      setOk("Bedankt! We nemen snel contact op.");
      e.currentTarget.reset();
    } catch (e: any) {
      setErr(e?.message || "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bz-card p-6">
      <h3 className="text-lg font-semibold">Stuur ons een bericht</h3>
      <div className="mt-4 grid gap-3">
        <input name="name" required placeholder="Naam" className="rounded-xl border border-bizora-border px-3 py-2" />
        <input name="email" type="email" required placeholder="E-mail" className="rounded-xl border border-bizora-border px-3 py-2" />
        <input name="subject" placeholder="Onderwerp" className="rounded-xl border border-bizora-border px-3 py-2" />
        <textarea name="message" required placeholder="Bericht" rows={6} className="rounded-xl border border-bizora-border px-3 py-2" />
      </div>
      {ok && <p className="text-sm text-green-600 mt-3">{ok}</p>}
      {err && <p className="text-sm text-red-600 mt-3">{err}</p>}
      <button disabled={loading} className="btn btn-primary mt-4">
        {loading ? "Versturen…" : "Versturen"}
      </button>
    </form>
  );
}
