"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/supabase-js";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Als je al ingelogd bent, ga meteen naar dashboard
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace("/dashboard");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zorg dat auth state changes naar /auth/callback worden gepost (cookie sync)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await fetch("/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, session }),
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // Tip: remember = false? Dan korte sessie (hier simpel gehouden)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setErr(mapAuthError(error.message));
        return;
      }
      // Cookies worden via /auth/callback gezet (onAuthStateChange)
      router.replace("/dashboard");
    } catch (e: any) {
      setErr("Onverwachte fout bij inloggen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setErr(null);
    if (!email) {
      setErr("Vul je e-mailadres in om te resetten.");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
      });
      if (error) setErr(mapAuthError(error.message));
      else alert("We hebben een resetlink gestuurd als het e-mailadres bekend is.");
    } catch {
      setErr("Kon geen resetverzoek versturen.");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Inloggen</h1>
      <p className="opacity-80 mb-6">Log in met je e-mailadres en wachtwoord.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none"
            placeholder="jij@bedrijf.nl"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Wachtwoord</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none"
            placeholder="••••••••••••"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-white/90"
          />
          Ingelogd blijven
        </label>

        {err && <p className="text-sm text-red-300">{err}</p>}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm underline hover:opacity-80"
          >
            Wachtwoord vergeten?
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-xl px-5 py-2 font-semibold ${loading ? "bg-white/20" : "bg-white/10 hover:bg-white/20"} border border-white/20`}
          >
            {loading ? "Bezig…" : "Inloggen"}
          </button>
        </div>
      </form>
    </main>
  );
}

function mapAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Onjuiste combinatie van e-mail en wachtwoord.";
  if (m.includes("email not confirmed")) return "Bevestig eerst je e-mailadres via de link in je mail.";
  return "Inloggen mislukt. Controleer je gegevens.";
}
