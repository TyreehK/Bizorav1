import Link from "next/link";

/**
 * Bizora — Home
 * Stijl: licht, zakelijk, modern (Jortt/MoneyMonk/eSign geïnspireerd)
 * Gebruikt: src/styles/index.css (thema/tokens)
 *
 * Secties:
 * 1) Hero
 * 2) Trust badges
 * 3) Feature grid
 * 4) Visual mockup (dashboard preview)
 * 5) Stappen: “Zo werkt Bizora”
 * 6) Benefits grid
 * 7) Testimonials
 * 8) Stats
 * 9) Pricing teaser
 * 10) FAQ teaser
 * 11) CTA band onderaan
 */

export default function HomePage() {
  return (
    <>
      <Hero />

      <TrustBadges />

      <FeatureGrid />

      <VisualMockup />

      <Steps />

      <Benefits />

      <Testimonials />

      <Stats />

      <PricingTeaser />

      <FaqTeaser />

      <FinalCta />
    </>
  );
}

/* ----------------------------- 1) HERO ------------------------------ */

function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="pill">Voor ondernemers · 30 dagen gratis</span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1, fontWeight: 800, color: "var(--bz-primary)" }}>
            Administratie, <span style={{ color: "var(--bz-secondary)" }}>eenvoudig</span> geregeld.
          </h1>
          <p style={{ maxWidth: 720, color: "var(--bz-text-muted)", fontSize: "1.125rem" }}>
            Stuur professionele offertes, factureer met één klik en houd btw en betalingen bij — alles op één plek.
            Bizora bespaart tijd en geeft je overzicht.
          </p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: ".5rem" }}>
            <Link className="btn btn-primary" href="/register">Start gratis</Link>
            <Link className="btn btn-outline" href="/pricing">Bekijk prijzen</Link>
          </div>
          <ul style={{ display: "grid", gap: ".4rem", color: "var(--bz-text-muted)", fontSize: ".95rem", marginTop: ".5rem" }}>
            <li>• Mooie PDF’s en automatische herinneringen</li>
            <li>• Zicht op omzet, openstaand en btw</li>
            <li>• Klaar voor opschalen: team, projecten, artikelen</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ 2) TRUST BADGES --------------------------- */

function TrustBadges() {
  const brands = ["KPN", "ING", "KVK", "Adyen", "Exact", "AFAS"];
  return (
    <section>
      <div className="container" style={{ paddingBlock: "1.5rem" }}>
        <div
          className="card"
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "1fr",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "var(--bz-text-muted)", fontWeight: 600 }}>
            Vertrouwd door ondernemers en teams
          </div>
          <div
            className="no-scrollbar"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(120px, 1fr))",
              gap: "1rem",
              alignItems: "center",
              overflowX: "auto",
              paddingBottom: ".25rem",
            }}
          >
            {brands.map((b) => (
              <div
                key={b}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "0.9rem",
                  borderRadius: 12,
                }}
              >
                <span style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- 3) FEATURE GRID ---------------------------- */

