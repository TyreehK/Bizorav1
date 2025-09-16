"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * Bizora — Pricing Page (Jortt / MoneyMonk / eSign geïnspireerd)
 * - Licht, zakelijk, modern
 * - Minstens 10 component-secties
 *
 * Secties:
 * 1) Hero (titel + sub + CTA)
 * 2) Toggle maand/jaar (bespaar-badge) + micro copy
 * 3) Pakketten grid (Start / Flow / Pro / Enterprise)
 * 4) Highlighs-rij (USP tiles)
 * 5) Vergelijkingstabel (sticky header)
 * 6) Veelgestelde vragen (FAQ)
 * 7) Testimonials (klantquotes)
 * 8) Extra’s & add-ons (informative cards)
 * 9) Geld-terug / No-risk banner
 * 10) CTA band onderaan
 */

type BillingCycle = "monthly" | "yearly";

const PRICES = {
  monthly: { start: 7, flow: 16, pro: 29, enterprise: undefined as number | undefined },
  yearly:  { start: 6, flow: 14, pro: 25, enterprise: undefined as number | undefined }, // effectieve maandprijs (jaar gefactureerd)
};

const FEATURES = [
  { key: "quotes_invoices", label: "Facturen & Offertes" },
  { key: "vat", label: "BTW-aangifte" },
  { key: "reports", label: "Rapportages" },
  { key: "contracts", label: "Contractbeheer" },
  { key: "users", label: "Aantal gebruikers" },
  { key: "support", label: "Support" },
  { key: "integrations", label: "Integraties" },
  { key: "storage", label: "Opslag" },
];

const PLAN_FEATURES: Record<string, Record<string, string>> = {
  start: {
    quotes_invoices: "✔︎",
    vat: "✔︎",
    reports: "Basis",
    contracts: "—",
    users: "1",
    support: "E-mail",
    integrations: "—",
    storage: "1 GB",
  },
  flow: {
    quotes_invoices: "✔︎",
    vat: "✔︎",
    reports: "Uitgebreid",
    contracts: "✔︎",
    users: "3",
    support: "E-mail + Chat",
    integrations: "Basis",
    storage: "10 GB",
  },
  pro: {
    quotes_invoices: "✔︎",
    vat: "✔︎",
    reports: "Geavanceerd",
    contracts: "✔︎",
    users: "10",
    support: "Priority",
    integrations: "Uitgebreid",
    storage: "50 GB",
  },
  enterprise: {
    quotes_invoices: "✔︎",
    vat: "✔︎",
    reports: "Maatwerk",
    contracts: "✔︎",
    users: "Onbeperkt",
    support: "Dedicated AM",
    integrations: "Maatwerk",
    storage: "Onb.",
  },
};

export default function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const cycleLabel = cycle === "monthly" ? "maand" : "jaar";
  const savingsBadge = cycle === "yearly" ? "Bespaar t.o.v. maandbasis" : "Maandelijks opzegbaar";

  return (
    <>
      <Hero />

      <BillingToggle cycle={cycle} onChange={setCycle} />

      <PlansGrid cycle={cycle} />

      <HighlightsRow />

      <ComparisonTable cycle={cycle} />

      <FaqSection />

      <Testimonials />

      <AddOns />

      <NoRiskBanner cycle={cycle} />

      <FinalCta />
    </>
  );
}

/* --------------------------- 1) HERO -------------------------------- */

function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem", textAlign: "center" }}>
        <span className="pill" style={{ marginInline: "auto" }}>30 dagen gratis · geen creditcard nodig</span>
        <h1 className="section-title" style={{ marginInline: "auto" }}>
          Eerlijke prijzen voor elke fase
        </h1>
        <p className="section-subtitle" style={{ marginInline: "auto" }}>
          Start met een scherp instapplan en groei door zonder verrassingen. Upgraden kan altijd.
        </p>
        <div style={{ marginTop: ".5rem" }}>
          <a className="btn btn-primary" href="#plans">Bekijk pakketten</a>
        </div>
      </div>
    </section>
  );
}

