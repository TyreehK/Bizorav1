"use client";

import { useEffect, useMemo, useState } from "react";
// Relative import i.p.v. "@/..." zodat het altijd werkt zonder alias-config
import { createBrowserClient } from "../../../lib/supabase/clients";

type Invoice = {
  id: string;
  organization_id: string;
  status:
    | "concept"
    | "verzonden"
    | "bekeken"
    | "gedeeltelijk_betaald"
    | "betaald"
    | "over_tijd"
    | "gecrediteerd";
  currency?: string | null;
  issued_at?: string | null;
  due_at?: string | null;
  total_excl?: number | null;
  total_tax?: number | null;
  total_incl?: number | null;
  paid_amount?: number | null;
};

type Quote = {
  id: string;
  organization_id: string;
  status:
    | "concept"
    | "verzonden"
    | "bekeken"
    | "geaccepteerd"
    | "geweigerd"
    | "verlopen";
  total_incl?: number | null;
  created_at?: string | null;
};

type Activity = {
  id: string;
  created_at?: string | null;
  action: string;
  metadata?: any;
};

const supabase = createBrowserClient();

/** Helpers **/
function sum(nums: Array<number | null | undefined>): number {
  return nums.reduce((t, n) => t + (typeof n === "number" ? n : 0), 0);
}
function formatEUR(v: number): string {
  try {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `€${Math.round(v).toLocaleString("nl-NL")}`;
  }
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Init: bepaal organization via memberships en laad datasets
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: mem, error: memErr } = await supabase
          .from("memberships")
          .select("organization_id")
          .limit(1)
          .maybeSingle();

        if (memErr) throw new Error(memErr.message);
        if (!mem?.organization_id)
          throw new Error("Geen organisatie gevonden voor je account.");

        setOrgId(mem.organization_id);

        // Invoices (optioneel)
        let fetchedInvoices: Invoice[] = [];
        try {
          const { data } = await supabase
            .from("invoices")
            .select(
              "id, organization_id, status, issued_at, due_at, total_excl, total_tax, total_incl, paid_amount"
            )
            .eq("organization_id", mem.organization_id)
            .order("issued_at", { ascending: false })
            .limit(500);
          fetchedInvoices = (data ?? []) as Invoice[];
        } catch {
          // tabel bestaat nog niet → laat leeg
        }
        setInvoices(fetchedInvoices);

        // Quotes (optioneel)
        let fetchedQuotes: Quote[] = [];
        try {
          const { data } = await supabase
            .from("quotes")
            .select("id, organization_id, status, total_incl, created_at")
            .eq("organization_id", mem.organization_id)
            .order("created_at", { ascending: false })
            .limit(500);
          fetchedQuotes = (data ?? []) as Quote[];
        } catch {}
        setQuotes(fetchedQuotes);

        // Activity feed (optioneel)
        let fetchedFeed: Activity[] = [];
        try {
          const { data } = await supabase
            .from("audit_logs")
            .select("id, created_at, action, metadata")
            .eq("org_id", mem.organization_id)
            .order("created_at", { ascending: false })
            .limit(20);
          fetchedFeed = (data ?? []) as Activity[];
        } catch {}
        setActivities(fetchedFeed);
      } catch (e: any) {
        setError(e?.message || "Er ging iets mis.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // KPI-berekeningen
  const kpis = useMemo(() => {
    // Omzet (betaald)
    const paid = invoices.filter(
      (i) =>
        i.status === "betaald" ||
        (i.paid_amount ?? 0) >= (i.total_incl ?? Number.POSITIVE_INFINITY)
          ? (i.total_incl ?? 0) // als beide bekend, vergelijk echt
          : 0
    );
    // bovenstaand is een safeguard; echte check:
    const paid2 = invoices.filter(
      (i) => i.status === "betaald" || (i.paid_amount ?? 0) >= (i.total_incl ?? 0)
    );
    const omzet = sum(paid2.map((i) => i.total_incl ?? 0));

    // Openstaand (totaal - betaald, voor niet-betaald/gecrediteerd)
    const open = invoices
      .filter((i) => i.status !== "betaald" && i.status !== "gecrediteerd")
      .map((i) => (i.total_incl ?? 0) - (i.paid_amount ?? 0));
    const openstaand = sum(open);

    // Binnengekomen betalingen (afgelopen 30 dagen)
    const now = Date.now();
    const d30 = now - 30 * 24 * 60 * 60 * 1000;
    const recentPaidEst = invoices
      .filter((i) => {
        const d =
          i.issued_at || i.due_at
            ? new Date((i.issued_at ?? i.due_at) as string).getTime()
            : now;
        return i.status === "betaald" && d >= d30;
      })
      .map((i) => i.total_incl ?? 0);
    const binnengekomen = sum(recentPaidEst);

    // BTW-saldo (placeholder)
    const btwSaldo = sum(invoices.map((i) => i.total_tax ?? 0)) - 0;

    // Offertes in afwachting
    const offertesInAfwachting = quotes.filter(
      (q) => q.status === "verzonden" || q.status === "bekeken"
    ).length;

    return {
      omzet,
      openstaand,
      binnengekomen,
      btwSaldo,
      offertesInAfwachting,
    };
  }, [invoices, quotes]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm opacity-80">
            Overzicht van je KPI’s en recente activiteit.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/invoices/new"
            className="rounded-xl bg-white/10 px-4 py-2 border border-white/20 hover:border-white/40"
          >
            Nieuwe factuur
          </a>
          <a
            href="/quotes/new"
            className="rounded-xl bg-white/10 px-4 py-2 border border-white/20 hover:border-white/40"
          >
            Nieuwe offerte
          </a>
          <a
            href="/clients/new"
            className="rounded-xl bg-white/10 px-4 py-2 border border-white/20 hover:border-white/40"
          >
            Nieuwe klant
          </a>
        </div>
      </header>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
          Laden…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 text-red-200 p-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPI's */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPI
              title="Omzet (betaald)"
              value={formatEUR(kpis.omzet)}
              subtitle="Totaal ontvangen"
            />
            <KPI
              title="Openstaande facturen"
              value={formatEUR(kpis.openstaand)}
              subtitle="Nog te innen"
            />
            <KPI
              title="Binnengekomen (30d)"
              value={formatEUR(kpis.binnengekomen)}
              subtitle="Laatste 30 dagen"
            />
            <KPI
              title="BTW-saldo (concept)"
              value={formatEUR(kpis.btwSaldo)}
              subtitle="Ruwe indicatie"
            />
          </section>

          {/* Quick tasks */}
          <section className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="font-semibold mb-2">Begin hier</h2>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>
                  <a className="underline hover:opacity-80" href="/clients/new">
                    Voeg je eerste klant toe
                  </a>
                </li>
                <li>
                  <a className="underline hover:opacity-80" href="/quotes/new">
                    Maak je eerste offerte
                  </a>
                </li>
                <li>
                  <a className="underline hover:opacity-80" href="/invoices/new">
                    Verstuur je eerste factuur
                  </a>
                </li>
              </ul>
            </div>

            {/* Offertes in afwachting */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="font-semibold mb-2">Offertes in afwachting</h2>
              {kpis.offertesInAfwachting === 0 ? (
                <p className="text-sm opacity-80">Geen openstaande offertes.</p>
              ) : (
                <p className="text-sm">
                  Je hebt <strong>{kpis.offertesInAfwachting}</strong> offerte(n) in
                  afwachting.
                </p>
              )}
              <a
                className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-2 border border-white/20 hover:border-white/40 text-sm"
                href="/quotes"
              >
                Bekijk offertes
              </a>
            </div>

            {/* BTW overzicht teaser */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="font-semibold mb-2">BTW-overzicht</h2>
              <p className="text-sm opacity-80">
                Bekijk je concept-aangifte per periode en exporteer wanneer je
                klaar bent.
              </p>
              <a
                className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-2 border border-white/20 hover:border-white/40 text-sm"
                href="/vat"
              >
                Naar BTW
              </a>
            </div>
          </section>

          {/* Activiteitenfeed */}
          <section className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="font-semibold mb-4">Activiteiten</h2>
              {activities.length === 0 ? (
                <p className="text-sm opacity-80">
                  Hier verschijnen je acties en betalingen.
                </p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {activities.map((a) => {
                    const when = a.created_at
                      ? new Date(a.created_at).toLocaleString("nl-NL")
                      : "";
                    return (
                      <li key={a.id} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-white/40 inline-block" />
                        <div>
                          <div className="opacity-80">{when}</div>
                          <div className="font-medium">{a.action}</div>
                          {a.metadata ? (
                            <pre className="mt-1 text-xs opacity-80 overflow-auto max-h-40">
                              {JSON.stringify(a.metadata, null, 2)}
                            </pre>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ------------------------------- UI -------------------------------- */

function KPI({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm opacity-80">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-xs opacity-70 mt-1">{subtitle}</div>}
    </div>
  );
}
