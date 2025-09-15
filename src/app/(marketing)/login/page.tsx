"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function GlobalLoginPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const [site, setSite] = useState("");
  const preselectedPlan = qs.get("plan") ?? undefined;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sub = site.trim().toLowerCase().replace(/\s+/g, "-");
    if (!/^[a-z0-9](?:[a-z0-9-]{1,30})[a-z0-9]$/.test(sub)) {
      alert("Ongeldige sitenaam. Gebruik 3–32 tekens, a–z, 0–9 en - (niet beginnen/eindigen met -).");
      return;
    }

    // In productie met subdomein: ga gewoon naar https://{sub}.jouwdomein.tld/login
    // Voor lokale dev en middleware-rewrite gebruiken we pad-based:
    const target = `/w/${sub}/login${preselectedPlan ? `?plan=${encodeURIComponent(preselectedPlan)}` : ""}`;
    router.push(target);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold mb-4">Inloggen</h1>
      <p className="opacity-90 mb-6">
        Vul je <strong>sitenaam</strong> in om door te gaan naar je eigen loginpagina.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Sitenaam</label>
          <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="bijv. acme"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <p className="text-xs opacity-70 mt-1">Je login wordt: <code>/w/&lt;sitenaam&gt;/login</code> (lokaal)</p>
        </div>
        <button
          type="submit"
          className="rounded-xl px-4 py-2 bg-brand-accent text-white font-semibold hover:opacity-90 transition"
        >
          Ga verder
        </button>
      </form>
    </main>
  );
}
