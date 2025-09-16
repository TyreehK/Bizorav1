"use client";

import { useState } from "react";

export default function ContactForm() {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setBusy(true);
    try {
      // Hier later koppelen aan API route / actie
      await new Promise((r) => setTimeout(r, 400));
      setOk("Bedankt! We nemen snel contact met je op.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      setErr(error?.message ?? "Er ging iets mis.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="grid grid--3" onSubmit={onSubmit}>
      {ok && (
        <div
          style={{
            gridColumn: "1 / -1",
            border: "1px solid #bbf7d0",
            background: "#f0fdf4",
            color: "#166534",
            padding: 12,
            borderRadius: 10,
          }}
        >
          {ok}
        </div>
      )}
      {err && (
        <div
          style={{
            gridColumn: "1 / -1",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 10,
          }}
        >
          {err}
        </div>
      )}

      <div>
        <label>Naam</label>
        <input
          placeholder="Voor- en achternaam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>E-mail</label>
        <input
          type="email"
          placeholder="jij@bedrijf.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Onderwerp</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="" disabled>
            Kies onderwerp
          </option>
          <option>Support</option>
          <option>Sales</option>
          <option>Facturatie</option>
          <option>Overig</option>
        </select>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label>Bericht</label>
        <textarea
          rows={6}
          placeholder="Waarmee kunnen we helpen?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12 }}>
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Versturen…" : "Versturen"}
        </button>
        <a className="btn btn--ghost" href="/">
          Annuleren
        </a>
      </div>
    </form>
  );
}