function FeatureGrid() {
  const items = [
    {
      title: "Facturen & Offertes",
      desc: "Maak en verstuur in je huisstijl. Betaallink, herinneringen en PDF in één.",
      bullets: ["Nummering & templates", "Automatische herinneringen", "Deelbetalingen & creditnota’s"],
    },
    {
      title: "BTW & Aangifte",
      desc: "Direct inzicht in verschuldigd vs. voorbelasting. Exports klaar voor je boekhouder.",
      bullets: ["21%/9%/0% en verlegd", "ICP & correcties", "PDF/CSV/XLSX-exports"],
    },
    {
      title: "Rapportages",
      desc: "Omzet, aging, per klant/artikel/project. Drill-down tot op de bron.",
      bullets: ["KPI-tegels", "Trends en top-10", "Filters die overal werken"],
    },
    {
      title: "Team & Projecten",
      desc: "Samenwerken met rollen en seats. Urenregistratie en budgetbewaking.",
      bullets: ["Admin/Manager/Medewerker", "Uren → factureren", "Seat-limieten en audit"],
    },
  ];

  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1.5rem" }}>
        <header style={{ display: "grid", gap: ".35rem" }}>
          <h2 className="section-title">Alles wat je nodig hebt</h2>
          <p className="section-subtitle">
            Bizora combineert offertes, facturen, btw en rapportages in één duidelijke workflow — zonder overbodige rommel.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          }}
        >
          {items.map((it) => (
            <article key={it.title} className="card" style={{ display: "grid", gap: ".75rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--bz-primary)" }}>
                {it.title}
              </h3>
              <p style={{ color: "var(--bz-text-muted)" }}>{it.desc}</p>
              <ul style={{ display: "grid", gap: ".35rem", color: "var(--bz-text)" }}>
                {it.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- 4) VISUAL MOCKUP / PREVIEW -------------------- */

function VisualMockup() {
  return (
    <section>
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <div
          className="card"
          style={{
            padding: "2rem",
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {/* Left: KPI preview */}
          <div style={{ display: "grid", gap: ".9rem" }}>
            <h3 style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Dashboard preview</h3>
            <div style={{ display: "grid", gap: ".75rem", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              <KpiTile label="Omzet (maand)" value="€ 48.200" sub="+12% t.o.v. vorige maand" />
              <KpiTile label="Openstaand" value="€ 13.450" sub="Achterstallig 31–60" />
              <KpiTile label="BTW-saldo" value="€ 6.320" sub="Concept kwartaal" />
            </div>

            <div className="card" style={{ padding: "1rem" }}>
              <div style={{ color: "var(--bz-text-muted)", fontSize: ".9rem" }}>Pipeline</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: ".5rem", marginTop: ".5rem" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      background: i < 5 ? "#ecf2ff" : "#f6f7fb",
                      border: "1px solid var(--bz-border)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: invoice card */}
          <div className="card" style={{ display: "grid", gap: ".75rem" }}>
            <div style={{ color: "var(--bz-text-muted)", fontSize: ".9rem" }}>Factuur #INV-20431</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--bz-primary)" }}>€ 1.250</div>
            <div
              style={{
                height: 112,
                borderRadius: 14,
                background: "linear-gradient(180deg,#eef3ff,transparent)",
                border: "1px solid #e3ebff",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".95rem" }}>
              <span style={{ color: "var(--bz-text-muted)" }}>Vervaldatum</span>
              <span style={{ fontWeight: 700 }}>14 dagen</span>
            </div>
            <div style={{ display: "flex", gap: ".5rem", marginTop: ".25rem" }}>
              <button className="btn btn-secondary">Versturen</button>
              <button className="btn btn-outline">Voorbeeld PDF</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card" style={{ padding: "1rem", display: "grid", gap: ".35rem" }}>
      <div style={{ color: "var(--bz-text-muted)", fontSize: ".9rem" }}>{label}</div>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--bz-primary)" }}>{value}</div>
      {sub && <div style={{ color: "var(--bz-text-muted)", fontSize: ".85rem" }}>{sub}</div>}
    </div>
  );
}

/* ------------------------- 5) STEPS (HOW IT WORKS) ------------------ */

function Steps() {
  const steps = [
    {
      t: "Start gratis",
      d: "Maak je account aan en personaliseer je huisstijl.",
    },
    {
      t: "Voeg klant/artikel toe",
      d: "Slimme defaults voor btw, korting en betaalcondities.",
    },
    {
      t: "Verstuur en volg",
      d: "E-mail + host-pagina. Herinneringen en betalingen inzichtelijk.",
    },
  ];
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1.25rem" }}>
        <header>
          <h2 className="section-title">Zo werkt Bizora</h2>
          <p className="section-subtitle">Binnen 5 minuten verzend je je eerste factuur. Alles logisch georganiseerd.</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {steps.map((s, i) => (
            <div key={s.t} className="card" style={{ padding: "1.25rem", display: "grid", gap: ".4rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>
                {i + 1}. {s.t}
              </div>
              <div style={{ color: "var(--bz-text-muted)" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------ 6) BENEFITS GRID -------------------------- */

function Benefits() {
  const list = [
    { t: "Snel & simpel", d: "Geen overbodige klikken. Alles binnen handbereik." },
    { t: "Mooie documenten", d: "Offertes/facturen met jouw branding en nummering." },
    { t: "Slimme herinneringen", d: "Voorkom gedoe met automatische follow-ups." },
    { t: "Rapportages", d: "Zie direct omzet, openstaand en trends per klant." },
    { t: "Teamrollen", d: "Admin, Manager, Medewerker, Externe of Alleen Lezen." },
    { t: "Export & audit", d: "CSV/XLSX/PDF en volledige audit trail per record." },
  ];
  return (
    <section>
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {list.map((b) => (
              <div key={b.t} className="card" style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{b.t}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- 7) TESTIMONIALS -------------------------- */

function Testimonials() {
  const ts = [
    {
      n: "Eva (ZZP-design)",
      q: "“Binnen een dag gewend. Mijn offertes zien er nu professioneel uit en ik krijg sneller akkoord.”",
    },
    {
      n: "Daan (MKB-installatie)",
      q: "“Openstaande posten eindelijk onder controle. Herinneringen schelen echt tijd.”",
    },
    {
      n: "Saar (B2B marketing)",
      q: "“Rapportages zijn duidelijk en export werkt top voor onze accountant.”",
    },
  ];
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <header>
          <h2 className="section-title">Ervaringen van klanten</h2>
          <p className="section-subtitle">Eerlijk, simpel en effectief — dat is waar Bizora om draait.</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {ts.map((t) => (
            <figure key={t.n} className="card" style={{ padding: "1.25rem", display: "grid", gap: ".5rem" }}>
              <blockquote style={{ color: "var(--bz-text)" }}>{t.q}</blockquote>
              <figcaption style={{ color: "var(--bz-text-muted)", fontWeight: 600 }}>{t.n}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- 8) STATS ----------------------------- */

function Stats() {
  const items = [
    { v: "12.5k+", l: "Maand. facturen" },
    { v: "9.1k+", l: "Offertes verstuurd" },
    { v: "4.8k+", l: "Tevreden gebruikers" },
    { v: "€28M", l: "Omzet verwerkt / jaar" },
  ];
  return (
    <section>
      <div className="container">
        <div
          className="card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem",
            padding: "1.25rem",
          }}
        >
          {items.map((s) => (
            <div key={s.l} className="card" style={{ padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--bz-primary)" }}>{s.v}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------ 9) PRICING TEASER ------------------------- */

function PricingTeaser() {
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: ".75rem", textAlign: "center" }}>
        <h2 className="section-title">Eerlijke prijzen voor elke fase</h2>
        <p className="section-subtitle" style={{ marginInline: "auto" }}>
          Start, groei of schaal met duidelijke pakketten. 30 dagen gratis proberen — geen creditcard nodig.
        </p>
        <div style={{ marginTop: ".75rem" }}>
          <Link className="btn btn-primary" href="/pricing">Bekijk pakketten</Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- 10) FAQ TEASER -------------------------- */

function FaqTeaser() {
  const faqs = [
    { q: "Kan ik later upgraden?", a: "Ja, je kunt op elk moment je pakket wijzigen." },
    { q: "Ondersteunen jullie btw-aangifte?", a: "Je krijgt per periode een duidelijk overzicht + export." },
    { q: "Is er teamtoegang?", a: "Ja, met vaste rollen en seat-limieten." },
  ];
  return (
    <section>
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "grid", gap: ".75rem", gridTemplateColumns: "repeat(3,1fr)" }}>
            {faqs.map((f) => (
              <div key={f.q} className="card" style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{f.q}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{f.a}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link className="btn btn-outline" href="/faq">Meer vragen</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- 11) CTA ------------------------------ */

function FinalCta() {
  return (
    <section className="section">
      <div className="container">
        <div
          className="card"
          style={{
            padding: "2rem",
            display: "grid",
            gap: ".75rem",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2 className="section-title">Klaar om te starten?</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            Probeer Bizora 30 dagen gratis. Binnen 5 minuten heb je je eerste factuur verstuurd.
          </p>
          <div style={{ marginTop: ".25rem" }}>
            <Link className="btn btn-primary" href="/register">Start gratis</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