/* -------------------- 2) BILLING TOGGLE & COPY ---------------------- */

function BillingToggle({ cycle, onChange }: { cycle: BillingCycle; onChange: (v: BillingCycle) => void }) {
  const isYearly = cycle === "yearly";
  return (
    <section>
      <div className="container">
        <div
          className="card"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            padding: "1rem 1.25rem",
            gap: ".75rem",
          }}
        >
          {/* Copy */}
          <div style={{ color: "var(--bz-text-muted)" }}>
            Kies je betaalfrequentie. Jaarplannen geven korting op de effectieve maandprijs.
          </div>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <button
              onClick={() => onChange("monthly")}
              className="btn"
              style={{
                background: !isYearly ? "var(--bz-secondary)" : "transparent",
                color: !isYearly ? "#fff" : "var(--bz-text)",
                border: "1px solid var(--bz-border)",
              }}
            >
              Maandelijks
            </button>
            <button
              onClick={() => onChange("yearly")}
              className="btn"
              style={{
                background: isYearly ? "var(--bz-secondary)" : "transparent",
                color: isYearly ? "#fff" : "var(--bz-text)",
                border: "1px solid var(--bz-border)",
              }}
            >
              Jaarlijks
            </button>
            <span
              className="pill"
              style={{
                background: isYearly ? "#ecf2ff" : "#fff",
                borderColor: "#d7e4ff",
              }}
            >
              {isYearly ? "Bespaar t.o.v. maandbasis" : "Maandelijks opzegbaar"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- 3) PLANS GRID --------------------------- */

function PlansGrid({ cycle }: { cycle: BillingCycle }) {
  const prices = cycle === "monthly" ? PRICES.monthly : PRICES.yearly;

  const plans = [
    {
      key: "start",
      name: "Start",
      price: prices.start,
      caption: "Voor solo & starters",
      cta: "Start gratis",
      features: ["Facturen & Offertes", "BTW-aangifte", "Rapportages (basis)", "1 gebruiker", "1 GB opslag"],
      popular: false,
    },
    {
      key: "flow",
      name: "Flow",
      price: prices.flow,
      caption: "Voor kleine teams",
      cta: "Kies Flow",
      features: ["+ Contractbeheer", "Rapportages (uitgebreid)", "3 gebruikers", "10 GB opslag", "E-mail + Chat"],
      popular: true,
    },
    {
      key: "pro",
      name: "Pro",
      price: prices.pro,
      caption: "Voor groeiende bedrijven",
      cta: "Kies Pro",
      features: ["Rapportages (geavanceerd)", "Integraties uitgebreid", "10 gebruikers", "50 GB opslag", "Priority support"],
      popular: false,
    },
    {
      key: "enterprise",
      name: "Enterprise",
      price: undefined,
      caption: "Op maat & schaal",
      cta: "Plan demo",
      features: ["Onbeperkte gebruikers", "Maatwerk integraties", "Dedicated AM", "Maatwerk rapportages", "SLA’s & ISO"],
      popular: false,
    },
  ];

  return (
    <section id="plans" className="section">
      <div className="container" style={{ display: "grid", gap: "1.5rem" }}>
        <header style={{ textAlign: "center" }}>
          <h2 className="section-title">Kies je pakket</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            Je kunt altijd upgraden of downgraden. 30 dagen gratis proberen.
          </p>
        </header>

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {plans.map((p) => (
            <PlanCard key={p.key} {...p} cycle={cycle} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  caption,
  cta,
  features,
  popular,
  cycle,
}: {
  name: string;
  price: number | undefined;
  caption: string;
  cta: string;
  features: string[];
  popular?: boolean;
  cycle: BillingCycle;
}) {
  const priceLabel = price ? `€ ${price}` : "Op maat";
  const per = price ? (cycle === "monthly" ? "/mnd" : "/mnd (jaar)") : "";
  return (
    <article
      className="card"
      style={{
        display: "grid",
        gap: ".75rem",
        padding: "1.25rem",
        position: "relative",
        borderColor: popular ? "#b6cdfa" : "var(--bz-border)",
        boxShadow: popular ? "0 10px 30px rgba(43,108,176,.15)" : "var(--bz-shadow-sm)",
      }}
    >
      {popular && (
        <div
          className="pill"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#ecf2ff",
            borderColor: "#d7e4ff",
            color: "#134391",
          }}
        >
          Meest gekozen
        </div>
      )}

      <div style={{ fontWeight: 800, color: "var(--bz-primary)", fontSize: "1.1rem" }}>{name}</div>
      <div style={{ color: "var(--bz-text-muted)" }}>{caption}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: ".4rem" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--bz-primary)" }}>{priceLabel}</div>
        <div style={{ color: "var(--bz-text-muted)" }}>{per}</div>
      </div>
      <ul style={{ display: "grid", gap: ".35rem", marginTop: ".25rem" }}>
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <div style={{ marginTop: ".5rem" }}>
        {name === "Enterprise" ? (
          <Link className="btn btn-outline" href="/contact">
            {cta}
          </Link>
        ) : (
          <Link className="btn btn-primary" href="/register">
            {cta}
          </Link>
        )}
      </div>
    </article>
  );
}

