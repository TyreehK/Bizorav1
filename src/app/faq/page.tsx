"use client";

import { useMemo, useState } from "react";

type QA = { q: string; a: string; cat: string };

const DATA: QA[] = [
  { cat: "Algemeen", q: "Kan ik later upgraden of downgraden?", a: "Ja, pakketten zijn flexibel en per direct aan te passen." },
  { cat: "Algemeen", q: "Heb ik een proefperiode?", a: "Je krijgt 30 dagen gratis zonder verplichtingen." },
  { cat: "Facturen", q: "Ondersteunen jullie deelbetalingen?", a: "Ja, zowel handmatig als via status 'gedeeltelijk betaald'." },
  { cat: "Offertes", q: "Kan ik e-sign gebruiken?", a: "Ja, een lichte e-sign flow met naam, akkoord en certificaat." },
  { cat: "BTW", q: "Krijg ik btw-overzichten per periode?", a: "Maand/kwartaal/jaar, met exports (PDF/CSV/XLSX)." },
  { cat: "Rapportages", q: "Zijn er KPI’s en drill-downs?", a: "Ja, filters en doorklik naar bronrecords." },
  { cat: "Team", q: "Welke rollen zijn er?", a: "Admin, Manager, Medewerker, Externe, Alleen Lezen." },
  { cat: "Data", q: "Kan ik mijn data exporteren?", a: "Altijd. We geloven in dataportabiliteit." },
  { cat: "Beveiliging", q: "Hebben jullie 2FA?", a: "Ja, optioneel en via instellingen verplicht te maken." },
  { cat: "Facturen", q: "Creditnota’s mogelijk?", a: "Ja, volledig of per regel, met eigen nummering (CN-)." },
  { cat: "Integraties", q: "Bankkoppeling?", a: "In voorbereiding; roadmap volgt in de kennisbank." },
  { cat: "Support", q: "Hoe snel krijg ik antwoord?", a: "Binnen 1 werkdag via e-mail, sneller via chat." },
];

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | "Alles">("Alles");

  const cats = useMemo(() => ["Alles", ...Array.from(new Set(DATA.map(d => d.cat)))], []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter(d =>
      (cat === "Alles" || d.cat === cat) &&
      (q === "" || d.q.toLowerCase().includes(q) || d.a.toLowerCase().includes(q))
    );
  }, [query, cat]);

  return (
    <>
      <Hero />
      <SearchBar query={query} setQuery={setQuery} cat={cat} setCat={setCat} cats={cats} />
      <ResultsList items={filtered} />
      <ContactCTA />
      <QuickLinks />
      <GuidesTeaser />
      <BillingQuestions />
      <SecurityNote />
      <ExportNote />
      <FinalCTA />
    </>
  );
}

/* 1) HERO */
function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", display: "grid", gap: "1rem" }}>
        <h1 className="section-title" style={{ marginInline: "auto" }}>Veelgestelde vragen</h1>
        <p className="section-subtitle" style={{ marginInline: "auto" }}>
          Vind snel je antwoord. Staat het er niet bij? Neem contact met ons op.
        </p>
      </div>
    </section>
  );
}

/* 2) SEARCH BAR */
function SearchBar({
  query, setQuery, cat, setCat, cats
}: {
  query: string; setQuery: (v: string) => void;
  cat: string; setCat: (v: string) => void; cats: string[];
}) {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem", gridTemplateColumns: "1fr auto" }}>
          <input
            placeholder="Zoek in FAQ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </section>
  );
}

/* 3) RESULTS LIST */
function ResultsList({ items }: { items: QA[] }) {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem" }}>
          {items.length === 0 && <div style={{ color: "var(--bz-text-muted)" }}>Geen resultaten.</div>}
          {items.map((f) => (
            <details key={f.q} className="card" style={{ padding: ".9rem 1rem" }}>
              <summary style={{ fontWeight: 700, color: "var(--bz-primary)" }}>
                [{f.cat}] {f.q}
              </summary>
              <div style={{ color: "var(--bz-text-muted)", marginTop: ".5rem" }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4) CONTACT CTA */
function ContactCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Hulp nodig?</div>
            <div style={{ color: "var(--bz-text-muted)" }}>Neem contact op met support — we reageren snel.</div>
          </div>
          <a className="btn btn-primary" href="/contact">Contact</a>
        </div>
      </div>
    </section>
  );
}

/* 5) QUICK LINKS */
function QuickLinks() {
  const links = [
    { t: "Aan de slag", href: "/knowledge-base" },
    { t: "Facturen maken", href: "/knowledge-base" },
    { t: "Offertes versturen", href: "/knowledge-base" },
    { t: "BTW & aangifte", href: "/knowledge-base" },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", padding: "1rem" }}>
          {links.map((l) => (
            <a key={l.t} className="card" style={{ padding: "1rem" }} href={l.href}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{l.t}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>Handleiding</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6) GUIDES TEASER */
function GuidesTeaser() {
  return (
    <section>
      <div className="container" style={{ display: "grid", gap: ".75rem" }}>
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Aanbevolen gidsen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: ".75rem" }}>
            {["Eerste factuur sturen", "Offerte sjablonen", "BTW-periodes instellen"].map((t) => (
              <a key={t} className="card" style={{ padding: "1rem" }} href="/knowledge-base">
                <div style={{ fontWeight: 700 }}>{t}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>3 min leestijd</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7) BILLING QUESTIONS */
function BillingQuestions() {
  const qs = [
    "Hoe werkt de proefperiode?",
    "Hoe kan ik mijn abonnement beëindigen?",
    "Wat gebeurt er na de trial?",
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".5rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Vragen over abonnement</div>
          <ul style={{ display: "grid", gap: ".25rem" }}>
            {qs.map((q) => <li key={q}>• {q}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 8) SECURITY NOTE */
function SecurityNote() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Beveiliging & privacy</div>
          <div style={{ color: "var(--bz-text-muted)" }}>
            2FA, auditlogs en dataportabiliteit zijn standaard. Zie ook onze privacyverklaring.
          </div>
        </div>
      </div>
    </section>
  );
}

/* 9) EXPORT NOTE */
function ExportNote() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".25rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Data export</div>
          <div style={{ color: "var(--bz-text-muted)" }}>
            Download CSV/XLSX/PDF per module of volledige export.
          </div>
        </div>
      </div>
    </section>
  );
}

/* 10) FINAL CTA */
function FinalCTA() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <div className="card" style={{ padding: "2rem", display: "grid", gap: ".5rem" }}>
          <h2 className="section-title">Nog vragen?</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>Neem contact op of bekijk de kennisbank.</p>
          <div>
            <a className="btn btn-primary" href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
}
