export const metadata = {
  title: "Over ons — Bizora",
  description:
    "Lees hoe Bizora ondernemers helpt met modern, helder en veilig boekhouden.",
};

export default function AboutPage() {
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
            <a href="/knowledge-base">Kennisbank</a>
            <a className="nav-active" href="/about">Over ons</a>
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
            <h1 className="hero__title">Over Bizora</h1>
            <p className="hero__subtitle">
              We bouwen software die ondernemers tijd teruggeeft.
            </p>
          </div>
        </section>

        {/* 2. Missie/visie */}
        <section className="section">
          <div className="container grid grid--3">
            <div className="card feature">
              <div className="feature__icon">🎯</div>
              <h3>Missie</h3>
              <p>Ruimte creëren voor ondernemen door boekhouden radicaal eenvoudiger te maken.</p>
            </div>
            <div className="card feature">
              <div className="feature__icon">🔭</div>
              <h3>Visie</h3>
              <p>Een platform waar facturen, BTW en rapportages naadloos samenkomen.</p>
            </div>
            <div className="card feature">
              <div className="feature__icon">💙</div>
              <h3>Waarden</h3>
              <p>Helder, betrouwbaar en menselijk. Geen lock-in. Jouw data is van jou.</p>
            </div>
          </div>
        </section>

        {/* 3. Tijdlijn (statisch) */}
        <section className="section section--alt">
          <div className="container card" style={{ padding: 18 }}>
            <h2 className="h2">Tijdlijn</h2>
            <div className="grid grid--3">
              <div className="feature">
                <h4>2023</h4>
                <p className="muted">Concept en eerste validatie met ondernemers.</p>
              </div>
              <div className="feature">
                <h4>2024</h4>
                <p className="muted">MVP met facturen, BTW en rapportages.</p>
              </div>
              <div className="feature">
                <h4>2025</h4>
                <p className="muted">Public beta en uitbreidingen naar projecten en taken.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Team (placeholders) */}
        <section className="section">
          <div className="container">
            <h2 className="h2 center">Team</h2>
            <div className="grid grid--3">
              {["A.", "B.", "C."].map((i) => (
                <div key={i} className="card feature">
                  <div className="feature__icon">👤</div>
                  <h3>Teamlid {i}</h3>
                  <p className="muted">Product &amp; Engineering</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Principes */}
        <section className="section section--alt">
          <div className="container grid grid--3">
            <div className="card feature">
              <div className="feature__icon">🔐</div>
              <h3>Privacy-by-design</h3>
              <p>Minimale data, versleuteling, duidelijke audit trail.</p>
            </div>
            <div className="card feature">
              <div className="feature__icon">🧭</div>
              <h3>Transparant</h3>
              <p>Heldere prijzen en duidelijke communicatie.</p>
            </div>
            <div className="card feature">
              <div className="feature__icon">⚡</div>
              <h3>Prestatie</h3>
              <p>Snelle UI met caching en slimme lijsten.</p>
            </div>
          </div>
        </section>

        {/* 6. CTA */}
        <section className="cta">
          <div className="container cta__inner">
            <div>
              <h3>Meebouwen aan Bizora?</h3>
              <p>We horen graag van je.</p>
            </div>
            <a className="btn btn--primary" href="/contact">Neem contact op</a>
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
