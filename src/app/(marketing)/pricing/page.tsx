export const metadata = {
  title: "Prijzen — Bizora",
  description:
    "Eerlijke prijzen. 30 dagen gratis proberen en daarna eenvoudig per maand opzegbaar.",
};

export default function PricingPage() {
  return (
    <>
      {/* NAV (same as home) */}
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="/">
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </a>
          <nav className="nav__links">
            <a href="/#features">Product</a>
            <a href="/#solutions">Oplossingen</a>
            <a className="nav-active" href="/pricing">
              Prijzen
            </a>
            <a href="/knowledge-base">Kennisbank</a>
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
            <h1 className="hero__title">Eerlijke prijzen</h1>
            <p className="hero__subtitle">
              30 dagen gratis — geen creditcard nodig. Daarna maandelijks opzegbaar.
            </p>
          </div>
        </section>

        {/* 2. Plan kaarten */}
        <section className="section">
          <div className="container grid grid--3">
            <div className="card price">
              <div className="price__name">Start</div>
              <div className="price__amount">€7<span>/mnd</span></div>
              <ul className="price__list">
                <li>Facturen &amp; Offertes</li>
                <li>BTW-overzicht</li>
                <li>Rapportages (basis)</li>
                <li>1 gebruiker</li>
                <li>1 GB opslag</li>
              </ul>
              <a className="btn btn--primary" href="/register?plan=start">Kies Start</a>
            </div>

            <div className="card price price--highlight">
              <div className="badge">Meest gekozen</div>
              <div className="price__name">Flow</div>
              <div className="price__amount">€16<span>/mnd</span></div>
              <ul className="price__list">
                <li>Alles uit Start</li>
                <li>Contractbeheer</li>
                <li>Rapportages (uitgebreid)</li>
                <li>3 gebruikers</li>
                <li>10 GB opslag</li>
              </ul>
              <a className="btn btn--primary" href="/register?plan=flow">Kies Flow</a>
            </div>

            <div className="card price">
              <div className="price__name">Pro</div>
              <div className="price__amount">€29<span>/mnd</span></div>
              <ul className="price__list">
                <li>Geavanceerde rapportages</li>
                <li>Integraties</li>
                <li>10 gebruikers</li>
                <li>50 GB opslag</li>
                <li>Prioriteit support</li>
              </ul>
              <a className="btn btn--primary" href="/register?plan=pro">Kies Pro</a>
            </div>
          </div>
          <p className="container center small" style={{ marginTop: 12 }}>
            Enterprise op maat — onbeperkt gebruikers, SSO en dedicated support.
            <br />
            <a className="btn btn--link" href="/contact">Plan een demo</a>
          </p>
        </section>

        {/* 3. Vergelijkingstabel */}
        <section className="section section--alt">
          <div className="container card" style={{ padding: 18 }}>
            <h2 className="h2">Vergelijk functies</h2>
            <table>
              <thead>
                <tr>
                  <th>Functie</th>
                  <th>Start</th>
                  <th>Flow</th>
                  <th>Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Facturen & Offertes", "✓", "✓", "✓"],
                  ["BTW-overzicht", "✓", "✓", "✓"],
                  ["Rapportages", "Basis", "Uitgebreid", "Geavanceerd"],
                  ["Contractbeheer", "—", "✓", "✓"],
                  ["Integraties", "—", "Basis", "Uitgebreid"],
                  ["Opslag", "1 GB", "10 GB", "50 GB"],
                  ["Gebruikers", "1", "3", "10"],
                  ["Support", "E-mail", "E-mail + Chat", "Priority"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Veelgestelde vragen (pricing) */}
        <section className="section">
          <div className="container">
            <h2 className="h2 center">FAQ over prijzen</h2>
            <div className="faq">
              <details className="faq__item">
                <summary>Hoe werkt de proefperiode?</summary>
                <p>Je krijgt 30 dagen volledige toegang. Daarna kies je een pakket of zeg je op.</p>
              </details>
              <details className="faq__item">
                <summary>Kan ik op elk moment upgraden/downgraden?</summary>
                <p>Ja, wijzigingen zijn direct zichtbaar en worden pro rata verrekend.</p>
              </details>
              <details className="faq__item">
                <summary>Zijn prijzen inclusief BTW?</summary>
                <p>Alle prijzen zijn exclusief BTW.</p>
              </details>
              <details className="faq__item">
                <summary>Hoe kan ik opzeggen?</summary>
                <p>In de app via Instellingen &rarr; Abonnement. Je data blijft exporteerbaar.</p>
              </details>
            </div>
          </div>
        </section>

        {/* 5. Trust strip */}
        <section className="strip">
          <div className="container strip__inner">
            <div className="strip__item">AVG-proof</div>
            <div className="strip__item">Dataportabiliteit</div>
            <div className="strip__item">99.9% uptime</div>
            <div className="strip__item">Nederlandse support</div>
            <div className="strip__item">Veilige back-ups</div>
          </div>
        </section>

        {/* 6. CTA */}
        <section className="cta">
          <div className="container cta__inner">
            <div>
              <h3>Klaar om te starten?</h3>
              <p>Activeer je proef en ervaar Bizora zelf.</p>
            </div>
            <a className="btn btn--primary" href="/register">Start gratis</a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