/* -------------------------- 4) HIGHLIGHTS ROW ----------------------- */

function HighlightsRow() {
  const items = [
    { t: "Heldere nummering", d: "INV/QTE/CN met preview en conflictcheck." },
    { t: "Mooie PDF’s", d: "In je huisstijl, klaar om te versturen." },
    { t: "Automatisch herinneren", d: "Dunning-schema’s zonder gedoe." },
    { t: "Exports", d: "CSV/XLSX/PDF voor je boekhouder." },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            {items.map((it) => (
              <div key={it.t} className="card" style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{it.t}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- 5) COMPARISON TABLE ------------------------ */

function ComparisonTable({ cycle }: { cycle: BillingCycle }) {
  const prices = cycle === "monthly" ? PRICES.monthly : PRICES.yearly;

  const cols = [
    { key: "start", label: "Start", price: prices.start },
    { key: "flow", label: "Flow", price: prices.flow, highlight: true },
    { key: "pro", label: "Pro", price: prices.pro },
    { key: "enterprise", label: "Enterprise", price: undefined },
  ] as const;

  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <header>
          <h2 className="section-title">Vergelijk pakketten</h2>
          <p className="section-subtitle">Zie in één oogopslag wat bij je past. Upgraden is altijd mogelijk.</p>
        </header>

        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
                <th style={thStyle("left")}>Functie</th>
                {cols.map((c) => (
                  <th key={c.key} style={thStyle("center")}>
                    <div style={{ display: "grid", gap: ".25rem" }}>
                      <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{c.label}</div>
                      <div style={{ color: "var(--bz-text-muted)" }}>
                        {typeof c.price === "number" ? `€ ${c.price}/mnd${cycle === "yearly" ? " (jaar)" : ""}` : "Op maat"}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, idx) => (
                <tr key={f.key} style={{ background: idx % 2 ? "#fafbff" : "#fff" }}>
                  <td style={tdStyle("left", true)}>{f.label}</td>
                  {cols.map((c) => (
                    <td key={c.key} style={tdStyle("center")}>
                      {PLAN_FEATURES[c.key][f.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link className="btn btn-primary" href="/register">Start gratis</Link>
        </div>
      </div>
    </section>
  );
}

function thStyle(align: "left" | "center"): React.CSSProperties {
  return {
    textAlign: align,
    padding: "1rem",
    borderBottom: "1px solid var(--bz-border)",
    position: "sticky" ? "static" : "static",
  };
}

function tdStyle(align: "left" | "center", bold?: boolean): React.CSSProperties {
  return {
    textAlign: align,
    padding: ".8rem 1rem",
    borderBottom: "1px solid var(--bz-border)",
    fontWeight: bold ? 600 : 500,
  };
}

/* ----------------------------- 6) FAQ ------------------------------- */

function FaqSection() {
  const faqs = [
    {
      q: "Kan ik later upgraden of downgraden?",
      a: "Ja, je kunt je pakket op elk moment wijzigen. Wijzigingen worden pro rata verwerkt.",
    },
    {
      q: "Heb ik een proefperiode?",
      a: "Ja, je krijgt 30 dagen gratis toegang tot alle functies van je gekozen pakket.",
    },
    {
      q: "Hoe zit het met data-export?",
      a: "Je kunt altijd je data exporteren als CSV/XLSX/PDF. Wij geloven in portabiliteit.",
    },
    {
      q: "Zijn er installatiekosten?",
      a: "Nee. Je betaalt alleen voor je gekozen pakket. Enterprise kent optioneel onboarding.",
    },
  ];
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <header>
          <h2 className="section-title">Veelgestelde vragen</h2>
          <p className="section-subtitle">Antwoorden op de meest voorkomende vragen over pricing & pakketten.</p>
        </header>

        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem" }}>
          {faqs.map((f) => (
            <details key={f.q} className="card" style={{ padding: ".9rem 1rem", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "var(--bz-primary)" }}>{f.q}</summary>
              <div style={{ color: "var(--bz-text-muted)", marginTop: ".5rem" }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- 7) TESTIMONIALS ------------------------- */

function Testimonials() {
  const ts = [
    { n: "Lisa, studio eigenaar", q: "“Eindelijk overzicht. Facturen en btw in één flow die logisch voelt.”" },
    { n: "Rachid, installateur", q: "“Herinneringen werken automatisch — mijn DSO is echt gedaald.”" },
    { n: "Femke, bureau eigenaar", q: "“Rapportages zijn helder en export is precies wat mijn boekhouder wil.”" },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", padding: "1rem" }}>
          {ts.map((t) => (
            <figure key={t.n} className="card" style={{ padding: "1rem" }}>
              <blockquote style={{ color: "var(--bz-text)" }}>{t.q}</blockquote>
              <figcaption style={{ color: "var(--bz-text-muted)", marginTop: ".5rem", fontWeight: 600 }}>{t.n}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- 8) ADD-ONS ---------------------------- */

function AddOns() {
  const items = [
    { t: "Extra opslag", d: "Upgrade storage-pakketten per 50 GB." },
    { t: "Custom templates", d: "Eigen PDF-templates voor facturen/offertes." },
    { t: "API-toegang", d: "Koppeling met je eigen systemen." },
    { t: "Onboarding (Enterprise)", d: "Inrichting & training op maat." },
  ];
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <header>
          <h2 className="section-title">Extra’s & add-ons</h2>
          <p className="section-subtitle">Breid je pakket uit als je groeit. Betaal alleen voor wat je gebruikt.</p>
        </header>

        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            {items.map((it) => (
              <div key={it.t} className="card" style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{it.t}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- 9) NO-RISK BANNER ------------------------ */

function NoRiskBanner({ cycle }: { cycle: BillingCycle }) {
  return (
    <section>
      <div className="container">
        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "grid",
            gap: ".5rem",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Probeer zonder risico</div>
            <div style={{ color: "var(--bz-text-muted)" }}>
              30 dagen gratis · annuleer wanneer je wilt · data altijd exporteerbaar
            </div>
          </div>
          <Link className="btn btn-primary" href="/register">
            Start gratis
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- 10) CTA ------------------------------ */

function FinalCta() {
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "2rem", display: "grid", gap: ".5rem" }}>
          <h2 className="section-title">Klaar om Bizora te proberen?</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            Maak gratis een account aan en verstuur je eerste factuur in 5 minuten.
          </p>
          <div>
            <Link className="btn btn-primary" href="/register">Start gratis</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
