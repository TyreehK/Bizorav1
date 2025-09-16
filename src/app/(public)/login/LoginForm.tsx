"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // TODO: vervang dit met Supabase-auth (signInWithPassword) zodra back-end klaar is
      // const supabase = createBrowserClient();
      // const { error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      alert(`Inloggen met: ${email}`);
    } catch (err: any) {
      setError(err?.message ?? "Er ging iets mis.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 18, display: "grid", gap: 12 }}>
      {error && (
        <div className="card" style={{ padding: 12, borderColor: "#fecaca", background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: 6 }}>
        <label htmlFor="email" style={{ fontWeight: 700 }}>E-mailadres</label>
        <input
          id="email"
          type="email"
          placeholder="jij@bedrijf.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            height: 44, padding: "0 12px", borderRadius: 10, border: "1px solid var(--border)"
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label htmlFor="password" style={{ fontWeight: 700 }}>Wachtwoord</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            height: 44, padding: "0 12px", borderRadius: 10, border: "1px solid var(--border)"
          }}
        />
      </div>

      <button type="submit" className="btn btn--primary" disabled={busy} style={{ height: 46 }}>
        {busy ? "Bezig..." : "Inloggen"}
      </button>
    </form>
  );
}
