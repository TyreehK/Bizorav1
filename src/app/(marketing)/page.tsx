export default function MarketingHome() {
  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="#">
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </a>
          <nav className="nav__links">
            <a href="#features">Product</a>
            <a href="#solutions">Oplossingen</a>
            <a href="#pricing">Prijzen</a>
            <a href="#kb">Kennisbank</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="nav__cta">
            <a className="btn btn--ghost" href="#login">Inloggen</a>
            <a className="btn btn--primary" href="#start">Start gratis</a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero__grid">
            <div>
              <h1 className="hero__title">Zakelijk boekhouden zonder ruis</h1>
              <p className="hero__subtitle">
                Facturen, offertes, uitgaven, BTW en rapportages in één moderne
                workflow. Gemaakt voor ondernemers die tijd willen winnen.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#start">
                  30 dagen gratis proberen
                </a>
                <a className="btn btn--link" href="#pricing">
                  Bekijk prijzen
                </a>
              </div>
              <div className="hero__trust">
                <span>★★★★★</span>
                <span>Vertrouwd door 4.800+ ondernemers</span>
              </div>
            </div>

            <div className="hero__visual card">
              {/* Minimalistische app preview (SVG) */}
              <svg viewBox="0 0 960 600" className="preview" aria-hidden="true">
                <rect x="0" y="0" width="960" height="600" rx="16" fill="#fff" />
                <rect x="24" y="20" width="140" height="24" rx="6" fill="#e8eefb" />
                <rect x="24" y="64" width="200" height="16" rx="4" fill="#eef2f7" />
                <rect x="24" y="96" width="160" height="16" rx="4" fill="#eef2f7" />
                {/* chart */}
                <rect x="260" y="60" width="660" height="220" rx="10" fill="#f7f9fd" stroke="#e8eefb" />
                <path d="M300 240 L420 160 L540 190 L660 120 L780 180 L900 100" stroke="#2563eb" strokeWidth="4" fill="none" />
                {/* table */}
                <rect x="260" y="310" width="660" height="220" rx="10" fill="#fff" stroke="#eaecef" />
                <rect x="280" y="332" width="220" height="16" rx="4" fill="#eef2f7" />
                <rect x="560" y="332" width="120" height="16" rx="4" fill="#eef2f7" />
                <rect x="720" y="332" width="160" height="16" rx="4" fill="#eef2f7" />
                <rect x="280" y="372" width="220" height="12" rx="4" fill="#f1f5f9" />
                <rect x="560" y="372" width="120" height="12" rx="4" fill="#f1f5f9" />
                <rect x="720" y="372" width="160" height="12" rx="4" fill="#f1f5f9" />
                <rect x="280" y="412" width="220" height="12" rx="4" fill="#f1f5f9" />
                <rect x="560" y="412" width="120" height="12" rx="4" fill="#f1f5f9" />
                <rect x="720" y="412" width="160" height="12" rx="4" fill="#f1f5f9" />
              </svg>
            </div>
          </div>
        </section>

        {/* USP STRIP */}
        <section className="strip">
          <div className="container strip__inner">
            <div className="strip__item">Snel facturen versturen</div>
            <div className="strip__item">BTW-overzicht per periode</div>
            <div className="strip__item">Herinneringen automatisch</div>
            <div className="strip__item">Export CSV/XLSX/PDF</div>
            <div className="strip__item">Veilig & AVG-proof</div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="section">
          <div className="container">
            <h2 className="h2 center">Alles wat je nodig hebt</h2>
            <p className="sub center">
              Van eerste offerte tot betaalde factuur — met inzicht in je cijfers.
            </p>

            <div className="grid grid--3">
              <div className="card feature">
                <div className="feature__icon">💸</div>
                <h3>Facturen &amp; Offertes</h3>
                <p>Maak professionele documenten met je eigen nummering en huisstijl.</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">📦</div>
                <h3>Uitgaven &amp; Inkoop</h3>
                <p>Leg bonnetjes vast, splitst BTW en voorkom dubbele invoer met OCR.</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">🧾</div>
                <h3>BTW &amp; Aangifte</h3>
                <p>Per maand/kwartaal overzichtelijk. Exporteer cijfers voor je boekhouder.</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">📈</div>
                <h3>Rapportages</h3>
                <p>KPI’s, omzet per klant/artikel en aging. Klik door naar brondata.</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">👥</div>
                <h3>Team &amp; Rollen</h3>
                <p>Werk samen met duidelijke rechten: Admin, Manager, Medewerker en meer.</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">🔐</div>
                <h3>Veiligheid</h3>
                <p>2FA, auditlog en dataportabiliteit. Jouw data blijft van jou.</p>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section id="solutions" className="section section--alt">
          <div className="container">
            <h2 className="h2 center">Zo werkt het in 3 stappen</h2>
            <div className="steps">
              <div className="step">
                <span className="step__num">1</span>
                <h4>Start je proef</h4>
                <p>Maak een account aan en kies je subdomein. Klaar in 2 minuten.</p>
              </div>
              <div className="step">
                <span className="step__num">2</span>
                <h4>Stel je basis in</h4>
                <p>Logo, kleuren, BTW-tarieven en nummering. Alles onder Instellingen.</p>
              </div>
              <div className="step">
                <span className="step__num">3</span>
                <h4>Verstuur je eerste factuur</h4>
                <p>Gebruik artikelen of uren. Herinneringen gaan automatisch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="section">
          <div className="container">
            <h2 className="h2 center">Eerlijke prijzen</h2>
            <p className="sub center">30 dagen gratis, daarna eenvoudig per maand opzegbaar.</p>

            <div className="grid grid--3">
              <div className="card price">
                <div className="price__name">Start</div>
                <div className="price__amount">€7<span>/mnd</span></div>
                <ul className="price__list">
                  <li>Facturen &amp; Offertes</li>
                  <li>BTW-overzicht</li>
                  <li>1 gebruiker</li>
                  <li>1 GB opslag</li>
                </ul>
                <a className="btn btn--primary" href="#start">Start gratis</a>
              </div>

              <div className="card price price--highlight">
                <div className="badge">Meest gekozen</div>
                <div className="price__name">Flow</div>
                <div className="price__amount">€16<span>/mnd</span></div>
                <ul className="price__list">
                  <li>Alles uit Start</li>
                  <li>Contractbeheer</li>
                  <li>3 gebruikers</li>
                  <li>10 GB opslag</li>
                </ul>
                <a className="btn btn--primary" href="#start">Kies Flow</a>
              </div>

              <div className="card price">
                <div className="price__name">Pro</div>
                <div className="price__amount">€29<span>/mnd</span></div>
                <ul className="price__list">
                  <li>Uitgebreide rapportages</li>
                  <li>Integraties</li>
                  <li>10 gebruikers</li>
                  <li>50 GB opslag</li>
                </ul>
                <a className="btn btn--primary" href="#start">Kies Pro</a>
              </div>
            </div>

            <p className="center small">Enterprise op maat — neem contact op voor prijzen en SLA’s.</p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section section--alt">
          <div className="container">
            <h2 className="h2 center">Wat klanten zeggen</h2>
            <div className="grid grid--3">
              <blockquote className="card quote">
                <p>“Binnen een dag hadden we grip op onze openstaande posten.”</p>
                <footer>— Lisa, Studio 9</footer>
              </blockquote>
              <blockquote className="card quote">
                <p>“Herinneringen lopen automatisch. Dat scheelt echt tijd.”</p>
                <footer>— Rachid, Installatiebedrijf</footer>
              </blockquote>
              <blockquote className="card quote">
                <p>“Rapportages zijn helder en export werkt perfect voor mijn boekhouder.”</p>
                <footer>— Femke, Bureau</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* FAQ PREVIEW */}
        <section id="kb" className="section">
          <div className="container">
            <h2 className="h2 center">Veelgestelde vragen</h2>
            <div className="faq">
              <details className="faq__item">
                <summary>Hoe werkt de proefperiode?</summary>
                <p>Je krijgt 30 dagen volledige toegang. Daarna kies je een pakket of zeg je op.</p>
              </details>
              <details className="faq__item">
                <summary>Kan ik later upgraden of downgraden?</summary>
                <p>Ja, je kunt je plan op elk moment wijzigen. Wij verwerken dat pro rata.</p>
              </details>
              <details className="faq__item">
                <summary>Kan ik mijn data exporteren?</summary>
                <p>Altijd. CSV/XLSX/PDF per module of volledige export.</p>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta">
          <div className="container cta__inner">
            <div>
              <h3>Klaar om te beginnen?</h3>
              <p>Maak een account aan en verstuur je eerste factuur in 5 minuten.</p>
            </div>
            <a className="btn btn--primary" href="#start">Start gratis</a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="brand__logo brand__logo--sm">B</div>
            <div className="brand__name">BIZORA</div>
            <p className="muted">© Bizora, alle rechten voorbehouden.</p>
          </div>
          <div>
            <div className="foot__title">Product</div>
            <a href="#">Facturen</a>
            <a href="#">Offertes</a>
            <a href="#">Uitgaven</a>
            <a href="#">Rapportages</a>
          </div>
          <div>
            <div className="foot__title">Resources</div>
            <a href="#">Kennisbank</a>
            <a href="#">FAQ</a>
            <a href="#">Status</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <div className="foot__title">Juridisch</div>
            <a href="#">Privacy</a>
            <a href="#">Voorwaarden</a>
            <a href="#">Verwerkersovereenkomst</a>
          </div>
        </div>
      </footer>
    </>
  );
}
