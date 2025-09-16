export const metadata = {
  title: "Veelgestelde vragen — Bizora",
  description:
    "Antwoorden op veelgestelde vragen over Bizora: proef, prijzen, functies en data.",
};

export default function FAQPage() {
  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="/">
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </a>
          <nav className="nav__links">
            <a href="/#features">Product</a>
            <a href="/#solutions">Oplossingen</a>
            <a href="/pricing">Prijzen</a>
            <a className="nav-active" href="/faq">FAQ</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="nav__cta">
            <a className="btn btn--ghost" href="/login">Inloggen</a>
            <a className="btn btn--primary" href="/register">Start gratis</a>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hero */}
        <section className="hero">
          <div className="container">
            <h1 className="hero__title">Veelgestelde vragen</h1>
            <p className="hero__subtitle">Snel antwoord op de meest gestelde vragen.</p>
          </div>
        </section>

        {/* 2. FAQ secties (10+ items) */}
        <section className="section">
          <div className="container grid grid--3">
            {[
              ["Hoe werkt de proef?", "Je krijgt 30 dagen volledige toegang zonder verplichtingen."],
              ["Heb ik een creditcard nodig?", "Nee. Je kunt later pas betaalgegevens toevoegen."],
              ["Kan ik data exporteren?", "Ja, per module of volledige export (CSV/XLSX/PDF)."],
              ["Ondersteunen jullie 2FA?", "Ja. Je kunt 2FA verplicht stellen voor het team."],
              ["Hoe werkt herinneren?", "Standaard uit; per workspace instelbaar (schema’s)."],
              ["Zijn prijzen inclusief BTW?", "Nee, prijzen zijn exclusief BTW."],
              ["Hoe zeg ik op?", "Via Instellingen → Abonnement. Je data blijft toegankelijk (read-only) en exporteerbaar."],
              ["Welke rollen zijn er?", "Admin, Manager, Medewerker, Externe, Alleen Lezen."],
              ["Kan ik meerdere workspaces?", "Ja, je kunt er meerdere aanmaken en eenvoudig wisselen."],
              ["Wat met privacy?", "We volgen AVG, bieden verwerkersovereenkomst en audit logs."],
              ["Welke integraties?", "Basis in Flow; uitgebreid in Pro. Details volgen."],
              ["Back-ups?", "Dagelijks, met redundantie en versleuteling."],
            ].map(([q, a]) => (
              <details key={q} className="faq__item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 3. CTA */}
        <section className="cta">
          <div className="container cta__inner">
            <div>
              <h3>Meer weten?</h3>
              <p>Bekijk de kennisbank of stuur ons een bericht.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a className="btn btn--ghost" href="/knowledge-base">Kennisbank</a>
              <a className="btn btn--primary" href="/contact">Contact</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="brand__logo brand__logo--sm">B</div>
            <div className="brand__name">BIZORA</div>
            <p className="muted">© Bizora, alle rechten voorbehouden.</p>
          </div>
          <div>
            <div className="foot__title">Product</div>
            <a href="#">Facturen</a><a href="#">Offertes</a><a href="#">Uitgaven</a><a href="#">Rapportages</a>
          </div>
          <div>
            <div className="foot__title">Resources</div>
            <a href="/knowledge-base">Kennisbank</a><a href="/faq">FAQ</a><a href="#">Status</a><a href="/contact">Contact</a>
          </div>
          <div>
            <div className="foot__title">Juridisch</div>
            <a href="#">Privacy</a><a href="#">Voorwaarden</a><a href="#">Verwerkersovereenkomst</a>
          </div>
        </div>
      </footer>
    </>
  );
}
