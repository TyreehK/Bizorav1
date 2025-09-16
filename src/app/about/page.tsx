"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Mission />
      <Values />
      <Timeline />
      <Team />
      <Numbers />
      <PressKit />
      <Careers />
      <Sustainability />
      <ContactCTA />
      <FinalCTA />
    </>
  );
}

/* 1) HERO */
function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", display: "grid", gap: "1rem" }}>
        <h1 className="section-title" style={{ marginInline: "auto" }}>Over Bizora</h1>
        <p className="section-subtitle" style={{ marginInline: "auto" }}>
          We maken administratie eenvoudig — zodat ondernemers kunnen ondernemen.
        </p>
      </div>
    </section>
  );
}

/* 2) MISSION */
function Mission() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1.25rem", display: "grid", gap: ".5rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Missie</div>
          <div style={{ color: "var(--bz-text-muted)" }}>
            Een moderne, betrouwbare backoffice voor elke ondernemer — met duidelijke flows en heldere inzichten.
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3) VALUES */
function Values() {
  const vals = [
    { t: "Eenvoud", d: "Minder klikken, meer resultaat." },
    { t: "Transparantie", d: "Heldere prijzen, duidelijke data-exports." },
    { t: "Betrouwbaarheid", d: "Audit trail, 2FA en performance." },
    { t: "Groei", d: "Schaal mee van solo naar team." },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", padding: "1rem" }}>
          {vals.map((v) => (
            <div key={v.t} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{v.t}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{v.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4) TIMELINE */
function Timeline() {
  const items = [
    { y: "2023", d: "Start idee & validatie met ondernemers" },
    { y: "2024", d: "MVP met facturen & offertes" },
    { y: "2025", d: "BTW, rapportages, teams & onboarding" },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)", marginBottom: ".5rem" }}>Tijdlijn</div>
          <div style={{ display: "grid", gap: ".75rem" }}>
            {items.map((i) => (
              <div key={i.y} className="card" style={{ padding: ".9rem 1rem", display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem" }}>
                <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{i.y}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{i.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5) TEAM */
function Team() {
  const members = [
    { n: "Alex", r: "Product", b: "Ervaring in SaaS & UX" },
    { n: "Mila", r: "Engineering", b: "Typescript, databases, performance" },
    { n: "Jens", r: "Customer", b: "Onboarding en support" },
    { n: "Sophie", r: "Design", b: "Merk, UI en document-templates" },
  ];
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Team</h2>
        <div className="card" style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginTop: ".75rem" }}>
          {members.map((m) => (
            <div key={m.n} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{m.n}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{m.r}</div>
              <div style={{ marginTop: ".35rem" }}>{m.b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6) NUMBERS */
function Numbers() {
  const items = [
    { v: "4.8k+", l: "Gebruikers" },
    { v: "12.5k+", l: "Maand. facturen" },
    { v: "99.9%", l: "Uptime" },
    { v: "8 min", l: "Gem. support response" },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", padding: "1rem" }}>
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

/* 7) PRESS KIT */
function PressKit() {
  const items = [
    { t: "Logo pakket", d: "PNG/SVG, licht & donker" },
    { t: "Screenshots", d: "Hoge resolutie UI beelden" },
    { t: "Stijlgids", d: "Kleuren, typografie, marges" },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)", marginBottom: ".5rem" }}>Perskit</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {items.map((i) => (
              <a key={i.t} className="card" style={{ padding: "1rem" }} href="#">
                <div style={{ fontWeight: 700 }}>{i.t}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{i.d}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 8) CAREERS */
function Careers() {
  const roles = [
    { t: "Frontend Engineer (TS/React)", d: "Bouw mee aan onze UI-library en flows." },
    { t: "Product Designer", d: "Maak complexe flows simpel en mooi." },
    { t: "Support Specialist", d: "Help klanten succesvol starten." },
  ];
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Vacatures</h2>
        <div className="card" style={{ padding: "1rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3,1fr)", marginTop: ".75rem" }}>
          {roles.map((r) => (
            <div key={r.t} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{r.t}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{r.d}</div>
              <div style={{ marginTop: ".5rem" }}>
                <a className="btn btn-outline" href="#">Meer info</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9) SUSTAINABILITY */
function Sustainability() {
  const items = [
    { t: "CO₂-bewust", d: "Datacenters met groene energie waar mogelijk." },
    { t: "Efficiëntie", d: "Performante UI, minder bandbreedte en CPU." },
    { t: "Toegankelijkheid", d: "A11y-first: toetsenbord, contrast en aria-labels." },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {items.map((i) => (
            <div key={i.t} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{i.t}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{i.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 10) CONTACT CTA */
function ContactCTA() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Meer weten over Bizora?</div>
            <div style={{ color: "var(--bz-text-muted)" }}>Plan een gesprek met ons team.</div>
          </div>
          <Link className="btn btn-primary" href="/contact">Plan gesprek</Link>
        </div>
      </div>
    </section>
  );
}

/* 11) FINAL CTA */
function FinalCTA() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <div className="card" style={{ padding: "2rem", display: "grid", gap: ".5rem" }}>
          <h2 className="section-title">Klaar om te starten?</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            Probeer Bizora 30 dagen gratis. Verstuur je eerste factuur in 5 minuten.
          </p>
          <div><Link className="btn btn-primary" href="/register">Start gratis</Link></div>
        </div>
      </div>
    </section>
  );
}
