"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <Hero />
      <ContactGrid />
      <Offices />
      <SupportChannels />
      <SalesCTA />
      <MapSection />
      <TrustRow />
      <FAQTeaser />
      <Compliance />
      <FooterCTA />
    </>
  );
}

/* 1) HERO */
function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", display: "grid", gap: "1rem" }}>
        <span className="pill" style={{ marginInline: "auto" }}>We reageren doorgaans binnen 1 werkdag</span>
        <h1 className="section-title" style={{ marginInline: "auto" }}>Contact met Bizora</h1>
        <p className="section-subtitle" style={{ marginInline: "auto" }}>
          Support, sales of algemene vragen? Wij helpen je graag verder.
        </p>
      </div>
    </section>
  );
}

/* 2) CONTACT GRID (Form + details) */
function ContactGrid() {
  return (
    <section>
      <div className="container" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "2fr 1fr" }}>
        <ContactForm />
        <ContactDetails />
      </div>
    </section>
  );
}

/* 2a) CONTACT FORM */
function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="card"
      style={{ padding: "1.25rem", display: "grid", gap: ".9rem" }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Stuur ons een bericht</div>
        <div style={{ color: "var(--bz-text-muted)" }}>We antwoorden per e-mail.</div>
      </div>

      <div>
        <label>Naam</label>
        <input placeholder="Voor- en achternaam" required />
      </div>
      <div>
        <label>E-mail</label>
        <input type="email" placeholder="naam@bedrijf.nl" required />
      </div>
      <div>
        <label>Onderwerp</label>
        <input placeholder="Waarmee kunnen we helpen?" required />
      </div>
      <div>
        <label>Bericht</label>
        <textarea rows={6} placeholder="Beschrijf je vraag of idee" required />
      </div>

      <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
        <button className="btn btn-primary" type="submit">Verzend</button>
        {sent && <span style={{ color: "var(--bz-text-muted)" }}>✅ Bericht verzonden (demo)</span>}
      </div>

      <div style={{ fontSize: ".9rem", color: "var(--bz-text-muted)" }}>
        Door te verzenden ga je akkoord met onze <a className="underline" href="#">Privacyverklaring</a>.
      </div>
    </form>
  );
}

/* 2b) CONTACT DETAILS */
function ContactDetails() {
  return (
    <aside className="card" style={{ padding: "1.25rem", display: "grid", gap: ".9rem" }}>
      <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Direct contact</div>
      <DetailItem label="Support" value="support@bizora.nl" />
      <DetailItem label="Sales" value="sales@bizora.nl" />
      <DetailItem label="Telefoon" value="+31 20 123 45 67" />
      <DetailItem label="KvK" value="12345678" />
      <DetailItem label="BTW" value="NL001234567B01" />
      <div style={{ display: "grid", gap: ".5rem", marginTop: ".25rem" }}>
        <Link className="btn btn-secondary" href="/faq">Naar de FAQ</Link>
        <Link className="btn btn-outline" href="/knowledge-base">Kennisbank</Link>
      </div>
    </aside>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
      <div style={{ color: "var(--bz-text-muted)" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* 3) OFFICES */
function Offices() {
  const offices = [
    { city: "Amsterdam", addr: "Prinsengracht 100, 1015 DZ", email: "ams@bizora.nl" },
    { city: "Rotterdam", addr: "Coolsingel 10, 3011 AD", email: "rtm@bizora.nl" },
    { city: "Utrecht", addr: "Vredenburg 1, 3511 BA", email: "ut@bizora.nl" },
  ];
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 className="section-title">Onze kantoren</h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3,1fr)" }}>
          {offices.map((o) => (
            <div key={o.city} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{o.city}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{o.addr}</div>
              <div style={{ marginTop: ".35rem" }}>
                <a className="btn btn-outline" href={`mailto:${o.email}`}>Mail {o.city}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4) SUPPORT CHANNELS */
function SupportChannels() {
  const channels = [
    { t: "E-mail support", d: "Binnen 1 werkdag reactie", c: "support@bizora.nl" },
    { t: "Chat", d: "Tijdens kantooruren", c: "Start chat" },
    { t: "Kennisbank", d: "Handleidingen en tips", c: "Open kennisbank" },
  ];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {channels.map((ch) => (
            <div key={ch.t} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{ch.t}</div>
              <div style={{ color: "var(--bz-text-muted)" }}>{ch.d}</div>
              <div style={{ marginTop: ".5rem" }}>
                <a className="btn btn-outline" href="#">{ch.c}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5) SALES CTA */
function SalesCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: "1.25rem", display: "grid", gap: ".5rem", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Een demo voor je team?</div>
            <div style={{ color: "var(--bz-text-muted)" }}>Plan een gesprek met onze productspecialist.</div>
          </div>
          <Link className="btn btn-primary" href="/contact">Plan een demo</Link>
        </div>
      </div>
    </section>
  );
}

/* 6) MAP SECTION (placeholder) */
function MapSection() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ height: 320, display: "grid", placeItems: "center" }}>
          <div style={{ color: "var(--bz-text-muted)" }}>📍 Kaart placeholder (Google Maps / Leaflet integratie later)</div>
        </div>
      </div>
    </section>
  );
}

/* 7) TRUST ROW */
function TrustRow() {
  const items = ["Snelle support", "Heldere documentatie", "Privacy-by-design", "99.9% uptime"];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", padding: "1rem" }}>
          {items.map((t) => (
            <div key={t} className="card" style={{ padding: ".9rem", textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "var(--bz-primary)" }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8) FAQ TEASER */
function FAQTeaser() {
  const faqs = [
    { q: "Hoe snel krijg ik antwoord?", a: "Doorgaans binnen 1 werkdag." },
    { q: "Is er telefonische support?", a: "Voor Pro/Enterprise bieden we terugbelverzoeken." },
    { q: "Helpen jullie met onboarding?", a: "Ja, zeker voor teams en complexere flows." },
  ];
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 className="section-title">Veelgestelde vragen</h2>
        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem" }}>
          {faqs.map((f) => (
            <details key={f.q} className="card" style={{ padding: ".9rem 1rem" }}>
              <summary style={{ fontWeight: 700, color: "var(--bz-primary)" }}>{f.q}</summary>
              <div style={{ color: "var(--bz-text-muted)", marginTop: ".5rem" }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9) COMPLIANCE */
function Compliance() {
  const items = [
    { t: "AVG / GDPR", d: "Verwerkersovereenkomst beschikbaar" },
    { t: "Beveiliging", d: "2FA optioneel, audit logs" },
    { t: "Dataportabiliteit", d: "CSV/XLSX/PDF export" },
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

/* 10) FOOTER CTA */
function FooterCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "2rem", display: "grid", gap: ".5rem" }}>
          <h2 className="section-title">Nog vragen? We staan klaar.</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            Stuur ons een bericht of plan direct een demo.
          </p>
          <div>
            <Link className="btn btn-primary" href="/contact">Neem contact op</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
